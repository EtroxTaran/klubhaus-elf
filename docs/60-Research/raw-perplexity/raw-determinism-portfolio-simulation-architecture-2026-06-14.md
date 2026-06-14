---
title: Raw determinism portfolio simulation architecture research
status: raw
tags: [research, raw, perplexity, determinism, seeded-variance, replay, event-sourcing, lockstep, fmx-138]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
related:
  - [[../determinism-portfolio-principle-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
  - [[../determinism-and-replay]]
---

# Raw determinism portfolio simulation architecture research

## Prompt

Research best practices for deterministic simulations that still use seeded
variance: lockstep simulation, event-sourcing replayability, PRNG stream
isolation, deterministic replay, golden replays, and when simulation systems
should be pure deterministic vs seeded stochastic. Explain tradeoffs for an
offline-capable sports management game. Include cited sources and practical
design recommendations.

## Perplexity capture

The answer recommends a deterministic core with tightly controlled seeded
stochasticity. The repeated pattern is: commands and rule application are
deterministic; uncertainty surfaces consume a controlled PRNG seed; the seed and
draw provenance become replay/save inputs; QA uses fixed-seed golden replays and
multi-seed sweeps.

Key points preserved from the answer:

- The same initial state, seed and ordered inputs should produce the same
  trace. This supports replay, save portability, debugging and regression tests.
- Randomness should come only from controlled seeded PRNGs; the seed is part of
  the program input, not an invisible implementation detail.
- Independent PRNG streams or labelled substreams avoid random coupling: adding
  a scouting draw should not perturb match history, injuries or world drift.
- Golden replays are useful for season starts, match edge cases, save/load
  round trips, injury/suspension cases, transfer/contract edge cases and
  long-horizon progression.
- Balance work should compare fixed seeds and also run multiple seeds, because
  one run can be dominated by variance.

## Practical split suggested by the answer

| Surface | Recommended handling |
|---|---|
| League tables, finances, contracts, calendar advancement | Pure deterministic transforms and auditably replayable state changes. |
| Match engine rules | Deterministic rules; seeded variance only where football uncertainty is desired. |
| Player development, injuries, scouting uncertainty | Seeded stochastic, bounded, versioned and replayable. |
| UI animation, audio, cosmetic effects | Outside the authoritative simulation boundary. |
| QA and regression | Fixed-seed golden replays plus multi-seed statistical sweeps. |

## Source trail

- Resonate: deterministic simulation testing frames the goal as repeatable
  traces from the same starting state and inputs:
  https://journal.resonatehq.io/p/deterministic-simulation-testing
- Pierre Zemb: deterministic simulation testing and replay for failure
  reproduction:
  https://pierrezemb.fr/posts/learn-about-dst/
- Game Developer: replay systems need deterministic execution and the same
  sequence of random values; storing/restoring seed or state are established
  replay patterns:
  https://www.gamedeveloper.com/programming/developing-your-own-replay-system
- Martin Fowler: Event Sourcing captures changes as an event sequence and can
  rebuild state by re-running events:
  https://martinfowler.com/eaaDev/EventSourcing.html
- Microsoft Azure Architecture Center: Event Sourcing stores state changes as
  append-only events for rebuild/replay/audit patterns:
  https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing
- Gaffer On Games: deterministic lockstep depends on deterministic simulation
  from the same input stream:
  https://www.gafferongames.com/post/deterministic_lockstep/

## Source-quality note

The engineering evidence is strong for deterministic replay, event replay and
lockstep constraints. The exact FMX policy "variety surface versus
projection/measurement surface" is a product/design principle inferred from
these practices, not a sourced universal standard.
