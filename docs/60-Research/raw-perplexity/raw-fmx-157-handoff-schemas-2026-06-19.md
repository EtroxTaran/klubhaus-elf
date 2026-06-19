---
title: Raw Perplexity - FMX-157 Handoff Schemas
status: raw
tags: [research, raw, perplexity, fmx-157, ddd, contracts, events, handoff]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-157
sourceType: raw-perplexity
related:
  - [[../manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  - [[raw-fmx-157-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
---

# Raw Perplexity - FMX-157 Handoff Schemas

## Prompt focus

Research DDD handoff-schema patterns for `ExternalYouthProspectIdentified`,
`YouthLoaned`, Manager & Legacy youth signals and opposition-scouting reports.
Compare producer-owned Published Language events, consumer-owned ACL
projections, shared kernels and snapshot-only handoffs.

## Captured findings

- Producer-owned Published Language events are the safer default when a fact
  crosses a bounded-context boundary.
- Consumers should store their own ACL projection or snapshot for long-lived
  use instead of joining the producer's tables.
- Fat shared events and shared kernels reduce short-term mapping work but create
  semantic coupling and versioning pressure.
- Schema versioning, event identity, correlation/causation ids and idempotency
  keys are part of the public contract, not implementation decoration.
- Long-running simulations benefit from reference-plus-snapshot payloads:
  stable producer refs for traceability plus copied fields needed for replay and
  deterministic consumer behavior.

## Raw recommendation

- Keep `ExternalYouthProspectIdentified` producer-owned by Scouting and
  consumed by Youth Academy.
- Keep `YouthLoaned` producer-owned by Youth Academy and consumed by Transfer's
  Loan-Orchestration Process Manager.
- Keep Manager & Legacy as a summary consumer. It should receive immutable
  youth/academy summary facts, not detailed cohort truth.
- Use versioned event envelopes and consumer ACL projections. Do not introduce a
  shared youth/scouting kernel.

## Source-quality notes

- The Perplexity pass had useful DDD framing but weak individual citations.
- Source-checks against Microsoft/Fowler/Microservices.io provide the stronger
  basis for the final synthesis.
- Payload field names in the raw pass were intentionally treated as sketches,
  then narrowed in the synthesis to avoid PII-heavy youth/player identity data.

## Related

- [[../manager-legacy-scouting-youth-feed-followups-2026-06-19]]
- [[raw-fmx-157-source-checks-2026-06-19]]
- [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
- [[../../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
- [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
- [[../../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
