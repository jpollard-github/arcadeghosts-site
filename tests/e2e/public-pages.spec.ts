import { expect, test } from "@playwright/test";

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
  await assertScreeningCardLinks(page, {
    title: "The Secret of My Success (1987)",
    detailsUrl:
      "https://en.wikipedia.org/wiki/The_Secret_of_My_Success_(1987_film)",
    sourceUrl:
      "https://www.impawards.com/1987/secret_of_my_success_xlg.html",
  });
  await assertScreeningCardLinks(page, {
    title: "Twin Peaks Season 1",
    detailsUrl:
      "https://en.wikipedia.org/wiki/List_of_Twin_Peaks_episodes#Season_1_(1990)",
    sourceUrl: "https://watch.plex.tv/en-GB/show/twin-peaks/season/1",
  });
  await expect(page.getByRole("link", { name: /image source$/i })).toHaveCount(0);
  await expect(page.locator(".media-card-comment")).toHaveCount(0);
  await expect(page.locator("img[src*='the-secret-of-my-success-1987']")).toBeVisible();
});

async function assertScreeningCardLinks(
  page: import("@playwright/test").Page,
  item: { title: string; detailsUrl: string; sourceUrl: string },
) {
  const heading = page.getByRole("heading", { name: item.title, exact: true });
  await expect(heading.getByRole("link")).toHaveAttribute(
    "href",
    item.detailsUrl,
  );
  await expect(
    page.getByRole("link", { name: `View details for ${item.title}` }),
  ).toHaveAttribute("href", item.detailsUrl);
  await expect(
    page.getByRole("link", { name: `Image source for ${item.title}` }),
  ).toHaveAttribute("href", item.sourceUrl);
}

test("homepage screening preview stays curated and comment-free", async ({ page }) => {
  await page.goto("/");

  const preview = page.getByLabel("Screening preview");
  await expect(preview.locator(".media-card")).toHaveCount(4);
  await expect(preview.locator(".media-card-comment")).toHaveCount(0);
  await expect(
    preview.getByRole("heading", { name: "The Secret of My Success (1987)" }),
  ).toHaveCount(0);
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
    "/updates",
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
  "database-independent public endpoints respond with expected shapes",
  async ({ request }) => {
    const [writingsRss, robots, sitemap, projects] = await Promise.all([
      request.get("/writings/rss.xml"),
      request.get("/robots.txt"),
      request.get("/sitemap.xml"),
      request.get("/api/projects"),
    ]);

    assertStatusOk(writingsRss, "/writings/rss.xml");
    assertStatusOk(robots, "/robots.txt");
    assertStatusOk(sitemap, "/sitemap.xml");
    assertStatusOk(projects, "/api/projects");

    expect(writingsRss.headers()["content-type"]).toMatch(
      /application\/rss\+xml/,
    );
    expect(projects.headers()["cache-control"]).toContain("no-store");

    expect(await robots.text()).toContain("Sitemap:");
    const sitemapText = await sitemap.text();
    const sitemapLocations = Array.from(
      sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g),
      ([, location]) => new URL(location).pathname,
    );
    expect(sitemapLocations).toContain("/ambient");
    expect(sitemapLocations).toContain("/tiny-thoughts");
    expect(sitemapLocations).not.toContain("/music");
    expect(sitemapLocations).not.toContain("/updates");
    expect(sitemapLocations).not.toContain("/movies-tv");
    expect(sitemapLocations).not.toContain("/games/between-two-lodges");
    expect(sitemapLocations).toContain(
      "/games/between-two-lodges/index.html",
    );

    const projectsJson = (await projects.json()) as { projects: unknown[] };

    expect(Array.isArray(projectsJson.projects)).toBeTruthy();
  },
);

test(
  "database-backed Tiny Thoughts endpoints respond with expected shapes",
  { tag: "@database" },
  async ({ request }) => {
    const [tinyThoughtsRss, tinyThoughts] = await Promise.all([
      request.get("/tiny-thoughts/rss.xml"),
      request.get("/api/tiny-thoughts?limit=3"),
    ]);

    assertStatusOk(tinyThoughtsRss, "/tiny-thoughts/rss.xml");
    assertStatusOk(tinyThoughts, "/api/tiny-thoughts?limit=3");
    expect(tinyThoughtsRss.headers()["content-type"]).toMatch(
      /application\/rss\+xml/,
    );
    expect(tinyThoughtsRss.headers()["cache-control"]).toContain("no-store");
    expect(tinyThoughts.headers()["cache-control"]).toContain("no-store");

    const tinyThoughtsJson = (await tinyThoughts.json()) as {
      thoughts: unknown[];
    };

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
