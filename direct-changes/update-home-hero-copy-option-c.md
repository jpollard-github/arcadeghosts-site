# Update home hero copy with approved Option C

## What changed

- updated the homepage top banner copy to the approved personal-site line
- replaced the homepage hero label, headline, and body copy with the approved Option C text
- added the approved hero CTAs using existing styling and existing destinations:
  - `Start Here` -> `#start-here`
  - `Read the Writing` -> `/writings`
  - `Say Hello` -> `mailto:jason@arcadeghosts.org`
- updated the homepage end-to-end test assertions for the new copy and CTA presence

## Files changed

- `app/home/HomeIntroBand.tsx`
- `app/home/HomeHero.tsx`
- `app/globals.css`
- `tests/e2e/home.spec.ts`

## Validation run

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Assumptions made

- only visible top-of-page homepage copy needed updating; route metadata, footer copy, and lower sections were left alone
- `Read the Writing` should point to the full writing room at `/writings` rather than the homepage writing section
- `Say Hello` should use the existing public contact email address

## Follow-up items

- nav reorder/rename work was not touched here
- homepage metadata or social preview copy can be revisited later if the public-facing positioning should match the new hero language more closely

Updated the homepage top band and hero to the approved Option C copy, kept the existing visual treatment, and added the three CTAs with existing destinations: `#start-here`, `/writings`, and `mailto:jason@arcadeghosts.org`. I only touched the top section plus the small CSS/test support needed for the longer copy.

Files changed:

- [app/home/HomeIntroBand.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeIntroBand.tsx:1)
- [app/home/HomeHero.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeHero.tsx:1)
- [app/globals.css](/Users/jasonp/repos/arcadeghosts-site/app/globals.css:1)
- [tests/e2e/home.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/home.spec.ts:1)
- [direct-changes/update-home-hero-copy-option-c.md](/Users/jasonp/repos/arcadeghosts-site/direct-changes/update-home-hero-copy-option-c.md:1)

Validation run, without starting a dev server:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

All three passed. I left nav order/renaming alone and called that out in the direct-changes note as a follow-up rather than folding it into this copy pass.
