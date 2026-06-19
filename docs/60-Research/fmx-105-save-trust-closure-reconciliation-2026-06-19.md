---
title: FMX-105 Save Trust Closure Reconciliation
status: current
tags: [research, reconciliation, security, save-trust, command-integrity, provenance, fmx-105]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-105
related:
  - [[raw-perplexity/raw-fmx-105-save-trust-closure-2026-06-19]]
  - [[raw-perplexity/raw-fmx-105-save-trust-source-checks-2026-06-19]]
  - [[../40-Execution/fmx-105-save-trust-closure-record-2026-06-19]]
  - [[command-signing-save-trust-2026-06-14]]
  - [[security-adr-reference-hygiene-2026-06-17]]
  - [[pre-mortem/findings-registry]]
  - [[pre-mortem/threat-model]]
  - [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
---

# FMX-105 Save Trust Closure Reconciliation

FMX-105 can close as a stale overlap issue. Its original request for a binding
home for save trust levels, command integrity and public eligibility is now
covered by accepted ADR-0115 and ADR-0116, with FMX-182 preserving the reference
hygiene trail.

This note does not create a new architecture decision.

## Original FMX-105 ask

FMX-105 asked for a draft ADR to re-home orphaned save-trust and command
integrity intent:

- `trust_level` / save trust enum;
- command-log Merkle root or hash-chain evidence;
- engine/content bundle hash;
- optional server HMAC;
- import/export trust matrix;
- command signing and replay protection;
- public eligibility gates for Hall of Fame, leaderboards and async multiplayer;
- cleanup of stale ADR-0026/ADR-0028 security references.

## Closure matrix

| FMX-105 requirement | Current binding home | Closure assessment |
|---|---|---|
| Command signing and replay protection | [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]] plus [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]] | Covered. Server authority, `commandId`, `expectedVersion`, canonical payload hash, idempotency/dedup, app-managed Ed25519 evidence and replay/dedup ordering are accepted. |
| Passkeys vs command signatures | [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]] | Covered. Passkeys are login/recovery/device-link/high-value ceremonies only; normal command evidence uses an app-managed device key. |
| Save trust vocabulary | [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]] | Covered. `SaveTrustLevel` and `PublicEligibility` are derived policy, not user-editable fields. |
| Server HMAC / provenance proof | [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]] | Covered. `ServerProvenanceProofV1` includes save/run binding, command root/hash-chain head, engine/content hashes, downgrade flags, timestamp, key ID and HMAC algorithm. |
| Import/export trust matrix | [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]] | Covered at policy level. Same-account imports with valid server proof may be `imported-verified`; unverified imports stay local/casual/sandbox. |
| Public eligibility for HoF, leaderboards and async multiplayer | [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]] | Covered. Public surfaces require `server-verified` or `imported-verified` histories with `eligible-public`. |
| Stale ADR-0026/ADR-0028 security references | [[security-adr-reference-hygiene-2026-06-17]] | Covered. FMX-182 confirms ADR-0026 remains Match Frame Contract, ADR-0028 remains Transactional Outbox, ADR-0115 owns command integrity and ADR-0116 owns save trust/provenance. |
| Pre-mortem F-01/F-02 status | [[pre-mortem/findings-registry]] | Covered as conceptual mitigation. `mitigated` means addressed by accepted ADRs, not implementation-complete. |

## Source-checked recommendation

Recommendation: close FMX-105 with no new ADR.

Reasons:

- The accepted homes already define the authority boundary and proof vocabulary.
- Primary source checks support the technical framing: WebCrypto can sign/verify
  Ed25519 evidence, HMAC is appropriate only where signer/verifier share a
  secret, WebAuthn should remain a relying-party authentication ceremony, JCS
  supports canonical JSON signed bytes, and mature public-score/idempotency
  systems keep client submissions subordinate to server-side verification.
- The Perplexity sanity check agreed with closure after the exact ADR text was
  verified, but its citations were discarded as unusable.

## Residual implementation detail

These are not FMX-105 blockers and should not create another broad ADR:

- browser conformance tests for WebCrypto Ed25519 before code relies on it;
- exact command-envelope schema and canonical JSON profile;
- server HMAC key rotation, retention and proof-verification implementation;
- detailed mixed-provenance flows for repaired/imported/divergent histories;
- future UI copy for Competitive/Sandbox trust status.

ADR-0115 and ADR-0116 already list the code-phase follow-ups at the right level.
If Nico wants more specificity for mixed-provenance state transitions, open a
new narrow follow-up issue rather than reopening FMX-105.

## Decision questions

None for FMX-105 closure.

The underlying Nico decisions were already made in FMX-184 and recorded in
[[../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]].
FMX-182 already handled the reference-hygiene choice. This PR only records the
closure proof for the stale Linear issue.
