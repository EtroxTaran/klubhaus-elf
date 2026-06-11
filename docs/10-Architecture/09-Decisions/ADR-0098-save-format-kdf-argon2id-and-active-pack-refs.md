---
title: ADR-0098 Save-format KDF upgrade (Argon2id passphrase path) + active-pack refs in SavePayload
status: accepted
tags: [adr, save, encryption, kdf, argon2id, pbkdf2, community-packs, determinism, offline-first, p2p, supersession]
created: 2026-06-08
updated: 2026-06-11
type: adr
binding: false
amends: [[ADR-0005-save-format]]
  - [[ADR-0005-save-format]]
superseded_by:
related:
  - [[ADR-0005-save-format]]
  - [[ADR-0016-community-dataset-overrides]]
  - [[ADR-0059-community-overlay-pipeline-context]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0002-offline-first]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../50-Game-Design/GD-0014-save-career-model]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0098: Save-format KDF upgrade (Argon2id passphrase path) + active-pack refs in SavePayload

## Status

accepted

> Adopted `accepted` 2026-06-08 — authored and ratified in the same sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`draft` / `binding: false`.** Authored 2026-06-08. This ADR **supersedes
> [[ADR-0005-save-format]]** on exactly two points — the passphrase-path KDF (ADR-0005 §3)
> and the `SavePayload` shape (ADR-0005 §6) — and leaves all other ADR-0005 rules
> (AES-GCM 256, AAD binding, gzip-then-encrypt, three-version model, lifecycle, restore
> flows) intact. It **does not edit ADR-0005** (supersession is expressed only here, via
> `supersedes:` frontmatter). Per the decision gate
> ([[../../90-Meta/collaboration-and-decision-protocol]]) nothing here is accepted;
> awaiting Nico's ratification of D1 (passphrase KDF) and D2 (missing-pack import).

## Date

2026-06-08

## Context

Two independent gaps in the still-binding save contract surfaced during the 2026-06
audit. Both touch the **offline-first / P2P-share** path that ADR-0005 explicitly exists to
serve, and both are determinant for a friend reloading a save they were handed.

### Gap 1 — KDF on the only brute-forceable secret is now off OWASP's preferred default

