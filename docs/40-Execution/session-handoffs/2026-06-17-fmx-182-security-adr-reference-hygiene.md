---
title: "Session handoff: FMX-182 security ADR reference hygiene"
status: current
tags: [handoff, adr, reference-hygiene, security, threat-model, fmx-182]
created: 2026-06-17
updated: 2026-06-17
type: handoff
binding: false
linear: FMX-182
related:
  - [[../../60-Research/security-adr-reference-hygiene-2026-06-17]]
  - [[../fmx-182-security-adr-reference-hygiene-decision-record-2026-06-17]]
  - [[../../60-Research/pre-mortem/threat-model]]
  - [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
---

# Session handoff: FMX-182 security ADR reference hygiene

## Goals

Reconcile stale security ADR references in the pre-mortem/threat-model corpus
without creating a new architecture decision or reusing ADR numbers.

## Completed

- Saved raw Perplexity discovery, source checks, synthesis and decision record.
- Added short FMX-182 correction notes to current ADR-0026, ADR-0027 and
  ADR-0028.
- Corrected stale ADR-0114/0115 off-by-one references in the pre-mortem hub and
  findings registry.
- Replaced the stale `ADR-0027 BYOC Match Validation Quorum` placeholder with
  future-scope/unassigned wording.
- Updated the Decision Log and hot front doors.

## Open Tasks

- Future BYOC work remains unassigned and requires a fresh gate before any ADR
  number exists.
- Future implementation tickets for ADR-0115/ADR-0116 must add verification
  evidence before claiming controls are built.

## Decisions Made

Nico selected the recommended FMX-182 path: use current owners ADR-0115/ADR-0116,
leave BYOC future-scope/unassigned, treat pre-mortem `mitigated` as conceptual
mitigation and add only concise correction notes to ADR-0026/0027/0028.

## Blockers

None for reference hygiene.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-security-adr-reference-hygiene-2026-06-17]]
- [[../../60-Research/raw-perplexity/raw-security-adr-reference-hygiene-source-checks-2026-06-17]]
- [[../../60-Research/security-adr-reference-hygiene-2026-06-17]]
- [[../fmx-182-security-adr-reference-hygiene-decision-record-2026-06-17]]
- [[../../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
- [[../../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
- [[../../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]

## Promotion Needed

No ADR/GDDR promotion is needed. FMX-182 is a docs reference-hygiene decision
record; ADR-0115 and ADR-0116 remain the accepted security homes.
