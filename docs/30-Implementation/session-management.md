---
title: Session Management
status: current
tags: [implementation, session, redis, refresh-token, rotation, device-list, csrf, tanstack-start]
created: 2026-05-18
updated: 2026-05-18
type: implementation
binding: false
adr:
  - "[[../10-Architecture/09-Decisions/ADR-0002-offline-first]]"
  - "[[../10-Architecture/09-Decisions/ADR-0005-save-format]]"
  - "[[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]"
  - "[[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]"
  - "[[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]"
  - "[[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]"
related:
  - [[auth-flows]]
  - [[audit-trail]]
  - [[observability-runbook]]
  - [[../60-Research/threat-model]]
  - [[../95-Archive/gap-reports/wave-3-gap-analysis]]
---

# Session Management

This note resolves Wave 3 gap **F3** (Session management) and is the
**binding implementation specification** for the server-side session
store, refresh-token rotation, idle / absolute lifetimes, device list,
"log out everywhere" runbook, cross-tab synchronisation, and TanStack
Start integration patterns.

F3 fills the operational lifecycle that **F2 Auth flows** declared as
inputs:

- [[auth-flows]] §5.1 cookie shape (`session_id` SameSite=Lax,
  `refresh_token` SameSite=Strict + Path=`/api/auth/refresh`).
- [[auth-flows]] §5.2 opaque tokens + Redis lookup (NOT JWT).
- [[auth-flows]] §5.3 `accountSecret` bootstrap contract.
- [[auth-flows]] §5.4 three-layer CSRF defence.
- [[auth-flows]] §7 step-up MFA windows
  (`stepup_mfa_max_age = 15 min`, `reauth_max_age = 12 h`).
- [[auth-flows]] §8 throttling + anomaly signal catalogue.

F3 anchors on [[../60-Research/threat-model]] §1.3 attacker tiers
(T0–T4 in, T5–T6 partial), §4.1 Spoofing (S1, S2), §4.6 Elevation of
Privilege (E2), and §7 control map.

## 1. Scope and stance

### 1.1 What F3 locks

- The **Redis-based session and refresh-token storage schema** (key
  patterns, hash fields, secondary indexes for revocation, TTLs).
- The **refresh-token rotation algorithm** with a 15-second grace
  window for multi-tab and network-failure races, strict family
  revocation outside the grace.
- The **idle and absolute lifetime numerics** (30 min idle, 12 h
  absolute on `session_id`, 30 d on `refresh_token`).
- The **slide-on-meaningful-activity policy** with 60-second
  rate-limiting on Redis writes.
- The **cross-tab logout/login broadcast** via `BroadcastChannel` +
  `localStorage` sentinel fallback.
- The **revocation matrix** (15 triggers × scope × outbox event ×
  propagation expectation) and the **hybrid `tokenVersion` +
  family-revoke** model.
- The **`device` table schema** and the separation between *user-
  visible devices* and *operational sessions*.
- The **"Trust this device" MFA-skip policy** (30-day cap, never
  bypasses primary factor).
- The **per-device revoke semantics** for the offline-first case
  (revokes server access; does not rotate `accountSecret` by
  default; separate "revoke + rotate" flow available).
- The **offline-first reconnect behaviour** (refresh-valid silent
  sync; refresh-expired non-modal banner; local progress never
  lost).
- The **TanStack Start integration patterns**: `getSessionFromRequest`
  helper, `createAuthedServerFn` HOF, route guards in `beforeLoad`,
  CSRF interceptor wiring, Service-Worker bypass rules.
- The **future-proof extension fields** to provision now so the
  later F5 / F6 / future-IdP / future-B2B work is additive.
- The **operator emergency-revoke runbook** for the indie-team scale.

### 1.2 What F3 does not lock

- The user-facing auth flows (passkey / password / TOTP / recovery
  codes / step-up policy) — **F2** [[auth-flows]].
- The stable account-master-key envelope that lets `accountSecret`
  rotation re-wrap device-backup save keys without re-encrypting
  every IndexedDB row — **F5 Account recovery** ([[auth-flows]]
  §11 Q1 + FU-1).
- Multi-device cloud sync of save data — **F4** (Wave 3.C P2).
  F3's offline-first reconnect spec is for the auth-token surface
  only.
- GDPR DSAR export shape, DPIA on `accountSecret` + WebAuthn
  storage — **F6** ([[auth-flows]] FU-6 / FU-7).
- Edge WAF / DDoS posture, full per-endpoint rate-limit numerics —
  **F12** ([[auth-flows]] FU-5).
- The OAuth/OIDC client implementation when external IdP ships —
  **F2 §3.6** abstraction; F3 only provisions the storage fields.

### 1.3 Threats this spec mitigates

Cross-references into [[../60-Research/threat-model]]:

- **S1 Fake client / bot impersonation** — short access-token TTL
  + refresh-token rotation with reuse detection means a stolen
  refresh token is single-use, and any second presentation revokes
  the entire family.
- **S2 Session/token theft via XSS** — opaque tokens in HttpOnly
  cookies (already F2); session lookup server-side means a stolen
  cookie still loses validity the moment the server revokes it
  (vs. JWT where the token stays valid until expiry).
- **T3 Command replay / reorder from offline outbox** — already
  handled at the command layer by ADR-0011; F3's role is just to
  expire sessions / refresh tokens cleanly when the user's auth is
  no longer valid.
- **E2 Authorization bypass** — `createAuthedServerFn` HOF makes
  the `authorize(actor, action, resource)` call mandatory per
  server function; the F2 FU-2 CI lint rule operates on this HOF.

Residual risks (deferred to ADR / FU): RR-1 compromised browser
(out-of-app); the F3 device-revoke runbook explicitly cannot wipe
already-cached IndexedDB on a compromised device (per Q4 research
"Option B").

## 2. Lifetimes and numerics (locked)

These resolve the "30 min idle, 12 h absolute, 30 d refresh" set
the F2 note declared as defaults; F3 confirms and binds them.

| Window                | Default | Used for                                            | Standard anchor |
| ---                   | ---     | ---                                                 | ---             |
| `access_window`       | up to the session_id idle window (single token tier — see §3.4) | — | — |
| `session_id_idle`     | 30 min  | session_id cookie sliding TTL                       | NIST SP 800-63B §7.2 AAL2; OWASP ASVS v5.0 V7.1 |
| `session_id_absolute` | 12 h    | hard cap on session_id; forces silent refresh       | OWASP ASVS V7.1.4 |
| `refresh_per_token`   | 30 d    | individual `rt:<token_id>` TTL                      | RFC 6819 §5.2.2 |
| `refresh_family_absolute` | 30 d after last *interactive* auth (passkey / password+MFA) | hard cap on family lineage | RFC 9126 OAuth 2.1 BCP |
| `rotation_grace`      | **15 s** | window in which a duplicate presentation of a *just-consumed* refresh token returns the *same* new token (idempotent) instead of revoking the family | Auth0 rotation overlap, Stytch / Clerk patterns |
| `slide_throttle`      | 60 s    | minimum interval between successive Redis `last_seen_at` writes on the same session | Redis EXPIRE cost reduction |
| `stepup_mfa_max_age`  | 15 min  | sensitive ops require MFA within this window        | F2 §7.2; NIST 800-63B §7.2 |
| `reauth_max_age`      | 12 h    | sensitive ops require primary credential within     | F2 §7.2 |
| `device_mfa_trust`    | 30 d max | optional "Trust this device" MFA-skip flag         | NIST 800-63B §5.1; OWASP ASVS V6.4.3 |
| `account_delete_grace`| 30 d    | soft-delete window from F2 §7.1                     | F2 §7.1 |

### 2.1 Why two tiers (session_id + refresh) and not three

The F2 design uses an opaque `session_id` as the per-request bearer
and an opaque `refresh_token` for silent re-issue. We deliberately
do **not** add a third "access token" tier:

- We have no cross-service / cross-origin handoff that would
  benefit from a self-contained JWT.
- A single-tier opaque-session-id pattern is operationally simpler:
  every request hits Redis `HGETALL sess:<id>`, instant revocation
  by `DEL`, no parallel block-list to maintain.
- The session_id is itself short-lived (30 min idle, 12 h
  absolute); the refresh token replaces it.

Same conclusion as F2 §5.2, restated here for the lifetime
discussion.

### 2.2 "Remember me" stance

