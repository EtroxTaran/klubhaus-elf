---
title: ADR-0116 Save Trust Levels and Provenance Posture
status: accepted
tags: [adr, architecture, security, save-format, save-trust, provenance, hall-of-fame, leaderboards, fmx-184]
context: audit-security
created: 2026-06-14
updated: 2026-06-14
type: adr
binding: true
addresses: [PM-2026-05-20-05-F-01]
amends:
  - [[ADR-0005-save-format]]
  - [[ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/command-signing-save-trust-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-save-trust-provenance-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-command-save-trust-source-checks-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-hybrid-ed25519-command-evidence-2026-06-14]]
  - [[../../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
  - [[ADR-0005-save-format]]
  - [[ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0091-audit-security-context-definition]]
  - [[ADR-0115-command-integrity-and-replay-protection-posture]]
---

# ADR-0116: Save Trust Levels and Provenance Posture

## Status

accepted

Accepted 2026-06-14 by Nico for FMX-184. Decision queue:
[[../../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]].

## Context

The pre-mortem originally described `ADR-0028 Save Import/Export Trust Levels`,
but current ADR-0028 is the accepted Postgres transactional outbox ADR. The save
trust concept therefore needed a valid ADR home.

ADR-0005 already defines the encrypted save/export envelope. ADR-0098 amends its
KDF and active-pack payload line. Neither ADR defines public provenance or
eligibility: AES-GCM proves envelope integrity under a key, not server origin,
unbroken timeline or public-competitive eligibility.

FMX needs a save-trust posture that allows local/offline play and import/export
while protecting future leaderboards, Hall of Fame and async multiplayer.

## Decision

### D4 - trust vocabulary

Save trust is derived, not user-editable. Public eligibility is derived
separately from save trust.

```ts
type SaveTrustLevel =
  | 'local-only'
  | 'server-verified'
  | 'imported-unverified'
  | 'imported-verified'
  | 'unverified-by-engine-migration'
  | 'dev-or-debug'
  | 'invalid-or-modified';

type PublicEligibility =
  | 'eligible-public'
  | 'pending-verification'
  | 'casual-only'
  | 'view-only'
  | 'rejected';
```

### D5 and D8 - server provenance proof

FMX uses an internal server HMAC proof first. Public asymmetric server
signatures and client/community verification are future scope.

Minimum `ServerProvenanceProofV1` coverage:

- save/run ID;
- account/run binding;
- command root or hash-chain head;
- engine bundle hash;
- content/data/active-pack hash where applicable;
- downgrade flags;
- issued-at timestamp;
- proof version;
- key ID and HMAC algorithm.

Server proof is required before a save/run can be `server-verified` or
`imported-verified`.

### D6 - public feature gates

Hall of Fame, leaderboards and async multiplayer accept only
`server-verified` or `imported-verified` histories with `eligible-public`.

Local-only, imported-unverified, dev/debug, invalid/modified and
engine-migration-mismatched histories remain local/casual unless a server
verification flow explicitly promotes them.

### D9 - offline and import verification

Offline runs remain `pending-verification` for public eligibility until sync.
They do not lose eligibility merely because they were offline, as long as the
signed command log and proof chain can be verified later.

Same-account imports with valid server proof may become `imported-verified`.
Unverified imports remain playable as local/casual/sandbox saves but cannot enter
official public trust surfaces.

### D10 - downgrade policy

Official public eligibility uses strict irreversible downgrade. Debug/dev tools,
invalid proof, conflicting branch history, unapproved engine/content hash,
unverified import, or invalid command-signature chain permanently remove
official public eligibility for that run path.

If an invalid sync concerns a multiplayer or official verified path, the run
rolls back or rebases to the last accepted server checkpoint. The player may
continue a local/sandbox branch where product flow allows it.

### D11 - player-facing framing

Future UI must expose this as a clear Competitive/Sandbox status, not hidden
technical state. Save/run surfaces should be able to show:

- eligible-public;
- pending verification;
- local-only or sandbox;
- rejected/ineligible with a reason code.

### D12 - offline window

There is no fixed maximum offline window. Verification quality is based on the
signed command log, command root, engine/content hashes and server proof chain,
not a hard number of offline matches or seasons.

### D15 - proof cadence

Server provenance proofs are issued at successful sync checkpoints and public
submission milestones. Per-command server receipts and final-only proof are both
rejected for MVP: per-command proof is too heavy, while final-only proof leaves
offline and import status opaque for too long.

## Consequences

Positive:

- Closes the dead ADR-0028 save-trust concept without changing ADR-0005
  encryption/KDF details.
- Makes "playable locally" different from "eligible for public trust surfaces".
- Protects Hall of Fame, leaderboards and async multiplayer without turning the
  game into online-only.
- Aligns with Ironman/modified-world precedent: broken public eligibility is
  visible and not silently restored.

Costs / constraints:

- Code phase must model provenance/eligibility as derived policy, not a
  user-editable save field.
- Server proof key management and proof retention need implementation detail.
- Multi-device divergent roots and partial-log challenge flows remain future
  product/security work.

## Related

- [[../../60-Research/command-signing-save-trust-2026-06-14]]
- [[../../60-Research/raw-perplexity/raw-hybrid-ed25519-command-evidence-2026-06-14]]
- [[../../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
- [[ADR-0005-save-format]]
- [[ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
- [[ADR-0115-command-integrity-and-replay-protection-posture]]
