---
title: Narrative media and press content bounded-context ownership (FMX-31)
status: draft
tags: [research, narrative, media, press, notification, people, ddd, bounded-context, fmx-31]
context: narrative-dialogue
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-31
sourceType: external
related:
  - [[raw-perplexity/raw-narrative-content-bounded-context-2026-06-02]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../50-Game-Design/GD-0013-narrative-inbox]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../30-Implementation/domain-research-workflow]]
---

# Narrative media and press content bounded-context ownership (FMX-31)

## Question

Who owns **media / press / narrative-content authoring** in FMX: press article
templates, conference response trees, tabloid tone mapping, ICU message keys,
publication policy, deterministic fallback templates and optional LLM
paraphrase controls? Candidate landings:

- **A:** sub-aggregate in Notification / Inbox.
- **B:** Press/Media subdomain inside the proposed Narrative context
  (ADR-0054).
- **C:** sub-aggregate in People / Persona.

## Summary

Decision-ready recommendation: **Option B - extend ADR-0054 Narrative to own
the Press/Media authoring subdomain, not a separate Media context.**
Notification (ADR-0043) remains the accepted delivery/inbox owner; People
(ADR-0052, draft) remains the owner of journalist/persona identity and
`PersonaContextCard` / `DialogueContextCard`; WorldEventDirector and owning
domains provide facts and trigger candidates. Narrative owns storylet selection,
conference response trees, press article templates, tone profiles, publication
policy, deterministic fallback rendering, validation, provenance and optional
LLM provider orchestration. Nico approved this recommended default on
2026-06-02 during the FMX-31 ask-first gate.

## Findings

### F1 — Vault constraints already point away from Notification and People

- **Finding:** ADR-0043 is accepted/binding and explicitly frames Notification
  as a first-party DDD delivery platform: durable notification records,
  preferences, subscriptions, schedules, delivery attempts, provider adapters
  and inbox projections. It does not own content meaning or story logic.
- **Source:** `ADR-0043-notification-and-messaging-platform.md`. **Confidence:**
  high.

- **Finding:** ADR-0052 (draft) places journalists and other media actors in
  People only as persons / actor refs / persona-card sources. It explicitly
  excludes media outlet publication cadence, article delivery and inbox
  persistence. People may supply context; it must not own content authoring.
- **Source:** `ADR-0052-people-persona-and-skills-context.md`. **Confidence:**
  high.

- **Finding:** ADR-0054 already proposes Narrative as the owner of scene /
  storylet selection, `NarrativeContextCard` assembly, fallback templates,
  optional LLM adapter, validation, provenance and evals, while Notification
  delivers and People supplies persona truth. FMX-31 is therefore an extension
  of the existing draft Narrative boundary, not a need for a second Media
  context.
- **Source:** `ADR-0054-narrative-context-and-ai-narration-framework.md`.
  **Confidence:** high.

- **Finding:** ADR-0030 requires every runtime LLM output to remain
  presentation-only. Press/journalist questions are named as an allowed future
  surface only if deterministic fallback, validation, fact grounding,
  provenance, PII minimization and kill-switch/provider-failure handling exist.
- **Source:** `ADR-0030-llm-out-of-authoritative-state.md`. **Confidence:**
  high.

### F2 — Genre evidence favours shallow deterministic response trees

- **Finding:** Public genre evidence for exact internal press systems is weak,
  but management-sim UX patterns are consistent: frequent media interactions
  need reusable prompts, shallow response choices and inbox/news projections.
  Exact Anstoss / FM counts should not be used as design truth without manual
  evidence; the architectural implication is pattern-level only.
- **Source:** Perplexity Q1; FullerFM / Steam community discussion. **Confidence:**
  medium-low for exact internals, medium for pattern.

- **Finding:** A press system should be **wide but shallow**: many contextual
  storylet entry conditions, a small answer-archetype set, deterministic
  mechanics, optional flavour text. Common answer stance shape is safe/neutral,
  supportive/protective and critical/provocative, with occasional follow-up for
  high-risk responses.
- **Source:** Perplexity Q1. **Confidence:** medium.

### F3 — DDD ownership points to Narrative/Media, but FMX should not add a second context

- **Finding:** Narrative/media authoring has a distinct ubiquitous language:
  article, storylet, response tree, tone profile, publication, revision,
  fallback template, context card. Notification's language is delivery; People's
  language is identity/persona. This is the central DDD split signal.
- **Source:** Perplexity Q2; Fowler Bounded Context; Microsoft domain analysis.
  **Confidence:** high.

- **Finding:** Option A (Notification) couples volatile content authoring to
  delivery/retry/channel logic. Option C (People) couples volatile creative
  content to identity/persona/privacy truth. Both are attractive for a thin MVP
  but create semantic drift as press conferences and article publication grow.
- **Source:** Perplexity Q2 + vault ADRs. **Confidence:** high.

