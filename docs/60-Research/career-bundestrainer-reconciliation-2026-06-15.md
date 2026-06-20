---
title: Career Bundestrainer Reconciliation
status: current
tags: [research, synthesis, career, national-team, bundestrainer, reputation, calibration, fmx-130]
context: [league-orchestration, manager-legacy]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-130
related:
  - [[raw-perplexity/raw-career-bundestrainer-reconciliation-2026-06-15]]
  - [[raw-perplexity/raw-career-bundestrainer-source-checks-2026-06-15]]
  - [[../40-Execution/fmx-130-career-bundestrainer-reconciliation-decision-queue-2026-06-15]]
  - [[../50-Game-Design/mode-manage-a-club-career]]
  - [[../50-Game-Design/GD-0033-national-team-dual-role]]
  - [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# Career Bundestrainer Reconciliation

## Scope

FMX-130 reconciles the older Manage-a-Club Career Bundestrainer section with the
accepted national-team dual-role record. It does not create a new gameplay
feature, ADR, bounded context, or final numeric tuning. It updates the Career
mode note so it no longer repeats the historical D6 shortcut:

- old Career copy: `manager rep >= 75 AND (5 seasons OR 3 trophies)`;
- current GD-0033/ADR-0084 truth: `manager rep >= 75 AND 5 seasons`;
- old hard offer floor / sack seed values: historical research inputs only;
- current tuning home: GD-0043 / gameplay calibration slots.

## Existing FMX truth

[[../50-Game-Design/GD-0033-national-team-dual-role]] is the current
national-team dual-role design of record. Its D3 decision dropped the trophy
shortcut because trophies already raise reputation and the simpler conjunctive
gate is more legible.

[[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
matches that choice in the architecture layer: D3=B, no trophy path, no new
bounded context, and all magnitudes delegated to `legacy.nationalTeam`
calibration.

[[../30-Implementation/gameplay-calibration-and-soak-test-runbook]] keeps
`legacy.nationalTeam` as an explicit T2/T3 calibration slot. Therefore
board-confidence floors, offer cadence and candidate scoring are not hard-coded
by FMX-130.

## Research synthesis

Perplexity and targeted source checks support the same direction:

- **Real-world football**: trophies improve manager standing, but
  national-team jobs also depend on federation timing, trust, availability,
  national/regional credibility and a broader career body of work. That argues
  against a one-trophy bypass.
- **Comparable games**: Football Manager and community material treat
  reputation as achievement/context driven and often opaque. Operation Sports'
  FM26 reputation guide lists trophies, promotions, facilities, finances and
  squad profile as reputation inputs. EA FC 26 Career's official deep dive
  exposes board-expectation harshness, job limiters and challenge parameters,
  supporting a tunable-parameter model.
- **Player clarity**: a visible global unlock gate remains easier to understand
  than many hidden regional gates. Regional reputation should influence offer
  ranking and federation trust, while the global aggregate drives the headline
  unlock.

## Decision packet

| Question | Chosen option | Rationale |
|---|---|---|
| D1 - trophy shortcut | A. Keep GD-0033: trophies feed reputation; no direct bypass. | Preserves late-game pacing, avoids a one-season superclub exploit and keeps Career aligned with GD-0033/ADR-0084. |
| D2 - confidence thresholds | A. Mark hard numbers as calibration debt. | `board confidence < 20` and `30 / 15` are useful seed values, not ratified constants; tuning belongs to `legacy.nationalTeam` and `dynasty.ownershipBoard`. |
| D3 - reputation topology | A. Per-region reputation plus global aggregate. | Global gate stays legible; regional/national reputation can shape job-offer ranking and federation trust. |

Nico approved this packet in planning on 2026-06-15 before the vault update.
The accepted decision record is preserved in
[[../40-Execution/fmx-130-career-bundestrainer-reconciliation-decision-queue-2026-06-15]].

## Product rules carried into Career mode

- Manage-a-Club Career shows the national-team aspiration as a long-term
  post-MVP arc.
- Unlock language: manager reputation >= 75 AND 5+ in-game seasons.
- Trophies, continental success and domestic success raise reputation; they do
  not bypass the five-season tenure gate.
- National-team job offers happen after major tournaments and later through a
  board-confidence floor, but the exact floor is
  `legacy.nationalTeam.offerWindow.boardConfidenceFloor` calibration debt.
- Warning/sack thresholds for club career remain
  `dynasty.ownershipBoard` calibration debt; no hard `30 / 15` constants are
  canonized here.
- Reputation direction is regional plus global aggregate: the global aggregate
  powers player-facing unlocks; regional/national reputation informs offer
  priority.

## Source limits

The external comparable-game sources are useful for design direction, not for
copying formulas. Perplexity surfaced weak community/video citations, so the
binding reconciliation uses FMX's own GD-0033/ADR-0084 records as authority and
treats external material as supporting evidence only.

## Related

- Raw Perplexity capture:
  [[raw-perplexity/raw-career-bundestrainer-reconciliation-2026-06-15]]
- Source checks:
  [[raw-perplexity/raw-career-bundestrainer-source-checks-2026-06-15]]
- Career mode note: [[../50-Game-Design/mode-manage-a-club-career]]
- Current national-team design: [[../50-Game-Design/GD-0033-national-team-dual-role]]
- Architecture seam:
  [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]

