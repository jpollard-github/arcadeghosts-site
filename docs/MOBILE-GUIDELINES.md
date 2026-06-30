# MOBILE-GUIDELINES

Mobile responsiveness is a hard acceptance criterion for all UI work in this repo.

## Required Width Checks

Every new or visually changed page, section, or layout should be checked at:

- `375px`
- `390px`
- `430px`
- tablet
- desktop

## Core Rules

- Avoid fixed-width cards, panels, or containers that can overflow on narrow screens.
- No horizontal scrolling on public pages or admin pages unless it is a deliberate, reviewed interaction.
- Text must remain readable on iPhone-sized screens without zooming.
- Header, logo, hero, and top navigation spacing must not overlap or crowd core content.
- Fixed or sticky controls must not cover headings, buttons, forms, or body copy.
- CTA groups and buttons must wrap or stack cleanly.
- Images, media blocks, and embeds must scale correctly without clipping or distortion.
- New layout work should prefer shared responsive layout primitives where they fit instead of inventing one-off wrappers.

## Review Expectations

- Any visual UI change should include mobile screenshots in the review packet.
- Use the packet captures to compare `375px`, `390px`, `430px`, tablet, and desktop before calling a change safe.
- When a route still needs manual device confirmation, record that follow-up in `docs/MOBILE-TODO.md`.

## Project Philosophy

- Preserve personality.
- Preserve the Twin Peaks / retro / arcade identity.
- Do not polish the site into a generic portfolio.
- Prefer many small improvements over one giant redesign.
- Improve readability, spacing, tap targets, and hierarchy without flattening the voice.
