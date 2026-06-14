---
title: Raw LLM display snapshot source checks
status: raw
tags: [research, raw, source-check, ai, llm, prompt-cache, temporal, event-sourcing, football-manager, fmx-153]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-153
related:
  - [[../llm-prose-replay-determinism-floor-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
---

# Raw LLM display snapshot source checks

## Prompt

Source-check the FMX-153 claims:

1. LLM seed controls are not enough for exact replay.
2. Prompt caches are not durable output history.
3. Replay systems should record/reuse external-call results.
4. Event-sourced systems rebuild state from event history and must guard
   external side effects during replay.
5. Modern football-manager match presentation treats match-day commentary and
   storytelling as presentation, not simulation authority.

## Targeted checks

### OpenAI seed / system fingerprint

Source:
https://cookbook.openai.com/examples/reproducible_outputs_with_the_seed_parameter

Relevant finding: OpenAI describes seed-based consistency as best effort. Even
with the same seed, request parameters and `system_fingerprint`, the cookbook
notes a small chance of differing output. The `system_fingerprint` is a
backend-change indicator, not a durable replay guarantee.

FMX handling: store seed/system fingerprint if a provider exposes them, but do
not treat them as replay authority.

### OpenAI prompt caching

Source:
https://platform.openai.com/docs/guides/prompt-caching

Relevant finding: prompt caching reduces cost and latency for repeated prompt
prefixes. The docs state that final responses are still computed anew and that
caching does not influence output generation. In-memory retention is short and
extended retention is still temporary.

FMX handling: store `cacheKey` / `prompt_cache_key` only as provenance and
dedupe/routing metadata. It cannot replace persisted display snapshots.

### Temporal replay / external work

Source:
https://docs.temporal.io/workflows#event-history

Relevant finding: Temporal describes Event History as the source of truth for a
workflow. During replay, code is re-run against recorded events; external work
such as API calls, database queries, LLM invocations and file I/O belongs in
activities whose result is recorded and reused. Activities are not executed
again during replay.

FMX handling: treat runtime LLM calls as external work. Save the visible result
and replay/reopen that result; never call the provider from replay paths.

### Event sourcing and external side effects

Source:
https://martinfowler.com/eaaDev/EventSourcing.html

Relevant finding: event sourcing stores state changes as a sequence of events
and can rebuild/temporally query state by replaying those events. The article
explicitly flags external systems as a replay complication: replay processing
must not blindly re-send external effects.

FMX handling: keep match and domain replay based on committed events. Narrative
display snapshots are presentation records over those events, not new domain
events and not provider calls during replay.

### Football Manager match-day storytelling

Source:
https://www.footballmanager.com/fm26/features/where-storytelling-evolves-fm26s-match-day-experience

Relevant finding: Football Manager positions match-day experience as
storytelling/presentation around the match, helping the player read the match
and its emotions.

FMX handling: this supports the FMX product framing that commentary and reports
are presentation artifacts. It does not prove exact prose replay by itself; the
exact-snapshot floor is FMX's chosen trust/replay rule.

## Weak or discarded citations

Perplexity returned several general replay/simulation and video sources whose
topic fit but authority was weak for FMX architecture. They were not promoted
as canonical citations. The accepted packet uses primary/vendor/source-check
links above plus the existing vault decisions.
