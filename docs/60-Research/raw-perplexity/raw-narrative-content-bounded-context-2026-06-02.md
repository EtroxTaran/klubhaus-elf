---
title: Raw research — Narrative media and press content ownership (FMX-31)
status: raw
tags: [research, raw, narrative, media, press, notification, people, ddd, fmx-31]
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-31
sourceType: external
related: [[../narrative-content-bounded-context-2026-06-02]], [[../../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
---

# Raw research — Narrative media and press content ownership (FMX-31)

Raw archive of the five Perplexity research passes run for FMX-31, plus
primary-source anchors used to sanity-check weak or inference-heavy answers.
Lightly condensed; citations preserved. Synthesis lives in
[[../narrative-content-bounded-context-2026-06-02]].

---

## Q1 — Genre best-practice: sports-manager press, interviews and news feed

**Prompt:** Research genre examples for media, press conference, interview,
inbox/news systems in Football Manager, Anstoss / On The Ball, EA Sports FC /
FIFA Career Mode, OOTP and comparable sports sims. Extract implications for
response tree size, deterministic templates vs generated copy, morale / fan /
board effects, tabloid tone, article publication and inbox feed.

**Key findings:**

- Public evidence for exact internal media-system architecture is weak. The
  strongest public signal is genre behaviour: management sims use frequent,
  repeatable media interactions and inbox/news surfaces, which implies reusable
  templates, shallow branching and delegation/automation support rather than
  fully bespoke copy for every event.
- Football Manager community coverage treats media and press interactions as a
  recurring managerial workload. That is useful evidence for UX pressure
  (repetition, delegation, outcome clarity) but not proof of internal data
  structures or exact stat effects.
- The safe genre inference is **wide but shallow**: many context-specific entry
  conditions; a small number of answer archetypes; 2-4 questions per media
  occasion; usually 3 response stances (safe/neutral, supportive, critical or
  provocative); occasional one-step follow-up only for high-risk answers.
- Genre systems commonly expose media through an **inbox/news feed** as well as
  modal interview UI. The feed decouples simulation events from user attention
  and gives press articles a persistent history.
- Media consequences should be small, deterministic effect intents that owning
  contexts interpret: morale, fan sentiment, board pressure, media reputation,
  relationship flags. Generated prose should never be the thing that mechanics
  read.
- Tabloid tone works best as an explicit authored metadata axis
  (`neutral`, `club-friendly`, `hostile`, `tabloid`, `sensational`) that selects
  headline/body variants and affects downstream weighting; it should not be an
  ad-hoc string style in Notification/UI.

**Evidence quality note:** Perplexity surfaced mostly community or secondary
sources for Football Manager and poor primary evidence for Anstoss / On The
Ball. Treat exact counts and internals as low-confidence; use the finding only
as genre-pattern input.

**Citations:** FullerFM on FM media repetition:
<https://fullerfm.com/2025/05/22/fm-logic-media-press-interactions/>; Steam
community discussion on press-conference delegation pressure:
<https://steamcommunity.com/app/3551340/discussions/0/691997051773290819/>.

---

## Q2 — DDD ownership: Notification vs Narrative/Media vs People/Persona

**Prompt:** Research DDD / bounded-context best practices for ownership of
narrative/media content authoring in a game/product: press article templates,
conference response trees, tone libraries, editorial publication workflows and
notification delivery. Compare options A) inside Notification/In-app Inbox,
B) dedicated Narrative/Media bounded context, C) inside People/Persona.

**Key findings:**

- DDD split signal is strong: media/narrative authoring has its own ubiquitous
  language (`article`, `storylet`, `response tree`, `tone profile`,
  `publication`, `revision`, `fallback template`) distinct from Notification's
  delivery language (`channel`, `inbox item`, `schedule`, `read/unread`,
  `delivery attempt`) and People's identity/persona language (`actor`,
  `persona`, `relationship`, `context card`).
- Option A (Notification owner) conflates **publication** with **distribution**.
  It bloats the accepted Notification context, mixes delivery tests with content
  logic and makes content authoring evolve on the same cadence as channel /
  retry / preference logic.
- Option C (People owner) conflates **who speaks / what persona facts are true**
  with **what content exists and how it is authored**. It also drags volatile
  content operations into a privacy/persona context.
- Option B is best-practice: a dedicated Narrative/Media owner exposes published
  contracts and read models; Notification consumes delivery-ready display
  snapshots; People supplies actor/persona cards through public queries.
- FMX-specific translation: because ADR-0054 already proposes a Narrative
  context, FMX-31 should not add a second "Media" context. It should extend
  Narrative to own the Press/Media authoring subdomain.

**Citations:** Martin Fowler, Bounded Context:
<https://martinfowler.com/bliki/BoundedContext.html>; Microsoft architecture
guidance on domain analysis and bounded contexts:
<https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis>;
Context Mapper / DDD context mapping overview:
<https://ozimmer.ch/modeling/2022/11/23/ContextMapperInsights.html>.

---

## Q3 — Interactive narrative authoring: storylets, dialogue trees and QA

**Prompt:** Research best practices for interactive narrative authoring systems
applicable to press conferences: storylets/preconditions, dialogue trees,
shallow branching, response options, deterministic replay, localization via
stable message keys / ICU, tone variants, content validation, narrative QA and
authoring workflow.

**Key findings:**

- Press conferences fit a **storylet** model better than one giant dialogue
  tree. Each content unit declares preconditions, context, repeat policy,
  priority/weight, a localized journalist line and a bounded choice set.
