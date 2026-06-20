---
title: ADR-0063 Investor Entitlement and Payment Boundary
status: accepted
tags: [adr, architecture, economy, investor, monetization, entitlement, iap, payment, compliance, legal, security, webhook, risk-legal, fmx-50, fmx-187, proposed, accepted]
context: [audit-security, club-management-economy]
created: 2026-06-01
updated: 2026-06-19
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0061-club-management-sub-aggregate-audit]]
  - [[ADR-0025-mobile-delivery]]
  - [[ADR-0023-realtime-transport]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[../../30-Implementation/secrets-management]]
  - [[../../60-Research/investor-compliance-and-entitlement-boundary-2026-06-01]]
  - [[../../60-Research/pre-mortem/PM-2026-05-20-04-monetization]]
  - [[../../60-Research/pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax]]
  - [[ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[ADR-0128-webhook-receiver-security-contract]]
  - [[../../60-Research/monetization-legal-gates-2026-06-13]]
  - [[../../60-Research/webhook-receiver-security-and-pentest-bugbounty-2026-06-16]]
  - [[../../60-Research/investor-mp-transition-neutralization-2026-06-16]]
  - [[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
  - [[../../40-Compliance/webhook-receiver-security-evidence-2026-06-16]]
  - [[../../40-Execution/fmx-189-investor-mp-separation-decision-record-2026-06-16]]
---

# ADR-0063: Investor Entitlement and Payment Boundary

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read "**draft /
> proposed** — research-phase ADR. Decisions in this file are options + working recommendation for
> Nico. The legal-sensitive choices (payment vendor, soft-launch activation, refund policy,
> age-gate strictness) are explicit **HITL gates** and are not accepted by this draft.
> `risk:legal`.". Body status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11
> (FMX-143).

## Date

2026-06-01

## Context

The Investor is the game's single real-money purchase: a singleplayer **clean
in-game cash** grant with no debt, ownership, fan/board penalty or multiplayer
advantage (gameplay rule fixed by FMX-41;
[[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]). The
*gameplay* ownership already exists: per ADR-0058 / ADR-0061, **CommercialPortfolio**
owns the Investor entitlement grant policy and **Club Management** is the sole
ledger writer (`InvestorCashGrantPosted`, ADR-0050); an `InvestorEntitlementGrant`
contract is sketched in
[[../../30-Implementation/club-economy-commercial-contracts]].

What has no architectural decision yet is the **compliance + entitlement
boundary**: how the purchase is billed across the PWA web build and the Capacitor
iOS/Android builds (ADR-0025), how the entitlement is granted **exactly once**,
how refunds/chargebacks revoke it, how disclosure/age-rating/consumer-law is met,
how abuse is prevented, and how save import/export and offline are handled. FMX-50
researched this in
[[../../60-Research/investor-compliance-and-entitlement-boundary-2026-06-01]]
against official Apple/Google policy and EU/DE/UK/US consumer law, and against the
monetization/legal pre-mortems (PM-2026-05-20-04, -08).

## Decision drivers

- The gameplay rule is fixed and must stay isolated from billing and multiplayer.
- Apple/Google require store IAP for in-app digital goods; the web PWA is not
  store-bound — so billing is **multi-path** and must not leak vendor types into
  the domain.
- Payment vendor + tax model (MoR vs direct PSP) is legally and commercially
  consequential but should **not be a one-way door**.
- Entitlement granting must be **exactly-once** and **server-authoritative**
  (idempotency, at-least-once webhooks, reconciliation).
- Webhook receiver verification, replay rejection and delivery/business dedupe
  are now governed by
  [[ADR-0128-webhook-receiver-security-contract|ADR-0128]] before any
  entitlement command is trusted.
- Final legal sign-off is a HITL gate (PM-04-F-06, PM-08).

## Options considered

### Option A - No dedicated boundary (inline in CommercialPortfolio, single vendor)

Hard-wire one payment vendor and grant entitlements inline.

- **Pros:** least code now.
- **Cons:** couples the domain to a vendor; no clean multi-path (web vs store);
  vendor swap is a rewrite; weak idempotency/reconciliation discipline; fails the
  "no one-way-door" rule. **Reject.**

### Option B - `PaymentProviderPort` + server-authoritative entitlement state machine (recommended)

A `PaymentProviderPort` abstracts `apple-iap | google-iap | web-psp`;
CommercialPortfolio owns an `InvestorEntitlement` aggregate with a
`created → paid → entitled → (refunded | revoked)` state machine; Club Management
posts the single ledger fact via Customer-Supplier + ACL (ADR-0050). Receipts/
tokens are verified server-side, deduped by provider transaction id; webhooks
(Apple ASSN / Google RTDN) are idempotent; a reconciliation job covers misses,
refunds and voids. Entitlements bind to the **account, not the save**.

- **Pros:** mirrors the ADR-0023 (transport) / ADR-0024 (renderer) port pattern;
  vendor-swappable; exactly-once; isolates gameplay + multiplayer; clean audit.
- **Cons:** more upfront modelling than Option A.
- **Fit:** **Recommended.** Matches the existing seam discipline and the FMX-50
  research.

### Option C - Separate Payments/Billing bounded context

Promote payments+entitlements to their own context.

- **Pros:** strongest isolation if billing grows (subscriptions, multiple SKUs,
  store ops as a product surface).
- **Cons:** premature for a single SP cash SKU; CommercialPortfolio already owns
  the entitlement grant policy. **Keep as a future option** if monetization grows
  beyond one purchase.

### Payment vendor sub-decision (HITL, not decided here)

- **B1 Merchant-of-Record first** (Paddle/FastSpring/Lemon Squeezy for the web
  path): offloads EU VAT/OSS (€10k threshold), US sales tax, invoicing, much
  dispute/tax-ops; higher fee. **Working recommendation for the web path** —
  fastest legal launch for one SKU.
- **B2 Stripe-direct:** lower card cost, you own OSS/tax-ops/invoicing/disputes;
  revisit at volume (PM-04-F-05 keeps a provider-fallback adapter regardless).
- In-app stays Apple/Google IAP on iOS/Android regardless of the web choice.

FMX-194 adds the non-binding closure packet for this sub-decision and the other
legal-sensitive gates in
[[ADR-0109-payment-provider-and-monetization-legal-gates|ADR-0109]],
[[../../60-Research/monetization-legal-gates-2026-06-13]] and
[[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]. Those
recommendations remain accepted by Nico 2026-06-19/legal approval and do not change this ADR's
binding status by themselves.

FMX-187 adds the binding receiver-security contract in
[[ADR-0128-webhook-receiver-security-contract|ADR-0128]]. That contract does not
choose the payment provider. It defines the verify-before-parse, raw-body
preservation, replay rejection, delivery/event dedupe, business-object
idempotency, provider reconciliation and pentest-before-bounty posture that all
future payment/control webhooks must satisfy before they can drive
`ConfirmInvestorEntitlement` or revocation/reconciliation flows.

## Recommendation

Adopt **Option B** for MVP planning: a `PaymentProviderPort` plus a
server-authoritative `InvestorEntitlement` state machine inside CommercialPortfolio,
Club Management as sole ledger writer. Treat the **vendor sub-decision (B1/B2)**,
**refund-of-spent-cash policy**, **soft-launch activation timing** and **age-gate
strictness** as **HITL gates** accepted by Nico 2026-06-19 + legal review. No bounded-context
boundary changes; no gameplay change.

### FMX-189 mode-separation amendment (accepted 2026-06-16)

Nico clarified that singleplayer and multiplayer are globally separated, not
connected by a neutralization flow. A singleplayer, hotseat, local or imported
save is never multiplayer-eligible and cannot seed or enter a
server-authoritative MP session. Therefore `InvestorAllowState=MP-denied` means
the account may retain payment/audit history, but the Investor cash payload has
no MP offer, no MP grant, no MP ledger posting, no MP read-model effect and no
save-transition path.

Consequences:

- Investor economic payload is `singleplayer_only`.
- Multiplayer session creation is owned by the MP server/lobby and starts from
  MP-owned setup state, never from SP/hotseat/import payloads.
- Refund/revocation reconciles SP entitlement state and SP ledger policy only;
  it never rewrites MP facts, standings, squads, matches, fixtures or shared
  history.
- MP -> SP export remains an undecided future topic and cannot reopen SP -> MP
  eligibility.

## Public contract direction (proposed)

CommercialPortfolio commands/events (extends ADR-0058):

- Provider webhook payloads are not direct domain commands. They must first pass
  ADR-0128 receiver verification and dedupe, then produce normalized facts for
  CommercialPortfolio.
- `InitiateInvestorPurchase` / `ConfirmInvestorEntitlement` (idempotent by
  `storeTransactionRef`)
- `ReconcileInvestorEntitlement` (refund / void / chargeback)
- `InvestorCashGrantPosted` (existing, to Club Management ledger — ADR-0050)
- `InvestorEntitlementRevoked` (new)
- `InvestorPaymentFailed` (new)
- `InvestorDisclosureAcknowledged` (versioned)

Read models: `InvestorOfferCatalog` (SKU, real price incl. VAT, cash amount,
`modeScope=singleplayer_only`), `InvestorEntitlementHistory` (status, platform,
transaction ref, disclosure version, audit), `InvestorAllowState` (`SP_ALLOWED`,
`MP_DENIED`, `OFFLINE_DEFERRED_SP_ONLY`).

Boundary invariants: SP-only; MP hard-denied; account-bound not save-bound;
exactly-once; no SP/hotseat/import save is multiplayer-eligible; refund
reconciles the entitlement without changing simulation rules or multiplayer;
every grant captures `disclosureVersion`.

## Rationale

Option B keeps the one-real-money-purchase clean, legal and swappable without a
premature new context, and reuses the project's established port + single-ledger-
writer patterns. It encodes the official-policy mechanics (consumable IAP,
idempotent grant, ASSN/RTDN refund signals) and the consumer-law surface (pay-
obligation button, withdrawal waiver, price transparency, plain "In-Game
Purchases" rating) as contracts rather than ad-hoc UI.

## Consequences

Positive:

- Vendor-swappable, exactly-once, audited entitlement isolated from gameplay/MP.
- Consumer-law + age-rating obligations are explicit contracts.
- Secrets boundary extends cleanly to store/PSP credentials.
- Webhook ingress now has a separate accepted receiver-security contract
  instead of relying on this payment ADR alone.

Negative / constraints:

- More modelling than an inline grant.
- [[../../30-Implementation/secrets-management]] must add store/PSP credential
  handling (server-only, rotated).
- Final vendor, refund policy, activation timing and age-gate remain HITL —
  nothing ships without legal sign-off.

## Supersedes

None.

## Related Docs

- [[../../60-Research/investor-compliance-and-entitlement-boundary-2026-06-01]]
- [[../../60-Research/pre-mortem/PM-2026-05-20-04-monetization]]
- [[../../60-Research/pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax]]
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../../30-Implementation/club-economy-commercial-contracts]]
- [[ADR-0050-club-economy-accounting-ledger]]
- [[ADR-0058-club-economy-commercial-impact-boundary]]
- [[ADR-0025-mobile-delivery]]
- [[ADR-0128-webhook-receiver-security-contract]]
- [[../../60-Research/webhook-receiver-security-and-pentest-bugbounty-2026-06-16]]
- [[../../40-Compliance/webhook-receiver-security-evidence-2026-06-16]]
