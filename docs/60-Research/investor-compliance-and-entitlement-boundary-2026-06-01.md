---
title: Investor Compliance and Entitlement Boundary - Research Synthesis 2026-06-01
status: draft
tags: [research, economy, investor, monetization, entitlement, iap, compliance, consumer-law, age-rating, legal, fmx-50]
context: [audit-security, club-management-economy]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-50
sourceType: external
related:
  - [[raw-perplexity/raw-investor-compliance-and-entitlement-boundary-2026-06-01]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[club-economy-blueprint-2026-05-27]]
  - [[pre-mortem/PM-2026-05-20-04-monetization]]
  - [[pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0025-mobile-delivery]]
  - [[../30-Implementation/secrets-management]]
---

# Investor Compliance and Entitlement Boundary - Research Synthesis 2026-06-01

## Question

The "Investor" is the game's one real-money purchase: a singleplayer cash grant
that injects **clean in-game cash** with **no debt, no ownership/control effect,
no fan/board penalty and no multiplayer advantage** (the gameplay rule is fixed by
FMX-41; see [[club-economy-impact-map-and-commercial-contracts-2026-05-28]] §9 and
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]). The vault
already owns the *gameplay* side (CommercialPortfolio owns the entitlement grant
policy; Club Management posts `InvestorCashGrantPosted`; an `InvestorEntitlementGrant`
contract sketch exists in [[../30-Implementation/club-economy-commercial-contracts]]).

What is missing is the **compliance + entitlement boundary**: SKU catalog,
platform billing (Apple/Google IAP vs web PSP), server-authoritative idempotent
grant, refund/revocation, save import/export behaviour, age-rating labels,
consumer-law disclosure, abuse prevention and audit. How should FMX-50 specify
this so the purchase is legally clean, technically exactly-once, and isolated from
gameplay and multiplayer — without making a one-way-door payment-vendor decision?

Nico's defaults / fixed constraints for FMX-50:

- gameplay rule unchanged: clean SP cash, no penalty/debt/ownership/MP advantage;
- prefer official platform-policy + primary regulatory/ratings sources;
- define the `InvestorEntitlementGrant` boundary, idempotency and audit;
- keep numbers/fees as calibration inputs; **final legal sign-off is a HITL gate**
  (PM-2026-05-20-04-F-06, PM-2026-05-20-08) — this beat plans, it does not ratify.

## Summary

The research answer is a **server-authoritative, idempotent entitlement system**
behind a **payment-provider port**, with a fixed-price non-random SKU, and a
disclosure/compliance surface that stays out of gameplay state:

1. **One entitlement, two billing paths behind a port.** In Capacitor iOS/Android
   builds the cash pack **must** be an Apple StoreKit 2 / Google Play **consumable
   IAP** (digital-goods rule). In the web PWA it is sold via a normal PSP /
   Merchant-of-Record. A `PaymentProviderPort` abstracts apple-iap / google-iap /
   web-psp so the vendor choice is not a one-way door (mirrors the ADR-0023/0024
   transport/renderer-port pattern). Entitlements are tied to the **account, not
   the save**.

2. **Exactly-once grant via a state machine, not a moment.** Purchase completion
   is eventual-consistency: `created → paid → entitled → (refunded | revoked)`.
   The server verifies the receipt/token, dedups by **provider transaction id**,
   grants once, and posts exactly one `InvestorCashGrantPosted` to the Club
   Management ledger (ADR-0050 single-writer). Webhooks are at-least-once
   (idempotent processing + signature verify); a reconciliation job catches missed
   notifications, refunds and chargebacks (Apple ASSN, Google RTDN + Voided
   Purchases API).

3. **Refund/revocation reconciles the entitlement, never the save's gameplay
   integrity.** On refund/chargeback the entitlement flips to `refunded`/`revoked`
   and the granted cash is reversed/marked. Because the cash may already be spent,
   the policy is an explicit Nico decision (reverse-to-negative vs accept-loss +
   flag) — but the **simulation rules never change** and multiplayer is never
   touched.

4. **Plain "In-Game Purchases" — no random items.** Because the purchase is
   fixed-price and non-random, the IARC/PEGI/ESRB descriptor is the **plain
   "In-Game Purchases"**, not "Includes Random Items" (USK adds its purchase
   function icon since 2023). The lootbox stance stays "none" (PM-08-F-10).

