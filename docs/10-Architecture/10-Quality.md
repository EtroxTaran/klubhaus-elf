---
title: Quality
status: current
tags: [architecture, quality, determinism, offline-first, performance, security, accessibility, i18n, architecture-fitness, bounded-context, dependency-cruiser, soak-test, save-forward, fmx-167, fmx-196]
created: 2026-05-15
updated: 2026-06-20
type: arch
binding: false
related: [[08-Crosscutting]], [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]], [[09-Decisions/ADR-0091-audit-security-context-definition]], [[09-Decisions/ADR-0028-postgres-transactional-outbox]], [[09-Decisions/ADR-0008-mobile-first-ui]], [[09-Decisions/ADR-0094-i18n-stack-and-locale-scope]], [[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]], [[09-Decisions/ADR-0005-save-format]], [[09-Decisions/ADR-0021-revised-tech-stack]], [[09-Decisions/ADR-0118-test-strategy-and-quality-gates]], [[09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]], [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../40-Quality/test-strategy]], [[../40-Quality/deterministic-simulation-qa-harness]], [[../40-Quality/architecture-fitness-function]], [[../60-Research/test-strategy-adr-2026-06-14]], [[../60-Research/deterministic-simulation-qa-harness-2026-06-15]], [[../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]], [[../60-Research/performance-budgets]], [[../60-Research/determinism-and-replay]], [[../30-Implementation/ci-and-review-process]], [[../60-Research/argon2id-wasm-kdf-validation-2026-06-19]], [[../40-Execution/fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]
---

# Quality

This chapter records the **ratified quality goals** for **Klubhaus Elf** and the
**concrete quality scenarios** (arc42 stimulus → response → measure) that make each goal
testable. It reflects ratified decisions only; the measurable budgets it cites live in
[[../60-Research/performance-budgets]] (binding) and the enforcement model in
[[../30-Implementation/ci-and-review-process]]. It does not introduce new decisions.
Accepted [[09-Decisions/ADR-0118-test-strategy-and-quality-gates]] and current
[[../40-Quality/test-strategy]] are the FMX-177 future code-phase test-strategy
packet; they stay target-only until code-phase bootstrap creates real scripts
and package/app paths.
Accepted [[09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
and [[../40-Quality/deterministic-simulation-qa-harness]] are the FMX-196
simulation-specific QA packet; they are binding after Nico approved on 2026-06-19
D1-D7.
Accepted [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
and [[../40-Quality/architecture-fitness-function]] add the FMX-167 future
code-phase architecture-fitness subgate inside `quality`. It hard-fails core
bounded-context/storage-boundary violations after real scanner scripts,
workflows and burn-in exist.

> Project phase: research / analysis / architecture planning — no development. The scenarios
> below are the acceptance targets the implementation will be held to, not yet-shipped behaviour.

## 1. Quality goals (top, ratified)

In priority order for an offline-first, deterministic, mobile-first PWA:

| # | Quality goal | Why it is top | Source of authority |
|---|---|---|---|
| **Q1** | **Determinism & replay byte-stability** | The product's primary technical differentiator; enables verify-locally, anti-cheat, watch-party and save portability. | [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]], [[../60-Research/determinism-and-replay]] |
| **Q2** | **Offline-first availability & honest-draft UX** | Singleplayer must be fully usable with no network; the client must never lie about freshness or persistence. | [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]] |
| **Q3** | **Performance on the device floor** | Mobile-first on low-end Android/older iOS; budgets are enforced per device tier and per match quality profile. | [[../60-Research/performance-budgets]] (binding), [[09-Decisions/ADR-0008-mobile-first-ui]] |
| **Q4** | **Security, tamper-evidence & audit-trail integrity** | Server-authoritative, untrusted P2P surfaces, GDPR obligations; needs forensics and replay protection. | [[09-Decisions/ADR-0091-audit-security-context-definition]], [[09-Decisions/ADR-0028-postgres-transactional-outbox]] |
| **Q5** | **Accessibility & mobile-first usability** | One-handed portrait, WCAG 2.2 AA, the floor-tier experience must stay usable. | [[09-Decisions/ADR-0008-mobile-first-ui]] |
| **Q6** | **Internationalisation correctness** | DE-source, 5 MVP locales; ICU correctness and the offline locale-precache budget. | [[09-Decisions/ADR-0094-i18n-stack-and-locale-scope]] |
| **Q7** | **Save integrity & migration safety** | Saves and portable exports must round-trip, stay tamper-evident and migrate forward only. | [[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]] (amends [[09-Decisions/ADR-0005-save-format]]) |
| **Q8** | **Architecture boundary integrity** | The service-ready modular monolith promise depends on contexts not importing each other's internals or joining each other's tables. | [[09-Decisions/ADR-0019-modular-monolith-ddd]], [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] |

## 2. Quality scenarios

Each scenario is `stimulus → response → measure`. The *measure* is the testable acceptance
gate; budget figures defer to [[../60-Research/performance-budgets]].

### Q1 — Determinism & replay byte-stability

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-1.1** | The same `(engineVersion, seeds, qualityProfile, lineups, tactics)` is simulated twice — once on the authoring runtime, once on the verifying client. | The engine emits the same committed event log. | **Byte-identical** golden replay for `competitive-full` and `interactive-standard`; `background-detailed` may use a bounded statistical envelope; `background-fast` is statistical-envelope-only and is **never** a byte-exact replay source ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]] D2-A). |
| **QS-1.2** | A replay-bearing value (committed event, summary stat, RNG branch, replay decision) is computed in the match core. | It is computed in integers / fixed-point only (basis points 0–10000, integer mm on the 105 000 × 68 000 grid, integer mm/s, integer cents); floats appear only downstream of the committed log in render/interpolation. | CI lint bans `Math.random` / `Date.now` / `setTimeout` and float-threshold branching in all replay-bearing code; the 9 named RNG streams ([[../60-Research/determinism-and-replay]] §2.2) are the only entropy source. |
| **QS-1.3** | An audit, anti-cheat or watch-party verification re-derives a committed match. | Verification runs only against a byte-exact profile and reproduces the committed log. | Mismatch fails the golden-replay gate, which keys off the recorded `qualityProfile`. |

### Q2 — Offline-first availability & honest-draft UX

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-2.1** | The user launches the installed PWA from the home screen with no network. | The offline app shell loads and a previously-saved career is playable (continue, simulate, save, reload). | SW reaches the offline shell within **2 s**; IndexedDB-backed saves load (offline smoke test, [[../60-Research/performance-budgets]] §11.2). |
| **QS-2.2** | The user views read-model data (fixtures, tables) while offline or on a stale cache. | The surface renders one of the four honest UX states: available-offline / cached-stale (freshness-labelled) / draft-on-device / requires-connection. | No surface presents stale data as live; freshness label is shown ([[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0008-mobile-first-ui]]). |
| **QS-2.3** | A drafted command (lineup, transfer) is submitted, then a stale-version or rule conflict is detected. | The optimistic overlay rolls back to the snapshot; the Dexie draft is marked `rejected`/needs-review; the server re-validates and rebases still-valid queued commands. | Every authoritative mutation carries `commandId` + `expectedVersion`; server-authoritative re-validation + rebase is the only authority (CRDTs confined to non-authoritative watch-party overlays; last-write-wins only for cosmetic prefs) ([[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]] D2-A). |

### Q3 — Performance on the device floor

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-3.1** | A primary flow (squad list, tactics editor, matchday lobby, transfer screen, save/load) is interacted with on a Standard-tier device. | The flow responds without a long task. | INP p75 ≤ **120 ms**; LCP p75 ≤ **2.0 s** mobile; CLS p75 ≤ **0.05**; no main-thread task > **50 ms** on the matchday hot path ([[../60-Research/performance-budgets]] §4, §9). |
| **QS-3.2** | A match is played under a given quality profile. | Simulation stays within the per-profile CPU budget; the canvas only interpolates committed events, never blocks on simulation. | `competitive-full`/`interactive-standard` ≤ **50 ms** sim, `background-*` ≤ **30 ms** ([[../60-Research/performance-budgets]] §2.4, §9.2). |
| **QS-3.3** | A device is detected as Floor tier (or fails a required PWA feature). | The app forces Text & Stats match mode, Small world only, shows the one-time slow-device banner; Off-target devices get the HTML fallback. | Tier detection runs before route hydration; the user can downgrade but never upgrade above the detected tier ([[../60-Research/performance-budgets]] §3). |
| **QS-3.4** | A PR changes bundle size or a hot path. | CI perf gates run. | Per-route chunk, initial JS, SW, first-install precache budgets and the match-engine golden-replay budget hold ([[../60-Research/performance-budgets]] §5, §11.2). |

### Q4 — Security, tamper-evidence & audit-trail integrity

The audit trail is **split** by concern, and the two stores must not be conflated:

- the **domain event store / transactional outbox** answers *"how did game state change?"* —
  written same-transaction, idempotent by `event_id`, and is the domain mutation trail
  ([[09-Decisions/ADR-0028-postgres-transactional-outbox]]);
- the **security audit log** (Audit & Security context) answers *"who attempted what, under
  which security decision, with what evidence?"* — append-only, hash-chained with signed
  checkpoints, separate from the domain event store ([[09-Decisions/ADR-0091-audit-security-context-definition]] D2-A).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-4.1** | A command is received (incl. auth/authz decisions, replay rejections, rate-limit triggers, anomaly flags). | The security fact (who/what/when/why + integrity metadata, no raw PII/secrets/payloads) is appended to the security audit log. | Per-record hash-chaining + periodic signed checkpoints (Merkle batching); any tamper breaks chain verification ([[09-Decisions/ADR-0091-audit-security-context-definition]]). |
| **QS-4.2** | A duplicate or replayed command arrives. | Command Reception checks `commandId` + canonical payload hash + actor/session/save/run binding before domain validation. Same hash/binding returns the stored outcome or pending status; different hash/binding rejects as a security fact. | The processed-`commandId` store and envelope checks preserve ADR-0119 semantics; `expectedVersion` conflicts remain distinct concurrency results for Offline Sync rebase UX. |
| **QS-4.3** | A GDPR erasure request lands on pseudonymised security evidence. | Re-identification lookups are severed without breaking the hash chain. | Facts retained, identifiers severed; minimisation + pseudonymisation upheld ([[09-Decisions/ADR-0091-audit-security-context-definition]]). |

### Q5 — Accessibility & mobile-first usability

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-5.1** | A one-handed portrait user navigates the shell. | A bottom-nav of ≤ 5 destinations covers primary flows; lower-frequency hubs reach via Club/More bottom-sheet; the bar respects `env(safe-area-inset-bottom)`. | ≤ 5 visible tabs; touch targets ≥ 44×44px, primary buttons ≥ 48dp ([[09-Decisions/ADR-0008-mobile-first-ui]] U1, U8). |
| **QS-5.2** | An assistive-tech or reduced-motion user opens the app. | Logical focus order with skip-to-nav, focus-trapped bottom-sheet, semantic tabs; `prefers-reduced-motion` disables transitions/parallax. | WCAG 2.2 AA contrast (4.5:1 body, 3:1 large/UI); axe/Lighthouse a11y pass; manual focus-order + reduced-motion check ([[09-Decisions/ADR-0008-mobile-first-ui]] U8). |
| **QS-5.3** | Any list (squads, tables, fixtures, transfers) is rendered. | The list is virtualised with fixed-height rows. | DOM ≤ 1500 nodes/route (hard cap 3000); ≤ 40–60 rendered rows on mobile ([[09-Decisions/ADR-0008-mobile-first-ui]] U2, [[../60-Research/performance-budgets]] §5.4). |

