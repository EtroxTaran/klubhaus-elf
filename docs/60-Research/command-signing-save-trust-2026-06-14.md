---
title: "Command signing and save trust posture (FMX-184)"
status: current
tags: [research, synthesis, security, command-signing, replay-protection, save-trust, provenance, hall-of-fame, leaderboards, fmx-184]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-184
related:
  - [[raw-perplexity/raw-command-integrity-and-replay-protection-2026-06-14]]
  - [[raw-perplexity/raw-save-trust-provenance-2026-06-14]]
  - [[raw-perplexity/raw-command-save-trust-source-checks-2026-06-14]]
  - [[raw-perplexity/raw-hybrid-ed25519-command-evidence-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0114-command-integrity-and-replay-protection-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0115-save-trust-levels-and-provenance-posture]]
  - [[../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0005-save-format]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
---

# Command signing and save trust posture (FMX-184)

## Scope

FMX-184 revisits the pre-mortem command-signing and save-trust concepts after
the ADR number collision: current ADR-0026, ADR-0027 and ADR-0028 are no longer
the old intended security ADRs. Nico approved the FMX-184 packet on 2026-06-14,
so the binding homes are:

- [[../10-Architecture/09-Decisions/ADR-0114-command-integrity-and-replay-protection-posture|ADR-0114]]
  for command integrity, replay protection and the MVP signing posture.
- [[../10-Architecture/09-Decisions/ADR-0115-save-trust-levels-and-provenance-posture|ADR-0115]]
  for save trust levels, provenance evidence and public eligibility gates.

The decision record is preserved in
[[../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]].

## Evidence synthesis

### Command integrity

Perplexity and source checks converge on one practical point: client command
signatures do not remove the need for server authority. In a browser/PWA, the
player controls the local runtime and storage. Even when Ed25519 is available
through WebCrypto, a client-held signing key is provenance evidence, not a
strong anti-cheat guarantee.

Current MDN, W3C/WICG and Node WebCrypto docs correct one stale research claim:
Ed25519 is now a documented WebCrypto algorithm surface in modern runtimes, but
browser support and malformed-key behavior still require implementation-time
capability checks and conformance tests. That makes app-managed device
signatures feasible, not authoritative.

The accepted FMX line is a hybrid:

- the server remains authoritative for command acceptance and domain rules;
- every mutating command carries a stable `commandId`;
- `commandId` remains the idempotency key;
- `expectedVersion` or equivalent aggregate/version precondition is mandatory;
- the server stores processed commands and rejects mismatched retry payloads;
- each owning domain validates its own command rules server-side;
- Audit & Security owns dedup/replay facts and command security audit records;
- the command envelope includes mandatory app-managed/device Ed25519 evidence
  from the first code phase;
- the Ed25519 signature is provenance/tamper evidence and never overrides
  server validation.

Stripe's idempotency model is the useful real-world API precedent: a unique key
lets clients retry safely while the server prevents duplicate effects and
rejects mismatched parameters.

### WebAuthn / passkeys

WebAuthn is a challenge/assertion authentication flow. MDN's flow has the server
issue a challenge, the authenticator sign it through browser mediation, and the
server validate signature, challenge and relying-party ID. That is right for
login, account recovery, competitive enrollment or "finalize public submission"
ceremonies.

It is the wrong default for silent per-command signing because offline gameplay
would require repeated background signatures without the normal WebAuthn user
presence/verification model. FMX should explicitly reject "passkey signs every
command" as the MVP command-integrity approach. Nico accepted this split:
passkeys may be used for login and explicit high-value ceremonies, while command
evidence uses separate app-managed/device Ed25519 keys.

### Save trust and public eligibility

The save contract already has encryption/versioning in ADR-0005 and a KDF
amendment in ADR-0098. FMX-184 adds a separate missing layer: provenance and
feature eligibility. AES-GCM proves envelope integrity under a key; it does not
prove the save came from the server or remained public-eligible.

The recommended model separates:

- **trust level**: derived evidence class for the save/run;
- **eligibility**: derived feature gate for public/competitive surfaces;
- **evidence**: server proof, command-root/hash-chain head, engine/content hash,
  import path and downgrade flags.

Public Hall of Fame, leaderboards and async multiplayer should only consume
server-verified histories. Imported, local-only, dev/debug and mismatched saves
remain playable locally where safe, but cannot silently appear in public
competitive records.

Game precedent supports irreversible downgrade. Paradox's Ironman support
article says achievement eligibility cannot be restored after update/mod/corrupt
state breaks it. Minecraft community documentation reports a similar permanent
achievement-disable rule for certain modified/cheat world states. FMX uses that
policy pattern: visible, deterministic and not reversible by client-side claim.

## Accepted decision packet

| Decision | Accepted FMX-184 line | Binding home |
|---|---|---|
| D1 command-integrity authority | Server remains authoritative; signatures are evidence, not authority. | ADR-0114 |
| D2 command envelope | Full signed command envelope from the first code phase. | ADR-0114 |
| D3 WebAuthn/passkeys | Passkeys are for login/high-value ceremonies only, not per-command signing. | ADR-0114 |
| D1-D3 reconciliation | Hybrid Ed25519: server-authoritative validation plus mandatory app-managed/device Ed25519 command evidence. | ADR-0114 |
| D4 save trust vocabulary | Derived `SaveTrustLevel` plus derived `PublicEligibility`. | ADR-0115 |
| D5 server provenance proof | Internal server HMAC over root/hash evidence. | ADR-0115 |
| D6 public feature gates | Only server-verified or imported-verified eligible histories enter public HoF, leaderboards or async multiplayer. | ADR-0115 |
| D7 key strategy | App-managed/device Ed25519 keys; never reuse passkey/WebAuthn private keys. | ADR-0114 |
| D8 command/server receipts | Server HMAC/internal proof only for MVP; clients do not verify public signatures. | ADR-0115 |
| D9 offline/import verification | Offline saves are eligibility-pending until server verification; same-account imports with valid proof can become imported-verified. | ADR-0115 |
| D10 downgrade policy | Strict irreversible official-public downgrade for invalid proof, dev/debug, conflicting branch, unapproved engine/content hash or unverified import. | ADR-0115 |
| D11 player-facing framing | Use Competitive/Sandbox status language with visible reason codes. | ADR-0115 |
| D12 offline window | No fixed maximum offline window if the signed command log/proof chain verifies later. | ADR-0115 |
| D13 bad signature/proof handling | Public/MP sync does not advance; rollback or rebase to the last accepted server checkpoint and tell the player. Local SP may continue as local/casual/sandbox. | ADR-0114 + ADR-0115 |
| D14 signed bytes | Versioned canonical JSON/JCS-style UTF-8 representation. | ADR-0114 |
| D15 proof cadence | Internal HMAC proofs at successful sync checkpoints and public-submission milestones. | ADR-0115 |

## Implementation follow-ups

The posture is binding; the exact implementation contracts remain future code
phase work. Open implementation questions include the final command-envelope
schema, key provisioning/recovery UX, HMAC key rotation, engine/content hash
catalog ownership, player-facing reason-code copy and conformance tests across
browser/Node WebCrypto surfaces.

## Related

- [[raw-perplexity/raw-command-integrity-and-replay-protection-2026-06-14]]
- [[raw-perplexity/raw-save-trust-provenance-2026-06-14]]
- [[raw-perplexity/raw-command-save-trust-source-checks-2026-06-14]]
- [[raw-perplexity/raw-hybrid-ed25519-command-evidence-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0114-command-integrity-and-replay-protection-posture]]
- [[../10-Architecture/09-Decisions/ADR-0115-save-trust-levels-and-provenance-posture]]
- [[../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
