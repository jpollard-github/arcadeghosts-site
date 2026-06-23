# Decisions

## Decision Log
- Social reflection tooling should live behind the existing admin auth and persist in Postgres rather than a static file so the data can support later analytics.
- The `Social Quest Log` should track events, counts, confidence shifts, lessons, and experiments, but should not model individual people as records.
- The four handoff docs in `docs/` are now the primary AI memory set; stale README and task references to deleted long-form docs should be updated rather than treated as canonical.
- The homepage and admin project summary should treat `last_updated_at` as the user-facing project update date, and admin saves should refresh it automatically unless the editor explicitly sets a different date.
- `/work-with-me` should present `Start a Project Inquiry` as the stronger CTA while still keeping direct email available as a secondary contact path.
- Fixed-price inquiry support should stay lightweight and private: use the new admin-only `Side Hustle` page for reusable scoping prompts rather than building a more complex CRM-style intake system.

## Candidate Decisions To Confirm
- Promote items here only after they are real choices, not guesses.
