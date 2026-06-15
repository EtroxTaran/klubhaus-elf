---
title: Raw Perplexity - Deterministic Simulation QA Harness
status: raw
tags: [research, raw, perplexity, determinism, replay, soak-test, save-forward, match-engine, quality, fmx-196]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-196
related:
  - [[../deterministic-simulation-qa-harness-2026-06-15]]
  - [[raw-deterministic-simulation-qa-source-checks-2026-06-15]]
  - [[../../40-Quality/deterministic-simulation-qa-harness]]
  - [[../../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  - [[../../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
---

# Raw Perplexity - Deterministic Simulation QA Harness

## Capture metadata

- Captured: 2026-06-15
- Tool: Perplexity Sonar via MCP
- Purpose: First-pass research for FMX-196 deterministic simulation QA harness,
  replay artifacts, seed tiers, soak metrics and save-forward compatibility.
- Status: Raw research capture. Not binding implementation guidance.
- Source-quality note: Perplexity returned useful structure but weak source
  trails for several game-precedent claims. The source-check note
  [[raw-deterministic-simulation-qa-source-checks-2026-06-15]] records what was
  verified and what was not canonized.

## Prompt

> Football Manager X issue FMX-196: research a deterministic simulation QA
> harness for a football manager game. Context: docs-only architecture phase.
> Existing direction: single Rust/WASM match engine module, seeded deterministic
> simulation, multiple quality profiles (competitive-full,
> interactive-standard, background-detailed, background-fast), long-horizon
> career simulation, save-forward compatibility needed. Need evidence from
> real-world simulation QA and other games. Research: (1) replay artifact
> design: input log, seed, version, deterministic hash, snapshots, trace;
> (2) seed fixture tiers for PR/nightly/release/long-soak; (3) statistical soak
> metrics for football realism and economy health; (4) save-forward
> compatibility matrix for career saves vs match replays; (5) real game/genre
> precedents like deterministic lockstep, Factorio desync/replay reports,
> RTS/GGPO-style rollback, Football Manager save compatibility where public;
> (6) best-practice decision options with pros/cons and a recommendation for
> each. Include source URLs, confidence per source, and call out claims that
> require source-checking.

## Perplexity answer capture

### Replay artifact design

Perplexity recommended one canonical `MatchReplay` family with:

- metadata: engine version or commit, ruleset version, content schema version,
  platform/build config, feature flags, quality profile, match/competition/season
  identifiers;
- canonicalized initial state: players, lineups, tactical instructions, pitch,
  weather, referee/noise settings and other logical state, not fragile engine
  object IDs;
- deterministic random state: global seed plus per-stream seeds or strict RNG
  stream protocol; no scattered direct random calls;
- input log: simulation-tick commands such as tactical changes, substitutions
  and system commands, not wall-clock UI speed;
- integrity hashes: initial, final and optional checkpoint hashes over
  canonical state;
- optional snapshots: sparse QA/debug keyframes for fast seeking and divergence
  bisection;
- optional debug trace: AI branch choices, collision/duel outcomes and other
  high-value diagnostics only in QA/dev runs.

Options returned:

| Option | Meaning | Perplexity assessment |
|---|---|---|
| A | Minimal deterministic log: seed, initial state, input log, final hash. | Small and robust, but weak for mid-match debugging. |
| B | Checkpointed deterministic log. | Recommended for internal QA because it supports binary-search debugging and replay seeking. |
| C | Full trace logging. | Maximum insight, too large for routine use. |

Perplexity recommended Option B for internal QA and Option A for lightweight
player bug reports.

### Seed fixture tiers

Perplexity recommended scenario fixtures across team-strength, style, player
attribute extremes, weather/pitch, match phase and quality profile axes.

Suggested tiers:

| Tier | Purpose | Shape |
|---|---|---|
| T1 PR/pre-merge | Fast determinism and hard invariant check | 10-30 short scenario seeds, 3-5 simulated minutes or small full fixtures. |
| T2 nightly | Broader deterministic and statistical coverage | 50-200 full matches across quality profiles. |
| T3 release candidate | Stress and compatibility coverage | 500-2000 matches plus save-forward matrix. |
| T4 long-soak/career | Emergent long-horizon validation | 20-50 seasons or deeper dedicated runs. |

Perplexity also suggested a scenario generator to promote newly discovered
regressions into stable fixtures.

### Soak metrics

Perplexity grouped metrics into:

- match-level football realism: goals per game, shots/shots-on-target, xG if
  modeled, fouls/cards, home advantage and scoreline distribution;
- player/team metrics: top scorer distribution, injury rates, player
  development curves and squad utilization;
- economy/career health: bank balance, debt, wage/transfer inflation,
  competitive balance, title concentration and talent funnel.

Recommended test posture:

- hard invariants fail immediately;
- realism and economy metrics use baselines, statistical envelopes and effect
  sizes;
- dashboards and drift reports are needed before blocking all statistical
  deviations.

### Save-forward compatibility matrix

Perplexity distinguished career saves from deterministic match replays:

- career saves should be migrated forward within an approved compatibility
  window;
- match replays are stricter and should only be guaranteed with the same
  engine/rules/content versions unless old engines are retained;
- version mismatch should be explicit rather than silently re-simulating an old
  result as if it were canonical.

Options returned:

| Option | Meaning | Perplexity assessment |
|---|---|---|
| A | Strong career compatibility, strict same-version replay compatibility. | Recommended. Reasonable engineering burden and compatible with serious management-sim UX. |
| B | Strong compatibility for both careers and replays via old embedded engines. | Best preservation, high binary/maintenance/QA cost. |
| C | Weak/best-effort for both. | Lowest overhead, poor user trust. |

### Game and genre precedents

Perplexity cited deterministic lockstep/RTS patterns, GGPO-style rollback,
Factorio desync reports and Football Manager save compatibility. It explicitly
flagged the following claims as needing source checks:

- exact Factorio desync report contents;
- Football Manager internal QA process and deterministic match-engine claims;
- precise Football Manager save compatibility rules for each edition;
- RTS/GGPO details beyond the general input-log/snapshot pattern.

The targeted source-check note verifies only the parts that can be backed by
primary or high-signal sources.

## Perplexity-returned citations and confidence caveat

Perplexity returned a mixed source list:

- YouTube videos on netcode/game development:
  <https://www.youtube.com/watch?v=aqUXLNpzIlY>,
  <https://www.youtube.com/watch?v=BjvuD6BhHRw>,
  <https://www.youtube.com/watch?v=yz8w7ZEcrXo>
- Facebook group post:
  <https://www.facebook.com/groups/2253064339/posts/10163782809229340/>
- Wikipedia for the 1982 Football Manager game:
  <https://en.wikipedia.org/wiki/Football_Manager_(1982_video_game)>
- Steam community FM19 discussion:
  <https://steamcommunity.com/app/872790/discussions/0/1742229167198377690/>

These were treated as weak or contextual only. The synthesis uses the stronger
source-check set instead.
