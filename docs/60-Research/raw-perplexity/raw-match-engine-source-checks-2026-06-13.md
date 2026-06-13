---
title: "Raw - match-engine source checks (FMX-133)"
status: raw
tags: [research, raw, source-check, match-engine, xg, xt, epv, football-manager, ootp, statistics, injuries, fmx-133]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-133
related:
  - [[../match-engine-core-model-2026-06-13]]
  - [[raw-match-engine-real-world-envelopes-2026-06-13]]
  - [[raw-match-engine-action-utility-models-2026-06-13]]
  - [[raw-match-engine-game-precedents-2026-06-13]]
  - [[raw-match-engine-calibration-harness-2026-06-13]]
---

# Raw - match-engine source checks (FMX-133)

## Purpose

Perplexity returned useful synthesis but weak citations in several places. This
note records the stronger source trail used by
[[../match-engine-core-model-2026-06-13]].

## xG / shot probability

- Hudl/StatsBomb glossary defines Expected Goals as a metric for the probability
  that a shot results in a goal and notes historical shot information as the
  model basis:
  <https://support.hudl.com/s/article/expected-goals?topic=Statsbomb_Global_Football_Data_Glossary>
- StatsBomb's freeze-frame source confirms defender and player locations around
  shots are part of richer shot context:
  <https://blogarchive.statsbomb.com/news/statsbomb-data-case-studies-freeze-frames-and-defender-locations/>
- Hudl's xG explainer is a second commercial analytics source for xG as
  shot-quality probability:
  <https://www.hudl.com/blog/expected-goals-xg-explained>

## xT / possession value / EPV

- Karun Singh's xT introduction explains a zone/value model for possession and
  buildup:
  <https://karun.in/blog/expected-threat.html>
- DataBallPy documents xT as a value assigned to pitch locations reflecting goal
  likelihood from possession:
  <https://databallpy.readthedocs.io/en/main/features/xt_models.html>
- Hudl's possession-value explainer describes xT as a value surface over pitch
  zones:
  <https://www.hudl.com/blog/possession-value-models-explained>
- Soccermatics documents action-based xT and assigning values to actions using
  start/end position and qualifiers:
  <https://soccermatics.readthedocs.io/en/latest/lesson4/EvaluatingActions.html>
  and <https://soccermatics.readthedocs.io/en/latest/lesson4/xTAction.html>
- EPV source check: a peer-reviewed open-access paper describes expected
  possession value in soccer as the likelihood of scoring or conceding the next
  goal at a time instance:
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC8570314/>

## Game precedents

- Football Manager official matchday page describes a rich matchday experience,
  improved on-pitch detail, movement, highlights/camera and data-card
  presentation:
  <https://www.footballmanager.com/fm26/features/where-storytelling-evolves-fm26s-match-day-experience>
- OOTP official manual documents multiple game-control pacing modes, including
  one-pitch and pitch-by-pitch play:
  <https://manuals.ootpdevelopments.com/index.php?man=ootp15&page=game_controls>

The Hattrick, Top Eleven and OSM points are genre/design inference only in this
FMX-133 packet because the quick source pass did not yield sufficiently strong
official sources.

## Statistical methods

- NIST chi-square goodness-of-fit:
  <https://www.itl.nist.gov/div898/handbook/eda/section3/eda35f.htm>
- NIST Kolmogorov-Smirnov goodness-of-fit:
  <https://www.itl.nist.gov/div898/handbook/eda/section3/eda35g.htm>
- NIST Anderson-Darling:
  <https://www.itl.nist.gov/div898/handbook/eda/section3/eda35e.htm>

## Injuries

- PubMed record for Ekstrand et al., "Injury incidence and injury patterns in
  professional football", gives the UEFA injury-study trail and overall
  incidence context:
  <https://pubmed.ncbi.nlm.nih.gov/19553225/>
- PubMed record for the UEFA Elite Club Injury Study hamstring review confirms
  the long-running elite-club cohort context:
  <https://pubmed.ncbi.nlm.nih.gov/36588400/>
- Open-access systematic review trail for professional football injury
  epidemiology:
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC9929604/>

## League/stat envelope caveat

Current league/team aggregate pages such as Premier League official stats,
FotMob, FBref/StatsBomb and public football-stat aggregators provide the exact
season snapshots for goals, shots, cards, possession and xG, but access and
coverage differ by provider. FMX-133 therefore promotes broad **calibration
bands** instead of binding itself to one provider's current-season table.

## Related

- [[../match-engine-core-model-2026-06-13]]
- [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]

