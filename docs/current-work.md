# Current Work

This file is a snapshot of where the repo stands right now so future sessions can re-enter quickly.

## Current State

The site is in a healthier structure than it was before the recent cleanup pass.

What is now in place:

- homepage split into section components
- music page split into section components
- route-specific music and admin CSS extracted from `app/globals.css`
- shared admin route helpers created
- shared upload validation/path helpers created
- Tiny Thoughts admin split into a hook plus focused UI pieces
- curated music/site data split into smaller modules
- lightweight regression tests added
- Playwright e2e coverage added for stable public pages and admin session-protected routes
- README local setup updated with unit and Playwright test commands
- `docs/pnpm-migration.md` added as a repo-specific note about switching from `npm` to `pnpm`
- projects admin now defaults to collapsed cards, supports per-project save/delete, and allows desktop drag-and-drop reordering for saved collapsed cards
- homepage hero now includes a faux `80s Dev Terminal` widget with data-driven commands
- custom Twin Peaks-style 404/500 pages now exist, plus an admin preview page for opening them intentionally
- `package.json` now includes a `go` script that runs lint, build, then start
- Signal Booth now includes a lightweight mode selector while preserving the original random behavior as the default

The app currently passes:

- `npm run lint`
- `npm test`
- `npm run test:e2e`
- `npm run build`

## Recently Stabilized Areas

### Homepage

The homepage is now mostly composition in `app/page.tsx`, with the implementation split under `app/home/`.

That means future homepage edits should usually happen in:

- `app/home/data.ts`
- one of the `Home*.tsx` section components

instead of putting everything back into `app/page.tsx`.

### Music

The music page now composes focused sections under `app/music/`.

Public music insight data is now split across:

- `app/music-insights/summary.ts`
- `app/music-insights/curated.ts`
- `app/music-insights/index.ts`

Use those instead of growing `app/music-insights-data.ts` again.

### Tiny Thoughts

Tiny Thoughts now has:

- public display component: `app/TinyThoughts.tsx`
- display helpers: `app/lib/tiny-thought-display.tsx`
- admin container: `app/AdminTinyThoughts.tsx`
- admin hook/UI split under `app/tiny-thought-admin/`

Upload and admin route behavior now shares helpers instead of duplicating validation logic.

### Homepage Terminal

The homepage terminal currently works like this:

- it is rendered from `app/home/HomeDevTerminal.tsx`
- command definitions live in `app/home/terminal-data.ts`
- `help` is generated from the available command list
- commands print short terminal-style responses plus a clickable link that opens in a new tab
- `reset` restores the original `load profile` transcript

Current supported commands include:

- `help`
- `reset`
- `hello`
- `projects`
- `about`
- `music`
- `cats`
- `arcade`
- `contact`

### Signal Booth

Signal Booth now has a small mode selector with:

- `Any Signal`
- `Spooky`
- `Funny`
- `Reflective`
- `Career`
- `Arcade`
- `Cat`
- `Twin Peaks`

Important implementation notes:

- `Any Signal` preserves the old fully random pool
- mode filtering is data-driven through `app/signal-booth-data.ts`
- the filtering logic is intentionally lightweight and keyword-based rather than a large manual tagging system

## Known Patterns To Preserve

- checked-in curated data is preferred over runtime external fetching for music insights
- admin tools are intentionally simple and single-user
- Blob uploads should go through `app/lib/upload.ts` and `app/lib/blob.ts`
- admin route auth/error patterns should go through `app/lib/admin-route.ts`
- route-specific CSS should stay local when a feature gets large
- for projects admin specifically, keep reorder persistence tied to `display_order` instead of inventing a separate client-only ordering model
- for the homepage terminal, keep commands data-driven in `app/home/terminal-data.ts` instead of scattering command logic across the component
- for Signal Booth, prefer extending the shared mode/filter helpers instead of hard-coding mode behavior in the component

## Current Risk Areas

These are the files or areas most likely to need attention next if they grow:

- `app/home/HomeDevTerminal.tsx`
- `app/signal-booth-data.ts`
- `app/AdminProjects.tsx`
- `app/AdminNow.tsx`
- `app/AdminContextRefresh.tsx`
- `app/lib/context-refresh.ts`
- `app/twin-peaks-self/journey-data.ts`
- remaining large shared styling in `app/globals.css`

None of these are immediate breakage points, but they are the next likely maintenance hotspots.

### Projects Admin

Projects admin changed meaningfully and now has a few important behaviors to remember:

- cards load collapsed by default
- save/delete is per project, not global
- reorder is desktop-first and only enabled for saved collapsed cards
- image uploads still update local draft state and require a project save to persist
- unsaved drafts can stay in the local list, but they cannot be drag-reordered until they have been saved once

Important implementation caveat:

- single-project project mutations currently seed `defaultProjects` into the table if the projects table is empty, because public/admin reads still use the checked-in defaults as the empty-state fallback

### Error Pages And Hash Scroll

Two small but important UX behaviors were added:

- the site now has custom `not-found`, route `error`, and `global-error` pages with Twin Peaks-style copy
- the homepage now mounts `HomeHashScroller`, a small client helper that re-applies cold-load hash scrolling on first render so links like `/#about` and `/#cats` land more reliably when opened in a fresh tab

