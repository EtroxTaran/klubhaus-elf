---
title: Raw Perplexity Research Transcripts
status: raw
tags: [research, raw, perplexity, wave-2, player-strength, matchday, operations]
created: 2026-05-16
updated: 2026-06-01
type: index
binding: false
related: [[../00-summary]], [[../../00-Index/Research-Map]], [[../incoming-design-research-2026-05-27]], [[../manager-archetype-roguelite-2026-05-27]], [[../swappable-spatial-event-match-engine-2026-05-27]], [[../eos-player-staff-skills-and-personas-2026-05-28]], [[../ai-narration-world-and-dialogue-mvp-2026-05-28]], [[../ai-narration-testing-framework-2026-05-28]], [[../commercial-contract-lifecycle-and-breach-model-2026-05-28]], [[../cup-and-competition-revenue-profiles-2026-05-28]], [[../matchday-operating-costs-and-risk-cost-settlement-2026-05-29]], [[../catering-and-merchandise-operations-2026-06-01]]
---

# Raw Perplexity Research Transcripts (Wave 2)

This folder preserves the substantive content of private Perplexity-style
research transcripts and attached research reports (German source language).
They are
**not authoritative** for implementation — they are the lossless input feeding
the synthesised research notes one folder up.

## Source documents (private, not committed)

- `Football Manager Game – Vollständige Feature-Recherche & Konzeptbibliothek.md` (≈580 lines, feature catalogue)
- `ich möchte eine Art Fussballmanager als app _Entwi.md` (≈8 800 lines, iterative system design + architecture + emergent systems)
- `Für unsere Match Engine verwenden wir einen Mechan.md` (≈730 lines,
  runtime technology and match-engine scaling strategy)

The transcripts contain multiple parallel Perplexity answer iterations on the
same prompts; we preserve the distinct content per topic rather than per
iteration, because the iterations overlap heavily and the value is in the union
of points raised across runs.

## Files

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-feature-library]] | Competitor catalogue (Anstoss / FM / EA / Club Boss / ManagerZone / SOKKA / Soccer Manager 2026) | [[../feature-library-synthesis]] |
| [[raw-systems-design]] | 15 core club-simulation systems and their interplay | [[../systems-design-synthesis]] |
| [[raw-game-modes]] | Create-a-Club Roguelite, Manage-a-Club Career, Singleplayer, Async Private Group | [[../mode-design-research]] |
| [[raw-async-multiplayer]] | Fixed vs dynamic cadence, watch parties, conference mode, transfer escalation | [[../async-multiplayer-research]] |
| [[raw-architecture]] | DDD modular monolith, state machines, transactional outbox, offline-first, security | [[../../10-Architecture/bounded-context-map]] |
| [[raw-environment-events]] | Fan ecology, regulations, rivalries, sanctions, matchday events, progressive disclosure | [[../regulations-and-pyramids-research]], [[../fan-culture-segmentation-research]] |
| [[raw-transfer-market-research]] | Active transfer market, AI club selling, valuations, clauses, loans and player / agent pressure | [[../transfer-market-simulation]] |
| [[raw-player-strength-overview]] | Player strength presentation in squad overview; role/tactic-adaptive Impact, category scores, status icons | [[../player-strength-presentation]] |

## Ad-hoc report imports (2026-05-27)

Six external research reports (Perplexity-style, German) Nico provided on
2026-05-27. Unlike the Wave-2 transcripts above, these are **committed** to the
vault as verbatim copies (each carries `status: raw` frontmatter + a
provenance banner). Their analysis, vault mapping and divergence flags live in
the triage note [[../incoming-design-research-2026-05-27]].

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-player-and-staff-values]] | Player/staff value systems competitor sweep + "EOS" attribute proposal | [[../data-generators]] · [[../incoming-design-research-2026-05-27]] |
| [[raw-character-personality-and-dialogue]] | Personality model for all actors + intent-based player dialogue layer | [[../narrative-content-pipeline]] · [[../incoming-design-research-2026-05-27]] · [[../ai-narrative-runtime-integration]] |
| [[raw-ai-llm-usage]] | LLM use-case matrix, cost model, offline fallback architecture | [[../narrative-content-pipeline]] · [[../incoming-design-research-2026-05-27]] · [[../ai-narrative-runtime-integration]] |
| [[raw-roguelite-meta-progression]] | Run/meta split, behaviour-based perk unlocks, legacy world-carry | [[../late-game-systems]] · [[../incoming-design-research-2026-05-27]] · [[../manager-archetype-roguelite-2026-05-27]] |
| [[raw-club-economy-simulation]] | Full club economy model: cashflow, revenue/cost, insolvency, infrastructure | [[../../50-Game-Design/economy-system]] · [[../incoming-design-research-2026-05-27]] |
| [[raw-match-engine-offline-and-disconnect]] | Where match computes, offline PWA scope, disconnect/reconnect handling | [[../match-engine-runtime-strategy]] · [[../incoming-design-research-2026-05-27]] |

