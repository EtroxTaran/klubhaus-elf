---
title: "Monetization legal gates (FMX-194)"
status: current
tags: [research, synthesis, monetization, payment, merchant-of-record, refund, age-gate, legal, compliance, consumer-law, fmx-194]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-194
related:
  - [[raw-perplexity/raw-payment-provider-mor-vs-direct-2026-06-13]]
  - [[raw-perplexity/raw-refund-spent-cash-policy-2026-06-13]]
  - [[raw-perplexity/raw-age-gate-and-soft-launch-gates-2026-06-13]]
  - [[raw-perplexity/raw-monetization-legal-source-checks-2026-06-13]]
  - [[../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
  - [[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
---

# Monetization legal gates (FMX-194)

## Scope

FMX-194 closes the research packet for the legal-sensitive gates left open by
[[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary|ADR-0063]]:

- web payment vendor and MoR-vs-direct PSP posture;
- refund/chargeback handling when Investor cash has already been spent;
- age-gate / age-assurance strictness;
- paid soft-launch activation requirements;
- durable home for legal/compliance evidence.

This note is a planning synthesis, not legal advice. The draft decision home is
[[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates|ADR-0109]].
The HITL queue is
[[../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]].

## Evidence synthesis

### Payment provider

The evidence favours **web MoR first** for the initial paid web/PWA path:

- A MoR-class provider is the fastest way to reduce VAT/OSS, invoicing,
  tax-remittance and dispute-ops burden for a small EU/Germany-based studio.
- Stripe-direct plus Stripe Tax is a good fallback or later migration path, but
  the studio remains seller/merchant for tax/compliance unless a separate managed
  contract explicitly says otherwise.
- Apple and Google store-distributed app shells remain separate paths: in-app
  digital cash/in-game currency normally needs StoreKit / Google Play Billing
  handling or a current regional entitlement review.
- ADR-0063's `PaymentProviderPort` remains the right architecture seam; provider
  choice must not leak into gameplay or ledger rules.

### Refund / already-spent cash

The safest product/legal posture is a **strict immediate-delivery withdrawal
waiver** with narrow post-delivery exceptions:

- capture separate express consent and acknowledgement before immediate digital
  delivery;
- send durable confirmation with purchase, price/tax, support and withdrawal
  consequence;
- reconcile Apple/Google/MoR/Stripe refund, void and chargeback events
  idempotently;
- mark the entitlement refunded/revoked and remove remaining unspent purchased
  cash;
- do not rewind gameplay or shared-state facts once the cash is spent;
- detect abuse through cooldowns, manual review and purchase restriction, while
  preserving valid statutory/platform refund rights.

ADR-0108's draft no-P2W invariant raises the bar for any shared state: refunded
paid value must not remain as a competitive advantage in rankings, async groups,
exports, official comparisons or future multiplayer. ADR-0063 Investor stays
singleplayer-only.

### Age gate / age assurance

The current product shape does not justify full identity-grade KJM adult
verification:

- no gambling, betting, loot boxes or explicit adult content;
- paid content is fixed-price and non-random;
- fictional clubs/players reduce IP/brand risks but not consumer-law duties.

The recommended path is **proportional age assurance**:

- declared age/DOB before account and purchase;
- no optional analytics/marketing consent for declared under-16 Germany users;
- under-16 route avoids persistent account/payment/telemetry unless legal review
  approves a parent/guardian flow;
- platform ratings/parental controls for app shells;
- strong age verification becomes a trigger only if future scope adds adult,
  gambling, betting-like, social/UGC or high-risk monetization features.

### Paid soft launch

Paid soft launch is production for legal/compliance purposes. FMX should keep
paid flows disabled until a compliance gate is green:

- AGB/Terms/EULA;
- withdrawal/immediate-delivery double-checkbox text;
- order confirmation email under BGB §312f direction;
- German imprint under DDG §5 direction;
- privacy policy and DPA/AVV register;
- refund/chargeback/minor-purchase runbook;
- provider sandbox/live smoke evidence;
- webhook/reconciliation smoke evidence;
- age-rating/IARC/USK/PEGI evidence where relevant;
- legal-review owner and dated sign-off;
- feature flag and kill switch for paid flows.

The new compliance home is [[../40-Compliance/README]].

## Recommended approval packet

| Decision | Recommendation | Rationale |
|---|---|---|
| D1 payment vendor | **A. Web MoR first + direct PSP fallback** | Best balance of legal/tax ops reduction and future provider portability. |
| D2 app-shell billing | **A. Apple/Google IAP for in-app digital cash** | Matches current store-policy source checks; external links require separate current regional entitlement review. |
| D3 refund/spent cash | **A. Immediate-delivery waiver + unspent-only revocation + no gameplay rollback** | Legally conservative, replay-safe and aligned with no-P2W/shared-state constraints. |
| D4 age gate | **A. Proportional age assurance** | Avoids over-collecting ID data while giving a stronger minors/GDPR posture than a bare pop-up. |
| D5 paid soft launch | **A. Compliance-gated activation** | Paid beta is still paid production; missing artifacts are release blockers. |

## Open Nico decisions

ADR-0109 is a draft. Nico must approve or change D1-D5 in
[[../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]
before any gate becomes binding.

## Related

- [[raw-perplexity/raw-payment-provider-mor-vs-direct-2026-06-13]]
- [[raw-perplexity/raw-refund-spent-cash-policy-2026-06-13]]
- [[raw-perplexity/raw-age-gate-and-soft-launch-gates-2026-06-13]]
- [[raw-perplexity/raw-monetization-legal-source-checks-2026-06-13]]
- [[../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
- [[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
- [[../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]

