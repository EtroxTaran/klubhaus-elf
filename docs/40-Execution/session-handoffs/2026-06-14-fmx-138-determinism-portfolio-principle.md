---
title: FMX-138 determinism portfolio principle handoff
status: current
tags: [execution, handoff, determinism, seeded-variance, fmx-138]
created: 2026-06-14
updated: 2026-06-14
type: handoff
binding: false
linear: FMX-138
related:
  - [[../../60-Research/determinism-portfolio-principle-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
  - [[../fmx-138-determinism-portfolio-principle-decision-queue-2026-06-14]]
---

# FMX-138 determinism portfolio principle handoff

## Goals

- Define one portfolio-level rule for pure deterministic versus bounded seeded
  variance surfaces.
- Preserve all research and decision artifacts in the vault.
- Prepare the Nico decision packet without self-ratifying.

## Completed

- Synced `main` and claimed FMX-138 in Linear.
- Created branch/worktree
  `codex/fmx-138-determinism-seeded-variance-principle`.
- Ran Perplexity-first research for simulation architecture, sports-management
  precedent, real-world football uncertainty and source checks.
- Added synthesis, raw captures, draft ADR-0113 and decision queue.
- Back-linked Open-Decisions-Dossier M2 so HoF voting is not isolated.

## Open Tasks

- Nico to approve or amend D1-D3 in the decision queue.
- If approved, flip ADR-0113 to accepted/binding and sweep pending wording.
- If not approved, update the ADR and queue with the chosen alternative.

## Decisions Made

None binding. Recommended packet:

- D1=A: portfolio rule = variety seeded, projection/measurement/audit pure.
- D2=A: match outcome variety, injury occurrence and AI-manager decisions use
  bounded seeded variance through existing streams.
- D3=A: preserve accepted pure declarations unless explicitly reopened.

## Blockers

- Binding status requires Nico approval.

## Durable Notes Updated

- [[../../60-Research/determinism-portfolio-principle-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
- [[../fmx-138-determinism-portfolio-principle-decision-queue-2026-06-14]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Open-Decisions-Dossier]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

ADR-0113 remains draft/non-binding until Nico approves D1-D3.
