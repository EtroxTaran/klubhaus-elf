---
title: ADR-0121 Architecture Fitness Function for No Shared Tables
status: accepted
tags: [adr, architecture, architecture-fitness, ddd, bounded-context, quality, ci, dependency-cruiser, postgres, drizzle, sql, fmx-167]
created: 2026-06-15
updated: 2026-06-15
type: adr
binding: true
linear: FMX-167
amends:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0044-cicd-and-merge-policy]]
  - [[ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[ADR-0110-code-phase-dod-transition-contract]]
  - [[ADR-0118-test-strategy-and-quality-gates]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-architecture-fitness-import-boundaries-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-architecture-fitness-db-boundaries-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-architecture-fitness-precedents-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-architecture-fitness-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-167-architecture-fitness-function-decision-queue-2026-06-15]]
  - [[../../40-Quality/architecture-fitness-function]]
  - [[../bounded-context-map]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
---

# ADR-0121: Architecture Fitness Function for No Shared Tables

## Status

accepted

Accepted 2026-06-15 by Nico for FMX-167. Decision queue:
[[../../40-Execution/fmx-167-architecture-fitness-function-decision-queue-2026-06-15]].

This ADR amends ADR-0019, ADR-0027, ADR-0044, ADR-0089, ADR-0110 and
ADR-0118. It does not add code, packages, scripts or workflows in the
docs-vault-only phase.

## Date

2026-06-15

## Context

ADR-0019 and the bounded-context map define FMX as a service-ready modular
monolith. ADR-0027 defines per-save PostgreSQL schemas, Drizzle as the source
of truth and opaque cross-context references. ADR-0089 reconciles the current
28-context portfolio. The bounded-context map already states the storage rule:

- cross-context reads go through the public query layer;
- no joins across context boundaries;
- no shared lookup tables that bypass ownership;
- read models are published by the owning context when direct reads are too
  slow.

FMX-167 turns that invariant into a future code-phase architecture fitness
function. Code phase has not started, so the decision must define the target
contract without adding fake scripts or dependencies.

## Decision

### 1. Add architecture fitness to the future `quality` gate

The future code-phase `quality` proof domain includes an architecture-fitness
subgate for bounded-context integrity.

This subgate is not a separate required GitHub status context. ADR-0044/FMX-175
still owns the future required contexts: `quality`, `e2e` and `security` after
real scripts, workflows and burn-in exist.

Current docs-phase validation remains unchanged:

- `node scripts/docs-check.mjs`;
- `node scripts/status-consistency-check.mjs` when ADR/GDDR status or
  `binding:` semantics change.

### 2. Use dependency-cruiser for import/package boundaries

The accepted import-layer tool family is `dependency-cruiser`, with forbidden
rules for context internals and public entrypoints.

The source check on 2026-06-15 found `dependency-cruiser@17.4.3` as npm
`latest`. Future code bootstrap must re-check the latest stable version and pin
the exact accepted version before installing.

The future rule set must hard-fail:

- direct imports from another bounded context's internal folders;
- direct imports of another context's schema/table/persistence internals;
- bypassing accepted context public entrypoints/contracts;
- cross-context cycles;
- unapproved architecture-fitness exceptions.

### 3. Use custom TypeScript and SQL scanners for storage/query boundaries

The storage invariant is FMX-specific and cannot be enforced by an import graph
alone. Future code phase must add a custom scanner set that checks Drizzle
source, query source and generated SQL/migrations.

Candidate libraries checked on 2026-06-15:

- `ts-morph@28.0.0` as npm `latest`, candidate for TypeScript/Drizzle AST
  scanning;
- `pgsql-ast-parser@12.0.2` as npm `latest`, candidate for SQL/migration
  parsing;
- `typescript@6.0.3` as npm `latest`, to be re-evaluated by the code
  bootstrap compiler decision.

These checks are dated research inputs, not install instructions. The future
implementation issue must re-check and pin exact versions.

The scanner must hard-fail:

- a context declaring a table outside its owned context/storage surface;
- a context importing another context's Drizzle table object directly;
- cross-context Drizzle `.references(...)`;
- cross-context Drizzle `relations(...)` navigation;
- query-builder joins between tables owned by different contexts;
- raw SQL joins between tables owned by different contexts where statically
  parseable;
- migration SQL that creates cross-context foreign keys;
- ownerless shared lookup/reference tables.

Drizzle relation metadata is included because Drizzle relations are
application-level helpers and do not implicitly create database foreign keys.
Therefore FMX must scan both application-level relation declarations and
database-level constraints/migrations.

### 4. Define ownership metadata before enabling the gate

The scanner must derive ownership from the bounded-context catalog and future
package/path metadata, not from a broad pairwise allowlist.

At code bootstrap, each context/package needs enough metadata to answer:

- which bounded context owns this code path;
- which public entrypoint(s) may be imported by other contexts;
- which Drizzle tables belong to the context;
- whether the context is platform-scope or per-save scope;
- which generated migrations are attributable to the context.

### 5. Exception policy

Architecture-fitness exceptions are allowed only when all are true:

- a binding ADR or current implementation note names the exception;
- the exception has a Linear issue, owner and expiry/review date;
- the scanner configuration points to that record;
- the exception is narrower than a whole-context bypass.

No "performance convenience" exception is allowed for new cross-context reads.
The owning context must publish a read model or public query instead.

### 6. Activation policy

The architecture-fitness check starts as target-only while the repo is
docs-vault-only. It becomes a hard `quality` failure only after:

- the workspace/package layout exists;
- context owner metadata exists;
- non-placeholder scanner scripts exist;
- violation fixtures prove the scanner fails on known-bad imports, joins,
  FKs and shared tables;
- the workflow has burned in green on real PR evidence.

After activation, core violations are hard failures. Report-only output is
allowed for advisory architecture smells, not for the invariant above.

## Options Considered

### D1 - enforcement stack

| Option | Meaning | Assessment |
|---|---|---|
| A. Depcruise + scanners | `dependency-cruiser` for import/path/cycle rules; custom TypeScript/SQL scanners for Drizzle and SQL storage rules. | **Accepted.** Covers both code and storage invariants without reintroducing ESLint or requiring Nx Enterprise. |
| B. Nx Conformance primary | Use Nx project graph and Conformance as the main policy engine. | Useful metadata later, but not the accepted baseline; official docs describe Conformance as Enterprise and it does not cover all SQL/Drizzle checks by itself. |
| C. ESLint boundaries | Use ESLint module-boundary rules as the main gate. | Rejected for this beat; FMX currently uses Biome and forbids reintroducing ESLint without a separate decision. |

### D2 - failure policy

| Option | Meaning | Assessment |
|---|---|---|
| A. Core hard fail | Direct cross-context imports, storage joins/FKs/shared tables and unapproved exceptions fail future `quality`. | **Accepted.** Greenfield code should not accumulate structural debt against a binding invariant. |
| B. Staged rollout | Report-only first, hard-fail later. | Better for legacy migrations, but FMX has no codebase to migrate today. |
| C. Import-only first | Hard-fail imports, defer DB/query checks. | Rejected; storage isolation is the core FMX-167 requirement. |

### D3 - artifact status

| Option | Meaning | Assessment |
|---|---|---|
| A. Accepted ADR | Publish a binding ADR and current quality runbook now; future code phase implements it. | **Accepted.** Nico approved the decisions and future bootstrap needs a stable target. |
| B. Proposed ADR | Keep non-binding until code bootstrap. | Too weak after HITL approval. |
| C. Research only | Save research and defer ADR/runbook. | Rejected; the issue explicitly asks to define and anchor the fitness function. |

## Rationale

The architecture invariant is not stylistic. It protects the core promise that
FMX can stay a modular monolith while remaining service-ready. If contexts join
each other's tables or import each other's private persistence internals, later
service extraction becomes a data-migration/refactor problem instead of a
deployment change.

The two-layer tool strategy matches the problem:

- dependency graph checks catch code coupling early and cheaply;
- TypeScript/SQL scanners catch storage coupling that import tools cannot see.

Keeping the check under `quality` also preserves ADR-0044/FMX-175's stable
branch-protection vocabulary.

## Consequences

Positive:

- Converts a high-value architecture invariant into a repeatable future gate.
- Avoids review-only enforcement.
- Avoids ESLint reintroduction and Nx Enterprise dependence for this rule.
- Keeps docs-phase and code-phase DoD separated cleanly.
- Makes storage-coupling exceptions visible and time-boxed.

Negative / trade-offs:

- Future code bootstrap has more foundation work before `quality` can be
  promoted.
- A custom scanner must be maintained.
- Some Drizzle/raw SQL patterns may require conservative parsing limits and
  fixtures to avoid false confidence.

## Implementation Notes

The executable target lives in
[[../../40-Quality/architecture-fitness-function]]. Future implementation must
add violation fixtures before claiming coverage.

Recommended future root command shape, subject to code-bootstrap approval:

```text
pnpm check
  -> format/type/test/contract checks
  -> architecture-fitness
```

Do not add this command in the docs-only repo.

## Related

- [[../../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
- [[../../40-Quality/architecture-fitness-function]]
- [[../../40-Execution/fmx-167-architecture-fitness-function-decision-queue-2026-06-15]]
- [[../bounded-context-map]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../30-Implementation/code-phase-dod-transition-contract]]

