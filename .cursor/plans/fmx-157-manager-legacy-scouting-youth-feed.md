---
title: FMX-157 Manager Legacy Scouting Youth Feed Plan
status: current
tags: [plan, fmx-157, manager-legacy, scouting, youth, academy, handoff]
created: 2026-06-19
updated: 2026-06-19
type: plan
binding: false
related:
  - [[../../docs/60-Research/manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  - [[../../docs/40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
---

# FMX-157 Manager Legacy Scouting Youth Feed Plan

## Goal

Close the unresolved follow-up surface where Manager & Legacy, Scouting and
Youth Academy already name events/read models but do not yet define enough
owner, retention, audit-cycle and handoff detail for later implementation.

## Steps

1. Claim FMX-157 in Linear and work from
   `codex/fmx-157-manager-legacy-scouting-youth-feed`.
2. Preserve Perplexity-first research for academy audit/retention, opposition
   scouting and producer-consumer handoff schemas.
3. Source-check strong claims against official/stable sources, and downgrade
   weak game/community sources to discovery only.
4. Synthesize options and recommendations without ratifying any new
   architecture/gameplay decisions.
5. Create a Nico decision queue for the open owner, retention, opposition and
   schema choices.
6. Add narrow pending-follow-up pointers to the existing ADR/state-machine
   homes without changing `status:` or `binding:` semantics.
7. Update Current State, Research Map, research/raw indexes and session
   handoff.
8. Validate with `node scripts/docs-check.mjs`, status consistency if needed,
   and `git diff --check`.

## HITL Decisions Pending

Nico needs to answer D1-D6 in
[[../../docs/40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
before any event schema, retention window, academy audit cadence or opposition
scouting ownership rule becomes binding.
