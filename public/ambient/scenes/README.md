# Ambient Scene Library

`public/ambient/scenes/` is the canonical repo location for reusable Ambient scene imagery.

Sibling docs that travel with this scene library:

- `AMBIENT.md`
- `AMBIENT-TODO.md`

These are not throwaway placeholders.

They are reusable `Ambient Scenes`: calm, dark, warm, slightly haunted images that can sit beside text-heavy Ambient cards without making the display feel like software.

Use this library for:

- Ambient side-panel imagery when a signal has no first-party photo of its own
- future fallback states that should still feel curated
- possible later reuse on other ArcadeGhosts surfaces that need subtle atmospheric art

## Goals

- replace repeated placeholder imagery with a diverse reusable scene library
- support text-heavy `Tiny Thought`, `Project`, and `Writing` cards
- keep images calm, dark, warm, slightly haunted, and non-distracting
- make the library safe to expand over time without changing Ambient route code

## Categories

Current planned categories and eventual target counts:

- `misty-forests`: 4
- `moonlit-lakes`: 4
- `night-skies`: 5
- `cozy-desks`: 4
- `arcade-glow`: 4
- `crt-reflections`: 4
- `rain-on-windows`: 4
- `vinyl-headphones`: 4
- `books-notebooks`: 4
- `cat-silhouettes`: 4
- `city-streets`: 4
- `warm-lamps-shadows`: 4

Current eventual target:

- roughly `30-50` scenes total
- currently planned target count in the manifest: `49`

## Image Requirements

- original or properly licensed images only
- prefer `WebP`
- prefer `16:9` landscape
- target `1920x1080` or larger
- no embedded text
- no logos
- no recognizable copyrighted characters
- no busy focal points that fight with text
- favor calm atmosphere over spectacle
- images should work beside `Tiny Thought`, `Project`, and `Writing` cards
- production scene batches should use separate first-class `16:9` images, not collage panels

## Mood Notes

The desired visual direction is:

- calm
- dim but readable
- warm without feeling sepia
- slightly haunted
- intimate rather than cinematic
- good with negative space
- strong enough to feel intentional
- quiet enough not to steal the card

Avoid:

- jump-scare contrast
- action-heavy scenes
- bright daylight unless the composition still feels soft
- aggressive neon overload
- obvious AI text artifacts
- cluttered foregrounds
- anything that makes Ambient feel like a promo poster

## Folder Structure

```text
/public/ambient/scenes/
├── misty-forests/
├── moonlit-lakes/
├── night-skies/
├── cozy-desks/
├── arcade-glow/
├── crt-reflections/
├── rain-on-windows/
├── vinyl-headphones/
├── books-notebooks/
├── cat-silhouettes/
├── city-streets/
├── warm-lamps-shadows/
├── manifest.json
└── README.md
```

## Naming Guidance

Use category-first, stable filenames:

- `misty-forest-01.webp`
- `moonlit-lake-02.webp`
- `night-sky-03.webp`
- `cozy-desk-01.webp`

Keep names short, descriptive, and snake-free.

Recommended pattern by category:

- `misty-forest-01.webp`
- `moonlit-lake-01.webp`
- `night-sky-01.webp`
- `cozy-desk-01.webp`
- `arcade-glow-01.webp`
- `crt-reflection-01.webp`
- `rain-window-01.webp`
- `vinyl-headphones-01.webp`
- `books-notebook-01.webp`
- `cat-silhouette-01.webp`
- `city-street-01.webp`
- `warm-lamp-01.webp`

Use two-digit numbering even for small batches so later additions stay tidy.

## Rejection Criteria

Reject any scene batch that includes:

- visible seams
- white lines
- borders
- gutters
- collage panel edges
- multi-panel framing artifacts

If those artifacts are visible in Ambient, the batch is not production-ready.

## Manifest Shape

Each scene entry in `manifest.json` should include:

- `id`
- `category`
- `title`
- `path`
- `moodTags`
- `brightness`
- `textOverlaySuitability`
- `preferredUse`
- `weight`
- `notes`

Example entry:

```json
{
  "id": "warm-lamp-01",
  "category": "warm-lamps-shadows",
  "title": "Warm Lamp Corner",
  "path": "/ambient/scenes/warm-lamps-shadows/warm-lamp-01.webp",
  "moodTags": ["warm", "quiet", "night", "negative-space"],
  "brightness": "dark",
  "textOverlaySuitability": "excellent",
  "preferredUse": "side-panel",
  "weight": 4,
  "notes": "Soft lamp pool with clean right-side breathing room."
}
```

