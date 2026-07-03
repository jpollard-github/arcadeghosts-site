# AMBIENT-TODO

`docs/AMBIENT-TODO.md` is the single source of truth for Ambient roadmap work inside ArcadeGhosts.

Ambient is a fun personal project.

Treat it like an ambient art installation, not a dashboard and not consulting software.

Use it to decide:

- what Ambient should become next
- what counts as a coherent phase
- which content sources are worth pulling in
- what should stay intentionally out of scope for now

Read with:

1. `docs/AMBIENT.md`
2. `docs/AMBIENT-TODO.md`
3. `app/lib/now.ts`
4. `app/lib/tiny-thoughts.ts`
5. `app/lib/projects.ts`
6. `app/lib/guestbook.ts`
7. `app/writings.ts`
8. `app/site-content/cats.ts`

Guiding principles:

- keep it fun
- prefer beautiful UX over complex engineering
- prefer site data reuse over new content systems
- keep the website as the single source of truth
- avoid unnecessary abstraction
- favor shipping over perfection
- every phase should end in something usable, enjoyable, and visually rewarding

## Cross-Phase Rules

Ambient should primarily consume content the site already knows about:

- Now items
- Tiny Thoughts
- cat photos
- projects
- writings
- guestbook signals
- arcade and movie/music taste surfaces
- Spotify-adjacent music surfaces already present on the site

Ambient should not start by inventing:

- a second CMS
- a separate database just for display scenes
- a heavy scheduling engine
- a complicated device-management backend
- a giant abstraction framework for source adapters before the project earns it

When a new source is added, prefer this order:

1. Reuse a public site route or API that already exists.
2. Reuse a static content file already in the repo.
3. Add a tiny helper that derives display-ready data from existing site content.
4. Only then consider a new content surface.

## Cross-Phase Questions

- Which existing site signals feel best when slowed down and enlarged?
- Which sources create warmth instead of noise?
- Which transitions feel calm instead of “screen saver generic”?
- Which device modes matter first: desktop monitor, tablet, or wall-mounted display?

Status:

In Progress

## Phase 1 — First Glow

### Goal

Ship the first usable Ambient experience as a single full-screen page that already feels pleasant to leave open.

### Checklist

- [x] `[P0]` Create a dedicated `/ambient` route.
- [x] `[P0]` Build a full-screen composition that feels intentional instead of admin-like.
- [x] `[P0]` Support one beautiful default theme with readable type and strong spacing.
- [x] `[P0]` Show a small rotating set of existing site signals rather than placeholders.
- [x] `[P1]` Add simple manual next/previous controls for testing.
- [x] `[P1]` Make the first pass work on desktop and tablet widths without special hardware assumptions.

### Review Criteria

- The page already feels like an installation, not a utility screen.
- It is pleasant to leave open for a few minutes.
- The first version looks calm even with a small content set.
- Nothing about the experience suggests a second CMS or a back-office product.

### Evidence / Sources

- `app/lib/now.ts`
- `app/lib/tiny-thoughts.ts`
- `app/site-content/cats.ts`
- `app/home/*` for tone, pacing, and visual language
- `app/ambient/page.tsx`
- `app/ambient/AmbientDisplay.tsx`
- `app/ambient/ambient.module.css`

### Progress Notes

- `/ambient` now exists as a dedicated first-glow route.
- The first pass uses a small real signal set only: public Now items, recent Tiny Thoughts, and cat-room photography.
- Rotation stays intentionally simple for now: one display stage, automatic cycling, and manual previous/next controls.
- The route hides the normal fixed site chrome while Ambient is active so the screen feels more like an installation.
- The first device-focused follow-up pass now treats landscape tablet review as a first-class proofing target inside the existing review-packet workflow.
- Stable Ambient review states now include the default route plus forced `now`, `tiny-thought`, and `cat` captures for visual comparison.

### Content Sources Used In Phase 1

- `Now` items from `app/lib/now.ts`
- recent `Tiny Thoughts` from `app/lib/tiny-thoughts.ts`
- cat imagery from `app/site-content/cats.ts`

### Known Issues

- Tiny Thoughts currently use a compact display treatment and do not yet surface linked attachments or image attachments inside Ambient.
- Cat signals are intentionally curated from the existing photo rooms rather than randomized deeply.
- Mobile-phone-specific tuning is not the target yet; the first pass is meant for desktop and tablet comfort first.
- Ambient may deserve one more small tablet visual pass before broadening the source library if desk-distance readability still feels uneven on the real Samsung device.

### Known Constraints

