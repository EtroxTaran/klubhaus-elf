---
title: FMX-159 Watch Party Context Ownership Plan
status: in-progress
created: 2026-06-17
updated: 2026-06-17
issue: FMX-159
branch: codex/fmx-159-watch-party-context-ownership
---

# FMX-159 Watch Party Context Ownership Plan

## Goal

Define a non-binding, Nico-decision-ready context-definition packet for Watch
Party as the fourth Engagement & Narrative bounded context.

## Constraints

- Docs-vault-only phase: no implementation, package, schema or migration work.
- All architecture/gameplay/scope decisions stay HITL. The ADR remains
  `status: draft` and `binding: false` until Nico approves the decision queue.
- Preserve Perplexity-first raw discovery, source checks, synthesis and
  decision questions.
- Keep Match authoritative for deterministic simulation and event logs,
  Notification authoritative for inbox/delivery, and Offline Sync authoritative
  for client queue/rebase concerns.
- Do not create a 29th bounded context; FMX-159 clarifies the existing Watch
  Party row from ADR-0089.

## Work Items

1. Capture Perplexity-first discovery and source checks under
   `docs/60-Research/raw-perplexity/`.
2. Write
   `docs/60-Research/watch-party-context-ownership-2026-06-17.md`.
3. Write Nico decision queue
   `docs/40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17.md`.
4. Draft
   `docs/10-Architecture/09-Decisions/ADR-0133-watch-party-context-definition.md`.
5. Update front-door and hot vault notes:
   - Decision Log.
   - Current State.
   - Research Summary.
   - Research Map.
   - Raw Perplexity index.
   - Session handoff index and handoff note.
6. Patch Watch Party source docs to point at ADR-0099 and ADR-0133 without
   promoting the draft game-design note.
7. Validate with docs checks and whitespace diff checks.

## Validation

- `node scripts/docs-check.mjs`
- `node scripts/status-consistency-check.mjs`
- `git diff --check`
