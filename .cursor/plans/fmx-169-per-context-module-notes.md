---
title: FMX-169 Per-Context Module Notes Plan
status: current
tags: [plan, fmx-169, bounded-context, module-notes, ddd, documentation]
created: 2026-06-18
updated: 2026-06-18
type: plan
binding: false
related:
  - [[../../docs/60-Research/per-context-module-notes-2026-06-18]]
  - [[../../docs/40-Execution/fmx-169-per-context-module-notes-decision-queue-2026-06-18]]
  - [[../../docs/10-Architecture/bounded-context-map]]
  - [[../../docs/10-Architecture/05-Building-Blocks]]
---

# FMX-169 Per-Context Module Notes Plan

## Goal

Decide whether the 28 ratified bounded contexts need per-context module notes in
`docs/10-Architecture/modules/`, or whether
[[../../docs/10-Architecture/bounded-context-map]] §4 remains the single target
surface for context-to-folder mapping and public contract discovery.

## Steps

1. Claim FMX-169 in Linear and work from
   `codex/fmx-169-per-context-module-notes`.
2. Read the current module-note shape, `05-Building-Blocks`, ADR-0019 and the
   28-context bounded-context map.
3. Run Perplexity-first research for DDD modular-monolith documentation,
   context maps, module notes, team/API contracts and comparable game/simulation
   documentation practices.
4. Preserve raw discovery and targeted source checks under
   `docs/60-Research/raw-perplexity/`.
5. Synthesize options and recommendation in `docs/60-Research`.
6. Present Nico with a decision queue before creating canonical per-context
   notes or changing the architecture docs.
7. After Nico decides, either:
   - create the approved template plus first context notes and update the map, or
   - keep `bounded-context-map` §4 as the canonical surface and record that no
     per-context notes are desired.
8. Validate with `pnpm docs:check`, status check if binding/status semantics
   changed, and `git diff --check`.

## HITL Decisions Pending

Nico needs to answer D1-D4 in
[[../../docs/40-Execution/fmx-169-per-context-module-notes-decision-queue-2026-06-18]]
before the branch should add or omit canonical per-context module notes.
