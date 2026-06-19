---
title: ADR-0109 Payment Provider and Monetization Legal Gates
status: accepted
tags: [adr, architecture, monetization, payment, merchant-of-record, refund, age-gate, compliance, legal, fmx-194, accepted]
created: 2026-06-13
updated: 2026-06-19
type: adr
binding: true
amends:
  - [[ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/monetization-legal-gates-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-payment-provider-mor-vs-direct-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-refund-spent-cash-policy-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-age-gate-and-soft-launch-gates-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-monetization-legal-source-checks-2026-06-13]]
  - [[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
  - [[../../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]
  - [[ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
---

# ADR-0109: Payment Provider and Monetization Legal Gates

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

> **Decision gate.** This ADR is the non-binding FMX-194 proposal. It becomes
> binding only if Nico approves D1-D5 in
> [[../../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]].
> Until then it is planning context and must not be implemented from.

## Date

- Drafted: 2026-06-13 (FMX-194)

## Context

[[ADR-0063-investor-entitlement-and-payment-boundary|ADR-0063]] ratified the
Investor entitlement/payment boundary shape but explicitly left legal-sensitive
gates unresolved: provider/MoR-vs-direct, refund-of-spent-cash, age-gate
strictness and paid activation timing. [[ADR-0107-pricing-and-iap-monetization-boundary|ADR-0107]]
and [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant|ADR-0108]] are draft
monetization/no-P2W proposals; they do not close the legal launch gate.

FMX-194 prepares the missing decision packet and creates a compliance evidence
home at [[../../40-Compliance/README]].

## Options considered

### D1 - web payment vendor posture

| Option | Shape | Assessment |
|---|---|---|
| **A. Web MoR first + direct PSP fallback** | Use a Merchant-of-Record-class web provider behind `PaymentProviderPort`; keep Stripe-direct/Stripe Tax as fallback or later migration. | **Recommended.** Best first-launch balance of tax/invoice/dispute offload and portability. |
| B. Stripe-direct first | FMX sells directly and owns VAT/OSS, invoice, dispute and legal evidence directly. | Strong control; heavier compliance/finance operations. |
| C. No web purchase at launch | Delay web paid checkout and only implement store IAP later. | Schedule fallback, not product default. |

### D2 - native app-shell billing boundary

| Option | Shape | Assessment |
|---|---|---|
| **A. Apple/Google IAP for in-app digital cash** | App-shell purchase uses StoreKit / Google Play Billing unless a current regional entitlement review says otherwise. | **Recommended.** Current Apple/Google policy checks support this. |
| B. Consumption-only app shell | App shells consume web-purchased entitlements but do not sell them. | Acceptable fallback if IAP is deferred. |
| C. External-link checkout from app | Use external purchase links where regional programs permit. | Requires current store/jurisdiction review each time. |

### D3 - refund / already-spent cash policy

| Option | Shape | Assessment |
|---|---|---|
| **A. Waiver + unspent-only revocation + no gameplay rollback** | Capture immediate-delivery waiver; on refund/void/chargeback revoke remaining purchased cash, mark entitlement refunded/revoked, restrict/review abuse and do not roll back gameplay facts. | **Recommended.** Replay-safe and aligned with ADR-0108's proposed fairness invariant. |
| B. Negative balance recovery | Recover already-spent value through future cash. | Stronger economic recovery, higher UX/legal support risk. |
| C. Full gameplay rollback | Rewind simulation state affected by refunded cash. | Reject; brittle and incompatible with shared/exported state. |

### D4 - age gate / age assurance

| Option | Shape | Assessment |
|---|---|---|
| **A. Proportional age assurance** | Declared age before account/payment, under-16 Germany no optional tracking/marketing and conservative account/payment handling, platform ratings/parental controls for app shells. | **Recommended.** Proportionate to non-gambling, non-lootbox scope. |
| B. Strict 16+ hard gate | Block under-16 account/payment. | Simpler but may be stricter than needed if legal review approves guardian paths. |
| C. Identity-grade AVS | Full adult-verification/KJM-style flow. | Future trigger only for adult/gambling/betting-like or high-risk social scope. |

### D5 - paid soft-launch activation

| Option | Shape | Assessment |
|---|---|---|
| **A. Compliance-gated activation** | Paid flows stay disabled until legal artifacts, provider smoke, age/rating evidence, kill switch and legal sign-off are complete. | **Recommended.** Paid soft launch is a consumer-law production event. |
| B. Limited paid beta before artifacts | Enable paid beta for small group before full legal artifacts. | Reject. |
| C. Free-only soft launch first | Launch free until legal artifacts are complete. | Good fallback if gate blocks schedule. |

## Proposed decision if accepted

Adopt **D1=A, D2=A, D3=A, D4=A, D5=A**:

1. Web/PWA paid checkout starts **MoR-first** behind ADR-0063's
   `PaymentProviderPort`; direct PSP remains a documented fallback.
2. Store-distributed app shells use **Apple/Google IAP** for in-app digital cash
   unless a fresh regional/store entitlement review approves another route.
3. Refund/chargeback handling uses **immediate-delivery waiver + unspent-only
   revocation + no gameplay rollback**.
4. Age handling uses **proportional age assurance** and conservative under-16
   Germany data/marketing/payment treatment.
5. Paid activation is blocked by a **compliance gate** in
   [[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]].

## Boundary rules

- `PaymentProviderPort` remains provider-neutral; domain/gameplay code cannot
  depend on Paddle, FastSpring, Lemon Squeezy, Stripe, Apple or Google types.
- Payment providers are acquisition channels; the backend entitlement ledger is
  the source of truth.
- Every paid grant records the applicable `providerPolicyVersion`,
  `disclosureVersion`, `withdrawalWaiverVersion`, `ageGatePolicyVersion` and
  `legalArtifactVersion`.
- Refund/revocation changes entitlement/payment state only. It does not mutate
  match, league, historical economy, ranking, export or future multiplayer facts.
- Public no-P2W or refund copy cannot ship before legal review and the relevant
  future test gates exist.

## Consequences

Positive:

- ADR-0063's open legal gates get a clear HITL path.
- Provider choice remains swappable and no one-way-door vendor dependency is
  introduced in the docs-only phase.
- Refund handling is deterministic and compatible with no-P2W/shared-state
  constraints.
- Compliance evidence has a durable vault home.

Negative / constraints:

- Web MoR fees and lock-in may be higher than Stripe-direct.
- App-shell purchases still require native billing work and current store review.
- Legal counsel can still require stricter waiver, refund, age or artifact rules.
- Paid launch cannot happen before the compliance checklist is green.

## Supersedes

None.

## Related Docs

- [[../../60-Research/monetization-legal-gates-2026-06-13]]
- [[../../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]]
- [[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
- [[ADR-0063-investor-entitlement-and-payment-boundary]]
- [[ADR-0107-pricing-and-iap-monetization-boundary]]
- [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]

