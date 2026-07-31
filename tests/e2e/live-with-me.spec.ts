import { expect, test } from "@playwright/test";

const retiredPath = "/live-with-me";

test("the retired path is indistinguishable from an unknown URL", async ({
  page,
}) => {
  const response = await page.goto(retiredPath);

  expect(response?.status()).toBe(404);
  await expect(page.getByText("404", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "The page you are looking for is not what it seems.",
    }),
  ).toBeVisible();
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]'),
  ).toHaveCount(1);

  await expect(
    page.getByRole("heading", { name: "Live with me." }),
  ).toHaveCount(0);
  await expect(
    page.locator('link[rel="canonical"][href*="live-with-me"]'),
  ).toHaveCount(0);
  await expect(
    page.locator('meta[property="og:title"][content*="Live With Me"]'),
  ).toHaveCount(0);
  await expect(
    page.locator('meta[property="og:image"][content*="live-with-me"]'),
  ).toHaveCount(0);
  await expect(page.getByText("Send me a note", { exact: true })).toHaveCount(0);
});

test("former metadata and portrait URLs are no longer public", async ({
  request,
}) => {
  for (const path of [
    `${retiredPath}/opengraph-image`,
    "/images/live-with-me/jason.webp",
    "/images/live-with-me/jason.png",
  ]) {
    const response = await request.get(path);
    expect(response.status(), `${path} should return 404`).toBe(404);
  }
});

test("public navigation, sitemap, and robots do not disclose the retired path", async ({
  page,
  request,
}) => {
  for (const path of ["/", "/arcade"]) {
    await page.goto(path);
    await expect(page.locator(`a[href*="${retiredPath}"]`)).toHaveCount(0);
  }

  const [sitemap, robots] = await Promise.all([
    request.get("/sitemap.xml"),
    request.get("/robots.txt"),
  ]);

  expect(sitemap.ok()).toBeTruthy();
  expect(robots.ok()).toBeTruthy();
  expect(await sitemap.text()).not.toContain(retiredPath);
  expect(await robots.text()).not.toContain(retiredPath);
});