Per Q3 research, we **do not** ship a "Remember me" checkbox at
MVP. The login flow grants a 30-day refresh token by default; a
**Settings → Security → "Short session mode"** toggle is exposed
that swaps the per-device refresh to 24 h (rotation continues
within that 24 h, but the family absolute cap is the shorter
value). Default state: off.

Rationale: privacy-by-default per GDPR Art. 25 is satisfied by the
explicit Settings option; the per-session UX is unambiguous
("This device stays signed in for 30 days; sign out on shared
devices."). The EDPB cookie guidance (authentication cookies are
"strictly necessary", no consent banner required) applies.

## 3. Storage architecture

### 3.1 Hot store: Redis (source of truth for live state)

Redis is the **authority** for "is this session/refresh-token
currently valid". For ~thousands of users on a single Hetzner box,
Redis with persistence is sufficient and standard.

Persistence:

- **AOF** with `appendfsync everysec` (default, ~1 s worst-case
  data loss on crash — acceptable: worst case is some users sign
  in again).
- **RDB** snapshots every 5 minutes.
- Both files included in the Dokploy backup runbook (F11 will own
  the rotation schedule + restore drill).

### 3.2 Cold store: PostgreSQL audit mirror via outbox

Per ADR-0013, every session-lifecycle event (`auth.login_*`,
`auth.session_revoked`, `auth.logout_everywhere`, `auth.refresh_rotated`,
`auth.refresh_reuse_detected`, `auth.device_*`) is appended to the
outbox in the same transaction as the Redis state change. The
async outbox worker writes the events to the PostgreSQL
`outbox_event` table per ADR-0013, available in cold archive
forever.

PostgreSQL **does not** rehydrate Redis on cold start. If Redis
loses state, all sessions are invalidated and the next request
from each user forces a fresh sign-in. This is the simplest safe
behaviour for our scale.

### 3.3 What lives where

| Concern                                | Hot (Redis)                      | Cold (PostgreSQL via outbox)      |
| ---                                    | ---                              | ---                               |
| Active session lookup                  | `sess:<id>` (HASH)               | — (audit events only)             |
| User → sessions index                  | `user_sess:<user_id>` (SET)      | — (rebuildable from session rows) |
| Refresh-token family lookup            | `rtfam:<family_id>` (HASH)       | `outbox_event` with full history  |
| Refresh-token individual records       | `rt:<token_id>` (HASH)           | `outbox_event` `auth.refresh_rotated` |
| Device records (long-lived metadata)   | optional cache `dev:<device_id>` | `device` typed-column table       |
| User → devices index                   | `user_dev:<user_id>` (SET)       | indexed by `device.user_id`       |
| Audit events                           | —                                | `outbox_event` per ADR-0013       |

### 3.4 Why opaque (not JWT) — restated F2 §5.2 in storage terms

Opaque tokens win for this stack because:

- Instant revocation: `DEL sess:<id>` in Redis kills the session;
  no parallel block-list maintained.
- We already run Redis for outbox fan-out + rate-limit counters
  (F1 §3, [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]);
  incremental complexity ~ zero.
- Tiny cookies (≤ 64 bytes) vs JWT bloat (a 7-claim JWT is
  ~600–900 bytes).
- No algorithm-confusion / key-rotation footguns.
- Single-app deployment — no cross-service token handoff to
  benefit from self-contained claims.

JWT remains a **defer-to-later** decision if/when we add an API
surface to be consumed by third-party clients (post-MVP per F2
§3.6).

## 4. Redis schemas

### 4.1 Session record — `sess:<session_id>` (HASH)

`session_id` is 32 random bytes from `crypto.randomBytes`, base64url-
encoded (≥ 128-bit entropy). Cookie value MUST match the Redis key
suffix exactly.

| Field                  | Type                  | Notes                                                          |
| ---                    | ---                   | ---                                                            |
| `user_id`              | string                | foreign key to `user` table                                    |
| `device_id`            | string                | 128-bit client-generated UUID; see §10                         |
| `refresh_family_id`    | string                | links to `rtfam:<family_id>`                                   |
| `csrf_token`           | string                | random per-session value echoed in `X-CSRF-Token` header (F2 §5.4) |
| `session_purpose`      | enum string           | `web` (MVP), `mobile-pwa`, `api-token`, `share-link` (future)  |
| `created_at`           | int (ms since epoch)  | session genesis                                                |
| `last_seen_at`         | int (ms)              | updated by §6 slide-on-activity                                |
| `last_credentialed_at` | int (ms)              | last primary-credential auth (F2 §7)                           |
| `last_mfa_at`          | int (ms)              | last MFA factor presented (F2 §7)                              |
| `mfa_satisfied_until`  | int (ms) (optional)   | step-up claim expiry; if present, F2 §7.1 sensitive ops accept without re-prompt |
| `password_reauth_until`| int (ms) (optional)   | primary-credential reauth claim                                |
| `roles`                | JSON-encoded array    | snapshot at login (`["user"]` for MVP; future `["user","admin"]`) |
| `ip_prefix`            | string                | last seen `/24` (IPv4) or `/56` (IPv6); coarse for privacy + anomaly hints |
| `ua_hash`              | string                | SHA-256 of UA, first 16 bytes hex; full UA in audit only       |
| `country`              | string (ISO 3166-1)   | coarse geolocation derived from IP                             |
| `bound_cred_id`        | string (optional)     | WebAuthn `credentialId` used at session creation               |
| `bound_cred_level`     | enum (optional)       | `passkey-platform` / `passkey-synced` / `passkey-roaming` / `password+totp` / `password` |
| `token_version_at_issue` | int                 | snapshot of `user.token_version` at session creation (§9.2)    |
| `revoked`              | `"0"` / `"1"`         | defensive flag; on logout we both `HSET revoked=1` and `DEL` the key |
| `idp_provider`         | enum (optional)       | reserved for F2 §3.6 (future Google / Apple / Discord)          |
| `idp_sub`              | string (optional)     | provider stable identifier                                     |
| `org_id`               | string (optional)     | reserved for post-MVP B2B                                      |
| `org_roles`            | JSON (optional)       | reserved                                                       |

Key TTL: set on creation to `session_id_absolute = 12 h` (so the
absolute cap is enforced by Redis itself even if `last_seen_at` is
sliding via the rate-limited Lua script).

### 4.2 User → sessions index — `user_sess:<user_id>` (SET)

`SADD user_sess:<user_id> <session_id>` on creation; `SREM` on
deletion; iterated for "log out everywhere".

For our scale (typical user has 1–5 active sessions) the SET fits
in a few hundred bytes; iteration is O(n). At 99th-percentile a
user may have 10–20 sessions across years; still trivial.

Optional auxiliary index (admin tooling only): a ZSET
`sess_last_seen:zset` with score = `last_seen_at` for "show me
sessions active in last 5 minutes" diagnostics. Not required at
MVP.

### 4.3 Refresh-token family — `rtfam:<family_id>` (HASH)

Created on every interactive sign-in (password / passkey + optional
MFA). Each family belongs to exactly one `(user_id, device_id)`
pair; the same device opening a new family means it explicitly
re-authed.

| Field                   | Type                  | Notes                                              |
| ---                     | ---                   | ---                                                |
| `user_id`               | string                |                                                    |
| `device_id`             | string                | links to `device` table                            |
| `status`                | enum                  | `active`, `revoked`                                |
| `revoke_reason`         | enum                  | (when status=revoked) per §9.3 catalogue          |
| `revoked_at`            | int (ms)              | when status flipped                                |
| `created_at`            | int (ms)              | family genesis                                     |
| `last_rotated_at`       | int (ms)              | timestamp of most recent successful rotation       |
| `absolute_expires_at`   | int (ms)              | family hard cap = `last_credentialed_at + 30 d`    |
| `current_token_id`      | string                | the token currently in the user's possession       |
| `prev_token_id`         | string (optional)     | for the §5 grace window                            |
| `reused_detected_at`    | int (ms) (optional)   | populated on §5.4 reuse                            |
| `ua_hash_initial`       | string                | UA fingerprint at family genesis                   |
| `ip_prefix_initial`     | string                | IP prefix at family genesis                        |
| `last_ip_prefix`        | string                | most recent rotation IP prefix (anomaly hint)      |
| `last_ua_hash`          | string                | most recent rotation UA hash                       |

