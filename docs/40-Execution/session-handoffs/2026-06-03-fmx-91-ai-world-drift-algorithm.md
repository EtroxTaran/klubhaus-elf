---
title: Handoff FMX-91 AI world-drift algorithm
status: wrapped
tags: [meta, execution, handoff, ai-world, world-drift, dynasty, fmx-91]
created: 2026-06-03
updated: 2026-06-03
type: handoff
related:
  - [[../../60-Research/ai-world-drift-algorithm-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03]]
  - [[../../50-Game-Design/GD-0024-ai-world-drift-algorithm]]
  - [[../../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# Handoff: FMX-91 AI world-drift algorithm (2026-06-03)

## Goals

- Turn the world-drift prose in `GD-0010`, [[../../60-Research/ai-manager-behaviour]]
  and [[../../60-Research/late-game-systems]] into a deterministic, replay-safe
  draft specification.
- Capture Nico's decisions on owner, RNG allocation, rising-nations scope and
  caps/cooldowns.
- Route all final numbers to FMX-52 calibration instead of hard-coding values.

## Completed

- Claimed Linear FMX-91 by moving it to `In Progress`.
- Synced `main` and created branch
  `codex/fmx-91-ai-world-drift-algorithm-spec`.
- Ran Perplexity research on real-world football competitive-balance drift and
  long-running game anti-staleness patterns.
- Archived raw research:
  [[../../60-Research/raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03]].
- Added synthesis:
  [[../../60-Research/ai-world-drift-algorithm-2026-06-03]].
- Added draft GDDR:
  [[../../50-Game-Design/GD-0024-ai-world-drift-algorithm]].
- Added proposed ADR:
  [[../../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]].
- Updated the FMX-52 runbook with world-drift parameter/scenario sheets and soak
  health metrics.
- Anchored the new artifacts in Current State, Research Map, raw research index,
  Decision Log, Game Design Hub and Game Design Map.

## Decisions captured

- D1 owner: AI World Simulation as a proposed bounded context.
- D2 RNG: hybrid `WorldAiMgmtRng` / `WorldRng`.
- D3 rising-nations scope: reputation-first, with youth/regen follow-up hook.
- D4 caps: global MVP cap plus reserved per-confederation caps.

## Open Tasks

- Ratify or reject the proposed AI World Simulation bounded context.
- FMX-52 must set final parameter values and evidence gates.
- FMX-89 consumes the events for dynasty ownership / bankruptcy FSMs.
- Future Youth/Data work decides whether `youthDiffusionHint` affects regen
  distribution.

## Durable notes updated

- `docs/60-Research/raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03.md`
- `docs/60-Research/ai-world-drift-algorithm-2026-06-03.md`
- `docs/50-Game-Design/GD-0024-ai-world-drift-algorithm.md`
- `docs/10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract.md`
- `docs/30-Implementation/economy-calibration-and-soak-test-runbook.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Research-Map.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/50-Game-Design/README.md`
- `docs/10-Architecture/bounded-context-map.md`

## Next step

Open the FMX-91 docs PR, move Linear FMX-91 to `In Review`, and let the docs
validation plus Linear/GitHub gates run.
