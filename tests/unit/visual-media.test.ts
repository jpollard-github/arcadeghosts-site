import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { visualMedia } from "../../app/site-content/visual-media";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");

function assertWebUrl(value: string, label: string) {
  const url = new URL(value);
  assert.ok(
    url.protocol === "http:" || url.protocol === "https:",
    `${label} must use http or https`,
  );
}

test("visual media entries reference valid unique local images and web URLs", () => {
  const titles = new Set<string>();
  const images = new Set<string>();

  for (const item of visualMedia) {
    assert.ok(!titles.has(item.title), `duplicate title: ${item.title}`);
    assert.ok(!images.has(item.image), `duplicate image: ${item.image}`);
    titles.add(item.title);
    images.add(item.image);

    assert.ok(
      item.image.startsWith("/images/movies-tv/"),
      `${item.title} image must be beneath /images/movies-tv/`,
    );
    assert.ok(item.image.endsWith(".webp"), `${item.title} image must be WebP`);
    assert.ok(
      existsSync(path.join(repositoryRoot, "public", item.image)),
      `${item.title} image does not exist beneath public/`,
    );

    assertWebUrl(item.detailsUrl, `${item.title} detailsUrl`);
    assertWebUrl(item.sourceUrl, `${item.title} sourceUrl`);
    if (item.imageFit !== undefined) {
      assert.ok(
        item.imageFit === "cover" || item.imageFit === "contain",
        `${item.title} imageFit must be cover or contain`,
      );
    }
    if (item.comment !== undefined) {
      assert.ok(item.comment.trim(), `${item.title} comment must not be blank`);
    }
  }
});
