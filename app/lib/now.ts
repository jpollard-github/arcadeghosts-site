import { getSiteSql } from "./database";

export type NowItem = {
  id: string;
  label: string;
  title: string;
  text: string;
};

export type NowItemRow = {
  id: string;
  label: string;
  title: string;
  body: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export const defaultNowItems: NowItem[] = [
  {
    id: "building-living-portfolio",
    label: "Building",
    title: "ArcadeGhosts as a living portfolio",
    text: "Turning this site into a clearer home for active projects, writing, experiments, and the weird little signals that make the work feel alive.",
  },
  {
    id: "exploring-meaning-making-tools",
    label: "Exploring",
    title: "Meaning-making tools",
    text: "Developing The Lodges Within and Between Two Lodges as symbolic, self-guided systems for reflection, attention, and story-shaped insight.",
  },
  {
    id: "practicing-finishing",
    label: "Practicing",
    title: "Finishing without flattening",
    text: "Keeping the strange heartbeat while making the work easier to understand, revisit, share, and build on.",
  },
];

export function normalizeNowText(value: unknown, maxLength = 1000) {
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

export function toNowItem(row: NowItemRow): NowItem {
  return {
    id: row.id,
    label: row.label,
    title: row.title,
    text: row.body,
  };
}

export async function ensureNowItemsTable() {
  const sql = getSiteSql();

  await sql`
    CREATE TABLE IF NOT EXISTS site_now_items (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS site_now_items_display_order_idx
    ON site_now_items (display_order ASC)
  `;
}

export async function getPublicNowItems() {
  const storedItems = loadStoredNowItems().catch(() => defaultNowItems);
  const fallback = new Promise<NowItem[]>((resolve) => {
    setTimeout(() => resolve(defaultNowItems), 1200);
  });

  return Promise.race([storedItems, fallback]);
}

async function loadStoredNowItems() {
  await ensureNowItemsTable();
  const sql = getSiteSql();
  const rows = await sql`
    SELECT
      id,
      label,
      title,
      body,
      display_order,
      created_at,
      updated_at
    FROM site_now_items
    ORDER BY display_order ASC, title ASC
  `;

  const items = (rows as NowItemRow[]).map(toNowItem);

  return items.length ? items : defaultNowItems;
}

export async function getAdminNowItems() {
  await ensureNowItemsTable();
  const sql = getSiteSql();
  const rows = await sql`
    SELECT
      id,
      label,
      title,
      body,
      display_order,
      created_at,
      updated_at
    FROM site_now_items
    ORDER BY display_order ASC, title ASC
  `;

  const items = (rows as NowItemRow[]).map(toNowItem);

  return items.length ? items : defaultNowItems;
}
