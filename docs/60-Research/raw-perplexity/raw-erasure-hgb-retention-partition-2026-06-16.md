---
title: Raw Perplexity - Erasure vs HGB retention partition
status: raw
tags: [research, raw, perplexity, gdpr, erasure, retention, hgb, ao, payments, privacy, fmx-186]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-186
related:
  - [[../erasure-vs-hgb-retention-partition-2026-06-16]]
  - [[raw-erasure-hgb-retention-source-checks-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
---

# Raw Perplexity - Erasure vs HGB Retention Partition

## Query

For a Germany-based online game/PWA that may later sell digital goods, research
how SaaS/indie providers resolve GDPR Article 17 erasure requests against HGB
257 / AO 147 statutory retention duties at field level. Focus on:

- which invoice/payment/receipt fields are retained as accounting/tax facts;
- which fields are erased immediately;
- which fields are pseudonymized or identity-severed;
- how cryptographic account deletion can coexist with readable retained
  finance records;
- how a deterministic DSAR/account-deletion partitioner should split data into
  erase-now vs pseudonymize-and-retain sets;
- whether separate immutable finance storage and separate keys are best
  practice.

## Perplexity Discovery Notes

Perplexity's strongest answer was the pattern "tax record as fact with identity
severed":

- GDPR Article 17 is not absolute. A controller may refuse erasure for data
  needed to comply with a legal obligation or to establish, exercise or defend
  legal claims.
- German commercial/tax record retention is a separate legal obligation.
  Perplexity initially summarized this as a broad 10/6-year rule. The source
  check corrected this to the current official **10/8/6-year** split under HGB
  257 and AO 147. Do not reuse the broad summary without the source-check note.
- Finance records should be isolated from account/profile data. A dedicated
  `finance_records` store can keep invoice/tax facts while severing direct
  account identifiers after an erasure request.
- A retained record should not keep operational identity fields merely for
  convenience. It should keep only the minimum needed to prove the transaction,
  tax treatment, invoice/receipt, refund/chargeback and legal claim context.
- Pseudonymization is not anonymization. If a mapping table, support system,
  PSP dashboard or invoice number can re-identify the user, the retained
  finance record remains personal data and must be protected accordingly.
- Key separation is essential where account deletion uses cryptographic
  erasure. Account-bound encryption keys must not be the only path to decrypt
  finance records that must remain legally readable.

## Proposed Field Classification From Discovery

| Field family | Discovery classification | Rationale from Perplexity |
|---|---|---|
| Invoice/receipt id, invoice date, correction/refund id | Retain as finance fact | Needed to evidence the transaction and statutory retention duty. |
| Gross/net/tax amount, tax rate, currency, VAT country/jurisdiction | Retain as finance fact | Needed for books, tax reports, VAT/OSS evidence and audit. |
| Product/SKU, quantity, delivery/fulfilment timestamp | Retain as finance fact | Needed to prove what was sold and whether immediate delivery/refund policy applies. |
| Payment provider, PSP transaction id, authorization/capture/refund/chargeback refs | Retain as finance fact | Needed for payment reconciliation, dispute handling and audit. |
| Internal account id on finance row | Pseudonymize/identity-sever | Replace with finance subject id or delete mapping after final erasure. |
| Email, display name, username, marketing/contact fields | Erase now unless invoice law needs a copy | Account/contact convenience is not a finance fact. |
| Full payment instrument data such as full card, IBAN or PayPal email | Do not store / erase now | PSP should own sensitive payment method details; FMX keeps only method type/token/ref. |
| IP address, user agent, device id, telemetry/session ids | Erase now unless a narrow fraud/legal hold exists | Operational/security logs are separate and short-retention; not invoice facts by default. |
| Save id, club name, match history, gameplay entitlement consumption | Erase now or anonymize outside finance | Game-world state is not required for HGB/AO receipt retention. |

## DSAR Partitioner Shape From Discovery

Perplexity recommended a deterministic classifier with three output sets:

```text
erase_now:
  account profile, auth credentials, sessions, devices, local save mappings,
  social/multiplayer memberships, gameplay state, telemetry identifiers,
  support/contact convenience fields.

pseudonymize_and_retain:
  finance rows that must stay readable, with account id replaced by a finance
  subject id and with mapping/access restricted.

retain_unchanged_until_expiry:
  only statutory books/annual financial statement records where changing the
  record would damage the legal evidence. These still need purpose restriction,
  access control and retention expiry.
```

The stronger pattern is to make the partitioner table-driven:

- every field has one classification;
- every retained field names its legal basis, retention bucket and expiry
  calculation;
- every pseudonymized field names the transformation;
- every exception requires a legal-hold/fraud/dispute record.

## Key-Separation Pattern

The discovery answer recommended:

- Account data stays under account/save key material and is destroyed by the
  existing account-erasure flow.
- Finance records use a finance-context key domain, not the account master key.
- The link from account id to finance subject id is its own erasable mapping.
- After final account erasure, normal product surfaces cannot restore access or
  entitlement from finance facts; only restricted back-office/legal lookup by
  invoice id, PSP transaction ref or dispute id remains.

## Source-Quality Notes

- The retention-period summary in this discovery pass was too broad. The
  official HGB/AO source check is authoritative for FMX-186: 10 years for
  books/annual-accounting records, 8 years for booking vouchers, 6 years for
  other commercial/tax correspondence/documents, counted from calendar-year
  end.
- Perplexity mentioned SaaS/vendor playbooks but did not provide a single
  official German authority that gives a complete field-level SaaS table.
  Therefore the FMX table is an engineering/legal synthesis, not copied from a
  single regulator template.
- Legal counsel/accounting review remains mandatory before real payment data is
  processed.
