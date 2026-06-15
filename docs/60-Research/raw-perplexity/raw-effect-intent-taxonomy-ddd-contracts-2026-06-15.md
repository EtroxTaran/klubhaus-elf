---
title: "Raw Perplexity - Effect-intent taxonomy DDD contracts"
status: raw
tags: [research, raw, perplexity, effect-intent, ddd, contracts, published-language, acl, bounded-context, fmx-162]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-162
related:
  - [[../effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0125-cross-producer-effect-intent-taxonomy]]
---

# Raw Perplexity - Effect-intent taxonomy DDD contracts

## Prompt

Research DDD and integration-contract best practices for cross-bounded-context
advisory intent vocabularies: shared kernel vs published language vs
anti-corruption layer, versioned event contracts, idempotency/correlation/
causation, owner-context authority, conformance tests, and event-carried state
transfer. Apply this to a docs-only modular monolith game where Narrative and
Media Ecology emit advisory effect intents consumed by Squad & Player,
Audience & Atmosphere, Club Management, Transfer, and People contexts.

## Raw discovery synthesis

Perplexity recommended **published language plus anti-corruption layers**, not
a shared domain model:

- Shared Kernel is high-coupling and should be limited to tiny, stable,
  jointly-owned primitives.
- Published Language is a better fit for producer events: the producer exposes
  a stable contract without leaking internals.
- Each consumer should translate the advisory intent into its own policy model,
  preserving owner-context authority.
- Versioned event contracts should prefer additive changes, explicit schema
  versions, and migration windows for semantic changes.
- Contract metadata should carry event ID, correlation ID, causation ID,
  source/provenance, schema version, and enough stable payload to avoid querying
  producer internals.
- Contract/conformance tests should verify that producers publish documented
  schemas and that consumers still parse/map accepted intents.

## Cited discovery leads

These were treated as discovery and source-checked separately where they became
canonical claims:

- Microsoft Azure anti-corruption layer pattern:
  https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer
- Microsoft Learn domain events:
  https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation
- DevIQ anti-corruption layer:
  https://deviq.com/domain-driven-design/anti-corruption-layer/
- Herberto Graca model integrity article:
  https://herbertograca.com/2016/02/05/ddd-14-maintaining-model-integrity/

## Design takeaways before source check

- A single FMX catalog can exist as a **published-language registry**, not as a
  shared domain model.
- The catalog should name IDs, owner contexts, policy-key handoff names, bands
  and visibility. Consumer contexts still own the meaning and application of
  their policy keys.
- Producers must not emit commands that force another context to mutate state;
  they emit advisory metadata tied to a committed producer fact.
- Consumers accept, clamp, reject, expire, or dedupe advisory intents and then
  emit their own authoritative result events.

## Related

- [[../effect-intent-taxonomy-cross-producer-2026-06-15]]
- [[raw-effect-intent-taxonomy-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0125-cross-producer-effect-intent-taxonomy]]