- **Finding:** In a greenfield system, a dedicated Narrative/Media bounded
  context would be best-practice. In FMX, ADR-0054 already proposes Narrative
  for exactly the required non-authoritative framework. The better landing is
  **Narrative owns Media/Press as a subdomain**, with no new map row.
- **Source:** Perplexity Q2 + ADR-0054. **Confidence:** high.

### F4 — Storylet authoring gives the deterministic content contract

- **Finding:** Press conferences should be modeled as small storylets with
  preconditions, selection priority/weight, stable IDs, localized question
  keys, bounded response choices, tone tags, effect-intent IDs and replay
  metadata. This avoids global tree explosion and keeps QA/localization
  tractable.
- **Source:** Perplexity Q3; Ink, Yarn Spinner and ICU references. **Confidence:**
  medium-high.

- **Finding:** Logic, text and localization must be separate. Logic owns what
  can happen and what intent/effect is emitted; text owns fallback variants and
  tone profiles; localization owns stable ICU message keys and placeholders.
- **Source:** Perplexity Q3; ICU MessageFormat. **Confidence:** high.

### F5 — Newsroom/CMS analogy separates publish from distribute

- **Finding:** Real editorial systems treat publication as a content lifecycle
  state and downstream delivery as a separate distribution concern. This maps
  cleanly to `PublishPressArticle` / `PressArticlePublished` in Narrative and
  later Notification consumption.
- **Source:** Perplexity Q5; Quintype, Dalet, AP Workflow, Ross Video.
  **Confidence:** medium-high.

- **Finding:** Tone and style guide application are editorial concerns.
  `TabloidToneApplied` should represent an auditable Narrative event /
  content-version state, not Notification formatting.
- **Source:** Perplexity Q5; WAN-IFRA CMS workflow article. **Confidence:**
  medium-high.

### F6 — LLM controls align with ADR-0030 and must be baked into FMX-31

- **Finding:** Optional LLM paraphrase is acceptable only as a renderer over a
  deterministic fallback. The fallback article/conference copy must be complete
  before the provider call. LLM output can replace display copy only after
  schema validation, fact grounding, content-safety checks and provenance
  capture.
- **Source:** Perplexity Q4; OWASP LLM Top 10, NIST AI RMF, ADR-0030.
  **Confidence:** high.

- **Finding:** FMX needs AI-transparency metadata hooks even if the final
  Article 50 disclosure surface stays a legal/Nico gate. Internally every
  display snapshot should know whether it is deterministic-only, LLM-paraphrased
  or fallback-after-failure.
- **Source:** Perplexity Q4; EU AI Act Article 50; ADR-0030. **Confidence:**
  high for architecture hook, legal interpretation remains gated.

## Inputs For Decisions

- **ADR input (ADR-0065):** Recommend **Option B** — ADR-0054 Narrative owns
  Press/Media content authoring as a subdomain. No new bounded context; update
  the context-map proposal text when ADR-0054 / ADR-0065 are ratified.
- **Nico decisions (2026-06-02, HITL):**
  1. **Ownership = Narrative erweitert.** Narrative owns press content,
     response trees, tone library and publication policy; Notification delivers;
     People supplies persona cards.
  2. **Command/event boundary = Narrative publiziert.** `PublishPressArticle`,
     `TriggerPressConference`, `ConferenceResponseSelected` and
     `TabloidToneApplied` live in Narrative; other contexts mutate their own
     authoritative facts in response to effect intents/events.
  3. **Content/LLM contract = strict deterministic.** Template-first, stable
     IDs, ICU keys, schema-validated optional LLM paraphrase, provenance,
     kill-switch and PII-minimized context cards.
- **No new GDDR:** FMX-31 is an ownership/architecture beat. Existing design
  anchors `GD-0013 Narrative, Inbox & Events` and `GD-0018 AI Narrative
  Personas and Dialogue` already cover the gameplay ambition and remain
  unchanged in this PR.
- **Map input:** ADR-0065 includes an order-tolerant patch proposal that extends
  the existing Narrative proposal text and context table language. The map
  itself is not edited until Nico ratifies.

## Future-scope notes

- Exact initial press-content volume (number of storylets, response lines,
  article templates and tone variants) remains a content-production planning
  task, not a boundary decision.
- Exact effect-intent taxonomy (morale, fan sentiment, board pressure, player
  relationships, media reputation) needs a later design/balancing pass with the
  owning contexts.
- UI/authoring tooling (spreadsheet, YAML/JSON, Ink/Yarn import, custom editor)
  is implementation-phase. FMX-31 names the contract shape, not a tool choice.
- AI disclosure surface remains a release/legal gate per ADR-0030. This beat
  only requires provenance metadata and disclosure hooks.
- Assistant delegation of press conferences is a genre UX concern to consider
  later; it does not change ownership.
