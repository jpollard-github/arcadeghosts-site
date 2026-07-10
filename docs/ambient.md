# Ambient

Ambient turns ArcadeGhosts into a calm, slightly haunted room display. It is a fullscreen installation built from material already present on the site, not a dashboard, a second CMS, or a general-purpose information surface.

## Architecture

`/ambient` is a Next.js App Router page. `app/ambient/page.tsx` gathers public site data and normalizes it into display signals. `AmbientDisplay.tsx` owns time-of-day selection, dwell timing, manual navigation, and transitions. `ambient.module.css` owns the viewport shell, fixed stage geometry, responsive layouts, and visual themes.

The website remains the source of truth. Ambient consumes public Tiny Thoughts and projects plus repository-backed writings and cat-room content. The page may select a curated scene from `public/ambient/scenes/manifest.json` for text-heavy signals. Cat signals retain their first-party imagery.

The installed Android PWA starts at `/ambient`, is scoped to that route, and requests fullscreen landscape display. Its service worker exists to satisfy installation requirements and deliberately does not cache dynamic signals.

## Signal model

An `AmbientSignal` has a stable id and one of four kinds: `cat`, `thought`, `project`, or `writing`. Each signal supplies a source label, title, body, metadata, destination link, action label, and aside note. A usable first-party image or selected scene-library asset creates a media composition. Signals without usable media use a deliberate text-and-note composition and do not render an empty or synthetic image region.

Signals share one stage component and one outer rectangle. Kind-specific styling may tune typography and column proportions, but it must never change the surrounding header, controls, or stage bounds. Dwell time may vary by kind and reading length.

## Durable design constraints

- Keep the experience calm, readable at desk distance, and suitable for a screen left running.
- Keep the entire header, stage, and controls inside the installed viewport without document scrolling at the 1280×800 landscape target.
- Let the shell own viewport sizing and let the stage fill its `minmax(0, 1fr)` row.
- Keep settled, incoming, and outgoing stages overlapped in the same containing block.
- Animate only composited opacity and subtle transforms; never animate layout dimensions or grid tracks.
- Long copy may scroll inside its own stage region, but it must not grow the outer layout.
- Respect safe-area insets and `prefers-reduced-motion`.
- Keep the root document, body, and Ambient surface on the same dark background so fullscreen viewport seams cannot expose a light browser canvas.
- Reuse existing site content and avoid parallel content stores or source-specific mini-products.

## Scene library

Scene assets live below `public/ambient/scenes/`; their public metadata lives in `manifest.json`. Each manifest entry includes `id`, `category`, `title`, `path`, `moodTags`, `brightness`, `textOverlaySuitability`, `preferredUse`, `weight`, and `notes`.

Use standalone, properly licensed `WebP` images, preferably 16:9 and at least 1920×1080. Images must not contain embedded text, logos, copyrighted characters, collage seams, borders, gutters, or framing artifacts. Favor calm atmosphere and negative space.

After adding an asset and manifest entry, run:

```bash
npm run ambient:scenes:validate
npm run verify
```

An empty library is valid; Ambient must degrade gracefully without placeholder imagery.

## PWA and physical-device testing

Production mode matters because service-worker registration and installed-display behavior differ from development. Build and start the production server, install `/ambient` from Chrome on the target Android tablet, rotate to landscape, and launch it from the home screen.

Confirm that the app opens directly into fullscreen `/ambient`; the top edge remains dark; the full header, stage, and controls are visible; Previous and Next do not move the frame; every signal kind uses the same stage bounds; rapid navigation remains stable; and relaunching restores a working network-backed display. Following an out-of-scope signal link should return to the normal browser.

Automated Playwright coverage should run against a production server when checking fullscreen-adjacent layout. It must cover 1280×800 overflow, stable geometry across signal kinds and transitions, reduced motion, rapid controls, and a representative ordinary page.

Historical planning notes are retained only in `docs/archive/ambient-todo-obsolete.md` and are not active work.
