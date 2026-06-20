---
title: AI Narrative Runtime Integration Research
status: current
tags: [research, ai, llm, narrative, persona, dialogue, openrouter, ai-act]
context: narrative-dialogue
created: 2026-05-27
updated: 2026-05-28
type: research
binding: false
sourceType: synthesis
related:
  - [[incoming-design-research-2026-05-27]]
  - [[raw-perplexity/raw-ai-llm-usage]]
  - [[raw-perplexity/raw-character-personality-and-dialogue]]
  - [[narrative-content-pipeline]]
  - [[ai-manager-behaviour]]
  - [[determinism-and-replay]]
  - [[swappable-spatial-event-match-engine-2026-05-27]]
  - [[pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
  - [[ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../50-Game-Design/GD-0013-narrative-inbox]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
---

# AI Narrative Runtime Integration Research

> **2026-05-28 scope update:** Nico expanded the draft MVP target from
> "async flavour plus key-event wording" to **Full Dialogue** with **All Active**
> actor classes. The deeper synthesis is
> [[ai-narration-world-and-dialogue-mvp-2026-05-28]]. This note remains the
> original Runtime-LLM integration synthesis, but its older async-first MVP
> candidate is no longer the current draft target.

## Question

How should FMX absorb the 2026-05-27 AI narrative reports into gameplay and
architecture planning without breaking determinism, offline readiness,
multiplayer fairness or legal/compliance posture?

This note synthesizes two raw inputs:

- [[raw-perplexity/raw-ai-llm-usage]] - LLM use-case matrix, OpenRouter cost
  model, fallback architecture and simulation-first boundary.
- [[raw-perplexity/raw-character-personality-and-dialogue]] - actor personas,
  player talks, journalist/press ecosystem and intent-based dialogue.

## Product goal

The strongest product intent is not "AI text" by itself. It is that a player can
later tell a personal, specific story about their save: the journalist who kept
attacking them, the board that lost patience, the player who felt betrayed, the
derby that became a season-long rivalry, and the newspaper archive that made it
feel like *their* world.

Runtime LLM can help with surface variation and voice, but it must remain a
secondary layer over already-computed facts. The simulation remains the source
of truth.

## What the reports confirm

- **Calculation first.** Match results, injuries, morale changes, finances,
  transfer willingness and board pressure are computed by deterministic systems.
  Runtime AI may phrase or summarize the result, not invent it.
- **Template fallback is mandatory.** Every runtime AI output has a local
  deterministic fallback path.
- **Intent-based dialogue is the right interaction model.** The player chooses
  an intent; the system maps that intent to deterministic effects; prose is
  presentation.
- **Personas matter beyond text.** Players, journalists, board members and fan
  reps need stable traits so repeated appearances feel coherent.

## MVP re-evaluation target

Nico re-checked the MVP Runtime-LLM line on 2026-05-28 and selected a broader
draft target:

**Full controlled dialogue plus async narrative flavour.**

In scope for the revised draft MVP target:

- post-match newspaper snippets, injury/event reports, weekly summaries and
  matchday summaries;
- selected match ticker key-event wording after the match engine has committed
  event/spatial facts;
- player one-to-one dialogue through explicit intents;
- staff advice and staff disagreement scenes;
- board expectation, warning and pressure scenes;
- press/journalist questions through recurring generated media personas;
- fan-rep scenes for named fan groups over the six supporter segments;
- transfer/agent flavour after the underlying negotiation state is already
  computed.

Still excluded from the MVP target:

- LLM-driven opponent tactics;
- LLM-driven transfer decisions;
- free-form user chat.
- routine pass/duel/possession narration.

Dialogue may feel conversational in the UI, but the interaction model is
choice- and intent-based. The selected `DialogueIntent` plus deterministic
actor/domain policies can affect mechanics; the generated text never does.

## Gameplay boundary

The durable game-design rule should be:

- actor **traits** may influence mechanics deterministically;
- selected **intents** may influence mechanics deterministically;
- generated **text** never influences mechanics;
- generated text never creates or corrects simulation facts.

Match ticker special case:

- eligible inputs are goals, big chances, cards, injuries, substitutions,
  half-time and full-time, plus selected spatial context from the committed
  event/spatial log;
- routine match flow remains template-only;
- output carries provenance (`llm` vs `template`), provider/model/version,
  cache key and validation status;
- the match engine never imports, awaits or calls an LLM provider.

Examples:

- A critical journalist trait can increase the probability and tone of hard
  questions, but the LLM phrase does not change fan mood.
- A player with high ambition and low patience may react worse to a
  `delay_playtime_promise` intent, but the generated line is cosmetic.
- Board impatience can raise pressure through Club Management rules, but not
  because an LLM used sharper wording.

## Provider posture

Nico's preferred experimentation path is OpenRouter. The reason is practical:
fast provider/model iteration, low setup friction and strong fit for short
narrative text experiments.

Provider caveats that must be documented before implementation:

- OpenRouter supports structured outputs for compatible models and can enforce
  JSON Schema with `response_format` and `strict: true`, but schema support is
  model-dependent and must still be validated locally.
- Free-tier limits are not production capacity. OpenRouter documents free-plan
  limits of 50 requests/day and 20 RPM; pay-as-you-go removes platform-level
  limits for paid models, while upstream provider throttling can still happen.
- Pricing and model availability can drift; model IDs should be pinned and cost
  caps must be enforced per feature.

## Data minimization posture

The project should not send clear user data, PII, secrets, account identifiers,
email addresses, IP-derived location, raw free text or other personal data to an
LLM provider.

Prompt payloads use:

- fictional generated entities where safe;
- placeholder tokens for user-authored names (`{{manager_name}}`,
  `{{club_name}}`, `{{player_name_1}}`);
- structured game facts only, reduced to the minimum needed for the text;
- no free-form user input in MVP;
- no secrets or internal IDs.

This reduces GDPR exposure, but it does not remove all legal work. Runtime AI
still needs provider terms, logging/retention settings, disclosure handling,
abuse controls and release review.

## Disclosure posture

Nico's current product direction is **first-exposure disclosure** plus a central
info/settings surface, rather than a visible label on every generated in-game
text. This is a product direction, not yet a legal conclusion.

As of 2026-05-27, EU AI Act transparency rules are expected to apply from
2026-08-02 for relevant systems, and European Commission guidance says
generative/interactive AI and deep fake/text-publication cases are covered by
Article 50 transparency obligations. The exact in-game disclosure pattern needs
legal review before Runtime-LLM ships.

Therefore:

- product preference: clear first-use notice and central information surface,
  not per-card visual label by default;
- architecture requirement: every generated output still carries machine-readable
  provenance metadata;
- release gate: legal review confirms whether central disclosure is enough.

## Candidate contracts

These are planning contracts, not implementation API decisions.

```ts
type PersonaRole =
  | 'player'
  | 'staff'
  | 'board_contact'
  | 'journalist'
  | 'media_outlet'
  | 'fan_segment'
  | 'fan_group'
  | 'fan_rep'
  | 'agent'

type PersonaProfile = {
  id: string
  role: PersonaRole
  traits: Record<string, number | string>
  voiceCardId: string
  mechanicalTags: string[]
}

type DialogueIntent = {
  id: string
  actorRole: PersonaRole
  situation: string
  mechanicalEffectKey?: string
}

type NarrativeEnhancementRequest = {
  requestId: string
  sceneId: string
  eventFamilyId: string
  locale: string
  facts: Record<string, string | number | boolean>
  personas: PersonaProfile[]
  allowedIntents: DialogueIntent[]
  forbiddenClaims: string[]
  tone: string
  fallbackTemplateId: string
}

type NarrativeEnhancementResult = {
  requestId: string
  source: 'llm' | 'template'
  text: string
  cacheKey: string
  aiGenerated: boolean
}
```

## External evidence refresh

- European Commission: the AI Act becomes fully applicable on 2026-08-02 with
  exceptions, and transparency obligations cover generative and interactive AI
  systems. Source:
  https://digital-strategy.ec.europa.eu/en/faqs/navigating-ai-act
- European Commission: Article 50 guidance and the transparent generative AI
  Code of Practice cover marking, labelling and detection for AI-generated
  content. Source:
  https://digital-strategy.ec.europa.eu/en/faqs/guidelines-and-code-practice-transparent-ai-systems
- OpenRouter: structured outputs support `json_schema`/`strict: true` on
  compatible models. Source:
  https://openrouter.ai/docs/guides/features/structured-outputs
- OpenRouter: pricing and rate-limit docs define free-tier and pay-as-you-go
  behavior. Source: https://openrouter.ai/pricing
- OWASP LLM Top 10: runtime LLM systems need controls for prompt injection,
  insecure output handling, sensitive information disclosure, excessive agency
  and overreliance. Source:
  https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Generative Agents research shows believable agent behavior can emerge from
  memory, planning and reflection, but that architecture is far beyond the MVP
  scope and should inform future persona depth only. Source:
  https://arxiv.org/abs/2304.03442
- LLM-driven NPC research reports immersion potential but also response-time
  frustration, supporting async-first and fallback-first product sequencing.
  Source:
  https://vbn.aau.dk/en/publications/exploring-presence-in-interactions-with-llm-driven-npcs-a-compara/

## Promotion path

1. Promote the game-design shape through
   [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]].
2. Promote the architecture boundary through
   [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]].
3. Keep [[narrative-content-pipeline]] as the deterministic template baseline.
4. Runtime-LLM remains unimplemented until Nico accepts the ADR/GDDR and legal
   disclosure review is complete.

## Related

- [[incoming-design-research-2026-05-27]]
- [[raw-perplexity/raw-ai-llm-usage]]
- [[raw-perplexity/raw-character-personality-and-dialogue]]
- [[narrative-content-pipeline]]
- [[pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
