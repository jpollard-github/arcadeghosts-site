# Repo Summary

This repository powers `arcadeghosts.org`, Jason Pollard's personal site and living portfolio.

It is a Next.js App Router application deployed on Vercel, with a mix of:

- public portfolio and writing pages
- interactive personal projects
- music and media collection pages
- small admin tools for keeping the site current
- lightweight data storage through Neon Postgres and Vercel Blob

## What The Site Includes

Main public areas:

- homepage at `/`
- work-with-me page at `/work-with-me`
- music page at `/music`
- arcade page at `/arcade`
- movies/TV page at `/movies-tv`
- cat galleries under `/cats/*`
- Twin Peaks-inspired reflection tool at `/twin-peaks-self`
- writing pages under `/writings/[slug]`

Interactive/public features:

- guestbook with moderated submissions
- Tiny Thoughts short-form posts
- Signal Booth random prompt/oracle experience
- Spotify playlist embeds and curated listening insights

Admin areas:

- `/admin`
- `/admin/guestbook`
- `/admin/tiny-thoughts`
- `/admin/now`
- `/admin/projects`
- `/admin/context-refresh`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Neon Postgres via `@neondatabase/serverless`
- Vercel Blob for admin image uploads
- Resend for guestbook notifications
- Vercel Analytics

## Current Repo Shape

Important top-level areas:

- `app/`
  Application routes, components, layouts, API routes, and local helpers
- `public/`
  Images, static assets, game files, and writing source assets
- `docs/`
  Internal repo notes and maintenance docs
- `db/`
  Reference SQL
- `tests/`
  Small regression tests for helpers and validation logic

## Important App Folders

- `app/home/`
  Homepage section components
- `app/music/`
  Music page section components and route-specific layout/styles
- `app/music-insights/`
  Split curated music summary data
- `app/site-content/`
  Shared content/data for arcade, visual media, and cat galleries
- `app/tiny-thought-admin/`
  Tiny Thoughts admin hook and UI pieces
- `app/lib/`
  Shared server/client-safe helpers for auth, DB access, uploads, Blob handling, and normalization
- `app/api/`
  Route handlers for guestbook, Tiny Thoughts, admin session/auth, projects, uploads, and context refresh

## Data Model Summary

This repo is intentionally mixed:

- some content is fully static and checked into the repo
- some content is curated summary data copied in from separate workflows
- some content is editable through admin tools and stored in Neon

Static/curated examples:

- homepage copy and section structure
- music insight summaries in `app/music-insights/`
- arcade/media/cat datasets in `app/site-content/`
- writings metadata in `app/writings.ts`

Database-backed/admin-managed examples:

- guestbook entries
- Tiny Thoughts
- homepage Now cards
- homepage Projects cards

Blob-backed examples:

- Tiny Thoughts image attachments
- project card images uploaded from admin

## Testing And Verification

Available commands:

- `npm run dev`
- `npm run lint`
- `npm test`
- `npm run build`

Current tests are lightweight and focused on:

- upload validation
- project normalization helpers
- Tiny Thoughts normalization helpers
- selected music formatting helpers

## Recent Refactor State

The repo has recently been cleaned up to reduce maintenance risk:

- homepage split into section components under `app/home/`
- music page split into section components under `app/music/`
- shared admin route/upload helpers added in `app/lib/`
- Tiny Thoughts admin split into hook + UI pieces
- route-specific CSS moved out of `app/globals.css` for music and admin
- test runner and regression tests added

## Best Mental Model

Think of this repo as a personal-site platform, not just a landing page.

It combines:

- a portfolio
- a publishing surface
- a few playful interactive experiences
- a small content-management layer
- a curated personal-data showcase

That mix is the main architectural characteristic to keep in mind when changing it.
