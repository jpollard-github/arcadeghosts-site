# Project Brief

## Repo Purpose
- `arcadeghosts.org` is a personal site, portfolio, and home for small interactive/admin tools.

## How To Work In This Repo
- Start from the four handoff docs in `docs/` before inspecting implementation files.
- Preserve existing App Router, Neon Postgres, and admin auth patterns when adding new tools.

## Important Constraints
- Keep admin tools lightweight and private by default; avoid adding public-facing exposure unless the feature explicitly calls for it.
- The older memory docs `docs/architecture.md`, `docs/refactor-roadmap.md`, and `docs/repo-summary.md` were deleted from the working tree, so any stale references to them should be treated as outdated until refreshed.

## Architecture Rules Worth Preserving
- Reuse the existing `/admin` dashboard plus `/api/admin/*` JSON route pattern for single-user content tools.
- Prefer structured Postgres fields for admin-managed content when future analytics are likely, but keep the UX copy human and lightweight.
