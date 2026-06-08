---
title: ADR-0009 Cursor Cloud Agent Orchestration
status: superseded
tags: [adr, meta]
created: 2026-05-15
updated: 2026-06-08
type: adr
binding: true
supersedes:
superseded_by: ADR-0103-multi-agent-orchestration-conflict-serialization
related: []
---

# ADR-0009: Cursor Cloud Agent Orchestration

## Status

accepted

## Date

2026-05-15

## Context

Most implementation is done by Cloud Agents working in parallel. Uncoordinated
parallel edits to schema, shared interfaces, or config cause merge conflicts and
broken contracts.

## Options Considered

- Plan-mode + exclusivity checks + selective fan-out (chosen).
- Fully serial single-agent execution.
- Unconstrained parallel agents.

## Decision

Use Plan Mode outputs in `.cursor/plans/`, serialize schema/interface/config
changes, and fan out only independent beats after file, interface, and config
exclusivity checks.

## Rationale

Serializing the small set of shared-contract changes removes the dominant
conflict source while still allowing safe parallelism on independent beats —
maximizing agent throughput without sacrificing correctness.

## Consequences

Positive:

- Safe parallel agent execution; predictable contracts.

Negative:

- Cloud Agent branches use `cursor/*`; every branch needs CI, Bugbot, docs, and
  a draft PR before merge.

## Supersedes

None

## Related Docs

- [[../../30-Implementation/cursor-cloud-agent-workflow]]
