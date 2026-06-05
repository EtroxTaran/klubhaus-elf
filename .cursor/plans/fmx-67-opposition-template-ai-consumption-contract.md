---
title: FMX-67 opposition-template AI consumption contract plan
status: done
tags: [plan, fmx-67, tactics, match, ai, determinism]
created: 2026-06-05
updated: 2026-06-05
type: plan
binding: false
related:
  - [[../../docs/60-Research/opposition-template-ai-consumption-contract-2026-06-05]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
---

# FMX-67 opposition-template AI consumption contract plan

## Goal

Close FMX-67 / gap G11 by deciding and documenting how AI opponent match-prep
selects an opposition template, how that result is recorded, and when Match
freezes it into the replay-safe `TacticSnapshot`.

## Done when

- Linear FMX-67 is claimed as `In Progress`.
- Raw research is preserved under `docs/60-Research/raw-perplexity/`.
- Synthesis note and proposed ADR are added.
- ADR-0055 has an additive FMX-67 appendix.
- Front-door maps, `Current-State`, `Decision-Log` and session handoff link the
  new artifacts.
- `node scripts/docs-check.mjs` and `git diff --check` pass.

## Decision line

Nico selected the recommended line live on 2026-06-05:

- Split event model.
- Final immutability at `lineup_locked`.
- Dedicated `WorldAiMgmtRng` sub-label.

