---
title: Architecture Fitness Function
status: current
tags: [quality, architecture-fitness, ddd, bounded-context, dependency-cruiser, postgres, drizzle, sql, ci, fmx-167]
created: 2026-06-15
updated: 2026-06-15
type: quality
binding: true
linear: FMX-167
related:
  - [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-architecture-fitness-import-boundaries-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-architecture-fitness-db-boundaries-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-architecture-fitness-source-checks-2026-06-15]]
  - [[../40-Execution/fmx-167-architecture-fitness-function-decision-queue-2026-06-15]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
---

# Architecture Fitness Function

This is the executable target contract for the future code-phase
architecture-fitness gate accepted in
[[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]].

Current phase: docs-vault-only. No script, dependency or workflow exists today.
This note defines what the future implementation must prove once code phase
creates real packages, apps and CI targets.

## Purpose

The gate protects the accepted bounded-context invariant:

- each context owns its code internals and storage;
- other contexts depend on public contracts, public queries, domain events or
  read models;
- no shared tables or cross-context joins;
- no direct persistence/schema import from another context.

## Check Families

| Family | Future mechanism | Hard-fail examples |
|---|---|---|
| Context owner registry | Workspace/package/path metadata derived from the bounded-context catalog | Missing owner metadata for a package that declares domain code or tables. |
| Import boundaries | `dependency-cruiser` forbidden rules | Cross-context internal imports, schema/persistence imports, public-entrypoint bypasses, cycles. |
| Drizzle schema ownership | TypeScript AST scanner | Table declared outside owner context; another context imports owner table objects directly. |
| Drizzle relations/FKs | TypeScript AST scanner | Cross-context `.references(...)` or `relations(...)` navigation. |
| Query joins | TypeScript AST scanner for Drizzle source and extractable raw SQL | Join between tables owned by different bounded contexts. |
| Migration SQL | SQL parser over generated migrations | Cross-context foreign key, ownerless shared lookup table, cross-context join in migration helper SQL. |
| Violation fixtures | Deliberately bad sample files in scanner test fixtures | Scanner passes a known-bad import, join, FK or shared table. |

## Hard-Fail Policy

After activation, these are non-negotiable `quality` failures:

- direct cross-context internal imports;
- cross-context cycles;
- direct imports of another context's schema/table/persistence internals;
- cross-context Drizzle relations or foreign-key declarations;
- cross-context query joins;
- raw SQL cross-context joins where statically parseable;
- migration SQL creating cross-context FKs;
- shared lookup/reference tables without one owning context and a public
  contract;
- architecture-fitness exceptions without ADR/current-doc authority, owner,
  Linear issue and expiry.

Advisory/report-only output is allowed for fan-out, depth, graph shape and
potential split recommendations.

## Exception Format

Every exception must be narrow and auditable:

| Field | Required |
|---|---|
| Owner | Named person or role. |
| Linear | Issue tracking removal or ratification. |
| Authority | Accepted ADR or current implementation note. |
| Scope | Exact file/path/rule/table, not a whole-context bypass. |
| Expiry | Date or milestone for review/removal. |
| Rationale | Why a public query/event/read model is insufficient. |

No new feature may introduce a permanent performance-convenience exception.

## Activation Checklist

The future code-phase implementation is not active until all are true:

- workspace roots exist (`apps/`, `packages/` or accepted successor);
- context owner metadata exists and maps code paths to bounded contexts;
- package public entrypoints/contracts are defined;
- context table ownership is machine-readable;
- scanner scripts exist and do not silently skip missing paths;
- scanner tests include known-bad fixtures for every hard-fail family;
- CI runs the scanner as non-required/reporting first;
- the check burns in green on real PR evidence;
- branch protection keeps the external context name as `quality`, per
  ADR-0044/FMX-175.

## Future Script Shape

Subject to code-bootstrap approval, the root quality command should call this
gate as part of `pnpm check` or its accepted successor:

```text
quality
  format/type/test/contract checks
  architecture-fitness
    depcruise imports
    drizzle-schema scanner
    query/sql scanner
    migration scanner
    violation-fixture tests
```

Do not add placeholder scripts before these checks are real.

## Fixture Requirements

The scanner test suite must include fixtures that fail for:

- `context-a/internal` imported by `context-b`;
- `context-b` importing `context-a` Drizzle table object;
- cross-context `.references(...)`;
- cross-context `relations(...)`;
- Drizzle query-builder join across two owner contexts;
- raw SQL join across two owner contexts;
- migration SQL creating a cross-context foreign key;
- shared lookup table with no owner;
- expired exception.

The suite should also include allowed fixtures:

- import through a public context contract;
- consuming an event or read model;
- owner-context self-joins;
- platform-owned reference data with a named owner and public contract, if a
  future ADR accepts such a table.

## Related

- [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
- [[../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
- [[../10-Architecture/bounded-context-map]]
- [[../30-Implementation/ci-and-review-process]]
- [[../30-Implementation/code-phase-dod-transition-contract]]

