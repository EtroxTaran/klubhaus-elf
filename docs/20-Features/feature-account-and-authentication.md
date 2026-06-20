---
title: Feature - Identity & Access
status: draft
tags: [feature, identity-access, auth, passkeys, sessions, account-recovery]
context: identity-access
created: 2026-06-20
updated: 2026-06-20
type: feature
binding: false
related: [[README]], [[../00-Index/MVP-Scope]], [[../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]], [[../30-Implementation/auth-flows]], [[../30-Implementation/session-management]], [[../30-Implementation/account-recovery]], [[../30-Implementation/privacy-and-consent]], [[../30-Implementation/rate-limiting-anti-abuse]], [[../60-Research/threat-model]], [[../10-Architecture/bounded-context-map]]
---

# Feature - Identity & Access

## Goal

Give a player a single platform account they can create, secure, use
across devices, recover, and delete — without the product ever being
able to read or rescue their encrypted saves. The account is the
phishing-resistant front door to sync and multiplayer; **local "guest"
play needs no account at all** ([[../30-Implementation/auth-flows]] §3.1).

Scope is the player-facing account/auth surface only: sign-up + email
verification, passkey/password login + step-up, multi-device sign-in,
recovery codes, account recovery, session lifecycle, and account
deletion. The bounded-context boundary, public contract
(`PrincipalContext`, commands, events, queries), and what Identity &
Access explicitly does **not** own are fixed by
[[../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]].

> **Not in this feature.** In-game onboarding (pick-a-club, FTUE) is
> GDDR-owned game design, not account creation — it is a separate
> surface and is out of scope here. This spec covers the platform
> principal only.

## User stories

**Sign-up + email verification**

- As a logged-out player I can sign up with my email, display name,
  locale and timezone, and I am asked to confirm I'm 16+ **before** any
  account fields appear.
- As a new player I must accept the Terms + Privacy Policy via an
  explicit, unchecked-by-default checkbox before my account is created.
- As a new player I keep playing locally while I wait, but sync and
  multiplayer stay disabled until I click the verification link in my
  inbox.
- As someone whose email is already in use, I see the same generic
  "check your inbox" message (no account-enumeration leak) and instead
  receive a "someone tried to sign up with your email" notice.

**Credential set-up + login**

- As a newly verified player I am offered "Add a passkey for quick
  sign-in" first, with "set a password instead / as well" as a clear
  secondary option.
- As a returning player I can sign in with my passkey via the browser's
  autofill (conditional UI), or with email + password as a fallback.
- As a player I can add up to several passkeys and an optional second
  factor (authenticator-app TOTP or a second passkey).
- As a player who only has a password, I see a prompt encouraging me to
  add a stronger factor, but I am not forced to.

**Step-up on sensitive operations**

- As a signed-in player I am re-challenged (step-up) before security-
  sensitive actions like changing my password, adding/removing a
  passkey, regenerating recovery codes, changing my primary email,
  exporting a portable save, "log out everywhere", or deleting my
  account.

**Multi-device**

- As a player I can sign in on a second device and see my active
  devices listed, each with its sign-in method and last-seen info.
- As a player I can sign out a single device, or "log out everywhere",
  and optionally rotate my security key when a device is lost or
  stolen.

**Recovery codes + account recovery**

- As a player I am shown 10 single-use recovery codes once, and must
  confirm I saved them by re-entering one before I can continue.
- As a player who lost my passkey or second factor I can sign in with a
  recovery code, after which I receive a fresh set of codes and a
  security notification.
- As a player who forgot my password I can request a reset link by
  email; the link is short-lived and single-use.
- As a player I am told plainly, up front, that if I lose my
  passkey(s), password **and** all recovery codes, the account cannot
  be recovered — by design.

**Session lifecycle**

- As a player my session slides while I'm active and expires after a
  period of inactivity; I'm not silently logged out mid-action by a
  benign multi-tab refresh.
- As a player, if I'm signed out for security on one tab/device, my
  other tabs reflect that quickly without leaving me on a stale screen.
- As an offline player my local progress is never lost; when my session
  has lapsed I see a non-modal "sign in to sync" banner, not a wall.

**Account deletion**

- As a player I can request account deletion; sessions and devices are
  revoked immediately and a grace period runs before permanent purge.
- As a player within the grace window I can restore my account before
  it is purged.

## Post-MVP scope

These are provisioned in the implementation specs so they are additive,
not migrations, but ship after MVP:

- External identity providers (Google / Apple / Discord) via the
  reserved `user_identity` schema + `ExternalIdentity` seam
  ([[../30-Implementation/auth-flows]] §3.6, §10.6).
- Cloud sync of save data across devices (the auth-token reconnect
  surface is in scope; save-data sync is a separate feature).