5. **Consumer-law disclosure is a contract surface, not flavour.** EU CRD pay-
   obligation button ("Zahlungspflichtig bestellen") + VAT-inclusive total price;
   immediate-delivery **withdrawal-right waiver** with express consent +
   acknowledgement + durable confirmation; real-money price always shown beside
   the cash amount (EU CPC virtual-currency guidance, PAngV/UWG); no dark patterns
   (UK CMA/CAP, US FTC); COPPA/age-gate handling for minors. A versioned
   `disclosureVersion` is captured on every grant for audit.

6. **Tax/vendor stays a deferred, sourced choice.** Merchant-of-Record
   (Paddle/FastSpring/Lemon Squeezy) offloads EU VAT/OSS (€10k threshold), US
   sales tax and invoicing at a higher fee; Stripe-direct is cheaper but you own
   tax-ops. The recommendation is **MoR-first for the web path** behind the port,
   but the final vendor + soft-launch timing are HITL decisions, captured as an
   ADR-0063 options matrix, not ratified here.

7. **Allow/deny matrix isolates the entitlement.** SP = allowed; MP/leaderboard =
   hard-denied (purchase hidden); offline = grant deferred until server-confirmed;
   imported save = entitlement re-bound from the account, never trusted from save
   bytes; refund = reconcile. This plugs into the existing
   `cloud-verified`/`unverified` save posture (PM-04).

None of this changes a bounded-context boundary: CommercialPortfolio keeps the
entitlement grant policy, Club Management stays the sole ledger writer, and a new
**draft ADR-0063** adds the payment-port + entitlement-state-machine + compliance
contract. The gameplay rule is untouched.

## Source base

| Area | Primary sources | FMX use |
|---|---|---|
| Apple/Google in-app purchase rules | Apple App Review Guidelines §3.1.1; Apple HIG In-App Purchase; App Store Server API/Notifications; Google Play Payments policy + Billing Library 6/7 + Play Developer API + Voided Purchases + RTDN | Consumable-IAP requirement; server validation; idempotent grant; restore/consume; refund/revoke signals; anti-steering |
| Web PSP vs in-app | Apple/Google policy scope; Stripe gaming-payments | PWA web sells via PSP; in-app must use store billing; account-bound cross-entitlement; no in-app steering |
| Age ratings | PEGI / VideogamesEurope; GTLaw PEGI-2026; USK.de; ESRB descriptors | Plain "In-Game Purchases" (no random items); USK purchase icon; lootbox stance "none" |
| EU/DE consumer law | CRD 2011/83/EU Art. 8(2); Digital Content Directive 2019/770; EU CPC virtual-currency guidance 2025; ADVANT Beiten Games-Law-DE (UWG/PAngV) | Pay-obligation button; withdrawal waiver; price transparency; real-money cost display |
| UK / US | UK CMA + CAP/ASA; US FTC Section 5 + dark-patterns; COPPA | Upfront disclosure; no dark patterns; minor protection |
| Payment architecture / tax | MoR vs Stripe positioning (Paddle/FastSpring/Lemon Squeezy); EU OSS €10k threshold; payment-system design (Pragmatic Engineer); Stripe gaming | MoR-vs-direct ADR option; OSS burden; idempotency/webhook/reconciliation; fraud/velocity; PII-free analytics |
| Vault pre-mortem | [[pre-mortem/PM-2026-05-20-04-monetization]] (F-01/02/05/06/10), [[pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax]] (F-02/04/08/10) | Monetization GDDR/ADR gate; analytics events; provider fallback; consumer-law; OSS; lootbox stance |

Confidence: **high** on platform IAP mechanics, age-rating descriptor choice and
the idempotency/webhook pattern (official policies + converging sources);
**medium-high** on EU/DE/UK/US consumer-law specifics (primary directives, but
application is legal-review-dependent); **medium** on fee/threshold numbers
(vendor-positioning, treat as calibration). Not legal advice — final sign-off is a
HITL gate.

## Findings

### 1. Two billing paths behind a `PaymentProviderPort`

- **Capacitor iOS** → Apple **StoreKit 2 consumable IAP** (App Store Connect
  product per cash pack); **Capacitor Android** → Google Play **consumable
  one-time product**. Digital goods *must* use store billing.
- **Web PWA** → normal PSP / Merchant-of-Record (Stripe or Paddle-type). Store
  rules bind app distribution, not the website.
- A `PaymentProviderPort` (apple-iap | google-iap | web-psp) keeps the vendor
  swappable and the domain free of vendor types — same seam discipline as
  ADR-0023 (transport) / ADR-0024 (renderer). Entitlements bind to the **account**,
  not the save (consumables are not "restored"; balance syncs from server state).

### 2. Entitlement state machine + exactly-once grant

