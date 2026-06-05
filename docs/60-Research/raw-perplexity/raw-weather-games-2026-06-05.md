---
title: "RAW Perplexity — Weather/pitch modelling in prior-art games (FMX-66)"
status: raw
tags: [research, raw, perplexity, weather, pitch, games, fmx-66]
created: 2026-06-05
updated: 2026-06-05
type: research-raw
binding: false
related:
  - [[../weather-and-pitch-conditions-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
---

# RAW — How prior-art games model weather & pitch conditions

Verbatim Perplexity (Sonar) capture. Prompt: how FM, FIFA/EA FC, eFootball/PES,
OOTP, Championship Manager and Anstoss model weather + pitch (per-fixture vs
seasonal/regional climate; in-match effects + magnitude; forecast vs actual;
pitch condition vs weather + stadium investment; criticisms / best practice).
Captured 2026-06-05 for FMX-66. **Status: raw** — synthesis is
[[../weather-and-pitch-conditions-2026-06-05]].

---

Summary: most football/sports sims model **weather as a per-match draw biased by location/season**, with **subtle** modifiers (pace, error rates, injuries, fatigue), and **pitch condition as a related but separate variable** tied to stadium infrastructure. FM and OOTP are systemic; FIFA/EA FC and eFootball mostly cosmetic + a few physics tweaks; classic management games are simple tables with big narrative impact.

## 1. Generation: per-fixture vs seasonal/regional
- **Football Manager (SI):** location + month + competition + time-of-day pick a weather profile from a DB, then randomize within ranges (temp, wind, precip, cloud) → effectively a **seasonal/regional climate model with per-fixture randomness**, not a fully independent roll. Editor holds per-nation/region weather data; matches independent draws conditioned on the climate profile; no exposed persistent "cold spell" global affecting multiple fixtures.
- **FIFA / EA FC:** weather mostly presentation + ball-physics chosen per match; Career/Tournament auto-assign by stadium location + date → per-fixture random draw with region weighting; reloading gives different weather (simple per-fixture seed); no dynamic climate model.
- **eFootball / PES:** simple clear/cloudy/rainy/snowy, mostly cosmetic + footing/ball changes; Master League auto-selects by stadium + season (region+month table + draw); winter more likely snow/rain; no persistent climate.
- **OOTP Baseball:** explicit **ballpark/city climate data** — historical climate norms per city (avg temps + precip by month) → game conditions; a proper **seasonal/regional climate model** (city+date → seasonal ranges → per-game draw); long homestands "feel" consistently colder/windier by month.
- **Championship Manager (to 01/02):** very simple per-nation monthly weather profile (chance of dry/wet/snow/frozen); each match an independent roll.
- **Anstoss / On The Ball:** fixed probability tables per region+month (dry/rainy/snowy/hot); each match an independent draw.

## 2. In-match effects + magnitude
- **FM:** affects pitch condition/friction (heavy rain worsens pitch, more bobbles, slower/holds-up ball; hard/frozen = faster/less predictable bounce), physical load (heat → more fatigue; cold → slightly lower stamina drain but higher injury risk), error rates (rain/snow → more first-touch errors, slips, mis-hit passes/shots; wind small long-pass effect), GK handling (wet ball → more spills/rebounds). **Subtle realism:** auto-sim analyses show rainy-vs-clear changes shot conversion / pass completion by a few percentage points; the bigger swing is **pitch condition**, not weather alone. Weather = small direct modifiers + bigger indirect effect via pitch state.
- **FIFA / EA FC:** mostly visual + minor: wet pitch faster ball/longer slides/spray; snow historically more drag + low visibility (now restricted in many competitive modes); no documented stamina/injury changes; kept tiny for online fairness.
- **eFootball / PES:** rain/snow → more slip animations, ball skid/bounce changes; small long-pass effect; mostly cosmetic; Master League unchanged fatigue/injury.
- **OOTP:** temperature (ball carry/HR + fatigue), wind (direct ball-flight; out-wind big HR boost), precip (rain delay/rainout + wet-field errors), humidity/air density. **Big enough to show in stats** — weather as a real strategic factor.
- **Championship Manager:** frozen/hard pitch → more injuries + faster ball + long-ball effectiveness; waterlogged/muddy → lower pass completion, slower, more deflections; blizzard → big tempo/goal reduction, may postpone. Noticeable in long-run sims.
- **Anstoss / OTB:** narrative modifiers — hot → stamina drain/subs; rainy → GK mistakes/slips; snowy → slower/lower technical effectiveness; noticeable but stylized, comedic event text.

## 3. Forecast vs revealed
- **FM:** shows pre-match forecast; in modern FMs forecast ≈ actual (minor variance), no explicit accuracy mechanic — informational/planning flavour.
- **FIFA / EA FC:** user can select weather in Kick-Off; Career/Tournament shows planned; what you see is what you get; some scripted dynamic weather in specific offline modes; no forecast/reliability mechanic.
- **eFootball / PES:** chosen/shown pre-match then fixed; no uncertainty.
- **OOTP:** game-day forecast (temp/wind/precip) + chance of rain delays (not fully predictable); forecast ≈ rolled conditions.
- **CM / Anstoss:** no detailed forecasts; show match weather at kickoff; sometimes "bad weather expected" news, no probabilistic mechanic.

## 4. Pitch condition vs weather; stadium investment
- **FM:** explicit separate **pitch condition** (Pristine → Very poor), surface type, undersoil heating, pitch covering, irrigation, maintenance as facilities. Heavy rain + poor pitch/drainage → faster deterioration, bobbles, reduced short passing, postponements at lower levels; cold/snow + no undersoil heating → postponements + hard pitches; good facilities reduce postponement + degradation. Seasonal wear: degrades by matches played + maintenance + weather; persistent (late-winter low-investment clubs have worse pitches affecting passing/injuries).
- **FIFA / EA FC:** in-match dynamic pitch wear (visual + minor bounce); no strong persistent season-to-season pitch model; stadium upgrades mostly capacity/atmosphere; rain wetness affects skid/visuals.
- **eFootball / PES:** in-match scuffing/water; no deep long-term pitch model tied to finances.
- **OOTP:** ballpark park factors + surface/dimensions/altitude; weather interacts via park factors not persistent field condition; stadium investment = financials, not field realism.
- **Championship Manager:** tracks pitch condition (Perfect/OK/Muddy/Frozen) from stadium/pitch maintenance + games played + recent weather; affects passing/style suitability, injuries, postponement chance.
- **Anstoss / OTB:** stadium + pitch investments (undersoil heating, turf, drainage) reduce postponement + bad-weather effects; coarse but explicit **infrastructure-as-mitigation** mechanic.

## 5. Criticisms & best-practice lessons
- **FM:** sometimes too subtle (except extreme snow / awful lower-league pitches); occasionally too many postponements where undersoil heating rare. Positives: clear weather-vs-pitch separation, persistent seasonal wear tied to finances/upgrades, small-but-real effects that change tactics without RNG dominance. **Takeaway: make weather small; pitch + infrastructure the big levers.**
- **FIFA / EA FC & eFootball / PES:** weather treated as cosmetic by competitive communities; snow restricted online for clarity/fairness. Best practice: minimal impact in PvP avoids perceived unfairness (fairness > realism); telegraph weather to avoid frustration.
- **OOTP:** some find wind variance too strong/streaky, but seen as baseball-true. Best practice: ground distributions in real climate data; quantifiable stat effects learnable over time.
- **CM / Anstoss:** weather can feel too binary (frozen → injury spike; waterlogged → scoring collapse); opaque models. Best practice: use weather/pitch to drive **narrative** (postponements, mudbath cup upsets) + clear infrastructure payoffs.

## Design implications for a new manager game
1. Generation: city/region + month climate table (FM/OOTP) with per-fixture draw; optional yearly variation (mild vs severe winter) for narrative arcs.
2. In-match: keep direct weather modifiers modest (rain/snow → +first-touch errors/slips, −short passing, +GK fumbles; heat → +fatigue; wind → small long-pass penalty + dispersion); pitch condition is the main amplifier.
3. Forecast as a real mechanic (unlike FM/FIFA): pre-match range, actual can deviate within probabilities; managers plan kit/tactics/squad with risk.
4. Pitch condition + investment: track condition/hardness/drainage/grass/maintenance, update after each match by weather + load + groundskeeping; facilities (undersoil heating, drainage, turf) reduce weather impact + postponement; technical sides benefit from top surfaces.
5. Balance: weather rarely decides a match alone but shapes style + leaves statistical fingerprints; post-match analysis references weather + pitch.

Citations:
[1] https://datascience.virginia.edu/news/analyzing-nfl-game-day-weather-data-science
[2] https://www.earthnetworks.com/blog/weather-and-sports-5-ways-changes-the-game/
[3] https://pmc.ncbi.nlm.nih.gov/articles/PMC11474995/
[4] https://climavision.com/blog/how-weather-and-technology-impact-the-american-football-industry/
[5] https://www.africapicks.com/the-playbook/football-betting/football-betting-how-weather-and-pitch-conditions-affect-bets/
[6] https://www.weather.gov/lmk/football_weather