### Q6 — Internationalisation correctness

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-6.1** | The app is built for the MVP locale set. | DE-source with 5 MVP locales (DE/EN/FR/ES/IT) compile to tree-shakable, type-safe messages; locale bundles are content-hashed for SW cache-busting. | Pseudo-loc snapshot (blocking per PR), ICU-validate pre-commit, RTL logical-properties lint, Unicode-property name validation (`\p{L}\p{N}\p{Pd}\p{Zs}`, never `[a-zA-Z]`) ([[09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]). |
| **QS-6.2** | A locale bundle is precached by the service worker on an offline-first install. | The i18n runtime stays within the initial-load / SW-precache budget. | Compiled runtime ~5 KB gz (≈70 % smaller than the i18next baseline), counted against [[../60-Research/performance-budgets]] §5. |

### Q7 — Save integrity & migration safety

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-7.1** | A save is written and later reloaded. | The encrypted envelope round-trips: AES-GCM 256, AAD header binding, gzip-then-encrypt, forward-only phased migration. | Save round-trips; migration is forward-only and version-gated ([[09-Decisions/ADR-0005-save-format]], amended by [[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]). |
| **QS-7.2** | A portable export protected by a user passphrase is created. | The passphrase path uses Argon2id (WASM), loaded only on export/import; the device-backup path keeps PBKDF2-SHA256 @ 600 k on the at-rest hot path. | KDF discriminated by `kdfAlgo`; no `envelopeVersion` break; WASM never on the per-decrypt hot path. Future code-phase release gate: exact provider/version recorded, KDF runs in a Web Worker, module lazy-loads outside the shell but is offline-available after install, OWASP floor params are not weakened, and target-device p95 checks pass before protected portable export ships ([[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]] Δ1, [[../60-Research/argon2id-wasm-kdf-validation-2026-06-19]]). |
| **QS-7.3** | A friend imports a portable export whose active community packs are not all present locally. | The import surfaces the missing-pack gate (lead: block + explain) rather than silently loading a divergent world. | `SavePayload.activePacks` (packId + version + contentHash) travels in the envelope and is checked against the local `PackRegistry` on import ([[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]] Δ2/Δ3). |

### Q8 — Architecture boundary integrity

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-8.1** | A code change imports another bounded context's internal module, schema or persistence surface. | The future architecture-fitness import gate rejects the change. | `dependency-cruiser` forbidden rules fail the `quality` gate after code-phase activation ([[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]). |
| **QS-8.2** | A Drizzle schema/relation/query change crosses context storage ownership. | The future scanner rejects cross-context table ownership, `.references(...)`, `relations(...)` or joins. | Custom TypeScript/SQL scanners fail on known-bad violation fixtures and real source/migration violations. |
| **QS-8.3** | A team needs data from another context for a screen or report. | The owner context publishes a public query, event or read model instead of exposing private tables. | No ownerless shared lookup table or convenience cross-context read lands without an accepted ADR/current-doc exception with owner, Linear link and expiry. |

## 3. Quality gates & enforcement

Quality gates include Biome, TypeScript strict, Vitest coverage, Playwright
offline smoke coverage, Lighthouse + Web-Vitals budgets, determinism
golden-replay + lint gates, bundle-size budgets, the i18n CI gate set and code
review once code phase creates real targets. `main`/`develop` are kept green by
default; the enforcement model, flake policy, and the rare override policy are
defined in [[../30-Implementation/ci-and-review-process]]. The full per-PR perf
gate, device matrix and budget tables are in
[[../60-Research/performance-budgets]] (binding).

FMX-177 accepts the detailed code-phase test-strategy ladder in
[[09-Decisions/ADR-0118-test-strategy-and-quality-gates]] and
[[../40-Quality/test-strategy]]: Vitest/Playwright split, fast-check replay
artifacts, scoped Stryker mutation testing, 85/85/85/75 base coverage threshold
and portable CI-cost posture with a future local `xAi` runner gate. Those
details remain target-only until real code-phase targets exist.

FMX-196 proposes the deterministic simulation specialization in draft
[[09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
and [[../40-Quality/deterministic-simulation-qa-harness]]: replay evidence
levels, seed tiers, same-WASM parity, soak reports and save-forward/replay
compatibility. It is not a binding gate until Nico approves the decision queue.

FMX-167 accepts architecture fitness as an internal future `quality` subgate in
[[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] and
[[../40-Quality/architecture-fitness-function]]. The active docs-phase DoD is
unchanged; future code phase hard-fails the core boundary violations only after
real scanner scripts, violation fixtures, workflows and burn-in exist.

## 4. Per-context quality coverage (FMX-201)

> **Draft extension.** §1–§3 above are the ratified global goals. This section
> records, per bounded context, which global goals genuinely cover it and any
> domain-specific quality scenario whose measure is **binary** (determinism/replay,
> boundary, minimisation) or references an existing binding budget. Numeric
> acceptance thresholds that are not yet decided are listed under **Open measures**
> per context — they are surfaced for ratification, never invented here.

### Rivalry System — Q1 (deterministic per-season decay + tier-FSM ticks), Q7 (per-save graph round-trips), Q8 (Open Host Service, no cross-context joins) genuinely cover this context; Q2/Q5/Q6 inherit shell-level coverage and Q3/Q4 (decay-batch perf, no security/PII surface) are not load-bearing here.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-RIV.1** | `SeasonAdvanced` triggers the per-season decay batch over the rivalry-edge graph, replayed twice from the same save snapshot + same consumed-event log. | The batch applies the deterministic per-sub-score decay rules and re-derives every `rivalry_score`, tier and `RivalryTierTransitioned` event. | **Byte-identical** edge graph, sub-score history and emitted tier-transition events across both runs; decay/score/tier computed in integers only with **no** `Math.random` / `Date.now` entropy in the batch (ADR-0057 §Determinism and storage rules; Q1 / QS-1.2). |
| **QS-RIV.2** | A consumer (Audience & Atmosphere, Matchday-Event-Engine, Watch Party, CommercialPortfolio) needs rivalry tier / score / derby classification. | It reads via the published `RivalryScore` / `IsDerbyFixture` / `DerbyContext` query or the `RivalryTierTransitioned` event; CommercialPortfolio interprets through its own local ACL/projection. | **No** cross-context table join and **no** reach into `RivalryEdge` internals; Rivalry never re-publishes `RivalryCommercialSignal` (removed by ADR-0111); fitness import/no-shared-tables gate holds (Q8 / QS-8.1–8.3, ADR-0121). |
| **QS-RIV.3** | A save carrying a rivalry graph (edges + sub-score history + legacy/overlay seed) is written and reloaded. | The per-save (`save_<uuidv7hex>`) rivalry schema round-trips; the seed copied in at creation is never re-read mid-save. | Graph + history round-trip on the forward-only save path; tier is re-derived from the stored `rivalry_score`, not persisted independently (Q7 / QS-7.1, ADR-0057, ADR-0027). |

**Open measures**

- Per-season decay-batch CPU/time budget for the full rivalry-edge graph on the device floor (no ratified figure in performance-budgets.md; Q3 gate is open until a budget is set).
- Graph-traversal / top-N `RivalryGraphSlice` projection latency target for UI read models (no source-ratified threshold).
- Whether the 5-sub-score decay constants, weights and tier boundaries in the GDDR (e.g. sporting −2/season, tiers None/Mild/Strong/High/Volatile) are frozen as a tuning contract — they are domain rules, not yet a ratified quality-acceptance number.

### Audience & Atmosphere — covered by **Q1** (RNG-driven weekly ticks under three named `WorldRng` sub-labels must replay byte-stable), **Q4/Q7** (per-save segment-aggregate state is GDPR Art. 6/9-sensitive but stores only fictional, segment-level facts — no individual fan records — so it rides the save-integrity and minimisation gates), and **Q8** (own per-save `save_<uuidv7hex>` schema, no cross-context joins). Q2/Q3/Q5/Q6 apply only via the shared shell/budgets, not domain-specifically.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-aa.1** | The same save snapshot is re-simulated across the same world ticks — weekly atmosphere tick (`UpdateSegmentDemand`), per-fixture atmosphere (`ApplyAtmosphereSnapshot`), politics-event triggers and trust-shock evaluation. | Segment cohort, `AtmosphereSnapshot`, `FanIncident` lifecycle and `TicketingTrustLedger` state are re-derived identically, drawing only from `AtmosphereRng(saveId, clubId, week)` / `PoliticsRng(...)` / `TrustRng(...)` (ADR-0018 §3 sub-labels of `WorldRng`). | **Byte-identical** replay of the A&A state surface for the same `(saveId, clubId, week)`; no cross-RNG draws; CI lint bans `Math.random`/`Date.now` in simulation paths (ADR-0062 §Determinism and storage rules, [[../60-Research/determinism-and-replay]]). |
| **QS-aa.2** | A&A reads another context's input (rivalry tier, stadium capacity, match result, commercial breach) for an atmosphere or trust computation. | The input arrives only through a published event/query (`RivalryTierTransitioned`, `StadiumCapacitySnapshot`, `MatchResolved`, `CommercialContractActivated`/`CommercialBreachOpened`) via ACL + the ADR-0028 outbox. | **No cross-context table join** and no `.references(...)`/`relations(...)` across context ownership; the architecture-fitness scanner fails on violation (ADR-0121, ADR-0062 §Determinism and storage rules). |
| **QS-aa.3** | A `SupporterSegment` row or a `NamedSupporterGroup` overlay is persisted or exported in a save. | Only segment-level aggregate facts and fictional group facts are stored; a representative is at most an opaque People actor ref. | **No individual fan record, handle, photo, profile or special-category label** is present, and no real club/supporter-group/person name is embedded as a sample (ADR-0062 GDPR/DSA posture, GD-0015, ADR-0007). |

**Open measures**
- Weekly atmosphere-tick / per-fixture `ApplyAtmosphereSnapshot` CPU cost has no ratified per-tick budget — needs a numeric threshold (no figure in performance-budgets.md for the A&A loop).
- Cohort-FSM transition thresholds, politics-event firing values ("very high"/"very low"), ouster-call escalation tiers, `FanIncident` decay-rate/active-duration constants and `TicketingTrustLedger` per-segment decay + three-season expiry are all undefined by ADR-0062 (FSM note §9); each needs a ratified number before its determinism/property test can assert a concrete bound.
- Whether `SegmentMood` is a continuous scalar or banded discrete states (FSM note §9.5) is undecided, blocking a banded-state replay assertion.

### Identity & Access — global-goal coverage

Genuinely covered by **Q4** (auth/security identity events feed the security audit log; Identity owns the GDPR erasure-initiation seam), **Q8** (narrow Platform & Governance context, contract-only integration via opaque ids / `PrincipalContext` / events, no shared tables), and **Q2** (publishes session/device-validity facts that Offline Sync consumes without holding auth truth). It is **not** RNG-driven (no determinism/replay gate) and **not** compute/graph-heavy (no domain perf budget of its own). All domain-specific measures below are binary boundary / erasure-seam gates; every retention/timing/KDF numeric is deferred by ADR-0123 §7 and listed under Open measures.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-IA.1** | Another bounded context (Offline Sync, Audit & Security, Community Overlay, Payments, a domain context) needs identity data for authorization or a screen. | Identity exposes only the published opaque ids (`AccountId`/`SessionId`/`DeviceId`/`CredentialId`/`GlobalRoleAssignmentId`), the `PrincipalContext` read model, and the published events/queries — never its internal credential/session/device tables. | **Binary:** no cross-context join, `.references(...)` or `relations(...)` into Identity storage; integration is contract-only. Fails the Q8 architecture-fitness gate (QS-8.1/QS-8.2) on any direct read of Identity tables ([[09-Decisions/ADR-0123-identity-access-context-definition]] §3/§5, [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]). |
| **QS-IA.2** | A GDPR account-deletion/purge request is processed. | Identity revokes sessions + refresh families and devices, burns credentials/direct identifiers, and emits `AccountDeletionRequested`/`AccountRestored`/`AccountPurged`; Audit & Security pseudonymises retained evidence and severs re-identification material. | **Binary:** Identity emits the lifecycle events and does **not** mutate or delete Audit & Security's archive directly; the security hash chain stays intact (QS-4.3 holds) ([[09-Decisions/ADR-0123-identity-access-context-definition]] §6). |
| **QS-IA.3** | An auth/security identity decision occurs (session start/refresh/revoke, device register/revoke, credential add/revoke, account-status change). | Identity emits the corresponding published auth/security identity event with principal/session/device identifiers; Audit & Security appends the tamper-evident security fact. | **Binary:** the security fact carries no raw PII/secrets/payloads and is hash-chained (QS-4.1 holds); domain command authorization is still decided by the receiving context, not by Identity ([[09-Decisions/ADR-0123-identity-access-context-definition]] §1/§4, [[09-Decisions/ADR-0091-audit-security-context-definition]]). |

**Open measures:**
- Token / session / refresh-family / device-registration **retention durations** — deferred by ADR-0123 §7; no ratified numeric.
- **Step-up authentication** validity/timeout window for sensitive account ceremonies — undecided.
- WebAuthn/passkey and password-fallback **KDF/algorithm parameters and pinned package versions** — explicitly deferred (re-check OWASP ASVS + current docs before code phase).
- Session/device-validity **propagation latency** to Offline Sync (revocation→honoured) — needs a Q3-style budget figure not yet in [[../60-Research/performance-budgets]].

### League Orchestration — Q1 (seeded fixture draw + season-rollover are replay-bearing), Q7 (season/registry state migrates forward in saves), Q8 (League is sole authority for official ordering; no shared tables / cross-context joins) genuinely cover this context. Q3 (perf) applies to fixture generation and standings resolution but has no ratified per-operation budget yet (see Open measures). Q2/Q4/Q5/Q6 are not load-bearing here: League holds no PII/security surface, exposes only published-language facts, and carries IP-clean name refs rather than user-facing locale strings.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-LO.1** | `GenerateFixtures(competitionSeasonId)` is called twice with the same `(seed, participants, format)`, once per runtime. | Pure circle-method + seeded draw under the single `fixtures:<competitionSeasonId>:draw` `WorldRng` sub-label produces the same fixture set. | **Byte-identical** fixtures; idempotent / fire-once per edition; integer-only, no wall-clock, no entropy outside the named draw label (ADR-0068 F1–F5, module Invariants). |
| **QS-LO.2** | A champion / qualification / promotion-relegation / season-rollover outcome is resolved. | It is decided from League-owned official ordering (`TieBreakerRule` + `GetOfficialCompetitionStandings` / `CompetitionStandingsFinalizedV1`), never from the Statistics `standingsRef`. | **Binary:** the Pyramid-rollover process manager and finalisation read League official standings only; the Statistics projection is display/history and decides no structural outcome (ADR-0066 I10, ADR-0068 F8, FMX-131). |
| **QS-LO.3** | Another context needs season/standings/revenue data, or a change adds a cross-context table read. | League publishes self-contained published-language facts (`FixturesPublished`, `CompetitionStandingsFinalizedV1`, `Competition/FixtureCommercial…Published`, snapshot queries); consumers never read League tables. | **Binary:** no shared table, `.references(...)`, `relations(...)` or cross-context join against League schema; architecture-fitness import/schema gates hold (Q8 QS-8.1–8.3, ADR-0121, ADR-0066 I-set, ADR-0070 P1). |

Open measures: see below.

### Club Management — global-goal coverage

Covered by **Q1** (RNG-driven Board/Ownership/insolvency draws on `WorldAiMgmtRng` and facility decay on `StadiumRng` must replay byte-identically; the weekly authoritative tick is replay-bearing), **Q8** (sole finance-ledger writer: no other context writes finance tables and no cross-context table join, enforced by the architecture-fitness gate), **Q7** (append-only ledger + balanced double-entry postings round-trip and migrate forward under the save format), **Q2** (economy/board read models render under the honest-draft offline UX), and **Q3** (the weekly economy tick and matchday cost settlement stay within the existing per-profile sim/perf budgets). Q4 owner-side audit/PII is **not** primary here — the security audit log and re-identification facts live in the Audit & Security context (ADR-0091), and real-money Investor grants carry no PII/payment internals on this side (ADR-0063).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-CM.1** | The same `(engineVersion, seeds, save state, weekly inputs)` advances the club economy week twice (`AdvanceClubEconomyWeek` / `EconomyWeekAdvanced`), including stochastic Board & Ownership / insolvency draws and facility decay. | Both runs emit the same committed ledger and Board/Ownership event sequence. | **Byte-identical** ledger + event log across runs; stochastic draws use only `WorldAiMgmtRng` sub-labels and `StadiumRng`, board-ambition escalation declares no RNG, and no `Date.now`/wall-clock is read (ADR-0079, ADR-0061, [[../60-Research/determinism-and-replay]] §2.2; ADR-0101 settlement keys off the recorded `qualityProfile`). |
| **QS-CM.2** | A finance fact arrives from another context (Commercial / Staff / Transfer settlement) or a posting handler runs. | Club Management is the only writer of finance tables; the posting is a balanced ≥2-line double-entry derived from the ledger + Club-owned policy, never an alternate primary truth, and never a cross-context table join. | **Binary**: no other context writes finance tables and no `.references(...)`/`relations(...)`/join crosses the boundary (ADR-0121 / Q8); every posting satisfies the ADR-0095 LI-1..LI-9 balanced-entry invariant (debits = credits, integer minor units). |
| **QS-CM.3** | A save containing ledger entries, projections and Board/Ownership FSM state is written and later reloaded, or migrated to a newer version. | The append-only ledger and all FSM/policy state round-trip; projections (cashflow, P&L, budgets, insolvency stage) are re-derived from the ledger, not stored as primary truth. | **Binary**: save round-trips and migration is forward-only and version-gated (Q7, ADR-0005/ADR-0098); replayed ledger re-derives identical projections; `chartOfAccountsVersion`/`categoryCatalogVersion` are additive-only with no renumbering (ADR-0106). |

**Open measures**

- Board-confidence ladder bounds, decay/expectation thresholds and the 2-phase sacking trigger points — no ratified numeric scale.
- Facility-condition decay constants and maintenance-effect magnitudes (`StadiumRng` draw ranges) — undecided numeric tuning.
- Cashflow-runway horizon (days/weeks) and overdue-payables ageing buckets surfaced by `CashflowRunwayForecast` / `OverduePayablesAging` — no ratified figures.
- Economy soak-test stability tolerances (acceptable drift % over a long simulated run) from the calibration/soak runbook — not yet ratified as a numeric acceptance gate.
- Per-tick CPU/latency budget specifically for `AdvanceClubEconomyWeek` and matchday cost settlement — covered only by the general per-profile budget in performance-budgets.md; no economy-specific figure ratified.

### Squad & Player — global-goal coverage

Squad & Player is a **stateful, event-applying, PII-bearing** context (durable player truth, contracts, discipline, availability) that consumes facts/signals and applies durable consequences — it is **not** itself an RNG generator (Match/Training emit the stochastic facts). Genuinely covered by: **Q1** (replay byte-stability — applying the same ordered upstream event log must reproduce identical durable player state), **Q4** (player records are PII; erasure-vs-retention partition and severable identifiers via ADR-0127), **Q7** (durable player/contract/discipline state round-trips and migrates forward inside the save), **Q8** (boundary integrity — ADR-0131 §6 invariant "must not import Training/Match/Tactics storage or internals", enforced by ADR-0121). Q3 (perf), Q5 (a11y), Q6 (i18n) apply via the global scenarios; no domain-specific binary measure is ratified for them here.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-sp.1** | The same ordered upstream fact log (`PlayerDevelopmentDeltaApplied`, `MatchInjuryOccurred`, `PlayerSuspendedV1`, contract-lifecycle advances) is replayed against a fresh Squad & Player state on the verifying runtime. | The context re-derives the same durable `PlayerRecord` / `PlayerAvailability` / `PlayerDisciplineLedger` / `PlayerContractLifecycle` state. | **Byte-identical** re-derived durable player-state snapshot for the same `(engineVersion, ordered events)`; deltas applied in integer/fixed-point only, no `Math.random`/`Date.now`/wall-clock branching in state application ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]], [[09-Decisions/ADR-0131-squad-and-player-context-definition]] §6). |
| **QS-sp.2** | Match, Training or Transfer needs durable player data for a screen, lineup lock or signal calc. | The consumer reads a published Squad & Player event/query/projection (`GetSquadProjection`, `ImpactLensProjection` via the squad `queryGateway`); durable player state is mutated only inside Squad & Player. | **No cross-context table join** and no import of another context's Drizzle tables; cross-context needs met only via published events or denormalised projection inputs copied into Squad-owned storage ([[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[09-Decisions/ADR-0131-squad-and-player-context-definition]] §6). |
| **QS-sp.3** | A GDPR erasure request lands on a `PlayerRecord` that carries real-person-linked identifiers. | Identifiers are severed per the erasure-vs-retention field partition; retained sporting facts (discipline ledger, contract history) survive without breaking replay or save round-trip. | Erasure follows the field partition (severable identifiers vs retained facts) of [[09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]; the save still round-trips and migrates forward-only ([[09-Decisions/ADR-0005-save-format]]). |

**Open measures**

- No ratified numeric budget exists for Squad & Player read-model/projection rebuild latency (e.g. `GetSquadAvailabilityBoard` / `ImpactLensProjection` p75 on a Standard-tier device) — needs a [[../60-Research/performance-budgets]] figure before it can be a perf gate.
- No ratified bound for development-delta application or attribute-progression value ranges (basis-point clamps, decay/regression constants) — a determinism-safe integer envelope needs a number from the development-model GDDR.
- No ratified threshold for squad-state churn volume per weekly tick (events applied per save per tick) for soak/perf sizing.

### Training — global-goal coverage

Training is a stateful Sporting Core context that runs a per-club **weekly processing tick** computing load/fatigue/readiness, development-signal batches and injury-risk/set-piece-readiness signals (ADR-0130). It is therefore covered by **Q1** (the weekly tick and its `DevelopmentSignalBatch`/`InjuryRiskSignal` outputs are replay-bearing and must be byte-stable from the same seeds+inputs), **Q8** (it owns its own schema, consumes Squad & Player / Tactics / Staff facts only via snapshot/projection contracts — no shared tables, no cross-context joins per ADR-0121), **Q2** (weekly plans and projections must be authorable and processable offline as part of a continued career) and **Q3** (the weekly tick and readiness screens ride the global device-tier perf budgets). It is **not** a direct **Q4** PII/security surface: it holds no durable player master records, contracts or injury truth (those stay in Squad & Player), so audit/PII obligations attach to the owner context, not here. Numeric calibration magnitudes for load/readiness/development are owned by GD-0043, not by this quality block.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-T.1** | The same `(engineVersion, seeds, training plan, consumed upstream snapshots)` is processed twice through `ProcessTrainingWeek`. | The weekly tick emits the same `TrainingWeekProcessed`, `DevelopmentSignalBatchPrepared`/`PlayerDevelopmentDelta`, `InjuryRiskUpdated`/`TrainingInjuryOccurred` and `SetPieceCoachReadinessUpdated` facts. | **Byte-identical** development-signal batch and emitted-fact stream; any stochastic step (injury-risk roll, development variance) draws only from a named determinism RNG stream, never `Math.random`/`Date.now` (QS-1.2, [[../60-Research/determinism-and-replay]]). |
| **QS-T.2** | A Training calculation needs player fitness baseline, `RoleProfileForPosition`, trainer capacity or fixture-density facts from another context. | Training reads them through the owner context's published query/snapshot/projection, never by importing internals or joining its tables. | No cross-context table join or `.references(...)` into Squad & Player / Tactics / Staff / Calendar storage; the architecture-fitness import + storage gates pass (QS-8.1/QS-8.2, ADR-0121, ADR-0130 §4). |
| **QS-T.3** | A user edits a weekly training plan or assigns individual focus while offline. | The plan command is authored, queued and (on `ProcessTrainingWeek`) processed locally; readiness/load projections render from on-device state. | Plan authoring and weekly processing complete with no network; queued authoritative commands carry `commandId` + `expectedVersion` and rebase server-side on reconnect (QS-2.1/QS-2.3). |

**Open measures**
- Per-tick CPU/latency budget for `ProcessTrainingWeek` on each device tier — not yet a figure in [[../60-Research/performance-budgets]] (Q3 threshold open).
- Whether `background-*`-style statistical-envelope tolerance applies to bulk AI-club training ticks, or all training ticks must be byte-exact — replay evidence level for Training not yet ratified (extends QS-1.1 to this context).
- Numeric acceptance bounds for development-delta and injury-risk outputs (decay/variance constants, score ranges) — owned by GD-0043 gameplay calibration, not yet decided.
- Deterministic payload schema for `DevelopmentSignalBatch` / readiness / role-familiarity projections — deferred to code phase (ADR-0130 Consequences), so no byte-shape gate can be pinned yet.

### Transfer — global-goal coverage

Q1 (determinism/replay) covers Transfer's `TransferRng` / `WorldAiMgmtRng`-driven variance — valuation, acceptance, leak risk and AI planning are seeded with draw indices persisted in provenance, with no new RNG streams ([[transfer-market-architecture]] §6, [[modules/transfer]] Invariants). Q2 (offline-first/honest-draft) covers locally drafted offers that submit as server-authoritative commands and hard-reject on conflict ([[09-Decisions/ADR-0011-server-authoritative-multiplayer]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]). Q4 (security/audit) covers the outbox command/event trail and `TransferAbuseFlagged` facts ([[09-Decisions/ADR-0028-postgres-transactional-outbox]], [[09-Decisions/ADR-0091-audit-security-context-definition]]). Q8 (boundary integrity) covers the strict no-cross-context-JOIN, facts-not-ledger-writes ownership split ([[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]). Q3/Q5/Q6/Q7 apply only through their global scenarios (the transfer screen is a Q3 primary flow in QS-3.1; transfer lists are a Q5 virtualised list in QS-5.3).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-T.1** | A window tick — market-snapshot build, opportunity generation, AI club planning and player/agent acceptance — is run twice from the same `(engineVersion, seed, draw-indices, input read models)`. | Transfer re-derives the same valuation bands, opportunities, counters and acceptance outcomes; variance comes only from `TransferRng` / `WorldAiMgmtRng`. | **Byte-identical** event stream (`TransferMarketSnapshotCreated` … `TransferCompleted`/`TransferCollapsed`) for the replayed tick; only the 9 named streams are entropy and provenance carries seed + draw indices; CI determinism lint bans `Math.random`/`Date.now` in replay-bearing transfer code (Q1; [[transfer-market-architecture]] §6, [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]). |
| **QS-T.2** | A locally drafted offer is submitted, then a stale state / deadline / budget / eligibility conflict is detected server-side. | The optimistic draft rolls back; the server re-validates and hard-rejects as `rejected_with_reason`; server owns deadlines, counters, expiry and registration. | Every submitted offer is a command carrying `commandId` + `expectedVersion`; conflicts hard-reject and never mutate authoritative state client-side (Q2/Q4; [[09-Decisions/ADR-0011-server-authoritative-multiplayer]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]). |
| **QS-T.3** | A completed deal must move money, and a transfer screen needs another context's finance/contract data. | Transfer emits completed-deal facts only; Club Management posts every ledger entry; the screen reads published read models, never another context's tables. | **No** `transfer_*` table JOINs or `.references(...)` across context ownership, and **no** ledger write originates in Transfer — `dependency-cruiser` + cross-context scanner fail the violation (Q8; [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]], [[09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]]). |

**Open measures**

- Per-window simulation cost budget for Transfer (snapshot build + opportunity generation + AI planning) under each world-simulation tier (Tier 0–3, §8) — no CPU/ms budget is ratified in `performance-budgets.md` for the transfer tick.
- `confidence_bp` band-width acceptance for the Expert Information Contract (how narrow a valuation band must be at a given scouting/data level before it may be shown) — needs a ratified numeric threshold.
- Escalation pressure accumulator / hysteresis stage thresholds (draft ADR-0088 ES1–ES5) — no ratified numeric constants; stays draft until FMX-102 is ratified.
- Negotiation/offer expiry and counter-deadline durations — server-owned but no ratified numeric values to assert against.

### Match — global-goal coverage

Match (ADR-0129) is the canonical RNG-driven, compute-heavy, replay-bearing context, so it is the *home* of **Q1 Determinism & replay byte-stability** (committed `MatchEventLog`, replay stream, 9 named RNG streams, integer/fixed-point numeric surface per ADR-0096) and a primary subject of **Q3 Performance** (per-quality-profile simulation CPU budgets). It is covered by **Q8 Architecture boundary integrity** (consumes frozen Squad/Tactics/Training/Regulations/Environment snapshots at lock time, never live cross-context joins during replay/simulation — ADR-0129 §4/§5) and touches **Q4** (committed event log feeds the domain mutation trail / anti-cheat re-derivation) and **Q7** (committed log + lock snapshot are the save-forward/replay artifact). Match bears no durable PII of its own — it freezes only the fields needed for simulation and emits facts that owner contexts apply.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-match.1** | A locked match `(engineVersion, seeds, qualityProfile, MatchLineupLock, TacticSnapshot)` is simulated on the authoring runtime and re-derived on a verifying client. | Match emits the same committed `MatchEventLog`. | **Byte-identical** committed event log for `competitive-full` / `interactive-standard`; `background-detailed` bounded-envelope, `background-fast` statistical-only and never a byte-exact replay source (global QS-1.1; [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]] D2-A, [[09-Decisions/ADR-0129-match-context-definition]] §5). |
| **QS-match.2** | The match core replays or reconstructs authoritative state during simulation. | It reads only the immutable lock-time snapshots; it never queries Squad / Tactics / Training / Regulations / Environment for live state. | **Binary**: no live cross-context read on the replay/simulation path; replay/determinism inputs are immutable after `MatchLineupLocked` ([[09-Decisions/ADR-0129-match-context-definition]] §5 invariants); enforced by the Q8 import + no-shared-tables gate ([[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]). |
| **QS-match.3** | A match is simulated under a given quality profile. | Simulation stays within the per-profile CPU budget and the canvas interpolates committed events only. | `competitive-full` / `interactive-standard` and `background-*` hold their existing per-profile sim budgets (global QS-3.2; [[../60-Research/performance-budgets]] §2.4, §9.2). |

**Open measures**

- Maximum tolerated replay re-derivation wall-clock for an on-device anti-cheat / watch-party verification pass (verification-latency budget) — not a ratified figure.
- Acceptable statistical-envelope tolerance bounds for `background-detailed` (the non-byte-exact profile) — bounds named but not numerically ratified.
- `MatchEventLog` size / retention ceiling per fixture for save-forward and replay-stream export — no ratified cap.

### Watch Party — covered by Q8 (boundary: owns party-scoped social/runtime truth only, holds `MatchId`/`LeagueId`/`MemberId` as opaque branded refs, no cross-context joins; pause reaches Match only via `PauseMatch`/`ResumeMatch`), Q1 (consumes the byte-exact committed event log and never injects entropy into simulation — verification keys off Match's golden-replay gate, not Watch Party state), Q2 (party social overlays stay non-authoritative, CRDT confined per ADR-0090), and Q4 (moderation/pause-vote audit handoff with no raw PII in the security log). Watch Party is a stateful social-orchestration context, **not** an RNG-driven simulation context, so Q1 applies only as a boundary/consume guarantee; Q3 performance and the quorum/pause/delay thresholds are open.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-wp.1** | A pause vote enacts and Watch Party needs the live match paused/resumed. | Watch Party emits `PauseMatch` / `ResumeMatch` through Match's public seam; it never writes Match's committed event log, replay state or result authority. | **Binary**: no Watch Party code path mutates Match aggregates/tables directly; the future architecture-fitness import + no-shared-tables gates reject any Watch Party → Match internal import or cross-context join ([[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[09-Decisions/ADR-0133-watch-party-context-definition]] §7). |
| **QS-wp.2** | A spectator/replay client verifies a watch-party broadcast against its target match. | Verification re-derives the match from the **byte-exact committed event log** Watch Party streamed over; Watch Party adds no entropy, votes-as-wall-clock or social state to the deterministic core. | **Binary**: re-derivation reproduces the committed log and fails the golden-replay gate on any mismatch; party chat/markers/moderation/votes never enter replay-bearing code ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]], [[09-Decisions/ADR-0099-spectator-watch-party-streaming-over-committed-event-log]], QS-1.3). |
| **QS-wp.3** | A chat message, marker or moderation action is collaboratively edited / synced across party members offline. | MVP surface stays server-ordered append-only owned by Watch Party; any future CRDT overlay is confined to non-authoritative collaboration and never becomes authoritative game state. | **Binary**: CRDT/last-write-wins paths are confined to non-authoritative watch-party overlays and cosmetic prefs; no overlay document feeds authoritative state ([[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]] D2-A, [[09-Decisions/ADR-0133-watch-party-context-definition]] §6, QS-2.3). |

