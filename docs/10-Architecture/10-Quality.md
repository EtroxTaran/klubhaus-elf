---
title: Quality
status: current
tags: [architecture, quality, determinism, offline-first, performance, security, accessibility, i18n, architecture-fitness, bounded-context, dependency-cruiser, soak-test, save-forward, fmx-167, fmx-196]
created: 2026-05-15
updated: 2026-06-19
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
Draft [[09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
and [[../40-Quality/deterministic-simulation-qa-harness]] are the FMX-196
simulation-specific QA packet; they remain non-binding until Nico approves
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

## Related

- [[../30-Implementation/ci-and-review-process]] — enforcement model · [[../30-Implementation/agent-workflow-pattern]] — review phases
- [[../40-Quality/test-strategy]] — FMX-177 current test strategy · [[09-Decisions/ADR-0118-test-strategy-and-quality-gates]] — accepted ADR
- [[../40-Quality/deterministic-simulation-qa-harness]] — FMX-196 draft simulation QA runbook · [[09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]] — draft ADR
- [[../40-Quality/architecture-fitness-function]] — FMX-167 architecture-fitness runbook · [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] — accepted ADR
- [[09-Decisions/ADR-0021-revised-tech-stack]] — toolchain decision
- [[08-Crosscutting]] — arc42 sibling
