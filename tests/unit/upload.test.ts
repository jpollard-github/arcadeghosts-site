import assert from "node:assert/strict";
import test from "node:test";
import { createImageUploadPath, validateImageUpload } from "../../app/lib/upload";

test("validateImageUpload accepts a supported image file", () => {
  const file = new File([new Uint8Array([1, 2, 3])], "signal.png", {
    type: "image/png",
  });

  const result = validateImageUpload(file, { label: "Project images" });
  assert.equal(result.ok, true);
});

test("validateImageUpload rejects unsupported image types", () => {
  const file = new File([new Uint8Array([1, 2, 3])], "signal.svg", {
    type: "image/svg+xml",
  });

  const result = validateImageUpload(file, { label: "Project images" });
  assert.deepEqual(result, {
    ok: false,
    error: "Project images must be PNG, JPG, GIF, or WebP.",
  });
});

test("validateImageUpload rejects files larger than the configured limit", () => {
  const maxBytes = 2 * 1024 * 1024;
  const file = new File([new Uint8Array(maxBytes + 1)], "signal.png", {
    type: "image/png",
  });

  const result = validateImageUpload(file, { label: "Project images", maxBytes });
  assert.deepEqual(result, {
    ok: false,
    error: "Project images must be 2 MB or smaller.",
  });
});

test("createImageUploadPath keeps the file extension and scope", () => {
  const file = new File([new Uint8Array([1])], "signal.webp", {
    type: "image/webp",
  });
  const path = createImageUploadPath("tiny-thoughts", file);

  assert.match(path, /^tiny-thoughts\/.+\.webp$/);
});
