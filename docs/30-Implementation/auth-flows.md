---
title: Auth Flows
status: current
tags: [implementation, auth, webauthn, passkeys, mfa, sessions, asvs, nist-800-63b]
created: 2026-05-18
updated: 2026-06-19
type: implementation
binding: true
adr:
  - "[[../10-Architecture/09-Decisions/ADR-0005-save-format]]"
  - "[[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]"
  - "[[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]"
  - "[[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]"
related:
  - "[[../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]]"
  - "[[../60-Research/threat-model]]"
  - "[[../60-Research/age-assurance-and-iarc-rating-2026-06-14]]"
  - "[[../40-Compliance/age-assurance-and-rating-evidence]]"
  - "[[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]"
  - "[[../95-Archive/gap-reports/wave-3-gap-analysis]]"
  - "[[../10-Architecture/bounded-context-map]]"
  - "[[audit-trail]]"
  - "[[observability-runbook]]"
---

# Auth Flows

This note resolves Wave 3 gap **F2** (Auth flows) and is the **binding
implementation specification** for sign-up, sign-in, MFA, account
recovery, session bootstrap, and the user-visible touch points of the
Identity & Access bounded context.

FMX-163 / [[../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]]
now owns the context boundary and public contract. This note remains the
implementation-detail flow/spec layer beneath that ADR.

F2 anchors on:

- [[../60-Research/threat-model]] §1.3 attacker tiers (T0–T4 in,
  T5–T6 partial, T7–T9 out), §3 trust boundaries, §4.1 Spoofing
  (S1–S4), §4.6 Elevation of Privilege (E1, E2) and §5 crypto.
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] §3
  (PBKDF2 from accountSecret + deviceSalt; portable export passphrase).