## FMX-10 follow-up Perplexity research (2026-05-27)

Additional Perplexity research was run during FMX-10 after Nico re-questioned
the match-engine runtime and exchangeability posture.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-swappable-spatial-event-match-engine-runtime]] | Runtime strategy, spatial-event model, OSS candidates and replacement/determinism contracts | [[../swappable-spatial-event-match-engine-2026-05-27]] · [[../../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]] |

## FMX-23 follow-up Perplexity research (2026-05-28)

Additional Perplexity research was run during FMX-23 after Nico asked for
player/staff skills, perks and clearer people/persona constellations.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-ea-fc26-fm-skills-persona-perplexity-2026-05-28]] | EA FC 26 / Football Manager skills, perks, staff and mixed OCEAN + football-domain persona model | [[../eos-player-staff-skills-and-personas-2026-05-28]] · [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]] · [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] |

## FMX-44 follow-up Perplexity research (2026-05-28)

Additional Perplexity research was run during FMX-44 after Nico asked for the
next economy issue to go deep on commercial contract lifecycle and breach
patterns.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-commercial-contract-lifecycle-2026-05-28]] | Sports sponsorship, venue catering/concession/retail/hospitality/supplier contracts and CLM lifecycle best practices | [[../commercial-contract-lifecycle-and-breach-model-2026-05-28]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] |

## FMX-45 follow-up Perplexity research (2026-05-28)

Additional Perplexity research was run during FMX-45 after Nico asked for full
research and planning on cup and competition revenue profiles.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-cup-competition-revenue-profiles-2026-05-28]] | Domestic cup and continental competition revenue, gate sharing, prize/media cadence, EV forecasting and elimination shock | [[../cup-and-competition-revenue-profiles-2026-05-28]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../../30-Implementation/club-economy-commercial-contracts]] |

## FMX-46 follow-up Perplexity research (2026-05-29)

Additional Perplexity research was run during FMX-46 after Nico asked for full
research and planning on matchday operating costs and risk-cost settlement.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-matchday-operating-costs-risk-settlement-2026-05-29]] | UEFA/national safety, stewarding, policing, supporter travel, alcohol restrictions, sanctions, sector closures, ghost matches and stadium operating-cost patterns | [[../matchday-operating-costs-and-risk-cost-settlement-2026-05-29]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../../30-Implementation/club-economy-commercial-contracts]] |

## FMX-47 follow-up Perplexity research (2026-06-01)

Additional Perplexity research was run during FMX-47 after Nico picked the next
economy issue: catering and merchandise operations depth beyond flat revenue
percentages.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-catering-and-merchandise-operations-2026-06-01]] | Stadium catering/concession & football merchandise commercial models, COGS/inventory/waste, demand spikes, service-quality & SLA breach, supplier exclusivity, IFRS 15 recognition | [[../catering-and-merchandise-operations-2026-06-01]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../../30-Implementation/club-economy-commercial-contracts]] |

## FMX-3 follow-up Perplexity research (2026-05-28)

Additional Perplexity research was run after Nico expanded the Runtime-LLM
narration target from async flavour to Full Dialogue and All Active actor
context.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-ai-narration-mvp-research-2026-05-28]] | Runtime LLM narration/dialogue best practices, fallback, validation, cache/cost/latency and season memory | [[../ai-narration-world-and-dialogue-mvp-2026-05-28]] |
| [[raw-ai-narration-compliance-safety-2026-05-28]] | EU AI Act, GDPR, OWASP, monitoring, kill switch and release gates | [[../ai-narration-world-and-dialogue-mvp-2026-05-28]] |
| [[raw-ai-world-persona-generation-2026-05-28]] | Generated players, staff, board, media, fan groups, fan reps, values and relationship graph | [[../ai-narration-world-and-dialogue-mvp-2026-05-28]] |
| [[raw-ai-narration-evaluation-testing-2026-05-28]] | Eval corpus, structured output validation, fact grounding, CI tiers and telemetry | [[../ai-narration-testing-framework-2026-05-28]] |
| [[raw-ai-narration-security-testing-2026-05-28]] | Prompt injection, PII minimization, unsafe output, provider outage and disclosure tests | [[../ai-narration-testing-framework-2026-05-28]] |
| [[raw-ai-narration-interactive-narrative-qa-2026-05-28]] | Storylets, persona cards, relationship memory, deterministic fallbacks and long-season narrative QA | [[../ai-narration-testing-framework-2026-05-28]] |

## Rules

- Raw notes may quote competitor names and product features for analysis only.
- Implementation must follow [[../ip-and-licensing]] and
  [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].
- When a raw point is promoted into a synthesis, design, or ADR note, link both
  ways so future agents can trace the chain.
- Treat anything here as `status: raw`: not binding, never the only source.
