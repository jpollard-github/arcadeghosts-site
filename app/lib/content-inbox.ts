import { getSiteSql } from "./database";
import { toContentInboxItem } from "./content-inbox-shared";
export {
  contentInboxBuckets,
  contentInboxSources,
  contentInboxStatuses,
  emptyContentInboxItem,
  isContentInboxBucket,
  isContentInboxSource,
  isContentInboxStatus,
  normalizeInboxText,
  toContentInboxItem,
  type ContentInboxBucket,
  type ContentInboxItem,
  type ContentInboxRow,
  type ContentInboxSource,
  type ContentInboxStatus,
} from "./content-inbox-shared";
import type { ContentInboxRow } from "./content-inbox-shared";

export async function getAdminContentInboxItems() {
  const sql = getSiteSql();
  const rows = await sql`
    SELECT
      id,
      title,
      content,
      source,
      bucket,
      notes,
      status,
      created_at,
      updated_at
    FROM content_inbox_items
    ORDER BY
      CASE status WHEN 'inbox' THEN 0 WHEN 'drafted' THEN 1 ELSE 2 END,
      updated_at DESC
  `;

  return (rows as ContentInboxRow[]).map(toContentInboxItem);
}
