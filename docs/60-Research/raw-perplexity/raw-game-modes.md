---
title: Raw - Game Mode Patterns and Best Practices
status: raw
tags: [research, raw, perplexity, modes, roguelite, multiplayer]
created: 2026-05-16
updated: 2026-05-16
type: research-raw
binding: false
related: [[README]], [[../mode-design-research]]
---

# Raw - Game Mode Patterns and Best Practices

> Source: private Perplexity transcripts (2026-05-16), Doc 2 sections 2283-3300.
> Four parallel Perplexity iterations on the same prompt about how Create-a-Club
> Roguelite + Manage-a-Club Career + Singleplayer + Async Private Group should
> coexist. Feeds [[../mode-design-research]] and the `mode-*` notes in
> `50-Game-Design/`.

## English summary

All four iterations converge on the **same product architecture**: one shared
simulation core, two content modes (Create-a-Club Roguelite, Manage-a-Club
Career), two session modes (Singleplayer, Private Async Group). That is a
**2 × 2 matrix** giving four valid combinations. A private group is locked to
one content mode at creation and cannot mix - Create and Manage have
incompatible reputation/fairness assumptions.

Roguelite best-practice (across all iterations):

- Each run starts with newly-founded club, small infra, low reputation, weak
  network, tight cash.
- Run ends on insolvency, control loss, forced dissolution or optional
  deliberate retirement.
- Meta-progression must make next run **different, not easier**: option
  unlocks (new founding profiles, sponsor archetypes), soft carries (scout
  contact, small credit bonus, cheaper plot), narrative legacy (past runs
  echo through the universe).
- Meta-progression also doubles as a *staged tutorial*: complexity ramps run
  over run instead of dumping it all upfront.

Manage-a-Club Career rating system (Football Manager pattern):

- Split **Board Confidence** (goals, finance, strategy) from **Supporter
  Confidence** (identity, derbies, style, transfers, individuals).
- Each is decomposed into sub-areas (competition, finance, individual games,
  squad performance) instead of one global gauge.
- Add an *Expectation Profile* per club so a tradition club and a sugar-daddy
  club aren't judged identically.
- Fans are not homogeneous: use a 6-segment Supporter Profile (Hardcore,
  Core, Family, Fair Weather, Corporate, Casual).

Singleplayer = the full reference experience: every system available, freely
pausable, accelerable, delegable. Multiplayer is *derived from* singleplayer
by adding rule constraints, not the other way round.

Async multiplayer needs: invite-only private groups; locked content mode at
creation; server-driven progress (never client-driven); explicit defaults +
fall-backs on inactivity. Mixing async and sync: most actions are async
(training, scouting, building, sponsoring, staff, finance, tactics
prep). Some are deadline-based (player-to-player offers, free-agent
competition, sponsor/draft phases, votes). A few are synchronous or
optionally synchronous (direct two-human negotiations, human-vs-human
match-day live coaching, group play-offs / draft finals, league-rule votes).

## 1. Common core - non-negotiable

All modes share: squad, player development, finances, stadium, fans,
sponsors, tactics, match engine. Mode differences arise from **rule shells**
on top of the same simulation:

- **Simulation Core**: club, player, league, match engine, economy.
- **Mode Rules**: Create-a-Club Roguelite or Manage-a-Club Career.
- **Session Rules**: Singleplayer or Private Async Group.
- **Interaction Rules**: async, deadline-based or synchronous per action type.

## 2. Create-a-Club as Roguelite

### Run definition

- **Start**: club foundation, small infrastructure, low reputation, weak
  network, tight cash-flow.
- **End**: insolvency, loss of control, forced dissolution or optional
  deliberate career retirement.
- **Between runs**: persist only as **legacy systems** - unlocked club
  archetypes, cosmetic identity, starting regions, small network advantages,
  manager traits, light infrastructure bonuses.

### Meta-progression best practices (verbatim, consolidated)

- **Option unlocks** > grindy currency: new founding profiles, sponsor
  archetypes, youth philosophies.
- **Small soft carries** > big power buffs: a scout contact, slight credit
  bonus, cheaper plot.
- **Narrative legacy**: former runs and players reappear in the universe.
- **Staged tutorial**: lock complexity early, reveal sponsoring / grounds /
  youth pipeline / advanced tactics across runs.
- Avoid permanent stat jumps - they erase skill and drama.

### Why permadeath stays meaningful

Real failure state preserves stakes. Source iterations explicitly warn that
meta-progression must not make the next run *trivially easier* - only
*structurally richer* or *informed*.

## 3. Manage-a-Club and rating system

### Layered rating (verbatim from sources)

| Layer | Rates primarily |
|---|---|
| Board | Season goal, budget discipline, transfer policy, club development |
| Fans | Derby results, attractive play, identification, star players, transfers, tactics |
| Media / public (optional) | No fail-state of its own; amplifies pressure + narrative |

