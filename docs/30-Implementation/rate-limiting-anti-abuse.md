---
title: Rate Limiting and Anti-Abuse — edge WAF, endpoint quotas, anti-griefing, escalation
status: current
tags: [implementation, rate-limiting, anti-abuse, anti-griefing, waf, ddos, bot-mitigation, mcaptcha]
created: 2026-05-18
updated: 2026-05-22
type: implementation
binding: false
adr:
  - "[[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]"
  - "[[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]"
  - "[[../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]]"
  - "[[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]"
  - "[[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]"
related:
  - [[../60-Research/threat-model]]
  - [[../60-Research/gdpr-compliance]]
  - [[../60-Research/transfer-market-simulation]]
  - [[auth-flows]]
  - [[session-management]]
  - [[account-recovery]]
  - [[privacy-and-consent]]
  - [[notification-messaging-platform]]
  - [[secrets-management]]
  - [[audit-trail]]
  - [[incident-response]]
  - [[observability-runbook]]
---

# Rate Limiting and Anti-Abuse

This note resolves Wave 3 gap **F12** (Rate limiting / anti-abuse,
**P1**) and is the **binding implementation specification** for:

- The **edge-WAF graduation pathway** (Phase 1 no WAF → Phase 2
  Bunny.net Shield → Phase 3 Cloudflare-only-if-required) closing
  **F1 Q5**.
- The **full per-endpoint quota catalogue** across all 8 endpoint
  groups (A GDPR, B auth, C saves, D MP commands, E game-state
  reads, F observability, G admin, H notification/messaging) closing **F3 FU-9** + extending
  **F2 §8** beyond auth.
- The **6-pattern anti-griefing playbook** for multiplayer +
  transfer-market surfaces (lowball storming, counter-offer
  ping-pong, MP group inflate-and-grief, quorum-vote spam, press-
  conference spam, spectator-channel abuse).
- The **single-VM Redis-Lua token-bucket** with explicit future-
  proof multi-VM graduation path.
- The **mCaptcha integration spec** with concrete activation
  thresholds closing **F2 FU-5** + extending F2 §8.3.
- The **escalation + admin emergency-response runbook** with
  rate-limit-specific CLI commands.

F12 closes:

- **F1 Q5** Edge WAF provider choice (Cloudflare / Bunny / nginx+modsec / none)
- **F2 FU-5** Edge WAF + DDoS posture
- **F3 FU-9** Per-endpoint quota numerics + edge WAF graduation

It anchors on F1 (threat model § DoS controls + § Information
disclosure), F2 (auth throttling + anomaly catalogue), F3
(Redis schema + revocation matrix + `tokenVersion`), F5 (env_user
endpoints have their own quotas), F6 (GDPR endpoints have
quotas), F11 (Redis observability + rotation events).

## 1. Scope and stance

### 1.1 What F12 locks

- **Edge-WAF Phase 1/2/3 graduation pathway** with concrete
  trigger thresholds (§2).
- **Full per-endpoint quota catalogue** (§3) for groups A-H
  with bucket size × window × scope × response shape.
- **6-pattern anti-griefing playbook** for MP + transfer
  surfaces (§4).
- **Single-VM Redis-Lua token-bucket pattern** + algorithm
  choice per quota tier (§5) + multi-VM scale-out triggers (§5.5).
- **`429 Too Many Requests` response shape** with IETF rate-
  limit headers (§3.0).
- **mCaptcha integration spec** + stage-1 → stage-2 trigger
  thresholds (§6).
- **Escalation rules + admin CLI** for rate-limit emergency
  actions (§7).
- **WAF + app rate-limit coexistence pattern** when Phase 2
  graduates (§2.5).
- **Observability hooks** — Loki + Prometheus + Grafana panels
  + alert thresholds (§8).
- **DE/EN user-facing 429 copy** (§9).
- **Future-proof extension points** for B2B per-org tiers,
  paid-tier burst credit, real-time WebSocket / SSE quotas
  (§10).

### 1.2 What F12 defers

- **F13 Penetration testing strategy** (P3) — F12 sets the
  abuse surface; F13 owns the ongoing pentest program.
- **F9 Content moderation for community editor** (P2) —
  user-supplied pack content rules.
- **Per-edge-vendor advanced bot management** (Cloudflare Bot
  Management beyond Turnstile) — defer until Phase 3 trigger
  hits (§2).
- **Real-time WebSocket / SSE quotas** — placeholders in §3.4
  + §10; full spec only when SSE / WS actually ship (F3 FU-2 +
  ADR-0015 post-MVP).

### 1.3 Threats this spec mitigates

Cross-references into [[../60-Research/threat-model]]:

- **D1** Command flood / sync storm — §3 per-endpoint quotas
  + §5 Redis-Lua token-bucket.
- **D2** Offline queue explosion — §3.C save endpoints +
  ADR-0002 §8 client cap.
- **D5** Observability pipeline overload — §3.F telemetry
  endpoint quotas.
- **D6** Low-cost griefing via spam transfer offers — §4
  6-pattern playbook.
- **S1** Fake client / bot impersonation — §6 mCaptcha staged
  response.
- **T3** Command replay / reorder — handled by F3 idempotency
  + family revoke; F12 reinforces with per-`command_type`
  quotas in §3.D.

Residual risks accepted: volumetric DDoS in Phase 1 (no edge
WAF) — accepted at indie-launch profile; trigger to graduate
to Phase 2 is documented in §2.

## 2. Edge-WAF graduation pathway (closes F1 Q5)

### 2.1 Decision: 3-phase graduation

Per Q1 research and the F1 + F6 EU-residency + privacy-first
constraints:

| Phase | When                              | Edge layer                                    | App layer                                          |
| ---   | ---                               | ---                                           | ---                                                |
| 1 (MVP) | Launch + first 6-12 months      | **None** — direct Hetzner → app              | Full F2 + F3 + F11 + F12 §3-5 Redis-Lua quotas    |
| 2     | Sustained abuse OR > 20 k MAU OR DDoS event | **Bunny.net Shield** (EU-residency CDN + WAF) | Unchanged; WAF takes coarse IP/CIDR + DDoS layer    |
| 3     | Phase 2 insufficient OR > 100 k MAU OR compliance audit | **Cloudflare** (with documented TIA + DPA update) | Unchanged                                          |

### 2.2 Phase 1 (MVP) — no edge WAF, locked

**Stance**: launch with **no edge WAF**. The F2 + F3 + F11
+ F12 §5 app-level Redis-Lua quotas are sufficient for the
expected initial threat profile of an indie EU PWA.

Rationale per Q1 research:

- Hetzner ships native L3/4 DDoS protection at the network
  edge (sufficient for the volumetric attacks an indie game
  realistically attracts).
- App-level per-IP + per-/24 + per-account quotas cover L7
  abuse.
- Zero cost, zero third-party-processor surface, full GDPR
  data-residency posture (matches F6 §10).
- Operational complexity stays bounded for a 1-3 founder
  team.

