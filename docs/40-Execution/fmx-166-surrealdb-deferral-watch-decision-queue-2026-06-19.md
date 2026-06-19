---
title: FMX-166 SurrealDB Deferral Watch Decision Queue
status: accepted
tags: [execution, decision-queue, fmx-166, surrealdb, postgresql, graph, realtime, projection, adr, accepted]
created: 2026-06-19
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-166
owner: Nico
related:
  - [[../60-Research/surrealdb-deferral-reevaluation-watch-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-166-surrealdb-deferral-reevaluation-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-166-surrealdb-deferral-source-checks-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-198-version-source-checks-2026-06-19]]
  - [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
  - [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[../10-Architecture/11-Risks]]
---

# FMX-166 SurrealDB Deferral Watch Decision Queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-166.


## Context

ADR-0021 and ADR-0097 already keep PostgreSQL + Drizzle as the system of record
and reserve SurrealDB only as an optional non-authoritative projection/live
graph engine. FMX-166 closes the stale residual: the old "stable 1.x /
re-evaluate 2.x" wording no longer reflects the live SurrealDB release line.

This queue asks Nico to approve the concrete watch rule, owner and gate. No
SurrealDB adoption or version pin is binding until these decisions are accepted.

## D1 - Re-evaluation trigger

| Option | Description | Trade-off |
|---|---|---|
| A - calendar-only review | Re-check SurrealDB quarterly regardless of product need. | Finds stale facts, but can create busywork and adoption pressure without a gameplay reason. |
| B - product-need only | Re-open only when an FMX feature needs graph/live behavior. | Product-led, but may miss major security/ops/version changes until late. |
| **C - compound trigger** | Re-open only when a concrete FMX graph/live projection need exists **and** the current stable SurrealDB line passes ops/security/recovery checks; also run a quarterly light watch for stale facts. | Best balance: no infrastructure without gameplay value, but version/security/roadmap drift is still watched. |
| D - drop SurrealDB seam entirely | Remove the reserved option and rely only on PostgreSQL/Centrifugo/read models. | Simplifies architecture but discards future graph/live upside before product evidence exists. |

Recommendation: **C**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D2 - Owner and cadence

| Option | Description | Trade-off |
|---|---|---|
| **A - Lead Architect/Data Platform owner** | Nico owns the watch until a dedicated data/platform owner exists; the watch runs quarterly and on event triggers. | Clear accountability in the current team shape; needs delegation later. |
| B - every feature owner self-checks | Any feature team checks SurrealDB when needed. | Local ownership, but risks inconsistent source quality and stale central wording. |
| C - no owner until implementation phase | Leave the watch dormant until code exists. | Lowest process cost now, but repeats the stale `1.x`/`2.x` problem. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D3 - Version posture

| Option | Description | Trade-off |
|---|---|---|
| **A - exact current stable at Trial** | Remove historical major-line pinning. At any future Trial, source-check releases/tags/docs and exact-pin the current stable line then. FMX-198 records 3.1.5 only as the 2026-06-19 observed fact. | Aligns with FMX dependency currency and avoids stale major-line rot. Requires a fresh check at Trial time. |
| B - pin SurrealDB 3.1.x now | Record 3.1.x as the future line. | Current today, but likely stale before implementation and creates false adoption pressure. |
| C - keep `1.x` wording for conservatism | Keep old stable-line language. | Rejected: it is factually stale on 2026-06-19. |
| D - no version language | Only say "current stable" with no dated example. | Clean but hides the reason this issue existed. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D4 - Assess -> Trial -> Adopt gate

| Option | Description | Trade-off |
|---|---|---|
| **A - non-authoritative projection Trial only** | SurrealDB stays Assess until a time-boxed Trial proves a rebuildable non-authoritative projection, disable switch, restore path, observability and gameplay value. | Preserves upside while protecting money/save/contract state. |
| B - permit authoritative subset Trial | Allow SurrealDB to own a narrow feature's authoritative state if isolated. | Rejected for now: reopens the core data-layer decision and expands failure blast radius. |
| C - Adopt after vendor maturity alone | Move to Adopt once SurrealDB reaches a maturity milestone. | Rejected: vendor maturity without FMX product need is not enough. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D5 - Canonical homes

| Option | Description | Trade-off |
|---|---|---|
| **A - split canonical homes** | ADR-0021 records stack posture; ADR-0097 records the data-layer scope call; `11-Risks` owns the watch risk/trigger; `07-Deployment` records disabled-by-default deployment posture; this queue keeps Nico decisions. | Keeps each doc focused and avoids a new ADR for a watch rule. |
| B - new ADR now | Create a dedicated ADR for the SurrealDB watch. | More formal, but disproportionate unless Nico wants the watch rule accepted as a first-class architecture decision. |
| C - only update `11-Risks` | Put all watch details in the risk register. | Too easy to miss from stack/deployment readers. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## Required follow-up after Nico decision

- If Nico accepts D1-D5, promote the accepted answers into the relevant ADR/risk
  text and close FMX-166.
- If Nico changes D2, update the owner/cadence in `11-Risks` and the session
  handoff.
- If Nico chooses a new ADR (D5-B), draft it as `status: draft`,
  `binding: false` until accepted.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=C, D2=A, D3=A, D4=A, D5=A**.

No open Nico decision remains for FMX-166.

## Related

- [[../60-Research/surrealdb-deferral-reevaluation-watch-2026-06-19]]
- [[../60-Research/raw-perplexity/raw-fmx-166-surrealdb-deferral-source-checks-2026-06-19]]
- [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
- [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
- [[../10-Architecture/11-Risks]]
