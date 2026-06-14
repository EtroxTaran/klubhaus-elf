---
title: Handoff FMX-137 Roguelite Tuning
status: open
tags: [meta, execution, handoff, fmx-137, roguelite]
created: 2026-06-14
updated: 2026-06-14
type: handoff
binding: false
linear: FMX-137
related:
  - [[../fmx-137-roguelite-tuning-decision-queue-2026-06-14]]
  - [[../../60-Research/roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
  - [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../../50-Game-Design/mode-create-a-club-roguelite]]
---

# Handoff: FMX-137 roguelite tuning (2026-06-14)

## Goals

- Resolve the old Create-a-Club Roguelite §11 open tuning questions.
- Save raw research, synthesis, decisions and the accepted GDDR record.
- Keep the non-numbered mode note draft while pointing it to the binding GDDR.

## Completed

- Claimed FMX-137 and set Linear to `In Progress`.
- Saved three raw Perplexity captures:
  - run-end thresholds and football insolvency precedent;
  - comparable games and football-manager failure surfaces;
  - roguelite meta-progression best practices.
- Saved synthesis
  [[../../60-Research/roguelite-run-end-and-carry-economy-tuning-2026-06-14]].
- Recorded the D1-D6 queue in
  [[../fmx-137-roguelite-tuning-decision-queue-2026-06-14]].
- Authored accepted
  [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]].
- Updated the roguelite mode note, game-design index/map, research index/map
  and current-state front door.
- Validation passed: `node scripts/docs-check.mjs`,
  `node scripts/status-consistency-check.mjs` and `git diff --check`.

## Open Tasks

- Publish PR and move Linear to review when the branch is pushed.

## Decisions Made

- D1 = A: staged run-end ladder and licence-review gate.
- D2 = A: two consecutive unresolved month-end liquidity/licence failures.
- D3 = A: board control loss through GD-0030 `last_chance` after repeated failed
  season-level expectation cycles.
- D4 = A: one starting carry slot, capped logarithmic growth to max three
  functional slots, option/cosmetic/challenge unlocks after cap.
- D5 = A: async achievement kit patterns can be lightly visible when
  mechanically inert and privacy-safe.
- D6 = A: final manager-archetype taxonomy and thresholds stay deferred.

Nico approved the recommended packet by instructing implementation of the
proposed plan on 2026-06-14.

## Blockers

- None known.

## Durable Notes Updated

- `docs/60-Research/raw-perplexity/raw-roguelite-*.md`
- `docs/60-Research/roguelite-run-end-and-carry-economy-tuning-2026-06-14.md`
- `docs/40-Execution/fmx-137-roguelite-tuning-decision-queue-2026-06-14.md`
- `docs/50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning.md`
- `docs/50-Game-Design/mode-create-a-club-roguelite.md`
- affected indexes and front-door notes

## Promotion Needed

- None for the D1-D6 packet: GD-0044 is the accepted decision record.
- Later implementation must still keep monetary bands, licence profiles,
  board weights, carry milestones and final archetype taxonomy behind the
  appropriate calibration/playtest/HITL gates.
