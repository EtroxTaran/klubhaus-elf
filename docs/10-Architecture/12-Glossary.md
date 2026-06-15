---
title: Glossary (Architecture & Ubiquitous Language)
status: current
tags: [architecture, glossary, ubiquitous-language, ddd, arc42]
updated: 2026-06-15
type: arch
related: [[../00-Index/Glossary]]
---

# 12. Glossary

This is the **arc42 architecture / domain glossary** — the ubiquitous-language
terms drawn from the ratified ADRs ([[../00-Index/Decision-Log]]) and the
[[bounded-context-map]]. Each entry is crisp (1–2 lines) and cites the owning
ADR / context.

> For **project / process / design** vocabulary (Beat, Vault, IP-clean data,
> Intent layer, Aurelia Premier, Sonntagszeitung, design-sync) see the
> project glossary [[../00-Index/Glossary]] — those terms are **not** repeated here.

## Architecture & system shape

- **Modular monolith (service-ready)** — One deployed process whose contexts each own a thin, JSON-serialisable, network-transparent contract, so any context can later split to its own process without a refactor ([[09-Decisions/ADR-0019-modular-monolith-ddd]]).
- **Bounded context** — A model boundary owning its domain logic, state machine(s), tables and public contract (commands + queries + domain events). The ratified portfolio is the count fixed by the [[bounded-context-map]] / [[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]] — defer to the map, never hardcode a number.
- **Subdomain clusters** — The six cognitive-load groupings over the contexts (**not** boundaries): Sporting Core; Competition & World Simulation; Club, Finance & Commerce; Recruitment, People & Career; Engagement & Narrative; Platform & Governance ([[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]).
- **Public contract / published language** — A context's outward surface: commands + queries + domain events, Zod-validated, unknown fields ignored ([[09-Decisions/ADR-0019-modular-monolith-ddd]]).
- **Offline-first PWA** — The hybrid online-MVP / offline-ready delivery stance; the client must run and verify locally ([[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]).

## Data, persistence & messaging

- **System of record** — PostgreSQL 18.x holds authoritative state; SurrealDB 1.x is a reserved, non-authoritative projection ([[09-Decisions/ADR-0027-postgres-data-model]], [[09-Decisions/ADR-0021-revised-tech-stack]]).
- **Schema-per-save** — Each active career save is isolated in its own Postgres schema; the documented single-node scale ceiling is 300 soft-warn / 1000 hard-stop live save schemas with a verified cold/archive fallback ([[09-Decisions/ADR-0027-postgres-data-model]], [[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]).
- **Transactional outbox** — Domain events written to `outbox_event` in the **same transaction** as the state change; idempotent by UUIDv7 `event_id`; the outbox is the committed domain-event publication path and domain mutation trail, not the pre-commit command dedup gate ([[09-Decisions/ADR-0028-postgres-transactional-outbox]], [[09-Decisions/ADR-0119-command-reception-dedup-seam]]).
- **Event-carried state transfer** — A consumer derives state from a self-contained event payload (no cross-context join); e.g. League reading `WatchPartyScheduled` to set the deadline anchor ([[09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]).
- **Projection / read model** — A rebuildable derived view (no authoritative writes); statements/KPIs and Statistics & Analytics are projections, never sources of truth.
- **Command queue / offline sync** — The narrow cloud-sync scope: a local outbox of player commands replayed on reconnect, with the ADR-defined conflict/rebase UX strategy; authoritative server replay/dedup lives at Command Reception ([[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]], [[09-Decisions/ADR-0119-command-reception-dedup-seam]]).
- **Command Reception** — The synchronous server-side ingress capability that binds auth/session, hashes the canonical command payload, checks `commandId` replay/dedup state, then dispatches only accepted new commands to domain validation ([[09-Decisions/ADR-0119-command-reception-dedup-seam]]).

## Match engine & determinism

- **Deterministic match engine** — Replay-bearing simulation that reproduces results exactly given the same seed + inputs (no `Math.random`/`Date.now`/`setTimeout` in the core) ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]).
- **Numeric surface** — The mandatory integer / fixed-point arithmetic for every value any statistic, RNG branch or replay decision depends on (probabilities branch against basis points) ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]).
- **RNG stream** — One of the **9** canonical named streams (`WorldRng`, `WorldAiMgmtRng`, `MatchCoreRng`, `MatchAiRng`, `WeatherRng`, `InjuryRng`, `TransferRng`, `NewsRng/PresentationRng`, `GeneratorRng`); the count is 9, not 8 ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]).
- **Seeded variance** — Bounded, reproducible randomness drawn from a named RNG stream — variation without breaking determinism ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]).
- **Resim-from-log / golden replay** — Re-running the committed event log to reproduce a match; the binding correctness gate for byte-exact profiles ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]], [[09-Decisions/ADR-0026-match-frame-contract]]).
- **Quality profile** — One of `competitive-full` / `interactive-standard` (byte-identical replay), `background-detailed` (statistical envelope binding), `background-fast` (statistical envelope only, never a replay source). **Profile decides** when byte-exact and statistical contracts conflict ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]).
- **MatchFrame** — The render-/projection-side per-tick view (and interpolation surface) — a presentation projection, not the replay-bearing core ([[09-Decisions/ADR-0026-match-frame-contract]]).
- **EngineCapabilities** — The declared feature/runtime capability set behind the framework-agnostic engine port, enabling a future Rust/WASM swap to stay equality-safe ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]).

