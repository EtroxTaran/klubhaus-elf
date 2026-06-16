---
title: Raw FMX-132 Game-precedent Sporting Core Research
status: raw
tags: [research, raw, perplexity, game-precedent, football-manager, anstoss, ootp, training, squad, match, fmx-132]
created: 2026-06-16
updated: 2026-06-16
type: research-raw
binding: false
linear: FMX-132
related:
  - [[../sporting-core-context-definition-maturity-2026-06-16]]
  - [[raw-sporting-core-contexts-source-checks-2026-06-16]]
---

# Raw FMX-132 Game-precedent Sporting Core Research

## Prompt

FMX-132 research pass 3: Analyze comparable game precedents for separating
Match, Training, and Squad/Player systems in football/baseball/sports
management games (Football Manager, Anstoss/FIFA Manager/EA FC Career, OOTP,
Top Eleven/Hattrick where relevant). Focus on module/UI separation, player
availability/injuries, training/development, lineup/match engine ownership, and
lessons for DDD bounded contexts. Include citations and label weak
community/manual sources.

## Perplexity Capture

Perplexity supported a three-way logical split, with different evidence
strength by franchise:

- **Football Manager**: strongest public evidence. The official Football
  Manager "The Dugout" hub separates tactics, player roles, teams-to-manage and
  tutorials. Perplexity also found community guides that discuss squad depth,
  injuries, playing time, training and tactic fit as separate management
  concerns. Community guides are pattern evidence only.
- **Anstoss/FIFA Manager/EA FC Career**: useful genre precedent for menu/module
  separation and the long-running football-manager loop, but Perplexity did not
  provide primary sources strong enough for hard architecture claims.
- **OOTP/baseball management**: useful sports-management analogy for roster,
  lineup, player development and simulation loops being separable, but not
  source-checked in this pass.
- **Top Eleven/Hattrick**: useful as thin-match/strong-squad-management
  contrast, but not source-checked in this pass.

Perplexity recommendation:

- Model **Squad & Player** as owner of roster/player truth, contracts,
  morale/status and durable availability.
- Model **Training** as owner of training plans, coaching, role familiarity,
  attribute-development signals and recovery/load.
- Model **Match** as owner of lineup lock, substitutions, live simulation,
  match events and post-match facts.

## Source Check

Hard external source-check evidence is narrow:

- Football Manager official "The Dugout" is an official product/community hub
  that visibly separates tactical, player-role, team and tutorial material:
  https://www.footballmanager.com/the-dugout

Everything beyond that in this pass is treated as pattern evidence unless it is
already preserved in prior FMX research.

## Local FMX Game-precedent Evidence

Local FMX notes already preserve stronger game-precedent research and should be
preferred over unsourced public-memory claims:

- [[../anstoss-series-deep-dive]] supports the Anstoss weekly loop, training,
  lineups and matchday separation as product DNA.
- [[../tactics-persistence-bounded-context-2026-05-28]] source-checks the
  persistent tactics-library split and explicitly keeps Match as a consumer of
  a locked `TacticSnapshot`.
- [[../swappable-spatial-event-match-engine-2026-05-27]] and accepted
  [[../../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  ground Match as a deterministic event-log/simulation owner.
- [[../../50-Game-Design/GD-0005-training]] and
  [[../../50-Game-Design/training-load-and-medicine]] preserve the training
  loop, load and injury-risk design intent.

## Synthesis Constraint

Use comparable games to sanity-check player-facing surfaces and expected
module separation. Do not infer internal software architecture from genre UI.
FMX's context boundaries remain DDD/local-ADR decisions.

