---
title: "Raw - pnpm source checks (FMX-195)"
status: raw
tags: [research, raw, source-check, context7, ref, pnpm, dependency-currency, fmx-195]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-195
related:
  - [[../pnpm-tooling-currency-2026-06-15]]
  - [[raw-pnpm-tooling-currency-2026-06-15]]
  - [[../../40-Execution/fmx-195-pnpm-tooling-currency-decision-queue-2026-06-15]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
---

# Raw - pnpm source checks (FMX-195)

## Registry and release checks

Checked on 2026-06-15.

| Source | Observed fact |
|---|---|
| `https://registry.npmjs.org/pnpm/latest` | `version: 11.6.0`; package engine `node >=22.13`; npm provenance attestation present. |
| `https://registry.npmjs.org/pnpm` | dist-tags: `latest=11.6.0`, `latest-11=11.6.0`, `next-11=11.7.0`; `time["11.7.0"] = 2026-06-15T06:54:02.299Z`. |
| `https://registry.npmjs.org/pnpm/11.7.0` | `version: 11.7.0`; package engine `node >=22.13`; npm provenance attestation present; published by GitHub Actions trusted publisher. |
| GitHub release API / tag `v11.7.0` | Non-draft, non-prerelease release `pnpm 11.7`, published 2026-06-15T06:56:53Z. |
| Local runtime | `node -v` returned `v22.22.1`, satisfying `pnpm@11.7.0`'s package engine. |

The only source conflict is the channel signal: npm dist-tags still call
`11.6.0` the `latest` / `latest-11` release while the package and GitHub
release for `11.7.0` are already public non-prerelease artifacts.

## GitHub release notes signal for 11.7.0

The v11.7.0 release notes include:

- New opt-in `frozenStore` / `--frozen-store` for read-only package stores.
  That feature has a stricter runtime requirement only when used: Node
  `>=22.15.0`, `>=23.11.0`, or `>=24.0.0`. FMX does not enable it in this beat.
- Lockfile hardening: reject lockfile-sourced path traversal and reserved
  dependency aliases before fetch/filesystem work.
- Deterministic child resolution when the same package is reached through
  multiple contexts.
- Fixes for `patch-remove`, `publish strictSsl`, git dependency subdirectory
  lockfile preservation, intermittent `pnpm dedupe --check` failures, install
  verification concurrency, scoped auth-token selection and Windows process
  timeout behavior.
- A Windows `pnpm add` regression introduced in 11.6.0 is fixed in 11.7.0.

## Context7 checks

Library: `/websites/pnpm_io`.

Findings:

- The official installation guidance supports using Corepack to set a project
  pnpm version through `packageManager`.
- `devEngines.packageManager` can express a pnpm version range, with the
  resolved version stored in `pnpm-lock.yaml`; FMX keeps the existing exact
  `packageManager` pin for this narrow beat.
- pnpm configuration that belongs to a project should live in committed project
  configuration, including future `pnpm-workspace.yaml` settings.
- pnpm 11.0 requires Node 22 or newer, is pure ESM, uses a SQLite-backed store
  index and has tighter security defaults.
- `minimumReleaseAge`, `minimumReleaseAgeExclude`, `trustPolicy` and
  `trustPolicyExclude` are workspace/security options to decide during the
  broader tooling/workspace beats, not in this narrow pin update.

## Ref checks

Ref reads from pnpm repository changesets:

- `dev-engines-package-manager.md`: `devEngines.packageManager` supports pnpm
  version ranges; the resolved version is stored in `pnpm-lock.yaml`.
- `self-update-syncs-package-manager-fields.md`: `pnpm self-update` keeps
  `packageManager` and `devEngines.packageManager` in sync when both are used.
- `sqlite-store-index.md`: pnpm's content-addressable store metadata is stored
  in a SQLite `index.db` instead of individual per-package files.
- `fix-lockfile-include-tarball-url.md`: lockfile tarball URL exclusion behavior
  was tightened for non-standard package URLs.

## Decision supported

FMX-195 pins `pnpm@11.7.0` because Nico reaffirmed the project rule to use the
newest version after source checks, and direct npm/GitHub sources show 11.7.0 is
published as a non-prerelease artifact. The lagging npm `latest` dist-tag is
documented as an operational caveat, not as the selected target.

## Related

- [[../pnpm-tooling-currency-2026-06-15]]
- [[raw-pnpm-tooling-currency-2026-06-15]]
- [[../../40-Execution/fmx-195-pnpm-tooling-currency-decision-queue-2026-06-15]]
