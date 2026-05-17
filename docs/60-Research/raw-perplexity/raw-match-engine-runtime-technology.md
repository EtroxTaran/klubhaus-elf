---
title: Raw - Match Engine Runtime Technology and Scaling Research
status: raw
tags: [research, raw, perplexity, match-engine, runtime, rust, typescript, wasm, offline-first]
created: 2026-05-17
updated: 2026-05-17
type: research-raw
binding: false
related: [[README]], [[../match-engine-runtime-strategy]], [[../match-engine-simulation-model]], [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../../10-Architecture/09-Decisions/ADR-0010-modular-monolith-ddd]], [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
---

# Raw - Match Engine Runtime Technology and Scaling Research

> Source: attached private Perplexity-style research document,
> `Für unsere Match Engine verwenden wir einen Mechan.md`, provided by Nico on
> 2026-05-17.
>
> This note preserves the substantive content and evolution of that report for
> traceability. It is **not authoritative**; promoted decisions live in
> [[../match-engine-runtime-strategy]],
> [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]] and the current
> architecture/gameplay notes.

## Prompt Focus

The research asked which technology foundation should be used for a football
manager match engine that must support:

- TypeScript-first product stack and modular service architecture.
- Offline-first PWA and later mobile app packaging.
- Singleplayer local simulation.
- Server-authoritative asynchronous multiplayer.
- Hundreds of matchday fixtures.
- Human-managed clubs, AI-only fixtures and world simulation.
- Tactical depth: formations, roles, player traits, attributes, instructions,
  fatigue, weather, stadium/fans and momentum.
- Live interventions during matches: substitutions, tactics, shouts and role
  changes.
- Rich outputs: event feed, 2D visualisation, possession, shots, passes,
  duels, running distance, heatmaps, pass maps and match reports.
- Future optional local or API-based AI for mini-decisions, reports or
  dynamic narrative.

## Iteration 1 - TypeScript First

The first conclusion was: TypeScript is likely the best **starting point** for
the match engine, not because it is the fastest language in isolation, but
because the engine has to work in browser, PWA, offline mode, mobile WebView and
server contexts.

Key points:

- TypeScript / JavaScript gives one language across browser, server, tooling,
  tests and PWA offline runtime.
- Rust is stronger for CPU-heavy kernels and can run natively server-side or in
  WASM, but adds team complexity and JS/WASM boundary costs.
- Python is strong for AI/ML tools and data pipelines, but is a poor browser
  runtime fit for the core engine. Pyodide-style approaches increase payload and
  startup time and have platform constraints.
- Go and C# are viable server technologies but weaker fits for a shared
  browser/server simulation core in the current stack.
- A single deterministic simulation core is preferable to two divergent engines.
- Offline singleplayer can run locally; multiplayer results must remain
  server-authoritative.
- AI should be an optional adapter around match reports, narratives and
  suggestions, not part of deterministic core resolution.

Recommended architecture in this iteration:

- `match-domain`: rules, state machines, event types, contracts and RNG
  interfaces.
- `match-sim-core`: deterministic simulation without I/O, DB, UI or framework
  dependencies.
- `match-runtime-browser`: Web Worker runtime and local persistence policies.
- `match-runtime-server`: authoritative runtime, queues, audit and replay
  storage.
- `match-feed/replay`: serialised event frames for replay, watch parties and
  conference mode.

## Iteration 2 - Quality Profiles and Genre Learnings

After adding speed, tactical detail, statistics and hundreds of matchday
fixtures to the question, the research kept the TypeScript-first recommendation
but shifted emphasis to **simulation tiers**.

Important conclusions:

- The main performance lever is not just language choice; it is deciding which
  fixtures deserve full event/spatial depth.
- Active human matches should not be treated the same as AI-only background
  fixtures.
- Singleplayer can accept configurable lower detail as long as outcomes remain
  plausible and consistent.
- Competitive multiplayer needs higher fidelity and server authority.
- The engine should be event-based with reactive recomputation on interventions,
  not frame-by-frame physics.
- 2D and text presentation should consume engine outputs rather than drive the
  simulation.
- Football-manager genre practice supports relevance-based world simulation:
  human clubs and important fixtures deep; rest of world progressively coarser.

Proposed match-depth tiers:

| Tier | Use | Detail |
|---|---|---|
| Tier 0 | Human-vs-human, human clubs, watch parties, key fixtures | Full event and spatial output, live interventions, complete stats |
| Tier 1 | Human-vs-AI and important AI fixtures | Event-based, reduced spatial sampling, full core stats |
| Tier 2 | Observed leagues and relevant AI competitions | Aggregated events and limited key stats |
| Tier 3 | Rest-world simulation | Macro result, form, development, reputation and economy effects |

