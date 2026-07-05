# Add Screening home section and rename room

## Summary

- renamed the Movies & TV room to `Screening`
- added a new homepage `Screening` section directly below `Fun & Games`
- updated the main homepage nav so every item now points to a homepage section
- kept a dedicated full `Screening` page at `/screening`
- preserved backward compatibility by redirecting `/movies-tv` to `/screening`

## Files touched

- `app/home/HomeScreening.tsx`
- `app/page.tsx`
- `app/home/data.ts`
- `app/PublicFooter.tsx`
- `app/screening/page.tsx`
- `app/screening/opengraph-image.tsx`
- `app/movies-tv/page.tsx`
- `app/movies-tv/opengraph-image.tsx`
- `app/music/page.tsx`
- `app/twin-peaks-self/page.tsx`
- `app/lib/search.ts`
- `app/sitemap.ts`
- `tests/e2e/home.spec.ts`
- `tests/e2e/public-pages.spec.ts`
- `tests/e2e/mobile-safety.spec.ts`
- `tests/persona-testing/support/site-surfaces.ts`

Implemented the Screening rename and homepage preview flow. The homepage now has a new `Screening` section directly under `Fun & Games`, the dedicated room lives at `/screening`, and `/movies-tv` now redirects there for backward compatibility. I also made the main homepage nav section-based so every item scrolls to a homepage section; to make that consistent, the nav now includes `Tiny Thoughts` and no longer uses off-homepage `Music`/`Contact` links.

Checks run: `npm run lint`, `npm run typecheck`, and `npm run build` all passed. I did not run Playwright or capture mobile screenshots because this repo’s browser tests depend on a local dev server, and you asked not to start or rely on one. I logged that follow-up in [docs/MOBILE-TODO.md](/Users/jasonp/repos/arcadeghosts-site/docs/MOBILE-TODO.md:791) and added the repo change note in [direct-changes/add-screening-home-section-and-rename-room.md](/Users/jasonp/repos/arcadeghosts-site/direct-changes/add-screening-home-section-and-rename-room.md:1).

Changed files:

- [app/home/HomeScreening.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeScreening.tsx:1)
- [app/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/page.tsx:1)
- [app/home/data.ts](/Users/jasonp/repos/arcadeghosts-site/app/home/data.ts:1)
- [app/PublicFooter.tsx](/Users/jasonp/repos/arcadeghosts-site/app/PublicFooter.tsx:1)
- [app/screening/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/screening/page.tsx:1)
- [app/screening/opengraph-image.tsx](/Users/jasonp/repos/arcadeghosts-site/app/screening/opengraph-image.tsx:1)
- [app/movies-tv/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/movies-tv/page.tsx:1)
- [app/movies-tv/opengraph-image.tsx](/Users/jasonp/repos/arcadeghosts-site/app/movies-tv/opengraph-image.tsx:1)
- [app/music/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/music/page.tsx:1)
- [app/twin-peaks-self/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/twin-peaks-self/page.tsx:1)
- [app/lib/search.ts](/Users/jasonp/repos/arcadeghosts-site/app/lib/search.ts:1)
- [app/sitemap.ts](/Users/jasonp/repos/arcadeghosts-site/app/sitemap.ts:1)
- [tests/e2e/home.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/home.spec.ts:1)
- [tests/e2e/public-pages.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/public-pages.spec.ts:1)
- [tests/e2e/mobile-safety.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/mobile-safety.spec.ts:1)
- [tests/persona-testing/support/site-surfaces.ts](/Users/jasonp/repos/arcadeghosts-site/tests/persona-testing/support/site-surfaces.ts:1)
- [docs/MOBILE-TODO.md](/Users/jasonp/repos/arcadeghosts-site/docs/MOBILE-TODO.md:1)
- [direct-changes/add-screening-home-section-and-rename-room.md](/Users/jasonp/repos/arcadeghosts-site/direct-changes/add-screening-home-section-and-rename-room.md:1)