- The first pass should stay visually rewarding even if only 3-5 source types are wired.
- Avoid fullscreen and wake-lock complexity until the page itself earns it.

### Exit Criteria

- `/ambient` exists.
- It rotates through real site content.
- It already feels worth showing a friend.

Status:

Complete

## Phase 2 — Signal Library

### Goal

Expand Ambient from a proof of concept into a real content-fed experience powered by existing ArcadeGhosts signals.

### Checklist

- [x] `[P0]` Pull in Now items as a dependable text-first source.
- [x] `[P0]` Pull in Tiny Thoughts as short ambient text moments.
- [x] `[P0]` Pull in cat photography as a warm visual source.
- [x] `[P1]` Pull in projects and writings as slower, more reflective cards.
- [ ] `[P1]` Pull in recent approved guestbook signals in a gentle, non-chatty way.
- [ ] `[P2]` Decide which sources deserve images, text-only modes, or mixed layouts.

### Review Criteria

- Ambient feels like a living extension of the site rather than a disconnected toy.
- Multiple signal types can coexist without visual chaos.
- Text-heavy sources and image-heavy sources both have a coherent place.

### Evidence / Sources

- `/api/now`
- `/api/tiny-thoughts`
- `/api/projects`
- `/api/guestbook`
- `app/writings.ts`
- `app/site-content/cats.ts`
- `app/ambient/page.tsx`
- `app/ambient/AmbientDisplay.tsx`
- `app/ambient/ambient.module.css`

### Progress Notes

- Ambient now rotates across five existing site-connected signal families: `Now`, `Tiny Thoughts`, cat photography, projects, and writings.
- This first Phase 2 pass keeps the visual system intentionally narrow by reusing the existing Ambient text/image stage rather than inventing source-specific layouts.
- `Tiny Thought` signals now render as fuller desk-distance reading moments instead of turning the thought text into the oversized title.
- `Project` signals are derived from existing public project metadata and use trimmed descriptions plus `nextAction` when available to keep the cards alive without becoming task-manager UI.
- `Writing` signals are derived from `app/writings.ts` and intentionally stay short, reflective, and linked back to the site’s writing pages.
- Stable query-param review states now include `type=project` and `type=writing` alongside the earlier `now`, `tiny-thought`, and `cat` states.

### Known Constraints

- Keep source logic lightweight.
- Do not create source-specific mini-products unless a source keeps proving it deserves more.
- Signal weighting is still simple rotation for now, so the next pass may want to tune cadence before adding many more source families.

### Exit Criteria

- Ambient can rotate through enough real site content that it feels alive on repeat viewing.

Status:

In Progress

## Phase 3 — Music, Weather, And Time Of Day

### Goal

Let Ambient start responding to mood, listening, and time rather than feeling like a static slideshow.

### Checklist

- [ ] `[P0]` Define the first music-aware display treatment using existing site music data and Spotify-adjacent surfaces.
- [ ] `[P1]` Add time-of-day theme shifts such as morning, evening, and late-night modes.
- [ ] `[P1]` Add weather-aware styling only if it improves atmosphere instead of clutter.
- [ ] `[P1]` Decide whether “now playing” should be live, cached, or gracefully omitted when unavailable.
- [ ] `[P2]` Explore seasonal variants that can quietly change palette or source weighting.

### Review Criteria

- The display begins to feel alive to the room it is in.
- Music and time cues deepen the mood without turning the project into a data dashboard.
- Missing live data does not make the experience feel broken.

### Evidence / Sources

- `app/music-data.ts`
- `app/music/*`
- music copy and mood language already present in the site

### Known Constraints

- Spotify live integration is optional, not a requirement for the project to feel successful.
- Weather and time should guide mood first, not become widgets.

### Exit Criteria

- Ambient has a stronger sense of atmosphere and changing time.

Status:

Planned

## Phase 4 — Motion Language

### Goal

Give Ambient its own calm motion vocabulary: gentle crossfades, quiet transitions, and enough movement to feel alive without becoming distracting.

### Checklist

- [ ] `[P0]` Add crossfades between signals.
- [ ] `[P0]` Tune default rotation timing.
- [ ] `[P1]` Add subtle animation to text/image reveals where it improves mood.
- [ ] `[P1]` Prevent abrupt layout jumps when signal types change.
- [ ] `[P2]` Add optional motion reduction behavior for accessibility and low-stimulation use.

### Review Criteria

- Transitions feel dreamy or reflective, not corporate or slideshow-generic.
- Motion helps the installation disappear into the room.
- Reduced-motion mode still looks intentional.

