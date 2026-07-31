import { expect, test } from "@playwright/test";

const expectedMailto =
  "mailto:jason@arcadeghosts.org?subject=Live%20with%20me";
const expectedSpotify =
  "https://open.spotify.com/playlist/37i9dQZF1E8HCrv0dQ8eW5?si=bc6c1985d0c542f2";
const expectedAvailability =
  "I’m looking for someone who wants to make room for shared time, closeness, and an ordinary life together.";
const expectedPolitics =
  "We do not need to agree on everything, but a Trump or MAGA worldview is a fundamental incompatibility.";

test("the live-with-me page renders the approved letter, photograph, and contact paths", async ({
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

  await expect(page.locator(".live-with-me-section h2")).toHaveText([
    "What I’m hoping for.",
    "The ordinary life I mean.",
    "What I bring.",
    "A few things that matter.",
    "Why make a page for this?",
  ]);
  await expect(page.getByRole("heading", { name: "Say hello." })).toBeVisible();

  await expect(page.getByText(/I’m Jason\. I’m 53, single/)).toBeVisible();
  await expect(
    page
      .locator(".live-with-me-introduction")
      .getByText(/live in the Triad area of North Carolina/),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Beverly and Lucinda", exact: true }),
  ).toHaveAttribute("href", "/cats/beverly-and-lucinda");

  const portrait = page.getByRole("img", {
    name: "Jason smiling at home with an orange cat behind him.",
  });
  await expect(portrait).toBeVisible();
  expect(decodeURIComponent((await portrait.getAttribute("src")) ?? "")).toContain(
    "/images/live-with-me/jason.webp",
  );
  const loadedPortrait = await portrait.evaluate((image: HTMLImageElement) => ({
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  }));
  expect(loadedPortrait.complete).toBeTruthy();
  expect(loadedPortrait.naturalWidth).toBeGreaterThanOrEqual(300);
  expect(loadedPortrait.naturalHeight / loadedPortrait.naturalWidth).toBeCloseTo(
    1067 / 800,
    2,
  );

  await expect(page.getByText(expectedAvailability, { exact: true })).toBeVisible();
  await expect(
    page.getByText(/I’m not looking for a long-distance relationship/),
  ).toBeVisible();
  await expect(page.getByText(expectedPolitics, { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "I’m not religious, and I’m not looking for a relationship organized around religion.",
      { exact: true },
    ),
  ).toBeVisible();

  const contact = page.getByRole("link", { name: "Send me a note" });
  await expect(contact).toHaveAttribute("href", expectedMailto);

  const spotify = page.getByRole("link", { name: "Shadow Radio" });
  await expect(spotify).toHaveAttribute("href", expectedSpotify);
  await expect(spotify).toHaveAttribute("target", "_blank");
  await expect(spotify).toHaveAttribute("rel", /noopener/);
  await expect(spotify).toHaveAttribute("rel", /noreferrer/);

  for (const removedPhrase of [
    "prolonged audition",
    "pen-pal arrangement",
    "response times",
    "one-sided pursuit",
    "emotional hide-and-seek",
    "Silence may mean many things",
    "Complete sentences",
    "Low pressure",
  ]) {
    await expect(page.getByText(new RegExp(removedPhrase, "i"))).toHaveCount(0);
  }

  await expect(
    page.getByRole("contentinfo", { name: "Public site footer" }),
  ).toHaveCount(0);
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('a[href*="whatsapp" i], a[href*="signal" i]')).toHaveCount(0);

  const sectionChildClasses = await page
    .locator(".live-with-me-section")
    .evaluateAll((sections) =>
      sections.map((section) =>
        Array.from(section.children).map((child) => child.className),
      ),
    );
  for (const childClasses of sectionChildClasses) {
    expect(childClasses[0]).toContain("live-with-me-section-heading");
    expect(childClasses[1]).toContain("live-with-me-section-copy");
  }

  expect(consoleErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("the homepage and ordinary public footer discover the page without changing hero navigation", async ({
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
  const footer = page.getByRole("contentinfo", { name: "Public site footer" });
  await expect(footer).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "Live With Me" }),
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

  const [ogImage, sourceImage, sitemap] = await Promise.all([
    request.get(localOgImagePath),
    request.get("/images/live-with-me/jason.webp"),
    request.get("/sitemap.xml"),
  ]);
  expect(ogImage.ok()).toBeTruthy();
  expect(ogImage.headers()["content-type"]).toContain("image/png");
  expect(sourceImage.ok()).toBeTruthy();
  expect(sourceImage.headers()["content-type"]).toContain("image/webp");
  expect(sitemap.ok()).toBeTruthy();

  const sitemapLocations = Array.from(
    (await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
    ([, location]) => new URL(location).pathname,
  );
  expect(
    sitemapLocations.filter((location) => location === "/live-with-me"),
  ).toHaveLength(1);
});

test("desktop, intermediate, and 390px layouts remain readable without horizontal overflow", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 900, height: 900 },
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
      const portrait = document
        .querySelector(".live-with-me-portrait img")!
        .getBoundingClientRect();

      return {
        rootOverflow: document.documentElement.scrollWidth - window.innerWidth,
        bodyOverflow: document.body.scrollWidth - window.innerWidth,
        shellLeft: shell.left,
        shellRight: window.innerWidth - shell.right,
        headingLeft: heading.left,
        headingRight: window.innerWidth - heading.right,
        portraitLeft: portrait.left,
        portraitRight: window.innerWidth - portrait.right,
      };
    });

    expect(layout.rootOverflow).toBeLessThanOrEqual(1);
    expect(layout.bodyOverflow).toBeLessThanOrEqual(1);
    for (const inset of [
      layout.shellLeft,
      layout.shellRight,
      layout.headingLeft,
      layout.headingRight,
      layout.portraitLeft,
      layout.portraitRight,
    ]) {
      expect(inset).toBeGreaterThanOrEqual(0);
    }
  }
});

test("letter links expose visible focus and respect reduced-motion preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/live-with-me");

  for (const link of [
    page.getByRole("link", { name: "Back Home" }),
    page.getByRole("link", { name: "Shadow Radio" }),
    page.getByRole("link", { name: "Send me a note" }),
  ]) {
    await link.focus();
    await expect(link).toBeFocused();
    expect(
      await link.evaluate((element) => getComputedStyle(element).outlineStyle),
    ).not.toBe("none");
  }

  const contact = page.getByRole("link", { name: "Send me a note" });
  const styles = await contact.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      transitionDuration: computed.transitionDuration,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });

  expect(styles.transitionDuration).toBe("0s");
  expect(styles.scrollBehavior).toBe("auto");
});
