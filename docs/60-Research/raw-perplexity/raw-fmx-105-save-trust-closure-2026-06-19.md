---
title: Raw FMX-105 save trust closure sanity check
status: raw
tags: [research, raw, perplexity, security, save-trust, command-integrity, provenance, fmx-105]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-105
related:
  - [[../fmx-105-save-trust-closure-reconciliation-2026-06-19]]
  - [[raw-fmx-105-save-trust-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-105-save-trust-closure-record-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
---

# Raw FMX-105 save trust closure sanity check

## Capture metadata

- **Issue:** FMX-105
- **Date:** 2026-06-19
- **Purpose:** Perplexity-first sanity check before closing the stale
  "Save Trust Levels & Command Integrity" issue as resolved by accepted
  ADR-0115 and ADR-0116 instead of creating another ADR.
- **Status:** Raw discovery input. Source-checked conclusions live in
  [[raw-fmx-105-save-trust-source-checks-2026-06-19]].

## Prompt

FMX-105 is a stale Linear issue asking to re-home orphaned Save Trust Levels &
Command Integrity intent: `trust_level` enum, `command_log_merkle_root` or hash
chain, `engine_bundle_hash`, optional `server_hmac`, import/export trust matrix,
command signing/replay protection, and public eligibility gates for Hall of
Fame/leaderboards/async multiplayer.

Current accepted FMX docs have ADR-0115: server-authoritative command validation,
`commandId`/idempotency, `expectedVersion`, app-managed Ed25519 evidence
envelope, passkeys only for login/high-value ceremonies, replay/dedup before
domain validation; and ADR-0116: `SaveTrustLevel` / `PublicEligibility` derived
from server/internal HMAC proof, command root/hash chain, engine/content hash,
import path and downgrade flags; only server-verified/imported-verified eligible
histories enter public surfaces.

Sanity-check whether closing FMX-105 as resolved by ADR-0115/ADR-0116 is
defensible. Include best-practice reasoning, comparable real-world/security/game
precedents, residual gaps and whether a new ADR decision is still needed.

## Raw answer summary

Perplexity answered that closing FMX-105 is defensible if the issue is about the
missing home for trust/eligibility logic rather than a still-open decision about
whether server-verifiable provenance is needed at all. It mapped the current
split as:

- ADR-0115 owns command intake integrity: server-authoritative validation,
  `commandId` idempotency, `expectedVersion`, replay/dedup before domain
  validation and app-managed Ed25519 command evidence.
- ADR-0116 owns history eligibility: derived `SaveTrustLevel` and
  `PublicEligibility` from server/internal proof, command chain/root integrity,
  engine/content hashes, import path and downgrade flags.
- The combination matches common security/game-backend practice: clients submit
  evidence, but the server decides legitimacy for public/competitive surfaces.

It considered the FMX-105 ask covered where:

- trust level is derived, not user-controlled;
- command root/hash-chain and engine/content identity feed public eligibility;
- server HMAC is internal attestation, not a client trust signal;
- import/export paths map to eligibility and downgrade states;
- command signatures remain evidence, not authority;
- Hall of Fame, leaderboards and async multiplayer depend on ADR-0116 public
  eligibility.

It listed residual gaps to verify before closure:

- explicit trust-state transitions for imported, verified, downgraded and
  ineligible histories;
- mixed-provenance handling after import, repair, merge or partial tampering;
- uniform public-surface gates across HoF, leaderboards, async multiplayer,
  replays, exports and APIs;
- HMAC key scope/rotation/verification;
- clear wording that client Ed25519 evidence is subordinate to server
  verification;
- downgrade rules for engine/content drift versus benign upgrades.

The recommendation was to close FMX-105 if ADR-0115/ADR-0116 contain exact
authority boundary, proof-type, derivation, import/downgrade and read-side gate
text. If those rules are only implied, create a narrow follow-up for the missing
trust-state policy rather than reopening the whole issue.

## Citation-quality warning

The returned citation list was unusable for durable FMX evidence: it included
unrelated Cisco, Silicon Labs, NI, Juniper, FTC, FDA, ROCm and Yocto links. No
Perplexity citation from this run is canonized directly. The closure decision is
based on accepted FMX ADR text plus the primary source checks in
[[raw-fmx-105-save-trust-source-checks-2026-06-19]].
