---
title: "Raw - Pitch-condition state ownership: DDD boundary (FMX-142)"
status: raw
tags: [research, raw, perplexity, ddd, bounded-context, pitch, weather, stadium, ownership, fmx-142]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-142
related:
  - [[../pitch-condition-state-ownership-2026-06-14]]
  - [[../../10-Architecture/bounded-context-map]]
  - [[../../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../../10-Architecture/state-machines/pitch-condition]]
---

# Raw capture - Pitch-condition state ownership DDD boundary (Perplexity, 2026-06-14)

Perplexity capture for **FMX-142**. Status `raw`: this is source input only; the
synthesis is [[../pitch-condition-state-ownership-2026-06-14]].

No FMX private data, secrets or user data were sent. Prompts were generic
architecture/product research prompts.

## Prompt

**Prompt.** In domain-driven design, how should aggregate and bounded-context
ownership be split when a local mutable state, such as a football stadium pitch
condition, is derived from upstream weather facts plus local facility and usage
state? Research best practices for aggregate ownership, upstream fact providers,
anti-corruption layers, published language and cross-context derived snapshots.
Include sources.

## Key captured findings

- The aggregate/context that protects the mutable invariant should own the
  state and state-changing events. For pitch condition, the invariant combines
  facility state, maintenance, drainage/heating capability and usage wear.
- Upstream weather/climate is best modeled as an upstream fact provider:
  publish weather facts and forecasts, then let the owning pitch/facility
  context consume them through published language or an anti-corruption layer.
- A derived snapshot can be persisted for replay, but the producer of a
  state-changing event such as `PitchConditionChanged` should be the context
  that owns the accumulated state.
- Splitting one aggregate's invariants across two bounded contexts creates
  duplicate authority, consistency lag and unclear command routing. If two
  contexts need the data, publish events/snapshots instead of sharing tables or
  co-owning the aggregate.
- The clean FMX shape is therefore: **Environment & Climate publishes
  weather/climate facts and deterministic derivation rules; Stadium Operations
  owns pitch-condition state and emits `PitchConditionChanged`.**

## Useful sources returned

- Agile Seekers, "Using Domain-Driven Design (DDD) to Structure Product
  Ownership": <https://agileseekers.com/blog/using-domain-driven-design-ddd-to-structure-product-ownership>
- Rico Fritzsche, "DDD Modularization Concepts: Aggregates, Part II":
  <https://ricofritzsche.me/ddd-modularization-concepts-aggregates-part-ii/>
- Martin Fowler, "Bounded Context":
  <https://www.martinfowler.com/bliki/BoundedContext.html>
- Microsoft Azure Architecture Center, "Domain analysis for microservices":
  <https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis>

## Source quality note

Perplexity also returned video and mirrored summaries that did not add primary
or durable DDD guidance. Those were ignored in the synthesis.
