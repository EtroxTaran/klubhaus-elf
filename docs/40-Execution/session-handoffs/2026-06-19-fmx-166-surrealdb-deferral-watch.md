---
title: "Session handoff: FMX-166 SurrealDB deferral watch"
status: current
tags: [handoff, fmx-166, surrealdb, postgresql, graph, realtime, projection, decision-queue]
created: 2026-06-19
updated: 2026-06-19
type: handoff
binding: false
linear: FMX-166
related:
  - [[../../60-Research/surrealdb-deferral-reevaluation-watch-2026-06-19]]
  - [[../../40-Execution/fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
  - [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[../../10-Architecture/11-Risks]]
---

# Session handoff: FMX-166 SurrealDB deferral watch

## Goals

Close the stale SurrealDB-deferral residual by replacing qualitative
"production maturity and graph/live need" wording with a concrete watch packet,
owner recommendation and Nico decision queue.

## Completed

- Claimed FMX-166 from Backlog to In Progress.
- Used a clean `/tmp/fmx-166-surrealdb-deferral-watch` worktree on
  `codex/fmx-166-surrealdb-deferral-watch`.
- Ran Perplexity-first discovery for SurrealDB maturity/version, governance
  trigger patterns and game/product graph-live candidates.
- Source-checked with official SurrealDB releases, GitHub release/tag evidence,
  SurrealDB roadmap/docs, Context7, Ref and the existing FMX ADR/risk docs.
- Preserved raw captures, source checks, synthesis and the D1-D5 decision queue.
- Updated ADR-0021, ADR-0097, `11-Risks`, `07-Deployment`, Decision Log,
  Current State, Research Map, research summary and raw/handoff indexes.

## Open Tasks

- Nico needs to answer D1-D5 in
  [[../fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]].
- After Nico decision, either promote the accepted watch rule or draft a new ADR
  if he chooses D5-B.
- After PR merge, verify Linear auto-closes only if the PR is accepted as
  sufficient; otherwise keep FMX-166 open for the approval follow-up.

## Decisions Made

No architecture or technology adoption decision was made. The packet corrects a
stale factual claim: SurrealDB `1.x` is no longer the current stable line as of
2026-06-19. SurrealDB remains deferred and non-authoritative unless Nico later
accepts a Trial gate.

## Blockers

Nico approval is required for the watch owner, cadence, trigger and promotion
path.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-fmx-166-surrealdb-deferral-reevaluation-2026-06-19]]
- [[../../60-Research/raw-perplexity/raw-fmx-166-surrealdb-deferral-governance-2026-06-19]]
- [[../../60-Research/raw-perplexity/raw-fmx-166-surrealdb-deferral-game-precedents-2026-06-19]]
- [[../../60-Research/raw-perplexity/raw-fmx-166-surrealdb-deferral-source-checks-2026-06-19]]
- [[../../60-Research/surrealdb-deferral-reevaluation-watch-2026-06-19]]
- [[../fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]]
- [[../../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
- [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
- [[../../10-Architecture/11-Risks]]
- [[../../10-Architecture/07-Deployment]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

If Nico accepts the recommended D1-D5 answers, promote them as the active
SurrealDB watch gate. Until then this remains `binding: false`.

