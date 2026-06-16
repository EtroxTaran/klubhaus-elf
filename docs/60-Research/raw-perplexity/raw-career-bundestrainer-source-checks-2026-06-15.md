---
title: Raw Source Checks - Career Bundestrainer Reconciliation
status: raw
tags: [research, raw, source-check, career, national-team, bundestrainer, reputation, calibration, fmx-130]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-130
related:
  - [[../career-bundestrainer-reconciliation-2026-06-15]]
  - [[raw-career-bundestrainer-reconciliation-2026-06-15]]
  - [[../../50-Game-Design/GD-0033-national-team-dual-role]]
  - [[../../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
  - [[../../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# Raw Source Checks - Career Bundestrainer Reconciliation

## Checked sources

| Source | Type | Useful evidence | Limits |
|---|---|---|---|
| [[../../50-Game-Design/GD-0033-national-team-dual-role]] | FMX canonical GDDR | Current FMX rule: unlock = reputation >= 75 AND 5 seasons; the old trophy shortcut is dropped; offer windows and candidate scoring belong to `legacy.nationalTeam` calibration. | `binding: false`, but it is the accepted GDDR layer for the national-team dual-role. |
| [[../../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]] | FMX accepted ADR | Confirms D3=B: reputation >= 75 AND 5 seasons, no trophy path; international-window and dual-role architecture are reserved without adding a new bounded context. | Architecture scope only; gameplay tuning still lives in GD-0033/GD-0043. |
| [[../../30-Implementation/gameplay-calibration-and-soak-test-runbook]] | FMX calibration method | `legacy.nationalTeam` is an explicit slot with T2/T3 unlock/offer/career sweeps; no final constants are locked before calibration approval. | Draft/non-binding runbook, but it is the current method note for calibration debt. |
| EA SPORTS FC 26 Career Mode Deep Dive, 2025-08-01, https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-career-mode-deep-dive | Official comparable-game source | Manager Career exposes configurable challenge parameters, objectives, job limiters and board-expectation harshness; supports treating thresholds as tunable scenario/career parameters rather than immutable constants. | EA does not disclose a national-team unlock formula and FC Career is not Football Manager-depth simulation. |
| Operation Sports, "Football Manager 26: How to Increase Club Reputation", https://www.operationsports.com/football-manager-26-how-to-increase-club-reputation/ | Secondary comparable-game source | Describes trophies, promotions, player profile, infrastructure and finances as reputation inputs; supports "trophies feed reputation" rather than "trophies bypass all other eligibility gates." | Secondary article, focused on club reputation, not a verified manager-national-team formula. |
| FMMVibe, "How Does Managerial Reputation Work?", https://fmmvibe.com/forums/topic/39399-how-does-managerial-reputation-work/ | Community comparable-game source | Community examples point to reputation as contextual, opaque and affected by achievements/objectives; one post explicitly describes reputation as "regional, at best." | Community anecdote from FMM 2017, weak authority; use only as design smell/evidence of player-perception issues. |
| [[raw-national-team-dual-role-realworld-2026-06-06]] · [[raw-national-team-dual-role-games-2026-06-06]] · [[raw-national-team-dual-role-mvp-gating-2026-06-06]] | Existing FMX raw research | Prior FMX research already grounded the national-team dual-role as a reputation-gated, federation-window, post-MVP aspiration with real-world and game precedent. | Older capture; FMX-130 only reconciles the stale Career-mode copy against the accepted GDDR/ADR. |

## Source-check conclusions

1. **Trophy shortcut**: no checked source justifies overriding the accepted
   FMX gate. External sources support trophies as reputation/status inputs, not
   as a separate eligibility bypass. Keep `reputation >= 75 AND 5 seasons`.
2. **Confidence thresholds**: both FMX calibration notes and comparable-game
   parameterization support calibration slots. The old hard numbers `<20` and
   `30 / 15` should remain historical seed values only.
3. **Reputation topology**: existing FMX GD-0033 already references a
   region-based model with a global aggregate. The community/player-perception
   evidence warns that opaque regional reputation can feel confusing, so the
   player-facing gate should stay a clear global aggregate while regional
   reputation affects offer ranking.

