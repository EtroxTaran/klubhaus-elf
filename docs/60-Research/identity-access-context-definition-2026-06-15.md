---
title: Identity & Access Context Definition
status: current
tags: [research, architecture, identity-access, ddd, bounded-context, auth, session, device, gdpr, fmx-163]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-163
related:
  - [[raw-perplexity/raw-identity-access-ddd-boundary-2026-06-15]]
  - [[raw-perplexity/raw-identity-access-security-privacy-2026-06-15]]
  - [[raw-perplexity/raw-identity-access-game-platform-precedents-2026-06-15]]
  - [[raw-perplexity/raw-identity-access-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]
  - [[../40-Execution/fmx-163-identity-access-decision-queue-2026-06-15]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../30-Implementation/auth-flows]]
  - [[../30-Implementation/session-management]]
  - [[../30-Implementation/privacy-and-consent]]
---

# Identity & Access Context Definition

FMX-163 closes the Identity & Access boundary gap in the Platform & Governance
cluster. The context already existed in the ratified bounded-context portfolio,
but it had only a one-line map row while its neighbors had explicit context
ADRs.

## Recommendation

Adopt a narrow, core Identity & Access bounded context:

| Decision | Accepted direction | Why |
|---|---|---|
| Context scope | Core I&A only | Keeps account/session/device/global-claim authority clear and prevents Identity from absorbing domain membership, payments, audit or community import policy. |
| Auth posture | Passkey-first plus password fallback | Aligns existing auth-flow direction with WebAuthn/NIST/OWASP-style phishing-resistant posture while preserving accessibility and recovery fallback. |
| Artifact status | Accepted/binding ADR | Nico already approved the decisive D1-D3 packet live for FMX-163; future implementation needs a stable owner contract. |

## Findings

### F1 - Identity should model the principal, not every human-facing role

The Identity & Access language is account, credential, session, device and
global claim. It is not the language of club managers, save participants,
commissioners, watch-party hosts, community pack authors or payment customers.

Those concepts may reference an Identity-owned `AccountId` or consume a
`PrincipalContext`, but their lifecycle belongs to their own bounded context.

### F2 - Domain authorization remains domain-owned

Identity & Access can answer whether a principal is authenticated, globally
disabled, device/session-valid or globally privileged. It must not decide
whether a transfer, fixture advance, save membership, watch-party action,
community pack activation or commercial action is legal.

The receiving domain context consumes the principal snapshot and then evaluates
its own aggregate/mode rules.

### F3 - Audit retention and erasure need a two-context seam

Identity & Access initiates account deletion, revokes sessions/devices, burns
credentials and emits terminal account lifecycle facts. Audit & Security owns
tamper-evident retained evidence, pseudonymization, retention tiering and the
final re-identification severing policy.

This matches ADR-0091 and the current privacy-and-consent deletion flow without
making Identity own the audit archive.

### F4 - Passkey-first is a boundary posture, not a provider decision

The accepted posture is passkey/WebAuthn first, password fallback, and step-up
for sensitive account/security ceremonies. FMX-163 does not select an auth
provider, email provider, OAuth/OIDC provider, package version or exact schema.

The existing `auth-flows` and `session-management` notes remain the
implementation-detail layer beneath the ADR.

### F5 - Game/platform precedents support separation

Official platform docs and social-platform permission models support the split:
global account identity is not the same as game save membership, social server
roles, content-package lifecycle or commercial entitlement ownership.

Public football-manager backend evidence is weak, so it is treated only as
analogy. The stronger precedent is the product architecture pattern shared by
game platforms and community services.

## Accepted Decision Inputs

Nico accepted these choices on 2026-06-15:

- D1=A: Core I&A only.
- D2=A: Passkey-first plus password fallback.
- D3=A: Accepted/binding ADR, with vendor, exact numerics and
  implementation schemas left to follow-up gates.

Full decision record:
[[../40-Execution/fmx-163-identity-access-decision-queue-2026-06-15]].

## Source Links

- Martin Fowler bounded context:
  `https://martinfowler.com/bliki/BoundedContext.html`
- W3C WebAuthn Level 3:
  `https://www.w3.org/TR/webauthn-3/`
- NIST SP 800-63B:
  `https://pages.nist.gov/800-63-4/sp800-63b.html`
- GDPR EUR-Lex:
  `https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng`
- OAuth 2.0 Security Best Current Practice:
  `https://datatracker.ietf.org/doc/rfc9700/`
- OpenID Connect Core:
  `https://openid.net/specs/openid-connect-core-1_0.html`
- Steamworks authentication and ownership:
  `https://partner.steamgames.com/doc/features/auth`
- Steam Workshop:
  `https://partner.steamgames.com/doc/features/workshop`
- Discord permissions:
  `https://discord.com/developers/docs/topics/permissions`

## Follow-Up

Future implementation must still define or re-check:

- exact session/token/device retention numerics where not already binding;
- exact WebAuthn/OAuth/provider/library versions and package pins;
- account recovery key-envelope details;
- age-assurance and paid activation gates;
- payment/entitlement mapping once monetization ADRs are ratified;
- code schemas and tests after the workspace exists.

## Related

- [[raw-perplexity/raw-identity-access-ddd-boundary-2026-06-15]]
- [[raw-perplexity/raw-identity-access-security-privacy-2026-06-15]]
- [[raw-perplexity/raw-identity-access-game-platform-precedents-2026-06-15]]
- [[raw-perplexity/raw-identity-access-source-checks-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]

