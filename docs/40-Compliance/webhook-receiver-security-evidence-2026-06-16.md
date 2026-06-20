---
title: Webhook receiver security evidence
status: current
tags: [compliance, security, evidence, webhook, webhooks, payment, entitlement, pentest, bug-bounty, fmx-187]
context: audit-security
created: 2026-06-16
updated: 2026-06-16
type: compliance
binding: false
linear: FMX-187
related:
  - [[README]]
  - [[../10-Architecture/09-Decisions/ADR-0128-webhook-receiver-security-contract]]
  - [[../60-Research/webhook-receiver-security-and-pentest-bugbounty-2026-06-16]]
  - [[../40-Execution/fmx-187-webhook-receiver-security-decision-queue-2026-06-16]]
  - [[monetization-legal-gates-evidence-2026-06-13]]
---

# Webhook Receiver Security Evidence

This note is the future evidence hook for ADR-0128. It is not a legal approval
and it does not activate paid flows. It becomes a release blocker when a future
implementation/promotion issue enables real payment, entitlement, GitHub or
control webhooks.

## Evidence Checklist

| Gate | Required evidence | Owner before beta/paid launch | Status |
|---|---|---|---|
| Provider docs re-check | Current official verification docs for selected PSP/MoR, Apple, Google and any GitHub/control provider saved with version/date. | Engineering / Security | proposed |
| Raw body preservation | Framework/WAF/proxy test proving raw payload and signing headers are unchanged before verification. | Engineering | proposed |
| Provider proof verification | Positive/negative tests for each provider signature/JWT/signed payload path. | Engineering / Security | proposed |
| Freshness/replay tests | Stale timestamp/token, duplicate delivery and mismatched payload/signature fixtures reject before domain mutation. | Engineering / Security | proposed |
| Business idempotency tests | Same `storeTransactionRef` / purchase token / provider order/refund id cannot grant or revoke value twice. | Engineering / Product | proposed |
| Reconciliation smoke | Provider sandbox/API reconciliation proves local state recovers from missed, delayed and duplicate notifications. | Engineering / Support | proposed |
| Metrics and audit | `webhook_signature_invalid_total`, freshness reject, duplicate delivery, business duplicate and reconciliation mismatch metrics visible. | Engineering / Ops | proposed |
| Payload retention review | Stored receiver facts follow ADR-0127: hashes/derived facts by default, raw payload only with explicit legal/provider evidence need. | Privacy / Legal / Engineering | proposed |
| Focused pentest | External report covering auth/session, save import/export, command reception, provider webhooks, entitlement/revocation and reconciliation. | Nico / Security / Engineering | proposed |
| Bug bounty readiness | Disclosure text, triage owner, duplicate policy, severity table and budget approved before public expansion. | Nico / Security / Legal | deferred |

## Launch Rule

- Public beta or real paid activation cannot expose payment/entitlement webhook
  surfaces before the focused external pentest is complete and material findings
  are remediated or explicitly accepted by Nico.
- Public bug bounty is a later maturity step, not the first security gate.

