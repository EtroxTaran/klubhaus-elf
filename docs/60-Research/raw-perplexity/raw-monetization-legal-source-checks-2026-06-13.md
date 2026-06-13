---
title: "Raw - monetization legal source checks (FMX-194)"
status: raw
tags: [research, raw, source-check, monetization, payment, iap, consumer-law, vat, age-rating, gdpr, fmx-194]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-194
related:
  - [[../monetization-legal-gates-2026-06-13]]
  - [[raw-payment-provider-mor-vs-direct-2026-06-13]]
  - [[raw-refund-spent-cash-policy-2026-06-13]]
  - [[raw-age-gate-and-soft-launch-gates-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
---

# Raw - monetization legal source checks (FMX-194)

## Scope

Targeted current-source checks run after Perplexity. Purpose: ground FMX-194's
options and recommendations. This note is not legal advice and does not replace
lawyer review.

## Provider and store policy checks

| Source | FMX-194 use |
|---|---|
| Apple App Review Guidelines 3.1.1: <https://developer.apple.com/app-store/review/guidelines/> | Apple says app features/functionality including in-game currencies must use in-app purchase; multi-platform apps may allow access to items acquired elsewhere if the items are also available as IAP in the app. Native iOS shell purchase paths therefore need a current IAP/legal review. |
| Apple App Store Server Notifications: <https://developer.apple.com/documentation/appstoreservernotifications> | App Store refund/revocation lifecycle must be reconciled server-side and idempotently. |
| Apple App Store Server Library for Node.js: <https://github.com/apple/app-store-server-library-node> | Official Node server library exists for App Store Server API and notifications; only the latest major version receives security updates. |
| Google Play Payments policy: <https://support.google.com/googleplay/android-developer/answer/10281818> | Google Play requires its billing system for in-app purchases of digital goods/services, including virtual currencies and add-on items, unless a specific permitted exception/program applies. |
| Google Play RTDN: <https://developer.android.com/google/play/billing/rtdn-reference> | Android store purchases need Real-time Developer Notification handling for lifecycle changes. |
| Google Play Voided Purchases API: <https://developers.google.com/android-publisher/voided-purchases> | Refunds/chargebacks/voided purchases need reconciliation against the entitlement ledger. |
| Paddle VAT/MoR help: <https://www.paddle.com/help/sell/tax/how-paddle-handles-vat-on-your-behalf> | Paddle positions itself as Merchant of Record for digital products and says it handles sales tax/VAT, remittance and invoices in supported jurisdictions. Useful MoR-class evidence, not a vendor selection. |
| Stripe Tax docs: <https://docs.stripe.com/tax> | Stripe Tax calculates, monitors and helps manage registrations/filing, but using Stripe-direct still requires seller-side tax/compliance ownership unless a separate managed product/contract says otherwise. |
| Stripe PaymentIntents docs: <https://docs.stripe.com/payments/payment-intents> | Direct PSP fallback should use idempotency and webhook-backed confirmation rather than client-side trust. |
| Stripe webhook signature docs: <https://docs.stripe.com/webhooks/signature> | Webhook event authenticity requires raw-body signature verification. |
| Capacitor docs / plugins current check | Capacitor app shells can bridge native code, but there is no current official Capacitor IAP plugin in the checked official docs; native store billing will need an approved current purchase integration review before implementation. |

## Consumer-law, tax and German legal artifact checks

| Source | FMX-194 use |
|---|---|
| EU consumer rights / digital content summary: <https://eur-lex.europa.eu/EN/legal-content/summary/consumer-information-right-of-withdrawal-and-other-consumer-rights.html> | Distance-contract/digital-content information and withdrawal-right framing. EUR-Lex page required JS in one fetch, so keep as official source URL and verify manually during legal review. |
| Your Europe guarantees/digital content: <https://europa.eu/youreurope/citizens/consumers/shopping/guarantees/index_en.htm> | Digital-content legal guarantee remains separate from withdrawal waiver; faulty delivery can still require repair/replacement/refund handling. |
| German BGB §356: <https://www.gesetze-im-internet.de/bgb/__356.html> | Statutory source for withdrawal-right extinction clauses, including digital content/service cases; exact implementation wording needs legal review. |
| German BGB §312f: <https://www.gesetze-im-internet.de/bgb/__312f.html> | Statutory source for distance-contract confirmation requirements; supports the durable confirmation email gate. |
| German DDG §5: <https://www.gesetze-im-internet.de/ddg/__5.html> | Imprint/provider-identification duty source for German digital services; URL should be manually verified during legal review because automated fetch timed out. |
| Stripe EU OSS guide: <https://stripe.com/guides/eu-vat-oss> | EU OSS lets sellers simplify VAT reporting, but if FMX sells directly the studio still owns registration/filing decisions. |

## Rating, minors and dark-pattern checks

| Source | FMX-194 use |
|---|---|
| Apple App Review Guidelines, Safety and Kids Category sections: <https://developer.apple.com/app-store/review/guidelines/> | Apple expects age-appropriate experiences, parental controls awareness and Kids Category restrictions; FMX should not target Kids Category while paid flows exist. |
| Google Play payments and policy center links | Android app-shell purchase and child-safety obligations need current Play Console review before release. |
| European Commission online games enforcement page: <https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/social-media-online-games-and-search-engines_en> | Supports treating virtual-currency pricing, misleading scarcity, pressure selling and dark patterns as consumer-protection risks. |
| USK age ratings: <https://usk.de/en/the-usk-age-ratings/> | Germany-specific age-rating source. Automated fetch failed; keep as source URL and verify manually before store/app release. |
| IARC: <https://www.globalratings.com/> | Store submission path for cross-market ratings including PEGI/USK-like outputs; verify questionnaire evidence before native release. |

## Synthesis constraints

- FMX-194 can recommend policy shape and artifact gates, but legal counsel must
  approve public legal text, withdrawal wording, age gate, tax handling and
  provider contracts.
- No provider dependency is added in the docs-only phase.
- Future implementation must re-check current versions/docs for Stripe, Paddle
  or any selected MoR, Apple, Google, Capacitor purchase integration and DPA/AVV
  contracts.

