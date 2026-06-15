---
title: Raw Architecture Fitness Source Checks
status: raw
tags: [research, raw, source-checks, architecture-fitness, dependency-cruiser, nx, drizzle, ts-morph, pgsql-ast-parser, typescript, fmx-167]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-167
related:
  - [[../architecture-fitness-function-no-shared-tables-2026-06-15]]
  - [[raw-architecture-fitness-import-boundaries-2026-06-15]]
  - [[raw-architecture-fitness-db-boundaries-2026-06-15]]
  - [[raw-architecture-fitness-precedents-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[../../40-Quality/architecture-fitness-function]]
---

# Raw Architecture Fitness Source Checks

This note preserves the official/current source-check layer for FMX-167. Dates
matter: versions and docs were checked on 2026-06-15 and must be re-checked
before any future code-phase install.

## Source-Check Table

| Topic | Source checked | Result used by FMX-167 |
|---|---|---|
| dependency-cruiser rule model | `https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md#forbidden` and README rule examples | The tool supports `forbidden` dependency rules with separate `severity` values. This fits cross-context import hard failures. |
| dependency-cruiser current npm version | `https://registry.npmjs.org/dependency-cruiser/latest` | npm `latest` returned `dependency-cruiser@17.4.3` on 2026-06-15. No dependency is installed by this docs packet. |
| Nx boundary enforcement | `https://nx.dev/docs/features/enforce-module-boundaries` | Nx documents module-boundary enforcement through ESLint and Nx Conformance. Conformance is documented as an Enterprise feature. FMX should use Nx metadata/task graph later, but not make Nx Conformance the accepted baseline for FMX-167. |
| Drizzle relations vs foreign keys | `https://orm.drizzle.team/docs/relations` and Context7 Drizzle docs | Drizzle relations are application-level helpers and do not implicitly create database foreign keys. Therefore the FMX scanner must check both Drizzle relation declarations and DB/migration constraints. |
| Drizzle joins | `https://orm.drizzle.team/docs/joins` and Context7 Drizzle docs | Drizzle exposes explicit join APIs; cross-context join detection needs AST/static source scanning where possible plus SQL parsing for raw/generated SQL. |
| ts-morph current npm version | `https://registry.npmjs.org/ts-morph/latest` | npm `latest` returned `ts-morph@28.0.0` on 2026-06-15. Candidate for future TypeScript AST scanner; re-check before install. |
| pgsql-ast-parser current npm version | `https://registry.npmjs.org/pgsql-ast-parser/latest` | npm `latest` returned `pgsql-ast-parser@12.0.2` on 2026-06-15. Candidate for future SQL/migration parser; re-check before install. |
| TypeScript current npm version | `https://registry.npmjs.org/typescript/latest` | npm `latest` returned `typescript@6.0.3` on 2026-06-15. Future code bootstrap must re-check and decide the exact compiler pin in its own dependency-currency gate. |
| Bounded-context theory | Martin Fowler bounded-context article and modular-monolith literature found during discovery | Used only as general precedent: contexts need explicit language/model boundaries, and architecture tests keep a modular monolith from drifting into shared internals. |

## Tooling Implications

Accepted tooling stack for the future code phase:

- `dependency-cruiser` for import/path/cycle rules;
- custom TypeScript AST scanner, likely implemented with `ts-morph`, for
  Drizzle schema, relation and query-source checks;
- SQL/migration parser, likely `pgsql-ast-parser`, for generated migration SQL
  and raw SQL fragments where extracted safely;
- Nx package/project metadata as context ownership input once the workspace
  exists, not as the primary FMX-167 enforcement engine.

Rejected as primary baseline:

- ESLint-only boundaries, because FMX currently standardises on Biome and
  forbids reintroducing ESLint without a separate decision;
- Nx Conformance-only boundaries, because the official docs describe it as Nx
  Enterprise and it still would not cover the Drizzle/SQL storage invariant by
  itself;
- review-only enforcement, because the invariant is structural and can be
  checked repeatably.

## Dependency-Currency Caveat

These are dated source checks, not install instructions. Before adding any
package in code phase, the responsible issue must re-check official docs,
release notes/tags and npm versions, then pin exact versions. If the latest
stable version creates migration or compatibility complications, that is a Nico
HITL decision per the collaboration protocol.

