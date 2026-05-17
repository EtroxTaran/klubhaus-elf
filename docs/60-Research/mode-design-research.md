---
title: Game Mode Patterns - Roguelite, Career, Singleplayer, Async Group
status: in-review
tags: [research, modes, roguelite, multiplayer, synthesis, wave-2]
created: 2026-05-16
updated: 2026-05-16
type: research
binding: false
related: [[raw-perplexity/raw-game-modes]], [[../50-Game-Design/mode-create-a-club-roguelite]], [[../50-Game-Design/mode-manage-a-club-career]], [[../50-Game-Design/singleplayer-baseline]], [[../50-Game-Design/async-multiplayer-private-group]]
---

# Game Mode Patterns - Roguelite, Career, Singleplayer, Async Group

Distilled from four parallel Perplexity iterations
([[raw-perplexity/raw-game-modes]]) into the recommended product structure
for soccer-manager.

## 1. Product rule

**One simulation core, two content modes, two session modes.** Yields four
valid combinations:

| Content mode | Session mode |
|---|---|
| Create-a-Club Roguelite | Singleplayer |
| Manage-a-Club Career | Singleplayer |
| Create-a-Club Roguelite | Private Async Group |
| Manage-a-Club Career | Private Async Group |

Cross-cutting rule: **a private async group is locked at creation to ONE
content mode**. Mixing Create-a-Club (procedural club, zero reputation,
insolvency-prone) and Manage-a-Club (inherited club, reputation,
expectation profile) inside one league destroys balance and fairness.

## 2. Mode-rule architecture

Modes are *rule profiles* on top of a shared core, not content silos:

- **Simulation Core**: squad, player development, finances, stadium, fans,
  sponsors, tactics, match engine.
- **Mode Rules**: Create-a-Club Roguelite or Manage-a-Club Career.
- **Session Rules**: Singleplayer or Private Async Group.
- **Interaction Rules**: async / deadline-based / synchronous per action.

This makes balance, content production and maintenance tractable.

## 3. Create-a-Club Roguelite - best-practice patterns

### Run definition

- **Start**: club foundation, small infrastructure, low reputation, weak
  network, tight cash-flow.
- **End**: insolvency, loss of control, forced dissolution or optional
  deliberate retirement.
- **Between runs**: persist *legacy systems* only - unlocked club
  archetypes, cosmetic identity, starting regions, network advantages,
  manager traits, small infra bonuses.

### Meta-progression rule of thumb

> Meta-progression must make the next run **different, not easier**.

- **Option unlocks** > grindy currency: new founding profiles, sponsor
  archetypes, youth philosophies.
- **Small soft carries** > big power buffs: scout contact, slight credit
  bonus, cheaper plot.
- **Narrative legacy**: former runs + players echo through the universe.
- **Staged tutorial**: lock complexity early, reveal sponsoring / grounds
  / youth pipeline / advanced tactics across runs.

### Permadeath stays meaningful

Real failure state preserves stakes. The research is explicit: meta-progression
must not make the next run *trivially easier* - only *structurally richer* or
*informed*.

## 4. Manage-a-Club Career - rating system

Adopt Football Manager's split-confidence pattern verbatim:

| Layer | Rates primarily |
|---|---|
| Board | Season goal, budget discipline, transfer policy, club development |
| Fans | Derby results, attractive play, identification, star players, transfers |
| Media (optional) | Pressure amplifier and narrative, no own fail-state |

Each confidence is **decomposed into sub-areas** (competition results,
finances, individual matches, transfer activity, squad performance). That
makes sackings legible instead of arbitrary.

Add an **Expectation Profile per club** - a tradition club, investor club,
training club and village club must not share the same criteria. The rating
system is club-weighted.

Fans are not homogeneous. Adopt the 6-segment Supporter Profile (Hardcore,
Core, Family, Fair Weather, Corporate, Casual) - see
[[fan-culture-segmentation-research]].

### Consequences

- A manager can be sportingly OK and still wobble if club DNA is destroyed.
- A manager can have money problems and still be loved by fans.
- 10th place on lean cost is safer than 6th place on a wage time bomb.

## 5. Singleplayer baseline

Singleplayer is the **full reference experience**, not the lite mode:

