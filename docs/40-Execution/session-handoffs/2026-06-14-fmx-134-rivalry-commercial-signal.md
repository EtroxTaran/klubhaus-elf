---
title: FMX-134 Rivalry commercial signal handoff
status: current
tags: [handoff, execution, rivalry, commercial, contract, fmx-134]
created: 2026-06-14
updated: 2026-06-14
type: handoff
binding: false
linear: FMX-134
related:
  - [[../../60-Research/rivalry-commercial-signal-contract-2026-06-14]]
  - [[../../40-Execution/fmx-134-rivalry-commercial-signal-decision-queue-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]]
---

# FMX-134 Rivalry commercial signal handoff

## Goals

- Reconcile the orphan `RivalryCommercialSignal` contract between ADR-0057,
  ADR-0058 and the bounded-context map.
- Preserve raw DDD, football-domain and comparable-game research.
- Present Nico with explicit decisions before changing accepted architecture
  contracts.

## Completed

- FMX-134 moved to `In Progress`.
- Branch/worktree created: `codex/fmx-134-rivalry-commercial-signal`.
- Raw captures saved:
  - [[../../60-Research/raw-perplexity/raw-rivalry-commercial-signal-ddd-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-rivalry-commercial-signal-realworld-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-rivalry-commercial-signal-games-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-rivalry-commercial-signal-source-checks-2026-06-14]]
- Synthesis saved:
  [[../../60-Research/rivalry-commercial-signal-contract-2026-06-14]].
- Draft ADR-0111 prepared as a non-binding proposed amendment record.
- HITL queue prepared:
  [[../../40-Execution/fmx-134-rivalry-commercial-signal-decision-queue-2026-06-14]].

## Open Tasks

- Nico approval needed for D1-D3.
- If approved as recommended, amend accepted ADR-0057/ADR-0058 and
  `bounded-context-map.md` to remove `RivalryCommercialSignal` and document the
  CommercialPortfolio ACL/local projection.
- Rerun docs validation after any accepted-contract cleanup.

## Decisions Made

- No binding architecture decision made by the agent.
- Recommendation prepared: D1=B, D2=A, D3=A.

## Blockers

- The accepted-contract cleanup is blocked on Nico decision because it changes a
  cross-context public contract.

## Durable Notes Updated

- [[../../60-Research/rivalry-commercial-signal-contract-2026-06-14]]
- [[../../40-Execution/fmx-134-rivalry-commercial-signal-decision-queue-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Architecture-Map]]
- [[../../60-Research/00-summary]]
- [[README]]

## Promotion Needed

- Promote ADR-0111 from `draft` to `accepted` only after Nico approves D1-D3 and
  the accepted ADR/map cleanup has been applied.

