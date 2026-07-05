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
  await expect(
    page.getByRole("link", { name: "Back Home" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Galaga" }),
  ).toBeVisible();
});

test("about page renders identity and resonance sections", async ({ page }) => {
  await page.goto("/about");

  await expect(
    page.getByRole("heading", { name: "Who I am and how I think." }),
  ).toBeVisible();
  await expect(page.getByText("Some places on the internet that resonate with me:")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "The Five Agents" }),
  ).toBeVisible();
});

test("screening page renders the media grid", async ({ page }) => {
  await page.goto("/screening");

  await expect(
    page.getByRole("heading", { name: "Stories that keep following me around." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back Home" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Twin Peaks Season 1" }),
  ).toBeVisible();
});

test("legacy movies and tv route redirects to screening", async ({ page }) => {
  await page.goto("/movies-tv");

  await expect(page).toHaveURL(/\/screening$/);
  await expect(
    page.getByRole("heading", { name: "Stories that keep following me around." }),
  ).toBeVisible();
});

test("terminal page renders the standalone green terminal", async ({ page }) => {
  await page.goto("/terminal");

  await expect(
    page.getByRole("heading", { name: "The green-screen room has its own door now." }),
  ).toBeVisible();
  await expect(page.getByText("80s Dev Terminal")).toBeVisible();
  await expect(page.getByRole("link", { name: "Back Home" })).toHaveAttribute(
    "href",
    "/#fun-and-games",
  );
});

test("search page can find twin peaks rooms and public writings", async ({ page }) => {
  await page.goto("/search");

  await expect(
    page.getByRole("heading", { name: "Find a room by signal instead of by hallway." }),
  ).toBeVisible();
  await expect(page.getByText("Showing a featured mix of places to start.")).toBeVisible();

  await page.getByRole("searchbox").fill("Twin Peaks");

  await expect(page.getByText(/result(s)? for "Twin Peaks"\./)).toBeVisible();
  await expect(
    page
      .getByRole("article")
      .filter({ has: page.getByRole("link", { name: "Enter the lodges" }) })
      .getByRole("heading", { name: "The Lodges Within" }),
  ).toBeVisible();
});

test("writings index and a writing detail page render correctly", async ({ page }) => {
  await page.goto("/writings");

  await expect(
    page.getByRole("heading", { name: "Essays from the booth by the window." }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Read piece" }).first().click();

  await expect(page).toHaveURL(/\/writings\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("region", { name: "A few nearby signals." })).toBeVisible();
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

test("removed public routes return not found", async ({ page }) => {
  for (const route of ["/build-log", "/updates", "/work-with-me"]) {
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
  await expect(
    page.getByRole("button", { name: "Try Again" }),
  ).toBeVisible();
});

test("public feed, sitemap, robots, and json endpoints respond with expected shapes", async ({
  request,
}) => {
  const [tinyThoughtsRss, writingsRss, robots, sitemap, projects, now, guestbook, tinyThoughts] =
    await Promise.all([
      request.get("/tiny-thoughts/rss.xml"),
      request.get("/writings/rss.xml"),
      request.get("/robots.txt"),
      request.get("/sitemap.xml"),
      request.get("/api/projects"),
      request.get("/api/now"),
      request.get("/api/guestbook"),
      request.get("/api/tiny-thoughts?limit=3"),
    ]);

  assertStatusOk(tinyThoughtsRss);
  assertStatusOk(writingsRss);
  assertStatusOk(robots);
  assertStatusOk(sitemap);
  assertStatusOk(projects);
  assertStatusOk(now);
  assertStatusOk(guestbook);
  assertStatusOk(tinyThoughts);

  expect(tinyThoughtsRss.headers()["content-type"]).toMatch(/application\/rss\+xml/);
  expect(writingsRss.headers()["content-type"]).toMatch(/application\/rss\+xml/);

  expect(await robots.text()).toContain("Sitemap:");
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("/tiny-thoughts");
  expect(sitemapText).not.toContain("/build-log");
  expect(sitemapText).not.toContain("/updates");

  const projectsJson = (await projects.json()) as { projects: unknown[] };
  const nowJson = (await now.json()) as { items: unknown[] };
  const guestbookJson = (await guestbook.json()) as { entries: unknown[] };
  const tinyThoughtsJson = (await tinyThoughts.json()) as { thoughts: unknown[] };

  expect(Array.isArray(projectsJson.projects)).toBeTruthy();
  expect(Array.isArray(nowJson.items)).toBeTruthy();
  expect(Array.isArray(guestbookJson.entries)).toBeTruthy();
  expect(Array.isArray(tinyThoughtsJson.thoughts)).toBeTruthy();
  expect(tinyThoughtsJson.thoughts.length).toBeLessThanOrEqual(3);
});

function assertStatusOk(response: { ok(): boolean; status(): number }) {
  expect(response.ok(), `expected ${response.status()} to be ok`).toBeTruthy();
}
