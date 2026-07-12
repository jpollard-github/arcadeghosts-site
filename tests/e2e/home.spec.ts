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
  await expect(page.locator("#projects")).toHaveCount(0);
  await expect(mainNav.getByRole("link", { name: "Projects" })).toHaveCount(0);
  await expect(page.locator('footer a[href="/#projects"]')).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Open GitHub repository" }),
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
  await expect(page.locator("main > section").nth(1)).toHaveAttribute("id", "writing");
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
