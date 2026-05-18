---
title: Implementation Map
status: current
tags: [implementation, meta]
created: 2026-05-16
updated: 2026-05-18
type: map
binding: false
related: [[Architecture-Map]], [[Current-State]]
---

# Implementation Map

Use this map for operational, deployment, data, and agent workflow work.

## Implementation Notes

- [Cursor Cloud Agent Workflow](../30-Implementation/cursor-cloud-agent-workflow.md)
- [Linear Task Tracking](../30-Implementation/linear-task-tracking.md)
- [PWA Offline Strategy](../30-Implementation/pwa-offline-strategy.md)
- [SurrealDB Integration](../30-Implementation/surrealdb-integration.md)
- [Deployment Dokploy](../30-Implementation/deployment-dokploy.md)
- [Observability Runbook](../30-Implementation/observability-runbook.md)
- [Client Telemetry](../30-Implementation/client-telemetry.md)
- [Jobs and Scheduler](../30-Implementation/jobs-and-scheduler.md) - includes
  matchday scheduling, quality-profile dispatch and future extracted
  `match-worker` observability hooks.
- [Audit Trail](../30-Implementation/audit-trail.md)
- [Auth Flows](../30-Implementation/auth-flows.md) — F2 (2026-05-18,
  `current binding`). Passkey-first sign-up + login with password
  fallback; opt-in TOTP / WebAuthn-as-MFA; 10 single-use recovery
  codes; step-up MFA on the sensitive-op catalogue; opaque
  session + refresh cookies (Lax + Strict) with refresh-token
  rotation and reuse detection; three-layer CSRF defence (SameSite
  + Origin/Sec-Fetch-Site + double-submit token); Argon2id password
  storage; HIBP breach check; Redis-based progressive throttling;
  no external IdP / CAPTCHA / SMS at MVP. ASVS v5.0 V6 + NIST
  800-63B AAL2 mapped. Anchors on [[../60-Research/threat-model]]
  and ADR-0005; binds inputs for F3 (sessions), F5 (recovery),
  F6 (GDPR), F12 (rate limits).
- [Session Management](../30-Implementation/session-management.md) — F3
  (2026-05-18, `current binding`). Redis-based opaque session +
  refresh-token store; 15-second rotation grace window with strict
  reuse detection outside it; 30 min idle / 12 h absolute on
  `session_id`; 30 d refresh-family absolute cap; slide-on-meaningful-
  activity with 60 s rate-limit; cross-tab logout via BroadcastChannel
  + localStorage sentinel; 15-trigger revocation matrix with hybrid
  `tokenVersion` + family-revoke; `device` SCHEMAFULL table with
  separation between user-visible devices and operational sessions;
  "Trust this device" opt-in MFA-skip (30 d cap, anomaly-downgradeable);
  per-device revoke does not rotate `accountSecret` by default;
  TanStack Start integration via `getSessionFromRequest` +
  `createAuthedServerFn` HOF + `_authed` route guard + CSRF
  interceptor + Workbox SW bypass; admin CLI emergency-revoke at
  MVP. Full ASVS v5.0 V7 + V8 mapping + NIST SP 800-63B §7 anchors.
  Anchors on [[../60-Research/threat-model]] (F1) and
  [[../30-Implementation/auth-flows]] (F2); binds inputs for F5
  (envelope), F6 (DSAR + DPIA), F12 (edge WAF).
- [Incident Response](../30-Implementation/incident-response.md)
- [Secrets Rotation](../30-Implementation/secrets-rotation.md)
- [Transfer Market Implementation Plan](../30-Implementation/transfer-market-implementation-plan.md)

## Related Rules

- [../90-Meta/agent-memory-protocol.md](../90-Meta/agent-memory-protocol.md)
- [../90-Meta/vault-governance.md](../90-Meta/vault-governance.md)
- [../90-Meta/mcp-memory-integration.md](../90-Meta/mcp-memory-integration.md)

## Binding Rule

Implementation notes describe current process and system behavior. If they
conflict with an accepted ADR, the ADR wins and the note should be updated.
