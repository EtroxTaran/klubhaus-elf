---
title: Raw Source Checks - FMX-198 Version Pin Audit
status: raw
tags: [raw, source-check, fmx-198, dependency-currency, npm, github, node, postgresql, context7, ref]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-198
sourceType: primary-docs
related:
  - [[../version-pin-audit-2026-06-19]]
  - [[raw-fmx-198-version-pin-audit-2026-06-19]]
  - [[../../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]]
---

# Raw Source Checks - FMX-198 Version Pin Audit

## Method

Checked current stable package and runtime signals against:

- npm registry `dist-tags`;
- GitHub latest-release APIs for pnpm and SurrealDB;
- Node.js official `dist/index.json`;
- PostgreSQL official `versions.rss`;
- Context7 and Ref docs for TanStack Start, React Email, Stryker and Capacitor;
- local vault search with `rg`.

Perplexity was used as discovery only because it returned multiple stale or
incorrect package-version claims in the same session.

## npm registry dist-tags

Read-only registry query on 2026-06-19:

| Package | npm `latest` | Other relevant tags | FMX implication |
|---|---:|---|---|
| `pnpm` | 11.8.0 |  | Active `11.7.0` pin is stale. |
| `lefthook` | 2.1.9 |  | Active docs-phase pin is current. |
| `@stryker-mutator/core` | 9.6.1 | `next` 6.4.0-beta.3 | Current; ignore old `next` beta tag. |
| `@stryker-mutator/vitest-runner` | 9.6.1 |  | Current; pair with core. |
| `vitest` | 4.1.9 | `beta` 5.0.0-beta.5 | Current; 5.x beta not a target. |
| `react-email` | 6.6.3 |  | ADR-0043/notification source table is stale. |
| `@react-email/render` | 2.0.9 |  | Old 2.0.8 package observation is stale; React Email 6 prefers unified imports. |
| `web-push` | 3.6.7 |  | Current. |
| `@types/web-push` | 3.6.4 |  | Current. |
| `@capacitor/core` | 8.4.1 | `next` 9.0.0-alpha.4 | Old 8.3.4/8.4.0 observations are stale; 9 alpha is not a target. |
| `@capacitor/push-notifications` | 8.1.1 | `next` 9.0.0-alpha.1 | Current. |
| `hash-wasm` | 4.12.0 |  | Current. |
| `@rabbit-company/argon2id` | 2.1.0 |  | Current fallback candidate. |
| `@node-rs/argon2` | 2.0.2 |  | Current server-side Argon2 candidate if needed. |
| `@tanstack/react-start` | 1.168.26 | `beta` 0.0.1-beta.204 | FMX-168 1.168.25 row is stale by one patch. |
| `@tanstack/react-router` | 1.170.16 | `beta` 0.0.1-beta.286 | FMX-168 1.170.15 row is stale by one patch. |
| `@tanstack/react-query` | 5.101.0 | beta/rc tags for older 5.0 line | Current. |
| `@tanstack/react-table` | 8.21.3 | `beta` 9.0.0-beta.16 | Current stable; 9 beta not a target. |
| `@tanstack/react-virtual` | 3.14.3 | `beta` 3.0.0-beta.68 | FMX-168 3.14.2 row is stale by one patch. |
| `@tanstack/react-form` | 1.33.0 |  | Current. |
| `react` | 19.2.7 | `next` 19.3.0 canary, beta/rc 19.0.0 | Current stable is React 19.2.7. |
| `react-dom` | 19.2.7 | `next` 19.3.0 canary, beta/rc 19.0.0 | Current stable is React DOM 19.2.7. |
| `typescript` | 6.0.3 | `rc` 7.0.1-rc, `beta` 6.0.0-beta | Current stable; do not target rc. |
| `nx` | 23.0.0 | `next` 23.1.0-beta.0 | FMX-168 22.7.5 row is stale by major; adoption is HITL. |
| `drizzle-orm` | 0.45.2 | `rc` 1.0.0-rc.3, `beta` 1.0.0-beta.22 | Current stable; do not target 1.0 prerelease without spike. |
| `@babylonjs/core` | 9.13.0 |  | FMX-168/Babylon 9.12.0 rows are stale by patch. |
| `zod` | 4.4.3 | `beta` 4.1.13-beta.0 | Current stable 4.x. |
| `zustand` | 5.0.14 |  | Current stable 5.x. |
| `dexie` | 4.4.4 |  | FMX-168 4.4.3 row is stale by patch. |
| `workbox-window` | 7.4.1 | `next` 6.4.0 | Current Workbox 7 package signal. |
| `vite-plugin-pwa` | 1.3.0 |  | Current. |
| `@biomejs/biome` | 2.5.0 | `beta` 2.0.0-beta.6 | Current. |
| `playwright` | 1.61.0 | 1.62 alpha / 1.61 beta | Current stable. |
| `fast-check` | 4.8.0 | `next` 3.0.0-alpha... | Current. |
| `vite` | 8.0.16 | `beta` 8.1.0-beta.0 | Current stable; beta not a target. |
| `@vitejs/plugin-react` | 6.0.2 | `beta` 6.0.0-beta.0 | Current. |
| `@rsbuild/core` | 2.0.15 | `beta` 2.1.0-beta.0, `rc` 2.0.0-rc.4 | Current stable. |
| `@rsbuild/plugin-react` | 2.1.0 | older next/beta/rc tags | FMX-168 2.0.1 row is stale. Pairing must be checked with core. |
| `tailwindcss` | 4.3.1 | `next` 4.0.0 | Current stable. |

