import { test, expect } from "@playwright/test";

test.describe("Critical path: Home and Discover", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.locator("main")).toBeVisible({ timeout: 10000 });
  });

  test("navigate from home to discover", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Discover" }).first().click();
    await expect(page).toHaveURL(/\/discover/);
    await expect(page.locator("main")).toBeVisible({ timeout: 5000 });
  });

  test("discover page loads directly", async ({ page }) => {
    await page.goto("/discover");
    await expect(page).toHaveURL(/\/discover/);
    await expect(page.locator("main")).toBeVisible({ timeout: 10000 });
  });
});