- Magic-link as a third **login** option (verification + reset magic
  links are in MVP scope; login magic-link is not).
- Server-pushed instant cross-device logout (SSE/WebSocket); MVP relies
  on "on next request" revocation propagation
  ([[../30-Implementation/session-management]] §7.2).
- Portable-export passphrase UI and its Argon2id KEK
  (`envelopeVersion = 2`) ([[../30-Implementation/account-recovery]] §2.5, §4.7).
- B2B / organisation roles and API-token / share-link session purposes
  (schema fields reserved, unused at MVP).

## Out of release

- SMS-based MFA — not supported and not on the roadmap.
- Third-party CAPTCHA (reCAPTCHA / hCaptcha / Turnstile) at any stage;
  abuse escalation path is self-hosted mCaptcha then EU-managed
  Friendly Captcha if needed ([[../30-Implementation/auth-flows]] §8.3).
- Support-mediated identity-proofing recovery (no human "reset my
  account" path exists).
- Browser-fingerprint device identification (a client-generated
  `device_id` is used instead).

## Acceptance

Behavioural, Given/When/Then. Numeric windows/policies referenced below
are the **measurable gates already locked** in the implementation specs;
items that are not yet decided are listed under **Open decisions** and
must not be assumed here.

**Sign-up + verification**

1. **Given** a logged-out visitor on `/signup`, **When** the page
   loads, **Then** the 16+ self-declaration question is presented before
   any account fields, and answering "no" creates no account, no
   persisted refusal record and no optional telemetry trail
   ([[../30-Implementation/auth-flows]] §3.1; [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]).
2. **Given** a valid sign-up submission with the Terms checkbox
   explicitly ticked, **When** the player submits, **Then** a pending
   `user` row is created with `email_verified_at = NULL`, a hashed
   single-use verification token is minted, a verification email is
   sent, and the response is the generic "check your inbox" copy.
3. **Given** a sign-up for an email that already exists, **When** the
   player submits, **Then** the user-visible response is byte-identical
   to the new-email branch and the existing-email branch performs the
   same total wall-clock work (anti-enumeration), while the inbox owner
   receives the distinct "someone tried to sign up" template
   ([[../30-Implementation/auth-flows]] §3.4).
4. **Given** a valid, unexpired verification token, **When** the player
   clicks the link, **Then** `email_verified_at` is set, the account
   master key `K` + `Env_user` + recovery-code envelopes are
   provisioned, a session starts, and an `AccountEmailConfirmed` /
   `auth.signup_verified` event is emitted
   ([[../30-Implementation/account-recovery]] §2.6; ADR-0123 §4).
5. **Given** an unverified (pending) account, **When** the player
   attempts a sync or multiplayer action, **Then** that surface remains
   disabled while local play continues.

**Login + step-up**

6. **Given** a logged-out player with an enrolled passkey, **When** they
   complete a valid WebAuthn assertion (verified RP ID, origin and sign
   count), **Then** a session starts, the `session_id` + `refresh_token`
   cookies are set, a `SessionStarted` event is emitted, and a
   `PrincipalContext` is issued ([[../30-Implementation/auth-flows]] §4.2; ADR-0123 §3).
7. **Given** a player using the password fallback with MFA enrolled and
   "require MFA at login" on, **When** the password verifies, **Then**
   the server responds `mfa_required` and only starts the session after
   a valid second factor is presented.
8. **Given** any failed login (wrong password, wrong MFA, unknown
   account, throttled), **When** the attempt completes, **Then** the
   response body and HTTP status are identical across cases, except a
   throttle returns `429` with `Retry-After`
   ([[../30-Implementation/auth-flows]] §4.4).
9. **Given** repeated failed logins on one account, **When** the count
   crosses the locked per-account thresholds, **Then** progressive
   delays apply per the [[../30-Implementation/auth-flows]] §8.1 table
   (0–4 → 0s, 5–9 → 2s, …, ≥50 → 1h soft lock that auto-releases),
   while password-reset and recovery-code login remain available.
10. **Given** a signed-in session whose `last_mfa_at` is older than
    `stepup_mfa_max_age` (15 min), **When** the player requests a §7.1
    sensitive operation, **Then** the server returns
    `403 step_up_required` and proceeds only after a fresh factor
    ([[../30-Implementation/auth-flows]] §7.2; [[../30-Implementation/session-management]] §2).
11. **Given** a request to the `account-secret/bootstrap` endpoint on a
    *new* device, **When** the last credentialed auth is older than the
    fresh-auth window (≤ 5 min), **Then** the endpoint requires step-up
    before issuing the wrapped secret ([[../30-Implementation/auth-flows]] §5.3).

**Multi-device + sessions**

12. **Given** a player signing in on a second device, **When** auth
    completes, **Then** a distinct `device` row + `deviceSalt` is
    created, the same `accountSecret` is delivered wrapped, and the
    device appears in "Active devices" only after a full interactive
    auth ([[../30-Implementation/auth-flows]] §9.1; [[../30-Implementation/session-management]] §9.3).
13. **Given** an active session, **When** the player is meaningfully
    active, **Then** the session TTL slides (rate-limited to one write
    per 60 s) and expires after `session_id_idle` (30 min) /
    `session_id_absolute` (12 h); background SW/telemetry requests do
    **not** slide it ([[../30-Implementation/session-management]] §2, §6).
14. **Given** a just-consumed refresh token re-presented within
    `rotation_grace` (15 s), **When** the rotation endpoint runs, **Then**
    it returns the same new token idempotently; **When** the same token
    is re-presented after the grace, **Then** the whole family is revoked
    and `auth.refresh_reuse_detected` is emitted
    ([[../30-Implementation/session-management]] §5).
15. **Given** "log out everywhere", **When** confirmed with step-up,
    **Then** `user.token_version` is bumped and all other refresh
    families are revoked, and an `AllSessionsRevoked` event is emitted
    ([[../30-Implementation/session-management]] §8.1 row 2; ADR-0123 §4).
16. **Given** a session signed out elsewhere, **When** a sibling tab
    next acts, **Then** it receives `401 session_revoked`, broadcasts
    logout across tabs, and routes to `/login` preserving `redirectTo`
    ([[../30-Implementation/session-management]] §5.5, §7.1).

**Offline-first**

17. **Given** an offline player whose `session_id` expired but whose
    refresh token is still within the family absolute cap (30 d),
    **When** they reconnect, **Then** a silent refresh succeeds with a
    brief "syncing" toast and no data loss
    ([[../30-Implementation/session-management]] §10.1).
18. **Given** an offline player whose refresh family has expired,
    **When** they reconnect, **Then** a **non-modal** "sign in to sync"
    banner appears, local play continues, and `deviceBackupKey` /
    local saves remain decryptable throughout
    ([[../30-Implementation/session-management]] §10.2).

**Recovery codes + account recovery**

19. **Given** recovery-code generation, **When** the 10 codes are shown,
    **Then** they are displayed once, each stored only as an Argon2id
    hash plus an `Env_recovery_i` envelope, and the screen cannot be
    dismissed until the player re-enters one randomly-selected code
    ([[../30-Implementation/auth-flows]] §6.1; [[../30-Implementation/account-recovery]] §2.3).
20. **Given** a valid recovery code at the login screen, **When** it is
    used, **Then** that code is single-use-revoked, a session starts,
    `accountSecret` (and `userSalt`) rotate, a fresh code set is issued,
    all other sessions are revoked, and an email + in-app notification
    fire ([[../30-Implementation/auth-flows]] §6.2; [[../30-Implementation/account-recovery]] §6.3, §8.2).
21. **Given** a forgot-password request, **When** submitted (even for a
    non-existent or rate-capped email), **Then** the response is the
    same generic 200 "if an account exists we sent a link"
    ([[../30-Implementation/auth-flows]] §8.2).
22. **Given** a completed password reset, **When** the new password is
    set, **Then** `accountSecret` rotates, all sessions are revoked,
    but the existing recovery-code set is **not** regenerated
    ([[../30-Implementation/account-recovery]] §8.1).
23. **Given** a player who has lost passkey + password + all recovery
    codes, **When** they seek recovery, **Then** the UI states plainly
    that the account cannot be recovered (no support-mediated path), and
    offers a portable-export route only where one already exists
    ([[../30-Implementation/auth-flows]] §6.3; [[../30-Implementation/account-recovery]] §8.5).

**Account deletion**

24. **Given** an account-deletion request with step-up satisfied,
    **When** it is submitted, **Then** `deleted_at` is set, all sessions
    and refresh families are revoked, devices are revoked, and an
    `AccountDeletionRequested` event is emitted; the player sees a
    "deletion pending" state ([[../30-Implementation/session-management]] §8.1 row 12; ADR-0123 §6).
25. **Given** a deletion-pending account within the grace window,
    **When** the player restores it, **Then** the account returns to
    active and an `AccountRestored` event is emitted; **When** the grace
    window (`account_delete_grace`, 30 d) elapses, **Then** identifiers,
    credentials and all key envelopes are purged so `K` is provably
    unrecoverable, and `AccountPurged` is emitted
    ([[../30-Implementation/account-recovery]] §11.5; ADR-0123 §4, §6).

**Cross-cutting security gates**

26. **Given** any state-changing authenticated request, **When** it is
    handled, **Then** all three CSRF layers apply (SameSite cookies,
    Origin/`Sec-Fetch-Site` validation, double-submit `X-CSRF-Token`)
    and a missing/mismatched token yields `403`
    ([[../30-Implementation/auth-flows]] §5.4).
27. **Given** any authenticated server function, **When** it runs,
    **Then** it passes through the centralised
    `authorize(actor, action, resource)` check via the
    `createAuthedServerFn` wrapper ([[../30-Implementation/session-management]] §12.2).
28. **Given** any auth-lifecycle action, **When** it occurs, **Then** a
    corresponding `auth.*` outbox event is emitted for the audit trail
    with the redaction deny-list applied (no raw tokens, no
    `accountSecret`) ([[../30-Implementation/session-management]] §8.3).

## Dependencies

- [[../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]]
  — context boundary + public contract (commands/events/queries,
  `PrincipalContext`, GDPR erasure seam).
- [[../30-Implementation/auth-flows]] (F2) — binding sign-up, login,
  MFA, step-up, recovery-code, anti-abuse spec.
- [[../30-Implementation/session-management]] (F3) — binding session
  store, refresh rotation, lifetimes, device list, revocation matrix.
- [[../30-Implementation/account-recovery]] (F5) — binding master-key
  envelope, rotation algorithm, recovery flows, "cannot recover" cliff.
- [[../30-Implementation/privacy-and-consent]] — age gate + consent UX
  inputs.
- [[../30-Implementation/rate-limiting-anti-abuse]] — product-wide quota
  posture this feature's auth-pipeline limits sit within.
- [[../60-Research/threat-model]] — attacker tiers + spoofing/EoP
  threats this surface mitigates.
- [[../10-Architecture/bounded-context-map]] — neighbouring-context
  cuts (Offline Sync, Audit & Security, Payments, domain contexts).
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] — KDF +
  `accountSecret` + portable-export envelope this auth flow feeds.

