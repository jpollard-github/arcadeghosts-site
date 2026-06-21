# Decisions

These notes mix auto-generated repo facts with human-maintained context.

## Human Notes
- Browser e2e coverage now uses Playwright with a local `next dev` server bound to `127.0.0.1:3000`. This avoids localhost binding issues seen with broader host defaults in the current environment.
- Initial Playwright coverage is intentionally scoped to stable public pages plus admin session and protected-route access. It is meant as a lightweight regression net, not a full seeded integration harness.
- Admin e2e login reads `ADMIN_USERNAME` and `ADMIN_PASSWORD` from runtime env or `.env.local` so local runs work without extra wiring.
- Current caveat: the context refresh e2e test performs a real export-creation mutation, so future test expansion should prefer isolated test data or explicit cleanup for DB-backed admin mutations.
- Projects admin now follows a desktop-first interaction model: cards are collapsed by default, each project saves independently, and drag-and-drop reorder is only enabled for saved collapsed cards.
- Projects admin reorder/save was implemented without adding a drag-and-drop library. The current behavior relies on native desktop drag events and is not intended to be the final touch/mobile solution.
- Projects admin mutations now use `PATCH /api/admin/projects` for single-project saves and order-only updates, while `DELETE /api/admin/projects` removes a single saved project.
- The repo still treats checked-in `defaultProjects` as the empty-state fallback. Because of that, the first single-project mutation seeds those defaults into `site_projects` if the table is empty before applying the requested change.
- The homepage now includes a faux `80s Dev Terminal` widget in the hero. Command behavior is intentionally data-driven through a shared command registry so future additions are mostly content changes rather than component rewrites.
- Terminal command links open in a new tab instead of navigating inline. This preserves the visitor's place on the homepage while still acting like a playful navigation surface.
- The homepage uses a small client-side hash-scroll helper on initial load so fresh-tab links like `/#about` and `/#cats` land more like the already-rendered top navigation links.
- The site now has explicit custom `not-found`, route `error`, and `global-error` pages with Twin Peaks-style copy, plus `/admin/error-previews` for convenient manual review.
- `/error-preview/server-error` must remain dynamic. It intentionally throws to preview the 500 page, and prerendering it would break `next build`.
- `package.json` now includes a `go` script that runs lint, build, and then starts the production server locally.
- Signal Booth mode filtering was added in a deliberately lightweight way: the default remains the full random pool, and category membership is derived from keyword-based helpers in `app/signal-booth-data.ts` rather than a large manual tagging pass.
- The repo now includes a simple `.vscode/tasks.json` for common workflows and opening the Codex memory docs. Keep it small and repo-specific rather than turning it into a full editor configuration project.

<!-- codex-session-kit:auto-start -->
> Auto-generated snapshot. Refreshed 6/20/2026, 5:21:50 PM. This section is managed by Codex Session Kit.

## Auto Snapshot

### Durable facts worth confirming
- Package name: `jasons-awesome-80s-site`
- Current branch during scan: `main`

### Suggested human follow-up
- Promote important implementation choices from current work into explicit decision log entries.
- Use this file for decisions and consequences that cannot be inferred safely from code scanning alone.
<!-- codex-session-kit:auto-end -->
