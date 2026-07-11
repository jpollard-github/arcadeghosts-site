import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import type { revalidateTag } from "next/cache";
import {
  revalidatePublicProjects,
  revalidatePublicTinyThoughts,
} from "../../app/lib/admin-revalidation";
import {
  publicCacheKeyPrefixes,
  publicCacheRevalidateSeconds,
  publicCacheTags,
} from "../../app/lib/public-cache";

test("public cache policy uses stable, distinct tags and key prefixes", () => {
  assert.equal(publicCacheTags.projects, "arcadeghosts-public-projects");
  assert.equal(publicCacheTags.tinyThoughts, "arcadeghosts-public-tiny-thoughts");
  assert.ok(publicCacheTags.projects.length > 0);
  assert.ok(publicCacheTags.tinyThoughts.length > 0);
  assert.notEqual(publicCacheTags.projects, publicCacheTags.tinyThoughts);
  assert.notEqual(publicCacheKeyPrefixes.projects, publicCacheKeyPrefixes.tinyThoughts);
});

test("public cache revalidation backstops are positive integers", () => {
  for (const seconds of Object.values(publicCacheRevalidateSeconds)) {
    assert.ok(Number.isInteger(seconds));
    assert.ok(seconds > 0);
  }
});

test("public cache invalidation expires only its intended tag", () => {
  const calls: Array<[string, unknown]> = [];
  const expireTag: typeof revalidateTag = (tag, profile) => {
    calls.push([tag, profile]);
    return undefined;
  };

  revalidatePublicProjects(expireTag);
  assert.deepEqual(calls, [[publicCacheTags.projects, { expire: 0 }]]);

  calls.length = 0;
  revalidatePublicTinyThoughts(expireTag);
  assert.deepEqual(calls, [[publicCacheTags.tinyThoughts, { expire: 0 }]]);
});

test("public cache architecture stays focused on tagged data reads", async () => {
  const root = process.cwd();
  const read = (file: string) => readFile(path.join(root, file), "utf8");
  const [home, search, ambient, revalidation, spotlight, projects, tinyThoughts] =
    await Promise.all([
      read("app/page.tsx"),
      read("app/search/page.tsx"),
      read("app/ambient/page.tsx"),
      read("app/lib/admin-revalidation.ts"),
      read("app/api/admin/home-spotlight/route.ts"),
      read("app/lib/projects.ts"),
      read("app/lib/tiny-thoughts.ts"),
    ]);

  for (const page of [home, search, ambient]) {
    assert.doesNotMatch(page, /force-dynamic/);
  }
  assert.doesNotMatch(revalidation, /revalidatePath/);
  assert.doesNotMatch(spotlight, /revalidatePath/);
  assert.match(projects, /publicCacheTags\.projects/);
  assert.match(tinyThoughts, /publicCacheTags\.tinyThoughts/);

  for (const route of [
    "app/api/projects/route.ts",
    "app/api/tiny-thoughts/route.ts",
    "app/tiny-thoughts/rss.xml/route.ts",
  ]) {
    assert.match(await read(route), /"Cache-Control": "no-store"/);
  }
});
