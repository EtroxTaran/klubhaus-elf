---
title: FMX-182 Security ADR Reference Hygiene Decision Record
status: current
tags: [execution, decision-record, adr, reference-hygiene, security, threat-model, accepted, fmx-182]
created: 2026-06-17
updated: 2026-06-17
type: decision-record
binding: false
linear: FMX-182
related:
  - [[../60-Research/security-adr-reference-hygiene-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-security-adr-reference-hygiene-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-security-adr-reference-hygiene-source-checks-2026-06-17]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
---

# FMX-182 Security ADR Reference Hygiene Decision Record

## Context

Older pre-mortem/threat-model drafts used ADR-0026, ADR-0027 and ADR-0028 as
security placeholders:

- ADR-0026 Command Signing
- ADR-0027 BYOC Match Validation Quorum
- ADR-0028 Save Import/Export Trust Levels

The current accepted ADR number space assigns those IDs to unrelated decisions:
ADR-0026 Match Frame Contract, ADR-0027 PostgreSQL Data Model and ADR-0028
PostgreSQL Transactional Outbox. FMX-184 already created the accepted security
homes ADR-0115 and ADR-0116. FMX-182 reconciles the remaining reference drift.

## Decisions recorded

| ID | Question | Options considered | Nico decision |
|---|---|---|---|
| D1 | Where should stale security references point? | Use current accepted owners ADR-0115/ADR-0116 and leave BYOC unassigned; create new ADR stubs; keep old numbers as aliases. | **Use current accepted owners.** ADR-0115 owns command integrity/replay; ADR-0116 owns save trust/provenance; BYOC remains future-scope/unassigned. |
| D2 | What does pre-mortem `status: mitigated` mean here? | Conceptually addressed by accepted ADR; implemented/verified control; downgrade to open. | **Conceptual mitigation.** `mitigated` means the risk is conceptually closed by an accepted decision unless implementation evidence says otherwise. |
| D3 | How much should current ADR-0026/0027/0028 files change? | No notes; short correction notes; full historical appendix. | **Short notes.** Add concise FMX-182 correction notes only; do not change their accepted scope. |

## Accepted contract

- ADR-0026 is only Match Frame Contract.
- ADR-0027 is only PostgreSQL Data Model.
- ADR-0028 is only PostgreSQL Transactional Outbox.
- ADR-0115 is the accepted home for command integrity and replay protection.
- ADR-0116 is the accepted home for save trust levels and provenance.
- BYOC Match Validation Quorum has no accepted ADR number and stays future-scope
  until a fresh gate passes.
- Pre-mortem `status: mitigated` is a conceptual docs status, not an
  implementation-complete claim.

## Evidence

- Raw Perplexity:
  [[../60-Research/raw-perplexity/raw-security-adr-reference-hygiene-2026-06-17]]
- Source checks:
  [[../60-Research/raw-perplexity/raw-security-adr-reference-hygiene-source-checks-2026-06-17]]
- Synthesis:
  [[../60-Research/security-adr-reference-hygiene-2026-06-17]]

## Follow-up

- Future BYOC work needs a new issue, fresh source checks, a dedicated
  threat-model review and a new ADR number after Nico approves reopening that
  gate.
- Future implementation tickets for ADR-0115/ADR-0116 must cite their own
  verification artifacts before claiming controls are shipped.
