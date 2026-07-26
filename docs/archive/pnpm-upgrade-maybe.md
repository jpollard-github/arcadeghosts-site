# Possible npm-to-pnpm Migration

## Decision status

**On hold as of July 26, 2026.**

This document preserves the migration assessment and a possible implementation
path. It is not approval to change the package manager, CI configuration, or
Vercel project settings.

## Summary

Converting ArcadeGhosts from npm to pnpm appears to be a low-to-moderate effort:
approximately two to four hours of implementation and local verification,
followed by one GitHub Actions and Vercel preview cycle.

The application code is package-manager-neutral, and a disposable pnpm 10 trial
passed linting, type checking, unit tests, the production build, and the
database-independent Playwright suite. The migration is therefore likely to be
safe, but it should not be treated as a simple lockfile replacement. The
repository contains npm-specific scripts, documentation, CI commands, and
security overrides that must be translated deliberately.

## Why consider pnpm

### Pros

- **More efficient dependency storage:** pnpm keeps a content-addressable store
  and links packages into projects. This can reduce repeated disk usage across
  local projects and improve warm installation times.
- **Stricter dependency boundaries:** pnpm's dependency layout makes it harder
  for application code to import undeclared transitive dependencies. That can
  expose accidental coupling earlier instead of allowing it to survive until a
  later dependency update.
- **Reproducible tool selection:** a `packageManager` entry can pin the pnpm
  release used locally and in GitHub Actions.
- **Good platform support:** GitHub Actions, Dependabot, and Vercel all support
  pnpm lockfiles. Vercel currently supports pnpm through major version 10.
- **Safer dependency install defaults:** pnpm 10 does not automatically run
  every dependency build script. The trial install blocked scripts from
  `esbuild` and `unrs-resolver`, while the application build and tests still
  passed.

### Cons

- **Migration and maintenance cost:** every npm-specific command in scripts,
  CI, documentation, editor tasks, agent guidance, and repository skills must
  be updated and kept consistent.
- **Another toolchain assumption:** contributors need pnpm or Corepack available
  in addition to the Node version in `.nvmrc`.
- **Different configuration semantics:** npm's top-level `overrides` format is
  not honored by pnpm. Missing this difference would silently change the
  dependency graph and break the production audit.
- **Stricter installs can reveal latent assumptions:** packages or scripts that
  rely on hoisted, undeclared dependencies may fail under pnpm even when they
  worked with npm. The current checks did not expose such a problem, but future
  dependencies could.
- **Platform-version coordination:** pnpm 11 is newer, but Vercel's documented
  support currently stops at pnpm 10. The repository would need to remain on a
  supported pnpm 10 release until Vercel support changes.
- **Limited immediate benefit for this repository:** ArcadeGhosts is a
  single-package project with a modest dependency set. The storage and install
  improvements are real, but less consequential than they would be in a large
  monorepo.

## Important migration finding: security overrides

The existing npm configuration includes overrides for `postcss`, the `sharp`
version used by Next.js, and the `undici` version used by `@vercel/blob`.

A naïve pnpm import did not apply those npm-style overrides. It resolved
vulnerable transitive versions of `sharp` and `postcss`, causing:

```text
pnpm audit --prod --audit-level=high
```

to fail with high-severity findings.

The migration must replace the npm configuration with equivalent pnpm
selectors, conceptually:

```json
{
  "pnpm": {
    "overrides": {
      "postcss": "^8.5.18",
      "next>sharp": "^0.35.3",
      "@vercel/blob>undici": "6.27.0"
    }
  }
}
```

After regenerating the disposable lockfile with those selectors, the production
audit reported no known vulnerabilities. This was a point-in-time registry
result and must be rerun during any future migration.

The repository's existing instruction still applies: remove the `undici`
override once `@vercel/blob` resolves `undici >= 6.27.0` without it.

## Proposed package-manager version

If the migration resumes soon, pin:

```json
{
  "packageManager": "pnpm@10.34.5"
}
```

