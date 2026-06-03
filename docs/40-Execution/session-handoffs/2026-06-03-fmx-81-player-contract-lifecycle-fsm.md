---
title: Handoff FMX-81 Player contract lifecycle FSM
status: wrapped
tags: [meta, execution, handoff, transfer, contracts, squad, regulations, fmx-81]
created: 2026-06-03
updated: 2026-06-03
type: handoff
binding: false
related:
  - [[../../60-Research/player-contract-lifecycle-fsm-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-player-contract-lifecycle-fsm-2026-06-03]]
  - [[../../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
  - [[../../10-Architecture/state-machines/player-contract-lifecycle]]
  - [[../../50-Game-Design/GD-0006-transfers]]
  - [[../../50-Game-Design/transfer-market-and-contracts]]
---

# Handoff: FMX-81 Player contract lifecycle FSM (2026-06-03)

## Linear

- Issue: FMX-81
- Status: In Progress -> ready for In Review after PR creation.

## Done this session

- Synced `/root/research-gp` from `origin/main`, switched through `main`, and
  created branch `codex/fmx-81-player-contract-lifecycle-fsm`.
- Verified no open GitHub PR for FMX-81 and claimed Linear FMX-81 by moving it to
  `In Progress`.
- Ran Perplexity research on real-world contract/Bosman/free-agent rules, game
  genre patterns and DDD ownership options.
- Cross-checked promoted claims against official FIFA/FA sources and current
  Football Manager public material.
- Recorded raw research:
  [[../../60-Research/raw-perplexity/raw-player-contract-lifecycle-fsm-2026-06-03]].
- Added synthesis:
  [[../../60-Research/player-contract-lifecycle-fsm-2026-06-03]].
- Added proposed architecture decision:
  [[../../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]].
- Added concrete state-machine note:
  [[../../10-Architecture/state-machines/player-contract-lifecycle]].
- Updated transfer/game-design/index notes so the vault has one navigable path
  from research -> gameplay -> architecture -> state machine.

## Open / next step

- Run `node scripts/docs-check.mjs`.
- Commit, push and open a PR titled `[FMX-81] Define player contract lifecycle FSM`
  with body first line `Closes FMX-81`.
- Move Linear FMX-81 to `In Review` after the PR exists.

## Blockers

- No current blocker. Exact top-5 profile constants and FA GBE 2026/27 updates
  remain data-profile ratification work before implementation.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-player-contract-lifecycle-fsm-2026-06-03.md`
- `docs/60-Research/player-contract-lifecycle-fsm-2026-06-03.md`
- `docs/10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm.md`
- `docs/10-Architecture/state-machines/player-contract-lifecycle.md`
- `docs/10-Architecture/state-machines/README.md`
- `docs/10-Architecture/state-machines/transfer.md`
- `docs/50-Game-Design/GD-0006-transfers.md`
- `docs/50-Game-Design/transfer-market-and-contracts.md`
- `docs/50-Game-Design/regulations-and-compliance.md`
- `docs/50-Game-Design/README.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Architecture-Map.md`
- `docs/00-Index/Research-Map.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/60-Research/00-summary.md`
- `docs/60-Research/raw-perplexity/README.md`

## Needs promotion

- ADR-0073 remains `proposed` until Nico ratifies.
- Exact profile values for pre-contract windows, free-agent registration
  exceptions and work-permit scoring remain Regulations data follow-up.
