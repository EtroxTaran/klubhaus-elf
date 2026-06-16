---
title: Source checks - Erasure vs HGB retention partition
status: raw
tags: [research, raw, source-checks, gdpr, erasure, retention, hgb, ao, app-store, google-play, payments, fmx-186]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-186
related:
  - [[../erasure-vs-hgb-retention-partition-2026-06-16]]
  - [[raw-erasure-hgb-retention-partition-2026-06-16]]
  - [[raw-account-deletion-purchase-retention-game-platforms-2026-06-16]]
  - [[raw-erasure-hgb-retention-shared-history-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[../../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16]]
---

# Source Checks - Erasure vs HGB Retention Partition

## Official Legal Sources

| Source | Checked fact | FMX use |
|---|---|---|
| GDPR Article 17, `https://gdpr-info.eu/art-17-gdpr/` | Article 17 creates the right to erasure and lists exceptions. Article 17(3)(b) permits retention where processing is necessary for compliance with a legal obligation; Article 17(3)(e) covers legal claims. | Legal basis for retaining statutory finance records even after account erasure. |
| GDPR Article 4, `https://gdpr-info.eu/art-4-gdpr/` | Pseudonymization means personal data can no longer be attributed to a data subject without separately kept additional information and technical/organizational controls. | The finance subject id and mapping table are still personal data while re-identification remains possible. |
| GDPR Article 5, `https://gdpr-info.eu/art-5-gdpr/` | Core principles include lawfulness/transparency, purpose limitation, data minimization, storage limitation, integrity/confidentiality and accountability. | Every retained field needs a purpose, basis, retention bucket, expiry and access restriction. |
| HGB 257, `https://www.gesetze-im-internet.de/hgb/__257.html` | Official German commercial-code retention: 10 years for books/inventories/opening balance sheets/annual financial statements/group statements/management reports and required work instructions/organization documents; 8 years for booking vouchers; 6 years for received/sent commercial letters and other documents relevant to taxation. Period starts at calendar-year end. | Corrects Perplexity's broad 10/6 summary. FMX uses 10/8/6 buckets, with receipts/booking vouchers in the 8-year bucket. |
| AO 147, `https://www.gesetze-im-internet.de/ao_1977/__147.html` | Official German tax-code retention broadly mirrors the 10/8/6 split and also requires readable/evaluable machine retention where records are created electronically. Period starts at calendar-year end. | Finance records must remain readable and machine-evaluable until expiry; account-key erasure must not destroy them. |

## Platform Policy Checks

| Source | Checked fact | FMX use |
|---|---|---|
| Apple App Review Guidelines, `https://developer.apple.com/app-store/review/guidelines/` | Apps that support account creation must offer account deletion; privacy policy must describe data collection, use, retention and deletion. | Future app-shell builds need an accessible delete-account route and clear retention disclosure. |
| Google Play user data deletion, `https://support.google.com/googleplay/android-developer/answer/13327111` | Developers offering account creation must let users request account and data deletion. Google recognizes retention for security, fraud prevention or regulatory compliance when disclosed. | FMX deletion modal and Privacy Notice must disclose legally retained finance facts. |
| Steam Privacy Agreement, `https://store.steampowered.com/privacy_agreement/` | Steam discloses retention of transactional data and anonymization of match data that affects other players. | Supports FMX's hybrid shared-history model: delete profile identity, anonymize shared game facts that other players depend on and keep statutory/payment evidence separately. |

## Project Source Checks

| Source | Checked fact | FMX use |
|---|---|---|
| [[../../30-Implementation/privacy-and-consent]] | Existing F6 flow destroys account/save key material after 30-day grace but defers payment/receipt retention to a future ADR. | FMX-186 supplies the missing proposed field partition and key interaction model. |
| [[../../30-Implementation/audit-trail]] | Domain outbox and Audit & Security trails are separate from operational logs and can be minimized/pseudonymized after deletion. | FMX-186 must not recreate the dropped platform `audit_log`; payment/receipt records are a separate finance/legal retention class. |
| [[../pre-mortem/PM-2026-05-20-05-security-and-integrity]] RB-S3 | Historical sketch says audit events are pseudonymized, account data is cryptographically erased and premium tax records remain pseudonymized. | Keep as historical input; supersede with ADR-0127 for field-level payment/receipt partition. |
| [[../pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax]] RB-08-2 | Historical sketch already states HGB/AO retention can override Article 17 via Article 17(3)(b), and recommends a separate `finance_records` table. | Keep as historical input; supersede with ADR-0127 for deterministic field/key/DSAR details. |
| [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]] | FMX removed the platform `audit_log`; outbox and Audit & Security are the canonical audit surfaces. | ADR-0127 should not add a new platform audit table. |
| [[../../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]] | Identity & Access owns account/session/device/global-claim truth and excludes payments/entitlements and Audit & Security retention. | The account-to-finance mapping sits at the Identity/finance seam; finance retention is not Identity ownership. |
| [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]] | Payment/provider/legal gates are draft and require legal sign-off before paid activation. | ADR-0127 should stay non-binding until Nico and legal/accounting review accept it. |

## Corrections Applied

- **Retention periods:** Use official HGB/AO 10/8/6 buckets, not a generic
  10/6 rule.
- **Booking vouchers:** Treat invoices/receipts/payment booking vouchers as
  the 8-year retention bucket unless legal/accounting review classifies a
  specific artifact as a 10-year book/annual-accounting record.
- **Pseudonymization:** A pseudonymous finance subject id is still personal
  data if the mapping or PSP/invoice reference can re-identify a user.
- **Cryptographic erasure:** Account erasure can burn account/save keys, but
  finance records that must remain readable need a separate finance key domain.
- **Platform policies:** Apple/Google policy supports deletion-route and
  disclosure requirements. It does not decide German tax retention fields.
