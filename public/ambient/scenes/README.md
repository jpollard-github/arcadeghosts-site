# Ambient scene assets

This directory contains public image assets used by `/ambient` and their `manifest.json` metadata.

## Adding a scene

1. Export a standalone, properly licensed `WebP`, preferably 16:9 and at least 1920×1080.
2. Put it in the matching category directory with a stable kebab-case name such as `cozy-desk-01.webp`.
3. Add one entry to `manifest.json` with `id`, `category`, `title`, `path`, `moodTags`, `brightness`, `textOverlaySuitability`, `preferredUse`, `weight`, and `notes`.
4. Run `npm run ambient:scenes:validate` and `npm run verify`.

Paths in the manifest begin with `/ambient/scenes/`. Reject images with embedded text, logos, collage seams, borders, gutters, or panel framing. The library may remain empty; do not add placeholders merely to populate it.

See `docs/ambient.md` for the durable design and architecture constraints.