## Open decisions

Items not yet ratified, or carrying an undecided fork in the
implementation specs. These must not be treated as fixed in this spec.

- **F2 Q3 — MFA mandatory vs opt-in at MVP.** Default in
  [[../30-Implementation/auth-flows]] §11 Q3 is *opt-in* (with
  mandatory step-up on the sensitive-op catalogue); the alternative is
  mandate-at-signup. Acceptance stories above assume the opt-in default
  but do not lock it.
- **F2 Q4 — "cannot recover" cliff confirmation.** Story 23 / criterion
  23 encode the no-support-recovery stance; F2 §11 Q4 still lists this
  as a HITL confirmation.
- **F2 Q1 / F5 — stable account-master-key envelope timing.** Whether
  the `Env_user` envelope continuity ships ahead of (or as) F5 affects
  the rotation UX in criteria 20/22 (pre-envelope rotation forces one
  extra device bootstrap). F5 defaults to the canonical `Env_user`;
  confirmation pending ([[../30-Implementation/auth-flows]] §11 Q1;
  [[../30-Implementation/account-recovery]] §13).
- **F5 Q2 — one-shot save re-encryption during F2→F5 migration.**
  Affects whether a legacy compatibility branch persists; default is
  one-shot re-encryption ([[../30-Implementation/account-recovery]] §13 Q2).
