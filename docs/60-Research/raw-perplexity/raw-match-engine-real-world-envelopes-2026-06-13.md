---
title: "Raw - match-engine real-world statistical envelopes (FMX-133)"
status: raw
tags: [research, raw, perplexity, match-engine, calibration, football-statistics, xg, cards, injuries, fmx-133]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-133
related:
  - [[../match-engine-core-model-2026-06-13]]
  - [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../../50-Game-Design/GD-0002-match-engine]]
  - [[../../50-Game-Design/match-engine]]
---

# Raw - match-engine real-world statistical envelopes (FMX-133)

## Research prompt

Perplexity was asked for current real-world men's professional football
statistical envelopes for goals, shots, total xG, cards, possession/style,
PPDA/pressing and injuries, suitable for calibrating a deterministic
football-manager match engine.

## Source-quality note

The Perplexity answer produced useful football-stat ranges, but several generated
citations were irrelevant or low-quality. The synthesis therefore treats this
pass as discovery input only and relies on the separate source-check note for
primary/stronger anchors.

## Extracted findings

- Modern top men's leagues generally sit in the **2.5-3.2 goals per match**
  range, with league/season style variance. FMX should target a standard
  calibration mean around **2.6-3.0** and allow league presets to shift lower or
  higher.
- Combined shots for both teams usually sit around **22-30 per match**; shots on
  target around **7-11**. The useful design check is not only mean shots, but
  whether shot volume, xG and final goals agree.
- Total xG should broadly track goals: **2.4-3.2 total xG per match** is the
  practical top-tier envelope for the first calibration harness, with **0.08-0.12
  xG per shot** as a sanity band.
- Discipline is league/referee-profile sensitive. A reasonable first envelope is
  **3.5-7.5 yellows per match** and **0.08-0.35 reds per match**, with red-card
  outcomes treated as low-frequency and second-yellow dependent.
- Possession style should be a distribution, not one average:
  - dominant positional teams: **58-65%** season average;
  - proactive teams: **53-58%**;
  - balanced teams: **47-53%**;
  - reactive/counter teams: **40-46%**;
  - extreme low-block teams: **35-40%**.
- PPDA/pressing bands useful for the engine:
  - relentless high press: **6-8**;
  - aggressive: **8-10**;
  - balanced: **10-13**;
  - mid-block: **13-16**;
  - deep/passive: **16-20+**.
- Injury data is weaker and more medical-study dependent. Treat injuries as a
  season/squad calibration surface, not as a single precise per-match dramatic
  trigger. Suggested first envelope: **0.2-0.4 time-loss match injuries per
  match** and **25-40 time-loss injuries per 25-player squad-season**, adjusted
  by congestion, fatigue, intensity and medical quality.

## Design implications to carry forward

- Use target envelopes as **aggregate gates**, not as per-match clamps. Individual
  matches must remain volatile.
- Slice envelopes by tactic/style/referee/team strength so the harness catches
  false realism, e.g. a high press that raises turnovers but does not raise
  fatigue or cards.
- Injuries need a separate calibration report by season/squad load; the match
  engine only emits candidate injury facts.

## Source trail

- Perplexity research pass, 2026-06-13: real-world football statistical
  envelopes for match-engine calibration.
- Source checks and stronger URLs are captured in
  [[raw-match-engine-source-checks-2026-06-13]].

## Related

- [[../match-engine-core-model-2026-06-13]]
- [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]

