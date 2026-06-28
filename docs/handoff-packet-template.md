# Handoff Packet Template

Use this when asking Codex to create a zip or review packet for ChatGPT or another tool.

The goal is to make these requests repeatable without having to re-explain:

- where the zip should go
- how it should be named
- which files belong inside
- whether repo-relative paths should be preserved
- whether source/context files should be included alongside outputs

## Default Pattern

If you do not care about special handling, use this shape:

```text
Create a handoff packet:
- destination: ~/chatgpt-persona-reports
- name pattern: chatgpt-persona-reports_{timestamp}.zip
- preserve repo-relative paths: yes
- include:
  - persona-results/personas/overall-audit/report.md
  - persona-results/personas/overall-audit/summary.json
  - persona-results/personas/overall-journeys/report.md
  - persona-results/personas/overall-journeys/summary.json
  - persona-results/personas/overall-personas-and-journeys/report.md
  - persona-results/personas/overall-personas-and-journeys/summary.json
```

## Recommended Fields

When possible, specify:

- `destination`
  - example: `~/chatgpt-persona-reports`
- `name pattern`
  - example: `chatgpt-persona-reports_{timestamp}.zip`
- `preserve repo-relative paths`
  - `yes` means the zip contains paths like `tests/persona-testing/...`
  - `no` means flatten or reorganize the files
- `include`
  - exact file list when known
- `optional include if easy`
  - good for helper source files or extra context
- `notes`
  - path mismatches, fallback behavior, or naming exceptions

## Timestamp Convention

Current preferred timestamp format:

```text
YYYY-MM-DD_HH-MM-SS
```

Example:

```text
chatgpt-persona-reports_2026-06-28_04-13-25.zip
```

## Common Destinations

### Persona / ChatGPT Review Packets

```text
~/chatgpt-persona-reports
```

### General Repo Exports

If you want a more general destination later, say so explicitly:

```text
~/chatgpt-repo-packets
```

## Common Packet Types

### 1. Persona Review Packet

Use for ChatGPT review of personas, journeys, and related roadmap files.

Typical contents:

- `persona-results/personas/overall-audit/report.md`
- `persona-results/personas/overall-audit/summary.json`
- `persona-results/personas/overall-journeys/report.md`
- `persona-results/personas/overall-journeys/summary.json`
- `persona-results/personas/overall-personas-and-journeys/report.md`
- `persona-results/personas/overall-personas-and-journeys/summary.json`
- `persona-results/personas/overall-personas-and-journeys/combined-bundle.json`
- `tests/persona-testing/scenarios/scenario-matrix.md`
- `tests/persona-testing/README.md`
- `docs/PERSONA-TODO.md`

Optional source context:

- `tests/persona-testing/support/persona-journey.ts`
- `tests/persona-testing/support/persona-scenarios.ts`
- `tests/persona-testing/support/persona-report.ts`
- `tests/persona-testing/support/persona-manifest.ts`
- `tests/persona-testing/support/persona-profile.ts`
- `tests/persona-testing/support/persona-runner.ts`
- relevant archetype files such as `tests/persona-testing/archetypes/romantic.md`

### 2. Build / Deployment Review Packet

Use for asking ChatGPT or another tool to review deployment/build changes.

Typical contents:

- relevant build logs
- related TODO or roadmap docs
- changed source files
- release notes or build log entries

### 3. Focused Feature Review Packet

Use when only one feature area matters.

Typical contents:

- one or two output artifacts
- exact source files touched
- one roadmap or TODO doc
- one README or usage guide

## Fallback Rules

If a requested path does not exist:

- Codex should use the real repo path if the intended file is obvious
- Codex should mention the substitution clearly

Example:

- requested: `tests/persona-testing/archetypes/romantic/profile.md`
- actual: `tests/persona-testing/archetypes/romantic.md`

## Copy-Paste Request Template

```text
Create a handoff packet:
- destination: <folder>
- name pattern: <name-with-{timestamp}.zip>
- preserve repo-relative paths: yes
- include:
  - <file 1>
  - <file 2>
  - <file 3>
- optional include if easy:
  - <helper source 1>
  - <helper source 2>
- notes:
  - if a requested path is slightly wrong but the intended file is obvious, use the real path and tell me
```

## Short Version

If you want a faster shorthand, this is enough:

```text
Make a ChatGPT packet in ~/chatgpt-persona-reports named chatgpt-persona-reports_{timestamp}.zip, preserve repo-relative paths, and include:
- ...
```
