---
title: Match Engine Runtime Strategy - Swappable Runtime Spike with Rust Default
status: current
binding: false
tags: [research, match-engine, runtime, typescript, rust, wasm, web-worker, offline-first, multiplayer, wave-3]
context: match
created: 2026-05-17
updated: 2026-05-27
type: research
related: [[raw-perplexity/raw-match-engine-runtime-technology]], [[raw-perplexity/raw-swappable-spatial-event-match-engine-runtime]], [[swappable-spatial-event-match-engine-2026-05-27]], [[match-engine-simulation-model]], [[determinism-and-replay]], [[performance-budgets]], [[ai-manager-behaviour]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]], [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]], [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]], [[../50-Game-Design/match-engine]]
---

# Match Engine Runtime Strategy - Swappable Runtime Spike with Rust Default

This note was originally written on 2026-05-17 as "TypeScript MVP with
Polyglot Extraction Gate". FMX-10 reopens that stance after Nico's 2026-05-27
decision that the match engine must be planned as the most replaceable and
scalable component in the system.

This note is now a research/runtime strategy input for draft
[[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]].
It is not binding implementation authority while ADRs are reopened.

## Decision Summary

The prior TypeScript-first conclusion no longer stands as the planning target.
FMX will not commit the first authoritative engine runtime before a small
contract-identical spike.

Current direction:

- **Model:** server-authoritative spatial-event engine.
- **Boundary:** versioned `MatchEnginePort`; all consumers use event/spatial
  contracts, never concrete engine internals.
- **Runtime posture:** **Spike, Rust-default**. Build a small TypeScript and
  Rust-native vertical slice against the same fixtures, RNG vectors, event log
  and spatial samples. Choose Rust native as first authoritative production
  runtime unless the spike shows clear disadvantages.
- **WASM:** future replay/sandbox option, not the authoritative server default.

The target table becomes:

| Phase | Runtime | Binding rule |
|---|---|---|
| Spike | TypeScript reference + Rust native slice | Same port, seed, fixtures, event log and spatial samples |
| First authority | Rust native service by default | Unless spike proves TS is safer without losing determinism/scaling headroom |
| Future client reuse | Rust/WASM or lightweight replay adapter | Only for browser replay/sandbox, never hidden authority |

This updates ADR-0003's TypeScript-first stance and feeds ADR-0049.

## Why the Raw Research Was Challenged

The raw research correctly identifies that Rust becomes more attractive when the
match engine is considered as a horizontally scaled CPU service. The original
2026-05-17 conclusion weighted these constraints more heavily:

- **Offline-first PWA is a product promise.** Singleplayer must run locally,
  including on mobile, without server dependency.
- **Deterministic replay is already binding.** A second implementation is not
  just a performance change; it is a replay, audit and balance-risk change.
- **MVP velocity matters.** The current architecture intentionally gets one
  tested simulation semantics working before introducing cross-language parity.

FMX-10 changes the weighting:

- the MVP is hybrid-online and server-confirmed, so local match authority is no
  longer the runtime anchor;
- Nico explicitly prioritizes engine exchangeability and scaling risk;
- spatial-event depth increases the value of Rust's CPU/memory headroom;
- TypeScript remains useful for a reference/prototype, but not as the default
  production commitment.

The best current conclusion is: **spike both, default to Rust native if it clears
the contract gate**.

## Runtime Comparison

| Technology | Strong fit | Weak fit | Project decision |
|---|---|---|---|
| TypeScript | Fast iteration, schema/tooling fit, useful reference adapter | Lower CPU ceiling than Rust; GC/JIT variability; not ideal as long-term engine authority | **Spike/reference candidate** |
| Rust native service | CPU-bound matchday batches, low memory, predictable latency, scale efficiency, data-oriented modelling | Team/tooling cost, no direct browser reuse | **Default production candidate after spike** |
| Rust/WASM | Shared Rust kernel possible in browser + server; strong for coarse replay/sandbox calls | JS/WASM boundary and packaging complexity; not automatically faster; server-native Rust is cleaner | **Future replay/sandbox option** |
| Python | AI/data/content pipelines, experiments, offline authoring tools | Browser/mobile runtime payload, startup, determinism and performance risks | **Not allowed in core path** |
| Go/C# | Viable services in isolation | No strong advantage over TypeScript/Rust for this stack and PWA reuse | **No current role** |

## Runtime Spike Gate

The spike must be intentionally small. It is not a dual-engine V1.

1. Same fixtures: equal teams, star attacker, high press vs low block, red
   card/injury/substitution, high-xG chance.
2. Same `MatchInput`, `MatchEventLog`, `SpatialSample`, `MatchSummary` and
   `EngineCapabilities` schemas.
