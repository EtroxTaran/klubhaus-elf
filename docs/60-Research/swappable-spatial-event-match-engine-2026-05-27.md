---
title: Swappable Spatial-Event Match Engine Research
status: current
tags: [research, match-engine, runtime, rust, typescript, wasm, spatial-event, offline, llm, disconnect]
context: match
created: 2026-05-27
updated: 2026-05-27
type: research
binding: false
related:
  - [[raw-perplexity/raw-swappable-spatial-event-match-engine-runtime]]
  - [[raw-perplexity/raw-match-engine-offline-and-disconnect]]
  - [[match-engine-runtime-strategy]]
  - [[match-engine-simulation-model]]
  - [[determinism-and-replay]]
  - [[offline-mvp-scope-and-sync-strategy]]
  - [[ai-narrative-runtime-integration]]
  - [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../50-Game-Design/match-engine]]
---

# Swappable Spatial-Event Match Engine Research

FMX-10 synthesis for Nico's 2026-05-27 decision thread: match engine,
runtime strategy, offline posture, disconnect handling, 2D representation and
LLM-supported live ticker.

This note is research, not implementation authority. It feeds draft
[[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
and updates the current match-engine planning notes.

## 1. Decision context

Nico's architecture concern is not just "which engine is fastest". The match
engine is the highest-risk component for later scaling, realism, gameplay feel
and potential replacement. Therefore FMX must plan it as an exchangeable
component from day one.

Current direction:

- canonical matches are server-authoritative in the hybrid-online MVP;
- the model target is **spatial-event**, not outcome-first and not full
  22-agent simulation at MVP;
- 2D Canvas, live ticker, replay, reports and LLM commentary consume the same
  committed event/spatial contract;
- runtime decision is **Spike, Rust-default**: run a small TS-vs-Rust
  contract-identical spike, then make exactly one engine authoritative. If Rust
  native shows no clear disadvantage, it becomes the first production runtime.

## 2. Simulation model options

| Model | Fit | Main issue |
|---|---|---|
| Outcome-first | Very cheap for background matches. | Tactics, 2D and star players become decorative; hard to explain what happened. |
| Full agent-based | Highest realism ceiling. | High tuning, CPU and determinism cost; too large for first production target. |
| Spatial-event | Best fit. Event decisions are driven by coarse/continuous 2D state, pressure, roles, xG/EPV and tactics. | Requires careful contracts and statistical validation. |

Recommendation: **spatial-event core**.

The engine should generate football facts through event decisions that see
space. The renderer must not invent causality. It may smooth/interpolate, but
the source of truth remains `MatchEventLog` plus `SpatialSample`.

Minimum model responsibilities:

- player/role positions as normalized pitch coordinates;
- ball ownership and location;
- pressure, compactness, line height, width and zone control;
- candidate actions: pass, carry, dribble, cross, shot, clearance, duel, foul;
- action utility from attributes, fatigue, morale, tactical coefficients,
  pressure, xG/EPV and risk;
- star-player involvement through both selection probability and outcome
  quality, not only a hidden rating boost.

## 3. Runtime strategy

Runtime quality and simulation quality are different questions. Rust does not
make a poor model realistic. It does, however, give more CPU and memory headroom
for a richer model once the contract is stable.

| Runtime | Strength | Risk |
|---|---|---|
| TypeScript/Node | Fast iteration, easy web-team debugging, direct schema/tooling fit. | Lower CPU ceiling, GC/JIT variability, weaker long-term scaling. |
| Rust native service | Better throughput, memory predictability, data-oriented modelling, service isolation. | Higher initial complexity and no direct browser reuse. |
| Rust/WASM | Useful for browser replay/sandbox from the same Rust core. | Server-side complexity and JS/WASM boundary overhead; not the best authoritative backend default. |

Updated FMX position:

1. Do **not** bind the first authoritative engine to TypeScript.
2. Do **not** build two production engines.
3. Build a small contract-identical spike in TypeScript and Rust native.
4. Choose Rust native as production default if the spike does not expose clear
   modelling, build, debugging or delivery disadvantages.
5. Keep Rust/WASM as a future client replay/sandbox option, not as the first
   authoritative server runtime.

## 4. Open-source due diligence

| Candidate | License | Use level | FMX assessment |
|---|---|---|---|
| OpenFootball | Apache-2.0 | Study + spike candidate | Most relevant codebase on paper: Rust, match simulation, performance profiling and engine-like scope. Needs code audit before reuse. |
| OpenFootManager | GPLv3 | Study only by default | Useful manager-game reference; direct code reuse is risky unless copyleft is deliberately accepted. |
| Google Research Football | Apache-2.0 | Research inspiration | Valuable for observation/action concepts; not a manager-game engine foundation. |
| RoboCup rcssserver | LGPL-3.0 | Research inspiration | Mature 11-vs-11 agent simulation reference; product integration likely too heavy and research-protocol oriented. |
| Bevy | MIT/Apache-2.0 | Architecture experiment | Useful ECS/data-oriented Rust reference; probably too broad as required engine framework. |
| Rapier | Rust/JS WASM physics engine | Optional physics experiment | Useful if ball/body physics becomes important; avoid making physics the core if event logic is enough. |
| Planck.js / Matter.js | MIT | Prototype only | Good 2D physics demos; weak long-term fit if authoritative engine is Rust native. |

Policy: **study + spike only**. No OSS code enters FMX until a separate
license/code-audit ADR approves it.

## 5. Replacement contract

The engine boundary must make replacement routine rather than heroic.

Required contract pieces:

- `MatchEnginePort`: the only caller-facing boundary.
- `MatchInput`: frozen team, tactic, rules, context and quality profile.
- `MatchEventLog`: canonical event sequence for result, stats, replay, ticker
  and audit.
- `SpatialSample`: normalized 2D positions/pressure/phase samples for Canvas,
  heatmaps and tactical analysis.
- `MatchSummary`: score, xG, shots, cards, injuries, player ratings and durable
  downstream effects.
- `EngineCapabilities`: supported input/log/replay/RNG versions, profiles,
  live intervention support, spatial density and deterministic guarantees.
- `ReplayRecord`: immutable event/replay package with `engineId`,
  `engineVersion`, `contractVersion`, `rngVersion`, seed and quality profile.

No UI, LLM, persistence, realtime or report code may import a concrete engine
implementation.

## 6. Validation and benchmark gates

Spike fixtures:

- equal teams;
- strong star attacker vs average defender;
- high press vs low block;
- red card / injury / substitution;
- big chance / high-xG shot.

Required gates:

- PRNG test vectors shared by all runtime candidates.
- Golden masters for exact replay where strict compatibility is promised.
- Statistical regression across 1k-10k seeds for goals, xG, shots, cards,
  injuries, pass completion, pressure wins and star involvement.
- Spatial sanity: no impossible ball jumps, impossible player speeds or 2D
  shape collapses.
- Observability: per-engine p50/p95 simulation time, queue wait, memory,
  event count, spatial sample size, replay size and failure rate.
- Shadow-mode policy before replacing an authoritative engine in production.

## 7. Offline and disconnect implications

Offline strategy stays **A -> C**:

- MVP: hybrid-online, app shell/read cache/local drafts; authoritative mutations
  need server confirmation.
- Contracts now: command envelopes are idempotent, versioned and preconditioned.
- Later: offline manager-week command outbox can replay intents after reconnect.

Match resolution is not local-authoritative in MVP. Local engine runs are
allowed only as non-binding previews, future what-if tools or future selective
offline singleplayer if a separate ADR/GDDR approves that mode.

Disconnect policy:

- singleplayer/live coaching: pause the server match for a reconnect window,
  then auto-continue from the last valid intervention state;
- normal async match viewing: the match continues and reconnect resumes from
  event cursor/live stream or replay;
- watch party: group-level `disconnectPauseMode` controls whether active
  managers pause the shared broadcast; passive spectators never pause the match.

## 8. LLM ticker implication

LLM commentary is a display layer over committed facts.

- OpenRouter is the experimental provider path behind an adapter.
- Runtime LLM is feature-flagged beta and limited to key events.
- Inputs are structured event facts, not raw user text.
- Output may replace a commentary line only after schema/fact/safety checks.
- Template fallback is always available.
- The LLM never changes match simulation, stats, replay, morale, finances,
  injuries or tactics.

## Sources

Project inputs:

- [[raw-perplexity/raw-match-engine-offline-and-disconnect]]
- [[raw-perplexity/raw-swappable-spatial-event-match-engine-runtime]]
- [[match-engine-runtime-strategy]]
- [[match-engine-simulation-model]]
- [[determinism-and-replay]]
- [[offline-mvp-scope-and-sync-strategy]]
- [[ai-narrative-runtime-integration]]

Primary and external sources checked:

- OpenFootball: <https://github.com/ZOXEXIVO/open-football>
- OpenFootManager: <https://github.com/openfootmanager/openfootmanager>
- Google Research Football: <https://github.com/google-research/football>
- RoboCup rcssserver: <https://github.com/rcsoccersim/rcssserver>
- Rapier: <https://rapier.rs/>
- Bevy: <https://bevy.org/>
- Planck.js: <https://github.com/piqnt/planck.js>
- Matter.js: <https://github.com/liabru/matter-js>
- MDN Web Workers: <https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers>
- MDN OffscreenCanvas: <https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas>
- MDN Server-Sent Events: <https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events>
- Workbox Background Sync: <https://developer.chrome.com/docs/workbox/modules/workbox-background-sync>
- EU AI Act Article 50: <https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50>
