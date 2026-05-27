---
title: Mode - Create a Club Roguelite
status: draft
tags: [game-design, mode, roguelite, create-a-club]
created: 2026-05-16
updated: 2026-05-18
type: game-design
binding: false
related:
  - [[README]]
  - [[GD-0017-mvp-scope-and-mode-sequencing]]
  - [[../00-Index/MVP-Scope]]
  - [[../60-Research/mode-design-research]]
  - [[../60-Research/onboarding-strategy]]
  - [[mode-manage-a-club-career]]
  - [[onboarding-and-tutorial]]
  - [[economy-system]]
  - [[club-dna-and-governance]]
---

# Mode - Create a Club Roguelite

> **REOPENED on 2026-05-27:** This game-design note is `draft` again. Any `approved`, `binding`, or `locked` wording below is historical pre-reopen context until Nico re-approves it.

The signature mode of soccer-manager. Permadeath on insolvency, but each
run leaves *legacy* that makes the next run *different* (not easier).
This note is **approved** at the level of the product rule. Sub-mechanic
tuning remains `draft` and lives in linked notes.

## 1. Approved product rule

> **A roguelite run is a single career-and-club lifecycle. Insolvency,
> control loss, forced dissolution and deliberate retirement all end the
> run. Persistence between runs is small, optional, structural - never raw
> power.**

This rule is binding for implementation. Detailed tuning is in
[[economy-system]] §6 and [[club-dna-and-governance]].

## 1.1 MVP-first slice

Per [[GD-0017-mvp-scope-and-mode-sequencing]] and [[../00-Index/MVP-Scope]],
Create-a-Club Roguelite is the active MVP first playable.

MVP includes:

- fast fictional club setup;
- starter region/country, colours and crest;
- first Home dashboard/feed-card;
- starter tactic choice;
- first match and report;
- cash/run-risk feedback; and
- server-confirmed progression with local drafts/caches only.

Deep legacy carries, advanced meta-progression, multi-run narrative echoes and
full local-authoritative offline play are future phases unless they directly
block the first playable loop.

## 2. Run lifecycle

```mermaid
stateDiagram-v2
    [*] --> Founding
    Founding --> Active: First match
    Active --> Active: Season loop
    Active --> Crisis: Trigger threshold
    Crisis --> Recovery: Stabilise
    Crisis --> Insolvency: Liquidity = 0
    Crisis --> ControlLoss: Board veto
    Recovery --> Active
    Active --> Retire: Player choice
    Insolvency --> RunEnd
    ControlLoss --> RunEnd
    Retire --> RunEnd
    RunEnd --> Legacy
    Legacy --> [*]
```

## 3. Founding choices

At run start the player chooses:

- **Country + region**.
- **Club name + colours + crest** (procedurally suggested + editable).
- **Stadium location** (small pitch + 1-5 k capacity).
- **Club DNA** within unlocks (see §5).
- **Starting league tier** (typically bottom tier of chosen country).
- **Manager profile** (slowly improving across runs via talent tree).
- **Optional starting modifier** (one unlocked carry slot).

## 4. End conditions

A run ends when **any** of these occur:

| End condition | Trigger |
|---|---|
| Insolvency | Liquidity ≤ 0 for N consecutive months |
| Control loss | Board veto for N consecutive failed seasons |
| Forced dissolution | League expulsion (compliance failure post grace period) |
| Deliberate retirement | Player chooses to retire |
| Achievement run | Optional special goal (e.g. promote 4 tiers in 10 years) |

After end, the run enters Legacy and contributes to meta-progression.

## 5. Legacy systems (carries)

Persisted between runs:

| Carry type | Mechanic | Limits |
|---|---|---|
| **Option unlocks** | New club founding profiles, sponsor archetypes, youth philosophies | Unlocked by reaching milestones (e.g. promote 2 tiers, win cup) |
| **Soft carries** | Scout contact, small credit bonus, cheaper plot, slight starting reputation | 1 slot at start; more slots earned by run length |
| **Manager talent tree** | Permanent manager-attribute upgrades (e.g. press, scout, training) | Tree-shaped; respec available |
| **Narrative legacy** | Former runs + players appear in the universe | Read-only history |
| **Cosmetic identity** | Crests, colour palettes, kit patterns | Unlock-and-keep |

### Carry budget rule

A new run starts with **1 carry slot** by default. Slot count grows with
*total run length across all prior runs*, not with successes alone. This
rewards perseverance without rewarding gaming the failure state.

## 6. What is NOT carried

- Squad value.
- Stadium build-out.
- Sponsor contracts.
- Cash balance.
- League reputation.
- Squad attribute floors / ceilings.

These all reset. The point of the run is to build them again.

## 7. Staged tutorial via meta-progression

Complexity unlocks across runs:

| Run | Complexity available |
|---|---|
| 1 | Basic finance, simple tactics, single league |
| 2-3 | Sponsoring portfolio, transfer market, fan segments |
| 4-5 | Manager talent tree branches, fan zone build-out |
| 6+ | Set pieces, advanced tactic editor, full attribute scale, all sponsor side-conditions |

This is the Roguelite "staged tutorial" pattern from
[[../60-Research/mode-design-research]] §3.

## 8. Death-spiral drama

Detailed in [[economy-system]] §6. Summary:

1. Bad scouting → bad signings on big wages.
2. Wage ratio breach → sponsor concern.
3. Operating result negative → cash reserve drains.
4. Risk reserve empty → forced sales at discount.
5. Sales hurt squad → bad results.
6. Bad results → board demand cost cuts + sponsor withdrawal.
7. Insolvency → run ends.

Each step is reversible until the previous one *closes*. The player can
fight back at any point, but the system has momentum.

## 9. UI tier interactions

| Tier | Roguelite-specific surface |
|---|---|
| Quick | Health gauges (cash, mood, results); "danger of insolvency" warning early |
| Standard | Crisis dashboard with explicit reversal levers |
| Expert | Cash-flow projection 12 months ahead; all KPI early warnings |

## 10. Roguelite in async groups

When a private async group runs Create-a-Club mode
([[async-multiplayer-private-group]]):

- Each manager's run is independent.
- If a manager's run ends mid-season, they continue with a **fresh** club
  in a lower league for the next season - so the group's pyramid stays
  populated.
- Mid-season insolvency: the league auto-promotes a replacement
  procedural club to keep the bracket complete; the human re-enters next
  season.

## 11. Open tuning questions

- N (consecutive months at liquidity ≤ 0) - tentative 2 months.
- Board-veto-fail seasons - tentative 2 in a row.
- Carry slot growth function - linear vs logarithmic. Current intent: 1
  slot per ~50 in-game seasons summed across runs.
- Should achievements unlock kit patterns visible to other players in
  async groups? Yes - lightly badged.
## Related

- [[README]]
- [[GD-0017-mvp-scope-and-mode-sequencing]]
- [[../00-Index/MVP-Scope]]
- [[../60-Research/mode-design-research]]
- [[../60-Research/onboarding-strategy]]
- [[mode-manage-a-club-career]]
- [[onboarding-and-tutorial]]
- [[economy-system]]
- [[club-dna-and-governance]]
