---
title: ADR-0030 LLM Out Of Authoritative State Boundary
status: accepted
tags: [adr, architecture, ai, llm, narrative, determinism, openrouter, accepted]
context: narrative-dialogue
created: 2026-05-27
updated: 2026-06-19
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[../../60-Research/ai-narrative-runtime-integration]]
  - [[../../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../../60-Research/ai-narration-testing-framework-2026-05-28]]
  - [[../../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
  - [[../../60-Research/raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]]
  - [[../../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
  - [[../../60-Research/narrative-content-pipeline]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/llm-prose-replay-determinism-floor-2026-06-14]]
  - [[../../60-Research/llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-llm-prompt-injection-defensive-contract-source-checks-2026-06-16]]
  - [[../../60-Research/pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
  - [[ADR-0003-match-engine]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
---

# ADR-0030: LLM Out Of Authoritative State Boundary

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> Draft only. This ADR reopens the Runtime-LLM question for MVP evaluation and
> records the 2026-05-28 Full Dialogue direction. It is not accepted and must
> not be implemented until Nico explicitly ratifies it.

## Date

2026-05-27

## Context

The current narrative pipeline is deterministic: Markdown/ICU templates,
compiled catalogues, seeded variant selection and build-time LLM assistance
only. Research from 2026-05-27 and 2026-05-28 argues that runtime LLMs could
improve football narrative flavour, press writing, player dialogue and
long-save personal story formation. Nico now wants the MVP narration domain to
be ready for **Full Dialogue** and **All Active** actor classes, because this
layer creates the world and emotion of the save.

The project still has hard constraints:

- deterministic simulation and replay;
- hybrid-online MVP with offline-ready fallback;
- future server-authoritative multiplayer;
- no raw user data, PII, secrets or free-form user prompts sent to LLMs;
- EU AI Act Article 50 transparency review before any Runtime-LLM release;
- all gameplay still sourced from approved GDDRs.

## Options Considered

- **A - Templates only.** Keep all runtime text deterministic and use LLMs only
  at build time for authoring assistance. Lowest operational/legal risk, but it
  does not satisfy Nico's MVP emotion/world goal.
- **B - Async runtime flavour outside authoritative state.** Allow
  feature-flagged LLM enhancement for ticker, reports and summaries only.
  Safer than dialogue, but still leaves player/staff/board/media/fan emotional
  loops out of the first playable.
- **C - Full Dialogue runtime narration outside authoritative state.** Add a
  non-authoritative Narrative Orchestrator for controlled dialogue and async
  flavour. Traits and intents may affect mechanics deterministically; generated
  text is cosmetic.
- **D - Runtime AI participates in decisions.** Allow LLMs to choose opponent
  tactics, transfer willingness, player reactions or other mechanical outputs.

## Proposed Decision

Choose **C** as the proposed MVP direction.

Runtime LLM may be evaluated for **non-blocking Full Dialogue and async
narrative flavour**:

- key-event match ticker wording after the match event is committed;
- post-match newspaper snippets;
- injury and event reports;
- weekly summaries;
- transfer negotiation flavour after the deterministic negotiation result is
  already fixed.
- player one-to-one dialogue through explicit `DialogueIntent` choices;
- staff advice/disagreement scenes;
- board expectation, warning and pressure scenes;
- press/journalist questions through recurring generated media actors;
- fan-rep scenes for named fan groups over deterministic Fan Ecology facts;
- agent/transfer flavour after the owning Transfer/Contracts state is fixed.

Runtime LLM must stay outside authoritative state:

- no LLM in Match, Training, Transfer, Finance, League advancement or
  authoritative command handlers;
- no LLM output consumed by simulation, balance, morale, fan mood, board
  pressure, transfer willingness or injury systems;
- no direct SDK calls outside a future `llm-adapter` boundary;
- no LLM access from match-engine or deterministic replay paths;
- no free-form player chat in MVP;
- no generated text parsed back into domain commands, relationship deltas or
  event facts.

OpenRouter is the preferred experimental provider path, behind an adapter and
feature flags. The adapter remains provider-agnostic enough to replace routing
later.

### FMX-88 MVP runtime scope freeze

FMX-88 freezes the MVP surface line for the Runtime-LLM evaluation. Nico chose
**Broad Full Dialogue** on 2026-06-04: optional LLM prose enhancement may cover
all active narrative dialogue/prose surfaces from GD-0018, but only after
deterministic facts, intents, options, effects, fallback templates and
provenance exist.

LLM-eligible prose surfaces:

- player one-to-one, staff advice/disagreement, board scenes,
  press/journalist questions, fan-rep scenes and agent/transfer flavour;
- post-match newspaper/report, injury/event report, weekly summary and selected
  match ticker key-event wording;
- actor voice/tone for players, staff, board contacts, media actors, fan reps
  and agents.

Template-only / deterministic surfaces:

- tactics commands, match simulation, transfer valuation/acceptance, finance,
  training, injuries, morale deltas, registrations, scheduling, rules,
  save/replay/audit logs and any other authoritative state transition;
- UI labels, controls, tutorial/onboarding instructions, legal/privacy copy and
  player-choice labels whose wording carries mechanical meaning.

The LLM may phrase a scene; it may not produce the scene's facts, selectable
options, effect IDs, policy keys, command payloads, numeric values or domain
events. Dialogue mechanics consume only the selected `DialogueIntent` and
deterministic policies.

No generated-text export/share ships in the MVP. Any future export, social
share, public posting or editorial use of generated text requires a separate
policy and legal review.

### Narrative Orchestrator boundary

The proposed MVP boundary is a non-authoritative **Narrative Orchestrator**. It
may:

- select eligible narrative scenes and speakers;
- build `NarrativeContextCard` from domain read models and People context;
- render deterministic fallback templates;
- call an LLM provider adapter when enabled, online and under budget;
- validate schema, facts, safety, repetition and persona consistency;
- store display snapshots with provenance.

It must not:

- own match, player, transfer, finance, board, fan or relationship truth;
- call authoritative command handlers based on generated text;
- run inside match-engine or deterministic replay paths;
- become required for day/week advancement, match resolution or finance
  mutation.

ADR-0054 proposes that this orchestrator lives inside a dedicated
**Narrative** bounded context. ADR-0030 owns the LLM/state boundary; ADR-0054
owns the context/module ownership split, contracts and test-framework
structure.

### Match ticker special case

The FMX-10 match-engine re-evaluation adds a narrow runtime LLM candidate for
live ticker flavour. This is allowed only as display wording over committed
events:

- input is `CommentaryInput` built from `MatchEventLog` key events, selected
  `SpatialSample` context, locale, tone and fallback template ID;
- eligible events are goals, big chances, cards, injuries, substitutions,
  halftime and full-time;
- routine passes, duels and possession changes stay template-based by default;
- output is `CommentaryLine` with `source: 'llm' | 'template'`, provenance,
  model metadata, cache key and validation status;
- the engine never awaits, imports or calls the LLM layer;
- if OpenRouter times out, errors, exceeds budget or fails validation, the
  template line is used.

Runtime flag posture for MVP evaluation: feature-flagged, monitored and
kill-switchable. The default-on/default-off rollout choice remains a Nico
release decision after legal, safety and cost evidence exists.

### FMX-153 replay/reopen determinism floor

FMX-153 adds a binding floor through
[[ADR-0117-narrative-display-snapshot-replay-determinism-floor]]: runtime LLM
output is still non-authoritative, but once Template or LLM prose is visible
and revisitable it becomes durable display history.

The replay/reopen rules are:

- Narrative persists the exact rendered text as a
  `NarrativeDisplaySnapshot` with provenance.
- Save reopen, inbox/history rendering and match replay render the stored text
  verbatim.
- Replay paths never call the provider and never rely on prompt-cache hits.
- `cacheKey`, prompt/model/provider metadata, seed/fingerprint, request ID,
  validation status and fallback reason are provenance only, not replay
  authority.
- If a snapshot is missing/corrupt, FMX renders the deterministic fallback from
  committed facts/templates with explicit recovery provenance. It does not
  silently regenerate old LLM prose.

For match ticker prose, `CommentaryLine` remains a Narrative presentation
artifact over committed `MatchEventLog` facts. It is not `MatchFrame`, not match
event authority and not replay-bearing match state.

## Required Runtime Contract

Any future implementation must expose a narrow enhancement contract:

- `NarrativeContextCard` contains scene type, structured game facts, actor
  persona cards, relevant relationship edges, narrative memory snippets,
  allowed intents, forbidden claims, tone, locale, cache signature and a
  fallback template ID.
- `NarrativeEnhancementRequest` contains one context card plus provider budget,
  schema version and safety-policy ID.
- `NarrativeEnhancementResult` returns text plus provenance:
  `source: 'llm' | 'template'`, `aiGenerated`, `cacheKey`, request ID,
  model/provider metadata, validation status and fallback reason.
- `NarrativeDisplaySnapshot` stores the exact visible text plus provenance for
  every revisitable prose surface, including replay-visible commentary.
- The fallback template is always rendered locally before the LLM call is
  awaited, so the UI can degrade immediately.
- The LLM result may replace display copy only after schema validation,
  post-hoc fact checks and content safety checks pass.
- Dialogue mechanics consume only the selected `DialogueIntent` and deterministic
  policies; they never consume generated prose.

FMX-88 adds a mandatory `FallbackCoverageManifest` planning contract. Every
`NarrativeSceneType` / prose point must declare a `fallbackTemplateId`, fixtures,
LLM eligibility, forbidden claims, provenance schema version and tests. The
LLM-disabled path must render every fixture without provider access before any
runtime LLM release.

### FMX-87 dialogue-intent contract

FMX-87 adds the draft rule that controlled dialogue mechanics start from
finite, player-selected `DialogueIntent` options and never from generated prose.
Nico selected broad MVP coverage across player one-to-one, staff, board,
press/media, fan-rep and agent surfaces on 2026-06-05.

The architecture consequence is:

- Narrative may assemble and render scenes, option labels, fallback copy,
  optional LLM prose and provenance.
- Narrative may emit draft planning events such as `DialogueIntentSelected`,
  `DialogueIntentRejected` and `DialogueEffectResult`, but only as contracts
  around already selected finite options.
- The owning gameplay context applies the effect: People/Squad for
  morale/trust/relationship, Club Management/Board for confidence and mandate
  pressure, Audience & Atmosphere for supporter mood/reputation and
  Transfer/Contracts for agent/client posture.
- Mechanical values are expressed as policy IDs and effect bands at this layer.
  Exact numeric tuning is deferred to the owning domain balance issue, not
  embedded in Narrative or LLM prompts.
- Persona and stress may gate eligibility and scale a band within bounded
  policy rules; they never let generated text choose a new mechanic.

## Data Boundary

Prompt payloads must not contain:

- user email, account ID, IP-derived location or support data;
- secrets, tokens or internal database IDs;
- raw user-authored free text;
- real-world player, club or league names;
- unmasked user-chosen manager, club or save names.

Use placeholder tokens such as `{{manager_name}}`, `{{club_name}}` and
`{{player_name_1}}`, then substitute locally after validation.

### FMX-188 untrusted UGC prompt-injection boundary (accepted)

FMX-188 adds an accepted defensive contract for any future path where
community-pack / UGC text can influence runtime LLM prose. It does not make UGC
trusted and does not authorize a runtime release. The accepted contract is:

- Treat all community-pack text as untrusted data, including pack
  descriptions, club lore, fan-group copy, chants, media copy, slogans and
  imported names.
- Community Overlay classifies pack text before Narrative can reference it.
  Only `community_sanitized` text refs with `llmEligible: true` may enter a
  runtime LLM prompt; ambiguous, stale, unavailable or rejected trust verdicts
  force deterministic fallback.
- Narrative builds a structured prompt envelope with separate trusted facts,
  forbidden claims, escaped untrusted text refs, task metadata and fallback
  template ID. Raw UGC is never string-interpolated into a free-form prompt.
- Untrusted text is flavor-only. Scores, injuries, money, standings, transfers,
  board pressure, morale, relationship values, policy keys and all other
  factual/mechanical claims come only from authoritative fact refs.
- Provider output must satisfy a strict local schema before display. Unknown
  keys, command-shaped fields, tool-call-like fields, overlong text, markup /
  script payloads, prompt-leakage attempts, fact contradictions or unsafe
  content fail closed.
- Provider-side structured output may be used where supported, but local Zod 4
  strict validation remains mandatory.
- The provider adapter has no tools, no command handlers, no domain write
  access and no direct Community Overlay trust-decision authority.
- Any prompt-injection, text-trust, schema, fact, safety, provider, cost or
  timeout failure leaves the already-rendered deterministic fallback in place.

Recommended Nico decision packet:
[[../../40-Execution/fmx-188-prompt-injection-defensive-contract-decision-queue-2026-06-16]].

## Compliance Boundary

Nico's product preference is first-exposure AI disclosure plus a central
info/settings surface rather than a visible label on each generated in-game
text. This ADR records that preference but does **not** conclude it is legally
sufficient.

Before Runtime-LLM ships, the release gate must decide:

- exact Article 50 disclosure surface;
- machine-readable provenance metadata;
- provider logging/retention settings;
- user-facing privacy wording;
- audit evidence that every AI-generated output is identifiable internally.
- export/share policy if any AI-generated text leaves the game client.

FMX-88 names this the **Article 50 Runtime-LLM Release Gate**. It is closed only
by Nico plus an external legal/compliance reviewer, with an artifact covering
feature scope, jurisdictions, first-exposure disclosure copy, persistent
settings/help copy, accessibility review, provider marking/provenance evidence,
privacy/data minimization, export/share policy and owner sign-off. The issue
defines the gate; it does not perform the legal review.

## Provider Boundary

OpenRouter is the draft experimental path. Before implementation:

- model IDs are pinned explicitly; no floating `latest`;
- structured outputs use JSON Schema strict mode where the selected model
  supports it;
- provider routing denies data collection where feasible;
- ZDR routing is preferred and any provider/model without it requires a Nico
  option review;
- usage, cost and limit telemetry are collected per surface and per save;
- model fallback is configured only across approved model IDs;
- provider/model changes run the narrative regression corpus before rollout.

## Rationale

Option C captures Nico's current product goal while preserving the architecture.
It supports the desired long-save "my story" effect across players, staff,
board, media and fans without letting a probabilistic model create facts or
alter the game. It also keeps the deterministic template pipeline as the
fallback and baseline.

Option A is safest but leaves too much narrative differentiation on the table.
Option B is a useful fallback if legal/provider risk becomes too high, but it
does not meet the revised MVP target. Option D conflicts with deterministic
replay, multiplayer fairness, debuggability and the existing pre-mortem risk
model.

## Consequences

Positive:

- Allows an MVP narration pillar without replacing the template pipeline.
- Keeps OpenRouter experiments reversible through an adapter.
- Preserves deterministic simulation, replay and future multiplayer fairness.
- Creates a clear place for cost caps, schema validation, timeouts and provider
  fallback.
- Gives People/persona context a concrete consumer from the first playable.

Negative:

- Adds legal and operational gates before release.
- Adds latency/cost/reliability risks even for cosmetic text.
- Requires additional CI rules to keep LLM dependencies out of authoritative
  contexts.
- Requires provenance tracking even if the visible UI uses central disclosure.
- Requires a larger evaluation corpus because dialogue spans multiple actor
  classes and season-long memory.

## Verification Requirements

- Static architecture check: no LLM SDK/import/http client in match-engine and
  authoritative domain paths.
- Adapter tests for timeout, 429/5xx, malformed JSON, schema violation and
  fallback.
- Fact-check tests: generated text must not introduce facts absent from the
  request.
- Dialogue determinism tests: selected intent and authoritative facts produce
  the same mechanical result regardless of generated wording.
- Dialogue effect-owner tests: each selectable intent has exactly one owning
  context for the mechanical effect, and Narrative cannot apply or tune that
  effect directly.
- Cost-cap tests: feature disables LLM and falls back to templates when budget
  is exceeded.
- Match-ticker tests: key-event inputs cannot introduce facts absent from the
  committed `MatchEventLog`.
- Replay/reopen tests: revisitable Template/LLM lines are rendered from
  persisted `NarrativeDisplaySnapshot` text; provider calls and prompt-cache
  lookups are forbidden in replay paths.
- Persona-consistency tests across a simulated season for players, staff, board,
  journalists and fan reps.
- Prompt-injection tests through generated names, club names, fan-group names
  and media text.
- FMX-188 UGC prompt-injection tests, if ratified: malicious pack text fixtures
  cover direct override attempts, indirect injection in lore / articles /
  chants, delimiter escape attempts, role-label spoofing, prompt-leakage
  requests, command-shaped JSON fields and obfuscated variants. Passing means
  generated prose never changes authoritative state, never survives strict
  validation with unsafe/extra fields, falls back deterministically on every
  violation and never triggers a provider call on replay/reopen.
- Monitoring from day one: calls, input/output tokens, estimated cost, latency,
  provider errors, fallback rate, safety rejections and per-match budget
  exhaustion.
- Disclosure/provenance tests: every AI-generated result stores
  `aiGenerated: true` and model metadata.
- Fallback manifest tests: every `NarrativeSceneType` and prose point has a
  deterministic fallback fixture and provenance assertion; `LLM_MODE=disabled`
  renders all fixtures.
- No-export tests/policy gate: generated text cannot leave the game client in
  MVP paths unless a later export/share policy and legal review are ratified.
- Docs gate: legal/compliance review recorded before status can move to
  `accepted`.
- Framework gate: [[../../30-Implementation/ai-narration-contract-testing-framework]]
  covers contract, fallback, safety, eval and Playtest First evidence before
  runtime LLM is enabled outside dev/playtest environments.

## Supersedes

None

## Related Docs

- [[../../60-Research/ai-narrative-runtime-integration]]
- [[../../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../../60-Research/ai-narration-testing-framework-2026-05-28]]
- [[../../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
- [[../../60-Research/llm-prose-replay-determinism-floor-2026-06-14]]
- [[../../60-Research/llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
- [[../../20-Features/feature-ai-narration-mvp-pillar]]
- [[../../30-Implementation/ai-narration-contract-testing-framework]]
- [[../../60-Research/pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
- [[ADR-0003-match-engine]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[ADR-0020-hybrid-online-mvp-offline-ready]]
- [[ADR-0052-people-persona-and-skills-context]]
- [[ADR-0054-narrative-context-and-ai-narration-framework]]
- [[ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
