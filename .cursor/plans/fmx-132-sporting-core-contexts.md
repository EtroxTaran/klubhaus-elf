---
title: FMX-132 Sporting Core Context Definition Plan
status: in-progress
created: 2026-06-16
updated: 2026-06-16
issue: FMX-132
branch: codex/fmx-132-sporting-core-contexts
---

# FMX-132 Sporting Core Context Definition Plan

## Goal

Define a non-binding, Nico-decision-ready context-definition packet for the
Original-11 Sporting Core contexts Match, Training and Squad & Player.

## Constraints

- Docs-vault-only phase: no implementation, packages, schemas or tests beyond
  vault validation.
- All architecture/gameplay/scope choices remain HITL. Draft ADRs stay
  `status: draft` and `binding: false` until Nico approves.
- Preserve Perplexity-first research, source checks, synthesis and decision
  questions.
- Do not duplicate accepted ADR content; link ADR-0018, ADR-0055, ADR-0072,
  ADR-0078 and ADR-0087 where they already own details.

## Work Items

1. Capture FMX-132 Perplexity-first research and source checks under
   `docs/60-Research/raw-perplexity/`.
2. Write
   `docs/60-Research/sporting-core-context-definition-maturity-2026-06-16.md`.
3. Write Nico decision queue
   `docs/40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16.md`.
4. Draft three context-definition ADRs:
   - ADR-0129 Match Context Definition.
   - ADR-0130 Training Context Definition.
   - ADR-0131 Squad & Player Context Definition.
5. Update front-door and hot vault notes:
   - Decision Log.
   - Current State.
   - Research Summary.
   - Raw Perplexity index.
   - Research Map if needed.
   - Session handoff index and handoff note.
6. Apply proposed cleanup notes to bounded-context map, match state machine and
   GD-0005 without making pending decisions binding.
7. Validate with docs checks and whitespace diff checks.

## Validation

- `node scripts/docs-check.mjs`
- `node scripts/status-consistency-check.mjs`
- `git diff --check`

