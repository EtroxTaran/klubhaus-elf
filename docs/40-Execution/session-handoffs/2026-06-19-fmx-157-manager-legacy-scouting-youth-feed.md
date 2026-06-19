---
title: "Session handoff: FMX-157 Manager Legacy Scouting Youth Feed"
status: current
tags: [handoff, fmx-157, manager-legacy, scouting, youth, academy, decision-queue]
created: 2026-06-19
updated: 2026-06-19
type: handoff
binding: false
linear: FMX-157
related:
  - [[../../60-Research/manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  - [[../fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
  - [[../../60-Research/raw-perplexity/raw-fmx-157-source-checks-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
---

# Session handoff: FMX-157 Manager Legacy Scouting Youth Feed

## Goals

Prepare the non-binding FMX-157 decision packet for the unresolved Youth Academy
audit/retention, Scouting/Youth/Loan handoff and opposition-scouting details,
while keeping all final architecture/gameplay choices with Nico.

## Completed

- Claimed FMX-157 from Backlog to In Progress.
- Used a clean `/tmp/fmx-157-manager-legacy-scouting-youth-feed` worktree on
  `codex/fmx-157-manager-legacy-scouting-youth-feed`.
- Ran Perplexity-first research for academy audit/retention, opposition
  scouting and DDD handoff schemas.
- Source-checked strong claims against the Premier League EPPP page and stable
  DDD/event/source-ownership references; downgraded weak FM/community and
  secondary audit-cadence evidence.
- Preserved raw captures, source checks, synthesis and D1-D6 decision queue.
- Added pending-follow-up pointers to ADR-0060, ADR-0064, ADR-0075, ADR-0080
  and the youth/loan state-machine notes without changing status/binding.
- Updated Current State, Research Map, Decision Log, research summary, raw index
  and handoff index.

## Open Tasks

- Nico needs to answer D1-D6 in
  [[../fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]].
- After Nico decision, promote accepted choices into ADR/state-machine text or
  draft a standalone ADR if D1-B is selected.
- If D6-B is selected later, create implementation-phase contract-test follow-ups
  for the event envelopes.

## Decisions Made

No final architecture, gameplay, retention, audit-cadence or schema decision
was made. The packet records recommended options only.

## Blockers

Nico approval is required for canonical home, academy audit owner, retention
window, opposition-scouting split, handoff schema pattern and scope timing.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-fmx-157-academy-audit-retention-2026-06-19]]
- [[../../60-Research/raw-perplexity/raw-fmx-157-opposition-scouting-2026-06-19]]
- [[../../60-Research/raw-perplexity/raw-fmx-157-handoff-schemas-2026-06-19]]
- [[../../60-Research/raw-perplexity/raw-fmx-157-source-checks-2026-06-19]]
- [[../../60-Research/manager-legacy-scouting-youth-feed-followups-2026-06-19]]
- [[../fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
- [[../../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
- [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
- [[../../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
- [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
- [[../../10-Architecture/state-machines/youth-academy]]
- [[../../10-Architecture/state-machines/loan-orchestration]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

If Nico accepts the recommended D1-D6 answers, promote them as the active
follow-up detail. Until then this remains `binding: false`.
