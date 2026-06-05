---
title: AI Narration Contract Testing Framework
status: draft
tags: [implementation, testing, ai, llm, narrative, contracts, mvp, fmx-3]
created: 2026-05-28
updated: 2026-06-05
type: implementation
binding: false
linear: FMX-3
related:
  - [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../60-Research/ai-narration-testing-framework-2026-05-28]]
  - [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
  - [[../60-Research/raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]]
  - [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../60-Research/raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../60-Research/raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[mvp-implementation-roadmap]]
---

# AI Narration Contract Testing Framework

## Status

draft

This note is an implementation planning target for the docs-only phase. It is
not code authority until the linked ADR/GDDR set is ratified.

## Goal

Make the AI narration MVP slice testable before runtime code exists. The
framework must let FMX generate media, fan groups, staff, board, players and
agents with clear values/personas, assemble complete context, run deterministic
fallbacks, validate any LLM enhancement and feed failures back into playtests.

## Framework Structure

The future Narrative package/context should be split into small internal
modules:

| Module | Responsibility |
|---|---|
| `scene-selector` | Pick eligible narrative scenes/storylets from public read models |
| `context-assembler` | Build `NarrativeContextCard` from authoritative facts and actor cards |
| `template-runtime` | Render deterministic fallback copy for every surface |
| `fallback-manifest` | Maintain CI-verifiable coverage for every prose point and scene type |
| `provider-adapter` | Backend-only LLM calls, timeouts, retries, cost and model metadata |
| `validator` | Schema, fact, safety, repetition and persona checks |
| `provenance` | Display snapshot metadata, fallback reason, model/schema versions |
| `news-fact-projection` | Consume source-owned newsworthy event snapshots into `NarrativeNewsFactProjection` without cross-context joins |
| `memory` | Compact narrative memory snippets and stale-memory retirement |
| `eval-harness` | Eval corpus loading, mocked/live runs, reports and playtest exports |
| `telemetry` | Tokens, latency, cost, validation status and kill-switch state |

The owning domains remain authoritative. Narrative modules consume public
queries and events only.

## Contracts

First-wave contracts:

- `NarrativeSceneType`: one of the MVP surfaces.
- `NarrativeSceneId`: stable scene/storylet identifier.
- `ActorNarrativeCard`: actor role, display placeholder, voice card, persona
  labels, values and constraints.
- `AuthoritativeFactRef`: fact ID, owner context, value summary and expiry.
- `RelationshipEdgeSummary`: actor edge, value bucket and relevant tags.
- `NarrativeMemorySnippet`: tagged event-backed memory, age and relevance.
- `DialogueIntent`: selectable player/manager response with deterministic
  policy key.
- `DialogueIntentSelected`: planning event emitted after the manager selects a
  finite intent option.
- `DialogueIntentRejected`: validation result for an intent option that is no
  longer eligible after the owning context rechecks facts.
- `DialogueEffectResult`: owning-domain result projection for the applied band,
  visibility posture and follow-up display needs.
- `ForbiddenClaim`: explicit unsupported fact category for this scene.
- `NarrativeContextCard`: complete scene input.
- `NarrativeEnhancementRequest`: context card plus provider/safety budget.
- `NarrativeEnhancementResult`: text plus source and provenance.
- `NarrativeValidationReport`: pass/fail checks and fallback reason.
- `NarrativeProvenance`: source, provider/model, schema version, cache key,
  validation state and `aiGenerated`.
- `NarrativeEvalCase`: replayable eval fixture.
- `FallbackCoverageManifest`: machine-readable coverage registry mapping each
  prose point / `NarrativeSceneType` to fallback template, fixture, LLM
  eligibility, forbidden claims, provenance schema and test IDs.
- `NarrativeSceneFallbackFixture`: deterministic input fixture that proves a
  scene renders without provider access.
- `NewsworthyEventEnvelope`: source-owned integration-event envelope for
  Narrative-facing facts.
- `NewsworthinessMetadata`: salience inputs, source confidence, attribution,
  privacy detail and legal-risk metadata.
- `NarrativeNewsFactProjection`: rebuildable, non-authoritative projection
  consumed by storylets/articles/feed surfaces.

Use Zod 4 strict object schemas at runtime boundaries and infer TypeScript
types from those schemas. Export JSON Schema only from the same schemas used by
runtime validation.

## CI Tiers

| Tier | Runs | Required checks |
|---|---|---|
| Local/PR | Every relevant change | Zod contract tests, mocked provider adapter, fallback manifest coverage, LLM-disabled render fixtures, static no-LLM-in-authoritative-path guard, small eval corpus |
| Nightly | Scheduled | Larger corpus, fast-check generated context cards, season simulations, red-team prompts, cost/latency report |
| Release | Before runtime enablement | 10k-style narrative seed soak, legal/disclosure checklist, provider/model regression, manual playtest review, kill-switch drill |

In the docs-only phase, these tiers are planning targets. Once code returns,
they become concrete scripts in the CI process.

## Required Test Suites

| Suite | Pass condition |
|---|---|
| Contract shape | Unknown keys rejected; required provenance/fallback fields present |
| Context assembly | Only public read-model facts appear; no raw user/PII/internal IDs |
| Newsworthiness ingestion | Injury, contract-expiry, board-pressure and transfer-rumour fixtures render from event snapshots only; no source-domain join is needed |
| Fallback manifest coverage | Every prose point and `NarrativeSceneType` has `fallbackTemplateId`, fixture, deterministic render assertion and provenance assertion |
| Deterministic fallback | Same seed/context/template version yields same fallback |
| Fact grounding | Output cannot contradict listed authoritative facts |
| Intent determinism | Mechanics are identical for template and LLM wording when intent is same |
| Dialogue effect ownership | Every selectable intent names exactly one owner context, policy key, band and visibility posture; Narrative cannot apply the effect |
| Provider resilience | Timeout, 429, 5xx, malformed JSON and schema failures fall back |
| Safety/privacy | Prompt injection, system-prompt extraction, unsafe content and PII leaks fail |
| Persona drift | Actor tone and stance stay within allowed stress/persona corridor |
| Repetition | Actor/scene line reuse stays below playtest-tuned caps |
| Memory coherence | Promises/conflicts resolve or expire; stale memory does not surface |
| Disclosure/provenance | First exposure is shown and every AI output is internally identifiable |

## Eval Corpus Seed

Start the corpus with at least one passing and one failing case for each MVP
surface:

- player one-to-one;
- staff disagreement;
- board pressure;
- press/journalist question;
- fan-rep meeting;
- agent/transfer flavour;
- match ticker key event;
- post-match report;
- weekly summary.

Each failure should be useful: invented fact, persona mismatch, unsafe output,
repetition, stale memory, provider failure, malformed response or disclosure
gap.

## Playtest Rubric

Because Nico selected Playtest First, every narrative playtest should score:

- fact correctness;
- actor recognisability;
- emotional specificity;
- voice consistency;
- memory usefulness;
- repetition/boredom;
- disclosure clarity;
- whether the player can retell "what happened in my save".

Failures become corpus cases before prompt/model tuning is considered complete.

## Acceptance Criteria

- Every MVP prose point is covered by the `FallbackCoverageManifest` before live
  LLM is used.
- Every newsworthy fact surface renders from a self-contained source-owned
  event snapshot or is rejected as under-specified.
- `LLM_MODE=disabled` renders every manifest fixture with no provider access.
- Every live/provider path is optional, budgeted and kill-switchable.
- No generated prose is parsed into domain commands or authoritative facts.
- Every dialogue effect is applied by the owning gameplay context from the
  selected intent and authoritative facts, never by Narrative or generated text.
- All prompt payloads are minimized and redact user-authored names.
- Playtest output can be exported as eval cases without exposing secrets or PII.
- Provider/model changes rerun the narrative corpus before rollout.
- Generated text export/share stays out of MVP unless a later legal-gated policy
  is ratified.

## Related

- [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../60-Research/ai-narration-testing-framework-2026-05-28]]
- [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
- [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
- [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
- [[../20-Features/feature-ai-narration-mvp-pillar]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
- [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
- [[mvp-implementation-roadmap]]