**Open measures**
- Schedule-poll quorum threshold(s) — no ratified numeric value ([[09-Decisions/ADR-0133-watch-party-context-definition]] notes these are undefined).
- Pause budgets, cooldown durations and consent-window timeouts for `WatchPartyPauseControlProcess`.
- Spectator broadcast-delay policy parameters and broadcast-cursor freshness/latency targets (Q3 perf gate) — no binding budget figure exists yet in [[../60-Research/performance-budgets]].
- Party-state honest-freshness labelling acceptance for offline/stale party projections (Q2) — needs a concrete staleness threshold.

### Notification — global-goal coverage

Notification is a stateful, offline-first, event-consuming delivery context with no RNG and no compute/graph-heavy core, so the determinism (Q1) and performance (Q3) gates apply only via the generic global budgets, not via domain-specific scenarios. It is genuinely covered by **Q2** (offline-first: Dexie inbox mirror, `lastSeenVersion`/watermark reconnect replay repairs missed state, push is best-effort only), **Q4** (security/PII: push payloads are opaque hints with no secret/credential/personal data; durable record written before any channel attempt; delivery/audit events), **Q7** (the durable Postgres record + watermark are part of save/replay integrity), and **Q8** (own schema/tables, no cross-context joins, contract-only access). The scenarios below are binary or reference an existing accepted source ([[09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]], [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]); thresholds (e.g. push TTL/urgency, digest window, watermark sync latency) are deferred to Open measures.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-N.1** | A client reconnects after offline with a stale notification `lastSeenVersion`/watermark, having possibly missed pushes while asleep. | The context replays durable records above the watermark from the inbox projection and advances the watermark only after the projection is applied. | **Binary:** the UI renders only from the durable inbox projection, never from a push/email/realtime payload, and no missed notification is lost — reconnect replay repairs all state above the watermark ([[09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]] D2-A/D3-A/D4-A via the [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]] seam). |
| **QS-N.2** | A notification is dispatched to Web Push / native push. | A push payload is built as an opaque hint (`notification_id`, `version`, category, urgency, deep-link metadata only). | **Binary:** the payload contains no secret, provider credential or personal data; renderable notification truth lives only in the durable record, not the push payload ([[09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]] D2-A, push-payload contract). |
| **QS-N.3** | Notification consumes a producer fact (e.g. `TrainingWeekProcessed`, `RivalryTierTransitioned`, `MatchInjuryOccurred`) and reads/writes its own state. | Facts arrive via the Postgres transactional outbox; Notification renders projections into its own schema and never joins or writes another context's tables. | **Binary:** no cross-context table join / `.references(...)` / `relations(...)`; cross-context data is contract-only and Notification does not mutate source domain state — the architecture-fitness import/storage gate rejects violations ([[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[09-Decisions/ADR-0028-postgres-transactional-outbox]]). |

