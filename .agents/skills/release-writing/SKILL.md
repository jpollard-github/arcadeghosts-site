---
name: arcadeghosts-release-writing
description: Prepare and verify a repository-backed ArcadeGhosts writing for publication. Use when adding or updating a writing, validating its slug and metadata, or producing a commit-ready publication bundle without changing Jason's voice.
---

1. Read `AGENTS.md`, `README.md`, `app/writings.ts`, the target markdown file, and the writing route implementation.
2. Treat Jason's prose as authoritative. Do not rewrite or polish it unless the task explicitly requests editorial changes.
3. Validate:
   - the slug is stable and URL-safe
   - the markdown filename and `app/writings.ts` entry agree
   - title, description, icon, related signals, and route metadata are complete
   - a new slug does not collide with an existing route or writing
4. Make repository changes directly. Do not describe a Vercel runtime filesystem write as publication.
5. Check that the writing appears through the listing, static params, search, RSS, sitemap, metadata, and related links as appropriate.
6. Run `npm run verify:full` and the focused writing or public-page Playwright coverage.
7. Return a publication report with the final URL, files changed, checks run, and any manual content decision left to Jason.