### Evidence / Sources

- Existing homepage and music-page atmosphere cues
- future packet screenshots or local captures once the route exists

### Known Constraints

- Avoid animation systems that become harder to maintain than the display itself.
- Smoothness matters more than novelty.

### Exit Criteria

- Ambient feels visibly more magical than Phase 2, even with the same content sources.

Status:

Planned

## Phase 5 — Kiosk Comfort

### Goal

Make Ambient comfortable to leave running for long stretches on real hardware.

### Checklist

- [ ] `[P0]` Support a clean fullscreen or near-fullscreen mode.
- [ ] `[P0]` Add tablet-friendly touch targets and gesture basics.
- [ ] `[P1]` Add keyboard shortcuts for next, previous, pause, and fullscreen.
- [ ] `[P1]` Hide cursor and reduce stray UI chrome where appropriate.
- [ ] `[P1]` Add simple burn-in prevention behavior such as subtle drift or layout variance.
- [ ] `[P2]` Explore wake lock or sleep/wake behavior only if real devices need it.

### Review Criteria

- A tablet or monitor can run Ambient without feeling fiddly.
- Interaction stays lightweight and mostly invisible.
- The screen feels like an object in the room, not just a webpage left open.

### Evidence / Sources

- local device testing
- fullscreen browser behavior on iPad, Android tablet, or desktop kiosk setups

### Known Constraints

- Real-device comfort matters more than simulated elegance.
- Do not build a full device-management system.

### Exit Criteria

- Ambient is viable as a real always-on or often-on display experiment.

Status:

Planned

## Phase 6 — Profile Engine

### Goal

Turn Ambient into one reusable engine that can express multiple moods and rooms through profiles rather than separate pages.

### Checklist

- [ ] `[P0]` Define a lightweight profile model.
- [ ] `[P0]` Support profile-level source selection, timing, and theme choices.
- [ ] `[P1]` Prototype a few clearly different profiles such as `Office`, `Living Room`, and `Bedroom`.
- [ ] `[P1]` Reserve room for future profiles like `Music`, `Holiday`, `Retro`, `Photography`, and `Minimal`.
- [ ] `[P2]` Ensure profiles share one engine instead of diverging into separate apps.

### Review Criteria

- Profiles feel meaningfully different without requiring different codebases.
- The project becomes more replayable and room-aware.
- Profile support stays simple enough to reason about.

### Evidence / Sources

- `docs/AMBIENT.md`
- existing site source inventory

### Known Constraints

- Profiles should be configuration, not architecture theater.
- Do not add a profile editor before a few real profiles exist.

### Exit Criteria

- Ambient can plausibly serve different rooms or moods from one engine.

Status:

Planned

## Phase 7 — Settings Without A Back Office

### Goal

Add just enough configuration to make Ambient adaptable without turning it into another admin suite.

### Checklist

- [ ] `[P0]` Add a simple settings or config view.
- [ ] `[P0]` Allow rotation timing changes.
- [ ] `[P1]` Allow source enable/disable by profile or local preference.
- [ ] `[P1]` Allow theme/day-night preference override.
- [ ] `[P2]` Decide whether settings should live in query params, local storage, or a tiny persisted site config.

### Review Criteria

- Settings are lightweight and pleasant.
- Configuration helps the display fit a room without exposing a huge control surface.
- The system still feels personal and playful, not managerial.

### Evidence / Sources

- existing admin patterns only as reference, not as a template to copy blindly

### Known Constraints

- Ambient should not inherit the whole admin-area mindset.
- Keep site content authoritative; settings should shape presentation, not content truth.

### Exit Criteria

- A person can tune Ambient for a device or room without editing code.

Status:

Planned

## Phase 8 — Memory And Season Layers

### Goal

Deepen Ambient with richer recurring moods: seasons, anniversaries, memories, quotes, old photos, movie signals, and “on this day” style resurfacing.

### Checklist

- [ ] `[P0]` Identify which memory-oriented sources already exist in the site and can be resurfaced safely.
- [ ] `[P1]` Add seasonal content weighting.
- [ ] `[P1]` Add simple “on this day” or “from another year” resurfacing if existing timestamps make it easy.
- [ ] `[P1]` Add movies, arcade, or music-league flavored moments where they strengthen atmosphere.
- [ ] `[P2]` Add a small quotes or fragments layer only if it earns its place.

### Review Criteria

- Ambient starts to feel emotionally rich, not just informationally varied.
- Nostalgia and seasonality feel tender, not gimmicky.
- Memory resurfacing never overwhelms the rest of the experience.

