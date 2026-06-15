---
title: Raw Identity & Access Security and Privacy Research
status: raw
tags: [research, raw, perplexity, identity-access, security, privacy, webauthn, passkeys, gdpr, session, fmx-163]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-163
related:
  - [[../identity-access-context-definition-2026-06-15]]
  - [[raw-identity-access-source-checks-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]
  - [[../../30-Implementation/auth-flows]]
  - [[../../30-Implementation/session-management]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Raw Identity & Access Security and Privacy Research

This note preserves the Perplexity-first discovery pass for FMX-163 security
and privacy. It is raw research input. Primary/official checks are preserved in
[[raw-identity-access-source-checks-2026-06-15]].

## Prompt

Research real-world security/privacy best practices for Identity & Access in an
EU/Germany online game/PWA context. Cover passkey-first plus password fallback,
WebAuthn/FIDO, OAuth/OIDC compatibility without vendor selection, NIST/OWASP
session lifecycle, GDPR Art. 17 erasure and pseudonymized audit retention seam,
device records, and step-up authentication. Include citations/URLs to primary or
official sources.

## Discovery Summary

Perplexity recommended the same posture Nico selected for this beat:
passkey-first authentication with password fallback, step-up for sensitive
actions and standards-compatible OAuth/OIDC seams without choosing a provider in
the context-definition ADR.

Useful raw takeaways:

- Use an opaque stable account/principal ID as the internal identifier. Keep
  direct identifiers such as email separate from credentials and from audit
  archives where possible.
- Store WebAuthn/passkey credentials as public-key credential metadata, with
  password fallback hardened by breach checks, rate limiting and MFA/step-up for
  sensitive actions.
- Keep OAuth/OIDC compatibility at the contract level: future provider linking
  uses stable provider subject identifiers, not provider email as identity.
- Session/device control is part of Identity & Access: active sessions, refresh
  lifecycle, registered devices, trusted-device state and revocation state.
- Step-up auth should be required for sensitive actions such as credential
  changes, account deletion, session/device revocation, payment/entitlement
  account ceremonies and privileged admin actions.
- GDPR Art. 17 erasure needs a seam between Identity and Audit & Security:
  Identity initiates deletion/purge and burns direct identifiers/credentials;
  Audit & Security pseudonymizes retained security evidence and severs
  re-identification where retention is justified.

## Source-Quality Caveat

Perplexity's EU digital identity citations included several non-primary sources.
The synthesis uses only claims that were source-checked against NIST, W3C,
EUR-Lex/GDPR, OAuth/OIDC, OWASP, current FMX auth/session/privacy notes and the
Context7 SimpleWebAuthn documentation index.

## Related

- [[../identity-access-context-definition-2026-06-15]]
- [[raw-identity-access-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]

