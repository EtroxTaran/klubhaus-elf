---
title: GD-0006 Transfers & Scouting
status: accepted
tags: [game-design, gddr, transfers]
created: 2026-05-17
updated: 2026-06-11
type: game-design
binding: true
related: [[README]], [[GD-0013-narrative-inbox]], [[GD-0010-ai-world]], [[transfer-market-and-contracts]], [[../60-Research/club-boss-analysis]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/player-contract-lifecycle-fsm-2026-06-03]], [[../10-Architecture/09-Decisions/ADR-0004-data-model]], [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
---

# GD-0006: Transfers & Scouting

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `approved`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **Accepted** (re-ratified 2026-06-08, PR #153) — the **Decided / strong** section is ratified design
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
- FMX-81 adds a contract-lifecycle appendix so renewal, expiry, Bosman and
  free-agent cases become recurring planning loops instead of one-shot pop-ups.

Negative / constraints:

- Needs the AI model (R2-04) and economy tiers (R2-02) before tuning.
- Exact country-profile values for pre-contract windows, free-agent registration
  exceptions and work-permit checks remain Regulations data pending ratification.

## FMX-81 appendix — contract lifecycle and expiry risk (proposed)

Contract management is part of the Transfer & Scouting player fantasy but the
authoritative lifecycle belongs to Squad & Player per proposed
[[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]].

The player-facing loop is:

1. **Plan** in a Contracts Hub: sort by expiry, role importance, wage burden,
   resale risk and squad depth.
2. **Warn** through inbox/feed cards at season start, 18 months, 12 months,
   pre-contract opening, 3 months, 1 month and expiry. Warnings are
   Notification-owned payloads with self-contained facts.
3. **Negotiate** through a compact multi-round flow: intent, player/agent stance,
   wage/years/role/key-clause offer, counter, accept or cooling-off.
4. **Choose alternatives**: renew, sell before risk peaks, release, let expire,
   approach external pre-contract targets or sign free agents.

Bosman/pre-contract and free-agent paths are Transfer-owned process cases, not a
nullable variant of the club-to-club transfer FSM:

- `PreContractCase`: future club + player/agent; current club is context, not a
  negotiating seller.
- `FreeAgentSigningCase`: target club + unattached player/agent; no selling club.

Top-5-style policy differences are surfaced as fictional Regulations profiles.
The MVP design includes the dimensions; exact values are data/profile work:

| Profile | Contract-risk flavour |
|---|---|
| England-like | Foreign six-month pre-contract, stricter domestic late-window profile and GBE-like work eligibility. |
| Germany-like | Six-month baseline with strong registration-window discipline. |
| Spain-like | Registration/squad-cost capacity can block otherwise agreed contracts. |
| Italy-like | Window discipline plus audited-payables / eligibility pressure. |
| France-like | Wage-control/regulator review can make no-fee signings fail finance fit. |

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0004-data-model]] (`transfer_offer`, RELATE graph)
- [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]] (AI behaviour epics)

## Related

- Research: [[../60-Research/club-boss-analysis]] · [[../60-Research/anstoss-series-deep-dive]]
- [[README]] — hub · siblings: [[GD-0013-narrative-inbox]] · [[GD-0010-ai-world]] · [[GD-0007-youth]]
