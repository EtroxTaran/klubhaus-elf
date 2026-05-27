---
title: Mode - Manage a Club Career
status: draft
tags: [game-design, mode, career, anstoss]
created: 2026-05-16
updated: 2026-05-18
type: game-design
binding: false
related:
  - [[README]]
  - [[GD-0017-mvp-scope-and-mode-sequencing]]
  - [[../00-Index/MVP-Scope]]
  - [[../60-Research/mode-design-research]]
  - [[../60-Research/ai-manager-behaviour]]
  - [[../60-Research/onboarding-strategy]]
  - [[../60-Research/late-game-systems]]
  - [[mode-create-a-club-roguelite]]
  - [[onboarding-and-tutorial]]
  - [[club-dna-and-governance]]
  - [[fan-ecology]]
---

# Mode - Manage a Club Career

> **REOPENED on 2026-05-27:** This game-design note is `draft` again. Any `approved`, `binding`, or `locked` wording below is historical pre-reopen context until Nico re-approves it.

The classical mode: apply for a job, take over an existing club, can be
sacked. The Anstoss-2 "real manager career" pattern with FM-style split
confidence. Approved at the level of the product rule and the split
confidence model; sub-tuning remains `draft`.

## 1. Approved product rule

> **The player applies to coach an existing club. Performance is judged by
> a split confidence model: Board Confidence + Supporter Confidence, both
> decomposed into sub-areas, weighted by the club's Expectation Profile.
> Sacking is possible. Career arc spans many clubs.**

## 1.1 Post-MVP sequencing

Manage-a-Club Career is first-class long-term scope, but it is **not playable
in the MVP**. Per [[GD-0017-mvp-scope-and-mode-sequencing]], the MVP shows it as
a visible "comes later" mode tile while [[mode-create-a-club-roguelite]] is the
active first playable.

Career must reuse the same simulation core, contracts, IP-clean data, match
engine, Impact Lens, finance and squad systems so adding it later is a mode-rule
extension rather than a second product.

## 2. Career flow

```mermaid
stateDiagram-v2
    [*] --> Unemployed
    Unemployed --> Applying: Apply to job board
    Applying --> Interview
    Interview --> Hired
    Interview --> Unemployed: Rejected
    Hired --> Managing
    Managing --> Reviewed: Season review
    Reviewed --> Managing: Confidence OK
    Reviewed --> Sacked: Confidence fail
    Sacked --> Unemployed
    Managing --> Retiring: Player choice / age
    Retiring --> [*]
    Hired --> Headhunted: Better offer mid-tenure
    Headhunted --> Hired
```

## 3. Job market

A persistent job board lists openings across the world. Each entry shows:

- Club + league.
- Expectation Profile.
- Budget hints.
- Squad summary.
- Salary range.
- Why the role is open (sacking, retirement, expansion).

Manager reputation gates which jobs even show up. Reputation grows with
results, trophies, public-image management.

## 4. Split confidence model

The Football Manager pattern, adopted verbatim from
[[../60-Research/mode-design-research]] §4.

### 4.1 Board Confidence (0-100)

Sub-areas:

- Season goal vs current position.
- Budget discipline (wage + transfer).
- Transfer policy execution.
- Club-development progress (youth, infra, brand).
- Long-term plan adherence (philosophy continuity).

### 4.2 Supporter Confidence (0-100)

Sub-areas:

- Derby + rivalry results.
- Attractive play (style match).
- Identification (icon retention).
- Star-player happiness.
- Transfer policy alignment with fan profile.

### 4.3 Optional Media Confidence (0-100)

Pressure amplifier, not a fail-state on its own. Source: press conferences,
public statements, controversy management.

## 5. Expectation Profile per club

Different DNA → different acceptable bands. See
[[club-dna-and-governance]] §4. Examples:

| Club archetype | Acceptable Board | Acceptable Supporters |
|---|---|---|
| Tradition village club | Mid-table + youth investment | Identity intact, derby results |
| Investor club | Top-3 / European cup | Star signings, trophies |
| Selling club | Top half + transfer P&L positive | Player sales explained, replacements found |
| Sugar-daddy global | Trophies + global brand | Big names, brand events |

Both confidences are **club-weighted** so the same result yields different
verdicts at different clubs.

## 6. Sacking flow

```mermaid
flowchart TD
    LowConfidence["Confidence below threshold"] --> Warning["Verbal warning"]
    Warning --> Demand["Specific demand (e.g. win next 3)"]
    Demand --> Met{"Demand met?"}
    Met -- Yes --> Recovery
    Met -- No --> Sack["Sack discussion"]
    Sack --> Notice["Public notice + severance"]
    Notice --> Unemployed
```

Severance + reputation impact follow contract clauses.

## 7. Bundestrainer career arc (long-term goal)

The Anstoss-style long-term arc: a successful club career opens national-
team coaching offers. Locked in [[../60-Research/late-game-systems]]
(gap D6, 2026-05-17):

- **Dual-role**: user manages club + national team simultaneously
  (FM/Anstoss style) with **3 engagement levels** (Full Control /
  Match-Only / Light Touch) toggleable per save.
- **Unlock**: manager rep ≥ 75 AND (5+ seasons OR 3+ major club trophies).
- **Job offers** spawn post-tournament + on board confidence < 20.
  Priority: matching nationality + recent success in country + global rep.
- Tournament cycle: IFC Nations Championship every 4 years +
  Continental Championships offset 2 years → big tournament every 2 years.
- Assistant national team coach intermediate step **deferred to Phase 4**
  (can be boring; not core to Bundestrainer arc).
- Club coach → director of football → club CEO sub-game still
  Phase 3+ (separate from Bundestrainer arc).

Full design + tournament management UX + squad selection rules:
[[../60-Research/late-game-systems]] §4.

## 8. UI tier interactions

| Tier | Career-mode surface |
|---|---|
| Quick | "Job board badge" + monthly board verdict letter |
| Standard | Confidence gauges + sub-area breakdown |
| Expert | Per-criterion trend lines + Expectation Profile breakdown + media-pressure graph |

## 9. Career mode in async groups

When a private async group runs Manage-a-Club mode
([[async-multiplayer-private-group]]):

- Each manager picks (or is assigned) an existing club at group start.
- Sackings inside the group can happen but trigger group-rule decision
  (manager either takes a job at a worse club, drops out, or the group
  pauses and re-pairs).
- Reputation is per-group, not shared with singleplayer career.

## 10. Manager talent tree

Optional branch-based progression earned over a career. Branches:

- Press (better media outcomes).
- Coaching (training block effectiveness).
- Scouting (regional knowledge bonuses).
- Negotiation (transfer + contract effectiveness).
- Finance (budget release likelihood).

Earned by tenure + trophies, not by spending currency. Respec available
once per season.

## 11. Open tuning questions

- Confidence threshold for warning vs sack - tentative 30 / 15.
- Severance and gardening leave - tied to contract clauses set at hire.
- Should reputation be a single number or per-region? Per-region with a
  global aggregate.
- "Resign in protest" option - yes; affects reputation positively for
  fans, negatively for other boards.
## Related

- [[README]]
- [[GD-0017-mvp-scope-and-mode-sequencing]]
- [[../00-Index/MVP-Scope]]
- [[../60-Research/mode-design-research]]
- [[../60-Research/ai-manager-behaviour]]
- [[../60-Research/onboarding-strategy]]
- [[../60-Research/late-game-systems]]
- [[mode-create-a-club-roguelite]]
- [[onboarding-and-tutorial]]
- [[club-dna-and-governance]]
- [[fan-ecology]]
