---
title: Player contract lifecycle FSM — synthesis (FMX-81)
status: current
tags: [research, transfer, contracts, squad, regulations, notification, fmx-81]
created: 2026-06-03
updated: 2026-06-03
type: research
related:
  - [[raw-perplexity/raw-player-contract-lifecycle-fsm-2026-06-03]]
  - [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
  - [[../10-Architecture/state-machines/player-contract-lifecycle]]
  - [[../10-Architecture/state-machines/transfer]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../50-Game-Design/GD-0006-transfers]]
  - [[../50-Game-Design/transfer-market-and-contracts]]
  - [[../50-Game-Design/regulations-and-compliance]]
---

# Player contract lifecycle FSM — synthesis (FMX-81)

Grounds FMX-81. Raw capture:
[[raw-perplexity/raw-player-contract-lifecycle-fsm-2026-06-03]]. External source
checks used for promoted claims:

- FIFA Legal Handbook 2025 publication page:
  <https://inside.fifa.com/legal/news/legal-handbook-2025-edition-published>
- FIFA RSTP commentary PDF hosted by The FA:
  <https://www.thefa.com/-/media/files/thefaportal/governance-docs/registrations/commentary-on-the-fifa-regulations-on-the-status-and-transfer-of-players-edition-2021.ashx>
- The FA men's players GBE criteria 2025/26:
  <https://www.thefa.com/-/media/files/thefaportal/governance-docs/registrations/gbe-2025-26/fa-mens-players-gbe-criteria-202526.ashx>
- Football Manager 26 mid-season transfer advice:
  <https://www.footballmanager.com/the-dugout/10-tips-successful-mid-season-transfer-window-fm26>
- Football Manager 23 recruitment / agent revamp:
  <https://www.footballmanager.com/features/recruitment-revamp>
- GuideToFM signing players:
  <https://www.guidetofm.com/squad/signing-players/>

## 1. Real-world rails to model

### Signing is not registration

The game needs two separate gates:

1. **Contract / pre-contract permission** — whether the player may agree terms.
2. **Registration / employment eligibility** — whether the player may be
   registered and used by the target club.

The FIFA RSTP commentary frames registration periods as association-defined
windows, with professional players registered during the annual periods set by
the relevant member association. The same commentary records the familiar
pre-contract rule: a professional is free to conclude a contract with another
club once the current contract has expired or is due to expire within six months.

For FMX this becomes profile data, not hard-coded global law:

```text
ContractPermissionPolicy =
  preContractWindowMonths
  domesticPreContractWindowMonths?
  requiresCurrentClubNotice
  approachSanctionPolicy

RegistrationPolicy =
  normalWindowRequired
  preExistingFreeAgentOutOfWindowAllowed
  postWindowFreeAgentRequiresNextWindow
  exceptionProcedure
```

### Free-agent timing is a registration-policy edge

The important game case is not "free agents ignore windows" as a global rule.
It is a profile distinction:

- **pre-existing free agent** — contract ended before the most recent window
  closed; many rulesets allow out-of-window registration, subject to local rules;
- **post-window free agent** — contract/termination happens after the window
  closes; stricter registration gating or exception routing may apply.

This is why FMX keeps free-agent signing separate from club-to-club transfer
negotiation: there is no selling club, but there can still be registration and
work-permit gates.

### England-like GBE is a work eligibility gate

The FA 2025/26 men's GBE criteria is effective from 1 June 2025 and says revised
criteria may be issued before the summer 2026 transfer window. It also makes the
game-relevant separation clear: a player can be registered without a GBE, but
must obtain GBE / sponsorship / permission to work before playing or undertaking
employment duties. For FMX:

- Transfer or free-agent terms may be agreed conditionally.
- Regulations & Compliance returns a `WorkPermitVerdict` / `RegistrationEligibilityVerdict`.
- Completion can land in `awaiting_registration_window` or `registration_blocked`
  instead of pretending a signed free transfer is always match-eligible.

## 2. Genre lessons

Football Manager's current public material reinforces the same loop:

- mid-season is the key moment to search expiring contracts and protect your own
  expiring players;
- agents are used before and during negotiations to expose interest, demands and
  reasons;
- expiring contracts are surfaced in planning/status views;
- broken contract talks can be revisited, so renewal is not a one-click fail.

GuideToFM documents the player-facing acquisition paths that matter for FMX:
buying, loans, free transfers and end-of-contract agreements. The same guide
shows why the domestic/foreign pre-contract distinction must be profile data
rather than a global six-month constant.

Anstoss/FIFA-Manager-style pacing adds the second lesson: the simulation can be
continuous while the UI presents clear **contract work phases** at season start,
mid-season/pre-contract opening and season end.

## 3. Ownership options

