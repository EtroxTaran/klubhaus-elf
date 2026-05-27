---
title: ADR-0030 LLM Out Of Authoritative State Boundary
status: draft
tags: [adr, architecture, ai, llm, narrative, determinism, openrouter]
created: 2026-05-27
updated: 2026-05-27
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[../../60-Research/ai-narrative-runtime-integration]]
  - [[../../60-Research/narrative-content-pipeline]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[ADR-0003-match-engine]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
---

# ADR-0030: LLM Out Of Authoritative State Boundary

## Status

draft

> Draft only. This ADR reopens the Runtime-LLM question for MVP evaluation. It
> is not accepted and must not be implemented until Nico explicitly ratifies it.

## Date

2026-05-27

## Context

The current narrative pipeline is deterministic: Markdown/ICU templates,
compiled catalogues, seeded variant selection and build-time LLM assistance
only. New research from 2026-05-27 argues that runtime LLMs could improve
football narrative flavour, press writing, player dialogue and long-save
personal story formation.

The project still has hard constraints:

- deterministic simulation and replay;
- hybrid-online MVP with offline-ready fallback;
- future server-authoritative multiplayer;
- no raw user data, PII, secrets or free-form user prompts sent to LLMs;
- EU AI Act Article 50 transparency review before any Runtime-LLM release;
- all gameplay still sourced from approved GDDRs.

## Options Considered

- **A - Templates only.** Keep all runtime text deterministic and use LLMs only
  at build time for authoring assistance.
- **B - Runtime AI narrative enhancement outside authoritative state.** Allow a
  feature-flagged MVP evaluation for async flavour only. Traits and intents may
  affect mechanics deterministically; generated text is cosmetic.
- **C - Runtime AI participates in decisions.** Allow LLMs to choose opponent
  tactics, transfer willingness, player reactions or other mechanical outputs.

## Proposed Decision

Choose **B** as the only candidate worth evaluating.

Runtime LLM may be evaluated for **non-blocking async narrative flavour** only:

- post-match newspaper snippets;
- injury and event reports;
- weekly summaries;
- transfer negotiation flavour after the deterministic negotiation result is
  already fixed.

Runtime LLM must stay outside authoritative state:

- no LLM in Match, Training, Transfer, Finance, League advancement or
  authoritative command handlers;
- no LLM output consumed by simulation, balance, morale, fan mood, board
  pressure, transfer willingness or injury systems;
- no direct SDK calls outside a future `llm-adapter` boundary;
- no LLM access from match-engine or deterministic replay paths;
- no free-form player chat in MVP.

OpenRouter is the preferred experimental provider path, behind an adapter and
feature flags. The adapter remains provider-agnostic enough to replace routing
later.

## Required Runtime Contract

Any future implementation must expose a narrow enhancement contract:

- `NarrativeEnhancementRequest` contains structured game facts, persona
  summaries, tone, locale and a fallback template ID.
- `NarrativeEnhancementResult` returns text plus provenance:
  `source: 'llm' | 'template'`, `aiGenerated`, `cacheKey`, request ID and model
  metadata.
- The fallback template is always rendered locally before the LLM call is
  awaited, so the UI can degrade immediately.
- The LLM result may replace display copy only after schema validation,
  post-hoc fact checks and content safety checks pass.

## Data Boundary

Prompt payloads must not contain:

- user email, account ID, IP-derived location or support data;
- secrets, tokens or internal database IDs;
- raw user-authored free text;
- real-world player, club or league names;
- unmasked user-chosen manager, club or save names.

Use placeholder tokens such as `{{manager_name}}`, `{{club_name}}` and
`{{player_name_1}}`, then substitute locally after validation.

## Compliance Boundary

Nico's product preference is info/settings-level AI disclosure rather than a
visible label on each generated in-game text. This ADR records that preference
but does **not** conclude it is legally sufficient.

Before Runtime-LLM ships, the release gate must decide:

- exact Article 50 disclosure surface;
- machine-readable provenance metadata;
- provider logging/retention settings;
- user-facing privacy wording;
- audit evidence that every AI-generated output is identifiable internally.

## Rationale

Option B captures the product upside while preserving the architecture. It
supports the desired long-save "my story" effect without letting a probabilistic
model create facts or alter the game. It also keeps the deterministic template
pipeline as the fallback and baseline.

Option A is safest but may leave too much narrative differentiation on the
table. Option C conflicts with deterministic replay, multiplayer fairness,
debuggability and the existing pre-mortem risk model.

## Consequences

Positive:

- Allows a narrow MVP experiment without replacing the template pipeline.
- Keeps OpenRouter experiments reversible through an adapter.
- Preserves deterministic simulation, replay and future multiplayer fairness.
- Creates a clear place for cost caps, schema validation, timeouts and provider
  fallback.

Negative:

- Adds legal and operational gates before release.
- Adds latency/cost/reliability risks even for cosmetic text.
- Requires additional CI rules to keep LLM dependencies out of authoritative
  contexts.
- Requires provenance tracking even if the visible UI uses central disclosure.

## Verification Requirements

- Static architecture check: no LLM SDK/import/http client in match-engine and
  authoritative domain paths.
- Adapter tests for timeout, 429/5xx, malformed JSON, schema violation and
  fallback.
- Fact-check tests: generated text must not introduce facts absent from the
  request.
- Cost-cap tests: feature disables LLM and falls back to templates when budget
  is exceeded.
- Disclosure/provenance tests: every AI-generated result stores
  `aiGenerated: true` and model metadata.
- Docs gate: legal/compliance review recorded before status can move to
  `accepted`.

## Supersedes

None

## Related Docs

- [[../../60-Research/ai-narrative-runtime-integration]]
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../../60-Research/pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
- [[ADR-0003-match-engine]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[ADR-0020-hybrid-online-mvp-offline-ready]]
