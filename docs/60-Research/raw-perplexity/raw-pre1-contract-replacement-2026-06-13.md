---
title: "Raw - pre-1.0 contract replacement exception (FMX-147)"
status: raw
tags: [research, raw, perplexity, schema-versioning, event-sourcing, data-contracts, quality-profile, fmx-147]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-147
related:
  - [[../quality-profile-enum-settlement-path-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
---

# Raw - pre-1.0 contract replacement exception (FMX-147)

## Research prompt

Perplexity was asked for DDD/event-sourcing and data-contract guidance on changing a published
integration/event schema before production launch, specifically when no live events, customers,
external consumers, long-lived test data or persisted saves exist. The prompt asked when in-place
replacement is acceptable versus introducing a new schema version, and what caveats ADR wording should
carry.

## Key findings

- In-place replacement of a pre-1.0 event or integration schema is acceptable only while there are no
  production events, external consumers, long-lived persisted payloads or stable test fixtures that
  depend on the old shape.
- Once another team, partner, stable environment or generated client/test suite relies on the schema,
  breaking changes should be versioned and deprecated instead of silently mutating the old contract.
- Breaking event/data-contract changes include field removal/rename, semantic changes, new required
  fields without defaults, and constraint changes that invalidate previously valid payloads.
- For event-sourced systems, persisted events are history. After durable event history exists, evolve
  through new event names, schema versions, payload versions or upcasters rather than editing old
  event meaning in place.
- ADR wording should name the stabilization trigger: published-for-integration, external consumer
  adoption, or durable data persistence.

## FMX-specific extraction

| Best practice | FMX-147 implication |
|---|---|
| No durable payloads means no historical compatibility burden | FMX is docs-vault-only after the 2026-05-27 reset; there are no implemented `FixtureCommercialProfilesPublished` events, persisted saves or external consumers of the old ADR-0070 v1 sketch |
| Stabilization trigger must be explicit | ADR-0070 should record that this is a pre-1.0 documentation correction; once fixture-commercial profile events are implemented or shared for integration, future breaking changes require a new version/upcaster path |
| Preserve the stronger event-sourcing rule after implementation | The FMX-147 replacement does not weaken the future rule that persisted events are immutable facts |
| Avoid legacy baggage before v1 | Replacing the three-value `qualityProfileClass` sketch now avoids carrying a known ambiguous vocabulary into implementation |

## Source trail

- Perplexity research pass, 2026-06-13: pre-1.0 event/data-contract replacement versus versioning,
  DDD/event-sourcing caveats and ADR wording.
- Microsoft Azure Architecture Center, Event Sourcing pattern - persisted events are append-only
  history and projections rebuild from the log: <https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing>
- microservices.io, Event Sourcing pattern - state changes are captured as an event sequence and
  consumers rebuild state by replaying events: <https://microservices.io/patterns/data/event-sourcing.html>
- EventSourcingDB documentation, event versioning and DDD/CQRS guidance:
  <https://docs.eventsourcingdb.io/>
- Monte Carlo, data contracts explained - contract stability matters once consumers rely on a
  published shape: <https://www.montecarlodata.com/blog-data-contracts-explained/>

## Source quality note

The Perplexity refresh returned useful architectural framing but mixed citation quality. Treat this
note as supplemental support for the **pre-1.0 exception** only. The stronger authority for normal
post-stabilization event/versioning practice remains
[[raw-quality-profile-enum-ddd-contract-2026-06-12]] and its event-sourcing sources.
