---
title: FMX-211 Reconciliation Delta + Ratified Decisions D1–D14 (2026-06-22)
status: accepted
tags: [architecture, review, reconciliation, decision-queue, fmx-211, audit, decided]
context: audit-security
created: 2026-06-22
updated: 2026-06-22
type: execution
binding: false
related: [[architecture-decision-portfolio-review-2026-06-22]], [[fmx-211-architecture-review-decision-queue-2026-06-22]], [[architecture-review-deep-grounded-2026-06-22]], [[architecture-adr-coverage-matrix-2026-06-22]], [[stack-currency-ledger]], [[Decision-Log]], [[collaboration-and-decision-protocol]]
---

# FMX-211 Reconciliation Delta + Ratified Decisions D1–D14

> **DECIDED 2026-06-22 by Nico (Lead Architect).** All of D1–D14 below are
> **ratified**. A later change of heart on any item is made by writing a **new
> ADR** (or amending the relevant one), not by silently editing this record. This
> note reconciles Codex's
> [[architecture-decision-portfolio-review-2026-06-22|portfolio review]] (D1–D6)
> and the grounded + adversarial
> [[architecture-review-deep-grounded-2026-06-22|deep companion]] (D7–D14), records
> the ratified answer for each, logs what was **applied in this PR**, and names the
> **follow-up ADRs / code-phase gates** that formally enact the rest.

## 0. Ratified decisions (D1–D14)

Status legend: **applied** = enacted in this PR; **ADR** = decided, to be formally
enacted via a (new/amended) ADR; **code-phase** = decided direction, enacted at
code bootstrap.

| # | Decision (ratified) | Enactment |
|---|---|---|
| **D1** | Architecture **coherent/current**; targeted hardening only; FMX-211 closes (no broad pivot). | applied (verdict) |
| **D2+D14** | **Two-axis governance:** `status` = sole lifecycle authority; `binding` = "in force today" (so accepted-yet-`binding:false` is legitimate for future-scope/activation-pending). **Reject** "accepted⇒binding:true". Fix only provably-wrong cells. | **applied** |
| **D3a** | **Drizzle 0.45.2 stable** (kit 0.31.10) for the money core; v1 = Nico-gated spike only if it GAs pre-bootstrap. | applied (ADR-0021 wording) + code-phase pin |
| **D3b** | **PostgreSQL 18.4** target. | applied (AGENTS.md) + code-phase pin |
| **D3c** | **Bootstrap on Nx 23.0.x** (greenfield = no migration). | code-phase |
| **D3d** | **Capacitor 8.4.1**; record iOS 15 / Xcode 26 / Node 22 floors. | ADR (ADR-0104) + code-phase |
| **D3-Node** | **Node 24 LTS** (above the converged Node-22 floor). | code-phase |
| **D4** | **Staged all-28 module cards** before multi-team fan-out; card template = ADR-0121 §4 ownership-metadata schema (authored once). | code-phase (ADR-0110 gate) |
| **D5** | **Promote workflows** into one current `30-Implementation/` process note deriving authority from ADR-0045/0103/0110. | ADR/process note |
| **D6+D13** | **One ladder:** ADR-0121 hard gate as foundation-PR-1 **with violation fixtures**, AND one real port-extraction (Match worker behind `MatchEnginePort`) passing the same contract suite in-proc + over network transport as a code-phase DoD exit criterion. | code-phase (ADR-0110/0121) |
| **D7a** | **Onboarding** objective-roadmap state → **League Orchestration**; feed-card score = Notification read-model; FTUE flags client-local. No new context. | **applied** (GD-0012 tag+note) |
| **D7b** | **Create a new "Monetization & Entitlements" context** (28→29) owning entitlement *fulfilment* across all classes; migrate `InvestorEntitlement` in; distinct from the no-P2W enforcement seam. | **ADR** (new) + GD-0038 gate |
| **D8** | **"C-lite":** keep D1=A aggregates; the lifecycle enum gets one canonical Published-Language home in ADR-0126; no phase-correlation contract. | **applied** (ADR-0100 closure) + ADR-0126 catalog entry |
| **D9** | **Re-spec ADR-0122 D4** to "default off for the 16+ band"; **do not** widen ADR-0112. | **applied** (ADR-0122) |
| **D10** | **Spike-then-pin Babylon** (recorded lazy-chunk + Standard-tier FPS); stays `binding:false`; seam keeps it reversible. | ADR (ADR-0047) + post-MVP spike |
| **D11** | **D4 = hard blocking multi-engine parity spike** + CI-asserted config hardening; reconcile the stale binding `determinism-and-replay.md` note to the WASM runtime; lean on the Wasm 3.0 deterministic profile. | ADR (ADR-0096) + code-phase |
| **D12** | **Guardrail activation = ADR-0110 DoD entry criterion**, per rail. Priority: ADR-0044 CI substrate **P0** → command-integrity (0115/0116/0119) P1 → webhook (0128) P1 → no-P2W (0108) P2 → responsible-gaming (0122) P2. | code-phase (ADR-0110) |

