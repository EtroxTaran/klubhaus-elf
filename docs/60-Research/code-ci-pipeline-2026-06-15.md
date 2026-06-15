---
title: Code-CI Pipeline Contract Research
status: current
tags: [research, ci, github-actions, nx, pnpm, testing, quality, security, determinism, fmx-175]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-175
related:
  - [[raw-perplexity/raw-code-ci-pipeline-2026-06-15]]
  - [[raw-perplexity/raw-code-ci-pipeline-source-checks-2026-06-15]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[../40-Quality/test-strategy]]
  - [[../40-Execution/fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
  - [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
---

# Code-CI Pipeline Contract Research

FMX-175 closes the stale Code-CI check-name gap left after the docs-vault reset.
The current repo has no workspace, app or package code; therefore this packet
defines the future code-CI contract without adding fake workflows, scripts or
dependencies.

Nico accepted the decision packet on 2026-06-15:

- script/domain-aligned future check names;
- burn-in before branch-protection promotion;
- in-place compression of stale D-002 incident wording.

The binding process text lives in [[../30-Implementation/ci-and-review-process]]
and ADR-0044.

## Recommendation

Use three future required code-phase contexts after real scripts and workflows
exist:

| Future required context | Backing root entrypoint | What it proves |
|---|---|---|
| `quality` | `pnpm check` or the accepted successor root script | Biome/format, typecheck, unit/domain/component/property smoke and contract validation through Nx affected targets. |
| `e2e` | `pnpm test:e2e` or the accepted app-specific E2E root script | Playwright critical journey/offline/PWA smoke with deterministic data and failure traces. |
| `security` | future root security/SBOM script | secret/dependency/SBOM/license evidence, with CycloneDX artifact output when release-grade evidence exists. |

Keep these as target-only until the bootstrap creates real code targets. The
active required checks remain:

- `docs-check`;
- `linear-id`.

Do not use these as future required-context names:

- `cursor-smoke` - a historical broken-job lesson, not a portable product
  quality domain;
- `configured` - not meaningful as a merge gate unless it is decomposed into a
  concrete script; its intent is covered by the bootstrap checklist and
  branch-protection promotion rule;
- `lighthouse` as a core required context from day one - Lighthouse should
  start as smoke/reporting or release evidence until budgets and variance are
  stable.

## Findings

### F1 - The root problem is branch-protection drift

The original D-002 narrative described required code checks that no longer
exist after the docs-vault reset. GitHub branch protection requires named
status-check contexts/checks; if a context is listed but no workflow provides
it, the repo can block itself or document impossible requirements.

FMX's safe rule is:

1. no required branch-protection context without a real script and workflow;
2. no future code context marked active while the repo is docs-only;
3. promotion only after the check is green on real PR evidence.

### F2 - Domain-level contexts are more stable than tool-level contexts

Tool names change and suite composition evolves. The user-visible required
contexts should describe durable proof domains:

- `quality` for code correctness and contract quality;
- `e2e` for critical browser/PWA journeys;
- `security` for dependency, SBOM and secret/supply-chain evidence.

Internally, those contexts can call Biome, TypeScript, Vitest, fast-check,
Playwright, Storybook, LHCI, cdxgen or Stryker as appropriate. The required
context name should not need to change when the internal tool split changes.

### F3 - Burn-in is part of the contract

A future code check is eligible for branch protection only after all are true:

- the root script exists and does not silently skip required targets;
- the GitHub workflow invokes that script as a thin trigger;
- the Nx/project targets behind it are real;
- the check is green on actual PR evidence;
- known flake or infrastructure instability is fixed at source;
- CODEOWNER/review routing for code paths is active where ADR-0044 requires it.

Until then, the check may run as non-required/reporting or scheduled evidence.

### F4 - PR, nightly and release cadence must differ

PR hot path:

- docs checks while docs-only;
- later `quality`, `e2e` and `security` only after bootstrap/burn-in;
- affected/cached targets where Nx can safely determine the impacted graph;
- deterministic data, replayable failures and short wall time.

Nightly/release path:

- full Playwright browser/device/PWA matrix;
- Lighthouse/Web Vitals drift;
- accessibility breadth;
- Stryker mutation baselines;
- large fast-check property runs;
- golden-seed replay sweeps;
- 50-year soak/calibration envelopes;
- release SBOM and artifact evidence.

This extends accepted [[../40-Quality/test-strategy]] without duplicating
ADR-0118's tool ownership decisions.

### F5 - Game/simulation precedent points to replayable evidence

Football-manager code is not just web UI. It is a deterministic long-running
simulation. The strongest CI implications are:

- use fixed seeds and golden scenarios for PR smoke;
- persist property failure `seed` / `path` / counterexample evidence;
- run deeper seed sweeps and soak/calibration outside the normal PR wall;
- keep generated/random/provider behavior outside replay-bearing state;
- measure variance explicitly when a simulation surface cannot be exactly
  deterministic.

This matches the source-checked fast-check replay docs, the simulation
determinism research and FMX's accepted ADR-0118/quality strategy.

## D-002 cleanup

D-002 stays valuable as an incident lesson:

- never normalize a red `main`;
- never tolerate structurally broken jobs;
- never dismiss flakes as noise;
- keep local and CI gates aligned.

It is no longer live repo state. The active repo has no app code, no Storybook,
no E2E app and no Lighthouse target. D-002 wording should therefore live as a
compact historical lesson in the CI process, not as a current blocker.

## Ownership and trigger

FMX-175 owns the contract. The future code bootstrap owner owns implementation:

- FMX-179/workspace bootstrap creates the first real workspace targets after
  Nico accepts ADR-0114 or its successor;
- the first code-phase CI bootstrap PR creates root scripts and thin workflows;
- FMX-176 owns local-parity/lefthook restoration;
- branch protection is updated only after the corresponding scripts/workflows
  have passed burn-in.

## Related

- [[raw-perplexity/raw-code-ci-pipeline-2026-06-15]]
- [[raw-perplexity/raw-code-ci-pipeline-source-checks-2026-06-15]]
- [[../30-Implementation/ci-and-review-process]]
- [[../30-Implementation/code-phase-dod-transition-contract]]
- [[../40-Quality/test-strategy]]
- [[../40-Execution/fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
- [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
- [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
