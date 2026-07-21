import { expect, test } from "@playwright/test";

test("arcade page renders cabinet favorites", async ({ page }) => {
  await page.goto("/arcade");

  await expect(
    page.getByRole("heading", { name: "Quarter-light favorites." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Back Home" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Galaga" })).toBeVisible();
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

test("listening page renders all albums with album-specific links", async ({ page }) => {
  await page.goto("/listening");

  await expect(
    page.getByRole("heading", { name: "Albums I keep coming back to." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Back Home" })).toBeVisible();
  await expect(page.locator(".album-card")).toHaveCount(50);
  await expect(
    page.getByRole("heading", { name: "Drive: Original Motion Picture Soundtrack" }),
  ).toBeVisible();

  const title = "Hysteria";
  const artist = "Def Leppard";
  const detailsUrl = "https://en.wikipedia.org/wiki/Hysteria_(Def_Leppard_album)";
  const sourceUrl = "https://en.wikipedia.org/wiki/File:Def_Leppard_-_Hysteria_(vinyl_version).jpg";
  const card = page.locator(".album-card").first();

  await expect(card.getByRole("heading", { name: title }).getByRole("link")).toHaveAttribute(
    "href",
    detailsUrl,
  );
  await expect(card.getByText(artist, { exact: true })).toBeVisible();
  await expect(
    card.getByRole("link", { name: `View details for ${title} by ${artist}` }),
  ).toHaveAttribute("href", detailsUrl);
  await expect(
    card.getByRole("link", { name: `Image source for ${title} by ${artist}` }),
  ).toHaveAttribute("href", sourceUrl);
  await expect(card.getByText("Image source", { exact: true })).toBeVisible();
});

test("homepage listening preview contains exactly the first six albums", async ({ page }) => {
  await page.goto("/");

  const preview = page.getByLabel("Listening preview");
  await expect(preview.locator(".album-card")).toHaveCount(6);
  await expect(preview.locator("h3")).toHaveText([
    "Hysteria",
    "Pretty Hate Machine",
    "Escape",
    "The Rise and Fall of a Midwest Princess",
    "The Bones of What You Believe",
    "Soundtrack from Twin Peaks",
  ]);
  await expect(preview.getByRole("heading", { name: "Enema of the State" })).toHaveCount(0);
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

test("retired worker unregisters without intercepting requests", async ({
  request,
}) => {
  const workerResponse = await request.get("/sw.js");

  expect(workerResponse.ok()).toBeTruthy();
  const workerText = await workerResponse.text();

  expect(workerText).toContain("self.skipWaiting()");
  expect(workerText).toContain("self.registration.unregister()");
  expect(workerText).toContain("caches.delete(cacheName)");
  expect(workerText).not.toContain('addEventListener("fetch"');
  expect(workerText).not.toContain("caches.open");
});

test("retired Ambient URLs redirect to normal public chrome", async ({ page }) => {
  for (const route of ["/ambient", "/ambient/diagnostic-solid"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("body")).not.toHaveClass(/ambient-mode/);
    await expect(page.locator("[data-ambient-root], [data-ambient-solid-diagnostic]")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "ArcadeGhosts home" })).toBeVisible();
    await expect(page.getByRole("contentinfo", { name: "Public site footer" })).toBeVisible();
  }
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
    expect(await robots.text()).toContain("Disallow: /agents");
    const sitemapText = await sitemap.text();
    const sitemapLocations = Array.from(
      sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g),
      ([, location]) => new URL(location).pathname,
    );
    expect(sitemapLocations).not.toContain("/ambient");
    expect(sitemapLocations).toContain("/listening");
    expect(sitemapLocations).toContain("/tiny-thoughts");
    expect(sitemapLocations).not.toContain("/music");
    expect(sitemapLocations).not.toContain("/updates");
    expect(sitemapLocations).not.toContain("/movies-tv");
    expect(sitemapLocations).not.toContain("/agents");
    expect(sitemapLocations).not.toContain("/games/between-two-lodges");
    expect(sitemapLocations).toContain(
      "/games/between-two-lodges/index.html",
    );

    const projectsJson = (await projects.json()) as { projects: unknown[] };

    expect(Array.isArray(projectsJson.projects)).toBeTruthy();
  },
);

test("agents stays reachable but opts out of indexing and public discovery", async ({ page }) => {
  await page.goto("/agents");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex, nofollow/i,
  );

  await page.goto("/");
  await expect(page.locator('a[href="/agents"]')).toHaveCount(0);
});

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