### Applied in this PR for D2+D14
- 7 superseded ADRs (0001/0002/0004/0009/0013/0025/0043) `binding:true`→`false`;
  ADR-0010 gains `binding:true`; **ADR-0093 `binding:true`** (the real apply-miss).
- Two-axis rule written into [[vault-governance]]; new CI invariant in
  `scripts/status-consistency-check.mjs` (`superseded ⇒ binding:false`; every ADR
  must declare `binding`). The intentional future-scope `binding:false` set
  (ADR-0046/0044/0052…) is **kept** — it is the honest "not in force yet" signal
  that D12 retires.

### Follow-up ADRs to author (decided, not yet written)
- **D7b** — new *Monetization & Entitlements* context ADR (+ bounded-context-map
  §1 28→29, GD-0038 record, module note).
- **D8** — add `ThreadLifecyclePhase` enum to the ADR-0126 Published-Language catalog.
- **D10** — ADR-0047 spike-gate clause; **D11** — ADR-0096 D4 spike + rewrite
  `determinism-and-replay.md`; **D3d** — ADR-0104 Capacitor-8 floors.
- **D4/D5/D6/D12** — fold into the ADR-0110 code-phase DoD + the new D5 process note.

---

The sections below record the **reconciliation rationale and evidence** behind the
ratified table above (agreements, net-new findings, divergences now resolved).

## 1. Agreement (no action)

Both reviews reach the **same headline verdict**: the architecture is coherent
and current, gameplay-compatible, and needs **no broad pivot** — only targeted
hardening. They independently agree on: ADR-0049 superseded / **ADR-0096
authoritative** for match-engine determinism; **ADR-0121 as the first code-phase
gate**; status-body hygiene is needed; **28 contexts as a managed ceiling**;
PostgreSQL **18.x** as the target. The companion corroborates Codex's coverage
(123 ADRs; 112 accepted / 11 superseded) and adds: 117 sound / 5 questionable /
1 reconsider, **0 genuine design conflicts**.

## 2. Net-new findings folded onto Codex's existing queue

The companion's grounded/adversarial pass surfaced concrete items that map onto
Codex's D2 and D3. Several are **applied in this PR** (§5); the rest are flagged.

### → extends **D2 (status-body hygiene)**
- **ADR-0014 binding apply-miss (APPLIED).** Accepted **ADR-0093** (Decision-Log
  L124) ratified the promotion of ADR-0014 to `binding: true`, but the flag was
  never flipped — a body-vs-frontmatter contradiction that binding ADR-0011/0129
  + the state-machine corpus rest on. Flipped to `binding: true` here. *This is a
  single dependency-driven correction, not the mass `binding:false→true` sweep
  Codex's D2=A rejects — the broader convention stays open as **D14**.*
- **Cross-ADR doc-reconciliation (mixed).** Applied: ADR-0011/0087 superseded
  `ADR-0015`→`ADR-0099` repoints; ADR-0005 §3 inline Argon2id/`ADR-0098` pointer;
  ADR-0062 weather-source (`MatchWeatherResolved`/ADR-0077) wiring;
  bounded-context-map `RivalryCommercialSignal` orphan removal (ADR-0111).
  Already clean (no edit): ADR-0050 `amended_by` (already populated + banner);
  ADR-0058/0061 (top **Ratification note** already redirects to Option C).
  **Deferred follow-up:** the ADR-0058/0061 *deep-body* §Recommendation/§Decision
  still narrate the superseded Option B beneath the ratification banner — a larger
  rewrite, intentionally **not** done in this review PR.

