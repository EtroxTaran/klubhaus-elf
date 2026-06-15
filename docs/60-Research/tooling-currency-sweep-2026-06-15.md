---
title: "Tooling currency sweep (FMX-168)"
status: current
tags: [research, synthesis, tooling, dependency-currency, stack-ledger, bootstrap, fmx-168]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-168
related:
  - [[raw-perplexity/raw-tooling-currency-sweep-2026-06-15]]
  - [[raw-perplexity/raw-tooling-currency-realworld-games-2026-06-15]]
  - [[raw-perplexity/raw-tooling-currency-source-checks-2026-06-15]]
  - [[../30-Implementation/stack-currency-ledger]]
  - [[../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[pnpm-tooling-currency-2026-06-15]]
  - [[monorepo-workspace-bootstrap-2026-06-14]]
---

# Tooling currency sweep (FMX-168)

## Scope

FMX-168 prepares the dependency/tooling currency governance layer for the
future code-phase bootstrap. It does not add dependencies, create a workspace,
install Nx, add Renovate/Dependabot config, change `.mise.toml`, or ratify a
new architecture decision.

The output is a proposed Stack Currency Ledger plus Nico decision questions.

## Current facts

| Area | Finding |
|---|---|
| Repo phase | Docs-vault-only. There is no `pnpm-workspace.yaml`, `apps/`, `packages/`, code lockfile or code CI graph to mutate. |
| Active pins | `package.json` pins `pnpm@11.7.0`; `.mise.toml` pins Node 22, pnpm 11.7.0 and PostgreSQL 17. |
| pnpm source drift | FMX-195 saw `pnpm@11.7.0` published before npm dist-tags caught up. A later June 15 check shows `latest`, `latest-11` and `next-11` all aligned on 11.7.0. |
| PostgreSQL drift | Official PostgreSQL support lists 18.4 as current stable and 17.10 as supported. PostgreSQL 19 is beta only. FMX target architecture mentions PostgreSQL 18.x in several places, but active `.mise.toml` still pins 17. |
| TanStack / build tool | `@tanstack/react-start@1.168.25` supports React 18/19 and Vite `>=7` or Rsbuild `^2`. Current `@vitejs/plugin-react@6.0.2` peers Vite `^8`, so the Vite path implies a Vite 8 bootstrap unless source checks change. |
| Drizzle | `drizzle-orm@0.45.2` is npm latest stable; 1.0 is still RC/beta-tagged. Do not adopt 1.0 RC without a decision/spike. |
| Capacitor | `@capacitor/core@8.4.0` is stable latest; Capacitor 8 carries Android SDK 36/minSdk 24 and iOS 15/Xcode 26 requirements. This is platform scope, not just a package bump. |

Full source rows are preserved in
[[raw-perplexity/raw-tooling-currency-source-checks-2026-06-15]].

## Recommendation summary

| Decision | Recommendation | Why |
|---|---|---|
| D1 - ledger home | Accept [[../30-Implementation/stack-currency-ledger]] as the single current ledger, with machine-readable export later. | One human-readable source fits docs phase; JSON automation should wait until a real workspace exists. |
| D2 - source authority | Use stable numeric package versions only; if registry/docs/release signals conflict, record the conflict and ask Nico before exception/downgrade/prerelease. | Matches the project dependency rule while preventing silent source drift. |
| D3 - PostgreSQL target | Move the future code-phase target to PostgreSQL 18.x after Nico approval; keep PostgreSQL 19 beta out of bootstrap. | 18 is current stable; 17 remains supported but no longer latest. Major DB choice has migration/hosting consequences. |
| D4 - code bootstrap package set | At bootstrap, source-check and pin latest stable React/TanStack/Vite-or-Rsbuild/TypeScript/Nx/tooling as a tested compatibility bundle. | Latest-stable is mandatory, but any holdback from React 19, TypeScript 6 or Vite 8 needs a human exception. |
| D5 - automation | In docs phase, automate detection only as a proposed follow-up. After bootstrap, add Renovate/reporting/frozen-lockfile gates through a separate approved implementation issue. | The repo has no code dependency graph today; adding bots/config now would be premature. |

## Proposed Stack Currency Ledger model

The ledger should capture more than package versions:

- component and owner/ring;
- current repo pin and current upstream stable;
- source URLs and observation date;
- peer/engine/platform constraints;
- risk class and required test scope;
- latest-stable exception/prerelease/holdback state;
- last decision record and next review trigger.

This preserves the real-world lesson from long-lived games and PWA stacks:
renderer, offline cache, native shell, database and test-tool upgrades carry
behavioral and player-trust risk. Automation should surface drift; Nico decides
breaking scope, platform support, prerelease adoption and any exception to
latest stable.

## Game and real-world implications

- Match simulation must remain independent from presentation renderer changes.
  Canvas 2D stays authoritative; Babylon.js is optional/non-authoritative
  presentation. Renderer upgrades need smoke/performance gates and capability
  fallbacks, not gameplay logic changes.
- Service-worker and Dexie upgrades can strand old clients or corrupt offline
  state if cache/schema compatibility is vague. The ledger needs explicit
  upgrade-window and forced-refresh policy once code exists.
- Capacitor upgrades change native support floors and store compliance. Treat
  every major as platform support policy.
- PostgreSQL major upgrades need support/EOL tracking, managed-hosting checks
  and migration rehearsal gates.
- Nx/Vitest/Playwright/Biome/Stryker updates should be grouped by risk ring so
  test-tool churn does not silently rewrite the quality contract.

## Non-decisions

- No dependency version is pinned by this FMX-168 PR except by documentation
  proposal.
- No PostgreSQL 17 -> 18 toolchain change is applied.
- No Renovate/Dependabot, `packageExtensions`, `minimumReleaseAge`,
  `trustPolicy`, `pnpm-workspace.yaml`, Nx config, app package or lockfile is
  added.
- No prerelease package (`next`, `canary`, `beta`, `rc`, alpha) is approved.

## Decision queue

Nico decisions are queued in
[[../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]].

Recommended packet: **D1=A, D2=A, D3=A, D4=A, D5=A**.

## Sources

- Raw Perplexity captures:
  [[raw-perplexity/raw-tooling-currency-sweep-2026-06-15]],
  [[raw-perplexity/raw-tooling-currency-realworld-games-2026-06-15]]
- Source checks:
  [[raw-perplexity/raw-tooling-currency-source-checks-2026-06-15]]
- PostgreSQL versioning:
  <https://www.postgresql.org/support/versioning/>
- PostgreSQL 18 release:
  <https://www.postgresql.org/about/news/postgresql-18-released-3142/>
- PostgreSQL 19 Beta 1:
  <https://www.postgresql.org/about/news/postgresql-19-beta-1-released-3313/>

## Related

- [[../30-Implementation/stack-currency-ledger]]
- [[../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
- [[../30-Implementation/code-phase-dod-transition-contract]]
- [[pnpm-tooling-currency-2026-06-15]]
- [[monorepo-workspace-bootstrap-2026-06-14]]
