import { readFileSync } from "fs";
import { Page } from "@playwright/test";

export const init = async (page: Page) => {
  const options = JSON.stringify({
    privateKey: process.env.E2E_WALLET_PRIVATE_KEY,
    rpcUrl: process.env.E2E_PROVIDER_RPC_URL,
    chainId: process.env.E2E_PROVIDER_CHAIN_ID,
  });

  await page.addInitScript(`
    {
      ${readFileSync(
        require.resolve("./dist/window-ethereum.umd.js"),
        "utf-8"
      )};
      WEB3.init(${options});
    }
 `);
};
