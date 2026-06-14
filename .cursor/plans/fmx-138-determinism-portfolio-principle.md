---
title: FMX-138 Determinism Portfolio Principle Plan
status: current
tags: [plan, fmx-138, determinism, seeded-variance]
created: 2026-06-14
updated: 2026-06-14
type: plan
binding: false
linear: FMX-138
related:
  - [[../../docs/60-Research/determinism-portfolio-principle-2026-06-14]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
  - [[../../docs/40-Execution/fmx-138-determinism-portfolio-principle-decision-queue-2026-06-14]]
---

# FMX-138 Determinism Portfolio Principle Plan

## Goal

Define one portfolio-level rule for pure deterministic versus bounded seeded
variance surfaces so future gameplay systems do not re-litigate the same axis.

## Scope

- Preserve raw research, synthesis, decision queue and proposed ADR.
- Anchor the rule on ADR-0018 stream discipline and the existing
  determinism-and-replay note.
- Classify prior decisions without silently reopening accepted systems.
- Prepare Nico decisions; do not self-ratify.

## Execution

1. Sync `main`; claim FMX-138; create
   `codex/fmx-138-determinism-seeded-variance-principle`.
2. Run Perplexity-first research for simulation architecture, real football and
   game precedent; add targeted source checks where Perplexity identifies weak
   sourcing.
3. Save raw captures under `docs/60-Research/raw-perplexity/`.
4. Write synthesis, ADR-0113 and the HITL decision queue.
5. Update Decision-Log, Current-State, Research Map, raw index, summary and
   Open-Decisions-Dossier M2 back-link.
6. Validate with `node scripts/docs-check.mjs`; run status consistency only if
   the branch changes ADR/GDDR status/binding semantics.

## Acceptance

- `FMX-138` remains non-binding until Nico approves the decision packet.
- No new top-level RNG stream is proposed.
- Existing accepted pure-deterministic decisions remain intact unless Nico
  explicitly reopens them.
