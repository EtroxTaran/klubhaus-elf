---
title: ADR-0065 Narrative Media and Press Content Ownership
status: accepted
tags: [adr, architecture, ddd, narrative, media, press, notification, people, llm, fmx-31, accepted]
created: 2026-06-02
updated: 2026-06-19
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
  - [[ADR-0043-notification-and-messaging-platform]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
  - [[ADR-0126-cross-producer-effect-intent-taxonomy]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0013-narrative-inbox]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../60-Research/narrative-content-bounded-context-2026-06-02]]
  - [[../../60-Research/llm-prose-replay-determinism-floor-2026-06-14]]
  - [[../../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-narrative-content-bounded-context-2026-06-02]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# ADR-0065: Narrative Media and Press Content Ownership

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> Proposed extension of ADR-0054. This ADR does not make Narrative accepted and
> does not edit `bounded-context-map.md`; the map patch lands only when Nico
> ratifies ADR-0054 / ADR-0065.

## Date

- Proposed: 2026-06-02

## Context

FMX-31 (child of FMX-24, the bounded-context-gap research wave) resolves the
residual ownership gap left after ADR-0052 and ADR-0054:

- ADR-0052 (People, draft) owns journalists and other media actors as **people**
  / actor refs / persona-card sources. It does not own outlet publication rules,
  press article content, response trees or inbox persistence.
- ADR-0043 (Notification, accepted) owns durable delivery, in-app inbox,
  schedules, preferences, provider adapters and delivery audit. It does not own
  content meaning, storylet selection or editorial publication policy.
- ADR-0054 (Narrative, draft) already proposes the owner for scene/storylet
  selection, context-card assembly, fallback templates, optional LLM adapter,
  validation, provenance and eval evidence.
- ADR-0030 requires every runtime LLM output to stay outside authoritative
  state: deterministic fallback first, generated prose never parsed back into
  commands or facts, PII-minimized prompts, validation, provenance and kill
  switch.

What remains unowned is **Press/Media content authoring**:

- Press article templates and publication policy.
- Conference response trees and deterministic follow-up logic.
- Tone profile / tabloid tone library and mapping from People persona cards to
  surface variants.
- ICU message keys and fallback-template coverage.
- Optional LLM paraphrase controls for press articles and conference copy.
- Publication events that downstream Notification/inbox/feed surfaces consume.

The research synthesis
[[../../60-Research/narrative-content-bounded-context-2026-06-02]] (five
Perplexity passes: genre, DDD, storylet authoring, LLM controls, newsroom/CMS)
finds strong DDD support for a Narrative/Media authoring owner, but FMX already
has ADR-0054's proposed Narrative context. Therefore the best landing is to
extend **Narrative**, not to create a second Media context.

### HITL shaping decisions (Nico, 2026-06-02)

Nico approved the recommended defaults during the FMX-31 ask-first gate:

1. **Ownership = Narrative erweitert.** Narrative owns press content, response
   trees, tone library and publication policy; Notification delivers; People
   supplies persona cards.
2. **Command/event boundary = Narrative publiziert.** `PublishPressArticle`,
   `TriggerPressConference`, `ConferenceResponseSelected` and
   `TabloidToneApplied` live in Narrative; other contexts mutate their own
   authoritative facts.
3. **Content/LLM contract = strict deterministic.** Template-first, stable IDs,
   ICU keys, schema-validated optional LLM paraphrase, provenance, kill-switch
   and PII-minimized context cards.

The decision remains `proposed` / `binding: false` until formal ratification.

## Options Considered

### Option A — Sub-aggregate in Notification / Inbox

Notification owns media templates, article publication and conference response
trees because the output appears in the inbox/news feed.

- **Coupling:** mixes editorial content lifecycle with delivery channels,
  preferences, read/unread state, retry, provider adapters and push/email
  infrastructure.
- **Language leak:** "template" means both channel template and narrative
  fallback; "message" means both story beat and delivery record.
- **Test isolation:** weak. Notification tests would need press storylets and
  tone fixtures; content tests would need delivery infrastructure.
- **Boundary conflict:** contradicts ADR-0043's accepted scope: Notification
  owns durable delivery, not content meaning.
- **Trade-off:** cheapest for a tiny feed-only MVP, but brittle once press
  conferences, response trees, tabloid tone and LLM provenance exist.

### Option B — Press/Media subdomain inside Narrative

ADR-0054 Narrative owns the Press/Media authoring subdomain: press storylets,
conference response trees, article templates, tone profiles, publication policy,
fallback rendering, validation and provenance. Notification consumes published
display snapshots/events; People supplies actor/persona context cards.

- **Coupling:** clean. Narrative reads facts through public read models,
  produces deterministic display artifacts and emits content events.
  Notification remains delivery; People remains persona truth.
- **DDD fit:** strong ubiquitous language (`storylet`, `article`,
  `response tree`, `tone profile`, `publication`, `fallback template`) and high
  volatility separate from Notification and People.
- **Test isolation:** strong. Content validation, replay determinism,
  LLM/fallback and provenance tests live in Narrative; Notification stubs
  `PressArticlePublished` / display snapshot inputs.
- **Map impact:** no new context row beyond ADR-0054. This ADR extends the
  Narrative proposal with a media/press subdomain and map-patch text.
- **Trade-off:** requires ADR-0054 / ADR-0065 ratification before implementation;
  demands strict discipline so Narrative never becomes an authoritative mechanic
  owner.

### Option C — Sub-aggregate in People / Persona

People owns media content because journalists, outlets and tones are tied to
persona and relationship facts.

- **Coupling:** puts volatile content authoring, response trees and publication
  policy into the context that should own personhood, persona projections and
  relationship truth.
- **Privacy risk:** content authoring tools would operate near identity/persona
  truth and PII-minimization boundaries.
- **Language leak:** "persona tone" becomes confused with content tone and
  editorial tone policy.
- **Boundary conflict:** contradicts ADR-0052's explicit exclusion of media
  outlet publication cadence, article delivery and inbox persistence.
- **Trade-off:** close to persona data, but wrong owner for article lifecycle
  and response-tree authoring.

## Recommendation

**Option B — Press/Media subdomain inside Narrative.**

Rationale:

1. **Fits existing draft architecture.** ADR-0054 already proposes Narrative as
   owner of storylet selection, fallback templates, optional LLM adapter,
   validation, provenance and eval evidence. FMX-31 adds the missing press/media
   authoring surface to that same owner.
2. **Keeps accepted boundaries clean.** ADR-0043 Notification remains delivery
   / inbox / provider state. ADR-0052 People remains actor/persona/context-card
   truth. Neither absorbs content authoring.
3. **Matches DDD and newsroom patterns.** Publication is an editorial/content
   state transition; distribution is downstream. Tone/style policy is an
   authoring concern, not a delivery formatter.
4. **Protects determinism and ADR-0030.** Every press article and conference
   line has a deterministic fallback and stable ID. Optional LLM output is
   display-only and rejected on validation/fact/safety failure.

### Named risks

- **Narrative overreach.** Narrative must not mutate morale, fan mood, board
  pressure, relationships or transfer willingness. Mitigation: it emits
  deterministic effect intents/events; owning contexts validate and write their
  own state.
- **ADR order dependency.** ADR-0054 remains draft. Mitigation: ADR-0065 is a
  proposed extension and does not apply the map until ratified.
- **LLM compliance uncertainty.** Article 50 disclosure surface and provider
  policy remain release/legal gates. Mitigation: provenance, `aiGenerated`
  metadata, kill switch and deterministic fallback are mandatory in the
  contract.
- **Content volume unknown.** Exact storylet/template counts are not an
  architecture decision. Mitigation: content coverage is future content-planning
  scope.
- **Genre evidence weak for exact counts.** Public FM/Anstoss internals are not
  strong enough to lock numeric targets. Mitigation: use genre evidence for
  shape only (wide/shallow/repeatable), not as final volume data.

## Decision

Propose extending the **Narrative** bounded context with a Press/Media content
authoring subdomain.

If ratified, Narrative owns:

- **`PressStorylet` / `ConferenceQuestion` content units** with stable IDs,
  preconditions, context tags, priority/weight, repeat policy, message keys and
  deterministic selection policy.
- **`ConferenceResponseTree` aggregate** with shallow response options,
  response IDs, tone/risk tags, follow-up flags, effect-intent IDs and replay
  metadata. Branching is local and deterministic; generated prose is never read
  by mechanics.
- **`PressArticle` / `PressArticleVersion` content model** for article drafts,
  deterministic fallback template coverage, tone profile, publication state,
  provenance and revision/audit metadata.
- **`ToneProfileLibrary`** for neutral, club-friendly, hostile, tabloid and
  other approved tone registers; tone maps from People persona/context cards to
  surface variants but does not change People truth.
- **`PressPublicationPolicy`** for publish readiness, required metadata,
  fallback-template coverage, tone constraints, embargo/future scheduling if
  needed and downstream publication events.
- **LLM orchestration for press/media display only**: context-card assembly,
  prompt/schema/template versioning, structured output validation, fact checks,
  content-safety checks, provenance, cache key, kill switch and provider
  fallback-to-template.
- **Narrative QA/eval fixtures** for press storylet coverage, unreachable
  branches, missing ICU keys, replay determinism, prompt injection and fallback
  behaviour.

Narrative does **not** own:

- journalist/player/staff/board/fan identity, persona truth or relationships
  (People, ADR-0052);
- durable notification records, inbox read state, delivery attempts, provider
  state, channel preferences or push/email/SSE delivery (Notification,
  ADR-0043);
- match facts, results, ratings or replay state (Match);
- player morale, contracts, injuries or squad status (Squad & Player);
- fan segment mood, atmosphere, named supporter groups or fan incidents
  (Audience & Atmosphere);
- board decisions, finance, budgets or insolvency (Club Management);
- transfer negotiation, agent/deal state or market value truth (Transfer);
- AI text as authoritative state (ADR-0030).

## Public contract direction

Draft commands:

- `TriggerPressConference` — create/schedule a conference occasion from a
  deterministic trigger source and public facts.
- `SelectConferenceResponse` — record a manager choice for a specific
  question/response ID; emits `ConferenceResponseSelected`.
- `PublishPressArticle` — mark a concrete deterministic article/version as
  published after policy/fallback/provenance checks.
- `ApplyTabloidTone` — apply an approved tabloid tone profile to an article or
  response surface; emits `TabloidToneApplied`.
- `RetirePressStorylet` / `EnablePressStorylet` — content lifecycle commands
  for authoring/versioning.

Draft events:

- `PressConferenceTriggered`
- `ConferenceQuestionPresented`
- `ConferenceResponseSelected`
- `PressArticleDrafted`
- `TabloidToneApplied`
- `PressArticlePublished`
- `PressArticleRetired`
- `NarrativePressFallbackRendered`
- `NarrativePressEnhancementRejected`

Draft read models:

- `PressConferenceAgenda` — ordered deterministic question/storylet list +
  available response options.
- `PressArticleDisplaySnapshot` — title/body/metadata/provenance ready for UI
  or Notification delivery.
- `PressToneCatalog` — allowed tone profiles and constraints.
- `PressStoryletCatalog` — content QA/read-only catalog.
- `NarrativePressProvenance` — template ID, prompt/schema/model versions,
  source facts, validation result, fallback reason and AI flag.

Draft consumed facts:

- `PersonaContextCard` / `DialogueContextCard` from People (ADR-0052).
- `AuthoritativeFactRef` / match, squad, transfer, fan, board and finance facts
  from the owning contexts via public queries/events.
- Notification delivery outcomes only as delivery/audit feedback, not content
  ownership.
- `SeasonAdvanced` / deterministic clock facts from League Orchestration for
  scheduled publication or conference timing.

Draft effect-intent boundary:

- `ConferenceResponseSelected` may carry deterministic effect-intent metadata
  such as `protect_player`, `criticize_board`, `appease_fans`,
  `escalate_media_feud` or `deflect_transfer_rumour`.
- Owning contexts interpret those intents through their own policies and emit
  their own state events. Narrative does not write morale, fan sentiment, board
  pressure, relationship deltas or transfer willingness.

## Determinism, storage and LLM rules

- Narrative stores per-save press/media content instances, display snapshots,
  provenance and replay metadata per ADR-0027. Shared authored catalog data is
  versioned; save snapshots record the catalog version used.
- Every storylet, article template, response option and tone variant has a
  stable ID. Deterministic effect replay stores IDs, seed, resolved parameters
  and effect intents. Player-visible revisitable prose stores the exact
  `NarrativeDisplaySnapshot` text and provenance per ADR-0117; it is not
  regenerated from the IDs/seed/prompt/cache metadata.
- ICU message keys are stable. Placeholder contracts are validated before
  content ships; missing localization keys or mismatched placeholders fail
  content validation.
- The deterministic fallback is rendered before any provider call. It must be
  complete enough to ship without LLM access.
- Optional LLM paraphrase is allowed only through the ADR-0030 / ADR-0054
  Narrative provider boundary:
  - schema-validated structured output;
  - fact grounding against context cards;
  - forbidden-claim checks;
  - prompt-injection tests for user/overlay-provided names and slogans;
  - PII-minimized prompt payloads with local placeholder substitution;
  - content-safety check;
  - provenance with template/prompt/schema/model/provider versions;
  - kill switch and terminal fallback to deterministic templates.
- Save reopen, inbox/history and replay-visible surfaces render stored display
  snapshots verbatim. Missing/corrupt snapshots use deterministic recovery
  templates with explicit recovery provenance, not silent LLM regeneration.
- Generated text is display-only. It is never parsed into commands, facts,
  morale deltas, relationship changes, fan mood, board pressure or transfer
  willingness.
- Domain events emit through ADR-0028 transactional outbox. Notification
  consumes `PressArticlePublished` / `PressArticleDisplaySnapshot` to create
  inbox/feed projections; it does not own article state.
- IP-clean posture applies: no real club, league, player, journalist, outlet,
  supporter group or sponsor names embedded as samples (ADR-0007 + GD-0015).

## Rationale

FMX's press/media domain is a content-authoring and narrative-control problem,
not a delivery problem and not an identity problem. The DDD language split is
clear, and the existing vault already picked the broad Narrative direction:
Notification delivers, People supplies personhood/context, owning domains keep
authoritative facts, Narrative owns presentation structure and validation.

The newsroom/CMS analogy reinforces the split: an article is **published** by
an editorial owner and then **distributed** by downstream channels. Tabloid tone
is a versioned editorial/content transformation, not a push/inbox formatting
flag. Interactive narrative tooling reinforces the data contract: storylets,
stable IDs, shallow branches, ICU keys, deterministic replay and content linting.

Option B captures all of this while avoiding unnecessary context growth. A
separate Media context would be defensible in a different architecture, but in
FMX it would duplicate ADR-0054's proposed Narrative responsibility.

## Consequences

Positive:

- Clear owner for press articles, conference response trees, tone library and
  publication policy.
- Keeps Notification and People within their documented boundaries.
- Gives ADR-0030 concrete press/media contracts for deterministic fallback,
  validation, provenance and kill switch.
- Keeps publication/distribution split clean for future inbox, feed and push
  delivery.
- Avoids adding a new bounded context row while extending the existing
  Narrative proposal.

Negative:

- Narrative's proposed scope grows and must be ratified carefully with
  ADR-0054.
- Later implementation needs content validation tooling before press content is
  safe to ship.
- FMX-162 prepares a cross-producer effect-intent taxonomy in
  [[ADR-0126-cross-producer-effect-intent-taxonomy]]. Until Nico accepts that
  packet, the bare press intents in this ADR remain advisory placeholders and
  must be interpreted through the existing owning-context rules.
- Legal/product review still decides the final user-facing AI disclosure
  surface.

## Map patch proposal

Order-tolerant proposal applied only when ADR-0054 / ADR-0065 are accepted.
`bounded-context-map.md` is **not** edited by this ADR's PR.

### §1 prose — extend the FMX-3 Narrative paragraph

````diff
FMX-31 extends the proposed Narrative boundary with Press/Media content
authoring. If ADR-0054 and ADR-0065 are accepted, Narrative also owns
press article templates, `PressStorylet` / `ConferenceResponseTree`,
`ToneProfileLibrary`, `PressPublicationPolicy`, deterministic ICU fallback
keys, content validation, `PressArticleDisplaySnapshot` provenance and optional
LLM paraphrase controls for media/press surfaces. Notification remains the
delivery/inbox owner and consumes `PressArticlePublished` / display snapshots.
People remains the source of journalist/persona/context-card truth. Owning
domains remain the only writers of morale, fan mood, board pressure,
relationship and transfer facts; Narrative emits deterministic effect intents
only.
````

### §1 table — update the future Narrative row if/when ADR-0054 adds it

````diff
| **Narrative** | `NarrativeScene` selection, storylet eligibility, `NarrativeContextCard` assembly, deterministic fallback templates, optional LLM adapter, validation/provenance/eval corpus, **Press/Media authoring (`PressStorylet`, `ConferenceResponseTree`, `PressArticle`, `ToneProfileLibrary`, `PressPublicationPolicy`)** | `NarrativeDisplaySnapshot` / `PressArticleDisplaySnapshot` / `PressConferenceAgenda` / `NarrativePressProvenance` queries; `PressConferenceTriggered` / `ConferenceResponseSelected` / `TabloidToneApplied` / `PressArticlePublished` / `NarrativePressEnhancementRejected` events consumed by Notification/UI and owning contexts via effect-intent policies |
````

### §2 Mermaid — no new node

No new Mermaid node is required. ADR-0065 extends the existing proposed
`Narrative` node from ADR-0054. Suggested extra edges if the Narrative node is
applied:

````diff
    People --> Narrative
    Match --> Narrative
    Transfer --> Narrative
    Squad --> Narrative
    Audience --> Narrative
    Narrative --> Notif
````

### §3 communication rules — clarifying note

````diff
FMX-31 clarifies that press/media publication is a Narrative content event, not
a Notification delivery event. `PressArticlePublished` is the cross-context
signal; Notification creates inbox/feed/delivery records after consuming it.
Generated prose is never a command payload. Owning contexts read deterministic
effect intents, validate them in their own policy layer and emit their own
state events.
````

## Supersedes

None.

## Related Docs

- [[../../60-Research/narrative-content-bounded-context-2026-06-02]]
- [[../../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-narrative-content-bounded-context-2026-06-02]]
- [[ADR-0030-llm-out-of-authoritative-state]]
- [[ADR-0043-notification-and-messaging-platform]]
- [[ADR-0052-people-persona-and-skills-context]]
- [[ADR-0054-narrative-context-and-ai-narration-framework]]
- [[ADR-0126-cross-producer-effect-intent-taxonomy]]
- [[../../50-Game-Design/GD-0013-narrative-inbox]]
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../../30-Implementation/ai-narration-contract-testing-framework]]
