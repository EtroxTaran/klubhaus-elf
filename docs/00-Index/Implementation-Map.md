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
- [Account Recovery](../30-Implementation/account-recovery.md) — F5
  (2026-05-18, `current binding`). Introduces the **stable inner
  master key `K`** + **canonical user-level envelope
  `Env_user = AES-GCM-256(K, KEK_user)`** with
  `KEK_user = PBKDF2(accountSecret, userSalt, 600 000)`. Per-device
  envelopes (`Env_device`) become an *optional offline-cache
  optimisation*; per-recovery-code envelopes (`Env_recovery_i`, 10
  per user) survive the loss of all devices; portable-export
  envelopes (`Env_portable`) survive `accountSecret` rotation by
  design. Rotation is O(1) wrap, no inter-device coordination
  required — devices fetch `Env_user` on re-login, derive
  `KEK_user_new`, unwrap `K`. F2 → F5 lazy migration on first
  F5-enabled login per user (one-shot save re-encryption inside
  the migration transaction). Versioned envelope wire format with
  AAD-bound header; `envelopeVersion = 2` reserved for Argon2id
  (post-MVP portable export UI); `envelopeVersion = 3` reserved
  for HPKE / RFC 9180 (post-quantum). Atomic Redis-locked rotation
  algorithm with idempotency keys; constant-time error UX. Full
  ASVS v5 V6 + V11 + NIST 800-130 + 800-63B §6 + 800-132 + 800-38D
  mapping. Anchors on F1 + F2 + F3; closes F2 FU-1 + F3 FU-7.
- [Privacy and Consent](../30-Implementation/privacy-and-consent.md) — F6
  (2026-05-18, `current binding`). Implementation surface for GDPR
  compliance: Privacy Notice content + cookie inventory; signup
  consent moment (single mandatory checkbox, no dark patterns); 16+
  self-declaration age gate with refusal flow; **no cookie banner**
  needed (all storage is strictly necessary per ePrivacy Art. 5(3));
  Settings → Privacy & Data screen with per-category data summary;
  user-rights endpoints (`POST /api/me/data-export` for Art. 15+20,
  `PATCH /api/me/profile` for Art. 16, `POST /api/me/delete-account`
  with 30-day grace + cryptographic erasure on expiry for Art. 17,
  `POST /api/me/restrict` for Art. 18, Art. 21 explainer modal); full
  DSAR ZIP layout; Art. 33/34 breach-notification runbook with
  decision tree + DE/EN user-notification template; vendor Art. 28
  DPA checklist + onboarding routine; per-quarter / per-year
  maintenance cadence. Companion to [[../60-Research/gdpr-compliance]].
  Closes F2 FU-6 + F2 FU-7 + F3 FU-8 + F5 FU-8 + F5 FU-9.
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
