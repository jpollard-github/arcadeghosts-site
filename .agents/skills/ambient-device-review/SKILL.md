---
name: arcadeghosts-ambient-device-review
description: Review changes to ArcadeGhosts Ambient, its PWA behavior, scene library, fullscreen geometry, or Samsung tablet presentation. Use after Ambient code or asset changes and before calling a tablet-facing change finished.
---

1. Read `AGENTS.md` and `docs/ambient.md` before inspecting the implementation.
2. Inspect the diff across `app/ambient/**`, `public/ambient/**`, `app/manifest.ts`, `public/sw.js`, and Ambient Playwright configuration.
3. Preserve the documented model: the website is the source of truth, signal kinds share one outer stage, layout dimensions do not animate, and long copy scrolls inside its stage region.
4. Run:
   - `npm run ambient:scenes:validate`
   - `npm run verify`
   - `npm run test:e2e:ambient`
5. Check the production-mode browser flow at 1280 by 800 for:
   - no document overflow
   - stable header, stage, and control geometry across signal kinds
   - rapid Previous and Next input
   - reduced-motion behavior
   - graceful operation with an empty scene library
   - an ordinary non-Ambient page remaining unaffected
6. Do not change layout or safe-area CSS merely to conceal the documented one-pixel Samsung top-edge line unless new evidence points to application code.
7. Produce a separate physical-device checklist for the Samsung tablet:
   - install or refresh the PWA only when the manifest or service worker changed
   - launch from the home screen in landscape
   - confirm direct `/ambient` launch, fullscreen framing, controls, relaunch behavior, and out-of-scope links
8. Report automated results and physical-device observations separately. Never convert "needs tablet review" into "passed."
