---
title: Raw Perplexity - Hybrid Ed25519 Command Evidence
status: raw
tags: [research, raw, perplexity, security, command-signing, ed25519, webcrypto, pwa, fmx-184]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-184
related:
  - [[../command-signing-save-trust-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
  - [[../../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
---

# Raw Perplexity - Hybrid Ed25519 Command Evidence

## Capture metadata

- Captured: 2026-06-14
- Tool: Perplexity Sonar via MCP
- Purpose: FMX-184 follow-up after Nico selected a hybrid posture:
  server-authoritative command acceptance plus mandatory app-managed Ed25519
  signature evidence in the MVP command envelope.
- Handling: Punctuation normalized to ASCII for vault consistency. This is raw
  research input, not authoritative implementation guidance.

## Prompt

Targeted follow-up: Nico chose a hybrid command-integrity posture for FMX-184:
server-authoritative validation remains the authority, but MVP command envelopes
should include mandatory app-managed/device Ed25519 signature evidence.
Passkeys/WebAuthn are not used per-command; they stay for login/high-value
ceremonies. Server provenance remains internal HMAC; clients do not verify public
signatures in MVP. Offline runs remain eligibility-pending if the signed command
log/proof chain can verify on sync. Audit the hybrid posture. What must the ADR
specify to avoid false security claims? What source checks are required before
ratifying WebCrypto Ed25519 in a PWA? What key lifecycle, device registration,
rotation/revocation, and privacy issues should be explicitly marked as MVP vs
future? Give concise best-practice recommendations.

## Raw answer capture

Perplexity said the hybrid posture is coherent if the ADR is explicit that
device/app signatures add evidence, not trust. The server remains the sole
authority for command acceptance. Offline state is only eligibility-pending until
sync. "Ed25519-signed" must not be treated as "server-verified",
"tamper-proof", or "anti-cheat proven".

### ADR wording requirements

The answer recommended making these boundaries explicit:

- Server-authoritative validation is the only acceptance authority.
- Client signatures are integrity evidence attached to a command envelope.
- The signature can help detect local log tampering between device and sync.
- The signature does not protect against compromised browsers, rooted devices,
  stolen keys, malicious clients, replay on its own, or bad server acceptance
  logic.
- Offline sessions must be labeled pending eligibility/pending verification,
  not accepted for public trust.
- Internal HMAC server provenance is a backend verification mechanism, not a
  public client-verifiable proof.
- Invalid or missing signatures need explicit failure behavior.
- The byte sequence being signed must be canonicalized and versioned to avoid
  JSON/serialization drift.

### Required source checks

The answer recommended these source checks before implementation relies on
WebCrypto Ed25519 in a PWA:

- Confirm exact browser-engine/version support for Ed25519 in WebCrypto.
- Verify algorithm names plus `generateKey`, `sign`, `verify`, `importKey` and
  `exportKey` behavior across target browsers and workers.
- Check secure-curve/WebCrypto interoperability concerns, including malformed
  imported keys.
- Define a fallback or stop condition for unsupported browsers; do not silently
  depend on a polyfill without a maintenance/security review.
- Confirm Node/runtime parity for tooling and tests if server-side conformance
  tests use Node WebCrypto.

### MVP vs future split

MVP:

- App-managed/device-generated Ed25519 key pair.
- Mandatory signature evidence on command envelopes.
- Server-side verification on sync.
- Eligibility-pending offline state.
- Basic key registration bound to a device/install record.
- Device-key revocation path.
- Deterministic payload canonicalization and replay identifiers.

Future:

- Passkeys/WebAuthn for per-command signing.
- Client-side public-signature verification.
- Multi-device trust graphs or quorum approval.
- Hardware-backed attestation.
- Rich anomaly scoring or risk-based step-up signing.
- Offline acceptance before sync-final verification.

### Key lifecycle and privacy

The answer recommended on-device key generation, one public key per registered
device/install record, explicit rotation on reinstall/reset/compromise, server
revocation, and no import of server-generated long-lived private keys.

Privacy caveats:

- Persistent device keys are stable identifiers.
- Device keys must not be reused across accounts unless explicitly decided.
- Retention for public keys, device metadata and signed logs must be defined.
- Store only what is required for verification and revocation.
- User-facing copy should describe device keys as integrity/account-device
  evidence, not hidden tracking.
- Account deletion handling must reconcile device-key deletion with any
  fraud/audit retention requirements.

## Source trail returned

- W3C WebCrypto Level 2: <https://www.w3.org/TR/webcrypto-2/>
- WICG WebCrypto secure curves: <https://wicg.github.io/webcrypto-secure-curves/>
- IPFS Foundation Ed25519 Chrome note:
  <https://ipfsfoundation.org/ed25519-support-in-chrome-making-the-web-faster-and-safer-2/>
- `@solana/webcrypto-ed25519-polyfill` package:
  <https://www.npmjs.com/package/@solana/webcrypto-ed25519-polyfill>
- MDN `SubtleCrypto.sign()`:
  <https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign>
- WICG secure-curves issue on malformed keys:
  <https://github.com/WICG/webcrypto-secure-curves/issues/22>
- Node.js WebCrypto: <https://nodejs.org/api/webcrypto.html>

## Source-quality note

The follow-up is useful for ADR guardrails, but implementation must still verify
target browser support directly before relying on WebCrypto Ed25519 in product
code. The ADR records this as an implementation follow-up rather than assuming
universal support.
