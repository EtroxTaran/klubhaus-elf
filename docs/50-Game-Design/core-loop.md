---
title: Core Loop - Season Arc and Weekly Heartbeat
status: draft
tags: [game-design, core-loop, pacing]
created: 2026-05-16
updated: 2026-05-18
type: game-design
binding: false
related:
  - [[README]]
  - [[GD-0017-mvp-scope-and-mode-sequencing]]
  - [[../60-Research/anstoss-series-deep-dive]]
  - [[../60-Research/systems-design-synthesis]]
  - [[mode-create-a-club-roguelite]]
  - [[mode-manage-a-club-career]]
---

# Core Loop - Season Arc and Weekly Heartbeat

> **REOPENED on 2026-05-27:** This game-design note is `draft` again. Any `approved`, `binding`, or `locked` wording below is historical pre-reopen context until Nico re-approves it.

The single most important game-design decision: how often the player taps,
what they tap on, and what happens between taps. Everything else - economy,
tactics, fans, transfers - rides on the loop.

MVP sequencing note: the loop first ships through
[[mode-create-a-club-roguelite]]. [[mode-manage-a-club-career]] uses the same
loop when it becomes playable post-MVP.

## 1. Three nested loops

```mermaid
flowchart LR
    Day["Day tick<br/>(seconds)"] --> Week["Week tick<br/>(minutes/hours)"]
    Week --> Season["Season arc<br/>(weeks)"]
    Season --> Career["Career arc<br/>(years)"]
```

| Loop | Cadence | Player verb | Stakes |
|---|---|---|---|
| **Day tick** | One real-life button press, instant | Advance, edit, accept | A training, a media reply, an inbox card |
| **Week tick** | 5-25 min of real time | Plan, simulate, react | One match, one cycle of training + scouting + transfers |
| **Season arc** | 20-30 weeks at game cadence | Compete, develop, position | Promotion / relegation, board verdict, transfers |
| **Career arc** | Many seasons | Strategise, evolve | Reputation, manager talent tree, legacy |

## 2. Season arc

```mermaid
flowchart LR
    A["Pre-season<br/>~7 weeks<br/>conditioning + chemistry"] --> B["League weeks<br/>1 match/week"]
    B --> C{"Cup week?"}
    C -- yes --> D["Midweek match<br/>rotation + regen"]
    C -- no --> E["Standard week"]
    D --> F["Weekend match"]
    E --> F
    F --> G{"Winter break?"}
    G -- yes --> H["Mini pre-season<br/>regen + camp"]
    G -- no --> B
    H --> B
    B --> I["Season end<br/>review + board verdict"]
    I --> J["Transfer window<br/>+ youth promotions"]
    J --> A
```

Source pattern: [[../60-Research/anstoss-series-deep-dive]] §4 (Anstoss
7-week pre-season + winter break) consolidated with FM weekly model.

## 3. Standard league week

```mermaid
flowchart TD
    Mon["Mon<br/>Match recap, media, board pulse"] --> Tue["Tue<br/>Light training, individual focus"]
    Tue --> Wed["Wed<br/>Tactical training + injury check"]
    Wed --> Thu["Thu<br/>Scouting / transfer triage"]
    Thu --> Fri["Fri<br/>Matchday-1: tactic lock, press"]
    Fri --> Sat["Sat<br/>MATCHDAY"]
    Sat --> Sun["Sun<br/>Regen, fan mood, finance tick"]
    Sun --> Mon
```

## 4. Day-tick model

Each day tick is one explicit "advance" verb on the UI. The day produces:

- 0..N inbox cards (board, sponsor, media, scout, fans, staff).
- Auto-applied training (if not edited).
- Auto-applied schedule actions (if not edited).
- A match if the day is match-day.

The player **always** has a "next" verb on screen. They never wonder what to
click. This is the Anstoss "office-as-cockpit" pattern made mobile.

## 5. Skip rule

Days the player does not customise fast-forward through:

- Recovery days.
- Light training days.
- Pure off-days.
- Empty inbox days.

Days the player **must** see:

- Match-day.
- Match-day âˆ’1 (tactic lock).
- Inbox with priority cards (board demand, sponsor decision, injury).

This is how a 5-min/week casual session and a 25-min/week power session
share the same engine but produce different click depth.

## 6. Match-day choreography

```mermaid
sequenceDiagram
    participant P as Player
    participant UI as Match-day UI
    participant ME as Match Engine
    P->>UI: Open match-day screen
    UI->>P: Show lineup, tactic preview, fan mood
    P->>UI: Confirm lineup OR auto-coach
    UI->>ME: Start match
    ME->>UI: Stream events (text / 2D / highlights)
    UI->>P: Halftime modal (3 controls)
    P->>UI: Apply halftime tweaks
    UI->>ME: Resume
    ME->>UI: Final whistle + stats
    UI->>P: Match-Report tier (Quick / Standard / Expert)
```

Reports vary by user UI tier - see [[progressive-disclosure-ui]].

## 7. Season-end gate

The season-end "gate" (board verdict + transfer window + youth promotions)
is the only mandatory full-detail event in a season. Cannot be skipped, can
be paused. Outcomes:

- Manager stays / is sacked / is offered new role (career mode).
- Manager run continues / ends (roguelite mode).
- Board sets new expectation profile.
- Transfer budget + wage budget set.

Detail per mode: [[mode-manage-a-club-career]] / [[mode-create-a-club-roguelite]].

## 8. Async cadence overrides

In an async private group ([[async-multiplayer-private-group]]) the day-tick
loop is driven by the group rule set:

- **Fixed Cadence**: match-day is on a real-life calendar day.
- **Dynamic Cadence**: match-day opens when a quorum of managers has marked
  their week complete.

In both, the **week structure** above is the same; only what triggers the
match-day differs.

## 9. Future-scope notes (classified future-scope)

- How long is a "default" Quick-tier session? Target ≤ 5 min for a normal
  week, ≤ 15 min for a match-day with halftime tweaks.
- Should the season length be configurable per scenario pack
  ([[community-editor-and-datasets]])? Recommendation: yes, with a sensible
  default per league.
- Should the day tick be visualised as a calendar or as an "office clock"
  (Anstoss feel)? Both - calendar view is primary; office vignette is the
  flavour layer.
## Related

- [[README]]
- [[GD-0017-mvp-scope-and-mode-sequencing]]
- [[../60-Research/anstoss-series-deep-dive]]
- [[../60-Research/systems-design-synthesis]]
- [[mode-create-a-club-roguelite]]
- [[mode-manage-a-club-career]]
