import { getSiteSql } from "./database";
import { toWritingDraft, type WritingDraftRow } from "./writing-drafts";

export async function getAdminWritingDrafts() {
  const sql = getSiteSql();
  const rows = await sql`
    SELECT
      id,
      title,
      slug,
      summary,
      body,
      notes,
      status,
      created_at,
      updated_at
    FROM writing_drafts
    ORDER BY
      CASE status
        WHEN 'draft' THEN 0
        WHEN 'shaping' THEN 1
        WHEN 'ready' THEN 2
        ELSE 3
      END,
      updated_at DESC
  `;

  return (rows as WritingDraftRow[]).map(toWritingDraft);
}
