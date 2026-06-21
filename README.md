# ArcadeGhosts

`arcadeghosts.org` is Jason Pollard's personal site and living portfolio.

It is a Next.js App Router application deployed on Vercel, mixing:

- public portfolio and writing pages
- interactive experiments and playful website features
- music, arcade, movie/TV, and cat collection pages
- small single-user admin tools for keeping the site current
- lightweight storage through Neon Postgres and Vercel Blob

## What The Site Includes

Main public areas:

- `/`
- `/work-with-me`
- `/music`
- `/arcade`
- `/movies-tv`
- `/cats/*`
- `/twin-peaks-self`
- `/writings/[slug]`

Interactive/public features:

- guestbook with moderated submissions
- Tiny Thoughts short-form posts
- Signal Booth random prompt/oracle experience
- faux `80s Dev Terminal` widget in the homepage hero
- custom Twin Peaks-style 404 and 500 pages

Admin areas:

- `/admin`
- `/admin/guestbook`
- `/admin/tiny-thoughts`
- `/admin/now`
- `/admin/projects`
- `/admin/context-refresh`
- `/admin/error-previews`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Neon Postgres via `@neondatabase/serverless`
- Vercel Blob for admin image uploads
- Resend for guestbook notifications
- Vercel Analytics
- Playwright for browser e2e coverage

## Repo Notes

Useful internal docs:

- `docs/repo-summary.md`
- `docs/architecture.md`
- `docs/current-work.md`
- `docs/refactor-roadmap.md`
- `docs/decisions.md`

If you are using Codex or another AI coding assistant here, those docs should be treated as the primary source of truth before inspecting implementation files.

## Important Areas

- `app/`
  Routes, components, layouts, API handlers, and local helpers
- `app/home/`
  Homepage section components and terminal widget pieces
- `app/music/`
  Music page sections and route-local styles
- `app/site-content/`
  Shared arcade, media, and cat data
- `app/tiny-thought-admin/`
  Tiny Thoughts admin hook and UI pieces
- `app/lib/`
  Shared auth, DB, upload, Blob, and normalization helpers
- `tests/`
  Regression tests and Playwright coverage
- `docs/`
  Maintenance context for future sessions

## Environment Variables

Create `.env.local` for local development. Equivalent values should exist in Vercel for deployed environments.

Database connection, one of:

```bash
DATABASE_URL=
STORAGE_DATABASE_URL=
POSTGRES_URL=
STORAGE_POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
STORAGE_POSTGRES_URL_NON_POOLING=
STORAGE_DATABASE_URL_UNPOOLED=
NEON_DATABASE_URL=
```

Admin auth:

```bash
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

Guestbook email notifications:

```bash
RESEND_API_KEY=
GUESTBOOK_EMAIL_FROM=
GUESTBOOK_EMAIL_TO=
ADMIN_LINK=
```

Blob uploads:

```bash
BLOB_READ_WRITE_TOKEN=
```

Optional rate-limit salt:

```bash
GUESTBOOK_RATE_LIMIT_SECRET=
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Run unit/regression tests:

```bash
npm test
```

Install Playwright browser dependencies:

```bash
npm run test:e2e:install
```

Run browser tests:

```bash
npm run test:e2e
```

Build production output:

```bash
npm run build
```

Run the production server locally:

```bash
npm run start
```

Run lint, then build, then start:

```bash
npm run go
```

`npm run go` is useful when you want a quick production-style local run after the usual safety checks. It will keep running because `npm run start` launches the server.

## Testing Notes

Current browser coverage includes:

- stable public pages
- homepage terminal behavior
- custom error-page preview routes
- admin login and protected route access

Important caveat:

- the context refresh admin Playwright test performs a real export-creation mutation, so repeated local runs can create persistent `context_refresh_exports` rows if your local env points at a live database

Playwright uses a local `next dev` server bound to `127.0.0.1:3000`.

## Current Architectural Notes

- Homepage composition is split under `app/home/`; extend those modules instead of collapsing logic back into `app/page.tsx`.
- Music composition is split under `app/music/`.
- Projects admin uses per-project save/delete plus persisted `display_order` for drag-and-drop ordering.
- The homepage terminal is intentionally data-driven through `app/home/terminal-data.ts`.
- The site now has explicit `not-found`, route `error`, and `global-error` surfaces, plus preview routes under `/error-preview/*`.

## Guestbook And Tiny Thoughts

Guestbook:

- public submissions are saved as pending
- approved entries only are returned publicly
- submitted email addresses stay admin-only
- Resend can notify on new submissions

Tiny Thoughts:

- short public posts with structured attachments
- admin create/edit/delete UI
- optional image uploads through Vercel Blob

## Music Insights

The `/music` page uses curated summary data checked into this repo, not raw Spotify export data at runtime.

The summarized public data lives under:

- `app/music-insights/summary.ts`
- `app/music-insights/curated.ts`
- `app/music-insights/index.ts`

The raw export and analysis workflow lives outside this repo and is copied in as human-reviewed summary data.
