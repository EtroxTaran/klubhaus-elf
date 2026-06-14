---
title: FMX-184 command signing and save trust decision queue
status: current
tags: [execution, decision-queue, security, command-signing, replay-protection, save-trust, accepted, fmx-184]
created: 2026-06-14
updated: 2026-06-14
type: decision-queue
binding: false
linear: FMX-184
related:
  - [[../60-Research/command-signing-save-trust-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
  - [[../60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity]]
  - [[../60-Research/pre-mortem/threat-model]]
  - [[../60-Research/pre-mortem/findings-registry]]
---

# FMX-184 command signing and save trust decision queue

This is the HITL decision queue for FMX-184. It turns the research synthesis
[[../60-Research/command-signing-save-trust-2026-06-14]] into the accepted
command-integrity and save-trust decisions recorded in
[[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture|ADR-0115]]
and
[[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture|ADR-0116]].

## Accepted decisions

| Decision | Nico answer | Recorded in |
|---|---|---|
| D1 - command-integrity authority | Server remains authoritative; signatures are evidence, not command authority. | ADR-0115 |
| D2 - command envelope | Full signed command envelope from the first code phase. | ADR-0115 |
| D3 - WebAuthn/passkeys | Passkeys are for login/high-value ceremonies only, not per-command signing. | ADR-0115 |
| Reconciliation of D1-D3 | Hybrid Ed25519: server-authoritative plus mandatory app-managed/device Ed25519 command evidence. | ADR-0115 |
| D4 - save trust vocabulary | Derived `SaveTrustLevel` plus derived `PublicEligibility`. | ADR-0116 |
| D5 - server provenance proof | Internal server HMAC over root/hash evidence. | ADR-0116 |
| D6 - public feature gates | Only server-verified or imported-verified eligible histories enter public HoF, leaderboards or async multiplayer. | ADR-0116 |
| D7 - key strategy | App-managed/device Ed25519 keys; do not reuse passkey/WebAuthn private keys. | ADR-0115 |
| D8 - command/server receipts | Server HMAC/internal proof only for MVP; clients do not verify public signatures. | ADR-0116 |
| D9 - offline/import verification | Offline saves are eligibility-pending until server verification; same-account imports with valid proof can become imported-verified. | ADR-0116 |
| D10 - downgrade policy | Strict irreversible official-public downgrade for invalid proof, dev/debug, conflicting branch, unapproved engine/content hash or unverified import. | ADR-0116 |
| D11 - player-facing framing | Use Competitive/Sandbox status language with visible reason codes. | ADR-0116 |
| D12 - offline window | No fixed maximum offline window if the signed command log/proof chain verifies later. | ADR-0116 |
| D13 - bad signature/proof handling | Verified/public sync does not advance; multiplayer/public path rolls back or rebases to the last accepted server checkpoint and tells the player. Local SP may continue as local/casual/sandbox. | ADR-0115 + ADR-0116 |
| D14 - signed bytes | Versioned canonical JSON/JCS-style UTF-8 representation. | ADR-0115 |
| D15 - proof cadence | Internal HMAC proofs at successful sync checkpoints and public-submission milestones. | ADR-0116 |

## Key rationale

- Browser-held Ed25519 keys are useful integrity evidence but are still under
  the player's device/runtime control, so they cannot replace server authority.
- WebAuthn/passkeys are challenge/authentication ceremonies and remain a bad fit
  for every manager action or background offline outbox flush.
- Internal server HMAC is enough for server-side public eligibility verification
  in MVP; public asymmetric proof is future scope.
- Offline-first remains intact: local play is allowed, but public trust waits for
  server verification.

## Decision record

- 2026-06-14: FMX-184 selected by Nico after live Linear shortlist.
- 2026-06-14: Linear FMX-184 moved to `In Progress`.
- 2026-06-14: branch/worktree created:
  `codex/fmx-184-command-signing-save-trust`.
- 2026-06-14: Perplexity captures and source checks saved.
- 2026-06-14: synthesis created in
  [[../60-Research/command-signing-save-trust-2026-06-14]].
- 2026-06-14: draft ADR-0113/0114 prepared before the branch was updated.
- 2026-06-14: branch updated onto `origin/main`; main had claimed ADR-0113 for
  FMX-138, so FMX-184 records were renumbered to ADR-0115 and ADR-0116.
- 2026-06-14: Nico approved D1-D15 live; ADR-0115 and ADR-0116 promoted to
  accepted/binding.

## Related

- [[../60-Research/command-signing-save-trust-2026-06-14]]
- [[../60-Research/raw-perplexity/raw-hybrid-ed25519-command-evidence-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
- [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
