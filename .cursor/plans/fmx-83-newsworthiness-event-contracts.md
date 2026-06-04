---
title: FMX-83 Newsworthiness Event Contracts
status: wrapped
linear: FMX-83
created: 2026-06-04
updated: 2026-06-04
---

# FMX-83 Newsworthiness Event Contracts

## Goal

Close gap G14 by defining how source domains publish self-contained
newsworthy football facts to Narrative without Narrative joining back into
authoritative domain state.

## Priority and dependency check

- Live Linear triage found no Todo or In Progress claimable work.
- High-priority Backlog children without branch/PR/worktree collision included
  FMX-83, FMX-85, FMX-86, FMX-87 and FMX-89.
- FMX-83 was selected because it is high priority, unclaimed, and upstream of
  dialogue-intent and media-outlet behavior work.
- FMX-86 was no longer truly blocked because FMX-73 and FMX-76 are Done.
- FMX-89 was no longer truly blocked because FMX-91 is Done.
- FMX-83 explicitly avoids the `PlayerSuspended` ownership conflict by
  consuming the future Discipline-owned schema from FMX-80 instead of defining
  it here.

## Decisions and recommendations

These are proposed defaults authored after Nico said "go on"; they are not
ratified architecture decisions.

| # | Question | Recommended default |
|---|---|---|
| D1 | Generic narrative fact event or distinct publisher events? | Distinct source-owned event contracts plus a shared Narrative projection/checklist. |
| D2 | Who creates transfer rumours? | Transfer emits the rumour publication fact; Narrative renders it and may not invent market truth. |
| D3 | How to handle suspensions? | FMX-83 records projection requirements only; FMX-80/Discipline is the sole schema owner. |
| D4 | How much detail may payloads carry? | Self-contained display snapshots, bands and source metadata; no raw internals or consumer joins. |

## Work items

- [x] Claim FMX-83 by moving Linear to `In Progress`.
- [x] Sync `main` and create `codex/fmx-83-newsworthiness-event-contracts`.
- [x] Run Perplexity research for real football media/newsworthiness,
  comparable game/narrative systems and DDD event-contract patterns.
- [x] Cross-check promoted claims against official/current sources and Zod 4
  documentation.
- [x] Add raw research capture.
- [x] Add synthesis note.
- [x] Add proposed ADR-0075.
- [x] Update Narrative ADR/feature/GDDR/testing notes and vault maps.
- [ ] Run docs validation and diff checks.
- [ ] Commit, push, open PR and move Linear to `In Review`.