### Evidence / Sources

- `app/writings.ts`
- cat photo archives
- music and movie pages
- project timestamps
- guestbook timestamps

### Known Constraints

- Do not create a giant memory database for Phase 8.
- Prefer recombining existing site artifacts before writing new content pipelines.

### Exit Criteria

- Ambient has genuine return-value because it can surprise Jason with his own world.

Status:

Planned

## Phase 9 — Resilience And Offline Grace

### Goal

Make Ambient resilient enough that it still feels lovely when live sources fail, the network is flaky, or a device sits offline for a while.

### Checklist

- [ ] `[P0]` Add graceful fallback behavior for missing or failing sources.
- [ ] `[P0]` Ensure the display can keep rotating with a cached or prebuilt signal pool.
- [ ] `[P1]` Preload important assets to reduce visible popping.
- [ ] `[P1]` Add lightweight offline or stale-data indicators only if they can be subtle.
- [ ] `[P2]` Tune performance for always-on usage.

### Review Criteria

- The display degrades gracefully instead of collapsing into emptiness.
- Performance stays smooth on modest hardware.
- Failures feel hidden or poetic rather than technical.

### Evidence / Sources

- real-device testing
- local offline tests
- image-heavy cat and arcade sources

### Known Constraints

- Reliability should not require a lot of new infrastructure.
- The fallback mode should still feel like Ambient, not like an error page.

### Exit Criteria

- Ambient remains pleasant even under imperfect conditions.

Status:

Planned

## Phase 10 — Naming, Packaging, And Public Identity

### Goal

Decide what Ambient becomes once it is mature enough to deserve a stronger identity and a repeatable deployment shape.

### Checklist

- [ ] `[P0]` Revisit whether `Ambient` stays the internal name only.
- [ ] `[P1]` Explore public identity ideas such as `ArcadeGhosts Ambient`, `ArcadeGhosts Display`, `ArcadeGhosts Canvas`, `Signal`, `Pulse`, `Beacon`, `Glow`, or `Neon`.
- [ ] `[P1]` Decide whether Ambient should stay private, semi-private, or become a public-first ArcadeGhosts feature.
- [ ] `[P1]` Document the cleanest deployment modes for home hardware, tablet, and wall display usage.
- [ ] `[P2]` Consider whether a shareable public demo mode makes sense later.

### Review Criteria

- The project has earned a name decision through actual use, not vibes alone.
- Packaging choices support delight rather than creating maintenance burden.
- Branding stays consistent with ArcadeGhosts without being forced too early.

### Evidence / Sources

- lived usage after earlier phases
- `docs/AMBIENT.md`

### Known Constraints

- Do not solve branding before the project has a real personality.
- A great private installation is better than an overextended public product.

### Exit Criteria

- Ambient has a believable long-term identity and home.

Status:

Planned

## Later Option — Optional News Window / Current Events Mode

### Goal

Preserve room for an optional, manually invoked news or current-events view without letting it distort Ambient's calming default purpose.

### Checklist

- [ ] `[P2]` Decide whether news belongs as a manual button, gesture, temporary mode, or deliberately configured profile instead of part of the default rotation.
- [ ] `[P2]` Define a calm news presentation based on headlines, summaries, or digests rather than live-feed behavior.
- [ ] `[P2]` Decide whether source controls or category preferences such as local, tech, AI, or general news are worth supporting later.
- [ ] `[P2]` Explore time-boxed modes such as a manually triggered five-minute news window.
- [ ] `[P2]` Ensure any breaking-news or alerts mode stays rare, dismissible, and clearly outside the normal Ambient mood loop.

### Review Criteria

- News stays optional and later-phase only.
- Ambient does not become cable news wallpaper.
- The calming default rotation remains intact.
- The interaction feels intentional and bounded rather than like a stress-inducing feed.

### Product Guidance

- Do not include autoplay video.
- Do not include a doomscroll-style feed.
- Do not make news part of the default calming Ambient rotation.
- Prefer manual invocation such as `Show recent news`.
- Keep the mode dismissible and time-boxed.
- Prioritize calm digests over live streams.

### Possible Future Modes

- `Recent News` button
- `Breaking News` only for major events
- local alerts or weather-adjacent alerts
- tech or AI news profile
- quiet headline digest
- manually triggered five-minute news view

### Known Constraints

- This should not enter current Phase 2 implementation work.
- Do not build live-news plumbing before the core Ambient experience earns it.
- If this ever ships, it should remain a small optional lane rather than a new product direction.

Status:

Deferred / Later
