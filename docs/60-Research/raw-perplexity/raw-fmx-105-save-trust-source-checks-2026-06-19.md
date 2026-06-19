---
title: Raw FMX-105 save trust closure source checks
status: raw
tags: [research, raw, source-check, security, save-trust, command-integrity, provenance, fmx-105]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-105
related:
  - [[../fmx-105-save-trust-closure-reconciliation-2026-06-19]]
  - [[raw-fmx-105-save-trust-closure-2026-06-19]]
  - [[../../40-Execution/fmx-105-save-trust-closure-record-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
---

# Raw FMX-105 save trust closure source checks

## Capture metadata

- **Issue:** FMX-105
- **Date:** 2026-06-19
- **Purpose:** Validate the Perplexity sanity-check claims before closing
  FMX-105 as resolved by accepted ADR-0115 and ADR-0116.

## Sources checked

| Source | Relevant finding | FMX implication | Confidence |
|---|---|---|---|
| MDN, `SubtleCrypto.sign()`: <https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign> | WebCrypto `sign()` is secure-context only, supports sign/verify, documents Ed25519, and notes HMAC uses the same secret key for signing and verification. | ADR-0115's app-managed Ed25519 evidence envelope is technically plausible but still needs browser conformance tests. ADR-0116's internal server HMAC proof is correctly scoped as server/internal proof, not a public client signature. | High |
| W3C WebAuthn Level 3: <https://www.w3.org/TR/webauthn-3/> | Relying parties must validate credential/assertion origin and reject unexpected origins. WebAuthn is a ceremony for public-key credentials and relying-party authentication, not a general gameplay command-signing channel. | ADR-0115's split is correct: passkeys stay login, recovery, device-linking or high-value ceremony only; normal gameplay command evidence uses a separate app-managed key. | High |
| RFC 8785 JSON Canonicalization Scheme: <https://www.rfc-editor.org/rfc/rfc8785> | JCS defines a deterministic JSON representation using I-JSON constraints, property sorting and no emitted whitespace. | ADR-0115's JCS-style canonical signed bytes are a defensible default for command evidence until a future ADR/version bump chooses another canonical byte format. | High |
| Steamworks Leaderboards: <https://partner.steamgames.com/doc/features/leaderboards> | Steamworks supports "Trusted" leaderboard writes where clients cannot set scores directly; writes go through WebAPI. | Public FMX surfaces can require server-verified or imported-verified histories. Client-local saves remain playable, but public HoF/leaderboard eligibility is a server-derived gate. | High for comparable-game/platform pattern |
| Stripe API idempotent requests: <https://docs.stripe.com/api/idempotent_requests> | Stripe stores the first result for an idempotency key and returns that result for same-key retries; it errors if parameters differ. | ADR-0115/ADR-0119's command replay/dedup semantics match mature distributed-system practice: same ID and same binding can return the first outcome; same ID with different payload/binding is misuse and must reject. | High for distributed API pattern |

## Local FMX evidence checked

| FMX evidence | Relevant finding | Closure implication |
|---|---|---|
| [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]] | Accepted, binding and addresses PM-2026-05-20-05-F-02. It defines server authority, command envelope, passkey split, app-managed Ed25519 device key strategy, invalid signature handling and canonical signed bytes. | Covers FMX-105 command signing/replay intent. No new ADR is needed for the authority decision. |
| [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]] | Accepted, binding and addresses PM-2026-05-20-05-F-01. It defines `SaveTrustLevel`, `PublicEligibility`, server provenance proof coverage, public feature gates, import verification, strict downgrade policy, player-facing framing and proof cadence. | Covers FMX-105 trust-level, provenance, import/export and public eligibility intent. |
| [[../security-adr-reference-hygiene-2026-06-17]] | FMX-182 confirms old ADR-0026/0028 security placeholders are invalid and maps command integrity to ADR-0115 and save trust/provenance to ADR-0116. | Confirms FMX-105 should close as reference/ownership drift, not spawn another ADR. |
| [[../pre-mortem/findings-registry]] | 05-F-01 and 05-F-02 are `mitigated` with accepted homes ADR-0116 and ADR-0115. | The pre-mortem risks are conceptually addressed, not implementation-complete. |

## Source-check conclusion

- FMX-105 can close without a new architecture decision.
- ADR-0115 is the accepted command integrity/replay-protection home.
- ADR-0116 is the accepted save trust/provenance and public-eligibility home.
- The Perplexity run's residual gaps are implementation/detail follow-ups unless
  Nico wants a new narrow issue for mixed-provenance state-machine specificity.
- Source quality is acceptable only after discarding the raw Perplexity citation
  list and relying on the primary/current checks above.
