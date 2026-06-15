---
title: FMX-172 Stryker mutation gate decision queue
status: current
tags: [execution, decision-queue, testing, quality, mutation, stryker, vitest, determinism, ci, fmx-172]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: false
linear: FMX-172
related:
  - [[../60-Research/mutation-testing-gate-2026-06-15]]
  - [[../40-Quality/stryker-mutation-testing-gate]]
  - [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../30-Implementation/ci-and-review-process]]
---

# FMX-172 Stryker mutation gate decision queue

This is the HITL decision packet for FMX-172. No option below is accepted until
Nico decides.

## D1 - mutation scope

| Option | Meaning | Assessment |
|---|---|---|
| **A. ADR-0118 high-risk deterministic/domain scope** | Match/replay helpers, save parser/migration/envelope, ledger/accounting, regulations/eligibility and replay/idempotency validators. | **Recommended.** Highest signal for long-save and authoritative-state trust; avoids UI/generated-code noise. |
| B. Legacy engine-only scope | Mutate only match-engine packages first. | Safer runtime, but misses save/ledger/rule defects that are equally player-trust critical. |
| C. Whole repo broad scope | Mutate all first-party code, including UI glue. | Too slow/noisy before measured baselines; likely equivalent-mutant churn. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D2 - threshold and baseline model

| Option | Meaning | Assessment |
|---|---|---|
| **A. Baseline first, then 70/80/90** | Run reporting first, classify survivors, then enforce 70 break / 80 low / 90 high after baseline approval. | **Recommended.** Matches ADR-0118 while avoiding false confidence before real code/runtime data exists. |
| B. Immediate hard 70/80/90 | Fail as soon as Stryker config lands. | Too risky without runtime and equivalent-mutant evidence. |
| C. Stryker defaults | Use Stryker's default threshold bands. | Easier, but weaker than ADR-0118 and not tailored to FMX. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D3 - CI placement and blocking cadence

| Option | Meaning | Assessment |
|---|---|---|
| **A. Reporting -> nightly/release -> possible PR subgate** | Docs phase inactive; code bootstrap reporting; scheduled/release blocking after baseline; affected PR blocking only after stability evidence. | **Recommended.** Aligns FMX-175 branch-protection policy and controls cost. |
| B. PR-blocking immediately | Mutation must pass on every relevant PR from day one of code bootstrap. | Too slow and brittle before workspace burn-in. |
| C. Release-only forever | Mutation never affects PRs or nightly quality. | Low disruption, but misses early regression signal in high-risk code. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D4 - Stryker/Vitest config and version posture

| Option | Meaning | Assessment |
|---|---|---|
| **A. Latest stable source-checked pair at adoption** | At code bootstrap, re-check and pin exact Stryker core/runner plus Vitest; on 2026-06-15 the checked set is Stryker `9.6.1` and Vitest `4.1.9`. Use official Vitest runner and Vitest projects. | **Recommended.** Respects dependency-currency rules without adding docs-phase deps. |
| B. Freeze old Stryker 8.x wording | Keep historical pre-mortem version assumptions. | Outdated and conflicts with latest-stable rule. |
| C. Defer all version guidance | Say only "use Stryker later". | Too vague for a decision packet; loses source-check value. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D5 - incremental cache and artifact policy

| Option | Meaning | Assessment |
|---|---|---|
| **A. CI cache/artifacts, no committed cache, forced full reruns** | Use incremental for speed; publish HTML/JSON; cache `reports/stryker-incremental.json` in CI only; force full reruns for release and source-of-truth changes. | **Recommended.** Fits official incremental limitations and preserves evidence. |
| B. Commit the incremental report | Keep `reports/stryker-incremental.json` in git as the baseline. | Conflicts with official limitations; high churn/noise. |
| C. No incremental mode | Always full run. | Simpler proof, but likely too slow for PR/advisory use. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D6 - deterministic survivor policy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Non-equivalent deterministic survivors are test defects** | A survivor that can change replay, save, ledger, eligibility or idempotent outcome requires stronger invariant tests; documented equivalent mutants are allowed. | **Recommended.** Best fit for long-save and authoritative-state trust. |
| B. Every deterministic mutant must be killed literally | No survivor exceptions in critical modules. | Strong signal, but unrealistic because equivalent mutants exist. |
| C. Generic mutation-score-only policy | Treat deterministic code like ordinary app code. | Too weak for replay and save trust. |

**Recommendation:** A.

**Decision:** Pending Nico.

## Decision record

- 2026-06-15: FMX-172 selected after live Linear triage; no dependency blockers
  or open PRs found.
- 2026-06-15: FMX-172 moved from `Backlog` to `In Progress`.
- 2026-06-15: clean worktree/branch created:
  `codex/fmx-172-stryker-mutation-gate`.
- 2026-06-15: Perplexity-first research saved and weak citations separated
  from source-checked evidence.
- 2026-06-15: Decision-pending synthesis, draft ADR-0125 and draft quality
  runbook prepared.

## Proposed packet

Recommended selection: **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A**.

If accepted, promote
[[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
to `accepted` / `binding: true`, promote
[[../40-Quality/stryker-mutation-testing-gate]] to `current` /
`binding: true`, and patch [[../40-Quality/test-strategy]] so FMX-172 is no
longer listed as a follow-up gap.

## Questions for Nico

- Do you accept the recommended **all A** packet?
- If not, which specific decision should change: D1, D2, D3, D4, D5 or D6?
- Should mutation become eligible for PR blocking after burn-in, or should it
  remain release/nightly-only even for high-risk deterministic packages?

## Related

- [[../60-Research/mutation-testing-gate-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-mutation-testing-gate-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-mutation-testing-gate-source-checks-2026-06-15]]
- [[../40-Quality/stryker-mutation-testing-gate]]
- [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
