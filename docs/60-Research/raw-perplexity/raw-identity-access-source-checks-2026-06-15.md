---
title: Raw Identity & Access Source Checks
status: raw
tags: [research, raw, source-checks, identity-access, ddd, webauthn, passkeys, oauth, oidc, gdpr, steam, discord, fmx-163]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-163
related:
  - [[../identity-access-context-definition-2026-06-15]]
  - [[raw-identity-access-ddd-boundary-2026-06-15]]
  - [[raw-identity-access-security-privacy-2026-06-15]]
  - [[raw-identity-access-game-platform-precedents-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]
  - [[../../30-Implementation/auth-flows]]
  - [[../../30-Implementation/session-management]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Raw Identity & Access Source Checks

This note preserves the official/current source-check layer for FMX-163. Dates
matter: checked on 2026-06-15. Re-check all library/provider/version facts before
future code-phase implementation.

## Source-Check Table

| Topic | Source checked | Result used by FMX-163 |
|---|---|---|
| DDD bounded context theory | Martin Fowler, `https://martinfowler.com/bliki/BoundedContext.html`; Microsoft DDD overview, `https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design`; local [[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] | Identity & Access needs its own ubiquitous language and public contract; cross-context integration must use events/queries/commands, not shared internals. |
| FMX modular/storage invariant | [[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]], [[../../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]], [[../../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] | Public contract is JSON-serializable; storage is context-owned; cross-context references are opaque IDs and published read models. |
| WebAuthn/passkeys | W3C WebAuthn Level 3, `https://www.w3.org/TR/webauthn-3/`; current [[../../30-Implementation/auth-flows]] | Passkeys are appropriate for the auth posture; FMX-163 ratifies passkey-first plus password fallback as boundary posture, not exact ceremony schemas. |
| NIST auth/session posture | NIST SP 800-63B in the 800-63-4 set, `https://pages.nist.gov/800-63-4/sp800-63b.html`; current [[../../30-Implementation/session-management]] | Supports session binding, reauthentication/step-up and assurance-language alignment. Exact lifetimes remain in the existing session-management note and future implementation gates. |
| OAuth/OIDC vendor-neutral seam | OAuth 2.0 Security Best Current Practice RFC 9700, `https://datatracker.ietf.org/doc/rfc9700/`; OpenID Connect Core 1.0, `https://openid.net/specs/openid-connect-core-1_0.html`; current [[../../30-Implementation/auth-flows]] | Keep OAuth/OIDC compatibility through standard subject/claim language without selecting a provider in this ADR. Provider choice remains implementation/future decision. |
| GDPR Art. 17 and pseudonymization | GDPR EUR-Lex, `https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng`; current [[../../30-Implementation/privacy-and-consent]] | Identity owns deletion initiation/purge and emits terminal lifecycle facts; Audit & Security owns pseudonymized retained evidence and re-identification severing. |
| OWASP ASVS source conflict | OWASP ASVS project page, `https://owasp.org/www-project-application-security-verification-standard/`; OWASP ASVS GitHub latest release, `https://github.com/OWASP/ASVS/releases/latest` | FMX-163 cites OWASP only as general security-control family. The existing auth-flow note's ASVS-version wording is not re-ratified here and should be re-checked in a future security-doc currency pass. |
| SimpleWebAuthn package docs | Context7 `/masterkale/simplewebauthn` and `/websites/simplewebauthn_dev`; Context7 listed `v13.3.0` for `/masterkale/simplewebauthn` on 2026-06-15 | Existing auth-flow implementation note can continue to treat SimpleWebAuthn as an implementation input. FMX-163 adds no dependency and makes no package-pin decision. |
| Steam account/auth/ownership precedent | Steamworks User Authentication and Ownership docs, `https://partner.steamgames.com/doc/features/auth` | Useful platform precedent: account identity and app/DLC ownership checks are platform-owned facts consumed by games, not the same model as game-state membership. |
| Steam Workshop precedent | Steam Workshop docs, `https://partner.steamgames.com/doc/features/workshop` | Useful precedent for separate content-package lifecycle; supports keeping Community Overlay Pipeline outside Identity & Access. |
| Discord permission precedent | Discord Developer Docs permissions, `https://discord.com/developers/docs/topics/permissions` | Useful social-platform precedent: global users are distinct from per-server/member roles and permissions. FMX maps this to domain-owned save/watch-party/community membership rather than Identity-owned business roles. |

## Notes on Weak Evidence

- Public football/sports-management-game backend documentation was not strong
  enough to support an architectural decision. It is kept in
  [[raw-identity-access-game-platform-precedents-2026-06-15]] only as product
  analogy.
- Ref searches for SimpleWebAuthn/WebAuthn docs returned no useful results in
  this session. Context7 and primary W3C docs were used instead.
- No auth provider, email provider, OAuth provider, payment provider, database
  schema or package version is ratified by FMX-163.

## Dependency-Currency Caveat

Before code-phase implementation, the responsible issue must re-check official
docs, release notes/tags and package registries for all concrete libraries and
providers, then pin exact versions. If the latest stable version creates major
compatibility or migration complications, Nico must decide per the collaboration
protocol.

## Related

- [[../identity-access-context-definition-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]
- [[../../30-Implementation/auth-flows]]
- [[../../30-Implementation/session-management]]
- [[../../30-Implementation/privacy-and-consent]]

