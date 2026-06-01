---
title: Raw Perplexity - Investor Compliance and Entitlement Boundary 2026-06-01
status: raw
tags: [research, raw, perplexity, economy, investor, monetization, entitlement, iap, compliance, legal, fmx-50]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-50
sourceType: perplexity
related:
  - [[../investor-compliance-and-entitlement-boundary-2026-06-01]]
  - [[../club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# Raw Perplexity - Investor Compliance and Entitlement Boundary 2026-06-01

This note preserves the FMX-50 research prompts and condensed raw outputs. It is
not implementation authority and not legal advice. The synthesis is
[[../investor-compliance-and-entitlement-boundary-2026-06-01]]. The gameplay rule
is fixed (clean singleplayer cash, no debt / ownership / fan penalty / multiplayer
advantage); this research only defines the compliance + entitlement boundary. All
numbers/fees are external benchmarks, not final. Final legal sign-off remains a
Nico/HITL gate.

## Prompt 1 - app-store platform rules (Apple StoreKit 2, Google Play Billing, web PSP)

Apple/Google rules for a consumable in-app purchase that grants in-game soft cash:
server-side validation, transaction IDs, idempotent grant, restore for
consumables, App Store Server Notifications, the digital-goods IAP requirement,
anti-steering / external-link 2024-2025 changes; Google Play Billing equivalents
(consume/acknowledge, Play Developer API, RTDN, idempotency, voided purchases);
refund/revocation on both; Family Sharing caveats; PWA web build via a normal PSP
(Stripe) and how it differs.

### Condensed raw answer

- **Treat Investor as a consumable IAP** on both stores; build a
  **server-authoritative, idempotent entitlement system** around the official
  billing APIs and refund/void signals.
- **Apple (StoreKit 2):** digital goods incl. "in-game currencies" must use Apple
  IAP (App Review Guideline 3.1.1); register each cash pack as a **consumable**
  in App Store Connect. Validate transactions server-side; key entitlement by
  `Transaction.id`; grant **once** per transaction id. Consumables are **not
  restorable** via "Restore Purchases" — sync remaining balance via your own
  account system instead. Use **App Store Server Notifications (ASSN v2)** for
  `REFUND` / `DID_REVOKE` to revoke/reconcile. **Anti-steering:** baseline forbids
  redirecting to non-IAP purchase for digital goods; 2025 US (Epic injunction)
  allows one external link, EU (DMA) allows alternative billing under separate
  fees — but standard App Store + IAP rules still apply otherwise.
- **Google Play (Billing Library 6/7):** in-app digital content must use Play
  billing (Payments policy); define cash packs as **consumable one-time
  products**. Grant entitlement, then `consumeAsync()`; **must acknowledge/consume
  within the window or Google auto-refunds & revokes**. Verify the **purchase
  token** via Google Play Developer API; dedup by token (idempotency).
  **Real-time Developer Notifications (RTDN)** via Pub/Sub + **Voided Purchases
  API** to detect refunds/chargebacks and revoke.
- **Refund/revocation:** maintain a server-side ledger (`userId, platform,
  productId, transactionId/purchaseToken, grantedAmount, status =
  ACTIVE/REFUNDED/REVOKED`); on refund/void, look up the grant and revoke or
  reconcile; client balance always derived from server state. Design decision how
  to handle already-spent refunded cash (allow negative, accept loss, etc.).
- **Family Sharing:** consumables are **not shareable** on Apple Family Sharing
  or Google Play Family Library — currency stays per-account; don't market as
  shared.
- **PWA / web (not store-distributed):** store rules bind app distribution, not a
  standalone website. A browser PWA **can sell the same cash via Stripe/PayPal**
  under normal web/e-commerce + consumer law; you become merchant of record (PSP
  fees instead of store commission). Cross-entitlement is fine (buy on web, use
  in app) but **don't add in-app UI steering to the cheaper web checkout** except
  under the new regional exceptions.
- Sources: Apple App Review Guidelines §3.1.1; Apple HIG In-App Purchase; Apple
  App Store Server API/Notifications; Apple upcoming-requirements; Google Play
  Payments policy + Billing Library docs + Play Developer API + Voided Purchases
  + RTDN; OpenForge/Adapty on 2025 US/EU external-payment changes.

## Prompt 2 - age ratings & consumer-law disclosure (EU/DE, UK, US)

IARC/PEGI/ESRB/USK "In-Game Purchases" vs "Includes Random Items"; EU Consumer
Rights Directive pay-button label + 14-day withdrawal waiver for immediate
digital content (Digital Content Directive 2019/770) + pre-contractual info;
Germany UWG/PAngV price transparency + EU CPC virtual-currency guidance; UK
CAP/ASA + CMA; US FTC dark patterns + COPPA.

### Condensed raw answer

- **Age rating:** a **fixed-price, non-random** cash purchase needs the **plain
  "In-Game Purchases"** descriptor only — **NOT** "In-Game Purchases (Includes
  Random Items)" (that is for loot boxes/gacha). In IARC: in-game purchases = yes,
  paid random items = no. **USK (DE)** since Jan 2023 adds a **purchase function
  icon** beside the age mark; PEGI/ESRB mirror the plain descriptor. (PEGI's June
  2026 update raises loot boxes to min PEGI 16 and flags time-limited/urgency
  mechanics — a plain always-available fixed-price purchase is unaffected.)
- **EU consumer law:** under CRD Art. 8(2) the **final confirmation button must
  unambiguously signal payment** — DE standard "Zahlungspflichtig bestellen" /
  "Jetzt kaufen"; show **total price incl. VAT** next to it. **14-day withdrawal**
  for digital content is **waived only** if the consumer gives prior express
  consent to immediate supply + acknowledges losing the right + you confirm on a
  durable medium (email/invoice). Provide **pre-contractual info** (characteristics,
  total price, trader identity/Impressum, delivery, withdrawal terms).
- **Germany:** **UWG** (no misleading/aggressive, esp. minors) + **PAngV** (show
  unambiguous final price incl. VAT). **EU CPC Network guidance on in-game virtual
  currencies (March 2025, 7 principles):** show **real-money cost**, don't force
  mental conversion of bundle structures, no fake discounts, state currency has
  **no real-world value** and is non-transferable.
- **UK:** **CMA** expects upfront "in-game purchases" disclosure + clear real
  prices before commitment + no aggressive/dark-pattern coercion; **CAP/ASA** no
  misleading "free", no direct exhortation to children, genuine time-limits.
- **US:** **FTC** Section 5 — clear/conspicuous price disclosure, no dark
  patterns, no disguised real-money charges, explicit confirmation step.
  **COPPA** applies to data from under-13s (not pricing per se) — if targeting/
  knowing under-13 users, need verifiable parental consent + parental purchase
  controls.
- **Application:** plain "In-Game Purchases" label; payment-obligation button +
  VAT-inclusive price; immediate-delivery withdrawal-waiver consent + durable
  confirmation; real-money price always shown with the cash amount; no urgency/
  dark patterns; no random reward. Lootbox stance stays "none" (PM-08-F-10).
- Sources: PEGI/VideogamesEurope; GTLaw PEGI-2026 update; USK.de; EU CRD
  2011/83/EU Art. 8(2); Digital Content Directive 2019/770; EU CPC virtual-
  currency guidance 2025; ADVANT Beiten "Games Law in Germany A-Z" (UWG/PAngV);
  EU Commission consumer-protection coordinated action; UK CMA/CAP; US FTC/COPPA.

## Prompt 3 - payment-provider architecture, tax (MoR/OSS), idempotency, fraud, analytics

Merchant-of-Record (Paddle/FastSpring/Lemon Squeezy) vs direct PSP (Stripe): who
handles EU VAT/OSS, US sales tax, invoicing, fraud/chargebacks, fee differences,
when a small studio picks MoR; EU OSS €10k threshold; idempotency + webhook
reliability for exactly-once entitlement; fraud/abuse (chargeback thresholds,
velocity, refund-abuse); PII-free purchase-funnel analytics.

### Condensed raw answer

- **MoR vs direct PSP:** MoR (Paddle/FastSpring/Lemon Squeezy) acts as **seller of
  record** and handles **EU VAT collection/remittance, US sales tax, invoicing,
  and much dispute/tax ops** — higher headline fee (~mid-single-digit % + fixed)
  but removes tax-ops burden. **Stripe direct** is lower headline card cost but
  you own VAT/OSS, sales-tax nexus, invoicing, disputes. Small studio with a
  **simple single SKU** and no tax-ops capability → **MoR first**; Stripe when you
  have tax/legal coverage, higher volume, or need routing control.
- **EU OSS:** Union-wide **€10,000** annual B2C cross-border digital-services
  threshold; a German seller above it must charge **destination VAT** and can file
  centrally via **Union OSS (BZSt)** instead of per-country registration. A **MoR
  removes this operationally** (MoR invoices + remits).
- **Idempotency/webhooks:** treat purchase completion as **eventual-consistency**,
  not atomic. Idempotency key on create-purchase; dedup entitlement by
  **transaction id / purchase token**; assume **at-least-once** webhook delivery
  (process idempotently, verify signature); entitlement is a **state transition**
  `pending → paid → entitled`, allow `paid → entitled` once per tx id; run
  **reconciliation jobs** against provider API to catch missed webhooks, refunds,
  chargebacks.
- **Fraud/abuse:** velocity limits (card/account/device/IP/fingerprint), risk
  scoring, refund-abuse controls (cooling-off, per-account refund limits, manual
  review for repeat buyers), **server-authoritative ledger** (client can't
  self-assert), chargeback → revoke/suspend entitlement + keep audit trail.
  Chargeback **thresholds are provider/network-specific** (no single universal
  number) — keep dispute rate well below monitoring programs via clear product
  descriptor + fast support.
- **Analytics:** emit minimal pseudonymous events — `purchase_initiated`,
  `purchase_completed`, `purchase_failed`, `purchase_refunded`,
  `entitlement_granted` — with internal opaque `user_id`, `purchase_id`,
  `payment_provider`, `provider_transaction_id`, `currency`, `amount`, `country`,
  `sku`, `status`, `reason_code`; keep PII (email/name/card) inside own systems,
  send only aggregated/pseudonymous data externally.
- Sources: gaming/payments architecture write-ups (sdk.finance, unipaas,
  Pragmatic Engineer payment-system design), Stripe gaming-payments resource, MoR
  vendor positioning (Paddle/FastSpring/Lemon Squeezy), EU OSS/§3a UStG threshold
  guidance.

## Rules

- Raw notes may name real providers/stores/regulators for sourcing only. This is
  research input, not legal advice; **final legal sign-off is a Nico/HITL gate**
  (PM-2026-05-20-04-F-06, PM-2026-05-20-08).
- All fees/thresholds/limits are external benchmarks — calibration inputs, never
  binding.
- Promoted points link both ways to the synthesis
  [[../investor-compliance-and-entitlement-boundary-2026-06-01]].
