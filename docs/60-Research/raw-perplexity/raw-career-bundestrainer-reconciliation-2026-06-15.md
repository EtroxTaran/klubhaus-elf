---
title: Raw Perplexity - Career Bundestrainer Reconciliation
status: raw
tags: [research, raw, perplexity, career, national-team, bundestrainer, reputation, calibration, fmx-130]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-130
related:
  - [[../career-bundestrainer-reconciliation-2026-06-15]]
  - [[raw-career-bundestrainer-source-checks-2026-06-15]]
  - [[../../50-Game-Design/mode-manage-a-club-career]]
  - [[../../50-Game-Design/GD-0033-national-team-dual-role]]
  - [[../../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
---

# Raw Perplexity - Career Bundestrainer Reconciliation

## Prompt

Research FMX-130: reconcile a football-manager Career-mode
Bundestrainer/national-team dual-role unlock with an existing approved design
that says manager reputation >= 75 AND 5 in-game seasons, no trophy shortcut.

Questions:

1. Should major trophies bypass the tenure gate, or only feed reputation?
2. Should board-confidence thresholds for national-team job offers and
   sack/warning be fixed constants or calibration slots?
3. Should manager reputation be one global score or per-region reputation with a
   global aggregate?

Use real-world football career patterns and comparable games such as Football
Manager, EA FC/FIFA Manager, Anstoss, OOTP/EHM/Hattrick where relevant. Give
2-3 options per question, clear recommendation, best-practice rationale, and
source links.

## Response capture

Perplexity recommended keeping the existing `manager reputation >= 75 AND 5
in-game seasons` gate and treating major trophies as reputation accelerators,
not tenure bypasses. Its rationale was that national-team jobs should feel like
federation trust and accumulated career standing, not a one-season superclub
exploit path.

### D1 - Trophies and tenure

| Option | Summary | Perplexity assessment |
|---|---|---|
| A. No bypass; trophies feed reputation | Trophies accelerate progress toward the reputation gate while the five-season tenure gate remains mandatory. | Recommended. Preserves pacing, avoids single-season unlock exploits and matches the existing approved GD-0033 direction. |
| B. Soft bypass / heavy trophy weighting | Major trophies partially substitute for seasons. | Responsive but more arcade-like; risks weakening the long-horizon career fantasy. |
| C. Full bypass for specific trophies | One elite trophy immediately unlocks the role. | Not recommended; undermines the tenure/trust premise. |

### D2 - Threshold treatment

| Option | Summary | Perplexity assessment |
|---|---|---|
| A. Fixed constants | One universal warning/sack/offer threshold. | Prototype-simple but too rigid across club profiles and federation cultures. |
| B. Calibration slots with defaults | Defaults exist, but values are slot-owned and tuneable. | Recommended. Keeps player-facing language stable while allowing playtest tuning. |
| C. Fully dynamic hidden thresholds | Thresholds derived from hidden simulation context. | Most adaptive but opaque and hard to debug. |

Perplexity recommended separating club sack/warning thresholds from the
national-team offer-window floor and storing both as calibration slots, with
player-facing qualitative labels rather than unreviewed hard-coded numbers.

### D3 - Reputation topology

| Option | Summary | Perplexity assessment |
|---|---|---|
| A. One global score | Single reputation value everywhere. | Simple but loses regional realism. |
| B. Per-region only | Separate reputation by country/region, no global summary. | Realistic but harder to explain and fragments progression. |
| C. Per-region plus global aggregate | Regional values drive offer likelihood; global aggregate drives broad prestige/unlock gates. | Recommended. |

Perplexity recommended the per-region + global aggregate model: the global
aggregate can preserve the visible `>= 75` unlock gate while regional/national
reputation influences national-team job ranking and federation trust.

## Perplexity source quality note

The Perplexity response cited a mix of official and weak community/video
sources: Football Manager's official Dugout site, Reddit, FMMVibe and
YouTube/TikTok links. The conclusion aligns with FMX's accepted GD-0033/ADR-0084
records, but the external citations do not prove exact Football Manager
formulas. The source-check companion file therefore treats Perplexity as
discovery and checks claims against FMX canonical notes plus targeted web
sources.

## URLs surfaced by Perplexity

- https://www.footballmanager.com/the-dugout
- https://fmmvibe.com/forums/topic/49916-unlocking-other-managerial-badges/
- https://fmmvibe.com/forums/topic/39399-how-does-managerial-reputation-work/
- https://www.reddit.com/r/footballmanagergames/comments/n05et2/i_just_got_football_manager_after_playing_career/