3. Same PRNG test vectors and deterministic ordering rules.
4. Same output expectations for golden fixtures.
5. Benchmark p50/p95 simulation time, memory, event count, spatial sample count
   and serialized output size.
6. Record debugging, observability, build and deployment friction.

Rust native becomes authoritative only after the spike confirms the contract and
ADR-0049 is ratified. TypeScript remains allowed as a comparison adapter or
non-authoritative prototype.

## Match Quality Profiles

The raw research is strongest on simulation depth. The project should make
quality profiles explicit so hundreds of matchday fixtures do not all run at
full detail.

| Profile | Primary use | Output |
|---|---|---|
| `competitive-full` | Human-vs-human, human-vs-AI, watch-party selected fixtures, title deciders | Full event log, spatial samples, analytics, intervention support |
| `interactive-standard` | Singleplayer active match on Standard/Premium devices | Full event log, reduced spatial rate, complete core stats |
| `background-detailed` | Active league AI fixtures, important rivals, cup fixtures relevant to the user | Summary plus selected events/key stats, optional on-demand replay |
| `background-fast` | Rest-world fixtures and long-term world progression | Result, form, injuries, fatigue, table/rep/economy effects only |

Profiles are orthogonal to UI tiers:

- Quick / Standard / Expert = user-facing information density.
- Premium / Standard / Floor = device capability.
- Match quality profile = simulation/output depth.

## Interactive vs Batch Simulation

The existing docs say the engine can run to completion before playback. That
remains correct for:

- AI-vs-AI batch fixtures;
- already-completed replays;
- non-interactive fast simulation;
- server precomputation for scheduled async matchdays.

Human-interactive matches need a refined model:

- The engine may buffer ahead in deterministic chunks.
- Substitutions, tactical changes and shouts are queued at deterministic
  intervention points such as stoppages, halftime, injuries, cards or phase
  transitions.
- Past events are immutable; future probabilities and team influence maps update
  from the intervention point.
- The UI consumes event batches progressively so the player sees a match, not a
  loading screen.

This preserves deterministic replay while avoiding the product risk of long
matchday waits.

## AI Boundary

AI should not sit inside the deterministic physical event core unless it is
explicitly part of the `MatchAiRng` decision stream.

Allowed AI use:

- assistant suggestions and tactical explanations;
- match reports, headlines and narrative variants;
- build-time content drafting;
- non-authoritative previews and recommendations;
- future server-side narrative or analysis service.

Not allowed:

- LLM/non-deterministic selection of core match events;
- client-side authority for multiplayer outcomes;
- Python/Pyodide in the match core path;
- unversioned AI decisions that change replay output.

## Implementation Implications

- Define `MatchEnginePort` and versioned DTOs before engine implementation.
- Keep event, spatial and summary DTOs serialisable and stable enough for a
  service/process boundary from day one.
- Treat engine data (`formationZoneWeights`, set-piece routines, profiles) as
  versioned inputs, not local implementation details.
- Add perf tests that record not only milliseconds per match, but also fixture
  profile, output depth and device tier.
- Plan the Match Worker as the first extracted/scaled service boundary.
- Do not introduce a direct UI, persistence, LLM or renderer dependency on the
  concrete engine package/service.

## Sources

- [[raw-perplexity/raw-match-engine-runtime-technology]] - attached private
  research input, 2026-05-17.
- [[raw-perplexity/raw-swappable-spatial-event-match-engine-runtime]] -
  2026-05-27 runtime, model, OSS and replacement research digest.
- [[swappable-spatial-event-match-engine-2026-05-27]] - current synthesis for
  the swappable spatial-event direction.
- [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - draft replacement target for ADR-0003.
- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] - historical
  TypeScript-first match-engine architecture, reopened and superseded as a
  planning target by ADR-0049.
- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] - service
  readiness and Match worker extraction order.
- [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - server authority and AI-vs-AI replay policy.
- MDN, [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) - Workers run scripts in background threads and communicate via `postMessage`.
- MDN, [Worker.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage) - messages use structured clone; transferables are needed for large zero-copy payloads.
- rustwasm / wasm-bindgen, [Wasm in Web Worker](https://github.com/rustwasm/wasm-bindgen/blob/main/guide/src/examples/wasm-in-web-worker.md?plain=1#L1#wasm-in-web-worker) - Rust/WASM can run in Workers, with build/compatibility caveats.
- web.dev, [Offline data](https://web.dev/learn/pwa/offline-data) - IndexedDB and Cache Storage are the durable browser storage tools for offline PWAs.
- Kevin Karsopawiro, [WebAssembly won't magically make your code faster](https://kevin.rs/blog/webassembly-in-the-browser) - WASM gains depend on batching and avoiding excessive JS/WASM boundary crossings.
