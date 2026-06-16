---
title: Source checks - Webhook receiver security contract
status: raw
tags: [research, raw, source-checks, webhook, webhooks, security, replay-protection, idempotency, payment, stripe, apple, google-play, github, pubsub, pentest, fmx-187]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-187
related:
  - [[../webhook-receiver-security-and-pentest-bugbounty-2026-06-16]]
  - [[raw-webhook-receiver-security-pentest-bugbounty-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0128-webhook-receiver-security-contract]]
  - [[../../40-Execution/fmx-187-webhook-receiver-security-decision-queue-2026-06-16]]
---

# Source Checks - Webhook Receiver Security Contract

## Official Provider Sources

| Source | Checked fact | FMX use |
|---|---|---|
| Stripe webhook replay prevention, `https://docs.stripe.com/webhooks/signatures.md#preventing-replay-attacks` | Stripe includes a timestamp in `Stripe-Signature`; official libraries apply a default five-minute tolerance; tolerance should not be set to `0`; NTP synchronization matters; Stripe retries generate a new signature and timestamp. | FMX uses provider freshness checks where available and names Stripe's five-minute timestamp tolerance as the default target, not a custom 30-day signature window. |
| Stripe webhook best practices, `https://docs.stripe.com/webhooks.md#best-practices-for-using-webhooks` | Stripe recommends logging processed event IDs; for duplicate separate Event objects, use `data.object` id plus `event.type`; verify events with webhook signatures; require HTTPS in live mode; return a 2xx response quickly; roll secrets periodically; IP allowlisting is listed as an additional protection. | FMX separates delivery/event dedupe from business-object dedupe and treats IP allowlisting as defense in depth. |
| GitHub validating webhook deliveries, `https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries` | GitHub signs deliveries with HMAC-SHA256 in `X-Hub-Signature-256`, prefixed with `sha256=`; the HMAC uses the webhook secret and raw payload; comparison should use a constant-time function; payload encoding matters. | GitHub/security automation webhooks need the same verify-before-parse rule and raw-body preservation as payment webhooks. |
| Apple App Store Server Library Node README, `https://github.com/apple/app-store-server-library-node` | Apple's `SignedDataVerifier` verifies signed notification payloads with Apple root certificates, environment, bundle id and app Apple id context; the library exposes `verifyAndDecodeNotification(notificationPayload)`. | Apple App Store Server Notifications v2 must be verified as signed Apple payloads before entitlement/revocation state changes. |
| Google Pub/Sub authenticated push, `https://cloud.google.com/pubsub/docs/authenticate-push-subscriptions` | Authenticated push sends a JWT in the `Authorization` header; receivers validate token integrity/signature and check claims such as audience and service-account email; examples check `email_verified`. | Google RTDN/Pub/Sub push uses authenticated push JWT checks before accepting a notification. |
| Google Pub/Sub push authentication, `https://cloud.google.com/pubsub/docs/push#authentication` | Pub/Sub push authentication depends on configured service-account identity and audience; tokens can be up to one hour old. | FMX must not impose Stripe-style five-minute timestamp logic on Google push; it verifies the Pub/Sub JWT and dedupes message/business ids instead. |

## Documentation Tool Checks

| Tool/source | Checked fact | FMX use |
|---|---|---|
| Context7 Stripe docs | Current Stripe examples require the unmodified request body, `Stripe-Signature` header and `constructEvent`-style verification with the endpoint secret. | WAF/body parsers must preserve raw body before verification. |
| Context7 GitHub docs | Current GitHub webhook validation uses `X-Hub-Signature-256` and secret-based HMAC verification. | GitHub webhook handlers are covered by the generic receiver contract, not only payment paths. |
| Context7 Google Pub/Sub docs | Current Pub/Sub push subscriptions support OIDC/JWT authenticated push with a service account. | Google RTDN receiver uses Pub/Sub auth checks plus idempotent business processing. |
| Ref source checks | Official docs were re-read for Stripe replay/best practices, GitHub validation, Apple notification verification and Google Pub/Sub authentication. | Provider-specific claims in the ADR are source-checked rather than inferred from the Perplexity pass. |

## Local Vault Source Checks

| Source | Checked fact | FMX use |
|---|---|---|
| [[../../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]] | Investor entitlement planning already requires server-authoritative, exactly-once grants, provider transaction id dedupe, Apple ASSN / Google RTDN idempotency and reconciliation jobs. | FMX-187 supplies the missing receiver-security contract without reopening the payment-provider decision. |
| [[../../30-Implementation/club-economy-commercial-contracts]] | `InvestorEntitlementGrant` is idempotent by `storeTransactionRef`, account-bound and denied for multiplayer/leaderboard/offline self-grant. | The webhook receiver gates before `ConfirmInvestorEntitlement`; CommercialPortfolio still owns entitlement policy. |
| [[../../60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity]] F-07 | Historical F-07 identified webhook forgery and sketched signature checks, event id idempotency, 30-day replay window and IP allowlisting, but had no linked ADR or Linear issue. OQ-S-03/OQ-S-04 left bug bounty and pentest timing open. | FMX-187 closes the missing ADR link and turns pentest/bounty posture into an accepted planning decision. |
| [[../../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]] | Command replay/dedup belongs to an Audit & Security-owned synchronous reception capability before domain validation. | Webhook reception follows the same verify/dedup-before-domain pattern, but with provider-specific proof rather than app-managed command signatures. |
| [[../../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]] | Payment/receipt facts may have legal retention requirements and must remain partitioned from erasable account/profile data. | Webhook raw payload handling must minimize retained payloads and store hashes/derived facts unless legal/provider evidence requires more. |

## Corrections Applied

- **Replay window:** Stripe signature freshness is a short timestamp tolerance
  around receipt time. The old pre-mortem's 30-day phrase is retained only for
  delivery/event dedupe records, not for accepting stale signatures.
- **Dedupe key:** `eventId` alone is insufficient for payments. FMX needs
  provider delivery/event dedupe plus business-object dedupe by transaction,
  purchase token, renewal/refund/void reference or `data.object` id + event
  type where the provider can emit multiple Event objects.
- **IP allowlisting:** Useful only as optional network hardening where provider
  ranges are stable and maintained. It is never a replacement for signature/JWT
  verification.
- **Raw body:** Any framework, WAF or reverse proxy must preserve the original
  body and signing headers until verification is complete.
- **Pentest / bounty:** Run focused external pentest first; defer public bounty
  until receiver controls, triage, disclosure text and budget are mature.

