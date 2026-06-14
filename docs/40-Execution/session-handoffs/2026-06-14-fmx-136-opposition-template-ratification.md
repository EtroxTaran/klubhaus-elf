---
title: FMX-136 opposition-template ratification handoff
status: wrapped
tags: [meta, execution, handoff, fmx-136, tactics, opposition, ai-world, match, determinism]
created: 2026-06-14
updated: 2026-06-14
type: handoff
binding: false
related:
  - [[../../60-Research/opposition-template-ai-consumption-ratification-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]]
  - [[../../40-Execution/fmx-136-opposition-template-ratification-decision-queue-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../../10-Architecture/bounded-context-map]]
---

# Handoff: FMX-136 opposition-template ratification (2026-06-14)

## Goals

- Close FMX-136 by reconciling ADR-0080's accepted status with its stale
  `binding: false`, planning-source and fallback wording.
- Preserve the research and decision chain for the AI World source,
  fail-fast lock behavior and replay-safe `TacticSnapshot` payload.
- Keep the change additive to ADR-0055's Tactics ownership and avoid adding a
  new bounded context.

## Completed

- Linear FMX-136 was moved to `In Progress`.
- Research refresh saved:
  [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]].
- Synthesis saved:
  [[../../60-Research/opposition-template-ai-consumption-ratification-2026-06-14]].
- Decision queue saved:
  [[../../40-Execution/fmx-136-opposition-template-ratification-decision-queue-2026-06-14]].
- Nico approved D4-D6:
  - D4 = AI World Simulation canonical planning source.
  - D5 = fail fast with `opposition_template_selection_missing`.
  - D6 = embed the selected-template slice in `TacticSnapshot`.
- ADR-0080 moved to `binding: true` and updated with the approved contract
  deltas.
- ADR-0055 appendix, bounded-context map, Current-State, Decision-Log, research
  map, raw index and handoff index were reconciled.
- Validation passed:
  - `node scripts/docs-check.mjs`
  - `node scripts/status-consistency-check.mjs`
  - `git diff --check`

## Open Tasks

- Commit, push, open PR and move Linear to review with the PR link.

## Decisions Made

- AI World Simulation owns the opposition-planning source context for
  ADR-0080.
- Match lock fails explicitly if Tactics cannot publish a valid selection at
  `lineup_locked`.
- Match replays from the embedded `TacticSnapshot.oppositionTemplate` slice, not
  from live Tactics or AI World state.

## Blockers

- None for documentation. Implementation remains blocked by the project phase
  until the codebase is rebuilt.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]]
- [[../../60-Research/opposition-template-ai-consumption-ratification-2026-06-14]]
- [[../../40-Execution/fmx-136-opposition-template-ratification-decision-queue-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
- [[../../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
- [[../../10-Architecture/bounded-context-map]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]
- [[README]]

## Promotion Needed

- None; Nico's D4-D6 decisions are applied to the accepted ADR-0080 contract.
