# playwright-web3-provider

A little provider util for runnign E2E tests with playwright

## Quickstart

```
npm install --save-dev playwright-web3-provider
```

And use it on your tests

```ts
import { test, expect } from "@playwright/test";
import * as Web3Provider from "playwright-web3-provider";

test("Connected wallet", async ({ page }) => {
  // Initialize playwright-web3-provider
  await Web3Provider.init(page, {
    privateKey,
    rpcUrl,
    chainId,
  });

  await page.goto("http://localhost:3000/");
  const account = page.locator("[data-test=account]");
  const address = account.locator("[data-test=account-address]");
  const balance = account.locator("[data-test=account-balance]");

  await expect(account).toBeVisible();
  await expect(address).toContainText("Address: 0xf39Fd6e51");
  await expect(balance).toContainText("Balance: 10000.0 ETH");
});
```

## Environment variables

playwright-web3-provider support the following environment variables.
Below an example to run it on a local [hardhat node](https://hardhat.org/hardhat-network/docs/reference#initial-state)

```env
E2E_WALLET_PRIVATE_KEY = 0xac0974bec39a17e36ba...
E2E_PROVIDER_RPC_URL   = http://127.0.0.1:8545
E2E_PROVIDER_CHAIN_ID  = 31337
```

Notes

- `E2E_WALLET_PRIVATE_KEY`: optionnal - if omitted playwright-web3-provider will create a random wallet instead.
- `E2E_PROVIDER_RPC_URL`: optional - if omitted default to `http://127.0.0.1:8545` as per [JsonRpcProvider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcProvider)
- `E2E_PROVIDER_CHAIN_ID`: optional

Make sure you enable dotenv in your `playwright.config`

```ts
import dotenv from "dotenv";
dotenv.config();
```

And then you can inizialize the provider as usual withou having to pass configuration to it. Each explicit option passed will override the related environment variable value.

```ts
import { test, expect } from "@playwright/test";
import * as Web3Provider from "playwright-web3-provider";

test("test wallet connected", async ({ page }) => {
  // Initialize playwright-web3-provider
  await Web3Provider.init(page);

  await page.goto("http://localhost:3000/");
  const account = page.locator("[data-test=account]");
  const address = account.locator("[data-test=account-address]");
  const balance = account.locator("[data-test=account-balance]");

  await expect(account).toBeVisible();
  await expect(address).toContainText("Address: 0xf39Fd6e51");
  await expect(balance).toContainText("Balance: 10000.0 ETH");
});
```

You can find more infor about using env variable on the [playwright docs](https://playwright.dev/docs/test-parameterize#passing-environment-variables)
