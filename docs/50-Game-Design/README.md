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

Implement gameplay **only from `approved` GDDRs**. **Scoped approval:** in an
`approved` GDDR only the **Decided / strong** section is ratified — its
**Open (Wave 2)** section is never approved and not implementable until that
research closes. `draft` GDDRs are the recognized intent layer (read for
direction, do not implement). See [[../90-Meta/vault-governance]] § Game design
layer. Template: [[../90-Meta/templates/game-design]].

These 14 were verified faithful to their cited sources (independent fact-check,
2026-05-17) and ratified. **GD-0002 (match engine) and GD-0010 (AI/world) stay
`draft`** — their own Decided sections are explicitly "intended, pending Wave 2"
/ "almost entirely open"; there is no stable core to ratify yet (R2-01/04/08).

When a GDDR is superseded: keep its row, set status `superseded`, fill the
Supersedes / Superseded-by columns so old → new stays readable here.

| GDDR | System | Status | Feeds ADR |
|---|---|---|---|
| [[GD-0001-core-loop]] | Core career loop & weekly rhythm | approved | ADR-0003, ADR-0008 |
| [[GD-0002-match-engine]] | Match engine & simulation model | draft (Wave 2) | ADR-0003, ADR-0005 |
| [[GD-0003-squad-players]] | Squad, players & attributes | approved | ADR-0004, ADR-0003 |
| [[GD-0004-tactics]] | Tactics & formations | approved | ADR-0003, ADR-0008 |
| [[GD-0005-training]] | Training & development | approved | ADR-0003 |
| [[GD-0006-transfers]] | Transfers & scouting | approved | ADR-0004 |
| [[GD-0007-youth]] | Youth academy | approved | ADR-0004, ADR-0007 |
| [[GD-0008-finance-economy]] | Finance, economy & stadium | approved | ADR-0004 |
| [[GD-0009-league-structure]] | League & competition structure | approved | ADR-0007, ADR-0004 |
| [[GD-0010-ai-world]] | AI managers & world simulation | draft (Wave 2) | ADR-0003, ADR-0009 |
| [[GD-0011-career-progression]] | Career progression, board & objectives | approved | ADR-0003 |
| [[GD-0012-onboarding]] | Onboarding & new game | approved | ADR-0008, ADR-0006 |
| [[GD-0013-narrative-inbox]] | Narrative, inbox & events | approved | ADR-0006, ADR-0003 |
| [[GD-0014-save-career-model]] | Save & career model | approved | ADR-0002, ADR-0005 |
| [[GD-0015-ip-clean-data]] | IP-clean data generation | approved | ADR-0007 |
| [[GD-0016-mobile-ux-loop]] | Mobile UX gameplay loop | approved | ADR-0008, ADR-0010 |

> **14 approved** (scoped — Decided sections only; Open/Wave-2 never
> implementable). **GD-0002 and GD-0010 remain `draft`**: their Decided cores
> are explicitly Wave-2-gated (no model/numbers yet), so there is nothing
> stable to ratify — promoting them would tell agents to build undefined
> systems. They move to `approved` when R2-01/04/08 close.

## Up

- [[../00-Index/Home]] — vault hub · [[../00-Index/Decision-Log]] — ADRs (peer layer)
- [[../60-Research/00-summary]] — research MOC (inputs) · [[../00-Index/Current-State]]