- Branching should stay shallow and rejoin quickly. Local branches with stable
  IDs are easier to QA, localize and replay than global trees.
- Logic, text and localization must be separated:
  - logic owns storylet eligibility and effect intents;
  - text owns tone variants and message keys;
  - localization owns ICU message rendering and placeholders.
- Domain data should include: `PressStorylet`, `ConferenceQuestion`,
  `ConferenceResponseOption`, `ToneProfile`, `MessageKey`, `SelectionPolicy`,
  `DeterministicSeed`, `ReplayRecord` and `ContentValidationReport`.
- Validation/linting is not optional: duplicate IDs, invalid tags, missing ICU
  keys, unsatisfied placeholders, unreachable storylets, empty choice sets and
  conflicting effect intents should fail content checks before release.
- Deterministic replay records should store storylet IDs, response IDs, seed,
  resolved argument values and effect-intent IDs, never rely on displayed prose.

**Citations:** Inkle Ink official repository and language overview:
<https://github.com/inkle/ink>; Yarn Spinner options documentation:
<https://yarnspinner.dev/docs/yarn/02-fundamentals/02-options/>; Twine
homepage: <https://twinery.org/>; ICU MessageFormat user guide:
<https://unicode-org.github.io/icu/userguide/format_parse/messages/>.

---

## Q4 — LLM controls: deterministic fallback, validation, provenance and safety

**Prompt:** Research best practices for optional LLM-generated press articles /
dialogue in a deterministic game where LLM output must never become
authoritative state. Cover deterministic fallback templates, structured output
validation, fact grounding, provenance/logging, prompt injection, content
safety, privacy/PII minimization, EU AI Act Article 50, caching/versioning,
kill switch and provider fallback.

**Key findings:**

- The architecture must treat LLMs as an optional **renderer**, not a controller.
  Authoritative facts and effects are computed first; the deterministic
  fallback template is always renderable; generated text may only replace
  display copy after validation.
- Structured outputs should be schema-validated and fact-checked against
  context cards. Output that introduces unknown actors, unsupported numbers or
  forbidden claims is rejected or replaced by the template fallback.
- Prompt payloads should be PII-minimized. FMX already has the correct posture:
  no real user data, secrets, raw user-authored free text or real-world football
  names in prompts; use placeholder tokens and local substitution.
- Every generated display snapshot needs provenance: template ID, prompt/schema
  version, model/provider metadata, context-card versions, validation result,
  fallback reason and `aiGenerated` flag.
- Prompt-injection tests must treat player-created names, outlet names,
  slogans and imported overlay text as untrusted quoted content.
- The release path needs kill switches and provider fallback, but provider
  fallback cannot be required for gameplay progress; template fallback is the
  terminal fallback.
- Article 50 / AI transparency must be handled as a release/legal gate. The
  architecture should expose metadata and user-facing disclosure hooks, but the
  legal sufficiency of a settings/info-only disclosure remains a Nico/legal
  decision.

**Citations:** OWASP Top 10 for LLM Applications:
<https://owasp.org/www-project-top-10-for-large-language-model-applications/>;
NIST AI Risk Management Framework:
<https://www.nist.gov/itl/ai-risk-management-framework>; EU AI Act Article 50:
<https://ai-act-law.eu/article/50/>; OpenAI structured outputs guide:
<https://platform.openai.com/docs/guides/structured-outputs>.

---

## Q5 — Newsroom / CMS analogue: publish vs distribute

**Prompt:** Research real-world newsroom/editorial CMS workflows relevant to
modelling press articles: editorial ownership of story ideas, article
templates, tone/style guides, publication workflow, revision/version/audit,
publish vs distribute separation, event-driven downstream channels such as
inbox/feed/notifications.

**Key findings:**

- Real newsroom/CMS systems distinguish editorial content lifecycle from
  downstream distribution. A story/article moves through pitch/planning,
  drafting, edit/review, approval, publication and then channel distribution.
- Publication is a domain state transition: a specific article/version becomes
  official. Distribution is a downstream process: web feed, app feed, inbox,
  push, newsletter or social channels react to a published article.
- Templates, tone/style policies and versioning/audit are editorial concerns.
  Applying tabloid tone should create a versioned/auditable content
  transformation before publication, not a Notification-side formatting trick.
- `PublishPressArticle` should be a Narrative command that validates article
  readiness, tone policy, required metadata and deterministic fallback coverage.
  It emits `PressArticlePublished`; Notification reacts later.
- `TriggerPressConference` creates an interactive media occasion from domain
  facts / prior coverage; `ConferenceResponseSelected` records the manager's
  deterministic choice and may trigger new article ideas or effect intents.
  `TabloidToneApplied` is an editorial event that changes article/tone
  provenance and downstream weighting.

**Citations:** Quintype newsroom workflow:
<https://blog.quintype.com/product/newsroom-workflow-managing-the-process-on-your-cms>;
Dalet story-centric newsroom workflow:
<https://dalet.com/blog/align-newsroom-technology-journalistic-outcomes/>;
WAN-IFRA on CMS + AI newsroom workflows:
<https://wan-ifra.org/2026/04/cms-ai-newsroom-workflows-integration/>;
AP Workflow sectors:
<https://workflow.ap.org/sectors/>; Ross Video MOS newsroom workflows:
<https://www.rossvideo.com/use-cases/mos-newsroom-workflows/>.