Residual risk accepted: a determined volumetric attack from a
botnet > 100 Gbps would saturate the Hetzner network
interface before the app sees it. **Mitigation**: pre-wire the
graduation steps so Phase 2 is a 1-day infra change.

### 2.3 Phase 1 readiness — pre-wire the graduation

Even at MVP, the following infrastructure is in place so the
Phase 2 transition is a same-day change:

- **DNS at Hetzner DNS** (not at a registrar's name servers)
  with **CNAME-flattened apex** + short TTLs (300 s). A
  Bunny.net or Cloudflare onboard is a DNS record swap.
- **TLS termination on the Hetzner VM** with the cert managed
  by certbot + automatic renewal. Pre-wired for "client
  cert authentication on the edge" if Phase 2 needs it.
- **`X-Forwarded-For` parsing trusts only `127.0.0.1` /
  `::1` / the Dokploy proxy IP**. Adding a single trusted
  hop for the edge proxy is a config line.
- **Strict CSP + HSTS + Sec-Fetch-Site** headers already
  served by the app — independent of the edge.
- **All rate-limit logic in the app + Redis** — edge layer
  remains optional and never the only enforcement.

### 2.4 Phase 2 triggers — Bunny.net Shield

Activate Phase 2 when **any** of:

1. **Sustained L7 abuse** — F2 §8.5 #7 "global 429 rate >
   5× baseline" fires for ≥ 4 hours despite app-level
   throttling.
2. **L3/4 volumetric attack** — Hetzner notifies us of a
   DDoS that exceeded their automatic mitigation.
3. **MAU growth** > 20 k EU users (the threat surface
   widens).
4. **Founder-discretion infrastructure decision** — e.g. when
   we want global CDN performance for image assets.

Bunny.net Shield rollout:

- Onboard at the Bunny.net dashboard; configure **EU-only
  PoPs** (Slovenian + DE + NL + FR data centres).
- Add CNAME from `app.<canonical-domain>` to Bunny's edge
  hostname.
- Pull in our existing TLS cert (no need to issue a new one
  at the edge; Bunny supports BYO cert).
- Configure WAF rules: OWASP-CRS managed group + custom IP
  rate-limit fallback (200/5min/IP) as a second-layer
  fallback to the app-level rate-limit.
- Configure DDoS L3/4 protection (default on).
- Add `X-Edge-Risk-Score` header passing from Bunny to the
  app (per Q6 research) so the app can dial its own
  throttling based on edge risk signals.
- Sign Bunny.net Art. 28 DPA (Slovenian/EU-domiciled — no
  third-country transfer; F6 §11 + §10 unaffected).
- Update [[../60-Research/gdpr-compliance]] §3 RoPA + §11
  to add Bunny.net as a processor.
- Update [[privacy-and-consent]] §2.1 Privacy Notice to
  list Bunny.net under "Recipients".

Cost: low double-digit € / month for our scale (per Q1
research).

### 2.5 Phase 2 → Phase 3 (Cloudflare) — only if forced

Cloudflare is **explicitly rejected at MVP and Phase 2** on
GDPR posture (US-domiciled processor; TLS terminates at a US
processor; Schrems-III risk). Phase 3 is the **fallback** if
Phase 2 proves insufficient for some narrow scenario:

- Sustained abuse > 30 days that Bunny's WAF + Magnum Bot
  Protection can't suppress.
- Need for Cloudflare Workers-style edge compute (e.g.
  pre-auth filtering) that Bunny doesn't provide.
- MAU > 100 k EU users — re-evaluate.

Phase 3 prerequisites (mandatory before Cloudflare onboard):

1. **Documented TIA** (Transfer Impact Assessment) per EDPB
   Recommendations 01/2020.
2. **Update F6 §10 third-country-transfer posture** + RoPA
   + Privacy Notice + DPA register.
3. **Cloudflare DPA signed** with EU DPA-friendly addendum.
4. **Privacy Notice statement** updated: was "no third-country
   transfers" → "Cloudflare-mediated transfers under DPF +
   SCCs + TIA" with explicit user notice (in-app banner).
5. **Re-evaluate F6 §1.2 legal landscape** — possibly trigger
   F6 future-proof event re-evaluation.

Until those prerequisites are satisfied, Cloudflare is OFF.

### 2.6 WAF + app rate-limit coexistence (Phase 2+)

When Phase 2 activates, the app rate-limit (§3-5) stays as-is.
The edge WAF adds:

- **Coarse per-IP / per-/24 rate-limit** (200 req/5 min/IP)
  as a defence-in-depth fallback.
- **DDoS L3/4 absorption** before traffic hits Hetzner.
- **OWASP-CRS WAF rules** catching SQLi / XSS / path-
  traversal before the app sees them.
- **`X-Edge-Risk-Score: <0-100>`** header forwarded to the
  app. The app's `createAuthedServerFn` HOF (F3 §12.2)
  reads this header and dials its own rate-limit tighter when
  the edge sees risk:

```ts
// Inside createAuthedServerFn middleware
const edgeRisk = Number(request.headers.get('x-edge-risk-score') ?? '0')
if (edgeRisk > 50) {
  // Multiply the bucket cost of this request by 2
  await rateLimit.consume(scope, key, /* cost */ 2)
} else {
  await rateLimit.consume(scope, key, /* cost */ 1)
}
```

This pattern makes the WAF + app **complementary, not
duplicative**.

## 3. Per-endpoint quota catalogue

### 3.0 Response shape on quota exceed

All enforced limits return:

- **HTTP 429** Too Many Requests (RFC 6585 §4).
- **Headers**:
  - `Retry-After: <seconds>` (RFC 7231 §7.1.3).
  - `RateLimit-Limit: <limit>;w=<window>` (IETF draft).
  - `RateLimit-Remaining: <n>`.
  - `RateLimit-Reset: <unix-timestamp>`.
- **Body** (JSON):

```json
{
  "error": "rate_limited",
  "retry_after": 42,
  "reason": "per_user_save_write",
  "scope": "user",
  "limit": 60,
  "window_seconds": 60,
  "hint": "Reduce write frequency; offline saves will sync when backoff elapses."
}
```

`reason` is a stable enum (used in client UX copy mapping per §9).
For **advisory-only** limits (`A` rows in the tables below):
no 429; emit a Loki + Prometheus metric only.

### 3.1 Legend

- **Bucket**: `N / window` = token bucket with capacity `N`,
  refill rate `N / window`.
- **Scope**: `user` / `ip` / `ip-prefix` (/24 IPv4, /56 IPv6)
  / `user+ip` composite / `tenant`.
- **Enf**: `E` enforced (429) · `A` advisory (log + metric
  only) · `B` block-and-audit (used for griefing).

### 3.2 Group A — GDPR endpoints (F6 §6)

| Endpoint                              | Bucket           | Scope    | Enf | Rationale                                                           |
| ---                                   | ---              | ---      | --- | ---                                                                 |
| POST `/api/me/data-export`            | 1 / 24 h         | user     | E   | Art. 12(5) "manifestly excessive" defence; F6 §6.1                  |
| POST `/api/me/data-export`            | 200 / 24 h       | tenant   | A   | Anomaly alert if a single deployment is being scraped               |
| PATCH `/api/me/profile` (light)       | 60 / 5 min       | user     | E   | Display name / locale / tz changes — basically no UX limit          |
| PATCH `/api/me/profile` (email)       | 3 / 24 h         | user     | E   | Email change is security-sensitive (F2 §7.1 step-up + dual-confirm) |
| POST `/api/me/delete-account`         | 3 / 24 h         | user     | E   | Heavy operation; should be rare                                     |
| POST `/api/me/restrict`               | 5 / 24 h         | user     | E   | Low-volume; sanity limit only                                       |

### 3.3 Group B — Auth endpoints beyond F2

F2 §8 already locked login / signup / password-reset. F12
adds the rest:

| Endpoint                                            | Bucket               | Scope    | Enf | Rationale                                                              |
| ---                                                 | ---                  | ---      | --- | ---                                                                    |
| POST `/api/auth/refresh`                            | 120 / 10 min         | user     | E   | Refresh rotation per F3 §5; SPAs refresh ~5-15 min; 12/min is generous |
| POST `/api/auth/refresh`                            | 240 / 10 min         | ip       | A   | Token-theft detection if IP changes wildly                              |
| GET `/api/auth/account-secret/bootstrap`            | 10 / 24 h            | user     | E   | F2 §5.3 once-per-device; multiple device installs OK                    |
| GET `/api/auth/envelope`                            | 60 / 5 min           | user     | E   | F5 §5.1 fetch; typically once per session                              |
| POST `/api/auth/rotate-account-secret/commit`       | 5 / 24 h             | user     | E   | F5 §6.2 rotation finalisation; rare                                    |
| POST `/api/auth/recovery-login`                     | 5 / 15 min           | ip       | E   | F5 §6.3 recovery code path; per-IP because user is unauthenticated      |
| POST `/api/auth/recovery-login`                     | 5 / 24 h             | (email)  | E   | Per-email; aligns with F2 §8.2 reset-throttle pattern                  |
| POST `/api/auth/recovery-login/commit`              | 5 / 15 min           | ip       | E   | Same window as login                                                   |
| POST `/api/auth/passkey/options`                    | 30 / 1 min           | ip       | E   | Pre-auth challenge mint; high cap because legit retries common         |
| POST `/api/auth/passkey/assert`                     | inherits login (F2)  | —        | —   | F2 §8.1                                                                |
| POST `/api/auth/passkey/register`                   | 5 / 5 min            | user     | E   | Rare op (new device + UV)                                              |
| POST `/api/auth/mfa/verify`                         | 10 / 5 min           | user     | E   | TOTP / WebAuthn-MFA verify; ≤ 1/login typical                           |
| GET `/api/auth/me`                                  | 600 / 5 min          | user     | E   | Called on every page load; very generous                                |

### 3.4 Group C — Save endpoints

| Endpoint                                            | Bucket               | Scope    | Enf | Rationale                                                              |
| ---                                                 | ---                  | ---      | --- | ---                                                                    |
| POST `/api/saves`                                   | 5 / 1 h              | user     | E   | New-save creation; soft cap 10 per ADR-0005 §10                        |
| PATCH `/api/saves/:id`                              | 60 / 5 min           | user     | E   | Metadata updates (rename / archive / restore)                          |
| DELETE `/api/saves/:id`                             | 10 / 1 h             | user     | E   | Soft-delete; 30-d grace per ADR-0005                                   |
| POST `/api/saves/:id/portable-export`               | 5 / 1 h              | user     | E   | F5 portable export; CPU-heavy server-side                              |
| POST `/api/saves/import`                            | 5 / 1 h              | user     | E   | Heavy import + Zod parse + AEAD verify                                 |
| POST `/api/saves/:id/sync` (offline outbox → server) | 30 / 1 min          | user     | E   | ADR-0002 §8 cap 50 commands / 1 MB per request                         |
| GET `/api/saves`                                    | 300 / 5 min          | user     | E   | List user's saves (read; high cap)                                     |
| GET `/api/saves/:id`                                | 600 / 5 min          | user     | E   | Manifest fetch; common in offline-diff                                  |

### 3.5 Group D — Multiplayer command endpoints

Per ADR-0011 server-authoritative MP. All commands flow through
`POST /api/mp/groups/:id/commands` with a `command_type`
discriminator. Per-`command_type` quotas in §4.

| Endpoint                                            | Bucket               | Scope    | Enf | Rationale                                                              |
| ---                                                 | ---                  | ---      | --- | ---                                                                    |
| POST `/api/mp/groups`                               | 1 / 24 h             | user     | E   | Create new MP group; rare                                              |
| POST `/api/mp/groups`                               | 3 / 24 h             | ip       | E   | Per-IP defence-in-depth                                                 |
| POST `/api/mp/groups/:id/invite`                    | 5 / 24 h             | group    | E   | Max 8 members per group baseline                                       |
| POST `/api/mp/groups/:id/invite`                    | 10 / 24 h            | user     | E   | Per-inviter                                                            |
| POST `/api/mp/groups/:id/leave`                     | 5 / 1 h              | user     | E   | Rare op; defence against churn-abuse                                   |
| POST `/api/mp/groups/:id/commands` (global)         | 200 / 1 h            | user     | E   | All `command_type` combined                                            |
| POST `/api/mp/groups/:id/commands` (global)         | 1000 / 24 h          | group    | E   | All members' commands combined                                          |
| POST `/api/mp/groups/:id/commands` (global)         | 500 / 1 h            | ip       | A   | Anomaly detection for shared-IP abuse                                  |
| GET `/api/mp/groups/:id/state`                      | 300 / 5 min          | user     | E   | Polling friendly                                                       |
| GET `/api/mp/groups/:id/spectator`                  | 60 / 5 min           | (spec_id)| E   | Spectator snapshot read per ADR-0015                                   |

### 3.6 Group E — Game-state reads

Read-heavy, low-risk; very generous quotas.

| Endpoint                                            | Bucket               | Scope    | Enf | Rationale                                                              |
| ---                                                 | ---                  | ---      | --- | ---                                                                    |
| GET `/api/saves/:id/manifest`                       | 600 / 5 min          | user     | E   | Frequent offline diff                                                  |

### 3.7 Group F — Observability / client telemetry

Per F1 §3 same-origin telemetry endpoint with redaction proxy.

| Endpoint                                            | Bucket               | Scope    | Enf | Rationale                                                              |
| ---                                                 | ---                  | ---      | --- | ---                                                                    |
| POST `/api/telemetry/event`                         | 60 / 1 min           | user     | E   | F1 §4.5 D5 observability overload                                       |
| POST `/api/telemetry/event`                         | 120 / 1 min          | ip       | A   | Anomaly                                                                |
| POST `/api/crash`                                   | 30 / 1 h             | user     | E   | GlitchTip-equivalent; rare event                                       |

### 3.8 Group G — Admin endpoints

Founder + Privacy Lead only; behind an additional layer
(F3 §13.1 SSH + admin TOTP).

| Endpoint                                            | Bucket               | Scope    | Enf | Rationale                                                              |
| ---                                                 | ---                  | ---      | --- | ---                                                                    |
| GET `/api/admin/users/search`                       | 60 / 5 min           | (admin)  | E   | Admin UI search                                                        |
| POST `/api/admin/users/:id/lock`                    | 30 / 5 min           | (admin)  | E   | F3 §13.1 CLI alternative                                               |
| POST `/api/admin/users/:id/unlock`                  | 30 / 5 min           | (admin)  | E   | Same                                                                   |

### 3.9 Group H - Notification and messaging endpoints

ADR-0043 makes Notification a first-party bounded context. The quotas below
apply when notification endpoints are implemented.

| Endpoint / surface                                  | Bucket               | Scope    | Enf | Rationale                                                              |
| ---                                                 | ---                  | ---      | --- | ---                                                                    |
| GET `/api/notifications`                            | 300 / 5 min          | user     | E   | Inbox reads; generous for route reloads and reconnect                  |
| POST `/api/notifications/:id/read`                  | 120 / 5 min          | user     | E   | Read/dismiss sync; allows offline catch-up bursts                      |
| PATCH `/api/notification-preferences`               | 30 / 5 min           | user     | E   | Settings changes; high enough for normal editing                       |
| POST `/api/push/subscriptions`                      | 10 / 24 h            | user     | E   | Web Push endpoint creation; prevents endpoint churn abuse              |
| DELETE `/api/push/subscriptions/:id`                | 30 / 24 h            | user     | E   | Device cleanup; generous but bounded                                   |
| POST `/api/email/webhooks/brevo`                    | provider-specific    | signed provider | E | Verify signature/token before processing; no user scope available      |
| POST `/api/email/webhooks/mailjet`                  | provider-specific    | signed provider | E | Prepared fallback provider                                             |
| Notification channel sends                          | 20 / 1 h             | user+channel | E | Outbound storm cap; security notices bypass but page ops               |
| Digest creation                                     | 4 / 24 h             | user     | E   | Avoid digest loops                                                     |
| Watch-party chat message (post-MVP)                 | TBD before promotion | group+user | E | Requires separate chat/moderation decision before implementation       |

### 3.10 Asymmetry rules (locked)

- **Read vs write**: reads get ≥ 5× the write quota at the
  same scope (e.g. `GET /api/saves` 300/5 min vs `POST /api/saves`
  5/1 h).
- **Auth vs unauth**: per-user quotas can be tighter than per-IP
  (we know the actor). Per-IP is the primary defence for
  unauthenticated endpoints (signup, password reset, login,
  recovery-login).
- **Tenant-scope advisory**: every endpoint also tracks a
  per-tenant counter as `A` (advisory) for anomaly detection.

## 4. Anti-griefing playbook

### 4.1 Six patterns (locked)

Each pattern: detection rule + mitigation + audit event.

#### Pattern 1 — Lowball offer storming

**Detection**:

- `offer_total_value < 0.25 × mid_market_value(player)` is a
  **lowball** per [[../60-Research/transfer-market-simulation]]
  market-value model.
- **Storming**: ≥ 5 lowballs in 7 d from same `buyer_club_id`
  to same `target_club_id`, OR ≥ 3 lowballs on the same
  `player_id` in 24 h.

**Mitigation**:

- Auto-reject individual lowball (counts toward 50/day cap).
- On storming: **7-day cooldown** blocking all offers from
  that buyer to that club regardless of value.
- Optional UI signal to receiver: "Recent offers from X judged
  unrealistic" (mild reputation cue, no PII).

**Audit event**:

```json
{
  "event_type": "mp.griefing_blocked",
  "reason": "lowball_offer" | "lowball_cooldown_applied",
  "buyer_club_id": "...",
  "target_club_id": "...",
  "player_id": "...",
  "offer_value": 1000000,
  "market_value": 10000000
}
```

#### Pattern 2 — Counter-offer ping-pong

**Detection**: > 5 counter rounds in a single negotiation
(A → B → A → B → A → B counter_depth = 5).

**Mitigation**: at the 5th counter, auto-close the negotiation
with `negotiation_outcome = "expired_max_counters"`. Block
subsequent counter-offers in this negotiation; new offers from
the buyer must start a fresh negotiation (and burn from their
50/day cap).

**Audit event**: `mp.griefing_blocked{reason:"counter_offer_depth_exceeded"}`.

#### Pattern 3 — MP group inflate-and-grief

**Detection**: A member of a private MP group fails to take
any turn / submit any command for ≥ 14 in-game days (default).

**Mitigation**: host receives a "Member X has been inactive"
banner. Host can **kick** the member with one click. Per F2
§7.1 + F3 §9, this is a non-sensitive op for the host (no
step-up MFA required); a `mp.member_kicked` outbox event is
emitted.

**Audit event**: `mp.griefing_blocked{reason:"inactive_member_threshold"}`.

#### Pattern 4 — Quorum-vote spam

**Detection**: ≥ 3 quorum votes per season per MP group
(per [[../50-Game-Design/async-multiplayer-private-group]]
dynamic cadence + quorum mechanism).

**Mitigation**: 4th vote per season → `429` with
`reason: "quorum_vote_quota"`. Host can override by manually
forcing cadence (admin action; logged).

**Audit event**: `mp.griefing_blocked{reason:"quorum_vote_spam"}`.

#### Pattern 5 — Press-conference spam

**Detection**: a press-conference response is fundamentally
1-per-presser (D15). Spam in this surface = idempotency
violation; not strictly griefing.

**Mitigation**: last-write-wins within a 10-min re-edit
window after first response; subsequent writes are no-ops.

**Audit event**: none normally; only if patterns of repeated
edits suggest scripted abuse (then `mp.griefing_blocked{reason:"press_conference_edit_storm"}`).

#### Pattern 6 — Spectator-channel abuse

**Detection** (per ADR-0015 spectator snapshot streaming):

- Spectator reactions (emotes / cheers): `> 10 / 10 s` per
  spectator.
- Poll-vote multi-submission: `> 1 per poll question` from
  same spectator.

**Mitigation**: rate-limit at `60 / hour` per spectator with
`burst 10 / 10s`; `429` on excess; on persistent abuse, kick
the spectator from the watch party (host-driven, audited).

**Audit event**: `mp.griefing_blocked{reason:"spectator_reaction_burst"}`.

### 4.2 UX for griefing-blocked operations

- Generic copy (DE / EN, per §9 below). Do **not** reveal
  the exact threshold (would help griefers tune their
  behaviour).
- Disposition: silent block to the griefer + silent audit
  log. **No** notification to the receiver of a griefing
  attempt; the receiver's UI shows nothing unusual.
- Repeat-griefer detection: if the same user triggers
  griefing blocks across ≥ 3 distinct patterns, **emit a
  `mp.repeat_griefer_detected` anomaly event** (F2 §8.5
  escalation). At F2 §8.5 disposition, this surfaces to
  the founder for manual review.

## 5. Distributed-rate-limit pattern

### 5.1 Single-VM Redis-Lua token-bucket (MVP locked)

All rate limits enforced via Redis-Lua atomic scripts on the
single Hetzner VM. Pattern:

- **Key naming**: `rl:<scope>:<endpoint-group>:<id>` (e.g.
  `rl:login:acct:user_id_123`, `rl:signup:ip:203.0.113.0/24`,
  `rl:mp:cmd:group_id_456`).
- **Bucket value**: hash with `tokens` (current count) +
  `last_refill_ts` (last refill timestamp ms).
- **TTL**: 2× the bucket window; auto-expires idle buckets.
- **Atomicity**: every consume operation is one Lua call
  (single round-trip to Redis; atomic per Redis single-
  threaded execution).

**Sketch**:

```lua
-- token_bucket_consume.lua
-- KEYS[1] = bucket key
-- ARGV[1] = now_ms
-- ARGV[2] = capacity
-- ARGV[3] = refill_per_ms (numeric)
-- ARGV[4] = cost (default 1)
local k = KEYS[1]
local now = tonumber(ARGV[1])
local cap = tonumber(ARGV[2])
local rate = tonumber(ARGV[3])
local cost = tonumber(ARGV[4] or "1")

local data = redis.call('HMGET', k, 'tokens', 'last_refill_ts')
local tokens = tonumber(data[1])
local last = tonumber(data[2])
if not tokens then tokens = cap; last = now end

-- Refill
local elapsed = math.max(0, now - last)
tokens = math.min(cap, tokens + elapsed * rate)

if tokens < cost then
  -- Compute retry_after
  local needed = cost - tokens
  local retry_ms = math.ceil(needed / rate)
  -- Persist with new last_refill_ts
  redis.call('HMSET', k, 'tokens', tostring(tokens), 'last_refill_ts', tostring(now))
  redis.call('PEXPIRE', k, math.ceil(cap / rate) * 2)
  return {0, retry_ms, math.floor(tokens)}
end

tokens = tokens - cost
redis.call('HMSET', k, 'tokens', tostring(tokens), 'last_refill_ts', tostring(now))
redis.call('PEXPIRE', k, math.ceil(cap / rate) * 2)
return {1, 0, math.floor(tokens)}
-- Returns {ok (1=allowed), retry_ms, remaining_tokens}
```

### 5.2 Algorithm choice per quota tier

| Tier                         | Algorithm                | Reason                                                       |
| ---                          | ---                      | ---                                                          |
| All standard request quotas  | Token bucket             | Bursty-friendly; low memory; F11 + F2 + F12 baseline         |
| Login / password-reset abuse  | Token bucket + sliding-log| F2 §8.1 ladder needs exact recent-counts; small enough memory |
| Anti-griefing patterns       | Token bucket + counters  | §4 patterns need cumulative state across windows             |
| Anomaly signal triggers      | Sliding-window log       | F2 §8.5 needs precise event sequences                        |

### 5.3 Library + dependency choice

- **Hand-rolled Lua + ioredis** — chosen.
- Reasons: minimum dependency footprint (ioredis is already
  Tier-A per F11 §10.1); maximum control over the algorithm;
  Lua scripts cached server-side by SHA.
- **Rejected**: `rate-limiter-flexible` (heavy dependency
  tree; harder to audit); `@upstash/ratelimit` (US-domiciled
  managed service hooks irrelevant for our self-hosted EU
  stack).

### 5.4 Multi-instance same-VM (cluster mode)

Dokploy may run multiple Node processes (cluster mode) on the
same Hetzner VM. All processes share the same Redis. **Lua
atomicity holds across all processes** — Redis is single-
threaded for command execution; each Lua call is atomic
from all clients' perspectives.

No additional coordination needed at MVP scale.

### 5.5 Multi-VM scale-out path (post-MVP)

When we eventually need to scale beyond one Hetzner VM:

| Pattern  | When                                                                  | Trade-off                                       |
| ---      | ---                                                                   | ---                                             |
| **A** Shared Redis Cluster | First scale-out trigger; ≤ 5 app instances              | Simplest; Redis bottleneck risk                  |
| **B** Per-instance local + periodic sync | Higher write throughput than Redis allows               | Eventual consistency; some over-/under-throttling |
| **C** Hashed routing       | Load balancer routes by user_id / IP hash                              | Simple counters; LB config complexity            |
| **D** Edge-only rate-limit | When Phase 2/3 WAF is already active                                   | Edge limits are coarse; complement only          |

**Decision**: at the trigger event, default to **Pattern A
(shared Redis Cluster)** for the simplicity. If a specific
quota becomes a hot-spot, escalate that quota to Pattern B
or C selectively.

**Trigger thresholds**:

- ≥ 5 concurrent app instances (Dokploy hosts multiple VMs).
- Or > 100 k MAU with sustained high-traffic patterns.
- Or measured Redis P99 latency > 5 ms.

## 6. Bot mitigation — mCaptcha integration (closes F2 FU-5)

### 6.1 Activation triggers — Stage 1 (self-hosted mCaptcha)

Stage 1 mCaptcha activates per-IP for **1 hour** when any of:

- F2 §8.5 #6 fires — ≥ 10 signups from same IP in 5 min.
- F2 §8.5 #5 fires — ≥ 5 password-reset requests / 30 min
  for same email from ≥ 3 IPs.
- Founder manually flips a global "all signups require
  captcha" switch (CLI `pnpm rate-limit:captcha-on --duration 24h`).

After 1 h auto-deactivates if abuse subsides.

### 6.2 mCaptcha deployment + integration

- **Deploy**: Docker container on the same Hetzner VM (or
  co-located) per the [mCaptcha](https://mcaptcha.org/) docs.
- **API surface**:
  - `POST /api/captcha/challenge` — returns a PoW challenge
    token; client computes PoW (browser CPU; difficulty tuned
    per IP risk score).
  - `POST /api/captcha/verify` — validates answer; on success,
    emits a short-lived `captcha_token` cookie (`HttpOnly +
    Secure + SameSite=Lax`, 1-hour TTL).
- **Integration**: the F2-locked rate-limit middleware checks
  the `captcha_token` cookie. Requests carrying a valid
  `captcha_token` **bypass the stage-1 throttle** AND get a
  5× quota multiplier for the next 1 hour.
- **Token binding**: token is bound to `(ip_prefix, ua_hash)`
  so it cannot travel between sessions.
- **Difficulty tuning**: low-risk IPs get ~100 ms PoW;
  high-risk IPs get ~1-5 s PoW.

### 6.3 Failure mode

- **mCaptcha service down**: fail-open (allow requests through
  the standard throttle); emit a Prometheus alert. The standard
  throttle is still in effect, so this just degrades the
  defence-in-depth layer.
- **Alternative**: founder can disable mCaptcha entirely with
  `pnpm rate-limit:captcha-off`.

### 6.4 UX

DE / EN copy (non-modal banner):

- **DE**: "Wir prüfen kurz, ob du ein Mensch bist. Das dauert
  nur einen Moment."
- **EN**: "We're verifying you're human. This takes a moment."

Accessibility (WCAG 2.2 AA):

- Focus management: focus moves to the challenge banner;
  trapped until challenge resolves.
- Screen-reader announcement: "Verifying browser… please
  wait."
- No time-limited interaction (WCAG 2.2.1).
- On JS-disabled: "We couldn't verify your browser. Please
  enable JavaScript and try again."

### 6.5 Stage 2 — Friendly Captcha (EU-managed)

Activate Stage 2 when:

- mCaptcha PoW CPU cost on the Hetzner VM becomes
  meaningful (> 5 % CPU sustained).
- OR sustained abuse continues for > 7 days despite mCaptcha.

Switch via env var (`CAPTCHA_PROVIDER=friendly_captcha`).
mCaptcha endpoint remains as fallback if Friendly Captcha is
unreachable. Friendly Captcha is EU-domiciled (DE) with EU
data residency; sign their Art. 28 DPA + update
[[../60-Research/gdpr-compliance]] §11 RoPA.

### 6.6 Rejected providers (locked)

- **reCAPTCHA** — Google US-domiciled; GDPR risk; rejected
  per F6 §10.
- **hCaptcha** (incl. Privacy Pass variants) — historic
  ad-monetisation links; weaker EU posture; rejected.
- **Cloudflare Turnstile** — US-domiciled processor;
  rejected for the same posture reasons as Cloudflare proper.

### 6.7 Passive bot signals

Some passive signals are EU-friendly without consent
(F6 §6 confirms locale + timezone aren't special categories;
EDPB fingerprinting guidance generally cools on opt-in for
device-fingerprint-style signals).

| Signal                       | EU-friendly?            | Use                                                          |
| ---                          | ---                     | ---                                                          |
| User-Agent quality check     | yes (UA is not PII)     | Block obvious automation UAs (curl, wget, headless Chrome default) |
| HTTP/2 fingerprinting        | partial — request-header analysis | OK passive; not consent-required                              |
| TLS / JA3-JA4 fingerprinting | controversial — some DPAs class as fingerprinting | **Do not use at MVP**; defer to Phase 3 if needed                                  |
| Keyboard / mouse timing      | requires opt-in per EDPB | **Do not use at MVP**                                          |

## 7. Escalation + admin response

### 7.1 Escalation rule table

| Trigger                                                          | Action                                  | Outbox event                                | Audit retention |
| ---                                                              | ---                                     | ---                                         | ---             |
| 429 returned (per-request)                                       | Loki log + Prometheus counter            | (none)                                      | 14 d (Loki)     |
| Same IP → ≥ 100 × 429 in 1 h                                     | email founder + Discord webhook ping     | `infra.rate_limit_pattern{ip:…}`            | 60 d outbox     |
| ≥ 100 distinct IPs hit per-/24 cap in 15 min (coordinated)        | page on-call (founder) + auto-tighten   | `infra.rate_limit_attack{cidr:…}`           | 60 d outbox     |
| ≥ 10 distinct accounts hit per-account login soft-lock in 1 h    | page on-call + activate Stage 1 mCaptcha | `infra.credential_stuffing_wave`            | forever audit   |
| Global 429 rate > 5× rolling baseline                             | page on-call + activate Stage 1 mCaptcha | F2 §8.5 #7 anomaly                           | forever audit   |
| Stage 1 mCaptcha exhausted (CPU > 5 %)                            | page on-call + activate Stage 2 Friendly Captcha | `infra.captcha_escalation`                  | 60 d            |
| Hetzner DDoS notification received                                | page on-call + manual Phase 2 graduation | `infra.phase_2_graduation_triggered`         | forever         |
| Tier-1 secret leak (F11 §9.1)                                    | F11 §9.3 1-hour playbook                 | F11 outbox catalogue                         | forever         |

### 7.2 Admin CLI

Beyond F3 §13 admin CLI for session management, F12 adds:

```bash
# Temporary IP-CIDR block at the app level
pnpm rate-limit:block --cidr 203.0.113.0/24 --duration 1h --reason "credential-stuffing"
pnpm rate-limit:unblock --cidr 203.0.113.0/24

# Inspect current state
pnpm rate-limit:status                # show all blocks + saturation per scope
pnpm rate-limit:status --scope login  # filter

# Emergency tighten an existing quota
pnpm rate-limit:tighten --scope signup --bucket 1 --window 5m
pnpm rate-limit:restore --scope signup  # back to default

# CAPTCHA controls
pnpm rate-limit:captcha-on --duration 24h
pnpm rate-limit:captcha-off

# Stage-2 graduation
pnpm rate-limit:captcha-provider friendly_captcha
pnpm rate-limit:captcha-provider mcaptcha   # rollback
```

Every invocation:

1. Requires SSH + admin TOTP (per F3 §13.1 operator session).
2. Emits `infra.rate_limit_admin_action{actor:…, action:…, reason:…}`
   outbox event.
3. Logged to Loki at WARN level.
4. Optionally adds a Grafana annotation on the rate-limit
   dashboard.

### 7.3 Alerting infrastructure

- **Loki + Prometheus + Grafana** per ADR-0017.
- **Alert rules** in Grafana → email founder + Discord
  webhook ping (MVP indie-team alert channel).
- **No paid PagerDuty / OpsGenie at MVP**; payload format
  designed so a future paid tool integration is a 1-day
  swap.
- **GlitchTip integration**: rate-limit-related exceptions
  (e.g. Redis unavailable) bubble up as crash reports.

## 8. Observability hooks

### 8.1 Prometheus metrics

```text
rate_limit_request_total{scope, endpoint_group, result="allowed" | "limited" | "blocked"} - counter
rate_limit_remaining{scope, bucket_id} - gauge (debugging only; sample 1%)
rate_limit_retry_after_seconds{scope, endpoint_group} - histogram
mcaptcha_challenge_total{outcome="solved" | "failed" | "timed_out"} - counter
mp_griefing_blocked_total{pattern} - counter
```

### 8.2 Loki log lines

Every quota event emits a structured log line at INFO level
(429) or WARN level (block / griefing). Fields:

```json
{
  "timestamp": "2026-05-18T20:00:00Z",
  "level": "info",
  "logger": "rate_limit",
  "event": "rate_limit_exceeded",
  "scope": "user",
  "endpoint_group": "save_write",
  "user_id_pseudo": "<pseudo:hmac>",
  "ip_prefix": "203.0.113.0/24",
  "retry_after": 42,
  "reason": "per_user_save_write"
}
```

F1 §4.4-I2 redaction deny-list applies: never log raw user IDs,
emails, tokens, or values — only `user_id_pseudo` (HMAC of
user_id with the deployment pepper).

### 8.3 Grafana dashboards

Two dashboards:

- **Operational**: per-endpoint-group 429 rate over time;
  Redis P99 latency; Lua script call rate; CPU on the
  rate-limit middleware path.
- **Security**: per-pattern anti-griefing block counter;
  Stage 1 / Stage 2 CAPTCHA activation timeline; IP/CIDR
  block list; alert history.

### 8.4 Alert rules (Grafana)

| Alert                                                     | Threshold                                  | Severity |
| ---                                                       | ---                                        | ---      |
| Global 429 rate spike                                     | > 5× rolling 7-day baseline for > 5 min    | page on-call |
| Single IP saturates                                       | > 100 × 429 in 1 h                          | email    |
| Redis P99 latency                                         | > 5 ms for > 2 min                          | page on-call |
| Lua script error rate                                     | > 0.1 req/s                                 | email    |
| Anti-griefing blocked count                               | > 100 / 1 h                                 | email    |
| mCaptcha CPU                                              | > 5 % sustained 1 h                          | page on-call → Stage 2 |

## 9. User-facing 429 copy

DE / EN parallel; matched to `reason` enum from §3.0.

| `reason`                          | DE                                                                                                  | EN                                                                                                |
| ---                               | ---                                                                                                 | ---                                                                                               |
| `per_user_login_throttle`         | "Aus Sicherheitsgründen haben wir Anmeldeversuche verlangsamt. Versuche es in {N} Sekunden erneut." | "For security, we've slowed sign-in attempts. Try again in {N} seconds."                          |
| `per_user_save_write`             | "Du speicherst gerade zu schnell. Bitte warte {N} Sekunden."                                         | "You're saving too quickly. Please wait {N} seconds."                                              |
| `per_user_save_sync`              | "Cloud-Sync ist beschäftigt. Wir versuchen es in {N} Sekunden automatisch erneut."                  | "Cloud sync is busy. We'll automatically retry in {N} seconds."                                    |
| `per_user_mp_command`             | "Du sendest zu schnell Befehle in dieser Gruppe. Bitte warte {N} Sekunden."                          | "You're sending commands too quickly in this group. Please wait {N} seconds."                      |
| `transfer_offer_throttle`         | "Langsam. Du kannst in {N} Sekunden ein weiteres Angebot abgeben."                                   | "Slow down. {N} seconds until you can place another offer."                                       |
| `griefing_lowball_blocked`        | "Dieses Angebot kann jetzt nicht gemacht werden. Probiere es später mit anderen Bedingungen."        | "This offer can't be placed right now. Try again later or with different terms."                  |
| `gdpr_data_export_throttle`       | "Datenexporte sind auf 1 pro 24 Stunden begrenzt. Bitte versuche es in {N} Stunden erneut."          | "Data exports are limited to 1 per 24 hours. Please try again in {N} hours."                      |
| `password_reset_throttle`         | "Wir haben dir bereits einen Link gesendet. Bitte überprüfe dein Postfach oder warte {N} Minuten."  | "We already sent you a link. Please check your inbox or wait {N} minutes."                        |
| `captcha_challenge_required`      | "Wir prüfen kurz, ob du ein Mensch bist. Das dauert nur einen Moment."                              | "We're verifying you're human. This takes a moment."                                              |
| `admin_blocked`                   | "Dein Zugriff wurde vorübergehend gesperrt. Wende dich an support@<canonical-domain>, falls dies ein Fehler ist." | "Your access has been temporarily blocked. Contact support@<canonical-domain> if this is an error." |

**Locked rule**: never reveal exact thresholds. Copy must
guide the user (what to do, when to retry) without leaking
the throttle configuration.

## 10. Future-proof extension points

### 10.1 Provisioned now (additive when needed)

- **B2B per-org tier**: every quota dimension carries an
  optional `org_id` scope field. Schema reserved; not active
  at MVP. When B2B mode ever happens, multi-tenancy is
  additive.
- **Paid-tier burst credit**: every quota config supports an
  optional `burst_multiplier` (default 1.0). Future paid
  tiers can flip it to e.g. 5.0 for premium users without
  changing the bucket algorithm.
- **Real-time WebSocket / SSE quotas**: ADR-0015 spectator
  streaming + F3 FU-2 SSE. The token-bucket algorithm is
  reusable; quota dimensions are message-rate-based rather
  than request-rate-based. Provision the `ws_message_*`
  scopes now; full spec when SSE/WS actually ships.
- **Per-`session_purpose` quotas** (F3 §4.1): once we ship
  `mobile-pwa` / `api-token` / `share-link` purposes, each
  gets its own quota tier.
- **Distributed quota** (multi-VM): the §5.5 graduation path
  is documented; the Redis-Lua script doesn't change.

### 10.2 Triggers to re-evaluate F12 stance

| Trigger                                          | What to re-evaluate                                                              |
| ---                                              | ---                                                                              |
| ≥ 20 k MAU                                       | Phase 2 edge-WAF graduation                                                       |
| Sustained DDoS event                             | Phase 2 immediate, Phase 3 evaluate                                              |
| New endpoint surface (B2B / payments / public API) | Add quota rows to §3 catalogue                                                    |
| New MP command type                              | Add to §3.5 + §4 if anti-griefing applies                                         |
| Compliance audit (SOC 2 / ISO 27001 / TISAX)     | Phase 3 / managed-secret-store graduation per F11 §14                             |
| Real-time / WS shipped                            | Promote §10.1 WS quotas to enforced                                                |

## 11. Compliance + standards map

### 11.1 OWASP API Security Top 10 (2023+)

| ASVS / OWASP API ID                  | F12 §            | Status |
| ---                                  | ---              | ---    |
| API4:2023 Unrestricted Resource Consumption | §3-5         | ✔      |
| API2:2023 Broken Authentication      | F2 §8.1 + F12 §3.B | ✔      |
| API6:2023 Unrestricted Access to Sensitive Business Flows | §4 anti-griefing | ✔      |
| ASVS V4.2 (rate limiting)           | §3-5             | ✔      |

### 11.2 GDPR

- **Art. 32 security of processing** — F12 quotas + anti-
  griefing + escalation are documented controls.
- **Art. 5(1)(c) data minimisation** — quotas key on
  `ip_prefix` not full IP per F2 §8 + F12 §3 scope rules.
- **Audit-event payload redaction**: `user_id_pseudo` =
  HMAC(deployment_pepper, user_id) per F11 + F6 §7.2.

### 11.3 IETF / RFC anchors

- **RFC 6585** §4 — `429 Too Many Requests` status.
- **RFC 7231** §7.1.3 — `Retry-After` header semantics.
- **IETF draft-ietf-httpapi-ratelimit-headers** — stable in
  2026; we ship `RateLimit-Limit` / `RateLimit-Remaining` /
  `RateLimit-Reset` headers.
- **NIST SP 800-61** — incident handling phases (§7
  escalation alignment).

## 12. Open decisions for Nico (Q&A)

Per "use defaults + clear best practices" workflow:

### Q1. Phase 1 → Phase 2 graduation

Confirm: launch with **no edge WAF**; pre-wire DNS + TLS so
Phase 2 (Bunny.net Shield) is a 1-day infra change when any
of the §2.4 triggers fires.

Default: **confirmed**.

### Q2. Phase 3 (Cloudflare) decision-gate

Confirm: Cloudflare remains explicitly **off** until Phase 2
proves insufficient AND we complete the §2.5 prerequisites
(TIA + DPA + Privacy Notice update).

Default: **confirmed**.

### Q3. mCaptcha → Friendly Captcha escalation

Confirm: Stage 1 mCaptcha self-hosted at first abuse; Stage 2
Friendly Captcha (EU-managed) when CPU cost > 5 % sustained
OR > 7 days sustained abuse.

Default: **confirmed**.

### Q4. Per-endpoint quota numerics

Confirm the §3 quota catalogue numbers (defaults tuned per
Q2 research + industry references — Stripe / GitHub /
Hetzner Cloud / Supabase 2026 patterns).

Default: **confirmed**.

### Q5. Anti-griefing thresholds

Confirm the §4 6-pattern thresholds (lowball 25 % of market
value; storming ≥ 5 in 7 d; counter ping-pong max 5 rounds;
inactive member 14 in-game days; quorum vote ≥ 3 / season;
spectator burst 10 / 10 s).

Default: **confirmed**.

### Q6. Discord webhook as alert channel

Confirm: alert delivery via founder's email + a Discord
webhook ping at MVP (no paid PagerDuty / OpsGenie). Discord
webhook URL stored as a sops-encrypted secret category J
extension.

Default: **confirmed**.

## 13. F12 follow-up tasks (deferred, not blocking)

| #     | Task                                                                          | Owner    |
| ---   | ---                                                                           | ---      |
| FU-1  | Implement Lua token-bucket script + ioredis wrapper in `apps/web/src/server/rate-limit/` | E10 + E11 |
| FU-2  | Implement §3 per-endpoint quota config + middleware integration with F3 `createAuthedServerFn` | E10       |
| FU-3  | Implement §4 anti-griefing pattern detectors + outbox event emission           | E10 + transfer-market-implementation-plan |
| FU-4  | Implement §6 mCaptcha integration + activation feature flag                    | E10       |
| FU-5  | Implement §7.2 admin CLI commands                                              | E10       |
| FU-6  | Build §8.3 Grafana dashboards + §8.4 alert rules                              | observability-runbook |
| FU-7  | Integration tests for §3 quota enforcement + §4 anti-griefing detection        | E11       |
| FU-8  | Phase 2 (Bunny.net Shield) onboarding runbook in [[deployment-dokploy]]        | when triggered |
| FU-9  | Quarterly review of §3 quota numerics against actual production traffic        | calendar  |

## 14. Sources

### Standards + RFCs

- RFC 6585 — Additional HTTP Status Codes (429):
  <https://www.rfc-editor.org/rfc/rfc6585>
- RFC 7231 §7.1.3 — Retry-After header:
  <https://www.rfc-editor.org/rfc/rfc7231#section-7.1.3>
- IETF draft-ietf-httpapi-ratelimit-headers:
  <https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/>
- OWASP API Security Top 10 (2023):
  <https://owasp.org/API-Security/editions/2023/en/0x00-header/>
- OWASP ASVS v5.0 V4 (API + Web Service):
  <https://owasp.org/www-project-application-security-verification-standard/>
- NIST SP 800-61 rev. 2 Computer Security Incident Handling:
  <https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final>
- NIST SP 800-53 SC-5 (DoS protection):
  <https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final>

### Vendors

- Bunny.net Shield: <https://bunny.net/shield/>
- mCaptcha (self-hosted): <https://mcaptcha.org/>
- Friendly Captcha (EU-managed): <https://friendlycaptcha.com/>
- Hetzner DDoS protection:
  <https://www.hetzner.com/unternehmen/ddos-protection>

### Industry references

- Stripe API rate-limit guide:
  <https://stripe.com/docs/rate-limits>
- GitHub REST API rate-limit:
  <https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api>
- Cloudflare Rate Limiting Rules:
  <https://developers.cloudflare.com/waf/rate-limiting-rules/>
- ioredis Lua scripting:
  <https://github.com/redis/ioredis#lua-scripting>

### Project-internal anchors

- [[../60-Research/threat-model]] (F1) §4.5 DoS controls;
  §3 trust-boundary diagram.
- [[../60-Research/gdpr-compliance]] (F6) §3 RoPA; §10
  third-country-transfer posture; §11 vendor Art. 28 DPAs.
- [[auth-flows]] (F2) §8 throttling + anomaly signals.
- [[session-management]] (F3) §8 revocation matrix; §12
  TanStack Start `createAuthedServerFn`; §13 admin CLI.
- [[account-recovery]] (F5) §6 rotation triggers.
- [[secrets-management]] (F11) §9 leak response; §13 audit
  integration.
- [[../60-Research/transfer-market-simulation]] — mid-market
  value model for the lowball detection.
- [[audit-trail]] outbox event catalogue (extended here with
  `mp.griefing_blocked{reason:…}`, `infra.rate_limit_*`).
- [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  MP command surface.
- [[../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]]
  spectator surface for §4.6.
- [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  Loki + Prometheus + Grafana + GlitchTip stack.

### Perplexity research transcripts (this gap)

Six focused Perplexity-sonar-pro queries, 2026-05-18, total
~43 k tokens, ~$0.12 estimated:

1. Edge WAF graduation pathway (Cloudflare vs Bunny.net
   Shield vs self-hosted nginx+modsecurity vs none-at-MVP);
   EU/GDPR posture; trigger thresholds for Phase 2 + Phase 3.
2. Per-endpoint quota catalogue across 8 endpoint groups
   (GDPR / auth / saves / MP commands / game reads /
   observability / admin); read vs write asymmetry;
   authenticated vs unauthenticated; IETF RateLimit headers.
3. Anti-griefing playbook for football-manager MP + transfer
   market (6 patterns: lowball storming, counter ping-pong,
   inactive member, quorum spam, press-conference spam,
   spectator abuse); detection rules + mitigations + audit
   events.
4. Single-VM Redis-Lua token-bucket pattern; algorithm choice
   per quota tier; multi-VM scale-out path with 4 patterns
   (shared cluster / per-instance sync / hashed routing /
   edge-only); trigger thresholds.
5. mCaptcha activation triggers + integration spec + UX +
   accessibility; Stage 2 Friendly Captcha escalation; EDPB
   stance on passive bot signals.
6. Escalation rule table; admin CLI command set;
   user-facing 429 copy; WAF + app rate-limit coexistence
   pattern.

Raw transcripts not committed (ephemeral); citations
preserved inline in §14 above + per-section anchors
throughout the note.
## Related

- [[../60-Research/threat-model]]
- [[../60-Research/gdpr-compliance]]
- [[../60-Research/transfer-market-simulation]]
- [[auth-flows]]
- [[session-management]]
- [[account-recovery]]
- [[privacy-and-consent]]
- [[notification-messaging-platform]]
- [[secrets-management]]
- [[audit-trail]]
- [[incident-response]]
- [[observability-runbook]]
