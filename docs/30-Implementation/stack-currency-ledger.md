---
title: Stack Currency Ledger
status: current
tags: [implementation, tooling, dependency-currency, stack-ledger, bootstrap, fmx-168, fmx-198]
created: 2026-06-15
updated: 2026-06-19
type: implementation
binding: true
linear: FMX-168
related:
  - [[../60-Research/tooling-currency-sweep-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-tooling-currency-source-checks-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-mutation-testing-gate-source-checks-2026-06-15]]
  - [[../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
  - [[../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
  - [[../60-Research/version-pin-audit-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-198-version-source-checks-2026-06-19]]
  - [[../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]]
  - [[code-phase-dod-transition-contract]]
  - [[monorepo-workspace-bootstrap-plan]]
  - [[../60-Research/pnpm-tooling-currency-2026-06-15]]
---

# Stack Currency Ledger

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this implementation or quality note is now
> binding according to its approved scope.


> Proposed by FMX-168. This ledger is `draft` / `binding: false` until Nico
> accepts D1-D5 in
> [[../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]].
>
> FMX-198 refreshed this ledger on 2026-06-19. It updates current observed
> target-only rows, but it does **not** mutate active toolchain files. Active
> pnpm, Node, PostgreSQL, Nx and Capacitor changes remain Nico-owned decisions
> in [[../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]].

This note is the proposed single source for stack-currency status during the
docs phase and code-phase bootstrap. It records what is pinned today, what the
current upstream stable signal says, what compatibility gates are required and
which decisions are still human-owned.

## Ledger policy

| Rule | Proposed policy |
|---|---|
| Version form | Exact numeric versions only. No committed `latest`, `next`, `canary`, `beta`, `rc` or floating ranges for core stack choices. |
| Source order | Official docs and release notes/changelogs -> Git tags/releases -> npm registry metadata -> official maintainer posts -> third-party/community sources. |
| Conflict handling | Preserve the conflict in this ledger and the raw source-check note. Ask Nico before downgrading, holding back, adopting a prerelease or treating undocumented behavior as accepted. |
| Review cadence | Re-check all rows before code bootstrap; after code phase, run scheduled detection and group patch/minor updates into currency sweeps. |
| Automation boundary | Detection/reporting can be automated. Upgrade acceptance, platform support, prereleases, holdbacks and major migrations remain HITL. |

## Risk rings

| Ring | Components | Required decision/gate posture |
|---|---|---|
| 0 | Node, package manager, TypeScript, React, TanStack Start/Router, Nx, PostgreSQL | Full source check, compatibility spike if major, Nico decision for holdbacks/prereleases. |
| 1 | Vite/Rsbuild, Vitest, Playwright, Biome, fast-check, Stryker, Drizzle | Source check, test/build evidence once code exists, Nico decision for major/config rewrites. |
| 2 | Tailwind, shadcn, Zustand, Zod, Dexie, i18n, Babylon.js presentation | Source check, UI/offline/renderer smoke gates once code exists, Nico decision for platform or gameplay-facing impact. |
| 3 | Capacitor/native shell, service worker/offline caches, hosting/runtime integrations | Platform/support decision, migration/rollback plan and release-window coordination. |

## Current snapshot - 2026-06-19

| Component | Repo pin today | Upstream stable observed | Ring | Status / gate |
|---|---:|---:|---:|---|
| Node.js | `22` (`.mise.toml`) | `24.17.0` LTS; `26.3.1` current; `22.23.0` supported LTS | 0 | **FMX-198 D2 pending.** Node 22 is supported but no longer newest LTS/current and is not exact-pinned. |
| pnpm | `11.7.0` | `11.8.0` | 0 | **FMX-198 D1 pending.** Active pin is stale; recommended narrow follow-up is exact `11.8.0`. |
| PostgreSQL | `17` (`.mise.toml`) | `18.4`; 17.10 still supported; 19 beta | 0 | **D3 pending.** Recommend PostgreSQL 18.x for code-phase target after Nico approval; do not use 19 beta for production bootstrap. |
| TypeScript | Target-only | `6.0.3` | 0 | **FMX-168 D4 pending.** Latest stable must be tested with full stack at bootstrap; holdback needs approval. |
| React / React DOM | Target-only | `19.2.7` | 0 | **FMX-168 D4 pending.** TanStack peers allow React 18/19; project latest-stable rule points to React 19 unless bootstrap evidence forces a decision. |
| TanStack Start | Target-only | `1.168.26` | 0 | Requires Node `>=22.12`; choose Vite or Rsbuild lane explicitly. |
| TanStack Router | Target-only | `1.170.16` | 0 | Pair with Start; React 18/19 peer range. |
| TanStack Query | Target-only | `5.101.0` | 1 | React 18/19 peer range. |
| TanStack Table | Target-only | `8.21.3` | 1 | 9.x is beta only. |
| TanStack Virtual | Target-only | `3.14.3` | 1 | React 19-compatible peer range. |
| TanStack Form | Target-only | `1.33.0` | 1 | React 19-compatible peer range. |
| Vite | Target-only | `8.0.16` | 1 | If Vite path is chosen, current `@vitejs/plugin-react` implies Vite 8. |
| `@vitejs/plugin-react` | Target-only | `6.0.2` | 1 | Peers `vite ^8.0.0`. |
| Rsbuild core | Target-only | `2.0.15` | 1 | Alternative TanStack Start build lane; must not be mixed implicitly with Vite. |
| Rsbuild React plugin | Target-only | `2.1.0` | 1 | Pair with Rsbuild core and verify peer range at bootstrap. |
| shadcn CLI | Target-only | `4.11.0` | 2 | Use generated design-system primitives only after design-system approval; avoid rc/canary. |
| Tailwind CSS | Target-only | `4.3.1` | 2 | `v3-lts` exists but is not latest stable. Holdback needs decision. |
| Zustand | Target-only | `5.0.14` | 2 | Current target remains narrow client/sim state. |
| Zod | Target-only | `4.4.3` | 2 | Latest stable 4.x; use Zod 4 unless a library compatibility decision says otherwise. |
| Drizzle ORM | Target-only | `0.45.2` | 1 | 1.0 is RC/beta; pin stable latest unless Nico approves RC spike. |
| Drizzle Kit | Target-only | `0.31.10` | 1 | Pair with Drizzle ORM and migration-generation checks. |
| Dexie | Target-only | `4.4.4` | 2 | Offline schema migrations need upgrade tests once code exists. |
| Vitest | Target-only | `4.1.9` | 1 | Vite 6/7/8 peer range; configure projects in code phase. |
| Playwright | Target-only | `1.61.0` | 1 | Browser channel updates are part of test evidence. |
| fast-check | Target-only | `4.8.0` | 1 | Preserve seeds/counterexamples in future test reports. |
| Stryker core / Vitest runner | Target-only | `9.6.1` | 1 | Runner peers exact Stryker core and Vitest `>=2`; FMX-172 confirms this source-checked pair for the draft mutation gate. |
| Biome | Target-only | `2.5.0` | 1 | Formatting/lint rule changes need explicit config diff review. |
| Paraglide JS | Target-only | `2.20.0` | 2 | Peer TypeScript `>=5.6`; i18n ADR remains separate. |
| Tolgee React | Target-only | `7.1.1` | 2 | React 19 peer range. |
| Babylon.js core | Target-only | `9.13.0` | 2 | Optional presentation only; renderer changes require smoke/performance evidence. |
| Capacitor core | Target-only | `8.4.1` | 3 | Native support floors are product/platform decisions; 9.x alpha is not a bootstrap target. |
| Nx | Target-only | `23.0.0` | 0 | **FMX-198 D5/HITL.** Latest stable is now a major bump; bootstrap must validate migration impact before pinning. |

## Bootstrap acceptance checklist

Before any code-phase PR pins dependencies:

- Re-run source checks for every ledger row.
- Choose exactly one TanStack Start build lane: Vite or Rsbuild.
- Resolve Node 24 LTS vs Node 22 holdback with Nico, then exact-pin the chosen
  patch.
- Resolve FMX-198 D1 before mutating the active pnpm pin from 11.7.0 to 11.8.0.
- Resolve D3 PostgreSQL 17 vs 18 with Nico before mutating `.mise.toml`.
- Treat React 19, TypeScript 6, Tailwind 4 and stable TanStack 1.x rows as
  latest-stable defaults; ask Nico before any holdback.
- Keep Drizzle 1.0 RC, Capacitor 9 alpha and TanStack/Table prereleases out of
  the bootstrap unless a spike is approved.
- Treat Nx 23 adoption as a migration decision, not a silent row refresh.
- Generate and commit lockfile only in the real workspace/bootstrap PR.
- Add dependency drift automation only after the code dependency graph exists.

## Related

- [[../60-Research/tooling-currency-sweep-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-tooling-currency-source-checks-2026-06-15]]
- [[../60-Research/version-pin-audit-2026-06-19]]
- [[../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]]
- [[../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
- [[code-phase-dod-transition-contract]]
- [[monorepo-workspace-bootstrap-plan]]
