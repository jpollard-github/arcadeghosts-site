import { expect, test } from "@playwright/test";

test("homepage renders the hero and key sections", async ({ page }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });

  await expect(
    page.getByText("A personal site for writing, cats, software, music, and finding the right people."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "A signal flare for curious people.",
    }),
  ).toBeVisible();
  await expect(
    mainNav.locator('a[href="#screening"]'),
  ).toBeVisible();
  await expect(
    mainNav.getByRole("link", { name: "Work With Me", exact: true }),
  ).toHaveCount(0);
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
  await expect(
    page.getByRole("link", { name: "Start Here", exact: true }).first(),
    ).toHaveAttribute("href", "#start-here");
  await expect(
    page.getByRole("link", { name: "Read the Writing", exact: true }),
  ).toHaveAttribute("href", "/writings");
  await expect(
    page.getByRole("link", { name: "Say Hello", exact: true }),
  ).toHaveAttribute("href", "mailto:jason@arcadeghosts.org");
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
