---
title: "RAW - Dialogue intent taxonomy and effect matrix"
status: raw
tags: [research, raw, perplexity, narrative, dialogue, intents, effects, football, ddd, fmx-87]
created: 2026-06-05
updated: 2026-06-05
type: research
related:
  - [[../dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - [[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../../20-Features/feature-ai-narration-mvp-pillar]]
---

# RAW Perplexity capture - dialogue intent taxonomy and effect matrix (FMX-87)

> Unprocessed research capture and source notes. Synthesised into
> [[../dialogue-intent-taxonomy-effect-matrix-2026-06-05]].
> Do not implement from raw. Captured 2026-06-05 via Perplexity Sonar,
> targeted source checks and vault review.

## Prompt 1 - Comparable sports-manager game dialogue systems

System: football-management game design researcher. Separate real-world
football practice, comparable game precedent and design implications.

User: research current and historical football-management/sports-management game
dialogue systems relevant to manager-player, manager-board, press conference and
agent/transfer-talk interactions. Include Football Manager, EA FC Career Mode,
OOTP/EHM and older Anstoss/FIFA Manager style precedents where documented. Focus
on finite intents/options vs free text, player-visible surfaces, mechanical
effects and what should be deterministic rather than prose-driven.

## Captured answer 1 - Summary

- Major sports-management games use finite menu choices, not free-text
  mechanics. Where tone exists, it is another finite axis over a fixed intent.
- Football Manager is the strongest reference: player targets, promises,
  interaction context, player personality, manager relationship and agent
  interaction affect reactions; the exact wording is presentation.
- EA FC Career Mode is lighter: canned player/press choices usually map to
  direct morale or manager-rating consequences.
- OOTP/EHM show the action-as-intent pattern: contract role, roster status,
  ice-time or playing-time promises can drive morale/personality reactions even
  without rich dialogue trees.
- Older Anstoss/FIFA Manager style systems use event + response options with
  immediate morale/happiness/reputation effects.
- Best-practice implication: FMX should model `intent + surface + tone/context`
  as the causal input; prose and optional LLM output can paraphrase it but never
  decide the state change.

## Prompt 2 - Real-world football communication surfaces

System: football operations and product researcher. Separate real-world
practice, comparable game precedent and design implications.

User: research real-world football manager communication surfaces and
consequences: player one-to-one/team talks, board meetings, press
conferences/media handling, agents/transfer negotiations and fan-rep/supporter
communication. Focus on which outcomes are realistically affected, which are
sensitive/high-risk and how a game should abstract them without real
club/player IP.

## Captured answer 2 - Summary

- Private player talks realistically affect short-term morale, trust, squad
  status clarity, promises, transfer disposition and behavioural buy-in.
- Team/staff communication affects group morale, authority and tactical buy-in,
  but FMX-87 should keep staff as a Broad Dialogue surface and leave live-match
  team talks/shouts to GD-0025.
- Board meetings affect budgets, objectives, job security, philosophy alignment
  and autonomy. They should not directly micromanage tactics unless a future
  owner-archetype rule says so.
- Press/media handling affects public pressure, fan sentiment, named-player
  morale/trust and manager media reputation. The highest-risk cases are public
  criticism, contradictions with private promises and transfer-market comments.
- Agents and transfer talks affect transfer willingness, wage/role promise
  shape, agent trust and future negotiation friction. Real regulations treat
  agent services as negotiation/communication related to transactions.
- Fan-rep communication affects supporter trust, atmosphere trajectory and
  board pressure indirectly. It should not directly create match performance.
- Game abstraction should use fictional actor archetypes, generic roles and
  IP-clean labels rather than real people, clubs, outlets or supporter names.

## Prompt 3 - Deterministic dialogue/social-effect architecture

System: game systems and DDD architecture researcher. Separate game-design and
architecture implications.

User: research best practices and precedents for deterministic dialogue/social
effect systems in games: storylets, branching dialogue with finite intents,
reputation/morale effect matrices and keeping LLM/prose generation
non-authoritative. Include Failbetter/storylets, RPG dialogue design where
useful and DDD/event-sourcing guidance for commands/events owned by domain
contexts.

## Captured answer 3 - Summary

- Storylet systems are a strong FMX analogue: state/qualities unlock content,
  choices change qualities, and narrative rendering presents already-defined
  outcomes.
- Finite intents reduce branch explosion and make downstream reputation/morale
  logic testable.
- Delta bands are better than exact numbers in GDDRs. They communicate design
  intent while leaving balance values to calibration and implementation specs.
- Persona should primarily gate availability where it changes which approaches
  feel plausible, and use bounded scaling only where an owning domain explicitly
  models effect strength.
- DDD flow should be command/event based: Narrative surfaces an intent;
  authoritative contexts validate and apply effects; Narrative consumes the
  result read-only for follow-up prose.

## Targeted source checks

- Football Manager "Individual Player Targets and Interaction Logic":
  <https://www.footballmanager.com/features/individual-player-targets-and-interaction-logic>
  used for official evidence that player/agent interactions consider player
  personality, manager relationship, context, clearer promises and severity of
  AI responses.
- Football Manager "Introducing Intermediaries and Offloading Players":
  <https://www.footballmanager.com/features/introducing-intermediaries-and-offloading-players>
  used for agent/intermediary market-interest and transfer-communication
  precedent.
- Football Manager "Supporter Confidence":
  <https://www.footballmanager.com/features/supporter-confidence>
  used for supporter confidence, press conference and social media pressure
  surface precedent.
- FIFA agents FAQ:
  <https://inside.fifa.com/en/transfer-system/agents/faq-agents>
  and FIFA agents portal:
  <https://inside.fifa.com/transfer-system/agents>
  used for real-world framing that agent services include negotiation,
  communication and preparatory activity around transactions.
- The FA Football Agent Regulations page:
  <https://www.thefa.com/football-rules-governance/policies/player-status---agents/fa-football-agent-regulations>
  used as a national-regulator example that agent rules sit alongside FIFA
  regulations. FMX keeps all rule names fictional and IP-clean.
- Failbetter on Echo Bazaar / Fallen London storylet structure:
  <https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two>
  and StoryNexus diary:
  <https://www.failbettergames.com/news/storynexus-developer-diary-2-fewer-spreadsheets-less-swearing>
  used for quality/state-gated storylets and effects as quality changes.
- GameDeveloper "Defining Dialogue Systems":
  <https://www.gamedeveloper.com/design/defining-dialogue-systems>
  used for finite choice semantics and branch-convergence practice.
- Microsoft DDD domain events:
  <https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation>
  and integration events:
  <https://learn.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/integration-event-based-microservice-communications>
  used for domain events inside a bounded context and integration events only
  after persistence succeeds.

## Nico decisions captured before synthesis

| # | Decision | Selected |
|---|---|---|
| D1 | Dialogue surface scope | Broad MVP: player, staff, board, press/media, fan-rep and agent surfaces. |
| D2 | Effect precision | Bands now, numbers later via FMX-52 calibration. |
| D3 | Persona policy | Gate plus bounded scaling; owning domains resolve effects. |

