---
title: Raw determinism portfolio source checks
status: raw
tags: [research, raw, perplexity, source-check, determinism, seeded-variance, replay, event-sourcing, fmx-138]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
related:
  - [[../determinism-portfolio-principle-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
---

# Raw determinism portfolio source checks

## Prompt

Source-check these claims for a football-manager architecture ADR:

1. deterministic replay and seeded PRNG/state capture are standard for
   replayable simulations;
2. event sourcing favors immutable events plus deterministic projections;
3. lockstep/rollback/networked simulations require deterministic simulation
   steps;
4. sports sims commonly combine deterministic replay inputs with stochastic
   outcomes;
5. football injuries/match results and transfer decisions should be uncertain
   to feel realistic, while analytics/ledger/discipline verdict projections
   should be reproducible.

## Perplexity capture

Perplexity rated the engineering claims as strong but flagged two weak spots:

- Event-sourcing support was accurate but needed direct architecture sources,
  not just game-development sources.
- "Sports sims commonly" and "should feel realistic" are partly design
  inference. They should be phrased as FMX recommendations grounded in sports
  uncertainty and game precedent, not as universal external facts.

## Targeted source checks added

- Martin Fowler: Event Sourcing stores all application-state changes as a
  sequence of events and can rebuild state by re-running events:
  https://martinfowler.com/eaaDev/EventSourcing.html
- Microsoft Azure Architecture Center: Event Sourcing records a full series of
  actions in an append-only store, with events as the source of truth:
  https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing
- Gaffer On Games: deterministic lockstep relies on each machine running the
  same deterministic simulation over the same input sequence:
  https://www.gafferongames.com/post/deterministic_lockstep/
- Game Developer: replay systems require deterministic execution, the same
  sequence of random values, and/or state capture:
  https://www.gamedeveloper.com/programming/developing-your-own-replay-system
- GGPO overview: rollback systems roll back state and replay corrected inputs:
  https://en.wikipedia.org/wiki/GGPO
- Hattrick Bayesian-network study: formalizes a football-manager game as a
  probabilistic model:
  https://arxiv.org/abs/2504.09499

## Claim confidence

| Claim | Confidence | Handling in ADR |
|---|---|---|
| Deterministic replay with controlled seed/state capture is a standard pattern. | High | Use as engineering rationale. |
| Event sourcing uses immutable event streams and replay/rebuild patterns. | High | Use as architecture rationale; avoid over-claiming "projection" if not directly cited. |
| Lockstep/rollback architectures depend on deterministic simulation steps. | High | Use as architecture rationale. |
| Sports sims combine probabilistic outcomes with reproducible committed results. | Medium | Phrase as genre/design precedent, not a universal fact. |
| Variety surfaces should be seeded and audit surfaces pure deterministic. | Medium | Explicitly mark as FMX design principle recommended by the research. |