`InvestorEntitlementGrant` lifecycle: `created → paid → entitled →
(refunded | revoked)`, plus `failed` from `created/paid`.

- Verify receipt/token server-side; **dedup by provider transaction id**
  (`Transaction.id` / Play purchase token); allow `paid → entitled` once.
- Post exactly one `InvestorCashGrantPosted` to the Club Management ledger
  (ADR-0050). The grant is **idempotent by `entitlementId` + `storeTransactionRef`**.
- Webhooks are **at-least-once** (Apple ASSN v2, Google RTDN): verify signature,
  process idempotently. A **reconciliation job** polls the provider (Apple Server
  API, Google Voided Purchases API) to catch missed events, refunds, chargebacks.
- Google requires **acknowledge/consume within the window** or it auto-refunds.

### 3. Refund / revocation policy

- On `REFUND` / void / chargeback → entitlement flips to `refunded` / `revoked`;
  emit `InvestorEntitlementRevoked`; reverse or flag the granted cash.
- Already-spent-cash handling is a Nico decision (reverse-to-negative-then-recover
  vs accept-loss + audit flag). Whichever: **simulation rules never change**, no
  multiplayer effect, full audit trail of grant + revocation retained.
- Abuse: refund cooling-off, per-account/instrument refund limits, manual-review
  for repeat refunders; chargeback thresholds are provider-specific — keep dispute
  rate low via clear descriptor + fast support (PM-04-F-10).

### 4. Age rating

- Fixed-price, non-random → **plain "In-Game Purchases"** descriptor
  (IARC/PEGI/ESRB); **NOT** "Includes Random Items". USK (DE) shows its purchase
  **function icon** (since Jan 2023) beside the age mark. No loot box, ever
  (PM-08-F-10). PEGI's June-2026 loot-box/urgency tightening does not affect a
  plain always-available fixed-price purchase.

### 5. Consumer-law disclosure surface (EU/DE, UK, US)

- **EU CRD Art. 8(2):** final button must signal payment obligation
  ("Zahlungspflichtig bestellen" / "Jetzt kaufen") with **VAT-inclusive total
  price** shown.
- **Withdrawal right (14-day):** waived for immediate digital delivery only with
  **express consent + acknowledgement of losing the right + durable confirmation**
  (email/invoice) — DCD 2019/770 + CRD (PM-08-F-02 two-checkbox pattern).
- **Pre-contractual info:** characteristics (amount, in-game-only, no real value,
  non-transferable), total price, trader identity/Impressum (DDG §5, PM-08-F-04),
  delivery, withdrawal terms.
- **Price transparency (DE PAngV/UWG + EU CPC 2025 virtual-currency guidance):**
  always show the **real-money price** beside the cash amount; no fake discounts;
  state no real-world value.
- **UK (CMA/CAP/ASA):** upfront "in-game purchases" disclosure, clear real prices,
  no aggressive/dark patterns, no child exhortation. **US (FTC):** clear/conspicuous
  price, explicit confirmation, no dark patterns. **COPPA:** parental consent/
  controls if under-13 users are targeted/known.
- Every grant captures a versioned `disclosureVersion` for audit.

### 6. Payment vendor + tax (deferred, sourced ADR option)

- **MoR (Paddle/FastSpring/Lemon Squeezy):** seller-of-record handles EU
  VAT/OSS, US sales tax, invoicing, much dispute/tax-ops; higher fee.
- **Stripe-direct:** lower card cost, you own VAT/OSS (Union OSS via BZSt above
  the **€10k** cross-border threshold), sales-tax nexus, invoicing, disputes
  (PM-08-F-08; PM-04-F-05 provider-fallback).
- Recommendation: **MoR-first for the web path** behind the port (fastest legal
  launch for a single SKU); revisit Stripe-direct at volume. Final vendor +
  soft-launch timing = HITL.

### 7. Save import/export, offline, account binding (allow/deny matrix)

| Context | Behaviour |
|---|---|
| Singleplayer | **Allowed** — purchase visible, grant posts clean cash |
| Multiplayer / leaderboard | **Hard-denied** — purchase hidden; entitlement never affects shared state |
| Offline | Purchase **deferred** until server-confirmed; no offline self-grant |
| Imported save | Entitlement **re-bound from the account**, never trusted from save bytes; `unverified` saves grey-out premium per PM-04 |
| Exported save | Carries no spendable entitlement secret; balance re-derived on import under the account |
| Refund/chargeback | Reconcile entitlement; gameplay rules unchanged |

### 8. Audit, analytics, secrets

