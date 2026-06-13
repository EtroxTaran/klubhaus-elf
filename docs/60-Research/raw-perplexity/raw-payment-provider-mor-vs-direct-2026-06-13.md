---
title: "Raw - payment provider MoR vs direct PSP (FMX-194)"
status: raw
tags: [research, raw, perplexity, source-check, monetization, payment, merchant-of-record, stripe, paddle, iap, tax, vat, fmx-194]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-194
related:
  - [[../monetization-legal-gates-2026-06-13]]
  - [[raw-monetization-legal-source-checks-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[../../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]
---

# Raw - payment provider MoR vs direct PSP (FMX-194)

## Query

2026-06-13 Perplexity/Sonar query: compare 2026 best-practice payment-provider
options for a Germany/EU-based indie browser/PWA football-manager game selling
one fixed-price, non-random digital consumable cash pack on web and native app
shells. Required axes: web Merchant-of-Record vs Stripe-direct/Stripe Tax or
Managed Payments, VAT/OSS, invoicing, tax liability, disputes, lock-in, fees,
adapter/fallback design and Apple/Google IAP boundary.

## Captured answer

Perplexity recommended a **MoR-first web path** for a small EU indie game, with
**Apple/Google IAP for native app builds** where the digital cash pack is bought
or consumed in the app. Stripe-direct plus Stripe Tax remains the best fallback
or later migration path when FMX needs lower processor margin or deeper checkout
control, but it leaves more tax, invoicing, dispute and support work with the
studio.

| Option | Raw assessment |
|---|---|
| **A. Web Merchant-of-Record first** | Best fit for fast, low-ops paid launch. A MoR acts as seller of record, handles more VAT/sales-tax, receipts/invoices and payment operations, but has higher blended fees and more provider dependence. |
| B. Stripe-direct + Stripe Tax | Strong control and generally lower headline payment fees. The studio remains seller/merchant for VAT/OSS, invoicing, support, disputes and legal evidence. Better fallback than first launch default. |
| C. Stripe managed/platform-style checkout | Potentially useful if current contract terms explicitly offload enough tax/compliance duties, but should not be assumed equivalent to full MoR without legal/commercial review. |

## Adapter implications

The answer converged with ADR-0063's `PaymentProviderPort` direction:

- keep Commerce/CommercialPortfolio domain state provider-neutral;
- route web purchases via a `web_mor` or `web_direct_psp` adapter;
- route app-shell purchases via `apple_iap` / `google_iap`;
- store provider transaction/order ids only in the payment/entitlement boundary;
- make the backend entitlement ledger the single source of truth;
- keep new-purchase routing switchable so a MoR outage or provider exit can be
  handled without changing game clients.

## Source-quality notes

The Perplexity result included some secondary legal/business sources. The
recommendation was therefore cross-checked against the official/provider trail in
[[raw-monetization-legal-source-checks-2026-06-13]]:

- Apple App Review Guidelines 3.1.1 for in-app purchase;
- Google Play Payments policy for in-app digital goods and virtual currency;
- Paddle MoR/VAT documentation;
- Stripe Tax documentation;
- EU/DE consumer-law source trail.

## Working interpretation for FMX-194

Use **A as the recommendation** for Nico: web MoR first, direct PSP as a
fallback/later migration path, Apple/Google IAP for store-distributed app builds.
This is not a final vendor choice and does not name Paddle, FastSpring, Lemon
Squeezy or Stripe as accepted.

