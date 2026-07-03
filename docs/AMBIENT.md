# AMBIENT

## Vision

Ambient is a long-term personal project for turning ArcadeGhosts into a living room object.

Not a dashboard.

Not a productivity surface.

Not a consulting product.

It should feel like a calm, slightly haunted, emotionally warm ambient display that quietly remixes the world already living inside the site: songs, cats, tiny thoughts, projects, memories, writing, weather moods, and small human signals.

The ideal outcome is simple:

leave it open on a screen and be glad it exists.

## Goals

- create something beautiful enough to leave running
- reuse the site’s existing content instead of building a second content platform
- make the display feel alive without feeling busy
- produce a fun personal artifact at every phase, not just a future promise
- let ArcadeGhosts spill into physical space a little
- keep engineering light enough that the joy survives

## Design Philosophy

Ambient should be guided by a few stubborn rules:

- beauty first
- mood over metrics
- calm over cleverness
- reuse over reinvention
- shipping over perfection
- one elegant route is better than a sprawling subsystem

The visual target is closer to:

- a gallery wall
- a digital picture frame
- a poetic screensaver
- a slow-moving public signal

It is not trying to be:

- a media-center clone
- a home dashboard
- a giant automation hub
- a second admin product

## Architecture

### High-level shape

Ambient should probably begin as one route, likely `/ambient`, inside the existing Next.js app.

The simplest useful architecture is:

1. gather signals from existing site data
2. normalize them into a lightweight display-friendly shape
3. choose a profile
4. rotate through those signals with good visual pacing

### Preferred source strategy

Use existing public sources first:

- `/api/now`
- `/api/tiny-thoughts`
- `/api/projects`
- `/api/guestbook`

Use existing repo content directly when simpler:

- `app/writings.ts`
- `app/site-content/cats.ts`
- `app/music-data.ts`
- existing music, movie, arcade, and image content already embedded in the site

### Single source of truth

The website should remain the single source of truth for content.

Ambient should mostly consume and remix:

- content that already exists
- media that already exists
- structures that already exist

It should avoid creating parallel content stores unless there is a very strong reason.

### What “engine” means here

The word “engine” should stay humble.

For Ambient, the engine likely means:

- one signal queue builder
- one rotation/timing system
- one set of display layouts
- one profile model
- one small settings layer

If the code starts sounding like a framework before the display is beautiful, something has gone wrong.

## Current Source Inventory

Ambient already has a surprisingly rich library to borrow from:

### Strong first-wave sources

- Now items
- Tiny Thoughts
- cat photo archives
- projects
- writings
- guestbook excerpts

### Strong second-wave sources

- music moods and playlists
- arcade photos and nostalgia
- movies / TV taste surfaces
- seasonal color and time-of-day behavior

### Nice optional later sources

- weather
- calendar
- “on this day”
- random memories
- quotes
- GitHub activity

The question is not “how many sources can fit?”

The question is “which ones make the display feel more alive?”

## Hardware Targets

Ambient should aim at modest, realistic devices first:

- an old iPad or Android tablet on a stand
- a monitor in an office or studio
- a spare TV with a browser attached
- a small mini PC or laptop in kiosk mode

Good early targets:

- landscape tablet
- 1080p desktop display
- wall-adjacent monitor

Nice later experiments:

- vertical portrait display
- bedside display profile
- always-on hallway or kitchen screen

Not a priority right now:

- e-ink
- dedicated native app builds
- custom hardware shells

## Deployment Ideas

Possible deployment modes:

- a normal public or semi-private ArcadeGhosts route
- a fullscreen browser tab in kiosk mode
- a home-screen-installed PWA later, if it earns it
- a passwordless local display URL with profile query params
- a device-specific shortcut like `/ambient?profile=living-room`

Early deployment should stay extremely boring:

- same repo
- same app
- same hosting

If hardware-specific behavior is needed later, that should follow demonstrated use, not precede it.

## Display Profiles

Ambient should not become a pile of separate ambient pages.