- **Audit:** every grant logs `userId, platform, skuId, storeTransactionRef,
  disclosureVersion, grantedAt, cashGrantMinor, ledgerEntryId, status`; GDPR-
  compatible retention.
- **Analytics (PII-free, PM-04-F-02):** `purchase_initiated / completed / failed /
  refunded`, `entitlement_granted` with opaque `user_id`, `purchase_id`,
  `payment_provider`, `provider_transaction_id`, `currency`, `amount`, `country`,
  `sku`, `status`, `reason_code` — no email/name/card to third parties.
- **Secrets:** [[../30-Implementation/secrets-management]] must add a Category for
  store/PSP credentials (Apple/Google API keys, receipt-verification keys, PSP
  secret keys, webhook signing secrets) with rotation — server-only, never client.

### 9. Progressive disclosure (Quick / Standard / Expert)

- **Quick:** a single, clearly-priced "Investor" offer with the pay-obligation
  button, VAT-inclusive price, and "this is real money / SP only / no advantage"
  note; one confirmation step.
- **Standard:** the cash amount vs real price, the immediate-delivery withdrawal
  note, and a ledger line showing source `investor_entitlement` so the player
  sees why cash changed.
- **Expert:** entitlement history (status, platform, transaction ref, disclosure
  version), refund/revocation state, and the audit trail.

## Allow/deny matrix (acceptance-relevant)

See Finding 7. Hard invariants: SP-only; MP hard-denied; account-bound not
save-bound; idempotent exactly-once; refund reconciles entitlement without
changing simulation rules or multiplayer.

## Acceptance scenarios

1. **First purchase** — SP save buys a cash pack; server verifies the receipt,
   grants once, posts one `InvestorCashGrantPosted`; ledger shows source
   `investor_entitlement`; no wage/debt/fan/board/compliance change.
2. **Repeated purchase / replay** — the same `storeTransactionRef` arrives twice
   (retry or duplicate webhook); the grant is deduped — exactly one ledger entry.
3. **Restore / new device** — user signs in on a new device; consumed cash is
   **not** "restored", but the account's current balance and entitlement history
   sync from server state.
4. **Refund** — Apple ASSN / Google void fires; entitlement → `refunded`,
   `InvestorEntitlementRevoked` posts, cash reversed/flagged per policy; audit
   trail retained; no multiplayer effect.
5. **Offline save** — purchase attempted offline is deferred; cash appears only
   after server confirmation; no offline self-grant.
6. **Imported save** — an imported save's entitlement is re-bound from the account,
   never trusted from save bytes; forged premium in save bytes grants nothing.
7. **Multiplayer attempt** — in an MP/leaderboard context the Investor offer is
   hidden and any entitlement is inert; shared state is unaffected.

## Open questions / Nico / legal decisions

1. **Payment vendor + MoR-vs-direct** — MoR-first (Paddle-type) for the web path,
   or Stripe-direct with own OSS/tax-ops? (ADR-0063 options matrix; final = HITL.)
2. **Refunded-already-spent-cash policy** — reverse-to-negative-and-recover vs
   accept-loss-and-flag.
3. **Soft-launch / activation timing** — when (if) the Investor SKU goes live;
   gated behind a full legal review (PM-04-F-06, PM-08).
4. **Age-gate strictness** — rely on platform parental controls, or add an in-app
   age gate + COPPA flow if under-13 reach is plausible.
5. **Web-path availability** — ship web PSP purchase at all, or app-store-only
   first to avoid running own consumer-law/withdrawal flow early.
6. **Whether a separate Monetization GDDR is needed** (PM-04-F-01) or GD-0022 §
   Investor + ADR-0063 suffice for MVP planning.
7. **SKU shape** — number of price tiers, regional pricing, single vs multiple
   packs.

## Related

- [[raw-perplexity/raw-investor-compliance-and-entitlement-boundary-2026-06-01]] — raw transcript
- [[club-economy-impact-map-and-commercial-contracts-2026-05-28]] — FMX-41 Investor §9 this refines
- [[pre-mortem/PM-2026-05-20-04-monetization]] — monetization pre-mortem findings
- [[pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax]] — legal/tax pre-mortem findings
- [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] — Investor gameplay rule
- [[../30-Implementation/club-economy-commercial-contracts]] — `InvestorEntitlementGrant` contract
- [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]] — proposed ADR
- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] — entitlement ownership
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] — ledger event
- [[../10-Architecture/09-Decisions/ADR-0025-mobile-delivery]] — PWA + Capacitor channels
- [[../30-Implementation/secrets-management]] — store/PSP secret handling