## Domain (ubiquitous language)

- **Escalation FSM** — Transfer's 5-stage finite state machine replacing the single `escalated` lump; stage is a pure function of accumulated pressure ([[09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]).
- **Pressure-accumulator** — The hybrid value object where each fact adds a weighted integer increment to one `pressure`; decay is leaky-bucket + per-stage stickiness + hysteresis (`θ_up > θ_down`), so the FSM never flaps near a threshold ([[09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]).
- **MatchTiming / `broadcast_at` anchor** — One `MatchTiming{anchorType, anchorAt}` per fixture; for a scheduled watch party `anchorAt = broadcast_at` is the single authoritative deadline anchor, set at schedule time and immutable after `MatchdayOpened` (all locks derive from it) ([[09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]).
- **StoryThread** — Narrative-owned first-class aggregate: the player-facing arc of a story (e.g. an injury or transfer saga); Narrative owns thread **origination** ([[09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]]).
- **CoverageThread** — Media Ecology's renamed aggregate: the outlet-side coverage arc (how outlets escalate/cool coverage of a story) ([[09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]]).
- **`storyThreadId` (correlation key)** — The shared identifier linking a `StoryThread` and its `CoverageThread`; a correlation key **only** — never a shared aggregate ([[09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]]).
- **Double-entry / balanced posting** — Each ledger posting consists of balanced legs (debit + credit) that net to zero; reversals are new offsetting entries (never mutations); money is integer minor units ([[09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]] amending [[09-Decisions/ADR-0050-club-economy-accounting-ledger]]).
- **Accounting-identity invariant** — The machine-checkable identity derivable from account types that the Club Management ledger must always satisfy; Club Management is the sole finance-ledger writer ([[09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]).
- **Hidden-attribute substrate** — The internal OCEAN/persona vector from which football-facing labels are **derived** (never exposed raw); owned by People / Persona & Skills ([[09-Decisions/ADR-0052-people-persona-and-skills-context]]).

## Boundaries & safety rails

- **LLM out of authoritative state** — Narration/dialogue/media emit advisory intents only; they never apply state. A deterministic-template offline narration floor is mandatory ([[09-Decisions/ADR-0030-llm-out-of-authoritative-state]]).
- **Anti-corruption layer (ACL) / Customer-Supplier** — DDD seam translating another context's published facts into the local model; e.g. CommercialPortfolio → Club Management ledger ([[bounded-context-map]], [[09-Decisions/ADR-0050-club-economy-accounting-ledger]]).
- **Audit & Security context** — Owns the security audit log, replay/dedup policy and processed-command state through Command Reception, plus abuse/anomaly detection; it consumes outbox events but does not own the outbox or game-rule validation ([[09-Decisions/ADR-0091-audit-security-context-definition]], [[09-Decisions/ADR-0119-command-reception-dedup-seam]], [[09-Decisions/ADR-0028-postgres-transactional-outbox]]).

## See also

- Project / process glossary: [[../00-Index/Glossary]]
- Bounded contexts + clusters: [[bounded-context-map]]
- Building blocks: [[05-Building-Blocks]]
- Crosscutting concepts: [[08-Crosscutting]]
- Decision log: [[../00-Index/Decision-Log]]
