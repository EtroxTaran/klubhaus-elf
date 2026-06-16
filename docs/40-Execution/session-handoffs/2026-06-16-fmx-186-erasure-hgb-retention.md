---
title: Handoff - FMX-186 Erasure vs HGB Retention
status: wrapped
tags: [meta, execution, handoff, gdpr, erasure, retention, hgb, ao, payments, fmx-186]
created: 2026-06-16
updated: 2026-06-16
type: handoff
binding: false
related:
  - [[../../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
  - [[../../40-Compliance/payment-retention-legal-review-evidence-2026-06-16]]
---

# Handoff: FMX-186 Erasure vs HGB Retention (2026-06-16)

## Goals

- Define the field-level partition between GDPR Article 17 erasure and German
  HGB/AO payment/receipt/shared-history retention.
- Preserve Perplexity discovery, official source checks and the pending
  decision queue.
- Keep legal/accounting review explicit as the paid-activation gate.

## Completed

- Linear FMX-186 moved from Backlog to In Progress before vault work.
- `main` fast-forwarded and worktree
  `/tmp/fmx-186-erasure-hgb-retention-partition` created on
  `codex/fmx-186-erasure-hgb-retention-partition`.
- Perplexity discovery and source checks saved under
  `docs/60-Research/raw-perplexity/`.
- Research synthesis saved at
  [[../../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]].
- Draft ADR-0127, decision queue and legal-review evidence hook prepared.
- Privacy, audit, compliance and historical pre-mortem notes linked to the new
  proposed partition.

## Open Tasks

- Legal/accounting review must confirm the retained finance fields before real
  paid activation.
- Future code phase must implement the deterministic DSAR/deletion partitioner
  and retained-set tests before payment/UGC retention code ships.

## Decision Questions Pending

- Nico still needs to answer D1-D7 in
  [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]].
- Recommended packet is A/A/A/A/A/A/A: dedicated draft ADR, current HGB/AO
  10/8/6 law split, field table, separate finance key domain, erasable
  account-to-finance mapping, clear deletion UX with deleted-profile
  placeholders and legal/accounting review before paid activation.
- [[../../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  is `draft` / `binding: false`.

## Blockers

- Legal/accounting review for real payment processing and provider-specific
  retained fields.

## Durable Notes Updated

- [[../../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]]
- [[../../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
- [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
- [[../../40-Compliance/payment-retention-legal-review-evidence-2026-06-16]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../30-Implementation/audit-trail]]
- [[../../00-Index/Current-State]]

## Promotion Needed

- Nico D1-D7 approval is needed before ADR-0127 can become binding.
- The compliance evidence gate remains open before real paid activation.
