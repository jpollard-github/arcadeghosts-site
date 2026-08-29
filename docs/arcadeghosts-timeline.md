# ArcadeGhosts Timeline

This history is reconstructed from the repository's Git commits and representative diffs. It follows the changes that materially altered what ArcadeGhosts contained, how it presented itself, or which parts remained public; routine maintenance and dependency work are omitted.

## The neon personal site takes shape

**Approximate period:** 2026-06-13 to 2026-06-16

### What was created

The initial commit already contained a working Next.js personal site with the neon-forest visual identity, an About section, a project area, an arcade collection, writing and music sections, a Beverly and Lucinda gallery, and the playable Between Two Lodges game.

The following three days added the older cat gallery, a Movies and TV collection, the first two repository-backed writings, Signal Booth, a database-backed guestbook, Tiny Thoughts, SoftSignal, and a fuller public view of current work and projects. Separate routes replaced several sections that had begun as one long homepage.

### What was torn down

The original contact section was removed when the guestbook arrived. This was a replacement of one public interaction with another, not merely an addition.

### What was refreshed

The homepage shifted from a mostly static personal introduction into what the commits called a “living portfolio.” Current work, project status, writing, Tiny Thoughts, playful experiments, cat rooms, and the guestbook became distinct parts of the site, with administrative editing behind several of them.

### Why this period matters

Most of the site's durable subject matter appeared immediately: personal writing, cats, arcade history, software experiments, and small interactive rooms. The speed of the additions also established a pattern visible throughout the history: new public surfaces were tested quickly, and some were later removed just as decisively.

### Representative commits

- `48cc4d0` — 2026-06-13 — Initial personal site
- `244b150` — 2026-06-14 — Add Movies and TV, add music league, add writings
- `d030827` — 2026-06-14 — Add Guestbook, remove contact section, clean up site
- `7a847d3` — 2026-06-14 — Add TinyThoughts
- `28160ff` — 2026-06-16 — Living portfolio

## The portfolio expands into a workshop and storefront

**Approximate period:** 2026-06-19 to 2026-06-30

### What was created

A public Work With Me page offered small fixed-price software, automation, and AI-workflow projects. It grew from a contact-oriented service page into an inquiry flow with a paid technical strategy session and Stripe link.

Elsewhere, the music area became a large, data-shaped listening portrait with a listening time machine and themed views. The site also gained a terminal room, RSS feeds for writing and Tiny Thoughts, an updates page, a fuller About page, a build log, search, and several editorial tools.

### What was refreshed

The homepage was split into reusable sections and became more densely cross-linked. A late-June mobile pass substantially revised typography, spacing, reusable page layouts, and the Work With Me presentation rather than simply making isolated CSS corrections.

### Why this period matters

This was the broadest version of ArcadeGhosts in the available history. It combined a personal site, living portfolio, publishing system, experimental playground, and small commercial offering, which makes the later contraction legible as a real change in direction rather than ordinary cleanup.

### Representative commits

- `7470a2e` — 2026-06-20 — Add work-with-me page and fix some project admin issues
- `6a60e6b` — 2026-06-20 — Refactor project for maintainability
- `a9101e4` — 2026-06-22 — Update with stripe
- `c138546` — 2026-06-27 — Updated site
- `095c252` — 2026-06-27 — More features
- `dc4ce6b` — 2026-06-30 — Mobile and updated todos

## Ambient grows while the main site contracts

**Approximate period:** 2026-07-03 to 2026-07-18

### What was created

Ambient began as a separate slow-display experiment assembled from ArcadeGhosts material. It was expanded with time-aware presentation, scene selection, cat rooms, Tiny Thoughts, writings, and project signals, then made installable as a PWA. The surviving repository notes later refer to this experiment as Ambient / First Glow.

Screening was also created during this period as the successor to the Movies and TV room. The old `/movies-tv` URL was retained as a redirect rather than simply disappearing.

### What was torn down

The main site lost the build log, updates page, homepage Now and spotlight sections, surprise and “start here” paths, and much of its navigational scaffolding. Work With Me was first reduced and then removed from the public site. The guestbook, Signal Booth, search, several editorial/admin systems, the public homepage project section, the elaborate music page, and the standalone About route followed.

Ambient continued to receive focused work during this contraction—including its PWA treatment on July 9—but the complete public experiment, its scene system, manifest, icons, tests, and dedicated documentation were removed on July 18. A short historical note survived in the repository, but the route did not.

### What was refreshed

The homepage hero, section order, navigation, and footer were simplified. Movies and TV was recast as Screening: less a general catalog and more a curated shelf of screen stories that stayed meaningful.

### Why this period matters

This is the clearest reversal in the history. One ambitious experiment grew while the surrounding site was being stripped back, and then that experiment was stripped out too. The result was a smaller public site centered more directly on writing, Tiny Thoughts, games, screening, cats, and a brief About section.

### Representative commits

