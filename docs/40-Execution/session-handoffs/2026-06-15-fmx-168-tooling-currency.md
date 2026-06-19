---
title: Handoff - FMX-168 tooling currency sweep
status: wrapped
tags: [meta, execution, handoff, tooling, dependency-currency, stack-ledger, fmx-168]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-168
related:
  - [[../../60-Research/tooling-currency-sweep-2026-06-15]]
  - [[../../30-Implementation/stack-currency-ledger]]
  - [[../fmx-168-tooling-currency-decision-queue-2026-06-15]]
---

# Handoff: FMX-168 tooling currency sweep (2026-06-15)

## Linear

- Issue: FMX-168

## Done this session

- Synced `main` and claimed FMX-168 in Linear.
- Created branch/worktree `codex/fmx-168-tooling-currency-sweep`.
- Captured Perplexity-first research for tooling-currency governance and
  real-world/game precedent.
- Source-checked npm registry versions, TanStack/Drizzle/Capacitor docs and
  PostgreSQL official support/release pages.
- Added synthesis, draft Stack Currency Ledger and Nico decision queue D1-D5.
- Updated front-door indexes and handoff map.

## Open / next step

- Nico to decide D1-D5 in
  [[../fmx-168-tooling-currency-decision-queue-2026-06-15]].
- If accepted, promote [[../../30-Implementation/stack-currency-ledger]] to
  current/binding and route PostgreSQL 18.x alignment into the code bootstrap
  or a dedicated follow-up.
- Future code bootstrap must re-check every ledger row immediately before
  pinning packages or mutating `.mise.toml`.

## Blockers

- Binding stack-currency policy and PostgreSQL target alignment are blocked on
  Nico's D1-D5 approval.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-tooling-currency-sweep-2026-06-15.md`
- `docs/60-Research/raw-perplexity/raw-tooling-currency-realworld-games-2026-06-15.md`
- `docs/60-Research/raw-perplexity/raw-tooling-currency-source-checks-2026-06-15.md`
- `docs/60-Research/tooling-currency-sweep-2026-06-15.md`
- `docs/30-Implementation/stack-currency-ledger.md`
- `docs/40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15.md`
- Front-door indexes, summary and handoff index.

## Needs promotion

- [[../../30-Implementation/stack-currency-ledger]] was promoted after Nico
  approved the decision packet on 2026-06-19.
