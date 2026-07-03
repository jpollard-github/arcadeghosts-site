# Rename Plan: `personal` -> `arcadeghosts-site`

## Scope

This is a planning pass only. No repository rename, folder rename, deployment rename, or config rewrite has been performed here.

Goal: distinguish `personal` used as a repo/project identifier from `personal` used as ordinary site/content language.

## Current Naming Inventory

### Current canonical identifiers

- Local folder: `/Users/jasonp/repos/personal`
- Git remote: `https://github.com/jpollard-github/personal.git`
- GitHub repo URL references in app code:
  - `app/seo.ts`
  - `app/lib/context-refresh.ts`
- Vercel project URL references in app/test code:
  - `app/AdminVercel.tsx`
  - `tests/e2e/admin.spec.ts`
- Local Vercel link metadata:
  - `.vercel/repo.json` currently lists project name `personal`

### Package / project metadata

- `package.json` name is now `arcadeghosts-site`
- `package-lock.json` matches `arcadeghosts-site`
- I did not find `personal` as the npm package name

### Docs with absolute local path assumptions

These are repo/folder-name sensitive and should eventually stop pointing at `/Users/jasonp/repos/personal`:

- `docs/AI-TODO.md`
- `docs/ChatGPT-TODO.md`
- `docs/VERCEL-PRO-OPERATIONS-TODO.md`
- `docs/Vercel-Pro-TODO.md`

### Generated artifacts with embedded absolute paths

These should generally be regenerated after the rename rather than mass-edited by hand:

- `persona-results/personas/...` JSON/summary/report files
- `review-packets/...`
- `review-packets/latest-site-review/...`

Embedded path examples point at `/Users/jasonp/repos/personal/...`.

### Scripts and generators relevant to rename fallout

- `scripts/create-review-packet.ts`
  - uses `process.cwd()`
  - writes packet locations derived from current repo path
- `tests/persona-testing/support/persona-report.ts`
  - uses `process.cwd()`
  - writes result paths derived from current repo path
- `tools/zip-chatgpt-repo.ts`
  - uses `process.cwd()`

These are path-relative and should continue working after a folder rename, but any generated output created before the rename will still contain the old absolute path.

### GitHub Actions / CI

- No `.github/workflows/*` files were present in this repo during the audit
- No checked-in GitHub Actions rename work is currently required inside the repo

### Vercel-related checked files

- `.vercel/repo.json`
- `app/AdminVercel.tsx`
- `docs/VERCEL-PRO-OPERATIONS-TODO.md`
- `docs/Vercel-Pro-TODO.md`
- `docs/analytics/vercel-review-template.md` was referenced by docs, but did not itself contain `personal` in this audit

## Safe Replacements

These are strong candidates for direct replacement after the GitHub repo and Vercel project are intentionally renamed:

- GitHub repo URLs:
  - `https://github.com/jpollard-github/personal`
  - `https://github.com/jpollard-github/personal.git`
  - replace with `.../arcadeghosts-site`
- Absolute local path links in docs:
  - `/Users/jasonp/repos/personal/...`
  - replace with `/Users/jasonp/repos/arcadeghosts-site/...`
- Vercel project URLs in app/test code:
  - `https://vercel.com/jpollardgithubs-projects/personal`
  - `https://vercel.com/jpollardgithubs-projects/personal/analytics`
  - replace only if the Vercel project slug is also changed to `arcadeghosts-site`

## Replacements Requiring Human Review

### Vercel project naming

Human review required because GitHub repo rename and Vercel project rename are separate decisions.

- `.vercel/repo.json`
- `app/AdminVercel.tsx`
- `tests/e2e/admin.spec.ts`

Questions to confirm before editing:

- Will the Vercel project itself be renamed from `personal` to `arcadeghosts-site`?
- Is the current production project intentionally kept as `personal` even if the GitHub repo changes?
- Does the Vercel dashboard path use the project slug you expect after rename?

### Generated artifacts

Human review recommended before touching:

- `persona-results/**`
- `review-packets/**`

Reason:

- These are historical outputs
- many contain absolute paths and copied source snapshots
- hand-editing them risks churn with little value
- safer pattern is to keep history intact or archive it, then regenerate fresh outputs after rename

### Documentation wording around repo identity

Some docs may be better converted from absolute file links to repo-relative references instead of simply swapping one absolute folder name for another.

Best review candidates:

- `docs/AI-TODO.md`
- `docs/ChatGPT-TODO.md`
- `docs/VERCEL-PRO-OPERATIONS-TODO.md`
- `docs/Vercel-Pro-TODO.md`

## References That Should NOT Be Changed

Do not change `personal` when it means ordinary English content rather than repo identity.

Examples from audited files:

- `README.md`: "personal site"
- `app/page.tsx`, `app/seo.ts`, `app/home/*`, `app/work-with-me/page.tsx`: site voice such as "my personal site" or "personal signal"
- `app/twin-peaks-self/page.tsx`: "personal mythology"
- `app/lib/context-refresh.ts`:
  - `privacy_level: personal`
  - "personal context"
  - "personal reflection"
- persona-testing docs and reports:
  - "personal writing"
  - "personal brand"
  - "personal site"
  - "personal tone"
- analytics/privacy docs:
  - "personal data"
  - "personal or private data"

Rule of thumb:

