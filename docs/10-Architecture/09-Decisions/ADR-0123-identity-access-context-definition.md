---
title: ADR-0123 Identity & Access Context Definition
status: accepted
tags: [adr, architecture, identity-access, ddd, auth, webauthn, passkeys, session, device, gdpr, security, fmx-163]
context: identity-access
created: 2026-06-15
updated: 2026-06-15
type: adr
binding: true
linear: FMX-163
amends:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0091-audit-security-context-definition]]
  - [[ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[ADR-0119-command-reception-dedup-seam]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/identity-access-context-definition-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-identity-access-ddd-boundary-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-identity-access-security-privacy-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-identity-access-game-platform-precedents-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-identity-access-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-163-identity-access-decision-queue-2026-06-15]]
  - [[../bounded-context-map]]
  - [[../../30-Implementation/auth-flows]]
  - [[../../30-Implementation/session-management]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# ADR-0123: Identity & Access Context Definition

## Status

accepted

Accepted 2026-06-15 by Nico for FMX-163. Decision queue:
[[../../40-Execution/fmx-163-identity-access-decision-queue-2026-06-15]].

This ADR amends ADR-0019, ADR-0089, ADR-0090, ADR-0091, ADR-0115 and
ADR-0119 by defining the previously thin Identity & Access context and its
public contract. It does not add code, packages, providers or schemas in the
docs-vault-only phase.

## Date

2026-06-15

## Context

Identity & Access already exists in the ratified Platform & Governance cluster,
but the bounded-context map only described it as "User, sessions, roles, device
state" exposing "Auth claims, membership context." Neighboring contexts now have
clearer contracts:

- Offline Sync owns client cache/draft/retry/rebase UX, not auth truth.
- Audit & Security owns tamper-evident retained evidence, replay/dedup and
  anomaly facts, not accounts or sessions.
- Community Overlay Pipeline owns content-pack import, manifest validation,
  IP/privacy gates and activation lifecycle.
- Commercial/monetization ADRs keep entitlements and payment legality outside
  Identity.

FMX needs Identity's side of those cuts: what it owns, what it publishes, and
what it explicitly refuses to absorb.

## Decision

### 1. Keep Identity & Access narrow

Identity & Access owns the product's platform principal and authentication
surface:

- `Account` and account status;
- `Credential` records, including passkey/WebAuthn credentials and password
  fallback credentials;
- `Session` and refresh/session lifecycle;
- `DeviceRegistration` and device trust/revocation state;
- global roles and global claims;
- principal/claims snapshots;
- account deletion/recovery lifecycle initiation;
- auth/security identity events emitted to downstream contexts.

Identity & Access does not own:

- save, club, watch-party, league, community or multiplayer membership
  semantics;
- domain command authorization and aggregate validation;
- payments, SKUs, refunds, purchases, subscriptions or entitlement accounting;
- age-assurance/rating evidence policy;
- audit-log retention, tamper evidence, replay/dedup or anomaly investigation;
- Offline Sync queues, retry/backoff, conflict presentation or rebase UX;
- Community Overlay pack registry, import-session FSM, IP/privacy gate or
  content moderation;
- manager persona, player/staff/persona substrate or in-world actor identity.

The receiving domain context consumes Identity's principal snapshot and still
decides its own command legality.

### 2. Adopt passkey-first plus password fallback as the boundary posture

The target authentication posture is:

- passkey/WebAuthn first;
- password fallback retained;
- step-up authentication for sensitive account/security ceremonies;
- OAuth/OIDC-compatible contracts without selecting a provider here.

Passkeys are used for login, recovery/device-linking, step-up and other
high-value account ceremonies. ADR-0115 remains unchanged: normal gameplay
command signing uses app-managed/device Ed25519 evidence, not passkey private
keys.

### 3. Publish opaque IDs and claims snapshots

Identity & Access exposes opaque identifiers and snapshots, never its internal
credential/session tables:

- `AccountId`;
- `SessionId`;
- `DeviceId`;
- `CredentialId`;
- `GlobalRoleAssignmentId`;
- `PrincipalContext`.

`PrincipalContext` is a point-in-time, JSON-serializable read model containing
only the fields other contexts need for authorization inputs:

- account id;
- account status relevant to command acceptance;
- authenticated session id and assurance/step-up markers;
- registered device id and revocation/trust markers;
- global roles/claims;
- optional external identity/provider subject markers after a future approved
  provider decision.

`PrincipalContext` is not a domain-membership object. Save, club, watch-party
and community permissions remain in their owning contexts.

### 4. Public contract

The future code contract should use the following published language.

Commands:

- `RegisterAccount`
- `ConfirmAccountEmail`
- `AddCredential`
- `RevokeCredential`
- `StartSession`
- `RefreshSession`
- `RevokeSession`
- `RevokeAllSessions`
- `RegisterDevice`
- `RevokeDevice`
- `AssignGlobalRole`
- `RevokeGlobalRole`
- `RequestAccountDeletion`
- `RestoreAccount`
- `PurgeAccount`
- `IssuePrincipalContext`

Events:

- `AccountRegistered`
- `AccountEmailConfirmed`
- `AccountStatusChanged`
- `CredentialAdded`
- `CredentialRevoked`
- `SessionStarted`
- `SessionRefreshed`
- `SessionRevoked`
- `AllSessionsRevoked`
- `DeviceRegistered`
- `DeviceRevoked`
- `GlobalRoleAssigned`
- `GlobalRoleRevoked`
- `PrincipalClaimsChanged`
- `AccountDeletionRequested`
- `AccountRestored`
- `AccountPurged`

Queries:

- `GetPrincipalContext`
- `GetAccountSecurityProfile`
- `GetActiveSessions`
- `GetRegisteredDevices`
- `GetGlobalRoleAssignments`
- `IsGlobalActionAuthorized`

`IsGlobalActionAuthorized` is limited to global/platform actions such as admin
tools, account ceremonies and platform security operations. Domain commands must
still call their own policies after consuming the principal context.

### 5. Boundary cuts

| Neighbor | Identity & Access publishes | Neighbor owns |
|---|---|---|
| Offline Sync | session/device validity, account-disabled and session/device-revoked facts | client queueing, retry/backoff, offline UX, `expectedVersion` conflict presentation and rebase |
| Audit & Security | auth/security identity events and principal/session/device identifiers | tamper-evident audit retention, replay/dedup, anomaly/abuse evidence, pseudonymization and retained security facts |
| Community Overlay Pipeline | account/principal identity and global platform claims if needed | pack registry, import-session lifecycle, manifest validation, IP/privacy safety gate and activation |
| Payments/Entitlements | account id and future entitlement-claim input point only | SKU/catalog, purchases, refunds, subscriptions, paid activation and entitlement accounting |
| Domain contexts | `PrincipalContext` and opaque account/session/device ids | business memberships, command authorization, aggregate validation and domain lifecycle |

### 6. GDPR erasure seam

Identity & Access owns account-deletion initiation and identity purge:

- revoke sessions and refresh families;
- revoke registered devices;
- burn credentials and direct identifiers per the current privacy-and-consent
  deletion flow;
- emit `AccountDeletionRequested`, `AccountRestored` and `AccountPurged`.

Audit & Security owns the retained-evidence response:

- pseudonymize retained security/audit facts;
- sever re-identification lookup material;
- keep tamper-evident records only where retention is justified;
- emit the audit-side pseudonymization fact.

Identity must not mutate or delete Audit & Security's archive directly.

### 7. Implementation-detail boundaries

The existing `auth-flows`, `session-management` and `privacy-and-consent` notes
remain implementation-detail/current-spec inputs beneath this ADR. FMX-163 does
not ratify:

- a concrete auth provider;
- a concrete OAuth/OIDC provider;
- an email provider;
- a payment/entitlement provider;
- package versions;
- database schemas;
- exact token/session/device retention numerics not already binding elsewhere.

Future code-phase work must re-check current official docs and exact package
versions before adding dependencies or providers.

## Options Considered

### D1 - context scope

| Option | Meaning | Assessment |
|---|---|---|
| A. Core I&A only | Account, credentials, sessions, devices, global roles/claims and auth/security identity events only. | **Accepted.** Keeps a clean Platform & Governance boundary and avoids cross-domain policy creep. |
| B. I&A plus domain memberships | Add save/watch-party/club/community memberships to Identity. | Rejected; those memberships are business/domain concepts with different lifecycles and invariants. |
| C. I&A plus entitlements and age gates | Add payments/entitlements and age-assurance outcomes to Identity. | Rejected; those policies have separate commercial/legal owners and existing decision queues. |

### D2 - auth posture

| Option | Meaning | Assessment |
|---|---|---|
| A. Passkey-first plus fallback | WebAuthn/passkeys first, password fallback, step-up for sensitive actions, OAuth/OIDC-compatible seam. | **Accepted.** Best fit for phishing-resistant security without closing recovery/provider options. |
| B. Password-first | Keep passwords primary. | Rejected; weaker posture and conflicts with current auth-flow direction. |
| C. Passkey-only | Remove password fallback. | Rejected for this phase; recovery and compatibility risk need implementation evidence first. |

### D3 - artifact status

| Option | Meaning | Assessment |
|---|---|---|
| A. Accepted ADR | Publish this as binding now after Nico approval. | **Accepted.** Boundary and posture decisions are approved. |
| B. Proposed ADR | Keep non-binding until implementation. | Rejected after HITL approval. |
| C. Research only | Save the evidence but defer the ADR. | Rejected; the issue asks to define the context and public contract. |

## Rationale

Identity & Access is a supporting platform context. It is load-bearing because
all authenticated commands depend on it, but it is not the owner of every
membership, payment, community or safety concept that happens to reference an
account.

The narrow cut preserves service readiness:

- domain contexts can evolve their membership and authorization rules without
  changing the account model;
- Audit & Security can retain and pseudonymize security evidence without giving
  Identity write ownership of the archive;
- Offline Sync can evolve command rebase and retry UX without pulling auth
  lifecycle into sync;
- Community Overlay and monetization remain legally distinct policy surfaces.

The passkey-first posture matches the current auth-flow direction and keeps
future OAuth/OIDC/provider work standards-compatible without selecting a vendor
too early.

## Consequences

Positive:

- Closes the last thin Platform & Governance context with an accepted public
  contract.
- Gives every future command path a clear source for principal/session/device
  identity.
- Keeps business membership and authorization local to the domain that owns the
  aggregate.
- Clarifies the GDPR erasure handoff between Identity and Audit & Security.

Costs / constraints:

- Domain contexts must build their own membership/authorization rules instead
  of delegating all business permissions to Identity.
- Future code phase needs explicit principal-context projections and contract
  tests.
- Provider/library/session numeric decisions remain follow-up gates and cannot
  be inferred from this ADR.

## Follow-ups

- Re-check and pin exact WebAuthn/auth/OAuth/email packages before code
  implementation.
- Define code-phase `PrincipalContext` schema, event schemas and contract tests.
- Re-check OWASP ASVS version wording in the security implementation notes.
- Resolve future monetization/entitlement and age-assurance decision queues
  before using those facts in Identity claims.
- Keep FMX-113 GroupMembership work as a domain/multiplayer membership slice,
  referenced by `AccountId` / principal context but not duplicated here.

## Related

- [[../../60-Research/identity-access-context-definition-2026-06-15]]
- [[../../40-Execution/fmx-163-identity-access-decision-queue-2026-06-15]]
- [[../bounded-context-map]]
- [[ADR-0019-modular-monolith-ddd]]
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
- [[ADR-0091-audit-security-context-definition]]
- [[ADR-0115-command-integrity-and-replay-protection-posture]]
- [[ADR-0119-command-reception-dedup-seam]]

