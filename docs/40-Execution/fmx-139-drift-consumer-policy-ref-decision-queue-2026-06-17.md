---
title: FMX-139 DriftConsumerPolicyRef Decision Queue
status: accepted
tags: [execution, decision-queue, ddd, event-sourcing, ai-world, world-drift, policy-catalog, fmx-139, accepted]
created: 2026-06-17
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-139
related:
  - [[../60-Research/drift-consumer-policy-ref-contract-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-drift-consumer-policy-ref-ddd-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-drift-consumer-policy-ref-realworld-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-drift-consumer-policy-ref-games-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-drift-consumer-policy-ref-source-checks-2026-06-17]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
---

# FMX-139 DriftConsumerPolicyRef Decision Queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-139.


## Status

Accepted by Nico on 2026-06-19. This queue records recommendations only; the
`DriftConsumerPolicyRef` schema and `WorldDriftPolicyCatalog` owner split do not
become binding after Nico approved it on 2026-06-19.

## D1 - `DriftConsumerPolicyRef` Shape

Options:

- **A. Stable reference only.** World-drift events carry `policyRefId` and
  `policyCatalogVersion`; consumers resolve all detail from a catalog.
- **B. Full resolved payload only.** Events embed all consumer effect detail and
  omit durable policy refs.
- **C. Hybrid reference plus minimal resolved snapshot.** Events carry stable ref,
  catalog version, effect family, target context, label/explanation keys and the
  snapshot fields needed for replay-safe consumer projections.

Recommendation: **C.**

Reason: C satisfies ADR-0071's self-contained-event invariant and keeps replay
deterministic without losing catalog traceability. A is too fragile unless every
consumer can reconstruct the exact historical catalog; B loses useful audit and
UI enrichment handles.

## D2 - Policy Catalog Ownership

Options:

- **A. AI World Simulation owns `WorldDriftPolicyCatalog` identity/version; FMX-52
  / GD-0043 owns final calibration; consumers own application.**
- **B. Regulations & Compliance owns drift policy catalog because the words
  sound rule-like.**
- **C. Each consuming context owns its own drift policy catalog slice.**

Recommendation: **A.**

Reason: ADR-0071 already makes AI World Simulation the producer of world-drift
events, profiles, caps and cooldowns. The catalog is producer-side published
language for those events. Regulations owns eligibility/rule catalogs; it should
not become the world-drift drama-policy owner. Consumer-owned slices would
duplicate policy ids and break shared explanation/versioning.

## D3 - `youthDiffusionHint` Handling

Options:

- **A. Keep `youthDiffusionHint` nullable-only until Youth/Data work exists.**
- **B. Define it as a reserved typed `DriftConsumerPolicyRef` now, with
  `effectFamily: youth-diffusion` and `activationStatus: reserved`.**
- **C. Define active youth/talent diffusion effects now.**

Recommendation: **B.**

Reason: B removes the undefined placeholder without crossing Youth Academy/Data
Generator ownership. A keeps the schema gap; C would prematurely decide youth
generation mechanics.

## D4 - Approval and Promotion Path

Options:

- **A. Accepted: promote the FMX-139 contract after Nico approved D1-D4 on
  2026-06-19.**
- **B. Treat the agent recommendation as accepted because ADR-0071 is already
  accepted.**
- **C. Defer all ADR/GDDR wording until after a separate discussion.**

Recommendation: **A.**

Reason: A gives Nico concrete text to approve and preserves the ask-first gate.
B would self-ratify architecture. C would leave future consumers without a
usable packet to evaluate.

## Consolidated Recommendation

Approve **D1=C, D2=A, D3=B, D4=A**.

Operational interpretation:

- `DriftConsumerPolicyRef` becomes a hybrid ref/snapshot contract.
- AI World Simulation owns `WorldDriftPolicyCatalog` identity and versioning.
- GD-0043/FMX-52 keeps final numeric calibration authority.
- Club Management, CommercialPortfolio, Transfer and future Youth/Data consumers
  apply their own effects from event snapshots and ACL projections.
- `youthDiffusionHint` is a typed reserved ref until a Youth/Data follow-up
  approves active mechanics.

## Nico Decision Log

Pending.
## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=C, D2=A, D3=B, D4=A**.

No open Nico decision remains for FMX-139.
