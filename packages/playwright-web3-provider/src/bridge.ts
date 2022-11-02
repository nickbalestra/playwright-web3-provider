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
  const E2E_PROVIDER = new JsonRpcProvider(
    rpcUrl,
    chainId ? Number(chainId) : undefined
  );
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

      try {
        // If from is present on eth_call it errors, removing it makes the library set
        // from as the connected wallet which works fine
        if (
          params &&
          params.length &&
          params[0].from &&
          method === "eth_call"
        ) {
          delete params[0].from;
        }
        let result;
        // For sending a transaction if we call send it will error
        // as it wants gasLimit in sendTransaction but hexlify sets the property gas
        // to gasLimit which makes sensd transaction error.
        // This have taken the code from the super method for sendTransaction and altered
        // it slightly to make it work with the gas limit issues.
        if (
          params &&
          params.length &&
          params[0].from &&
          method === "eth_sendTransaction"
        ) {
          // Hexlify will not take gas, must be gasLimit, set this property to be gasLimit
          params[0].gasLimit = params[0].gas;
          delete params[0].gas;
          // If from is present on eth_sendTransaction it errors, removing it makes the library set
          // from as the connected wallet which works fine
          delete params[0].from;
          const req = JsonRpcProvider.hexlifyTransaction(params[0]);
          // Hexlify sets the gasLimit property to be gas again and send transaction requires gasLimit
          req.gasLimit = req.gas;
          delete req.gas;
          // Send the transaction
          const tx = await this.signer.sendTransaction(req);
          result = tx.hash;
        } else {
          // All other transactions the base class works for
          result = await super.send(method, params);
        }

        console.debug("result received", method, params, result);
        if (callback) {
          callback(null, { result });
        } else {
          return result;
        }
      } catch (error) {
        console.log(error);
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
