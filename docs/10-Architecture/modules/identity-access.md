---
title: Identity & Access module
status: draft
tags: [architecture, module, identity-access, auth]
context: identity-access
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0123-identity-access-context-definition]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../09-Decisions/ADR-0027-postgres-data-model]]
---

# Identity & Access Boundary

## Purpose

Narrow Platform & Governance context that owns the product's platform
principal and authentication surface, and publishes opaque identifiers,
`PrincipalContext` snapshots and auth/security identity events that other
contexts consume as authorization inputs (ADR-0123).

## Owns

- `Account` and account status.
- `Credential` records (passkey/WebAuthn credentials and password-fallback
  credentials).
- `Session` and refresh/session lifecycle.
- `DeviceRegistration` and device trust/revocation state.
- Global roles and global claims.
- Principal/claims snapshots (`PrincipalContext`).
- Account deletion/recovery lifecycle initiation and identity purge.
- Auth/security identity events emitted to downstream contexts.

Explicitly does **not** own: domain/business memberships (save, club,
watch-party, league, community, multiplayer), domain command authorization and
aggregate validation, payments/entitlements, age-assurance/rating policy,
audit-log retention/tamper-evidence/replay-dedup/anomaly evidence, Offline Sync
queues/retry/rebase UX, Community Overlay pack lifecycle, or in-world
actor/persona identity (ADR-0123 §1).

## Public contract

Opaque published identifiers (never internal credential/session tables):
`AccountId`, `SessionId`, `DeviceId`, `CredentialId`,
`GlobalRoleAssignmentId`, `PrincipalContext`.

Commands:

- `RegisterAccount`, `ConfirmAccountEmail`
- `AddCredential`, `RevokeCredential`
- `StartSession`, `RefreshSession`, `RevokeSession`, `RevokeAllSessions`
- `RegisterDevice`, `RevokeDevice`
- `AssignGlobalRole`, `RevokeGlobalRole`
- `RequestAccountDeletion`, `RestoreAccount`, `PurgeAccount`
- `IssuePrincipalContext`

Domain Events:

- `AccountRegistered`, `AccountEmailConfirmed`, `AccountStatusChanged`
- `CredentialAdded`, `CredentialRevoked`
- `SessionStarted`, `SessionRefreshed`, `SessionRevoked`, `AllSessionsRevoked`
- `DeviceRegistered`, `DeviceRevoked`
- `GlobalRoleAssigned`, `GlobalRoleRevoked`
- `PrincipalClaimsChanged`
- `AccountDeletionRequested`, `AccountRestored`, `AccountPurged`

Queries:

- `GetPrincipalContext`
- `GetAccountSecurityProfile`
- `GetActiveSessions`
- `GetRegisteredDevices`
- `GetGlobalRoleAssignments`
- `IsGlobalActionAuthorized` (limited to global/platform actions — admin tools,
  account ceremonies, platform security; domain commands still call their own
  policies after consuming the principal context)

## Storage ownership

- Owns its own private schema/tables for account, credential, session,
  registered-device and global-role/claim truth; no other context reads these
  tables directly (ADR-0121 no shared tables, ADR-0027 postgres data model).
- Cross-context access is only via the published opaque ids,
  `PrincipalContext` and events above — no cross-context joins into Identity
  storage.
- Concrete schema/table names, columns and migrations are deferred; FMX-163
  did not ratify database schemas (ADR-0123 §7).

## Consumers / Producers

Consumers of Identity outputs (ADR-0123 §5 boundary cuts):

- **Offline Sync** — consumes session/device validity, account-disabled and
  session/device-revoked facts.
- **Audit & Security** — consumes auth/security identity events and
  principal/session/device identifiers.
- **Community Overlay Pipeline** — consumes account/principal identity and
  global platform claims if needed.
- **Payments/Entitlements** — consumes account id and the future
  entitlement-claim input point only.
- **Domain contexts** — consume `PrincipalContext` and opaque
  account/session/device ids, then validate their own commands.

Producers it depends on: none for principal truth — Identity is the source for
account/session/device/role identity. (GDPR erasure is a handoff, not a
dependency: Identity initiates deletion/purge; Audit & Security owns the
retained-evidence pseudonymization response — ADR-0123 §6.)

## Invariants

- Identity stays narrow: it owns the platform principal and auth surface only,
  not domain memberships, business authorization, payments/entitlements,
  age-assurance, audit retention, Offline Sync UX or Community Overlay
  lifecycle (ADR-0123 §1).
- Only opaque ids, `PrincipalContext` and events cross the boundary; internal
  credential/session/device tables are never exposed (ADR-0123 §3).
- `PrincipalContext` is a point-in-time, JSON-serializable read model of
  authorization inputs only; it is **not** a domain-membership object.
- A receiving domain context consumes the principal snapshot and still decides
  its own command legality; `IsGlobalActionAuthorized` covers only
  global/platform actions.
- Auth posture is passkey/WebAuthn-first with password fallback and step-up for
  sensitive ceremonies; OAuth/OIDC-compatible contracts without a selected
  provider. Normal gameplay command signing stays on app/device Ed25519
  evidence per ADR-0115, not passkey private keys (ADR-0123 §2).
- No cross-context joins into Identity storage; integration is contract-only
  (ADR-0121).
- On GDPR erasure, Identity revokes sessions/refresh families and devices,
  burns credentials/direct identifiers and emits the lifecycle events; it must
  not mutate or delete Audit & Security's archive directly (ADR-0123 §6).

## Open items

Items the source (ADR-0123) explicitly defers and that this note therefore does
not pin down:

- Concrete database schema/table/column definitions and migrations.
- Concrete auth, OAuth/OIDC, email and payment/entitlement providers.
- Package/library selections and pinned versions.
- Exact token/session/device retention numerics not already binding elsewhere.
- Code-phase `PrincipalContext` field schema, event payload schemas and
  contract tests.

## Dependencies

- [[../09-Decisions/ADR-0123-identity-access-context-definition]] (context
  definition + public contract; draft phase — do not implement yet)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables / contract-only integration)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (data model)
- [[../bounded-context-map]] and [[../05-Building-Blocks]] (context authority and
  cluster placement)