ADR-0005 §3 mandates **PBKDF2-SHA256 @ 600 000 iterations** for both key paths and §3's
"Rejected alternatives" explicitly rejects **Argon2id via WASM** ("marginal gain … PBKDF2
at 600 k is sufficient defence in 2026"). The compliance block restates this as a MUST.

The two key paths are not the same threat, though:

- **Device-backup key** is derived from a high-entropy `accountSecret` + per-device salt.
  An attacker needs the file *and* the account/device secret; PBKDF2's GPU-resistance is
  not the binding constraint, and it runs natively in Web Crypto on the hot at-rest
  decrypt path.
- **Portable-export key** is derived from a **user-entered passphrase** — the *only*
  brute-forceable secret in the system, and the one that travels P2P to a friend (ADR-0005
  §1 "Portable export", ADR-0016 P2P distribution).

2026 OWASP guidance makes **Argon2id the preferred KDF for user-entered passwords**
(memory-hard, GPU/ASIC-resistant), with PBKDF2-SHA256 @ ≥ 600 000 retained mainly as the
FIPS/legacy fallback (OWASP Password Storage Cheat Sheet, confirmed via Perplexity
2026-06-08; see Sources). PBKDF2 is the *only* KDF native to browser Web Crypto; Argon2id
needs a WASM build. Crucially, **the envelope already anticipated this swap**: ADR-0005 §5
carries a `kdfAlgo: 'pbkdf2-sha256'` field and §"Future" states "Argon2id can replace
PBKDF2 in a later envelope-v2". This ADR is that follow-on — but argues the swap belongs
*only* on the passphrase path, not the device path, and does **not** require an
`envelopeVersion` bump (the `kdfAlgo` discriminator already covers it).

### Gap 2 — SavePayload omits the active-pack refs that ADR-0016/0059 make save-immutable determinants

[[ADR-0016-community-dataset-overrides]] §Implementation: *"Save records active packs +
versions; load-time mismatch is surfaced."* [[ADR-0059-community-overlay-pipeline-context]]
makes this a **per-save, immutable-at-save-creation** `ActivePacksSnapshot` and a
determinism rule (pack activation is save-creation-only; the running save never re-reads
the mutable registry; per ADR-0051). Community overrides change club/competition/rivalry
identity and seeds — i.e. they are inside the deterministic boundary
([[../../60-Research/determinism-and-replay]]).

But ADR-0005 §6 `SavePayload` has **no `activePacks` field**. For an at-rest save this is
latent (the pack registry lives in the same device's platform DB). For a **portable export
handed to a friend** it is a real loadability/determinism hole: the friend's device has no
`PackRegistry` row for those packs, so the import path (ADR-0005 §11) Zod-parses a payload
whose IDs reference packs that do not exist locally, and the save either fails to provision
or — worse — silently loads a different world than the author's. ADR-0059's `ActivePacksInSave`
read model and its immutability guarantee are undermined the moment the snapshot leaves the
device, because the *snapshot reference* never made it into the portable envelope's payload.

### Why now (not "implementation detail")

The `kdfAlgo` envelope discriminator and the `SavePayload` Zod shape are **contract
surface**, not code: a save written today with `kdfAlgo: 'pbkdf2-sha256'` and no
`activePacks` field is a wire format we would have to migrate later. ADR-0005's MVP timing
is amended by [[ADR-0020-hybrid-online-mvp-offline-ready]] (export/import lands post-MVP),
but ADR-0020 also says *"MVP code must still avoid storage or schema choices that block this
contract."* Designing both fields now is exactly that hygiene. `ManifestSchema` /
`activePacks` validation ties to [[ADR-0027-postgres-data-model]] Zod + `CHECK` bounds
(same as every other SavePayload field).

## Options considered

### D1 — Passphrase-path KDF

- **A (RECOMMENDED).** **Split the paths.** Keep **PBKDF2-SHA256 @ 600 k** for the
  high-entropy **device-backup** key (native Web Crypto, hot at-rest decrypt path, no WASM
  cost), and move the **portable-export passphrase** path to **Argon2id (WASM)** behind the
  existing `kdfAlgo` envelope field. Targets the only brute-forceable secret with the OWASP-
  preferred memory-hard KDF, while the WASM dependency is loaded *only* on
  export/import (a rare, user-initiated, already-async operation), never on the per-decrypt
  hot path. No `envelopeVersion` bump — the `kdfAlgo` discriminator + an `argon2idParams`
  metadata block carry it.
- **B.** **Keep PBKDF2 everywhere, raise the passphrase iterations** to the current OWASP
  figure (≥ 600 k, already met; effectively "stay PBKDF2, re-affirm count"). Add
  `activePacks` refs. Zero new dependency, but leaves the brute-forceable secret on the
  non-preferred KDF; OWASP keeps PBKDF2 mainly as the FIPS/legacy fallback, and FMX has no
  FIPS constraint. Lowest-risk, lowest-gain.
- **C.** **Argon2id everywhere** (device path too). Cleanest cryptographically — single KDF,
  one code path — but pays the WASM Argon2id cost (memory-hard by design: ~19 MiB / 2 iters
  minimum per OWASP) on **every at-rest decrypt**, including the hot load path on low-end
  Android that ADR-0005 §Consequences already flags as latency-sensitive. Overkill for a key
  whose input is high-entropy and not user-typed.

### D2 — Missing-pack import behaviour (new, applies to both D1 options)

- **A.** **Block + explain.** Import of a portable export whose `activePacks` are not all
  present locally is rejected with a clear "this save needs packs X, Y — get them from the
  person who shared it" message (mirrors ADR-0016 async-group "members with missing packs
  cannot join until resolved").
- **B.** **Degrade to core.** Import succeeds against the IP-clean core dataset, dropping
  overrides; the world differs from the author's (breaks determinism parity, but the save
  loads). Surface a prominent warning.
- **C.** **Fetch.** Attempt to resolve missing packs (P2P/manifest hint). Out of MVP scope —
  ADR-0016 is P2P-only and ADR-0059 D2 keeps hosted distribution blocked pending DSA work;
  listed for completeness, not recommended for MVP.

(No recommendation is asserted on D2 — see Open questions. The payload-shape change is the
same regardless of which D2 branch Nico picks; D2 only governs the import *behaviour*.)

## Recommendation

**D1 = A** (split: PBKDF2 device / Argon2id passphrase), **D2 = open** (lead toward A
"block + explain" for MVP determinism safety, but defer to Nico).

Rationale for D1 = A: it puts the OWASP-preferred memory-hard KDF on the **one
brute-forceable, P2P-travelling secret** while keeping the WASM dependency off the hot
at-rest path entirely — capturing C's security benefit on the secret that matters without
C's per-decrypt latency tax or B's "stay on the non-preferred KDF" compromise. It is also
the option the envelope was *already designed for* (`kdfAlgo` discriminator + §Future note),
so it lands as a `kdfAlgo`-value addition, not an `envelopeVersion` break.

The `activePacks` payload addition is **orthogonal to D1** and recommended under either D1
branch: add an `activePacks` array (pack `id` + `version` + content hash) to `SavePayload`,
sourced from ADR-0059's per-save `ActivePacksSnapshot` / `ActivePacksInSave` read model, and
add a **missing-pack check** to the ADR-0005 §11 import flow (the D2 branch decides what
that check *does*). Validate the new field against [[ADR-0027-postgres-data-model]] Zod +
`CHECK` bounds, consistent with every other SavePayload context snapshot.

**Confidence: medium.** The OWASP direction (Argon2id preferred for user passwords) is
well-grounded; the residual uncertainty is product-level — whether the WASM-on-export
dependency is worth it for FMX's threat model (D1 A vs B), and the missing-pack UX (D2),
both of which are Nico's calls.

## Decision

Propose, awaiting Nico: **D1 = A**; **D2 = open (lead A)**. Concrete contract deltas
(proposed-not-applied; this ADR does not edit ADR-0005):

### Δ1 — `kdfAlgo` becomes a discriminated union; passphrase path = Argon2id

ADR-0005 §5 envelope `kdfAlgo: 'pbkdf2-sha256'` (fixed) → discriminated by `saveMode`:

```ts
// device_backup mode (unchanged): PBKDF2-SHA256 @ 600k, native Web Crypto
kdfAlgo: 'pbkdf2-sha256'
kdfIterations: 600_000

// portable_export mode (changed): Argon2id via WASM
kdfAlgo: 'argon2id'
argon2idParams: {                       // authenticated header bytes (AAD), like all header fields
  memoryKiB: number                     // e.g. 19_456 (OWASP min) — tunable, pinned per export
  iterations: number                    // e.g. 2 (OWASP min profile)
  parallelism: number                   // e.g. 1
}
```

`kdfAlgo` stays the swap point ADR-0005 §5 designed; old portable exports written with
`kdfAlgo: 'pbkdf2-sha256'` remain decodable (the loader branches on `kdfAlgo`), so **no
`envelopeVersion` bump** — this is an additive `kdfAlgo` value + params block, both inside
the existing AAD-authenticated header. The Argon2id params are pinned per export (read from
the envelope on import), so tuning the OWASP profile upward over time never breaks an old
file.

### Δ2 — `SavePayload` gains `activePacks` (ADR-0005 §6)

```ts
type SavePayload = {
  manifest: { /* unchanged */ }
  rng: RngStateSnapshot
  identityRefs: { /* unchanged */ }
  activePacks: Array<{               // NEW — sourced from ADR-0059 ActivePacksSnapshot
    packId: string                   // stable ID (ADR-0016 §5 stable-ID rule)
    version: string
    contentHash: string              // integrity / determinism pin
  }>
  contexts: { /* unchanged */ }
}
```

This makes the per-save immutable pack set (ADR-0059 `ActivePacksInSave`, ADR-0051
determinism rule) **travel inside the portable envelope**, closing the export↔registry
coupling gap. The array MAY be empty (core-only save). Validated against ADR-0027 Zod +
`CHECK` bounds.

### Δ3 — import flow gains a missing-pack gate (ADR-0005 §11)

The §11 "Importing a Portable export file" flow gains a step between Zod-parse and quota
check: *check every `activePacks[].packId/version/contentHash` resolves against the local
`PackRegistry` (ADR-0059)*. The branch on failure is **D2** (A block / B degrade / C fetch).
The flow change itself is identical regardless of D2; D2 only fills in the failure edge.

## Consequences

Positive:

- Portable exports — the only brute-forceable, P2P-shared artefact — use the OWASP-preferred
  memory-hard KDF (Argon2id), with **zero WASM cost on the device-backup / at-rest decrypt
  hot path**.
- P2P-shared saves carry their pack set, so a friend's import either reloads the author's
  **deterministic** world or is told exactly which packs are missing — closing the
  save↔pack coupling gap that ADR-0016/0059 implied but ADR-0005 §6 omitted.
- No `envelopeVersion` break: the change rides the `kdfAlgo` discriminator and an additive
  `activePacks` field, both already foreseen by ADR-0005 (§5 swap point, §Future Argon2id
  note) and ADR-0016 ("save records active packs").
- ADR-0059's `ActivePacksSnapshot` immutability now holds **across devices**, not just at
  rest on the authoring device.

Negative / Risks:

- **WASM Argon2id is a new dependency on the export/import path.** Bundle + supply-chain
  surface (mitigated: lazy-loaded only on export/import, never on the at-rest hot path; pin
  exact version per the global aktualität rule and re-verify the WASM build before adoption).
- **Missing-pack import UX must be designed** (D2). A block (A) is safest for determinism but
  can frustrate a friend who just wants to play; degrade-to-core (B) loads but silently
  diverges from the author's world unless the warning is unmissable.
- A `saveVersion` bump *is* required for the `activePacks` field (it is a non-additive change
  to SavePayload under ADR-0005 §8's bump policy), with a migration that backfills
  `activePacks: []` for existing core-only saves (ADR-0005 §9 phased pattern).
- Two KDF code paths instead of one (D1 A vs C's single path) — a small, well-bounded
  branch on `kdfAlgo`, already implied by the §5 discriminator.

## Open questions

1. **D1 A vs B** — is the WASM-Argon2id dependency on the export path worth it for FMX's
   threat model, or does PBKDF2 @ 600 k on the passphrase suffice (B)? OWASP prefers
   Argon2id for user passwords; FMX has no FIPS constraint, which weakens B's main argument.
   (Nico's call.)
2. **D2 — missing-pack import behaviour**: block (A), degrade-to-core (B), or fetch (C)?
   Leaning A for MVP determinism safety; C depends on hosted distribution, currently blocked
   (ADR-0059 D2, ADR-0016 P2P-only). (Nico's call.)
3. **Argon2id parameter profile** to pin per export (OWASP min 19 MiB/t=2/p=1 vs a
   higher-memory profile) given low-end Android export targets from ADR-0005 §Consequences —
   a tuning choice, GDDR/perf-budget territory, not a contract choice.

## Supersedes

[[ADR-0005-save-format]] — **partially**, on §3 (KDF) and §6 (`SavePayload` shape) and the
corresponding two compliance MUSTs, per the deltas above. **All other ADR-0005 rules remain
in force**: AES-GCM 256 (§2), AAD header binding (§2), gzip-then-encrypt (§4), the
three-version model (§8), forward-only phased migration (§9), save lifecycle (§10), restore
flows (§11), and Web-Worker execution. ADR-0005 is **not edited** by this ADR; supersession
is recorded only in this file's `supersedes:` frontmatter.

## Related Docs

- [[ADR-0005-save-format]] — superseded on KDF (§3) + SavePayload shape (§6); all other
  rules retained. Its §5 `kdfAlgo` field and §Future "Argon2id later" note are the explicit
  hooks this ADR uses.
- [[ADR-0016-community-dataset-overrides]] — "save records active packs + versions";
  stable-ID rule; P2P-only distribution. Source of the determinism requirement Δ2 satisfies.
- [[ADR-0059-community-overlay-pipeline-context]] — per-save immutable `ActivePacksSnapshot`
  / `ActivePacksInSave` read model; pack activation is save-creation-only. Δ2 puts that
  snapshot into the portable payload.
- [[ADR-0027-postgres-data-model]] — Zod + `CHECK` bounds the new `activePacks` field
  validates against; per-save schema isolation.
- [[ADR-0020-hybrid-online-mvp-offline-ready]] — amends ADR-0005 MVP timing; "avoid schema
  choices that block this contract" is the mandate to design these fields now.
- [[ADR-0051-manager-and-legacy-context]] — cross-save determinism rule (pack activation at
  save creation only) that the `activePacks` ref preserves across devices.
- [[ADR-0002-offline-first]] / [[ADR-0090-offline-sync-scope-and-conflict-strategy]] —
  local-first framing; this is a portable-export (P2P) contract, not a server-sync change.
- [[../../60-Research/determinism-and-replay]] — deterministic boundary that community
  overrides sit inside.
- [[../../50-Game-Design/GD-0014-save-career-model]] / [[../../50-Game-Design/GD-0015-ip-clean-data]]
  — save/career model + IP-clean hardline the pack set carries.
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.

## Sources

- OWASP Password Storage Cheat Sheet (2025–2026): Argon2id is the preferred password-hashing
  KDF for user-entered passwords (min profile 19 MiB / t=2 / p=1); PBKDF2-HMAC-SHA256 @
  ≥ 600 000 retained mainly as the FIPS/legacy fallback. Argon2id is **not** in browser Web
  Crypto (PBKDF2 is) — Argon2id requires a WASM/JS build.
  https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
  (confirmed via Perplexity 2026-06-08).
- [[ADR-0005-save-format]] §3 (rejected Argon2id; PBKDF2 @ 600 k mandate), §5 (`kdfAlgo`
  envelope discriminator), §6 (`SavePayload`), §8 (version bump policy), §11 (import flow),
  §Future ("Argon2id can replace PBKDF2 in a later envelope-v2").
- [[ADR-0016-community-dataset-overrides]] §Implementation + §Compliance (save records active
  packs; async-group missing-pack rule). [[ADR-0059-community-overlay-pipeline-context]]
  (per-save immutable `ActivePacksSnapshot`; save-creation-only activation).
