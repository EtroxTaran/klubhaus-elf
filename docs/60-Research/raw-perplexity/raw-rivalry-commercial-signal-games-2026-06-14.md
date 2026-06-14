---
title: "Raw - Rivalry commercial signal: comparable game precedent (FMX-134)"
status: raw
tags: [research, raw, perplexity, games, football-manager, ootp, hattrick, rivalry, commercial, fmx-134]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-134
related:
  - [[../rivalry-commercial-signal-contract-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../../50-Game-Design/rivalry-system]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
---

# Raw capture - Rivalry commercial signal comparable game precedent (Perplexity, 2026-06-14)

Perplexity capture for **FMX-134**. Status `raw`: this is source input only; the
synthesis is [[../rivalry-commercial-signal-contract-2026-06-14]].

No FMX private data, secrets or user data were sent. Prompt was generic
sports-management game research.

## Prompt

**Prompt.** Research comparable football/sports management games for how they
model rivalry, derbies, match importance, attendance, gate revenue, fan mood and
sponsor/media interest. Look for whether games expose rivalry as a persistent
club relationship/read model and let economy/fan systems derive revenue effects,
or whether they publish explicit commercial signals. Include sources where
available.

## Key captured findings

- Public evidence points toward rivalry as a club relationship/read-model fact,
  not as an explicit upstream commercial score.
- Football Manager treats named derbies/rivalries as database/researcher facts,
  while rivalry strength can develop dynamically. That supports a Rivalry-owned
  relationship/tier model and downstream consumers deciding how to use it.
- Hattrick links fans, supporter mood, match expectations, crowd attendance and
  sponsor money. It does not require a separate rivalry-commercial event to make
  attendance/sponsor systems react to fan context.
- OOTP's baseball financial model makes gate revenue a function of ticket price
  and attendance, with attendance/media revenue influenced by market size, fan
  loyalty and fan interest. It is useful precedent for keeping commercial
  calculation in the finance/commercial model and consuming upstream interest
  signals.
- Product precedent therefore supports FMX using Rivalry for rivalry facts,
  Audience & Atmosphere for fan-demand/atmosphere state and CommercialPortfolio
  for fixture commercial attractiveness, sponsor fit and settlement.

## Useful sources returned / checked

- Sports Interactive Community, "Dynamic rivalries question":
  <https://community.sports-interactive.com/forums/topic/373137-dynamic-rivalries-question/>
- Hattrick Wiki, "Fans": <https://wiki.hattrick.org/wiki/Fans>
- OOTP manual, "The team financial model":
  <https://manuals.ootpdevelopments.com/index.php?man=ootp19&page=the_team_financial_model>

## Source quality note

The initial game-precedent Perplexity answer mixed useful genre patterns with
weak citations. The synthesis relies on the targeted source checks above for
specific game claims.

