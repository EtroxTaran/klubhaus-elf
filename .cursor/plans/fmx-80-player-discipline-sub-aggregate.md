---
title: FMX-80 Player Discipline Sub-Aggregate
status: open
linear: FMX-80
created: 2026-06-05
updated: 2026-06-05
---

# FMX-80 Player Discipline Sub-Aggregate

## Goal

Close audit gap G18 by assigning ownership for card accumulation, suspension
windows, straight-red appeals and the canonical `PlayerSuspended` contract,
without adding runtime implementation or a new bounded context.

## Decisions

Nico selected the planning defaults live on 2026-06-05:

| # | Question | Selected default |
|---|---|---|
| D1 | Accumulation and suspension state owner | Squad & Player process manager/sub-aggregate; Match emits card facts, Regulations owns profiles. |
| D2 | MVP appeal scope | Straight-red appeal only. |
| D3 | Suspension scope | Profile-driven `competition` / `domestic` / `all` scopes. |
| D4 | Appeal flow timing | Resolve before the next relevant fixture. |

## Work items

- [x] Claim FMX-80 by moving Linear to `In Progress`.
- [x] Sync `main` and create `codex/fmx-80-player-discipline-sub-aggregate`.
- [x] Run Perplexity/source research for real discipline rules, game precedent
  and FMX DDD ownership options.
- [x] Add raw research capture and synthesis note.
- [x] Add proposed ADR-0077.
- [x] Add `player-discipline` state-machine note.
- [x] Update Narrative/GD references and vault maps.
- [x] Run docs validation and diff checks.
- [x] Commit, push and open draft PR #138.
- [ ] Move Linear to `In Review`.
