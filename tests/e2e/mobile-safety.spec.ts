import { expect, test } from "@playwright/test";

const mobileWidths = [
  { label: "375px", width: 375, height: 812 },
  { label: "390px", width: 390, height: 844 },
  { label: "430px", width: 430, height: 932 },
] as const;

const routes = ["/", "/about", "/work-with-me", "/music", "/writings"];

for (const route of routes) {
  test.describe(`mobile safety ${route}`, () => {
    for (const viewport of mobileWidths) {
      test(`has no obvious horizontal overflow at ${viewport.label}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle").catch(() => undefined);

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
