import { expect, test } from "@playwright/test";

test("public routes render only public chrome", async ({ page }) => {
  await page.goto("/about");

  await expect(page.getByRole("link", { name: "ArcadeGhosts home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open Control Room" })).toBeVisible();
  await expect(page.getByRole("contentinfo", { name: "Public site footer" })).toBeVisible();
  await expect(page.locator(".page-home-link")).toHaveCount(0);
});

test("admin routes render only admin chrome", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByRole("link", { name: "Back Home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ArcadeGhosts home" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Open Control Room" })).toHaveCount(0);
  await expect(page.getByRole("contentinfo", { name: "Public site footer" })).toHaveCount(0);
});

test("Ambient owns its document mode and releases it on public navigation", async ({ page }) => {
  await page.goto("/ambient?type=cat");

  await expect(page.locator(".site-logo, .control-room-link, .page-home-link, .site-footer")).toHaveCount(0);
  await expect(page.locator("body")).toHaveClass(/ambient-mode/);

  await page.goto("/about");

  await expect(page.locator("body")).not.toHaveClass(/ambient-mode/);
  await expect(page.getByRole("link", { name: "ArcadeGhosts home" })).toBeVisible();
  await expect(page.getByRole("contentinfo", { name: "Public site footer" })).toBeVisible();
});
