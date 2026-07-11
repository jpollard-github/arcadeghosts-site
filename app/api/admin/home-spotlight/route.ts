import { parseJsonBody, requireAdminJson } from "../../../lib/admin-route";
import { getSiteSql } from "../../../lib/database";
import { saveHomeSpotlight } from "../../../lib/home-spotlight-write-transactions";
import {
  getAdminHomeSpotlight,
  emptyHomeSpotlightQueueItem,
  normalizeHomeSpotlightHref,
  normalizeHomeSpotlightText,
  type HomeSpotlightQueueItem,
  type HomeSpotlightRecord,
} from "../../../lib/home-spotlight";

export const runtime = "nodejs";

function normalizeHomeSpotlight(value: unknown): HomeSpotlightRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const eyebrow = normalizeHomeSpotlightText(candidate.eyebrow, 80);
  const title = normalizeHomeSpotlightText(candidate.title, 180);
  const text = normalizeHomeSpotlightText(candidate.text, 800);
  const linkLabel = normalizeHomeSpotlightText(candidate.linkLabel, 80);
  const linkHref = normalizeHomeSpotlightHref(candidate.linkHref);
  const enabled = typeof candidate.enabled === "boolean" ? candidate.enabled : false;

  if (!eyebrow || !title || !text || !linkLabel || !linkHref) {
    return null;
  }

  return {
    id: "main",
    eyebrow,
    title,
    text,
    linkLabel,
    linkHref,
    enabled,
  };
}

function normalizeHomeSpotlightQueueItem(
  value: unknown,
  index: number,
): HomeSpotlightQueueItem | null {
  const normalized = normalizeHomeSpotlight(value);

  if (!normalized) {
    return null;
  }

  return {
    ...emptyHomeSpotlightQueueItem(index),
    ...normalized,
    id:
      (typeof (value as { id?: unknown })?.id === "string" &&
      normalizeHomeSpotlightText((value as { id?: unknown }).id, 120))
        || emptyHomeSpotlightQueueItem(index).id,
    displayOrder: index,
  };
}

export async function GET(request: Request) {
  const unauthorized = await requireAdminJson(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    return Response.json(await getAdminHomeSpotlight());
  } catch (error) {
    console.error("Admin home spotlight GET failed", error);
    return Response.json({ error: "Home spotlight is unavailable." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminJson(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const spotlight = normalizeHomeSpotlight(body.spotlight);
    const rawQueue = Array.isArray(body.queue) ? body.queue : [];
    const queue = rawQueue
      .map((item, index) => normalizeHomeSpotlightQueueItem(item, index))
      .filter((item): item is HomeSpotlightQueueItem => Boolean(item));

    if (queue.length !== rawQueue.length) {
      return Response.json(
        {
          error:
            "Every spotlight queue item needs an eyebrow, title, text, link label, and link href before saving.",
        },
        { status: 400 },
      );
    }

    if (!spotlight) {
      return Response.json(
        { error: "Eyebrow, title, text, link label, and link href are required." },
        { status: 400 },
      );
    }

    const sql = getSiteSql();

    await saveHomeSpotlight(sql, spotlight, queue);

    return Response.json({
      ok: true,
      ...(await getAdminHomeSpotlight()),
    });
  } catch (error) {
    console.error("Admin home spotlight PUT failed", error);
    return Response.json({ error: "Home spotlight could not be saved." }, { status: 500 });
  }
}