- `9332e0e` — 2026-07-03 — Review cycle
- `54b5cc3` — 2026-07-05 — Clean up my site
- `ee029f6` — 2026-07-05 — Remove work
- `3873572` — 2026-07-05 — Add screening section
- `631a404` — 2026-07-09 — Add PWA for ambient
- `2f39209` — 2026-07-11 — Removed guestbook
- `9e6f883` — 2026-07-12 — Remove detritus
- `30675e6` — 2026-07-12 — Removed projects
- `6f6c018` — 2026-07-12 — Remove unhelpful music page and all refs
- `cffc9df` — 2026-07-18 — Remove /ambient, skill, docs, etc

## Curated shelves replace the larger music system

**Approximate period:** 2026-07-20 to 2026-07-27

### What was created

Listening arrived as a repository-backed shelf of album covers and short personal notes. Reading followed the next day with the same direct collection pattern for books. Both received dedicated pages and smaller homepage sections.

Screening remained and grew by a few deliberately added films, including *Stay*, *Dragonfly*, and *Wicker Park*.

### What was refreshed

Music returned in a materially simpler form. Instead of restoring the removed dashboards, listening history, genre weather, and other generated views, the new Listening room presented a finite hand-maintained collection. Reading and Screening used the same basic idea without becoming one generalized catalog.

### Why this period matters

These shelves restored breadth after the teardown without restoring the earlier machinery. They made albums, books, and screen stories parallel parts of the site's identity while keeping their contents in the repository and their presentation comparatively plain.

### Representative commits

- `3d82262` — 2026-07-20 — Add listening
- `67edd31` — 2026-07-21 — Add reading
- `cb96d21` — 2026-07-26 — Add Stay to screening
- `237129d` — 2026-07-26 — Add Dragonfly
- `b58752b` — 2026-07-27 — Add Wicker Park

## Live With Me appears and is withdrawn

**Approximate period:** 2026-07-31 to 2026-07-31

### What was created

Live With Me was added as a public personal page about the kind of relationship and ordinary shared life Jason hoped to find. A second commit gave it a distinct layout, its own styling, a photograph, structured sections, and links from the homepage and footer.

### What was torn down

The public route, homepage invitation, footer link, sitemap entry, and public image assets were removed later the same day. The page's implementation, content, styling, and images were moved under `app/_preserved/live-with-me/`, so the work was retained in source without remaining part of the public site.

### What was refreshed

Between its first and second commits, the page changed from an ordinary public route into a visually separate room with its own shell. That redesign survived only in the preserved copy.

### Why this period matters

This is the shortest complete creation-and-removal cycle in the history. Git supports the facts that the page was built, substantially styled, made public, and then withdrawn; it does not establish how long a deployed version was reachable or why it was removed.

### Representative commits

- `151b2eb` — 2026-07-31 — live-with-me 1
- `d4ea22e` — 2026-07-31 — live-with-me 2
- `ca72967` — 2026-07-31 — goodbye live-with-me

## Three writings and a sharper ending

**Approximate period:** 2026-08-02 to 2026-08-02

### What was created

“AI: Its Safety Produces Your Insanity” became the third repository-backed writing, alongside “Thank You Yogi” and “My First Cat.” Its addition also introduced a dedicated Markdown-rendering path for writings.

### What was torn down

The related-signal cards were removed from writing pages, both cat rooms, Screening, and The Lodges Within. The writings themselves remained; the change removed the cross-promotional layer around them.

### What was refreshed

The homepage writing section was changed to show all three writings. The About section then gained a concise statement beginning “Notice what is real,” without rebuilding the longer About route removed in July.

### Why this period matters

The latest commits in the available history leave the site with fewer interpretive prompts around its content and a more direct statement of identity. The final state is not the smallest version of ArcadeGhosts, but its active parts are more plainly separated into writings, short thoughts, games, collections, cats, and a compact About section.

### Representative commits

- `1f45e65` — 2026-08-02 — AI Insanity
- `ef4f1dc` — 2026-08-02 — Three writings
- `6ce8e3e` — 2026-08-02 — Sharper

## What survived

The strongest continuity runs back to the initial commit: ArcadeGhosts remains a personal site where software experiments, writing, arcade history, and cat photos share one atmosphere. Beverly and Lucinda, the older cat room, the arcade collection, Between Two Lodges, and the first two writings all survived the larger removals. Tiny Thoughts, added on the second day, also remained as both a public stream and an admin-managed feature.

Some ideas survived by changing form. Movies and TV became Screening, while the large music system disappeared and later returned as the smaller Listening shelf. The terminal and Twin Peaks-shaped Lodges experience survived even as Signal Booth, Ambient, the guestbook, Work With Me, Live With Me, and several navigation experiments did not remain public.

## Notes on uncertainty

- The available history begins on 2026-06-13 with an already substantial initial commit. Git cannot establish whether any design or content existed elsewhere before that snapshot.
- Many changes are compressed into a few days, and several commit subjects are vague or misleading when read without their diffs. The era boundaries are therefore descriptive groupings, not labels found in the repository.
- Git records committed source states, not production deployment duration. It cannot confirm that every intermediate route was deployed publicly or how long visitors could reach it.
- File moves into route groups and preserved directories make path-only history incomplete. Claims about continuities and removals were checked against representative diffs and resulting trees, but the history does not always record intent.
- Routine dependency updates, merge-only commits, generated reports, formatting changes, and test-only maintenance were reviewed as part of the full history but excluded from the narrative.
