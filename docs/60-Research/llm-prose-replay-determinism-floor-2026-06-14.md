---
title: LLM Prose Replay Determinism Floor
status: current
tags: [research, ai, llm, narrative, replay, determinism, match-engine, commentary, fmx-153]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-153
related:
  - [[determinism-and-replay]]
  - [[ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
  - [[raw-perplexity/raw-llm-prose-replay-determinism-floor-2026-06-14]]
  - [[raw-perplexity/raw-narrative-replay-game-precedents-2026-06-14]]
  - [[raw-perplexity/raw-llm-display-snapshot-source-checks-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../40-Execution/fmx-153-llm-prose-replay-determinism-decision-queue-2026-06-14]]
---

# LLM Prose Replay Determinism Floor

FMX-153 closes the missing floor for generated prose: when runtime Narrative
renders Template or LLM text and the player can later revisit it through save
reopen, inbox/history, report archives or match replay, which bytes are
canonical?

## Recommendation

Use an **exact persisted display snapshot** for every visible, revisitable
Narrative line.

> Domain truth remains the committed event/read-model facts. Display truth is
> the persisted `NarrativeDisplaySnapshot`. Provider/cache metadata is
> provenance only.

This makes replay simple to reason about: old saves do not silently rewrite
their articles, commentary, board warnings or dialogue transcripts because a
provider, prompt, model, route or validator changed later.

## Research findings

### F1 - LLM calls are external nondeterministic work

Replay systems should not redo external work during replay. Temporal's workflow
model records activity results and reuses them during replay; Martin Fowler's
event-sourcing article warns that external systems are a special replay
hazard. Runtime LLM calls are in the same category for FMX: useful for
presentation, unsafe as replay-time computation.

Sources:

- https://docs.temporal.io/workflows#event-history
- https://martinfowler.com/eaaDev/EventSourcing.html

### F2 - seed, fingerprint and cache metadata are not enough

OpenAI's seed guidance is best effort rather than guaranteed deterministic
generation. Prompt caching reduces latency/cost for prompt prefixes and does
not cache final responses as durable output history. Therefore FMX can store
seed, system fingerprint, prompt ID/version and cache key for provenance, but
must not ask those fields to reproduce player-visible history.

Sources:

- https://cookbook.openai.com/examples/reproducible_outputs_with_the_seed_parameter
- https://platform.openai.com/docs/guides/prompt-caching

### F3 - game archives are player memory

Football-management games use reports, inboxes, match-day presentation and
press/media surfaces to help the player remember a save. If a reopened save
paraphrases old history, the player may lose trust even when the underlying
score, card or transfer fact is unchanged. FMX's existing Narrative ADRs
already separate generated prose from mechanics; FMX-153 adds the storage
floor needed to make the presentation layer stable.

Sources:

- https://www.footballmanager.com/fm26/features/where-storytelling-evolves-fm26s-match-day-experience
- [[determinism-and-replay]]
- [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]

### F4 - match commentary is not match state

ADR-0026 says `MatchFrame` is derived on demand from match event logs and is
never persisted. FMX-153 does not change that. A `CommentaryLine` /
`NarrativeDisplaySnapshot` may reference `matchId`, committed event IDs and
event indices, but it remains Narrative-owned display history. It must not
enter match hashes, event-log authority, frame builders or resim logic.

## Options considered

| Option | Meaning | Assessment |
|---|---|---|
| **A. Exact Snapshot** | Store the exact rendered text plus provenance once it is visible; reopen/replay renders it verbatim. | **Selected.** Best for player trust, audit, tests and offline replay. |
| B. Deterministic regenerate from prompt/model/cache metadata | Store prompt/model/cache fields and ask the provider or local renderer to recreate the same text. | Reject for LLM output; provider determinism and prompt caches are not durable output history. |
| C. Template-only replay | Store only facts/template ID and replay a deterministic template. | Useful as recovery, but loses the exact player-visible LLM line and can rewrite history. |

| Storage home | Meaning | Assessment |
|---|---|---|
| **A. Per-save Narrative log** | Narrative owns `NarrativeDisplaySnapshot` / provenance records in per-save storage and references source facts/events. | **Selected.** Matches ADR-0054 ownership and ADR-0027 per-save persistence. |
| B. Match event log | Store commentary with match events. | Reject; mixes presentation with match authority. |
| C. Save envelope top-level field | Store all prose inside the portable envelope contract. | Reject for MVP; too broad and duplicates per-save domain storage. |

| Match boundary | Meaning | Assessment |
|---|---|---|
| **A. Commentary Artifact** | Commentary is a Narrative presentation artifact over committed match facts. | **Selected.** Keeps ADR-0026 intact and makes replay tests crisp. |
| B. MatchFrame extension | Treat commentary as part of `MatchFrame`. | Reject; `MatchFrame` is ephemeral and non-persisted. |
| C. Match event payload | Treat prose as replay-bearing match event data. | Reject; text must never become simulation authority. |

## Nico decision

On 2026-06-14 Nico selected the recommended FMX-153 packet:

- D1=A: **Exact Snapshot** is the replay/reopen invariant.
- D2=A: **Per-save Narrative log** owns the display snapshots/provenance.
- D3=A: **Commentary Artifact** keeps ticker prose outside `MatchFrame` and
  outside replay-bearing match state.

These decisions are recorded in
[[../40-Execution/fmx-153-llm-prose-replay-determinism-decision-queue-2026-06-14]]
and promoted through accepted
[[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]].

## Resulting invariants

- Every player-visible, revisitable Template or LLM prose item is persisted as
  a `NarrativeDisplaySnapshot` with exact text, locale and provenance.
- Save reopen, inbox/history rendering and match replay render stored snapshots
  verbatim.
- Replay paths must not call a provider and must not depend on prompt cache
  hits.
- `cacheKey`, `promptId`, `promptVersion`, `schemaVersion`, provider/model ID,
  seed/fingerprint, request ID, validation status and fallback reason are
  audit/provenance metadata, not replay authority.
- If a snapshot is missing or corrupt, FMX renders the deterministic fallback
  from committed facts/templates and records an explicit recovery/fallback
  reason. It does not silently replace old text with a new LLM call.
- Any future "regenerate" or editorial-repair feature creates a new
  snapshot/version; it does not mutate the old artifact without a recorded
  supersession.

## Testing implications

The AI narration framework must add a replay/reopen suite:

- provider spy proves no provider call on reopen/replay;
- snapshot equality proves exact text, locale and provenance survive reload;
- match replay proves commentary snapshots do not affect match event log,
  `MatchFrame` generation or replay hash;
- prompt/model/provider version bump proves old snapshots remain unchanged;
- missing/corrupt snapshot fixture proves deterministic fallback and recovery
  provenance;
- migration/export fixture proves per-save Narrative snapshots travel with the
  save data selected by the eventual export contract.

## Related

- [[raw-perplexity/raw-llm-prose-replay-determinism-floor-2026-06-14]]
- [[raw-perplexity/raw-narrative-replay-game-precedents-2026-06-14]]
- [[raw-perplexity/raw-llm-display-snapshot-source-checks-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
- [[../30-Implementation/ai-narration-contract-testing-framework]]
