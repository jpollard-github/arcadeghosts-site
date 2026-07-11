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

test("arcade page renders cabinet favorites", async ({ page }) => {
  await page.goto("/arcade");

  await expect(
    page.getByRole("heading", { name: "Quarter-light favorites." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Back Home" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Galaga" })).toBeVisible();
});

test("about page renders identity and resonance sections", async ({ page }) => {
  await page.goto("/about");

  await expect(
    page.getByRole("heading", { name: "Who I am and how I think." }),
  ).toBeVisible();
  await expect(
    page.getByText("Some places on the internet that resonate with me:"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "The Five Agents" }),
  ).toBeVisible();
});

test("screening page renders the media grid", async ({ page }) => {
  await page.goto("/screening");

  await expect(
    page.getByRole("heading", {
      name: "Stories that keep following me around.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Back Home" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Twin Peaks Season 1" }),
  ).toBeVisible();
});

test("legacy movies and tv route redirects to screening", async ({ page }) => {
  await page.goto("/movies-tv");

  await expect(page).toHaveURL(/\/screening$/);
  await expect(
    page.getByRole("heading", {
      name: "Stories that keep following me around.",
    }),
  ).toBeVisible();
});

test("search page can find twin peaks rooms and public writings", async ({
  page,
}) => {
  await page.goto("/search");

  await expect(
    page.getByRole("heading", {
      name: "Find a room by signal instead of by hallway.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Showing a featured mix of places to start."),
  ).toBeVisible();

  await page.getByRole("searchbox").fill("Twin Peaks");

  await expect(page.getByText(/result(s)? for "Twin Peaks"\./)).toBeVisible();
  await expect(
    page
      .getByRole("article")
      .filter({ has: page.getByRole("link", { name: "Enter the lodges" }) })
      .getByRole("heading", { name: "The Lodges Within" }),
  ).toBeVisible();
});

test("search page handles empty results and restores featured routes when cleared", async ({
  page,
}) => {
  await page.goto("/search");

  const searchBox = page.getByRole("searchbox");

  await searchBox.fill("zzzz-no-match-arcadeghosts");

  await expect(
    page.getByRole("heading", { name: "No exact signal match yet." }),
  ).toBeVisible();
  await expect(
    page.getByText('0 results for "zzzz-no-match-arcadeghosts".'),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Twin Peaks Self" }),
  ).toBeVisible();

  await searchBox.clear();

  await expect(
    page.getByText("Showing a featured mix of places to start."),
  ).toBeVisible();
  const quickRoutes = page.getByLabel("Quick routes");
  await expect(
    quickRoutes.getByRole("link", { name: "Projects" }),
  ).toBeVisible();
  await expect(quickRoutes.getByRole("link", { name: "About" })).toBeVisible();
  await expect(
    quickRoutes.getByRole("link", { name: "Tiny Thoughts" }),
  ).toBeVisible();
});

test("writings index and a writing detail page render correctly", async ({
  page,
}) => {
  await page.goto("/writings");

  await expect(
    page.getByRole("heading", { name: "Essays from the booth by the window." }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Read piece" }).first().click();

  await expect(page).toHaveURL(/\/writings\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("region", { name: "A few nearby signals." }),
  ).toBeVisible();
});

test("tiny thoughts archive exposes rss", async ({ page }) => {
  await page.goto("/tiny-thoughts");

  await expect(
    page.getByRole("heading", { name: "Short signals from the counter." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Subscribe via RSS" }),
  ).toHaveAttribute("href", "/tiny-thoughts/rss.xml");
});

test("Ambient renders active sources without a dormant Now link", async ({
  page,
}) => {
  await page.goto("/ambient?type=cat");

  await expect(page.getByRole("heading", { name: "First Glow" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Beverly and Lucinda" }),
  ).toBeVisible();
  await expect(
    page.locator('a[href$="#now"]'),
  ).toHaveCount(0);
});

test("Ambient fits a landscape tablet and keeps display controls available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/ambient?type=cat");

  await expect(
    page.getByRole("button", { name: "Previous", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeVisible();

  const overflow = await page.evaluate(() => ({
    horizontal: document.documentElement.scrollWidth - window.innerWidth,
    vertical: document.documentElement.scrollHeight - window.innerHeight,
  }));

  expect(overflow.horizontal).toBeLessThanOrEqual(1);
  expect(overflow.vertical).toBeLessThanOrEqual(1);
});

test("Ambient install resources expose the expected manifest and uncached worker", async ({
  request,
}) => {
  const [manifestResponse, workerResponse] = await Promise.all([
    request.get("/manifest.webmanifest"),
    request.get("/sw.js"),
  ]);

  expect(manifestResponse.ok()).toBeTruthy();
  expect(workerResponse.ok()).toBeTruthy();
  expect(manifestResponse.headers()["content-type"]).toMatch(
    /application\/manifest\+json/,
  );

  const manifestJson = (await manifestResponse.json()) as {
    start_url: string;
    display: string;
    orientation: string;
  };
  const workerText = await workerResponse.text();

  expect(manifestJson.start_url).toBe("/ambient");
  expect(manifestJson.display).toBe("fullscreen");
  expect(manifestJson.orientation).toBe("landscape");
  expect(workerText).not.toContain("caches.open");
});

test("removed public routes return not found", async ({ page }) => {
  for (const route of [
    "/build-log",
    "/updates",
    "/work-with-me",
    "/admin/side-hustle",
  ]) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", {
        name: "The page you are looking for is not what it seems.",
      }),
    ).toBeVisible();
  }
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
  await expect(page.getByRole("button", { name: "Try Again" })).toBeVisible();
});

test(
  "public feed, sitemap, robots, and json endpoints respond with expected shapes",
  { tag: "@database" },
  async ({ request }) => {
    const [
      tinyThoughtsRss,
      writingsRss,
      robots,
      sitemap,
      projects,
      now,
      tinyThoughts,
    ] = await Promise.all([
      request.get("/tiny-thoughts/rss.xml"),
      request.get("/writings/rss.xml"),
      request.get("/robots.txt"),
      request.get("/sitemap.xml"),
      request.get("/api/projects"),
      request.get("/api/now"),
      request.get("/api/tiny-thoughts?limit=3"),
    ]);

    assertStatusOk(tinyThoughtsRss, "/tiny-thoughts/rss.xml");
    assertStatusOk(writingsRss, "/writings/rss.xml");
    assertStatusOk(robots, "/robots.txt");
    assertStatusOk(sitemap, "/sitemap.xml");
    assertStatusOk(projects, "/api/projects");
    expect(now.status()).toBe(404);
    assertStatusOk(tinyThoughts, "/api/tiny-thoughts?limit=3");

    expect(tinyThoughtsRss.headers()["content-type"]).toMatch(
      /application\/rss\+xml/,
    );
    expect(writingsRss.headers()["content-type"]).toMatch(
      /application\/rss\+xml/,
    );

    expect(await robots.text()).toContain("Sitemap:");
    const sitemapText = await sitemap.text();
    expect(sitemapText).toContain("/ambient");
    expect(sitemapText).toContain("/tiny-thoughts");
    expect(sitemapText).not.toContain("/build-log");
    expect(sitemapText).not.toContain("/updates");

    const projectsJson = (await projects.json()) as { projects: unknown[] };
    const tinyThoughtsJson = (await tinyThoughts.json()) as {
      thoughts: unknown[];
    };

    expect(Array.isArray(projectsJson.projects)).toBeTruthy();
    expect(Array.isArray(tinyThoughtsJson.thoughts)).toBeTruthy();
    expect(tinyThoughtsJson.thoughts.length).toBeLessThanOrEqual(3);
  },
);

function assertStatusOk(
  response: { ok(): boolean; status(): number },
  label: string,
) {
  expect(response.ok(), `${label} returned ${response.status()}`).toBeTruthy();
}
