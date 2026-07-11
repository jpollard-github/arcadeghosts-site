import { getSiteSql } from "./database";

export type HomeSpotlightRecord = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  linkLabel: string;
  linkHref: string;
  enabled: boolean;
};

export type HomeSpotlightQueueItem = HomeSpotlightRecord & {
  displayOrder: number;
};

type HomeSpotlightRow = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  link_label: string;
  link_href: string;
  enabled: boolean | null;
};

type HomeSpotlightQueueRow = HomeSpotlightRow & {
  display_order: number;
};

export const defaultHomeSpotlight: HomeSpotlightRecord = {
  id: "main",
  eyebrow: "Current Signal",
  title: "A quiet card kept offstage.",
  text: "The homepage spotlight is an intentionally dormant experiment and is not part of the public homepage.",
  linkLabel: "Return home",
  linkHref: "/",
  enabled: false,
};

export function emptyHomeSpotlightQueueItem(index = 0): HomeSpotlightQueueItem {
  return {
    id: `queue-${index + 1}-${Date.now()}`,
    eyebrow: "Featured Signal",
    title: "",
    text: "",
    linkLabel: "",
    linkHref: "/",
    enabled: true,
    displayOrder: index,
  };
}

export function normalizeHomeSpotlightText(value: unknown, maxLength = 1200) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, maxLength);
}

export function normalizeHomeSpotlightHref(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const candidate = value.trim();

  if (!candidate) {
    return "";
  }

  if (candidate.startsWith("/") || candidate.startsWith("#")) {
    return candidate;
  }

  try {
    const url = new URL(candidate);

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

function toHomeSpotlightRecord(row: HomeSpotlightRow): HomeSpotlightRecord {
  return {
    id: row.id,
    eyebrow: row.eyebrow,
    title: row.title,
    text: row.body,
    linkLabel: row.link_label,
    linkHref: row.link_href,
    enabled: row.enabled ?? false,
  };
}

function toHomeSpotlightQueueItem(row: HomeSpotlightQueueRow): HomeSpotlightQueueItem {
  return {
    ...toHomeSpotlightRecord(row),
    displayOrder: row.display_order,
  };
}

function getSpotlightRotationIndex(length: number) {
  if (length <= 1) {
    return 0;
  }

  return Math.floor(Date.now() / 86_400_000) % length;
}

export async function getPublicHomeSpotlight() {
  const sql = getSiteSql();
  const queueRows = await sql`
    SELECT
      id,
      eyebrow,
      title,
      body,
      link_label,
      link_href,
      enabled,
      display_order
    FROM home_spotlight_queue
    WHERE enabled = true
    ORDER BY display_order ASC, updated_at DESC
  `;
  const queue = (queueRows as HomeSpotlightQueueRow[]).map(toHomeSpotlightQueueItem);

  if (queue.length) {
    return queue[getSpotlightRotationIndex(queue.length)];
  }

  const rows = await sql`
    SELECT id, eyebrow, title, body, link_label, link_href, enabled
    FROM home_spotlight
    WHERE id = 'main'
    LIMIT 1
  `;

  if (!rows.length) {
    return defaultHomeSpotlight;
  }

  return toHomeSpotlightRecord((rows as HomeSpotlightRow[])[0]);
}

export async function getAdminHomeSpotlight() {
  const sql = getSiteSql();
  const queueRows = await sql`
    SELECT
      id,
      eyebrow,
      title,
      body,
      link_label,
      link_href,
      enabled,
      display_order
    FROM home_spotlight_queue
    ORDER BY display_order ASC, updated_at DESC
  `;

  return {
    spotlight: await (async () => {
      const rows = await sql`
        SELECT id, eyebrow, title, body, link_label, link_href, enabled
        FROM home_spotlight
        WHERE id = 'main'
        LIMIT 1
      `;

      if (!rows.length) {
        return defaultHomeSpotlight;
      }

      return toHomeSpotlightRecord((rows as HomeSpotlightRow[])[0]);
    })(),
    queue: (queueRows as HomeSpotlightQueueRow[]).map(toHomeSpotlightQueueItem),
  };
}
