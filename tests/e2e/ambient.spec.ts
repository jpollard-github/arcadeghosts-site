import { expect, test, type Locator, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
import {
  authenticateAdmin,
  cleanupTinyThoughtTestData,
  createTinyThoughtFixture,
} from "./helpers/admin-api";

type Rect = { x: number; y: number; width: number; height: number };

async function rect(locator: Locator): Promise<Rect> {
  const value = await locator.boundingBox();
  expect(value).not.toBeNull();
  return value as Rect;
}

function expectSameRect(actual: Rect, expected: Rect, tolerance = 1) {
  for (const key of ["x", "y", "width", "height"] as const) {
    expect(
      Math.abs(actual[key] - expected[key]),
      `${key} moved`,
    ).toBeLessThanOrEqual(tolerance);
  }
}

async function expectNoPageOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    rootX: document.documentElement.scrollWidth - window.innerWidth,
    rootY: document.documentElement.scrollHeight - window.innerHeight,
    bodyX: document.body.scrollWidth - window.innerWidth,
    bodyY: document.body.scrollHeight - window.innerHeight,
  }));

  for (const amount of Object.values(overflow)) {
    expect(amount).toBeLessThanOrEqual(1);
  }
}

test(
  "representative signal kinds share one stable 1280x800 stage rectangle",
  { tag: "@database" },
  async ({ page }) => {
    const token = randomUUID();
    await authenticateAdmin(page);

    try {
      await createTinyThoughtFixture(page, `Ambient thought e2e ${token}`);
      let expectedStage: Rect | null = null;

      for (const kind of ["cat", "thought", "writing"] as const) {
        await page.goto(`/ambient?type=${kind}`);
        const stack = page.locator("[data-ambient-stage-stack]");
        const stage = page.locator(`[data-ambient-stage][data-signal-kind="${kind}"]`);

        await expect(stage).toBeVisible();
        const stackRect = await rect(stack);
        expectSameRect(await rect(stage), stackRect);
        if (expectedStage) expectSameRect(stackRect, expectedStage);
        else expectedStage = stackRect;

        await expectNoPageOverflow(page);
      }
    } finally {
      await cleanupTinyThoughtTestData(page, token);
    }
  },
);

test("stage top edge has no light border or inset highlight", async ({
  page,
}) => {
  await page.goto("/ambient?type=cat");

  const edgeStyles = await page
    .locator("[data-ambient-stage]")
    .evaluate((element) => {
      const styles = getComputedStyle(element);

      return {
        borderTopColor: styles.borderTopColor,
        boxShadow: styles.boxShadow,
      };
    });

  expect(edgeStyles.borderTopColor).toBe("rgba(0, 0, 0, 0)");
  expect(edgeStyles.boxShadow).not.toContain("inset");
  expect(edgeStyles.boxShadow).not.toMatch(/rgba\(255, 255, 255/);
});

test("background grid does not paint a horizontal stripe at y=0", async ({
  page,
}) => {
  await page.goto("/ambient?type=cat");

  const gridStyles = await page
    .locator('[class*="backgroundGrid"]')
    .evaluate((element) => {
      const styles = getComputedStyle(element);

      return {
        backgroundImage: styles.backgroundImage,
        backgroundSize: styles.backgroundSize,
        display: styles.display,
        maskImage: styles.maskImage,
      };
    });

  expect(gridStyles.display).not.toBe("none");
  expect(gridStyles.backgroundSize).toBe("48px 48px, 48px 48px");
  expect(gridStyles.backgroundImage).toMatch(
    /^linear-gradient\(rgba\(0, 0, 0, 0\) 0px, rgba\(0, 0, 0, 0\) 47px,/,
  );
  expect(gridStyles.backgroundImage).toContain("48px), linear-gradient(90deg");
  expect(gridStyles.maskImage).toContain("linear-gradient");
});

test("temporary diagnostic mode isolates visual layers without affecting normal Ambient", async ({
  page,
}) => {
  await page.goto("/ambient");
  await expect(page.getByLabel("Temporary Ambient diagnostics")).toHaveCount(0);

  await page.goto("/ambient?diagnostic=1&type=cat");
  const panel = page.getByLabel("Temporary Ambient diagnostics");
  const grid = page.locator('[class*="backgroundGrid"]');
  const root = page.locator("[data-ambient-root]");

  await expect(panel).toBeVisible();
  await expect(panel.getByText("visual offset/page top")).toBeVisible();
  await expect(panel.getByText("display mode")).toBeVisible();
  await expect(panel.getByText("safe-area top")).toBeVisible();

  await panel.getByLabel("1. Background grid").check();
  await expect(grid).toHaveCSS("display", "none");
  await panel.getByLabel("1. Background grid").uncheck();
  await expect(grid).not.toHaveCSS("display", "none");

  await panel.getByLabel("11. Solid Ambient canvas only").check();
  await expect(root).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(root.locator(":scope > *").first()).toHaveCSS("display", "none");
  await panel.getByLabel("11. Solid Ambient canvas only").uncheck();

  await panel.getByLabel("12. Solid document only").check();
  await expect(root).toHaveCSS("display", "none");
  await expect(panel).toBeVisible();
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(8, 9, 12)",
  );
});

test("solid diagnostic route contains only a fixed black page-owned canvas", async ({
  page,
}) => {
  await page.goto("/ambient/diagnostic-solid");

  const canvas = page.locator("[data-ambient-solid-diagnostic]");
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveCSS("position", "fixed");
  await expect(canvas).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(canvas).toHaveCSS("border-top-width", "0px");
  await expect(canvas).toHaveCSS("box-shadow", "none");
  await expect(page.locator(".site-logo")).toHaveCount(0);

  const documentStyles = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const before = getComputedStyle(document.body, "::before");

    return {
      htmlBackground: getComputedStyle(document.documentElement)
        .backgroundColor,
      bodyBackground: body.backgroundColor,
      bodyMargin: body.margin,
      bodyBeforeDisplay: before.display,
      bodyBeforeContent: before.content,
      manifestHref:
        document
          .querySelector<HTMLLinkElement>('link[rel="manifest"]')
          ?.getAttribute("href") ?? null,
    };
  });

  expect(documentStyles).toEqual({
    htmlBackground: "rgb(0, 0, 0)",
    bodyBackground: "rgb(0, 0, 0)",
    bodyMargin: "0px",
    bodyBeforeDisplay: "none",
    bodyBeforeContent: "none",
    manifestHref: "/manifest.webmanifest",
  });
  await expectNoPageOverflow(page);
});

