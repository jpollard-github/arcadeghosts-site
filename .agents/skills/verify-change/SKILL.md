---
name: arcadeghosts-verify-change
description: Verify an ArcadeGhosts code change before declaring it complete, reviewing a diff, or preparing a deploy. Select the checks from the changed files, run them, and report exact evidence without claiming unrun browser or device tests.
---

1. Read the repository `AGENTS.md` and `README.md`.
2. Inspect `git status --short`, `git diff --stat`, and the relevant diff. Do not modify unrelated files.
3. Classify the changed surface:
   - docs or copy only
   - pure TypeScript logic or data shapes
   - route handler, configuration, dependency, database, or cross-cutting behavior
   - public layout, navigation, or interaction
   - upload or authentication
4. Run the smallest sufficient verification ladder:
   - docs or copy only: `npm run verify:fast`
   - pure logic: update focused unit tests, then `npm run verify`
   - route, config, dependency, database, or cross-cutting behavior: `npm run verify:full`
   - public UI: add the relevant Playwright spec or focused test command
   - upload: update and run `tests/unit/upload.test.ts`, then exercise the relevant admin flow when possible
   - authentication: add focused expiry, invalid-token, and unsafe-method tests
5. If a command fails, diagnose the first causal failure. Do not paper over an environment failure with a production code change.
6. Review the final diff for secrets, generated artifacts, unrelated churn, missing docs, unsafe fallbacks, and untested boundary changes.
7. Return a compact report with:
   - files and behavior reviewed
   - commands run and their results
   - browser or device checks that did not run
   - remaining risks or required follow-up
