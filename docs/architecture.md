# Architecture

## Overview

This is a Next.js App Router application with three main layers:

1. Public route UI
2. Admin UI + API routes
3. Shared data/helpers for storage, validation, and rendering

The codebase leans toward simple colocated modules instead of heavy abstraction. The recent refactors mostly split large files into route- or feature-level modules without changing the basic architecture.

## Route Structure

### Public routes

- `app/page.tsx`
  Homepage composition
- `app/work-with-me/page.tsx`
  Personal consulting/side-project page
- `app/music/page.tsx`
  Music page composition
- `app/arcade/page.tsx`
- `app/movies-tv/page.tsx`
- `app/twin-peaks-self/page.tsx`
- `app/cats/.../page.tsx`
- `app/writings/[slug]/page.tsx`

### Admin routes

- `app/admin/page.tsx`
- `app/admin/guestbook/page.tsx`
- `app/admin/tiny-thoughts/page.tsx`
- `app/admin/now/page.tsx`
- `app/admin/projects/page.tsx`
- `app/admin/context-refresh/page.tsx`

Admin pages are protected by a shared session cookie and backed by `/api/admin/*` route handlers.

## Layout And Styling

Global shell:

- `app/layout.tsx`
- `app/globals.css`

Route-specific styling:

- `app/music/layout.tsx` + `app/music/music.css`
- `app/admin/layout.tsx` + `app/admin/admin.css`

The current pattern is:

- keep true site-wide primitives in `globals.css`
- move heavy route-specific styling into local route layouts when a page grows large enough

## Component Architecture

### Homepage

Homepage rendering is now mostly composition:

- `app/page.tsx`
- `app/home/HomeHero.tsx`
- `app/home/HomeIntroBand.tsx`
- `app/home/HomeNow.tsx`
- `app/home/HomeProjects.tsx`
- `app/home/HomeWriting.tsx`
- `app/home/HomeTinyThoughts.tsx`
- `app/home/HomeFunAndGames.tsx`
- `app/home/HomeAbout.tsx`
- `app/home/HomeCats.tsx`
- `app/home/HomeGuestbook.tsx`

Supporting homepage constants/helpers:

- `app/home/data.ts`
- `app/home/project-helpers.ts`

### Music page

Music also follows a composition pattern:

- `app/music/page.tsx`
- section components under `app/music/`
- shared formatting helpers in `app/music/shared.tsx`
- interactive time-machine client component in `app/music/ListeningTimeMachine.tsx`

### Tiny Thoughts admin

Tiny Thoughts admin is split into:

- container: `app/AdminTinyThoughts.tsx`
- hook: `app/tiny-thought-admin/useTinyThoughtAdmin.ts`
- UI pieces:
  - `TinyThoughtForm.tsx`
  - `TinyThoughtAttachmentEditor.tsx`
  - `TinyThoughtAdminList.tsx`

## Data Architecture

There are four different data patterns in this repo.

### 1. Static checked-in content

Examples:

- section copy and page composition
- writings metadata
- Signal Booth data
- work-with-me page content

### 2. Curated checked-in summary data

Examples:

- `app/music-insights/`
- `app/site-content/`

This is intentionally not runtime-fetched from external systems. The music page uses curated summaries derived from a separate local export workflow rather than raw Spotify data at runtime.

### 3. Database-backed editable content

Examples:

- guestbook entries
- Tiny Thoughts
- Now cards
- Projects cards

This logic lives mostly in:

- `app/lib/guestbook.ts`
- `app/lib/tiny-thoughts.ts`
- `app/lib/now.ts`
- `app/lib/projects.ts`

### 4. Blob-backed uploaded media

Examples:

- Tiny Thoughts images
- project images

Shared logic now lives in:

- `app/lib/blob.ts`
- `app/lib/upload.ts`

## API Architecture

### Public APIs

- `app/api/guestbook/route.ts`
- `app/api/tiny-thoughts/route.ts`

### Admin APIs

- `app/api/admin/session/route.ts`
- `app/api/admin/guestbook/route.ts`
- `app/api/admin/tiny-thoughts/route.ts`
- `app/api/admin/tiny-thoughts/upload/route.ts`
- `app/api/admin/now/route.ts`
- `app/api/admin/projects/route.ts`
- `app/api/admin/projects/upload/route.ts`
- `app/api/admin/context-refresh/route.ts`

Shared API helpers:

- `app/lib/admin-auth.ts`
- `app/lib/admin-route.ts`

The goal is lightweight route handlers with shared normalization and auth response helpers instead of repeating the same route boilerplate.

## Storage And External Services

### Neon Postgres

Used for:

- guestbook entries
- Tiny Thoughts
- Now cards
- Projects

Tables are created/updated lazily by helper functions such as:

- `ensureGuestbookTable()`
- `ensureTinyThoughtsTable()`
- `ensureNowItemsTable()`
- `ensureProjectsTable()`

### Vercel Blob

Used for admin image uploads.

Important design detail:

- local development can use `BLOB_READ_WRITE_TOKEN`
- deployed Vercel runtime should use environment/store wiring rather than forcing the local token path

### Resend

Used for guestbook moderation notifications.

## Security Model

This is a simple private admin model, not a multi-user auth system.

Key points:

- admin session is cookie-based
- admin credentials come from environment variables
- admin APIs return JSON errors and reject unauthenticated requests
- public content APIs expose only approved/public-safe data
- helper normalization is used to clean user/admin input before persistence

## Testing Strategy

The current test layer is intentionally small and pragmatic.

It covers helper/regression logic with Node's built-in test runner plus TypeScript execution through `tsx`.

Current focus:

- text/url normalization
- upload validation
- project helper normalization
- selected music formatting helpers

This is not a full component/integration test suite yet, but it is enough to catch several annoying regressions cheaply.

## Architectural Constraints

The main constraints to respect when extending the repo:

- preserve the site's personal, non-corporate voice
- avoid over-engineering simple editorial/admin workflows
- keep curated data local and understandable
- prefer feature-level modules over deep abstraction
- be careful with anything that touches public rendering plus admin persistence at the same time

## Good Next Extensions

Likely safe future improvements:

- more targeted tests around route normalization and admin helpers
- more CSS ownership cleanup in other large route areas
- similar feature-splitting for other large admin files if they grow
- selective browser/integration verification for admin upload workflows
