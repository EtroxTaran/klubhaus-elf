---
title: FMX-130 Career Bundestrainer Reconciliation Decision Queue
status: current
tags: [execution, decision-queue, career, national-team, bundestrainer, calibration, accepted, fmx-130]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: false
linear: FMX-130
related:
  - [[../60-Research/career-bundestrainer-reconciliation-2026-06-15]]
  - [[../50-Game-Design/mode-manage-a-club-career]]
  - [[../50-Game-Design/GD-0033-national-team-dual-role]]
  - [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
---

# FMX-130 Career Bundestrainer Reconciliation Decision Queue

## Context

FMX-130 asked for the next docs-vault reconciliation around Career-mode
Bundestrainer dependencies and priority. Live triage found no active FMX-130
branch/PR/worktree, and the issue was moved from Backlog to In Progress on
2026-06-15 before work began.

The conflict was narrow: [[../50-Game-Design/mode-manage-a-club-career]] still
repeated the old D6 unlock sketch and hard threshold seeds, while
[[../50-Game-Design/GD-0033-national-team-dual-role]] and
[[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
already resolved the national-team dual-role as `rep >= 75 AND 5 seasons`, no
trophy shortcut.

## Decisions asked and answered

| ID | Question | Options presented | Nico decision |
|---|---|---|---|
| D1 | Should major trophies bypass the five-season Bundestrainer tenure gate? | A. Keep GD-0033: trophies only feed reputation. B. Soft trophy acceleration. C. Full elite-trophy bypass. | **A** - Keep GD-0033. Unlock remains `rep >= 75 AND 5 seasons`; trophies raise reputation only. |
| D2 | Should board-confidence thresholds become fixed constants? | A. Mark old values as calibration slots. B. Publish provisional constants. C. Hide/dynamic thresholds. | **A** - Keep hard values as calibration debt; no fixed `<20` or `30 / 15` rule. |
| D3 | Should reputation be global-only or regional? | A. Per-region + global aggregate. B. Global-only. C. Regional-only. | **A** - Per-region reputation with one global aggregate for player-facing gates; exact curve deferred. |

## Accepted packet

- Career Bundestrainer unlock: `manager reputation >= 75 AND 5+ in-game
  seasons`.
- Old `OR 3 major club trophies` shortcut: removed from current Career copy;
  retained only as historical D6 input in late-game research.
- National-team offer floor:
  `legacy.nationalTeam.offerWindow.boardConfidenceFloor` calibration debt.
- Club career warning/sack thresholds:
  `dynasty.ownershipBoard` calibration debt.
- Reputation: regional/national model with global aggregate for the visible
  unlock gate.

## Evidence

- Raw Perplexity:
  [[../60-Research/raw-perplexity/raw-career-bundestrainer-reconciliation-2026-06-15]]
- Source checks:
  [[../60-Research/raw-perplexity/raw-career-bundestrainer-source-checks-2026-06-15]]
- Synthesis:
  [[../60-Research/career-bundestrainer-reconciliation-2026-06-15]]

## Follow-up

No further architecture decision is needed for FMX-130. Future work should tune
the exact thresholds through GD-0043's `legacy.nationalTeam` and
`dynasty.ownershipBoard` calibration slots once the playable systems exist.

