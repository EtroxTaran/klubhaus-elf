---
title: ADR-0115 Command Integrity and Replay Protection Posture
status: accepted
tags: [adr, architecture, security, command-signing, replay-protection, offline-sync, audit, fmx-184]
created: 2026-06-14
updated: 2026-06-14
type: adr
binding: true
addresses: [PM-2026-05-20-05-F-02]
amends:
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0091-audit-security-context-definition]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/command-signing-save-trust-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-command-integrity-and-replay-protection-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-command-save-trust-source-checks-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-hybrid-ed25519-command-evidence-2026-06-14]]
  - [[../../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0091-audit-security-context-definition]]
  - [[ADR-0116-save-trust-levels-and-provenance-posture]]
---

# ADR-0115: Command Integrity and Replay Protection Posture

## Status

accepted

Accepted 2026-06-14 by Nico for FMX-184. Decision queue:
[[../../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]].

## Context

The pre-mortem originally described `ADR-0026 Command Signing & Replay
Protection`, but current ADR-0026 is the accepted match frame contract. The
original security concept therefore needed a valid ADR home.

ADR-0090 already chose server-authoritative re-validation and rebase for queued
offline commands, using `commandId` and `expectedVersion`. ADR-0091 already
gives Audit & Security replay-protection/dedup ownership.

FMX-184 keeps server authority as the command acceptance authority, but Nico
chose a stricter MVP evidence envelope than the original research
recommendation: each mutating command carries app-managed Ed25519 signature
evidence. The signature proves that the command was attached to a registered app
device key at some point; it does **not** prove the browser/runtime was honest
and is not an anti-cheat authority by itself.

Current source checks show WebCrypto Ed25519 is documented by MDN and WebCrypto
2, but production implementation still needs target-browser conformance tests
before code relies on it.

## Decision

FMX uses a **server-authoritative signed-evidence command envelope** for MVP.

### D1 - command authority

The server remains the only authority for accepting commands. A command is valid
only after server-side authentication/session binding, authorization, domain
validation, idempotency/dedup, replay checks and `expectedVersion` checks.

Client signatures are mandatory evidence, not authority. FMX must not use
wording such as "signed means uncheatable" or "client-verified".

### D2 - command envelope

Every mutating command envelope includes:

- `commandId` as the idempotency key;
- save/run and aggregate identifiers;
- server-known actor/account/session binding;
- `expectedVersion` or equivalent aggregate precondition;
- command type and version;
- canonical payload hash;
- client-observed timestamp as telemetry only;
- `deviceKeyId`;
- `signatureAlgorithm = Ed25519`;
- `signatureEvidenceVersion`;
- Ed25519 signature over the canonical command representation.

The server records processed command IDs and rejects duplicate IDs whose
canonical payload hash or actor/save binding differs from the first accepted
record.

### D3 - WebAuthn/passkeys

WebAuthn/passkeys are used for login, recovery, device linking, competitive
enrollment or final public-submission ceremonies only. They are not used for
normal gameplay command signing or offline outbox flushing.

### D7 - device key strategy

Command evidence uses an app-managed/device Ed25519 key pair. The passkey private
key is not reused for command signing.

Minimum lifecycle requirements:

- generate the private key on-device in the app flow;
- register the public key to one device/install record;
- rotate on reinstall, reset, suspected compromise or explicit re-registration;
- keep a server-side device-key revocation state;
- reject verified/public sync from revoked keys after revocation takes effect;
- treat key loss as re-registration, not recovery of the old key.

### D13 - invalid signature handling

For multiplayer, public eligibility or official verified sync, missing or
invalid signature evidence does not advance the verified chain. The client must
be told that the submitted local data is no longer valid for that verified path,
and the verified run must roll back or rebase to the last accepted server
checkpoint.

For local single-player, the save may continue as local/casual/sandbox, but it
does not regain official public eligibility by client claim.

### D14 - canonical signed bytes

The signed representation is a versioned canonical JSON/JCS-style UTF-8
representation. The command schema version and payload hash are part of the
canonical representation so JSON key order, whitespace or serializer differences
cannot change the signature result.

Switching to deterministic CBOR or another canonical byte format requires a
future ADR/version bump.

## Consequences

Positive:

- Closes the dead ADR-0026 security concept with a binding home.
- Keeps ADR-0090/ADR-0091 server authority intact.
- Gives Offline Sync a future-compatible command envelope for replay, dedup,
  audit and public eligibility checks.
- Preserves a clean passkey boundary: account/security ceremonies, not every
  manager action.

Costs / constraints:

- Code phase must ship WebCrypto Ed25519 conformance tests for target browsers
  before relying on command signatures.
- Device-key storage and revocation become part of the platform security model.
- Public trust still depends on server verification and save/run provenance
  from ADR-0116; device signatures alone are insufficient.

## Follow-ups

- Define the browser support/conformance matrix during implementation.
- Define the exact canonical JSON profile in the first command-envelope schema.
- Add device-key privacy/retention detail to the account/device data model when
  code-phase schemas are authored.

## Related

- [[../../60-Research/command-signing-save-trust-2026-06-14]]
- [[../../60-Research/raw-perplexity/raw-hybrid-ed25519-command-evidence-2026-06-14]]
- [[../../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
- [[ADR-0091-audit-security-context-definition]]
- [[ADR-0116-save-trust-levels-and-provenance-posture]]
