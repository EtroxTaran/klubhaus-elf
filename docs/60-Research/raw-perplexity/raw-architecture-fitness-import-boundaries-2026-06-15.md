---
title: Raw Architecture Fitness Import Boundary Research
status: raw
tags: [research, raw, perplexity, architecture-fitness, ddd, bounded-context, dependency-cruiser, nx, typescript, fmx-167]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-167
related:
  - [[../architecture-fitness-function-no-shared-tables-2026-06-15]]
  - [[raw-architecture-fitness-source-checks-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[../../40-Quality/architecture-fitness-function]]
---

# Raw Architecture Fitness Import Boundary Research

This note preserves the Perplexity-first discovery pass for FMX-167. It is raw
research input, not a binding implementation instruction.

## Prompt

For a TypeScript monorepo with DDD bounded contexts, what is the best-practice
architecture-fitness setup to enforce no cross-context internal imports, no
cycles and no bypassing context public APIs? Compare dependency-cruiser, Nx
module-boundary/conformance features, ESLint boundaries and custom TypeScript
AST checks. Identify what should hard-fail in CI versus what can stay advisory.

## Discovery Summary

Perplexity's main recommendation was a layered approach:

- represent each bounded context as a package or at least a path-owned module
  with a public entrypoint;
- enforce direct import rules with a static dependency graph tool;
- use TypeScript/project-reference or package-export boundaries once packages
  exist;
- add custom AST checks only for rules the generic dependency graph cannot
  express cleanly;
- keep architecture exceptions explicit, named, reviewed and time-boxed.

The strongest generic fit for the future FMX code phase is
`dependency-cruiser`: it scans JavaScript/TypeScript dependencies, supports
forbidden rules, can express `from`/`to` path constraints and can fail CI on
`error` severity. It is independent of ESLint, which matters because the FMX
repo currently standardises on Biome and explicitly avoids reintroducing ESLint.

Nx remains useful as the workspace graph and affected-task runner when code
phase starts. Its open module-boundary path is an ESLint rule; its language-
agnostic Conformance path is documented separately and requires Nx Enterprise.
That makes Nx metadata/tags useful input, but not the primary accepted gate for
FMX-167.

Custom TypeScript AST scanning is best reserved for FMX-specific policy:

- deriving context ownership from package/path metadata;
- checking context public API entrypoints versus internal paths;
- verifying generated contract exports;
- correlating code paths with table/context ownership for the storage checks.

## Candidate Import Checks

Hard-fail candidates:

- any import from another context's internal folder or non-public entrypoint;
- any direct dependency from a domain context to another context's persistence,
  schema, private model or test fixture;
- any cross-context cycle;
- any import that bypasses the accepted context contract/package facade;
- any temporary exception without an owner, expiry and Linear link.

Advisory/reporting candidates:

- dependency depth and fan-out warnings while the workspace settles;
- broad graph visualisation;
- "should probably move" architecture smells that need human judgement;
- package-size or public-API growth warnings.

## Best-Practice Notes

The useful pattern is an "architecture test" in the broad sense: a repeatable
test that proves a design constraint has not drifted. For FMX, it should live
in the `quality` proof domain rather than a standalone required check. That
keeps ADR-0044/FMX-175's check-context package stable while adding stronger
internal gates.

The raw discovery also warned against relying on review only. Review catches
intent; static gates catch silent drift. The accepted invariant is structural
enough to encode.

## Source-Check Caveat

Perplexity was used for discovery and comparison. Official/current facts are
checked in [[raw-architecture-fitness-source-checks-2026-06-15]] before the
synthesis and ADR consume them.

