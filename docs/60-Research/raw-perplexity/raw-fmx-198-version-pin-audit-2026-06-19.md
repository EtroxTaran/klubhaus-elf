---
title: Raw Perplexity - FMX-198 Version Pin Audit
status: raw
tags: [raw, perplexity, fmx-198, dependency-currency, tooling, versions]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-198
sourceType: perplexity
related:
  - [[../version-pin-audit-2026-06-19]]
  - [[raw-fmx-198-version-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]]
---

# Raw Perplexity - FMX-198 Version Pin Audit

## Prompt

We are auditing a docs-only Football Manager X vault on 2026-06-19 for pinned
framework/library/tool versions. Current observed pins/candidates include pnpm
11.7.0, Node 22, PostgreSQL 17, lefthook 2.1.9, Stryker/Vitest 9.6.1/4.1.9,
React Email 6.3.1/@react-email/render 2.0.8, web-push 3.6.7,
@capacitor/core 8.3.4 and push-notifications 8.1.1, hash-wasm 4.12.0,
@node-rs/argon2, @tanstack/react-start 1.168.25, React 19.2.7, TypeScript
6.0.3, Nx 22.7.5, Drizzle ORM 0.45.2, Babylon.js 9.12.0, Zod 4, Zustand v5,
Dexie, Workbox, Biome, Playwright, fast-check and Vite.

Please verify current latest stable versions and which pins are correct/stale,
prioritizing official npm/GitHub/vendor docs and noting prereleases separately.
Also say which stale items are safe docs-only observations vs HITL decisions
before mutating active toolchain.

## Response notes

Perplexity returned a useful package-by-package shape, but several version
claims conflicted with direct npm/GitHub/vendor source checks performed in the
same FMX-198 session. The synthesis therefore treats this transcript as
discovery only and preserves the contradictions below rather than canonizing
them.

Notable Perplexity claims that FMX-198 source checks corrected:

| Package/tool | Perplexity claim | FMX-198 official source check |
|---|---:|---:|
| pnpm | 11.7.0 current | npm `latest` and GitHub latest release are 11.8.0. |
| Node.js | Node 22 current LTS | Node 24.17.0 is current LTS; Node 22.23.0 is still supported LTS. |
| PostgreSQL | PostgreSQL 17 current stable major | Official versions RSS lists PostgreSQL 18.4 as latest stable series; 17.10 is still supported. |
| lefthook | 2.3.0 current | npm `latest` is 2.1.9. |
| Vitest | 4.2.0 current | npm `latest` is 4.1.9. |
| React Email | 6.3.1 current | npm `latest` is 6.6.3. |
| `@react-email/render` | 2.0.8 current | npm `latest` is 2.0.9; React Email 6 docs prefer `render` from `react-email`. |
| `web-push` | 3.6.8 current | npm `latest` is 3.6.7. |
| `@capacitor/core` | 8.3.4 current | npm `latest` is 8.4.1; Capacitor 9 is alpha. |
| `@tanstack/react-start` | 1.168.25 current | npm `latest` is 1.168.26. |
| React | React 19.2.7 likely invalid | npm `latest` is 19.2.7. |
| Nx | 22.7.5 current | npm `latest` is 23.0.0; next is 23.1.0 beta. |
| Babylon.js | 9.12.0 current | npm `@babylonjs/core` latest is 9.13.0. |
| Zod | 4.24.0 current | npm `latest` is 4.4.3. |
| Zustand | 5.0.3 current | npm `latest` is 5.0.14. |
| Dexie | 4.0.9 current | npm `latest` is 4.4.4. |
| Biome | 1.9.4 current | npm `latest` is 2.5.0. |
| Playwright | 1.49.0 current | npm `latest` is 1.61.0. |
| fast-check | 3.23.1 current | npm `latest` is 4.8.0. |
| Vite | 6.1.0 current | npm `latest` is 8.0.16. |

Useful Perplexity guidance that survived source-checking:

- Treat stale active toolchain changes as HITL when they change package manager,
  Node, database, test runner, native shell or platform support behavior.
- Historical docs may preserve the old observed value, but current front doors
  must not describe stale values as newest stable.
- Prerelease tags (`next`, `beta`, `rc`, `alpha`, canary) are not bootstrap
  targets unless Nico explicitly approves a spike.

## FMX handling

- This raw note is not implementation guidance.
- The official source-check table in
  [[raw-fmx-198-version-source-checks-2026-06-19]] supersedes the conflicting
  Perplexity claims for package/version facts.
- The synthesis in [[../version-pin-audit-2026-06-19]] separates docs-only
  corrections from Nico-owned toolchain/platform decisions.
