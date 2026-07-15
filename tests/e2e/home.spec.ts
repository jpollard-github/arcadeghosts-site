import { expect, test, type Locator, type Page } from "@playwright/test";

const homeSectionLinks = [
  { href: "#writing", heading: "Essays from the booth by the window." },
  { href: "#tiny-thoughts", heading: "Short signals from the counter." },
  { href: "#fun-and-games", heading: "Games, rooms, and playable static." },
  { href: "#screening", heading: "A few screen stories still glowing in the lobby." },
  { href: "#cats", heading: "Cat rooms, no endless hallway." },
  { href: "#about", heading: "About ArcadeGhosts." },
] as const;

async function expectTargetBelowFixedChrome(page: Page, target: Locator) {
  await expect.poll(async () => {
    const [logoBox, targetBox] = await Promise.all([
      page.getByRole("link", { name: "ArcadeGhosts home" }).boundingBox(),
      target.boundingBox(),
    ]);

    if (!logoBox || !targetBox) {
      return null;
    }

    return {
      chromeBottom: Math.round(logoBox.y + logoBox.height),
      targetTop: Math.round(targetBox.y),
    };
  }).toEqual(
    expect.objectContaining({
      chromeBottom: expect.any(Number),
      targetTop: expect.any(Number),
    }),
  );

  const [logoBox, targetBox] = await Promise.all([
    page.getByRole("link", { name: "ArcadeGhosts home" }).boundingBox(),
    target.boundingBox(),
  ]);

  expect(logoBox).not.toBeNull();
  expect(targetBox).not.toBeNull();

  const chromeBottom = logoBox!.y + logoBox!.height;
  expect(targetBox!.y).toBeGreaterThanOrEqual(chromeBottom);
  expect(targetBox!.y).toBeLessThanOrEqual(chromeBottom + 40);
}

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
  await expect(about.getByRole("heading", { name: "About ArcadeGhosts." })).toBeVisible();
  await expect(about.getByText(/ArcadeGhosts is where those ideas become playable/)).toBeVisible();
  await expect(about.getByText(/I live in North Carolina with my cats/)).toBeVisible();
  await expect(about.getByRole("link", { name: "Beverly and Lucinda" })).toHaveAttribute(
    "href",
    "/cats/beverly-and-lucinda",
  );
  await expect(about.locator(".section-link-card")).toHaveCount(0);
  await expect(mainNav.locator('a[href="#start-here"]')).toHaveCount(0);
  await expect(page.locator("#start-here")).toHaveCount(0);
  await expect(page.locator("main > section").nth(0)).toHaveClass(/hero/);
  await expect(page.locator("main > section").nth(1).locator("#writing")).toBeVisible();
  await expect(page.getByText("80s Dev Terminal")).toHaveCount(0);
});

test("every main navigation anchor lands its heading below the fixed chrome", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const mainNav = page.getByRole("navigation", { name: "Main navigation" });

  for (const section of homeSectionLinks) {
    await mainNav.locator(`a[href="${section.href}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${section.href}$`));
    await expectTargetBelowFixedChrome(page, page.locator(section.href));
    await expect(page.getByRole("heading", { name: section.heading })).toBeVisible();
  }
});

test("footer section links work from another public route", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const section of homeSectionLinks.slice(1)) {
    await page.goto("/arcade");
    const footer = page.getByRole("contentinfo", { name: "Public site footer" });
    await footer.locator(`a[href="/${section.href}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${section.href}$`));
    await expectTargetBelowFixedChrome(page, page.locator(section.href));
  }
});

test("direct hash loading aligns a heading below the fixed chrome", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#screening");

  await expectTargetBelowFixedChrome(page, page.locator("#screening"));
});

test("mobile anchor navigation uses the same stable offset", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.getByRole("navigation", { name: "Main navigation" }).locator('a[href="#cats"]').click();

  await expect(page).toHaveURL(/#cats$/);
  await expectTargetBelowFixedChrome(page, page.locator("#cats"));
});

test("keyboard activation follows the same native anchor path", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const link = page.getByRole("navigation", { name: "Main navigation" }).locator('a[href="#about"]');

  await link.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/#about$/);
  await expectTargetBelowFixedChrome(page, page.locator("#about"));
});

test("homepage grids do not reserve pathological off-screen space", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const layout = await page.evaluate(() => {
    const gap = (before: string, after: string) => {
      const beforeBox = document.querySelector(before)!.getBoundingClientRect();
      const afterBox = document.querySelector(after)!.getBoundingClientRect();
      return afterBox.top - beforeBox.bottom;
    };

    return {
      contentVisibility: [".fun-games-grid", ".screening-section .media-grid", ".cats-section .section-link-grid"].map(
        (selector) => getComputedStyle(document.querySelector(selector)!).contentVisibility,
      ),
      screeningGap: gap(".fun-games-grid", "#screening"),
      catsGap: gap(".screening-section .media-grid", "#cats"),
    };
  });

  expect(layout.contentVisibility).toEqual(["visible", "visible", "visible"]);
  expect(layout.screeningGap).toBeGreaterThan(80);
  expect(layout.screeningGap).toBeLessThan(240);
  expect(layout.catsGap).toBeGreaterThan(80);
  expect(layout.catsGap).toBeLessThan(240);
});

test("About and footer links expose visible keyboard focus", async ({ page }) => {
  await page.goto("/#about");
  const catLink = page.getByRole("link", { name: "Beverly and Lucinda", exact: true });
  const footerLink = page.getByRole("contentinfo", { name: "Public site footer" }).getByRole("link", {
    name: "Writing",
    exact: true,
  });

  for (const link of [catLink, footerLink]) {
    await link.focus();
    await expect(link).toBeFocused();
    const outline = await link.evaluate((element) => getComputedStyle(element).outlineStyle);
    expect(outline).not.toBe("none");
  }
});
