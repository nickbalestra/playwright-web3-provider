import { Eip1193Bridge } from "@ethersproject/experimental/lib/eip1193-bridge";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";

import { extractArgs, injectBridge, injectSetup } from "./utils";

export type E2ESetup = {
  privateKey?: string;
  rpcUrl?: string;
  chainId?: string;
};

const E2E_SETUP = ({ privateKey, rpcUrl, chainId }: E2ESetup) => {
  const E2E_PROVIDER = new JsonRpcProvider(rpcUrl, chainId);
  const E2E_WALLET = privateKey
    ? new Wallet(privateKey, E2E_PROVIDER)
    : Wallet.createRandom().connect(E2E_PROVIDER);

  class Bridge extends Eip1193Bridge {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async sendAsync(...args: Array<any>) {
      console.debug("sendAsync called", ...args);
      return this.send(...args);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async send(...args: Array<any>) {
      console.debug("send called", ...args);
      const { callback, method, params } = extractArgs(args);

      if (method === "eth_requestAccounts" || method === "eth_accounts") {
        if (callback) {
          callback({ result: [E2E_WALLET.address] });
        } else {
          return Promise.resolve([E2E_WALLET.address]);
        }
      }
      if (method === "eth_chainId") {
        if (callback) {
          callback(null, { result: E2E_PROVIDER.network.chainId });
        } else {
          return Promise.resolve(E2E_PROVIDER.network.chainId);
        }
      }
      // EIP-3326
      if (method === "wallet_switchEthereumChain") {
        this.emit("chainChanged", params[0].chainId);
        if (callback) {
          callback(null);
        } else {
          return Promise.resolve(null);
        }
      }

      try {
        const result = await super.send(method, params);
        console.debug("result received", method, params, result);
        if (callback) {
          callback(null, { result });
        } else {
          return result;
        }
      } catch (error) {
        if (callback) {
          callback(error, null);
        } else {
          throw error;
        }
      }
    }
  }
  injectBridge(new Bridge(E2E_WALLET, E2E_PROVIDER));
};
injectSetup(E2E_SETUP);
