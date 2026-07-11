import { randomUUID } from "crypto";
import { imageDimensionsFromData } from "image-dimensions";

const DEFAULT_MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const DEFAULT_MAX_IMAGE_DIMENSION = 16_384;
const DEFAULT_MAX_IMAGE_PIXELS = 64_000_000;
const DEFAULT_ALLOWED_IMAGE_TYPES = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type SupportedImageType = "png" | "jpeg" | "gif" | "webp";
export type SupportedImageContentType =
  | "image/png"
  | "image/jpeg"
  | "image/gif"
  | "image/webp";
export type SupportedImageExtension = "png" | "jpg" | "gif" | "webp";

type VerifiedImageFormat = {
  contentType: SupportedImageContentType;
  extension: SupportedImageExtension;
};

const verifiedImageFormats: Record<SupportedImageType, VerifiedImageFormat> = {
  png: { contentType: "image/png", extension: "png" },
  jpeg: { contentType: "image/jpeg", extension: "jpg" },
  gif: { contentType: "image/gif", extension: "gif" },
  webp: { contentType: "image/webp", extension: "webp" },
};

type ValidateImageUploadOptions = {
  allowedTypes?: ReadonlySet<string>;
  label: string;
  maxBytes?: number;
  maxDimension?: number;
  maxPixels?: number;
};

export type ValidatedImageUpload = {
  buffer: Buffer;
  contentType: SupportedImageContentType;
  extension: SupportedImageExtension;
  height: number;
  originalFile: File;
  type: SupportedImageType;
  width: number;
};

export type ImageUploadValidation =
  | { ok: true; upload: ValidatedImageUpload }
  | { ok: false; error: string };

function formatUploadSizeLimit(maxBytes: number) {
  const megabytes = maxBytes / (1024 * 1024);
  const rounded = Math.round(megabytes * 10) / 10;
  const label = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);

  return `${label} MB`;
}

function formatMegapixels(maxPixels: number) {
  const megapixels = maxPixels / 1_000_000;
  return Number.isInteger(megapixels) ? String(megapixels) : megapixels.toFixed(1);
}

function isSupportedImageType(type: string): type is SupportedImageType {
  return type in verifiedImageFormats;
}

function invalidImageError(label: string) {
  return `${label} must contain a valid PNG, JPG, GIF, or WebP image.`;
}

export function createImageUploadPath(
  scope: string,
  extension: SupportedImageExtension,
) {
  return `${scope}/${randomUUID()}.${extension}`;
}

export async function validateImageUpload(
  file: unknown,
  {
    allowedTypes = DEFAULT_ALLOWED_IMAGE_TYPES,
    label,
    maxBytes = DEFAULT_MAX_IMAGE_BYTES,
    maxDimension = DEFAULT_MAX_IMAGE_DIMENSION,
    maxPixels = DEFAULT_MAX_IMAGE_PIXELS,
  }: ValidateImageUploadOptions,
): Promise<ImageUploadValidation> {
  if (!(file instanceof File)) {
    return { ok: false, error: "Choose an image file to upload." };
  }

  if (!allowedTypes.has(file.type)) {
    return {
      ok: false,
      error: `${label} must be PNG, JPG, GIF, or WebP.`,
    };
  }

  if (file.size === 0) {
    return { ok: false, error: `${label} must not be empty.` };
  }

  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `${label} must be ${formatUploadSizeLimit(maxBytes)} or smaller.`,
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.byteLength === 0) {
    return { ok: false, error: `${label} must not be empty.` };
  }

  if (buffer.byteLength > maxBytes) {
    return {
      ok: false,
      error: `${label} must be ${formatUploadSizeLimit(maxBytes)} or smaller.`,
    };
  }

  let dimensions: ReturnType<typeof imageDimensionsFromData>;

  try {
    dimensions = imageDimensionsFromData(buffer);
  } catch {
    return { ok: false, error: invalidImageError(label) };
  }

  if (!dimensions || !isSupportedImageType(dimensions.type)) {
    return { ok: false, error: invalidImageError(label) };
  }

  const format = verifiedImageFormats[dimensions.type];

  if (file.type !== format.contentType) {
    return {
      ok: false,
      error: `${label} file type does not match its contents.`,
    };
  }

  const { width, height } = dimensions;

  if (
    !Number.isFinite(width) ||
    !Number.isInteger(width) ||
    width <= 0 ||
    !Number.isFinite(height) ||
    !Number.isInteger(height) ||
    height <= 0
  ) {
    return { ok: false, error: invalidImageError(label) };
  }

  const pixels = width * height;

  if (width > maxDimension || height > maxDimension || pixels > maxPixels) {
    return {
      ok: false,
      error: `${label} must be no larger than ${maxDimension} × ${maxDimension} pixels or ${formatMegapixels(maxPixels)} megapixels.`,
    };
  }

  return {
    ok: true,
    upload: {
      buffer,
      contentType: format.contentType,
      extension: format.extension,
      height,
      originalFile: file,
      type: dimensions.type,
      width,
    },
  };
}
