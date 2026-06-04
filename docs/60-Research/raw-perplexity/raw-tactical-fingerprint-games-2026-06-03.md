---
title: "RAW — How comparable games model & surface manager/team tactical identity"
status: raw
tags: [research, raw, perplexity, games, tactics, identity, ux, fmx-68]
created: 2026-06-03
updated: 2026-06-03
type: research
related: [[../tactical-identity-fingerprint-2026-06-03]]
---

# RAW Perplexity capture — Comparable games: style/identity (FMX-68)

> Unprocessed transcript. Synthesised into
> [[../tactical-identity-fingerprint-2026-06-03]]. Do not implement from raw.
> Captured 2026-06-03 (Sonar). Citations are the model's own.

## Prompt

System: game-design researcher, football/sports sims; concrete about shipping games;
distinguish documented vs inferred; cite sources.

User: Designing a deterministic 5-dimension (possession, pressing, risk/directness,
in-game adaptation, set-piece reliance) tactical-identity fingerprint (raw signals +
confidence) feeding a post-MVP archetype + legacy/HoF layer. Explain prior art: (1) Football
Manager tactical styles, familiarity bars, manager playing-style attributes, surfacing of
team + opposition identity; (2) EA FC tactical visions/playstyles; (3) OOTP/EHM/basketball GM
manager tendency profiles; (4) games with manager legacy/style radar/'DNA' visualisations,
dimensions + encodings, meaningful vs gimmicky; (5) design lessons: fun/legible vs
over-engineered; pitfalls; keeping identity fair and earned.

## Response (key points)

### 1) Football Manager
Style = combined Team/Player Instructions + Roles/Duties + Opposition Instructions;
community treats this as "tactical identity". Built-in **Tactical Styles presets** (Gegenpress,
Tiki-Taka, Catenaccio, Wing Play…) are pre-packaged instruction bundles (mentality, in/out-of-
possession, transition); savable "Playing Styles". FM stores **no explicit style vector** —
style is implicit in instructions + hidden manager **tendencies** ("Plays Attacking/Possession/
Direct Football", "Uses Offside Trap"). **Mentality = risk modifier** (depth, directness, tempo,
width, defensive line) — maps to risk/directness axis. **Familiarity bars** (formation,
mentality/pressing, passing, creative freedom) = execution quality / penalty on switching —
analogous to a *confidence* score. Manager tendencies surfaced as **text** (scout/assistant
reports), not graphs. Team identity surfaced via: tactic-style label, club-culture/board
expectations ("play high-tempo pressing"), Data Hub stats vs league, media narratives.
Opposition identity: pre-match scouting **text** + Data Hub heatmaps/passing networks + likely
formation. → Mostly textual + a few simple visuals; no default 5-axis radar.

### 2) EA SPORTS FC / FIFA
Preset tactics (Ultra Defensive…Ultra Attacking) + custom-tactics sliders (defensive style:
Drop Back / Constant Pressure / Press After Loss; offensive: Possession / Fast Build Up /
Long Ball; width/depth). EA FC 24/25 **PlayStyles/PlayStyles+** are per-player (Tiki Taka,
Press Proven, Power Header, Dead Ball…) — collectively imply team identity. Surfaced as **string
labels** + experiential AI behaviour, not multi-axis stat output.

### 3) OOTP / EHM / basketball GM (closest prior art)
**OOTP**: explicit manager/GM **tendency sliders** (steal, sacrifice bunt, pinch-hit
aggressiveness, bullpen usage, veterans vs prospects) shown as 0–200 scales; league reports
give statistical identity (most steals, shifts). Feels fair because sliders tie to **observable
decisions**. **EHM**: coach tactical preferences (offensive/defensive, tempo, forecheck
aggressiveness) as sliders + text. **Basketball GM / DDS:PB / NBA 2K MyGM**: coach tendencies
(pace, 3PT vs post, crash glass, switch vs drop) shown as sliders/ratings, sometimes **radar
charts**. Mostly authored, not learned from played matches; deriving tendencies algorithmically
from matches is rare → your fact-derived approach is differentiating.

### 4) Legacy / style-DNA visualisations
FM: manager history, reputation, **favoured formations** = structural career identity; no style
radar. NBA sims: **coach identity radars** (Offense, Defense, Pace, Development, Discipline) as
filled polygons. Motorsport Manager / F1 Manager: driver/team **DNA spider charts** (Pace,
Consistency, Overtaking, Tyre Mgmt / aero, top speed, cornering). Radars feel **meaningful**
when each axis has clear mechanical consequence + matches what you see; **gimmicky** when axes
vague with no behavioural link.

### 5) Design lessons
- **Few axes, each tied to levers + visible stats.** Player must verify on the match-stats
  screen. 5 axes OK if each maps to observable behaviour.
- **Buckets/labels alongside numbers** (Possession Low/Balanced/High/Very High; Pressing
  Passive/Standard/Proactive/Relentless). Store 0–100 internally, show 3–5 tiers.
- **Confidence first-class** (rises with stable minutes; lower when radically changing style;
  show as polygon opacity/outline).
- **Pitfalls + mitigations:** arbitrary scores → direct link to public stats + "why this value?"
  drill-down (raw metric, league avg, algorithm step). Ignoring context → compute vs **league
  z-scores** ("more possession than 80% of teams"). Overfitting tiny samples → only display
  after ~10 full matches / minimum sequences; provisional treatment (dashed/low-opacity).
  Penalising experimentation → track **eras** (per-era fingerprints + career average) for HoF.
- **Fair & earned:** re-derivable entirely from stored match facts (determinism/debuggability);
  drill-down; connect fingerprint to media lines, opposition scouting, board expectations;
  derive archetype **labels** from the vector but keep the per-axis data the core; legacy =
  timeline of style + identity pivots + best-era fingerprint.

Citations (model's own): [1] strikerless "changing style during a game" · [4] FM tactic-screen
redesign case study · [7] thehighertempopress "build a tactical identity in FM26".
