---
title: GD-0031 Analytics Hub and Statistics
status: accepted
tags: [game-design, statistics, analytics, data-hub, match, mvp, fmx-94]
created: 2026-06-05
updated: 2026-06-11
type: game-design
binding: false
linear: FMX-94
related:
  - [[README]]
  - [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
  - [[../60-Research/raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../20-Features/feature-statistics-analytics-hub-mvp]]
  - [[match-engine]]
  - [[progressive-disclosure-ui]]
  - [[../60-Research/player-strength-presentation]]
---

# GD-0031: Analytics Hub and Statistics

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

Nico selected the full MVP Analytics Hub direction during FMX-94 planning. This
GDDR records the game-design target; implementation waits for ADR-0081
ratification and later UI/spec work.

## Date

- Drafted: 2026-06-05

## Player experience goal

The manager should understand *why* results are happening, not just see a final
score. The Analytics Hub turns the match engine's event/spatial output into
actionable coaching, squad, transfer and long-save memory surfaces while keeping
official facts distinct from model estimates.

## Decided / strong direction

1. **Analytics Hub is MVP-active.** It is not a post-MVP stub. It supports
   immediate decision feedback and early long-save retention.
2. **Statistics do not become an OVR substitute.** Player comparison and
   per-90 leaderboards must respect [[../60-Research/player-strength-presentation]]:
   no universal global OVR and no hidden "best player" shortcut.
3. **Official vs estimated is visible.** Goals, assists, points and cards are
   official counts. xG/xA/xGA, PPDA, field tilt, zone control and maps are
   model-derived estimates.
4. **MVP metric set is broad but bounded.** Include core counting stats plus
   xG/xA/xGA, PPDA, field tilt, shot maps, pass maps, heatmaps, zone control,
   per-90 leaderboards, form windows and player/team comparisons.
5. **Every insight needs an action route.** A weakness insight should link to a
   relevant tactic, training, squad, transfer or scouting surface when the
   target surface exists.
6. **Long-save memory starts now.** Season summaries, leaderboards, records and
   immutable Manager & Legacy / HoF handoff snapshots are part of the MVP data
   spine even if deep Hall-of-Fame voting is later.

## MVP surfaces

| Surface | Purpose | Minimum content |
|---|---|---|
| Overview / Key Findings | Prevent data overload. | 3-7 ranked insights, trend arrows, league context, action links. |
| Last Match | Explain a result. | xG/xGA, shot quality, PPDA, field tilt, event timeline, player contribution, maps. |
| Team Analysis | Compare team style and effectiveness. | Per-90 offense/defense/possession/pressing/chance-quality rankings and percentiles. |
| Player Analysis | Evaluate players in role context. | Form, per-90 stat lines, role-relevant metrics, player comparison. |
| Standings and Leaders | Make competition state legible. | Standings history, leaders, top/bottom percentile context. |
| Form and Trend | Show momentum and regression risk. | 5/10-match rolling windows for official and derived metrics. |
| Season Summary | Seed long-save memory. | Final table, top performers, records, leaderboards and handoff snapshot. |

## Progressive disclosure

| Tier | Analytics depth |
|---|---|
| Quick | Key Findings, last-match summary, standings, top form flags. |
| Standard | Team/player analysis, per-90 comparisons, rolling form windows. |
| Expert | Full event log, heatmaps, pass maps, shot maps, zone control, PPDA/field-tilt details and comparison filters. |

## Metric families

**Core official counts**

- appearances, starts, minutes;
- goals, assists, shots, shots on target;
- saves, clean sheets, goals against;
- yellow/red cards, suspensions as public labels;
- points, wins/draws/losses, goals for/against, goal difference;
- streaks, standings rank, promotion/relegation/qualification status.

**MVP derived metrics**

- xG, xA, xGA;
- PPDA;
- field tilt;
- shot maps;
- pass maps;
- heatmaps;
- zone control;
- per-90 leaderboards and percentiles;
- team/player form and comparison indices.

**Post-MVP**

- expected threat (xT);
- on-ball value (OBV) or equivalent possession-value model;
- custom report builder;
- user-authored formulas;
- export/share;
- similarity search;
- deep Hall-of-Fame voting and cross-save record books.

## UX rules

- Prefer concise insight wording over raw chart walls.
- Every derived metric explains its direction and source family in plain
  language.
- Show league context through percentile/rank, not raw values alone.
- Avoid false precision for modeled metrics; use bands/rounding where the model
  is not calibrated.
- Do not hide source freshness: stale projections need a visible loading/stale
  state.

## Open / calibration

- Final xG/xA/xGA formulas.
- PPDA zone definition and field-tilt zone definition.
- Zone-control grid resolution and heatmap sampling.
- Insight ranking weights.
- Thresholds for "notable" records and news hooks.
- Exact relationship between Analytics Hub summaries and Manager & Legacy
  prestige/HoF scoring (FMX-95 / E6-3).

## Related

- [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
- [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
- [[../20-Features/feature-statistics-analytics-hub-mvp]]
- [[match-engine]]
- [[progressive-disclosure-ui]]
- [[../60-Research/player-strength-presentation]]