| Option | Fit | Rejected / chosen rationale |
|---|---|---|
| Transfer owns contract lifecycle | Good for deal-shaped negotiations. | Rejected. Transfer's current FSM assumes `seller_club_id` and owns transient negotiation cases, not long-lived roster obligations. It would make every expiry query depend on Transfer even when no market case exists. |
| **Squad & Player owns contract lifecycle** | Matches existing FMX map and ADR-0052: player base data, contracts and squad status live with Squad & Player. | **Chosen by Nico for FMX-81.** Keeps one source of truth for "is this player contractually attached to this club?" while Transfer remains the process owner for renewal / pre-contract / free-agent cases. |
| New Contracts bounded context | Generic DDD CLM best practice when contract rules are large enough to become their own business capability. | Rejected for this beat. It would add a new context before there is enough FMX-specific pressure. Keep as a future extraction seam if contract complexity outgrows Squad & Player. |

## 4. Proposed FMX landing

### Context split

- **Squad & Player owns** `PlayerContract`, contract lifecycle state, current
  contract term snapshots, expiry tick and player-free-agent transition.
- **Transfer owns** `RenewalNegotiationCase`, `PreContractCase` and
  `FreeAgentSigningCase`. These are process artifacts that may command
  Squad & Player to renew, pre-sign, release or attach a player.
- **Regulations & Compliance owns** pre-contract policy, transfer-window status,
  free-agent registration rules, work-permit / GBE-like profiles and squad
  registration verdicts.
- **Notification owns** scheduling and delivery of expiry warnings. Payloads must
  carry self-contained facts; Notification does not join Squad/Transfer state.
- **Club Management owns** wage, signing bonus, agent fee and ledger consequences.
  Squad/Transfer publish financial intent facts; Club Management posts ledger
  entries through its ACL.

### Player-facing loop

The MVP should avoid the known one-shot renewal failure with:

1. **Contract Hub states**: `secure`, `monitor`, `renewal_due`,
   `pre_contract_eligible`, `expiring`, `expired_free_agent`.
2. **Timed warnings**: season start, 18 months, 12 months, 6 months / profile
   pre-contract open, 3 months, 1 month and expiry. Importance can suppress
   noise for fringe/youth players but must not hide key-player risk.
3. **Multi-touch negotiation**: intent -> agent/player stance -> compact
   contract offer -> counter / accept / break down -> cooling-off / retry.
4. **Bosman / pre-contract opportunities**: same contract terms surface, but
   represented as `PreContractCase` with future effective date and conditional
   registration/work-permit gates.
5. **Free-agent path**: same player terms surface, but no seller negotiation.
   Completion depends on registration window and work-permit verdict.

## 5. Top-5 profile dimensions

FMX keeps real-world-inspired profiles fictional and IP-clean:

| Profile | Pre-contract / free-agent policy emphasis |
|---|---|
| England-like | Foreign-club six-month pre-contract; stricter domestic late-window profile; GBE-like work eligibility; free-agent registration allowed only if profile says so. |
| Germany-like | Six-month foreign/domestic pre-contract baseline; registration-window discipline; licence/eligibility checks mostly rule-catalog driven. |
| Spain-like | Registration and squad-cost capacity can block otherwise agreed contracts; contract may be signed while registration waits. |
| Italy-like | Window/register discipline plus audited-payables / eligibility checks; free-agent bargains exist but registration is not automatic. |
| France-like | Wage-control / regulator-review flavour can make free transfers fail finance/eligibility checks despite no fee. |

These are **profile axes**, not final legal constants. Exact values remain
Regulations data and need re-check before ratification, especially for FA GBE
2026/27.

## 6. Decisions taken for FMX-81

| # | Decision | Choice |
|---|---|---|
| D1 | Contract lifecycle owner | **Squad & Player** owns contract lifecycle truth. |
| D2 | Bosman/pre-contract MVP depth | **Full top-5 policy depth** as profile data, with fictional/IP-clean wording. |
| D3 | Free-agent path | **Separate Transfer-owned case**, not `seller_club_id = null` in the club-to-club transfer FSM. |
| D4 | Warning surface | **Notification schedules/delivers self-contained expiry warnings; Transfer consumes selected contract-risk facts as opportunities.** |

The architecture proposal is [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
and the concrete FSM note is [[../10-Architecture/state-machines/player-contract-lifecycle]].

## 7. Open implementation data

- Exact per-profile pre-contract windows, free-agent registration exceptions and
  work-permit scoring values.
- The final UI copy and cadence thresholds per player importance.
- Whether a future "Contracts" bounded context is warranted if player contracts,
  staff contracts, commercial contracts and loans need a shared CLM platform.

## Related

- [[raw-perplexity/raw-player-contract-lifecycle-fsm-2026-06-03]]
- [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
- [[../10-Architecture/state-machines/player-contract-lifecycle]]
- [[../50-Game-Design/GD-0006-transfers]]
- [[../50-Game-Design/transfer-market-and-contracts]]
