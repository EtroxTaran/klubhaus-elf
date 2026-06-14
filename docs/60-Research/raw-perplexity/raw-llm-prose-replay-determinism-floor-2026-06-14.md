---
title: Raw LLM prose replay determinism floor
status: raw
tags: [research, raw, perplexity, source-check, ai, llm, narrative, replay, determinism, fmx-153]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-153
related:
  - [[../llm-prose-replay-determinism-floor-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
---

# Raw LLM prose replay determinism floor

## Prompt

Research best practices for deterministic replay/reopen behavior when a game or
application uses runtime LLMs for cosmetic prose. Compare:

1. storing exact generated text/display snapshots;
2. storing prompt/model/cache metadata and regenerating;
3. template fallback replay;
4. contract tests for replay/reopen behavior.

Focus on event-sourced systems, agent/LLM determinism, production replay
debugging and game replay expectations.

## Perplexity capture

Perplexity recommended a hybrid with one hard canonical rule:

- **A. Generate once, persist verbatim for replay/reopen.** Treat the LLM call
  as a nondeterministic external side effect. Once text is visible to the
  player, persist a display snapshot and replay/reopen that exact string.
- **B. Cache/regeneration metadata only as support, not authority.** Store
  prompt ID, prompt version, model/provider, seed if any, system fingerprint,
  request/cache key, validation result and fallback reason for audit,
  debugging and future evaluation. Do not rely on these fields to reproduce the
  same prose.
- **C. Deterministic template fallback remains required.** If no stored
  snapshot exists, render the deterministic fallback from committed facts,
  template ID/version and locale, then mark the line as recovery/fallback.

The reasoning was consistent across the result:

- LLM outputs are not deterministic enough for authoritative replay even when
  a provider exposes seed-like controls.
- A replay path must not call a live provider. Provider calls during replay can
  produce different output, fail due network/budget, or leak replay-only
  traffic into telemetry/cost.
- Persisted display text separates "what the player saw" from "what the engine
  knows". Domain facts still come from committed events/read models; prose is a
  presentation artifact.
- Prompt caches improve latency/cost and possibly routing behavior, but are
  not durable output history.
- Contract tests should assert no provider call on reopen/replay, exact
  snapshot equality, provenance presence, fallback behavior for missing
  snapshots and isolation from match/state hashes.

## Source list returned by Perplexity

Perplexity pointed at these supporting sources and categories:

- Temporal/event-history style replay: activity/external-call results are
  recorded and reused on replay rather than recomputed.
- Event sourcing: event logs rebuild state; external side effects must be
  handled through gateways or recorded results.
- LLM production tracing/reproducibility: record prompts, model metadata,
  request IDs and traces for debugging, but do not promise bit-identical model
  regeneration.
- OpenAI seed/system-fingerprint guidance: deterministic sampling is best
  effort, not guaranteed.
- OpenAI prompt caching guidance: caches reduce latency/cost for repeated
  prefixes and do not cache final responses.

## Targeted source checks added

- OpenAI cookbook: `seed` is best effort, determinism is not guaranteed and
  `system_fingerprint` helps identify backend changes:
  https://cookbook.openai.com/examples/reproducible_outputs_with_the_seed_parameter
- OpenAI prompt caching docs: prompt caching stores/reuses prompt prefixes for
  cost/latency; the final response is computed anew:
  https://platform.openai.com/docs/guides/prompt-caching
- Temporal workflow docs: Event History is the source of truth; external work
  such as API calls, database queries, LLM invocations and file I/O belongs in
  activities whose results are recorded and reused during replay:
  https://docs.temporal.io/workflows#event-history
- Martin Fowler, Event Sourcing: application-state changes are stored as a
  sequence of events and can be replayed/rebuilt; external systems need replay
  handling:
  https://martinfowler.com/eaaDev/EventSourcing.html

## FMX inference

For FMX, generated prose is not domain truth, but it is player-visible history.
The replay floor should therefore be:

1. domain truth = committed facts/events/read models;
2. display truth = persisted `NarrativeDisplaySnapshot`;
3. generation provenance = audit/debug metadata;
4. fallback templates = resilience when a snapshot is absent or invalid.

The LLM cache key is useful as provenance and dedupe input. It is not a replay
authority and must not trigger a provider call during match replay or save
reopen.

## Claim confidence

| Claim | Confidence | Handling in FMX-153 |
|---|---|---|
| Replaying an external nondeterministic call should reuse a recorded result, not call the external system again. | High | Binding ADR rule. |
| LLM seed/provider metadata is not sufficient for exact future prose replay. | High | Binding ADR rule; keep metadata as provenance only. |
| Prompt caching is not output history. | High | Binding ADR rule; cache key cannot be replay authority. |
| Template fallback must exist for every runtime prose point. | High | Carries ADR-0030/0054/FMX-88 forward. |
| Exact snapshot storage is the right product floor for player-visible history. | Medium-high | FMX product decision selected by Nico for FMX-153. |
