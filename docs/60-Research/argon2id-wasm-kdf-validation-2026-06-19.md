---
title: Argon2id WASM KDF Validation Packet
status: draft
tags: [research, fmx-173, argon2id, kdf, wasm, pwa, security, save-format, mobile-performance]
context: audit-security
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-173
sourceType: synthesis
related:
  - [[raw-perplexity/raw-fmx-173-argon2id-wasm-kdf-2026-06-19]]
  - [[raw-perplexity/raw-fmx-173-argon2id-wasm-source-checks-2026-06-19]]
  - [[../40-Execution/fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]
  - [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
  - [[../10-Architecture/11-Risks]]
  - [[../10-Architecture/10-Quality]]
  - [[performance-budgets]]
---

# Argon2id WASM KDF Validation Packet

## Question

Can FMX safely use Argon2id WASM for the portable-export passphrase KDF path
defined by ADR-0098, and what provider, parameters and benchmark gate should
Nico approve before implementation?

## Short answer

Yes, with a decision gate. Source checks support an Argon2id WASM export/import
path, but FMX has not yet run real target-device benchmarks. This packet
therefore replaces the vague "validate before adoption" risk with a concrete,
non-binding validation gate:

- recommended provider for the code-phase spike: exact-pin `hash-wasm@4.12.0`;
- rejected primary candidates: `argon2-browser@1.18.0` and `argon2-wasm@0.9.0`
  due stale publish history;
- fallback candidates: `@rabbit-company/argon2id@2.1.0` after audit, or an
  internal Argon2id-only WASM build if `hash-wasm` fails review;
- minimum profile: OWASP floor `memoryKiB=19456`, `iterations=2`,
  `parallelism=1`, `hashLength=32`, salt 16 or 32 bytes;
- adoption gate: run in a Web Worker, keep WASM off all hot save/load paths,
  and pass the standard/floor device latency/memory checks before a portable
  export release can claim Argon2id support.

This does not change ADR-0098's versioning posture: no `envelopeVersion` bump is
required if the envelope already carries `kdfAlgo='argon2id'` and authenticated
`argon2idParams`. Existing PBKDF2 portable exports remain readable through the
`kdfAlgo` branch.

## Findings

### Provider candidates

| Candidate | Latest checked | Fit | Disposition |
|---|---:|---|---|
| `hash-wasm` | `4.12.0` (GitHub release and npm latest, 2024-11-19) | Argon2d/i/id v1.3, documented API, KiB memory parameter, binary/hex/PHC output, zero runtime deps, Web Worker support, modular 11 kB gzipped Argon2 bundle | **Recommended for code-phase spike** |
| `@rabbit-company/argon2id` | `2.1.0` (npm/GitHub, 2024-09-19) | Argon2id-specific Rust/WASM package, smaller package, but thinner docs and positional parameter API | Fallback if Nico wants Argon2id-only dependency and audit passes |
| internal Argon2id-only WASM | n/a | Maximum control over compiler, memory wiping and audit surface | Fallback if dependency review rejects external packages |
| `argon2-browser` | `1.18.0` (published 2021-06-05) | Historically relevant, browser Argon2 support, KeeWeb precedent | Reject as primary due staleness |
| `argon2-wasm` | `0.9.0` (published 2018-11-15) | Historical Argon2 WASM wrapper, default docs show Argon2d | Reject as primary due staleness |
| `@noble/hashes` | `2.2.0` (2026-04-11) | Strong audited JS crypto package, includes Argon2id, provenance metadata | Reject for this issue because upstream warns Argon2 is slow in JS and FMX needs WASM |

Recommendation: approve `hash-wasm@4.12.0` as the first implementation spike
candidate, exact-pinned with npm integrity and SBOM evidence. Keep
`@rabbit-company/argon2id@2.1.0` and an internal build as fallback paths if the
code-phase audit finds bundle, CSP, Worker, memory or supply-chain concerns.

### Parameter floor and performance gate

OWASP's practical floor is:

```ts
argon2idParams: {
  memoryKiB: 19_456,
  iterations: 2,
  parallelism: 1,
  hashLength: 32,
  saltBytes: 16 | 32,
}
```

FMX should not silently go below that floor. If this profile fails target
devices, the correct result is a decision escalation, not a hidden downgrade to
PBKDF2 or a weaker Argon2id profile.

Proposed release gate:

| Device tier | Gate |
|---|---|
| Standard Android representative from `performance-budgets` (Galaxy A34/A54, Pixel 6a/7a class) | OWASP floor p95 <= 1000 ms in a Worker; no main-thread long task; worker heap remains inside tier budget |
| Floor Android representative (Galaxy A12/A21s, Redmi 9/9A class) | OWASP floor p95 <= 1500 ms in a Worker; no app-shell crash/reload; only one heavy Worker active |
| iOS Standard/Floor representatives (iPhone 11/SE3 and iPhone XS/XR class) | Same latency class; Safari/iOS memory pressure must not kill the PWA |
| Desktop | May use a stronger profile only if the chosen params are stored per export and imports remain deterministic |

The benchmark harness should:

- run in the same Worker shape planned for export/import;
- use `performance.now()` for monotonic timing;
- run at least one warm-up plus multiple measured derivations;
- measure latency, Worker heap/process memory where browser tooling allows,
  failure modes and UI responsiveness;
- record user agent family, device tier and chosen params in the evidence note;
- never persist passphrases, salts, keys or hash state;
- run before code-phase portable export is marked release-ready.

### PWA/offline loading

Argon2id WASM must be export/import-only:

- no KDF WASM in the initial app shell;
- no KDF WASM on the at-rest device-backup decrypt hot path;
- lazy-load the KDF module when entering export/import;
- ensure the installed PWA has the module/chunk available offline before the UI
  offers offline portable export/import;
- run KDF work in a Web Worker;
- fail closed if the module cannot load, with a clear "portable export is not
  available on this device/version" message rather than falling back silently.

`hash-wasm` bundles its WASM modules as base64 strings, so the operational
artifact to precache is likely the JS chunk, not a separate `.wasm` file. The
code-phase implementation must verify the actual bundler output before writing
the service-worker rule.

### Comparable products

This feature is closer to password-manager/vault export than to ordinary game
save sharing:

- Password managers and KeePass/KeeWeb-style vaults use a local passphrase,
  store KDF params with the protected file and make "forgotten passphrase =
  unrecoverable" explicit.
- Bitwarden's official KDF docs show a user-visible PBKDF2/Argon2id KDF model
  and frame KDFs as offline brute-force cost controls.
- Game save export/sharing patterns are useful for simple UX affordances only.
  They are weak precedent for cryptographic KDF choice because most game saves
  optimize convenience, anti-cheat or anti-tamper rather than long-term
  passphrase-derived confidentiality.

FMX copy should therefore name the file as an encrypted portable save, explain
that a stolen file can be attacked offline, encourage a long random-word
passphrase and state that FMX cannot recover it.

### Passphrase bytes and normalization

`hash-wasm` warns that visually equivalent Unicode strings can produce different
UTF-8 byte sequences unless normalized. FMX needs a contract before users create
portable exports:

- either normalize the passphrase string to NFKC before UTF-8 encoding and say
  so in the spec, or
- treat exact raw UTF-8 bytes as the contract and accept that visually identical
  input can fail on import.

Recommendation: NFKC normalize before KDF, but this needs Nico approval because
it affects import compatibility forever.

## Decision inputs

Recommended answers for Nico are recorded in
[[../40-Execution/fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]:

- D1 provider: A, `hash-wasm@4.12.0` spike first.
- D2 parameter policy: A, OWASP floor as the minimum plus optional upward-only
  stronger profiles after device measurement.
- D3 benchmark gate: A, target-device Worker gate before release.
- D4 PWA loading: A, lazy export/import chunk but offline-available after install.
- D5 fallback: A, fail closed and escalate rather than silent downgrade.
- D6 passphrase normalization: A, NFKC then UTF-8 bytes.

## Related

- [[raw-perplexity/raw-fmx-173-argon2id-wasm-kdf-2026-06-19]]
- [[raw-perplexity/raw-fmx-173-argon2id-wasm-source-checks-2026-06-19]]
- [[../40-Execution/fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]
- [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
- [[../10-Architecture/11-Risks]]
- [[../10-Architecture/10-Quality]]
- [[performance-budgets]]
