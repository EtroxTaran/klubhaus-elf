---
title: AI narration scope freeze and fallback coverage
status: current
tags: [research, ai, llm, narrative, compliance, fallback, fmx-88]
context: narrative-dialogue
created: 2026-06-04
updated: 2026-06-04
type: research
related:
  - [[raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[ai-narration-testing-framework-2026-05-28]]
---

# AI narration scope freeze and fallback coverage (FMX-88)

Grounds FMX-88. Raw capture:
[[raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]].

Promoted source checks:

- EU AI Act Service Desk, Article 50:
  <https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50>
- European Commission draft Article 50 guidelines:
  <https://digital-strategy.ec.europa.eu/en/library/draft-guidelines-implementation-transparency-obligations-certain-ai-systems-under-article-50-ai-act>
- OWASP Top 10 for LLM Applications:
  <https://owasp.org/www-project-top-10-for-large-language-model-applications/>
- NIST AI Risk Management Framework:
  <https://www.nist.gov/itl/ai-risk-management-framework>
- Football Manager match AI and animation:
  <https://www.footballmanager.com/features/match-ai-and-animation>
- Failbetter Games storylet structure:
  <https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two>

## 1. Problem

ADR-0030 and ADR-0054 already keep runtime LLM outside authoritative state, but
the Full Dialogue direction could still sprawl unless the MVP freezes:

- which prose surfaces may use optional LLM enhancement;
- which surfaces stay deterministic/template-only;
- how fallback coverage is proven;
- which legal/compliance artifact gates runtime release.

FMX's manager-game value comes from simulation truth first and narrative
presentation second. Football-manager precedent, event/storylet design and AI
safety practice all point to the same line: the LLM may phrase a scene, never
create the scene's facts, options, effects or state transitions.

## 2. Decisions recorded for FMX-88

Nico selected these planning choices live on 2026-06-04. ADRs/GDDRs remain
`draft`/`proposed` until ratified; this note records the chosen target for the
FMX-88 docs beat.

| # | Decision | Landing |
|---|---|---|
| D1 | Runtime-LLM scope | **Broad Full Dialogue.** Optional LLM prose enhancement may cover all active narrative dialogue/prose surfaces from GD-0018, as long as deterministic facts, intents, options, effects, templates and provenance exist first. |
| D2 | Fallback coverage | **CI manifest.** Every prose point must be listed in a manifest with fallback template, fixture, deterministic render test and provenance assertion. |
| D3 | Article 50 gate | **Nico + external legal/compliance review.** FMX-88 defines the gate; it does not perform the legal review. |
| D4 | Export/share | **No generated-text export/share in MVP.** Future export, social share, public posting or editorial use needs a separate policy and legal review. |

## 3. Frozen MVP surface line

| Surface class | Runtime-LLM posture | Rule |
|---|---|---|
| Player one-to-one, staff advice/disagreement, board scenes, press/journalist questions, fan-rep scenes, agent/transfer flavour | LLM-eligible prose | Only after `DialogueIntent`, domain result, allowed claims and fallback template are fixed. Dialogue option labels and mechanical effects are deterministic. |
| Post-match newspaper/report, injury/event report, weekly summary, selected match ticker key-event wording | LLM-eligible prose | Only over committed facts. Match engine and replay never await or import the LLM layer. |
| Narrative actor voice/tone for players, staff, board contacts, media actors, fan reps and agents | LLM-eligible prose | Persona cards constrain wording; People/Fan/Board/Transfer facts remain owned by their contexts. |
| Tactics commands, match simulation, transfer valuation/acceptance, finance, training, injuries, morale deltas, registrations, scheduling, rules, save/replay/audit logs | Template-only / deterministic | LLM may not generate values, options, rule outcomes, IDs, command payloads or authoritative explanations that the system later parses. |
| UI labels, controls, tutorial/onboarding instructions, legal/privacy/disclosure copy, player choices with mechanical meaning | Template-only / deterministic | Wording must be stable, localisable, accessible and testable. |

This is an MVP freeze, not a provider/model decision. OpenRouter/model routing,
prompt design, cache policy and final cost caps remain separate gated work.

## 4. Fallback coverage manifest

The fallback rule is not a checklist. It is a CI-enforceable planning contract:
no runtime LLM surface can ship unless the manifest proves deterministic
coverage.

Minimum manifest fields:

- `surfaceId`
- `narrativeSceneType`
- `ownerContext`
- `llmEligible`
- `fallbackTemplateId`
- `templateVersion`
- `fixtureIds`
- `allowedFactRefs`
- `forbiddenClaims`
- `provenanceSchemaVersion`
- `disclosureClass`
- `testIds`

Required checks:

- Every `NarrativeSceneType` has at least one fallback template.
- Every LLM-eligible prose point has at least one fixture.
- `LLM_MODE=disabled` renders every fixture without provider access.
- Provider timeout, 429/5xx, malformed response, schema failure, safety
  rejection, budget exhaustion and kill switch all route to the same deterministic
  fallback path.
- Provenance is asserted for both `source: template` and `source: llm`.

## 5. Provenance, telemetry and release gate

Every rendered narrative snapshot needs machine-readable provenance, even if the
player-visible disclosure is first-exposure plus central settings/help rather
than a visible label on every line.

Minimum provenance/telemetry:

- `source: template | llm`
- `aiGenerated`
- `surfaceId`
- `fallbackTemplateId`
- `templateVersion`
- `schemaVersion`
- `promptVersion` when LLM is used
- provider/model ID when LLM is used
- validation status
- fallback reason
- request/cache key
- latency, token/cost counters and budget state
- kill-switch/circuit-breaker state

The **Article 50 Runtime-LLM Release Gate** closes only when Nico and an external
legal/compliance reviewer approve an artifact containing:

- feature scope and jurisdictions;
- first-exposure disclosure copy and persistent settings/help copy;
- accessibility review for that disclosure;
- provider marking/provenance evidence or contractual commitment;
- internal provenance/telemetry design;
- privacy/data-minimization review;
- export/share policy;
- release decision and owner sign-off.

## 6. Genre and real-world takeaways

- Football Manager / Anstoss-style games are simulation-first. Prose presents
  outcomes that structured systems already resolved.
- Paradox event scripting and Failbetter storylets are better analogues than
  freeform AI Dungeon-style generation: state gates, finite options and
  deterministic effects keep the story controllable.
- The safest FMX pattern is three-layered: deterministic simulation -> Narrative
  scene/storylet selection -> optional prose enhancement.
- Article 50 does not settle FMX's product UX by itself. It creates a
  transparency/provenance release gate; legal sign-off decides whether the
  first-exposure + central disclosure posture is enough for the actual shipping
  build.

## 7. Open follow-ups

- Exact first-exposure and settings/help disclosure copy.
- Provider/model routing, ZDR/data-retention posture, pinned model IDs and cache
  policy.
- Final template volume targets and playtest quality thresholds.
- Export/share policy if generated text ever leaves the game client.
- Legal/compliance memo closing the Article 50 gate.

## Related

- [[raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]]
- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../20-Features/feature-ai-narration-mvp-pillar]]
- [[../30-Implementation/ai-narration-contract-testing-framework]]
