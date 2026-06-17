---
title: FMX-176 Local-Parity Lefthook Decision Record
status: current
tags: [execution, decision-record, tooling, lefthook, local-parity, ci, accepted, fmx-176]
created: 2026-06-17
updated: 2026-06-17
type: decision-record
binding: false
linear: FMX-176
related:
  - [[../60-Research/local-parity-lefthook-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-local-parity-lefthook-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-local-parity-lefthook-source-checks-2026-06-17]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
---

# FMX-176 Local-Parity Lefthook Decision Record

## Context

FMX-176 closes the docs-phase portion of the old local-vs-CI parity gap. The
repo has no app/package code workspace yet, but it does have a real docs gate:
`docs-check`. The old D-002 lesson remains relevant: a broad local Biome hook
that fails docs/YAML-only commits is worse than no hook because it trains agents
to bypass local parity.

## Decisions recorded

| ID | Question | Options considered | Nico decision |
|---|---|---|---|
| D1 | Scope of local-parity restoration | Docs-only hook now; full code hook stack now; no hook until code phase. | **Docs-only hook now.** Add Lefthook for the active docs gate and defer code hooks. |
| D2 | Hook trigger | `pre-commit`; `pre-push`; manual only. | **`pre-push`.** Run the repo-level docs check before pushing instead of on every commit. |
| D3 | `docs:status-check` handling | Always run in hook; manual conditional check; never run locally. | **Manual conditional check.** Run when ADR/GDDR `status:` or `binding:` semantics changed. |
| D4 | Biome/Nx/lint-staged timing | Add now; document only; defer to code bootstrap. | **Defer.** No code-phase tool or placeholder script until real workspace paths and scripts exist. |
| D5 | pnpm build-script policy | Leave Lefthook build scripts unapproved; approve in package metadata; approve in `pnpm-workspace.yaml`. | **Approve in `pnpm-workspace.yaml`.** pnpm v11 requires build-policy settings there. |

## Accepted contract

- `lefthook@2.1.9` is exact-pinned in `devDependencies`.
- `pnpm-workspace.yaml` exists only to approve Lefthook's dependency build
  script through `allowBuilds.lefthook: true`.
- `lefthook.yml` defines one active hook: `pre-push` runs `pnpm docs:check`.
- `package.json` exposes `hooks:install` and `hooks:run:pre-push`; the manual
  run script forces execution and disables auto-install.
- No Biome, Nx, lint-staged, code test hook or placeholder root script is added
  by FMX-176.

## Evidence

- Raw Perplexity:
  [[../60-Research/raw-perplexity/raw-local-parity-lefthook-2026-06-17]]
- Source checks:
  [[../60-Research/raw-perplexity/raw-local-parity-lefthook-source-checks-2026-06-17]]
- Synthesis:
  [[../60-Research/local-parity-lefthook-2026-06-17]]

## Follow-up

- FMX-179/code bootstrap must revisit local hooks after real app/package paths,
  root scripts and CI workflows exist.
- Future Biome hook design must use file filtering and `--no-errors-on-unmatched`
  or equivalent to avoid the old docs-only unsupported-file failure.
- Future deterministic simulation, replay, mutation and soak gates start as
  CI/nightly/release evidence before they become local or PR-blocking checks.