- **F5 Q3 — `userSalt` rotation on recovery-code use** (criterion 20
  assumes rotation per the §6.3 default; still a confirmation gate).
- **F5 Q4 — password reset rotates `accountSecret`** (criterion 22
  assumes rotation per the §8.1 default; still a confirmation gate).
- **F5 Q5 — recovery codes regenerated only on recovery-code use**
  (criteria 20 vs 22 encode this split; default per §13 Q5).
- **CAPTCHA / anti-abuse escalation.** No external CAPTCHA at MVP;
  staged mCaptcha → Friendly Captcha escalation is a default, not yet
  finally ratified ([[../30-Implementation/auth-flows]] §11 Q5).
- **Email provider selection.** EU-resident transactional provider not
  yet chosen ([[../30-Implementation/auth-flows]] §11 Q6).
- **Numerics not yet binding per ADR-0123 §7.** Exact token/session/
  device retention values "not already binding elsewhere", and final
  provider/library/package pins, remain follow-up gates. The lifetimes
  cited in the acceptance section are the values already locked in F2/F3
  (15 s rotation grace, 30 min idle, 12 h absolute, 30 d refresh, 30 d
  delete grace, 15 min step-up); any beyond those are not assumed.
- **"Trust this device" 30-day MFA-skip** policy
  ([[../30-Implementation/session-management]] §9.4) and **"Short
  session mode"** toggle (§2.2) are specced as defaults but are
  user-policy choices that may be tuned before code phase.