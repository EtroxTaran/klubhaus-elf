---
title: "Raw - DriftConsumerPolicyRef DDD and event-sourcing research"
status: raw
tags: [research, raw, perplexity, ddd, event-sourcing, published-language, anti-corruption-layer, determinism, world-drift, fmx-139]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-139
related:
  - [[../drift-consumer-policy-ref-contract-2026-06-17]]
  - [[raw-drift-consumer-policy-ref-source-checks-2026-06-17]]
  - [[../../40-Execution/fmx-139-drift-consumer-policy-ref-decision-queue-2026-06-17]]
  - [[../../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
---

# Raw - DriftConsumerPolicyRef DDD and event-sourcing research

## Prompt

For a DDD/event-sourced football manager simulation, research best practices for
event contracts that contain references to policy/catalog records consumed by
other bounded contexts. Focus on deterministic replay, event versioning,
published language, anti-corruption layers, and whether events should carry only
a stable reference, a full resolved snapshot, or a hybrid.

## Perplexity Capture

Perplexity recommended **hybrid events**: stable identifiers plus the minimal
denormalized fields needed for deterministic replay. The policy/catalog model
should stay behind an Anti-Corruption Layer and events should use explicit
versions plus published language.

Main findings:

- Event sourcing only gives reliable replay if state can be rebuilt from the
  event log without consulting mutable external state.
- Cross-context events should express business intent and use published
  language, not the producer's internal table/model shape.
- Event payloads should include an explicit version; consumers should tolerate
  additive fields and use upcasters or new event types for semantic changes.
- Reference-only events are compact, but replay becomes fragile unless the
  referenced catalog version is immutable and historically available.
- Full snapshots are replay-safe, but large and duplicative.
- Hybrid events best fit long-save sports simulation because they preserve the
  exact decision inputs needed for replay while keeping traceable catalog refs
  for UI enrichment and audits.

Options returned by Perplexity:

| Option | Meaning | Raw assessment |
|---|---|---|
| Stable reference only | Event carries `policyId` / `policyVersionId` only. | Small and clean, but deterministic replay depends on historical catalog availability. |
| Full resolved snapshot | Event embeds all policy/rule values used. | Replay-safe, but bloats events and duplicates catalog content. |
| Hybrid | Event carries stable ref + version + minimal resolved fields needed by consumers. | Recommended compromise for deterministic simulations. |

Recommended event pattern from the raw pass:

```json
{
  "policyRefId": "stable-ref",
  "policyCatalogVersion": 3,
  "policyLabelKey": "world_drift.forced_sale.severe",
  "resolvedSnapshot": {
    "severity": "hard-restriction",
    "durationSeasonBand": { "min": 1, "max": 3 },
    "constraintTags": ["forced_sale", "transfer_restriction"],
    "explanationTags": ["owner_instability", "regulatory_pressure"]
  }
}
```

## Raw Source URLs Returned

- <https://martinfowler.com/eaaDev/EventSourcing.html>
- <https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing>
- <https://martendb.io/events/learning>
- <https://event-driven.io/en>
- <https://talkpython.fm/episodes/show/548/event-sourcing-design-pattern>
- <https://artium.ai/insights/event-sourcing-when-is-it-right-to-use>

## Source-Quality Notes

The Microsoft, Fowler and Marten sources were source-checked separately in
[[raw-drift-consumer-policy-ref-source-checks-2026-06-17]]. Podcast, blog,
StackOverflow, Reddit and YouTube material from the broader Perplexity answer is
retained only as pattern discovery.

