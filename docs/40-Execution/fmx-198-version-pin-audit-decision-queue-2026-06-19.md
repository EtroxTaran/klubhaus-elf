---
title: FMX-198 Version Pin Audit Decision Queue
status: open
tags: [execution, decision-queue, fmx-198, dependency-currency, tooling, pnpm, node, postgresql, capacitor]
created: 2026-06-19
updated: 2026-06-19
type: decision-queue
binding: false
linear: FMX-198
owner: Nico
related:
  - [[../60-Research/version-pin-audit-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-198-version-pin-audit-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-198-version-source-checks-2026-06-19]]
  - [[../30-Implementation/stack-currency-ledger]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
---

# FMX-198 Version Pin Audit Decision Queue

## Context

FMX-198 audited current docs-vault version references against Perplexity
discovery, Context7/Ref documentation, direct official source checks and a
completion-audit scan for exact version rows outside the main stack ledger.

The audit updates current-facing documentation, but it does not mutate active
toolchain files (`package.json`, `.mise.toml`) because those changes affect the
developer runtime, package manager or database target and therefore need Nico's
decision.

## D1 - Active pnpm pin

| Option | Description | Trade-off |
|---|---|---|
| **A - update to `pnpm@11.8.0`** | Change `package.json` `packageManager` and `.mise.toml` pnpm to exact `11.8.0` in a narrow follow-up. | Aligns with latest stable and GitHub release evidence; low blast radius but still changes every agent's package manager. |
| B - hold `pnpm@11.7.0` until code bootstrap | Keep the current active docs-phase pin. | Avoids tooling churn today, but violates the latest-stable rule unless Nico grants a holdback. |
| C - bundle pnpm with Node/monorepo bootstrap | Defer pnpm update until Node/Nx/workspace decisions are taken together. | One coordinated toolchain change, but leaves a known stale package-manager pin. |

Recommendation: **A**.

Decision: [ ] A [ ] B [ ] C [ ] defer

## D2 - Node runtime pin posture

| Option | Description | Trade-off |
|---|---|---|
| **A - Node 24 LTS exact patch at bootstrap** | Move the code-phase runtime target to current LTS (`24.17.0` observed 2026-06-19) after engine checks pass. | Best alignment with latest stable LTS. Requires validating TanStack, pnpm, Vite/Rsbuild, Playwright and native tool floors. |
| B - Node 22 exact patch holdback | Pin supported Node 22 LTS exactly (`22.23.0` observed 2026-06-19) until bootstrap evidence says otherwise. | Conservative and compatible with current Capacitor 8 Node floor, but it is a holdback from current LTS and must be explicit. |
| C - Node 26 current | Target current non-LTS (`26.3.1` observed 2026-06-19). | Newest runtime, but not LTS; not recommended for default bootstrap. |

Recommendation: **A**, with **B** acceptable only as an explicit holdback.

Decision: [ ] A [ ] B [ ] C [ ] defer

## D3 - PostgreSQL active pin

| Option | Description | Trade-off |
|---|---|---|
| **A - keep active `postgres = "17"` until DB bootstrap** | Do not change `.mise.toml` PostgreSQL in this docs audit; keep PostgreSQL 18.x as the recommended code-phase target pending the existing FMX-168 decision. | Avoids a database-major change before code exists while keeping the stale/newest distinction honest. |
| B - move to PostgreSQL 18.x now | Change the active tool pin toward PostgreSQL 18.4. | Aligns with current stable, but mutates DB tooling before the data-layer/bootstrap beat. |
| C - bless PostgreSQL 17 as a current holdback | Keep 17 because it is supported and write that exception into the ledger. | Operationally conservative, but violates the latest-stable rule unless Nico approves the exception. |

Recommendation: **A**.

Decision: [ ] A [ ] B [ ] C [ ] defer

## D4 - Capacitor mobile baseline

| Option | Description | Trade-off |
|---|---|---|
| **A - queue Capacitor 8.x re-pin** | Treat Capacitor 8.4.1 as current stable evidence and open a mobile-platform follow-up before changing ADR-0104's accepted 7.x anchor. | Keeps the docs honest without silently changing native platform floors. |
| B - supersede ADR-0104 now to Capacitor 8.x | Update the accepted mobile-delivery baseline immediately. | Fastest currency alignment, but it is a platform/support decision and should not be agent-decided. |
| C - keep Capacitor 7.x as a supported holdback | Keep ADR-0104 unchanged and record that this is an intentional holdback. | Conservative, but needs Nico approval because 7.x is not latest stable. |

Recommendation: **A**.

Decision: [ ] A [ ] B [ ] C [ ] defer

## D5 - Stack ledger maintenance

| Option | Description | Trade-off |
|---|---|---|
| **A - refresh target-only rows now, re-check at bootstrap** | Update current observed versions in the draft ledger, keep all target-only rows non-binding and require a fresh source check before the first lockfile. | Best current vault hygiene without over-binding future code. |
| B - freeze the June 15 ledger until bootstrap | Keep old rows as a historical snapshot only. | Less churn, but entry-point docs would keep stale "current" values. |
| C - exact-pin all target stack versions now | Treat the ledger as the future package manifest. | Rejected: the repo has no implementation graph/lockfile yet and versions will drift before bootstrap. |

Recommendation: **A**.

Decision: [ ] A [ ] B [ ] C [ ] defer

## D6 - Historical source-check rows

| Option | Description | Trade-off |
|---|---|---|
| **A - preserve historical rows, require current source-check before implementation** | Keep older raw/pre-mortem/re-audit package rows as dated evidence, but treat FMX-198 or a newer source-check as the current fact layer before code pins. | Preserves research provenance without pretending old rows are current. Requires agents to check the newest source note before implementation. |
| B - rewrite every historical row to current versions | Backfill all raw and historical notes with current package versions. | Creates churn and weakens provenance; old research packets stop reflecting what was true when authored. |
| C - leave historical rows with no current pointer | Do nothing beyond the main ledger. | Lower effort, but future readers can misread stale raw rows as current package facts. |

Recommendation: **A**.

Decision: [ ] A [ ] B [ ] C [ ] defer

## Required follow-up after Nico decision

- If D1=A, update `package.json` and `.mise.toml` pnpm to `11.8.0`, run
  `node scripts/docs-check.mjs`, and preserve the source-check evidence.
- If D2 selects Node 24 or Node 22 exact patch, update `.mise.toml`, CI/docs
  runtime notes and code-phase bootstrap contracts consistently.
- If D3 changes PostgreSQL, route through the data-layer/bootstrap decision and
  keep PostgreSQL minor patch current.
- If D4 selects a Capacitor baseline, supersede or amend ADR-0104 instead of
  scattering version text.
- If D6=A, keep this FMX-198 audit linked from future implementation packets
  and require a fresh source-check for any package row older than the current
  beat.

## Related

- [[../60-Research/version-pin-audit-2026-06-19]]
- [[../60-Research/raw-perplexity/raw-fmx-198-version-source-checks-2026-06-19]]
- [[../30-Implementation/stack-currency-ledger]]
- [[../30-Implementation/code-phase-dod-transition-contract]]