**Open measures**

- Push delivery TTL / urgency / topic bounds and the redundant-push suppression window (server-known seen/read evidence) — needs ratified numeric thresholds (currently best-effort, undecided).
- Digest / batching window and quiet-hours boundaries for routine-report notifications — no numeric window ratified.
- Watermark/inbox reconnect-replay latency and `DeliveryAttempt` idempotency retry budget on the device floor — defer to a ratified per-tier figure (not yet in [[../60-Research/performance-budgets]]).
- Concrete public command / query / domain-event names for the delivery/audit stream — undefined in the source (flagged in the module's Open items), so no contract-shape conformance measure can be pinned yet.

### Manager & Legacy — covered by Q1 (determinism/replay byte-stability), Q7 (save integrity / cross-save-meta isolation) and Q8 (architecture boundary integrity)

This context is a **pure deterministic projection** layer (ADR-0082 M5: snapshot assembly declares **no `*Rng` sub-label** — it reads already-resolved committed facts), so it inherits Q1 not as an entropy source but as a re-derivability gate. Its hard cross-save rule (a running save **never** reads mutable cross-save meta after creation; selected legacy/prestige config is copied into the save snapshot at creation only — ADR-0051 §Determinism, ADR-0082 M4) is a Q7 save-creation-determinism concern. It owns its own storage with **no cross-context table joins** and stores analysis snapshots, not alternate truth (ADR-0051, ADR-0121), making Q8 directly load-bearing. It is not RNG-driven (no own determinism numeric surface) and not compute/graph-heavy, so Q3 applies only via the global UI budgets in [[../60-Research/performance-budgets]], not a domain-specific perf gate. It is PII-light (manager profile only) and persists no security audit trail of its own (Q4 stays with Audit & Security).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-ML.1** | The same ordered set of committed run-end facts (ordered by `endedAtSeq`) is projected into a `RunAnalysisSnapshot` / `ManagerStyleSignals` twice. | Snapshot assembly re-derives the identical snapshot; it introduces no entropy and declares no `*Rng` sub-label. | **Byte-identical** snapshot for the same `(endedAtSeq`-ordered facts, engineVersion); CI determinism lint confirms no `*Rng` sub-label and no `Math.random`/`Date.now` in projection code (ADR-0082 M5, [[../60-Research/determinism-and-replay]]). |
| **QS-ML.2** | A save is created with a selected legacy/prestige configuration, then mutable cross-save meta (legend ranking, profile-global prestige) changes, and the save is later reloaded/replayed. | World-gen copies the selected config into the save snapshot; the running save reads the **copied** value, never the changed cross-save meta. | Replay/reload uses the snapshot-copied config, not current global meta; the running save performs **zero** reads of mutable cross-save meta after creation (binary; ADR-0051 §Determinism, ADR-0082 M4, ADR-0083 HF3/D8). |
| **QS-ML.3** | A code change attempts to read a producer context's facts (Match, Transfer, Club Management, Tactics, League) via a table join, or this context tries to write per-save records or money/match truth. | The architecture-fitness gate rejects the cross-context join; records stay Statistics-owned (ADR-0081) and money/match/transfer facts stay with their owners. | **No cross-context table join** and no ownerless shared read; inputs arrive only via published events/queries; `dependency-cruiser`/scanner forbidden rules fail the `quality` gate (ADR-0051, ADR-0121, QS-8.1/8.2). |

