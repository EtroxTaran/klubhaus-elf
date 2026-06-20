---
title: Payment retention legal review evidence
status: current
tags: [compliance, legal, gdpr, erasure, retention, hgb, ao, payments, tax, fmx-186]
context: audit-security
created: 2026-06-16
updated: 2026-06-16
type: compliance
binding: false
linear: FMX-186
related:
  - [[../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
  - [[monetization-legal-gates-evidence-2026-06-13]]
  - [[../30-Implementation/privacy-and-consent]]
---

# Payment Retention Legal Review Evidence

This is the compliance evidence hook for FMX-186. ADR-0127 is accepted as the
architecture partition, but this review stays open until legal/accounting review
approves the final payment field set and provider split.

## Gate

No real-money payment flow should be enabled until this checklist is complete
or superseded by a provider-specific legal/accounting packet.

| Evidence | Required answer | Owner | Status |
|---|---|---|---|
| HGB/AO retention bucket confirmation | Confirm whether FMX invoices/receipts are 8-year booking vouchers by default and which records, if any, become 10-year books/annual-accounting records. | Accounting/legal | proposed |
| Invoice field minimum | Confirm required B2C digital-good invoice/receipt fields for FMX's jurisdiction/provider setup. | Accounting/legal | proposed |
| Provider split | Confirm which records are held by MoR/PSP/store and which FMX must hold locally. | Legal / payments | proposed |
| Privacy Notice copy | Confirm the payment/receipt retention and deletion disclosure in DE/EN. | Legal / Privacy Lead | proposed |
| DSAR retained-set export | Confirm what retained finance facts are shown in DSAR exports before/after deletion. | Legal / engineering | proposed |
| Key separation | Confirm finance-key domain and account-key destruction interaction. | Engineering / legal | proposed |
| Mapping expiry | Confirm when `account_id -> finance_subject_id` mapping is erased and which legal-hold/dispute cases extend it. | Legal / accounting | proposed |
| Final cleanup | Confirm expiry calculation and monthly cleanup evidence for retained finance facts. | Accounting / engineering | proposed |

## Source-Checked Baseline

- GDPR Article 17 has a legal-obligation exception.
- HGB 257 and AO 147 use a 10/8/6-year retention split, counted from calendar-
  year end.
- AO 147 requires electronic records to remain readable/evaluable, so account
  cryptographic erasure must not be the only decryption path for retained
  finance records.
- Apple/Google policy checks support clear account-deletion routes and
  retention disclosures for regulatory compliance.

## Related

- [[../60-Research/erasure-vs-hgb-retention-partition-2026-06-16]]
- [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
- [[../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
- [[monetization-legal-gates-evidence-2026-06-13]]
