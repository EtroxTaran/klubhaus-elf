---
title: FMX-134 Rivalry commercial signal decision queue
status: accepted
tags: [execution, decision-queue, rivalry, commercial, ddd, contract, pending, fmx-134, accepted]
created: 2026-06-14
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-134
related:
  - [[../60-Research/rivalry-commercial-signal-contract-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/bounded-context-map]]
---

# FMX-134 Rivalry commercial signal decision queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-134.


This is the HITL decision queue for FMX-134. It turns the research synthesis
[[../60-Research/rivalry-commercial-signal-contract-2026-06-14]] into explicit
Nico decisions for accepted
[[../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation|ADR-0111]]
.

## D1 - Rivalry commercial contract shape

| Option | Meaning | Assessment |
|---|---|---|
| A. Add `RivalryCommercialSignal` to Rivalry | ADR-0057 publishes a dedicated commercial-facing event/read model for CommercialPortfolio and any later consumers. | Higher reuse only if "rivalry commercial grade" is a stable shared concept. Otherwise it couples Rivalry to commercial policy. |
| **B. CommercialPortfolio derives locally from Rivalry facts** | Rivalry publishes `RivalryTierTransitioned`, `DerbyContext(matchId)`, score/tier queries and evidence; CommercialPortfolio maps them through a local ACL/projection. | **Recommended.** Cleanest DDD boundary, matches existing ADR-0057 contract and keeps pricing/sponsor policy in CommercialPortfolio. |
| C. Defer and mark orphan unresolved | Leave the contradiction documented but do not choose a cleanup line. | Avoids contract churn, but keeps implementation blocked and leaves `grep` contradictions in accepted docs. |

**Recommendation:** B.

## D2 - `derby_factor` and fan-demand owner

| Option | Meaning | Assessment |
|---|---|---|
| **A. Audience & Atmosphere owns fan-side `derby_factor`; CommercialPortfolio owns money conversion** | Rivalry supplies rivalry facts; Audience & Atmosphere turns them into fan demand/atmosphere/trust effects; CommercialPortfolio consumes fan facts plus Rivalry facts for money policy. | **Recommended.** Preserves fan-sentiment ownership and avoids duplicated commercial/fan authority. |
| B. CommercialPortfolio owns all `derby_factor` interpretation | CommercialPortfolio directly owns the full rivalry-to-demand-to-money conversion. | Simpler commercial implementation, but it pulls fan-atmosphere/trust semantics into a money context. |
| C. Rivalry owns `derby_factor` | Rivalry publishes a scalar used by fan and commercial contexts. | Reject. It creates the same consumer-policy leak as `RivalryCommercialSignal`. |

**Recommendation:** A.

## D3 - cleanup application after approval

| Option | Meaning | Assessment |
|---|---|---|
| **A. Apply the cleanup immediately after D1/D2 approval** | Amend ADR-0057/ADR-0058 and `bounded-context-map.md`: remove `RivalryCommercialSignal`, document the ACL/local projection and keep a clear single owner for `derby_factor`. | **Recommended.** Resolves FMX-134 acceptance criteria and leaves implementation unambiguous. |
| B. Keep ADR-0111 as the only record until a larger economy sweep | Do not touch accepted ADRs/map yet. | Lower churn now, but keeps accepted docs contradictory and risks code-phase confusion. |
| C. Create a new follow-up issue for cleanup | Accept the recommendation but defer the actual accepted-doc edits. | Only useful if Nico wants a broader commercial/economy contract sweep. |

**Recommendation:** A.

## Decision record

- 2026-06-14: FMX-134 claimed and moved to `In Progress`.
- 2026-06-14: Perplexity research plus targeted source checks saved.
- 2026-06-14: synthesis created in
  [[../60-Research/rivalry-commercial-signal-contract-2026-06-14]].
- 2026-06-14: draft ADR-0111 prepared as a non-binding proposal record.
- Accepted by Nico 2026-06-19: D1-D3 above.

## Recommended approval packet

Approve **D1=B, D2=A, D3=A**.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=B, D2=A, D3=A**.

No open Nico decision remains for FMX-134.

## Related

- [[../60-Research/rivalry-commercial-signal-contract-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]]
- [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
- [[../10-Architecture/bounded-context-map]]
