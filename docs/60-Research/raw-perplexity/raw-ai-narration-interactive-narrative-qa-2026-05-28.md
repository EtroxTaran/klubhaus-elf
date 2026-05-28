---
title: Raw Perplexity - AI Narration Interactive Narrative QA 2026-05-28
status: raw
tags: [research, raw, perplexity, ai, llm, narrative, storylets, qa, games]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
sourceType: perplexity
related:
  - [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../ai-narration-testing-framework-2026-05-28]]
  - [[../narrative-content-pipeline]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
---

# Raw Perplexity - AI Narration Interactive Narrative QA 2026-05-28

## Prompt

Research how games and interactive narrative systems structure dialogue/
narration generation and testing. Focus on storylets/scene templates,
actor/persona cards, relationship state, narrative memory, player-facing
emotional continuity, deterministic fallbacks, and testing for persona drift,
repetition and coherence over seasons. Provide MVP design implications and
sources.

## Raw findings

- Mature interactive narrative practice uses condition-gated storylets/scenes
  rather than free generation. Scenes have preconditions, priority/weight,
  speaker slots, variants and state effects. For FMX, the effect side must
  stay deterministic and intent-driven.
- Actor/persona cards should be structured and compact: stable traits,
  football-domain labels, voice style, goals, fears, relationship stance and
  hard constraints.
- Relationship state and narrative memory are core drivers of emotional
  continuity. Store compact tagged events and summaries, not raw free-text
  memory as the only source.
- Deterministic fallback is mandatory for production games. Runtime LLM can
  only replace display copy after validation; the fallback text must be good
  enough to play without provider access.
- Season-level QA should simulate many weeks/seasons and analyze:
  - storylet frequency and starvation;
  - repeated lines per actor/scene;
  - unresolved promises/conflicts;
  - persona-tone mismatch;
  - relationship changes without narrative explanation;
  - stale memory references.
- Autoplayer/assert-style tests are a known narrative QA pattern: assertions
  such as "this beat cannot happen twice" or "this scene requires prior setup"
  catch broken story arcs.
- LLM-heavy open-ended dialogue remains experimental. MVP should prefer
  symbolic storylets, explicit intents, template fallback and constrained LLM
  phrasing.

## Source links returned / verified

- Failbetter Games on storylets and qualities:
  <https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two>
- Failbetter Games on organizing storylets:
  <https://www.failbettergames.com/news/narrative-snippets-organising-creative-efforts-2>
- Emily Short on storylets:
  <https://emshort.blog/2019/12/03/storylets-play-together/>
- Yarn Spinner dialogue runner and variable storage:
  <https://docs.yarnspinner.dev/components/dialogue-runner>
- Drama Llama storylets framework:
  <https://arxiv.org/abs/2501.09099>
- Sketching a Map of the Storylets Design Space:
  <https://mkremins.github.io/publications/Storylets_SketchingAMap.pdf>

## Handling

This raw note is not authoritative. Promoted conclusions live in
[[../ai-narration-testing-framework-2026-05-28]],
[[../ai-narration-world-and-dialogue-mvp-2026-05-28]] and
[[../../30-Implementation/ai-narration-contract-testing-framework]].

## Related

- [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../ai-narration-testing-framework-2026-05-28]]
- [[../narrative-content-pipeline]]
- [[../../30-Implementation/ai-narration-contract-testing-framework]]