- Change `personal` when it is a slug, folder, repo, remote, project URL, or absolute path
- Keep `personal` when it describes tone, identity, writing, privacy, relationships, or the nature of the website

## GitHub Rename Steps

1. Confirm the target GitHub repo name will be `arcadeghosts-site`.
2. Rename the repository in GitHub settings.
3. Verify GitHub redirects from `/personal` to `/arcadeghosts-site`.
4. Update local remote:
   - `git remote set-url origin https://github.com/jpollard-github/arcadeghosts-site.git`
5. Verify with:
   - `git remote -v`
6. Update checked-in GitHub repo URLs in source/docs:
   - `app/seo.ts`
   - `app/lib/context-refresh.ts`
   - any remaining docs or tests that intentionally reference the repo URL
7. Run a final search for:
   - `github.com/jpollard-github/personal`

## Local Folder Rename Steps

1. Ensure working tree is in a safe state.
2. Rename the local folder:
   - `/Users/jasonp/repos/personal`
   - to `/Users/jasonp/repos/arcadeghosts-site`
3. Open the renamed folder in the editor/terminal.
4. Re-run a search for:
   - `/Users/jasonp/repos/personal`
5. Update docs that still use absolute local file links, or preferably convert them to repo-relative links where practical.
6. Re-run any generators that emit absolute paths:
   - persona reports
   - review packets

## Vercel Project / Repo Connection Checks

Check these after the GitHub rename, and before changing Vercel links in code:

1. In Vercel, inspect the connected Git repository for the production project.
2. Confirm whether the project continues tracking the renamed GitHub repo automatically.
3. Confirm the Vercel project slug:
   - if it stays `personal`, do not change `app/AdminVercel.tsx` or `tests/e2e/admin.spec.ts` yet
   - if it becomes `arcadeghosts-site`, update those files together
4. Re-link local Vercel metadata if needed:
   - `.vercel/repo.json` may need to be refreshed by the Vercel CLI after relinking
5. Verify production env vars and domains are unchanged:
   - `arcadeghosts.org`
   - any preview/prod environment bindings
6. Confirm deployment history and analytics still point at the intended project.

## Post-Rename Validation Checklist

- `git remote -v` points to `arcadeghosts-site.git`
- Searching the repo for `github.com/jpollard-github/personal` returns no live references that should have moved
- Searching the repo for `/Users/jasonp/repos/personal` returns only intentionally preserved historical artifacts, if any
- Vercel dashboard links in `app/AdminVercel.tsx` open the expected project
- `tests/e2e/admin.spec.ts` matches the real Vercel analytics URL
- `npm run lint`
- `npm run test:unit`
- `npm run test:e2e` if a local browser run is appropriate
- `npm run site:review-packet -- --mobile --skip-tests` after rename if you want a fresh packet with updated paths
- regenerate persona outputs if you want current summaries free of old absolute paths

## Rollback Notes

- GitHub repo rename can be reversed in GitHub settings if needed
- Local remote can be pointed back with `git remote set-url origin .../personal.git`
- Local folder can be renamed back to `personal`
- If Vercel project rename creates confusion, keep the project slug unchanged and only rename the GitHub repo first
- Historical `persona-results` and `review-packets` files are useful rollback references; prefer preserving them over rewriting them in place

## Likely Rename Impact

### Low impact

- package metadata
- code using `process.cwd()`
- most app/site content
- tests and docs that only discuss the site as a personal website

### Medium impact

- checked-in GitHub repo URLs
- docs with absolute local file links
- local tooling expectations when opening the renamed folder

### Higher-risk areas

- Vercel project slug assumptions
- historical generated artifacts containing old absolute paths
- any external systems not stored in the repo: GitHub settings, Vercel settings, local editor workspaces, shell aliases, bookmarks

## Recommended Migration Order

1. Rename the GitHub repo first.
2. Verify redirect behavior and update local `origin`.
3. Decide separately whether the Vercel project slug should also change.
4. Rename the local folder.
5. Update checked-in source/docs that use repo URLs or absolute local paths.
6. Re-link or verify Vercel local metadata if needed.
7. Regenerate review packets and persona outputs instead of bulk-editing historical outputs.
8. Run validation searches and tests.

## Files Inspected During This Audit

- `README.md`
- `package.json`
- `package-lock.json`
- `app/seo.ts`
- `app/AdminVercel.tsx`
- `app/lib/context-refresh.ts`
- `scripts/create-review-packet.ts`
- `tests/e2e/admin.spec.ts`
- `tests/unit/projects.test.ts`
- `tests/persona-testing/support/persona-report.ts`
- `docs/AI-TODO.md`
- `docs/ChatGPT-TODO.md`
- `docs/VERCEL-PRO-OPERATIONS-TODO.md`
- `docs/Vercel-Pro-TODO.md`
- `.vercel/repo.json`
- `.vercel/README.txt`
- targeted `rg` inventory across `docs/`, `app/`, `tests/`, `scripts/`, `reports/`, `persona-results/`, and `review-packets/`

## Read-Only Checks Run

- `pwd`
- repo-wide `rg` searches for `personal`, GitHub URLs, Vercel URLs, and `/Users/jasonp/repos/personal`
- `git remote -v`
- `.vercel` file inspection
- presence check for `.github` workflows
