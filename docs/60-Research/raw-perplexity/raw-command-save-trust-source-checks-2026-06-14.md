---
title: Raw Source Checks - Command Integrity and Save Trust
status: raw
tags: [research, raw, source-checks, webcrypto, webauthn, idempotency, save-trust, game-precedent, fmx-184]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-184
related:
  - [[../command-signing-save-trust-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
---

# Raw Source Checks - Command Integrity and Save Trust

## Capture metadata

- Captured: 2026-06-14
- Tools: Context7/MDN docs, web source checks, Ref/OWASP check, Exa game
  precedent search.
- Purpose: Correct and ground the Perplexity captures for FMX-184.
- Status: raw notes, not binding implementation guidance.

## MDN SubtleCrypto.sign

- Source: <https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign>
- Observation: MDN documents `SubtleCrypto.sign()` as available in secure
  contexts and web workers, and lists Ed25519 as a supported signing algorithm.
- Observation: MDN's Ed25519 example generates a key pair with
  `{ name: "Ed25519" }`, signs encoded data with the private key and verifies
  with the public key.
- FMX implication: Perplexity's "no WebCrypto Ed25519" claim is stale. Browser
  readiness still needs compatibility tests when code phase begins, but the
  current docs do not support treating Ed25519 as absent from WebCrypto.
- FMX implication: Ed25519 availability does not make browser-held client keys a
  strong anti-cheat primitive. It only changes feasibility for optional device
  provenance/signature evidence.

## MDN Web Authentication API

- Source: <https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API>
- Observation: MDN describes WebAuthn registration and authentication around
  server challenges. The browser asks the authenticator to sign a challenge via
  `navigator.credentials.get()`, then the server validates signature, challenge
  and relying-party ID.
- FMX implication: WebAuthn/passkeys are excellent for authentication or
  high-value confirmation ceremonies. They are not a silent background signing
  primitive for every offline manager command.

## Stripe API idempotent requests

- Source: <https://docs.stripe.com/api/idempotent_requests>
- Observation: Stripe uses idempotency keys so clients can safely retry create
  or update requests without performing the operation twice. The first result is
  saved for a key, later identical-key requests return the same result, and
  parameter mismatches are rejected.
- FMX implication: `commandId` as idempotency key plus parameter/payload
  comparison, expected aggregate version and processed-command storage is a
  standard and mature foundation for retry/replay protection.

## OWASP Password Storage Cheat Sheet

- Source: <https://owasp.org/www-project-cheat-sheets/cheatsheets/Password_Storage_Cheat_Sheet.html>
- Observation: OWASP recommends Argon2id for password-derived secrets with
  profiles such as 19 MiB memory, 2 iterations and 1 degree of parallelism, and
  keeps PBKDF2-HMAC-SHA-256 at 600,000 iterations for FIPS-style constraints.
- FMX implication: This supports existing ADR-0098's split KDF posture for
  save/export passphrases. FMX-184 should not reopen KDF policy except to keep
  save-trust metadata compatible with ADR-0005/ADR-0098.

## RFC 8032 EdDSA / Ed25519

- Source: <https://datatracker.ietf.org/doc/html/rfc8032>
- Observation: RFC 8032 defines EdDSA, including Ed25519.
- FMX implication: The algorithm is a standard digital-signature primitive, but
  algorithm standardization alone is not the same as a product decision to trust
  client-held browser keys.

## Paradox Ironman save eligibility

- Source: <https://support.paradoxplaza.com/hc/en-us/articles/360019443614-Ironman-save-no-longer-earn-achievements>
- Observation: Paradox support states that if an Ironman save is no longer
  achievement-eligible due to update, mods or corruption, eligibility cannot be
  restored and the player must start again.
- FMX implication: This is strong game-policy precedent for irreversible
  downgrade when a save's competitive/achievement provenance is broken.

## Minecraft achievements and modified worlds

- Source: <https://minecraft.wiki/w/Achievement> (secondary community wiki,
  captured through Exa search)
- Observation: Minecraft Wiki reports that some world settings, such as cheats
  or Creative mode in Bedrock contexts, permanently disable achievements for
  that world even if later disabled.
- FMX implication: This is secondary-source policy precedent only. It supports
  the user-facing rule that imported/debug/modified states remain playable but
  cannot silently regain public eligibility.

## Consolidated source-check conclusion

- Server authority plus idempotency/dedup/expected-version checks is the MVP
  command-integrity baseline.
- WebCrypto Ed25519 is a feasible browser primitive to investigate for optional
  device provenance, but not a reason to make client signatures authoritative.
- WebAuthn/passkeys should be limited to login and explicit high-value
  ceremonies, not background command signing.
- Save trust should be derived from evidence: server proof, command root,
  engine/content hash, import path and permanent downgrade flags.
- Public/competitive features should accept only server-verified histories.
