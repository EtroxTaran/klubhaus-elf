---
title: "RAW - AI narration scope freeze and fallback coverage"
status: raw
tags: [research, raw, perplexity, ai, llm, narrative, compliance, fallback, fmx-88]
created: 2026-06-04
updated: 2026-06-04
type: research
related:
  - [[../ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
  - [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
---

# RAW Perplexity capture - AI narration scope freeze and fallback coverage (FMX-88)

> Unprocessed research capture and source notes. Synthesised into
> [[../ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]].
> Do not implement from raw. Captured 2026-06-04 via Perplexity Sonar plus
> targeted source checks.

## Prompt 1 - EU AI Act Article 50

System: senior EU AI Act compliance researcher; prefer official EU sources,
then reputable legal analysis; cite concrete URLs; keep quotes short and
summarize implications for a fictional football manager game with optional
AI-generated in-game narrative text.

User: research current EU AI Act Article 50 transparency obligations for optional
runtime LLM-generated narrative text in a video game. Focus on when users must be
informed, whether per-output labels are required for fictional in-game prose,
machine-readable marking/provenance expectations, whether public export/share of
generated text changes obligations, and what release-gate artifact a game team
should require before enabling runtime LLM.

## Captured answer 1 - Summary

- Perplexity classified optional runtime LLM narration as an Article 50
  transparency topic because the player interacts with an AI-enabled system and
  synthetic text is generated.
- Article 50(1) requires informing users that they are interacting with an AI
  system unless this is obvious in context. Article 50(5) says the information
  must be clear, distinguishable, accessible and given no later than first
  interaction or exposure.
- Article 50(2) requires AI-generated synthetic text outputs to be
  machine-readable and detectable as artificial/manipulated content. Perplexity
  framed this as provider-side marking plus deployer-side preservation of
  provenance/metadata where available.
- Article 50(4) text disclosure is focused on text published to inform the
  public on matters of public interest. Perplexity did not find support for
  requiring a visible human-facing label on every fictional in-game prose item,
  but recommended conservative first-exposure disclosure plus a central
  settings/help surface.
- Export/share changes the risk profile. Pure in-game fictional text remains
  entertainment, but game-team publication of AI text outside the game,
  especially if informative about real-world football, should trigger a separate
  policy and legal review.
- Recommended release-gate artifact: legal/product memo, provider compliance
  evidence, first-exposure UX copy, provenance/marking plan, content-scope note,
  export/share policy and named owner review.

## Targeted legal-source checks

- EU AI Act Service Desk, Article 50:
  <https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50>
  records the direct-interaction notice, machine-readable marking/detectability,
  deepfake/text publication disclosure, first-exposure/accessibility timing and
  code-of-practice hooks.
- European Commission draft Article 50 guidelines:
  <https://digital-strategy.ec.europa.eu/en/library/draft-guidelines-implementation-transparency-obligations-certain-ai-systems-under-article-50-ai-act>
  were used as evolving guidance only. They are not a substitute for legal
  review.

## Prompt 2 - Optional LLM fallback and resilience

System: senior AI safety and platform resilience architect; prefer primary
sources such as OWASP, NIST, vendor docs and standards bodies; use reputable
engineering sources only when primary sources do not cover the pattern.

User: research best practices for optional LLM systems in games/apps where
deterministic fallback output must cover every prose surface and generated text
must never mutate authoritative state. Focus on fallback coverage manifests,
CI-verifiable fixtures, kill switches, budgets, provenance/telemetry, prompt
injection/fact grounding, provider timeouts/schema failures, and how to keep the
LLM non-authoritative.

## Captured answer 2 - Summary

- Treat the LLM as a side-effect-free presentation wrapper over deterministic
  view-model/context-card data. The model may change phrasing, not facts,
  choices, effects or authoritative state.
- Maintain a machine-readable prose-surface/fallback manifest in version control.
  Every prose surface must declare a deterministic fallback and whether LLM
  enhancement is allowed.
- CI should run an LLM-disabled render path and fixture-driven tests for every
  surface. Provider timeout, 429/5xx, malformed JSON, schema failure, safety
  rejection and budget exhaustion all fall back.
- Use global and per-surface kill switches, request/token budgets, circuit
  breakers and short UX-appropriate timeouts.
- Provenance/telemetry should capture surface ID, provider/model when used,
  prompt/template/schema versions, validation result, fallback reason, latency,
  token/cost counters and kill-switch/budget state without storing sensitive raw
  user content.
- Prompt-injection/fact-grounding controls require minimized prompts, explicit
  forbidden claims, strict schemas, validators and a one-way flow from
  authoritative facts to generated copy.

## Targeted AI-safety source checks

- OWASP Top 10 for LLM Applications:
  <https://owasp.org/www-project-top-10-for-large-language-model-applications/>
  used for prompt injection, sensitive information disclosure and output
  handling risk framing.
- NIST AI Risk Management Framework:
  <https://www.nist.gov/itl/ai-risk-management-framework>
  used for risk governance, measurement and monitoring framing.
- Perplexity also cited LLMOps fallback/circuit-breaker articles and a
  KG-first/LLM-fallback paper; these are useful engineering analogues but are
  not promoted as binding standards.

## Prompt 3 - Football manager and narrative-game precedents

System: senior game designer and systems researcher. Compare real football
manager games and narrative game systems. Cite concrete sources where possible
and distinguish confirmed public mechanics from design inference.

User: analyze real-world football-manager game precedents and narrative-game
precedents for AI-assisted narrative in Football Manager X. Compare Football
Manager / Anstoss-style simulation-first design, Paradox/Crusader Kings/Stellaris
event scripting, Failbetter storylets and AI Dungeon-style generative text.
Recommend which FMX surfaces can allow optional LLM prose enhancement and which
should stay deterministic/template-only for a mobile-first offline-ready manager
game.

## Captured answer 3 - Summary

- Football-manager precedent is simulation-first: outcomes, AI manager decisions
  and match events are computed by structured systems; prose explains them.
- Paradox-style events and Failbetter storylets support the same design pattern:
  state-gated narrative modules with authored triggers/options/effects. This is
  compatible with deterministic saves and offline play.
- AI Dungeon-style open generation is the wrong primary model for FMX because it
  trades auditability and repeatability for freeform prose.
- LLM-eligible surfaces should be low-risk presentation layers over committed
  facts: post-match reports, press/journalist wording, board/staff/player/fan
  dialogue prose, agent flavour, weekly summaries and selected match ticker
  key-event wording.
- Template-only/deterministic surfaces should include match simulation, tactics
  commands and effects, transfer valuation/acceptance, injuries/fitness, finance,
  competition rules, scheduling, save/replay/audit logs and any user-facing
  option text whose wording carries mechanical meaning.

## Targeted game-source checks

- Football Manager match AI and animation:
  <https://www.footballmanager.com/features/match-ai-and-animation>
  used as current public evidence that the genre communicates simulation logic
  through structured match/AI systems rather than freeform prose.
- Failbetter Games on storylets:
  <https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two>
  used as the storylet/source-gated narrative precedent already aligned with
  FMX's narrative content pipeline.

## Decisions captured from Nico

| # | Decision | Captured choice |
|---|---|---|
| D1 | Runtime-LLM scope | Broad Full Dialogue: all active narrative prose surfaces are eligible for optional LLM enhancement, while all facts/intents/effects/options remain deterministic. |
| D2 | Fallback coverage mechanism | CI manifest: every `NarrativeSceneType` needs fallback template, fixture, deterministic render test and provenance assertion. |
| D3 | Article 50 gate owner | Nico plus external legal/compliance review closes the release gate. |
| D4 | Export/share posture | No generated-text export/share in MVP; future export needs policy and legal review. |

## Research caveats

- This is not legal advice. Article 50 guidance, codes of practice and technical
  marking standards are still evolving; the vault should keep the release gate
  open until Nico and a legal/compliance reviewer close it.
- Perplexity returned some non-primary citations. The synthesis promotes only
  claims supported by the official/current source checks above or by already
  established FMX vault research.

## Related

- [[../ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
- [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
