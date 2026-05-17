---
title: Game Design Log (Map of Content)
status: current
tags: [game-design, gddr, moc]
created: 2026-05-15
updated: 2026-05-17
type: index
binding: true
related: [[../00-Index/Home]], [[../00-Index/Decision-Log]], [[../60-Research/00-summary]], [[../90-Meta/templates/game-design]]
---

# Game Design Log — Map of Content

Game Design Decision Records (GDDRs): the canonical "how **our** game works"
layer. It sits **between research and the technical ADRs** —

`research (60-Research) → game design (this layer) → architecture (ADRs) → implementation`

Implement gameplay **only from `approved` GDDRs**. `draft`/`idea` GDDRs are the
recognized intent layer (read for direction, do not implement) — most are
synthesized from research and gated on Research Wave 2
([[../60-Research/research-wave-2-gaps]]). See
[[../90-Meta/vault-governance]] § Game design layer. Template:
[[../90-Meta/templates/game-design]].

When a GDDR is superseded: keep its row, set status `superseded`, fill the
Supersedes / Superseded-by columns so old → new stays readable here.

| GDDR | System | Status | Feeds ADR |
|---|---|---|---|
| [[GD-0001-core-loop]] | Core career loop & weekly rhythm | draft | ADR-0003, ADR-0008 |
| [[GD-0002-match-engine]] | Match engine & simulation model | draft | ADR-0003, ADR-0005 |
| [[GD-0003-squad-players]] | Squad, players & attributes | draft | ADR-0004, ADR-0003 |
| [[GD-0004-tactics]] | Tactics & formations | draft | ADR-0003, ADR-0008 |
| [[GD-0005-training]] | Training & development | draft | ADR-0003 |
| [[GD-0006-transfers]] | Transfers & scouting | draft | ADR-0004 |
| [[GD-0007-youth]] | Youth academy | draft | ADR-0004, ADR-0007 |
| [[GD-0008-finance-economy]] | Finance, economy & stadium | draft | ADR-0004 |
| [[GD-0009-league-structure]] | League & competition structure | draft | ADR-0007, ADR-0004 |
| [[GD-0010-ai-world]] | AI managers & world simulation | draft | ADR-0003, ADR-0009 |
| [[GD-0011-career-progression]] | Career progression, board & objectives | draft | ADR-0003 |
| [[GD-0012-onboarding]] | Onboarding & new game | draft | ADR-0008, ADR-0006 |
| [[GD-0013-narrative-inbox]] | Narrative, inbox & events | draft | ADR-0006, ADR-0003 |
| [[GD-0014-save-career-model]] | Save & career model | approved | ADR-0002, ADR-0005 |
| [[GD-0015-ip-clean-data]] | IP-clean data generation | approved | ADR-0007 |
| [[GD-0016-mobile-ux-loop]] | Mobile UX gameplay loop | draft | ADR-0008, ADR-0010 |

> Only GD-0014 and GD-0015 are `approved` — they restate accepted ADRs
> (ADR-0002/0005/0007) and binding Vision/Non-Goals. Everything else is
> synthesized from research and stays `draft` until owner-ratified.

## Up

- [[../00-Index/Home]] — vault hub · [[../00-Index/Decision-Log]] — ADRs (peer layer)
- [[../60-Research/00-summary]] — research MOC (inputs) · [[../00-Index/Current-State]]