Key TTL: `family_absolute + 90 d` audit margin so post-incident
analysis still has the row available; the active enforcement uses
`absolute_expires_at`.

### 4.4 Refresh-token record — `rt:<token_id>` (HASH)

Created on family genesis + on every successful rotation. The
client never sees `token_id` directly: the cookie value is `<token_id>.<secret>`
where `secret` is 32 random bytes; the server stores
`HMAC-SHA256(server_pepper, secret)` in `hash` for verification
(prevents Redis-dump-then-replay).

| Field             | Type                | Notes                                          |
| ---               | ---                 | ---                                            |
| `family_id`       | string              |                                                |
| `user_id`         | string              | defensive duplication                          |
| `status`          | enum                | `active`, `consumed`, `revoked`, `reused`      |
| `hash`            | bytes (32, hex)     | HMAC of the secret portion of the token        |
| `created_at`      | int (ms)            |                                                |
| `expires_at`      | int (ms)            | `created_at + refresh_per_token = 30 d`        |
| `rotated_from`    | string (optional)   | previous token_id in lineage (audit chain)     |
| `rotated_to`      | string (optional)   | next token_id once consumed                    |
| `last_rotation_req` | string (optional) | idempotency token from the rotation request    |
| `last_rotation_ts`| int (ms) (optional) | when this token was consumed                   |
| `ua_hash`         | string              | UA at issuance                                 |
| `ip_prefix`       | string              | IP prefix at issuance                          |

Key TTL: `refresh_per_token + 7 d` audit margin so the §5.4 reuse
detection still sees recently-consumed tokens.

### 4.5 Optional auxiliary index — `user_dev:<user_id>` (SET)

`SADD user_dev:<user_id> <device_id>` on first device bootstrap.
Cheap; mirrors the PostgreSQL `device` table for fast "list active
devices" calls without a DB round-trip.

## 5. Refresh-token rotation algorithm

### 5.1 Decisions locked

- **Rotation on every refresh** — old token marked `consumed`,
  new token minted, family `current_token_id` updated, single
  atomic Lua script.
- **15-second grace window** — a duplicate presentation of the
  *just-consumed* token within `now - last_rotation_ts ≤ 15 s`
  returns the **same** newly-issued token (idempotent), not a
  reuse-detection trigger. Outside the window, family-revoke.
- **Strict reuse detection outside the grace** — a `consumed`
  token presented later, or a `revoked` token presented at any
  time, immediately revokes the entire family (`rtfam.status =
  revoked`, `revoke_reason = reuse_detected`) and emits
  `auth.refresh_reuse_detected` outbox event.
- **Idempotency tag** — the client SHOULD include an idempotency
  UUID as `X-Idempotency-Key` header; the server records it on
  the consumed token, so a true logical retry of the same
  rotation gets the existing new token regardless of the grace
  timer.
- **`HMAC-SHA256(server_pepper, secret)` verification** — the
  cookie value is `<token_id>.<secret>`; the server splits, looks
  up `rt:<token_id>`, recomputes the HMAC over `secret`, and
  compares with `rt:<token_id>.hash` in constant time. Mismatch ⇒
  `400 invalid_token` (no family-revoke, because it might just be
  a corrupted cookie or a stale one from an entirely different
  origin).

### 5.2 Why a grace window (15 s, not 0)

Q2 research surveyed Auth0, Stytch, Clerk, Lucia, and BetterAuth.
The 2026 consensus is a **short grace window (5–30 s)** because:

- Multi-tab refresh races (user opens 5 tabs, all 5 reload at the
  same instant) would otherwise force spurious logouts.
- Network-failure-during-rotation: server marked the old consumed
  and minted the new, but the response TCP-RST'd; the client
  retries with the old token. Without a grace, this benign retry
  looks identical to an attacker re-using a stolen token.

The cost of the grace window is a tiny extended leak window — if
an attacker stole the old token, they have an extra 15 s to use
it. Mitigated by:

- The new token is what the server returns to *whichever* request
  presents the old one first. The legitimate browser gets the new
  token; the attacker is stuck with the old one (now `consumed`)
  whose next use will be detected as reuse outside the grace.
- The grace is bounded — outside 15 s the family is revoked
  immediately.

Idempotency-key beats grace as a deterministic mechanism but only
works when the client cooperates. The 15-s grace is the safety
net.

### 5.3 Atomic rotation Lua sketch

`KEYS[1] = rt:<old_token_id>`, `KEYS[2] = rtfam:<family_id>`,
`KEYS[3] = rt:<new_token_id>`.

`ARGV[1] = now_ms`, `ARGV[2] = grace_ms (15000)`,
`ARGV[3] = new_secret_hmac (hex)`, `ARGV[4] = new_expires_at_ms`,
`ARGV[5] = new_ua_hash`, `ARGV[6] = new_ip_prefix`,
`ARGV[7] = idempotency_key (optional, empty string if absent)`.

Returns a multi-value reply: `{status, current_token_id, reason}` where
`status ∈ { "OK_NEW", "OK_GRACE_IDEMPOTENT", "OK_GRACE_RETURN", "ERR_EXPIRED", "ERR_FAMILY_EXPIRED", "ERR_FAMILY_REVOKED", "ERR_REUSE" }`.

```lua
-- rotate_refresh_token.lua  (simplified sketch — full version
-- in the future packages/identity-and-access/src/redis/ folder).
local old, fam, new = KEYS[1], KEYS[2], KEYS[3]
local now    = tonumber(ARGV[1])
local grace  = tonumber(ARGV[2])
local hash   = ARGV[3]
local exp    = tonumber(ARGV[4])
local ua     = ARGV[5]
local ip     = ARGV[6]
local idem   = ARGV[7]

if redis.call("EXISTS", fam) == 0 then
  return {"ERR_FAMILY_REVOKED", "", "no_family"}
end
local fstatus = redis.call("HGET", fam, "status")
if fstatus ~= "active" then
  return {"ERR_FAMILY_REVOKED", "", fstatus or "unknown"}
end
local fabs = tonumber(redis.call("HGET", fam, "absolute_expires_at") or "0")
if now > fabs then
  redis.call("HSET", fam, "status", "revoked", "revoke_reason", "abs_expired", "revoked_at", now)
  return {"ERR_FAMILY_EXPIRED", "", "abs_expired"}
end

if redis.call("EXISTS", old) == 0 then
  return {"ERR_EXPIRED", "", "no_token"}
end
local ostatus  = redis.call("HGET", old, "status")
local ofamid   = redis.call("HGET", old, "family_id")
local olast    = tonumber(redis.call("HGET", old, "last_rotation_ts") or "0")
local olastIdm = redis.call("HGET", old, "last_rotation_req") or ""
local oexp     = tonumber(redis.call("HGET", old, "expires_at") or "0")

if ofamid ~= string.sub(fam, string.len("rtfam:") + 1) then
  -- defensive: token belongs to a different family
  return {"ERR_REUSE", "", "family_mismatch"}
end

if now > oexp then
  return {"ERR_EXPIRED", "", "token_expired"}
end

-- IDEMPOTENT REPLAY: same idempotency key as before
if idem ~= "" and olastIdm == idem and ostatus == "consumed" then
  return {"OK_GRACE_IDEMPOTENT", redis.call("HGET", fam, "current_token_id"), "idempotent"}
end

if ostatus == "active" then
  -- happy path: mint new, consume old, advance family
  redis.call("HSET", old, "status", "consumed", "rotated_to",
             string.sub(new, string.len("rt:") + 1),
             "last_rotation_ts", now, "last_rotation_req", idem)
  redis.call("HSET", new,
    "family_id", ofamid,
    "user_id",   redis.call("HGET", fam, "user_id"),
    "status",    "active",
    "hash",      hash,
    "created_at", now,
    "expires_at", exp,
    "rotated_from", string.sub(old, string.len("rt:") + 1),
    "ua_hash",   ua,
    "ip_prefix", ip)
  redis.call("PEXPIREAT", new, exp + 7 * 24 * 3600 * 1000)
  redis.call("HSET", fam,
    "current_token_id", string.sub(new, string.len("rt:") + 1),
    "prev_token_id",    string.sub(old, string.len("rt:") + 1),
    "last_rotated_at",  now,
    "last_ua_hash",     ua,
    "last_ip_prefix",   ip)
  return {"OK_NEW", string.sub(new, string.len("rt:") + 1), ""}
end

if ostatus == "consumed" and (now - olast) <= grace then
  -- benign multi-tab / network-retry race: return the existing
  -- new token (the family already advanced).
  return {"OK_GRACE_RETURN", redis.call("HGET", fam, "current_token_id"), "grace"}
end

-- outside grace, or already revoked/reused: REUSE → revoke family
redis.call("HSET", old, "status", "reused")
redis.call("HSET", fam,
  "status", "revoked",
  "revoke_reason", "reuse_detected",
  "revoked_at", now,
  "reused_detected_at", now)
return {"ERR_REUSE", "", "reuse"}
```

