---
title: Raw Perplexity - AI Narration MVP Research 2026-05-28
status: raw
tags: [research, raw, perplexity, ai, llm, narrative, dialogue, mvp]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
sourceType: perplexity
related:
  - [[../ai-narrative-runtime-integration]]
  - [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
---

# Raw Perplexity - AI Narration MVP Research 2026-05-28

## Prompt

For an offline-ready football manager game MVP in 2026, research best practices
for runtime LLM narrative/dialogue that must not affect authoritative simulation
state. Cover: deterministic facts + LLM prose boundary, intent-based dialogue
instead of free chat, persona/context cards, fallback templates,
validation/evaluation, caching/cost/latency, and long-season memory. Return
actionable design patterns and open risks with URLs.

## Raw findings

- Use a hard "mechanics first, story later" boundary. Authoritative game state
  such as scores, injuries, morale, contracts, transfers, tactics, tables and
  economy results is computed by deterministic systems. The LLM receives a
  read-only structured snapshot and produces non-authoritative prose.
- Treat dialogue as a small intent/action space, not free chat. The game decides
  the available intents for a situation; the player selects an intent; game
  mechanics read the selected intent and actor traits, not generated text.
- Compose prompts from system rules, world card, speaker persona, situation
  facts, relevant memory snippets and allowed intents. Keep cards compact to
  avoid prompt bloat.
- Preserve a complete template fallback for every AI surface. For MVP, the best
  pattern is template-first or template-safe: render the deterministic copy
  immediately and let the LLM add or replace only after validation.
- Validate every generated result before display: schema validity, fact
  consistency, prohibited claims, unsafe content, required mentions and
  repetition checks. On failure, retry once with stricter constraints or fall
  back to template.
- Build evaluation around consistency rate, contradiction rate, fallback rate,
  repeated phrasing, persona drift, player comprehension and long-season memory
  coherence.
- Use response caching by situation signature, actor, scene type, locale and
  prompt/schema version. The research warns that caching reduces cost but can
  create repetition, so rotate validated variants per situation bucket.
- Use two tiers of generation: short-form live or near-live one-liners for key
  scenes, and deferred multi-paragraph generation for match reports, weekly
  summaries and season reviews.
- For long-season memory, store compact narrative memory entries keyed by
  entities and story arcs. Retrieve the few most relevant snippets per scene
  rather than sending full history.
- Open risks: hallucinated qualitative claims, user expectation of free chat,
  content-safety issues around fan/media speech, local-device performance, and
  insufficient domain-specific benchmarks for sports management sims.

## Source links returned

- Riot Games GDC narrative generation talk:
  <https://www.youtube.com/watch?v=Kf0a7q4q2VY>
- Microsoft Research, AI-assisted rich game narratives:
  <https://www.microsoft.com/en-us/research/blog/players-creators-and-ai-collaborate-to-build-and-expand-rich-game-narratives/>
- Player-Driven Emergence in LLM-Driven Game Narrative:
  <https://arxiv.org/pdf/2404.17027>

## Handling

This raw note is not authoritative. Promoted conclusions live in
[[../ai-narration-world-and-dialogue-mvp-2026-05-28]],
[[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]] and
[[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]].

## Related

- [[../ai-narrative-runtime-integration]]
- [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
