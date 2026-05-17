---
title: Scouting and Recruitment - Funnel, Scout Attributes, Market Dynamics
status: draft
tags: [game-design, scouting, recruitment, transfers]
created: 2026-05-16
updated: 2026-05-17
type: game-design
binding: false
related: [[README]], [[../60-Research/player-strength-presentation]], [[squad-and-club-structure]], [[tactics-system]], [[transfer-market-and-contracts]], [[transfer-negotiations-p2p]]
---

# Scouting and Recruitment - Funnel, Scout Attributes, Market Dynamics

Recruitment is a seven-step funnel. Each step has a cost, an information
quality and a different kind of failure mode. The single biggest gameplay
choice is *where to spend scouting effort* given a finite budget.

## 1. Seven-step recruitment funnel

```mermaid
flowchart LR
    Need["1. Needs analysis"]
    Long["2. Long list"]
    Short["3. Short list"]
    Deep["4. Deep scouting"]
    Risk["5. Risk assessment"]
    Neg["6. Negotiation"]
    Integ["7. Integration"]
    Need --> Long --> Short --> Deep --> Risk --> Neg --> Integ
```

| Step | What it produces | Cost driver |
|---|---|---|
| Needs analysis | Required role list | Analyst quality |
| Long list | Many candidates, blurred data | Scout coverage |
| Short list | Filtered by role fit, budget, personality, timing | Scout role understanding |
| Deep scouting | Live + video + data report | Scout regional knowledge + time |
| Risk assessment | Adaptability, injuries, mentality flag | Personality reading |
| Negotiation | Contract terms | Manager + sport director |
| Integration | Onboarding, language, tactical learning | Coach + dressing room |

Skipping a step costs information quality - a "panic buy" without deep
scouting is technically possible but high-risk.

## 2. Scout attributes

| Attribute | Bearing |
|---|---|
| Current Ability judgement | Accuracy on present strength |
| Potential Ability judgement | Projection on youth |
| Regional knowledge | Data quality in given markets |
| Role understanding | Tactical fit analysis (linked to [[tactics-system]]) |
| Personality reading | Character + leadership |
| Network | More chances for early discovery |

Each scout attribute uses the same 1-20 scale as the wider player/staff model
unless a future staff-system note narrows it. A scout's value is the
*combination* against the club's recruitment strategy, not a single sum.

## 3. Player report opacity

A player report is *not* fully revealed instantly:

- **Layer 1** (first sight): Position, age, broad Impact band for the
  searched role context, top-line traits.
- **Layer 2** (after 2-3 reports): Approximate attributes (banded),
  category bands, personality cue.
- **Layer 3** (after deep scout): Numeric visible attributes (1-20), Role
  Impact range, PA range, hidden flags partly visible.

In Expert UI, opacity layers are explicit. In Quick / Standard, layers collapse
into qualitative Impact labels + a trust meter. The trust meter describes
information quality, not player quality.

### 3.1 Transfer-value knowledge

Transfer values follow the same knowledge model:

- own-club player contracts, wages and incoming offer terms are exact;
- external player valuations start as wide bands;
- better scouts, better analysts, regional knowledge, league data coverage,
  repeated reports and direct match exposure narrow the band;
- Expert UI shows the clearest available numbers: low / midpoint / high,
  confidence, source and "last updated";
- coaches can improve role-fit and tactical-fit confidence, but scouts and
  analysts drive market-value confidence.

The design target is clarity without false certainty. Expert users should see
numbers, but also why a number is trusted or fuzzy.

## 4. Market dynamics

Market dynamics are governed by [[transfer-market-and-contracts]] and the
binding research in [[../60-Research/transfer-market-simulation]]. Scout reports
never reveal one exact truth; they estimate valuation bands, player-side
openness and seller preferences.

Prices rise with:

- Competition (multiple clubs interested).
- Remaining contract length (shorter → cheaper).
- Wage demands.
- Agent relations.
- Other clubs' squad needs.
- Timing close to deadline.
- Position scarcity / market heat.
- Seller protection score.
- Clause preferences that reduce immediate cash.

In async multiplayer ([[async-multiplayer-private-group]]) the human-to-
human transfer market gains *bluffing* and *time-pressure exploitation* as
real strategies. See [[transfer-negotiations-p2p]].

## 5. Scouting budget allocation

Per period, the player allocates a scouting budget across:

- Regions (per continent / country / league tier).
- Player types (positions, age groups, role fit).
- Depth (broad coverage vs deep dives).
- Strategic targets (specific named players already short-listed).

The Chief Scout proposes default allocation; the player overrides.

## 6. Long list and short list management

The UI maintains two persistent lists:

- **Long list**: many candidates, periodic light updates from scouts.
- **Short list**: priority targets, frequent deep updates.

Each list entry shows trust meter, last update date and role/tactic Impact
context. There is no global OVR fallback for poorly scouted players.

## 7. Hidden flags surfaced by scouts

- Injury proneness.
- Big-match temperament.
- Professionalism / off-pitch behaviour.
- Adaptability (new country, new language).
- Ambition (will they accept rotation?).

Only deep + repeated scouting reveals these reliably.

## 8. Negotiation flow

See [[transfer-negotiations-p2p]] for human-to-human transfers; for AI
counter-parties:

```mermaid
sequenceDiagram
    participant U as User
    participant AI as AI Club
    participant Agt as Agent
    U->>AI: Offer (fee, structure)
    AI-->>U: Accept / Reject / Counter
    U->>Agt: Wage offer + bonuses + clauses
    Agt-->>U: Accept / Reject / Counter
    U->>AI: Finalise (clauses signed)
```

Clauses: sell-on %, bonus per appearance, bonus per league position,
release clause, buy-back / matching right, loan option / obligation, loyalty
bonus, language/lifestyle requirements. Internally, clause packages are compared
by cash-equivalent value.

## 9. UI tiers

| Tier | Surface |
|---|---|
| Quick | "Need a striker? Top 3 recommended" + price preview |
| Standard | Short list + scout reports + recommend transfer |
| Expert | Long list, regional heat map, scout coverage map, deep flags |

## 10. Open questions

- Should there be a "Recruitment Hub" page (FM26 pattern) that consolidates
  needs + budget + scout coverage? Yes - it is the Standard-tier home.
- Agent system depth: simple cost layer or full agent-relationship system?
  Simple cost at MVP; relationship Phase 2+.
- Free agent market: do agents proactively offer free agents to the club?
  Yes, weighted by scout network + brand strength.
