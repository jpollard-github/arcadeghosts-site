---
name: arcadeghosts-add-screening-entry
description: Add or update an ArcadeGhosts Screening movie, television show, season, poster or key art, Wikipedia or informational link, image source, or personal Screening comment using repository-backed TypeScript metadata and local WebP images.
---

1. Read `AGENTS.md`, `README.md`, `app/site-content/visual-media.ts`, `app/VisualMediaCard.tsx`, `app/(public)/screening/page.tsx`, `app/home/HomeScreening.tsx`, `scripts/convert-image-to-webp.ts`, the Screening tests, and the relevant rules in `app/globals.css`.
2. Treat the title, optional year, optional season, optional image preference, and optional personal comment in Jason's prompt as inputs. Resolve ambiguity before editing when multiple works share a title.
3. Confirm the item is not already present. For an update, preserve fields Jason did not ask to change.
4. Find a canonical informational URL, preferring the correctly disambiguated Wikipedia article when available, and store it in `detailsUrl`.
5. Find a stable human-facing image-provenance page and verify that the exact selected poster or key art appears there before storing it in `sourceUrl`. A general Wikipedia article is not image provenance unless that exact page hosts the selected image. If existing provenance cannot be verified, select and convert a replacement image from a verifiable source page.
6. Never invent Jason's personal comment. When none is supplied, omit `comment` and report that it remains a manual editorial step.
7. Create a lowercase, URL-safe filename beneath `public/images/movies-tv/`. Use `npm run image:webp -- "<local path or direct image URL>" "public/images/movies-tv/<filename>.webp"` to download or convert it, and store only that local WebP path in `image`.
8. Inspect the real converted image. Omitted `imageFit` means `cover`; set `imageFit: "contain"` only when cropping strongly non-poster-shaped artwork would be harmful. Do not use containment to disguise low image quality.
9. Do not add the item to `screeningPreviewTitles` unless Jason explicitly requests homepage placement.
10. If the data contract changes, update `app/VisualMediaCard.tsx` and the focused unit and public-page tests in the same change.
11. Do not add database, Blob, admin, API, authentication, migration, runtime-fetching, CMS, or automated research/editing infrastructure.
12. Run the smallest appropriate verification, including the focused public-page browser test when available.
13. Report the entry, details and provenance URLs, image path and conversion result, image-fit decision, changed files, checks run, and whether a personal comment is still needed.
