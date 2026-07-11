import assert from "node:assert/strict";
import test from "node:test";
import {
  createImageUploadPath,
  validateImageUpload,
  type SupportedImageContentType,
  type SupportedImageExtension,
  type SupportedImageType,
} from "../../app/lib/upload";

const imageFixtures = {
  png: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  ),
  jpeg: Buffer.from(
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/EB//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/EB//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/EB//2Q==",
    "base64",
  ),
  gif: Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64"),
  webp: Buffer.from(
    "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEALmk0mk0iIiIiIgBoSygABc6zbAAA",
    "base64",
  ),
} satisfies Record<SupportedImageType, Buffer>;

const formatCases: Array<{
  type: SupportedImageType;
  contentType: SupportedImageContentType;
  extension: SupportedImageExtension;
}> = [
  { type: "png", contentType: "image/png", extension: "png" },
  { type: "jpeg", contentType: "image/jpeg", extension: "jpg" },
  { type: "gif", contentType: "image/gif", extension: "gif" },
  { type: "webp", contentType: "image/webp", extension: "webp" },
];

function imageFile(
  type: SupportedImageType,
  name: string,
  contentType: string,
  bytes = imageFixtures[type],
) {
  return new File([bytes], name, { type: contentType });
}

function pngWithDimensions(width: number, height: number) {
  const bytes = Buffer.from(imageFixtures.png);
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return bytes;
}

test("valid PNG returns verified metadata and dimensions", async () => {
  const result = await validateImageUpload(
    imageFile("png", "signal.png", "image/png"),
    { label: "Project images" },
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.upload.type, "png");
  assert.equal(result.upload.contentType, "image/png");
  assert.equal(result.upload.extension, "png");
  assert.equal(result.upload.width, 1);
  assert.equal(result.upload.height, 1);
  assert.deepEqual(result.upload.buffer, imageFixtures.png);
});

for (const { type, contentType, extension } of formatCases) {
  test(`valid ${type} maps to canonical MIME and extension`, async () => {
    const result = await validateImageUpload(
      imageFile(type, `signal.${extension}`, contentType),
      { label: "Project images" },
    );

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.upload.type, type);
    assert.equal(result.upload.contentType, contentType);
    assert.equal(result.upload.extension, extension);
    assert.equal(result.upload.width, 1);
    assert.equal(result.upload.height, 1);
  });
}

test("filename extension cannot override verified PNG extension", async () => {
  for (const name of [
    "signal.php",
    "signal.html",
    "signal.png.exe",
    "SIGNAL.JPEG",
    "signal",
  ]) {
    const result = await validateImageUpload(imageFile("png", name, "image/png"), {
      label: "Project images",
    });

    assert.equal(result.ok, true);
    if (!result.ok) continue;
    const path = createImageUploadPath("projects", result.upload.extension);
    assert.match(path, /^projects\/[0-9a-f-]+\.png$/);
    assert.doesNotMatch(path, /\.(?:html|php|exe|jpeg)$/i);
  }
});

test("claimed PNG containing HTML is rejected as invalid content", async () => {
  const file = new File(
    [new TextEncoder().encode("<html>not an image</html>")],
    "signal.png",
    { type: "image/png" },
  );

  const result = await validateImageUpload(file, { label: "Project images" });
  assert.deepEqual(result, {
    ok: false,
    error: "Project images must contain a valid PNG, JPG, GIF, or WebP image.",
  });
});

test("declared PNG containing JPEG bytes is rejected as a mismatch", async () => {
  const result = await validateImageUpload(
    imageFile("jpeg", "signal.png", "image/png"),
    { label: "Project images" },
  );

  assert.deepEqual(result, {
    ok: false,
    error: "Project images file type does not match its contents.",
  });
});

test("valid PNG with unsupported declared HTML type is rejected", async () => {
  const result = await validateImageUpload(
    imageFile("png", "signal.html", "text/html"),
    { label: "Project images" },
  );

  assert.deepEqual(result, {
    ok: false,
    error: "Project images must be PNG, JPG, GIF, or WebP.",
  });
});

test("unsupported SVG is rejected", async () => {
  const file = new File(
    ["<svg xmlns='http://www.w3.org/2000/svg'/>"],
    "signal.svg",
    { type: "image/svg+xml" },
  );

  const result = await validateImageUpload(file, { label: "Project images" });
  assert.deepEqual(result, {
    ok: false,
    error: "Project images must be PNG, JPG, GIF, or WebP.",
  });
});

test("empty image is rejected", async () => {
  const result = await validateImageUpload(
    new File([], "signal.png", { type: "image/png" }),
    { label: "Project images" },
  );

  assert.deepEqual(result, {
    ok: false,
    error: "Project images must not be empty.",
  });
});

test("truncated image header becomes a validation failure", async () => {
  const result = await validateImageUpload(
    new File([imageFixtures.png.subarray(0, 12)], "signal.png", { type: "image/png" }),
    { label: "Project images" },
  );

  assert.deepEqual(result, {
    ok: false,
    error: "Project images must contain a valid PNG, JPG, GIF, or WebP image.",
  });
});

test("file larger than configured byte limit is rejected", async () => {
  const maxBytes = imageFixtures.png.byteLength - 1;
  const result = await validateImageUpload(
    imageFile("png", "signal.png", "image/png"),
    { label: "Project images", maxBytes },
  );

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.match(result.error, /must be .* MB or smaller/);
});

test("default upload limit rejects files larger than 4 MB", async () => {
  const file = new File(
    [new Uint8Array(4 * 1024 * 1024 + 1)],
    "oversized.png",
    { type: "image/png" },
  );
  const result = await validateImageUpload(file, { label: "Project images" });

  assert.deepEqual(result, {
    ok: false,
    error: "Project images must be 4 MB or smaller.",
  });
});

test("image width above maximum dimension is rejected", async () => {
  const result = await validateImageUpload(
    imageFile("png", "wide.png", "image/png", pngWithDimensions(5, 2)),
    { label: "Project images", maxDimension: 4, maxPixels: 100 },
  );
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /no larger than 4 × 4 pixels/);
});

test("image height above maximum dimension is rejected", async () => {
  const result = await validateImageUpload(
    imageFile("png", "tall.png", "image/png", pngWithDimensions(2, 5)),
    { label: "Project images", maxDimension: 4, maxPixels: 100 },
  );
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /no larger than 4 × 4 pixels/);
});

test("image pixel count above maximum is rejected", async () => {
  const result = await validateImageUpload(
    imageFile("png", "dense.png", "image/png", pngWithDimensions(3, 3)),
    { label: "Project images", maxDimension: 3, maxPixels: 8 },
  );
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /megapixels/);
});

test("image immediately within dimension and pixel limits is accepted", async () => {
  const result = await validateImageUpload(
    imageFile("png", "allowed.png", "image/png", pngWithDimensions(4, 4)),
    { label: "Project images", maxDimension: 4, maxPixels: 16 },
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.upload.width, 4);
  assert.equal(result.upload.height, 4);
});

test("generated paths retain scope and canonical UUID suffix", () => {
  const path = createImageUploadPath("tiny-thoughts", "jpg");
  assert.match(path, /^tiny-thoughts\/[0-9a-f-]+\.jpg$/);
});
