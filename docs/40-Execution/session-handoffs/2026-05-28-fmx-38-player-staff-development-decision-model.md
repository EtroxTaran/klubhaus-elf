---
title: Handoff - FMX-38 Player Staff Development Decision Model
status: wrapped
tags: [meta, execution, handoff, fmx-38]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/player-staff-development-decision-model-2026-05-28]]
  - [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../../20-Features/feature-eos-player-skills-and-people-context]]
  - [[../../20-Features/feature-player-lifecycle]]
  - [[../../20-Features/feature-training-medicine]]
  - [[../../20-Features/feature-transfer-market-ai-and-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
---

# Handoff: FMX-38 Player Staff Development Decision Model (2026-05-28)

## Goals

- Analyse how player stats, staff quality, skills, personas and relationships
  influence gameplay, development, transfers and squad decisions.
- Find documentation gaps around owner/consumer boundaries.
- Anchor the result in vault docs without approving final formulas or staff
  skill MVP scope.

## Completed

- Created Linear issue FMX-38 and branch
  `codex/fmx-38-player-staff-decision-model`.
- Added research synthesis
  [[../../60-Research/player-staff-development-decision-model-2026-05-28]].
- Added draft GDDR
  [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  as the proposed factor-matrix layer.
- Updated Game Design, Research, Feature and Current State maps so future
  agents find GD-0021 from the front doors.
- Linked GD-0021 into the EOS People/Skills, player lifecycle, training
  medicine and transfer-market feature specs.
- Linked GD-0021 into adjacent game-design notes for squad structure,
  youth/development, training/medicine and transfer contracts.
- Amended ADR-0052 and ADR-0053 planning language to reference the new
  People/Staff decision bridge and staff-skill option gate.

## Open Tasks

- Nico decides whether GD-0021 should become the canonical approved
  decision-influence layer.
- Nico chooses the staff-skill MVP option:
  A target-only, B narrow pipeline modifiers, or C full staff skill-card
  gameplay. The documented recommendation is B.
- ADR-0052 still needs ratification before People-owned relationship or skill
  profile read models become implementation authority.
- Final player skill catalog, tier names, trigger envelopes, caps and UI copy
  remain separate open decisions.
- `DevelopmentDecisionContext` and `TransferDecisionContext` field lists are
  planning names only; they need contract work after ratification.

## Decisions Made

- No binding gameplay or architecture decision was made in this beat.
- Staff-skill MVP activation was documented as an option gate, not silently
  promoted to active scope.
- Generated prose remains non-authoritative for transfers, relationships,
  promises, injuries, development deltas and match effects.

## Blockers

- Do not implement staff-skill mechanics, People read-model effects or GD-0021
  factor consumption until Nico approves the relevant GDDR/ADR path.

## Durable Notes Updated

- `docs/60-Research/player-staff-development-decision-model-2026-05-28.md`
- `docs/50-Game-Design/GD-0021-player-staff-development-and-decision-influence.md`
- `docs/50-Game-Design/GD-0020-eos-player-skills-personas-and-people.md`
- `docs/50-Game-Design/squad-and-club-structure.md`
- `docs/50-Game-Design/youth-academy-and-development.md`
- `docs/50-Game-Design/training-load-and-medicine.md`
- `docs/50-Game-Design/transfer-market-and-contracts.md`
- `docs/20-Features/feature-eos-player-skills-and-people-context.md`
- `docs/20-Features/feature-player-lifecycle.md`
- `docs/20-Features/feature-training-medicine.md`
- `docs/20-Features/feature-transfer-market-ai-and-contracts.md`
- Index/map/current-state notes for research, game design and features.

## Promotion Needed

- GD-0021 can move from `draft` to approved only after Nico approves the
  factor-matrix layer and the staff-skill MVP decision.
- Any accepted Staff-skill MVP option needs follow-up ADR/GDDR/feature contract
  updates before implementation.
