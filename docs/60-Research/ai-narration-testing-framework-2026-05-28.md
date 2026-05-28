---
title: AI Narration Testing and Framework Synthesis 2026-05-28
status: current
tags: [research, ai, llm, narrative, testing, evaluation, security, storylets, mvp]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-3
sourceType: synthesis
related:
  - [[ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[raw-perplexity/raw-ai-narration-evaluation-testing-2026-05-28]]
  - [[raw-perplexity/raw-ai-narration-security-testing-2026-05-28]]
  - [[raw-perplexity/raw-ai-narration-interactive-narrative-qa-2026-05-28]]
  - [[narrative-content-pipeline]]
  - [[determinism-and-replay]]
  - [[pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
  - [[pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
---

# AI Narration Testing and Framework Synthesis 2026-05-28

## Question

What additional structure does FMX need so AI narration can be an MVP emotional
pillar and still be testable, safe, deterministic and playtestable?

## Summary

The previous FMX-3 beat defined the ambition: Full Dialogue, All Active actor
context and LLM prose outside authoritative state. The missing piece was the
framework that makes that ambition buildable. This synthesis adds the testing
and domain structure: a proposed **Narrative bounded context**, contract-first
context cards, deterministic storylet/template fallback, eval corpus tiers,
security/privacy tests and a **Playtest First** quality loop.

Playtest First means the early quality target is emotional believability, not a
premature numeric threshold. It does **not** remove hard gates for state
boundary, fallback, safety, disclosure or provider failure. Runtime LLM may be
experimented with in dev/playtest environments before final quantitative
thresholds are frozen, but production runtime LLM remains blocked until the
contract and safety gates pass.

## Research conclusion

- Mature narrative systems use **storylets/scenes with conditions and
  fallbacks**, not free-form generation as the primary structure.
- LLM narration should be evaluated through **structured contracts and
  invariants**, not exact string snapshots.
- Long-save narrative quality needs **simulation and playtest loops** because
  persona drift, stale memory and repetition appear over weeks or seasons, not
  in a single call.
- Security testing must treat prompt content and output as untrusted. OWASP,
  NIST and EU AI Act guidance all point to the same MVP controls: minimization,
  provenance, disclosure, fallback, monitoring and incident/kill-switch paths.
- The existing intended stack is sufficient for MVP framework planning:
  Zod 4 for contracts/JSON Schema, Vitest projects for test tiers, fast-check
  for generated context-card invariants and Playwright for later UI disclosure
  and fallback flows.

## Proposed framework

The proposed architecture has three layers:

1. **Authoritative domains** create facts and deterministic effects.
2. **Narrative context** assembles facts, actors, memory and allowed intents
   into `NarrativeContextCard` plus fallback template references.
3. **Presentation enhancement** optionally calls an LLM adapter, validates the
   result and displays either validated copy or the deterministic fallback.

The core loop:

```text
Domain facts -> NarrativeScene -> NarrativeContextCard
             -> fallback template rendered
             -> optional LLM enhancement
             -> schema/fact/safety/persona/repetition validation
             -> display snapshot with provenance
```

Generated text never flows back into commands, facts, relationship deltas,
morale, fan mood, finances, transfer willingness, match events or replay.

## Test pyramid

| Layer | Purpose | MVP examples |
|---|---|---|
| Contract | The wire shape is stable and strict | `NarrativeContextCard`, `NarrativeEnhancementResult`, provenance |
| Determinism | Same seed/facts produce same context and fallback | world/persona actors, storylet choice, fallback copy |
| Fact grounding | Text cannot invent or contradict facts | score, scorers, injuries, contracts, promises, sanctions, finances |
| Dialogue intent | Mechanics depend on selected intent only | player talk, board response, fan-rep scene |
| Safety/privacy | Prompt/output cannot leak or amplify unsafe content | PII minimization, prompt injection, unsafe fan/media speech |
| Resilience | Provider failure stays playable | timeout, 429/5xx, malformed JSON, over budget, kill switch |
| Season simulation | Long-save continuity stays coherent | persona drift, repetition, stale memory, unresolved arcs |
| Playtest | Emotional quality and world believability | "felt like my save", recurring voices, confusion, boredom |

## Eval corpus shape

Each eval case should be structured and replayable:

```text
NarrativeEvalCase
  id
  sceneType
  worldSeedRef
  authoritativeFacts
  actorCards
  relationshipEdges
  memorySnippets
  allowedIntents
  forbiddenClaims
  fallbackTemplateId
  promptVariantId
  expectedInvariants
  playtestRubricTags
```

The first corpus should cover the MVP surfaces:

- player one-to-one: playtime, role, contract mood, broken promise;
- staff: advice, disagreement, scouting/training/medical warning;
- board: expectation, warning, patience, budget pressure;
- press: recurring journalist question, hostile angle, supportive local angle;
- fan-rep: ticket/tradition concern, praise, protest, derby reaction;
- agent: client pressure, rumor, negotiation flavour after fixed state;
- match report/ticker: goal, card, injury, substitution, full-time;
- weekly summary: memory, relationship highlights and unresolved risks.

## Playtest First quality loop

Playtest First is the draft MVP quality posture selected by Nico for this
domain. The loop is:

1. Ship the full template/context framework before relying on live LLM.
2. Use dev/playtest LLM runs to generate candidate outputs across the eval
   corpus.
3. Review sampled outputs with a human rubric:
   - grounded in facts;
   - emotionally specific;
   - actor voice consistent;
   - not repetitive;
   - memory reference useful;
   - disclosure understandable;
   - no unsafe or privacy issue.
4. Convert every material failure into:
   - a new eval case;
   - a stricter validator;
   - a template variant;
   - a persona/scene rule update;
   - or a provider/model gate.
5. Only after enough examples exist, freeze quantitative release thresholds for
   contradiction rate, fallback rate, safety rejection, repetition and persona
   drift.

## Remaining research needed

- Concrete actor-count ranges by world size for outlets, journalists, fan
  groups, fan reps and agents.
- First `DialogueIntent` taxonomy and deterministic effect matrix per surface.
- Persona drift heuristics: which tone/persona mismatches are acceptable under
  stress, and when they are bugs.
- Provider/model short list with exact IDs, ZDR/data-collection support,
  pricing and latency once implementation starts.
- Legal review of first-exposure plus central-disclosure UX under Article 50,
  especially for any exported/shared generated text.

## Source links

- OWASP Top 10 for LLM Applications:
  <https://owasp.org/www-project-top-10-for-large-language-model-applications/>
- NIST AI Risk Management Framework:
  <https://www.nist.gov/itl/ai-risk-management-framework>
- EU AI Act Article 50:
  <https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50>
- OpenAI evaluation best practices:
  <https://platform.openai.com/docs/guides/evaluation-best-practices>
- Vitest browser mode:
  <https://vitest.dev/guide/browser/>
- Zod 4:
  <https://zod.dev/v4>
- fast-check:
  <https://fast-check.dev/docs/ecosystem>
- Failbetter storylet model:
  <https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two>
- Emily Short on storylets:
  <https://emshort.blog/2019/12/03/storylets-play-together/>

## Promotion path

1. Add draft [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
   for the Narrative bounded context and framework ownership.
2. Add [[../30-Implementation/ai-narration-contract-testing-framework]] as the
   MVP implementation/testing plan.
3. Amend [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
   so LLM boundaries point to the Narrative context.
4. Amend [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]] and
   [[../20-Features/feature-ai-narration-mvp-pillar]] with Playtest First.
5. Keep all implementation gated until Nico ratifies the relevant draft ADRs
   and GDDRs.

## Related

- [[ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[narrative-content-pipeline]]
- [[determinism-and-replay]]
- [[pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
- [[pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
- [[../20-Features/feature-ai-narration-mvp-pillar]]
- [[../30-Implementation/ai-narration-contract-testing-framework]]
- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
