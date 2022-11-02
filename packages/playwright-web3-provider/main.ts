import { readFileSync } from "fs";
import { Page } from "@playwright/test";
import { resolve } from "path";

type Web3ProviderOptions = {
  privateKey?: string;
  rpcUrl?: string;
  chainId?: string;
};

export const init = async (page: Page, opts?: Web3ProviderOptions) => {
  const options = JSON.stringify({
    privateKey: opts?.privateKey ?? process.env.E2E_WALLET_PRIVATE_KEY,
    rpcUrl: opts?.rpcUrl ?? process.env.E2E_PROVIDER_RPC_URL,
    chainId: opts?.chainId ?? process.env.E2E_PROVIDER_CHAIN_ID,
  });

  await page.addInitScript(`
    {
      ${readFileSync(
        resolve(__dirname, "dist/window-ethereum.umd.js"),
        "utf-8"
      )};
      WEB3.init(${options});
    }
 `);
};
