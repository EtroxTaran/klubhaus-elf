---
title: "Raw - refund and already-spent cash policy (FMX-194)"
status: raw
tags: [research, raw, perplexity, monetization, refund, consumer-law, withdrawal, chargeback, entitlement, iap, no-p2w, fmx-194]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-194
related:
  - [[../monetization-legal-gates-2026-06-13]]
  - [[raw-monetization-legal-source-checks-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]
---

# Raw - refund and already-spent cash policy (FMX-194)

## Query

2026-06-13 Perplexity/Sonar query: refund and withdrawal-policy best practices
for a Germany/EU indie game selling a fixed-price, non-random consumable digital
cash pack. Required axes: EU/German withdrawal waiver, already-spent virtual
cash, Apple App Store Server Notifications, Google RTDN/Voided Purchases,
idempotent reconciliation, abuse controls and no-P2W/shared-state constraints.

## Captured answer

Perplexity recommended a **strict immediate-delivery waiver model with narrow
exception handling**, backed by an idempotent entitlement/currency ledger:

| Option | Raw assessment |
|---|---|
| **A. Strict immediate-waiver model with narrow exception layer** | Capture express consent and acknowledgement before immediate delivery, then treat post-delivery refunds as legal defects, unauthorized payment, provider reversal or goodwill. Recommended for fixed-price consumable cash. |
| B. Hybrid grace-period model | Allow refund before first spend or during a short goodwill window. Friendlier but more complex, and still needs the same waiver/evidence trail. |
| C. Pro-rated post-spend reversal | Refund unused balance while making spent value non-refundable except legal/provider cases. Operationally heavier and easier to mis-explain. |

## Already-spent cash handling

The answer argued against trying to reconstruct and roll back individual gameplay
effects after cash is spent. It recommended:

- record the purchase grant and every consumption/spend in an entitlement/ledger
  trail;
- on refund/void/chargeback, mark the purchase `refunded` / `revoked`;
- remove any remaining unspent cash tied to that purchase;
- if already spent, do **not** rewrite match, league, economy or shared-state
  history;
- put the account/save into a deterministic review/negative-balance/restricted
  purchase state if legal/provider policy requires recovery;
- block repeat abuse through manual review, cooldowns and provider dispute
  evidence, without denying valid statutory/platform rights.

## Store and provider signals

- Apple App Store Server Notifications and App Store Server API events should be
  processed idempotently; duplicate or late refund/revocation events must not
  double-revoke.
- Google Play RTDN plus the Voided Purchases API should be reconciled against the
  same entitlement ledger.
- Stripe/MoR webhooks must be signature-verified and replay-safe.

## No-P2W/shared-state note

Because ADR-0108 is draft and recommends zero effect on competitive shared state,
the refund policy should never allow a refunded purchase to leave an advantage in
rankings, async groups, exports, official comparisons or future multiplayer.
ADR-0063's Investor remains a singleplayer-only special case.

## Working interpretation for FMX-194

Use **A as the recommendation** for Nico: compliant withdrawal waiver plus
unspent-only economic revocation and no gameplay rollback, with manual review or
purchase restriction for already-spent abuse. Legal counsel still owns final
consumer-law wording.

