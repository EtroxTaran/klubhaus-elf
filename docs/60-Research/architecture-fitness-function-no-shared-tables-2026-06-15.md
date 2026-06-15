---
title: Architecture Fitness Function for No Shared Tables
status: current
tags: [research, architecture-fitness, ddd, bounded-context, dependency-cruiser, postgres, drizzle, sql, ci, quality, fmx-167]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-167
related:
  - [[raw-perplexity/raw-architecture-fitness-import-boundaries-2026-06-15]]
  - [[raw-perplexity/raw-architecture-fitness-db-boundaries-2026-06-15]]
  - [[raw-perplexity/raw-architecture-fitness-precedents-2026-06-15]]
  - [[raw-perplexity/raw-architecture-fitness-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[../40-Quality/architecture-fitness-function]]
  - [[../40-Execution/fmx-167-architecture-fitness-function-decision-queue-2026-06-15]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../30-Implementation/ci-and-review-process]]
---

# Architecture Fitness Function for No Shared Tables

FMX-167 closes the enforcement design for the accepted storage invariant:

- each bounded context owns its tables;
- cross-context reads use public queries, events or projections;
- no cross-context joins;
- no shared lookup tables that bypass a context owner;
- no convenience direct imports of another context's schema/persistence code.

This is a docs-phase research packet. It does not add code, packages, scripts
or CI workflows.

## Recommendation

Adopt a future code-phase architecture fitness function made of two layers:

| Layer | Accepted tool family | Why |
|---|---|---|
| Import/package boundaries | `dependency-cruiser` forbidden rules, backed by future package/path owner metadata | Mature graph scanner, independent of ESLint, can fail on `error` severity and catch cross-context imports/cycles. |
| Storage/query boundaries | Custom TypeScript + SQL scanner (`ts-morph` / SQL parser candidates source-checked) | The no-shared-table/no-cross-context-join invariant is domain-specific and needs Drizzle schema, relation, query and migration awareness. |

The future code-phase gate should live under the `quality` context accepted by
FMX-175/ADR-0044, not as a new required status context. It hard-fails core
violations once real scripts/workflows exist and have burned in.

## Findings

### F1 - import boundaries and storage boundaries are different problems

Import graph tools can prove that one TypeScript module imports another module.
They cannot prove whether a Drizzle query joins tables from two contexts or
whether a migration introduced a cross-context foreign key.

FMX needs both:

- import graph checks to stop internal context coupling;
- storage/query checks to stop shared-table and cross-context-join coupling.

### F2 - dependency-cruiser is the best import-layer baseline

Official docs and README examples show `forbidden` rules with severity. npm
reported `dependency-cruiser@17.4.3` as `latest` on 2026-06-15.

It fits FMX because:

- it is not tied to ESLint;
- it can scan JavaScript/TypeScript imports;
- it can express path rules for context internals and public entrypoints;
- it can report cycles and forbidden imports as CI errors.

Nx remains useful when the workspace exists. The source check found that Nx's
open module-boundary enforcement is ESLint-based, while Nx Conformance is
documented as Enterprise. Therefore Nx metadata should feed the scanner, but it
should not be the primary FMX-167 decision.

### F3 - Drizzle requires application-level and DB-level checks

Official Drizzle docs distinguish application-level relations from database
foreign keys. A cross-context relation in Drizzle source is still a boundary
problem even if it creates no database FK.

FMX therefore needs checks over:

- `pgTable` ownership;
- `.references(...)` target ownership;
- `relations(...)` cross-context navigation;
- query-builder joins;
- raw SQL fragments where static extraction is safe;
- generated migration SQL for joins, cross-context FKs and ownerless shared
  tables.

### F4 - hard failure is appropriate for core invariants

The invariant is already accepted in the bounded-context map and persistence
ADRs. If future code violates it, the architecture promise that service
extraction is a deployment change stops being true.

The hard-fail set should include:

- direct cross-context internal imports;
- cross-context cycles;
- direct imports of another context's schema/table/persistence internals;
- cross-context Drizzle `relations(...)` / `.references(...)`;
- query-builder or raw SQL cross-context joins;
- migration SQL creating cross-context FKs;
- ownerless shared lookup tables;
- unapproved exceptions.

Advisory output can still report architecture smells, fan-out and potential
future package splits.

### F5 - game/simulation evidence supports strict ownership, but game-specific
public proof is indirect

Public Football Manager internals are not a reliable evidence source for this
question. The useful game/simulation lesson is broader: long-lived
management-sim code needs stable save compatibility, reproducible simulation
behavior and maintainable domain ownership. Cross-context table access makes
that harder to debug and migrate.

Football-domain operations also support owner boundaries. Clubs, leagues,
regulators and media exchange facts through defined channels; they do not share
one operational ledger. FMX should model that through public queries, events
and projections rather than cross-context table joins.

## Accepted Decision Inputs

Nico accepted these choices on 2026-06-15:

- D1=A: use `dependency-cruiser` plus custom TypeScript/SQL scanners.
- D2=A: hard-fail core violations after code-phase scripts/workflows exist and
  burn in.
- D3=A: publish accepted ADR-0121 now; no code dependencies/scripts in this
  docs-only beat.

Full decision record:
[[../40-Execution/fmx-167-architecture-fitness-function-decision-queue-2026-06-15]].

## Source Links

- dependency-cruiser forbidden rules:
  `https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md#forbidden`
- dependency-cruiser npm:
  `https://registry.npmjs.org/dependency-cruiser/latest`
- Nx module-boundary docs:
  `https://nx.dev/docs/features/enforce-module-boundaries`
- Drizzle relations:
  `https://orm.drizzle.team/docs/relations`
- Drizzle joins:
  `https://orm.drizzle.team/docs/joins`
- ts-morph npm:
  `https://registry.npmjs.org/ts-morph/latest`
- pgsql-ast-parser npm:
  `https://registry.npmjs.org/pgsql-ast-parser/latest`
- TypeScript npm:
  `https://registry.npmjs.org/typescript/latest`

## Follow-Up

Future code bootstrap must:

- create real context owner metadata before enabling the scanner;
- re-check package docs and latest stable versions before adding dependencies;
- pin exact versions;
- add violation fixtures that prove the scanner catches known-bad imports,
  joins, FKs and shared tables;
- run the architecture-fitness check inside the future `quality` root
  entrypoint after burn-in.

