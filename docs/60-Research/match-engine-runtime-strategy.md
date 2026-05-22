---
title: Match Engine Runtime Strategy - TypeScript MVP with Polyglot Extraction Gate
status: current
binding: true
tags: [research, match-engine, runtime, typescript, rust, wasm, web-worker, offline-first, multiplayer, wave-3]
created: 2026-05-17
updated: 2026-05-17
type: research
related: [[raw-perplexity/raw-match-engine-runtime-technology]], [[match-engine-simulation-model]], [[determinism-and-replay]], [[performance-budgets]], [[ai-manager-behaviour]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]], [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]], [[../50-Game-Design/match-engine]]
---

# Match Engine Runtime Strategy - TypeScript MVP with Polyglot Extraction Gate

This note reconciles the attached runtime technology research with the accepted
vault decisions. It answers one narrow question: should the match engine remain
TypeScript, move to Rust, or split by runtime?

## Decision Summary

For MVP, the match engine remains a **framework-agnostic TypeScript package**
shared by:

- local singleplayer PWA simulation in a Web Worker;
- server-side authoritative multiplayer Match Worker;
- deterministic replay and AI-vs-AI re-simulation.

Post-MVP, the Match Worker may be extracted into a separate runtime, including
Rust, **only** behind a formal polyglot extraction gate. This is an evidence
gate, not a default roadmap commitment.

The accepted target is therefore:

| Phase | Runtime | Binding rule |
|---|---|---|
| MVP | TypeScript in `packages/match-engine` | One canonical implementation shared by client Worker and server worker |
| Post-MVP scale trigger | Separate Match Worker process | Same API and deterministic contract; still may be TypeScript |
| Post-MVP evidence trigger | Rust implementation allowed | Must pass cross-runtime parity, replay and statistical tests before authority |

This keeps ADR-0003 stable while acknowledging Nico's service-architecture
requirement: the Match context can later be replaced or extracted without
changing product semantics.

## Why the Raw Research Was Challenged

The raw research correctly identifies that Rust becomes more attractive when the
match engine is considered as a horizontally scaled CPU service. However, it
underweights three current project constraints:

- **Offline-first PWA is a product promise.** Singleplayer must run locally,
  including on mobile, without server dependency.
- **Deterministic replay is already binding.** A second implementation is not
  just a performance change; it is a replay, audit and balance-risk change.
- **MVP velocity matters.** The current architecture intentionally gets one
  tested simulation semantics working before introducing cross-language parity.

The best conclusion is not "Rust now" or "Rust never". It is: TypeScript is the
MVP authority; Rust is a possible extracted implementation after profiling and
contract hardening.

## Runtime Comparison

| Technology | Strong fit | Weak fit | Project decision |
|---|---|---|---|
| TypeScript | Browser/PWA/offline, shared client/server implementation, fast iteration, Zod contracts, existing stack | Lower raw CPU ceiling than Rust; Node Worker communication costs for large object graphs | **Binding MVP runtime** |
| Rust native service | CPU-bound matchday batches, low memory, predictable latency, scale efficiency | Cross-language parity, team cost, deployment complexity, no direct PWA reuse | **Allowed post-MVP behind gate** |
| Rust/WASM | Shared Rust kernel possible in browser + server; strong for coarse numeric batches | JS/WASM boundary and packaging complexity; not automatically faster; browser compatibility/build constraints | **Research option, not MVP** |
| Python | AI/data/content pipelines, experiments, offline authoring tools | Browser/mobile runtime payload, startup, determinism and performance risks | **Not allowed in core path** |
| Go/C# | Viable services in isolation | No strong advantage over TypeScript/Rust for this stack and PWA reuse | **No current role** |

## Polyglot Extraction Gate

A Rust Match Worker can become authoritative only when all conditions are true:

1. **Measured need**: production or synthetic load shows the TypeScript worker is
   the limiting factor after algorithmic profiling and batching improvements.
2. **Stable wire contract**: `MatchInputs`, `MatchResult`, `MatchEventCore`,
   `MatchSummary`, RNG state and `engine_version` are versioned, JSON/Zod
   compatible and documented as the service boundary.
3. **Golden parity**: canonical matches produce byte-identical event logs, or a
   deliberately versioned event-log change with migration/replay policy.
4. **Statistical parity**: 1k-5k match envelopes stay within accepted bands for
   goals, xG, shots, pass completion, cards, injuries and tactical effects.
5. **Determinism parity**: Rust and TypeScript PRNG/reference math match for the
   locked seed streams or the Rust engine ships as a new `engineVersion` with old
   TS modules retained for previous saves.
6. **Operational readiness**: health checks, structured logs, metrics, tracing,
   backpressure and worker shutdown behaviour exist before the service owns
   multiplayer authority.
7. **Fallback policy**: replay and audit tooling can still load historical engine
   modules by `engineVersion`.

Until those are true, Rust can be used only for experiments, benchmarks or
non-authoritative comparison runs.

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

- Keep `packages/match-engine` pure TypeScript for MVP.
- Keep event and summary DTOs JSON-serialisable and stable enough for a future
  process boundary.
- Treat engine data (`formationZoneWeights`, set-piece routines, profiles) as
  versioned inputs, not local implementation details.
- Add perf tests that record not only milliseconds per match, but also fixture
  profile, output depth and device tier.
- Plan a later `match-worker` container/process as the first extraction
  candidate, but do not choose Rust until measured evidence exists.

## Sources

- [[raw-perplexity/raw-match-engine-runtime-technology]] - attached private
  research input, 2026-05-17.
- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] - accepted MVP
  match-engine architecture.
- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] - service
  readiness and Match worker extraction order.
- [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - server authority and AI-vs-AI replay policy.
- MDN, [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) - Workers run scripts in background threads and communicate via `postMessage`.
- MDN, [Worker.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage) - messages use structured clone; transferables are needed for large zero-copy payloads.
- rustwasm / wasm-bindgen, [Wasm in Web Worker](https://github.com/rustwasm/wasm-bindgen/blob/main/guide/src/examples/wasm-in-web-worker.md?plain=1#L1#wasm-in-web-worker) - Rust/WASM can run in Workers, with build/compatibility caveats.
- web.dev, [Offline data](https://web.dev/learn/pwa/offline-data) - IndexedDB and Cache Storage are the durable browser storage tools for offline PWAs.
- Kevin Karsopawiro, [WebAssembly won't magically make your code faster](https://kevin.rs/blog/webassembly-in-the-browser) - WASM gains depend on batching and avoiding excessive JS/WASM boundary crossings.