### 5.4 Race-condition cases handled

| Case                                              | Behaviour                                                  |
| ---                                               | ---                                                        |
| Two parallel refresh calls within 15 s            | First → `OK_NEW`; second → `OK_GRACE_RETURN` with same new token |
| Same logical refresh retried with idempotency key | `OK_GRACE_IDEMPOTENT` at any time during the consumed token's life (24-h cap via the token's own TTL) |
| Refresh > 15 s after the legitimate one           | `ERR_REUSE` — family revoked, all sessions in that family invalidated next request |
| Stale token from a wholly-different family        | `ERR_REUSE family_mismatch` — defensive, narrow revocation (just that token) |
| Expired token presented                            | `ERR_EXPIRED` — no family-revoke, just force re-login    |
| Family absolute cap exceeded                       | `ERR_FAMILY_EXPIRED` — soft revoke, normal sign-in flow  |

### 5.5 Client retry semantics

Server response to the client on `POST /api/auth/refresh`:

| Server status                  | HTTP | Cookie set | Client action                              |
| ---                            | ---  | ---        | ---                                        |
| `OK_NEW`, `OK_GRACE_RETURN`, `OK_GRACE_IDEMPOTENT` | 200 | new `refresh_token`, new `session_id`, new `csrf_token` | resume original API call |
| `ERR_EXPIRED`, `ERR_FAMILY_EXPIRED` | 401 with `{ "error": "session_expired" }` | clear cookies | navigate to `/login` |
| `ERR_REUSE`, `ERR_FAMILY_REVOKED` | 401 with `{ "error": "session_revoked", "broadcast": "logout" }` | clear cookies, `BroadcastChannel.postMessage({type: 'LOGOUT'})` | navigate to `/login`; show toast "You were signed out for security." |

The `ERR_REUSE` outbox event additionally triggers an
`auth.anomaly.refresh_token_reuse` per F2 §8.5 — the user
receives an email "Suspected unauthorised access to your
account; please change your password." (F2 §8.5 #4 disposition).

## 6. Slide-on-activity policy

### 6.1 Definition of "meaningful activity"

`last_seen_at` and Redis EXPIRE are **only** updated by requests
that are:

- Driven by a direct user action (any non-`GET` API call,
  navigation `loader`, form submit, `createServerFn` invocation).
- **Not** Service-Worker prefetch, periodic background sync,
  silent telemetry POST, healthcheck, or push-ack.

Implementation: server middleware that decides via header /
endpoint convention. The Workbox SW sets `X-Background: 1` on
any of its automatically-triggered requests; the rate-limited
slider in §6.2 ignores those.

### 6.2 60-second rate limiter

Even on meaningful activity, the slider Lua script (`slide_session_ttl_rate_limited.lua`)
only writes `last_seen_at` + `EXPIRE` when `now - last_seen_at > 60 s`.
At our scale (peak ~200 concurrent users), the slide writes drop
from "every request" to "≤ one per minute per active user" —
hundreds of writes/minute total, comfortably in Redis budget.

```lua
-- slide_session_ttl_rate_limited.lua
local sess = KEYS[1]
local now           = tonumber(ARGV[1])
local min_interval  = tonumber(ARGV[2])  -- 60000
local idle_timeout  = tonumber(ARGV[3])  -- 1800

if redis.call("EXISTS", sess) == 0 then return -1 end
local last = tonumber(redis.call("HGET", sess, "last_seen_at") or "0")
if (now - last) < min_interval then return 0 end
redis.call("HSET", sess, "last_seen_at", tostring(now))
redis.call("EXPIRE", sess, idle_timeout)
return 1
```

### 6.3 Absolute timeout enforcement

The absolute cap (12 h on `session_id`) is enforced by the cookie
itself: Redis sets the key TTL to 12 h on creation; once the key
expires Redis returns `nil` and the session is gone. No
separate watchdog needed.

The refresh-token family absolute cap (30 d after last
interactive auth) is enforced inside the rotation Lua script
(§5.3, `ERR_FAMILY_EXPIRED` path).

## 7. Cross-tab + cross-process synchronisation

### 7.1 Logout / login broadcast

```ts
// apps/web/src/auth/session-sync.ts
const CHANNEL = 'session-sync'
const STORAGE_KEY = 'session-sync'

const bc =
  typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null

type Msg =
  | { type: 'LOGOUT'; reason: string }
  | { type: 'LOGIN'; user: { id: string; displayName: string } }

bc?.addEventListener('message', (e) => handleMsg(e.data as Msg))

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        handleMsg(JSON.parse(e.newValue) as Msg)
      } catch {
        /* ignore */
      }
    }
  })
}

export const broadcastLogout = (reason = 'user_logout') => {
  const msg: Msg = { type: 'LOGOUT', reason }
  bc?.postMessage(msg)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...msg, ts: Date.now() }))
}

export const broadcastLogin = (user: { id: string; displayName: string }) => {
  const msg: Msg = { type: 'LOGIN', user }
  bc?.postMessage(msg)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...msg, ts: Date.now() }))
}
```

`handleMsg(LOGOUT)`:

- Clear in-memory auth state in the TanStack Store (§12.3).
- Cancel pending React Query / TanStack Query mutations.
- Show toast "You've been signed out in another tab." (with the
  reason if not `user_logout`).
- Navigate to `/login` with the current route saved as
  `redirectTo` search param.

`handleMsg(LOGIN)`: refresh the in-memory `actor` from
`/api/auth/me` (cheap; the new session cookie is already set
because cookies are shared between tabs).

### 7.2 Server-to-client propagation (other devices)

For revocation events originating elsewhere, F3 does **not** ship
a Server-Sent-Events / WebSocket push at MVP. The propagation
relies on:

- Next API request from the affected session hits the slide
  middleware → looks up `sess:<id>` → finds `revoked = "1"` or no
  key → returns `401 session_revoked` → client clears cookies →
  navigates to login.
- The `ERR_REUSE` and `revoked` paths bound this to "within one
  request RTT", typically ≤ 1–2 s on an active tab.
- Idle tabs see revocation on their next user action (which fires
  the typical TanStack Query `staleTime` re-fetch).

Adding SSE push for "instant" cross-device logout is a post-MVP
optimisation (FU-2 below). At our scale (~thousands of users) the
"on next request" model is acceptable.

## 8. Revocation surface

### 8.1 Trigger × scope × outbox event matrix

