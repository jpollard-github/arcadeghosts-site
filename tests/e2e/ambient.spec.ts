import { expect, test, type Locator, type Page } from "@playwright/test";

type Rect = { x: number; y: number; width: number; height: number };

async function rect(locator: Locator): Promise<Rect> {
  const value = await locator.boundingBox();
  expect(value).not.toBeNull();
  return value as Rect;
}

function expectSameRect(actual: Rect, expected: Rect, tolerance = 1) {
  for (const key of ["x", "y", "width", "height"] as const) {
    expect(Math.abs(actual[key] - expected[key]), `${key} moved`).toBeLessThanOrEqual(tolerance);
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

test("representative signal kinds share one stable 1280x800 stage rectangle", async ({ page }) => {
  let expectedStage: Rect | null = null;

  for (const kind of ["cat", "thought", "project", "writing"] as const) {
    await page.goto(`/ambient?type=${kind}`);
    const stack = page.locator("[data-ambient-stage-stack]");
    const stage = page.locator(`[data-ambient-stage][data-signal-kind="${kind}"]`);

    await expect(stage).toBeVisible();
    const stackRect = await rect(stack);
    expectSameRect(await rect(stage), stackRect);

    if (expectedStage) {
      expectSameRect(stackRect, expectedStage);
    } else {
      expectedStage = stackRect;
    }

    await expectNoPageOverflow(page);
  }
});

test("transition layers overlap without moving stage, header, or controls", async ({ page }) => {
  await page.goto("/ambient");

  const stack = page.locator("[data-ambient-stage-stack]");
  const header = page.locator("main header");
  const controls = page.locator("main footer");
  const before = {
    stack: await rect(stack),
    header: await rect(header),
    controls: await rect(controls),
  };

  await page.getByRole("button", { name: "Next" }).click();
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

  await page.getByRole("button", { name: "Next" }).click();

  expectSameRect(await rect(stack), before[0]);
  expectSameRect(await rect(header), before[1]);
  expectSameRect(await rect(controls), before[2]);
  await expect(page.locator("[data-ambient-stage]")).toHaveCount(1);
  await expectNoPageOverflow(page);
});

test("rapid Previous and Next input leaves one settled stage without overflow", async ({ page }) => {
  await page.goto("/ambient");

  const previous = page.getByRole("button", { name: "Previous" });
  const next = page.getByRole("button", { name: "Next" });
  const stackBefore = await rect(page.locator("[data-ambient-stage-stack]"));

  for (let index = 0; index < 5; index += 1) {
    await next.click();
    await previous.click();
  }

  await page.waitForTimeout(750);
  await expect(page.locator("[data-ambient-stage]")).toHaveCount(1);
  expectSameRect(await rect(page.locator("[data-ambient-stage-stack]")), stackBefore);
  await expectNoPageOverflow(page);
});

test("ordinary pages retain their normal document layout", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "Who I am and how I think." })).toBeVisible();
  await expect(page.locator("body")).not.toHaveClass(/ambient-mode/);

  const colors = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).backgroundColor,
    body: getComputedStyle(document.body).backgroundImage,
  }));

  expect(colors.html).toBe("rgb(8, 9, 12)");
  expect(colors.body).toContain("radial-gradient");
});
