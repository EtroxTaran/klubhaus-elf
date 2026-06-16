---
title: Raw FMX-132 Sporting Core Source Checks
status: raw
tags: [research, raw, source-checks, ddd, ifab, football-manager, sports-science, fmx-132]
created: 2026-06-16
updated: 2026-06-16
type: research-raw
binding: false
linear: FMX-132
related:
  - [[../sporting-core-context-definition-maturity-2026-06-16]]
  - [[raw-sporting-core-contexts-ddd-boundaries-2026-06-16]]
  - [[raw-sporting-core-contexts-realworld-2026-06-16]]
  - [[raw-sporting-core-contexts-game-precedents-2026-06-16]]
---

# Raw FMX-132 Sporting Core Source Checks

## DDD Sources

| Source | Checked claim | Use in FMX-132 |
|---|---|---|
| Martin Fowler, "Bounded Context" - https://martinfowler.com/bliki/BoundedContext.html | Bounded Context is a central strategic DDD pattern; large domains are split into explicit contexts with explicit relationships; context maps are worthwhile. | Supports dedicated context-definition ADRs and bounded-context-map links. |
| Microsoft Learn, "Use domain analysis to model microservices" - https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis | DDD has strategic and tactical phases; define bounded contexts before tactical aggregates/services; bounded contexts can represent the same real-world entity differently; context maps document interactions and patterns including Customer/Supplier, OHS, Published Language and ACL. | Supports ADR structure: boundary, aggregate inventory, public contracts and ACLs. |
| Context Mapper language semantics - https://contextmapper.org/docs/language-model/ | Published Language and OHS are upstream roles; ACL/Conformist are downstream roles; relationship types have semantic constraints. | Supports precise ACL wording in draft ADRs. |

## Real-world Football / Sports Sources

| Source | Checked claim | Use in FMX-132 |
|---|---|---|
| IFAB Law 3, The Players - https://www.theifab.com/laws/latest/the-players/ | Match participation depends on named players/substitutes and competition substitution rules. | Match owns lock/simulation mechanics, but Squad & Player/Regulations supply eligibility constraints. |
| IFAB Law 5, The Referee - https://www.theifab.com/laws/latest/the-referee/ | Referee controls the match, records match facts, disciplinary actions and injury stoppage handling. | Match events are match facts; downstream contexts consume them rather than owning the on-pitch fact. |
| IFAB Law 12, Fouls and Misconduct - https://www.theifab.com/laws/latest/fouls-and-misconduct/ | Fouls, misconduct and cardable incidents are law-governed match events. | `MatchInjuryOccurred` and card facts start in Match, while durable discipline/availability effects belong elsewhere per ADR-0078/0018. |
| SoccerGuard arXiv 2411.08901 - https://arxiv.org/abs/2411.08901 | Soccer injury-risk analysis can combine wellness/training-load reports, GPS measures, third-party stats and medically verified injury reports. | Supports Training as signal/load owner and Squad & Player as durable injury/availability owner, not as proof of exact club RACI. |

## Comparable-game Sources

| Source | Checked claim | Use in FMX-132 |
|---|---|---|
| Football Manager official The Dugout - https://www.footballmanager.com/the-dugout | Official hub separates tactics, player roles, team guides and tutorials. | Supports player-facing module separation only. Does not prove internal architecture. |
| Local FMX Anstoss research - [[../anstoss-series-deep-dive]] | FMX already captured Anstoss weekly/training/matchday loop and design DNA. | Stronger local game-precedent source than weak current web links. |
| Local FMX tactics research - [[../tactics-persistence-bounded-context-2026-05-28]] | Tactics already owns persistent tactic library; Match consumes a locked snapshot. | Corrects Perplexity's possible over-attribution of tactics to Match. |

## Weak or Rejected Sources

- Reddit, Instagram, YouTube, generic blogs and community guides are not used
  as hard authority for FMX context ownership.
- OOTP, Top Eleven, Hattrick, FIFA Manager and EA FC Career are left as
  pattern-only in this packet unless a later issue performs primary manual
  source checks.
- Current real-world club RACI is inferred from public role patterns and
  sports-science literature, not claimed as a universal professional-football
  operating model.

