---
title: FMX-177 Test strategy decision queue
status: current
tags: [execution, decision-queue, testing, quality, ci, vitest, playwright, fast-check, stryker, determinism, fmx-177]
created: 2026-06-14
updated: 2026-06-15
type: decision-queue
binding: true
linear: FMX-177
related:
  - [[../60-Research/test-strategy-adr-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../40-Quality/test-strategy]]
  - [[../30-Implementation/ci-and-review-process]]
---

# FMX-177 Test strategy decision queue

This is the HITL decision record for FMX-177. Nico accepted the packet on
2026-06-15: D1-D4=A, D5=A and D6=A-custom for portable CI with a future local
`xAi` runner proof gate. `xAi` here means Nico's own local stack, not xAI/Grok.

## D1 - strategy shape

| Option | Meaning | Assessment |
|---|---|---|
| **A. Tiered 16-layer strategy** | Keep the full risk map, but split PR/nightly/release/manual cadence. | **Recommended.** Protects simulation, save, PWA, a11y, perf and security risk without making PRs unusable. |
| B. Lean 8-layer strategy | Unit, integration, E2E, a11y, perf, security, determinism and release smoke only. | Simpler, but under-tests mutation, visual, save-forward-compatibility and long-horizon soak risk. |
| C. All layers per PR | Run every tool on every PR. | Strong on paper; high risk that slow/noisy gates get disabled. |

**Recommendation:** A.

**Decision:** Accepted A (Nico, 2026-06-15).

## D2 - runner/tool ownership

| Option | Meaning | Assessment |
|---|---|---|
| **A. Vitest projects + Playwright E2E split** | Vitest owns unit/domain/component/property/coverage; Playwright owns route journeys, offline/PWA, cross-browser/device smoke, a11y integration and browser traces. | **Recommended.** Best fit for the mixed deterministic-domain + browser-PWA stack and current official docs. |
| B. Vitest-first only | Use Playwright only for rare smoke. | Faster, but misses real browser/service-worker/mobile behavior. |
| C. Playwright-heavy | Drive most tests through Playwright. | Too slow/noisy for pure domain and property-heavy code. |

**Recommendation:** A.

**Decision:** Accepted A (Nico, 2026-06-15).

## D3 - property/replay evidence

| Option | Meaning | Assessment |
|---|---|---|
| **A. Replayable property evidence** | Persist property ID, seed, fast-check path, counterexample, engine/content/config hash and rerun command. | **Recommended.** Converts random failures into stable debug artifacts. |
| B. Seed-only | Print only the seed and rely on logs for the rest. | Easier but too weak for shrunk counterexamples and long-running deterministic bugs. |
| C. Exploratory only | Properties run without replay artifact requirements. | Rejected for FMX; contradicts replay/debug goals. |

**Recommendation:** A.

**Decision:** Accepted A (Nico, 2026-06-15).

## D4 - mutation scope, cadence and threshold

| Option | Meaning | Assessment |
|---|---|---|
| **A. Scoped nightly/release first** | Stryker over match/replay/save/ledger/rules/security-idempotency surfaces; first scheduled, PR gate only after measured stability. | **Recommended.** High signal without making every PR slow. Proposed threshold: 70 break / 80 low / 90 high for the scoped set after baseline. |
| B. PR-blocking immediately | Mutation threshold blocks every code PR from first code phase. | Strong but high wall-time and false-positive risk before baseline. |
| C. Defer mutation entirely | No Stryker until late beta. | Too late for core simulation assertion quality. |

**Recommendation:** A.

**Decision:** Accepted A (Nico, 2026-06-15).

## D5 - coverage threshold of record

| Option | Meaning | Assessment |
|---|---|---|
| **A. One base threshold: 85/85/85/75 per-file** | 85 statements, 85 lines, 85 functions and 75 branches for meaningful first-party product logic; documented exclusions only. | **Recommended.** Reconciles the existing design-system note with a single threshold of record and keeps bootstrap exceptions explicit. |
| B. Risk-tiered thresholds | Higher for engine/domain, lower for UI/app glue. | More nuanced, but easier to misconfigure and harder to audit early. |
| C. Advisory coverage only | Coverage reports but does not block. | Too weak for greenfield quality drift. |

**Recommendation:** A.

**Decision:** Accepted A (Nico, 2026-06-15).

## D6 - CI runner and cost posture

| Option | Meaning | Assessment |
|---|---|---|
| **A. Portable GitHub-hosted path + future local `xAi` runner gate** | Keep PR checks portable and simple; preserve Nico's local AI-server runner path, but activate local/self-hosted nightly/release gates only after compatibility, isolation, secret, maintenance and cost proof. | **Accepted.** Keeps PRs simple while leaving cost scaling and the local stack open. |
| B. All GitHub-hosted | No self-hosted runners. | Operationally simpler early, but expensive/deep gates may need later cost review. |
| C. Immediate self-hosted for all gates | Run PR/nightly/release on self-hosted from code phase start. | Too much maintenance/security surface before the app exists. |

**Recommendation:** A-custom.

**Decision:** Accepted A-custom (Nico, 2026-06-15). The local `xAi` path is
portable target capacity only until a later runner activation gate proves:
workflow/script compatibility, runner isolation or an accepted compensating
control, secret exposure posture, maintenance/update ownership, failure triage
and cost budget.

## Decision record

- 2026-06-14: FMX-177 selected from live Linear shortlist.
- 2026-06-14: FMX-177 moved from `Backlog` to `In Progress`.
- 2026-06-14: clean worktree/branch created:
  `codex/fmx-177-test-strategy-adr`.
- 2026-06-14: Perplexity-first research and primary source checks saved.
- 2026-06-14: pre-approval ADR-0118 and quality strategy drafts saved for
  Nico's D1-D6 decision.
- 2026-06-15: Nico accepted D1-D4=A, D5=A (`85/85/85/75`) and D6=A-custom.
- 2026-06-15: Source checks refreshed. Registry latest observations updated
  (`vitest`/`@vitest/browser`/`@vitest/browser-playwright` 4.1.9; Playwright
  1.60.0; fast-check 4.8.0; Stryker 9.6.1; Biome 2.5.0) and GitHub
  self-hosted runner hardening notes added.
- 2026-06-15: Follow-up work split out instead of folding scope into
  ADR-0118: FMX-196 and FMX-197.

## Approved packet

Accepted selection: **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A-custom**.

Promoted
[[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
to accepted/binding and [[../40-Quality/test-strategy]] to current/binding.

## Follow-up gaps

The second research pass found useful related work, but Nico explicitly kept it
outside FMX-177. Track separately rather than folding into ADR-0118:

- deterministic simulation replay harness plus soak/calibration metrics;
- save-forward compatibility matrix;
- PWA storage/offline/mobile degradation matrix;
- release rollback and content-validation QA gates.

Linear follow-ups:

- FMX-196 - deterministic simulation QA harness, soak metrics and
  save-forward matrix.
- FMX-197 - PWA/offline/mobile degradation, release rollback and content-QA
  gates.

## Related

- [[../60-Research/test-strategy-adr-2026-06-14]]
- [[../60-Research/raw-perplexity/raw-test-strategy-adr-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
- [[../40-Quality/test-strategy]]
