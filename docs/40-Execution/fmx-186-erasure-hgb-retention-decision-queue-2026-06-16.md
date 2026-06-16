---
title: FMX-186 Erasure vs HGB retention decision queue
status: pending
tags: [execution, decision-queue, gdpr, erasure, retention, hgb, ao, payments, privacy, shared-history, fmx-186]
created: 2026-06-16
updated: 2026-06-16
type: decision-queue
binding: false
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

# FMX-186 Erasure vs HGB Retention Decision Queue

This is the HITL decision queue for FMX-186. It records the recommended packet
after Perplexity-first research, official source checks and game/platform
precedent analysis.

No FMX-186 architecture, gameplay or legal position is binding until Nico
answers D1-D7 and legal/accounting review confirms the retained finance fields
before real payment data is processed.

## Recommendation Summary

Recommended packet: **D1-D7 = A/A/A/A/A/A/A**.

| Decision | Recommended option | Result if accepted |
|---|---|---|
| D1 - Artifact shape | **A. Dedicated draft ADR plus privacy/compliance updates** | Keep FMX-186 visible as draft ADR-0127, update existing privacy/audit/compliance notes as non-binding references, and avoid burying the rule only in research. |
| D2 - Retention basis | **A. Current HGB/AO law split** | Use the current 10 years books/annual-accounting records, 8 years booking vouchers/invoices/receipts and 6 years commercial/tax correspondence split, counted from calendar-year end. |
| D3 - Field partition | **A. Explicit field table** | Classify every payment/receipt/shared-history field as `erase_now`, `pseudonymize`, `retain_as_fact` or `do_not_store`. |
| D4 - Key/domain partition | **A. Separate finance key domain** | Keep account/save key erasure true while legally retained finance records remain readable until expiry. |
| D5 - Account-to-finance mapping | **A. Erase/sever after final purge** | Remove normal `account_id -> finance_subject_id` lookup after final account purge unless a named dispute/legal hold requires temporary retention. |
| D6 - UX/shared-history posture | **A. Clear deletion notice plus deleted-profile placeholders** | Disclose finance retention, offer invoice export before deletion, keep shared histories coherent with deleted-profile placeholders, and prevent retained facts from resurrecting access. |
| D7 - Activation gate | **A. Legal/accounting review before paid activation** | Do not ship payment code/schema/provider setup until legal/accounting confirms fields, provider roles, retention periods and notices. |

## Source-Checked Basis

- GDPR Article 17 has legal-obligation and legal-claims exceptions.
- HGB 257 and AO 147 source checks correct older broad "10 years for records"
  wording: FMX should use the current 10/8/6 split.
- AO 147 requires electronic records to remain readable/evaluable, so account
  cryptographic erasure cannot be the only decryption path for retained finance
  records.
- Apple/Google policy checks support clear account-deletion routes and
  disclosed retention for regulatory/security reasons.
- Comparable game/platform patterns support deleted-profile placeholders for
  shared history rather than either full deletion of other players' records or
  unchanged retention of old profile identity.

## Decision Questions

### D1 - Artifact Shape

| Option | Meaning | Assessment |
|---|---|---|
| **A. Dedicated draft ADR plus privacy/compliance updates** | Keep ADR-0127 as the proposed source of truth and link it from privacy, audit, compliance, pre-mortems and front doors. | **Recommended.** FMX-186 affects architecture, privacy, compliance and future tests; a named draft ADR keeps the gate visible. |
| B. Research packet only | Leave the rule in research until paid flows are closer. | Too easy to miss during future payment/schema work. |
| C. Compliance checklist only | Track it as legal evidence without an ADR. | Understates the architectural key/domain and DSAR partitioner impact. |

### D2 - Retention Basis

| Option | Meaning | Assessment |
|---|---|---|
| **A. Current HGB/AO law split** | 10 years books/annual-accounting records, 8 years booking vouchers, 6 years commercial/tax correspondence. | **Recommended.** Official HGB/AO source checks support this and correct stale shorthand. |
| B. Generic 10/6 shorthand | Older SaaS shorthand. | Not recommended; stale for booking vouchers. |
| C. Provider-only retention | Future MoR/PSP/store holds all records. | Possible only after provider/legal review proves FMX is not the relevant record holder. |

### D3 - Field Partition

| Option | Meaning | Assessment |
|---|---|---|
| **A. Explicit field table** | Classify each field as erase, pseudonymize, retain or do-not-store. | **Recommended.** Makes DSAR/deletion behavior testable and prevents silent over-retention. |
| B. Record-level retention only | Keep/delete whole invoice/payment/support records. | Too blunt; either deletes required facts or retains too much identity. |
| C. Provider-policy only | Defer field rules until the provider is selected. | Useful later, but too late for FMX architecture and privacy promises. |

### D4 - Key/Domain Partition

| Option | Meaning | Assessment |
|---|---|---|
| **A. Separate finance key domain** | Account/save keys are destroyed at account purge; statutory finance records use their own retention key path. | **Recommended.** Preserves cryptographic erasure while keeping records readable/evaluable under AO. |
| B. Encrypt finance with account key | Simpler key model. | Not recommended; account erasure would make statutory records unreadable. |
| C. Plain retained finance rows | Avoid key complexity. | Not recommended; weakens privacy and security posture. |

### D5 - Account-To-Finance Mapping

| Option | Meaning | Assessment |
|---|---|---|
| **A. Erase/sever after final purge** | Delete normal account mapping; retain only restricted invoice/PSP/legal-hold lookup paths. | **Recommended.** Best balance of legal retention, minimization and supportability. |
| B. Keep account id forever | Support lookup remains easy. | Not recommended; direct identity over-retention. |
| C. Fully anonymize immediately | No re-identification path after deletion. | Not recommended where invoice/dispute/tax evidence or legal claims need meaningful records. |

### D6 - UX / Shared History

| Option | Meaning | Assessment |
|---|---|---|
| **A. Clear notice plus deleted-profile placeholders** | Disclose finance retention, offer invoice export before deletion, anonymize shared MP/UGC/economy history and retain only minimal pseudonymous safety/legal evidence. | **Recommended.** Matches platform expectations and keeps other players' worlds coherent without preserving old profile identity. |
| B. Delete all shared traces | Remove every shared record involving the user. | Not recommended; breaks other players' histories and can destroy safety/legal evidence. |
| C. Keep shared history unchanged | Preserve old display names/profile links. | Not recommended; over-retains deleted identity. |

### D7 - Activation Gate

| Option | Meaning | Assessment |
|---|---|---|
| **A. Legal/accounting review before paid activation** | Treat the FMX-186 field table as an architecture proposal until reviewer sign-off confirms provider role, retained fields, retention periods and notices. | **Recommended.** This is a legal/accounting boundary, not a pure engineering choice. |
| B. Implement from the draft table now | Let engineering fill provider-specific gaps later. | Not recommended; premature and legally risky. |
| C. Block all paid planning until legal review | Do no architecture planning before external review. | Too slow; the draft partition is useful as an input to review. |

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
- 2026-06-16: Draft ADR-0127 and this decision queue prepared. Awaiting Nico
  D1-D7.

## Resulting Packet If Accepted

- [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  can be promoted from draft to accepted/binding after Nico's D1-D7 approval.
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
