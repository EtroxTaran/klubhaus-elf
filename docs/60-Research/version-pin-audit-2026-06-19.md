---
title: Version Pin Audit
status: draft
tags: [research, fmx-198, dependency-currency, tooling, version-pins, stack-ledger, pnpm, node, postgresql]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-198
sourceType: synthesis
related:
  - [[raw-perplexity/raw-fmx-198-version-pin-audit-2026-06-19]]
  - [[raw-perplexity/raw-fmx-198-version-source-checks-2026-06-19]]
  - [[../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]]
  - [[../30-Implementation/stack-currency-ledger]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[../30-Implementation/notification-messaging-platform]]
  - [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
  - [[../10-Architecture/09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]]
---

# Version Pin Audit

## Question

Which pinned or version-like framework/library/tool references in the docs vault
are still correct on 2026-06-19, and which ones require a docs correction or
Nico decision before the active toolchain is mutated?

## Short answer

FMX's exact-pin rule is still correct: when code-phase dependencies exist, core
tools and libraries should be pinned to exact current stable versions, with no
floating `latest`, `next`, `rc`, `beta`, alpha or canary tags.

The audit found three categories:

| Category | Items | Handling |
|---|---|---|
| Current exact observations | `lefthook@2.1.9`, Stryker core/runner `9.6.1`, `vitest@4.1.9`, `web-push@3.6.7`, `@types/web-push@3.6.4`, `@capacitor/push-notifications@8.1.1`, `hash-wasm@4.12.0`, `@rabbit-company/argon2id@2.1.0`, `@node-rs/argon2@2.0.2`, React/DOM `19.2.7`, TypeScript `6.0.3`, Drizzle ORM `0.45.2`, Zod `4.4.3`, Zustand `5.0.14`, Workbox window `7.4.1`, Biome `2.5.0`, Playwright `1.61.0`, fast-check `4.8.0`, Vite `8.0.16`. | Safe as current source-check facts. Re-check at code bootstrap before pinning. |
| Stale docs-only target rows | React Email `6.3.1`, `@react-email/render@2.0.8`, `@capacitor/core@8.3.4`/`8.4.0`, TanStack Start `1.168.25`, Router `1.170.15`, Virtual `3.14.2`, Dexie `4.4.3`, Babylon `9.12.0`, Rsbuild React plugin `2.0.1`, SurrealDB `3.1.4` same-day watch evidence. | Update current docs to the newer observed stable values and keep historical/raw notes as history. |
| Active toolchain/platform decisions | `packageManager: pnpm@11.7.0`, `.mise.toml` Node `22`, pnpm `11.7.0`, PostgreSQL `17`, Nx `22.7.5`, Capacitor 7.x mobile baseline. | Do not mutate silently. These affect developer tooling, runtime, database major, monorepo tooling or native support floors; queue Nico decisions. |

## Active repo pins

| Surface | Current repo value | 2026-06-19 source check | Assessment |
|---|---:|---:|---|
| `package.json` package manager | `pnpm@11.7.0` | `pnpm@11.8.0`; GitHub release `v11.8.0` non-prerelease published 2026-06-18 | Stale. Low-risk to update, but still an active toolchain mutation. |
| `.mise.toml` pnpm | `11.7.0` | `11.8.0` | Stale; should move with `package.json` after D1. |
| `package.json` devDependency | `lefthook@2.1.9` | `2.1.9` | Current. |
| `.mise.toml` Node | `22` | Node 24.17.0 is current LTS, Node 26.3.1 current non-LTS, Node 22.23.0 still supported LTS | Supported but not newest LTS/current and not an exact patch. HITL holdback if retained. |
| `.mise.toml` PostgreSQL | `17` | PostgreSQL 18.4 latest stable series, 17.10 supported series | Supported but not newest stable. HITL database/platform decision before mutation. |

## Stack ledger corrections

Current target-only rows that should be refreshed in
[[../30-Implementation/stack-currency-ledger]]:

| Component | Previous docs value | 2026-06-19 stable | Assessment |
|---|---:|---:|---|
| TanStack Start | 1.168.25 | 1.168.26 | Stale patch. |
| TanStack Router | 1.170.15 | 1.170.16 | Stale patch. |
| TanStack Virtual | 3.14.2 | 3.14.3 | Stale patch. |
| Dexie | 4.4.3 | 4.4.4 | Stale patch. |
| Babylon.js core | 9.12.0 | 9.13.0 | Stale patch. |
| Capacitor core | 8.4.0 | 8.4.1 | Stale patch. |
| Nx | 22.7.5 | 23.0.0 | Stale major; migration/adoption remains HITL. |
| `@rsbuild/plugin-react` | 2.0.1 | 2.1.0 | Stale minor/patch; pair with Rsbuild core at bootstrap. |
| SurrealDB watch evidence | 3.1.4 | 3.1.5 | Same-day source drift; never a future implementation pin. |

Current target-only rows that remain correct from the source check include
React/DOM `19.2.7`, TypeScript `6.0.3`, TanStack Query `5.101.0`, TanStack
Table `8.21.3`, TanStack Form `1.33.0`, Vite `8.0.16`,
`@vitejs/plugin-react@6.0.2`, Rsbuild core `2.0.15`, Tailwind CSS `4.3.1`,
Zustand `5.0.14`, Zod `4.4.3`, Drizzle ORM `0.45.2`, Drizzle Kit `0.31.10`,
Vitest `4.1.9`, Playwright `1.61.0`, fast-check `4.8.0`, Stryker core/runner
`9.6.1`, Biome `2.5.0` and Tolgee React `7.1.1` where already listed.

## Notification and mobile corrections

ADR-0043 is superseded, so its old values remain historical. Current
implementation-facing docs should use this posture:

| Tool/library | Historical value | 2026-06-19 stable | FMX implication |
|---|---:|---:|---|
| React Email | 6.3.1 | 6.6.3 | Update source-version status; React Email 6 prefers unified `react-email` imports. |
| `@react-email/render` | 2.0.8 | 2.0.9 | Package exists and moved; not the preferred default import path. |
| `web-push` | 3.6.7 | 3.6.7 | Current. |
| `@types/web-push` | 3.6.4 | 3.6.4 | Current. |
| `@capacitor/core` | 8.3.4 / 8.4.0 | 8.4.1 | Current stable Capacitor line is 8.x; adopting it changes native support floors. |
| `@capacitor/push-notifications` | 8.1.1 | 8.1.1 | Current; official plugin tags express Capacitor compatibility. |

ADR-0104's accepted Capacitor 7.x anchor is now an explicit stale-version
decision candidate, not a current-stable claim. Changing it to Capacitor 8.x
requires Nico because it affects native platform floors and mobile release
support, not only package freshness.

## Recommendation

Do not change `package.json` or `.mise.toml` inside this audit without Nico
selecting D1-D3 in
[[../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]].

Recommended decisions:

- D1 = A: update pnpm to `11.8.0` in a narrow follow-up because it is the
  current stable package manager and includes a recent security fix.
- D2 = A: prefer Node 24 LTS exact patch for code bootstrap if all selected
  engines pass; D2 = B only if Nico wants a supported Node 22 holdback.
- D3 = A: keep PostgreSQL 17 active until the DB bootstrap decision, but do not
  call it newest stable.
- D4 = A: treat Capacitor 8.x as the current stable source-check target and
  queue a mobile-platform re-pin decision.
- D5 = A: refresh target-only ledger rows now, but re-check every row before
  the first real dependency lockfile is committed.

## Related

- [[raw-perplexity/raw-fmx-198-version-pin-audit-2026-06-19]]
- [[raw-perplexity/raw-fmx-198-version-source-checks-2026-06-19]]
- [[../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]]
- [[../30-Implementation/stack-currency-ledger]]
- [[../30-Implementation/notification-messaging-platform]]
- [[../10-Architecture/09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]]
