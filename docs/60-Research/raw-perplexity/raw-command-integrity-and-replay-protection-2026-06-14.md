---
title: Raw Perplexity - Command Integrity and Replay Protection
status: raw
tags: [research, raw, perplexity, security, command-signing, replay-protection, offline-sync, async-multiplayer, fmx-184]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-184
related:
  - [[../command-signing-save-trust-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0114-command-integrity-and-replay-protection-posture]]
  - [[../../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
---

# Raw Perplexity - Command Integrity and Replay Protection

## Capture metadata

- Captured: 2026-06-14
- Tool: Perplexity Sonar via MCP
- Purpose: FMX-184 command-signing vs server-authoritative posture research.
- Handling: Punctuation normalized to ASCII for vault consistency. This is raw
  research input, not authoritative implementation guidance.

## Prompt

Research command integrity for an offline-capable browser football-management
game that later supports async multiplayer, leaderboards and Hall of Fame.
Compare:

- A. Ed25519-signed client commands with nonce/replay envelope and signed
  receipts.
- B. Server-authoritative command validation with idempotency
  keys/expectedVersion/dedup/replay protection but no client command signature
  for MVP.
- C. WebAuthn/passkey-backed command signing.

Include WebCrypto Ed25519 support caveats, WebAuthn/passkey limitations for
arbitrary/background signing, and how other games or online services approach
anti-cheat/command trust. Give a clear recommendation for MVP and what to
defer.

## Raw answer capture

Perplexity recommended starting with option B: a server-authoritative MVP with
no client command signatures, while designing the command envelope so stronger
identity/signature mechanisms can be added later for high-value flows.

It framed the FMX threat model as:

- mostly offline singleplayer first;
- later async multiplayer, leaderboards and Hall of Fame;
- browser/PWA client under player control through devtools, extensions and
  local tampering;
- therefore no client-side scheme can make offline play uncheatable.

The answer argued the highest-value integrity work is server-authoritative
validation, idempotency, deduplication, replay protection and audit trails for
competitive submissions.

### Option B - server authority

Perplexity described the MVP protocol as:

```json
{
  "commandId": "uuid",
  "careerId": "uuid",
  "userId": "server-known",
  "expectedVersion": 123,
  "localTimestamp": "iso-8601",
  "payload": {}
}
```

The proposed server transaction:

1. Look up the career/save aggregate under a lock.
2. Reject a `commandId` already present in the processed-command table.
3. Reject a stale `expectedVersion`.
4. Validate the command against current domain rules.
5. Apply canonical events, increment version and record the idempotency key in
   the same transaction.

The answer compared this to online service/API idempotency patterns and
turn-based/async games where the server validates legal turns. It said the
pattern protects against retry duplication, network replay and ordering bugs,
but not against a user calling the API directly with legal-looking fabricated
commands as themselves. It concluded this is still the best MVP ROI because
the server checks are required even if later signatures exist.

### Option A - Ed25519-signed commands

Perplexity described a custom signing envelope:

```json
{
  "publicKey": "device public key",
  "nonce": "unique or monotonic nonce",
  "timestamp": "iso-8601",
  "command": {},
  "signature": "ed25519(envelope)"
}
```

It listed benefits:

- a command was emitted by a holder of the registered private key at some
  point;
- audit trail can include signed history;
- signed receipts can support later proof-of-play narratives.

It also listed the core limitation: a browser-stored key is still under the
player's control. A player can export the key or run a headless signing script.
Therefore custom Ed25519 does not remove the need for server authority and is
mainly provenance/tamper-evidence, not anti-cheat.

### Important source-quality correction

Perplexity claimed there is no stable standardized Ed25519 support in
WebCrypto. Current MDN source checks captured in
[[raw-command-save-trust-source-checks-2026-06-14]] contradict that statement:
MDN documents Ed25519 as a `SubtleCrypto.sign()` algorithm and provides a
generate/sign/verify example.

This correction changes the implementation-readiness assessment, but not the
product recommendation: app-managed browser signing keys remain under the
player's control and should not be the MVP authority for command acceptance.

### Option C - WebAuthn/passkey-backed signing

Perplexity described WebAuthn as a strong credential mechanism for login and
high-value ceremonies, because authenticator private keys are not normally
exportable and are scoped to an origin/relying party.

It rejected WebAuthn for per-command or offline background signing because:

- the API is an authentication/assertion flow, not a general-purpose signing
  oracle;
- assertions are challenge-based and usually require user presence or
  verification;
- browsers constrain silent/background use;
- service-worker or offline command streams cannot rely on repeated hidden
  passkey prompts.

The answer recommended using WebAuthn/passkeys later for login, competitive
entry, or "finalize Hall of Fame submission" style batch ceremonies, not for
every manager action.

### Services / games precedent

Perplexity summarized common industry posture:

- Online games usually make server state authoritative and treat the client as
  untrusted input.
- Anti-cheat tooling detects tampering heuristically rather than relying on
  browser command signatures.
- API services combine TLS/auth with idempotency keys, nonces, sequences and
  replay windows.

### Perplexity recommendation

Perplexity's MVP recommendation:

- command envelope with `commandId`, `expectedVersion` and timestamp;
- strict server-side validators;
- processed-command deduplication;
- deterministic event log/audit trail;
- offline IndexedDB outbox that uploads in order and handles conflicts;
- no client command signatures for MVP.

Deferred:

- WebAuthn/passkey ceremonies for high-value competitive submissions;
- custom Ed25519 only if a later native shell/hardware-backed key posture
  justifies it;
- signed receipts only if a user-facing proof/dispute workflow needs them.

## Source-quality note

The Perplexity reasoning is directionally useful, but its WebCrypto Ed25519
claim is stale. The synthesis uses current MDN evidence for browser API facts
and keeps Perplexity as product/security trade-off input only.