test("media and text-only signals use explicit compositions without moving the frame", async ({
  page,
}) => {
  await page.goto("/ambient?type=cat");

  const mediaStage = page.locator(
    '[data-ambient-stage][data-composition="media"]',
  );
  await expect(mediaStage).toBeVisible();
  await expect(mediaStage.locator("[data-ambient-media] img")).toBeVisible();

  const mediaRects = {
    stage: await rect(page.locator("[data-ambient-stage-stack]")),
    header: await rect(page.locator("main header")),
    controls: await rect(page.locator("main footer")),
  };

  await page.goto("/ambient?type=writing");

  const textStage = page.locator(
    '[data-ambient-stage][data-composition="text-only"]',
  );
  await expect(textStage).toBeVisible();
  await expect(textStage.locator("[data-ambient-media]")).toHaveCount(0);
  await expect(textStage.locator("img")).toHaveCount(0);

  expectSameRect(
    await rect(page.locator("[data-ambient-stage-stack]")),
    mediaRects.stage,
  );
  expectSameRect(await rect(page.locator("main header")), mediaRects.header);
  expectSameRect(await rect(page.locator("main footer")), mediaRects.controls);
  await expectNoPageOverflow(page);
});

test("transition layers overlap without moving stage, header, or controls", async ({
  page,
}) => {
  await page.goto("/ambient");

  const stack = page.locator("[data-ambient-stage-stack]");
  const header = page.locator("main header");
  const controls = page.locator("main footer");
  const before = {
    stack: await rect(stack),
    header: await rect(header),
    controls: await rect(controls),
  };

  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator("[data-ambient-stage]")).toHaveCount(2);
  expectSameRect(await rect(stack), before.stack);
  expectSameRect(await rect(header), before.header);
  expectSameRect(await rect(controls), before.controls);

  await page.waitForTimeout(750);
  await expect(page.locator("[data-ambient-stage]")).toHaveCount(1);
  expectSameRect(await rect(stack), before.stack);
  expectSameRect(await rect(header), before.header);
  expectSameRect(await rect(controls), before.controls);
  await expectNoPageOverflow(page);
});

test("reduced-motion changes stay layout-neutral", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ambient");

  const stack = page.locator("[data-ambient-stage-stack]");
  const header = page.locator("main header");
  const controls = page.locator("main footer");
  const before = [await rect(stack), await rect(header), await rect(controls)];

  await page.getByRole("button", { name: "Next", exact: true }).click();

  expectSameRect(await rect(stack), before[0]);
  expectSameRect(await rect(header), before[1]);
  expectSameRect(await rect(controls), before[2]);
  await expect(page.locator("[data-ambient-stage]")).toHaveCount(1);
  await expectNoPageOverflow(page);
});

test("rapid Previous and Next input leaves one settled stage without overflow", async ({
  page,
}) => {
  await page.goto("/ambient");

  const previous = page.getByRole("button", { name: "Previous", exact: true });
  const next = page.getByRole("button", { name: "Next", exact: true });
  const stackBefore = await rect(page.locator("[data-ambient-stage-stack]"));

  for (let index = 0; index < 5; index += 1) {
    await next.click();
    await previous.click();
  }

  await page.waitForTimeout(750);
  await expect(page.locator("[data-ambient-stage]")).toHaveCount(1);
  expectSameRect(
    await rect(page.locator("[data-ambient-stage-stack]")),
    stackBefore,
  );
  await expectNoPageOverflow(page);
});

test("ordinary pages retain their normal document layout", async ({ page }) => {
  await page.goto("/screening");
  await expect(
    page.getByRole("heading", { name: "Stories that keep following me around." }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toHaveClass(/ambient-mode/);

  const colors = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).backgroundColor,
    body: getComputedStyle(document.body).backgroundImage,
  }));

  expect(colors.html).toBe("rgb(8, 9, 12)");
  expect(colors.body).toContain("radial-gradient");
});