**Open measures**

- Latency/CPU budget for run-end snapshot assembly and the awards/honours/HoF generation pass (no per-context figure ratified; ADR-0083 enumerates data shapes but no command/event surface or timing — defer to a binding budget in [[../60-Research/performance-budgets]]).
- Acceptance bound for the cross-save legend-ranking / prestige aggregation read at world-gen (top-N index size, recompute cost) — no number ratified.
- Save-forward compatibility tolerance for the forward-additive reserved-stub legacy/record schema (old build ignoring unknown `factId`) under the FMX-196 save-forward/replay matrix — gate exists in draft ADR-0120 but no Manager & Legacy-specific threshold is set.

### Staff Operations — global-goal coverage

Staff Operations is a **stateful, event-driven, per-save** context (contract-lifecycle FSM + weekly wage tick), not its own RNG source. It is genuinely covered by **Q1** (the contract FSM and pipeline-coverage recomputation are replay-bearing state that must re-derive identically from the same committed event inputs), **Q2** (per-save state in the offline save; commands carry `commandId`/`expectedVersion`), **Q4/Q7** (wage facts emitted through the ADR-0028 transactional outbox feed the Club Management ledger and travel in the save envelope, so they are tamper-/integrity-relevant), and **Q8** (strict per-save schema ownership, no shared tables, no cross-context joins, wage facts leave only as `StaffWagePosted` events). **Q3** (perf) and read-model tolerance bands have no ratified staff-specific budget yet — see Open measures. **Q5/Q6** are covered generically by the global UI/i18n gates (no staff-specific surface measure).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-staff.1** | The same committed inputs (`EconomyWeekAdvanced` weekly tick + the same prior `StaffContract*`/`StaffRoleAssigned` event log) are replayed twice. | The contract FSM advances and the `PipelineCoverageSnapshot` / `WageScheduleProjection` are recomputed. | **Byte-identical** projection output and identical emitted `StaffWagePosted` / `PipelineCoverageRecalculated` event stream across replays; recomputation is pure denormalisation from owned storage + published events, with no `Math.random`/`Date.now`/wall-clock branching (Q1, [[09-Decisions/ADR-0053-staff-operations-context]] §Determinism, [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]). |
| **QS-staff.2** | A code change or query in Staff Operations reads or joins another context's tables (e.g. People persona/skill rows, the Club Management ledger). | The architecture-fitness import/storage gate rejects the change. | **No cross-context table join and no foreign `.references(...)`**; staff facts reach Club Management only as `StaffWagePosted` outbox events and persona/skill data is consumed only via published `StaffSkillProfileSnapshot` queries — never stored locally (Q8, [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], ADR-0053 §Storage rules). |
| **QS-staff.3** | A wage fact must move to the Club Management ledger for the weekly tick. | Staff Operations emits `StaffWagePosted` (aggregated as `StaffWageBlockPosted`) through the ADR-0028 transactional outbox; Club Management consumes via ACL and posts its own ledger. | **No shared transaction and no direct write to finance tables**; emission is same-transaction, idempotent by event id, eventually consistent Customer-Supplier + ACL (Q4/Q8, ADR-0053 §Determinism, [[09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]], [[09-Decisions/ADR-0028-postgres-transactional-outbox]]). |

**Open measures:** see the context-level Open-measures list (Q3 staff-tick perf budget undecided; pipeline-coverage multiplier/tolerance bands provisional until playtest; consumer-side staff-skill modifier formulas unpinned; `SetPieceCoachReadinessUpdated` emitter ownership unresolved).

### Tactics — Q1 (determinism/replay), Q7 (save integrity) and Q8 (boundary) genuinely cover this context

