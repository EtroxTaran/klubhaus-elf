---
title: FMX-211 Architecture Review Decision Queue
status: draft
tags: [execution, decision-queue, fmx-211, architecture, ddd, modularity, workflow, needs-nico-decision]
created: 2026-06-22
updated: 2026-06-22
type: decision-queue
binding: false
linear: FMX-211
owner: Nico
related:
  - [[../60-Research/architecture-decision-portfolio-review-2026-06-22]]
  - [[../60-Research/architecture-adr-coverage-matrix-2026-06-22]]
  - [[../60-Research/raw-perplexity/raw-fmx-211-architecture-source-checks-2026-06-22]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../30-Implementation/stack-currency-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# FMX-211 Architecture Review Decision Queue

> **DECIDED 2026-06-22 by Nico.** D1–D6 are ratified together with the companion's
> D7–D14 — the consolidated ratified answers (and where D2 was refined to a
> two-axis `status`/`binding` model) are in
> [[fmx-211-reconciliation-delta-2026-06-22]] §0. A change of heart requires a new
> ADR. The per-item recommendations below are retained as rationale.

## Context

FMX-211 reviewed the current gameplay documentation, accepted ADR/GDDR
portfolio, context map, quality gates, stack-currency posture and current
best-practice sources.

The review concludes that the architecture is coherent and compatible with the
gameplay portfolio, but several hardening decisions are needed before code
bootstrap and before multiple teams can safely work in parallel.

This queue is **not accepted** until Nico answers.

## D1 - Portfolio verdict

| Option | Description | Trade-off |
|---|---|---|
| **A - accept current portfolio with targeted hardening** | Treat the current architecture direction as coherent/current and close FMX-211 with follow-ups for status hygiene, stack pins, module cards and architecture fitness. | Keeps momentum and avoids re-litigating already accepted ADRs while still fixing handoff risks. |
| B - reopen a broad architecture replacement sweep | Re-question the core stack, persistence, DDD boundaries and runtime architecture as one new meta decision. | Maximum caution, but likely churns already accepted decisions without evidence of an incompatibility. |
| C - defer verdict until code bootstrap | Do not decide whether the architecture is coherent until implementation starts. | Avoids premature certainty, but leaves human/team handoff unclear. |

Recommendation: **A**.

Decision: **Decided 2026-06-22** — see [[fmx-211-reconciliation-delta-2026-06-22]] §0 (D2 refined to the two-axis model).

## D2 - Status-body hygiene

| Option | Description | Trade-off |
|---|---|---|
| **A - narrow accepted-body/front-door hygiene sweep** | Open a focused follow-up that removes stale `draft`, `pending`, `non-binding` and "until accepted" prose from accepted records and maps where the source of truth is already clear. | Best clarity for human teams; avoids changing architecture semantics. |
| B - mass normalize all accepted/current `binding: false` frontmatter now | Flip every accepted/current record to `binding: true` where plausible. | Produces a cleaner-looking vault but risks broad metadata churn and unintended status semantics. |
| C - leave historical prose as is | Rely on frontmatter/status columns only. | Lowest churn, but future developers may misread stale body text. |

Recommendation: **A**.

Decision: **Decided 2026-06-22** — see [[fmx-211-reconciliation-delta-2026-06-22]] §0 (D2 refined to the two-axis model).

## D3 - Stack-currency follow-through

| Option | Description | Trade-off |
|---|---|---|
| **A - route through FMX-198 follow-ups** | Keep FMX-198 as the active stack-currency authority. Execute pnpm, Node, PostgreSQL, Capacitor/Nx follow-ups as narrow source-checked beats. | Preserves decision traceability and avoids changing active pins in a broad review. |
| B - apply all latest-stable pins inside FMX-211 | Mutate active tool/runtime/database pins immediately. | Fastest currency alignment, but violates the separation of review vs toolchain mutation. |
| C - freeze current active pins until first app package exists | Make no tool/runtime pin changes until code bootstrap. | Conservative, but knowingly leaves stale active pins after Nico already accepted FMX-198 follow-through. |

Recommendation: **A**.

Decision: **Decided 2026-06-22** — see [[fmx-211-reconciliation-delta-2026-06-22]] §0 (D2 refined to the two-axis model).

## D4 - Module-card completeness

| Option | Description | Trade-off |
|---|---|---|
| A - stay with FMX-169 MVP slice only | Keep module cards only for the first MVP-critical context slice until work needs more. | Minimal docs load, but not enough for the "every separate team understands every aspect" goal. |
| **B - staged all-28 before multi-team code fan-out** | Keep the MVP slice now, but require all 28 context cards before multiple human/dev teams implement in parallel. | Best balance: avoids docs churn today but gives a concrete handoff-readiness gate. |
| C - create all 28 cards now | Add module cards for every bounded context immediately. | Maximum handoff clarity, but high churn before code/package boundaries exist. |

Recommendation: **B**.

Decision: **Decided 2026-06-22** — see [[fmx-211-reconciliation-delta-2026-06-22]] §0 (D2 refined to the two-axis model).

## D5 - Dynamic workflow promotion

| Option | Description | Trade-off |
|---|---|---|
| **A - promote FMX-211 workflows into a current process note before code phase** | Convert the workflow diagrams from the synthesis into a current implementation/process note or code-phase DoD appendix. | Makes human-team handoff and agent execution repeatable. |
| B - leave workflows only in this research note | Treat the workflows as review context, not operating guidance. | Lower churn, but future teams may miss them. |
| C - create a superseding process ADR | Turn workflows into a formal ADR. | Strong governance, but may be heavier than needed because ADR-0045/0103/0110 already define process authority. |

Recommendation: **A**.

Decision: **Decided 2026-06-22** — see [[fmx-211-reconciliation-delta-2026-06-22]] §0 (D2 refined to the two-axis model).

## D6 - Architecture fitness timing

| Option | Description | Trade-off |
|---|---|---|
| **A - first foundation PR gate** | Make ADR-0121 import/storage/query scanners part of the first real code-phase foundation quality gate before domain teams fan out. | Prevents cross-context coupling while code is still small. |
| B - add fitness checks after first domain slice | Let the first implementation slice establish patterns before tooling hardens. | Faster first code, but boundary mistakes can become reference patterns. |
| C - rely on review until repo has enough code | Delay scanners until manual review becomes noisy. | Lowest upfront cost, but weakest modularity guarantee. |

Recommendation: **A**.

Decision: **Decided 2026-06-22** — see [[fmx-211-reconciliation-delta-2026-06-22]] §0 (D2 refined to the two-axis model).

## Nico Question — answered (D1)

**Decided 2026-06-22:** FMX-211 closes as **architecture coherent/current with
targeted hardening** (no broad replacement sweep). Hardening is tracked via the
ratified D2–D14 in [[fmx-211-reconciliation-delta-2026-06-22]].

## Related

- [[../60-Research/architecture-decision-portfolio-review-2026-06-22]]
- [[../60-Research/architecture-adr-coverage-matrix-2026-06-22]]
- [[../60-Research/raw-perplexity/raw-fmx-211-architecture-source-checks-2026-06-22]]
- [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
- [[../30-Implementation/stack-currency-ledger]]
