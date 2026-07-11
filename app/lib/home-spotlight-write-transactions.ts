import type { getSiteSql } from "./database";
import type { HomeSpotlightQueueItem, HomeSpotlightRecord } from "./home-spotlight";

type SiteSql = ReturnType<typeof getSiteSql>;

export async function saveHomeSpotlight(
  sql: SiteSql,
  spotlight: HomeSpotlightRecord,
  queue: HomeSpotlightQueueItem[],
) {
  const queries = [
    sql`
      INSERT INTO home_spotlight (
        id,
        eyebrow,
        title,
        body,
        link_label,
        link_href,
        enabled,
        updated_at
      )
      VALUES (
        'main',
        ${spotlight.eyebrow},
        ${spotlight.title},
        ${spotlight.text},
        ${spotlight.linkLabel},
        ${spotlight.linkHref},
        ${spotlight.enabled},
        now()
      )
      ON CONFLICT (id)
      DO UPDATE SET
        eyebrow = EXCLUDED.eyebrow,
        title = EXCLUDED.title,
        body = EXCLUDED.body,
        link_label = EXCLUDED.link_label,
        link_href = EXCLUDED.link_href,
        enabled = EXCLUDED.enabled,
        updated_at = now()
    `,
    sql`DELETE FROM home_spotlight_queue`,
  ];

  for (let index = 0; index < queue.length; index += 1) {
    const item = queue[index];
    queries.push(sql`
      INSERT INTO home_spotlight_queue (
        id,
        eyebrow,
        title,
        body,
        link_label,
        link_href,
        enabled,
        display_order,
        updated_at
      )
      VALUES (
        ${item.id},
        ${item.eyebrow},
        ${item.title},
        ${item.text},
        ${item.linkLabel},
        ${item.linkHref},
        ${item.enabled},
        ${index},
        now()
      )
    `);
  }

  await sql.transaction(queries);
}
