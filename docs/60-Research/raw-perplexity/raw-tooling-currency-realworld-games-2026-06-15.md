---
title: Raw tooling-currency real-world and game precedent research
status: raw
tags: [research, raw, perplexity, tooling, dependency-currency, games, pwa, renderer, capacitor, postgres, fmx-168]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-168
related:
  - [[../tooling-currency-sweep-2026-06-15]]
  - [[raw-tooling-currency-source-checks-2026-06-15]]
  - [[../../30-Implementation/stack-currency-ledger]]
  - [[../../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
---

# Raw tooling-currency real-world and game precedent research

## Prompt

FMX-168 research pass, date 2026-06-15: Analyze real-world and comparable
game-development precedent for dependency and toolchain currency governance in
a football-manager/PWA game. Include browser game renderer risk
(Canvas/WebGL/Babylon/WebGPU), native shell risk (Capacitor Android/iOS SDK
drift), service-worker/offline cache upgrade risk, database major-version drift
(PostgreSQL), and test/toolchain drift (Nx/Vitest/Playwright/Biome/Stryker).
What should be in a Stack Currency Ledger, what requires a human decision, and
what should be automated?

## Perplexity capture

Perplexity recommended a Stack Currency Ledger that tracks state, risk and
upgrade plan for every critical dependency/toolchain element. Its key split:
automation should detect drift and run gates; humans should decide risk,
timing, breaking-change acceptance, platform support and rollback posture.

## Area captures

| Area | Capture |
|---|---|
| Renderer | Browser game renderers fail through subtle performance and GPU regressions as often as hard crashes. Canvas 2D match authority plus optional Babylon presentation should keep capability checks, browser floor, smoke scenes and performance probes separate from match simulation truth. WebGPU should stay experimental until a future decision accepts it. |
| Native shell | Capacitor upgrades carry Android/iOS SDK, Xcode, Gradle/Kotlin and store-policy implications. Major bumps can drop device support and change permission/background behavior, so they require Nico approval and release-window planning. |
| PWA/offline | Service workers and IndexedDB/Dexie migrations must track cache versions, schema compatibility windows, rollback/forced-refresh rules and offline corruption safeguards. Automation can test old-client/new-server and old-SW/new-assets paths once code exists. |
| PostgreSQL | Database majors are planned operational events, not routine package bumps. Ledger rows need major/minor, official support/EOL, hosting support, extension compatibility and upgrade rehearsal requirements. |
| Test/toolchain | Nx, Vitest, Playwright, Biome and Stryker drift can break config, browser channels, reporting or mutation behavior. Patch/minor detection can be automated; major migration, CI context changes and thresholds need review. |

## Human decisions

- Minimum supported browser, device and OS matrix.
- Any renderer engine major, WebGPU production use or browser-floor drop.
- Any Capacitor major, native SDK floor bump or store-policy response that
  changes supported devices or permission UX.
- Any PostgreSQL major-version target, managed hosting support strategy or
  extension compatibility exception.
- Any downgrade/holdback from latest stable, any prerelease adoption, or any
  conflict between npm, official docs, releases and current FMX architecture.
- Which dependency-bot proposals can be auto-merged after code phase exists.

## Automation candidates

- Registry/source drift detection and a scheduled stack-currency report.
- Frozen-lockfile install gate once the code workspace exists.
- Per-ring required test scope on update PRs.
- Browser smoke/performance probes for renderer changes.
- Service-worker/offline upgrade simulations.
- PostgreSQL EOL/minor-version warning.
- Native Android/iOS SDK policy checks once Capacitor projects exist.

## Source quality notes

The Perplexity citation set included weak/community examples. The game-dev
lesson retained for FMX is the architectural pattern already consistent with
ADR-0041/ADR-0047: keep authoritative simulation separate from presentation
renderer and native shell choices. Specific version facts are source-checked in
[[raw-tooling-currency-source-checks-2026-06-15]].

## Related

- [[../tooling-currency-sweep-2026-06-15]]
- [[raw-tooling-currency-source-checks-2026-06-15]]
- [[../../30-Implementation/stack-currency-ledger]]
- [[../../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
