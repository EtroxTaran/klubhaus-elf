---
title: FMX-184 command signing and save trust handoff
status: current
tags: [execution, handoff, security, command-signing, save-trust, fmx-184]
created: 2026-06-14
updated: 2026-06-14
type: handoff
binding: false
linear: FMX-184
related:
  - [[../../60-Research/command-signing-save-trust-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
  - [[../fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
---

# FMX-184 command signing and save trust handoff

## Goals

- Preserve raw research and source checks for command-signing, replay
  protection and save trust levels.
- Repair the dead pre-mortem ADR-0026/0028 references by creating current
  accepted homes.
- Preserve Nico's FMX-184 decisions and sweep stale pending/draft wording.

## Completed

- Claimed branch/worktree:
  `codex/fmx-184-command-signing-save-trust`.
- Moved Linear FMX-184 to `In Progress`.
- Saved raw Perplexity captures and source checks under
  `docs/60-Research/raw-perplexity/`.
- Updated the branch onto current `origin/main`; main had claimed ADR-0113 for
  FMX-138, so FMX-184 was renumbered to ADR-0115/ADR-0116.
- Added synthesis:
  [[../../60-Research/command-signing-save-trust-2026-06-14]].
- Added accepted ADR:
  [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]].
- Added accepted ADR:
  [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]].
- Added accepted decision record:
  [[../fmx-184-command-signing-save-trust-decision-queue-2026-06-14]].
- Swept front-door and pre-mortem notes so FMX-184 now appears as accepted.

## Open Tasks

- Future code phase still needs WebCrypto Ed25519 conformance tests before
  relying on command signatures in production.
- Future code phase must define the exact command-envelope schema,
  device-key lifecycle, server HMAC key rotation and player-facing
  Competitive/Sandbox reason-code copy.
- Validate and publish this docs packet.

## Decisions Made

Nico approved D1-D15 on 2026-06-14:

- Server remains authoritative; signatures are evidence, not authority.
- Use a full app-managed/device Ed25519 command-evidence envelope from the first
  code phase.
- WebAuthn/passkeys are login/high-value ceremonies only.
- Save trust is derived as `SaveTrustLevel` plus `PublicEligibility`.
- MVP server provenance proof is internal HMAC over root/hash evidence.
- Public HoF, leaderboards and async multiplayer only accept server-verified or
  imported-verified eligible histories.
- Offline saves remain eligibility-pending until proof-chain verification; no
  fixed offline window.
- Bad proof rolls public/MP sync back or rebases to the last accepted server
  checkpoint; local SP may continue as sandbox/casual.
- Signed bytes use versioned canonical JSON/JCS-style UTF-8.

## Blockers

- None for docs-phase. Implementation details above are future code-phase work.

## Durable Notes Updated

- [[../../60-Research/command-signing-save-trust-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
- [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
- [[../fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
- [[../../60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity]]
- [[../../60-Research/pre-mortem/threat-model]]
- [[../../60-Research/pre-mortem/findings-registry]]
- [[../../60-Research/pre-mortem/00-index]]
- [[../../60-Research/pre-mortem/execution-index]]

## Promotion Needed

No promotion pending. ADR-0115 and ADR-0116 are accepted/binding.
