# ArcadeGhosts

`arcadeghosts.org` is Jason Pollard's personal site and living portfolio, built with Next.js and deployed on Vercel.

The repo currently blends:

- public pages for writing, personality, media taste, and experiments
- a homepage with curated sections and Tiny Thoughts highlights
- admin tools for updating site content
- lightweight storage and upload workflows
- local audit, review-packet, and verification scripts

## Current Repo Layout

- `app/` - routes, layouts, server components, API handlers, and shared UI
- `app/home/` - homepage-specific sections and components
- `app/lib/` - shared helpers for auth, database access, uploads, feeds, and formatting
- `db/migrations/` - immutable numbered SQL migrations for the Neon schema
- `public/` - static assets
- `scripts/` - local maintenance and audit scripts
- `tests/` - active unit and e2e coverage
- `review-packets/` - generated review and audit markdown packets

## Agent guidance and skills

`AGENTS.md` contains the repository's working rules, architecture notes, validation expectations, and definition of done for coding agents. Read it before making changes.

Repository-specific skills live in `.agents/skills/`:

- `verify-change` - selects and runs the appropriate verification checks for a change, then reports exact results and remaining risks.
- `ambient-device-review` - reviews Ambient and PWA changes across automated browser checks and a separate Samsung tablet checklist.
- `export-repo-review` - packages the current repository into a review ZIP and reveals the generated archive in Finder.
- `release-writing` - prepares and validates repository-backed writing for publication without changing Jason's voice.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Neon Postgres via `@neondatabase/serverless`
- Vercel Blob
- Vercel Analytics
- Playwright
- Lighthouse for local and live website audits

## Basic How-Tos

Install dependencies:

```bash
npm install
```

Start local development:

```bash
npm run dev
```

Run the fastest useful validation pass:

```bash
npm run verify:fast
```

Run the normal confidence pass:

```bash
npm run verify
```

Create a production build:

```bash
npm run build
```

Run linting only:

```bash
npm run lint
```

Run TypeScript only:

```bash
npm run typecheck
```

Run unit tests:

```bash
npm run test:unit
```

Run browser tests:

```bash
npm run test:e2e
```

Run the focused mobile safety browser test:

```bash
npm run test:mobile-safety
```

## Public data caching

Public Projects use a one-hour tagged Next Data Cache, while public Tiny Thoughts use a fifteen-minute tagged cache. Successful admin mutations immediately expire the relevant tag; admin reads and writes are never cached. Public Project and Tiny Thought JSON responses and the Tiny Thoughts RSS response are `no-store`, so the tagged server-side data cache remains the single freshness policy. Ambient remains request-specific for its query-driven signal selection while reusing the same cached public data.

## Database migrations

The Neon schema is owned by immutable numbered files in `db/migrations/`. Application requests and builds never run migrations or repair schema.

Check which migrations are applied, pending, or mismatched:

```bash
npm run db:migrate:status
```

Apply pending migrations to the database configured in the current environment:

```bash
npm run db:migrate
```

Run migrations locally when setting up or updating a local database. For production, an operator must deliberately run `npm run db:migrate` against the production environment before deploying code that depends on the new schema. Never edit a migration after it has been applied; add the next numbered migration instead.

Run the site audit and generate a markdown packet in `review-packets/`:

```bash
npm run website:audit
```

## Continuous integration

GitHub Actions runs two jobs in parallel for pull requests and pushes to `main`. The `verify` job audits production dependencies, then runs linting, type checking, unit tests, and a production build through `npm run verify:full`. The normal `e2e` job installs Chromium and runs the database-independent Playwright suite through `npm run test:e2e:ci`.

Tests tagged `@database`, including authenticated admin coverage, require an isolated database and can be run serially with `npm run test:e2e:database`. They are excluded from the normal CI E2E job. Admin tests also require configured test credentials. When Playwright runs, its report is available from the workflow run's **Artifacts** section for 7 days, including after test failures.

Dependabot checks for scheduled version updates each week, while security updates are opened when GitHub detects a vulnerable dependency. Minor and patch updates are grouped by related area to reduce pull-request noise; major updates remain separate so breaking changes can be reviewed independently. CI runs automatically on every Dependabot pull request.

## Environment Variables

Create `.env.local` for local work. Equivalent values should exist in Vercel for deployed environments.

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
ADMIN_SESSION_SECRET=
```

All three values are required. `ADMIN_SESSION_SECRET` must contain at least 32 UTF-8 bytes and must be separate from the password. Generate a strong local value with:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Admin sessions expire after eight hours. Rotating either the password or session secret invalidates existing sessions, and this session-format change intentionally invalidates sessions issued by older deployments. Production uses a host-bound `__Host-arcadeghosts_admin` cookie; local HTTP development uses `arcadeghosts_admin`. Vercel environment-variable changes require a new deployment.

As an operator-controlled production safeguard, configure a Vercel WAF fixed-window rate-limit rule for `POST /api/admin/session`: start with 10 requests per 60 seconds per source IP and the default 429 response. Application code does not create this Vercel setting.

Blob uploads:

```bash
BLOB_READ_WRITE_TOKEN=
```

Admin image uploads support PNG, JPEG, GIF, and WebP, are validated from file content, and enforce a 4 MB compressed-size limit, 16,384-pixel dimension limit, and 64-megapixel limit.

## Notes

- `review-packets/` is the active home for generated audit output and review writeups.
- If port `3000` is busy, `npm run dev` may start Next.js on another local port.
