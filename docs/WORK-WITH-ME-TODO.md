# WORK-WITH-ME-TODO

Purpose:

This is the canonical implementation TODO for Work With Me and consulting-funnel website work inside `arcadeghosts-site`.

Use it for accepted business-lane website work only.

Do not use it for:

- outreach operations
- lead-tracker maintenance
- brand-kit asset generation
- persona-framework work
- music, cats, writings, arcade, merch, or unrelated publishing backlog
- repo-wide mobile cleanup that is not directly about the Work With Me path

Primary supporting docs:

- `docs/BUSINESS-FUNNEL.md`
- `docs/LEAD-GENERATION-TODO.md`
- `app/work-with-me/page.tsx`
- `app/lib/business-config.ts`

## Scope Guardrails

- `/work-with-me` remains the canonical public entry point for consulting interest.
- Project inquiry remains the primary CTA.
- Direct email remains the visible secondary path.
- Discovery payment remains post-qualification and post-conversation, not a cold-first CTA.
- Personal-lane sections keep their existing voice and backlog ownership.

## Accepted Work Orders

### `SITE-WO-001` Work-With-Me TODO Canonicalization

Status: `accepted`

Goal:

Give accepted business-lane website work one canonical downstream planning target.

Accepted for this repo pass:

- create and maintain this file
- keep Work With Me implementation planning separate from outreach operations
- point small supporting docs here when they need a canonical implementation target

Non-goals in this pass:

- rewrite broader site backlog structure
- absorb personal-lane TODOs
- replace `docs/LEAD-GENERATION-TODO.md` as the outreach operating doc

### `SITE-WO-002` CTA Hierarchy And Inquiry Flow Preservation

Status: `accepted`

Goal:

Keep the public consulting path clear, low-friction, and aligned to the intended qualification funnel.

Accepted for this repo pass:

- preserve inquiry -> email -> discovery hierarchy in Work With Me planning
- keep CTA guidance explicit in this file
- correct cold-first discovery emphasis where it conflicts with the intended funnel

Non-goals in this pass:

- redesign `/work-with-me`
- broaden CTA work into homepage, About, or Build Log rewrites
- turn discovery payment into the primary first-touch action

## Implementation Status

### Canonical TODO status

- `Done`: `docs/WORK-WITH-ME-TODO.md` now exists as the canonical accepted-work target for consulting-funnel website changes.
- `Done`: supporting docs now point to this file for site-side Work With Me implementation planning.
- `Open`: use this file for future accepted downstream bundle imports instead of mixing those tasks into broader docs.

### CTA hierarchy status

- `Done`: `/work-with-me` hero keeps `Start a Project Inquiry` as the primary CTA and `Email Jason` as the secondary CTA.
- `Done`: `app/lib/business-config.ts` keeps distinct `projectInquiry`, `contactEmail`, and `discoverySession` links.
- `Done`: discovery-session sections now frame the paid session as a later fit/clarity step instead of the cold-first path.
- `Open`: confirm the live route still reads calmly and clearly after this first downstream adoption pass.

## Code Validation

Definition:

Code validation is the code-enforceable layer only. It is not the same as production readiness or field proof.

Current checks for the accepted work:

- `docs/WORK-WITH-ME-TODO.md` exists.
- `/work-with-me` still renders inquiry before discovery as the primary cold-entry path.
- `app/lib/business-config.ts` still exposes `projectInquiry`, `contactEmail`, and `discoverySession`.
- no new cold-first CTA points directly to Stripe ahead of inquiry/email context

Repo validation commands:

- `npm run test:unit`
- `npm run lint`

## Manual Proofing

Definition:

Manual proofing is the human review layer that confirms the page still feels right.

Proofing checklist:

- scan `/work-with-me` top to bottom and confirm inquiry is the clearest first action
- confirm direct email is easy to find without competing with the primary CTA
- confirm discovery is described as a later step for fit, clarity, or post-conversation work
- confirm the page still feels like Jason and not a generic brochure
- confirm no unrelated personal-lane backlog got pulled into this TODO

## Field Validation

Definition:

Field validation means real-world usage, not just code review.

Field signals to watch later:

- prospects understand whether to start with Work With Me, inquiry, or email
- nobody is pushed to a paid discovery link before basic context exists
- this TODO is easier to use than `docs/LEAD-GENERATION-TODO.md` for site implementation tracking

## Deferred / Proposed Work

### `SITE-WO-003` Trust Cluster And Identity-Preserving Credibility

Status: `deferred`

Reason:

This pass is intentionally not doing broad homepage, About, or Build Log changes.

Hold for later:

- trust-path improvements across homepage, About, and Build Log
- identity-preserving credibility tuning
- broader proof-path cleanup

### `SITE-WO-004` Capability-Sheet Handoff Path And Brand-Kit Alignment

Status: `deferred`

Reason:

This pass is not moving brand-kit or collateral workflow into the site repo.

Hold for later:

- site-side collateral handoff placement
- capability-sheet follow-up path
- warm-lead brand-kit alignment

### `SITE-WO-005` Business-Lane Analytics And Mobile Verification

Status: `deferred`

Reason:

This pass is not expanding analytics or mobile work beyond what is needed to preserve CTA order and packet review.

Hold for later:

- Work With Me-specific analytics follow-up
- route-specific mobile verification backlog
- broader event and measurement refinement

## Notes For Future Bundle Imports

- Treat consulting-business as the strategy source of truth.
- Import only accepted work orders here.
- Keep accepted work, proofing, and field validation separated so downstream review packets stay easy to scan.
