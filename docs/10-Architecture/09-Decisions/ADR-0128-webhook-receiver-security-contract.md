---
title: ADR-0128 Webhook Receiver Security Contract
status: accepted
tags: [adr, architecture, security, webhook, webhooks, replay-protection, idempotency, payment, entitlement, pentest, bug-bounty, audit, fmx-187]
created: 2026-06-16
updated: 2026-06-16
type: adr
binding: true
linear: FMX-187
supersedes:
superseded_by:
amends:
  - [[ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[ADR-0119-command-reception-dedup-seam]]
related:
  - [[../../60-Research/webhook-receiver-security-and-pentest-bugbounty-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-webhook-receiver-security-pentest-bugbounty-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-webhook-receiver-security-source-checks-2026-06-16]]
  - [[../../40-Execution/fmx-187-webhook-receiver-security-decision-queue-2026-06-16]]
  - [[../../40-Compliance/webhook-receiver-security-evidence-2026-06-16]]
  - [[../../60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[ADR-0127-erasure-vs-hgb-retention-field-partition]]
---

# ADR-0128: Webhook Receiver Security Contract

## Status

accepted

Nico accepted D1-D3 on 2026-06-16 after Perplexity-first research, official
provider source checks and local vault reconciliation. This ADR is binding
planning truth for future webhook receiver implementation.

## Date

2026-06-16

## Context

The Security & Integrity pre-mortem identified webhook forgery as
PM-2026-05-20-05-F-07: public endpoints can be forged to grant paid
entitlements or create automation/audit noise if they trust payloads before
verification. The historical mitigation sketch named Stripe signatures,
`eventId` idempotency, a 30-day replay window and IP allowlisting, but it had no
linked ADR, no provider matrix and no accepted pentest/bug-bounty posture.

ADR-0063 already requires server-authoritative, exactly-once Investor
entitlements and provider reconciliation. FMX-187 supplies the missing receiver
security contract for future payment, app-store, MoR, GitHub/security and
control webhooks. It does not choose a payment provider, activate paid flows or
introduce code.

## Decision Drivers

- Payment/entitlement webhooks are public internet ingress and must not grant
  value without provider-authenticated proof.
- Provider webhook systems are at-least-once, can duplicate events and can emit
  multiple event objects for one business object.
- FMX must preserve provider raw body/signing material until verification.
- Security controls must be provider-swappable because ADR-0109 payment/MoR
  choices are still legally gated.
- Testing posture must reduce launch risk without opening an immature public
  bounty program too early.

## Options Considered

### D1 - Contract home

| Option | Meaning | Assessment |
|---|---|---|
| **A. Dedicated ADR** | Create a standalone receiver-security ADR linked from payment, Audit & Security and pre-mortem notes. | **Accepted.** The contract crosses several domains and needs one binding home. |
| B. Extend ADR-0063 only | Put all rules into the Investor/payment boundary. | Rejected; too payment-specific and would miss GitHub/security/control webhooks. |
| C. Implementation note only | Leave as future code guidance. | Rejected; F-07 needed an ADR link and accepted testing posture before code phase. |

### D2 - Security baseline

| Option | Meaning | Assessment |
|---|---|---|
| **A. Crypto plus dedupe** | Provider-native signature/JWT verification, delivery/event dedupe and business-object idempotency; IP allowlisting optional. | **Accepted.** Best fit for Stripe, Apple, Google Pub/Sub, GitHub and future MoR providers. |
| B. Crypto plus mandatory IP allowlist | Require signatures and static IP allowlists for every provider. | Rejected; some providers' ranges/processes are not suitable as a universal hard dependency. |
| C. Minimal provider checks | Verify provider proof but rely on domain idempotency only. | Rejected; duplicate/stale ingress should be rejected before domain processing. |

### D3 - Security testing posture

| Option | Meaning | Assessment |
|---|---|---|
| **A. Pentest first** | Run a focused external pentest before public beta/paid launch; defer public bug bounty until controls and triage are mature. | **Accepted.** Best launch-risk posture with manageable intake. |
| B. Bug bounty first | Open public bounty before or instead of pentest. | Rejected; immature surfaces create triage/legal noise. |
| C. Defer both | Rely on internal tests for beta. | Rejected for payment/entitlement ingress. |

## Decision

FMX adopts a dedicated, provider-neutral webhook receiver security contract.

Every external provider/control webhook must follow this order:

1. Preserve TLS, raw request body and provider signing/authentication headers
   through edge, WAF and framework middleware.
2. Enforce coarse edge controls: route/method allowlist, size limits,
   rate-limit and deny obvious malformed requests.
3. Verify the provider-native proof before treating the payload as trusted:
   signature/HMAC for Stripe-like and GitHub-like providers, Apple signed
   payload verification for App Store Server Notifications v2, authenticated
   Pub/Sub push JWT for Google RTDN, and source-checked MoR-specific proof for
   future web providers.
4. Persist a minimal receiver receipt with provider, delivery/event id or
   equivalent, received timestamp, verification method/result, raw payload hash
   and normalized business reference.
5. Reject stale, invalid or duplicate deliveries before domain validation.
6. Apply business-object idempotency before side effects. Payment entitlements
   must dedupe by `storeTransactionRef` or equivalent provider
   transaction/order/purchase-token reference for the full entitlement/legal
   retention lifecycle.
7. Hand only verified normalized facts to the owning domain capability
   (CommercialPortfolio for Investor entitlements, tooling/security owners for
   GitHub/control webhooks).
8. Emit security metrics and audit facts for invalid signatures, freshness
   failures, duplicate deliveries, duplicate business objects, reconciliation
   mismatches and accepted outcomes.

IP allowlisting is optional network hardening where provider ranges are stable
and maintained automatically. It is never the source of trust and must never
replace provider-native cryptographic verification.

## Provider Matrix

| Provider/path | Required proof | Replay/dedupe rule |
|---|---|---|
| Stripe/direct PSP | Official signature over raw body and timestamp freshness. Planning default: Stripe's documented five-minute tolerance with NTP-synchronized servers. | Delivery/event id receipt; for separate Event objects use business object id plus event type; entitlement grant still dedupes by `storeTransactionRef`. |
| Web MoR | Provider-native signed/JWT proof from selected provider docs at adoption time. | Provider delivery/event id plus order/transaction/refund object id. |
| Apple App Store Server Notifications v2 | Signed payload verification with Apple root certificates, environment, bundle id and app Apple id context. | Notification/transaction id plus original transaction or purchase/revocation reference. |
| Google Play RTDN via Pub/Sub push | Authenticated Pub/Sub push JWT; validate signature, audience, service-account email and expected claims. | Pub/Sub message id plus package/purchase-token/order/revocation reference. |
| GitHub/security automation | `X-Hub-Signature-256` HMAC-SHA256 over raw payload, constant-time comparison. | Delivery id plus action/resource id where applicable. |

## Replay Windows

- Provider signature freshness follows provider docs. Stripe-style timestamp
  proof is short-lived; do not treat a 30-day dedupe record as permission to
  accept an old signature.
- Delivery/event receipts must retain enough data to reject duplicates for at
  least 30 days after receipt in the planning baseline.
- Business-object idempotency for paid entitlements persists through the
  entitlement/legal-retention lifecycle so one purchase/refund/void reference
  cannot grant or revoke value twice.
- Provider reconciliation remains mandatory for payment paths; webhooks are
  signals, not the only truth source.

## Testing and Release Gate

- A focused external pentest is required before public beta or real paid
  activation exposing payment/entitlement webhook surfaces.
- Minimum pentest scope: auth/session, save import/export, command reception,
  provider webhook receivers, entitlement/refund/revocation, reconciliation,
  API rate limits and security logging.
- A public bug bounty is deferred until after stable receiver controls,
  disclosure policy, triage owner, duplicate handling and budget exist. A
  private/trusted reporter pilot may precede the public program.
- Exact vendor, budget and date are future procurement decisions; the accepted
  architecture rule is order and minimum gate: pentest first, bounty later.

## Consequences

Positive:

- Closes PM-2026-05-20-05-F-07 with a linked accepted ADR.
- Prevents forged or replayed payment/control webhooks from reaching domain
  side effects.
- Keeps future payment provider choices open while enforcing a stable receiver
  contract.
- Separates provider delivery dedupe from business entitlement idempotency.

Negative / constraints:

- Future implementation must handle provider-specific verification libraries
  and raw-body middleware carefully.
- Receiver storage must persist enough receipts and business references for
  dedupe, reconciliation and audit without over-retaining raw payload data.
- Paid/beta launch planning must budget external pentest time.

## Boundaries

- This ADR does not choose Stripe, MoR, Apple/Google package code or payment
  activation timing.
- This ADR does not define refund-of-spent-cash policy or no-P2W fairness
  rules.
- This ADR does not supersede ADR-0127; payment payload retention must follow
  the accepted erasure-vs-HGB field partition.

## Related Docs

- [[../../60-Research/webhook-receiver-security-and-pentest-bugbounty-2026-06-16]]
- [[../../60-Research/raw-perplexity/raw-webhook-receiver-security-pentest-bugbounty-2026-06-16]]
- [[../../60-Research/raw-perplexity/raw-webhook-receiver-security-source-checks-2026-06-16]]
- [[../../40-Execution/fmx-187-webhook-receiver-security-decision-queue-2026-06-16]]
- [[../../40-Compliance/webhook-receiver-security-evidence-2026-06-16]]
- [[../../60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity]]
- [[../../30-Implementation/club-economy-commercial-contracts]]
- [[ADR-0063-investor-entitlement-and-payment-boundary]]
- [[ADR-0127-erasure-vs-hgb-retention-field-partition]]

