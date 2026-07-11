import type { getSiteSql } from "./database";
import type { NowItem } from "./now";

type SiteSql = ReturnType<typeof getSiteSql>;

export async function saveNowItems(
  sql: SiteSql,
  items: NowItem[],
  existingIds: string[],
) {
  const savedIds = new Set(items.map((item) => item.id));
  const queries = items.map((item, displayOrder) => sql`
    INSERT INTO site_now_items (
      id,
      label,
      title,
      body,
      display_order
    )
    VALUES (
      ${item.id},
      ${item.label},
      ${item.title},
      ${item.text},
      ${displayOrder}
    )
    ON CONFLICT (id)
    DO UPDATE SET
      label = EXCLUDED.label,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      display_order = EXCLUDED.display_order,
      updated_at = now()
  `);

  for (const id of existingIds) {
    if (!savedIds.has(id)) {
      queries.push(sql`DELETE FROM site_now_items WHERE id = ${id}`);
    }
  }

  await sql.transaction(queries);
}
