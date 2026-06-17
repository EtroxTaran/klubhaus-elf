---
title: Raw local-parity Lefthook research
status: raw
tags: [research, raw, perplexity, tooling, lefthook, local-parity, ci, pnpm, nx, biome, fmx-176]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-176
related:
  - [[../local-parity-lefthook-2026-06-17]]
  - [[raw-local-parity-lefthook-source-checks-2026-06-17]]
  - [[../../40-Execution/fmx-176-local-parity-decision-record-2026-06-17]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
---

# Raw local-parity Lefthook research

## Capture metadata

- **Issue:** FMX-176
- **Date:** 2026-06-17
- **Purpose:** First-pass discovery for restoring local hook parity without
  reintroducing the old docs-only Biome failure or inventing code-phase gates
  before the workspace exists.
- **Status:** Raw discovery input. The source-checked sibling note is the
  authority for tool versions and configuration semantics.

## Prompt

Research current best practices for JavaScript/TypeScript pnpm + Nx monorepos
using Lefthook or Husky for local/CI parity. Include how to handle docs-only
changes, pre-commit vs pre-push hooks, avoiding placeholder checks, latest
stable tool versions, and game/simulation project implications for deterministic
tests and slow soak suites.

## Raw answer summary

- Keep local hooks fast and aligned with CI, but do not treat local hooks as the
  only quality gate. CI remains the source of truth.
- Use pre-commit for fast staged-file checks only when the relevant tool can
  handle the file set. The old FMX failure was a local gate running a Biome step
  on unsupported docs/YAML-only commits.
- Use pre-push for bounded, repo-level smoke checks. For the current
  docs-vault-only repo, the only real bounded smoke check is `pnpm docs:check`.
- Do not add placeholder `check`, `typecheck`, `test`, `test:e2e`, Nx, Biome or
  lint-staged commands until real app/package paths exist.
- For a future code monorepo, root scripts should be the public contract and can
  wrap Nx affected targets. Hooks should call the same root scripts or a clearly
  documented affected subset, not duplicate CI logic.
- Slow deterministic simulation, mutation, replay, soak and device-matrix gates
  should begin as CI/nightly/release evidence. They should not block every local
  commit or push until the codebase, fixtures and flake policy are proven.

## Mentioned source classes

The Perplexity pass surfaced mixed-quality sources including Lefthook/Husky
setup posts, Nx monorepo articles, StackOverflow/community troubleshooting,
testing best-practice writeups and game/simulation testing commentary. These
were useful for option discovery only. Primary/current checks are preserved in
[[raw-local-parity-lefthook-source-checks-2026-06-17]].

## Initial options from discovery

| Option | Shape | First-pass assessment |
|---|---|---|
| A. Docs-only hook now, code hooks later | Add Lefthook now with `pre-push -> pnpm docs:check`; defer Biome/Nx/code hooks until the workspace exists. | Best fit for current repo truth and old D-002 lesson. |
| B. Add full code-style hook stack now | Add Biome/Nx/lint-staged and future scripts now. | Rejected for this phase: would create placeholder/nonexistent gates and repeat the local-vs-CI problem. |
| C. No local hook until code phase | Keep docs checks manual only. | Too weak for FMX-176: misses the accepted need to restore local parity for the active docs-phase gate. |

## Raw conclusion

The safe implementation is a hybrid: restore Lefthook now, but only for the
active docs-phase check. Treat code-phase local parity as a target contract that
returns after FMX-179/workspace bootstrap and the accepted future code scripts
exist.
