---
title: Raw tooling-currency sweep research
status: raw
tags: [research, raw, perplexity, tooling, dependency-currency, stack-ledger, fmx-168]
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

# Raw tooling-currency sweep research

## Prompt

FMX-168 research pass, date 2026-06-15: What is the current best-practice way
to manage a JavaScript/TypeScript game project's tooling-currency sweep and
stack ledger before a code-phase bootstrap? Cover exact package pins, npm
dist-tags vs published release artifacts, primary-source verification,
ADR/decision queues, dependency update cadence, compatibility gates, and how
to handle conflicting source signals. The stack under review includes TanStack
Start/Router/Query/Table/Virtual/Form, React, shadcn, Tailwind, Zustand, Zod,
PostgreSQL/Drizzle, Dexie, Vitest, Playwright, fast-check, Stryker, Biome,
pnpm, Paraglide/Tolgee, Babylon.js, Capacitor, and Nx.

## Perplexity capture

Perplexity recommended treating tooling currency as its own managed system:
exact package pins, reproducible lockfile installs, a reviewed ledger/ADR queue
and compatibility-gated updates. It emphasized that the ledger is not just a
dependency list; it should preserve source evidence, compatibility constraints,
risk tier, owner, update cadence, and decision history.

Key findings from the pass:

| Area | Capture |
|---|---|
| Exact pins | Core stack entries should be pinned to numeric versions; committed lockfiles are the install truth once code phase starts; CI should fail on lockfile drift. |
| Dist-tags | npm dist-tags are mutable pointers. The package version in `package.json` should be a number, never `latest`, `next`, `beta`, `canary` or `rc`. |
| Source hierarchy | Prefer official docs, release notes/changelogs, Git tags and npm registry metadata over blog posts, samples or community threads. |
| Conflict handling | When sources conflict, record the conflict in the ledger, run a spike where needed and ask Nico before accepting a downgrade, prerelease or exception to the latest-stable rule. |
| ADR / decision queue | Keep open decisions in a decision queue until Nico approves; promote only approved choices into accepted ADR/GDDR/current implementation docs. |
| Cadence | Security fixes are as-needed; patch/minor updates should be grouped into regular sweeps; majors need planned decision packets and compatibility evidence. |
| Compatibility matrix | Ledger rows should include Node/TypeScript/React/build-tool/browser/native/database constraints, not just package numbers. |
| Automation | Automate detection and reporting first; keep upgrade approval human-owned for high-risk components. |

Perplexity also proposed ring-based risk:

- Ring 0: runtime/framework foundations such as Node, TypeScript, React,
  TanStack Start/Router, Nx and PostgreSQL.
- Ring 1: test and quality tools such as Vitest, Playwright, fast-check,
  Stryker and Biome.
- Ring 2: UX/data libraries such as Tailwind, shadcn, Zustand, Zod, i18n and
  Babylon.js presentation dependencies.
- Ring 3: platform/infrastructure integration such as Capacitor, service
  worker/offline, database hosting and mobile SDKs.

## Source quality notes

The Perplexity answer cited mostly general or weak public web/video sources.
The guidance above is retained as discovery only. Canonical FMX-168 facts and
version rows are grounded in [[raw-tooling-currency-source-checks-2026-06-15]]
using npm registry metadata, Context7 official-doc queries and PostgreSQL
official pages.

## Related

- [[../tooling-currency-sweep-2026-06-15]]
- [[raw-tooling-currency-source-checks-2026-06-15]]
- [[../../30-Implementation/stack-currency-ledger]]
- [[../../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