## Import Workflow

1. Generate images outside the repo using an approved image generation tool, or source properly licensed images manually.
2. Export as `WebP`, `16:9`, ideally `1920x1080`.
3. Save each file into the correct category folder.
4. Add a matching entry to `manifest.json`.
5. Run `npm run ambient:scenes:validate`.
6. Run `npm run verify`.
7. Generate an Ambient review packet.

### Where To Put Files

Examples:

- `public/ambient/scenes/cozy-desks/cozy-desk-01.webp`
- `public/ambient/scenes/night-skies/night-sky-01.webp`
- `public/ambient/scenes/rain-on-windows/rain-window-01.webp`

The `path` field in the manifest should point to the public-facing asset path, for example:

- `/ambient/scenes/cozy-desks/cozy-desk-01.webp`
- `/ambient/scenes/night-skies/night-sky-01.webp`

### Production Import Standard

Preferred workflow:

1. Prepare separate `16:9` source images for the batch.
2. Save each image as its own standalone file.
3. Convert to `WebP` if needed.
4. Add one manifest entry per file.

Collage slicing is not accepted for final Ambient scenes unless it is manually inspected and explicitly approved afterward.

If a collage must be used in an emergency:

- inspect every slice at full size
- reject any slice with visible seams, borders, gutters, or panel-edge artifacts
- treat the result as provisional until replaced by separate first-class images

Generated images should not include borders, gutters, panel dividers, or collage framing in the source image at all.

### How To Add Manifest Entries

Add one object per image inside the top-level `scenes` array.

Use:

- `id`: short stable id, usually matching the filename without extension
- `category`: one of the existing scene categories
- `title`: human-readable title for alt text and review packets
- `path`: public path beginning with `/ambient/scenes/...`
- `moodTags`: short descriptive tags such as `warm`, `rainy`, `quiet`, `negative-space`
- `brightness`: `dark`, `medium`, or `light`
- `textOverlaySuitability`: `excellent`, `good`, or `poor`
- `preferredUse`: `background`, `side-panel`, or `full-bleed`
- `weight`: small positive integer, usually `1-5`
- `notes`: short note about why the image works

Example starter batch entry set:

```json
{
  "scenes": [
    {
      "id": "cozy-desk-01",
      "category": "cozy-desks",
      "title": "Desk Lamp And Keyboard",
      "path": "/ambient/scenes/cozy-desks/cozy-desk-01.webp",
      "moodTags": ["warm", "desk", "night", "negative-space"],
      "brightness": "dark",
      "textOverlaySuitability": "excellent",
      "preferredUse": "side-panel",
      "weight": 4,
      "notes": "Good right-side breathing room for project cards."
    },
    {
      "id": "night-sky-01",
      "category": "night-skies",
      "title": "Faint Milky Way Ridge",
      "path": "/ambient/scenes/night-skies/night-sky-01.webp",
      "moodTags": ["sky", "quiet", "spacious", "cool"],
      "brightness": "dark",
      "textOverlaySuitability": "good",
      "preferredUse": "side-panel",
      "weight": 3,
      "notes": "Works well for reflective text-heavy signals."
    }
  ]
}
```

### First Batch Recommendation

For the first import pass, keep it small and reviewable:

1. Add `1-2` images in `cozy-desks`
2. Add `1-2` images in `warm-lamps-shadows`
3. Add `1` image in `night-skies`
4. Add `1` image in `rain-on-windows`

That is enough to verify:

- the manifest workflow
- tablet-landscape visual quality
- how text-heavy Ambient cards feel with real side imagery
- whether any categories need retuning before a larger batch

### Exact First-Batch Command Flow

After dropping in the first images and updating the manifest:

```bash
npm run ambient:scenes:validate
npm run verify
```

## Validation

Use:

```bash
npm run ambient:scenes:validate
```

The validator checks:

- manifest exists
- category ids are recognized
- required fields are present
- scene ids are unique
- referenced file paths exist
- file extensions are allowed
- the library can remain empty until the first real batch is ready

## Integration Notes

- Cat-specific cards should keep their real cat imagery.
- Text-heavy Ambient cards may borrow from this library when no first-party image is available.
- An empty library is valid; Ambient should degrade gracefully until real scenes are imported.
- The route should never depend on one repeated fallback image again once the library is populated.

## Future Expansion Ideas

- category weighting by signal kind
- seasonal subsets
- low-stimulation bedtime subsets
- profile-specific scene pools
- review notes for which scenes work best on tablet landscape