Proposed components:

- Pre-Match Resolver for team strength, roles, positions, tactics, morale,
  fitness, weather, stadium, atmosphere and context.
- Event Simulator for passes, dribbles, duels, shots, fouls, cards, injuries,
  set pieces and transitions.
- Spatial Sampler for lightweight position/zone samples behind heatmaps,
  average positions and territory analysis.
- Intervention Engine for substitutions, formations, mentality and instructions.
- Analytics Layer for possession, shots, passes, distances, duels, press data,
  heatmaps and reports.

## Iteration 3 - Offline, UX and Live Simulation

The research then expanded the UX requirements:

- Offline matchdays should not create endless loading screens.
- The UI can show the match while simulation progresses.
- The result does not always need to be fully known at kickoff when the user can
  still intervene.

Resulting guidance:

- Use Web Workers for browser-side simulation; never block the UI thread.
- Avoid spawning too many Workers; use persistent workers and coarse-grained
  jobs.
- Parallelism should respect `hardwareConcurrency` and device/battery limits.
- Present the matchday screen quickly and stream or buffer event frames into
  Text & Stats or 2D playback.
- Background fixtures should be aggressively reduced by relevance.
- Interventions should apply at deterministic phase boundaries or stoppages
  rather than rewriting arbitrary frames.

The report proposed quality profiles:

| Profile | Use | Goal |
|---|---|---|
| `cinematic-competitive` | Human clubs, watch parties, multiplayer key matches | Highest fidelity |
| `interactive-standard` | Singleplayer active match and important AI fixtures | Good quality without heavy load |
| `background-detailed` | Active league AI fixtures | Plausible world continuity |
| `background-fast` | Rest-world and large competition batches | Throughput |

## Iteration 4 - Real Service Architecture Changes the Weighting

Nico clarified that the product should be a true modular service architecture,
not a monolith in the long-term sense. The research then changed its conclusion:
TypeScript remains the best PWA/offline runtime, but a horizontally scalable
multiplayer match-engine service makes Rust more attractive.

New weighting:

| Area | Suggested technology | Reasoning |
|---|---|---|
| PWA / UI / offline shell | TypeScript | Best browser/offline integration |
| Application/orchestration services | TypeScript or Go | Productive service APIs |
| Multiplayer match-engine service | Rust | CPU efficiency, predictable memory, horizontal worker scale |
| Analytics / batch / reports | Rust or TypeScript | Depends on measured load |
| AI / content / narrative tools | Python optional | Separate non-critical helper service |

The report warned that this introduces a real trade-off:

- A shared TypeScript engine maximises reuse and PWA simplicity.
- A Rust multiplayer service improves server efficiency but risks two runtime
  implementations drifting.
- Rust everywhere via WASM keeps one language but raises browser packaging and
  integration complexity.

Final raw recommendation in that iteration:

- Multiplayer match engine service in Rust.
- PWA/offline singleplayer engine in TypeScript.
- Shared domain model, event types, seed/RNG rules, quality profiles and golden
  test suites.
- Treat the match-engine service as stateless or largely stateless: input job +
  seed + context in; result/event/snapshot stream out; state persists outside
  the simulation process.

## Raw Risks Raised

- Client-side multiplayer results are not trustworthy.
- Separate engine implementations can diverge without strict contracts and
  reference tests.
- Rust increases development and debugging complexity.
- WASM is not automatically faster when many small calls cross the JS/WASM
  boundary.
- Python in the browser is too heavy for the core engine path.
- Mobile offline simulation must respect CPU bursts, battery, memory, thermal
  throttling and iOS background constraints.
- Heatmaps from event data alone are weaker than heatmaps backed by lightweight
  position or zone sampling.
- Simulating every fixture at maximum detail causes bad matchday UX and is
  unnecessary.

## Raw Open Questions

- What are the maximum acceptable wait times per matchday on low-end mobile,
  mid-range mobile and desktop?
- How many fixtures per matchday may run at full depth per device and mode?
- Which match analytics are mandatory at MVP versus post-MVP?
- Is the project willing to accept two runtime implementations later if the
  Rust service improves multiplayer scale?
- Which profile names should become the stable product/architecture vocabulary?

## Promotion Outcome

The current promoted answer is intentionally more conservative than the final
raw iteration:

- TypeScript remains binding for the MVP engine and shared client/server
  semantics.
- A Rust multiplayer engine is documented as a **post-MVP extraction gate**,
  not as the immediate target.
- Rust is allowed only behind the same Match contract, event schema,
  seed/replay contract and golden parity tests.
- The gameplay model adopts explicit match-depth profiles and no-long-loading
  UX rules from the raw report.