| #  | Trigger                                            | Scope                          | Action                                                                 | Outbox event                       | Propagation expectation |
| -- | ---                                                | ---                            | ---                                                                    | ---                                | ---                     |
| 1  | Explicit "Sign out" (this session)                 | one `session_id`               | `DEL sess`; `SREM user_sess`; `HSET rtfam status=revoked, revoke_reason=user_logout` | `auth.session_revoked`             | < 1 s same-device tabs (broadcast); next request other tabs |
| 2  | "Sign out everywhere"                              | all sessions of `user_id`      | bump `user.token_version` + iterate `user_sess` + family-revoke         | `auth.logout_everywhere`           | < 1 s same-device; ≤ 5 s active tabs other devices |
| 3  | "Sign out from device X"                           | sessions with `device_id = X`  | family-revoke for that device's families                                | `auth.device_logout`               | next request on device X |
| 4  | Password change                                    | all sessions except current    | bump `user.token_version`; family-revoke others                         | `auth.password_changed`            | ≤ 5 s active tabs |
| 5  | Password reset (forgot-password)                   | all sessions                   | bump `user.token_version`; family-revoke all                           | `auth.password_reset_completed`    | force re-login everywhere |
| 6  | MFA factor added                                   | all sessions except current    | bump `user.token_version`; family-revoke others                         | `auth.mfa_enrolled`                | ≤ 5 s active tabs |
| 7  | MFA factor removed                                 | all sessions                   | bump `user.token_version`; family-revoke all                           | `auth.mfa_disabled`                | force re-login everywhere |
| 8  | Recovery code used                                 | all sessions except current    | bump `user.token_version`; family-revoke others                         | `auth.recovery_code_used`          | ≤ 5 s active tabs |
| 9  | `accountSecret` rotated                            | all sessions                   | bump `user.token_version`; family-revoke all                           | `auth.account_secret_rotated`      | force re-login everywhere |
| 10 | Primary email changed                              | all sessions except current    | bump `user.token_version`; family-revoke others                         | `auth.email_changed`               | ≤ 5 s active tabs |
| 11 | Account locked by ops (incident response)          | all sessions                   | set `user.account_status = locked`; bump `user.token_version`; family-revoke all | `auth.account_locked`              | next request fails with `account_locked` |
| 12 | Account deletion request                           | all sessions                   | set `user.deleted_at = now`; bump `user.token_version`; family-revoke all | `auth.account_deleted`             | force re-login then "deletion pending" banner per F2 §7.1 |
| 13 | Refresh-token reuse detected (§5.4)                | one family + all sessions in it | family-revoke; close sessions                                          | `auth.refresh_reuse_detected` + `auth.anomaly.refresh_token_reuse` | ≤ 1–2 s next request |
| 14 | Operator emergency revoke (one user)               | all sessions of user           | same as #2 but `actor_type=admin`                                       | `auth.operator_revoke`             | as per #2 |
| 15 | Idle / absolute timeout (passive expiry)           | one session                    | Redis TTL fires; key gone                                              | `auth.session_expired` (lazy emit on next request) | next request shows "Session expired" |

### 8.2 Hybrid `tokenVersion` + family-revoke (locked)

