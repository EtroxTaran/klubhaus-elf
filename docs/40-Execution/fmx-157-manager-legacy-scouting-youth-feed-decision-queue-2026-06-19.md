---
title: FMX-157 Manager Legacy Scouting Youth Feed Decision Queue
status: accepted
tags: [execution, decision-queue, fmx-157, manager-legacy, scouting, youth, academy, contracts, accepted]
created: 2026-06-19
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-157
owner: Nico
related:
  - [[../60-Research/manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-157-academy-audit-retention-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-157-opposition-scouting-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-157-handoff-schemas-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-157-source-checks-2026-06-19]]
  - [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
---

# FMX-157 Manager Legacy Scouting Youth Feed Decision Queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-157.


## Context

ADR-0060, ADR-0064, ADR-0075 and ADR-0080 already name the relevant context
boundaries and placeholder events. FMX-157 captures the remaining decisions
needed before implementation can define exact academy audit, cohort retention,
opposition-scouting and handoff schemas.

Nico accepted the approved packet on 2026-06-19; the chosen options below are binding.

## D1 - Canonical promotion path

| Option | Description | Trade-off |
|---|---|---|
| **A - targeted amendments** | Keep FMX-157 as a decision queue plus additive pending notes in ADR-0060/0064/0075/0080 and the state-machine notes. | Best fit: existing context boundaries are sufficient; this packet adds unresolved detail without over-formalizing. |
| B - new standalone ADR | Draft a new ADR solely for the Manager Legacy / Scouting / Youth feed. | More formal, but risks duplicating decisions already owned by the existing ADRs. |
| C - no ADR changes, research only | Preserve research and leave canonical ADRs untouched. | Least churn, but future agents may miss the pending follow-up when reading the ADRs. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D2 - Academy audit owner and Manager & Legacy feed

| Option | Description | Trade-off |
|---|---|---|
| **A - Youth Academy owns audit, Manager & Legacy consumes summaries** | Youth Academy owns `AcademyCategoryAuditCycle` and `AcademyPipelineSummaryUpdated`; Manager & Legacy consumes immutable summary snapshots at run/save watermarks. | Preserves source ownership and ADR-0051 determinism. |
| B - Manager & Legacy owns academy audit for style scoring | Manager & Legacy computes youth-pipeline quality directly. | Rejected: creates alternate academy truth and live producer coupling. |
| C - Regulations owns academy category audit | Regulations owns all category interpretation and Youth Academy stores only facts. | Clean for rule interpretation but overextends Regulations into club academy operations. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D3 - Audit cadence and cohort history retention

| Option | Description | Trade-off |
|---|---|---|
| **A - 2-season audit, 5-season full detail, 20+ season summaries** | Proposed game analogue: audit every 2 academy seasons; keep full cohort detail for latest 5 seasons; keep annual summaries/milestones for 20+ seasons. | Long-save friendly and inspectable. Exact cadence is a game decision because external cadence evidence was weak. |
| B - annual audit, 10-season detail | More reactive and more detailed. | Higher storage/UI churn and more category volatility. |
| C - 3-5 season audit, summaries only after 3 seasons | Lower churn and lower storage. | Slower feedback loop; risks making academy investment feel inert. |

Recommendation: **A** as a starting design default, with final thresholds in
FMX-52 / GD-0043 calibration.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D4 - Opposition scouting ownership

| Option | Description | Trade-off |
|---|---|---|
| **A - split hook** | Scouting owns report execution/freshness/confidence; Tactics owns match-plan/template interpretation; Match consumes only frozen snapshots. | Best boundary fit and keeps ADR-0080 intact. |
| B - Tactics owns opposition scouting end to end | Tactics owns assignments, reports and match-plan use. | Simpler UI lane, but pollutes Tactics with intelligence-gathering lifecycle. |
| C - Scouting owns opposition response end to end | Scouting owns report and tactical recommendation. | Pollutes Scouting with match-plan authority and conflicts with ADR-0080. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D5 - Cross-context handoff schema pattern

| Option | Description | Trade-off |
|---|---|---|
| **A - producer event + consumer ACL/snapshot** | Producer owns a versioned Published Language event; consumer stores an ACL projection/snapshot for long-lived use. | Best fit with FMX no-join rule, replay and bounded-context autonomy. |
| B - shared youth/scouting kernel | Define shared DTOs used by Scouting, Youth Academy, Transfer and Manager & Legacy. | Reduces mapping, but couples vocabularies and versioning. |
| C - minimal refs only | Events carry ids only; consumers query producer live when needed. | Thin payload, but weak for replay/long-save determinism and invites cross-context reads. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D6 - Scope timing

| Option | Description | Trade-off |
|---|---|---|
| **A - keep as post-MVP/reserved stubs** | Record owner/schema direction now; implement only when the relevant MVP or post-MVP issue activates it. | Preserves traceability without expanding current scope. |
| B - promote to MVP foundation | Treat audit summaries, youth/scouting handoff schemas and opposition reports as MVP-ready contracts. | Stronger foundation, but expands MVP surface before Nico has approved detail/calibration. |
| C - remove placeholders until needed | Delete or hide the hooks from ADRs until a feature needs them. | Cleaner docs now, but loses already named future seams and makes rediscovery likely. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## Post-Approval Follow-Up Notes

- The accepted answers were promoted into the relevant ADRs and state-machine
  notes during the June 19 closure sweep.
- No standalone ADR is needed because Nico accepted D1=A.
- D3=A is the accepted starting default; final numeric tuning remains a
  calibration input, not an open Nico decision.
- D6=A keeps the detailed envelopes as post-MVP/reserved stubs until a later
  implementation beat activates them.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A**.

No open Nico decision remains for FMX-157.

## Related

- [[../60-Research/manager-legacy-scouting-youth-feed-followups-2026-06-19]]
- [[../60-Research/raw-perplexity/raw-fmx-157-source-checks-2026-06-19]]
- [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
- [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
- [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
- [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
