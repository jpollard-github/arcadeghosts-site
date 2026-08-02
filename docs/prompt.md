# Prompt Check Inventory

This document describes the checks Codex applies before and after work on an
ArcadeGhosts prompt. It separates universal checks from checks that only apply
when a request crosses a particular boundary.

The times are rough wall-clock estimates for this repository on a warm local
checkout. They exclude time waiting for user approval, dependency downloads,
external services, or unusually long test suites. Several checks overlap, so
their times should not be added together as a fixed per-prompt cost.

## Priority scale

| Priority | Meaning |
| --- | --- |
| Critical | Prevents data loss, unauthorized action, secret exposure, broken production behavior, or a materially incorrect answer. |
| High | Provides most of the confidence that the requested result is correct and appropriately scoped. |
| Medium | Improves maintainability, reproducibility, and clarity, but usually does not decide whether the result fundamentally works. |
| Low | Reduces friction or improves reporting without materially changing correctness. |

## Pre-checks

| Check | Applies | Value | Rough time | What it establishes |
| --- | --- | --- | --- | --- |
| Interpret the current request and intended outcome | Always | Critical | 5–20 seconds | Distinguishes a question, diagnosis, review, implementation, deployment, deletion, or monitoring request and identifies the actual completion condition. |
| Reconcile the request with the active conversation | Always | High | 2–10 seconds | Determines whether the latest message replaces earlier work, extends it, or asks for status while existing work should continue. |
| Check authority and destructive-action risk | Always | Critical | 2–15 seconds | Confirms that writes, external changes, deletion, deployment, messages, migrations, and other consequential actions are actually authorized. |
| Apply repository and higher-level instructions | Always for repository work | Critical | 5–30 seconds when already loaded; 30–90 seconds on first read | Loads `AGENTS.md`, `README.md`, relevant skill instructions, editorial boundaries, architecture rules, and validation requirements. |
| Protect Jason's editorial ownership and private context | Always | Critical | 2–10 seconds | Prevents unsolicited rewriting of personal copy and prevents secrets, tokens, `.env` values, review material, or private context from entering output or logs. |
| Inspect branch and working-tree state | Before repository writes or diff review | High | 1–5 seconds | Identifies existing user changes, the baseline commit, and files that must not be overwritten or included as unrelated churn. |
| Locate the affected boundary | Before implementation or detailed diagnosis | High | 10–90 seconds | Traces the relevant route, component, data helper, tests, configuration, and dependent public surfaces before changing anything. |
| Check whether current external information is required | When facts, APIs, laws, products, prices, or documentation may have changed | High | 3–15 seconds before research | Decides whether local sources are sufficient or authoritative current sources must be consulted. |
| Select applicable skills and tools | When a repository skill or specialized workflow matches | Medium | 3–15 seconds | Chooses the smallest instruction set and toolchain that covers the task without expanding its scope. |
| Define the validation boundary | Before repository writes | High | 5–20 seconds | Selects focused tests and the required verification tier before editing, including whether browser, database, upload, or authentication checks are needed. |
| Send an initial work update | Before tool-assisted work | Low | 2–10 seconds | States the working interpretation, notable assumptions, and the immediate next action so the work remains observable. |

## Checks during implementation

These checks are continuous rather than a single pre- or post-flight step.

| Check | Applies | Value | Rough time | What it protects |
| --- | --- | --- | --- | --- |
| Keep the change to the smallest coherent scope | Every write task | High | Continuous | Avoids unrelated refactors, formatting churn, invented features, and accidental editorial changes. |
| Preserve existing user changes | Every write task | Critical | Continuous | Prevents overwriting or reverting work that predates the current request. |
| Reuse existing helpers and data shapes | Code changes | High | 10–60 seconds of inspection | Avoids parallel abstractions and keeps behavior consistent across routes and components. |
| Preserve public contracts | Public-site changes | Critical | 5–60 seconds | Protects stable URLs, metadata, RSS, sitemap behavior, accessibility, caching, and expected navigation. |
| Enforce data and admin safeguards | Admin, database, auth, or upload changes | Critical | 30 seconds–5 minutes | Checks shared authentication, same-origin protection, validation, parameterized SQL, transaction boundaries, cache invalidation, migrations, and upload signatures. |
| Surface failures instead of hiding them | Error handling and fallback changes | High | 10–60 seconds | Keeps resilient behavior observable and prevents silent fallback from disguising a broken primary path. |
| Reassess scope when new evidence appears | Diagnosis and implementation | High | 5–30 seconds per reassessment | Stops work at the first causal failure and prevents a discovered issue from silently broadening authorization. |

