---
title: "Raw - gameplay calibration domain slots (FMX-141)"
status: raw
tags: [research, raw, perplexity, gameplay, calibration, gddr, domain-slots, fmx-141]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-141
related:
  - [[../gameplay-calibration-ownership-and-harness-2026-06-13]]
  - [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# Raw - gameplay calibration domain slots (FMX-141)

## Research prompt

Perplexity was asked for practical calibration ownership slots for a football
manager game beyond economy: match core outcomes, live-control interventions,
set pieces/training readiness, tactical identity and manager-style signal
bands, weather/pitch, staff/persona labels, dialogue morale/trust, media
ecology, transfer escalation, dynasty/ownership drift, legacy/Hall-of-Fame and
national-team careers.

## Source-quality note

The slot taxonomy is mostly FMX product/governance inference. Public sources can
support the need for modular tuning, analytics validation and comparable game
surfaces, but not the exact FMX slot list. That is why GD-0043 remains `draft`
and routes the taxonomy to Nico for approval.

## Extracted slot taxonomy

| Proposed slot | What it calibrates | Harness tier |
|---|---|---|
| `match.core` | W/D/L, goals, shots, xG, cards, injuries, possession/pressing envelopes | T0-T2 |
| `match.liveControl` | in-match controls, shouts, live effect latency, cooldowns | T0-T2 |
| `match.liveIntervention` | intervention buffer caps, pause budgets, typed rejections | T0-T2 |
| `setPieces.readiness` | readiness curve, decay/hysteresis, set-piece conversion uplift | T0-T2 |
| `tactics.identity` | tactical fingerprint baselines, EWMA/confidence constants, manager-style signal bands | T1-T2 |
| `environment.weatherPitch` | pass/shot/control/injury effects by weather and pitch state | T1-T2 |
| `people.personaLabels` | hidden substrate thresholds, label caps, reveal bands | T1-T2 |
| `dialogue.trustMorale` | banded intent effects, decay, stack caps, promise debt | T0-T2 |
| `media.ecology` | outlet stance drift, news gravity, effect-intent magnitudes | T1-T3 |
| `transfer.escalation` | pressure increments, decay, hysteresis, seeded edge variance | T0-T2 |
| `world.drift` | Rising Rival, Giant Collapse, Continental Era Shift pacing/caps/effects | T2-T3 |
| `dynasty.ownershipBoard` | board confidence, ownership transitions, insolvency rates, anti-flatline | T2-T3 |
| `legacy.hof` | era-normalized awards/records/HoF/legacy score formula | T2-T3 |
| `legacy.nationalTeam` | unlock gates, offer cadence, dual-role workload/frequency | T2-T3 |

## Extracted lead-designer questions

- Which slot taxonomy is canonical and which slots should be merged?
- Which metrics are source-of-truth per slot?
- Which harness tier is required before a slot can ship?
- Who can approve baseline/rebaseline changes?
- Where may fun/perceived fairness override strict realism?
- Which systems expose calibrated values to players, and which stay hidden?

## Source trail

- Perplexity research pass, 2026-06-13: domain-slot taxonomy and slot metrics.
- Football Manager official overview of training, recruitment, clauses and squad
  planning surfaces (genre surface precedent, not calibration-loop evidence):
  <https://www.footballmanager.com/the-dugout/first-10-things-do-fm26>
- FM Projects community synthesis of Football Manager owner attributes
  (owner-surface precedent, not authoritative SI documentation):
  <https://fmprojects.substack.com/p/how-to-make-the-perfect-boss>
- Hudl xG explainer for shot-quality probability:
  <https://www.hudl.com/blog/expected-goals-xg-explained>
- xG research paper on event-data shot-probability models:
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC11524524/>

## Notes for synthesis

FMX-141 should not claim the taxonomy is industry-standard. It should state that
the taxonomy is the best-fit FMX governance proposal, with external evidence
supporting modular tuning and statistical validation rather than this exact list.
