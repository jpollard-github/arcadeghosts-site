# Decisions

## Decision Log
- Social reflection tooling should live behind the existing admin auth and persist in Postgres rather than a static file so the data can support later analytics.
- The `Social Quest Log` should track events, counts, confidence shifts, lessons, and experiments, but should not model individual people as records.
- The four handoff docs in `docs/` are now the primary AI memory set; stale README and task references to deleted long-form docs should be updated rather than treated as canonical.

## Candidate Decisions To Confirm
- Promote items here only after they are real choices, not guesses.