### → extends **D3 (stack-currency follow-through)**
- **ADR-0021 "Drizzle v1" vs the ledger (APPLIED).** ADR-0021 §1 narrated
  "Drizzle v1 best-in-class TS inference" while [[stack-currency-ledger]] (L87/
  L113) pins **Drizzle ORM 0.45.x stable** and keeps 1.0 RC/beta out. Adversarial
  verdict on the original wording: **FAILS** (self-contradiction against the
  project's own no-beta-pin rule). Reworded to the 0.45.x pin + RC-spike-on-Nico
  clause. The active pin still routes through FMX-198 per Codex's D3=A.
- **AGENTS.md SSOT currency drift (APPLIED).** The top-level stack note still
  read `PostgreSQL 17`, `Three.js/React Three Fiber` (post-MVP layer), and
  `@soccer-manager/*`. Corrected to `PostgreSQL 18`, **Babylon.js** (ADR-0047),
  and `@klubhaus-elf/*` (ADR-0114 D6). Codex's index sweep did not cover AGENTS.md.

## 3. D7–D14 rationale (all ratified — see §0; reversal = new ADR)

Continue Codex's numbering; full evidence in
[[architecture-review-deep-grounded-2026-06-22]].

- **D7 — Gameplay ownership gaps.** The companion traceability found **79%**
  capability coverage with two ownerless aggregates: **Onboarding state**
  (GD-0012 — persistent per-save tutorial/objective/feed state, no owning context)
  and the **entitlement-grant aggregate** (ADR-0107 defines the boundary; no
  single context owns fulfilment, distinct from the no-P2W enforcement seam).
  *Recommend:* assign Onboarding → League Orchestration; name one Entitlements
  owner. *(Divergence from Codex's "all gameplay areas compatible" — see §4.)*
- **D8 — Story-thread enum home (ADR-0100).** Aggregate-ownership split (D1=A) is
  correct, but the `emerging→heating→climax→resolved` lifecycle enum is duplicated
  across Narrative + Media Ecology. *Recommend:* "C-lite" — one canonical
  Published-Language home for the enum; do **not** treat the A-vs-C fork as closed.
- **D9 — Age-band granularity (ADR-0112 ↔ ADR-0122).** ADR-0122 D4 needs a runtime
  16/17-vs-18+ distinction; ADR-0112 stores only "16+". *Recommend:* decide in
  ADR-0112 (the age SSOT) — widen the attested band or re-spec ADR-0122 D4.
- **D10 — Babylon engine pin (ADR-0047).** Adversarial verdict
  **holds-with-conditions**: the choice rests on unrecorded private testing
  (`binding:false`); bundle/React-fit favour R3F. *Recommend:* gate the pin behind
  a recorded lazy-chunk-size + Standard-tier-FPS spike before the 3D layer is built.
- **D11 — Determinism D4 as a blocking spike.** Adversarial verdict
  **holds-with-conditions**: single Rust→WASM removes the float-divergence class
  but does **not** guarantee byte-identical execution across WASM hosts. *Recommend:*
  treat ADR-0096 D4 as a real, blocking, multi-engine (Wasmtime + every supported
  browser) parity + Config-hardening spike; reconcile the **binding**
  `determinism-and-replay.md` note (still PCG32/Chromium-only) to the WASM runtime.
- **D12 — Guardrail activation as DoD entry criterion.** The five weakest rails are
  enforced only by a future CI gate: responsible-gaming (ADR-0122, checklist-only),
  no-P2W (ADR-0108), webhook receiver (ADR-0128, needs impl + pentest), command
  integrity (ADR-0115/0116/0119), and CI/merge itself (ADR-0044, `binding:false`).
  *Recommend:* make "guardrail X has a passing automated gate" an ADR-0110
  code-phase DoD entry criterion. *(Strengthens Codex's D6.)*
- **D13 — Prove the modularity promise.** Adversarial verdict on "swap a module
  without breaking anything" is **holds-with-conditions**: real by construction,
  unenforced until code. *Recommend:* at bootstrap, activate ADR-0121 as a **hard**
  gate (with violation fixtures) **and** prove swap-safety with one real extraction
  (e.g. a Match worker behind `MatchEnginePort`) passing the same contract suite +
  a network-transport contract-test layer. *(Refines Codex's D6.)*
- **D14 — Binding-field convention.** Beyond ADR-0014, ~13 records carry
  accepted-yet-`binding:false` (incl. ADR-0093's own stale banner) and 7
  superseded-yet-`binding:true`. *Recommend:* Nico rules the convention
  (status-alone authority vs "accepted/current ⇒ `binding:true`"), then a single
  sweep applies it. *(Resolves the open tail of Codex's D2.)*

## 4. Divergences from Codex's conclusions (now resolved — ratified per §0)

1. **Gameplay coverage 79% vs 100%.** Codex rates all 11 gameplay areas
   compatible; the companion finds two ownerless aggregates (D7). The disagreement
   is about *ownership allocation*, not platform fit — both agree the gameplay is
   buildable.
2. **Story-thread ADR-0100 "fine" vs "needs a canonical enum home" (D8).**
3. **Binding-field convention (D14).** Codex's D2=A keeps `status` as sole
   authority and rejects flips; the companion applies the one ADR-0093-mandated
   flip (ADR-0014) and routes the convention itself to Nico.

## 5. Applied in this PR (safe, source-backed SSOT fixes)

**Reconciliation commit 1** (SSOT corrections):

| File | Edit | Authority |
|---|---|---|
| `AGENTS.md` | `PostgreSQL 17`→`18`; `Three.js/R3F`→`Babylon.js`; `@soccer-manager/*`→`@klubhaus-elf/*` (×3) | ADR-0097, ADR-0047, ADR-0114 D6 |
| `ADR-0021` §1 | "Drizzle v1"→"pin Drizzle 0.45.x stable; 1.0 RC/beta = Nico-approved spike only" | stack-currency-ledger L87/L113 |
| `ADR-0014` | frontmatter `binding: false`→`true` | Decision-Log L124 (ADR-0093 accepted) |
| `ADR-0011` | `ADR-0015`→`ADR-0099` (related + body) | ADR-0099 current |
| `ADR-0087` | `ADR-0015`→`ADR-0099` (related + 2 body refs) | ADR-0099 current |
| `ADR-0005` §3 | inline Argon2id / `ADR-0098` redirect banner | ADR-0098 |
| `ADR-0062` | wire weather input to `MatchWeatherResolved` / ADR-0077 | ADR-0077 |
| `bounded-context-map.md` | remove `RivalryCommercialSignal` orphan (count unchanged) | ADR-0111 |

**Not changed (already reconciled):** ADR-0050 (`amended_by` populated + banner),
ADR-0058/0061 (top Ratification note already states Option C), ADR-0057 (no orphan).

**Reconciliation commit 2** (enacting the ratified decisions D2/D14, D7a, D8, D9):

| File | Edit | Decision |
|---|---|---|
| ADR-0001/0002/0004/0009/0013/0025/0043 | `binding: true`→`false` (superseded ⇒ not in force) | D2/D14 |
| `ADR-0010` | add `binding: true` (was missing) | D2/D14 |
| `ADR-0093` | `binding: false`→`true` (accepted ratification apply-miss) | D2/D14 |
| [[vault-governance]] | written two-axis `status` vs `binding` rule | D2/D14 |
| `scripts/status-consistency-check.mjs` | new invariant: `superseded ⇒ binding:false`; every ADR declares `binding` | D2/D14 |
| `ADR-0122` D4 | "default off for 18+"→"default off for the attested 16+ band" | D9 |
| `GD-0012` | `context: league-orchestration` + ownership note | D7a |
| `ADR-0100` | Open Question closed → "C-lite" canonical enum home | D8 |

## 6. Deferred follow-ups (flagged, not done here)

- ADR-0058/0061 deep-body Option-B→C rewrite (larger edit).
- The `determinism-and-replay.md` binding-note rewrite (part of D11).
- The full binding-field convention sweep (D14).
- Broader-vault `@soccer-manager/*` occurrences beyond AGENTS.md (this PR scoped
  the rename to AGENTS.md only).
