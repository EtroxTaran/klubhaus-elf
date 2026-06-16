---
title: FMX-187 Webhook receiver security decision record
status: accepted
tags: [execution, decision-queue, security, webhook, webhooks, replay-protection, idempotency, payment, pentest, bug-bounty, fmx-187]
created: 2026-06-16
updated: 2026-06-16
type: decision-queue
binding: true
linear: FMX-187
related:
  - [[../60-Research/webhook-receiver-security-and-pentest-bugbounty-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0128-webhook-receiver-security-contract]]
  - [[../40-Compliance/webhook-receiver-security-evidence-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-webhook-receiver-security-pentest-bugbounty-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-webhook-receiver-security-source-checks-2026-06-16]]
  - [[../60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity]]
---

# FMX-187 Webhook Receiver Security Decision Record

This is the accepted HITL decision record for FMX-187. It records Nico's
choices after Perplexity-first research, official provider source checks and
local vault reconciliation.

## Decision Summary

Nico accepted the recommended packet on 2026-06-16:

| Decision | Accepted option | Result |
|---|---|---|
| D1 - Contract home | **Dedicated ADR** | Webhook receiver security is captured in accepted ADR-0128 and linked from payment/security/front-door docs. |
| D2 - Security baseline | **Crypto plus dedupe** | Provider-native signature/JWT verification is mandatory; delivery/event dedupe plus business-object idempotency are mandatory; IP allowlisting is optional hardening only. |
| D3 - Testing posture | **Pentest first** | Focused external pentest is required before public beta/paid launch for webhook/payment/control surfaces; public bug bounty is deferred until triage/disclosure/budget are ready. |

## Source-Checked Basis

- Stripe signs webhook payloads and includes timestamp freshness; official
  libraries use a five-minute default tolerance and advise against tolerance
  `0`.
- Stripe best-practice docs distinguish processed event-id logging from
  duplicate separate Event objects, where business object id plus event type is
  needed.
- GitHub webhook validation uses `X-Hub-Signature-256` HMAC-SHA256 over the raw
  payload and constant-time comparison.
- Apple App Store Server Notifications v2 use signed payload verification via
  Apple root certificates and app/environment context.
- Google Pub/Sub authenticated push uses JWT verification, audience and
  service-account claims rather than Stripe-style short timestamp checks.
- Local vault checks show ADR-0063 already required exactly-once
  server-authoritative entitlement grants but lacked a dedicated receiver
  security contract.

## Options Considered

### D1 - Contract home

| Option | Meaning | Assessment |
|---|---|---|
| **A. Dedicated ADR** | Accepted cross-cutting receiver-security ADR. | **Accepted.** Best traceability for pre-mortem F-07 and future code phase. |
| B. Extend ADR-0063 | Payment-only amendment. | Rejected; too narrow for GitHub/security/control webhooks. |
| C. Implementation note only | No accepted ADR. | Rejected; leaves F-07 without a binding architecture link. |

### D2 - Security baseline

| Option | Meaning | Assessment |
|---|---|---|
| **A. Crypto plus dedupe** | Provider proof, delivery/event dedupe and business-object idempotency. | **Accepted.** Fits all source-checked providers. |
| B. Crypto plus mandatory IP allowlist | Signatures/JWT plus static provider ranges for all paths. | Rejected; brittle and not universal. |
| C. Minimal provider checks | Verify provider proof only. | Rejected; duplicate/stale ingress reaches domain too late. |

### D3 - Testing posture

| Option | Meaning | Assessment |
|---|---|---|
| **A. Pentest first** | External focused pentest before public beta/paid launch; bounty later. | **Accepted.** Strongest pragmatic launch posture. |
| B. Bug bounty first | Public bounty before pentest. | Rejected; immature intake/disclosure risk. |
| C. Defer both | Internal testing only. | Rejected for payment/control ingress. |

## Decision Record

- 2026-06-16: FMX-187 selected after live Linear/worktree/GitHub triage.
- 2026-06-16: FMX-187 moved from `Backlog` to `In Progress`.
- 2026-06-16: Clean worktree/branch created:
  `codex/fmx-187-webhook-receiver-security`.
- 2026-06-16: Perplexity discovery captured for webhook receiver security,
  replay/idempotency, pentest and bug-bounty sequencing.
- 2026-06-16: Official source checks captured for Stripe, GitHub, Apple App
  Store Server Notifications, Google Pub/Sub authenticated push and local FMX
  payment/security notes.
- 2026-06-16: Nico accepted D1-D3 above; ADR-0128 promoted to accepted.

## Resulting Packet

- [[../10-Architecture/09-Decisions/ADR-0128-webhook-receiver-security-contract]]
  is accepted / binding.
- [[../60-Research/webhook-receiver-security-and-pentest-bugbounty-2026-06-16]]
  remains the source-checked research basis.
- [[../40-Compliance/webhook-receiver-security-evidence-2026-06-16]] is the
  evidence hook for future receiver smoke tests, pentest artifacts and later
  bounty-readiness checks.
- Future code phase must implement provider verification, raw-body preservation,
  delivery/event dedupe, business-object idempotency, metrics and reconciliation
  before payment/control webhooks can launch.

## Related

- [[../60-Research/webhook-receiver-security-and-pentest-bugbounty-2026-06-16]]
- [[../10-Architecture/09-Decisions/ADR-0128-webhook-receiver-security-contract]]
- [[../40-Compliance/webhook-receiver-security-evidence-2026-06-16]]
- [[../60-Research/raw-perplexity/raw-webhook-receiver-security-pentest-bugbounty-2026-06-16]]
- [[../60-Research/raw-perplexity/raw-webhook-receiver-security-source-checks-2026-06-16]]