## Post-checks

| Check | Applies | Value | Rough time | What it confirms |
| --- | --- | --- | --- | --- |
| Compare the result with the requested behavior | Always | Critical | 10–45 seconds | Confirms that the response or change answers the actual request at the correct boundary rather than merely completing intermediate steps. |
| Run the required verification tier | Repository writes | Critical | 5 seconds–10 minutes | Uses the smallest sufficient ladder: `verify:fast` for docs/copy, `verify` for logic, and `verify:full` for routes, configuration, dependencies, database behavior, or cross-cutting changes. |
| Run focused boundary tests | When a specific behavior changed | High | 5 seconds–3 minutes | Exercises the precise unit, route, browser, mobile, upload, auth, RSS, sitemap, or database path affected by the work. |
| Review the final diff and diff statistics | Repository writes and reviews | High | 5–30 seconds | Checks that only intended files changed and that the implementation matches the described scope. |
| Check for secrets, private material, and unsafe logging | Repository writes and generated output | Critical | 5–30 seconds | Prevents credentials, `.env` content, private review material, or sensitive context from being committed or reported. |
| Check for generated or unrelated churn | Repository writes | High | 3–20 seconds | Excludes local reports, Playwright output, environment files, review archives, and unrelated formatting or generated files. |
| Run whitespace and patch-integrity checks | Repository writes | Medium | 1–5 seconds | Uses `git diff --check` or equivalent output to catch malformed patches and whitespace errors. |
| Recheck working-tree state | Repository writes | Medium | 1–5 seconds | Records the exact files left modified and distinguishes current work from pre-existing changes. |
| Confirm documentation consistency | Durable command, environment, architecture, or constraint changes | Medium | 10–60 seconds | Ensures durable operational changes are reflected in current documentation without treating archived documents as requirements. |
| Audit evidence and claims | Always | Critical | 5–20 seconds | Prevents claims that a browser, production deployment, database, or physical device passed when that check did not actually run. |
| Report outcome, files, verification, and limitations | Always | High | 10–60 seconds | Gives a self-contained handoff with what changed, what passed or failed, remaining risk, and any genuinely required follow-up. |

## Conditional verification matrix

These checks are not performed for every prompt. They are triggered by the
changed surface or the requested action.

| Trigger | Additional checks | Value | Typical time |
| --- | --- | --- | --- |
| Documentation or copy-only change | `npm run verify:fast` | High | 4–15 seconds |
| Pure TypeScript logic or data-shape change | Focused unit tests, then `npm run verify` | Critical | 5–45 seconds |
| Route handler, configuration, dependency, database, or cross-cutting change | Focused tests, then `npm run verify:full` | Critical | 10 seconds–2 minutes locally |
| Public navigation, layout, or interaction change | Relevant Playwright spec plus the appropriate verification tier | Critical | 10 seconds–3 minutes |
| Mobile-sensitive public UI change | Mobile-safety coverage at the relevant widths, with interactive states opened | High | 10 seconds–2 minutes |
| Repository-backed writing release | Slug/filename agreement, listing, static route, metadata, Open Graph, JSON-LD, RSS, sitemap, related links, prior writings, focused Playwright, and `verify:full` | Critical | 1–5 minutes |
| Authentication change | Expiry, invalid token, credential rotation, and unsafe-method rejection coverage | Critical | 15 seconds–3 minutes |
| Upload change | Size, declared type, content signature, safe extension, focused unit tests, and the relevant admin flow | Critical | 30 seconds–5 minutes |
| Database or migration change | Route/data/admin/test inspection, migration status, atomicity, parameterized SQL, cache invalidation, and database-tagged tests | Critical | 1–10 minutes; migration execution requires deliberate operator intent |
| Destructive filesystem or Git operation | Resolve the exact target, prefer recoverable action, inspect scope, and obtain approval when the request is not explicit | Critical | 5–60 seconds plus approval time |
| Deployment or external mutation | Verify target project/environment and requested authority, then confirm resulting external state | Critical | 30 seconds–10 minutes plus provider time |
| Current or high-stakes factual answer | Consult authoritative current sources and attach precise citations | Critical | 30 seconds–10 minutes |

## Practical interpretation

A simple explanatory prompt normally incurs only the universal interpretation,
authority, privacy, evidence, and reporting checks. A repository change adds
workspace inspection, boundary tracing, implementation safeguards, diff review,
and tests. The most expensive checks are intentionally conditional: running the
entire browser or database suite for an unrelated copy question would add time
without adding meaningful confidence.

Priority describes the value of a check when it applies. It does not mean that a
Critical conditional check runs when its trigger is absent.