The exact patch version should be reconsidered at implementation time, but the
chosen major must remain compatible with Vercel. Do not use an unbounded
`latest` value.

Vercel selects a package manager from the committed lockfile and currently
documents support for pnpm 6 through 10:

- <https://vercel.com/docs/package-managers>

## Expected repository changes

1. Generate and commit `pnpm-lock.yaml`.
2. Remove `package-lock.json`.
3. Add the pinned `packageManager` field to `package.json`.
4. Translate the npm security overrides to `pnpm.overrides`.
5. Replace npm-specific package scripts with pnpm commands.
6. Make the timed-script helper package-manager-neutral or update it to invoke
   pnpm.
7. Update the website audit's development-server launcher.
8. Replace Playwright's `npx next` launcher with a pnpm invocation.
9. Update `.github/workflows/ci.yml` to:
   - install the pinned pnpm release;
   - cache the pnpm store;
   - run `pnpm install --frozen-lockfile`;
   - run `pnpm audit --prod --audit-level=high`;
   - use `pnpm run` and `pnpm exec` for checks and Playwright installation.
10. Update `.vscode/tasks.json`, `README.md`, `AGENTS.md`, command usage text,
    and repository-local skills.
11. Leave Dependabot's `package-ecosystem: npm` value unchanged. GitHub uses
    that ecosystem identifier for npm, pnpm, and Yarn dependency manifests.

Relevant GitHub references:

- <https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md>
- <https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference>

## Current Vercel assessment

The linked `arcadeghosts-site` Vercel project was inspected read-only during the
assessment. It currently has:

- the Next.js framework preset;
- Node.js 24.x;
- no custom install command;
- no custom build command;
- no custom root directory.

Those defaults should allow Vercel to detect pnpm from `pnpm-lock.yaml`. A future
migration should not add a custom Vercel install command unless a demonstrated
platform issue requires it, because the normal lockfile detection path is
simpler and less fragile.

## Evidence from the disposable trial

The assessment used pnpm 10.34.5 in a temporary copy of the tracked repository.
No project files were changed by the trial.

The following passed:

- frozen pnpm dependency installation;
- ESLint;
- TypeScript type checking;
- 86 unit tests;
- Next.js production build;
- 71 database-independent Playwright tests;
- production dependency audit after converting the overrides.

The final pnpm install reported ignored build scripts for `esbuild@0.28.1` and
`unrs-resolver@1.12.2`. Because the production build and browser tests passed,
these scripts did not appear necessary for the tested application flow. A
future migration should record that choice explicitly using the appropriate
pnpm configuration and rerun the complete checks.

The assessment did **not**:

- run the secret-backed database Playwright job under pnpm;
- execute the modified workflow in GitHub Actions;
- create or validate a Vercel preview deployment;
- test a production deployment.

## Required verification before merging a future migration

1. Start from a clean install with only `pnpm-lock.yaml` present.
2. Run `pnpm install --frozen-lockfile`.
3. Run `pnpm audit --prod --audit-level=high`.
4. Run the full repository verification command.
5. Run the database-independent Playwright suite.
6. Push a migration branch and require all GitHub Actions jobs to pass,
   including the serialized, secret-backed database job.
7. Inspect the Vercel preview build log and confirm that it:
   - detects pnpm;
   - uses the intended pnpm 10 release;
   - accepts the frozen lockfile;
   - completes the Next.js build.
8. Smoke-test the preview's public pages and relevant admin/database behavior.
9. Merge only after CI and preview deployment evidence are green.

## Reasons to keep the migration on hold

Holding off is reasonable because the current npm workflow is functioning, the
repository is not a monorepo, and pnpm would not materially change the public
site or its operational architecture. The benefits are primarily developer
experience, dependency discipline, and local storage efficiency.

The assessment also identified enough package-manager-specific surface area
that the migration deserves a focused pull request and a real deployment
verification cycle. It should be scheduled when there is time to observe CI and
the Vercel preview, rather than folded into unrelated application or content
work.
