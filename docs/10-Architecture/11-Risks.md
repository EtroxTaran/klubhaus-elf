---
title: Risks
status: current
tags: [architecture, risk]
created: 2026-05-15
updated: 2026-06-09
type: arch
related: [[10-Quality]], [[09-Decisions/ADR-0021-revised-tech-stack]], [[09-Decisions/ADR-0007-naming-schema]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0023-realtime-transport]], [[09-Decisions/ADR-0024-match-renderer-abstraction]], [[09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]], [[09-Decisions/ADR-0041-presentation-renderer-strategy]], [[09-Decisions/ADR-0010-design-system]], [[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]], [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]], [[09-Decisions/ADR-0094-i18n-stack-and-locale-scope]], [[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]], [[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]]
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
| **Schema-per-save scale envelope past the Postgres comfort band** | Schema-per-save tenancy is unbounded by construction; the soft-10 / hard-50 saves-per-user math reaches **hundreds of thousands** of live schemas, while the external comfort band is ~100–300 schemas with pain in the high-hundreds-to-low-thousands (migration fan-out, `pg_dump` enumeration, `pg_class`/`pg_attribute` catalog bloat, planner overhead) | Documented **per-node schema ceiling + cold/archive fallback** + a `pg_dump`/PITR-at-scale note ([[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]); pin Postgres 18.x at implementation. Confidence on the band is directional (external, not project-measured) |
| **SurrealDB 2.x is preview / early-adopter, not production-mature in 2026** | SurrealDB's production-stable line is 1.x; 2.x is not broadly production-mature even single-node — this **backs the deferral**, it is not a live exposure. Risk materialises **only if** 2.x were adopted for authoritative state | SurrealDB stays Postgres-deferred and, where reserved, a **non-authoritative, replaceable projection pinned to stable 1.x** behind the existing interface ([[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]] §D, [[09-Decisions/ADR-0021-revised-tech-stack]]); re-evaluate 2.x only at production maturity **and** a proven graph/live need |
| **Match-engine native↔WASM float determinism — replay divergence** | IEEE-754 float results can differ across native and WASM runtimes; an offline verify-locally product that resims from kickoff diverges on byte-equality unless the numeric surface is constrained | Mandatory **integer / fixed-point numeric surface** for all replay-bearing computation + per-quality-profile precedence (byte-identical for competitive-full / interactive-standard, statistical-envelope only for background-fast) ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]); determinism spike has owner/deadline + a TS-first MVP fallback |
| **i18n ICU-MF1 validation pending** | The chosen Paraglide JS plugin story for ICU MessageFormat 1 (flected club names, Slavic plurals) is **unproven** — sufficiency is assumed, not validated | Hold the i18n stack decision as **pending ICU-MF1 validation**; validate Paraglide plugin coverage (or fall back to format.js for the affected message classes) before the locale-touch-point migration ([[09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]) |
| **28-context cognitive load for a small team** | The ratified portfolio is 28 bounded contexts (see [[bounded-context-map]]) — a large surface for a small team to hold in mind and keep boundary-clean | **Six-cluster grouping** as a cognitive-load aid (not new boundaries) ([[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]], [[bounded-context-map]]); standing merge-review gate keeps the count actively managed rather than fixed |
| **Argon2id WASM on the portable-export passphrase path** | Moving the portable-export *passphrase* KDF to Argon2id depends on a WASM Argon2id implementation being available and performant on target (incl. mobile) devices | Argon2id sits behind the existing `kdfAlgo` envelope field (PBKDF2 retained for the high-entropy device-backup key); availability/perf validated on the export path before adoption ([[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]) |

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
| Tempo/Mimir cut at MVP | No multi-service traces yet; pre-scale over-engineering | Alloy future-proofs re-adding as config+container; documented re-add trigger |
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
- [[../60-Research/adr-re-audit-master-2026-06-08]] — source of the re-audit risk register · [[bounded-context-map]] — canonical 28-context catalog (six clusters)
- [[../95-Archive/gap-reports/research-wave-2-gaps]] — open research risk · [[../00-Index/Current-State]] — live blockers
- [[10-Quality]] — arc42 sibling
