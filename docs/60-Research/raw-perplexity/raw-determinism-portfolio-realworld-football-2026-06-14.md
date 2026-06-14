---
title: Raw determinism portfolio real-world football research
status: raw
tags: [research, raw, perplexity, football, realism, injuries, match-outcomes, analytics, determinism, seeded-variance, fmx-138]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
related:
  - [[../determinism-portfolio-principle-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
---

# Raw determinism portfolio real-world football research

## Prompt

Research real-world football sources for which surfaces need inherent
uncertainty/variance versus pure measurement/projection: match outcome
randomness, injuries, player availability, transfer/manager decisions,
disciplinary decisions, weather/pitch, awards/Hall-of-Fame style recognition
and analytics projections. Translate the findings into recommendations for a
football-manager game principle: variety surface -> bounded seeded variance;
projection/measurement/audit surface -> pure deterministic. Include citations.

## Perplexity capture

The answer supports a domain split:

- Match results and goal timing are uncertain enough that a single result should
  not be treated as a deterministic readout of team strength.
- Injuries should use risk factors but still resolve probabilistically; once an
  injury exists, the availability state is an audit fact.
- Transfer and manager choices have preference/uncertainty surfaces, but the
  committed deal, contract or selection should be deterministic state.
- Disciplinary and officiating calls may be uncertain as match events; the
  recorded suspension/eligibility projection after the call should be
  reproducible.
- Weather generation is uncertain before resolution; a locked match-weather
  truth snapshot is deterministic once published.
- Awards/HoF can be deterministic if FMX defines explicit scoring criteria; if
  voting is simulated later, only the vote-generation surface should be seeded,
  while the counted result remains reproducible.
- Analytics projections should be pure deterministic for a fixed model,
  dataset, parameter version and input snapshot.

## FMX design translation

| Surface | Real-world basis | FMX handling |
|---|---|---|
| Match outcome and event resolution | Low-scoring football has meaningful outcome variance. | Bounded seeded variance via existing match streams. |
| Injury occurrence/severity | Risk factors are known, occurrence is uncertain. | Bounded seeded variance via existing injury/match streams. |
| Current availability | Known status after injury/ban/selection. | Pure deterministic state/query. |
| Transfer/AI-manager decisions | Preferences and negotiations are uncertain. | Bounded seeded variance inside decision rails; committed facts deterministic. |
| Discipline/eligibility projection | Rule application after a card/verdict must be auditable. | Pure deterministic projection; any officiating variance belongs upstream. |
| Weather/pitch truth | Future conditions uncertain, locked truth is factual. | Existing WeatherRng generation; locked snapshots deterministic. |
| HoF/awards | FMX criteria can be explicit and inspectable. | Pure formula for MVP; future seeded voting only with Nico approval. |
| Analytics/forecasts | Models estimate probabilities from fixed inputs. | Pure deterministic for fixed model/input/version. |

## Source trail

- Study on randomness in football goals/outcomes:
  https://www.tandfonline.com/doi/abs/10.1080/02640414.2021.1930685
- Soccermatics lesson on randomness in football modelling:
  https://soccermatics.readthedocs.io/en/latest/lesson5/DealingRandomness.html
- Expected goals overview and limitations around probability, sample size and
  interpretation:
  https://en.wikipedia.org/wiki/Expected_goals
- Bayesian in-game soccer win probability:
  https://arxiv.org/abs/1906.05029
- Historical match-outcome prediction paper, used as a general reminder that
  predictive football models produce estimates, not certainties:
  https://ibima.org/accepted-paper/predicting-soccer-match-outcomes-with-machine-learning-methods/

## Source-quality note

The real-world sources support football uncertainty and probabilistic analytics.
The exact FMX rule remains a design decision: it uses real-world uncertainty as
evidence for where seeded variance is valuable, and auditability requirements as
evidence for where pure deterministic projections are safer.
