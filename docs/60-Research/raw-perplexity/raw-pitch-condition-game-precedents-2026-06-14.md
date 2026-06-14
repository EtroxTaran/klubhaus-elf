---
title: "Raw - Pitch-condition and weather game precedents (FMX-142)"
status: raw
tags: [research, raw, perplexity, games, football-manager, sports-management, pitch, weather, fmx-142]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-142
related:
  - [[../pitch-condition-state-ownership-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../../50-Game-Design/GD-0029-weather-and-pitch-design-model]]
  - [[../../10-Architecture/state-machines/pitch-condition]]
---

# Raw capture - Pitch-condition and weather game precedents (Perplexity/Web, 2026-06-14)

Perplexity and targeted web/source checks for **FMX-142**. Status `raw`: this is
source input only; the synthesis is [[../pitch-condition-state-ownership-2026-06-14]].

No FMX private data, secrets or user data were sent. Prompts were generic
football/sports-management product research prompts.

## Prompt

**Prompt.** How do football-manager and sports-management games treat weather
and pitch/field condition? Research how weather, field condition, stadium
parameters and tactical consequences are surfaced in comparable games. Identify
product implications for separating weather facts from pitch-condition state.
Include sources.

## Key captured findings

- Comparable sports-management games tend to model **weather as contextual
  match input** and **field/pitch condition or stadium infrastructure as a
  stronger local lever**.
- OOTP stores weather data by city/region/month and exposes ballpark-specific
  weather settings; weather affects player performance, injury/fatigue risk and
  ball flight. This supports a separate weather fact generator with per-venue
  realization.
- Football Manager/FMM guidance treats poor pitch condition as a tactical
  constraint, for example changing passing directness when the surface makes
  short passing less reliable. This supports a manager-facing pitch-condition
  snapshot rather than hidden weather-only modifiers.
- A weather provider should not become the owner of local pitch state, because
  useful gameplay levers are facility investment, maintenance, drainage/heating
  and accumulated usage.
- FMX implication: keep weather subtle and deterministic; make pitch condition
  the actionable venue/facility state consumed by Match and explained to the
  manager at lock time.

## Useful sources returned / checked

- OOTP Developments Wiki, "Ballpark Editor / Weather":
  <https://wiki.ootpdevelopments.com/index.php?title=OOTP_Baseball%3AImportant_Game_Concepts%2FTools%2C_Functions%2C_and_Editors%2FIn-Game_Editors%2FBallpark_Editor%2FWeather>
- OOTP 24 Manual, "Weather Data":
  <https://manuals.ootpdevelopments.com/index.php?man=ootp24&page=weather_data>
- Sports Interactive, Football Manager Mobile 2024 manual, "Tactics":
  <https://community.sports-interactive.com/sigames-manual/football-manager-mobile-2024/tactics-r5227/>
- Visual Crossing, "Sports Weather Forecast: optimizing game scheduling,
  player safety and field maintenance":
  <https://www.visualcrossing.com/resources/blog/sports-weather-forecast-optimizing-game-scheduling-player-safety-and-field-maintenance/>
- Football Foundation, "Football pitch weather management":
  <https://footballfoundation.org.uk/support-article/football-pitch-weather-management-protecting-your-playing-surface>

## Source quality note

Official/manual sources were weighted above community discussion. Community
forum references were used only as weak corroboration that players perceive
weather/pitch effects in football-management games.
