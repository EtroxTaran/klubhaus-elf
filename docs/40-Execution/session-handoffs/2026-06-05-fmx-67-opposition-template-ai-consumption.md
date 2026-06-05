---
title: Handoff FMX-67 opposition-template AI consumption
status: wrapped
tags: [meta, execution, handoff, fmx-67, tactics, match, ai, determinism]
created: 2026-06-05
updated: 2026-06-05
type: handoff
binding: false
related:
  - [[../../60-Research/opposition-template-ai-consumption-contract-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
---

# Handoff: FMX-67 opposition-template AI consumption (2026-06-05)

## Goals

- Claim FMX-67 and close gap G11 with a sourced, decision-ready contract.
- Preserve raw research, synthesis and a proposed ADR.
- Keep the solution additive and compatible with ADR-0055, ADR-0026 and
  ADR-0067.

## Completed

- Linear FMX-67 moved to `In Progress`.
- Raw Perplexity/Web capture saved:
  [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]].
- Synthesis added:
  [[../../60-Research/opposition-template-ai-consumption-contract-2026-06-05]].
- Proposed ADR added:
  [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]].
- ADR-0055 amended additively with an FMX-67 appendix.
- Front-door maps, `Current-State`, `Decision-Log`, research summary and raw
  research index updated.

## Open Tasks

- Nico ratifies or revises ADR-0080.
- Future implementation must add contract fixtures/tests once code returns.
- Template scoring weights, manager-style coefficients and scouting-confidence
  effects remain calibration/design debt.

## Decisions Made

- D1: split event model.
- D2: final immutability at `lineup_locked`.
- D3: dedicated `WorldAiMgmtRng` sub-label.

## Blockers

- None for documentation. Implementation remains blocked by the project phase
  until architecture/design ratification.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]]
- [[../../60-Research/opposition-template-ai-consumption-contract-2026-06-05]]
- [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
- [[../../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Architecture-Map]]
- [[../../60-Research/00-summary]]

## Promotion Needed

- Promote ADR-0080 from `proposed` to `accepted` only after Nico ratifies it.