Instead, it should grow toward one Ambient engine that supports multiple display profiles.

Example profiles:

- Office
- Living Room
- Bedroom
- Music
- Holiday
- Retro
- Photography
- Minimal

Profiles should mainly choose:

- which sources are active
- which layouts are allowed
- how long rotations last
- how much motion is used
- which theme or palette is preferred

Profiles should not require separate codebases or parallel content systems.

This does not need to be immediate, but the design should leave room for it.

## Branding

The internal project name is `Ambient`.

That is enough for now.

Later, if the project grows into a first-class ArcadeGhosts feature, it may deserve a more public identity.

Possible future directions:

- ArcadeGhosts Ambient
- ArcadeGhosts Display
- ArcadeGhosts Canvas
- Signal
- Pulse
- Beacon
- Glow
- Neon

No naming decision is required now.

The right time to revisit branding is after the project has developed a real personality through actual use.

## Inspiration

Possible inspiration points:

- digital picture frames that feel curated instead of generic
- museum wall labels and gallery pacing
- old screen savers with more taste and less noise
- soft signage in quiet bookstores, bars, record shops, and lobbies
- late-night music visuals
- understated hotel art screens
- visual mixtapes
- the feeling of a room having weather

Ambient should feel closer to emotional set design than product UI.

## Future Ideas

- live or cached Spotify now playing
- recently played snapshots
- Music League highlights
- weather-influenced palettes
- seasonal rotations
- “on this day” resurfacing
- memory-mode profiles for specific rooms
- remote control from phone or keyboard
- soft ambient sound or silent visualizer experiments
- low-stimulation bedtime mode
- holiday or event-specific one-off profiles

## Optional News Window / Current Events Mode

Ambient may eventually support an optional way to check recent or breaking news.

This should be treated as a later-phase mode, not a default Ambient behavior.

Important rules:

- do not include autoplay video
- do not include a doomscroll-style feed
- do not make news part of the default calming Ambient rotation
- prefer a manual button, gesture, profile, or temporary mode such as `Show recent news`
- keep the experience time-boxed and easy to dismiss
- prioritize headlines, summaries, or calm digests over live feeds
- consider source controls, categories, and local / tech / AI / general-news preferences
- avoid turning Ambient into a stress machine

Possible future shapes:

- a `Recent News` button
- a `Breaking News` mode only for major events
- local alerts or weather-adjacent alerts
- a tech or AI news profile
- a quiet headline digest
- a manually triggered five-minute news view

Product guidance:

Ambient should not become cable news wallpaper.

If news ever appears, it should do so only when Jason asks for it or when a deliberately configured profile makes room for it.

## Non-Goals

Ambient is not trying to become:

- a smart-home hub
- a Notion wallboard
- a family calendar center
- a business dashboard
- a BI surface
- a second CMS
- an excuse for a giant abstraction pass through the repo

It also should not force the rest of ArcadeGhosts to reorganize around it.

Ambient should be a beautiful consumer of site content, not the new owner of the whole system.

## Lessons Learned

Even before implementation, a few things are already clear:

- ArcadeGhosts already contains enough signal to power a meaningful first version.
- The biggest risk is not lack of content. It is adding too many systems too early.
- The project will probably get better faster through visual iteration than through architecture work.
- Existing site APIs and content files already make a reuse-first strategy realistic.
- The right question is not “what can Ambient ingest?” but “what is worth sitting with on a wall?”

## Open Questions

- What should the very first screen feel like when Ambient loads?
- Which sources are actually soothing, and which only sound interesting on paper?
- Should Ambient default to randomness, curation, or profile-specific weighting?
- How much text is too much for a room-scale display?
- Does live Spotify matter enough to justify the added fragility?
- Should guestbook content appear as often as Tiny Thoughts, or much less often?
- Which device deserves the first real hardware test?
- Should settings stay local-only for a long time?
- At what point does Ambient earn its own public-facing name?
- If news ever exists here, what is the calmest possible interaction model that still feels genuinely useful?
