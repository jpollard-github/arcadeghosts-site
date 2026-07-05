# Remove Work With Me Public Surface

- Date: 2026-07-05
- Summary: Removed the remaining public-facing "Work With Me" / hiring lane from the live ArcadeGhosts site, retired `/work-with-me` into an archive, and kept ordinary personal contact paths intact.

## Public links, cards, and mentions removed

- Footer link to `/work-with-me` removed from [app/PublicFooter.tsx](/Users/jasonp/repos/arcadeghosts-site/app/PublicFooter.tsx:1).
- Search quick-link card no longer points visitors toward a professional/work path in [app/search/SearchPageClient.tsx](/Users/jasonp/repos/arcadeghosts-site/app/search/SearchPageClient.tsx:1).
- Search index entry for `Work With Me` removed from [app/lib/search.ts](/Users/jasonp/repos/arcadeghosts-site/app/lib/search.ts:1).
- About-page trust card and copy that pointed visitors toward `Work With Me` / side-project outreach removed in [app/about/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/about/page.tsx:1).
- Public wording that referenced consulting work was softened on the public Agents page in [app/agents/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/agents/page.tsx:1).

## Route and code archived

- Archived former route source:
  [archived-routes/work-with-me/page.tsx](/Users/jasonp/repos/arcadeghosts-site/archived-routes/work-with-me/page.tsx:1)
  [archived-routes/work-with-me/opengraph-image.tsx](/Users/jasonp/repos/arcadeghosts-site/archived-routes/work-with-me/opengraph-image.tsx:1)
- Live route disabled:
  [app/work-with-me/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/work-with-me/page.tsx:1) now calls `notFound()`, so `/work-with-me` is a deliberate 404.
- Live route Open Graph asset removed from:
  [app/work-with-me/opengraph-image.tsx](/Users/jasonp/repos/arcadeghosts-site/app/work-with-me/opengraph-image.tsx:1)
- Work With Me-only config values and dead admin link removed from:
  [app/lib/business-config.ts](/Users/jasonp/repos/arcadeghosts-site/app/lib/business-config.ts:1)
  [app/AdminSideHustle.tsx](/Users/jasonp/repos/arcadeghosts-site/app/AdminSideHustle.tsx:1)

## Tests updated

- Public page expectations now treat `/work-with-me` as removed in [tests/e2e/public-pages.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/public-pages.spec.ts:1).
- Mobile safety route coverage no longer treats `/work-with-me` as a normal public page in [tests/e2e/mobile-safety.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/mobile-safety.spec.ts:1).
- Persona route catalogs and journey fixtures no longer model `/work-with-me` as a normal public room in:
  [tests/persona-testing/support/site-surfaces.ts](/Users/jasonp/repos/arcadeghosts-site/tests/persona-testing/support/site-surfaces.ts:1)
  [tests/persona-testing/support/persona-scenarios.ts](/Users/jasonp/repos/arcadeghosts-site/tests/persona-testing/support/persona-scenarios.ts:1)
  [tests/persona-testing/support/persona-manifest.ts](/Users/jasonp/repos/arcadeghosts-site/tests/persona-testing/support/persona-manifest.ts:1)
  [tests/persona-testing/support/persona-journey.ts](/Users/jasonp/repos/arcadeghosts-site/tests/persona-testing/support/persona-journey.ts:1)
  [tests/unit/persona-journey.test.ts](/Users/jasonp/repos/arcadeghosts-site/tests/unit/persona-journey.test.ts:1)
  [tests/unit/persona-report.test.ts](/Users/jasonp/repos/arcadeghosts-site/tests/unit/persona-report.test.ts:1)

## Files changed

- `app/AdminSideHustle.tsx`
- `app/PublicFooter.tsx`
- `app/about/page.tsx`
- `app/agents/page.tsx`
- `app/lib/business-config.ts`
- `app/lib/search.ts`
- `app/search/SearchPageClient.tsx`
- `app/work-with-me/page.tsx`
- `tests/e2e/mobile-safety.spec.ts`
- `tests/e2e/public-pages.spec.ts`
- `tests/persona-testing/support/persona-journey.ts`
- `tests/persona-testing/support/persona-manifest.ts`
- `tests/persona-testing/support/persona-scenarios.ts`
- `tests/persona-testing/support/site-surfaces.ts`
- `tests/unit/persona-journey.test.ts`
- `tests/unit/persona-report.test.ts`
- `tsconfig.json`

## Checks run and results

- `npm run verify`
  Result: passed after excluding `archived-routes/` from TypeScript compilation.
- `npm run build`
  Result: passed; build output shows `/work-with-me` only as a static not-found route.
- `npx playwright test tests/e2e/public-pages.spec.ts tests/e2e/mobile-safety.spec.ts`
  Result: passed under unsandboxed Playwright; `56` tests passed.
- Manual screenshot/route QA saved in:
  [reports/manual-device-qa/2026-07-05-remove-work-with-me-public-surface/notes.md](/Users/jasonp/repos/arcadeghosts-site/reports/manual-device-qa/2026-07-05-remove-work-with-me-public-surface/notes.md:1)
  Result: homepage/about/search no longer expose `Work With Me` or `Start a Project Inquiry`, and `/work-with-me` renders the site 404.

## Intentionally retained personal contact links

- Personal `mailto:jason@arcadeghosts.org` links remain in normal site contact surfaces such as the homepage nav/footer and other non-hiring contact paths.

Removed the public hiring surface and recorded it in [direct-changes/remove-work-with-me-public-surface.md](/Users/jasonp/repos/arcadeghosts-site/direct-changes/remove-work-with-me-public-surface.md:1).

`/work-with-me` is now disabled as a deliberate 404 via [app/work-with-me/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/work-with-me/page.tsx:1), and the old page code was archived to [archived-routes/work-with-me/page.tsx](/Users/jasonp/repos/arcadeghosts-site/archived-routes/work-with-me/page.tsx:1) and [archived-routes/work-with-me/opengraph-image.tsx](/Users/jasonp/repos/arcadeghosts-site/archived-routes/work-with-me/opengraph-image.tsx:1). Public links and mentions were removed from the footer, search quick links/search index, About-page trust path copy, and the remaining consulting-flavored wording on the Agents page. Work With Me-only config values and the dead admin link were also removed.

Tests were updated so `/work-with-me` is no longer treated as a normal public page in the public E2E suite, mobile-safety coverage, and the persona route/journey catalogs. Checks run and passed:

- `npm run verify`
- `npm run build`
- `npx playwright test tests/e2e/public-pages.spec.ts tests/e2e/mobile-safety.spec.ts` under unsandboxed Playwright, `56` passed

Mobile screenshot evidence is in [reports/manual-device-qa/2026-07-05-remove-work-with-me-public-surface/notes.md](/Users/jasonp/repos/arcadeghosts-site/reports/manual-device-qa/2026-07-05-remove-work-with-me-public-surface/notes.md:1). Intentionally retained personal contact links: normal `mailto:jason@arcadeghosts.org` links in the site nav/footer and other non-hiring contact paths.