- [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  (server is the only authority for MP state; encrypted saves
  mandatory).
- [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  (self-hosted EU observability; PII redaction in telemetry).

Token format, refresh lifetime, idle timeout, device list, and
revocation runbook are **F3 Session Management** (open). F2 sets the
binding inputs F3 must satisfy; F3 fills the operational lifecycle.
Account-secret rotation crypto continuity is **F5 Account Recovery**
(open). F2 declares the user-visible recovery flows; F5 will land the
stable account-master-key envelope that decouples password rotation
from device-backup save decryptability.

## 1. Scope and stance

### 1.1 What F2 locks

- The full **set of user-facing auth flows** at MVP: sign-up, email
  verification, login, password reset, MFA enrolment, recovery-code
  generation, step-up auth on sensitive operations, account deletion
  trigger.
- The **credential model** (which factors exist and how they
  combine) and the **AAL2-equivalent** target per
  NIST SP 800-63B rev. 4.
- The **cookie + CSRF defence shape** F3 must implement (HttpOnly +
  Secure + SameSite, Origin / `Sec-Fetch-Site` enforcement, CSRF
  header model, refresh-token rotation with reuse detection).
- The **library choices** for WebAuthn + KDF + email + OIDC stub.
- The **ASVS v5.0 V6 mapping** and **NIST 800-63B AAL2** anchors.

### 1.2 What F2 does **not** lock

- Token format (opaque session ID vs JWT), refresh-token storage
  table layout, idle-timeout / absolute-timeout numerics, device-list
  UI, "log out everywhere" runbook — **F3 Session Management**.
- The **stable account-master-key envelope** that lets password
  rotation re-wrap the master save key without forcing re-encryption
  of every existing IndexedDB save — **F5 Account Recovery**. F2
  documents the intent and the public surface; F5 lands the wire
  format and migration.
- Edge WAF / DDoS posture, per-endpoint quota numerics for the
  whole product — **F12 Rate Limiting**. F2 locks the auth-pipeline
  quotas it needs to satisfy ASVS V6.
- GDPR data inventory + DPIA + consent UX — **F6 GDPR Compliance**.

### 1.3 Threats this spec mitigates

Cross-references into [[../60-Research/threat-model]]:

- **S1 Fake client / bot impersonates user** — passkey-first auth,
  Argon2id on password fallback, per-account progressive throttling,
  email verification.
- **S2 Session/token theft via XSS** — `HttpOnly + Secure` session
  cookies, no tokens in IndexedDB, refresh-token rotation with
  reuse detection, CSP `script-src 'self'` already locked.
- **S4 Phishing** — WebAuthn binds credential to RP ID (origin), no
  password to phish, reset links are short-lived and single-use.
- **E2 Authorization bypass** — every authed endpoint runs the
  centralised `authorize(actor, action, resource)`; F2 follow-up
  FU-2 escalates this into a CI lint rule.

Residual risks (deferred to ADR / FU): RR-1 compromised browser
(out-of-app), RR-6 browser extension with `<all_urls>` (out-of-app).
F2 does not change the F1 residual-risk acceptance.

## 2. Identity model

### 2.1 Account record (Identity & Access context)

The Identity & Access bounded context owns the platform-DB tables.
Drizzle is the single source of truth; these tables live in the `public`
schema as platform data ([[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
§1). Typed columns + `NOT NULL` + `CHECK` express the former ASSERT rules;
cross-table refs within this context are intra-context FKs on opaque branded
`uuid` columns (ADR-0027 §4–§6). IDs are app-generated UUIDv7, never
`gen_random_uuid()`.

```ts
// packages/db/src/schema/platform/identity.ts
export const user = pgTable('user', {
  id: uuid('id').$type<UserId>().primaryKey(),            // app-generated UUIDv7
  primaryEmail: text('primary_email').notNull(),
  primaryEmailLower: text('primary_email_lower').notNull(), // citext-style
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  displayName: text('display_name').notNull(),
  locale: text('locale').notNull(),                       // BCP-47, e.g. "de-DE"
  timezone: text('timezone').notNull(),                   // IANA, e.g. "Europe/Berlin"
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // soft delete; 30-day grace
}, (t) => ({
  displayNameLen: check('user_display_name_len', sql`char_length(${t.displayName}) <= 64`),
  primaryEmailLowerUq: uniqueIndex('user_primary_email_lower').on(t.primaryEmailLower),
}))

export const userCredential = pgTable('user_credential', {
  id: uuid('id').$type<UserCredentialId>().primaryKey(),
  userId: uuid('user_id').$type<UserId>().notNull().references(() => user.id), // intra-context FK
  kind: text('kind').notNull(),                           // see CHECK below
  payload: jsonb('payload').notNull(),                    // SCHEMALESS, kind-specific; Zod at boundary
  label: text('label'),                                   // user-visible nickname
  enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
}, (t) => ({
  kindCheck: check('user_credential_kind', sql`${t.kind} IN ('password','passkey','totp','recovery_code')`),
  byUser: index('user_credential_by_user').on(t.userId),
}))

// Future-proofing for F2 §3.6 social IdP linking (no rows at MVP).
export const userIdentity = pgTable('user_identity', {
  id: uuid('id').$type<UserIdentityId>().primaryKey(),
  userId: uuid('user_id').$type<UserId>().notNull().references(() => user.id),
  provider: text('provider').notNull(),                   // see CHECK below
  providerSubject: text('provider_subject').notNull(),
  providerEmail: text('provider_email'),
  providerEmailVerified: boolean('provider_email_verified'),
  linkedAt: timestamp('linked_at', { withTimezone: true }).notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
}, (t) => ({
  providerCheck: check('user_identity_provider', sql`${t.provider} IN ('google','apple','discord')`),
  providerSubjectUq: uniqueIndex('user_identity_provider_subject').on(t.provider, t.providerSubject),
}))
```

`user_credential.payload` shape per `kind`:

- `password`: `{ algo: 'argon2id', memMiB, timeCost, parallelism, salt: bytes(16), hash: bytes(32), version: 1 }`.
- `passkey`: WebAuthn credential record per
  [W3C WebAuthn-3] — `credentialId`, `publicKey` (COSE), `signCount`,
  `aaguid`, `attestationFormat`, `transports`, `backupEligible`,
  `backupState`, `uv` flag.
- `totp`: `{ algo: 'sha1' | 'sha256', digits: 6 | 8, period: 30, secret_wrapped: bytes }` —
  TOTP secret wrapped with the platform-DB column key per F1 §4.4-I2.
- `recovery_code`: `{ hash: bytes(32), algo: 'argon2id', params: {…} }`,
  one row per code. Plaintext shown to user once.

`accountSecret` rules (ADR-0005 §3 + F2):

- Generated server-side as 32 random bytes on first successful
  sign-up (after email verification).
- Stored in a dedicated platform-DB column **encrypted at the DB
  column level** with the deployment's at-rest key (sops-managed,
  per ADR-0017 + F11 secrets management).
- Delivered to a freshly-authenticated device exactly once per
  device, over TLS + authenticated session, via
  `GET /api/auth/account-secret/bootstrap` (§5.3). The client wraps
  it as a non-extractable `CryptoKey` and stores the wrapped blob +
  `deviceSalt` in IndexedDB per F1 §5.4.
- Rotated on: explicit password change, recovery-code use, "log out
  everywhere" from another device, or operator-initiated security
  event. **Until F5 lands the stable account-master-key envelope**,
  rotation will require existing devices to re-derive their
  device-backup key on next login (no save loss, only one extra
  reauth + bootstrap call). F5 will make rotation re-wrap a stable
  inner master key so devices keep their cached `deviceBackupKey`.

### 2.2 Credential composition at MVP

Each user has at least one **primary credential** plus optional
factors:

| Slot                         | Allowed values                              | Required |
| ---                          | ---                                         | ---      |
| Primary credential           | passkey **or** password                     | exactly one |
| Additional passkeys          | up to 10 per account                        | optional |
| Second factor                | TOTP **or** WebAuthn-as-MFA                 | optional, recommended |
| Recovery codes               | 10 single-use codes (see §6)                | mandatory once any MFA is enrolled; recommended otherwise |
| External identity provider   | Google / Apple / Discord                    | **deferred post-MVP** (§3.6) |

The product UX surface is **passkey-first**: every "Add credential"
button defaults to passkey enrolment with password as a clearly
secondary option. Rationale: phishing resistance (S4) + reduced
support load from forgotten passwords.

### 2.3 What "AAL2-equivalent" means here

NIST SP 800-63B rev. 4 §4 AAL2 requires *multi-factor* auth via two
distinct factor types. F2 reaches AAL2 in two ways:

- A user whose primary credential is a **passkey** (platform
  authenticator with user verification, e.g. Face ID, Touch ID,
  Windows Hello, Android biometric/PIN) already satisfies AAL2 in a
  single user gesture, because the WebAuthn credential is "something
  you have" + the platform UV is "something you are/know". This is
  the **default recommended path** in 2026 per FIDO Alliance.
- A user with **password + TOTP** also satisfies AAL2.

A user with **password only** is AAL1; F2 surfaces this in the UI as
"Add a second factor" and gates `sensitive-op` step-up on having an
AAL2-capable credential (see §7).

## 3. Sign-up flow

### 3.1 Decisions locked

- **Primary path**: passkey-first with password fallback.
- **Identifier**: email (case-insensitive, normalised via Unicode
  NFKC + lower-casing of the local part for storage; the original
  cased form is kept for display).
- **Email verification**: required before any **synced or
  multiplayer** action. Local-only ("guest") play remains available
  with no account at all per ADR-0002 capability matrix; once the
  user signs up, the inbox/sync surfaces stay disabled until the
  verification link is clicked.
- **Mandatory profile fields**: email, display name (1–64
  characters), locale (BCP-47, pre-filled from `Accept-Language`),
  timezone (IANA, pre-filled from `Intl.DateTimeFormat`).
- **Age gate**: accepted ADR-0112 binds the 16+ self-declaration from
  [[privacy-and-consent]] §3.2. It is shown before account fields and
  before any optional telemetry surface. "No" creates no account, no
  persisted refusal record and no optional telemetry trail.
- **Consent**: explicit, unchecked-by-default checkbox for the
  Terms + Privacy Policy links. **No** pre-ticked boxes (EDPB
  Guidelines on Deceptive Design Patterns 03/2022).
- **No external IdP at MVP** (§3.6).
- **No CAPTCHA at MVP**; rate-limit + email verification only (§8).

### 3.2 Sequence

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant B as PWA client
  participant S as Server (Identity & Access)
  participant E as Email provider

  U->>B: Open /signup
  B->>U: Show 16+ age question before account fields
  U->>B: Confirm 16+ or choose under-16 offline route
  B->>U: Show form (email, display name, locale, tz, consent)
  U->>B: Submit + accept Terms
  B->>S: POST /api/auth/signup {attestedAgeBand: "16+", email, displayName, locale, tz}
  S->>S: Rate-limit check (per IP + per email-domain, §8.3)
  S->>S: Reject if normalised email already used (generic message; §3.4)
  S->>S: Create pending user (email_verified_at = NULL)
  S->>S: Mint verify token (32 random bytes, store hashed, TTL 24h)
  S->>E: Send verification email (transactional, EU provider)
  S-->>B: 202 {state: "verify_email_sent"}
  B->>U: Show "Check your inbox" screen + resend link (rate-limited)
  U->>E: Open email
  U->>B: Click magic verification link
  B->>S: GET /api/auth/verify?token=<opaque>
  S->>S: Validate token (single-use, not expired)
  S->>S: Mark email_verified_at = now
  S->>S: Generate accountSecret (32 random bytes, stored encrypted)
  S->>S: Create session (HttpOnly cookies, §5.1)
  S->>S: Audit: emit "auth.signup_verified" outbox event (ADR-0013)
  S-->>B: 302 → /onboarding/credentials (logged in)
  B->>U: Prompt: "Add a passkey for quick sign-in?" (§3.3)
```

### 3.3 Credential enrolment immediately after verification

On the post-verification screen the user is offered, in order:

1. **Create a passkey** (primary, focus-by-default button). On
   click:
   - Browser calls `navigator.credentials.create({ publicKey })`
     with `authenticatorSelection.userVerification = 'required'`,
     `residentKey = 'preferred'`, `attestation = 'none'`,
     `pubKeyCredParams = [Ed25519, ES256, RS256]`, `rp.id` set to
     the canonical origin host.
   - On success: server verifies attestation via
     `@simplewebauthn/server` and writes a `user_credential` row of
     kind `passkey`.
   - Backup state flag (`backupEligible`, `backupState`) is stored
     so the UI can later warn "This passkey is device-bound and
     will not sync to your other devices" when applicable
     (Firefox, hardware keys, some enterprise policies).
2. **Set a password instead / as well** (secondary). On click:
   - Validate length ≥ 12 (NIST 800-63B §5.1.1.2; OWASP ASVS
     v5.0-6.2.3); no composition rules (v5.0-6.2.4).
   - Run HIBP k-anonymity check against the Pwned Passwords API
     (or the local Bloom-filter mirror; §10.4). Reject on
     non-zero match count with generic copy ("This password has
     appeared in known data breaches. Please choose a different
     one.").
   - Hash with **Argon2id** (parameters in §10.5).
   - Write `user_credential` row of kind `password`.
3. **Skip for now** (tertiary, link). Sets a deferred flag; user is
   pushed back to the credentials screen on next login until either
   passkey or password is enrolled.

Recovery-code generation is offered immediately after the **second**
credential is enrolled, or at first MFA enrolment (§6.1).

### 3.4 Anti-enumeration

The signup endpoint, the password-reset endpoint, and the login
endpoint MUST return **the same generic copy** regardless of whether
the email already exists, with timing bounded such that the
"email-exists" branch runs the same total wall-clock work as the
"new-email" branch (e.g. always enqueue a "tried to sign up with
existing email" *internal* job rather than skipping). ASVS
v5.0-6.2.8 + v5.0-6.3.8.

User-visible copy (DE / EN, parallel):

- DE: "Wir haben dir eine E-Mail geschickt. Bitte folge dem Link
  darin, um dein Konto zu aktivieren."
- EN: "We've sent you an email. Follow the link inside to activate
  your account."

If the address is already in use, the recipient's inbox receives a
**second, distinct** template: "Someone tried to create an account
with your email. If this was you, sign in instead. If it wasn't,
you can ignore this message" — no link.

### 3.5 ASVS v5.0 anchors

`v5.0.0-6.1.1` documented architecture · `v5.0.0-6.1.2` threat model
(F1) · `v5.0.0-6.1.3` centralised auth (Identity & Access context) ·
`v5.0.0-6.1.4` vetted crypto only · `v5.0.0-6.2.1`–`6.2.6` password
storage, length, breach check · `v5.0.0-6.3.1` enrolment proof of
control · `v5.0.0-6.3.2` rate-limited signup.

### 3.6 No external IdP at MVP (locked)

Google / Apple / Discord / Microsoft / GitHub / Meta / X sign-in
are **deferred to post-MVP**. Rationale (full reasoning in §11.5):

- GDPR Art. 5(1)(c) data minimisation conflicts with sending hashed
  email + IP + UA to a third-country IdP.
- Schrems II + EU-US Data Privacy Framework remains under legal
  pressure in 2026; a deferred decision keeps the privacy posture
  defensible.
- App Store §4.8 ("if you ship any social login, you must also
  ship Sign in with Apple") only binds wrapped iOS apps. As a
  pure PWA we are not bound today but would become bound the moment
  we add the first social login *and* an iOS App Store wrapper.
- Discord OAuth is the most attractive *user-experience* fit for
  friend-group MP but conflicts hardest with the privacy posture.

`user_identity` schema (§2.1) is provisioned now so post-MVP social
login is additive, not a migration. The auth-layer abstraction is
defined now (§10.6): an `ExternalIdentity` value-object that
`/api/auth/oauth/callback` will return, treated as a separate
credential kind. Linking will require an authenticated session +
step-up (§7).

## 4. Login flow

### 4.1 Decisions locked

- **Primary path**: passkey via WebAuthn **conditional UI** (autofill
  mediation) on browsers that support it (Chrome / Edge / Safari);
  explicit "Sign in with a passkey" button on browsers that do not
  (Firefox in 2026).
- **Fallback**: email + password, then optional MFA step.
- **No magic-link as login** at MVP. Magic links are reserved for
  email verification and password reset only. Magic-link login as a
  third option remains a post-MVP open question (§11.6).
- **MFA at login is opt-in**: a user who has enrolled TOTP or a
  second WebAuthn credential as MFA chooses at enrolment time
  whether to require the second factor on *every* login or only on
  step-up to sensitive operations. Default: step-up only (§7) —
  matches "passkey as a strong factor" framing, reduces friction.
- **MFA via SMS is not supported at MVP and not on the roadmap**
  (NIST 800-63B §5.1.3.3 restricted, ENISA recommends against).

### 4.2 Sequence (passkey primary)

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant B as PWA client
  participant S as Server

  U->>B: Open /login
  B->>S: GET /api/auth/passkey/options (no email needed for conditional UI)
  S-->>B: { challenge, rpId, allowCredentials: [] }
  B->>B: navigator.credentials.get({publicKey, mediation: "conditional"})
  Note over B: Autofill UI surfaces the user's passkey
  U->>B: Select passkey + biometric / PIN
  B->>S: POST /api/auth/passkey/assert { credential }
  S->>S: Verify assertion, signCount, RP ID, origin
  S->>S: Look up user by credentialId
  S->>S: Throttle check (§8.1)
  S->>S: Create session (§5)
  S->>S: Audit: emit "auth.login_passkey" outbox event
  S-->>B: Set-Cookie session_id, refresh_token; 200 { user, requiresAccountSecretBootstrap }
  B->>S: GET /api/auth/account-secret/bootstrap (§5.3)
  S-->>B: { wrappedAccountSecret, deviceSalt or hint to mint one, kdfParams }
  B->>B: Derive deviceBackupKey, unwrap accountSecret as non-extractable CryptoKey
  B->>U: Redirect to last-known route or /office-hub
```

### 4.3 Sequence (password fallback)

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant B as PWA client
  participant S as Server

  U->>B: Tap "Use a password instead"
  U->>B: Enter email + password
  B->>S: POST /api/auth/password/login { email, password }
  S->>S: Throttle check per-account + per-IP + per-/24 (§8.1)
  S->>S: Lookup credential, verify Argon2id hash (constant-time)
  alt MFA enrolled AND "require MFA at login" toggle on
    S-->>B: 200 { state: "mfa_required", methods: ["totp", "webauthn-mfa"] }
    U->>B: Provide TOTP code OR WebAuthn assertion
    B->>S: POST /api/auth/mfa/verify { method, payload }
    S->>S: Verify (TOTP ±1 step / WebAuthn assertion against MFA credential)
  end
  S->>S: Create session
  S-->>B: Set-Cookie session_id, refresh_token; 200 { user, requiresAccountSecretBootstrap }
  B->>S: GET /api/auth/account-secret/bootstrap
  S-->>B: { wrappedAccountSecret, deviceSalt, kdfParams }
  B->>B: Derive deviceBackupKey, unwrap accountSecret
```

### 4.4 Error handling

All login error responses return the **same** generic body
(`{ error: "auth_failed" }`) and HTTP `401` regardless of whether the
account exists, the password is wrong, the MFA is wrong, or the
account is throttled. The only exception is `429 Too Many Requests`
with a `Retry-After` header when the per-account or per-IP throttle
trips (§8). ASVS v5.0-6.2.8.

User-visible copy (DE / EN):

- DE: "Anmeldung nicht möglich. Bitte überprüfe deine Eingaben oder
  versuche es später erneut."
- EN: "We couldn't sign you in. Check your details or try again
  later."

### 4.5 Accessibility (WCAG 2.2 AA + BITV 2.0)

Inherited from ADR-0010 design system + [[../60-Research/onboarding-strategy]]:

- All login form fields have a visible `<label for>` (no placeholder
  as label).
- Primary submit button is the first focusable element after the
  last input on Tab order.
- All error messages live in a region with `aria-live="polite"` and
  are associated with their input via `aria-describedby`.
- Touch targets ≥ 44 × 44 px (WCAG 2.5.5).
- `prefers-reduced-motion` honoured on the WebAuthn loading state.
- Conditional UI passkey autofill is announced by the screen reader
  via the underlying platform credential picker; we do **not**
  override the autofill UI.
- Login flow MUST be completable with keyboard only (no
  pointer-only gestures, no time-limited dismissals per WCAG 2.2.1).

## 5. Session creation and accountSecret delivery

### 5.1 Cookie shape (binding constraint on F3)

F3 will own the in-depth lifecycle; F2 binds the *shape* below.
Refining the F1 §3 boundary table entry "HttpOnly + Secure +
SameSite=Lax cookies, token rotation on refresh":

| Cookie         | Purpose                              | HttpOnly | Secure | SameSite | Path             | TTL (default)      |
| ---            | ---                                  | ---      | ---    | ---      | ---              | ---                |
| `session_id`   | Opaque short-lived session reference | yes      | yes    | **Lax**  | `/`              | sliding ≤ 30 min   |
| `refresh_token`| Rotating refresh token (opaque)      | yes      | yes    | **Strict** | `/api/auth/refresh` | 30 days absolute (F3 may adjust) |
| `csrf_token`   | Double-submit CSRF token             | **no**   | yes    | Lax      | `/`              | ≤ 12 hours         |

Rationale:

- `SameSite=Lax` on the session cookie lets users deep-link into the
  app from email or chat without losing auth on `GET`, while still
  blocking cross-site `POST` (browsers have aligned on tightened Lax
  semantics by 2024–2025 per RFC 6265bis; Lax+POST exception is
  gone).
- `SameSite=Strict` on the refresh cookie is acceptable because the
  cookie is only consumed by the same-origin `POST /api/auth/refresh`
  XHR. The narrower `Path=/api/auth/refresh` further limits exposure.
- `Partitioned` (CHIPS) attribute is **not** set: this is a strictly
  same-origin first-party app.
- `csrf_token` is readable by JS (not HttpOnly) by design — its
  value is echoed to the server as `X-CSRF-Token` on every
  state-changing request (§5.4).

### 5.2 Token format (binding constraint on F3)

The session ID and refresh token are **opaque random identifiers**
(≥ 128 bits CSPRNG, URL-safe base64 encoded), looked up server-side
in Redis (with SurrealDB as the cold backing store via the outbox
pattern per ADR-0013). **Not JWTs.** Rationale:

- Instant revocation (delete the Redis key) without a parallel
  block-list.
- Tiny cookies, no algorithm-confusion footguns.
- We already run Redis for outbox fan-out + rate-limit counters
  (F1 §3, ADR-0013); incremental complexity ~ zero.

F3 will own: the Redis key schema, the refresh-token-family table,
the device-list UI, and the runbook for "log out everywhere".

### 5.3 accountSecret delivery — ordering and shape

The accountSecret never leaves the server in plaintext over an
unauthenticated connection. The flow is:

1. Client completes auth (passkey or password + optional MFA).
2. Server sets the `session_id` + `refresh_token` cookies and
   responds with `{ user, requiresAccountSecretBootstrap: bool }`.
3. If `requiresAccountSecretBootstrap === true` (always true on a
   *new device* for the account), the client calls
   `GET /api/auth/account-secret/bootstrap` with the freshly set
   session cookie. Response body:

   ```json
   {
     "accountSecret": "<base64-32-bytes>",
     "deviceSalt": "<base64-16-bytes>",
     "kdfParams": {
       "algo": "pbkdf2-sha256",
       "iterations": 600000,
       "keyLen": 256
     }
   }
   ```

   The `deviceSalt` is freshly minted by the server on first call
   for that `(user_id, device_id)` pair and persisted in the
   platform DB so subsequent bootstraps on the same device receive
   the same salt. `device_id` is a 128-bit client-generated random
   token persisted in IndexedDB the first time the client sees the
   user (per F1 §4.1 advisory).
4. The client immediately:
   - Derives `deviceBackupKey = PBKDF2(accountSecret, deviceSalt,
     600 000, 256)` per ADR-0005 §3 via Web Crypto `deriveKey` with
     `extractable: false`.
   - Wraps the raw `accountSecret` into a non-extractable `CryptoKey`
     by importing it as an AES-GCM key, then `crypto.subtle.wrapKey`
     under the `deviceBackupKey`. Stores the wrapped blob + the
     `deviceSalt` + `kdfParams` in IndexedDB under the
     `account_keystore` object store.
   - Zeroes the in-memory raw `accountSecret` buffer (`subtle.deriveKey`
     output is already a `CryptoKey`).
5. Subsequent app launches on the same device skip the bootstrap
   call: the client reads the wrapped blob from IndexedDB and
   unwraps to a non-extractable `CryptoKey` for use by the save
   format layer.

**Hard constraints**:

- The raw `accountSecret` byte array MUST never be written to
  IndexedDB or localStorage and MUST never be sent through any
  telemetry / log path (deny-list entry per F1 §4.4-I2 already
  includes `accountSecret`).
- The bootstrap endpoint MUST require a fresh authentication (≤ 5
  min since `last_credentialed_at`) when called on a *new* device —
  enforced by the step-up middleware (§7). On an already-known
  device the endpoint just re-issues the cached blob.

### 5.4 CSRF defence (layered)

F2 locks a **three-layer** CSRF defence, all three required for
state-changing endpoints:

1. **`SameSite` on cookies** — Lax on session, Strict on refresh
   (§5.1).
2. **`Origin` + `Sec-Fetch-Site` validation** at the edge of every
   authenticated `POST/PUT/PATCH/DELETE` handler. Accepted values:
   - `Sec-Fetch-Site ∈ {same-origin, same-site}` when the header is
     present.
   - `Origin === https://<canonical-origin>` when the header is
     present.
   - If both headers are missing (very old WebKit / iOS Safari < 16
     edge case): fall through to the CSRF token check below; do
     **not** auto-accept.
3. **Double-submit CSRF token** — the server sets `csrf_token` on
   the first response after auth; the client echoes the value in
   the `X-CSRF-Token` request header on every state-changing
   request. Mismatch ⇒ `403`.

The `csrf_token` value is **not** the session secret — it's a fresh
random per-session string. It's safe to be JS-readable because the
attacker cannot read it cross-origin (would need an XSS in our
origin, which F1 §4.6-E1 already addresses via strict CSP +
Trusted Types).

OWASP CSRF Cheat Sheet 2025 + ASVS v5.0 V4 / V7 anchor.

## 6. Recovery codes

### 6.1 Generation

- **Count**: 10 codes.
- **Format**: 16 base32 characters per code, grouped as
  `XXXX-XXXX-XXXX-XXXX`, ≈ 80 bits entropy each, generated with
  `crypto.randomBytes` server-side.
- **Display**: shown **once** in the UI after generation, on a
  dedicated screen with "Copy", "Download as .txt", "Print"
  buttons. The user must confirm storage by re-entering **one**
  randomly-selected code before the screen can be dismissed
  (Bitwarden-style anti-skip).
- **Storage**: each code stored hashed with Argon2id (same
  parameters as passwords, §10.5) in a `user_credential` row of
  kind `recovery_code`. Plaintext is never persisted.

### 6.2 Use

A recovery code can be presented at the login screen instead of a
password / passkey **only after** the user enters their email and
hits "I lost access to my second factor" (or "I lost my passkey").
On valid match:

1. The code's `user_credential` row is marked revoked (single-use).
2. Session is created as for normal login.
3. `accountSecret` is **rotated** — a new random 32-byte secret is
   generated and persisted; the bootstrap endpoint on next call
   returns the new secret, a new `deviceSalt`, and the new
   `kdfParams`. F5 will land the wrapping envelope that lets the
   client re-derive `deviceBackupKey` without re-encrypting every
   existing save row; until then the client logs a banner "We've
   updated your security key. Your saves are still encrypted with
   the previous key on this device until you sign in on a fresh
   device" — the on-disk saves remain readable with the old wrapped
   blob still in IndexedDB.
4. All existing sessions on other devices are revoked (refresh
   tokens family-revoked).
5. The user is notified by email + an in-app banner: "A recovery
   code was just used to sign in to your account from
   <approximate-location>. If this was not you, change your
   password and revoke devices now."
6. An outbox event `auth.recovery_code_used` is emitted (audit
   trail per ADR-0013).

### 6.3 Rotation, exhaustion, and "no account recovery" stance

- Users may regenerate the full set of 10 codes from Settings →
  Security at any time. Regeneration **requires step-up MFA** and
  invalidates all previously issued codes.
- When **≤ 2 codes remain unused**, the UI surfaces a non-modal
  banner offering regeneration on next sensitive action.
- If a user loses all of: their passkey(s), their password, **and**
  all recovery codes, we **cannot recover their account**. This is
  intentional and matches the privacy-first stance ("we cannot
  read your saves; the corollary is we cannot rescue them"). The
  Privacy Policy + Terms make this explicit; the sign-up consent
  screen surfaces a one-line restatement before the user accepts.
  Q&A item §11.4 confirms this stance.

ASVS anchor: `v5.0.0-6.3.9`–`6.3.11`; NIST 800-63B §6.1
(authenticator binding & loss).

## 7. Step-up authentication on sensitive operations

### 7.1 Sensitive operations (binding catalogue)

Step-up is required for these actions regardless of session age:

| Operation                                              | Triggered from                  | Step-up via                                 |
| ---                                                    | ---                             | ---                                         |
| Add or remove a passkey                                | Settings → Security             | existing MFA (passkey, TOTP, recovery code) |
| Add or remove TOTP                                     | Settings → Security             | existing MFA OR password                    |
| Change password                                        | Settings → Security             | existing password OR passkey                |
| Regenerate recovery codes                              | Settings → Security             | existing MFA                                |
| Change primary email                                   | Settings → Security             | existing MFA, then confirmation link to **both** old and new addresses |
| Export portable save (passphrase-encrypted file)       | Save list → … → Export portable | existing MFA                                |
| Import portable save into existing account             | Save list → Import              | existing MFA                                |
| Create or join a multiplayer group as host             | Multiplayer screen              | existing MFA (host only; joining is normal) |
| "Log out everywhere"                                   | Settings → Security             | existing MFA                                |
| Delete account                                         | Settings → Account              | existing MFA + 30-day grace period          |

### 7.2 Reauth windows

Two timers maintained in the session record:

- `last_credentialed_at` — last successful auth with the **primary**
  credential (password OR passkey).
- `last_mfa_at` — last successful auth with **any** factor that
  qualifies as MFA on this account.

| Window name          | Default | Used for                                                |
| ---                  | ---     | ---                                                     |
| `stepup_mfa_max_age` | 15 min  | All §7.1 entries marked MFA                             |
| `reauth_max_age`     | 12 h    | Re-prompt primary credential on any sensitive op older than this |
| `idle_timeout`       | 30 min  | Slide-extend session on activity; expire afterwards     |
| `absolute_timeout`   | 30 days | Absolute refresh-token TTL (F3 may tune)                |

When a sensitive op is requested and the relevant window has
expired, the server responds with `403 { error: "step_up_required",
method: "<which>" }`. The client opens the step-up modal and on
success retries the original request transparently.

### 7.3 NIST anchor

NIST SP 800-63B rev. 4 §7.2 reauthentication; ASVS v5.0 V6.4.3
(MFA protected by reauthentication).

## 8. Anti-abuse

### 8.1 Login throttling (Redis token-bucket)

Per-account (primary defense per NIST 800-63B §5.2.2 — throttling,
not lockout):

| Failures in last 60 min | Required delay before next attempt |
| ---                     | ---                                |
| 0–4                     | 0 s                                |
| 5–9                     | 2 s                                |
| 10–14                   | 10 s                               |
| 15–19                   | 30 s                               |
| 20–29                   | 2 min                              |
| 30–39                   | 10 min                             |
| 40–49                   | 30 min                             |
| ≥ 50                    | 1 h soft lock (auto-releases)      |

Per-IP token bucket: capacity 30, refill rate 30 / 5 min.

Per-CIDR token bucket: capacity 200 / 5 min on `/24` (IPv4) or `/56`
(IPv6).

The **per-account counter is primary**; IP and CIDR limits exist to
break drive-by credential-stuffing fan-out and are intentionally
loose to avoid collateral damage on NAT'd home networks. On a soft
lock, the user can still trigger password reset (separately
throttled per §8.2) and recovery-code login.

OWASP Authentication Cheat Sheet 2025 + NIST SP 800-63B §5.2.2.

### 8.2 Password reset throttling

| Counter                | Limit                  |
| ---                    | ---                    |
| Per email              | 3 / 15 min, 10 / 24 h  |
| Per IP                 | 10 / 15 min            |
| Per /24                | 100 / 15 min           |
| Outbound mail per email| 10 / 24 h hard         |

The endpoint **always** returns the same generic "if an account
exists with that email we sent a reset link" copy and a 200 status,
even when the per-email cap is hit (the email is suppressed but the
response shape stays the same). ASVS v5.0-6.3.8.

### 8.3 Signup abuse

| Counter        | Limit                |
| ---            | ---                  |
| Per IP         | 5 / 15 min, 50 / 24 h|
| Per /24 (or /56)| 100 / 15 min        |
| Per email      | 3 / 24 h             |

No CAPTCHA at MVP — relies on email verification + rate limiting.
If sustained abuse appears in logs (anomaly signal §8.5 #5), we
ship **self-hosted mCaptcha** as a stage-1 mitigation (Q&A §11.5);
stage-2 escalation to **Friendly Captcha** (EU-based managed
service) is only opened if mCaptcha proves insufficient. We do NOT
ship reCAPTCHA, hCaptcha, or Cloudflare Turnstile at any stage
(GDPR + EDPB posture — Q&A §11.5).

### 8.4 SMTP outbound

Transactional email (verification, reset, anomaly alerts) uses a
**managed EU-resident provider** with a signed DPA + SCCs at MVP
(Q&A §11.7 selects one of Brevo / Mailjet / IONOS). The provider is
treated as a Tier-A dependency per F1 §5.6. Hard quotas per address
(§8.2) prevent the provider from being used as a spam cannon.

### 8.5 Anomaly signals (binding starter set)

Each signal is an outbox event of type `auth.anomaly.*` emitted via
the audit trail; observability dashboards alert per the disposition
column.

| # | Signal                                           | Threshold                                     | Disposition          |
| - | ---                                              | ---                                           | ---                  |
| 1 | New device fingerprint for an account            | unknown `(device_id, UA-major)` after success | email user           |
| 2 | New approximate country for an account           | first login from country not in the user's known set | email user           |
| 3 | Impossible travel                                | two successful logins for same user from approx geos >3000 km apart within 1 h | force re-MFA + revoke other sessions + email |
| 4 | Account credential-stuffing pattern              | ≥ 5 failed logins in 5 min, no successful login from same IP | email user only if no immediate success |
| 5 | Password-reset storm                             | ≥ 5 reset requests / 30 min for same email from ≥ 3 IPs | suppress further sends 1 h + email user |
| 6 | Signup storm                                     | ≥ 10 signups in 5 min from same IP            | auto-enable mCaptcha for that IP / 1 h |
| 7 | Mass failure spike                               | global login fail rate > 5× rolling baseline   | page on-call (Grafana alert) |

For ~thousands of users, **no signal triggers an automatic
account-lock** at MVP — the F1 residual-risk RR-6 boundary holds:
endpoint security stays off-app.

## 9. Multi-device sign-in UX

### 9.1 Second device (same account, no portable export)

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant B as Browser on device B (new)
  participant S as Server

  U->>B: Open app on device B
  B->>U: Show login screen
  U->>B: Sign in (passkey OR password + MFA)
  B->>S: Standard login flow (§4)
  S-->>B: Set cookies + { requiresAccountSecretBootstrap: true }
  B->>S: GET /api/auth/account-secret/bootstrap
  S->>S: New (user_id, device_B) row → fresh deviceSalt
  S-->>B: { accountSecret (same as device A), deviceSalt_B, kdfParams }
  B->>B: Derive deviceBackupKey_B; wrap accountSecret; persist
  B->>U: Show home; offer "Sync from cloud" once F4 cloud sync ships
```

Until cloud sync ships (F4, post-MVP), the second device starts
with **no saves**. UX copy (DE / EN parallel) explains this:

- DE: "Dieses Gerät hat noch keine Spielstände. Du kannst auf
  deinem anderen Gerät einen portablen Export erstellen und ihn
  hier importieren, oder im Cloud-Sync (kommt später) deine
  Spielstände hierher synchronisieren."
- EN: "This device has no saves yet. To bring saves from another
  device, create a portable export on the other device and import
  it here, or wait for cloud sync."

### 9.2 Portable export → import (cross-device today)

Portable exports (per ADR-0005 §1 mode "portable_export") work
across devices and accounts. Import flow:

1. User taps "Import save" on device B.
2. **Step-up** to MFA (§7.1).
3. User picks `.smsave` file from the OS file picker.
4. Client decodes envelope, asks user for the export passphrase.
5. PBKDF2 + AES-GCM decrypt; on success create a new `save_registry`
   row + per-save DB, store the contents (cf. ADR-0005 §11).

Importing **does not** rotate the `accountSecret`. Portable exports
are an out-of-band key (the user's passphrase); they survive
password and accountSecret rotation by design.

### 9.3 "Log out everywhere"

In Settings → Security a user can revoke all other sessions and
optionally rotate the `accountSecret`. The defaults:

- "Log out everywhere except this device": revokes refresh-token
  families on all other `(user_id, device_id)` pairs; does **not**
  rotate the accountSecret. Use when a device is lost-but-not-
  compromised (recoverable phone).
- "Log out everywhere AND rotate security key": additionally
  rotates the accountSecret as in §6.2 step 3 — the F5 envelope
  will land before this gets full save-key continuity; without it,
  saves on other devices stop opening until the user signs back in
  there.

Both options require step-up MFA per §7.1.

## 10. Library + KDF + provider choices

### 10.1 WebAuthn

- **Server**: `@simplewebauthn/server` (panva-maintained, actively
  shipped through 2025). Handles attestation verification,
  challenge generation, sign-count tracking. Supports WebAuthn-3
  conditional mediation + resident credentials.
- **Browser**: `@simplewebauthn/browser` — thin typed wrapper over
  `navigator.credentials.*`. Bundle cost ~3–5 KB gzipped, well
  within D9 budgets.

Both packages are Tier-A dependencies per F1 §5.6.

### 10.2 Email verification + password reset tokens

- **Token format**: 32 random bytes from `crypto.randomBytes`,
  URL-safe base64, single-use, TTL 24 h (verify) / 15 min (reset).
- **Storage**: hashed (`HMAC-SHA256` with a deployment-scoped
  pepper) in Redis with TTL set to the token expiry. Plaintext
  never persisted. F5 will fold the pepper into the wider
  secret-rotation runbook.

### 10.3 Password hashing — Argon2id

> **Correction 2026-05-19 (ADR-0021 stack review).** The stack review's working
> premise that login used "PBKDF2-600k now, Argon2id later" was **factually
> wrong** — this spec already locked Argon2id for password storage (F1 §5.1).
> No supersede needed. Only refinement: library `argon2` (libsodium native,
> node-gyp build) → **`@node-rs/argon2`** (prebuilt Rust/NAPI binaries, no
> node-gyp/postinstall compile — smaller image, zero CI build pain, same
> Argon2id PHC output). Parameters are **retained**: 128 MiB / t=3 deliberately
> exceeds the OWASP-2026 floor (19 MiB / t=2) by latency calibration — do not
> weaken to the floor.

- **Library**: `@node-rs/argon2` (prebuilt Rust/NAPI Argon2id; no node-gyp).
  Rejected: `argon2` (libsodium native addon — node-gyp build pain in CI and
  container images for no security gain).
- **Parameters** at MVP (Hetzner CPX-class):
  - `type: argon2id`
  - `memoryCost: 128 MiB` (131 072 KiB)
  - `timeCost: 3`
  - `parallelism: 1`
  - 16-byte random salt per password
- Calibrated to ~150–250 ms per hash on the standard Hetzner shared
  vCPU; CI benchmark gate to be added in F11.
- Parameters versioned with the hash record so future re-hash on
  login is non-breaking.

Argon2id replaces PBKDF2 **only for password storage**. PBKDF2 stays
the KDF for the at-rest save format per ADR-0005 §3 (the input
there — `accountSecret` — is high-entropy random bytes, not a
user-chosen password, so PBKDF2 is appropriate). F1 §5.1 already
locked this distinction.

### 10.4 HIBP / breach checks

- **MVP**: live HIBP k-anonymity Pwned Passwords API call at
  signup + password change, with 24-hour Redis cache of prefix
  responses. Quarterly review of usage volume.
- **Fallback to local Bloom filter** if HIBP rate-limits us at scale
  or goes down — quarterly snapshot of the "top 10M" corpus,
  rebuilt into a Bloom filter (~12 MiB) and served from-memory at
  startup. F11 owns the rebuild runbook.

Privacy: only the first 5 hex chars of SHA-1 are sent; the full
password never leaves the server. Cited as the standard NIST
800-63B §5.1.1.2 mitigation in 2026.

### 10.5 TOTP

- **Algorithm**: HMAC-SHA-1, 6-digit code, 30-second period
  (RFC 6238 default, broadest authenticator-app compatibility).
- **Secret**: 160 bits (20 random bytes), generated server-side
  with `crypto.randomBytes`, encoded as base32.
- **Enrolment**: server returns the `otpauth://` URI + a QR-code
  PNG; the user enters one current code to confirm enrolment
  before the secret is persisted.
- **Verification**: ±1 time-step tolerance to handle clock skew;
  per-code single-use guard in Redis with the same TTL as the
  step window to defeat replay.
- **Storage**: TOTP secret encrypted at the platform-DB column
  level with the deployment's at-rest column key.

### 10.6 OAuth/OIDC stub (deferred but provisioned)

Even though no external IdP ships at MVP, the **interface** lives
in code from day one to keep the future surface honest:

```ts
interface ExternalIdentity {
  provider: 'google' | 'apple' | 'discord'
  subject: string                // provider 'sub' — never email
  email?: string
  emailVerified?: boolean
  rawIdToken?: string
}

interface OAuthProvider {
  readonly name: 'google' | 'apple' | 'discord'
  getAuthorizationUrl(state: string, nonce: string, pkce: string): string
  handleCallback(params: URLSearchParams): Promise<ExternalIdentity>
}
```

When a provider is enabled in the future (Q&A §11.5 follow-up), the
implementation is `openid-client` (panva-maintained Node OIDC lib)
with:

- Authorization code + **PKCE always** (RFC 7636).
- `state` for CSRF + `nonce` for ID-token replay protection.
- **Exact** redirect-URI match enforced server-side.
- No implicit flow, no password grant.
- Scopes ≤ `openid email` (GDPR data minimisation).
- Linking by `(provider, sub)` only, with email as **secondary**
  metadata; never link by email-equality alone (Apple relay
  alias edge case + Nobelium-style email-linking abuse).
- Linking is gated by step-up MFA per §7.1.

`passport.js` is **rejected** as a dependency: legacy callback-based
abstraction, large unmaintained strategy ecosystem, hard to audit.

### 10.7 Email provider

Transactional EU-resident provider with a signed DPA + SCCs, used
for verification + reset + anomaly alerts only. Q&A §11.7 selects
between Brevo (SendinBlue), Mailjet, and IONOS Hetzner-adjacent
options. The chosen provider is a Tier-A dependency.

## 11. Open decisions for Nico (Q&A)

These are the user-visible / one-way-door decisions F2 cannot close
without HITL input. Answers will be folded back into this note and
inherited by F3 / F5 / F6 / F12.

### Q1. Adopt the stable account-master-key envelope ahead of F5?

§5.3 / §6.2 / §9.3 reference an "F5 envelope" that decouples the
device-backup key from accountSecret rotation, so password change
or "log out everywhere AND rotate" doesn't invalidate the
encrypted blobs the user already has in IndexedDB. Two paths:

- **Option a (recommended)**: declare the envelope shape now in
  F2, but ship the actual write-through migration in F5. F2 keeps
  the "rotation works but old devices need one extra bootstrap"
  behaviour as documented; F5 lands the seamless continuity.
- **Option b**: defer the entire decision to F5; until then,
  rotation explicitly drops device caches and forces re-import or
  re-encryption.

Default: **a**.

### Q2. Email verification timing

Confirm the rule: local-only "guest" play needs no account at all;
**sign-up creates a pending account that cannot sync / join MP
until the verification link is clicked**, but the user can keep
playing locally during the verification wait.

Default: **as stated** (matches GDPR data-minimisation +
anti-bot posture).

### Q3. MFA mandatory or opt-in at MVP?

Default: **opt-in**, with mandatory step-up MFA on the §7.1
sensitive-op catalogue. A user with only a password gets a banner
on login: "Your account is protected by a single factor. Add a
passkey or an authenticator app for stronger protection."

Alternative: mandate MFA at signup for **all** accounts. Trades
~5–8 % drop-off (industry data 2025) for a stronger floor.

Default: **opt-in**.

### Q4. "Cannot recover" policy

Confirm: if a user loses passkey + password + all recovery codes,
we cannot recover the account. The Privacy Policy + sign-up
consent screen surface this explicitly. No support-mediated
identity proofing path exists.

Default: **confirmed**.

### Q5. CAPTCHA posture at MVP and stage-1 fallback

Confirm: **no** external CAPTCHA at MVP (no reCAPTCHA / hCaptcha /
Turnstile). If signup or login abuse appears (anomaly signal §8.5
#5/#6), stage-1 mitigation is **self-hosted mCaptcha** added behind
a feature flag. Stage-2 (only if mCaptcha proves insufficient) is
Friendly Captcha (EU-based managed). The decision matrix is in
§8.3.

Default: **confirmed**.

### Q6. SMTP outbound provider

Pick a managed EU-resident transactional email provider:

- **Brevo** (Sibyl → ex-Sendinblue, FR-based, ISO 27001, has
  EU-only data residency option). Default choice.
- **Mailjet** (FR-based, owned by Sinch). Comparable.
- **IONOS** (DE-based, smaller transactional API surface).
- **Self-hosted Postfix on Hetzner** (full residency, full ops
  burden; not recommended for an indie team at MVP).

Default: **Brevo**.

### Q7. Magic-link as a third login option

Currently F2 deliberately does **not** offer magic-link as a
login factor (only as the verification + reset mechanism). Some
users (passkey-shy, password-fatigued) prefer magic-link as the
day-to-day login. Adding it as a third option means another
phishing surface (S4 partial mitigation degrades) but reduces
"forgot my password" support traffic.

Default: **defer to post-MVP**; revisit after first 3 months of
operation if support traffic indicates demand. If yes, magic-link
becomes the **third** option behind passkey-conditional-UI and
password, with the same Redis throttling as password reset.

## 12. F2 follow-up tasks (deferred, not blocking)

| # | Task                                                              | Owner gap |
| - | ---                                                                | ---       |
| FU-1 | Stable account-master-key envelope wire format + migration       | F5        |
| FU-2 | CI lint rule: every endpoint handler calls `authorize(...)`      | E10 + F3  |
| FU-3 | Redis schema for refresh-token families + device list UI         | F3        |
| FU-4 | "Log out everywhere" runbook + admin trigger                     | F3        |
| FU-5 | Edge WAF + DDoS posture (Cloudflare / Bunny / mCaptcha graduate) | F12       |
| FU-6 | DSAR (data subject access request) export including auth_events | F6        |
| FU-7 | DPIA section on accountSecret + WebAuthn credential storage     | F6        |
| FU-8 | Step-up middleware integration tests + golden auth flows        | E11       |
| FU-9 | Cookie + CSRF integration tests under TanStack Start SSR        | E11 + F3  |

## 13. Compliance map

### 13.1 ASVS v5.0 V6 Authentication

| ASVS ID          | F2 §          | Status |
| ---              | ---           | ---    |
| 6.1.1 architecture documented | this note            | ✔ |
| 6.1.2 threat model            | [[../60-Research/threat-model]] | ✔ |
| 6.1.3 centralised auth        | Identity & Access context (ADR-0019) | ✔ |
| 6.1.4 vetted crypto           | §10 libraries + Web Crypto + Argon2id | ✔ |
| 6.2.1 strong KDF on passwords | §10.3 Argon2id                       | ✔ |
| 6.2.2 modern memory-hard params | §10.3                              | ✔ |
| 6.2.3 min length 12 chars     | §3.3                                  | ✔ |
| 6.2.4 no composition rules    | §3.3                                  | ✔ |
| 6.2.5 ≥ 64 char ceiling, full Unicode | §3.3                          | ✔ |
| 6.2.6 breach-list check       | §10.4                                 | ✔ |
| 6.2.7 no hints, no email of passwords | always                       | ✔ |
| 6.2.8 generic error messages  | §3.4, §4.4                            | ✔ |
| 6.3.1 enrolment ownership proof | §3 verification flow                | ✔ |
| 6.3.2 rate-limited signup     | §8.3                                  | ✔ |
| 6.3.3 reauth before password change | §7.1                            | ✔ |
| 6.3.4 invalidate other sessions on change | §6.2, §9.3                | ✔ |
| 6.3.5 out-of-band change notification | §6.2, §8.5                    | ✔ |
| 6.3.6 single-use time-limited reset token | §10.2                     | ✔ |
| 6.3.7 high-entropy reset tokens | §10.2                              | ✔ |
| 6.3.8 generic reset messaging | §8.2                                  | ✔ |
| 6.3.9 recovery as strong as enrolment | §6, §7.1                      | ✔ |
| 6.3.10 no static-secret recovery questions | §6 (codes only)         | ✔ |
| 6.3.11 log + notify recovery events | §6.2, §8.5                       | ✔ |
| 6.4.1 MFA supported           | §4, §7                                | ✔ |
| 6.4.2 MFA codes time-limited / single-use | §10.5                    | ✔ |
| 6.4.3 step-up on MFA changes  | §7.1                                  | ✔ |
| 6.4.4 TOTP secret ≥ 128 bits, one-time display | §10.5                | ✔ |
| 6.4.5 TOTP drift handling, no reuse | §10.5                            | ✔ |
| 6.4.6 WebAuthn for phishing-resistant MFA | §2.2, §10.1               | ✔ |
| 6.4.7 RP ID bound, no silent downgrade | §10.1                        | ✔ |
| 6.4.8 SMS treated as restricted (we don't ship SMS at all) | §4.1   | ✔ |

### 13.2 NIST SP 800-63B rev. 4 AAL2 anchors

- §4 AAL2 multi-factor requirement → passkey (UV) OR password + TOTP.
- §5.1.1.2 memorized secret rules → §3.3 (length, no composition,
  breach check).
- §5.1.3.3 SMS restricted → not shipped.
- §5.1.4 OTP authenticator → TOTP §10.5.
- §5.1.7 multi-factor cryptographic device → WebAuthn §10.1.
- §5.2.2 throttling (not lockout) → §8.1.
- §5.2.8 replay resistance → WebAuthn challenge, TOTP per-code use.
- §6.1 authenticator binding & loss → §6 recovery codes.
- §7.2 reauthentication → §7 step-up.

### 13.3 GDPR / EU-residency cross-references

- **Lawful basis** (Art. 6(1)(b) contract + 6(1)(f) legitimate
  interest for security signals) — F6 owns the full inventory.
- **Data minimisation** (Art. 5(1)(c)) → minimal sign-up PII (email,
  display name, locale, timezone) + no external IdP at MVP (§3.6).
- **Transparency** (Art. 13–14) → user-visible Privacy Policy +
  consent copy referenced from §3.1.
- **Integrity & confidentiality** (Art. 32) → Argon2id + WebAuthn
  + accountSecret column encryption + TLS 1.3 + HSTS preload.
- **Storage limitation** (Art. 5(1)(e)) → 30-day grace on account
  deletion + audit-trail retention from ADR-0013 (60 d hot, archive
  forever — F6 will refine per data category).
- All transactional email + observability stay EU-resident
  (ADR-0017).

## 14. Sources

### Standards

- OWASP Application Security Verification Standard v5.0:
  <https://owasp.org/www-project-application-security-verification-standard/>
- OWASP Authentication Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html>
- OWASP Password Storage Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
- OWASP Forgot Password Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html>
- OWASP CSRF Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html>
- OWASP Session Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>
- NIST SP 800-63B rev. 4 Digital Identity Guidelines –
  Authentication & Lifecycle Management:
  <https://pages.nist.gov/800-63-3/sp800-63b.html>
- W3C WebAuthn Level 3 Recommendation:
  <https://www.w3.org/TR/webauthn-3/>
- FIDO Alliance Passkey UX guidance:
  <https://fidoalliance.org/design-guidelines/>
- RFC 6238 TOTP: <https://www.rfc-editor.org/rfc/rfc6238>
- RFC 6265bis HTTP cookies:
  <https://datatracker.ietf.org/doc/draft-ietf-httpbis-rfc6265bis/>
- RFC 6749 + RFC 6819 OAuth 2.0 + Threat Model:
  <https://www.rfc-editor.org/rfc/rfc6819>
- RFC 7636 PKCE: <https://www.rfc-editor.org/rfc/rfc7636>
- RFC 8252 OAuth 2.0 for Native Apps:
  <https://www.rfc-editor.org/rfc/rfc8252>
- RFC 9126 OAuth 2.0 Pushed Authorization Requests:
  <https://www.rfc-editor.org/rfc/rfc9126>
- OAuth 2.1 working draft:
  <https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/>
- W3C Fetch Metadata Request Headers (`Sec-Fetch-*`):
  <https://www.w3.org/TR/fetch-metadata/>
- W3C Web Cryptography Level 2:
  <https://www.w3.org/TR/webcrypto-2/>
- EDPB Guidelines 03/2022 on Deceptive Design Patterns:
  <https://www.edpb.europa.eu/system/files/2023-02/edpb_03-2022_guidelines_on_deceptive_design_patterns_in_social_media_platform_interfaces_v2.0_en_0.pdf>

### Libraries / vendors referenced

- `@simplewebauthn/server` + `@simplewebauthn/browser`:
  <https://simplewebauthn.dev/>
- `openid-client` (panva):
  <https://github.com/panva/node-openid-client>
- `argon2` (libsodium-backed Node):
  <https://github.com/ranisalt/node-argon2>
- HaveIBeenPwned Pwned Passwords API:
  <https://haveibeenpwned.com/API/v3#PwnedPasswords>
- mCaptcha (self-hosted PoW):
  <https://mcaptcha.org/>
- Friendly Captcha (EU managed PoW):
  <https://friendlycaptcha.com/>
- Brevo / Mailjet / IONOS transactional email (EU residency).

### Project-internal anchors

- [[../60-Research/threat-model]] §1.3, §3, §4.1, §4.6, §5, §7 + Q&A.
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] §3 KDF,
  §10 lifecycle, §11 restore flow.
- [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  encryption mandate plus FMX-189 server-created MP lifecycle and SP/MP
  separation.
- [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  audit events `auth.signup_verified`, `auth.login_*`,
  `auth.recovery_code_used`, `auth.anomaly.*`.
- [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  redaction deny-list incl. `password`, `passphrase`, `accountSecret`,
  `Authorization`, `Cookie`.
- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  Identity & Access bounded context with strict storage isolation.
- [[../10-Architecture/bounded-context-map]] Identity & Access node.
- [[audit-trail]] outbox is the audit trail; F2 events listed there.
- [[../60-Research/onboarding-strategy]] D5 first-time UX surfaces
  the auth flows; accessibility patterns shared.

### Perplexity research transcripts (this gap)

Six focused Perplexity-sonar-pro queries, 2026-05-18, total
~42 k tokens, ~$0.10 estimated:

1. Passkey + WebAuthn state in 2026 across Chrome / Safari / Firefox
   / Edge; passkey-first vs password-fallback for an EU PWA where
   re-auth on new device is required to unlock saves; recommended
   Node + browser libraries; recovery patterns for device-bound
   passkeys; concrete per-platform day-1 sign-up flows.
2. ASVS v5.0 V6 L2 must-haves; NIST SP 800-63B rev. 4 AAL2 specifics
   (passwords, throttling, MFA, replay, phishing resistance); Node
   22 password storage choice + Argon2id 2026 parameters; HIBP
   integration; CAPTCHA / bot mitigation EU posture.
3. SameSite=Lax vs Strict 2026; CHIPS / partitioned cookies; refresh
   + access token storage in SSR app; rotation + replay-detection
   algorithm; opaque-ID + Redis vs JWT; CSRF in 2026; Sec-Fetch-Site
   / Origin enforcement.
4. Per-flow step-by-step (signup / login / reset / MFA / recovery /
   session creation / multi-device); accountSecret delivery
   ordering; sequence diagrams; copy and accessibility notes.
5. Google / Apple / Discord / GitHub / Microsoft / X social login
   stances for an indie EU app; OAuth 2.1 + PKCE + BCP-225;
   `openid-client` vs alternatives; account linking pitfalls
   (Microsoft Nobelium, Apple relay alias); schema + abstraction
   to keep social login a future plug-in.
6. Redis token-bucket login throttling; password-reset abuse
   mitigation; sign-up abuse + EU/GDPR CAPTCHA posture; step-up
   re-auth windows; anomaly signals; account lockout vs
   progressive throttling.

Raw transcripts not committed (ephemeral); citations preserved
inline in §14 and per-section anchors above. If a future agent
needs to re-run them, the prompts live in this repo's PR history.
