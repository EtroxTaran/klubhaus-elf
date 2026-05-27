---
title: Match Engine Runtime Documentation Handoff
status: wrapped
tags: [handoff, match-engine, documentation, runtime, architecture]
created: 2026-05-17
updated: 2026-05-17
type: handoff
binding: false
related:
  - [[../../60-Research/match-engine-runtime-strategy]]
  - [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
  - [[../../50-Game-Design/match-engine]]
---

# Match Engine Runtime Documentation Handoff

## Completed

Promoted the attached match-engine runtime research into the vault without
overriding accepted architecture decisions.

Final direction:

- TypeScript remains the MVP authoritative runtime for `packages/match-engine`.
- Server-side Match Worker extraction remains the first likely service split.
- Rust/polyglot implementation is allowed only post-MVP behind a measured gate:
  stable DTO contract, golden replay parity, statistical parity, determinism
  parity, operational readiness and old-engine replay fallback.
- Match quality profiles are now documented:
  `competitive-full`, `interactive-standard`, `background-detailed`,
  `background-fast`.
- Gameplay docs now distinguish Result / Event / Spatial / Analytics outputs
  and define deterministic intervention points for substitutions, tactics and
  shouts.

## Changed Vault Paths

- [[../../60-Research/raw-perplexity/raw-match-engine-runtime-technology]]
- [[../../60-Research/raw-perplexity/README]]
- [[../../60-Research/match-engine-runtime-strategy]]
- [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
- [[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
- [[../../10-Architecture/bounded-context-map]]
- [[../../10-Architecture/05-Building-Blocks]]
- [[../../10-Architecture/06-Runtime]]
- [[../../10-Architecture/07-Deployment]]
- [[../../10-Architecture/state-machines/match]]
- [[../../60-Research/determinism-and-replay]]
- [[../../60-Research/match-engine-simulation-model]]
- [[../../60-Research/performance-budgets]]
- [[../../50-Game-Design/match-engine]]
- [[../../50-Game-Design/singleplayer-baseline]]
- [[../../50-Game-Design/async-multiplayer-private-group]]
- [[../../30-Implementation/jobs-and-scheduler]]
- [[../../30-Implementation/deployment-dokploy]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Architecture-Map]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Game-Design-Map]]
- [[../../00-Index/Implementation-Map]]
- [[../../00-Index/Decision-Log]]

## Follow-Up Suggestions

- Create a future Linear issue for a match-engine benchmark harness that records
  profile, event output depth, device tier and average duration.
- Create a future Linear issue for a Rust/WASM feasibility spike only after the
  TypeScript engine has real baseline perf data.
- Revisit proposed ADR-0015 spectator streaming because accepted ADRs reference
  it; either promote or decouple those references.
- Add exact per-profile spatial sample rates when the first heatmap/report
  implementation begins.

## Verification Notes

Run docs/lint checks after this handoff. No code or package dependency changes
were intended.
## Related

- [[../../60-Research/match-engine-runtime-strategy]]
- [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
- [[../../50-Game-Design/match-engine]]
