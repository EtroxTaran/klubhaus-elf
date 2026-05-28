---
title: AI Narration, World and Dialogue MVP Synthesis 2026-05-28
status: current
tags: [research, ai, llm, narrative, dialogue, worldgen, persona, media, fans, openrouter, ai-act]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-3
sourceType: synthesis
related:
  - [[ai-narrative-runtime-integration]]
  - [[raw-perplexity/raw-ai-narration-mvp-research-2026-05-28]]
  - [[raw-perplexity/raw-ai-narration-compliance-safety-2026-05-28]]
  - [[raw-perplexity/raw-ai-narration-evaluation-testing-2026-05-28]]
  - [[raw-perplexity/raw-ai-narration-security-testing-2026-05-28]]
  - [[raw-perplexity/raw-ai-narration-interactive-narrative-qa-2026-05-28]]
  - [[raw-perplexity/raw-ai-world-persona-generation-2026-05-28]]
  - [[ai-narration-testing-framework-2026-05-28]]
  - [[raw-perplexity/raw-ai-llm-usage]]
  - [[raw-perplexity/raw-character-personality-and-dialogue]]
  - [[eos-player-staff-skills-and-personas-2026-05-28]]
  - [[data-generators]]
  - [[narrative-content-pipeline]]
  - [[fan-culture-segmentation-research]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
---

# AI Narration, World and Dialogue MVP Synthesis 2026-05-28

## Question

What must FMX define so AI-assisted narration can be ready for MVP as the
emotional world-building layer, while keeping simulation state deterministic,
IP-clean, testable and safe?

## Summary

The vault was clear on the boundary but not on the MVP ambition. It already
said generated prose must never create facts, templates remain mandatory and
OpenRouter is the preferred experiment path. It was **not** clear enough for
Nico's updated goal: **Full Dialogue** and **All Active** actor classes in the
MVP. This note promotes that direction into a single research synthesis. The
MVP should generate a complete fictional social world - players, staff, board,
media outlets, journalists, fan groups, fan reps and agents - as deterministic
structured data first. Runtime LLM then becomes a validated presentation layer
over `NarrativeContextCard` contracts, never an authority.

Follow-up research on 2026-05-28 closes the framework gap: the draft MVP target
now includes a proposed **Narrative bounded context**, a contract/evaluation
framework and Nico's selected **Playtest First** quality posture. Playtest First
means emotional believability is tuned through structured playtests early, while
state isolation, fallback coverage, safety/privacy, provenance and disclosure
remain hard gates.

## Nico direction captured

- AI narration is an MVP pillar because it creates the world, emotion and
  memory of a save.
- MVP scope is **Full Dialogue**, not only async summaries or ticker flavour.
- MVP actor depth is **All Active**: player, staff, board, journalist/media,
  fan group/fan rep and agent surfaces all need generated persona context.
- Disclosure posture is **First Exposure**: clear first-use disclosure plus
  central info/settings, with machine-readable provenance on every generated
  output.
- Architecture posture is **Narrative Context**: narration framework ownership
  should be separate from Notification delivery and People persona truth.
- Testing posture is **Playtest First**: playtest evidence drives quality
  thresholds, but runtime LLM cannot bypass contract, fallback, safety or
  disclosure gates.
- If provider/privacy/model constraints block this shape, escalate with options
  instead of silently shrinking the design.

## What is already clear

- **Authoritative facts stay deterministic.** Scores, injuries, transfers,
  finances, morale deltas, board pressure, fan mood and relationship changes
  are created by owning domains.
- **Generated text is presentation only.** It may phrase, summarize and give
  voice. It may not create, correct or mutate simulation facts.
- **Dialogue is intent-based.** Mechanical outcomes read the selected
  `DialogueIntent` and deterministic actor policies, not the text string.
- **Templates are complete fallback.** The game must remain playable and
  emotionally coherent with LLM disabled, offline, over budget or invalid.
- **No clear user data in prompts.** Prompt payloads use fictional generated
  facts and placeholders for user-authored names.

## Gaps this beat closes

| Gap | Previous state | MVP target |
|---|---|---|
| Runtime scope | Async flavour first; press/player talks future | Full controlled dialogue in MVP |
| Actor classes | Players/staff first; board/media/fans later | All active actor classes generated and context-card capable |
| Fan groups | Six aggregate segments, named groups later | Six segments plus named fan groups/fan reps for dialogue and media |
| Media | Journalist as future persona surface | Media outlets and recurring journalists generated at world creation |
| Context assembly | `PersonaContextCard` sketch | Full `NarrativeContextCard` contract with facts, actors, memory, intents and forbidden claims |
| Testing | Adapter/fact-check tests listed | Full narrative evaluation corpus, safety gates, cost gates and long-season drift tests |
| Compliance | Central disclosure preference | First exposure notice plus machine-readable provenance and legal review gate |
| Ownership | Orchestrator sketched inside ADR-0030 | Dedicated Narrative context owns scenes, templates, validation, provenance, evals and provider adapter |

## MVP actor world model

The generator creates these active actor classes:

| Actor | Canonical owner | MVP generated profile |
|---|---|---|
| `player` | Squad & Player for football facts; People for persona | 16+4+8 attributes, skill/perk profile, hidden persona substrate, football labels, goals, relationships |
| `staff` | Staff/owning sporting domains for capability; People for persona | role, expertise, authority, work style, football philosophy, people labels |
| `board_contact` | Club/Governance for KPIs and authority; People for persona | patience, risk, time horizon, objective weights, communication style |
| `media_outlet` | Narrative/Media catalog; not People-as-person | reach, audience, cadence, reliability, sensationalism, editorial stance |
| `journalist` | People for persona; Narrative/Media for publication surface | beat, outlet link, stance, fairness, tone, relationship to club/manager |
| `fan_segment` | Fan Ecology | six existing segments with population, mood, volatility, economic outputs |
| `fan_group` | Fan Ecology for segment facts; People/Narrative for representative surface | name, segment, identity, red lines, mobilization style, influence |
| `fan_rep` | People for persona; Fan Ecology for represented segment | role, temperament, agenda, trust, negotiation style |
| `agent` | Transfer/Contracts for deal facts; People for persona | client list, negotiation style, pressure tactics, trust, media leakage risk |

Media outlets and fan groups are not "people", but they need stable generated
identity because journalists, fan reps and newspaper output reference them.

## Persona and values model

FMX should use a mixed model:

- **Internal substrate:** compact OCEAN-style scores plus role-specific
  motivators and stress responses.
- **Football labels:** professional, ambitious, volatile, loyal, demanding,
  relaxed, leader, mentor, loner, clique-builder, media-friendly,
  conflict-prone, adaptable.
- **Values:** trophies, money, status, loyalty, stability, development,
  community, tradition, style, financial prudence.
- **Conflict style:** avoidant, diplomatic, confrontational, transactional,
  loyalist.
- **Stress triggers:** role demotion, contract uncertainty, derby losses, media
  criticism, losing streaks, board pressure, fan protests.

OCEAN and values are never shown raw. They derive labels, dialogue tone,
relationship tendencies and deterministic intent effects through People
policies.

## Narrative context contract

The MVP bridge from simulation to templates/LLM is:

```text
NarrativeContextCard
  sceneId
  sceneType
  locale
  worldSeedRef
  authoritativeFacts[]
  actorCards[]
  relationshipEdges[]
  narrativeMemorySnippets[]
  allowedIntents[]
  forbiddenClaims[]
  fallbackTemplateId
  toneAndVoice
  safetyPolicyId
  tokenBudget
  cacheSignature
```

Required principles:

- `authoritativeFacts` are domain-owned facts, not prose summaries alone.
- `forbiddenClaims` explicitly ban unsupported scores, injuries, promises,
  transfers, contracts, sanctions, morale deltas and relationship changes.
- `allowedIntents` are the only inputs game mechanics may read after the
  player chooses.
- `narrativeMemorySnippets` are compact, event-backed summaries selected from
  season memory. They do not grant permission to contradict current facts.
- The same card can feed templates, LLM and evaluation fixtures.

## Narrative Orchestrator target

ADR-0030 should describe a non-authoritative Narrative Orchestrator, and
ADR-0054 should place it inside a proposed Narrative bounded context:

- selects eligible scenes and speakers;
- builds `NarrativeContextCard` from domain read models;
- renders the fallback template;
- calls the provider adapter when enabled and budget allows;
- validates schema, facts, safety, repetition and persona consistency;
- stores presentation snapshots with provenance;
- exposes kill-switch and fallback status to UI.

It does not own match facts, player state, fan segment state, board decisions,
transfer decisions, relationship mutations or economy facts.

The detailed contract/evaluation framework lives in
[[../30-Implementation/ai-narration-contract-testing-framework]].

## LLM provider posture

OpenRouter remains the preferred experimental path because it gives one adapter
for provider/model iteration. Current docs confirm:

- structured outputs can use JSON Schema with strict mode on compatible models
  (`response_format` / SDK `responseFormat`);
- provider routing can restrict data collection (`data_collection: "deny"`);
- ZDR routing can require zero-data-retention endpoints (`provider.zdr: true`);
- model fallback can be expressed with a `models` list;
- usage/limit checks are available through key/usage APIs.

MVP defaults:

- Backend-only adapter; never expose provider keys to the client.
- Pinned model IDs before implementation, no floating "latest".
- `data_collection: "deny"` and ZDR where feasible.
- Hard timeout and one retry maximum.
- Per-surface, per-save and monthly cost caps.
- Model/provider changes require regression evaluation and Nico approval.

## MVP surfaces

| Surface | MVP behavior |
|---|---|
| Post-match report/newspaper | Full template baseline plus optional validated LLM voice |
| Key-event ticker | Goals, major chances, cards, injuries, substitutions, half-time and full-time only |
| Player one-to-one | Controlled intent dialogue for morale, promises, role and conflict scenes |
| Staff dialogue | Advice, disagreement, scouting/training/medical context, no hidden domain mutation |
| Board meeting | KPI explanations, warnings, expectations, budget/pressure scenes |
| Press/journalist | Recurring journalists, outlet angle, generated questions, intent answers |
| Fan-rep meeting | Segment/group identity, protests, praise, ticket/tradition concerns |
| Weekly summary | Season arc memory, relationship highlights, risks and opportunities |

Free-form chat is not MVP. The UI can feel conversational, but the system is
choice- and intent-based.

## Testing and evaluation requirements

- **Contract tests:** context-card schema, output schema, fallback ID,
  provenance fields and forbidden-claim lists.
- **Architecture tests:** no provider SDK/http calls in authoritative contexts
  or match-engine/replay paths.
- **Fact tests:** generated text cannot invent or contradict score, scorers,
  injuries, transfers, contracts, promises, sanctions, morale or finances.
- **Dialogue tests:** player talk, staff meeting, board meeting, press
  question, fan-rep meeting and agent call.
- **Long-season tests:** same actor remains coherent across at least one
  simulated season; stale memories are retired or refreshed.
- **Safety tests:** prompt injection through generated names, unsafe fan/media
  speech, malformed provider output, timeout, 429/5xx, over-budget and
  provider unavailable.
- **Quality tests:** repetition, persona drift, fallback rate, contradiction
  rate, narrative memory relevance and locale/tone fit.
- **Compliance tests:** first-exposure disclosure, central AI info/settings,
  machine-readable provenance, no raw user data in prompts, provider settings
  and kill switch.
- **Playtest tests:** structured human review for emotional specificity,
  recurring-actor recognisability, memory usefulness, repetition and whether
  the player can retell "what happened in my save".

## Open decisions for Nico

- Final actor counts per world size: number of outlets, journalists, named fan
  groups, fan reps and agents.
- Exact persona scales, relationship thresholds and decay/cooldown policies.
- Exact `DialogueIntent` taxonomy and deterministic effect matrix.
- Provider/model selection, budgets, latency caps and retention posture after
  model-specific docs are verified.
- Legal sufficiency of first-exposure plus central disclosure under Article 50.
- Whether any generated text may be exported/shared externally in MVP; if yes,
  export provenance needs a visible and machine-readable marking policy.
- Final quantitative release thresholds for contradiction rate, fallback rate,
  persona drift, repetition and unsafe-output rejection after the first
  playtest corpus establishes a baseline.

## Source links

- OpenRouter structured outputs:
  <https://openrouter.ai/docs/guides/features/structured-outputs>
- OpenRouter provider routing:
  <https://openrouter.ai/docs/guides/routing/provider-selection>
- OpenRouter ZDR:
  <https://openrouter.ai/docs/guides/features/zdr>
- EU AI Act Article 50:
  <https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50>
- European Commission AI Act overview:
  <https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai>
- OWASP Top 10 for LLM Applications:
  <https://owasp.org/www-project-top-10-for-large-language-model-applications/>
- NIST AI RMF Generative AI Profile:
  <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- Generative Agents:
  <https://arxiv.org/abs/2304.03442>
- Player-Driven Emergence in LLM-Driven Game Narrative:
  <https://arxiv.org/pdf/2404.17027>
- Microsoft Research on AI-assisted game narratives:
  <https://www.microsoft.com/en-us/research/blog/players-creators-and-ai-collaborate-to-build-and-expand-rich-game-narratives/>
- OpenAI evaluation best practices:
  <https://platform.openai.com/docs/guides/evaluation-best-practices>
- Vitest browser mode:
  <https://vitest.dev/guide/browser/>
- Zod 4:
  <https://zod.dev/v4>
- fast-check:
  <https://fast-check.dev/docs/ecosystem>
- Failbetter storylet model:
  <https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two>

## Promotion path

1. Update [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]] to
   make Full Dialogue the draft MVP direction.
2. Update [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
   to define Narrative Orchestrator and provider/compliance gates.
3. Add [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
   for the dedicated Narrative context and ownership split.
4. Add [[../30-Implementation/ai-narration-contract-testing-framework]] for
   contract, eval, safety and Playtest First gates.
5. Update [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]] and
   [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
   so All Active actor classes are planned as MVP context-card inputs.
6. Add [[../20-Features/feature-ai-narration-mvp-pillar]] and connect the MVP
   roadmap.
7. Keep all records `draft` / `binding: false` until Nico ratifies the final
   ADR/GDDR set.

## Related

- [[ai-narrative-runtime-integration]]
- [[narrative-content-pipeline]]
- [[data-generators]]
- [[ai-narration-testing-framework-2026-05-28]]
- [[eos-player-staff-skills-and-personas-2026-05-28]]
- [[fan-culture-segmentation-research]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
- [[../20-Features/feature-ai-narration-mvp-pillar]]
- [[../30-Implementation/ai-narration-contract-testing-framework]]
- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
