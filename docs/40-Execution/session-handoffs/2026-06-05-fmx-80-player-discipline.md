---
title: Handoff FMX-80 Player Discipline
status: open
tags: [execution, handoff, fmx-80, discipline, suspension, appeals]
created: 2026-06-05
updated: 2026-06-05
type: handoff
binding: false
related:
  - [[../../60-Research/player-discipline-sub-aggregate-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
  - [[../../10-Architecture/state-machines/player-discipline]]
---

# Handoff: FMX-80 Player Discipline (2026-06-05)

## Linear

- Issue: FMX-80
- PR: https://github.com/EtroxTaran/football-manager-x/pull/138

## Goals

- Close audit gap G18 by assigning player-discipline ownership and defining the
  canonical suspension contract needed by FMX-83.
- Preserve real-world/source research, Nico decisions and proposed architecture
  in the vault.

## Completed

- Claimed FMX-80 by moving Linear to `In Progress`.
- Synced `main` and created branch
  `codex/fmx-80-player-discipline-sub-aggregate`.
- Captured Perplexity/source research for current football discipline rules,
  management-game precedent and FMX-specific DDD ownership options.
- Captured Nico's D1-D4 choices.
- Added raw research, synthesis, proposed ADR-0078 and
  [[../../10-Architecture/state-machines/player-discipline]].
- Updated ADR-0076 / ADR-0054 / GD-0018 / feature references so
  `PlayerSuspended` now points at ADR-0078 instead of a future undefined issue.
- Updated Decision Log, Current State, Architecture Map, Research Map and raw
  research index.
- Merged `origin/main` after FMX-66 landed ADR-0077, preserving FMX-66 and
  renumbering FMX-80 to ADR-0078.
- Validation passed: `node scripts/docs-check.mjs` and `git diff --check`.
- Commit pushed and draft PR #138 opened.
- Linear moved to `In Review` and handoff comment added.

## Open Tasks

- Nico ratifies or amends ADR-0078 before implementation work.

## Decisions Made

| # | Decision | Selected |
|---|---|---|
| D1 | Accumulation and suspension state owner | Squad & Player process manager/sub-aggregate; no new bounded context for MVP. |
| D2 | MVP appeal scope | Straight-red appeals only. |
| D3 | Suspension scope | Regulations profile drives `competition`, `domestic` or `all`. |
| D4 | Appeal timing | Resolve before the next relevant fixture. |

## Blockers

- No docs-beat blocker.
- Implementation remains blocked until ADR-0078 is ratified and Regulations
  discipline profiles/calibration values are authored.

## Durable Notes Updated

- `docs/60-Research/raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05.md`
- `docs/60-Research/player-discipline-sub-aggregate-2026-06-05.md`
- `docs/10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts.md`
- `docs/10-Architecture/state-machines/player-discipline.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Architecture-Map.md`
- `docs/00-Index/Research-Map.md`
- `docs/60-Research/00-summary.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/10-Architecture/state-machines/README.md`
- `docs/10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts.md`
- `docs/10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework.md`
- `docs/50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue.md`
- `docs/20-Features/feature-ai-narration-mvp-pillar.md`

## Promotion Needed

- ADR-0078 can move from `proposed` to `accepted` only after Nico ratifies the
  ownership split, appeal scope, scope policy and timing policy.
- Numeric thresholds, ban lengths, appeal odds, warning timings and
  good-behaviour incentives belong to FMX-52 / Regulations profile calibration.