## Existing Test Coverage

Current tests live in `tests/` and cover:

- upload validation helpers
- project normalization helpers
- Tiny Thoughts normalization helpers
- selected music formatting helpers
- Signal Booth mode-filter helper coverage
- Playwright public route coverage for `/`, `/music`, `/work-with-me`, `/arcade`, `/movies-tv`, and the custom error preview routes
- Playwright admin coverage for login/logout plus `/admin/guestbook`, `/admin/projects`, `/admin/now`, `/admin/context-refresh`, and `/admin/error-previews`

Projects admin browser coverage currently verifies:

- the page opens in its collapsed-by-default state
- a project can be expanded
- the per-project save button is present once expanded

Homepage terminal browser coverage currently verifies:

- the terminal renders in the hero
- `help` shows the current command list
- `hello` prints the expected response
- terminal links render as new-tab links
- reset returns the transcript to its initial state

Run them with:

```bash
npm test
```

Playwright commands:

```bash
npm run test:e2e:install
npm run test:e2e
```

Current e2e caveat:

- the context refresh admin test performs a real export creation request, so repeated local runs can create persistent `context_refresh_exports` rows when the repo points at a live local database

## Practical “How To Change Things” Notes

### If updating homepage content

Start in:

- `app/home/data.ts`
- relevant `app/home/Home*.tsx`

If updating the homepage terminal specifically, start in:

- `app/home/HomeDevTerminal.tsx`
- `app/home/terminal-data.ts`
- `app/home/HomeHashScroller.tsx`
- `app/globals.css`

If updating Signal Booth modes or filtering specifically, start in:

- `app/SignalBooth.tsx`
- `app/signal-booth-data.ts`
- `app/globals.css`
- `tests/signal-booth.test.ts`

### If updating music content or presentation

Start in:

- `app/music/page.tsx`
- relevant `app/music/*.tsx`
- `app/music-insights/*`
- `app/music/music.css`

### If updating Tiny Thoughts admin or uploads

Start in:

- `app/tiny-thought-admin/*`
- `app/lib/upload.ts`
- `app/lib/blob.ts`
- `app/api/admin/tiny-thoughts/*`

### If updating project or Now admin persistence

Start in:

- `app/lib/projects.ts`
- `app/lib/now.ts`
- matching `app/api/admin/*/route.ts`
- matching admin component

If updating projects admin interaction specifically, start in:

- `app/AdminProjects.tsx`
- `app/api/admin/projects/route.ts`
- `app/lib/projects.ts`
- `app/admin/admin.css`

## Suggested Next Improvements

If more cleanup happens later, the best next candidates are:

1. Split `AdminProjects.tsx` into smaller hooks/components now that it owns expand/collapse, per-card save/delete, and drag state
2. Split `HomeDevTerminal.tsx` further if command behavior, transcript formatting, or anchor-link handling grows more complex
3. Consider whether Signal Booth should eventually move from keyword-derived modes to explicit curated tagging if the mode list grows
4. Split `AdminNow.tsx` if it continues to grow
5. Add mutation-focused e2e coverage for project save/reorder flows, ideally with cleanup or isolated test data
6. Add a few more tests around admin route normalization and payload validation
7. Reduce `app/globals.css` further for other large feature areas

## Short Re-entry Summary

If another session needs a 30-second orientation:

- this is a Next.js personal-site platform with small admin CMS features
- homepage and music refactors are already done
- Tiny Thoughts admin/upload cleanup is already done
- projects admin now uses collapsed cards, per-project persistence, and desktop drag-and-drop reorder for saved items
- the homepage hero now includes a data-driven retro terminal widget
- Signal Booth now supports simple mood/category filtering while keeping random mode as the default
- the site has custom 404/500 pages plus an admin preview surface for them
- unit tests, e2e tests, build, and lint are green
- future work should extend the split module patterns, not collapse them back into giant files

<!-- codex-session-kit:auto-start -->
> Auto-generated snapshot. Refreshed 6/20/2026, 5:21:50 PM. This section is managed by Codex Session Kit.

## Auto Snapshot

### Current repo activity
- Active git branch: `main`
- Working tree appears clean.

### Changed files
- No git changes detected.

### Open editors
- No visible editors detected.

### Recently modified files
- docs/decisions.md (6/20/2026, 4:50:58 PM)
- docs/current-work.md (6/20/2026, 4:50:57 PM)
- docs/architecture.md (6/20/2026, 4:50:57 PM)
- docs/repo-summary.md (6/20/2026, 4:50:57 PM)
- .vscode/ai-context-state.json (6/20/2026, 4:49:54 PM)
- playwright-report/index.html (6/20/2026, 4:49:42 PM)
- test-results/.last-run.json (6/20/2026, 4:49:42 PM)
- README.md (6/20/2026, 4:48:22 PM)
- tests/e2e/admin.spec.ts (6/20/2026, 4:46:55 PM)
- tests/e2e/public-pages.spec.ts (6/20/2026, 4:42:20 PM)
- tests/e2e/helpers/admin-env.ts (6/20/2026, 4:42:02 PM)
- tests/e2e/home.spec.ts (6/20/2026, 4:39:05 PM)
<!-- codex-session-kit:auto-end -->
