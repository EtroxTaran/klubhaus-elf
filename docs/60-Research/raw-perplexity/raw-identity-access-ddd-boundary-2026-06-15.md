---
title: Raw Identity & Access DDD Boundary Research
status: raw
tags: [research, raw, perplexity, identity-access, ddd, bounded-context, public-contract, fmx-163]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-163
related:
  - [[../identity-access-context-definition-2026-06-15]]
  - [[raw-identity-access-source-checks-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]]
  - [[../../40-Execution/fmx-163-identity-access-decision-queue-2026-06-15]]
  - [[../../10-Architecture/bounded-context-map]]
---

# Raw Identity & Access DDD Boundary Research

This note preserves the Perplexity-first discovery pass for FMX-163. It is raw
research input, not binding guidance. Official/current claims are checked in
[[raw-identity-access-source-checks-2026-06-15]] before use.

## Prompt

For a service-ready modular-monolith football manager PWA, research DDD best
practices for an Identity & Access bounded context. What should the context own
vs delegate? Include published language surface (commands/events/queries),
aggregate inventory, and boundary cuts with Audit & Security, Offline Sync,
Community Overlay, Payments/Entitlements, and domain memberships. Prefer current
authoritative or primary sources where available, and include citations/URLs.

## Discovery Summary

Perplexity recommended a small explicit Identity & Access context that owns the
product's principal identity and authentication/access language, while keeping
business memberships, commercial entitlements, sync mechanics, audit storage and
community content governance in their owning contexts.

Useful raw takeaways:

- Treat "account/principal" as the identity concept; do not let it become the
  whole person, manager persona, save participant or community actor model.
- Keep core aggregates narrow: account, credential, session, device
  registration, global role/claim assignment and recovery/request state.
- Publish JSON-serializable commands, events and queries. Consumers receive
  opaque identifiers and claims/projection snapshots rather than importing
  account internals.
- Let domains own business authorization and memberships. Identity can issue a
  principal/claims snapshot; the target domain still decides whether the action
  is legal for its aggregate and mode.
- Keep Audit & Security separate: Identity emits auth/security facts; Audit &
  Security owns tamper-evident retention, forensics, replay/dedup and anomaly
  evidence.
- Keep Offline Sync separate: it consumes session/device validity and revocation
  facts, but owns retry/rebase/offline UX.
- Keep Community Overlay separate: pack import, manifest validation, IP/privacy
  gates and moderation are not auth/account language.
- Keep Payments/Entitlements separate: purchases, SKU policy, refund state and
  entitlement accounting are commercial facts. Identity may consume a
  read-model/claim only after the owning context publishes it.

## Candidate Published Language

Perplexity proposed commands such as `RegisterAccount`, `ConfirmEmail`,
`StartLogin`, `VerifyMfaChallenge`, `RefreshSession`, `RevokeSession`,
`RegisterDevice`, `RevokeDevice`, `AssignGlobalRole`, `RevokeGlobalRole`,
`DisableAccount` and `RequestAccountDeletion`.

Candidate events included `AccountRegistered`, `CredentialAdded`,
`CredentialRevoked`, `SessionStarted`, `SessionRevoked`, `DeviceRegistered`,
`DeviceRevoked`, `GlobalRoleAssigned`, `GlobalRoleRevoked`,
`PrincipalClaimsChanged`, `AccountDeletionRequested` and `AccountPurged`.

Candidate queries included `GetPrincipalContext`, `GetAccountSecurityProfile`,
`GetActiveSessions`, `GetRegisteredDevices`, `GetGlobalRoleAssignments` and
`IsGlobalActionAuthorized`.

## Source-Quality Caveat

The Perplexity answer mixed primary and secondary DDD references. The synthesis
uses the DDD conclusion only after source-checking it against the local accepted
ADR-0019 storage/contract rules and current bounded-context references. It does
not use Perplexity's broader suggestion that Identity should own domain
membership assignments; FMX's accepted domain model keeps business membership
and command authorization in the owning domain contexts.

## Related

- [[../identity-access-context-definition-2026-06-15]]
- [[raw-identity-access-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]]

