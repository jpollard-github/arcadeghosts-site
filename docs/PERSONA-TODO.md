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
