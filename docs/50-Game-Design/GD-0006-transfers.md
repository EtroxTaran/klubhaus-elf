---
title: GD-0006 Transfers & Scouting
status: draft
tags: [game-design, gddr, transfers]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: true
related: [[README]], [[GD-0013-narrative-inbox]], [[GD-0010-ai-world]], [[../60-Research/club-boss-analysis]], [[../60-Research/anstoss-series-deep-dive]], [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
---

# GD-0006: Transfers & Scouting

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.

## Date

2026-05-17

## Player experience goal

Transfer decisions that feel like real bets — surfaced as inbox stories with
ranged uncertainty, not point-estimate certainty.

## Decided / strong

- Intended model: **transfer-list pulse at season start**, age/talent arbitrage
  on 18–19y prospects, long contracts on talents, AI bidding pressure
  (anstoss-series-deep-dive §3 "Transfers").
- Inbox is the transfer surface: bids as scout-style emails with role; unified
  feed with **Accept / Decline / Defer / Snooze** (club-boss-analysis takeaway
  2; anstoss-series-deep-dive §7 rec. 9).
- **Risk surfaced as ranges, not point estimates** for valuations/ratings
  (club-boss-analysis takeaway 4).
- **Sort and filter every list from day one** (squad/transfer/youth/staff) —
  "the most repeated review request for the genre" (club-boss-analysis 8).
- Avoid known failures: thin one-shot renewal ("offer, no counter"); sparse
  late-game targets (club-boss-analysis "Retention failure modes").
- Transfer-window logic and contract structures are **IP-safe**
  (ip-and-licensing §3).

## Open (Wave 2)

- **R2-04 (high)** — opponent transfer/scouting/bidding AI.
- **R2-02 (critical)** — club budget/wage/value tier model. Continent-targeted
  scouting + rating ranges are adopted mechanics; algorithm is R2-02/R2-04.

## Rationale

Ranged uncertainty + inbox framing turns admin into narrative decisions
(club-boss-analysis takeaways 2, 4).

## Consequences

Positive:

- Decisions feel consequential; one surface (inbox) for all deal flow.

Negative / constraints:

- Needs the AI model (R2-04) and economy tiers (R2-02) before tuning.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0004-data-model]] (`transfer_offer`, RELATE graph)
- [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]] (AI behaviour epics)

## Related

- Research: [[../60-Research/club-boss-analysis]] · [[../60-Research/anstoss-series-deep-dive]]
- [[README]] — hub · siblings: [[GD-0013-narrative-inbox]] · [[GD-0010-ai-world]] · [[GD-0007-youth]]
