---
title: FMX-173 Argon2id KDF Validation Decision Queue
status: accepted
tags: [execution, decision-queue, fmx-173, argon2id, kdf, wasm, security, save-format, accepted]
created: 2026-06-19
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-173
owner: Nico
related:
  - [[../60-Research/argon2id-wasm-kdf-validation-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-173-argon2id-wasm-kdf-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-173-argon2id-wasm-source-checks-2026-06-19]]
  - [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
---

# FMX-173 Argon2id KDF Validation Decision Queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-173.


## Context

ADR-0098 already chooses the split KDF direction: PBKDF2-SHA256 @ 600k stays on
the high-entropy device-backup hot path, while the portable-export passphrase
path moves to Argon2id WASM behind `kdfAlgo` and `argon2idParams`.

FMX-173 does not ratify a provider or parameter profile. It provides the
source-checked options Nico needs before implementation can pin a dependency or
ship the export/import path.

## D1 - Argon2id provider for the first code-phase spike

| Option | Description | Trade-off |
|---|---|---|
| **A - `hash-wasm@4.12.0`** | Exact-pin `hash-wasm@4.12.0`; use `argon2id` with binary 32-byte output; run dependency/security/perf review in code phase. | Best docs/source-check result: documented API, KiB memory units, zero runtime deps, Web Worker support, modular Argon2 bundle. It is still an external dependency and needs audit. |
| B - internal Argon2id-only WASM build | Build from a reputable Argon2 implementation and own compiler/memory/zeroization path. | Highest control and auditability, but higher engineering cost and build-chain responsibility. |
| C - `@rabbit-company/argon2id@2.1.0` | Use the Argon2id-specific Rust/WASM package. | Smaller/narrower package, but thinner docs and less established surface than `hash-wasm`. |
| D - `argon2-browser` / `argon2-wasm` | Use older browser Argon2 packages. | Rejected: latest observed releases are 2021 and 2018 respectively. |

Recommendation: **A** for the first spike, with **B** as fallback if review
rejects `hash-wasm`.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D2 - Parameter policy

| Option | Description | Trade-off |
|---|---|---|
| **A - OWASP floor plus upward-only strengthening** | Minimum `memoryKiB=19456`, `iterations=2`, `parallelism=1`, `hashLength=32`; allow stronger params only when target-device measurement passes; store params per export. | Keeps a defensible floor and avoids silent security downgrades. Some floor devices may fail and block export until decided. |
| B - adaptive profile with downward compatibility mode | Start at OWASP floor but reduce below it on slow devices. | Better availability on weak devices, but weakens the one brute-forceable secret and needs explicit user/security messaging. |
| C - fixed higher profile | Pin 64 MiB+ and 2-3 iterations for everyone. | Stronger but likely over-stresses Floor Android/iOS and may break portable export on target devices. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D3 - Benchmark gate before release

| Option | Description | Trade-off |
|---|---|---|
| **A - target-device Worker gate** | Require Web Worker benchmarks on Standard and Floor Android/iOS representatives before portable export is release-ready. Standard target p95 <= 1000 ms; Floor target p95 <= 1500 ms; no main-thread long task; no memory kill. | Honest evidence and aligns with `performance-budgets`. Requires real devices or a credible device lab before code-phase release. |
| B - CI-only synthetic gate | Run benchmark only on CI runner/browser. | Easy and automatable, but does not validate low-end mobile memory/thermal constraints. |
| C - no pre-release gate | Tune later from telemetry. | Rejected: ships an unvalidated security/UX dependency on the export path. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D4 - PWA loading and offline contract

| Option | Description | Trade-off |
|---|---|---|
| **A - lazy chunk, offline-available after install** | Keep Argon2id out of initial app shell and at-rest hot path; load only on export/import; precache the actual emitted chunk/WASM artifact for offline PWA use. | Best balance: no hot-path cost, still offline-capable. Requires code-phase bundler/SW verification. |
| B - eager initial bundle | Put Argon2id in the initial shell. | Simpler offline guarantee, but wastes initial JS/parse budget for rare flows. |
| C - network fetch on first export/import | Download on demand only. | Rejected for offline-first portable export. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D5 - Failure/fallback behavior

| Option | Description | Trade-off |
|---|---|---|
| **A - fail closed and escalate** | If Argon2id module load or OWASP-floor benchmark fails, portable export is unavailable on that device/version until Nico approves a fallback. | Security-honest and avoids hidden downgrade. Can frustrate Floor users. |
| B - explicit degraded PBKDF2 fallback | Offer PBKDF2 portable export with prominent "reduced protection" copy and `kdfAlgo='pbkdf2-sha256'`. | More available, but reopens ADR-0098 D1 and weakens the brute-forceable secret. |
| C - lower Argon2id below OWASP floor | Keep Argon2id label but reduce memory/iterations. | Rejected unless explicitly approved; misleading if presented as equivalent. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## D6 - Passphrase byte contract

| Option | Description | Trade-off |
|---|---|---|
| **A - NFKC normalize then UTF-8 encode** | Normalize the user-entered passphrase with NFKC before KDF; document this as the portable-export contract. | Reduces visually-identical Unicode import failures. Permanently defines a compatibility rule. |
| B - raw UTF-8 bytes exactly as entered | No normalization. | Simplest, but visually identical strings can fail to unlock. |
| C - ASCII-only passphrases | Avoid Unicode ambiguity. | Poor UX/localisation fit and unnecessary constraint. |

Recommendation: **A**.

Decision: **Accepted by Nico on 2026-06-19; see approved packet below.**

## Required follow-up after Nico decision

- Patch ADR-0098 with the accepted provider/profile/fallback/passphrase rules.
- If D1 selects a package, exact-pin it in code phase and capture lockfile,
  integrity, SBOM and dependency-review evidence.
- Build a Worker benchmark harness and add the floor/standard device evidence
  before portable export is marked release-ready.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=A first spike with B fallback if review rejects hash-wasm, D2=A, D3=A, D4=A, D5=A, D6=A**.

No open Nico decision remains for FMX-173.

## Related

- [[../60-Research/argon2id-wasm-kdf-validation-2026-06-19]]
- [[../60-Research/raw-perplexity/raw-fmx-173-argon2id-wasm-kdf-2026-06-19]]
- [[../60-Research/raw-perplexity/raw-fmx-173-argon2id-wasm-source-checks-2026-06-19]]
- [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
