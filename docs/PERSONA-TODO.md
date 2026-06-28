# PERSONA-TODO.md

Reference: 2026-06-28 8:10 PM EDT

This roadmap reflects the current state of the persona system after the Persona v2 refresh, archetype imports, scenario matrix work, and Journey Mode v1 implementation.

## Current State

- Persona testing now has two explicit modes:
  - full-surface audit
  - deterministic journey simulation
- Persona profiles are organized under `tests/persona-testing/personas/`.
- Archetypes now include `Hunter`, `Reader`, `Scanner`, `Wanderer`, and `Builder`.
- Journey Mode now uses:
  - persona
  - archetype
  - scenario
  - context
  - confidence threshold
- Durable generated outputs now live under `persona-results/personas/` so Playwright cleanup does not wipe the long-running reports.

## Architecture Direction

The current architecture is still the right one:

```text
Persona
  ↓
Archetype
  ↓
Scenario
  ↓
Context
  ↓
Deterministic Navigation
  ↓
Observation
  ↓
AI Reflection
  ↓
Aggregated Findings
```

Important rule:

- deterministic code decides where the simulated visitor goes
- AI, if added later, interprets what happened

## Done

### Persona v2 Foundation

- [x] Move personas to a dedicated `tests/persona-testing/personas/` folder
- [x] Standardize around Persona v2-style profile sections
- [x] Rewrite the existing persona set to be more behavioral and less hobby-only
- [x] Add `confidenceThreshold` to persona behavior modeling
- [x] Update `Ideal Partner` with clearer first-visit, trust, and hesitation behavior
- [x] Replace `Potential Client` with the stronger v2 version
- [x] Add `Skeptic`

### Audit / Journey Split

- [x] Preserve full-surface audit mode
- [x] Add `runPersonaJourney(...)`
- [x] Keep audit mode and journey mode separate in code and reports
- [x] Keep admin pages in audit mode
- [x] Skip admin pages by default in journey mode

### Scenario / Journey Model

- [x] Add a reusable scenario matrix document
- [x] Keep scenarios global and reusable instead of persona-specific one-offs
- [x] Add explicit scenario goals
- [x] Split page budgets into `targetPages` and `maxPages`
- [x] Add scenario success conditions
- [x] Add explicit exit states
- [x] Surface goal, success, and exit information in journey reports and aggregates
- [x] Add a representative 8-10 journey suite
- [x] Add expected-route checks

### Archetypes / Behavior

- [x] Add reusable archetype docs
- [x] Add `Wanderer` and `Builder` as first-class archetypes
- [x] Add `Romantic` as a first-class archetype
- [x] Make `confidenceThreshold` materially affect journey behavior
- [x] Add stronger archetype-aware route planning than the original heuristic-only version

### Reporting / Output

- [x] Add overall audit aggregate output
- [x] Add overall journey aggregate output
- [x] Add combined audit + journey handoff output
- [x] Include both audit and journey summaries directly in the combined bundle
- [x] Move durable persona outputs out of Playwright-managed `test-results/`
- [x] Add `test:users` to run both persona audits and journeys
- [x] Add richer aggregate summaries for ChatGPT review packets
- [x] Surface scenario, context, and archetype influence directly in reports
- [x] Enrich journey aggregates with route, exit, trust, and expected-route patterns
- [x] Add explicit journey outcomes beyond boolean success
- [x] Add route-catalog validation to journey outputs and aggregate summaries

## Next Priority

The next best step is to make the reports more useful as design critique, not just route logs.

- [x] Make journey reports explain why a persona skipped specific routes like `/music`
- [x] Make journey reports explain why a persona bounced or nearly bounced after a page like `/about`
- [x] Make journey reports call out which trust signals changed the journey
- [x] Make journey reports identify which page actually satisfied the scenario goal
- [x] Make aggregate reports compare outcomes, not just destinations
- [x] Add richer “why” fields without giving AI control over navigation

## Next Implementation Batch

These are the best code-focused next steps after the richer-report work starts.

- [x] Make scenario and context override route choice more visibly
- [x] Make context more than a label in the output
- [x] Strengthen archetype modifiers further where behavior still feels too similar
- [x] Add first-class reasoning for route skips, not just skipped-route lists
- [x] Capture trust-signal hits during journeys as structured data instead of only notes
- [x] Capture scenario-goal satisfaction as structured evidence instead of only boolean success

## Near-Term Follow-Ups

- [ ] Add a small memory layer for returning visits so repeat journeys avoid replaying the same rooms by default
- [ ] Rename / clarify aggregate folder language if needed:
  - `overall-audit`
  - `overall-journeys`
  - `overall-personas-and-journeys`
- [ ] Expand representative journey coverage only when a scenario, audience, or browsing style is clearly underrepresented

## Stabilization Before More Features

- [x] Validate that Journey Mode can produce `success`, `partial`, and `failed` outcomes
- [x] Make expected-route misses affect outcomes instead of remaining warning-only
- [x] Add a simple route catalog sanity layer for public and admin surfaces
- [x] Detect stale route references when pages are added, removed, or renamed
- [ ] Keep full Semantic Room Catalog as a future phase
- [ ] Keep Page Metadata v3 as a later successor phase

After this stabilization pass, pause persona-engine development and use the system to evaluate real ArcadeGhosts site changes before adding more framework features.

## Next Phase: Route Realism And Report Validation

- [x] Reduce overuse of Search where it makes journeys feel too similar
- [ ] Validate expected-route warnings across the representative journeys against real website intent, not just planner heuristics
- [x] Ensure aggregate reports surface actionable route-pattern problems instead of only counts
- [ ] Keep memory as a later deterministic phase after route realism stabilizes
- [ ] Keep AI reflection as a later interpretation phase, not a navigation phase
- [ ] Add a future `Semantic Room Catalog` phase where pages expose semantic tags instead of personas referencing specific routes directly

