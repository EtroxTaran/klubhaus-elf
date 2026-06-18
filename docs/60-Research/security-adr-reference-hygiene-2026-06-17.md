---
title: Security ADR Reference Hygiene
status: current
tags: [research, adr, reference-hygiene, threat-model, security, server-authority, fmx-182]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-182
related:
  - [[raw-perplexity/raw-security-adr-reference-hygiene-2026-06-17]]
  - [[raw-perplexity/raw-security-adr-reference-hygiene-source-checks-2026-06-17]]
  - [[../40-Execution/fmx-182-security-adr-reference-hygiene-decision-record-2026-06-17]]
  - [[pre-mortem/threat-model]]
  - [[pre-mortem/PM-2026-05-20-05-security-and-integrity]]
  - [[pre-mortem/PM-2026-05-20-06-distributed-match-compute]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
---

# Security ADR Reference Hygiene

FMX-182 reconciles old security pre-mortem references after the ADR number space
changed. It does not create a new architecture decision.

## Current owner map

| Historical / stale reference | Current truth | Consequence |
|---|---|---|
| `ADR-0026 Command Signing` | [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]] is the accepted command integrity and replay-protection home. [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]] remains only the Match Frame Contract. | Use ADR-0115 for command-integrity decisions. Do not cite ADR-0026 for security command signing. |
| `ADR-0028 Save Trust Levels` | [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]] is the accepted save trust/provenance home. [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]] remains only the Postgres transactional outbox. | Use ADR-0116 for save trust, provenance and public eligibility. Do not cite ADR-0028 for save trust. |
| `ADR-0027 BYOC Match Validation Quorum` | No accepted BYOC ADR exists. BYOC remains future-scope and unassigned; [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] remains only the PostgreSQL data model. | Use "future BYOC decision record/ADR, unassigned" until a fresh gate passes. |

## Status vocabulary

The pre-mortem corpus uses `status: mitigated` for research findings. After
FMX-182, that status means **conceptually addressed by accepted decision
records** unless a linked implementation artifact says the control is actually
built and verified.

For FMX-182 specifically:

- 05-F-02 command integrity is conceptually addressed by ADR-0115.
- 05-F-01 save trust/provenance is conceptually addressed by ADR-0116.
- BYOC Report 06 remains `accepted-risk` / future-scope. Its future quorum
  design has no ADR number.

## Evidence summary

| Evidence | Finding | FMX consequence |
|---|---|---|
| [[raw-perplexity/raw-security-adr-reference-hygiene-2026-06-17]] | Perplexity discovery recommended preserving the historical trail, not reusing ADR numbers, and separating conceptual mitigation from implementation. | Keep current ADR-0026/0027/0028 meanings; add correction notes and owner map. |
| [[raw-perplexity/raw-security-adr-reference-hygiene-source-checks-2026-06-17]] | Nygard, the ADR repository and AWS ADR practice support stable ADR numbering, explicit superseding/amendment links and separate design exploration. | Save raw research, source checks, synthesis and decision record; no new ADR stub is needed. |
| Game/server-authority source checks | Unity, LootLocker and Gambetta support server-authoritative validation for competitive/public surfaces and treating client artifacts as evidence rather than authority. | ADR-0115/ADR-0116 wording remains correct: command signatures and save envelopes are provenance/validation inputs, not client authority. |

## Applied hygiene

- Added dated correction notes to current ADR-0026, ADR-0027 and ADR-0028 so a
  reader cannot infer old security meanings from their IDs.
- Corrected the pre-mortem hub, findings registry, prioritization matrix and
  Report 06 BYOC placeholder.
- Kept archive gap-report wording historical but clarified that accepted current
  homes are ADR-0115/ADR-0116 and BYOC has no MVP ADR.
- Updated the Decision Log and hot front doors so future work sees the owner
  map before opening the older pre-mortem documents.

## Recommendation

Keep FMX-182 as a reference-hygiene decision record, not an ADR. The accepted
security decisions already exist in ADR-0115 and ADR-0116; a future BYOC ADR
must be created only if the BYOC gate is reopened with fresh research and Nico
approval.
