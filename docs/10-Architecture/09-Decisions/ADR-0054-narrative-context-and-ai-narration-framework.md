---
title: ADR-0054 Narrative Context and AI Narration Framework
status: draft
tags: [adr, architecture, ddd, bounded-context, narrative, ai, llm, testing, mvp]
created: 2026-05-28
updated: 2026-05-28
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[../../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../../60-Research/ai-narration-testing-framework-2026-05-28]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../20-Features/feature-ai-narration-mvp-pillar]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
  - [[ADR-0052-people-persona-and-skills-context]]
---

# ADR-0054: Narrative Context and AI Narration Framework

## Status

draft

> Draft only. Nico selected the Narrative context direction during FMX-3
> planning, but this ADR is not accepted and must not be implemented until
> ratified.

## Date

2026-05-28

## Context

ADR-0030 defines the hard boundary: runtime LLM output is presentation-only and
cannot influence authoritative state. GD-0018 defines the game-design ambition:
Full Dialogue and All Active actor context in the MVP. The missing architecture
piece is ownership. Without a clear owner, context-card assembly, storylet
selection, fallback templates, provider validation, provenance, evaluation and
playtest evidence would be spread across People, Notification, Match, Club,
Fan Ecology and UI.

Nico chose the **Narrative Context** option over housing this inside
Notification or People. Notification should deliver messages, not own narrative
logic. People should own personhood and relationship truth, not media/fan
storylets, provider adapters or eval corpora.

## Options Considered

- **A - Dedicated Narrative context.** Owns scenes, context-card assembly,
  templates, validation, provider boundary, provenance and evaluation. Clear
  framework structure, more explicit architecture work.
- **B - Notification submodule.** Reuses inbox delivery and message storage,
  but makes notification delivery responsible for domain narrative decisions.
- **C - People submodule.** Keeps persona data close, but puts media outlets,
  fan groups, templates, provider adapters and narrative tests in the wrong
  owner.

## Proposed Decision

Choose **A - Dedicated Narrative context** as the draft MVP architecture.

The Narrative context owns the non-authoritative narration framework:

- `NarrativeScene` selection and storylet eligibility;
- `NarrativeContextCard` assembly from public read models;
- fallback template lookup and deterministic rendering;
- optional LLM provider adapter boundary;
- schema, fact, safety, repetition and persona validation;
- display snapshot/provenance records;
- narrative memory summaries as presentation references;
- eval corpus fixtures and test reports;
- kill switch, budget state and fallback telemetry.

The Narrative context does **not** own:

- match events, match results, replay or ratings;
- player attributes, fitness, morale, contracts or injuries;
- people/persona source truth or relationship graph;
- fan segment mood, fan economics or fan pressure;
- board decisions, finances, budgets or insolvency;
- transfer decisions, agent economics or negotiation state;
- notification delivery, unread counts, push/email delivery or subscriptions.

## Context Boundaries

| Owner | Owns | Narrative may consume |
|---|---|---|
| People / Persona & Skills | actor cards, persona projections, relationship edges | actor narrative cards, relationship summaries |
| Squad & Player | player football state, contracts, fitness, morale | selected facts and player status summaries |
| Club Management | board, finances, fan/economy outputs where owned | board pressure, budget facts, club identity facts |
| Fan Ecology | supporter segments, named group facts, fan mood | fan group/reputation facts and fan-rep scene inputs |
| Match | committed event log, spatial samples, result | key-event narration inputs only after commit |
| Transfer | offers, agent/client state, negotiation outcomes | fixed transfer/agent facts after domain decision |
| Notification | durable delivery and inbox projections | approved narrative display snapshots |

All cross-context reads go through public queries/read models. Narrative never
queries another context's tables directly and never emits commands that mutate
authoritative state based on generated prose.

## Public Contracts

Planning contracts for the first implementation wave:

- `NarrativeSceneType`
- `NarrativeSceneId`
- `ActorRef`
- `ActorNarrativeCard`
- `AuthoritativeFactRef`
- `RelationshipEdgeSummary`
- `NarrativeMemorySnippet`
- `DialogueIntent`
- `ForbiddenClaim`
- `NarrativeContextCard`
- `NarrativeEnhancementRequest`
- `NarrativeEnhancementResult`
- `NarrativeValidationReport`
- `NarrativeProvenance`
- `NarrativeEvalCase`

Contracts are TypeScript + Zod 4 when implementation resumes. Zod schemas are
strict at provider/API boundaries and may export JSON Schema for structured
provider output. Exact wire shapes remain implementation-gated, but the
ownership and contract names are the draft target.

## Runtime Flow

```text
Authoritative domain facts
  -> public read models
  -> NarrativeScene selection
  -> NarrativeContextCard
  -> deterministic fallback template
  -> optional LLM enhancement
  -> validation report
  -> display snapshot with provenance
  -> Notification/UI delivery
```

The fallback is always renderable without provider access. LLM output may
replace presentation copy only after validation passes.

## MVP Testing Posture

Nico selected **Playtest First** for narrative quality. This ADR interprets
that as:

- playtest feedback guides emotional quality, persona tone and world feel;
- dev/playtest Runtime-LLM experiments may happen before final numeric quality
  thresholds are frozen;
- production Runtime-LLM still requires hard gates for state isolation,
  fallback coverage, safety/privacy validation, provenance, disclosure and
  provider failure behavior.

The implementation framework is
[[../../30-Implementation/ai-narration-contract-testing-framework]].

## Verification Requirements

- Contract tests for every public Narrative contract.
- Static architecture guard: LLM provider code cannot be imported by
  authoritative contexts or match/replay paths.
- Determinism tests for scene selection, context-card assembly and fallback
  rendering.
- Fact-grounding tests against scores, injuries, transfers, contracts,
  promises, sanctions, finance and morale facts.
- Intent tests proving mechanics read `DialogueIntent`, never generated prose.
- Security tests for prompt injection, PII minimization, unsafe output,
  provider errors, over-budget and kill switch.
- Season simulation tests for repetition, stale memory, unresolved arcs and
  persona drift.
- Playtest rubric that feeds failures back into eval cases and validators.

## Rationale

The dedicated context is the cleanest DDD boundary. It keeps Notification
focused on delivery and People focused on personhood, while giving FMX a single
place for the actual narration framework, eval evidence and LLM operational
controls.

This also future-proofs provider changes. Runtime LLM can stay disabled,
swapped, routed differently or removed without rewriting the owning domains.

## Consequences

Positive:

- Clear owner for the MVP narration framework.
- Clear contracts for testing, provider adapters and UI delivery.
- Better separation between story presentation and authoritative simulation.
- Makes Playtest First measurable without relaxing safety gates.

Negative:

- Adds another proposed bounded context to ratify.
- Requires additional contract and map updates before implementation.
- Requires strict discipline so Narrative does not become a hidden domain
  decision engine.

## Supersedes

None

## Related Docs

- [[../../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../../60-Research/ai-narration-testing-framework-2026-05-28]]
- [[../../30-Implementation/ai-narration-contract-testing-framework]]
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../../20-Features/feature-ai-narration-mvp-pillar]]
- [[ADR-0019-modular-monolith-ddd]]
- [[ADR-0030-llm-out-of-authoritative-state]]
- [[ADR-0052-people-persona-and-skills-context]]
