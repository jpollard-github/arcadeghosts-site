import { expect, test } from "@playwright/test";

const expectedMailto =
  "mailto:jason@arcadeghosts.org?subject=Live%20with%20me";

test("the live-with-me page renders the approved signal and contact path", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("requestfailed", (request) => {
    failedRequests.push(
      `${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`,
    );
  });

  await page.goto("/live-with-me");

  await expect(
    page.getByRole("heading", { level: 1, name: "Live with me." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByText("Not immediately. Let’s have dinner first."),
  ).toBeVisible();

  for (const heading of [
    "What I’m hoping for.",
    "What I bring.",
    "The ordinary life I mean.",
    "What I know now.",
    "A few practical truths.",
    "Why make a page for this?",
    "Say hello.",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }

  await expect(page.getByText(/I’m Jason\. I’m 53, single/)).toBeVisible();
  await expect(page.getByText(/live in North Carolina/)).toBeVisible();
  await expect(page.getByText(/two orange cats/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Beverly and Lucinda", exact: true }),
  ).toHaveAttribute("href", "/cats/beverly-and-lucinda");

  await expect(
    page.getByRole("link", { name: "Send me a note" }),
  ).toHaveAttribute("href", expectedMailto);
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.getByText("sensitive, tender lover")).toHaveCount(0);

  expect(consoleErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("the homepage and footer discover the page without changing hero navigation", async ({
  page,
}) => {
  await page.goto("/");

  const about = page.locator("#about");
  await expect(
    about.getByRole("link", { name: "Live with me", exact: true }),
  ).toHaveAttribute("href", "/live-with-me");

  const mainNav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(mainNav.locator("a")).toHaveCount(8);
  await expect(mainNav.locator('a[href="/live-with-me"]')).toHaveCount(0);

  await page.goto("/arcade");
  await expect(
    page
      .getByRole("contentinfo", { name: "Public site footer" })
      .getByRole("link", { name: "Live With Me" }),
  ).toHaveAttribute("href", "/live-with-me");
});

test("metadata, canonical URL, Open Graph image, and sitemap expose the route", async ({
  page,
  request,
}) => {
  await page.goto("/live-with-me");

  await expect(page).toHaveTitle("Live With Me | Jason Pollard");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "An honest, slightly overengineered note from Jason Pollard about the kind of relationship and ordinary life he hopes to build.",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://arcadeghosts.org/live-with-me",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Live With Me | Jason Pollard",
  );

  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogImageUrl).toContain("/live-with-me/opengraph-image");
  const parsedOgImageUrl = new URL(ogImageUrl!);
  const localOgImagePath = `${parsedOgImageUrl.pathname}${parsedOgImageUrl.search}`;

  const [ogImage, sitemap] = await Promise.all([
    request.get(localOgImagePath),
    request.get("/sitemap.xml"),
  ]);
  expect(ogImage.ok()).toBeTruthy();
  expect(ogImage.headers()["content-type"]).toContain("image/png");
  expect(sitemap.ok()).toBeTruthy();

  const sitemapLocations = Array.from(
    (await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
    ([, location]) => new URL(location).pathname,
  );
  expect(
    sitemapLocations.filter((location) => location === "/live-with-me"),
  ).toHaveLength(1);
});

test("desktop and 390px layouts remain readable without horizontal overflow", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/live-with-me");
    await page.evaluate(() => document.fonts.ready);

    const layout = await page.evaluate(() => {
      const shell = document
        .querySelector(".live-with-me-shell")!
        .getBoundingClientRect();
      const heading = document.querySelector("h1")!.getBoundingClientRect();

      return {
        rootOverflow:
          document.documentElement.scrollWidth - window.innerWidth,
        bodyOverflow: document.body.scrollWidth - window.innerWidth,
        shellLeft: shell.left,
        shellRight: window.innerWidth - shell.right,
        headingLeft: heading.left,
        headingRight: window.innerWidth - heading.right,
      };
    });

    expect(layout.rootOverflow).toBeLessThanOrEqual(1);
    expect(layout.bodyOverflow).toBeLessThanOrEqual(1);
    expect(layout.shellLeft).toBeGreaterThanOrEqual(0);
    expect(layout.shellRight).toBeGreaterThanOrEqual(0);
    expect(layout.headingLeft).toBeGreaterThanOrEqual(0);
    expect(layout.headingRight).toBeGreaterThanOrEqual(0);
  }
});

test("CTA focus is visible and reduced-motion preferences are respected", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/live-with-me");

  const backHome = page.getByRole("link", { name: "Back Home" });
  for (let index = 0; index < 12; index += 1) {
    if (await backHome.evaluate((element) => document.activeElement === element)) {
      break;
    }
    await page.keyboard.press("Tab");
  }
  await expect(backHome).toBeFocused();
  expect(
    await backHome.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe("none");

  const cta = page.getByRole("link", { name: "Send me a note" });
  for (let index = 0; index < 12; index += 1) {
    if (await cta.evaluate((element) => document.activeElement === element)) {
      break;
    }
    await page.keyboard.press("Tab");
  }
  await expect(cta).toBeFocused();

  const styles = await cta.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      outlineStyle: computed.outlineStyle,
      transitionDuration: computed.transitionDuration,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });

  expect(styles.outlineStyle).not.toBe("none");
  expect(styles.transitionDuration).toBe("0s");
  expect(styles.scrollBehavior).toBe("auto");
});