The hybrid model: the **session table is the primary surface**;
`tokenVersion` is a coarse kill-switch used **only for events
that affect identity itself** (rows 4, 5, 6, 7, 8, 9, 10, 11, 12,
14 above — i.e. all "credential / identity change" + "account
locked / deleted").

- Pros: identity-changing events take a single write
  (`UPDATE user SET token_version = token_version + 1`); any
  session or refresh token minted under the old version is
  invalidated on its next presentation regardless of whether the
  family-revoke iteration completed.
- The iteration over `user_sess:<user_id>` + family-revoke still
  runs, to clean up Redis state and emit per-session outbox
  events for the audit trail.

Validation rule on every authed request:

```
IF session.token_version_at_issue != user.token_version → 401 session_revoked
```

This is one extra `HGET user_token_version:<user_id>` per
request, with the user_token_version cached in a 60-second
ioredis local cache to avoid hammering Redis.

### 8.3 Outbox event payload (binding)

Per F2 §8.5 + ADR-0013, every revocation event includes:

```ts
{
  event_id: 'uuidv7',
  event_type: 'auth.<verb>',
  schema_version: 1,
  aggregate_type: 'user' | 'session' | 'refresh_family',
  aggregate_id: '<id>',
  occurred_at: 'ISO 8601',
  emitted_at: 'ISO 8601',
  correlation_id: '<request-trace-id>',
  causation_id: '<optional-parent-event-id>',
  actor_type: 'user' | 'admin' | 'system',
  actor_id: '<user-or-admin-id>' | null,
  reason: '<enum from §8.1>',
  reason_text: '<optional admin-only free text, redaction deny-list applied>',
  trigger_source: 'web_ui' | 'api' | 'admin_ui' | 'admin_cli' | 'system_anomaly',
  affected_session_ids: ['<id>', ...],
  affected_device_ids: ['<id>', ...],
  affected_family_ids: ['<id>', ...],
  ip_prefix: '<a.b.c.0/24>',
  ua_hash: '<hex>',
  country: '<ISO-3166-1>',
  old_token_version: <int>,
  new_token_version: <int> | null,
}
```

The schema follows the ADR-0013 outbox event shape with the F2
audit catalogue (audit-trail.md). Redaction deny-list applies
(no raw tokens, no `accountSecret`, no `Authorization` header
content; F1 §4.4-I2).

## 9. Device list and device records

### 9.1 Definition

A **device** in this spec is `(user × browser-profile)` identified
by a 128-bit client-generated `device_id` persisted in IndexedDB.
We deliberately **do not** use browser fingerprinting (UA + screen
+ canvas hash) as the device identifier, because:

- EU ePrivacy Art. 5(3) + EDPB guidelines treat fingerprinting as
  "storing or accessing information on the user's terminal
  equipment" requiring opt-in consent.
- Fingerprints are brittle (OS / browser updates change them) and
  produce confusing device churn.

A `device_id` clears with `clear-site-data`, browser-reset, or
incognito-end. That is acceptable and honest UX: the next visit
shows as a new device, the user re-authenticates, and a fresh
device row is created.

### 9.2 `device` table (Drizzle, platform `public` schema)

Platform table; Drizzle is the source of truth
([[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] §1).
Typed columns + `CHECK` express the former ASSERT; `user_id` is an
intra-context FK on a branded `uuid`; `anomaly_flags` is a SCHEMALESS
`jsonb` payload validated by Zod at the boundary (ADR-0027 §4). IDs are
app-generated UUIDv7.

```ts
// packages/db/src/schema/platform/device.ts
export const device = pgTable('device', {
  id: uuid('id').$type<DeviceId>().primaryKey(),          // app-generated UUIDv7
  userId: uuid('user_id').$type<UserId>().notNull().references(() => user.id),
  firstSeenAt: timestamp('first_seen_at', { withTimezone: true }).notNull(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull(),
  lastIpPrefix: text('last_ip_prefix').notNull(),         // /24 IPv4, /56 IPv6
  lastCountry: text('last_country'),                      // ISO 3166-1 alpha-2
  lastCity: text('last_city'),                            // approximate
  uaSummary: text('ua_summary').notNull(),                // "macOS · Chrome"
  uaFull: text('ua_full'),                                // audit only; 180-day retention
  osName: text('os_name'),
  osVersion: text('os_version'),
  browserName: text('browser_name'),
  browserVersion: text('browser_version'),
  nickname: text('nickname'),                             // user-editable
  trustLevel: text('trust_level').notNull(),              // see CHECK below
  mfaTrustExpiresAt: timestamp('mfa_trust_expires_at', { withTimezone: true }),
  lastAuthMethod: text('last_auth_method'),
  lastAuthAt: timestamp('last_auth_at', { withTimezone: true }),
  anomalyFlags: jsonb('anomaly_flags').notNull(),         // { new_device, impossible_travel, new_country }
  lastAnomalyAt: timestamp('last_anomaly_at', { withTimezone: true }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
}, (t) => ({
  trustLevelCheck: check('device_trust_level', sql`${t.trustLevel} IN ('new','known','trusted','revoked')`),
  byUser: index('device_by_user').on(t.userId),
  byUserLastSeen: index('device_by_user_last_seen').on(t.userId, t.lastSeenAt),
}))
```

### 9.3 Separation: user-visible devices vs operational sessions

A row in the user's "Active devices" Settings page appears **only
when the device has completed at least one full interactive auth**
(passkey OR password + any required MFA). Bootstrap attempts
that abandon mid-flow do not create a visible device row, though
they may emit `auth.anomaly.signup_storm` events.

A `device_id` can host multiple `rtfam` lineages over its lifetime
(each successful sign-in creates a new family). The device list
groups by `device_id` and shows the most-recent activity across
all of its families.

### 9.4 "Trust this device" policy

After successful interactive auth on a device, the post-auth
screen offers an opt-in checkbox: **"Reduce MFA prompts on this
browser for 30 days. Don't use on shared devices."**

If accepted:

- `device.trust_level = 'trusted'`
- `device.mfa_trust_expires_at = now + 30 d` (hard cap; no
  rolling extension at MVP)

Effect:

- Subsequent sign-ins from that `device_id` skip the optional MFA
  step (F2 §4.1 — for users who opted into "MFA at every login").
- Sensitive ops still go through the step-up flow (F2 §7.1) —
  trusted-device never bypasses step-up.
- Risk signal trips (new country, impossible travel, new ASN)
  immediately downgrade `trust_level` back to `'known'` and
  invalidate `mfa_trust_expires_at`.

### 9.5 Per-device revoke runbook

When user clicks "Sign out from device X" in the device list:

1. F3 server iterates Redis families for `(user_id, device_id=X)`:
   - For each family: `HSET rtfam status=revoked, revoke_reason=device_logout, revoked_at=now`.
   - For each session under the family: `HSET sess revoked=1; DEL sess; SREM user_sess`.
2. `HSET device:X revoked_at=now, trust_level=revoked, mfa_trust_expires_at=NULL` (mirrored to PostgreSQL).
3. Emit `auth.device_logout` outbox event with `affected_device_ids: [X]` and `affected_session_ids`.
4. `accountSecret` is **not** rotated by default. Device-local
   IndexedDB saves remain decryptable on the device until the user
   clears site data; this matches the F2 "we cannot recover" stance
   and the Signal / 1Password / Bitwarden remote-wipe semantics
   (remote wipe of an offline-first client is always best-effort).
5. A separate **"Sign out everywhere AND rotate security key"**
   button in Settings → Security combines #1–#3 + rotates the
   `accountSecret`. This is the appropriate response when a device
   is known-compromised (lost / stolen). It triggers the F5
   stable-account-master-key migration once F5 lands; pre-F5 it
   keeps the F2 §9.3 "old devices need one extra bootstrap"
   behaviour.

### 9.6 Cross-platform passkey ↔ device linkage

For a user with one passkey synced via iCloud Keychain across
MacBook + iPhone + iPad, the data model produces:

- 3 `device` rows (one per browser profile, each with its own
  `device_id` + `deviceSalt`).
- 1 `user_credential` row of `kind = passkey` (the synced
  credential's `credentialId`).
- Multiple `rtfam` rows (one per interactive auth per device).

The Settings UI surfaces this without confusion:

- **Devices** page shows 3 rows, each "Sign-in method: Passkey
  (iCloud Keychain)".
- **Credentials** page shows 1 passkey entry, expanded view notes
  "Used on 3 devices in the last 30 days".
- Deleting the **passkey credential** disables sign-in on all 3
  devices (they fall back to password / TOTP / recovery code).
- Revoking a **device** only signs out that device; the passkey
  remains valid on the other two.

This matches the Apple ID + Google account 2026 patterns.

## 10. Offline-first reconnect behaviour

### 10.1 Token-state matrix on reconnect

Consider a user offline for N real-world days, returning online.
Their client holds (at most) `session_id` cookie + `refresh_token`
cookie. The wrapped `accountSecret` blob in IndexedDB
(F2 §5.3) is independent and remains usable for local play.

| State                                                     | Server response                                      | Client UX                                              |
| ---                                                       | ---                                                  | ---                                                    |
| `session_id` valid (< 30 min idle, < 12 h absolute)       | normal 200 OK                                        | seamless; no banner                                    |
| `session_id` expired, `refresh_token` valid (< 30 d family abs cap) | silent refresh succeeds → new cookies set     | "Syncing your offline progress…" toast for ~1 s        |
| `session_id` + `refresh_token` both expired (> 30 d offline) | `POST /api/auth/refresh` → 401 `session_expired` | non-modal banner: "Cloud sync paused. Sign in to sync your progress." |
| Family revoked by another device's "log out everywhere"   | refresh → 401 `session_revoked`                      | banner: "You were signed out. Please sign in again." (no security-alarming copy if it's the user's own action) |

### 10.2 No data loss guarantee

The local game state in IndexedDB is encrypted with
`deviceBackupKey = PBKDF2(accountSecret, deviceSalt, 600_000)`
per ADR-0005 §3, where the wrapped `accountSecret` lives on the
device. **Auth-token expiry never invalidates `deviceBackupKey`**;
the local progress is always re-openable until the user clears
site data or actively rotates `accountSecret` (which triggers
re-bootstrap on next login).

The outbox queue of pending offline actions (per ADR-0002 §8) is
held until reconnect; on reconnect, the silent-refresh path keeps
them queued in order. If the refresh fails (family expired or
revoked), the banner above appears and the user signs in; once
signed in, the queue replays normally per ADR-0011 hard-reject
semantics on stale commands.

### 10.3 Copy (DE / EN)

- DE: "Cloud-Sync pausiert. Melde dich an, um deine Offline-
  Fortschritte zu synchronisieren und Multiplayer fortzusetzen."
- EN: "Cloud sync paused. Sign in to sync your offline progress
  and resume multiplayer."

The banner is **non-modal** — the user can keep playing offline.
ADR-0002 §8 already locked the Sync / Activity view that shows
queued items pending sync.

## 11. Future-proof extension fields (provisioned now, unused at MVP)

To make post-MVP additions purely additive, the schemas in §4
and §9 already carry:

- **External IdP** — `sess.idp_provider`, `sess.idp_sub` (F2 §3.6).
  When social login lands, populated by the OAuth callback handler;
  null for all MVP sessions.
- **Organisation / team membership** — `sess.org_id`,
  `sess.org_roles`. Unused at MVP; reserved if/when B2B mode
  emerges.
- **Session purpose tag** — `sess.session_purpose`. Always `web`
  at MVP. Future values: `mobile-pwa` (when a native wrapper ships),
  `api-token` (when third-party API access ships), `share-link`
  (for spectator / public share links per ADR-0015).
- **Step-up claims with TTL** — `sess.mfa_satisfied_until`,
  `sess.password_reauth_until` already used at MVP for F2 §7
  step-up windows.
- **Device-binding hints** — `sess.bound_cred_id`,
  `sess.bound_cred_level` already populated at MVP for
  per-credential telemetry (which passkey was used).
- **DPoP / sender-constrained tokens** (RFC 9449) — `sess.device_bound`
  + `sess.device_public_key_id` schemas reserved; not implemented
  at MVP, but the schema is in place so a future agent can land
  RFC 9449 by writing a server-fn middleware without a migration.

## 12. TanStack Start integration patterns

These are the **idiomatic patterns** every future authed surface
must follow. A CI lint rule (F2 FU-2, F3 FU-1 below) enforces that
no `createServerFn` is used directly — only `createAuthedServerFn`.

### 12.1 `getSessionFromRequest` helper (server-only)

`apps/web/src/server/session.ts`:

```ts
import { parse } from 'cookie-es'
import { redis } from '@/server/redis'
import type { Request } from '@tanstack/start'

const SESSION_COOKIE = 'session_id'

export type SessionActor = {
  id: string
  email: string
  displayName: string
  locale: string
  roles: string[]
  mfaEnabled: boolean
  lastMfaAt: number | null
  lastCredentialedAt: number
}

export type Session = {
  id: string
  user_id: string
  device_id: string
  actor: SessionActor
  csrfToken: string
  createdAt: number
  lastSeenAt: number
  tokenVersionAtIssue: number
}

export async function getSessionFromRequest(req: Request): Promise<Session | null> {
  const cookies = parse(req.headers.get('cookie') ?? '')
  const sid = cookies[SESSION_COOKIE]
  if (!sid) return null
  const hash = await redis.hgetall(`sess:${sid}`)
  if (!hash || hash.revoked === '1') return null
  // Hybrid revocation: compare tokenVersion against user row.
  const userTokenVersion = await getUserTokenVersionCached(hash.user_id)
  if (Number(hash.token_version_at_issue) !== userTokenVersion) return null
  // Slide-on-activity (rate-limited Lua, §6.2).
  await slideSessionTtl(`sess:${sid}`, Date.now())
  return parseSession(sid, hash)
}
```

### 12.2 `createAuthedServerFn` higher-order wrapper

`apps/web/src/server/authed-server-fn.ts`:

```ts
import { createServerFn } from '@tanstack/start'
import { getSessionFromRequest } from './session'
import { authorize, ForbiddenError, type Action, type Resource } from './authorize'
import { z } from 'zod'

export function createAuthedServerFn<TInput extends z.ZodTypeAny, TOutput>(args: {
  action: Action
  inputSchema: TInput
  getResource: (input: z.infer<TInput>) => Resource
  stepUp?: 'mfa' | 'reauth' | null
  handler: (ctx: {
    actor: import('./session').SessionActor
    sessionId: string
    deviceId: string
    input: z.infer<TInput>
  }) => Promise<TOutput>
}) {
  return createServerFn({ method: 'POST' })
    .inputValidator(args.inputSchema.parse)
    .handler(async ({ request, data }) => {
      const session = await getSessionFromRequest(request)
      if (!session) return new Response('Unauthorized', { status: 401 })

      // CSRF: enforce header echo of the per-session csrfToken (F2 §5.4).
      const csrf = request.headers.get('x-csrf-token')
      if (!csrf || csrf !== session.csrfToken) {
        return new Response('Forbidden', { status: 403 })
      }
      const origin = request.headers.get('origin')
      const sec = request.headers.get('sec-fetch-site')
      if (origin && origin !== process.env.PUBLIC_ORIGIN) {
        return new Response('Forbidden', { status: 403 })
      }
      if (sec && sec !== 'same-origin' && sec !== 'same-site') {
        return new Response('Forbidden', { status: 403 })
      }

      // Step-up enforcement (F2 §7).
      if (args.stepUp === 'mfa') {
        const last = session.actor.lastMfaAt ?? 0
        if (Date.now() - last > 15 * 60_000) {
          return new Response(
            JSON.stringify({ error: 'step_up_required', method: 'mfa' }),
            { status: 403, headers: { 'content-type': 'application/json' } },
          )
        }
      }
      if (args.stepUp === 'reauth') {
        const last = session.actor.lastCredentialedAt
        if (Date.now() - last > 12 * 60 * 60_000) {
          return new Response(
            JSON.stringify({ error: 'reauth_required' }),
            { status: 403, headers: { 'content-type': 'application/json' } },
          )
        }
      }

      const resource = args.getResource(data)
      try {
        authorize(session.actor, args.action, resource)
      } catch (e) {
        if (e instanceof ForbiddenError) {
          return new Response('Forbidden', { status: 403 })
        }
        throw e
      }

      return args.handler({
        actor: session.actor,
        sessionId: session.id,
        deviceId: session.user_id, // populated in real impl
        input: data,
      })
    })
}
```

**CI lint** (F2 FU-2, owned now by F3 FU-1): Biome custom rule
that flags any `createServerFn` import outside this file. All
server functions go through `createAuthedServerFn`. Public
endpoints that genuinely need no auth (e.g. `/healthz`) live in
TanStack Start's API directory using a separate
`createPublicServerFn` wrapper that still checks Origin /
`Sec-Fetch-Site`.

### 12.3 Route guards (`beforeLoad`)

Route guards are a **UX optimisation** that prevents rendering
unauthorised pages; they MUST NOT be the only enforcement (data
mutations always pass through `createAuthedServerFn` server-side).

```ts
// apps/web/src/routes/_authed.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ context, location }) => {
    const session = await context.queryClient.fetchQuery(sessionQuery)
    if (!session) {
      throw redirect({ to: '/login', search: { redirectTo: location.pathname } })
    }
    return { session }
  },
})
```

All authed routes live under `_authed/` via TanStack Router's
nested-route convention; the parent guard runs once and provides
`session` via route context to children.

### 12.4 SSR hydration of auth state

The TanStack Start `Document` SSR template injects a minimal
serialised actor blob into the initial HTML (`window.__SOCCER_AUTH__ = {…}`)
which TanStack Store reads on mount. This avoids:

- a flash of unauthed content on first paint;
- an extra `/api/auth/me` round-trip after hydration.

The injected blob carries only public fields (`id`, `displayName`,
`locale`, `roles`, `mfaEnabled`); tokens never appear in HTML.

### 12.5 CSRF interceptor wiring

`apps/web/src/lib/fetch-csrf.ts` is the singleton client-side
fetch interceptor that:

- Reads the `csrf_token` cookie (not `HttpOnly`, by design per
  F2 §5.4) on every authed call.
- Adds `X-CSRF-Token: <value>` to every non-`GET` request.
- Refuses to send if the cookie is missing (forces a re-login).

TanStack Query's default fetcher is configured at app boot to use
this interceptor; server functions automatically inherit it via
TanStack Start's RPC layer.

### 12.6 Service-Worker bypass rules

`apps/web/src/sw.ts` (Workbox `injectManifest` per ADR-0002):

- **Network-first** for any HTML response whose request includes
  the `session_id` cookie — never serve cached authed HTML to a
  user whose session expired or to a different user on a shared
  device.
- **Cache-first** for static assets (immutable + content-hashed
  per ADR-0002).
- **Bypass cache entirely** for any `/api/auth/**` path (no
  caching of auth responses or cookies).
- SW MUST add the `X-Background: 1` header on automatically-
  triggered fetches (periodic sync, prefetch) so the §6 slider
  ignores them.

## 13. Operator emergency-revoke runbook

For an indie team with ~thousands of users on a single Hetzner
box, the F3 admin surface stays small:

### 13.1 Admin CLI (MVP)

A `pnpm session:revoke` script with subcommands:

```bash
# revoke a single session
pnpm session:revoke --session-id <opaque>
# revoke all sessions for a user
pnpm session:revoke --user-id <id> --reason "incident-2026-Q2-01"
# revoke all sessions of a device across all its families
pnpm session:revoke --device-id <id>
# lock an account (revoke + block future sign-in)
pnpm session:lock --user-id <id> --reason "spam-abuse-violation"
# unlock
pnpm session:unlock --user-id <id>
```

Every invocation:

1. Requires the operator to authenticate via SSH + a separate
   admin TOTP code (operators get their own short-lived
   `operator_session_id` per F11 secrets management runbook).
2. Emits the relevant outbox event with `actor_type=admin`,
   `actor_id=<operator-id>`, `trigger_source=admin_cli`,
   `reason_text=<arg>`.
3. Logs to the structured operations log per
   [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]].

### 13.2 Admin UI (post-MVP)

Deferred to F3 follow-up FU-5. At MVP the CLI is sufficient for an
indie team; the admin UI adds tabular session/device browsing +
revoke buttons + audit-log search.

## 14. Compliance map

### 14.1 OWASP ASVS v5.0 V7 (Sessions) + V8 (Authorization)

| ASVS ID            | F3 §          | Status |
| ---                | ---           | ---    |
| 7.1.1 unique session identifier | §4.1 `session_id` from CSPRNG     | ✔ |
| 7.1.2 sessions invalidated on logout | §8.1 row #1                  | ✔ |
| 7.1.3 idle timeout per risk level | §2 30 min                       | ✔ |
| 7.1.4 absolute timeout            | §2 12 h on session_id           | ✔ |
| 7.2.1 session ID changes on auth-state change | §5.3 rotation on every refresh | ✔ |
| 7.2.2 protected cookies (HttpOnly + Secure + SameSite) | F2 §5.1; F3 maintains | ✔ |
| 7.2.3 invalidate other sessions on credential change | §8.1 rows #4–#10 | ✔ |
| 7.2.4 audit log of session events  | §3.2 + §8.3 + ADR-0013         | ✔ |
| 7.3.1 reauthentication for sensitive ops | §12.2 step-up enforcement | ✔ |
| 7.4.1 server-side session state    | §3 Redis source of truth        | ✔ |
| 7.5.1 sliding session window safe  | §6 slide-on-meaningful-activity | ✔ |
| 8.1 authorize at server boundary   | §12.2 `createAuthedServerFn`    | ✔ |
| 8.2 deny-by-default at handler     | `authorize()` throws on no match| ✔ |

### 14.2 NIST SP 800-63B rev. 4 §7 (Session management)

- §7.1 session binding via the `session_id` cookie tied to the
  TLS channel (we rely on `Secure` + HTTPS-only; SSL/TLS-channel-
  binding via RFC 8471 is not deployed in modern browsers).
- §7.2 reauthentication at 12-h max + sensitive-op step-up at
  15 min.
- §7.3 logout terminates the session immediately (§8.1 row #1).

### 14.3 RFC 6819 / OAuth 2.1 draft

- §5.2.2 refresh-token replay → §5.4 strict reuse detection +
  family-revoke + outbox event.
- §5.2.3 refresh-token revocation interface — the
  `POST /api/auth/logout` endpoint + admin CLI both delete the
  `rtfam` and all `rt` keys atomically.
- OAuth 2.1 draft §4.13.2 bearer-token security → opaque tokens
  with Redis lookup satisfy the "introspection-required" model.

### 14.4 GDPR / EU residency cross-references

- **Storage limitation (Art. 5(1)(e))**: `ua_full` retained 180
  days; `rt` records 30 d + 7 d audit margin; `rtfam` 30 d + 90 d
  audit margin; outbox audit per ADR-0013 (60 d hot, monthly cold
  archive forever). F6 will refine per data category.
- **Data minimisation (Art. 5(1)(c))**: IP stored as `/24` (IPv4)
  or `/56` (IPv6); city-level country only; UA hashed for the
  hot store.
- **Integrity & confidentiality (Art. 32)**: Redis access via
  Unix socket on Hetzner private network only; AOF + RDB on
  encrypted volume; outbox encrypted at rest per ADR-0017.

## 15. Open decisions for Nico (Q&A)

### Q1. Rotation grace window — 15 s default

Confirm: 15-second grace where a duplicate presentation of a
*just-consumed* refresh token returns the same new token
idempotently. Outside the grace → family-revoke.

Alternative: strict (0 s) for security maximalism — risk: causes
spurious logouts on multi-tab races + network failures.

Default: **15 s** (aligns with Auth0 / Clerk / Stytch 2026 patterns).

### Q2. "Remember me" UX

Confirm: drop the explicit checkbox; default 30-day refresh per
device; expose a "Short session mode" toggle in Settings → Security
that lowers the per-device refresh family cap to 24 h.

Alternative: explicit unchecked-by-default checkbox at login.

Default: **drop checkbox, expose toggle**.

### Q3. Idle / absolute numerics

Confirm: 30 min idle, 12 h absolute on session_id, 30 d refresh
family absolute. Step-up MFA 15 min, full reauth 12 h (locked by
F2 §7).

Default: **as stated**.

### Q4. Server-Sent-Events push for "instant" cross-device revoke

Confirm: not at MVP. Cross-device revoke is enforced on next
request from the affected device (typically ≤ 1–2 s on active
tabs). Same-device tabs use `BroadcastChannel` + `localStorage`
sentinel — those are <1 s.

Alternative: ship a same-origin SSE channel post-auth so revoke
propagates instantly.

Default: **defer to F3 FU-2 (post-MVP)**.

### Q5. "Trust this device" 30-day MFA-skip flag

Confirm: opt-in only (unchecked by default after MFA), 30-day
hard cap with no rolling extension, anomaly signals
(new-country, impossible-travel) instantly downgrade trust.

Default: **as stated**.

### Q6. Device-revoke does NOT rotate `accountSecret` by default

Confirm: per F3 §9.5, clicking "Sign out from device X" revokes
the server-side session + refresh family, but does not rotate
`accountSecret`. A separate "Sign out everywhere AND rotate
security key" flow is available for known-compromise scenarios.

Rationale (Q4 research Option B): we cannot reliably wipe
already-downloaded IndexedDB on a potentially-compromised device
(Signal / 1Password / Bitwarden parity).

Default: **confirmed**.

### Q7. Admin emergency-revoke CLI vs admin UI at MVP

Confirm: CLI only at MVP (`pnpm session:revoke ...` family),
emits outbox events with `actor_type=admin`. Admin UI deferred
to FU-5.

Default: **confirmed**.

## 16. F3 follow-up tasks (deferred, not blocking)

| #    | Task                                                              | Owner gap |
| ---  | ---                                                               | ---       |
| FU-1 | Biome custom lint rule blocking direct `createServerFn` imports outside `createAuthedServerFn` | E10 + F3 (lint definition) |
| FU-2 | Same-origin SSE channel for instant cross-device revoke           | F3 post-MVP |
| FU-3 | Integration tests for the rotation Lua script (grace window, reuse detection, idempotency) | E11 |
| FU-4 | Cross-tab `BroadcastChannel` integration tests (Playwright multi-context) | E11 |
| FU-5 | Admin UI for session + device management + revoke controls       | F3 post-MVP |
| FU-6 | Redis persistence drill — restore from AOF + RDB into a fresh box | F11 |
| FU-7 | Stable account-master-key envelope (decouples accountSecret rotation from device-backup save key) | F5 |
| FU-8 | DSAR (data subject access request) export including `device`, `outbox auth.*` events | F6 |
| FU-9 | Per-endpoint quota numerics + edge WAF graduation when abuse appears | F12 |

## 17. Sources

### Standards

- OWASP ASVS v5.0 (V7 Sessions, V8 Authorization):
  <https://owasp.org/www-project-application-security-verification-standard/>
- OWASP Session Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>
- OWASP CSRF Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html>
- NIST SP 800-63B rev. 4 Digital Identity Guidelines §7 Session
  Management: <https://pages.nist.gov/800-63-3/sp800-63b.html>
- RFC 6265bis HTTP cookies:
  <https://datatracker.ietf.org/doc/draft-ietf-httpbis-rfc6265bis/>
- RFC 6749 + RFC 6819 OAuth 2.0 + Threat Model:
  <https://www.rfc-editor.org/rfc/rfc6819>
- RFC 7009 OAuth 2.0 Token Revocation:
  <https://www.rfc-editor.org/rfc/rfc7009>
- RFC 9126 OAuth 2.0 Pushed Authorization Requests (BCP-225):
  <https://www.rfc-editor.org/rfc/rfc9126>
- RFC 9449 OAuth 2.0 Demonstrating Proof of Possession (DPoP):
  <https://www.rfc-editor.org/rfc/rfc9449>
- W3C Fetch Metadata Request Headers:
  <https://www.w3.org/TR/fetch-metadata/>
- W3C BroadcastChannel:
  <https://html.spec.whatwg.org/multipage/web-messaging.html#broadcasting-to-other-browsing-contexts>
- W3C WebAuthn Level 3:
  <https://www.w3.org/TR/webauthn-3/>

### Libraries / vendors referenced

- Redis 7.4+ + AOF/RDB persistence:
  <https://redis.io/docs/latest/operate/persistence/>
- `ioredis` client (Lua scripting via `defineCommand` / SHA cache):
  <https://github.com/redis/ioredis>
- `cookie-es` (web-standard cookie parser):
  <https://github.com/unjs/cookie-es>
- Auth0 refresh-token rotation + reuse-detection patterns
  (industry reference for the 15-s grace window):
  <https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation>
- Lucia v3 session model (server-side session table primary
  pattern):
  <https://lucia-auth.com/>
- `@tanstack/start` server functions, route loaders, `beforeLoad`:
  <https://tanstack.com/start/latest/docs>

### Project-internal anchors

- [[auth-flows]] (F2) §5 cookie shape + token model;
  §7 step-up + sensitive-op catalogue; §11 Q&A on the F5
  envelope.
- [[../60-Research/threat-model]] (F1) §3 trust boundaries;
  §4.1 S1/S2; §4.6 E2; §7 control map.
- [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] §8
  outbox / sync activity view.
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] §3
  `deviceBackupKey` derivation.
- [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  server is the only authority for MP state.
- [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  audit-event delivery.
- [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  redaction deny-list, EU residency.
- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  Identity & Access bounded context.
- [[audit-trail]] catalogue of `auth.*` events.

### Perplexity research transcripts (this gap)

Six focused Perplexity-sonar-pro queries, 2026-05-18, total
~43 k tokens, ~$0.10 estimated:

1. Redis session record schema 2026 (key naming, hash vs JSON,
   secondary indexes, sliding TTL, hot/cold tier, future-proof
   extension fields, Lua scripts).
2. Refresh-token rotation with reuse detection 2026 (mark-consumed
   atomicity, concurrent refresh races, grace-window patterns,
   network-failure-during-rotation, idempotency, multi-tab race
   coordination, audit chain).
3. Idle / absolute session lifetimes 2026 (NIST + ASVS anchors,
   industry data Gmail / GitHub / Stripe / Bitwarden, offline-first
   reconnect UX, step-up enforcement layer, sliding-window edges,
   "Remember me", cross-tab sync).
4. Device list UX + data model 2026 (device definition, fields,
   "this device" identification, "trust this device" policy, per-
   device revoke + accountSecret semantics, cross-platform passkey
   linkage, schema).
5. Revocation runbook 2026 (15-trigger catalogue, `tokenVersion`
   vs family-revoke patterns, propagation latency, audit event
   shape, edge cases, operator runbook, soft-delete grace).
6. TanStack Start SSR + server-function session integration 2026
   (`getSessionFromRequest`, `createAuthedServerFn`, route
   guards, SSR hydration, CSRF interceptor, SW bypass).

Raw transcripts not committed (ephemeral); citations preserved
inline in §17 and per-section anchors above. If a future agent
needs to re-run them, the prompts live in this repo's PR history.
## Related

- [[auth-flows]]
- [[audit-trail]]
- [[observability-runbook]]
- [[../60-Research/threat-model]]
- [[../95-Archive/gap-reports/wave-3-gap-analysis]]
