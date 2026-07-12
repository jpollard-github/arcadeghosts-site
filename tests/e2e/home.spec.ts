import { expect, test } from "@playwright/test";

test("homepage renders the hero and key sections", async ({ page }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });

  await expect(
    page.getByRole("heading", {
      name: "A personal signal from the neon woods.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("It's a place for things I make, things I love, and the strange connections between them."),
  ).toBeVisible();
  await expect(
    mainNav.locator('a[href="#screening"]'),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Shipped, active, paused, and becoming.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Games, rooms, and playable static.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Who I am and how I think.",
    }),
  ).toBeVisible();
  await expect(mainNav.locator('a[href="#start-here"]')).toHaveCount(0);
  await expect(page.locator("#start-here")).toHaveCount(0);
  await expect(page.locator("main > section").nth(0)).toHaveClass(/hero/);
  await expect(page.locator("main > section").nth(1)).toHaveAttribute("id", "projects");
  await expect(page.getByText("80s Dev Terminal")).toHaveCount(0);
});

test("homepage navigation reaches the screening section", async ({ page }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });

  await mainNav.locator('a[href="#screening"]').click();

  await expect(page).toHaveURL(/#screening$/);
  await expect(
    page.getByRole("heading", {
      name: "A few screen stories still glowing in the lobby.",
    }),
  ).toBeVisible();
});
