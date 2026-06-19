---
title: Risks
status: current
tags: [architecture, risk]
created: 2026-05-15
updated: 2026-06-19
type: arch
related: [[10-Quality]], [[09-Decisions/ADR-0017-observability-logging]], [[../60-Research/observability-trace-backend-readd-trigger-2026-06-18]], [[../40-Execution/fmx-171-observability-trigger-span-policy-decision-queue-2026-06-18]], [[09-Decisions/ADR-0021-revised-tech-stack]], [[09-Decisions/ADR-0007-naming-schema]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0023-realtime-transport]], [[09-Decisions/ADR-0024-match-renderer-abstraction]], [[09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]], [[09-Decisions/ADR-0041-presentation-renderer-strategy]], [[09-Decisions/ADR-0010-design-system]], [[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]], [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]], [[09-Decisions/ADR-0094-i18n-stack-and-locale-scope]], [[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]], [[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]], [[../60-Research/icu-mf1-risk-register-reconciliation-2026-06-18]], [[../40-Execution/fmx-161-icu-mf1-risk-register-decision-queue-2026-06-18]], [[../60-Research/argon2id-wasm-kdf-validation-2026-06-19]], [[../40-Execution/fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]]
---

# Risks

## Project / scope risks

- Hybrid-online MVP must not be mistaken for abandoning offline-first; docs and
  UI must keep selective offline-first as an explicit future path.
- Server-confirmed MVP progression introduces connectivity dependency; offline
  copy must be honest and drafts must never look final.
- Future export/import can be blocked by careless schema/storage shortcuts; keep
  save-envelope and versioning contracts visible from day one.
- Dokploy, Bugbot, branch protection, and Cursor Automation require account access.
- IP-safe naming needs explicit ADR review before generated data work starts.

## Tracked tech-debt (non-blocking)

Distinct from the accepted-risk register below: these are *known imperfections*
to upgrade out of, not consciously accepted trade-offs from a decision.

| Item | Status | Risk if unaddressed | Plan |
|---|---|---|---|
| **Storybook 8 vs Vite 7 peer mismatch** (`apps/web`: `@storybook/* ^8.6.14`, `vite ^7.1.5`) | Tracked, non-urgent, non-blocking (unmet-peer warning only; build/test green) | Drifts each Vite minor; SB8 builder may break on a future Vite 7.x; blocks SB9-only addon APIs | `pnpm dlx storybook@latest upgrade` (runs SB9 codemods, e.g. `@storybook/test`→`storybook/test`, `addon-viewport` becomes core). SB9 officially supports Vite 7. Verify `pnpm --filter @klubhaus-elf/web build-storybook` + showcase visual pass across Scheme × Club × Viewport ([[09-Decisions/ADR-0010-design-system]] §13). Re-pin exact versions after upgrade (ADR-0021 no-`latest` rule); Renovate groups `@storybook/*`. |

## Re-audit risk register (ADR re-audit, 2026-06-08)

Risks surfaced by the full ADR/GDDR re-audit
([[../60-Research/adr-re-audit-master-2026-06-08]]) and the new ratified ADRs.
Each is bounded by, and mitigated through, a ratified decision; none is a blocker.

