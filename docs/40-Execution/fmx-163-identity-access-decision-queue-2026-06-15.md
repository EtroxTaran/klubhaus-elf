---
title: FMX-163 Identity & Access Decision Queue
status: current
tags: [execution, decision-queue, identity-access, ddd, auth, security, gdpr, fmx-163]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: true
linear: FMX-163
related:
  - [[../60-Research/identity-access-context-definition-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-identity-access-ddd-boundary-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-identity-access-security-privacy-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-identity-access-game-platform-precedents-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-identity-access-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]
---

# FMX-163 Identity & Access Decision Queue

This is the HITL decision record for FMX-163. Nico accepted the recommended
packet on 2026-06-15 before implementation.

## D1 - context scope

| Option | Meaning | Assessment |
|---|---|---|
| **A. Core I&A only** | Identity & Access owns accounts, credentials, sessions, registered devices, global roles/claims and auth/security identity events. Save/group memberships, business authorization, payments/entitlements, age policy, audit storage, offline queues and community-pack lifecycle stay with their owning contexts. | **Recommended.** Matches ADR-0019 service-ready boundaries and keeps Identity from absorbing unrelated business languages. |
| B. I&A plus domain memberships | Identity also owns save, watch-party, club and group memberships. | Rejected for this beat. Membership semantics differ by domain and would make Identity a cross-domain policy sink. |
| C. I&A plus entitlements and age gates | Identity owns paid entitlement and age-assurance outcomes. | Rejected. Payment/entitlement and age/rating policies have separate legal/commercial owners and existing decision queues. |

**Decision:** Accepted A (Nico, 2026-06-15).

## D2 - authentication posture

| Option | Meaning | Assessment |
|---|---|---|
| **A. Passkey-first plus fallback** | Target WebAuthn/passkeys first, keep password fallback, require step-up for sensitive actions and keep OAuth/OIDC-compatible contracts without choosing a vendor now. | **Recommended.** Aligns current auth-flow direction with phishing-resistant best practice while preserving fallback/recovery and future provider neutrality. |
| B. Password-first | Password remains the main login path; passkeys are optional. | Rejected. It gives weaker phishing resistance and contradicts the existing passkey-first direction. |
| C. Passkey-only | No password fallback. | Rejected for this phase. Recovery, device availability and user-support trade-offs need more implementation evidence. |

**Decision:** Accepted A (Nico, 2026-06-15).

## D3 - artifact status

| Option | Meaning | Assessment |
|---|---|---|
| **A. Accepted ADR** | Record D1/D2 as accepted/binding context-definition ADR now; keep vendor, retention numerics, payment/age specifics and schemas as follow-ups. | **Recommended.** The boundary and posture decisions are approved and unblock future implementation planning. |
| B. Proposed ADR | Publish the packet but keep it non-binding. | Too weak after Nico's explicit approval. |
| C. Research only | Save research and defer the ADR. | Too weak; the issue explicitly asks to define the context and public contract. |

**Decision:** Accepted A (Nico, 2026-06-15).

## Decision Record

- 2026-06-15: Live triage checked Git, worktrees, open PRs and Linear.
- 2026-06-15: Nico selected FMX-163 from the shortlist.
- 2026-06-15: FMX-163 moved from `Backlog` to `In Progress`.
- 2026-06-15: Clean worktree/branch created:
  `codex/fmx-163-identity-access-context-contract`.
- 2026-06-15: Perplexity-first discovery captured for DDD/IAM, security/privacy
  and game/platform precedents.
- 2026-06-15: Official/current source checks captured for DDD, NIST, WebAuthn,
  GDPR, OAuth/OIDC, OWASP, SimpleWebAuthn, Steam and Discord.
- 2026-06-15: Nico accepted D1=A, D2=A, D3=A.

## Approved Packet

Accepted selection: **D1=A, D2=A, D3=A**.

No open Nico decision remains for the FMX-163 context-definition boundary.
Future code-phase implementation still needs separate source checks and HITL
where required for providers, exact package pins, retention numerics,
age/payment policy and schemas.

## Related

- [[../60-Research/identity-access-context-definition-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]

