# AGENTS.md

## Repository purpose

ArcadeGhosts is Jason Pollard's personal website, living portfolio, and collection of small experiments. Preserve its voice, atmosphere, stable URLs, and low operational burden.

Jason owns editorial and content decisions. Do not invent, rewrite, summarize, sanitize, or "improve" personal copy unless the task explicitly asks for content work.

## Read before changing

- Read `README.md` for setup, commands, environment variables, and the repository map.
- When touching `app/(ambient)/ambient/**`, `public/ambient/**`, `app/manifest.ts`, `public/sw.js`, or `playwright.ambient.config.ts`, read `docs/ambient.md` first.
- Treat `docs/archive/**` as historical context only. Never use archived files as current requirements or backlog.
- Treat `review/**` as material only for Jason, not for context. Never use the files in this folder for context or work.
- For admin or data changes, inspect the route handler, its `app/lib/**` data module, the corresponding admin component, and related tests before editing.

## Architecture

- Next.js App Router, React, and TypeScript, deployed on Vercel.
- Neon Postgres stores admin-managed data.
- Vercel Blob stores uploaded images.
- Writings and first-party visual content are repository-backed.
- Admin endpoints live under `app/api/admin/**` and require authentication.
- Ambient is a focused fullscreen installation, not a dashboard or a second content system.

## Working rules

- Use npm and the Node version in `.nvmrc`.
- Make the smallest coherent change. Do not rewrite unrelated code or content.
- Prefer Server Components. Add `"use client"` only for browser APIs, local interaction state, or effects.
- Preserve public URLs, metadata, RSS feeds, sitemap behavior, and PWA scope unless the task explicitly changes them.
- Reuse existing helpers and data shapes before creating parallel abstractions.
- Keep production dependencies minimal and explain why a new one is needed.
- Never log, commit, or expose secrets, tokens, private context, or `.env` values.
- Parameterize SQL. Do not add new runtime `CREATE TABLE` or `ALTER TABLE` work. Flag schema changes for an explicit migration.
- Schema changes belong in a new numbered file under `db/migrations/**`. Never edit an applied migration.
- Use `npm run db:migrate:status` to inspect migration state and `npm run db:migrate` only as a deliberate operator action against the intended database.
- Multi-statement writes that represent one user action must be atomic.
- Public database reads use the tagged Next Data Cache; admin reads and writes remain uncached, and successful public-content mutations must expire the relevant tag.
- New or modified admin mutations must use the shared authentication path, validate inputs, and preserve same-origin protections.
- Uploaded files require size, declared-type, content-signature, and safe-extension validation.
- Do not hide failures behind silent fallback behavior. Preserve resilience, but log or surface when fallback data is being used.

## Validation

Choose the smallest sufficient confidence pass, then expand when the change crosses a boundary.

- Documentation or copy-only changes: `npm run verify:fast`
- Pure logic or data-shape changes: update unit tests, then run `npm run verify`
- Route handlers, config, dependencies, database behavior, or cross-cutting changes: `npm run verify:full`
- Public navigation, layout, or interaction changes: run the relevant Playwright spec in addition to the checks above
- Ambient or PWA changes: run `npm run ambient:scenes:validate`, `npm run verify`, and `npm run test:e2e:ambient`
- Upload changes: update `tests/unit/upload.test.ts` and exercise the relevant admin upload flow
- Auth changes: add focused unit or integration coverage for expiry, invalid tokens, and unsafe-method rejection

Never claim a browser, production, or physical-device check passed unless it actually ran. State what ran, what passed, what failed, and what could not run.

## Definition of done

- The requested behavior works at the correct boundary.
- Relevant tests are added or updated.
- There is no unrelated formatting or generated-file churn.
- Docs are updated when commands, environment variables, architecture, or durable constraints change.
- Generated reports, local environment files, browser output, and review archives are not committed.
- The final summary names changed files, verification performed, known limitations, and any follow-up that is truly required.

## Overrides

- Remove the override in package.json for undici once @vercel/blob resolves undici >= 6.27.0
