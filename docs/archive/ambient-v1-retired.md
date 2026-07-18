# Ambient v1 / First Glow — retired

> **Retired on 2026-07-18.** The runtime implementation was removed from ArcadeGhosts, and its source history remains in Git. The broader kiosk/data-broadcast idea moved conceptually to the separate sibling project `ghost-channel`; `ghost-channel` is not a runtime or package dependency of ArcadeGhosts.

Ambient, branded “First Glow,” turned ArcadeGhosts into a calm, slightly haunted room display. It was a fullscreen installation built from material already present on the site, not a dashboard, second CMS, or general-purpose information surface.

This document preserves design and device findings as historical context. It is not an operational guide or active backlog.

## Historical architecture and signal model

The `/ambient` App Router page gathered public site data and normalized it into display signals. A route-group layout owned a document-level body mode without public chrome, while the client display controlled time-of-day selection, dwell timing, manual navigation, and transitions. A dedicated CSS module owned the viewport shell, fixed stage geometry, responsive layouts, and visual themes.

ArcadeGhosts remained the source of truth. The display consumed public Tiny Thoughts plus repository-backed writings and cat-room content. Text-heavy signals could select curated scene imagery from a repository-backed scene library, while cat signals retained first-party imagery.

An `AmbientSignal` had a stable ID and one of three kinds: `cat`, `thought`, or `writing`. Each supplied a source label, title, body, metadata, destination link, action label, and aside note. Signals with usable first-party or scene-library media used a media composition. Signals without usable media used a deliberate text-and-note composition rather than an empty or synthetic image region. Signal kinds shared one stage and outer rectangle, with dwell time varying by kind and reading length.

## Historical design constraints

- The experience was calm, readable at desk distance, and suitable for a screen left running.
- The full header, stage, and controls fit inside the installed 1280×800 landscape viewport without document scrolling.
- The shell owned viewport sizing and the stage filled its `minmax(0, 1fr)` row.
- Settled, incoming, and outgoing stages overlapped in the same containing block.
- Motion was limited to composited opacity and subtle transforms; layout dimensions and grid tracks did not animate.
- Long copy scrolled inside its stage region without growing the outer layout.
- Safe-area insets and reduced-motion preferences were respected.
- The root document, body, and display shared a dark background so fullscreen viewport seams did not reveal a light browser canvas.
- Existing site content was reused instead of creating parallel stores or source-specific mini-products.

## Historical scene library

Scene assets lived under `public/ambient/scenes/` with public metadata in a manifest. Entries recorded an ID, category, title, path, mood tags, brightness, text-overlay suitability, preferred use, weight, and notes.

The library accepted standalone, properly licensed WebP images, preferably 16:9 and at least 1920×1080. Images avoided embedded text, logos, copyrighted characters, collage seams, borders, gutters, and framing artifacts, favoring calm atmosphere and negative space. An empty library was valid and the display degraded gracefully without placeholder imagery.

## Historical PWA and device findings

The Android PWA started at `/ambient`, was scoped to that route, and requested fullscreen landscape display. Its root-scoped service worker existed for installability and did not cache dynamic signals. Production-mode testing covered installed launch, landscape framing, stable geometry, rapid navigation, reduced motion, relaunch behavior, and returning out-of-scope links to the normal browser.

Physical testing on a Samsung Android tablet found a persistent one-pixel light line at the top of installed PWAs created from both Chrome and Edge. The same line appeared on a diagnostic route that rendered only a fixed black page-owned canvas. This indicated that the line was outside the application rendering tree—most likely a browser, installed-PWA, Android system surface, or viewport boundary—rather than a CSS or layout defect.

## Retirement cleanup

The runtime route, scene library, manifest, install icons, registration code, validators, dedicated tests, and device-review skill were removed on 2026-07-18. Old `/ambient` URLs temporarily redirect to `/`. A temporary root cleanup worker remains so previously installed clients can delete app-owned caches and unregister the old worker; it can be deleted after a future release cycle once those clients have had an opportunity to update.

The obsolete planning record remains in `docs/archive/ambient-todo-obsolete.md`. Git history is the archive for the removed implementation code.
