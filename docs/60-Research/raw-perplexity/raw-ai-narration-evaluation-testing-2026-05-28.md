---
title: Raw Perplexity - AI Narration Evaluation and Testing 2026-05-28
status: raw
tags: [research, raw, perplexity, ai, llm, narrative, testing, evaluation]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
sourceType: perplexity
related:
  - [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../ai-narration-testing-framework-2026-05-28]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
---

# Raw Perplexity - AI Narration Evaluation and Testing 2026-05-28

## Prompt

Research best practices for testing and evaluating LLM-generated
narrative/dialogue in an application where generated prose must be grounded in
authoritative facts and must never mutate authoritative state. Focus on
MVP-ready evaluation frameworks: golden/eval corpora, structured output/schema
validation, factual consistency checks, human review, regression testing,
cost/latency telemetry, and CI tiering. Include authoritative/current sources
and practical recommendations for a TypeScript app with Vitest/Zod/fast-check/
Playwright available.

## Raw findings

- Treat LLM narration like a test pyramid: schema and deterministic validators
  at the base, scenario/eval corpus in the middle, human review and playtest
  quality gates at the top.
- Narrative outputs should be behavior-tested, not string-snapshot-tested. Use
  reference examples as hints, but assert invariants: valid schema, allowed
  actor/fact IDs, empty state-change proposals, banned claims absent, length and
  tone bands.
- Store eval cases as structured fixtures: authoritative state snapshot,
  scene type, actor cards, allowed intents, forbidden claims, fallback template
  ID, expected invariants and optional quality rubric.
- Use strict schema validation at the provider boundary. Zod 4 can define
  runtime schemas, infer TypeScript types, use `z.strictObject()` for strict
  object contracts and export JSON Schema for provider structured output.
- Factual consistency should be checked deterministically against the
  authoritative state, not by parsing prose back into game commands.
- Human review remains necessary for coherence, emotion, character voice,
  repetition and whether a save feels personal.
- Use regression tiers:
  - PR: no live provider required; schema, fallback, validator, mocked adapter,
    and a small golden corpus.
  - Nightly: broader eval corpus, property tests, red-team prompts, season
    simulations and cost/latency reporting.
  - Release: legal/compliance checklist, provider/model regression, long-save
    playtest review and manual failure triage.
- Track telemetry for every runtime/eval call: model, prompt/schema version,
  tokens, latency, estimated cost, validation status and fallback reason.
- fast-check is a good fit for generating many valid context-card combinations
  and shrinking rare failures to minimal counterexamples.
- Vitest projects can separate Node contract tests, browser/component tests and
  sequential/expensive suites. Browser mode with Playwright is suitable once
  UI returns.

## Source links returned / verified

- OpenAI evaluation best practices:
  <https://platform.openai.com/docs/guides/evaluation-best-practices>
- OpenAI Evals:
  <https://github.com/openai/evals>
- Vitest browser mode:
  <https://vitest.dev/guide/browser/>
- Vitest 4 release notes:
  <https://vitest.dev/blog/vitest-4>
- Zod 4 documentation:
  <https://zod.dev/v4>
- Zod JSON Schema:
  <https://zod.dev/json-schema>
- fast-check Vitest ecosystem:
  <https://fast-check.dev/docs/ecosystem>

## Handling

This raw note is not authoritative. Promoted conclusions live in
[[../ai-narration-testing-framework-2026-05-28]] and
[[../../30-Implementation/ai-narration-contract-testing-framework]].

## Related

- [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../ai-narration-testing-framework-2026-05-28]]
- [[../../30-Implementation/ai-narration-contract-testing-framework]]
- [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
