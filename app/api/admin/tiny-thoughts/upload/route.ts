import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { hasBlobWriteAccess, putTinyThoughtBlob } from "../../../../lib/blob";

export const runtime = "nodejs";

const maxImageBytes = 5 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function fileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  return file.type.split("/")[1] || "image";
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Admin login required." }, { status: 401 });
  }

  if (!hasBlobWriteAccess()) {
    return Response.json(
      { error: "Blob storage is not configured for this environment." },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Choose an image file to upload." }, { status: 400 });
    }

    if (!allowedImageTypes.has(file.type)) {
      return Response.json(
        { error: "Tiny Thoughts images must be PNG, JPG, GIF, or WebP." },
        { status: 400 },
      );
    }

    if (file.size > maxImageBytes) {
      return Response.json(
        { error: "Tiny Thoughts images must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pathname = `tiny-thoughts/${randomUUID()}.${fileExtension(file)}`;
    const blob = await putTinyThoughtBlob(pathname, buffer, {
      access: "public",
      contentType: file.type,
    });

    return Response.json({
      ok: true,
      attachment: {
        type: "image",
        url: blob.url,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Tiny Thoughts Blob upload error.";

    console.error("Tiny Thoughts Blob upload failed", {
      message,
      error,
    });

    return Response.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "Image could not be uploaded."
            : `Image could not be uploaded. ${message}`,
      },
      { status: 500 },
    );
  }
}
