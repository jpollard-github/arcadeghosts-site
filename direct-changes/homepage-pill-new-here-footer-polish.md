# 2026-07-05

- Summary: Polished the homepage writing CTA, removed the redundant hero Start Here button, flipped the New Here Contact and Creative cards, and gave the footer a subtler playful background.
- Visual/layout changes made: centered and rebalanced the `See the full writing room` oval CTA, removed the top yellow Start Here pill, moved Contact to the end of the New Here card row, and added a light neon footer wash that stays readable on mobile.
- Tests/checks run: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, plus refreshed local mobile screenshots against `http://localhost:3000`.

Made the polish pass and recorded it in [direct-changes/homepage-pill-new-here-footer-polish.md](/Users/jasonp/repos/arcadeghosts-site/direct-changes/homepage-pill-new-here-footer-polish.md:1).

The homepage changes are focused and direct: the yellow hero `Start Here` button is gone, the `New Here` cards now end with Contact, the footer has a subtler neon wash behind it, and the `See the full writing room` CTA now uses its own more intentional oval treatment instead of the generic pill styling. That gave it better horizontal and vertical centering, more balanced padding, and cleaner behavior on mobile.

Files changed: [app/home/HomeHero.tsx](/Users/jasonp/repos/arcadeghosts-site/app/home/HomeHero.tsx:1), [app/home/data.ts](/Users/jasonp/repos/arcadeghosts-site/app/home/data.ts:1), [app/globals.css](/Users/jasonp/repos/arcadeghosts-site/app/globals.css:1), [tests/e2e/home.spec.ts](/Users/jasonp/repos/arcadeghosts-site/tests/e2e/home.spec.ts:1), and the new note file above. I intentionally retained the main nav `Start Here` link, the existing footer link set, and the broader shared pill styles for other surfaces while giving the writing-room CTA a more specific fix.

Checks run and passing: `npm run lint`, `npm run typecheck`, `npm run build`, and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm test` with all unit and e2e tests passing. I also refreshed local screenshots against `http://localhost:3000`, including [home-polish-390.png](/private/tmp/home-polish-390.png) and [home-polish-desktop.png](/private/tmp/home-polish-desktop.png).
