---
title: ADR-0127 Erasure vs HGB retention field partition
status: draft
tags: [adr, architecture, privacy, gdpr, erasure, retention, hgb, ao, payments, finance-records, dsar, fmx-186]
created: 2026-06-16
updated: 2026-06-16
type: adr
binding: false
linear: FMX-186
amends:
  - [[ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[ADR-0123-identity-access-context-definition]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-erasure-hgb-retention-partition-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-account-deletion-purchase-retention-game-platforms-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-erasure-hgb-retention-shared-history-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-erasure-hgb-retention-source-checks-2026-06-16]]
  - [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
  - [[../../40-Compliance/payment-retention-legal-review-evidence-2026-06-16]]
  - [[../../30-Implementation/privacy-and-consent]]
  - [[../../30-Implementation/audit-trail]]
  - [[ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[ADR-0123-identity-access-context-definition]]
---

# ADR-0127: Erasure vs HGB Retention Field Partition

## Status

draft

> **Decision gate.** This is the FMX-186 proposal only. It is non-binding until
> Nico answers D1-D7 in
> [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
> and legal/accounting review confirms the retained finance fields before real
> payment activation.

## Context

FMX already defines an account deletion flow in
[[../../30-Implementation/privacy-and-consent]]: after a 30-day grace period,
account/save key material is destroyed, direct account data is purged and audit
rows are minimized or pseudonymized.

The unresolved conflict is payments and shared history:

- GDPR Article 17 gives the user an erasure right.
- GDPR Article 17(3)(b) allows retention where processing is necessary for a
  legal obligation; Article 17(3)(e) covers legal claims.
- German HGB 257 / AO 147 require certain commercial/tax records to remain
  readable for 10/8/6 years from calendar-year end.
- Multiplayer, UGC, moderation, fraud and chargeback histories may affect other
  players, legal claims or platform safety.
- The current privacy note deferred payment/receipt retention to a future ADR.
- RB-S3 and RB-08-2 sketched pseudonymized tax records but did not specify
  fields, keys or deterministic DSAR partitioning.

Without a field-level rule, FMX could either over-delete statutory records or
over-retain account identity.

## Proposed Decision

The recommended FMX-186 posture is a hybrid erasure-vs-retention partition:

1. Account/profile/auth/session/device/private-save data follows the existing
   account-erasure flow and account-key destruction.
2. Statutory payment/receipt facts live in a separate `finance_records`
   retention class, not in account/profile tables and not in a resurrected
   platform `audit_log`.
3. Retention buckets use the current official German law split:
   - 10 years: books, annual-accounting records and required organization/work
     instructions;
   - 8 years: booking vouchers, including invoices/receipts/payment/refund
     vouchers unless legal/accounting review classifies a specific artifact
     differently;
   - 6 years: commercial/tax correspondence;
   - all counted from the end of the relevant calendar year and extended where
     tax assessment or legal-hold rules require it.
4. `finance_records` use a separate finance key domain, not the account master
   key.
5. The account-to-finance mapping is erased at final account purge unless a
   named dispute/legal hold requires temporary retention. Restricted lookup
   after erasure uses invoice id, PSP transaction reference, refund/chargeback
   id or legal-hold id.
6. Every payment/receipt field has one classification:
   `erase_now`, `pseudonymize`, `retain_as_fact` or `do_not_store`.
7. Shared multiplayer, economy, UGC and moderation history uses a hybrid
   model: delete private/account-owned data, anonymize or placeholder shared
   history that affects other users, and retain only minimal pseudonymous
   moderation/fraud/chargeback/legal evidence under narrow purpose limits.
8. Retained finance or safety facts cannot resurrect gameplay access,
   entitlements, supporter status, saves, cosmetics or social identity after
   account deletion.
9. DSAR/account deletion uses a deterministic table-driven partitioner with
   future tests that assert retained records contain no unexpected direct PII.
10. Legal/accounting review remains required before real paid flows ship.

This ADR does not introduce code, database schema, payment provider selection
or a public legal notice in the docs-only phase.

## Options Considered

### D1 - Retention legal basis

| Option | Meaning | Assessment |
|---|---|---|
| **A. Current HGB/AO law split** | Use 10 years for books/annual-accounting records, 8 years for booking vouchers and 6 years for commercial/tax correspondence, counted from calendar-year end. | **Recommended.** Source-checked against official HGB 257 and AO 147; corrects older broad 10-year shorthand. |
| B. Generic 10/6 shorthand | Treat most invoice/payment records as 10 years and correspondence as 6 years. | Not recommended; stale and too broad for booking vouchers. |
| C. Provider-only retention | Let a future MoR/PSP/store be the sole retention holder. | Possible later only if legal review proves FMX is not the record holder for the relevant facts. |

### D2 - Identity partition

| Option | Meaning | Assessment |
|---|---|---|
| **A. Detach account mapping** | Delete game account/profile data, retain legally required facts, destroy or sever `account_id -> finance_subject_id` mapping as far as lawful, and restrict retained facts to legal/retention purposes. | **Recommended.** Best balance of Article 17, HGB/AO readability and data minimization. |
| B. Keep account id on finance rows | Retention/support lookup remains easy. | Not recommended; direct identity over-retention. |
| C. Fully anonymize immediately | Remove all re-identification paths at deletion time. | Not recommended where invoice/dispute/tax records need meaningful evidence or legal claims are active. |

### D3 - Shared history / UGC / safety evidence

| Option | Meaning | Assessment |
|---|---|---|
| **A. Hybrid retain with anonymization** | Delete private singleplayer/profile data; anonymize shared MP/UGC/economy history; retain minimal pseudonymous moderation/fraud/chargeback/audit evidence under narrow legal purposes. | **Recommended.** Matches game/platform precedent and keeps other players' histories coherent without preserving deleted identity. |
| B. Delete all shared history authored by the user | Remove every multiplayer, UGC and community trace. | Not recommended; breaks other players' histories and can destroy moderation/legal evidence. |
| C. Keep shared history unchanged | Preserve old names/profile links everywhere. | Not recommended; over-retains account identity and fails the erasure expectation. |

## Field Contract

Classification enum:

```text
RetentionClassification =
  erase_now
  pseudonymize
  retain_as_fact
  do_not_store
```

Rule row:

```text
RetentionFieldRule =
  field_path
  owning_context
  record_type
  classification
  legal_basis
  retention_bucket
  expiry_rule
  transformation
  access_policy
  dsar_export_visibility
```

Canonical field table:
[[../../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]] §
"Field Partition Table".

## Key Contract

```text
account_key_domain:
  profile, credentials, sessions, devices, saves, social/gameplay access
  -> destroyed at final account purge.

finance_key_domain:
  invoice/payment/refund vouchers and finance retention manifests
  -> retained until statutory expiry.

account_finance_mapping:
  account_id -> finance_subject_id
  -> erased at final account purge unless a named legal hold/dispute keeps it.
```

`finance_subject_id` is pseudonymous, not anonymous. It must be treated as
personal data while any re-identification path exists.

## DSAR Partitioner

Future implementation must be deterministic and table-driven:

- no unclassified payment/receipt/shared-history field may ship;
- retained records must carry legal basis, retention bucket, expiry date and
  access policy;
- retained-set tests must reject direct account id, email, display name,
  username, session id, device id, IP address, user agent, private save id and
  private gameplay identifiers unless the field table explicitly allows them;
- legal holds are explicit records, not boolean flags hidden on the finance or
  moderation row;
- expiry cleanup deletes retained facts once the statutory bucket and legal
  holds have ended.

## Boundaries

- This ADR does not reopen ADR-0097's dropped platform `audit_log`.
- Audit & Security retention remains owned by ADR-0091/ADR-0119 and
  [[../../30-Implementation/audit-trail]].
- Identity & Access owns account deletion initiation and account-key erasure,
  but not payment/entitlement/finance truth.
- ADR-0109 remains the payment provider/legal activation gate.
- No player-facing game record may rely on retained finance data to restore
  gameplay access after deletion.

## Consequences

Positive:

- Article 17 erasure and HGB/AO retention become compatible by design.
- The field table makes DSAR behavior testable.
- Cryptographic account erasure remains true for account/save data.
- Finance records remain readable until statutory expiry without direct account
  identity.
- Shared game history can stay coherent without preserving deleted profiles.

Negative / constraints:

- FMX needs a small but explicit finance retention capability once payments
  exist.
- Support lookup becomes less convenient after final erasure; invoice/PSP refs
  become the allowed route.
- Legal/accounting review can change the exact invoice field set or provider
  ownership split.
- Shared-history anonymization must be designed per surface so placeholders do
  not leak identity through adjacent content.

## Supersession / Historical Inputs

This ADR supersedes RB-S3 and RB-08-2 only as implementation guidance for
payment/receipt/shared-history erasure partitioning. The pre-mortems remain
useful historical risk records.

## Related Docs

- [[../../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]]
- [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
- [[../../40-Compliance/payment-retention-legal-review-evidence-2026-06-16]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../30-Implementation/audit-trail]]
- [[ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
- [[ADR-0109-payment-provider-and-monetization-legal-gates]]
- [[ADR-0123-identity-access-context-definition]]
