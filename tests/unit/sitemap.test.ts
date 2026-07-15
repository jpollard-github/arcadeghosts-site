import assert from "node:assert/strict";
import test from "node:test";
import sitemap from "../../app/sitemap";
import { writings } from "../../app/writings";

const sitemapEntries = sitemap();
const sitemapUrls = sitemapEntries.map((entry) => entry.url);
const sitemapPaths = sitemapUrls.map((url) => new URL(url).pathname);

test("sitemap includes canonical public routes and excludes redirect-only routes", () => {
  assert.equal(sitemapPaths.filter((path) => path === "/").length, 1);
  assert.ok(sitemapPaths.includes("/screening"));
  assert.ok(!sitemapPaths.includes("/movies-tv"));
  assert.ok(!sitemapPaths.includes("/agents"));
  assert.ok(sitemapPaths.includes("/games/between-two-lodges/index.html"));
  assert.ok(!sitemapPaths.includes("/games/between-two-lodges"));
});

test("sitemap omits unsupported modification dates and duplicate URLs", () => {
  assert.ok(sitemapEntries.every((entry) => entry.lastModified === undefined));
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
});

test("sitemap includes every repository-backed writing", () => {
  for (const writing of writings) {
    assert.ok(sitemapPaths.includes(`/writings/${writing.slug}`));
  }
});
