---
title: Raw Source Checks - FMX-173 Argon2id WASM KDF Validation
status: raw
tags: [raw, source-check, fmx-173, argon2id, hash-wasm, kdf, owasp, rfc9106, pwa, wasm]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-173
sourceType: primary-docs
related:
  - [[../argon2id-wasm-kdf-validation-2026-06-19]]
  - [[raw-fmx-173-argon2id-wasm-kdf-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
---

# Raw Source Checks - FMX-173 Argon2id WASM KDF Validation

## Context7 - `hash-wasm`

Source:

- Context7 library id: `/daninet/hash-wasm`

Findings:

- Context7 resolved `hash-wasm` to `/daninet/hash-wasm` with high source
  reputation and benchmark score 96.4.
- The `argon2id` API supports `password`, `salt`, optional `secret`,
  `iterations`, `parallelism`, `memorySize`, `hashLength` and `outputType`.
- `memorySize` is in KiB.
- Output types are `hex`, `binary` and `encoded`; `encoded` is PHC-style and
  includes parameters for verification.
- `argon2Verify` is documented for encoded hashes.

FMX implication:

- `hash-wasm` maps cleanly to ADR-0098's `argon2idParams` shape. For FMX's
  AES-GCM key derivation, `outputType: 'binary'` with `hashLength: 32` is the
  likely implementation target; `encoded` is useful for tests/interoperability
  but FMX already stores explicit envelope params.

## Ref / upstream README - `hash-wasm`

Source:

- `https://github.com/Daninet/hash-wasm/blob/master/README.md`

Findings:

- README describes `hash-wasm` as a browser/Node/Deno WebAssembly hashing
  library.
- Supported algorithms table lists Argon2d, Argon2i and Argon2id v1.3 with an
  11 kB gzipped Argon2 bundle.
- Features include modular per-algorithm WASM binaries, base64-bundled WASM
  modules, tree-shaking, Web Worker support, TypeScript definitions, zero
  dependencies, unit tests and transparent GitHub Actions build process.
- Browser support table: Chrome 57+, Safari 11+, Firefox 53+, Edge 16+, IE not
  supported.
- Argon2 benchmark in the README uses desktop Chrome v131 on Ryzen 9 7900X with
  m=512, t=8, p=1; hash-wasm is faster than `argon2-browser` and `argon2-wasm`
  in that narrow desktop benchmark.
- README warns that string inputs can have multiple UTF-8 representations and
  recommends normalization before hashing.
- README warns that resumable saved hash state can contain plaintext input and
  must be protected. FMX should not serialize KDF intermediate state.

FMX implication:

- This corrects Perplexity's "generic/heavy" concern: Argon2 is modular and
  small enough for lazy export/import loading.
- The benchmark is useful for candidate ranking only; it is not FMX device
  validation because it is desktop, low-memory and not the target 19 MiB+ KDF
  profile.
- Passphrase normalization needs an explicit Nico decision because it changes
  what byte string the user must re-enter on import.

## GitHub releases / npm registry - `hash-wasm`

Sources:

- `https://github.com/Daninet/hash-wasm/releases`
- `https://api.github.com/repos/Daninet/hash-wasm/releases/latest`
- `https://registry.npmjs.org/hash-wasm/latest`

Findings:

- Latest GitHub release: `v4.12.0`, published 2024-11-19, commit
  `373b796205ab55fb4a657374dad6ea589bf75815`.
- Release notes include CRC changes, exported types, benchmark updates,
  dependency/Clang updates and migration to Biome.
- npm `latest` is `hash-wasm@4.12.0`.
- npm package has no runtime dependency list, MIT license, `sideEffects: false`,
  types, UMD and ESM entries.
- npm tarball integrity observed:
  `sha512-+/2B2rYLb48I/evdOIhP+K/DD2ca2fgBjp6O+GBEnCDk2e4rpeXIK8GvIyRPjTezgmWn9gmKwkQjjx6BtqDHVQ==`.
- Unpacked npm size observed: 1,799,970 bytes; file count 127.

FMX implication:

- Candidate A can be exact-pinned to `hash-wasm@4.12.0`.
- Final adoption still needs dependency-review checks in code phase: lockfile
  integrity, SBOM/provenance, supply-chain review and a Web Worker benchmark.

## `@rabbit-company/argon2id`

Sources:

- `https://registry.npmjs.org/%40rabbit-company%2Fargon2id/latest`
- `https://api.github.com/repos/Rabbit-Company/Argon2id-WASM/releases/latest`

Findings:

- npm `latest` is `@rabbit-company/argon2id@2.1.0`.
- GitHub latest release tag is `v2.1.0`, published 2024-09-19.
- Package is Argon2id-specific, MIT, ESM, browser field points to the module
  entry, built with Rust/WASM tooling.
- npm unpacked size observed: 174,664 bytes.
- README exposes positional parameters; docs are thinner than `hash-wasm` and
  the memory-cost unit is less clear from the README alone.
- Single-package/single-maintainer surface appears narrower and less documented
  than `hash-wasm`.

FMX implication:

- Viable fallback if Nico strongly prefers an Argon2id-only package, but not
  the default recommendation without an audit and unit/perf spike.

## Legacy candidates - `argon2-browser` and `argon2-wasm`

Sources:

- `https://registry.npmjs.org/argon2-browser/latest`
- `https://registry.npmjs.org/argon2-browser`
- `https://registry.npmjs.org/argon2-wasm/latest`
- `https://registry.npmjs.org/argon2-wasm`

Findings:

- `argon2-browser` latest is `1.18.0`, published 2021-06-05; registry modified
  2022-04-11. README still shows older browser benchmark context and Webpack
  examples. It does support Argon2id and notes KeeWeb usage, but the package is
  stale for a 2026 greenfield decision.
- `argon2-wasm` latest is `0.9.0`, published 2018-11-15; registry modified
  2022-04-11. README defaults to Argon2d and is historical.

FMX implication:

- Both are rejected as primary FMX candidates. They are useful only as history
  or as benchmark comparison rows in the `hash-wasm` README.

## `@noble/hashes`

Sources:

- `https://registry.npmjs.org/@noble%2Fhashes/latest`
- `https://api.github.com/repos/paulmillr/noble-hashes/releases/latest`
- `https://github.com/paulmillr/noble-hashes/blob/main/README.md?plain=1#L322#argon2`

Findings:

- npm `latest` is `@noble/hashes@2.2.0`, published 2026-04-11, with npm
  provenance/attestation metadata.
- It exports `argon2id` from `@noble/hashes/argon2.js` and references RFC 9106.
- Upstream README warns that Argon2 cannot be fast in JS and suggests using
  scrypt instead because JS is slower than native code.

FMX implication:

- Strong general crypto library and useful cross-check, but not suitable as the
  primary FMX answer because FMX-173 specifically needs browser WASM Argon2id.

## OWASP Password Storage Cheat Sheet

Source:

- `https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html`

Findings:

- OWASP recommends Argon2id as the balanced Argon2 variant and lists a minimum
  Argon2id profile of 19 MiB memory, 2 iterations and parallelism 1.
- OWASP lists PBKDF2-HMAC-SHA-256 at 600,000 iterations as the FIPS-style
  fallback.
- OWASP frames the work factor as a balance between security and performance
  and says the optimum must be tested in the application's environment.
- OWASP lists equal-defense Argon2id profiles, including `m=47104,t=1,p=1`,
  `m=19456,t=2,p=1` and lower-memory/higher-iteration rows.

FMX implication:

- The FMX portable-export floor profile should not go below
  `memoryKiB=19456`, `iterations=2`, `parallelism=1` without an explicit Nico
  exception.
- PBKDF2 @ 600k remains justified for the high-entropy device-backup path and
  is not the preferred user-passphrase KDF.

## RFC 9106 - Argon2

Source:

- `https://www.rfc-editor.org/rfc/rfc9106.html`

Findings:

- RFC 9106 defines Argon2id as a hybrid variant and a recommended option when
  side-channel exposure or attack model is uncertain.
- The parameter model is memory size, iterations, parallelism and tag length.
- RFC parameter guidance is intentionally hardware/resource dependent and
  includes much larger memory profiles for high-security environments.

FMX implication:

- RFC 9106 supports Argon2id as the right variant, but OWASP's minimum is the
  more practical browser/PWA floor. FMX should record params per export and
  benchmark target devices instead of hardcoding desktop-only profiles.

## MDN browser API checks

Sources:

- `https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API`
- `https://developer.mozilla.org/en-US/docs/Web/API/Performance/now`
- `https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Loading_and_running`

Findings:

- Web Crypto is available only in secure contexts and is a low-level crypto API
  where misuse is easy; review is mandatory.
- Web Crypto is available in Web Workers, which supports keeping KDF work off
  the main thread.
- `performance.now()` is a monotonic high-resolution timing source suitable for
  local benchmark measurement.
- WebAssembly APIs support instantiate/loading flows, but `hash-wasm` bundles
  WASM as base64 strings, so FMX's PWA concern is the module/chunk being
  precached/offline-available rather than a separate `.wasm` network fetch.

FMX implication:

- The KDF gate must run in a Worker and be measured with a repeatable harness.
- Export/import must not block first-load or matchday hot paths.
- Installed/offline PWA mode must already have the Argon2id chunk available
  before claiming portable export works offline.

## Bitwarden official KDF documentation

Source:

- `https://bitwarden.com/help/kdf-algorithms/`

Findings:

- Bitwarden's user-facing KDF docs expose PBKDF2 and Argon2id settings and
  explicitly frame KDFs as defenses that make master-password brute force more
  expensive.
- Bitwarden is not FMX's architecture source, but it is a strong comparable
  product for "encrypted local export/vault protected by user passphrase" UX.

FMX implication:

- Portable saves should be described like encrypted vault exports: local
  passphrase, no recovery if forgotten, file can be attacked offline if stolen,
  and stronger/longer passphrases matter.

## Comparable-product notes

- KeeWeb / KeePass-style browser vault precedent is useful because
  `argon2-browser` documents KeeWeb usage and a vault-file model. The source is
  not enough to make `argon2-browser` current, but it supports the UX analogy:
  offline file, local KDF, no server recovery.
- Ordinary game save exports are weak precedent for cryptographic KDF choice.
  They can inform simple import/export UX only. FMX's encrypted portable save is
  closer to a password-manager export than a cheat-resistant or share-code game
  save.
