---
title: Raw determinism portfolio game precedent research
status: raw
tags: [research, raw, perplexity, determinism, seeded-variance, game-precedent, sports-management, fmx-138]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
related:
  - [[../determinism-portfolio-principle-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
---

# Raw determinism portfolio game precedent research

## Prompt

Research football/sports-management game precedent for deterministic vs
stochastic simulation surfaces. Include Football Manager where sourceable, OOTP
Baseball, Hattrick/Top Eleven/OSM if relevant, quick-sim vs full-sim behavior,
replay/save consistency, player-perceived variety, injuries, match outcomes,
AI manager behavior and anti-frustration transparency. Provide clear
recommendations for a portfolio-level principle.

## Perplexity capture

The answer describes the genre pattern as hybrid: sports-management games use
probabilistic event outcomes to create believable uncertainty, but successful
systems need one authoritative model and stable explanation surfaces so variance
does not read as unfairness.

Preserved findings:

- Football Manager-style titles use probabilistic match events and expose xG,
  shot maps, heat maps, staff feedback and match reports to explain why a match
  was lost despite player expectation.
- OOTP-style sports sims are treated as "one engine, multiple observation
  levels": quick simulation and live play-by-play should be different
  presentations of the same underlying model, not separate sports.
- Hattrick is useful because it is a persistent online football-manager game
  studied as a probabilistic/Bayesian model. It simulates once on the server and
  then locks the result; the generation step is stochastic, the committed result
  is final.
- Casual online managers such as Top Eleven/OSM are weaker source trails, but
  the design pattern remains single authoritative server-side result plus
  compressed explanation surfaces.
- A split quick-sim formula is risky: players can lose trust if watching,
  quick-simming and background simulation feel like different models.
- Anti-frustration patterns are analytics, tactical mismatch explanations,
  pre-risk warnings and levers that reduce risk without guaranteeing outcomes.

## Recommendation from this capture

The game precedent supports one FMX rule: **probabilistic, not scripted;
deterministic per saved simulation; fair over time; explained through analytics
and narrative.** For FMX that means bounded seeded variance for match outcomes,
injuries and AI-manager behavior, while the committed event/state/result is
replayable.

## Source trail

- Hattrick Bayesian-network paper (2025): formal analysis of Hattrick as a
  probabilistic football-manager game:
  https://arxiv.org/abs/2504.09499
- Expected goals overview: xG represents shot scoring probability and is
  interpreted over repeated comparable chances, not as a single-shot guarantee:
  https://en.wikipedia.org/wiki/Expected_goals
- Bayesian in-game win probability for soccer: football win probabilities are
  modelled probabilistically because low-scoring soccer makes outcomes
  uncertain:
  https://arxiv.org/abs/1906.05029
- Out of the Park Baseball background as a text-based sports/business
  simulation series:
  https://en.wikipedia.org/wiki/Out_of_the_Park_Baseball

## Source-quality note

The Hattrick and xG/probability evidence is strong enough for the
"probabilistic sports surface" argument. Public source trails for proprietary
Football Manager internals are weak; FM-specific claims should be treated as
genre observation and player-facing precedent, not as proof of engine internals.