## Product Feedback Loop

The framework is now entering a stabilization phase.

The main goal from here is to turn persona output into better ArcadeGhosts decisions, not to keep expanding the framework for its own sake.

```text
Website
  ↓
Persona Tests
  ↓
Journey Reports
  ↓
PERSONA-TESTS-RESULTS-TODO.md
  ↓
Website Improvements
  ↓
Re-run Persona Tests
  ↓
Measure Improvement
```

- [x] Treat `docs/PERSONA-TESTS-RESULTS-TODO.md` as the canonical handoff from persona testing into site work
- [x] Merge repeated audit and journey findings into deterministic product recommendations instead of repeating similar bullets
- [x] Add recommendation confidence so recurring findings are easier to prioritize
- [x] Keep the fast workflow unchanged for day-to-day iteration
- [ ] Revisit framework expansion only when a real site question cannot be answered with the current audit + journey system
- [ ] Prefer future framework work that improves report quality, route realism, or website decision-making over adding new abstractions

## Future Architecture: Semantic Planning

This is an architectural direction, not the next implementation step.

The current planner works because persona, archetype, scenario, and context combine into believable deterministic journeys. The weak point is that personas still tend to reference concrete rooms such as `About`, `Cats`, `Music`, or `Build Log`. As the site grows, that coupling will become harder to maintain.

The long-term direction should be:

```text
Persona
  ↓
Desired Concepts
  ↓
Planner
  ↓
Semantic Room Catalog
  ↓
Current Website
```

The planner should gradually become responsible for understanding the website semantically, while personas remain descriptions of people and intent rather than lists of URLs.

### Semantic Room Catalog

- [ ] Define semantic tags for every public page
- [ ] Separate page identity from page URL
- [ ] Allow the planner to choose pages by semantic intent instead of direct route references
- [ ] Allow new sections to participate automatically without persona edits
- [ ] Reduce maintenance when pages are added, renamed, or removed
- [ ] Treat the Semantic Room Catalog as the planner's primary language before any page-local metadata work

Possible concept tags to start from:

- `trust`
- `warmth`
- `technical`
- `projects`
- `emotional`
- `curiosity`
- `reflective`
- `writing`
- `media`
- `humor`
- `business`
- `identity`
- `nostalgia`
- `updates`
- `discovery`

Illustrative examples:

- `About` → `identity`, `trust`, `personal`
- `Work With Me` → `consulting`, `business`, `trust`
- `Build Log` → `technical`, `trust`, `projects`
- `Tiny Thoughts` → `reflection`, `writing`, `personality`
- `Music` → `personal`, `emotional`, `media`
- cat pages → `warmth`, `personal`, `humor`

### Future Persona Evolution

- [ ] Evolve persona preferences from named rooms toward preferred concepts
- [ ] Let personas express ideas like `warmth`, `personality`, `reflective`, or `technical trust` instead of concrete routes
- [ ] Make the planner responsible for mapping those concepts onto the current site structure
- [ ] Ensure new pages can be discovered automatically when their tags match persona intent
- [ ] Ensure removed pages stop participating without requiring persona rewrites

### Planner Responsibility

- [ ] Move long-term planner responsibility toward semantic tag matching
- [ ] Add page suitability scoring based on semantic fit
- [ ] Keep confidence, scenario, and archetype weighting in the planner layer
- [ ] Preserve the rule that personas describe people while the planner understands the site
- [ ] Keep personas reusable even as route structure changes

## Future Architecture: Page Metadata (v3)

This is a later successor phase after Journey Mode and the Semantic Room Catalog are stable. Do not implement it yet.

- [ ] Investigate page-local persona metadata as a successor to a centralized semantic catalog
- [ ] Explore exporting structured metadata alongside each public page or route
- [ ] Let the planner discover public pages automatically from site-owned metadata
- [ ] Keep metadata close to the page that owns it to reduce duplicated definitions
- [ ] Use this phase to lower long-term maintenance and support eventual extraction into a reusable persona-testing framework

Possible future metadata fields:

- `tags`
- `audiences`
- `trustSignals`
- `emotionalWeight`
- `technicalWeight`
- `novelty`
- `updateFrequency`
- `prerequisites`
- `relatedConcepts`
- `primaryIntent`
- `personalitySignals`

Conceptual example:

```ts
export const personaMetadata = {
  audience: ["personal", "technical"],
  tags: ["warmth", "writing", "trust"],
  trustSignals: ["personal-story", "specificity"],
  novelty: 0.3,
  emotionalWeight: 0.8,
};
```

Implementation guidance for both semantic phases:

- [ ] Keep current priorities focused on journey realism, report quality, confidence-threshold tuning, aggregate reporting, and representative journey validation
- [ ] Treat semantic planning as the next architectural evolution after the current deterministic planner stabilizes
- [ ] Treat page metadata v3 as a possible successor once the semantic-planning layer has proven useful

## AI Later, Not First

- [ ] Add AI only as a second-pass reflection layer
- [ ] Use AI to explain whether the deterministic journey felt emotionally coherent
- [ ] Use AI to separate structural issues from persona-specific issues
- [ ] Investigate Vercel AI / model cost for persona interpretation after the deterministic reports become richer

## Product Direction

If this becomes its own product, the most portable showcase personas are still probably:

- Hiring Manager
- Potential Client
- Builder
- Skeptic

`Ideal Partner` remains valuable for ArcadeGhosts, but it is less universally portable as a demo persona.