### Sub-areas inside each confidence

Football Manager pattern: confidence is decomposed into competition results,
finances, individual matches, transfer activity, squad performance. This is
what makes sackings *legible* rather than arbitrary.

### Supporter profile (6 segments)

Hardcore, Core, Family, Fair Weather, Corporate, Casual - each with its own
trigger drivers (identity, security, hospitality, success, …).

### Expectation profile per club

Tradition club, investor club, training club, village club must not share
the same criteria. The rating system must be **club-weighted**.

### Design consequence

- A manager can be sportingly OK and still wobble if the club DNA is
  destroyed.
- A manager can have money problems and still be loved by fans.
- A 10th-place finish on lean cost is safer than 6th-place on a wage time
  bomb.

## 4. Singleplayer baseline

- Fully pausable, accelerable, delegable.
- Both content modes available.
- All sub-systems fully available.
- Optional comfort automation for training, media, staff, scouting.

Singleplayer is **not** the lite mode - it is the baseline from which
multiplayer rules are derived.

## 5. Async multiplayer with private group

### Hard rules

- Groups are private and invite-only.
- Group is locked at creation to one content mode (Create or Manage), not
  mixed.
- Server (not client) decides league rhythm and state transitions.
- No player blocks the whole group.
- Inactivity falls back to defaults or assistant logic.

### Why no mixed groups

Create-a-Club brings procedurally generated clubs, different reputation, a
different fail-state. Manage-a-Club inherits existing club structures, fan
profile, expectations and squad. Mixing them destroys balance, sponsoring
and fairness.

## 6. Mixing async and sync correctly

### Pure async (no live interaction needed)

- Training
- Tactics prep
- Send scouts
- Sponsor evaluation
- Stadium / grounds planning
- Hire staff
- Transfer offers to AI clubs
- Contract decisions with deadlines

### Deadline-based (opponent or shared resource but no live presence)

- Offers to other human managers
- Counter-offers
- Bidding on the same free agent
- Sponsor / draft phases
- Waiver / auction systems
- League-rule votes

Pattern: **respond-by-X** with an auto-fallback (rejection, expiry, last
valid choice). Default + escalation are *not optional*.

### Synchronous or optionally synchronous

- Direct human-to-human negotiations
- Human-vs-human match-days with active in-game tactical adjustments
- Group-wide live events: play-off finals, draft finale
- Emergency votes, league-rule decisions

These live moments must stay **optional or rare**. If a player is not live,
the last saved line-up / tactic or an assistant fall-back must apply.
Otherwise async collapses back into hidden sync.

## 7. Recommended weekly rhythm

Example schedule (fixed cadence variant):

- **Monday-Friday**: async management phase.
- **Friday evening**: transfer + contract deadline.
- **Saturday**: match-day simulation.
- **Sunday**: review, media, fan reactions, injury report.

Higher tempo:

- **Wednesday + Saturday** as match-days.
- Two short management windows in between.

## 8. When players must directly interact

Direct interaction is sensible for:

- Transfer negotiations between two humans.
- Competition for the same free agent.
- Human-vs-human match.
- Group-rule votes and events.

Direct interaction is *not* needed for:

- Own training.
- Own stadium build-out.
- Own budget planning.
- Own staff.
- Own tactic vs AI.
- Youth promotion and internal club decisions.

## 9. Product rule

**One simulation core, two content modes, two session modes.** Yields four
combinations:

| Content mode | Session mode |
|---|---|
| Create-a-Club Roguelite | Singleplayer |
| Manage-a-Club Career | Singleplayer |
| Create-a-Club Roguelite | Private Async Group |
| Manage-a-Club Career | Private Async Group |

Everything is in the same product without doubling systems. Mixing inside a
group is forbidden.

## 10. Strongest patterns (consolidated across 4 iterations)

- **Modes are rule profiles, not content silos.**
- Roguelite requires hard runs but fair meta-progression.
- Career requires split stakeholder rating (board + fans).
- Async groups require deadlines, defaults, inactivity rules and few real
  live moments.
- Create-a-Club and Manage-a-Club must not be mixed inside a group.

## 11. Citations preserved

Iterations 7-10 cite gamedeveloper.com (asynchronicity analysis), fmscout
(confidence article), footballmanager.com (supporter confidence feature),
pisosalbacete.com (permadeath outcomes paper), entaltostudios.com (roguelite
tips), Reddit r/roguelites (meta-progression debates), pinglestudio.com
(multiplayer essentials), wayline.io (async multiplayer, mobile), notes
.hamatti.org (meta-progression with gradual tutorial), theseus.fi
(roguelike thesis), sortitoutsi.net (FM23 supporter confidence). Full URL
list in source `.md`; new URLs surface only via
[[../mode-design-research]] §Sources.
