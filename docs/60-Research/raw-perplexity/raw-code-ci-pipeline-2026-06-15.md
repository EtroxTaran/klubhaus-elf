---
title: Raw code-CI pipeline research
status: raw
tags: [research, raw, perplexity, ci, github-actions, nx, pnpm, vitest, playwright, fast-check, stryker, lighthouse, accessibility, sbom, fmx-175]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-175
related:
  - [[../code-ci-pipeline-2026-06-15]]
  - [[raw-code-ci-pipeline-source-checks-2026-06-15]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[../../40-Execution/fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
---

# Raw code-CI pipeline research

## Prompt

Research best practices for defining a future code-CI pipeline for a pnpm +
Nx TypeScript/React/PWA monorepo that is currently docs-only.

Constraints:

- current required checks are only `docs-check` and `linear-id`;
- future code phase will use root repo scripts as public entrypoints and thin
  GitHub Actions;
- Nx affected/cached targets run internally;
- tools include Biome, TypeScript, Vitest, Playwright, fast-check, StrykerJS,
  Storybook, Lighthouse/LHCI, accessibility scans and SBOM/dependency scanning;
- stale D-002-era check names (`quality`, `e2e`, `lighthouse`,
  `cursor-smoke`, `configured`) must be cleaned up;
- future required names should be script/domain-aligned, activated only after
  burn-in and reconciled with historical incident wording.

The prompt also asked for real-world software-delivery precedent and
game/simulation QA precedent.

## Perplexity capture

Perplexity recommended:

- use thin GitHub Actions that invoke root repo scripts rather than duplicating
  check logic in workflow YAML;
- route monorepo work through Nx affected/cached targets for PR checks and
  broader `run-many`/all-target paths for nightly or release checks;
- keep the PR hot path fast and deterministic, with heavy mutation, large
  Playwright matrices, full Lighthouse, broad property fuzzing, soak and
  calibration outside normal PR required checks;
- avoid encoding tool/vendor/incidental terms in required context names;
- map stale names such as `cursor-smoke` and `configured` to historical lessons
  rather than future branch-protection contexts;
- introduce future code checks as non-required first, observe stability and only
  then promote them to required branch-protection checks;
- document check names, root-script mappings and branch-protection state in the
  vault so branch protection does not drift away from real workflows;
- for simulation-heavy games, make deterministic replay, golden seeds,
  replayable property failures, calibration and soak evidence first-class CI
  concepts, but split them by cadence.

The first pass suggested a broad `ci:*` naming scheme. For FMX, the accepted
packet narrows that into domain-level required contexts:

- `quality`;
- `e2e`;
- `security`.

Those names stay backed by root repo scripts and Nx targets once code phase
exists. They do not replace the active docs-phase checks today.

## Weak-source handling

Perplexity included several blog/video links for monorepo CI and weak
game-precedent assertions. They are discovery input only. The canonical
source-check trail for this packet is
[[raw-code-ci-pipeline-source-checks-2026-06-15]].

## FMX-175 recommendation from the research pass

- Keep current docs-phase branch protection exactly as `docs-check` +
  `linear-id`.
- Define future code-phase required contexts as `quality`, `e2e` and
  `security`, each mapped to real root scripts and Nx targets when the workspace
  exists.
- Keep `lighthouse`, `a11y`, `storybook`, `game-smoke`, `mutation`, `soak` and
  similar deeper gates as non-required/reporting, nightly or release gates until
  later promotion.
- Retire `cursor-smoke` and `configured` as required-context names. Preserve
  them only as historical D-002 lessons.
- Use burn-in before any branch-protection promotion: a check must have a real
  script, real workflow, green evidence on actual PRs and no known flake before
  it can become required.
- Do not add code workflows, fake scripts, packages or dependencies in FMX-175;
  the repo is still docs-vault-only.

## Related

- [[../code-ci-pipeline-2026-06-15]]
- [[raw-code-ci-pipeline-source-checks-2026-06-15]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../40-Execution/fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