- Fully pausable, accelerable, delegable.
- Both content modes available.
- All sub-systems fully available.
- Optional comfort automation for training, media, staff, scouting.

Multiplayer rules are **derived** from singleplayer.

## 6. Async Multiplayer private group

Hard rules:

- Groups are private and invite-only.
- Mode locked at group creation (Create or Manage), never mixed.
- Server (not client) drives league rhythm + state transitions.
- No player blocks the whole group.
- Inactivity → defaults or assistant logic.

Detail (cadence variants, watch parties, transfer escalation) lives in
[[async-multiplayer-research]].

## 7. Mixing async and synchronous interactions

Three interaction tiers:

### 7.1 Pure async

Training, tactics prep, scouting, sponsor evaluation, stadium / grounds
planning, staff hiring, transfer offers to AI clubs, contract decisions.
Local actions; no peer waiting.

### 7.2 Deadline-based

Offers to other human managers, counter-offers, bidding on the same free
agent, sponsor / draft phases, waiver / auction systems, league-rule votes.
Pattern: **respond-by-X** with auto-fallback (rejection, expiry, last valid
choice).

### 7.3 Synchronous or optional

Direct human-to-human negotiations, human-vs-human match-days with active
tactical adjustments, group-wide live events (play-off finals, draft finale),
emergency votes.

These live moments must stay **optional or rare** - otherwise async
collapses back into hidden sync.

## 8. Recommended weekly rhythm (fixed cadence default)

| Day | Activity |
|---|---|
| Mon-Fri | Async management phase |
| Fri evening | Transfer + contract deadline |
| Sat | Match-day simulation |
| Sun | Review, media, fan reactions, injury report |

Higher-tempo alternative: Wed + Sat match-days, two short management
windows in between.

## 9. Strongest patterns (consolidated across 4 iterations)

- Modes are rule profiles, not content silos.
- Roguelite: hard runs + fair meta-progression.
- Career: split stakeholder rating (board + fans + club expectation profile).
- Async groups: deadlines, defaults, inactivity rules, few real live moments.
- Create-a-Club and Manage-a-Club never mix in the same group.

## 10. Sources (new URLs)

All retrieved 2026-05-16.

- Game Developer on async game design - [gamedeveloper.com asynchronicity in game design](https://www.gamedeveloper.com/game-platforms/analysis-asynchronicity-in-game-design)
- Wayline async multiplayer in mobile gaming - [wayline.io async multiplayer](https://www.wayline.io/blog/asynchronous-multiplayer-gaming-at-your-own-pace)
- FM Scout supporter confidence reference - [fmscout.com confidence](https://www.fmscout.com/confidence.htm)
- footballmanager.com supporter confidence feature - [footballmanager.com supporter-confidence](https://www.footballmanager.com/features/supporter-confidence)
- Sortitoutsi FM23 supporter confidence - [sortitoutsi.net FM23](https://sortitoutsi.net/content/61059/fm23-new-support-confidence-feature)
- Roguelite tips by Entaltos Studios - [entaltostudios.com 5 essential tips](https://entaltostudios.com/5-essential-tips-to-make-your-roguelite-game-work/)
- Permadeath outcomes (Pisos Albacete) - [pisosalbacete.com permadeath outcomes](https://www.pisosalbacete.com/developing-meaningful-permadeath-outcomes-that-enhance-roguelike-user-involvement/)
- Hamatti notes - meta-progression with gradual tutorial - [notes.hamatti.org meta-progression](https://notes.hamatti.org/gaming/video-games/meta-progression-with-gradual-tutorial-in-roguelike-games)
- Theseus roguelike thesis - [theseus.fi roguelike thesis](https://www.theseus.fi/bitstream/handle/10024/881994/Kammonen_Eino.pdf?sequence=2)
- Pingle Studio multiplayer essentials - [pinglestudio.com multiplayer essentials 2024](https://pinglestudio.com/blog/multiplayer-game-development-essentials-in-2024)
- Reddit r/roguelites meta-progression debate - [reddit roguelites meta-progression](https://www.reddit.com/r/roguelites/comments/1s1y1fh/if_a_game_with_permadeath_rng_and_metaprogression/)
