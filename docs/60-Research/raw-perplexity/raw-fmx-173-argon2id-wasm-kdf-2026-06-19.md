---
title: Raw Perplexity - FMX-173 Argon2id WASM KDF Validation
status: raw
tags: [raw, perplexity, fmx-173, argon2id, kdf, wasm, security, pwa, save-format]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-173
sourceType: perplexity
related:
  - [[../argon2id-wasm-kdf-validation-2026-06-19]]
  - [[raw-fmx-173-argon2id-wasm-source-checks-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
---

# Raw Perplexity - FMX-173 Argon2id WASM KDF Validation

## Prompt 1 - Candidate libraries, parameters and PWA gate

> FMX-173 research task: Validate Argon2id WASM for a browser/PWA
> portable-export passphrase KDF path in 2026. We need candidate
> implementations and exact latest stable versions (especially hash-wasm,
> argon2-browser, argon2-wasm or better alternatives), OWASP/RFC-aligned
> parameter profiles for low-end Android/browser clients, mobile
> latency/performance gate design, bundle/offline/PWA lazy-load guidance, risks,
> and decision questions for a lead architect. Existing FMX posture:
> PBKDF2-SHA256 600k remains for high-entropy device-backup hot path; portable
> export user passphrase should use Argon2id behind kdfAlgo plus
> argon2idParams; no envelopeVersion bump unless truly required. Provide clear
> recommendation and cite sources.

## Perplexity output 1 - Raw findings to source-check

Perplexity's main answer:

- Argon2id in browser/PWA is viable when using a maintained WASM binding,
  mobile-constrained parameters and an adaptive device gate.
- It agreed with FMX's split posture: PBKDF2 can remain on the high-entropy
  device-backup hot path, while portable export adds `kdfAlgo = 'argon2id'`
  plus explicit `argon2idParams`.
- It recommended avoiding stale browser packages such as `argon2-browser`
  and `argon2-wasm`.
- It surfaced `@rabbit-company/argon2id` as a newer Argon2id-specific WASM
  candidate and also suggested an internal Argon2id WASM build from PHC
  reference Argon2 or libsodium.
- It treated `hash-wasm` as a candidate but initially called it a generic
  multi-algorithm bundle that needed direct source checking. Source checks
  later corrected that: upstream `hash-wasm` documents modular per-algorithm
  WASM, tree shaking, zero dependencies and an 11 kB gzipped Argon2 module.
- Parameter direction: maximize memory within a user-visible latency cap,
  keep `p=1` or low parallelism on mobile, and store params per envelope.
- Suggested practical bands: mobile around 32-64 MiB, t=2-3, p=1-2; desktop
  128-256 MiB, t=2, p based on cores. These are not official browser
  standards and need FMX's device benchmark gate.
- Suggested a calibration run with a smaller profile, then choose a profile
  that fits a 600-1000 ms target and no more than roughly 1.5-2 s on low-end
  devices.
- PWA guidance: split the Argon2id code/WASM into an export/import-only chunk,
  make it available offline through install/precache, and never make first-use
  export depend on a live network fetch.
- Risks: JS/WASM memory hygiene, side-channel exposure, user passphrase
  entropy, stale library maintenance, fallback weakening, and legacy-client
  fail-fast behavior.

Perplexity's cited sources included:

- `https://github.com/Rabbit-Company/Argon2id-WASM`
- `https://www.npmjs.com/package/argon2-browser`
- `https://pkg.go.dev/golang.org/x/crypto/argon2`
- `https://platform.uno/blog/the-state-of-webassembly-2025-2026/`
- `https://discuss.privacyguides.net/t/argon2id/36842`
- Reddit / YouTube links

Source-check disposition:

- Rabbit and npm candidate metadata were useful only after direct npm/GitHub
  checks.
- The Go package is not a browser/WASM source; use RFC 9106 and OWASP instead.
- Community discussion, Reddit, YouTube and generic WebAssembly blog links are
  weak for FMX canonical decisions and were not promoted as authority.
- Perplexity did not have reliable direct evidence for `hash-wasm`; Context7,
  Ref, npm registry and GitHub release metadata filled that gap.

## Prompt 2 - Real-world and game/product precedents

> For a football manager PWA portable save export protected by a user
> passphrase, what real-world/comparable-product precedents should inform KDF
> choice and UX? Compare password-manager/vault exports, browser-based vaults
> such as KeeWeb/KeePass web, and game save export/sharing patterns. Focus on
> Argon2id or memory-hard KDFs, passphrase entropy UX, offline import/export,
> and whether game saves provide useful precedent. Provide sources and flag weak
> citations.

## Perplexity output 2 - Raw findings to source-check

Perplexity's main answer:

- Treat the encrypted portable save like a small password-manager-style vault,
  not like a typical game save.
- Password-manager/vault export patterns are the useful comparison: local
  passphrase, offline derivation/decryption, irrecoverable-if-forgotten UX,
  explicit KDF params stored in the file and passphrase-strength guidance.
- Game save sharing is weak precedent for KDF decisions because typical game
  saves optimize convenience, anti-tamper or cheat resistance rather than
  long-term offline brute-force resistance.
- It referenced Bitwarden encrypted exports and KeePass/KeeWeb-style vaults as
  comparable products, but some of the Bitwarden/KeeWeb details came from
  community sources and were downgraded unless source-checked separately.
- It recommended Diceware/passphrase wording, a strength meter, and explicit
  copy that FMX cannot recover a forgotten portable-export passphrase.
- It said the formal literature for game-save encryption is thin; game
  precedent can inform export/import usability, not cryptographic KDF choice.

Perplexity's cited sources included:

- `https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html`
- `https://www.rfc-editor.org/info/rfc9106/`
- `https://www.reddit.com/r/Bitwarden/...`
- `https://community.bitwarden.com/t/argon2id-settings/66626`
- `https://arxiv.org/html/2504.17121v1`
- miscellaneous blog/video/community links

Source-check disposition:

- OWASP and RFC 9106 were promoted as primary/security guidance.
- Bitwarden official KDF documentation was checked separately for
  real-world-vault precedent; community and Reddit links were treated as weak.
- The game-save conclusion remains an inference: useful for UX comparison, not
  for security authority.
