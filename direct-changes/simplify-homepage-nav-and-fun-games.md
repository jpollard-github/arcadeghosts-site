# Simplify Homepage Nav And Fun Games

- Date: 2026-07-05
- Summary: Simplified the public homepage and nav, moved the green terminal into its own page, and rebuilt Fun & Games around four direct destination cards.
- Routes/features hidden or removed from public surfaces: top-level promotion for First Glow, Now, Work With Me, and Guestbook; homepage Spotlight, Recent Signals, Now, Guestbook, and Signal Booth content.
- Note: admin surfaces for Now, Guestbook, and other content management remain intentionally in place.

Made the direct cleanup pass and recorded it in [simplify-homepage-nav-and-fun-games.md](/Users/jasonp/repos/arcadeghosts-site/direct-changes/simplify-homepage-nav-and-fun-games.md:1).

**Files Changed**

- [app/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/page.tsx:1)
- [app/home/HomeIntroBand.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeIntroBand.tsx:1)
- [app/home/HomeHero.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeHero.tsx:1)
- [app/home/HomeFunAndGames.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeFunAndGames.tsx:1)
- [app/home/HomeAbout.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeAbout.tsx:1)
- [app/home/data.ts](/Users/jasonp/repos/arcadeghosts-site/app/home/data.ts:1)
- [app/terminal/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/terminal/page.tsx:1)
- [app/lib/search.ts](/Users/jasonp/repos/arcadeghosts-site/app/lib/search.ts:1)
- [app/sitemap.ts](/Users/jasonp/repos/arcadeghosts-site/app/sitemap.ts:1)
- [app/globals.css](/Users/jasonp/repos/arcadeghosts-site/app/globals.css:1)
- [tests/e2e/home.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/home.spec.ts:1)
- [tests/e2e/public-pages.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/public-pages.spec.ts:1)
- [tests/e2e/mobile-safety.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/mobile-safety.spec.ts:1)
- Deleted unused homepage-only components:
  [app/home/HomeGuestbook.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeGuestbook.tsx:1),
  [app/home/HomeNow.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeNow.tsx:1),
  [app/home/HomeRecentSignals.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeRecentSignals.tsx:1),
  [app/home/HomeSpotlight.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeSpotlight.tsx:1)

**Routes/Nav Affected**

- Public nav is now: `Start Here`, `Projects`, `Writing`, `Fun & Games`, `Screening`, `Music`, `Cats`, `About`, `Contact`
- Removed from public nav: `First Glow`, `Now`, `Work With Me`, `Guestbook`
- Removed from homepage: `Spotlight`, `Recent Signals`, `Now`, `Guestbook`, homepage `Signal Booth`, hero terminal
- `Contact` now uses `mailto:jason@arcadeghosts.org`
- `Screening` now points to `/movies-tv`

**New/Changed Routes**

- Added: `/terminal`
- Kept and no longer promoted from homepage/nav: `/work-with-me`
- Kept and no longer promoted from top-level nav: `/ambient`
- Existing `/movies-tv` is now the public `Screening` destination

**Checks Run**

- `npm run lint` passed
- `npm run typecheck` passed
- `npm run build` passed
- Focused Playwright pass against the live local app passed: `26 passed`
- Mobile screenshots captured:
  `/private/tmp/home-nav-375.png`
  `/private/tmp/home-nav-390.png`
  `/private/tmp/home-nav-430.png`

**Intentionally Retained But Hidden From Public Nav/Homepage**

- Now admin remains: `/admin/now`
- Guestbook admin remains: `/admin/guestbook`
- Work With Me page remains: `/work-with-me`
- First Glow / ambient feature remains: `/ambient`
- Search and RSS internals remain in place, including `/search`, `/writings/rss.xml`, and `/tiny-thoughts/rss.xml`

Implemented the cleanup pass and recorded it in [direct-changes/nav-layout-homepage-copy-footer-cleanup.md](/Users/jasonp/repos/arcadeghosts-site/direct-changes/nav-layout-homepage-copy-footer-cleanup.md:1).

**What Changed**
The homepage header is cleaner and more stable now: the primary nav is centered, the GitHub button sits in the upper right, the top line stays text-only, the extra `Surprise me` and `Who Is Jason?` pills are gone, the `From The Counter` and `Wider Hallways` blocks are removed, the writing-room pill spacing is fixed, and Cats now sits above About on the homepage. I also added a modest public footer and tightened several public-facing copy instances from `strange` to `curious` where it read naturally.

