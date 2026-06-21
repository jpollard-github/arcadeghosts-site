import { expect, test } from "@playwright/test";

test("music page renders curated listening content", async ({ page }) => {
  await page.goto("/music");

  await expect(
    page.getByRole("heading", { name: "Songs for fluorescent weather." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "A listening time machine with five illuminated buttons.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Years, months, and a few loud spikes in the archive.",
    }),
  ).toBeVisible();
});

test("work-with-me page exposes contact and examples", async ({ page }) => {
  await page.goto("/work-with-me");

  await expect(
    page.getByRole("heading", {
      name: "Small projects. Clear problems. Personal attention.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "A few things that reflect how I build.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Email Jason" }),
  ).toBeVisible();
});

test("arcade page renders cabinet favorites", async ({ page }) => {
  await page.goto("/arcade");

  await expect(
    page.getByRole("heading", { name: "Quarter-light favorites." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back Home" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Galaga" }),
  ).toBeVisible();
});

test("movies and tv page renders the media grid", async ({ page }) => {
  await page.goto("/movies-tv");

  await expect(
    page.getByRole("heading", { name: "Movies & TV Shows." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back Home" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Twin Peaks Season 1" }),
  ).toBeVisible();
});

test("custom 404 page renders surreal copy", async ({ page }) => {
  await page.goto("/error-preview/not-found");

  await expect(
    page.getByRole("heading", {
      name: "The page you are looking for is not what it seems.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Return To The Lodge" }),
  ).toBeVisible();
});

test("custom 500 page renders surreal copy", async ({ page }) => {
  await page.goto("/error-preview/server-error");

  await expect(
    page.getByRole("heading", {
      name: "There was a fish in the percolator.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Try Again" }),
  ).toBeVisible();
});
