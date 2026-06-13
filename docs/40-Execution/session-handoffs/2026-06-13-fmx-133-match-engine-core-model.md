---
title: FMX-133 Match-engine core model handoff
status: current
tags: [handoff, execution, match-engine, calibration, fmx-133]
created: 2026-06-13
updated: 2026-06-13
type: handoff
binding: false
linear: FMX-133
related:
  - [[../../60-Research/match-engine-core-model-2026-06-13]]
  - [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../fmx-133-match-engine-core-model-decision-queue-2026-06-13]]
---

# FMX-133 Match-engine core model handoff

## Goals

- Prepare the FMX-133 match-engine core model decision packet.
- Save Perplexity research, source checks, synthesis and all pending decisions.
- Update the draft match-engine note and GDDR/index surfaces without self-ratifying.

## Completed

- Linear FMX-133 moved to `In Progress`.
- Branch: `codex/fmx-133-match-engine-core-model`.
- Research saved:
  - [[../../60-Research/raw-perplexity/raw-match-engine-real-world-envelopes-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-match-engine-action-utility-models-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-match-engine-game-precedents-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-match-engine-calibration-harness-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-match-engine-source-checks-2026-06-13]]
- Synthesis saved at [[../../60-Research/match-engine-core-model-2026-06-13]].
- HITL decision queue prepared:
  [[../fmx-133-match-engine-core-model-decision-queue-2026-06-13]].
- Draft GDDR prepared:
  [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]].
- Draft detailed system note [[../../50-Game-Design/match-engine]] updated with
  proposed choose_action, xG/EPV, profile density and calibration details.

## Open Tasks

- Nico must decide D1-D6 before GD-0042 can become binding.
- If Nico approves, promote GD-0042 to `accepted` / `binding: true` and update
  GD-0002's open gates from pending proposal to closed/superseded.
- Future implementation must build the calibration harness and record evidence.

## Decisions Made

None binding. Recommended packet is D1=A, D2=A, D3=A, D4=A, D5=A, D6=A.

## Blockers

- Nico approval is required for every gameplay/model decision in FMX-133.

## Durable Notes Updated

- Current-State, Game Design Hub, Game Design Map, Research Summary, Research Map,
  raw Perplexity index, GD-0002, match-engine and this handoff index should
  reference the packet.

## Promotion Needed

If Nico approves the packet, promote GD-0042 and update GD-0002, Current-State,
Game Design Hub/Map and research references in the same PR.

