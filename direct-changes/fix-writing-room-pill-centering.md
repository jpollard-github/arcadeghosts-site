# 2026-07-05

- Summary: Fixed the homepage `See the full writing room` CTA so the text is actually centered inside the oval instead of inheriting the list panel's grid layout.
- Visual/layout changes made: narrowed the `.list-panel` item selectors to exclude the writing CTA, restored real `inline-flex` centering, balanced horizontal padding, kept a stable min-height, and prevented left-edge crowding on desktop and mobile.
- Tests/checks run: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, plus live screenshot verification at `http://localhost:3000`.

Fixed the writing pill in [app/globals.css](/Users/jasonp/repos/arcadeghosts-site/app/globals.css:2912) and recorded it in [direct-changes/fix-writing-room-pill-centering.md](/Users/jasonp/repos/arcadeghosts-site/direct-changes/fix-writing-room-pill-centering.md:1).

The underlying bug was a selector collision: `.list-panel a` was overriding the pill with `display: grid`, `padding: 1.15rem 0`, and the list-row layout, which is why the text was visually shoved toward the left/top. I narrowed the list-row rules to `.list-panel > a:not(.list-panel-more)` and gave `.list-panel > .list-panel-more` its own real CTA layout: `display: inline-flex`, `align-items: center`, `justify-content: center`, balanced horizontal padding, stable `min-height`, `line-height: 1`, and `white-space: nowrap`.

I verified it live at `http://localhost:3000` after the change. The current rendered pill now computes as `inline-flex` with centered content and even padding on both desktop and mobile, and the screenshots show the label centered inside the oval:

- [writing-pill-desktop-fixed.png](/private/tmp/writing-pill-desktop-fixed.png)
- [writing-pill-mobile-fixed.png](/private/tmp/writing-pill-mobile-fixed.png)

Checks run and passing:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
