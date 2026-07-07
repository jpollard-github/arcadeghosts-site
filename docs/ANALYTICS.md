# ANALYTICS

ArcadeGhosts keeps `Vercel Analytics` for lightweight traffic reporting and adds `PostHog` for a small set of richer product and QA signals.

## Goals

- keep traffic reporting simple
- learn which routes, CTAs, and devices deserve more QA attention
- avoid creepy tracking
- avoid collecting personal data
- avoid over-instrumenting the site

## Current Stack

- `Vercel Analytics`
  Good for lightweight traffic and existing custom-event visibility.
- `PostHog`
  Good for richer event properties, route flow, browser/device context, and QA prioritization.

## What Is Tracked

Automatic through PostHog:

- pageviews
- pageleaves
- browser, OS, and general device context inferred by PostHog

Manual custom events:

- `work_with_me_view`
  Fired when `/work-with-me` loads.
- `contact_cta_click`
  Fired for email and discovery-session contact CTA clicks on `/work-with-me`.
- `intake_form_click`
  Fired for project inquiry form CTA clicks on `/work-with-me`.
- `project_link_click`
  Fired for homepage project cards and `/work-with-me` example/project cards.
- `guestbook_click`
  Fired from the homepage recent-signals guestbook entry link.

Existing tracked interaction events also continue to flow through the shared analytics wrapper, including things like:

- `Start Here Card Clicked`
- `Search Performed`
- `Search Quick Link Clicked`
- `Search Result Clicked`
- `Surprise Me Clicked`

## Event Properties

For PostHog custom events, we keep properties small and practical:

- route or source surface
- CTA location
- project id or project status where relevant
- viewport width
- viewport height

We do not intentionally send:

- names
- email addresses
- guestbook message content
- search query text
- free-text form content

## Privacy Approach

This setup is intentionally conservative:

- PostHog click autocapture is disabled.
- PostHog session recording is disabled.
- PostHog device-model capture is disabled.
- PostHog respects `Do Not Track`.
- PostHog persistence is set to in-memory storage to avoid adding long-lived PostHog cookies/local storage for this pass.
- No user identification is configured.

This means we get route and CTA insight without turning the site into a surveillance project.

## Vercel Setup

No extra analytics environment variables are currently required beyond the normal Vercel project setup.

The site now relies on Vercel Analytics for its lightweight client analytics path.

## How This Should Guide Decisions

Use analytics to answer practical questions such as:

- Which routes actually matter enough to deserve repeated device QA?
- Are visitors reaching `/work-with-me` but not taking a next step?
- Which homepage project cards get attention?
- Does the guestbook still earn its place?
- Are mobile-heavy routes attracting enough traffic to justify more real-device testing?

## What Not To Do

- Do not add dozens of vanity events.
- Do not track private text inputs.
- Do not add a giant internal analytics dashboard.
- Do not let analytics overrule taste or personality when the sample size is tiny.

## Consent / Legal Note

No cookie banner was added as part of this implementation because the tracking approach is intentionally limited and avoids persistent PostHog storage.

That said, legal/privacy requirements depend on jurisdiction and how you describe analytics in your privacy materials. This document is implementation guidance, not legal advice.
