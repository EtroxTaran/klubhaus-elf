---
title: FMX-135 Match-engine contract handoff
status: open
tags: [meta, execution, handoff, fmx-135, match-engine, determinism]
created: 2026-06-12
updated: 2026-06-12
type: handoff
binding: false
related:
  - [[../../60-Research/match-engine-contract-ratification-2026-06-12]]
  - [[../../40-Execution/fmx-135-match-engine-contract-decision-queue-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
---

# Handoff: FMX-135 Match-engine contract (2026-06-12)

## Linear

- Issue: FMX-135
- State: In Progress
- Branch/worktree: `codex/fmx-135-match-engine-contract` in
  `/tmp/fmx-135-match-engine-contract`

## Done this session

- Claimed FMX-135 in Linear and moved it to `In Progress`.
- Created a clean worktree from `origin/main` without touching the active
  FMX-147 dirty worktree in `/root/research-gp`.
- Re-read repo onboarding and workflow docs.
- Refreshed Perplexity research for runtime determinism and replay quality
  profiles, then cross-checked library/runtime facts against primary sources.
- Created raw captures and synthesis:
  - [[../../60-Research/raw-perplexity/raw-match-engine-runtime-fork-2026-06-12]]
  - [[../../60-Research/raw-perplexity/raw-match-engine-replay-quality-profiles-2026-06-12]]
  - [[../../60-Research/match-engine-contract-ratification-2026-06-12]]
- Created the live Nico decision queue:
  [[../../40-Execution/fmx-135-match-engine-contract-decision-queue-2026-06-12]].
- Nico approved D1-D5 live ("go on") and the decisions were promoted into the
  vault:
  - ADR-0096 is `accepted` / `binding: true` with single Rust/WASM authority
    (server Wasmtime, browser WebAssembly API), mandatory integer/fixed-point
    replay-bearing math, D2-A profile precedence and D3-A carry-forward.
  - ADR-0072, ADR-0077, ADR-0078, ADR-0086 and ADR-0087 are now
    `accepted` / `binding: true`.
  - Current-State, Decision-Log, research synthesis and this handoff were
    updated to remove the stale pending-decision wording.

## Open / next step

- Open the PR after validation and keep Linear FMX-135 linked.
- The next Match-engine implementation agent must run the D4 single-WASM
  parity/readiness spike before introducing authoritative Match runtime code.

## Blockers

- None for FMX-135 docs ratification.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-match-engine-runtime-fork-2026-06-12.md`
- `docs/60-Research/raw-perplexity/raw-match-engine-replay-quality-profiles-2026-06-12.md`
- `docs/60-Research/match-engine-contract-ratification-2026-06-12.md`
- `docs/40-Execution/fmx-135-match-engine-contract-decision-queue-2026-06-12.md`
- `docs/10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface.md`
- `docs/10-Architecture/09-Decisions/ADR-0072-in-match-control-seam.md`
- `docs/10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch.md`
- `docs/10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts.md`
- `docs/10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement.md`
- `docs/10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Decision-Log.md`
- Other research/session indexes updated to point at the packet.

## Needs promotion

- None. D1-D5 are promoted into ADR-0096, the five related ADR frontmatter
  cleanup edits, Current-State and Decision-Log.
