---
title: Implementation Map
status: current
tags: [implementation, meta]
created: 2026-05-16
updated: 2026-05-22
type: map
binding: false
related: [[Architecture-Map]], [[Current-State]], [[Documentation-Baseline-2026-05-22]]
---

# Implementation Map

Use this map for operational, deployment, data, and agent workflow work.

[[Documentation-Baseline-2026-05-22]] is the implementation-facing closure
baseline: current specs below are implementable; historical Wave 3 gap IDs are
traceability only unless re-opened by a current issue or accepted ADR.

## Implementation Notes

- [Cursor Cloud Agent Workflow](../30-Implementation/cursor-cloud-agent-workflow.md)
- [Linear Task Tracking](../30-Implementation/linear-task-tracking.md)
- [PWA Offline Strategy](../30-Implementation/pwa-offline-strategy.md)
- [Hybrid-online PWA Strategy](../30-Implementation/hybrid-online-pwa-strategy.md) - current MVP PWA/offline-ready implementation stance.
- [Postgres + Drizzle Integration](../30-Implementation/postgres-drizzle-integration.md)
- [SurrealDB Integration](../30-Implementation/surrealdb-integration.md) - superseded historical substrate note.
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
- [Rate Limiting and Anti-Abuse](../30-Implementation/rate-limiting-anti-abuse.md)
  — F12 (2026-05-18, `current binding`). 3-phase edge-WAF
  graduation pathway (Phase 1 no WAF at MVP → Phase 2 Bunny.net
  Shield when triggered → Phase 3 Cloudflare-only-if-forced
  with TIA); full per-endpoint quota catalogue across 7 groups
  (GDPR / auth / saves / MP commands / game reads /
  observability / admin); 6-pattern anti-griefing playbook for
  MP + transfer market (lowball storming, counter ping-pong,
  inactive member, quorum spam, press-conference spam,
  spectator abuse); single-VM Redis-Lua token-bucket with
  multi-VM scale-out path; mCaptcha stage-1 → Friendly Captcha
  stage-2 trigger thresholds; admin CLI emergency-response
  commands; full Prometheus + Loki + Grafana observability;
  DE/EN user-facing 429 copy; future-proof B2B per-org +
  paid-tier burst + WebSocket / SSE extension points. Closes
  F1 Q5 + F2 FU-5 + F3 FU-9.
- [Incident Response](../30-Implementation/incident-response.md)
- [Secrets Management](../30-Implementation/secrets-management.md) — F11
  (2026-05-18, `current binding`). Full runbook for sops + age +
  direnv repo layout + 15-category secret inventory (A-O) with
  per-category rotation cadence + zero-downtime rotation recipes
  (versioned HMAC pepper, `accountSecret` column-key online
  migration, age key re-encrypt, dual-user DB rotation); 3-class
  age key hierarchy (human / environment / CI) with paper-backup
  escrow; **zero-secret CI** + Dokploy decrypts locally + tmpfs
  runtime injection (NIST SP 800-190 + CIS Docker Benchmark);
  developer onboarding / offboarding checklists; **5-tier leak
  classification** + 1-hour response playbook + leaked-age-key
  procedure + leaked-column-key procedure + Sigstore Rekor
  outage contingency; **quarterly Tier-A dependency audit
  runbook** (closes F1 FU-4); **backup + recovery drill
  schedule** with concrete recipes (Redis monthly closes F3
  FU-6; SurrealDB semi-annually; age key annually; full system
  quarterly); 6 DR tabletop scenarios annually; outbox audit
  integration; future-proof `SecretsProvider` interface for
  Bitwarden Secrets Manager / Infisical / 1Password Connect
  graduation. Closes F1 FU-4 + F1 FU-6 + F3 FU-6.
- [Secrets Rotation](../30-Implementation/secrets-rotation.md) —
  narrow Cloud-Agent credential boundary policy; companion to
  [[secrets-management]].
- [Transfer Market Implementation Plan](../30-Implementation/transfer-market-implementation-plan.md)

## Related Rules

- [../90-Meta/agent-memory-protocol.md](../90-Meta/agent-memory-protocol.md)
- [../90-Meta/vault-governance.md](../90-Meta/vault-governance.md)
- [../90-Meta/mcp-memory-integration.md](../90-Meta/mcp-memory-integration.md)

## Binding Rule

Implementation notes describe current process and system behavior. If they
conflict with an accepted ADR, the ADR wins and the note should be updated.
