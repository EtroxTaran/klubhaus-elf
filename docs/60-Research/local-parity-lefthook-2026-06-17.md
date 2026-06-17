---
title: Local-Parity Lefthook Gate
status: current
tags: [research, tooling, lefthook, local-parity, ci, pnpm, fmx-176]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-176
related:
  - [[raw-perplexity/raw-local-parity-lefthook-2026-06-17]]
  - [[raw-perplexity/raw-local-parity-lefthook-source-checks-2026-06-17]]
  - [[../40-Execution/fmx-176-local-parity-decision-record-2026-06-17]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
---

# Local-Parity Lefthook Gate

FMX-176 restores local hook parity for the active docs-phase gate without
pretending the future code workspace exists.

## Current repo facts

- The repo is still docs-vault-only.
- The active required checks remain `docs-check` and `linear-id`.
- Real app/package paths, Nx targets, Biome config and code test scripts do not
  exist yet.
- pnpm v11 stores allowed dependency build scripts in `pnpm-workspace.yaml`.
  In this beat, that file is a root tool-policy file for Lefthook only, not the
  FMX-179 monorepo scaffold.

## Evidence summary

| Evidence | Finding | FMX consequence |
|---|---|---|
| [[raw-perplexity/raw-local-parity-lefthook-2026-06-17]] | Best-practice discovery supports fast local hooks, CI as source of truth, and no placeholder code gates. | Add a narrow docs hook now; leave code hooks target-only. |
| [[raw-perplexity/raw-local-parity-lefthook-source-checks-2026-06-17]] | Lefthook latest stable checked as `2.1.9`; pnpm v11 requires `allowBuilds` in `pnpm-workspace.yaml`; Biome latest was checked but is not needed now. | Pin only Lefthook and add minimal pnpm build approval. |
| D-002 local-vs-CI lesson in [[../30-Implementation/ci-and-review-process]] | The old Biome hook failed docs/YAML-only commits and discouraged small green fixes. | Do not add Biome/lint-staged until code-phase paths and filters exist. |
| FMX-175/FMX-181 process docs | Future code required contexts are `quality`, `e2e` and `security`, only after real scripts/workflows and burn-in. | Local hooks must not invent those contexts now. |

## Accepted implementation

| Surface | Current implementation | Reason |
|---|---|---|
| Dependency | `lefthook@2.1.9` in `devDependencies`, exact-pinned. | Latest stable checked against npm and GitHub release. |
| Build approval | `pnpm-workspace.yaml` contains `allowBuilds.lefthook: true`. | Required by pnpm v11 for dependency build-script approval. |
| Hook | `pre-push` job `docs-check` runs `pnpm docs:check`. | Mirrors the active docs-phase local/CI gate. |
| Manual script | `pnpm hooks:install`. | Lets contributors install/update hooks explicitly. |
| Verification script | `pnpm hooks:run:pre-push`. | Forces the pre-push job without auto-install so agents can validate the hook without relying on a real push. |
| Deferred checks | `docs:status-check` remains manual; Biome, Nx, lint-staged and code tests are deferred. | Avoids unconditional or placeholder checks. |

## Future code-phase hook principles

- Root scripts remain the public contract for humans, hooks and CI.
- Code-phase hooks must call real scripts or proven affected-target subsets.
- Biome file filtering must avoid unsupported-file failures for docs-only
  commits.
- Slow deterministic simulation, mutation, replay, soak and device-matrix gates
  start as CI/nightly/release evidence before any local or PR-blocking
  promotion.
