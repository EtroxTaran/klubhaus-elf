---
title: Raw FMX-132 Real-world Sporting Core Research
status: raw
tags: [research, raw, perplexity, football, real-world, training-load, injuries, availability, match, squad, player, fmx-132]
created: 2026-06-16
updated: 2026-06-16
type: research-raw
binding: false
linear: FMX-132
related:
  - [[../sporting-core-context-definition-maturity-2026-06-16]]
  - [[raw-sporting-core-contexts-source-checks-2026-06-16]]
---

# Raw FMX-132 Real-world Sporting Core Research

## Prompt

FMX-132 research pass 2: Analyze real-world football operations boundaries for
first-team match operations, training/performance/sports science, and
squad/player administration. Focus on who owns availability, fitness/readiness,
injuries, discipline, contracts, training load, lineups, match event facts, and
development signals. Include realistic ownership patterns, caveats, and
citations.

## Perplexity Capture

Perplexity described a realistic three-way split:

- **Match operations / first-team coaching** own lineups, substitutions,
  tactical choices and matchday decisions, but consume availability constraints
  from medical, performance, administration and competition rules.
- **Training / performance / sports science** own training plans, physical
  load, readiness signals, individual development signals and injury-risk
  warnings. They influence match selection, but do not own final lineup choice.
- **Squad/player administration** owns contracts, registration, administrative
  eligibility, discipline tracking, player records and the durable player state
  used by other departments.

Perplexity's useful RACI-style claims:

| Concern | Claimed real-world owner pattern | FMX implication |
|---|---|---|
| Medical availability | Medical/performance determines health and readiness constraints; coach selects within them. | Persisted injury/availability state should not be embedded in Match simulation. |
| Administrative eligibility | Football administration/team secretary manages registration, competition lists and eligibility checks. | Squad & Player/Regulations-style facts constrain selection before match lock. |
| Training load | Sports science/performance collects GPS/wellness/load metrics and flags risk. | Training computes load/risk/development signals. |
| Lineups and tactics | Head coach/manager owns selection and in-game choices, with analysts/coaches consulted. | Match owns lineup lock and simulation input, but not player lifecycle truth. |
| Match event facts | Referee/competition records official match facts; clubs analyze them after the fact. | Match emits event facts; analytics/statistics consume projections. |
| Contracts and registration | Sporting director/admin/legal own contracts and paperwork; coach is consulted. | Squad & Player owns contract/player-record lifecycle; Transfer remains process owner where already defined. |

## Citation Quality

The Perplexity answer included weak public/social citations such as Reddit,
Instagram and YouTube. Those are not used as hard evidence. The real-world
section in the synthesis uses the source checks below and labels remaining club
RACI detail as inference.

## Source-check Anchors

- IFAB Law 3 confirms match participation and substitution constraints, such as
  team-list naming before kick-off and referee-informed substitutions:
  https://www.theifab.com/laws/latest/the-players/
- IFAB Law 5 confirms that the referee controls the match, records match facts
  and disciplinary action, and handles match injury stoppages:
  https://www.theifab.com/laws/latest/the-referee/
- IFAB Law 12 confirms that fouls/misconduct/cardable incidents are match-law
  facts:
  https://www.theifab.com/laws/latest/fouls-and-misconduct/
- SoccerGuard (arXiv 2024) is not governance evidence, but it confirms the
  modern sports-science data shape: subjective wellness and training-load
  reports, objective GPS sensor measures and medical-personnel-verified injury
  reports can be combined for soccer injury-risk analysis:
  https://arxiv.org/abs/2411.08901

## Synthesis Constraint

Use real-world operations as plausibility evidence, not as a direct RACI import.
FMX's canonical ownership still comes from accepted local ADRs/GDDRs and Nico
decisions.

