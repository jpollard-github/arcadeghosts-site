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
  const about = page.locator("#about");
  await expect(about).toBeVisible();
  await expect(about.getByText("I'm Jason. I'm a professional software developer and I made this site for fun. Feel free to explore and provide feedback.")).toBeVisible();
  await expect(about.getByText("I live in the Triad area of North Carolina. I have two cats, Beverly and Lucinda; you can see their pictures here. Have a great day!")).toBeVisible();
  await expect(about.getByRole("link", { name: "provide feedback" })).toHaveAttribute(
    "href",
    "mailto:jason@arcadeghosts.org",
  );
  await expect(about.getByRole("link", { name: "here" })).toHaveAttribute(
    "href",
    "/cats/beverly-and-lucinda",
  );
  await expect(about.getByRole("heading")).toHaveCount(0);
  await expect(about.getByRole("link", { name: "Read the full About room" })).toHaveCount(0);
  await expect(about.locator(".section-link-card")).toHaveCount(0);
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
