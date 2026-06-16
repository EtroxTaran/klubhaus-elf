---
title: Handoff - FMX-140 Live Match Pause Ratification
status: wrapped
tags: [meta, execution, handoff, match, watch-party, pause-vote, fmx-140]
created: 2026-06-16
updated: 2026-06-16
type: handoff
binding: false
related:
  - [[../../60-Research/live-match-pause-ratification-2026-06-16]]
  - [[../../40-Execution/fmx-140-live-match-pause-ratification-decision-queue-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[../../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
---

# Handoff: FMX-140 Live Match Pause Ratification (2026-06-16)

## Goals

- Reconcile FMX-140's stale ratification issue text with the already accepted
  ADR-0087/GD-0035 state.
- Preserve Perplexity-first research, source checks and Nico's decisions.
- Promote tactics pause, local pause-trust tier and additive Head Coach/host
  privileges into the accepted pause/intervention packet.

## Completed

- Linear FMX-140 moved from Backlog to In Progress before vault work.
- `main` fast-forwarded and worktree
  `/tmp/fmx-140-in-match-pause-vote-ratification` created on
  `codex/fmx-140-in-match-pause-vote-ratification`.
- Perplexity discovery and source checks saved under
  `docs/60-Research/raw-perplexity/`.
- Research synthesis and accepted decision queue saved.
- ADR-0087, GD-0035, Match state machine, Watch Party state machine and front
  doors updated.

## Open Tasks

- Commit, push and open the FMX-140 PR.
- Move Linear to review and link the PR/vault paths.

## Decisions Made

- Design 1 pause semantics: active-manager deliberate pause suspends sim
  progression at deterministic safe points; spectator pause/replay remains
  presentation-only.
- MVP tactics pause: one longer tactics pause per managed side per half.
- Full MVP role/reputation privileges: local trust tier plus additive Head
  Coach/host privileges.
- Local trust tier only; no global pause/social score.
- Head Coach/host gets +1 ordinary deliberate pause per half and one veto
  override; trusted tier gets +1 ordinary deliberate pause per half.
- Extra privileges are audit-gated and revocable through versioned policy.

## Blockers

- None. `docs-check`, `status-consistency-check` and `git diff --check` passed.
  Numeric values remain calibration debt, not a blocker for FMX-140.

## Durable Notes Updated

- [[../../60-Research/live-match-pause-ratification-2026-06-16]]
- [[../../40-Execution/fmx-140-live-match-pause-ratification-decision-queue-2026-06-16]]
- [[../../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
- [[../../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
- [[../../10-Architecture/state-machines/match]]
- [[../../10-Architecture/state-machines/watch-party]]
- [[../../00-Index/Current-State]]

## Promotion Needed

- None beyond this PR. Future numeric tuning belongs to GD-0043 / FMX-52.
