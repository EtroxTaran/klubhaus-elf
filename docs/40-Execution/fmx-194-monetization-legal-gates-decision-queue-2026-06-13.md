---
title: FMX-194 Monetization legal gates decision queue
status: accepted
tags: [execution, decision-queue, monetization, payment, legal, compliance, fmx-194, accepted]
created: 2026-06-13
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-194
related:
  - [[../60-Research/monetization-legal-gates-2026-06-13]]
  - [[../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
  - [[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
---

# FMX-194 Monetization legal gates decision queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-194.


This is the HITL decision queue for FMX-194. It turns the research synthesis
[[../60-Research/monetization-legal-gates-2026-06-13]] into explicit Nico
decisions for accepted
[[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates|ADR-0109]]
.

## D1 - web payment vendor posture

| Option | Meaning | Assessment |
|---|---|---|
| **A. Web MoR first + direct PSP fallback** | Start paid web/PWA checkout with a Merchant-of-Record-class provider behind `PaymentProviderPort`; keep Stripe-direct/Stripe Tax as fallback or later migration. | **Recommended.** Lowest operational tax/invoice/dispute burden for one EU digital consumable, while preserving adapter portability. |
| B. Stripe-direct first | FMX is seller/merchant for web payments and owns VAT/OSS, invoicing, disputes and legal evidence directly. | More control and likely lower processor margin, but too much compliance ops for first paid launch. |
| C. No web purchase at launch | Delay web paid checkout and sell only through store IAP later. | Reduces web legal work but blocks PWA monetization and does not solve app-shell compliance. |

**Recommendation:** A.

## D2 - native app-shell billing boundary

| Option | Meaning | Assessment |
|---|---|---|
| **A. Apple/Google IAP for in-app digital cash** | Any native app-shell purchase of Investor cash uses StoreKit / Google Play Billing unless current regional entitlement review allows otherwise. | **Recommended.** Matches current Apple/Google policy checks and avoids app-review rejection. |
| B. Consumption-only app shell | Native shells can consume web-purchased entitlements but contain no purchase CTA. | Viable fallback if app IAP implementation is deferred, but weaker monetization UX. |
| C. External-link purchase from app | Use external checkout links where regional programs allow. | Requires fresh jurisdiction/store entitlement review; not a default. |

**Recommendation:** A, with B as a fallback if app-shell purchase work is deferred.

## D3 - refund / already-spent cash policy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Waiver + unspent-only revocation + no gameplay rollback** | Capture immediate-delivery waiver; on refund/void/chargeback revoke remaining unspent purchased cash, mark entitlement refunded/revoked and restrict/review abuse; do not roll back gameplay facts. | **Recommended.** Consumer-law aware, deterministic, and aligned with no-P2W/shared-state constraints. |
| B. Negative balance recovery | If spent, allow the save/account to go negative and recover future cash until balanced. | More economically strict but can punish legitimate refunds and creates UX/legal support risk. |
| C. Full gameplay rollback | Rewind saves/events affected by the refunded cash. | Reject. High determinism, support and fairness risk; likely impossible across shared/exported state. |

**Recommendation:** A.

## D4 - age gate / age assurance strictness

| Option | Meaning | Assessment |
|---|---|---|
| **A. Proportional age assurance** | Declared age before account/payment, under-16 Germany no optional tracking/marketing and conservative account/payment handling, platform ratings/parental controls for app shells. | **Recommended.** Stronger than a bare gate, privacy-minimal, proportionate to non-gambling/non-lootbox scope. |
| B. Strict 16+ hard gate | Block account/payment for users declaring under 16. | Simpler and conservative, but may unnecessarily narrow audience if legal review would permit a parent/guardian path. |
| C. Full identity-grade age verification | KJM-style adult verification / ID checks. | Overkill unless future scope adds adult-only, gambling/betting-like or high-risk social/UGC features. |

**Recommendation:** A, with B acceptable if Nico wants a simpler launch posture.

## D5 - paid soft-launch activation

| Option | Meaning | Assessment |
|---|---|---|
| **A. Compliance-gated activation** | Paid flows stay disabled until Terms, waiver, confirmation email, imprint, privacy/DPA, refund runbook, provider smoke, age/rating evidence, kill switch and legal sign-off are complete. | **Recommended.** Paid soft launch is still production from a consumer-law perspective. |
| B. Limited closed paid beta without full artifacts | Enable payments to a small group before all legal artifacts are complete. | Reject. Payment, withdrawal, tax and privacy obligations do not disappear in a small beta. |
| C. Free-only soft launch first | Keep soft launch free until legal artifacts are ready. | Viable fallback if the compliance gate blocks schedule. |

**Recommendation:** A, with C as the schedule fallback.

## Decision record

- 2026-06-13: FMX-194 claimed and moved to `In Progress`.
- 2026-06-13: Perplexity research and official/source checks saved.
- 2026-06-13: compliance evidence home created in [[../40-Compliance/README]].
- 2026-06-13: draft ADR-0109 prepared as a non-binding proposal record.
- Accepted by Nico 2026-06-19: D1-D5 above.

## Recommended approval packet

Approve **D1=A, D2=A, D3=A, D4=A, D5=A**.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=A, D2=A with B fallback if app-shell purchase work is deferred, D3=A, D4=A with B acceptable if Nico wants a simpler launch posture, D5=A with C schedule fallback**.

No open Nico decision remains for FMX-194.

## Related

- [[../60-Research/monetization-legal-gates-2026-06-13]]
- [[../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
- [[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
- [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
- [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
- [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
