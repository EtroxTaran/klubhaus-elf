---
title: FMX-136 Opposition-template ratification decision queue
status: current
tags: [execution, decision-queue, tactics, opposition, ai-world, match, determinism, approved, fmx-136]
created: 2026-06-14
updated: 2026-06-14
type: decision-queue
binding: false
linear: FMX-136
related:
  - [[../60-Research/opposition-template-ai-consumption-ratification-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
---

# FMX-136 Opposition-template ratification decision queue

This is the HITL decision queue for FMX-136. It records the three
ratification-cleanup decisions Nico approved on 2026-06-14 after the research
refresh in
[[../60-Research/opposition-template-ai-consumption-ratification-2026-06-14]].

## D4 - planning source after AI World ratification

| Option | Meaning | Assessment |
|---|---|---|
| **A. AI World Simulation canonical source** | `planningContext.sourceContext` is `ai-world-simulation`; League, Club and Transfer provide input facts/projections. | **Approved.** Matches ADR-0071 and removes the stale owner fork. |
| B. Keep four-source union | Allow League / Club / Transfer / AI World as source owners. | Ambiguous after ADR-0071. |
| C. Legacy lane until implementation | Keep older wording until code exists. | Contradicts the accepted context map. |

**Decision:** A.

## D5 - missing selection at `lineup_locked`

| Option | Meaning | Assessment |
|---|---|---|
| **A. Fail fast** | Match lock fails with `opposition_template_selection_missing`. | **Approved.** Strongest replay and audit behavior. |
| B. Explicit default event | Tactics emits a versioned fallback-template event. | Valid future option, but needs a separate product/contract decision. |
| C. Mode split | Competitive matches fail; background matches fallback. | Premature complexity and divergent semantics. |

**Decision:** A.

## D6 - replay-safe payload

| Option | Meaning | Assessment |
|---|---|---|
| **A. Snapshot in `TacticSnapshot`** | Event carries identity/provenance/hash; `BuildTacticSnapshotForMatch` embeds the selected-template slice. | **Approved.** Gives Match replay independence without duplicating full catalog state. |
| B. Full body on event only | Event stores full template; Match snapshot keeps event ref. | Heavier and forces replay to dereference event storage. |
| C. ID + version only | Recompute from Tactics catalog by id/version. | Too weak after catalog/model edits. |

**Decision:** A.

## Decision record

- 2026-06-14: FMX-136 claimed and moved to `In Progress`.
- 2026-06-14: Research refresh saved for real-world opposition analysis, game
  precedent and deterministic replay/snapshot contracts.
- 2026-06-14: Nico approved **D4=A, D5=A, D6=A**.
- 2026-06-14: ADR-0080 and ADR-0055 updated to make the contract binding and
  reconcile AI World source ownership, fail-fast semantics and snapshot payload.

## Approved packet

Apply **D4=A, D5=A, D6=A** to ADR-0080 and its ADR-0055 appendix.
