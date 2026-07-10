import test from "node:test";
import assert from "node:assert/strict";
import manifest from "../../app/manifest";

test("Ambient manifest launches as a fullscreen landscape display", () => {
  const value = manifest();

  assert.equal(value.name, "ArcadeGhosts Ambient");
  assert.equal(value.short_name, "AG Ambient");
  assert.equal(value.start_url, "/ambient");
  assert.equal(value.scope, "/ambient");
  assert.equal(value.display, "fullscreen");
  assert.equal(value.orientation, "landscape");
  assert.equal(value.theme_color, "#08090c");
  assert.deepEqual(
    value.icons?.map((icon) => [icon.sizes, icon.purpose]),
    [
      ["192x192", "any"],
      ["512x512", "any"],
      ["512x512", "maskable"],
    ],
  );
});
