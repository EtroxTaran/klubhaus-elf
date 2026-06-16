---
title: FMX-186 Erasure vs HGB retention decision record
status: accepted
tags: [execution, decision-queue, gdpr, erasure, retention, hgb, ao, payments, privacy, shared-history, fmx-186]
created: 2026-06-16
updated: 2026-06-16
type: decision-queue
binding: true
linear: FMX-186
related:
  - [[../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[../40-Compliance/payment-retention-legal-review-evidence-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-erasure-hgb-retention-partition-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-account-deletion-purchase-retention-game-platforms-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-erasure-hgb-retention-shared-history-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-erasure-hgb-retention-source-checks-2026-06-16]]
  - [[../30-Implementation/privacy-and-consent]]
  - [[../30-Implementation/audit-trail]]
---

# FMX-186 Erasure vs HGB Retention Decision Record

This is the accepted HITL decision record for FMX-186. It records Nico's
choices after Perplexity-first research, official source checks and
game/platform precedent analysis.

Legal/accounting review is still required before real payment data is
processed. That review can refine fields/provider ownership without reopening
the accepted architecture principle.

## Decision Summary

Nico accepted the recommended packet on 2026-06-16:

| Decision | Accepted option | Result |
|---|---|---|
| D1 - Retention basis | **Law split** | Use the current HGB/AO split: 10 years books/annual-accounting records, 8 years booking vouchers/invoices/receipts, 6 years commercial/tax correspondence, counted from calendar-year end. |
| D2 - Identity partition | **Detach mapping** | Delete game account/profile/private-save data; retain legally required finance/audit facts; destroy or sever `account_id -> finance_subject_id` mapping as far as legally possible; restrict retained records to retention/legal purposes. |
| D3 - Shared history | **Hybrid retain** | Delete private data; anonymize shared multiplayer/UGC/economy history; retain minimal pseudonymous moderation/fraud/chargeback/audit evidence under narrow legal purposes. |

## Source-Checked Basis

- GDPR Article 17 has legal-obligation and legal-claims exceptions.
- HGB 257 and AO 147 source checks correct older broad "10 years for records"
  wording: FMX uses the current 10/8/6 split.
- AO 147 requires electronic records to remain readable/evaluable, so account
  cryptographic erasure cannot be the only decryption path for retained finance
  records.
- Apple/Google policy checks support clear account-deletion routes and
  disclosed retention for regulatory/security reasons.
- Comparable game/platform patterns support deleted-profile placeholders for
  shared history rather than either full deletion of other players' records or
  unchanged retention of old profile identity.

## Options Considered

### D1 - Retention basis

| Option | Meaning | Assessment |
|---|---|---|
| **A. Law split** | 10 years books/annual-accounting records, 8 years booking vouchers, 6 years commercial/tax correspondence. | **Accepted.** Official HGB/AO source checks support this. |
| B. Generic 10/6 shorthand | Older SaaS shorthand. | Rejected; stale for booking vouchers. |
| C. Provider-only retention | Future MoR/PSP/store holds all records. | Possible only after provider/legal review proves FMX is not the relevant record holder. |

### D2 - Identity partition

| Option | Meaning | Assessment |
|---|---|---|
| **A. Detach mapping** | Separate account identity from retained finance facts and erase the mapping after final purge unless a legal hold remains. | **Accepted.** Minimizes re-identification while preserving legal evidence. |
| B. Keep account id forever | Easy support lookup. | Rejected; direct identity over-retention. |
| C. Fully anonymize immediately | No re-identification path. | Rejected where invoice/dispute/tax facts must remain meaningful. |

### D3 - Shared history

| Option | Meaning | Assessment |
|---|---|---|
| **A. Hybrid retain** | Delete private account/saves, anonymize shared MP/UGC/economy history and retain minimal pseudonymous safety/legal evidence. | **Accepted.** Preserves coherent game worlds and legal/safety evidence without preserving deleted identity. |
| B. Delete all shared traces | Remove every shared record involving the user. | Rejected; breaks other players' records and can destroy moderation/legal evidence. |
| C. Keep shared history unchanged | Preserve old display names/profile links. | Rejected; over-retains deleted identity. |

## Decision Record

- 2026-06-16: FMX-186 selected after live Linear/worktree/GitHub triage.
- 2026-06-16: FMX-186 moved from `Backlog` to `In Progress`.
- 2026-06-16: Clean worktree/branch created:
  `codex/fmx-186-erasure-hgb-retention-partition`.
- 2026-06-16: Perplexity-first research captured for legal/field partition,
  game/platform precedent and shared-history handling.
- 2026-06-16: Official source checks captured for GDPR Articles 17/4/5, HGB
  257, AO 147, Apple and Google deletion/disclosure policy, plus FMX local
  source checks.
- 2026-06-16: Nico accepted D1-D3 above; ADR-0127 promoted to accepted.

## Resulting Packet

- [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  is accepted / binding.
- [[../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]] remains the
  source-checked research basis.
- [[../40-Compliance/payment-retention-legal-review-evidence-2026-06-16]] is
  the legal/accounting evidence gate before paid activation.
- Future code phase must add deterministic DSAR/deletion partitioner tests:
  retained facts may contain only allowlisted finance/shared-history fields and
  no unexpected direct account/profile/session/device/IP/private-save identity.

## Related

- [[../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]]
- [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
- [[../40-Compliance/payment-retention-legal-review-evidence-2026-06-16]]
- [[../60-Research/raw-perplexity/raw-erasure-hgb-retention-partition-2026-06-16]]
- [[../60-Research/raw-perplexity/raw-account-deletion-purchase-retention-game-platforms-2026-06-16]]
- [[../60-Research/raw-perplexity/raw-erasure-hgb-retention-shared-history-2026-06-16]]
- [[../60-Research/raw-perplexity/raw-erasure-hgb-retention-source-checks-2026-06-16]]
