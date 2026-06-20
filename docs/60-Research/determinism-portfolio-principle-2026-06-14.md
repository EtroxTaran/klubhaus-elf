---
title: Determinism Portfolio Principle
status: current
tags: [research, determinism, seeded-variance, replay, rng, match-engine, gameplay, fmx-138]
context: match
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
related:
  - [[determinism-and-replay]]
  - [[raw-perplexity/raw-determinism-portfolio-simulation-architecture-2026-06-14]]
  - [[raw-perplexity/raw-determinism-portfolio-game-precedents-2026-06-14]]
  - [[raw-perplexity/raw-determinism-portfolio-realworld-football-2026-06-14]]
  - [[raw-perplexity/raw-determinism-portfolio-source-checks-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
  - [[../40-Execution/fmx-138-determinism-portfolio-principle-decision-queue-2026-06-14]]
---

# Determinism Portfolio Principle

FMX already has strong determinism foundations: the
[[determinism-and-replay]] note defines locked RNG streams, integer-safe
branching and replay rules; ADR-0018 §3 makes stream discipline the systemic
event owner. FMX-138 closes the missing portfolio rule: when should gameplay
choose pure deterministic behavior, and when should it use bounded seeded
variance through an existing stream?

## Recommendation

Adopt one portfolio-level default:

> **Use bounded seeded variance for player-perceived variety surfaces; use pure
> deterministic transforms for projection, measurement, rules, ledger and audit
> surfaces.**

This is a design principle, not an external law. The engineering sources support
deterministic replay, event replay, controlled seeds and deterministic lockstep.
The football and game sources support the product inference that match outcomes,
injuries and AI/negotiation behavior need uncertainty to feel alive, while
measurements and committed facts need reproducibility to preserve trust.

## Research findings

### F1 - deterministic replay is the engineering baseline

Replayable simulations need stable inputs: initial state, ordered commands or
events, engine/version, and controlled PRNG state or seed. Event sourcing and
deterministic lockstep both depend on replaying the same input sequence through
deterministic logic. This supports FMX's existing rule: all authoritative
randomness must be explicit, labelled and replayable.

Sources:

- https://www.gamedeveloper.com/programming/developing-your-own-replay-system
- https://martinfowler.com/eaaDev/EventSourcing.html
- https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing
- https://www.gafferongames.com/post/deterministic_lockstep/

### F2 - stream isolation prevents random coupling

Using independent streams or labelled substreams keeps changes local. Adding a
new draw for AI-manager behavior should not change match replays, injuries,
loan-quality projections or HoF induction. This directly supports ADR-0018 §3:
new top-level `*Rng` streams are exceptional; most new variance should use an
existing locked stream with a versioned sub-label and persisted provenance.

### F3 - sports realism needs uncertainty, not unbounded dice

Football outcomes are low-scoring and noisy. xG and win-probability models
estimate probabilities because chance quality is not a guarantee of conversion.
Hattrick's studied match engine is probabilistic, and sports-management games
use analytics/reporting to explain unlucky outcomes rather than pretending every
single match is a direct quality readout.

Sources:

- https://arxiv.org/abs/2504.09499
- https://en.wikipedia.org/wiki/Expected_goals
- https://arxiv.org/abs/1906.05029
- https://soccermatics.readthedocs.io/en/latest/lesson5/DealingRandomness.html

### F4 - player trust needs deterministic measurements

Analytics, standings, ledger postings, eligibility verdicts, disciplinary
availability, HoF formula scoring and other measurement/audit surfaces should
not hide extra randomness. A forecast can report probabilities, but the
forecast itself must be reproducible for a fixed model/input/version.

### F5 - existing FMX decisions are compatible

- ADR-0086 background-fast settlement uses seeded cost variance on the existing
  `WorldRng:venue:<clubId>:<week>:opcost:v1` sub-label, with provenance. This
  is a variety surface because background matchday cost is designed as a
  plausible cost realization, not a ledger rule.
- ADR-0088 / GD-0036 transfer escalation uses bounded seeded variance from the
  existing `TransferRng` inside hard rails. This is a variety surface because
  borderline player/agent behavior should feel alive.
- ADR-0083 HoF induction stays pure deterministic for MVP. This is consistent:
  FMX chose an inspectable formula/scoring surface, not a human-vote simulator.
- ADR-0075 loan quality is pure deterministic. This is a projection surface over
  logged facts and fixed weights.
- ADR-0077 weather uses `WeatherRng` for weather generation, then freezes
  resolved snapshots. Future weather is a variety surface; locked weather truth
  is a deterministic fact.
- ADR-0078 player discipline uses deterministic suspension/eligibility
  projection once card/verdict facts exist.

## Proposed application to open systems

| System | Recommended axis | Rationale |
|---|---|---|
| Match-engine event-resolution variety | Bounded seeded variance via `MatchCoreRng(matchId)` / `MatchAiRng(matchId)` | A single match needs plausible upsets and event uncertainty; ADR-0096 still governs byte-identical replay and fixed-point math. |
| Injury occurrence/severity | Bounded seeded variance via `InjuryRng` or `MatchCoreRng(matchId)` for match-contact injuries | Injury risk is probabilistic; current availability after injury remains deterministic. |
| AI-manager decisions | Bounded seeded variance via `WorldAiMgmtRng` / owning existing sub-label | AI behavior should be less scripted while staying reproducible and inside policy rails. |
| Loan-quality and analytics projections | Pure deterministic | Fixed facts + fixed formula must produce the same result. |
| HoF induction formula | Pure deterministic for MVP | Existing M2 decision remains coherent; future stochastic voting would be a new decision. |
| Discipline eligibility | Pure deterministic after verdict/card facts | Rule application is audit/projection, not player-facing variety. |

## Risks and guardrails

- **Hidden randomness risk:** every seeded variance site needs explicit owner,
  stream/sub-label, version and provenance.
- **Design excuse risk:** "variety" must not become a license to avoid clear
  rules. Variance stays bounded and inside rails.
- **Regression risk:** authored golden replays and multi-seed sweeps must cover
  every seeded variety surface once code exists.
- **Decision creep risk:** this ADR should not silently reopen prior accepted
  pure declarations; it classifies them and defines the future default.

## Recommended decision packet

Approve D1-D3 in
[[../40-Execution/fmx-138-determinism-portfolio-principle-decision-queue-2026-06-14]]:

- D1=A: adopt the portfolio principle.
- D2=A: classify match outcome variety, injury occurrence and AI-manager
  behavior as bounded seeded-variance surfaces.
- D3=A: preserve existing pure deterministic declarations unless explicitly
  reopened.

The decision home is draft
[[../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]].