| Risk | Why it exists | Mitigation |
|---|---|---|
| **Schema-per-save scale envelope past the Postgres comfort band** | Schema-per-save tenancy is unbounded by construction; the soft-10 / hard-50 saves-per-user math reaches **hundreds of thousands** of live schemas, while the external comfort band is ~100–300 schemas with pain in the high-hundreds-to-low-thousands (migration fan-out, `pg_dump` enumeration, `pg_class`/`pg_attribute` catalog bloat, planner overhead) | **FMX-170 ratified the per-node SLO: soft-warn at 300 live save schemas and hard-stop at 1000** plus a verified cold/archive fallback and `pg_dump`/PITR-at-scale note ([[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]). Capacity pressure is user-confirmed hybrid only; LRU suggests a candidate but never silently archives/deletes an active career. Pin PostgreSQL 18.x at implementation. Confidence on the band remains directional until project measurements exist |
| **SurrealDB 2.x is preview / early-adopter, not production-mature in 2026** | SurrealDB's production-stable line is 1.x; 2.x is not broadly production-mature even single-node — this **backs the deferral**, it is not a live exposure. Risk materialises **only if** 2.x were adopted for authoritative state | SurrealDB stays Postgres-deferred and, where reserved, a **non-authoritative, replaceable projection pinned to stable 1.x** behind the existing interface ([[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]] §D, [[09-Decisions/ADR-0021-revised-tech-stack]]); re-evaluate 2.x only at production maturity **and** a proven graph/live need |
| **Match-engine native↔WASM float determinism — replay divergence** | IEEE-754 float results can differ across native and WASM runtimes; an offline verify-locally product that resims from kickoff diverges on byte-equality unless the numeric surface is constrained | Mandatory **integer / fixed-point numeric surface** for all replay-bearing computation + per-quality-profile precedence (byte-identical for competitive-full / interactive-standard, statistical-envelope only for background-fast) ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]); determinism spike has owner/deadline + a TS-first MVP fallback |
| **i18n ICU-MF1 resolved for MVP; residual Slavic/case-heavy locale gate** | ADR-0094's 2026-06-09 validation resolves the headline MVP risk for DE/EN/FR/ES/IT: Paraglide native variants use `Intl.PluralRules`, ICU MessageFormat 1 remains optional plugin syntax, and inflected club names are a casus-slot/content-model concern. FMX-161 source checks corrected the old shorthand: current CLDR/Intl category sets can expose categories such as `many` for some MVP locales too, so the control is catalog QA against the active locale, not a one/other-only assumption. The remaining exposure materialises when FMX adds a Slavic/case-heavy locale (for example PL/CZ/RU) or chooses ICU syntax as the authoring contract | Keep ADR-0094 as the stack source and treat the broad ICU-MF1 risk as **resolved for MVP**, with an active reopen gate before the first Slavic/case-heavy locale or ICU-syntax migration. At that gate, validate `one/few/many/other` coverage, casus-slot data, authoring ergonomics and whether the Paraglide ICU MF1 plugin, Lingui or another fallback is needed. Nico confirmation for near-term locale scope is tracked in [[../40-Execution/fmx-161-icu-mf1-risk-register-decision-queue-2026-06-18]] ([[09-Decisions/ADR-0094-i18n-stack-and-locale-scope]], [[../60-Research/icu-mf1-risk-register-reconciliation-2026-06-18]]) |
| **28-context cognitive load for a small team** | The canonical catalog currently contains 28 bounded contexts (see [[bounded-context-map]]) — a large surface for a small team to hold in mind and keep boundary-clean | **Six-cluster grouping** as a cognitive-load aid (not new boundaries) ([[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]], [[bounded-context-map]]); FMX-160 / [[../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]] keeps the count actively managed as a ceiling rather than fixed |
| **Argon2id WASM on the portable-export passphrase path** | Moving the portable-export *passphrase* KDF to Argon2id depends on a WASM Argon2id implementation being available, supply-chain acceptable, offline-loadable and performant on target mobile devices | ADR-0098 keeps Argon2id behind the existing `kdfAlgo` envelope field while PBKDF2 stays on the high-entropy device-backup hot path. FMX-173 proposes exact-pinned `hash-wasm@4.12.0`, OWASP floor params and a Worker-only p95 mobile gate, but this remains **not implementation-validated** until Nico accepts D1-D6 and the future real-device gate passes ([[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]], [[../60-Research/argon2id-wasm-kdf-validation-2026-06-19]], [[../40-Execution/fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]) |

## Accepted-risk register ([[09-Decisions/ADR-0021-revised-tech-stack]], 2026-05-19)

Risks consciously accepted in the deep tech-stack review, why each is
acceptable, and the mitigation. Through-line: **keep risky bets where the
upside compounds and the blast radius is contained behind an interface; refuse
the risk only where it lands on irreversible, money-critical state.**

| Risk accepted | Why acceptable | Mitigation |
|---|---|---|
| TanStack Start — young GA | Mature router/query core; vision-aligned; ~7.5k LOC sunk; our use (client-render + server fns) is the low-risk profile | Pin versions; first-class deploy adapter; budget minor-version migrations; no RSC dependency |
| TanStack Form — smaller community | Stable v1 >1yr; ecosystem coherence | RHF documented escape hatch for pathological forms |
| Zustand over TanStack Store | TanStack Store not production-ready as primary store; Zustand battle-tested | Store only transitively (Query/Form/Table); revisit if it matures |
| Drizzle recursive CTEs for graph | Graph needs modest (scouting/relationships), not a property-graph workload | Typed raw SQL (`sql`/`.with()`); SurrealDB reserved if graph becomes core |
| SurrealDB deferred (upside not captured now) | Its weak spots (Enterprise-gated PITR, single-node OSS, durability debate, forced major migrations, thin TS typing, tiny hiring pool) land exactly on our money/contract core run by a small Hetzner team | Reversible: realtime/graph behind interfaces → add SurrealDB later as additive engine if it proves the differentiator |
| Canvas 2D first; PixiJS not planned | 22 dots + ball is far below where WebGL pays; Canvas is mobile-reliable | `MatchRenderer` interface contains any future swap, but ADR-0041 requires measured need before adding another 2D renderer |
| Centrifugo deferred | SSE covers all current server→client needs, zero new infra | `RealtimeTransport` interface → Centrifugo swap-in on multiplayer/recovery pressure |
| Dokploy on a single Hetzner node (Swarm footguns) | **Owner-confirmed 2026-05-19** (Nico): the existing Hetzner machine + Dokploy stays. Backup/restore + dashboard UX keeps a small team off heavy ops | **Mandatory (price of keeping Dokploy):** disk/retention caps, tested off-box EU backups, external uptime alert, rehearsed restore runbook. Kamal 2 = fallback only if mitigations prove insufficient (not a planned migration) |
| Capacitor native pipeline added | Only way mobile messaging/push works (esp. EU iOS); additive, web codebase unchanged | Web PWA stays source of truth; thin reversible shell; ~1–2 eng-wk one-time |
| Tempo/Mimir cut at MVP | No multi-service traces yet; pre-scale over-engineering | FMX-171 proposed trigger: Tempo only after split runtime path + one 30-minute log/metric-only localisation failure; Mimir only when 15-month Prometheus retention needs >80% TSDB disk for seven daily checks |
| Substrate rework lag (ADR-0027/0028 doc-ahead-of-code) | Repo operates doc-ahead-of-code by design; data layer is greenfield | Banners block implementing stale SurrealDB mechanics until the Postgres+Drizzle wave lands |
| **Schema-per-save migration fan-out (A2 lazy)** *(Wave 2, 2026-05-19)* | O(1) deploy; matches resim/determinism model; ≤50 saves/user upper bound | Per-save `schema_version` enforced by `QueryGateway.withSave`; failing migration of a single save fails *that* save open, never the platform; lazy migrator path covered by tests |
| **Outbox latency depends on polling floor (NOTIFY missed)** *(Wave 2)* | Pure `LISTEN/NOTIFY` is non-durable (lost on missed connection / pgbouncer transaction-pooling); CDC adds ops burden; polling floor is the proven correctness path | Jittered poll interval ≤ lag SLO budget (ADR-0028 warn >60s, crit >300s); `NOTIFY` is a latency optimisation only — correctness never depends on it |
| **Native partitioning requires app nightly job** *(Wave 2)* | `pg_partman` would add a Postgres extension dep on the Hetzner box | Nightly job creates next-month partition + moves >60d rows; alert on missing partition (would block outbox insert) |
| **Generated `db-schema` mirror drift** *(Wave 2)* | Hand-keeping a mirror is fragile; cross-package `.ts` imports are composite-build-incompatible | `pnpm db:generate && git diff --exit-code` CI gate |
| **`packages/match-contract` is one more composite root** *(Wave 2)* | Leaf-package size is trivial; alternative homes (engine or web) violate ADR-0003 framework-agnostic rule | Mirrors `db-schema` posture (zero runtime deps); one root tsconfig reference |
| **Optional 3D/2.5D presentation renderer scope creep** *(2026-05-22)* | Stadium, ceremony and highlight scenes can create WebGL/WebGPU, asset and mobile GPU risk if mistaken for core gameplay | ADR-0041 keeps it presentation-only, post-MVP, lazy-loaded, device-gated and fallback-safe; no renderer-side authority; Babylon.js is the planned optional 3D engine (ADR-0047), not a dependency now |

`"latest"` dependency pinning was a reliability **defect**, not an accepted
risk — fixed in the ADR-0021 PR (all deps pinned + Renovate).

## Related

- [[09-Decisions/ADR-0021-revised-tech-stack]] — TanStack Start risk owner + accepted-risk register · [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] — hybrid-online staging · [[09-Decisions/ADR-0007-naming-schema]] — IP-safe naming gate
- [[../60-Research/adr-re-audit-master-2026-06-08]] — source of the re-audit risk register · [[bounded-context-map]] — canonical 28-context catalog (six clusters, actively managed by GD-0038)
- [[../95-Archive/gap-reports/research-wave-2-gaps]] — open research risk · [[../00-Index/Current-State]] — live blockers
- [[10-Quality]] — arc42 sibling
