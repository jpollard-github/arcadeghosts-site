# BUSINESS-FUNNEL

Purpose:

Document how ArcadeGhosts should turn interest into a real consulting conversation and, eventually, paid work.

This is not a CRM spec and not a sales app roadmap.

## Core Rule

`/work-with-me` is the canonical public entry point for consulting interest.

The intake form is not the first cold outreach link.

The Stripe discovery payment link is not for cold outreach.

Stripe belongs after conversation, qualification, and agreement.

## Recommended Event Names

Documentation only:

- `work_with_me_view`
- `work_with_me_cta_clicked`
- `project_inquiry_started`
- `project_inquiry_submitted`
- `discovery_session_clicked`
- `discovery_session_paid`

These should stay small and business-readable if analytics are added later.

## Funnel

Visitor
→ Work With Me
→ Project Inquiry Form
→ Discovery Call
→ Proposal
→ Stripe Payment
→ Project

## Stage 1: Visitor

Purpose:

Initial awareness or curiosity.

Primary CTA:

`Work With Me`

Secondary CTA:

Direct email or About, depending on context.

Current link/source:

- Public site pages
- LinkedIn outreach
- Email outreach
- Business card or print

When to use it:

- First-touch outreach
- Public sharing
- Networking follow-up

When not to use it:

- When someone is already qualified and asking how to proceed

Analytics/tracking TODOs:

- Track source to `Work With Me`
- Track UTM-tagged outreach visits

## Stage 2: Work With Me

Purpose:

Public explanation of what Jason helps with, how he works, and what the next step looks like.

Primary CTA:

Project inquiry form

Secondary CTA:

Direct email

Current link/source:

- `/work-with-me`
- `app/lib/business-config.ts`

When to use it:

- In first-touch messages
- As the main consulting destination
- When someone needs context before taking action

When not to use it:

- As a replacement for direct follow-up once a conversation is already moving

Analytics/tracking TODOs:

- Track `Work With Me` page visits
- Track CTA clicks to inquiry and email

## Stage 3: Project Inquiry Form

Purpose:

Collect qualified-interest intake once someone wants to move forward.

Primary CTA:

Submit inquiry form

Secondary CTA:

Email Jason directly

Current link/source:

- Google Form
- `app/lib/business-config.ts`

When to use it:

- When someone is interested
- When someone asks how to proceed
- When the conversation needs structure

When not to use it:

- In first-touch cold outreach
- Before basic interest exists

Analytics/tracking TODOs:

- Track inquiry form clicks from `Work With Me`
- Track UTM source where possible

## Stage 4: Discovery Call

Purpose:

Clarify the problem, evaluate fit, and decide whether a scoped project makes sense.

Primary CTA:

Propose discovery conversation

Secondary CTA:

Send intake form if more context is needed first

Current link/source:

- Human conversation
- Email follow-up

When to use it:

- After interest is established
- When the problem seems real but needs clarification

When not to use it:

- As a cold first step
- Before the prospect understands what Jason does

Analytics/tracking TODOs:

- Track discovery proposed
- Track discovery scheduled

## Stage 5: Proposal

Purpose:

Turn a qualified, clarified problem into a concrete offer.

Primary CTA:

Accept proposal

Secondary CTA:

Clarifying reply or scoped follow-up call

Current link/source:

- Manual proposal documents
- Email

When to use it:

- After discovery or clear qualification

When not to use it:

- Before the problem is understood

Analytics/tracking TODOs:

- Track proposals sent
- Track proposals won or lost

## Stage 6: Stripe Payment

Purpose:

Collect payment for the paid discovery session after agreement.

Primary CTA:

Discovery session payment

Secondary CTA:

Reply by email if they need clarification first

Current link/source:

- Stripe payment link
- `app/lib/business-config.ts`

When to use it:

- After conversation
- After qualification
- After agreement on the discovery session

When not to use it:

- In cold outreach
- As the first CTA
- Before the prospect understands what they are buying

Analytics/tracking TODOs:

- Track discovery payment link clicks
- Track paid discovery conversions

## Stage 7: Project

Purpose:

Paid work begins.

Primary CTA:

Start the scoped project

Secondary CTA:

Clarify kickoff details

Current link/source:

- Manual project process
- Email
- Proposal acceptance

When to use it:

- After paid discovery or direct scoped agreement

When not to use it:

- Before scope and fit are clear

Analytics/tracking TODOs:

- Track won projects by source
- Track category and channel quality over time

## Brand Kit Handoff Note

Brand Kit should receive logical business intent, not random hardcoded URLs.

ArcadeGhosts owns:

- actual URLs
- business funnel
- CTA meaning
- lead-generation copy

Brand Kit owns:

- rendering
- collateral layout
- manifests
- export and preflight

Future Brand Kit collateral should use logical CTAs:

- `primaryCTA = Work With Me`
- `secondaryCTA = Project Inquiry`
- `discoveryCTA = Discovery Session` only after qualification
