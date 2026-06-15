---
title: Raw tooling-currency source checks
status: raw
tags: [research, raw, source-check, tooling, dependency-currency, npm, context7, postgres, tanstack, drizzle, capacitor, fmx-168]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-168
related:
  - [[../tooling-currency-sweep-2026-06-15]]
  - [[raw-tooling-currency-sweep-2026-06-15]]
  - [[raw-tooling-currency-realworld-games-2026-06-15]]
  - [[../../30-Implementation/stack-currency-ledger]]
  - [[../../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
---

# Raw tooling-currency source checks

This note preserves the primary checks used to convert Perplexity discovery
into FMX-168 guidance. Observations are a 2026-06-15 snapshot and must be
re-checked immediately before code bootstrap or dependency mutation.

## Repo inventory

| Surface | Source | Finding |
|---|---|---|
| Active package manager | `package.json` | `packageManager: pnpm@11.7.0`. |
| Active tool pins | `.mise.toml` | `node = "22"`, `pnpm = "11.7.0"`, `postgres = "17"`. |
| Current repo phase | `AGENTS.md`, [[../../00-Index/Current-State]] | Docs-vault-only; no code workspace, app package graph, dependency install graph or code CI gates exist yet. |

## npm registry checks

Commands used: `npm exec -- pnpm view <package> version dist-tags engines
peerDependencies --json` where relevant.

| Package | Latest stable observed | Relevant compatibility signal |
|---|---:|---|
| `@tanstack/react-start` | `1.168.25` | `node >=22.12.0`; peers React/DOM `>=18 || >=19`, Vite `>=7.0.0`, `@rsbuild/core ^2.0.0`. |
| `@tanstack/react-router` | `1.170.15` | `node >=20.19`; peers React/DOM `>=18 || >=19`. |
| `@tanstack/react-query` | `5.101.0` | peer React `^18 || ^19`. |
| `@tanstack/react-table` | `8.21.3` | `9.0.0-beta.12` exists but latest stable remains 8.x. |
| `@tanstack/react-virtual` | `3.14.2` | peers React/DOM through React 19. |
| `@tanstack/react-form` | `1.33.0` | peers React 17/18/19. |
| `react` | `19.2.7` | `canary` / `experimental` channels exist and are not stable. |
| `react-dom` | `19.2.7` | peer React `^19.2.7`. |
| `vite` | `8.0.16` | `node ^20.19.0 || >=22.12.0`. |
| `@vitejs/plugin-react` | `6.0.2` | peers `vite ^8.0.0`; implies a Vite 8 bootstrap if the Vite path is chosen. |
| `@rsbuild/core` | `2.0.15` | `node ^20.19.0 || >=22.12.0`. |
| `@rsbuild/plugin-react` | `2.0.1` | peers `@rsbuild/core ^2.0.0-0`. |
| `shadcn` | `4.11.0` | `rc` / `canary` channels exist and should stay out of bootstrap unless approved. |
| `tailwindcss` | `4.3.1` | `v3-lts` is still published but not current stable. |
| `zustand` | `5.0.14` | peers React `>=18.0.0`. |
| `zod` | `4.4.3` | `canary` exists; latest stable is 4.x. |
| `drizzle-orm` | `0.45.2` | `1.0.0-rc.3` / beta channels exist; latest stable remains 0.45.x. |
| `drizzle-kit` | `0.31.10` | Stable companion line; re-check with Drizzle ORM at bootstrap. |
| `dexie` | `4.4.3` | Latest stable 4.x. |
| `typescript` | `6.0.3` | Latest stable 6.x; beta/rc tags also point into 6.x history. |
| `vitest` | `4.1.9` | `node ^20 || ^22 || >=24`; peers Vite `^6 || ^7 || ^8`. |
| `@playwright/test` | `1.61.0` | `node >=18`; `next` alpha exists. |
| `fast-check` | `4.8.0` | Latest stable 4.x. |
| `@stryker-mutator/core` | `9.6.1` | `node >=20.0.0`. |
| `@stryker-mutator/vitest-runner` | `9.6.1` | peers `@stryker-mutator/core 9.6.1`, `vitest >=2.0.0`. |
| `@biomejs/biome` | `2.5.0` | `node >=14.21.3`. |
| `pnpm` | `11.7.0` | `latest`, `latest-11` and `next-11` all point to `11.7.0`; `node >=22.13`. |
| `@inlang/paraglide-js` | `2.19.0` | peer TypeScript `>=5.6`. |
| `@tolgee/react` | `7.1.1` | peers React 16.14 through 19. |
| `@babylonjs/core` | `9.12.0` | Latest stable 9.x. |
| `@capacitor/core` | `8.4.0` | `next` is 9.0.0 alpha; latest stable is 8.x. |
| `nx` | `22.7.5` | `next` is `23.0.0-rc.3`; latest stable is 22.x. |

## Official documentation checks

| Source | Finding | FMX implication |
|---|---|---|
| Context7, TanStack Start React docs | TanStack Start installs with TanStack Router and supports Vite or Rsbuild; recommended TS options include `moduleResolution: Bundler`, `module: ESNext`, `target: ES2022`; RSC setup adds Vite/RSC plugins. | Bootstrap must choose Vite 8 + plugin-react 6 or Rsbuild 2 explicitly, not leave the build-tool lane implied. |
| Context7, Drizzle docs | Drizzle PostgreSQL docs use `pgTable`, `pgSchema` and generated SQL migrations; schemas are first-class in PostgreSQL usage. | Existing FMX Drizzle/Postgres architecture remains directionally compatible, but Drizzle 1.0 is not the npm `latest` stable line on 2026-06-15. |
| Context7, Capacitor docs | Capacitor 8 upgrade guidance sets Android `minSdkVersion = 24`, `compileSdkVersion = 36`, `targetSdkVersion = 36`; iOS upgrade guidance raises deployment target to iOS 15 and Xcode 26+. | Capacitor major adoption changes native floors and must be a Nico/platform-support decision, not a routine package bump. |
| PostgreSQL versioning policy | PostgreSQL supports each major for 5 years and recommends running the current minor for the chosen major. Supported current minors on 2026-06-15 include 18.4 and 17.10. | Active `.mise.toml` still pins PostgreSQL 17; official current stable major is 18. This is a decision item. |
| PostgreSQL 18 release announcement | PostgreSQL 18 was released 2025-09-25 with AIO, `uuidv7()`, pg_upgrade improvements, new default checksums for initialized clusters and other behavior/security changes. | PostgreSQL 18 is a plausible current-stable target for code bootstrap, but migration/hosting behavior needs explicit approval and rehearsal gates. |
| PostgreSQL 19 beta announcement | PostgreSQL 19 Beta 1 was released 2026-06-04; official guidance says beta should be tested but not run in production. | PostgreSQL 19 is not a production/bootstrap target unless Nico approves a separate beta spike. |

## Source conflicts and drift

- FMX-195 recorded a June 15 conflict where npm dist-tags lagged the already
  published `pnpm@11.7.0`. A later June 15 registry check now shows `latest`,
  `latest-11` and `next-11` all aligned on `11.7.0`. Preserve this as source
  drift evidence, not as a contradiction in the accepted FMX-195 outcome.
- Current FMX architecture prose often points at PostgreSQL 18.x, while the
  active tool pin remains PostgreSQL 17. FMX-168 treats that as D3 in the
  decision queue.
- Drizzle docs include 1.0-era guidance, while npm `latest` remains 0.45.2 and
  1.0 is still RC/beta-tagged. Bootstrap should pin stable `latest` unless Nico
  explicitly approves an RC spike.
- TypeScript 6.0.3 and React 19.2.7 are current npm stable versions. If any
  package combination blocks them at bootstrap, the project rule requires a
  Nico decision before holding back.

## Primary source links

- npm registry package metadata, e.g. <https://registry.npmjs.org/pnpm>,
  <https://registry.npmjs.org/@tanstack/react-start>,
  <https://registry.npmjs.org/react>, <https://registry.npmjs.org/drizzle-orm>,
  <https://registry.npmjs.org/nx>.
- TanStack Start docs via Context7:
  <https://tanstack.com/start/latest/docs/framework/react/build-from-scratch>
- Drizzle ORM docs via Context7:
  <https://orm.drizzle.team/docs/overview>
- Capacitor docs via Context7:
  <https://capacitorjs.com/docs/updating/8-0>
- PostgreSQL versioning:
  <https://www.postgresql.org/support/versioning/>
- PostgreSQL 18 release:
  <https://www.postgresql.org/about/news/postgresql-18-released-3142/>
- PostgreSQL 19 Beta 1:
  <https://www.postgresql.org/about/news/postgresql-19-beta-1-released-3313/>

## Related

- [[../tooling-currency-sweep-2026-06-15]]
- [[raw-tooling-currency-sweep-2026-06-15]]
- [[raw-tooling-currency-realworld-games-2026-06-15]]
- [[../../30-Implementation/stack-currency-ledger]]
- [[../../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
