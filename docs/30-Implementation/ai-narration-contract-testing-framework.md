---
title: AI Narration Contract Testing Framework
status: draft
tags: [implementation, testing, ai, llm, narrative, contracts, mvp, fmx-3]
created: 2026-05-28
updated: 2026-06-16
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
  - [[../60-Research/llm-prose-replay-determinism-floor-2026-06-14]]
  - [[../60-Research/llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-llm-prompt-injection-defensive-contract-source-checks-2026-06-16]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
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
| `ugc-text-trust` | Consume Community Overlay text refs, trust class, policy version and sanitized/escaped text eligibility |
| `prompt-envelope` | Build role-separated prompts from trusted facts, forbidden claims, escaped untrusted text refs, task metadata and fallback ID |
| `provenance` | Display snapshot metadata, fallback reason, model/schema versions |
| `snapshot-store` | Persist exact revisitable display text and replay/reopen it verbatim |
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
- `CommunityTextRef`: pack text reference from Community Overlay with
  `packId`, `packVersion`, `contentHash`, `fieldPath`, trust class,
  `policyVersion`, `llmEligible` and length cap.
- `NarrativePromptEnvelope`: strict prompt-builder input that separates
  trusted facts, forbidden claims, escaped untrusted text refs, task metadata
  and fallback template ID.
- `NarrativeEnhancementRequest`: context card plus provider/safety budget.
- `NarrativeOutputEnvelope`: strict provider response wrapper containing
  display lines, used fact refs, used text refs and risk flags; unknown keys
  are validation failures.
- `NarrativeEnhancementResult`: text plus source and provenance.
- `NarrativeValidationReport`: pass/fail checks and fallback reason.
- `NarrativeProvenance`: source, provider/model, schema version, cache key,
  validation state and `aiGenerated`.
- `NarrativeDisplaySnapshot`: exact rendered text plus provenance for
  player-visible revisitable Template/LLM prose.
- `NarrativeSnapshotRef`: stable reference from inbox/history/report/replay UI
  surfaces to a stored display snapshot.
- `NarrativeReplayPolicy`: declares whether a surface is replay-visible,
  history-visible, ephemeral-only or recovery-only.
- `NarrativeSnapshotRecoveryReason`: machine-readable reason for deterministic
  fallback when a stored snapshot is missing, corrupt or incompatible.
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
runtime validation. FMX-188 requires `z.strictObject(...)` at provider-output
boundaries because plain object parsing strips unknown keys by default; extra
fields from a provider response are suspicious and must fail closed. Provider
JSON Schema strict mode (for example OpenRouter structured outputs on
compatible model IDs) is an optimization, never a replacement for local
validation and deterministic fallback.

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
| UGC text trust | Community text refs without current `community_sanitized` + `llmEligible: true` verdict never enter a provider prompt |
| Prompt envelope isolation | Trusted facts, task instructions and escaped untrusted text refs remain separate; delimiter/role spoofing from UGC cannot alter task or schema fields |
| Newsworthiness ingestion | Injury, contract-expiry, board-pressure and transfer-rumour fixtures render from event snapshots only; no source-domain join is needed |
| Fallback manifest coverage | Every prose point and `NarrativeSceneType` has `fallbackTemplateId`, fixture, deterministic render assertion and provenance assertion |
| Deterministic fallback | Same seed/context/template version yields same fallback |
| Replay/reopen exact snapshot | Same save reopened or match replayed renders the stored `NarrativeDisplaySnapshot` text verbatim |
| Provider isolation on replay | Reopen/replay paths do not call the provider adapter and do not depend on prompt-cache hits |
| Snapshot recovery | Missing/corrupt snapshot fixtures render deterministic recovery templates with explicit recovery provenance |
| Match commentary boundary | Replay-visible commentary snapshots reference committed match events but do not alter event logs, `MatchFrame`, replay hashes or ratings |
| Fact grounding | Output cannot contradict listed authoritative facts |
| Intent determinism | Mechanics are identical for template and LLM wording when intent is same |
| Dialogue effect ownership | Every selectable intent names exactly one owner context, policy key, band and visibility posture; Narrative cannot apply the effect |
| Provider resilience | Timeout, 429, 5xx, malformed JSON and schema failures fall back |
| Safety/privacy | Prompt injection, system-prompt extraction, unsafe content and PII leaks fail |
| UGC prompt-injection corpus | Malicious community-pack fixtures for direct overrides, indirect injection in lore/articles/chants, delimiter escapes, role-label spoofing, command-shaped JSON fields and obfuscated variants fail closed |
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

Add at least one replay/reopen fixture per revisitable surface:

- original render stores exact text plus provenance;
- reopened save renders byte-identical text;
- provider adapter spy records zero calls during reopen/replay;
- prompt/model/provider/cache version change leaves old snapshots unchanged;
- missing/corrupt snapshot path renders deterministic recovery copy and records
  `NarrativeSnapshotRecoveryReason`.

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
- Save reopen, inbox/history and match replay render exact stored display
  snapshots for all revisitable Template/LLM prose.
- Replay/reopen paths never call a runtime provider and never treat cache keys
  as output history.
- Every dialogue effect is applied by the owning gameplay context from the
  selected intent and authoritative facts, never by Narrative or generated text.
- All prompt payloads are minimized and redact user-authored names.
- Playtest output can be exported as eval cases without exposing secrets or PII.
- Provider/model changes rerun the narrative corpus before rollout.
- Generated text export/share stays out of MVP unless a later legal-gated policy
  is ratified.
- UGC/community-pack text does not reach a provider unless the Community Overlay
  text trust gate returns a current sanitized, LLM-eligible text ref.
- Provider responses are accepted only through strict local schema validation;
  provider-side structured outputs are required where selected models support
  them but are not trusted without local validation.
- Any prompt-injection or text-trust failure uses deterministic fallback and
  records evidence for review.

## Related

- [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../60-Research/ai-narration-testing-framework-2026-05-28]]
- [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
- [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
- [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
- [[../60-Research/llm-prose-replay-determinism-floor-2026-06-14]]
- [[../60-Research/llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
- [[../20-Features/feature-ai-narration-mvp-pillar]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
- [[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
- [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
- [[mvp-implementation-roadmap]]
