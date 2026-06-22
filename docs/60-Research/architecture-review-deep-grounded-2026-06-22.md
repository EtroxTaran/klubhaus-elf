---
title: Architecture Review — Deep Grounded Companion (2026-06-22)
status: draft
tags: [architecture, review, audit, ddd, decision-queue, modularity, guardrails, fmx-211]
context: audit-security
created: 2026-06-22
updated: 2026-06-22
type: architecture
binding: false
related: [[architecture-decision-portfolio-review-2026-06-22]], [[fmx-211-reconciliation-delta-2026-06-22]], [[bounded-context-map]], [[05-Building-Blocks]], [[ADR-0019-modular-monolith-ddd]], [[ADR-0089-bounded-context-portfolio-reconciliation]], [[ADR-0121-architecture-fitness-function-no-shared-tables]], [[architecture-fitness-function]], [[Decision-Log]], [[collaboration-and-decision-protocol]]
---

# Architecture Review — Deep Grounded Companion (2026-06-22)

> **Status: draft / analysis artifact — NOT a decision.** This is a read-only,
> grounded review of the full technical architecture (all 123 ADRs) against the
> gameplay documentation, per Nico's request. It ratifies nothing. Every item
> that needs a call is surfaced in the **[Decision Queue](#decision-queue)** for
> the Lead Architect to resolve live. No ADR/GDDR was edited to produce it.

> **Companion to the FMX-211 portfolio review.** This note is the
> grounded + adversarial companion to
> [[architecture-decision-portfolio-review-2026-06-22]] (Codex). The two reviews
> agree on the headline verdict (architecture coherent/current, no broad pivot).
> This companion adds per-ADR currency grounding, an adversarial verification
> pass, the cross-decision compatibility matrix, the DDD/modularity scorecard,
> gameplay→architecture traceability, and a guardrail-reality audit. Its net-new
> findings and the few divergences are reconciled into the shared decision queue
> in [[fmx-211-reconciliation-delta-2026-06-22]] (items D7–D14).

## 1. Executive summary

The architecture is in **strong, coherent shape**. Across all 123 ADRs the
review found **117 sound, 5 questionable (defensible-but-weakly-grounded), 1
reconsider** — and the "incompatibilities" surfaced are almost entirely
**declared amendments and documentation drift, not design conflicts**. The
bounded-context model is genuinely domain-driven, the money/determinism/save
chains are clean, and the decisions are unusually well cross-referenced.

The work that remains is **not redesign — it is hardening and reconciliation**:

1. **One real correctness fix.** ADR-0021 names "Drizzle v1" for the durable
   money core, but Drizzle v1 is still **beta (not GA)** as of 2026-06 and the
   project's own `stack-currency-ledger` forbids beta/rc pins — a
   self-contradiction. (Adversarial verdict: **FAILS**.)
2. **SSOT / currency drift** between `AGENTS.md` and ratified ADRs (Postgres
   17→18.4, `@soccer-manager/*`→`@klubhaus-elf/*`, Three.js/R3F→Babylon,
   "11 contexts"→28) — stale top-level references that would mislead a new team.
3. **Frontmatter `binding`/`status` hygiene** across ~15 ADRs (one ratified-but-
   not-applied flag, seven superseded-still-`binding:true`, several
   accepted-yet-`binding:false`).
4. **A handful of genuine forks** for Nico: story-thread correlation (ADR-0100),
   age-band granularity (ADR-0112↔0122), two gameplay-ownership gaps (onboarding,
   entitlement-grant), the Babylon engine pin, and the Capacitor 7→8 native floor.
5. **The modularity / team-separability promise is real *by construction* but
   not yet *enforced*** — its mechanical guarantees (ADR-0121 no-shared-tables
   fitness function, package-facade lints) are specified-but-inactive until the
   code phase. The "swap a module without breaking anything" property is
   *designed*, not yet *proven*.

**Bottom line on the mandate:** the architecture **is** fully domain-driven and
modular, **could** be split across independent teams, and a human team **could**
pick it up and understand it. The qualifier is enforcement: the guarantees that
make "change one module safely" true live in CI gates and one proof-of-extraction
that do not exist yet because the repo is still docs-only. Activating them is the
top code-phase entry criterion.

| Metric | Value |
|---|---|
| ADRs reviewed | 123 (ADR-0001–0134, minus the 0031–0040/0042 gaps) |
| Sound / Questionable / Reconsider | **117 / 5 / 1** |
| Decision classes | 39 tech · 57 domain · 17 process · 10 policy |
| Cross-decision relationships adjudicated | 71 |
| Genuine design conflicts | **0** (1 frontmatter-apply miss; 13 doc-reconciliation tensions) |
| Bounded contexts scored (DDD) | 28 |
| Gameplay capability coverage | **79%** (2 ownership gaps, 5 labelling ambiguities) |
| Adversarial checks on load-bearing claims | 5 (1 fails, 4 hold-with-conditions) |

## 2. Method

Two-stage multi-agent review, all external facts grounded via context7 / Ref /
Perplexity / web and cited at source (release tags, npm, vendor docs), dated
2026-06-22.

- **Stage A — per-decision deep analysis.** 18 thematic clusters covering all
  123 ADRs. Each decision was classified, its rationale tested ("is this the
  *best* choice for *this* project?"), given a concrete named alternative, and —
  for technology choices — checked against the **latest stable version** and
  current best practice. DDD soundness and intra/cross-cluster compatibility were
  captured per ADR.
- **Stage B — system-level cross-cutting analysis.** DDD/modularity/team-
  separability scorecard (28 contexts), gameplay→architecture traceability,
  cross-decision compatibility matrix, guardrail-reality audit, SSOT-hygiene
  consolidation — then **adversarial pressure-tests** that tried to *refute* the
  five load-bearing claims.

The full per-ADR verdict index is in [Appendix A](#appendix-a--per-adr-verdict-index).

## 3. Verdict against the review mandate

| Mandate question | Verdict | Basis |
|---|---|---|
| Fully **domain-driven**? | **Yes** | 28 bounded contexts with explicit ownership, published-language contracts, ACLs, per-context state machines; ADR-0089 portfolio reconciliation; ADR-0126 effect-intent taxonomy as published language, not a shared model. |
| Clear **guard rails**? | **Partly** | The rails are *defined* well (ADR-0121 no-shared-tables, ADR-0030 LLM-out-of-state, ADR-0108 no-P2W, ADR-0007 IP-naming, ADR-0096/0113 determinism, ADR-0118/0125 test+mutation). Several have **zero runtime force until a not-yet-built CI gate exists** — see §7. |
| **Modular**, each aspect a separate team? | **Yes, by design** | ADR-0019 modular monolith + ADR-0114 package facades + ADR-0046 team topology give clean per-context ownership. Caveat: enforcement is review-discipline until ADR-0121 activates (§6). |
| **Hand off to humans**, fully understandable? | **Yes** | The vault is exceptionally well documented and cross-linked. Friction points: ADR-0058/0061 readability debt (stacked draft+override+amendments) and the SSOT drift in §8 that would mislead a newcomer. |
| Change a module **without breaking others**? | **Designed, not yet proven** | Mechanical isolation (schema-per-save, opaque UUID refs, no cross-context FK, outbox) is real-by-construction. The guarantee is unvalidated until ADR-0121 runs and one real extraction passes a contract-test suite (§9, claim V1). |

## 4. Decision-class health

| Cluster | ADRs | Sound | Q | Recon | Note |
|---|---|---|---|---|---|
| tech-foundation | 6 | 6 | – | – | Stack current; Drizzle-v1 + PG17 drift (→queue). |
| persistence-data | 8 | 8 | – | – | Postgres 18.4 / outbox / no-shared-tables all best-practice. |
| save-offline-sync | 9 | 9 | – | – | AES-GCM + Argon2id + Ed25519 all current; doc redirects needed. |
| match-engine | 8 | 8 | – | – | Single-WASM determinism sound; D4 parity spike still open. |
| realtime-matchday | 8 | 8 | – | – | SSE→Centrifugo ladder + streaming-over-log sound. |
| presentation-render | 11 | 8 | 2 | 1 | Babylon weakest-grounded; Capacitor/mobile-delivery supersession. |
| realtime-mp | 2 | 2 | – | – | Server-authoritative + dual-cadence sound. |
| narrative-llm | 7 | 7 | – | – | LLM-out-of-state clean; story-thread + on-device tier forks. |
| economy-accounting | 8 | 7 | 1 | – | Double-entry invariants correct; ADR-0058/0061 body drift. |
| monetization-compliance | 9 | 9 | – | – | GDPR/HGB/age legally grounded; age-band gap (→queue). |
| security-identity-notify | 6 | 6 | – | – | Posture sound; enforcement deferred to code phase. |
| people-squad-tactics | 10 | 10 | – | – | Person/Player/Staff/Manager identities cleanly split. |
| world-competition | 8 | 8 | – | – | AI-world/scheduling decoupled from player-club + engine. |
| talent-records | 5 | 4 | 1 | – | CQRS read-models/process-managers correctly separated. |
| environment-audience | 2 | 2 | – | – | Clean upstream producers; weather-fact wiring patch. |
| i18n-naming | 3 | 3 | – | – | Paraglide v2 current; IP-naming guardrail solid. |
| process-ci-quality | 7 | 7 | – | – | TDD/mutation/CI/DoD strong; binding activation pending. |
| governance-statemachine-context | 6 | 5 | 1 | – | Governance sound; ADR-0014 binding-apply miss. |

## 5. Cross-decision compatibility matrix

71 cross-decision relationships were adjudicated. **Zero genuine design
conflicts.** Findings split into one frontmatter-apply miss, 13
documentation-reconciliation tensions (the *design* is agreed; the *prose/
frontmatter* lags the ratified outcome), and the rest coherent amendments/
dependencies.

### 5.1 The one "conflict" (frontmatter-apply miss)

| A ↔ B | Issue | Authoritative | Action |
|---|---|---|---|
| ADR-0093 (ratified ADR-0014→binding) ↔ ADR-0014 (frontmatter `binding:false`) | ADR-0093 promoted ADR-0014 to `binding:true`; binding ADR-0011/0129 + the whole state-machine corpus rest on it, but the flag was never flipped — the exact body-vs-frontmatter contradiction ADR-0092 forbids. | ADR-0093 | Set ADR-0014 `binding:true`. |

### 5.2 Documentation-reconciliation tensions (design agreed; docs lag)

| A ↔ B | Reconciliation action | Authoritative |
|---|---|---|
| ADR-0096 ↔ `determinism-and-replay.md` | Note still mandates JS PCG32/pure-rand + Chromium-only gate from the superseded TS engine; rewrite to Rust-in-WASM + Wasmtime↔browser parity gate. | ADR-0096 |
| ADR-0058 / ADR-0061 bodies (Option B) ↔ their ratification (Option C) | Edit both bodies to Option C (separate CommercialPortfolio / Stadium Operations BCs). | Decision-Log |
| ADR-0011 ↔ ADR-0015 (superseded), ADR-0013 (superseded) | Repoint refs → ADR-0099 / ADR-0028. | ADR-0099/0028 |
| ADR-0087 ↔ ADR-0015 (superseded) | Repoint 3 refs → ADR-0099. | ADR-0099 |
| ADR-0005 (§Compliance "KDF MUST be PBKDF2") ↔ ADR-0098 (Argon2id) | Add a §Compliance redirect banner in ADR-0005 → ADR-0098. | ADR-0098 |
| ADR-0050 (`amended_by:` empty) ↔ ADR-0095/0105/0106 | Populate ADR-0050 `amended_by` + redirect the posting-shape narration to ADR-0095. | ADR-0095 |
| ADR-0112 ("16+" only) ↔ ADR-0122 D4 ("default off for 18+") | Runtime cannot tell 16/17 from 18+ — **genuine under-spec** → [Decision Queue D7](#decision-queue). | ADR-0112 (age SSOT) |
| ADR-0062 (consumes "weather") ↔ ADR-0077 (`MatchWeatherResolved`) | Add `MatchWeatherResolved` to ADR-0062's consumed-facts list. | ADR-0077 |
| ADR-0057 map-orphan ↔ ADR-0111 (removes `RivalryCommercialSignal`) | Apply the bounded-context-map edit. | ADR-0111 |
| ADR-0089/0134 28-slug list (dual-maintained) | Single-source the slug list (or bind both copies behind one CI check) + enforce ADR-0092's grep gate. | ADR-0089 |
| ADR-0090 / 0069 / 0083 `binding:false` ↔ binding siblings | Lead to confirm intent (binding vs intentionally-softer) — §8. | Decision-Log |

## 6. DDD / modularity / team-separability scorecard

**All 28 contexts scored.** System verdict: **modular ✓, team-separable ✓,
swap-safe ✓ — by construction**, contingent on activating the enforcers.

**What makes it real (not aspirational):** schema-per-save isolation (ADR-0027),
opaque UUID cross-references with **no cross-context FKs/joins** (ADR-0121),
domain events through a transactional outbox (ADR-0028), thin
JSON-serialisable/network-transparent contracts per context (ADR-0019/0114), a
single canonical 28-context catalog (ADR-0089), and effect-intent as published
language rather than a shared model (ADR-0126).

**Size/coupling watch (cohesive but high cognitive load):**

- **Club Management** — largest aggregate surface (ledger + budget envelopes +
  board pressure + insolvency FSM + Dynasty/Ownership sub-aggregates). Keep
  board/ownership/insolvency as internal sub-aggregates with **no separate write
  path into the ledger**.
- **CommercialPortfolio** — 10+ sub-aggregates (contract shell, exclusivity
  graph, season-ticket FSM, settlement saga, IFRS15 accrual, refund pool,
  receivables, fair-value, investor entitlements, fan-events). Boundary clean;
  cluster largest.
- **GD-0038 merge-review watch-pairs** (peer-context status gated on independent
  evolution): Scouting↔Transfer, Statistics & Analytics, Media↔Narrative,
  Environment & Climate. "28" is a **managed ceiling, not a settled count**.

**Readability debt (handoff friction, not a boundary defect):** ADR-0058 and
ADR-0061 stack a superseded draft recommendation + ratification override + up to
6 amendment sections — a reader can mistake the dead recommendation for the live
boundary. Reconcile bodies (§5.2).

## 7. Gameplay → architecture traceability

24 major gameplay capabilities mapped to owning context + contract + module.
**Coverage 79%.** Two real ownership gaps and several labelling ambiguities:

**Gaps (no clear owning context):**

1. **Onboarding (GD-0012, accepted/binding).** Empty `context:` frontmatter, no
   row in the 28-context map, no module spec — yet it carries **persistent
   per-save state** (tutorial progress, Season-1 objective roadmap, deterministic
   feed-card scoring, wage-runway first lesson). Needs an owner. Candidates:
   League Orchestration or Manager & Legacy. → [Decision Queue D8](#decision-queue).
2. **Monetization / entitlement-grant ownership.** ADR-0107 defines the
   pricing/IAP *boundary*, but **no context owns the entitlement-grant aggregate
   end-to-end**. The domain is spread across ADR-0107/0109/0112/0122/0127/0063;
   `audit-security` owns only the no-P2W *enforcement* invariant, not
   fulfilment. → [Decision Queue D8](#decision-queue).

**Ambiguities (owned, but mislabelled — cheap fixes):** core-loop GDDR (GD-0001)
should tag `context:league-orchestration`; save-career-model (GD-0014) is
correctly a three-way split (Postgres substrate / Offline-Sync seam / Audit
replay) under-represented by one label; mobile-ux/progressive-disclosure (GD-0016)
is by-design owned by presentation/design-system, not a domain context; AI-World
drift-consumer-policy ownership awaits FMX-139.

## 8. Guardrail-reality audit

The rails are well-*defined*; the risk is that several have **no runtime force
until a CI gate that does not exist yet** is built. The five weakest:

1. **Responsible-gaming / dark-pattern (ADR-0122)** — binding, but its entire
   force is a **human release self-audit checklist**, no automated scan, no UI
   linter. Easiest to erode silently in live-ops copy.
2. **No-pay-to-win & MP fairness (ADR-0108)** — load-bearing public promise whose
   only mechanism is a **not-yet-existing** `no-p2w-architecture-contract` gate;
   soft-P2W (paid information advantage) is prose-only.
3. **Webhook receiver security (ADR-0128)** — doubly deferred: needs both an
   implementation **and** an external pentest; payment/entitlement ingress is the
   highest-value forgery target with zero enforcement today.
4. **Command integrity / replay / save-trust (ADR-0115/0116/0119)** — precise
   multi-context contract, zero implementation; high blast radius if any seam is
   mis-built.
5. **CI/merge code-phase half (ADR-0044, `binding:false`)** — the gate **every
   other deferred guardrail relies on** to become real is itself non-binding
   planning. Single point of failure for the whole code-phase handoff.

> These are not design flaws — they are **activation debt**. The recommendation
> (Decision Queue D11) is to make "guardrail X has a passing automated gate" an
> explicit entry criterion in the ADR-0110 code-phase Definition of Done.

## 9. Adversarial verification of load-bearing claims

Each claim was assigned to a reviewer told to **refute** it.

| # | Claim | Verdict | Headline |
|---|---|---|---|
| V1 | Modular monolith delivers team-separable, swap-without-breaking modules | **Holds w/ conditions** (high) | Design is best-practice; the absolute "no risk" is unearned — enforcement is docs-only/inactive; needs ADR-0121 activation + **one real extraction** passing a contract suite. |
| V2 | Babylon.js is the right 3D engine over R3F/Three.js | **Holds w/ conditions** (med) | Choice asserted, not benchmarked (`binding:false`); two of three pillars (bundle, React-fit) favour R3F. Gate the pin behind a **recorded lazy-chunk + FPS spike**. |
| V3 | Leaning the money core on "Drizzle v1" is acceptable | **FAILS** (high) | Drizzle v1 is **beta.22, not GA**; `stack-currency-ledger` forbids beta/rc pins; SSOT pin is 0.45.x. ADR-0021 §1 is a self-contradiction. |
| V4 | ADR-0100 D1=A (per-context names, no shared correlation key) is right | **Holds w/ conditions** (med) | Aggregate-ownership call is correct, but the `emerging→heating→climax→resolved` **lifecycle enum is now duplicated** in both contexts. Don't close the fork — adopt "C-lite": one canonical Published-Language home for the enum. |
| V5 | Single Rust→WASM engine guarantees cross-runtime determinism; D4 is a formality | **Holds w/ conditions** (high) | Architecture removes the float-divergence class, but **does not** guarantee byte-identical execution across different WASM hosts. **D4 is a real, blocking, multi-engine parity + Config-hardening spike**, not a rubber stamp. |

## 10. SSOT / currency & frontmatter hygiene debt

Consolidated, de-duplicated, sample-verified against source files.

- **`binding`/`status` mismatches (8+).** Superseded-yet-`binding:true`:
  ADR-0001, 0002, 0004, 0009, 0013, 0025, 0043. Accepted-yet-`binding:false`
  (intentional draft-precision **or** apply-miss — Lead to confirm): incl.
  ADR-0012, 0014, 0052, 0069, 0073, 0074, 0076, 0082, 0083, 0084, 0090, 0091,
  0100. ADR-0010 missing the `binding` field entirely.
- **`AGENTS.md` top-level drift (4):** "PostgreSQL 17" (→ 18.4, ADR-0097);
  `@soccer-manager/*` (→ `@klubhaus-elf/*`, ADR-0114 D6); "Three.js/R3F" as
  post-MVP presentation (→ Babylon, ADR-0047); ADR-0046 "11 bounded contexts"
  (→ 28, ADR-0089).
- **Unapplied editorial patches (8):** §5.2 list — bounded-context-map orphan,
  ADR-0050 `amended_by`, ADR-0005 KDF redirect, ADR-0062 weather fact, etc.
- **Pending tech-currency HITL (8):** Drizzle v1→0.45.x (D1); Capacitor 7.x→8.4.1
  (raises iOS15/Xcode26/Node22 floors); Nx 22.x vs 23 major; Centrifugo v6.x
  re-source-check; Loki ≥3.7.2 (3.5.x EOL); plus exact-pin-at-bootstrap items
  (Stryker 9.6.1, hash-wasm 4.12.0, etc.).

> None of these change a *design* decision. They are reconciliation edits and
> code-phase pins. A single "SSOT reconciliation" PR + one "currency pin" pass
> at code bootstrap clears the bulk.

## Decision Queue

Items needing Nico. Each: options + recommendation (you decide). Ordered by
priority. **P1 = correctness, do before code; P2 = governance hygiene; P3 = real
design forks; P4 = code-phase activation gates.**

### P1 — correctness / SSOT

- **D1 — Drizzle ORM line for the money core.** *(V3 FAILS)*
  - **A (recommended):** correct ADR-0021 §1 "Drizzle v1" → **Drizzle 0.45.x
    stable** (kit 0.31.x), the current SSOT pin; money core ships on GA-stable.
  - B: keep v1 but make it a Nico-gated RC spike *only if* v1 reaches GA before
    bootstrap.
  - C: adopt **Kysely** (GA) for the durable ledger, Drizzle elsewhere.
- **D2 — Apply ADR-0014 `binding:true`** (ratified via ADR-0093, never applied).
  The one real frontmatter-vs-body contradiction; binding ADRs rest on it.
  Recommend: apply.
- **D3 — `AGENTS.md` SSOT reconciliation** (Postgres 18.4, `@klubhaus-elf/*`,
  Babylon, 28 contexts). Recommend: one reconciliation PR; agents currently read
  stale stack facts.

### P2 — governance hygiene

- **D4 — `binding`/`status` sweep.** Confirm which accepted-yet-`binding:false`
  ADRs are *intentional* draft-precision (per the people-squad rationale) vs
  apply-misses, and set superseded records to `binding:false`. Recommend: a
  single SSOT pass + a one-line convention in `vault-governance.md`.
- **D5 — Body-vs-ratification doc reconciliation** (§5.2: ADR-0058/0061 →
  Option C; ADR-0050 `amended_by`; ADR-0005 KDF redirect; ADR-0011/0087
  superseded refs; ADR-0062 weather; ADR-0057 map orphan). Recommend: fold into
  the D3/D4 reconciliation PR. Design unchanged.

### P3 — real design forks

- **D6 — Story-thread correlation (ADR-0100).** *(V4)* Keep D1=A ownership, but
  adopt **"C-lite":** give the `emerging→heating→climax→resolved` lifecycle enum
  **one canonical Published-Language home** instead of duplicating it. Recommend:
  C-lite; do not treat the A-vs-C fork as closed.
- **D7 — Age-band granularity (ADR-0112 ↔ ADR-0122 D4).** Either widen
  `attested_age_band` to distinguish 18+ from 16/17, or re-spec ADR-0122 D4 to key
  off the coarse "16+". Recommend: decide in ADR-0112 (the age SSOT).
- **D8 — Gameplay ownership gaps.** Assign an owner for **Onboarding state**
  (GD-0012 — recommend League Orchestration) and a **single context for the
  entitlement-grant aggregate** (distinct from the no-P2W enforcement seam).
- **D9 — Babylon engine pin (ADR-0047).** *(V2)* Gate the pin behind a **recorded
  Babylon-vs-R3F lazy-chunk-size + Standard-tier-FPS spike** before the 3D layer
  is built; keep `binding:false` meanwhile. Recommend: spike-then-pin.
- **D10 — Capacitor 7→8 native floor.** Re-pin to Capacitor 8.4.1 raises
  iOS15/Xcode26/Node22 floors — a platform-support call. Recommend: accept 8.x
  (current stable) and record the floors.

### P4 — code-phase activation gates (schedule, don't decide now)

- **D11 — Make guardrail activation a DoD entry criterion (ADR-0110).** Each
  deferred rail (ADR-0121 fitness fn, ADR-0108 no-P2W gate, ADR-0122 automated
  check, ADR-0128 receiver+pentest, ADR-0044 binding) gets a passing automated
  gate before the handoff it protects.
- **D12 — Validate the modularity promise (V1).** At bootstrap: activate ADR-0121
  as a **hard** gate (with violation fixtures) **and** prove swap-safety with one
  real extraction (e.g. a Match worker behind `MatchEnginePort`) passing the same
  contract suite + a network-transport contract-test layer.
- **D13 — Determinism D4 as a blocking spike (V5).** Prove identical event-log
  hashes across server Wasmtime **and every supported browser engine** (not just
  Chromium), pin Wasmtime/browser Config hardening as CI-asserted invariants, and
  reconcile `determinism-and-replay.md` to the Rust/WASM runtime.

## Appendix A — per-ADR verdict index

Class: tech/domain/process/policy. ✅ sound · 🟡 questionable · 🟠 reconsider.

| ADR | Decision | Class | Verdict | Summary |
|---|---|---|---|---|
| ADR-0001 | Tech Stack | tech | ✅ sound | Original (2026-05-15) stack: TanStack Start + React + Tailwind/shadcn + SurrealDB (authorita... |
| ADR-0002 | Offline-first Strategy | tech | ✅ sound | Original Wave-3 decision: fully playable offline singleplayer in the MVP (Dexie 4 + Workbox ... |
| ADR-0003 | Match Engine Architecture | tech | ✅ sound | Original deterministic, framework-agnostic TypeScript match engine in packages/match-engine:... |
| ADR-0004 | Data Model — Domain Entities, Schemas, Saves | tech | ✅ sound | The original SurrealDB-era data model: namespace + database-per-save isolation, hybrid SCHEM... |
| ADR-0005 | Save Format and Versioning | tech | ✅ sound | Encrypted, compressed, versioned save envelope: AES-GCM-256 (Web Crypto) with header-as-AAD;... |
| ADR-0006 | i18n Strategy (i18next / react-i18next, DE def | tech | ✅ sound | Intended (never ratified) to use i18next/react-i18next with German default and English maint... |
| ADR-0007 | IP-clean Naming Schema + Data Generators | policy | ✅ sound | The world is fully procedurally generated from a single worldSeed and IP-clean by constructi... |
| ADR-0008 | Mobile-first UI — route map, IA & client-state | tech | ✅ sound | Ratifies the mobile-first interaction model: a 4-5 destination bottom-nav hybrid IA with Hom... |
| ADR-0009 | Cursor Cloud Agent Orchestration | process | ✅ sound | Cursor-specific cloud-agent orchestration: use Plan Mode outputs in .cursor/plans/, serializ... |
| ADR-0010 | Klubhaus Design System | tech | ✅ sound | Recreate the Claude Design handoff ('Klubhaus DS', Direction A) in the production stack rath... |
| ADR-0011 | Server-Authoritative Multiplayer | policy | ✅ sound | The server is the only authority for all multiplayer state (week, transfer, watch-party, mat... |
| ADR-0012 | Async Multiplayer Cadence Models (Fixed + Dyna | domain | ✅ sound | The async system supports two selectable per-group cadence rule sets over one shared LeagueW... |
| ADR-0013 | Transactional Outbox for Domain Events | tech | ✅ sound | Original transactional-outbox decision: write outbox row inside the same SurrealDB transacti... |
| ADR-0014 | Explicit State Machines for Time-critical Work | process | ✅ sound | Mandates that every time-critical, multiplayer-relevant workflow (League/Week, Transfer, Wat... |
| ADR-0015 | Watch-Party via Spectator Snapshot Streaming | tech | ✅ sound | Original (now superseded) decision: watch parties use a separate spectator service consuming... |
| ADR-0016 | Community Datasets via Versioned Override Pack | domain | ✅ sound | Community data is delivered as versioned override packs stacked on an IP-clean core dataset:... |
| ADR-0017 | Self-hosted Observability and Logging | tech | ✅ sound | Adopts a self-hosted/open-source EU observability strategy with OpenTelemetry JS as the inst... |
| ADR-0018 | Systemic Events and Player Lifecycle Architect | domain | ✅ sound | Adopts domain-owned systemic policies coordinated by a deterministic WorldEventDirector (an ... |
| ADR-0019 | Service-ready Modular Monolith with DDD Bounde | domain | ✅ sound | Build the app as a service-ready modular monolith with DDD bounded contexts in TypeScript: o... |
| ADR-0020 | Hybrid-online MVP, Offline-ready Architecture | tech | ✅ sound | MVP is hybrid-online: durable progression is authoritative only after a server command succe... |
| ADR-0021 | Revised Tech Stack | tech | ✅ sound | Hybrid revision: PostgreSQL + Drizzle ORM as the system of record from day one (ACID for mon... |
| ADR-0022 | Animation & Game-Feel Stack | tech | ✅ sound | Use two animation libraries by role: Motion (motion/react) via the slim m component + LazyMo... |
| ADR-0023 | Realtime Transport | tech | ✅ sound | Define a `RealtimeTransport` interface in apps/web/src/lib; ship an SSE implementation (TanS... |
| ADR-0024 | Match Renderer Abstraction | tech | ✅ sound | Introduce a renderer-agnostic MatchRenderer interface that consumes ephemeral, derived Match... |
| ADR-0025 | Mobile Delivery (PWA + Capacitor) | tech | 🟠 reconsider | The responsive PWA stays the single source of truth; a thin, additive, reversible Capacitor ... |
| ADR-0026 | Match Frame Contract | tech | ✅ sound | Pins the engine->renderer projection seam in a dependency-light leaf package packages/match-... |
| ADR-0027 | PostgreSQL Data Model (per-save schema isolati | tech | ✅ sound | PostgreSQL is the system of record with schema-per-save isolation (one save_<uuidv7hex> Post... |
| ADR-0028 | PostgreSQL Transactional Outbox (same-tx + pol | tech | ✅ sound | Domain events written to public.outbox_event in the SAME Postgres transaction as the domain ... |
| ADR-0029 | 3D Presentation Layer (Stadium, Cutscenes, Bac | tech | ✅ sound | Scopes the locked 'no 3D' decision to the live match-render pipeline only, and permits a pos... |
| ADR-0030 | LLM Out Of Authoritative State Boundary | tech | ✅ sound | Runtime LLM may be evaluated only OUTSIDE authoritative state: non-blocking Full Dialogue + ... |
| ADR-0041 | Two-Renderer Presentation Strategy | tech | ✅ sound | Adopt a two-renderer strategy: Text & Stats + Canvas 2D for the match/UI-adjacent 2D surface... |
| ADR-0043 | Notification and Messaging Platform | tech | ✅ sound | SUPERSEDED by ADR-0102. Original decision: build notifications as a first-party DDD bounded ... |
| ADR-0044 | CI/CD Strategy & Merge Policy | process | ✅ sound | Portable pipeline with check logic in plain repo scripts (scripts/docs-check.mjs pattern) in... |
| ADR-0045 | Issue-first + Git-Worktree Agent Workflow | process | ✅ sound | One Linear issue <-> one git worktree <-> one branch per agent session; strict issue-key bra... |
| ADR-0046 | Team Topology & Multi-Lead Scaling | process | ✅ sound | Future-scope (binding:false): prepare-but-not-activate a multi-lead topology that triggers w... |
| ADR-0047 | Babylon.js as the 3D / Isometric Presentation  | tech | 🟡 questionable | Adopt Babylon.js as the single optional 3D/isometric presentation engine (iso stadium/campus... |
| ADR-0048 | Design-System Update & Migration Path | process | ✅ sound | Fixes the policy around recurring external design-export updates: one canonical token single... |
| ADR-0049 | Swappable Spatial-Event Match Engine | tech | ✅ sound | Reframes the engine as a swappable spatial-event engine behind a versioned MatchEnginePort, ... |
| ADR-0050 | Club Economy Accounting Ledger | domain | ✅ sound | Club Management owns a single append-only finance ledger and is the sole writer of finance f... |
| ADR-0051 | Manager and Legacy Context | domain | ✅ sound | Adds Manager & Legacy as a dedicated (12th) bounded context owning cross-run manager identit... |
| ADR-0052 | People, Persona and Skills Context | domain | ✅ sound | Creates a dedicated People / Persona & Skills bounded context that owns save-scope personhoo... |
| ADR-0053 | Staff Operations Context | domain | ✅ sound | Carves a dedicated (13th) Staff Operations bounded context owning staff contract lifecycle F... |
| ADR-0054 | Narrative Context and AI Narration Framework | domain | ✅ sound | Create a dedicated Narrative bounded context (Option A) that owns scene/storylet selection, ... |
| ADR-0055 | Tactics Context | domain | ✅ sound | Carves a dedicated (14th) Tactics bounded context owning the persistent tactic library (Tact... |
| ADR-0056 | Regulations and Compliance Context | domain | ✅ sound | Carves a dedicated Regulations & Compliance bounded context (the 15th) owning the versioned ... |
| ADR-0057 | Rivalry System Context | domain | ✅ sound | Carves Rivalry System as a dedicated (16th) bounded context owning the RivalryEdge graph (cl... |
| ADR-0058 | Club Economy Commercial Impact Boundary | domain | ✅ sound | Defines the boundary between commercial policy/lifecycle/settlement and finance posting. Aft... |
| ADR-0059 | Community Overlay Pipeline Context | domain | ✅ sound | Carves a dedicated Community Overlay Pipeline bounded context (Option D) owning the platform... |
| ADR-0060 | Youth Academy Context | domain | ✅ sound | Carve Youth Academy as its own (17th/18th) bounded context owning the annual academy lifecyc... |
| ADR-0061 | Club Management Sub-Aggregate Ownership Audit | domain | 🟡 questionable | FMX-32 per-candidate DDD audit of four Club Management sub-aggregate candidates. Ratified la... |
| ADR-0062 | Audience & Atmosphere Context | domain | ✅ sound | Carves Audience & Atmosphere (renamed from Fan Ecology) as its own bounded context owning Su... |
| ADR-0063 | Investor Entitlement and Payment Boundary | domain | ✅ sound | Adopts Option B: a PaymentProviderPort (apple-iap / google-iap / web-psp) plus a server-auth... |
| ADR-0064 | Scouting Activity Context | domain | ✅ sound | Carve Scouting as its own (20th) bounded context owning scout ACTIVITY — ScoutAssignment, Sc... |
| ADR-0065 | Narrative Media and Press Content Ownership | domain | ✅ sound | Extend the Narrative context with a Press/Media content-authoring subdomain (Option B): Pres... |
| ADR-0066 | Competition & Season Registry sub-aggregate (L | domain | ✅ sound | Models the Competition & Season registry as a four-aggregate-root sub-aggregate cluster INSI... |
| ADR-0067 | Set-piece variant selection determinism | domain | ✅ sound | Closes audit gap G9: set-piece variant selection is a PURE function selectSetPieceVariant(fr... |
| ADR-0068 | Fixture scheduling contract + determinism (Lea | domain | ✅ sound | Defines fixture generation as a pure function generateFixtures(participants, format, seed) u... |
| ADR-0069 | League<->Regulations fixture/competition eligi | domain | ✅ sound | Specifies how a scheduled competition invokes the rules: a STATELESS CompetitionEligibilityP... |
| ADR-0070 | FixtureCommercialProfile + CompetitionRevenueP | domain | ✅ sound | Defines the League Orchestration -> CommercialPortfolio published-language contract: D1=A ev... |
| ADR-0071 | AI World Simulation context and drift contract | domain | ✅ sound | Introduces AI World Simulation as a dedicated bounded context (D1=B) owning cross-domain wor... |
| ADR-0072 | In-Match Control Seam & Intervention Determini | tech | ✅ sound | Single-player UI interventions become typed InterventionCommands carried over the ADR-0008 C... |
| ADR-0073 | Player Contract Lifecycle FSM | domain | ✅ sound | Resolves the player-contract ownership ambiguity: Squad & Player owns PlayerContractLifecycl... |
| ADR-0074 | Tactical-Identity Fingerprint Aggregation Algo | domain | ✅ sound | Pins the algorithm for the TacticalIdentityFingerprint that ADR-0055 already owns: five per-... |
| ADR-0075 | Loan-Orchestration Process Manager | process | ✅ sound | Transfer hosts a Loan-Orchestration Process Manager (saga) owning the LoanAgreement aggregat... |
| ADR-0076 | Narrative Newsworthiness Event Contracts | domain | ✅ sound | Source contexts own publication decisions and emit distinct, self-contained, published-langu... |
| ADR-0077 | Environment & Climate Context (Weather + Pitch | domain | ✅ sound | Creates a dedicated 'Environment & Climate' bounded context that owns weather generation (a ... |
| ADR-0078 | Player Discipline Suspension Contracts | domain | ✅ sound | Models player discipline as a Squad & Player-owned process manager/sub-aggregate (no new con... |
| ADR-0079 | Dynasty Board, Ownership & Bankruptcy FSMs | domain | ✅ sound | Promotes board-ambition, ownership-transition and bankruptcy/administration into determinist... |
| ADR-0080 | Opposition-template AI Consumption Contract | domain | ✅ sound | Pins ownership of opponent-template selection: AI World Simulation owns the planning context... |
| ADR-0081 | Statistics & Analytics read-model owner | domain | ✅ sound | Statistics & Analytics is a projection-only bounded context owning all read-model statistics... |
| ADR-0082 | Manager Style-Signal & Run-Analysis Contract ( | domain | ✅ sound | Confirms GD-0019 'MVP ships hooks, not the meta system' as a contract. Pins five non-tactica... |
| ADR-0083 | Awards, Honours, Records & Hall-of-Fame Contra | domain | 🟡 questionable | Extend Manager & Legacy (ADR-0051) additively — no new bounded context — to own awards/honou... |
| ADR-0084 | National-Team Dual-Role Scope & International- | domain | ✅ sound | Ships the club+national-team dual-role as a telegraphed reserved stub (D1=A): MVP delivers o... |
| ADR-0085 | Media Ecology Context and Outlet Operational B | domain | ✅ sound | Introduce a new Media Ecology bounded context (D1=B) owning the media outlet as a non-author... |
| ADR-0086 | Background-fast Matchday Cost-Settlement Pipel | domain | ✅ sound | A background-fast fixture's matchday operating cost is settled by a CommercialPortfolio ligh... |
| ADR-0087 | Live-match Intervention Buffer + Watch-Party P | domain | ✅ sound | Match owns a deterministic InterventionBufferPolicy value object bounding buffered intervent... |
| ADR-0088 | Async Escalation FSM + Watch-Party Deadline So | domain | ✅ sound | Two halves. (A) Transfer replaces its single `escalated` state with a 5-stage escalation FSM... |
| ADR-0089 | Bounded-context portfolio reconciliation and m | domain | ✅ sound | Adopts a single canonical 28-context catalog (19 ratified + 9 new; ADR-0065 stays a Narrativ... |
| ADR-0090 | Offline Sync — MVP scope and conflict-resoluti | tech | ✅ sound | Offline Sync stays a thin MVP context (SW stale-while-revalidate read cache + Dexie drafts +... |
| ADR-0091 | Audit & Security — context definition | domain | ✅ sound | Keeps Audit & Security as an explicit but narrow supporting/generic bounded context whose ma... |
| ADR-0092 | Vault governance — status/lifecycle single-sou | process | 🟡 questionable | Editorial/reference-integrity governance: makes YAML frontmatter status+binding the single s... |
| ADR-0093 | Joint ratification wave — promote async-coordi | process | ✅ sound | A governance/sequencing decision (Option A): ratify four interdependent ADRs in one wave — p... |
| ADR-0094 | i18n stack & locale scope (Paraglide JS + form | tech | ✅ sound | Adopt Paraglide JS (compiler-first, tree-shakable ESM) + format.js/native Intl formatters + ... |
| ADR-0095 | Double-entry / balanced-transfer ledger postin | domain | ✅ sound | Amends ADR-0050 (shape-only): every FinanceLedgerEntryPosted carries >=2 typed-accountCode l... |
| ADR-0096 | Match-engine cross-runtime determinism & numer | tech | ✅ sound | Finalises the determinism axis: (D1-A) mandatory integer/fixed-point replay surface for ever... |
| ADR-0097 | PostgreSQL data-model scale envelope + audit-t | tech | ✅ sound | Amends ADR-0027/0028. (D1) Keeps schema-per-active-save but makes it operationally honest: a... |
| ADR-0098 | Save-format KDF upgrade (Argon2id passphrase p | tech | ✅ sound | Splits the KDF: keep PBKDF2-SHA256@600k for the high-entropy device-backup key (native Web C... |
| ADR-0099 | Spectator / watch-party streaming over the com | tech | ✅ sound | Re-express spectator/watch-party streaming purely over the committed MatchEventLog + Spatial... |
| ADR-0100 | Story-thread ownership and cross-context namin | domain | ✅ sound | Resolve the cross-ADR collision where ADR-0076 and ADR-0085 both attach first-class meaning ... |
| ADR-0101 | Settlement value-collapse + quality-profile en | domain | ✅ sound | Closes three cross-ADR reconciliation gaps: (D2) a single deterministic seeded-within-band M... |
| ADR-0102 | Notification platform re-ratification + offlin | tech | ✅ sound | Re-ratifies the ADR-0043 notification platform as the binding terminus and adds an inbox-fir... |
| ADR-0103 | Multi-agent orchestration & conflict serializa | process | ✅ sound | Tool-agnostic successor to ADR-0009: serialize shared-contract changes (schema, public inter... |
| ADR-0104 | Mobile-delivery grounding + ratification (supe | tech | 🟡 questionable | Re-affirms ADR-0025's direction (PWA=SSOT; thin additive reversible Capacitor shell; native ... |
| ADR-0105 | Wage + transfer-fee/amortisation ledger postin | domain | ✅ sound | Amends ADR-0050 with the named posting events for the two largest cashflows: separate Player... |
| ADR-0106 | Chart of Accounts and Category Catalog | domain | ✅ sound | Supplies the concrete chart ADR-0095 LI-9 mandated: D1=A semantic dotted account codes (asse... |
| ADR-0107 | Pricing and IAP Monetization Boundary | policy | ✅ sound | Monetization is modelled as a classified pricing/entitlement boundary (cosmetic_identity, su... |
| ADR-0108 | No-Pay-to-Win and Multiplayer Fairness Invaria | policy | ✅ sound | Project-wide invariant: real money may unlock presentation/identity/account-service or stric... |
| ADR-0109 | Payment Provider and Monetization Legal Gates | policy | ✅ sound | Adopts D1-D5=A/A/A/A/A: web/PWA checkout is Merchant-of-Record-first behind ADR-0063's Payme... |
| ADR-0110 | Code-Phase Definition of Done Transition Contr | process | ✅ sound | Phase-split Definition of Done: docs-phase DoD active now (claim issue, save vault delta sam... |
| ADR-0111 | Rivalry Commercial Signal Contract Reconciliat | domain | ✅ sound | Resolves an orphan contract: ADR-0058 and the bounded-context map said Rivalry supplies Riva... |
| ADR-0112 | Age Assurance and Rating Evidence Posture | policy | ✅ sound | Adopts D1-D6=A: a mandatory 16+ self-declaration before account fields; store only successfu... |
| ADR-0113 | Portfolio Determinism and Seeded-Variance Prin | policy | ✅ sound | Establishes the portfolio default for the determinism-vs-variance axis: use bounded SEEDED v... |
| ADR-0114 | Monorepo Workspace Bootstrap | tech | ✅ sound | Bootstrap shape for the first workspace (ratified 2026-06-19, D1-D8 = all A): progressive on... |
| ADR-0115 | Command Integrity and Replay Protection Postur | tech | ✅ sound | Server-authoritative signed-evidence command envelope for MVP: server is the only acceptance... |
| ADR-0116 | Save Trust Levels and Provenance Posture | domain | ✅ sound | Derived (not user-editable) SaveTrustLevel vocabulary (local-only / server-verified / import... |
| ADR-0117 | Narrative Display Snapshot Replay Determinism  | domain | ✅ sound | Every player-visible, revisitable Template or LLM prose item must be persisted as an exact N... |
| ADR-0118 | Test Strategy and Quality Gates | process | ✅ sound | Tiered 16-layer quality strategy with split PR/nightly/release/manual cadence; Vitest owns f... |
| ADR-0119 | Command Reception Dedup Seam | tech | ✅ sound | Introduces a synchronous pre-domain Command Reception capability (owned by Audit & Security,... |
| ADR-0120 | Deterministic Simulation QA and Save-Forward M | process | ✅ sound | Defines the simulation QA harness contract: (D1) tiered SimulationReplayEvidence L1 compact ... |
| ADR-0121 | Architecture Fitness Function for No Shared Ta | process | ✅ sound | Turns the no-shared-tables / no-cross-context-join / no-cross-context-FK isolation invariant... |
| ADR-0122 | Responsible Gaming and Dark-Pattern Invariant | policy | ✅ sound | Adopts D1-D7=A (except D7 binds independently of the monetization drafts): a permanent ban o... |
| ADR-0123 | Identity & Access Context Definition | domain | ✅ sound | Defines the previously thin Identity & Access context narrowly (D1=A core I&A only): owns Ac... |
| ADR-0124 | PWA Offline Mobile Release Content QA Gates | process | ✅ sound | Release-quality contract for the hybrid-online PWA: (D1) hybrid-online degradation matrix (s... |
| ADR-0125 | Stryker Mutation Testing Gate | tech | ✅ sound | Scoped baseline-first Stryker mutation gate: scope limited to high-risk deterministic/domain... |
| ADR-0126 | Cross-producer effect-intent taxonomy | domain | ✅ sound | One cross-producer effect-intent catalog as PUBLISHED LANGUAGE (not a shared domain model). ... |
| ADR-0127 | Erasure vs HGB Retention Field Partition | policy | ✅ sound | Adopts a hybrid erasure-vs-retention partition: account/profile/auth/save data follows accou... |
| ADR-0128 | Webhook Receiver Security Contract | policy | ✅ sound | Adopts a dedicated, provider-neutral webhook receiver security contract (D1=A dedicated ADR,... |
| ADR-0129 | Match Context Definition | domain | ✅ sound | Consolidates the Match bounded-context boundary (Option A: dedicated Match ADR) without chan... |
| ADR-0130 | Training Context Definition | domain | ✅ sound | Canonical context-definition ADR (amends ADR-0018/0019/0055/0067) making Training own the we... |
| ADR-0131 | Squad & Player Context Definition | domain | ✅ sound | Canonical context-definition ADR (amends ADR-0018/0019/0073/0078) making Squad & Player the ... |
| ADR-0132 | Release Versioning and App Build Process | process | ✅ sound | Release identity contract (ratified 2026-06-19, D1-D7 = all A): SemVer technical version + f... |
| ADR-0133 | Watch Party Context Definition | domain | ✅ sound | Defines the Watch Party bounded context canonically: it owns party-scoped social/viewing tru... |
| ADR-0134 | context: frontmatter as NotebookLM-export memb | process | ✅ sound | Introduces an explicit per-note `context:` frontmatter field (one or more of the fixed 28 bo... |
