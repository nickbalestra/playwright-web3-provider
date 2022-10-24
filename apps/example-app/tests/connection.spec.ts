import { test, expect } from "@playwright/test";
import * as Web3Provider from "playwright-web3-provider";

test("test wallet not connected", async ({ page }) => {
  // Wallet should not be connected
  await page.goto("http://localhost:3000/");

  // Account section should not be visible
  const account = page.locator("[data-test=account]");
  await expect(account).not.toBeVisible();
});

test("test wallet connected", async ({ page }) => {
  // Initialize playwright-web3-provider
  await Web3Provider.init(page);
  // Wallet should now be connected
  await page.goto("http://localhost:3000/");

  // Account section should be visible
  const account = page.locator("[data-test=account]");
  await expect(account).toBeVisible();
  await expect(account.locator("[data-test=account-address]")).toContainText(
    "Address: 0x"
  );
  await expect(account.locator("[data-test=account-balance]")).toContainText(
    "Balance: "
  );
});
