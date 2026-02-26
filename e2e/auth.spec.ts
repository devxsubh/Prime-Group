import { test, expect } from "@playwright/test";

test.describe("Sign-in", () => {
  test("shows error when submitting invalid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible({ timeout: 10000 });

    await page.getByPlaceholder("Email").fill("invalid@example.com");
    await page.getByPlaceholder("Password").fill("short");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText(/password|invalid|error/i)).toBeVisible({ timeout: 5000 });
  });

  test("forgot password link goes to forgot-password page", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByRole("link", { name: /forgot password/i }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(page.getByRole("heading", { name: /forgot password/i })).toBeVisible({ timeout: 5000 });
  });
});
