# 🎭 playwright-web3-provider

A little provider util for runnign E2E tests with [playwright](https://playwright.dev/)

## Quickstart

**Step 1: Install**

```
npm install --save-dev playwright-web3-provider
```

**Step 2: Import and initialize** in your tests/fixtures

```ts
import { test, expect } from "@playwright/test";
import * as Web3Provider from "playwright-web3-provider";

test("Connected wallet", async ({ page }) => {
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

**Step 3: Done**, there is no step 3 - just write tests.

## Options

The init function accept a second argument for options:

```ts
await Web3Provider.init(page, options);
```

- `privateKey`? : string | If omitted playwright-web3-provider will create a [random wallet](https://docs.ethers.io/v5/api/signer/#Wallet-createRandom) instead
- `rpcUrl`? : string | if omitted default to `http://127.0.0.1:8545` as per [JsonRpcProvider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcProvider)
- `chainId`? : string

---

## Environment variables

playwright-web3-provider support the following environment variables.
Below an example to run it on a local [hardhat node](https://hardhat.org/hardhat-network/docs/reference#initial-state)

```env
E2E_WALLET_PRIVATE_KEY = 0xac0974bec39a17e36ba...
E2E_PROVIDER_RPC_URL   = http://127.0.0.1:8545
E2E_PROVIDER_CHAIN_ID  = 31337
```

Make sure you enable dotenv in your `playwright.config`

```ts
import dotenv from "dotenv";
dotenv.config();
```

And then you can inizialize the provider as usual withou having to pass configuration to it. Each explicit option passed to the initialize function will override its related environment variable's value.

```ts
import { test, expect } from "@playwright/test";
import * as Web3Provider from "playwright-web3-provider";

test("test wallet connected", async ({ page }) => {
  // Initialize playwright-web3-provider
  await Web3Provider.init(page, {
    privateKey: "0x123", // This override env E2E_WALLET_PRIVATE_KEY
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

You can find more infor about using env variable on the [playwright docs](https://playwright.dev/docs/test-parameterize#passing-environment-variables)

---

## Running example tests included in this repo

From the root

```
$ npm install && npm test
```

Alternative you can start dev from the root

```
$ npm run dev
```

and manually run tests from within the [playwright VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension or via cli:

```
$ npx playwright test
```

Playwright screenshots from the included tests (via the included `env.example`)

| Provider not initialized                                                                                                                     | Provider initialized                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Screen Shot 2022-10-24 at 1 38 32 PM](https://user-images.githubusercontent.com/389705/197625105-870abb65-65fd-429f-b6d4-cae77970aa5a.png) | ![Screen Shot 2022-10-24 at 1 38 22 PM](https://user-images.githubusercontent.com/389705/197625132-f67a29e1-b128-402c-9857-dd82696dd340.png) |

**Note**: make sure to correctly setup `.env` (in `apps/example-app`) before running the tests. (you can rename the included `env.example` to get up and running)