## Official runtime and release feeds

| Source | Observation | FMX implication |
|---|---|---|
| Node.js `https://nodejs.org/dist/index.json` | Node 26.3.1 current non-LTS; Node 24.17.0 current LTS `Krypton`; Node 22.23.0 supported LTS `Jod`. | `.mise.toml` `node = "22"` is supported but not newest LTS/current and is not an exact patch. Holding Node 22 needs Nico approval if the latest-stable rule is enforced literally. |
| pnpm GitHub latest release | `v11.8.0`, published 2026-06-18, non-prerelease. | Confirms npm `pnpm@11.8.0`; active 11.7.0 is stale. |
| PostgreSQL versions RSS | 18.4 latest in 18 series; 17.10 latest in 17 series; 13.x and older unsupported. | `.mise.toml` `postgres = "17"` is supported but not newest stable. Database major mutation remains HITL. |
| SurrealDB GitHub latest release | `v3.1.5`, published 2026-06-19, non-prerelease. | FMX-166's exact 3.1.4 same-day observation is superseded; future Trial rule remains "source-check current stable then". |

## Context7 / Ref source checks

| Source | Finding | FMX implication |
|---|---|---|
| Context7 TanStack Start `/websites/tanstack_start_framework_react` | Build-from-scratch docs install `@tanstack/react-start`, Router, React and React DOM; Vite and Rsbuild lanes are separate. RSC setup requires React 19+ and Vite 7+ or Rsbuild 2+. | Keep one explicit build lane at bootstrap. Current React 19, Vite 8 and Rsbuild 2 are compatible signals, but exact pins must be rechecked at bootstrap. |
| Ref TanStack Start docs | Official docs confirm Vite/Rsbuild setup split and RSC setup floors. | Same as above. |
| Context7 StrykerJS | Vitest runner docs install `@stryker-mutator/core` plus `@stryker-mutator/vitest-runner`; runner peers Vitest `>=2`. | Stryker 9.6.1 + Vitest 4.1.9 remains a valid source-checked target set. |
| Context7 / Ref React Email | React Email 6 unifies components and render utilities under `react-email`; old imports from `@react-email/components` and `@react-email/render` are migration-away surfaces. | Notification docs should not treat `@react-email/render` as the default code-phase import path even though the package still exists. |
| Ref Capacitor official docs | Capacitor 8 update docs require Node.js 22+ and recommend latest LTS; official plugins use `latest` and `latest-X` compatibility tags. | Capacitor 8 is the current stable shell line, but adopting it changes native support floors and remains a platform decision. |

## Local vault findings

| File/surface | Finding | FMX handling |
|---|---|---|
| `package.json` | `packageManager: pnpm@11.7.0`; `lefthook: 2.1.9`. | pnpm stale; Lefthook current. Do not mutate package files in this audit without Nico decision. |
| `.mise.toml` | `node = "22"`, `pnpm = "11.7.0"`, `postgres = "17"`. | Node/PostgreSQL are broad major pins and not newest stable; pnpm stale. Queue D1-D3. |
| `stack-currency-ledger` | Several target-only rows stale since 2026-06-15. | Refresh ledger as non-binding current snapshot. |
| Notification docs / ADR-0043 | React Email, render and Capacitor core values stale. | Update current implementation note; keep superseded ADR as history with a warning. |
| ADR-0104 / deployment | Capacitor 7.x described as implementable anchor, Capacitor 8 as watch item. | Source-check shows Capacitor 8 stable; queue a mobile-platform re-pin decision instead of silently changing accepted ADR outcome. |
| SurrealDB current notes | Some current summaries still name 3.1.4. | Update current notes to 3.1.5 while retaining future Trial re-check semantics. |

## Source URLs

- npm registry package metadata: `https://registry.npmjs.org/<package>`
- pnpm latest release: <https://api.github.com/repos/pnpm/pnpm/releases/latest>
- Node.js releases: <https://nodejs.org/dist/index.json>
- PostgreSQL versions RSS: <https://www.postgresql.org/versions.rss>
- SurrealDB latest release: <https://api.github.com/repos/surrealdb/surrealdb/releases/latest>
- TanStack Start docs:
  <https://tanstack.com/start/latest/docs/framework/react/build-from-scratch>
- TanStack Start RSC setup:
  <https://tanstack.com/start/latest/docs/framework/react/guide/server-components>
- React Email update docs:
  <https://github.com/resend/react-email/blob/canary/apps/docs/getting-started/updating-react-email.mdx>
- Capacitor 8 update docs:
  <https://github.com/ionic-team/capacitor-docs/blob/main/docs/main/updating/8-0.md>
- Capacitor official plugin versioning:
  <https://github.com/ionic-team/capacitor-docs/blob/main/docs/plugins/official.md>
