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
- `public/` - static assets
- `scripts/` - local maintenance and audit scripts
- `tests/` - active unit and e2e coverage
- `review-packets/` - generated review and audit markdown packets

## Agent guidance and skills

`AGENTS.md` contains the repository's working rules, architecture notes, validation expectations, and definition of done for coding agents. Read it before making changes.

Repository-specific skills live in `.agents/skills/`:

- `verify-change` - selects and runs the appropriate verification checks for a change, then reports exact results and remaining risks.
- `ambient-device-review` - reviews Ambient and PWA changes across automated browser checks and a separate Samsung tablet checklist.
- `release-writing` - prepares and validates repository-backed writing for publication without changing Jason's voice.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Neon Postgres via `@neondatabase/serverless`
- Vercel Blob
- Resend
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

Run the site audit and generate a markdown packet in `review-packets/`:

```bash
npm run website:audit
```

## Continuous integration

GitHub Actions runs two jobs in parallel for pull requests and pushes to `main`. The `verify` job audits production dependencies, then runs linting, type checking, unit tests, and a production build through `npm run verify:full`. The `e2e` job installs Chromium and runs the Playwright browser suite with `npm run test:e2e`.

Authenticated admin Playwright tests skip unless CI admin credentials and an isolated test database are configured. When Playwright runs, its report is available from the workflow run's **Artifacts** section for 7 days, including after test failures.

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

Optional rate-limit secret:

```bash
GUESTBOOK_RATE_LIMIT_SECRET=
```

## Notes

- `review-packets/` is the active home for generated audit output and review writeups.
- If port `3000` is busy, `npm run dev` may start Next.js on another local port.