Back-home treatment is now cleaner too: admin pages get a shared upper-left `Back Home` link beside the logo, `Work With Me` now has its own Back Home link, `Agents` now points back home instead of back to About, and Search now returns home directly. `ambient` was intentionally left out of the shared Back Home treatment.

**Files Changed**
Key files for this pass:

- [app/layout.tsx](/Users/jasonp/repos/arcadeghosts-site/app/layout.tsx:1)
- [app/globals.css](/Users/jasonp/repos/arcadeghosts-site/app/globals.css:1)
- [app/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/page.tsx:1)
- [app/home/HomeHero.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeHero.tsx:1)
- [app/home/HomeIntroBand.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeIntroBand.tsx:1)
- [app/home/HomeStartHere.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeStartHere.tsx:1)
- [app/home/HomeAbout.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeAbout.tsx:1)
- [app/home/data.ts](/Users/jasonp/repos/arcadeghosts-site/app/home/data.ts:1)
- [app/about/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/about/page.tsx:1)
- [app/search/SearchPageClient.tsx](/Users/jasonp/repos/arcadeghosts-site/app/search/SearchPageClient.tsx:1)
- [app/work-with-me/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/work-with-me/page.tsx:1)
- [app/agents/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/agents/page.tsx:1)
- [app/music/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/music/page.tsx:1)
- [app/movies-tv/page.tsx](/Users/jasonp/repos/arcadeghosts-site/app/movies-tv/page.tsx:1)
- [app/GlobalBackHomeLink.tsx](/Users/jasonp/repos/arcadeghosts-site/app/GlobalBackHomeLink.tsx:1)
- [app/PublicFooter.tsx](/Users/jasonp/repos/arcadeghosts-site/app/PublicFooter.tsx:1)
- [tests/e2e/home.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/home.spec.ts:1)
- [tests/e2e/mobile-safety.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/mobile-safety.spec.ts:1)
- [tests/e2e/public-pages.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/public-pages.spec.ts:1)
- [tests/persona-testing/support/site-surfaces.ts](/Users/jasonp/repos/arcadeghosts-site/tests/persona-testing/support/site-surfaces.ts:1)

Also touched a few metadata/copy files like [app/seo.ts](/Users/jasonp/repos/arcadeghosts-site/app/seo.ts:1), [app/opengraph-image.tsx](/Users/jasonp/repos/arcadeghosts-site/app/opengraph-image.tsx:1), [app/not-found.tsx](/Users/jasonp/repos/arcadeghosts-site/app/not-found.tsx:1), [app/writings.ts](/Users/jasonp/repos/arcadeghosts-site/app/writings.ts:1), and [app/home/terminal-data.ts](/Users/jasonp/repos/arcadeghosts-site/app/home/terminal-data.ts:1).

**Routes And Footer**
Affected public pages: `/`, `/about`, `/agents`, `/music`, `/movies-tv`, `/search`, `/work-with-me`, `/writings`, plus admin pages via the shared Back Home treatment. No new public route was added in this pass.

Footer links added:

- Start Here
- Projects
- Writing
- Fun & Games
- Screening
- Music
- Cats
- About
- Contact
- Arcade Games
- Terminal
- First Glow
- Search
- Tiny Thoughts
- Writing RSS
- Tiny Thoughts RSS
- Work With Me

**Checks**
Passed:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/home.spec.ts tests/e2e/public-pages.spec.ts tests/e2e/mobile-safety.spec.ts` with `63 passed`
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm test` with `71 unit passed` and `74 e2e passed`

Mobile screenshots captured for review:

- [home-mobile-375.png](/private/tmp/home-mobile-375.png)
- [home-mobile-390.png](/private/tmp/home-mobile-390.png)
- [home-mobile-430.png](/private/tmp/home-mobile-430.png)
- [about-mobile-390.png](/private/tmp/about-mobile-390.png)
- [admin-mobile-390.png](/private/tmp/admin-mobile-390.png)
- [home-full-390.png](/private/tmp/home-full-390.png)

Intentionally retained but not top-nav promoted:

- `Now` admin
- `Guestbook` admin
- `Work With Me` page
- `First Glow` / `ambient`
- public Search internals
- public RSS generation
- a legacy persona-test alias for removed `build-log` and `updates` surfaces, mapped only inside the test route catalog so `npm test` stays green without restoring those public routes
