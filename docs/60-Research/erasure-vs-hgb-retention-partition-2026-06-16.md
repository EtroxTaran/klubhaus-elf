---
title: Erasure vs HGB retention partition
status: current
tags: [research, synthesis, gdpr, erasure, retention, hgb, ao, payments, finance-records, privacy, fmx-186]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-186
related:
  - [[raw-perplexity/raw-erasure-hgb-retention-partition-2026-06-16]]
  - [[raw-perplexity/raw-account-deletion-purchase-retention-game-platforms-2026-06-16]]
  - [[raw-perplexity/raw-erasure-hgb-retention-shared-history-2026-06-16]]
  - [[raw-perplexity/raw-erasure-hgb-retention-source-checks-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
  - [[../40-Compliance/payment-retention-legal-review-evidence-2026-06-16]]
  - [[../30-Implementation/privacy-and-consent]]
  - [[../30-Implementation/audit-trail]]
  - [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
---

# Erasure vs HGB Retention Partition

## Scope

FMX-186 closes the planning gap between:

- GDPR Article 17 account erasure in [[../30-Implementation/privacy-and-consent]];
- the existing cryptographic account/save erasure guarantee in §8.2 of that
  note;
- German commercial/tax record retention under HGB 257 and AO 147 for future
  payment/receipt facts;
- older pre-mortem runbooks RB-S3 and RB-08-2, which sketch the right direction
  but do not give a field-level rule.

This synthesis is the non-binding research basis for proposed
[[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
and the Nico decision queue
[[../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]].

No payment code, payment provider, tax setup or schema is introduced in this
docs-only beat.

## Evidence Synthesis

### Legal/real-world

The source checks establish four constraints:

- GDPR Article 17 erasure has exceptions for legal obligations and legal
  claims. This is the route for statutory payment/receipt retention.
- HGB 257 and AO 147 use the current **10/8/6-year** retention split:
  - 10 years for books, inventories, opening balance sheets, annual financial
    statements, management reports and required organization/work instructions;
  - 8 years for booking vouchers;
  - 6 years for received/sent commercial letters and other taxation-relevant
    documents;
  - the period starts at the end of the relevant calendar year.
- AO 147 requires electronic records to remain readable/evaluable. Burning the
  only decryption path through account-key erasure would break that duty.
- Pseudonymization is not anonymization if a mapping, invoice id, PSP
  transaction reference or support/legal process can re-identify the user.

Therefore FMX should not promise "all payment data disappears immediately" if
payments enter scope. The correct posture is:

1. delete or cryptographically destroy account/save/social/gameplay identity
   data;
2. sever identity mappings from statutory finance facts;
3. retain only the minimal finance facts under a restricted legal/accounting
   purpose until statutory expiry;
4. delete the remaining finance facts after expiry.

### Platform/game precedent

Apple and Google both require account-deletion routes when account creation is
supported, and Google explicitly recognizes disclosed retention for security,
fraud or regulatory compliance. Comparable games/platforms generally delete or
de-link profile/social/gameplay access while keeping back-office purchase
history for tax, refund and dispute needs.

FMX should copy the **clear disclosure and separation** pattern, not a support-
only deletion flow. The Privacy Center should let the user export purchase or
invoice records before final deletion, and post-deletion game history should
use deleted-user placeholders instead of preserving old display names.

## Recommended Posture

Recommended FMX-186 posture for Nico's decision:

- use the current HGB/AO law split (10 years books/annual-accounting records,
  8 years booking vouchers/invoices/receipts, 6 years commercial/tax
  correspondence);
- detach the game-account identity mapping from retained finance facts as far
  as legally possible;
- use the hybrid shared-history model: delete private profile/singleplayer
  data, anonymize shared MP/UGC/economy history and retain only minimal
  pseudonymous moderation/fraud/chargeback/audit evidence under narrow legal
  purposes.

Legal/accounting review remains required before real paid flows ship.

The recommended rule:

- `finance_records` is a separate legal/accounting retention class, not an
  extension of account/profile data and not the dropped platform `audit_log`.
- Account erasure burns account/save keys and deletes account-owned identity
  material exactly as [[../30-Implementation/privacy-and-consent]] §8.2 already
  says.
- Retained payment/receipt facts use a separate finance key domain so statutory
  records stay readable until expiry.
- The account-to-finance mapping is erasable after the 30-day grace/final purge
  unless a specific legal hold/dispute requires temporary access.
- Back-office lookup after final erasure is restricted to invoice id, PSP
  transaction reference, refund/chargeback id or legal-hold id.
- Retained facts cannot resurrect gameplay access, entitlements, supporter
  status, saves or social identity after account deletion.

## Classification Vocabulary

| Classification | Meaning |
|---|---|
| `erase_now` | Delete or cryptographically destroy at final account purge. |
| `pseudonymize` | Replace direct identity with a finance subject id or placeholder; keep mapping only while lawful/needed. |
| `retain_as_fact` | Keep the field as part of a statutory finance record until expiry. Access is purpose-limited. |
| `do_not_store` | FMX should never store the field directly; a PSP/provider should hold it or only tokenized references are allowed. |

## Field Partition Table

Default retention buckets:

- `HGB_AO_8Y_BOOKING_VOUCHER`: invoices, receipts, payment vouchers and
  refund/chargeback vouchers. Expiry = end of transaction calendar year + 8
  years.
- `HGB_AO_10Y_BOOKS`: books, annual statements and accounting organization
  records if FMX later creates them directly. Expiry = end of calendar year + 10
  years.
- `HGB_AO_6Y_CORRESPONDENCE`: commercial/tax correspondence not classified as
  a booking voucher. Expiry = end of calendar year + 6 years.
- `SHORT_SECURITY_OR_SUPPORT`: fraud/support/security/legal-claim holds outside
  statutory finance retention; must be separately justified.

| Record type | Field | Classification | Bucket / action | Reason |
|---|---|---|---|---|
| Invoice/receipt | `invoice_id`, `invoice_number`, `invoice_version`, `created_at`, `issued_at`, `tax_point_date` | `retain_as_fact` | `HGB_AO_8Y_BOOKING_VOUCHER` unless legal/accounting classifies the record as part of `HGB_AO_10Y_BOOKS` | Needed to evidence the commercial/tax voucher. |
| Invoice/receipt | `seller_legal_entity`, `seller_vat_id`, `seller_address_snapshot` | `retain_as_fact` | `HGB_AO_8Y_BOOKING_VOUCHER` | Needed for invoice validity and tax/audit evidence. |
| Invoice/receipt | `customer_legal_name`, `billing_address`, `customer_vat_id` | `retain_as_fact` only if actually collected/required; otherwise `do_not_store` | `HGB_AO_8Y_BOOKING_VOUCHER` | B2C digital goods may not need every identity field; if on invoice, it becomes statutory evidence. |
| Invoice/receipt | `account_id`, `user_id`, `email`, `display_name`, `username` | `pseudonymize` / `erase_now` | Replace with `finance_subject_id`; erase direct fields at final purge unless printed on legal invoice snapshot. | Direct account identity is not needed for normal retained fact lookup. |
| Invoice/receipt | `country`, `vat_country`, `tax_region`, `vat_rate`, `vat_amount_minor`, `net_amount_minor`, `gross_amount_minor`, `currency` | `retain_as_fact` | `HGB_AO_8Y_BOOKING_VOUCHER` | Needed for tax calculation, OSS/VAT evidence and reconciliation. |
| Invoice/receipt | `sku`, `product_family`, `quantity`, `unit_price_minor`, `discount_code`, `coupon_amount_minor`, `fulfilment_timestamp` | `retain_as_fact` | `HGB_AO_8Y_BOOKING_VOUCHER` | Needed to prove what was sold and how it was priced/delivered. |
| Payment transaction | `provider`, `provider_transaction_id`, `authorization_id`, `capture_id`, `payment_status`, `captured_at` | `retain_as_fact` | `HGB_AO_8Y_BOOKING_VOUCHER` plus legal-claim hold if dispute active | Needed for payment reconciliation and dispute evidence. |
| Payment transaction | `payment_method_type`, `psp_token_ref`, `last4`, `card_brand`, `wallet_type` | `retain_as_fact` only as token/minimal descriptor; otherwise `do_not_store` | `HGB_AO_8Y_BOOKING_VOUCHER` when needed for support/dispute evidence | Minimal method evidence only; no sensitive instrument data. |
| Payment transaction | Full card number, CVV, full IBAN, PayPal email, bank login data | `do_not_store` | PSP/provider only | FMX should not hold sensitive payment instrument data. |
| Refund/chargeback | `refund_id`, `chargeback_id`, `dispute_id`, `provider_ref`, `reason_code`, `opened_at`, `resolved_at`, `amount_minor`, `currency` | `retain_as_fact` | `HGB_AO_8Y_BOOKING_VOUCHER`; legal-claim hold while active | Needed for accounting reversals and legal/dispute evidence. |
| Entitlement/payment linkage | `entitlement_grant_id`, `grant_policy_version`, `provider_policy_version`, `withdrawal_waiver_version`, `legal_artifact_version` | `retain_as_fact` or `pseudonymize` | Keep finance-facing evidence; erase product access state with account | Proves the commercial/legal basis, not ongoing gameplay access. |
| Entitlement/payment linkage | Active ownership of cosmetics, supporter status, premium cash balance, gameplay purchase effects | `erase_now` or anonymize with game state | Account/save deletion semantics | Retained finance facts must not resurrect product access. |
| Account mapping | `account_id -> finance_subject_id` | `erase_now` after final purge unless legal hold/dispute | Mapping expires at final erasure or legal-hold expiry | Identity link is the high-risk re-identification seam. |
| Audit/security | `ip_address`, `ip_prefix`, `user_agent`, `device_id`, session id, tracking ids | `erase_now` by default; separate Audit & Security/legal hold if needed | Not part of finance record | Operational/security retention is separate from invoice retention. |
| Support correspondence | Emails/tickets about payment/refund/tax support | `pseudonymize` or `retain_as_fact` only when commercial/tax correspondence | `HGB_AO_6Y_CORRESPONDENCE` if retained | Keep only issue, outcome, invoice/PSP refs and legal minimum. |
| Private game state | private singleplayer save ids, local notes, private club names, private save metadata | `erase_now` | Account/save deletion semantics | No other player depends on these records. |
| Shared game history | multiplayer league standings, fixture results, shared economy facts, watch-party history | `pseudonymize` shared participant identity; retain non-personal shared fact | Shared-history retention with deleted-profile placeholder | Other players' histories depend on these facts, but old profile identity is not required. |
| UGC/community packs | author profile, uploader account id, personal content in pack metadata | `erase_now` / redact / `pseudonymize` | Community Overlay privacy/legal gate | Detach author identity; keep only non-personal pack facts where other users or legal/moderation evidence require it. |
| Moderation/fraud/legal evidence | report id, sanction id, chargeback/fraud case id, minimal evidence refs, decision outcome | `pseudonymize` / `retain_as_fact` under purpose lock | Legal claim, safety or dispute retention; expiry set by policy/legal hold | Retain only minimal evidence needed for appeals, repeated-abuse defense, fraud/chargeback or legal claims. |

## Key Interaction Model

The existing account erasure guarantee remains correct for account/save data:
burning `Env_user`, recovery envelopes, `accountSecret`, salts, credentials and
device records makes the user's account/save ciphertext unrecoverable.

FMX-186 adds the finance exception:

```text
account_key_domain
  owns account profile, credentials, sessions, devices, saves and user-visible
  entitlement access.
  destroyed by final account purge.

finance_key_domain
  owns statutory invoice/payment/refund voucher records.
  survives account purge until statutory expiry.

account_finance_mapping
  maps account_id -> finance_subject_id during account life and 30-day grace.
  erased at final purge unless a named dispute/legal hold keeps it temporarily.
```

This avoids two bad outcomes:

- retained finance records encrypted only with an account key become unreadable
  before statutory expiry;
- account deletion is weakened because finance storage still carries direct
  account identifiers.

## Deterministic DSAR / Deletion Partitioner

The future implementation should classify every field through a table like:

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

On `POST /api/me/delete-account`, after the existing 30-day grace:

1. Load all account-owned, save-owned, social, auth/session/device and
   telemetry records for the user.
2. Load finance records through the current mapping.
3. For every field, emit one of:
   - `erase_now`;
   - `pseudonymize`;
   - `retain_as_fact`;
   - `do_not_store`.
4. Burn account/save key material and direct identity fields.
5. Replace account identifiers on finance records with `finance_subject_id` or
   a deleted-account placeholder.
6. Delete the normal account-to-finance mapping.
7. Keep a restricted retention manifest containing retained record ids,
   retention bucket, expiry date, legal basis, transformation version and
   access-policy version.
8. A monthly cleanup deletes retained finance records whose expiry has passed
   and no legal hold remains. Legal holds are explicit records that can delay
   expiry; they are not a field classification.

Future code-phase gate: add a deterministic partitioner test that asserts the
retained set contains only allowlisted finance fields and no unexpected email,
display name, account id, session id, device id, IP address or save/gameplay
identifier.

## User Experience Requirements

If Nico accepts ADR-0127, product requirements around deletion should include:

- The delete modal must disclose the retained finance exception in plain DE/EN
  copy.
- The Privacy Notice retention table must show payment/receipt fields, legal
  basis, retention period and final deletion rule.
- The Privacy Center should offer purchase/invoice export before account
  deletion where finance records exist.
- DSAR exports after deletion should be possible only by restricted manual
  lookup if the direct account mapping is gone; normal account login is gone.
- Historic multiplayer/watch-party/game records should display deleted-profile
  placeholders and not preserve old display names.

## Decision Queue

The accepted decisions are recorded in
[[../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]].

## Legal Caveat

This is engineering/product research, not legal advice. Legal/accounting review
must confirm the final invoice fields, retention classification and provider
contracts before any real paid flow ships.

## Related

- [[raw-perplexity/raw-erasure-hgb-retention-partition-2026-06-16]]
- [[raw-perplexity/raw-account-deletion-purchase-retention-game-platforms-2026-06-16]]
- [[raw-perplexity/raw-erasure-hgb-retention-shared-history-2026-06-16]]
- [[raw-perplexity/raw-erasure-hgb-retention-source-checks-2026-06-16]]
- [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
- [[../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
- [[../40-Compliance/payment-retention-legal-review-evidence-2026-06-16]]
