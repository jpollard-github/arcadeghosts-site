import { expect, test, type Page } from "@playwright/test";

const mobileWidths = [
  { label: "375px", width: 375, height: 812 },
  { label: "390px", width: 390, height: 844 },
  { label: "430px", width: 430, height: 932 },
] as const;

const routes = [
  "/",
  "/writings",
  "/writings/ai-its-safety-produces-your-insanity-final",
  "/arcade",
  "/listening",
  "/reading",
  "/screening",
  "/terminal",
  "/tiny-thoughts",
  "/twin-peaks-self",
  "/cats/beverly-and-lucinda",
  "/cats/thomas-jones-missy-cass",
];

const tapTargetChecks = [
  {
    route: "/",
    selectors: [".nav-links a"],
  },
  {
    route: "/tiny-thoughts",
    selectors: [".back-link", ".feed-link"],
  },
  {
    route: "/writings",
    selectors: [".back-link", ".list-panel a"],
  },
  {
    route: "/twin-peaks-self",
    selectors: [".back-link", ".lodge-actions button", ".lodge-export-actions button"],
  },
  {
    route: "/arcade",
    selectors: [".back-link", ".arcade-card-copy a"],
  },
  {
    route: "/listening",
    selectors: [
      ".back-link",
      ".album-image-link",
      ".album-card-copy h3 a",
      ".album-card-copy > a",
    ],
  },
  {
    route: "/reading",
    selectors: [
      ".back-link",
      ".book-image-link",
      ".book-card-copy h3 a",
      ".book-card-copy > a",
    ],
  },
  {
    route: "/screening",
    selectors: [".back-link", ".media-card-copy > a"],
  },
  {
    route: "/terminal",
    selectors: [".back-link", ".hero-terminal-reset", ".hero-terminal-input-row input"],
  },
] as const;

async function preparePageForLayoutMeasurement(
  page: Page,
  route: string,
  viewport: { width: number; height: number },
) {
  await page.setViewportSize(viewport);
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main")).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  });
}

for (const route of routes) {
  test.describe(`mobile safety ${route}`, () => {
    for (const viewport of mobileWidths) {
      test(`has no obvious horizontal overflow at ${viewport.label}`, async ({ page }) => {
        await preparePageForLayoutMeasurement(page, route, viewport);

        const overflow = await page.evaluate(() => {
          const viewportWidth = window.innerWidth;
          const rootOverflow = document.documentElement.scrollWidth - viewportWidth;
          const bodyOverflow = document.body.scrollWidth - viewportWidth;

          return {
            viewportWidth,
            rootOverflow,
            bodyOverflow,
          };
        });

        expect(
          overflow.rootOverflow,
          `document overflow detected for ${route} at ${viewport.label} (viewport ${overflow.viewportWidth}px)`,
        ).toBeLessThanOrEqual(1);
        expect(
          overflow.bodyOverflow,
          `body overflow detected for ${route} at ${viewport.label} (viewport ${overflow.viewportWidth}px)`,
        ).toBeLessThanOrEqual(1);
      });
    }
  });
}

for (const check of tapTargetChecks) {
  test.describe(`mobile tap targets ${check.route}`, () => {
    test("keeps primary mobile controls finger-friendly at 390px", async ({ page }) => {
      await preparePageForLayoutMeasurement(page, check.route, {
        width: 390,
        height: 844,
      });

      const violations = await page.evaluate((selectors) => {
        const minimumTarget = 40;

        return selectors.flatMap((selector) => {
          const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((element) => {
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);

            return (
              rect.width > 0 &&
              rect.height > 0 &&
              styles.visibility !== "hidden" &&
              styles.display !== "none"
            );
          });

          return elements
            .map((element) => {
              const rect = element.getBoundingClientRect();
              const smallerSide = Math.min(rect.width, rect.height);

              return {
                selector,
                width: rect.width,
                height: rect.height,
                smallerSide,
                text: element.textContent?.trim().slice(0, 60) ?? "",
              };
            })
            .filter((entry) => entry.smallerSide < minimumTarget);
        });
      }, [...check.selectors]);

      expect(violations, `small tap targets detected on ${check.route}`).toEqual([]);
    });
  });
}

test("long writing keeps readable type and contains code overflow at 390px", async ({ page }) => {
  await preparePageForLayoutMeasurement(
    page,
    "/writings/ai-its-safety-produces-your-insanity-final",
    { width: 390, height: 844 },
  );

  const measurements = await page.evaluate(() => {
    const writingBody = document.querySelector<HTMLElement>(".writing-body");
    const paragraph = writingBody?.querySelector<HTMLElement>("p");
    const sectionHeading = writingBody?.querySelector<HTMLElement>("h2");
    const listItem = writingBody?.querySelector<HTMLElement>("li");
    const codeBlocks = Array.from(
      writingBody?.querySelectorAll<HTMLElement>("pre") ?? [],
    );

    return {
      paragraphFontSize: paragraph ? Number.parseFloat(getComputedStyle(paragraph).fontSize) : 0,
      sectionHeadingFontSize: sectionHeading
        ? Number.parseFloat(getComputedStyle(sectionHeading).fontSize)
        : 0,
      listItemFontSize: listItem ? Number.parseFloat(getComputedStyle(listItem).fontSize) : 0,
      codeBlockCount: codeBlocks.length,
      codeBlocksContainOverflow: codeBlocks.every((block) =>
        ["auto", "scroll"].includes(getComputedStyle(block).overflowX),
      ),
      hasInternallyScrollableCode: codeBlocks.some(
        (block) => block.scrollWidth > block.clientWidth,
      ),
    };
  });

  expect(measurements.paragraphFontSize).toBeGreaterThanOrEqual(16);
  expect(measurements.sectionHeadingFontSize).toBeGreaterThanOrEqual(24);
  expect(measurements.listItemFontSize).toBeGreaterThanOrEqual(16);
  expect(measurements.codeBlockCount).toBe(7);
  expect(measurements.codeBlocksContainOverflow).toBeTruthy();
  expect(measurements.hasInternallyScrollableCode).toBeTruthy();
});
