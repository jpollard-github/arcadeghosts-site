# Current Work

## Active Work
- Added a new admin-only feature, `Social Quest Log`, with:
- route: `/admin/social-quest-log`
- dashboard entry: `app/AdminDashboard.tsx`
- UI: `app/AdminSocialQuestLog.tsx`
- API: `app/api/admin/social-quest-log/route.ts`
- storage helpers/schema setup: `app/lib/social-quest-log.ts`
- regression tests: `tests/social-quest-log.test.ts`
- The feature persists to Postgres, is intentionally framed as a growth journal rather than a people tracker, and already stores counts/date/confidence fields so future analytics can be added without reshaping the table.
- Fixed the projects admin save path so saving a project now updates the homepage-visible `lastUpdatedAt` date by default instead of only touching the row-level `updated_at` timestamp.
- The fix lives in `app/api/admin/projects/route.ts` and `app/lib/projects.ts`, with regression coverage in `tests/projects.test.ts`.
- Manual repo cleanup happened outside this chat: `docs/architecture.md`, `docs/refactor-roadmap.md`, and `docs/repo-summary.md` were deleted from the working tree.

## Next Best Task
- Do a quick browser validation pass for `/admin/social-quest-log` against a real local database, since this session only ran lint and unit tests.
- Do a browser validation pass for `/admin/projects` and the homepage projects section to confirm the saved date now reflects a same-day edit in the real admin flow.
- Tighten the project date helper to use the intended local timezone instead of `toISOString()`, which is still UTC-based and can drift by a day around local midnight.
- If the feature grows, add lightweight charts or trend views using the saved count/confidence/date fields instead of expanding it into a CRM.
- If the deleted docs are meant to stay gone, keep repo memory centered on the four-file handoff set instead of reintroducing duplicated long-form docs.

## Risks Or Watchouts
- Keep the page paginated/searchable instead of growing into a long unbounded list.
- Preserve the growth framing: notes should stay about patterns and experiments, not identities or dossiers.
- The new project "last updated" auto-stamp logic still derives "today" from UTC via `Date.toISOString()`, so a late-evening local save can still show the wrong calendar date until that helper becomes timezone-aware.