Tactics is a per-save library context (ADR-0055) whose outputs feed replay-bearing match state, so the **determinism/replay** gate (Q1) governs its set-piece variant selection (ADR-0067), its seeded opposition-template selector (ADR-0080, `WorldAiMgmtRng`) and its `TacticalIdentityFingerprint` projection (ADR-0074). Its `save_<uuidv7hex>`-only storage and copy-at-creation seed rule land it under **save integrity** (Q7), and its Reference+Snapshot semantics plus no-shared-tables rule land it under **architecture boundary** (Q8). Q2/Q3/Q5/Q6 inherit the global PWA/offline/perf/a11y/i18n gates through the tactics-editor UI surface but carry no Tactics-specific binding measure yet; Q4 does not apply (no PII or security-decision facts originate here).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-tactics.1** | A dead-ball situation is resolved twice from the same frozen `TacticSnapshot.setPieces` and `DeadBallContext`. | The engine selects the same variant via the pure ordering `(priority DESC, variantId ASC)` under the module's `selectionMode`. | **Byte-identical** variant choice across runs; selection is a pure function of the deeply-readonly snapshot fields, no `Math.random`/wall-clock entropy ([[09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]). |
| **QS-tactics.2** | An opponent is faced twice under the same planning inputs; Tactics runs its opposition-template selector. | Selection draws only from `WorldAiMgmtRng` sub-label `worldAiMgmt:opposition-template:fixture:<fixtureId>:club:<clubId>:v1:select`; the result is frozen into `TacticSnapshot.oppositionTemplate` at `lineup_locked`. | Same inputs → same `OppositionTemplateSelectedForMatchV1`; a missing valid selection **fails fast** with `opposition_template_selection_missing`, never a silent Match-side fallback ([[09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]). |
| **QS-tactics.3** | A live tactic preset is edited after `lineup_locked`, or a code change adds a cross-context table join/`.references()` to read Squad/Match/AI-World state. | The in-flight match keeps its frozen snapshot (Reference + Snapshot); the boundary gate rejects the cross-context access. | Post-lock preset edits **do not** change the in-flight match; no cross-context join lands (`dependency-cruiser` + no-shared-tables scanner fail) ([[09-Decisions/ADR-0055-tactics-context]], [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]). |

**Open measures**
- Performance budget for the opposition-template selector and `TacticalIdentityFingerprint` projection on the matchday hot path (no Tactics-specific figure in [[../60-Research/performance-budgets]]).
- Tactics-editor (Quick/Standard/Expert) interaction-latency / DOM-size acceptance target beyond the generic Q3/Q5 budgets.
- Any numeric tolerance for the fingerprint EWMA/confidence outputs treated as a replay byte-stability acceptance threshold (ADR-0074 algorithm constants are not ratified as quality gates).

### Regulations & Compliance — global-goal coverage

Genuinely covered by: **Q1** (verdicts are pure functions of input + aggregate state + `ruleSetVersion` with no wall-clock / no RNG / no live catalog read, so they replay byte-stably by recomputation — ADR-0069 E3, ADR-0051); **Q7** (the active rule set is copied into the `save_<uuidv7hex>` snapshot at save creation and is immutable thereafter except for pre-authored future-changes, so a save reproduces the same effective rules forward — ADR-0056, ADR-0027); **Q8** (Open Host Service + Published Language only — no shared tables, no cross-context joins, opaque `ruleRef`/`RemediationRef` — ADR-0121, ADR-0069 E1/E8); partial **Q4** (IP / `risk:legal`: rule *text* never crosses the boundary, only opaque refs); partial **Q6** (rule/remediation strings are localised display, never authoritative keys). This context is **not RNG-driven** — its determinism contribution is recompute-stability, not a seeded tick.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-RC.1** | The same `(ruleSetVersion, aggregate-state inputs, query)` is evaluated twice on a save's immutable rule-set snapshot (e.g. `EligibilityForTransfer`, `SquadRegistrationCheck`, `EffectiveRuleSet`). | The read model recomputes the same composite verdict and violation breakdown with no wall-clock and no RNG. | **Byte-identical** verdict on re-derivation; CI lint bans `Math.random` / `Date.now` in verdict code paths (no new entropy source) — ADR-0069 E3, ADR-0051. |
| **QS-RC.2** | A `TransferWindow` FSM (`scheduled → open → countdown → closing → closed`) is advanced from the same prior state and the same `SeasonAdvanced` / date input. | The window transition is decided purely from the snapshot rule set, never from live clock drift. | Same input → same FSM state and same emitted `TransferWindow*` event sequence on replay (binary) — ADR-0056. |
| **QS-RC.3** | A consumer (League, Transfer, Squad & Player, Match line-up-lock) needs a regulatory verdict or rule. | Regulations answers via a published event or read-model query carrying opaque references only; no consumer joins or reads a Regulations table, and no rule wording crosses the boundary. | No cross-context table join / `.references(...)` / shared lookup table to a Regulations table; payloads carry `ruleRef`/`RemediationRef`, never rule text (binary) — ADR-0121, ADR-0069 E1/E8 (`risk:legal`). |

**Open measures**
- No ratified per-query compute/latency budget for the ratio/eligibility read models (`FfpRatioCheck`, `EffectiveRuleSet`, `SquadRegistrationCheck`) — Q3 gate blocked on a Nico-decided number.
- No ratified byte/row ceiling for the per-save rule-set snapshot's contribution to the save size and offline precache budget.
- Work-permit scoring constants and `DisciplineProfileV1` discipline numbers are deliberately unset (ADR-0078/ADR-0056); any threshold/score-bound test must wait on the ratified fictional catalog.

### Stadium Operations — covered by Q1 (the weekly facility-decay tick is RNG-driven via `StadiumRng(saveId, clubId, week)`, a `WorldRng` sub-label, and the matchday FSM advances on deterministic clocks, so determinism/replay byte-stability applies), Q4/Q7 (its domain mutations emit through the ADR-0028 transactional outbox into the save), and Q8 (per-save schema, no shared tables, contract-only consumption — its capacity/inventory tables must not be joined cross-context, and physical-capacity-only ownership must not absorb CommercialPortfolio revenue/settlement).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-SO.1** | The weekly facility-decay + maintenance saga is run twice for the same `(saveId, clubId, week)` on the same engine version. | The decay tick draws only from `StadiumRng(saveId, clubId, week)` and the matchday FSM advances on a deterministic clock. | **Byte-identical** emitted events (`PitchConditionChanged`, `FacilityComplianceChecked`, `MaintenanceProject*`) across the two runs; CI lint bans `Date.now` / `Math.random` in this context, `StadiumRng` (a `WorldRng` sub-label per ADR-0018 §3) is the only entropy source (binary; mirrors QS-1.2). |
| **QS-SO.2** | A consumer (Match, CommercialPortfolio, Regulations, Audience & Atmosphere) needs stadium data for a screen, settlement or report. | The owner publishes `StadiumCapacitySnapshot` / `StadiumCommercialSnapshot` / `HospitalityInventorySnapshot` / `PitchConditionChanged` via Snapshot + event + ACL; consumers never read its tables. | **No** cross-context join, `.references(...)` or `relations(...)` against this context's per-save tables; revenue accounting / ticketing settlement stays in CommercialPortfolio (Option D) — fitness gate fails any violation (binary; ADR-0121, ADR-0061). |
| **QS-SO.3** | A fixture's matchday timeline reaches `Reset` and the run is reloaded from save. | The matchday FSM, facility condition and inventory state round-trip; `Reset` is terminal and superseded timeline state is not re-emitted as current. | Save round-trips forward-only and the timeline does not advance past `Reset` on reload (binary; ADR-0005/ADR-0098, ADR-0061 invariant). |

**Open measures**
- Facility-decay constants, condition bands and per-week decay rate for the decay sub-FSM (named but unspecified in ADR-0061; needs ratified numbers before a tolerance/envelope measure can exist).
- Pitch-wear-per-fixture and recovery rates feeding `PitchConditionChanged` (ADR-0077 derivation rules exist but no numeric thresholds ratified here).
- Per-edge matchday-timeline advance guards/clocks and `SettlementPending → Reset` gating timing (undefined; no measurable latency/sequence acceptance target yet).
- Any per-context CPU/perf budget for the weekly facility-decay saga and snapshot publication (not yet carried in performance-budgets.md; flag as open rather than assume a number).

### CommercialPortfolio — covered by Q1 (the `collapseBand` settlement draw is RNG-driven, so determinism/replay byte-stability applies), Q7 (this BC owns schema + semantic validation of community/cross-save commercial seed data), and Q8 (it owns its own schema, never writes finance tables, and takes inbound facts only as snapshots/events — no cross-context joins).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-CP.1** | A banded estimate is the sole source of a commercial posting/forecast/accrual and `collapseBand(band, ctx) → amountMinor` is invoked twice with the same `(rngSubLabel, rngSeed, rngDrawIndices, costProfileVersion)`. | Exactly one uniform integer draw on the closed `[lowMinor, highMinor]` interval (integer-mapped, no floating-point), referenced by every leg of the balanced posting; a degenerate band collapses to `lowMinor` consuming no draw. | **Byte-identical** `amountMinor` on replay; the draw uses an existing ADR-0018 stream sub-label (no new top-level `*Rng` stream) and persists `rngSubLabel`/`rngSeed`/`rngDrawIndices`/`modelVersion` in `provenance`; a `costProfileVersion` change replays old events under the old rule, never re-interpreting the band at post time ([[09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]] D2, [[09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]], [[../60-Research/determinism-and-replay]]). |
| **QS-CP.2** | A FixtureSettlement Saga posts commercial revenue, or an InvestorCashGrant is confirmed, and the value must reach the finance ledger. | CommercialPortfolio emits a settlement/posting event consumed by Club Management via Customer-Supplier + ACL; it never writes finance/ledger tables itself and reads no other context's tables. | **No CommercialPortfolio write to a finance/ledger table** and **no cross-context table join** — the architecture-fitness import/storage gates reject any such change; inbound facts arrive only as snapshots/events ([[09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]], [[09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]). |
| **QS-CP.3** | A portable export / community pack carrying commercial seed data (contracts, asset taxonomy, exclusivity edges) is imported. | This BC — not the importer — runs schema + semantic validation before the data is admitted. | Seed data **failing schema/semantic validation is rejected** by CommercialPortfolio rather than admitted by the importing surface ([[09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]; pack-identity gating per [[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]). |

**Open measures**
- Q3 per-fixture FixtureSettlement Saga and ExclusivityGraph re-evaluation budgets — no ratified commercial-specific figure in [[../60-Research/performance-budgets]].
- Q1 forecast/accrual (non-ledger) projection tolerance — byte-exact vs bounded-envelope, and any %, undecided.
- Q4 whether commercial-breach / fair-value decisions emit security-audit facts beyond the domain outbox — not ratified.

### Offline Sync — global-goal coverage

Offline Sync is the client-side offline/online seam (Platform & Governance cluster): it owns the `CommandQueue` interface, cache/draft freshness state and the `expectedVersion` conflict-presentation/rebase flow; it is **never authoritative** and holds **client-only** storage (ADR-0090, ADR-0119). It is **not** RNG-driven (no determinism/replay byte-stability scenario applies to its own ticks — it emits no committed match log) and **not** compute/graph-heavy, so Q1 and Q3 do not gate it directly. It is genuinely covered by **Q2** (its honest-draft/offline-state UX is the core of offline-first availability — see QS-2.1–QS-2.3), **Q8** (client-only storage, no cross-context joins, projections rehydrate from server events only), **Q4** (it consumes, but does not own, the authoritative replay/dedup decision — Command Reception in Audit & Security, ADR-0119) and **Q7** at the boundary (it owns the client Dexie/IndexedDB draft store but never the encrypted save envelope). The global QS-2.x and QS-4.2 scenarios already exercise it; the domain-specific scenarios below add only binary, source-backed gates.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-OS.1** | A drafted command is submitted with a stale `expectedVersion`, or the same `commandId` is retried. | The client presents/rebases the `expectedVersion` concurrency result; the duplicate `commandId` is resolved by the Command Reception dedup gate, not by Offline Sync. | **Binary:** every mutating command carries `commandId` + `expectedVersion`; Offline Sync performs **no** authoritative dedup/replay decision and makes **no** authoritative state mutation — server-authoritative re-validation + rebase is the only authority (ADR-0090 D2-A, ADR-0119 D1/D2). |
| **QS-OS.2** | A client projection is built or refreshed for a read model (fixtures, tables) owned by another context. | The projection rehydrates from server events / the owning context's public read model, carrying `lastSeenVersion`. | **Binary:** no cross-context table join and no foreign-schema read; client-only storage (SW cache + Dexie), no server-side table owned (ADR-0121, ADR-0090 storage ownership; Q8 fitness gate QS-8.1–QS-8.3). |
| **QS-OS.3** | Core game state is reconciled after an offline-queued command conflicts. | Reconciliation uses server-authoritative rebase; CRDTs are confined to the (future, separate) Watch Party overlay channel and last-write-wins only to cosmetic local prefs. | **Binary:** no CRDT or last-write-wins path touches game state; only cosmetic prefs (theme, notification toggles) may use LWW (ADR-0090 D2-A). |

**Open measures**

- Durable IndexedDB command-outbox **queue caps**, retry/backoff timing and flush cadence — no ratified numeric thresholds (post-MVP, ADR-0090 future scope).
- Offline-shell / cache-freshness latency for Offline Sync's own surfaces beyond the existing global QS-2.1 2 s shell budget — any per-surface threshold is undecided; defer to a ratified figure rather than invent one.
- Stale-while-revalidate cache freshness window / max acceptable staleness before a surface flips to `cached-stale` vs `requires-connection` — not yet a ratified number.

### Audit & Security — global-goal coverage

This context is the primary authority behind **Q4** (security, tamper-evidence & audit-trail integrity — it owns the security audit log, hash-chaining/signed checkpoints, replay/dedup state and GDPR severing; global QS-4.1/QS-4.2/QS-4.3 already encode its core scenarios). It is also bound by **Q8** (own schema/tables only, no cross-context JOIN — ADR-0121) and participates in **Q2** as the server-authoritative side of the offline command envelope (it owns the processed-`commandId` store that Offline Sync's rebase UX composes with). It is **not** RNG-driven, so Q1 determinism/replay byte-stability does not apply to its own ticks; it is not a perf-budget hot path of its own, so Q3 applies only via the shared CI gates.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-AS.1** | A mutating command reaches the synchronous Command Reception gate (after Identity & Access session binding). | The `commandId` + canonical-payload-hash dedup/replay gate runs **before** any domain validation; identical retries return the stored/pending outcome and a mismatched-binding duplicate is rejected as a security fact. | **Binary:** no replay-bearing command executes domain logic twice and no mismatched-`commandId` request reaches a game-rule handler; `expectedVersion` conflicts stay distinct concurrency results for Offline Sync ([[09-Decisions/ADR-0119-command-reception-dedup-seam]] D2/D3). |
| **QS-AS.2** | A GDPR erasure request lands on pseudonymised security evidence, then chain verification is re-run. | Re-identification lookups are severed but the recorded facts and their hash-chain links are retained. | **Binary:** identifiers severed and chain verification still passes (facts retained, no chain break) ([[09-Decisions/ADR-0091-audit-security-context-definition]] D2-A). |
| **QS-AS.3** | A query/schema change reads or joins another context's tables (e.g. Identity, Transfer, Match) for forensics or anomaly scoring. | The context consumes the ADR-0028 outbox and the other context's public query layer instead of owning a shared table or cross-context JOIN. | **Binary:** architecture-fitness gate finds no cross-context JOIN, no `.references(...)`/`relations(...)` across ownership, and no platform `audit_log` table ([[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]). |

**Open measures**

- Signed-checkpoint / Merkle-batch cadence (records-per-checkpoint or time interval) — no ratified figure.
- Hot/warm/cold retention durations for security evidence tiers — policy named in ADR-0091, no numeric thresholds decided.
- Anomaly-scoring acceptance thresholds (flag/auto-sanction score bounds, false-positive ceiling) — explicitly deferred (rules-based first, scoring later; FMX-52-style calibration).
- Per-record append and dedup-gate latency budget on the command-reception hot path — no entry in [[../60-Research/performance-budgets]] yet.

### AI World Simulation — global-goal coverage

Genuinely covered by **Q1 Determinism & replay byte-stability** (the context is RNG-driven via `WorldAiMgmtRng` / `WorldRng` sub-streams and produces a stateful long-save `WorldDriftEventLog`; ADR-0071 inv. requires byte-identical drift sequences from the same `worldSeed` + engine version + input facts, under ADR-0113 seeded-variance / ADR-0096 numeric surface) and **Q8 Architecture boundary integrity** (ADR-0071 inv. 2–4/8 + ADR-0121: owns its own schema, never queries another context's tables, never writes Club Management ledger rows, and publishes self-contained events so consumers store ACL projections). Q3/Q4/Q7 do not yet bind here — no ratified world-tick perf budget, no PII surface, and saves are covered by the global save-format goals.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-AWS.1** | The same `(worldSeed, engineVersion, input facts)` is run through the season-end structural pass twice. | The context emits the same `WorldDrift*` event sequence (Rising Rival / Giant Collapse / Continental Era Shift). | **Byte-identical** `WorldDriftEventLog` across both runs; the only entropy is the named `WorldAiMgmtRng` / `WorldRng` sub-streams, with each new drift mechanism adding a new RNG label rather than drawing from an existing sequence (ADR-0071 inv.; ADR-0113 DV1). |
| **QS-AWS.2** | A consumer (Club Management, CommercialPortfolio, Transfer, FMX-89/84, Tactics) needs world-drift state and replays its own projection. | It reads the self-contained `WorldDrift*` event / `DriftConsumerPolicyRef` and rebuilds an ACL projection. | Replay requires **no** live AI World table read and **no** cross-context join; the architecture-fitness import/schema gate rejects any direct table read or `.references(...)` into AI World (ADR-0071 inv. 4/8; ADR-0121, QS-8.1/8.2). |
| **QS-AWS.3** | AI World participates in opposition match-prep. | It supplies the `planningContext` (`sourceContext: 'ai-world-simulation'`) only. | AI World does **not** emit `OppositionTemplateSelectedForMatchV1` and does **not** own the selector queries — those stay Tactics-owned; a change wiring that event/selector into AI World fails the boundary review (ADR-0080 OT7). |

**Open measures:**
- Drift drama caps / cooldown windows / candidate-scoring weights — no ratified numbers (deferred to FMX-52 / GD-0043).
- Season-end world-tick CPU/time budget — no figure in performance-budgets.md yet.
- `WorldDriftForecast` / `WorldDriftHealthSnapshot` query latency target — undecided.
- `DriftConsumerPolicyRef` catalog read/query surface — unspecified, so no conformance threshold yet.

### Narrative — global-goal coverage

Genuinely covered by **Q1** (display-snapshot replay byte-stability, ADR-0117 binding), **Q7** (per-save snapshot store travels with the save, ADR-0117 §3), **Q8** (no cross-context joins; `storyThreadId` is a correlation key only, ADR-0100/0121/0027) and **Q4** (provenance metadata only, no raw PII/secrets in snapshots; generated prose stays out of authoritative state, ADR-0030). Q2/Q3/Q5/Q6 apply only as the global PWA/perf/a11y/i18n gates — Narrative adds no domain-specific *binary* measure there, so its perf and threshold gates are listed as open.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-ND.1** | A player reopens a save, revisits the inbox/history, or replays a match and sees an old article, board warning, press quote, dialogue line, weekly summary or ticker/commentary line. | The persisted `NarrativeDisplaySnapshot` text is rendered verbatim; no LLM provider is called; a prompt/model/provider/cache version bump leaves old snapshots unchanged. | **Byte-identical** snapshot equality across reopen and replay-visible match replay; provider-spy proves zero provider calls on reopen/replay; version-bump fixture proves old snapshots do not change (ADR-0117 §1/§2, verification requirements). |
| **QS-ND.2** | A revisitable snapshot is missing, corrupt or fails a future compatibility check; or the save is exported/imported. | Deterministic recovery-template render from committed facts (`source: 'recovery_template'` + recovery reason), never a silent provider re-generation; the per-save snapshot/provenance store is included whenever the rest of the save is. | No provider call on the recovery path (binary); export/import fixture proves per-save Narrative snapshots round-trip with the save data (ADR-0117 §3/§5, Q7). |
| **QS-ND.3** | Narrative assembles a context card, renders prose, originates a `StoryThread`, or hands `OutletPublishedStory` to Media Ecology. | All cross-context facts are read via public queries/events; `storyThreadId` is used as a correlation key only; generated prose is never parsed into commands/facts and match replay/frame builders never import provider code or read prose as authority. | **No cross-context table join** and no second originator of a `StoryThread`; architecture-fitness import gate + the ADR-0117 guard that match replay/`MatchFrame` builders do not import provider code or read generated prose hold (ADR-0030/0100/0121, Q8). |

**Open measures**

- Per-save display-snapshot/provenance store size budget (no ratified cap; ADR-0117 only flags growth as a negative consequence).
- Narration/LLM-enhancement latency budget and on-device render budget per device tier (performance-budgets.md has no narration-path figure).
- Fallback-coverage manifest acceptance threshold for partial/degraded states (full-manifest LLM-disabled render is binary; no numeric % ratified).
- Repetition / persona-drift validation thresholds for LLM enhancement (ADR-0054 names the validators but ratifies no numeric bounds).

### Youth Academy — global-goal coverage

Q1 (determinism) covers the annual academy tick: all cohort-generation draws use the `IntakeRng(saveId, clubId, year)` sub-label of `WorldRng` (ADR-0060, ADR-0018 §3), so same seed + inputs must replay byte-identically. Q8 (boundary) covers the per-save schema, the no-cross-context-join rule (ADR-0121), and the `YouthCohortPublished` Snapshot contract to Squad & Player. Q7 (save integrity) covers the slider-FSM `superseded` state and the save-creation legacy/community-overlay seed (copied once, never re-read). Q2/Q5/Q6 inherit at the global level (offline shell, virtualised cohort/intake lists, ICU copy) with no Youth-Academy-specific binary gate. Q4 does not apply: the context bears no PII and emits no security-audit facts of its own. Q3 has no domain-specific binding budget — the annual academy tick is not on the matchday hot path the [[../60-Research/performance-budgets]] matrix covers (see Open measures).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-YA.1** | The annual academy Process Manager runs the intake (`GenerateYouthCohort`) twice for the same `(engineVersion, saveId, clubId, year, investment level, staff/scout-coverage inputs)`. | Cohort composition, per-prospect attribute ranges, archetype labels and HoY-opinion draws are produced from `IntakeRng(saveId, clubId, year)` only. | **Byte-identical** cohort generation and emitted event log; CI lint bans `Math.random`/`Date.now` in the academy simulation path; `IntakeRng` is the only entropy source (no cross-RNG draws) ([[09-Decisions/ADR-0060-youth-academy-context]], [[../60-Research/determinism-and-replay]] §2.2). |
| **QS-YA.2** | A senior player record exists from a published cohort, then the academy edits the cohort/prospect after `YouthCohortPublished`. | The Snapshot is immutable downstream: subsequent academy edits do not retro-affect the materialised Squad & Player record, and home-grown status is read via the derived `HomeGrownShareCounter` projection, never a stored "is-home-grown" boolean. | **Binary:** no retro-mutation of senior records from post-snapshot academy edits; no cross-context table join (eligibility interpretation stays in Regulations & Compliance per ADR-0060 D2=A; ADR-0121 fitness gate) ([[09-Decisions/ADR-0060-youth-academy-context]]). |
| **QS-YA.3** | An `AcademyInvestmentLevel` slider transitions to `superseded`, or a save is exported whose academy seed was set at save creation. | The superseded slider value is retained in history but never surfaced as the current level; the save-creation legacy/community-overlay seed is copied into the snapshot once and never re-read during a running save. | **Binary:** a `superseded` investment level is never returned as the active level; the legacy/community-overlay seed is read exactly once at save creation, never re-read mid-save ([[09-Decisions/ADR-0060-youth-academy-context]] Determinism and storage rules). |

**Open measures**
- Per-tick CPU/latency budget for the annual academy Process Manager (intake generation, audit-cycle recompute) — not covered by the matchday-oriented [[../60-Research/performance-budgets]] matrix; needs a ratified figure if it is to be a Q3 gate.
- Cohort-history retention threshold across long saves (FMX-157 *recommends* 5 seasons of full cohort detail + 20+ seasons of yearly summaries, but these are not yet ratified as a numeric save/export acceptance gate).
- `AcademyCategoryAuditCycle` cadence (FMX-157 *recommends* a two-academy-season cadence) — not yet a ratified determinism/replay acceptance number.
- Read-model size/virtualisation thresholds for `AcademyCohortBoard` / `YouthCohortHistory` beyond the global Q5 DOM caps — no Youth-Academy-specific number decided.

### Statistics & Analytics — global-goal coverage

Projection-only read-model owner (ADR-0081): it holds **no command authority and no RNG entropy** — Q1 reaches it not as match-engine seeding but as **deterministic, replayable rebuild** (invariant SA4 + ADR-0081 verification: replaying a fixed set of Match + League source facts rebuilds byte-identical standings/leaders for the same `metricSetVersion`). **Q8** (boundary integrity) is load-bearing here because the context derives everything from *other* contexts' facts and must never join their private tables (SA2 / ADR-0121). **Q7** (save/migration safety) applies via versioned, side-by-side projection rebuild and immutable handoff snapshots (SA6/SA7/SA8). **Q3** (performance) applies to the compute/graph-heavy analytics surfaces (xG/PPDA/heatmaps, league leaders, Analytics Hub) but only through the existing global perf budgets; no analytics-specific budget is ratified. **Q4** touches it weakly: SA9 keeps in-world football statistics separate from product/user telemetry consent — a boundary/privacy invariant, not an audit-trail obligation. Q2/Q5/Q6 are covered by the global goals with no context-specific gate.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-SA.1** | The same set of Match + League source facts is reprojected twice under the same `metricSetVersion` and `projectionVersion`. | The standings-history, league-leader and stat-line projections are re-derived identically. | **Byte-identical** rebuilt standings and league leaders for the same `metricSetVersion`; reprocessing the same source event is a no-op (SA4, ADR-0081 verification; idempotent consumer offsets SA3 / ADR-0028). |
| **QS-SA.2** | A Statistics query or projector needs a source fact (match result, roster identity, official ordering, club label). | It reads only through public queries / published events / denormalised projections — never a private source-context table. | **No** cross-context table join, `.references(...)` or `relations(...)` from a Statistics projector; the architecture-fitness import + no-shared-tables gate rejects any violation (SA2, ADR-0121, QS-8.1/8.2). |
| **QS-SA.3** | A frozen `SeasonAnalyticsHandoffSnapshot` exists and a newer `metricSetVersion`/`projectionVersion` rebuilds the live projections. | Manager & Legacy / HoF still import the immutable snapshot; the rebuild runs side-by-side without mutating the frozen record or the old projection version. | Snapshot is **immutable** and consumed by value, never via a live analytics join during a running save (SA7); rebuild supports side-by-side versions before consumer switch (SA8); official counts vs model estimates stay separately labelled by `metricSetVersion` (SA6). |

**Open measures**

- Analytics compute/perf gate: no ratified budget exists for the heavy derived-analytics paths (Analytics Hub composition, league-leader aggregation, xG/PPDA/field-tilt/heatmap generation) — needs a numeric per-surface or per-rebuild budget decision before any Q3 figure can be cited here (currently only the global [[../60-Research/performance-budgets]] INP/LCP/CLS apply).
- Projection freshness / rebuild-latency threshold: no ratified bound on how stale a read-model projection may be behind its source-event watermark, nor on full-rebuild time — Open item also flagged in the module note (no projection-ready/snapshot-frozen event is defined).
- SA9 in-world-stat vs telemetry separation currently has only a privacy-review invariant; whether it needs a binary export/boundary check (no telemetry consent fields leak into football-statistics projections) is undecided.

### People / Persona & Skills — global-goal coverage

Genuinely covered by: **Q1** (the `PlayerSkillProfileSnapshot` Match consumes at line-up/tactic lock and the skill effects that feed match/training are replay-bearing, so they fall under the byte-stable determinism gate; ADR-0052 snapshot/determinism rules); **Q8** (People owns its own tables, uses opaque branded cross-context refs, forbids cross-context foreign keys/joins into Squad/Match/Training/Notification/Manager internals — ADR-0052 storage rules under ADR-0121); **Q7** (saved skill profiles store the skill-catalog version used for their snapshot, so saves migrate/round-trip forward-only); **Q4** lightly (`DialogueContextCard`/`PersonaContextCard` carry forbidden-claim lists and must never expose internal IDs, raw user text, OCEAN values or provider secrets — minimisation discipline, ADR-0052 + ADR-0030). Q2/Q3/Q5/Q6 are inherited platform-wide, not People-specific; this context has no ratified own performance or scoring numbers.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-PPS.1** | Match locks a line-up/tactic and consumes a `PlayerSkillProfileSnapshot`; the player's skill profile then changes before kick-off. | The already-locked match simulates against the snapshot taken at lock; the later `PlayerSkillProfileChanged` does not retro-alter the locked match. | **Binary:** identical `(snapshot, catalogVersion, match inputs)` reproduces the same committed match log; a post-lock profile change produces no diff in the locked match (ADR-0052 snapshot & determinism rules, under Q1 / QS-1.1). |
| **QS-PPS.2** | A People query, read model or skill effect needs football/economy facts (player attributes, contracts, match facts, fan/board facts). | People reads them via the owner context's published query/event/opaque `ActorRef`, never by joining or holding a foreign key into another context's tables. | **Binary:** no People schema/query declares a cross-context FK, `.references(...)`, `relations(...)` or join into Squad/Match/Training/Notification/Manager internals; violations fail the architecture-fitness gate (ADR-0052 storage rules, ADR-0121 / QS-8.1–8.3). |
| **QS-PPS.3** | A `DialogueContextCard` / `PersonaContextCard` is built for a template or LLM consumer. | The card emits only structured facts and allowed summaries plus its forbidden-claim list. | **Binary:** card payload contains no internal IDs, raw user text, provider secrets or direct OCEAN values, and LLM output is presentation-only with zero state mutation (ADR-0052 narrative-card rules, ADR-0030). |

**Open measures**

- Numeric bounds for skill-effect modifiers (the "deterministic bounded modifiers over existing match/training calculations") — magnitude/clamp range not ratified by ADR-0052.
- OCEAN-to-football-label derivation tolerances and any persona/relationship scoring thresholds — no ratified numbers; reserved-stub behind `peopleModelVersion` (D2 = A thin MVP).
- Whether persona/relationship ticks are RNG-driven and, if so, which named entropy stream and a byte-stability acceptance gate for those ticks — the determinism numeric surface (ADR-0096) does not yet enumerate People streams.
- Read-model build cost (e.g. `PersonaContextCard` / `RelationshipGraphSlice` generation) against a performance budget — People is not yet line-itemed in performance-budgets.md.

### Scouting — global-goal coverage

Genuinely covered by **Q1** (the weekly scouting loop is an RNG-driven simulation tick using the dedicated `ScoutingRng(saveId, clubId, week)` sub-label of `WorldRng`, so determinism/replay byte-stability applies), **Q7** (`ScoutingReport` / `CandidateList` / `CoveragePlan` / `HiddenFlagRevealLedger` are per-save persisted state that must round-trip and migrate forward-only), and **Q8** (the §3.1 Impact-Lens rule and ADR-0121 forbid Scouting joining or being joined to other contexts' tables, and hidden-flag *truth* must never be copied into Scouting). Q2/Q3/Q5/Q6 inherit the global gates with no ratified Scouting-specific number, and Q4 does not apply (Scouting holds no PII/security-audit surface — scout identity stays in People).

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-scouting.1** | The same `(saveId, clubId, week)` weekly scouting loop is run twice with identical inputs (assignment tick → knowledge accumulation → report aging → coverage recompute → list refresh → hidden-flag reveal eval → candidate discovery). | All draws come only from `ScoutingRng(saveId, clubId, week)`; no cross-RNG draws, no `Math.random` / `Date.now`; report aging uses the deterministic clock. | **Byte-identical** emitted event stream and resulting aggregate state across the two runs; CI determinism lint bans `Math.random` / `Date.now` in the scouting simulation path (ADR-0064 Determinism & storage rules, ADR-0018 §3). |
| **QS-scouting.2** | A `ScoutingReport` is built or a hidden flag is surfaced, requiring player truth / injury-risk / persona facts owned by Squad & Player or People. | Truth is read via published events / queries (`PlayerTruthSnapshot`, `HiddenFlagSurfaced` reveal-state) and masked/banded by knowledge% *inside* Scouting's read view. | **No cross-context table join** and **no hidden-flag truth persisted** in Scouting (reveal-state only); the architecture-fitness import/storage gate (QS-8.1/QS-8.2) fails any join or `.references(...)` across context ownership (ADR-0064 §3.1, ADR-0121). |
| **QS-scouting.3** | A save containing Scouting aggregates (reports + knowledge% + coverage + lists + reveal ledger) is written and later reloaded or migrated. | The per-save (`save_<uuidv7hex>`) Scouting state round-trips in the encrypted envelope; migration is forward-only. | Save round-trips and reveal-ledger / report state reload identically; superseded/stale reports stay distinguishable and a stale report is never exported as a current one (Q7 / ADR-0005 + ADR-0098, ADR-0027 per-save schema). |

**Open measures:**
- Per-tick CPU/latency budget for the weekly scouting loop is not in `performance-budgets.md` — the Q3 gate for this context is open.
- Knowledge%-gain rates, report-aging/staleness thresholds, coverage-tier breakpoints, hidden-flag reveal thresholds and discovery probabilities are mechanisms only in ADR-0064 with no ratified constants; any statistical-envelope tolerance is undecided.
- Baseline report-error magnitude per coverage tier / scout judging-ability is unspecified.
- Save-forward/replay matrix coverage (seed tiers / evidence levels under ADR-0120) is not yet assigned to Scouting's weekly tick.

### Environment & Climate — coverage

Global goals that genuinely cover this RNG-driven, stateful, snapshot-replayed context: **Q1** (determinism/replay byte-stability — `WeatherRng` stream #5 is the sole entropy source; EC2/EC3/EC4/EC11), **Q7** (save integrity — the per-match resolved weather + forecast persist with the match record as Reference + Snapshot for replay; EC5/EC7), and **Q8** (boundary integrity — no cross-context joins, opaque branded UUIDs, no finance-ledger writes, Stadium Ops keeps pitch-condition state; EC9). All effect magnitudes are deferred to GD-0043 calibration debt, so no domain perf/tolerance budget is ratified yet.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-EC.1** | The same `(worldSeed, fixtures, weatherModelVersion)` is resolved twice. | The context emits the same `MatchWeatherResolved` + `WeatherForecastPublished` streams from `WeatherRng` (PCG32 + `xxhash32(label, masterSeed)`), with the seasonal template recomputed purely from `(regionId, seasonId, masterSeed)`. | **Byte-identical** weather + forecast stream (EC11); golden-determinism gate, keyed off the recorded `weatherModelVersion` ([[09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]], [[../60-Research/determinism-and-replay]] stream #5). |
| **QS-EC.2** | A new feature label (`:v1:wind`, later `:v2:fog`) is added to an already-shipped weather model. | Existing per-feature sub-streams keep their draw count and purpose; new behaviour only ever takes a new `:vN:` label built from immutable components (`regionId`, `seasonId`, `matchId`). | All prior feature draws stay **bit-identical**; label-stability test fails on any reused/mutated shipped label (EC3/EC4). |
| **QS-EC.3** | The context attempts to persist or read across a boundary (finance ledger row, a cross-context table join, generating weather inside the match stream). | Effects flow only via commands/queries/events with self-contained payloads; Match consumes a frozen snapshot at `lineup_locked`; Stadium Operations remains the `PitchConditionChanged` emitter. | **No** finance-ledger write, **no** cross-context `references()`/join, **no** in-match weather generation (EC5/EC9); fails the architecture-fitness import/storage gate ([[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]). |

**Open measures:**
- Per-fixture weather resolution / season-template recompute CPU cost — no Q3 budget figure exists for Environment & Climate in [[../60-Research/performance-budgets]]; needs a ratified compute budget before it can be a gate.
- All weather/pitch numeric magnitudes — effect sizes, regime-transition probabilities, pitch-decay rates, WBGT/visibility/intensity band edges, forecast-error σ — are GD-0043 `environment.weatherPitch` calibration debt behind `weatherModelVersion`; none ratified, so no statistical-envelope tolerance can be asserted yet. (The WBGT ≥ 32 °C cooling-break **rule** is fixed per EC8, but its surrounding bands are calibration.)

### Media Ecology — global-goal coverage

Genuinely covered by **Q1** (RNG-driven selection + stance-drift are pure functions of events + config + seeded PRNG → byte-identical coverage, ME3/ADR-0085), **Q7** (persistent per-save outlet roster, editions, coverage threads and local projections must round-trip and replay forward, ME6/ME11), and **Q8** (non-authoritative actor that reads world signals only via outbox events / local projections, no cross-context joins, ME1/ME4/ME7). Q4's IP-clean naming posture (ME10) applies but its measure is binary/source-backed and is captured below.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-ME.1** | The same `worldSeed` + event history is re-simulated and an outlet edition is opened/closed twice (authoring vs verifying runtime). | `CoverageDecision` selection and stance-drift re-derive the same `OutletPublishedStory` / `OutletStanceAdjusted` / `CoverageThread*` events. | **Byte-identical** coverage event log; `noise` comes only from `WorldAiMgmtRng:media:*` keyed by `(outletId, eventId, seasonSeed)`, budget top-N uses a stable sort with `eventId` tiebreaker so ties are deterministic (ME3/ME5, [[09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]] D4-A). |
| **QS-ME.2** | A stance-drift step or selection step needs a world signal (form, rivalry, board pressure, fan sentiment) from another context. | The step reads only the local `ClubNarrativeSignalsProjection` + the `MediaOutlet` aggregate; consumed signals enter solely as outbox events / locally-projected read models. | **No cross-context table join** and no write to football/morale/fan/board/transfer/persona state; the architecture-fitness import/table gate holds (ME1/ME4/ME7, [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]). |
| **QS-ME.3** | An outlet roster is generated at world-gen and a save round-trips. | Outlets, editions, coverage threads and projections persist per-save under Media Ecology's own schema with the recorded `mediaEcologyModelVersion` / roster archetype version; coverage facts publish via the outbox after the producing transaction commits. | Save round-trips and replays forward-only; outbox consumers are idempotent and replay-safe; generated outlet `displayName`s are evocative-but-clearly-not-real (no real outlet/broadcaster/journalist names) (ME6/ME10/ME11, [[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]], [[09-Decisions/ADR-0007-naming-schema]]). |

**Open measures**

- Per-edition coverage **budget** size, salience/bias/decay/legal-risk **scoring weights** (`w_s`, `w_b`, `w_o`, `w_d`, `w_l`), the minimum publish **threshold**, cadence base/factors, stance **drift rates**, reach weights and roster **size** — all deferred to FMX-52 calibration behind `mediaEcologyModelVersion`; no ratified numbers exist (ADR-0085 §Determinism, Open items).
- Bounded-state ceiling for `outlet count × edition cadence × coverage history` to prevent coverage-history explosion — flagged as a constraint in ADR-0085 Consequences but with no ratified cap.
- Perf/CPU budget for the per-edition selection tick (which match/sim quality profile it runs under) — not yet sized against [[../60-Research/performance-budgets]].
- RNG-label ratification (`WorldAiMgmtRng:media:*` reuse vs a dedicated `MediaRng`) is still flagged for Nico (ADR-0085 §Open ratification item / ADR-0100 D3); the determinism scenario above assumes the recommended reuse.

### Community Overlay Pipeline — global-goal coverage

This is an ingestion/orchestration context, not an RNG-driven or compute-heavy simulation tick, so **Q1 (determinism byte-stable tick)** and **Q3 (perf budget)** do not gate it directly — its determinism contribution is purely **save-creation immutability** (ActivePacksSnapshot, ADR-0051), which lands under **Q7**. It is genuinely covered by **Q8** (no cross-context table joins; all downstream semantic-validation delegation flows through public events/queries per ADR-0059 + ADR-0121), **Q7** (per-save `ActivePacksSnapshot` is immutable at save creation and travels in `SavePayload` via ADR-0098, feeding the existing QS-7.3 missing-pack gate), and **Q4** (IP-safety gate as a hard activation invariant plus the hash-chained `IPSafetyAuditLog` / `risk:legal` review surface). FMX-54 privacy/persona naming and FMX-188 UGC text-trust / prompt-injection screening are real Q4 obligations but remain amendment-conditional/unratified (ADR-0059 keeps them `binding: false`), so their acceptance thresholds are deferred to Open measures.

| ID | Stimulus | Response | Measure |
|---|---|---|---|
| **QS-CO.1** | A pack-activation flow needs a semantic verdict from a downstream BC (Regulations, Rivalry, Tactics, Squad, Club). | The Saga requests validation and consumes the `*OverrideValidated` / `*OverrideRejected` fact; it never reads the downstream context's tables. | **Binary**: no cross-context table join / `.references(...)` / `relations(...)`; all delegation via public events/queries; activation events fire through the ADR-0028 outbox (architecture-fitness gate, ADR-0121 / QS-8.1–8.3). |
| **QS-CO.2** | A save is created with selected community packs, then later one of those packs is revoked (community takedown / IP claim). | The per-save `ActivePacksSnapshot` is materialised immutably at save creation and is unaffected by later `RevokePack`; revocation only blocks future activations. | **Binary**: the running save never re-reads the mutable `PackRegistry`; `ActivePacksSnapshot` refs (`packId` + version + `contentHash`) round-trip in `SavePayload` and are re-checked against the local `PackRegistry` on import (ADR-0051 + ADR-0098 Δ2/Δ3, existing QS-7.3). |
| **QS-CO.3** | A pack reaches the activation transition but the IP gate has not evaluated `accepted` (ADR-0007 living-person / GD-0015 IP-clean denylist match, or unacknowledged `ip_disclaimer`). | Activation is hard-blocked; the decision and evidence are appended to the `IPSafetyAuditLog`. | **Binary**: activation guarded by `IPGateEvaluated == accepted`; a denylist match is a hard fail; the audit record is append-only / hash-chained so any tamper breaks chain verification (ADR-0059 invariant, Q4 / QS-4.1). |

**Open measures**
- FMX-54 privacy/persona gate: numeric/precision acceptance thresholds for rejecting real private-person data, supporter membership lists, social handles and AI-impersonation fields (gate is unratified, `binding: false`).
- FMX-188 UGC text-trust: prompt-injection screening detection thresholds, per-field length caps and the `trustClass`/`llmEligible` acceptance bar (amendment-conditional — proposed only).
- `ManifestSchema` validation against the ADR-0097 Zod/CHECK bounds: the concrete numeric schema-bound contract is named in the BCM row but not enumerated in ADR-0059.
- Import-session / saga performance: no perf budget (e.g. manifest parse, multi-BC validation, snapshot materialisation latency) is ratified for the ingestion path in performance-budgets.md.
- D1 (owner = Option D) and D2 (MVP distribution = local/P2P only) are still awaiting Nico; contract surface above is explicitly draft until ratified.

## Related

- [[../30-Implementation/ci-and-review-process]] — enforcement model · [[../30-Implementation/agent-workflow-pattern]] — review phases
- [[../40-Quality/test-strategy]] — FMX-177 current test strategy · [[09-Decisions/ADR-0118-test-strategy-and-quality-gates]] — accepted ADR
- [[../40-Quality/deterministic-simulation-qa-harness]] — FMX-196 draft simulation QA runbook · [[09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]] — accepted ADR
- [[../40-Quality/architecture-fitness-function]] — FMX-167 architecture-fitness runbook · [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] — accepted ADR
- [[09-Decisions/ADR-0021-revised-tech-stack]] — toolchain decision
- [[08-Crosscutting]] — arc42 sibling
