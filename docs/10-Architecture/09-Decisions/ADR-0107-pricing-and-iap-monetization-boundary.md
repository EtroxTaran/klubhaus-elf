---
title: ADR-0107 Pricing and IAP Monetization Boundary
status: draft
tags: [adr, architecture, monetization, pricing, iap, entitlement, no-p2w, privacy, fmx-191]
created: 2026-06-13
updated: 2026-06-13
type: adr
binding: false
amends: [[ADR-0063-investor-entitlement-and-payment-boundary]]
supersedes:
superseded_by:
addresses: [PM-2026-05-20-04-F-01]
related:
  - [[../../60-Research/monetization-model-and-no-p2w-canon-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-monetization-legal-privacy-store-policy-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-monetization-source-checks-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-no-pay-to-win-guardrails-2026-06-13]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]
  - [[ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[ADR-0109-payment-provider-and-monetization-legal-gates]]
---

# ADR-0107: Pricing and IAP Monetization Boundary

## Status

draft

> **Decision gate.** This ADR is the non-binding architecture proposal for FMX-191.
> It becomes binding only if Nico approves D1-D5 in
> [[../../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]. Until then,
> it is planning context and must not be implemented from.

## Context

FMX needs a monetization boundary before soft launch, but the project must preserve
future multiplayer fairness and legal/store compliance. The pre-mortem finding
PM-2026-05-20-04-F-01 explicitly requires a monetization GDDR plus pricing/IAP ADR.

Existing decision memory:

- [[ADR-0063-investor-entitlement-and-payment-boundary]] defines the Investor
  payment/entitlement boundary for clean singleplayer cash.
- [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  proposes the product/game-design rule: free core, cosmetics, Supporter Club, no
  paid power and singleplayer-only Investor isolation.
- FMX-194 produced draft
  [[ADR-0109-payment-provider-and-monetization-legal-gates|ADR-0109]] as the
  proposed provider, refund, withdrawal, age-gate and paid-activation legal
  gate. It remains non-binding until Nico approves its D1-D5 packet and legal
  review signs off actual artifacts.
- FMX-190 produced draft
  [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant|ADR-0108]] as the
  proposed project-wide no-P2W contract-test and MP/shared-fairness CI invariant.
  It remains non-binding until Nico approves its D1-D5 packet.

## Decision if ratified

FMX monetization is represented by a **pricing and entitlement boundary**, not by
direct writes from a store provider into gameplay state.

### 1. Entitlement classification

Every paid SKU/entitlement must be classified before implementation:

| Class | Architectural handling |
|---|---|
| `cosmetic_identity` | Presentation/profile entitlement only; no domain-state effect beyond cosmetic unlock ownership. |
| `supporter_qol` | Non-authoritative convenience/history/social entitlement; cannot expose hidden state or automate competitive decisions. |
| `account_service` | Account/profile service with no rank, fixture, squad, economy or reward effect. |
| `singleplayer_investor` | ADR-0063 special case; applies only to isolated singleplayer saves and is forbidden from shared/competitive surfaces. |
| `forbidden_power` | Not implementable without superseding GD-0041/ADR-0107 through Nico. |

### 2. No-P2W invariant

The boundary rejects any entitlement that can:

- change match, squad, staff, transfer, finance, training, injury, fatigue, morale,
  board, fan or schedule outcomes in a shared context;
- reveal hidden/probabilistic information with a competitive effect;
- increase competitive attempt volume or skip a competitive time gate;
- convert, trade or refund into competitive resources;
- cross from singleplayer paid state into async groups, rankings, watch-party state,
  official comparisons or future multiplayer. FMX-189 resolves this as a hard
  SP/hotseat/imported-save -> MP prohibition, not a neutralization flow.

### 3. Provider boundary

Payment providers are adapters outside the game model. They may confirm purchase,
refund, revocation and subscription status, but they do not decide gameplay effects.
The entitlement service must translate provider facts into classified entitlements
through an idempotent, audited boundary.

FMX-191 does **not** choose Apple IAP, Google Play Billing, web PSP, merchant of
record, tax provider, refund provider or checkout implementation.

### 4. Privacy and audit boundary

Persist only the minimum purchase/entitlement audit state needed for delivery,
support, refund/revocation and legal/tax proof:

- user/account id;
- SKU/entitlement id and classification;
- provider transaction/reference id;
- price, currency and tax fields where required;
- purchase, renewal, refund and revocation timestamps/status;
- legal-consent/withdrawal-waiver proof where required.

Do not store card data. Non-essential analytics, ads and marketing telemetry remain
behind the privacy/consent model and are outside this ADR.

### 5. Legal/store gates

Before implementation, FMX-194/legal review must verify:

- current Apple/Google/web policy for digital goods;
- EU/German consumer-law price display, pay-button copy and withdrawal-waiver wording;
- subscription renewal/cancellation copy if Supporter Club is paid recurring access;
- age-rating/IARC/USK descriptors;
- privacy notice, processor agreements, retention and international-transfer posture.

Paid random rewards and ads are outside the ratified FMX-191 canon unless explicitly
re-opened.

## Consequences

Positive:

- Monetization becomes a classified entitlement problem, not ad hoc game-state writes.
- The no-P2W promise has a draft FMX-190 enforcement contract in ADR-0108, with
  future tests still blocked until the toolchain exists and Nico accepts the
  decision packet.
- ADR-0063 remains usable but is constrained by the wider singleplayer-only rule.
- Provider/legal work is deliberately isolated to FMX-194.

Costs and constraints:

- SKU design must wait for classification and no-P2W review.
- Supporter analytics/history features need careful review because information can be
  competitive power in a management game.
- Product copy must not over-promise until ADR-0108 enforcement is accepted and
  implemented.

## Open Nico decisions

Approve or change the D1-D5 packet in
[[../../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]. Recommended
packet: **A/A/A/A/A**.
