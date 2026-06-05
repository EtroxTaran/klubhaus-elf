---
title: Dialogue intent taxonomy and effect matrix
status: current
tags: [research, narrative, dialogue, intents, effects, football, ddd, fmx-87]
created: 2026-06-05
updated: 2026-06-05
type: research
related:
  - [[raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../50-Game-Design/GD-0027-dialogue-intent-taxonomy-effect-matrix]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
---

# Dialogue intent taxonomy and effect matrix (FMX-87)

Grounds FMX-87 / gap G13. Raw capture:
[[raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]].

Promoted source checks:

- Football Manager interaction logic:
  <https://www.footballmanager.com/features/individual-player-targets-and-interaction-logic>
- Football Manager intermediaries / agent market-interest surface:
  <https://www.footballmanager.com/features/introducing-intermediaries-and-offloading-players>
- Football Manager supporter confidence:
  <https://www.footballmanager.com/features/supporter-confidence>
- FIFA agents:
  <https://inside.fifa.com/en/transfer-system/agents/faq-agents> and
  <https://inside.fifa.com/transfer-system/agents>
- Failbetter storylet structure:
  <https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two>
  and
  <https://www.failbettergames.com/news/storynexus-developer-diary-2-fewer-spreadsheets-less-swearing>
- GameDeveloper dialogue systems:
  <https://www.gamedeveloper.com/design/defining-dialogue-systems>
- Microsoft DDD events:
  <https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation>
  and
  <https://learn.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/integration-event-based-microservice-communications>

## 1. Problem

GD-0018 already says dialogue is intent-based and generated prose cannot create
facts or effects. ADR-0030 and ADR-0054 reinforce that boundary, but no note
defines the closed `DialogueIntent` set, the availability rules or the mapping
from chosen intent to authoritative effect owner.

The missing layer is:

```text
eligible scene
  -> deterministic intent options
  -> player selects DialogueIntent
  -> owning domain validates/applies effect
  -> owning domain emits result event
  -> Narrative renders follow-up prose read-only
```

FMX-87 closes that design/contract gap as a draft GDDR, not as executable
implementation authority.

## 2. Decisions recorded for FMX-87

Nico selected these planning choices live on 2026-06-05. The linked GDDR remains
`draft` / `binding: false` until ratified.

| # | Decision | Landing |
|---|---|---|
| D1 | Surface scope | **Broad MVP.** Player, staff, board, press/media, fan-rep and agent surfaces all receive closed intent families. |
| D2 | Effect precision | **Bands.** The GDDR locks effect direction and band (`minor` / `moderate` / `major` / `critical`), not exact numeric deltas. |
| D3 | Persona influence | **Gate plus bounded scale.** Persona and relationship state may gate availability and explicitly scale effects; the owning domain still resolves the command. |

## 3. Game and real-world takeaways

- Sports-management precedent uses finite menus, not free text. Even agent,
  player and press interactions reduce to structured choices with context and
  personality-dependent reactions.
- Football Manager's official interaction notes are especially relevant: player
  targets/promises, player personality, manager relationship, agent negotiation
  and clearer response severity all confirm that the design problem is
  structured interaction logic, not better prose alone.
- Real football communication affects morale, trust, status, public pressure,
  board confidence, agent posture, supporter sentiment and promises. It does
  not justify prose directly changing simulation state.
- Storylet precedent fits FMX: state gates eligible content; choices change
  qualities/effects through explicit rules; text renders the result.
- DDD event practice maps cleanly: Narrative may emit a selected-intent command
  request, but authoritative contexts own validation, mutation and result
  events after their transaction succeeds.

## 4. FMX design conclusions

- `DialogueIntent` is a gameplay token, not a rendered sentence.
- Narrative owns scene selection, intent surfacing, fallback/LLM phrasing,
  validation and provenance. It applies no morale, trust, pressure, relationship
  or transfer-readiness deltas.
- Each intent maps to one primary effect owner. Secondary propagation must be a
  published event from that owner or a downstream consumer reaction, never a
  hidden Narrative side effect.
- Persona gates should be visible enough to explain why an option appears or is
  unavailable. Persona scaling is bounded and explicit; no implicit "all
  dialogue is stronger for charismatic actors" rule.
- Effect bands are enough for GDDR acceptance. Exact numbers, thresholds,
  diminishing returns and cooldowns are FMX-52 calibration inputs.
- Promises are first-class outcomes. Any intent that sounds like a role,
  minutes, contract, transfer, board or fan commitment must create a typed
  promise/commitment object owned by the relevant domain.
- Contradictions across surfaces are part of the system. Publicly backing a
  player and privately forcing a sale, or promising patience to fans while
  raising board targets, should be detectable as deterministic consistency
  facts.

## 5. Open follow-ups

- FMX-52 calibration owns exact effect magnitudes, caps, decay and
  diminishing-return values.
- ADR-0052 ratification still controls the final People / Persona context
  boundary; FMX-87 keeps persona gates/modifiers as a proposed interface until
  that boundary is accepted.
- FMX-82 media-outlet behavior will tune outlet cadence, reach and stance over
  the press/media intent outcomes.
- Future UI/content work must author fallback copy and tests for each intent in
  the `FallbackCoverageManifest`.

## Related

- [[raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
- [[../50-Game-Design/GD-0027-dialogue-intent-taxonomy-effect-matrix]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[../20-Features/feature-ai-narration-mvp-pillar]]

