import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "../../../../lib/admin-auth";
import { hasBlobWriteAccess, putProjectBlob } from "../../../../lib/blob";

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
        { error: "Project images must be PNG, JPG, GIF, or WebP." },
        { status: 400 },
      );
    }

    if (file.size > maxImageBytes) {
      return Response.json(
        { error: "Project images must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pathname = `projects/${randomUUID()}.${fileExtension(file)}`;
    const blob = await putProjectBlob(pathname, buffer, {
      access: "public",
      contentType: file.type,
    });

    return Response.json({
      ok: true,
      imageUrl: blob.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown project Blob upload error.";

    console.error("Project Blob upload failed", {
      message,
      error,
    });

    return Response.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "Project image could not be uploaded."
            : `Project image could not be uploaded. ${message}`,
      },
      { status: 500 },
    );
  }
}
