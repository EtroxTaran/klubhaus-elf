---
title: "Raw - quality-profile enum contract and schema versioning (FMX-147)"
status: raw
tags: [research, raw, perplexity, ddd, event-sourcing, schema-versioning, quality-profile, acl, fmx-147]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-147
related:
  - [[../quality-profile-enum-settlement-path-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
---

# Raw - quality-profile enum contract and schema versioning (FMX-147)

## Research prompt

Perplexity was asked for DDD/event-sourcing best practice on a drifted enum that appears in two bounded-context contracts: the match engine has four quality profiles, while the commercial publication contract exposes a three-valued `qualityProfileClass`. The prompt asked whether to introduce one canonical published enum, keep local enums with an ACL translation table, or version the published schema with a new explicit routing field.

## Key findings

- Event-sourced contracts should not silently change the meaning of an existing field. Add a new field and/or a new event/schema version; keep old events replayable under the old contract.
- Readers should be tolerant, but routing decisions must be explicit. A consumer should not infer a business path from an ambiguous string.
- Published integration events are immutable facts, not in-process DTOs. Their field names and values become durable language and need versioned governance.
- Local bounded-context language is still valuable. If two contexts use genuinely different concepts, keep local enums and translate through an ACL.
- A canonical published enum is justified when the value is already a cross-portfolio contract, is governed by one owner, and downstream consumers only need a stable reference to that owner-owned concept.
- If a downstream context needs a derived business route, publish or compute a named derived field instead of overloading the upstream enum.

## Klubhaus Elf-specific extraction

| Best practice | FMX implication |
|---|---|
| Do not mutate old event meaning | ADR-0070 `schemaVersion: 1` with `qualityProfileClass` stays historically readable |
| Version contract changes | If FMX-147 is approved, use `FixtureCommercialProfilesPublished.schemaVersion: 2` |
| Canonical enum only for shared concepts | The four match quality profiles are already portfolio-wide in ADR-0026, ADR-0096 and `match-engine.md`; they are a valid canonical published enum |
| Keep routing explicit | Add a derived `settlementPath` so CommercialPortfolio does not infer settlement behavior from a generic class string |
| Preserve BC autonomy | CommercialPortfolio may still translate into an internal local policy enum behind its ACL, but the published language should not carry a second, conflicting profile taxonomy |

## Source trail

- Perplexity research pass, 2026-06-12: enum drift across bounded contexts, DDD published language, ACL translation, event versioning and deterministic routing.
- Microsoft Azure Architecture Center, Event Sourcing pattern - events are immutable records, event schemas evolve through versioning and consumers rebuild projections from the event log: <https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing>
- microservices.io, Event Sourcing pattern - state changes are captured as an event sequence and consumers rebuild state by replaying events: <https://microservices.io/patterns/data/event-sourcing.html>
- EventSourcingDB documentation, event versioning and CQRS/DDD guidance - event names/versions should be explicit and projections can be rebuilt from stable events: <https://docs.eventsourcingdb.io/>

## Notes for synthesis

FMX-147 should treat the four match quality profiles as the canonical published vocabulary and add an explicit settlement-route field. Keeping only the old three-value `qualityProfileClass` preserves the drift; replacing it in-place would violate event-contract immutability. The safest apply line is a schema v2 amendment that deprecates, but does not reinterpret, v1.
