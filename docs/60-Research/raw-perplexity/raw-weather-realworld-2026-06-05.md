---
title: "RAW Perplexity — Real-world football weather effects (FMX-66)"
status: raw
tags: [research, raw, perplexity, weather, pitch, match, fmx-66]
created: 2026-06-05
updated: 2026-06-05
type: research-raw
binding: false
related:
  - [[../weather-and-pitch-conditions-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
---

# RAW — Real-world football weather effects & pitch playability

Verbatim Perplexity (Sonar) capture. Prompt: how weather materially affects
professional football matches (parameters + thresholds), pitch playability
criteria, forecast-vs-actual practice, and regional seasonality — for realistic
modelling in a manager sim. Captured 2026-06-05 for FMX-66. **Status: raw** —
not implementation authority; the synthesis is
[[../weather-and-pitch-conditions-2026-06-05]].

---

Weather affects almost every aspect of a professional match: ball physics, player physiology, injury risk, tactics, and pitch playability.

## 1. Key parameters and how they affect matches

### 1.1 Rain / precipitation
- Wet grass reduces friction: ball skids faster/farther on first bounce, then decelerates more sharply as it digs into turf/mud; heavy rain → unpredictable bounce, ball can "plug" and stop.
- Slippery surface reduces traction → affects acceleration/deceleration/change-of-direction; increases slips and non-contact injuries. Teams switch to shorter passing on heavily wet pitches.
- Intense rain reduces visibility for long balls/crosses/keepers; slick ball/gloves → more handling errors.
- **Thresholds / practice:** Law 5 lets the referee abandon/not start if the field is unplayable due to waterlogging; IFAB/FIFA set **no universal rainfall-intensity threshold** — domestic leagues use pitch inspections. Pragmatic test: if the **ball does not bounce or roll normally** because of standing water, the pitch is unplayable. Sim breakpoints: light–moderate = wet, ball skids slightly, small traction penalty; heavy (>~5–10 mm/h for >30–60 min) = more mis-controls/sliding/local waterlogging; prolonged + poor drainage = waterlogged + postponement risk.

### 1.2 Wind
- Changes long-ball/cross/shot trajectories, especially high balls & set pieces. Headwind shortens long passes/goal kicks; tailwind lengthens but reduces control; crosswind drifts diagonals/corners.
- Teams play lower/grounded passes in strong wind; corners/free-kicks become more or less dangerous by direction; keepers misjudge high balls.
- No formal football wind thresholds; sports meteorology: ~20–30 km/h noticeable tactical impact, ~40+ km/h strong aerial impact (safety if combined with debris). Treat **gusts** as important: add flight-path error above a gust threshold.

### 1.3 Temperature / heat
- High temp + humidity → cardiovascular strain, core-temp rise, dehydration, fatigue; players cover less high-intensity distance; evidence of more fouls/aggression in hot-humid conditions.
- **FIFA cooling-break guidance uses WBGT (wet-bulb globe temperature):** 2014 FIFA CMO — "cooling breaks may be applied when the WBGT is 32 °C or above." IFAB circulars/tournament regs since: WBGT ≥ **32 °C** → cooling breaks (~30 min into each half, up to ~3 min); WBGT ~26–32 °C → drinks breaks. Sim: WBGT 32 °C = key global cooling-break trigger; heat-fatigue penalties begin once WBGT exceeds mid-20s.

### 1.4 Cold / snow
- Cold increases muscle stiffness / strain risk; longer warm-up; dehydration still possible via dry air.
- Snow/sleet reduces ball visibility (white ball), affects roll/bounce when accumulating, reduces footing/sprinting/turning.
- Practice: snowy-but-playable → high-visibility (orange/yellow) ball + cleared/re-marked lines; postpone if pitch frozen and unsafe or access dangerous (often the bigger factor in Europe). No single global temperature cutoff; **undersoil heating** lets play continue at −5 to −10 °C; without it, surfaces go rock-hard/unplayable. Sim: sub-zero + no undersoil heating → rising frozen/unplayable risk, especially after preceding wet conditions.

### 1.5 Humidity
- High relative humidity reduces sweat-cooling → more heat stress/fatigue. Combined heat+humidity (WBGT) matters more than temperature alone. Use WBGT/heat-index to scale stamina drain, decline/injury risk, and breaks.

### 1.6 Fog / visibility
- Reduces long-range visibility for players/officials/broadcast; Law 5 leaves it to the referee. Common standard: can the ref/ARs/players see each other and the ball across the field; if goalposts at the far end aren't clearly visible from halfway, suspend/abandon. ~100–200 m practical limit. Sim: mostly a referee/TV decision; below a visibility threshold, postponement/abandonment risk rises sharply.

### 1.7 Altitude / air density (secondary)
- Higher altitude = lower air density: ball travels farther/faster (long shots/passes); reduced oxygen → faster fatigue until acclimatised. Model altitude as a stadium attribute affecting climate + ball physics.

## 2. Pitch condition & playability
- Determined by **surface type × drainage × undersoil heating × usage**. Modern elite pitches: sand-based rootzones + extensive drainage cope with heavy rain unless extreme/prolonged; undersoil heating prevents freezing. Usage (matches/training, esp. when wet) → compaction, bare patches, more waterlogging and uneven bounce.
- Interaction examples: heavy rain + good drainage + low usage = soft-but-playable; heavy rain + poor drainage + high usage = standing water/divots/postponement risk; freeze after rain (no heating) = frozen/rutted/dangerous.
- **"Unplayable"** (Law 1 + Law 5: referee may not-start/suspend/abandon if unfit/dangerous). No IFAB technical standard; competitions set procedures. Tests: ball won't bounce/roll normally in standing water; uneven frozen surface/ruts/ice; lines not visible. Inspections: referee/appointed local referee inspect several hours pre-kickoff (earlier if poor forecast); clubs request early inspections to avoid wasted travel; consider current condition + forecast + remediation time. Sim: run a pre-match "inspection" from forecast + pitch state → go ahead / deteriorates / delayed kickoff / postpone.
- **State distinctions:** playable-wet (ball rolls/bounces normally but faster; more sliding); waterlogged (standing water, ball plugs/splashes, higher injury risk); frozen (rock-hard, studs can't penetrate, dangerous; top-frozen/soft-below = rutted, worst). Safety is usually decisive.

## 3. Forecast vs actual & pre-match decisions
- Clubs use high-resolution local/custom forecasts. Accuracy: 24–48 h temp/wind/general precip usually reliable; exact timing/intensity of showers/storms can be off by a couple of hours and by microclimate. Model 3–5 day forecasts as probabilistic, 24 h high-confidence but imperfect; include a forecast-error term (±2–3 °C temp, ±20–30 % precip amount/probability, ±20–30° wind direction).
- Club/grounds actions: heavy rain → no pre-match watering, covers, squeegees; freezing → undersoil heating hours/days ahead, frost sheets; heat (WBGT ≥ ~26–32 °C) → hydration stations, ice towels, shade, adjust warm-ups.
- Referees/organisers: early postponement when forecast + pitch make unplayable/unsafe near-certain (day before / morning), based on inspections; just-in-time calls within hours when borderline. Sim: pre-match phase where forecast drives prep (affecting pitch behaviour) and a referee-AI evaluates forecast + state to inspect/postpone.

## 4. Climate & seasonality by region
- **Northern / NW Europe (UK, NL, DE, Scandinavia lowlands):** winters 0–7 °C, frequent rain, occasional snow/ice, waterlogging risk where drainage poor; daytime often 0–5 °C, playable with undersoil heating; autumn/spring mild 8–15 °C, showers + wind; summers 15–25 °C w/ occasional 30+ heatwaves, WBGT rarely 32 except heatwaves. Leagues Aug–May.
- **Mediterranean (ES, IT, GR, S-France):** summers hot/dry 30–35 °C (some >40), evening kickoffs reduce heat stress but WBGT can approach/exceed 32 in heatwaves; winters mild 10–18 °C, more rain, snow rare at low altitude. Early/late-season rounds very hot.
- **Continental / Eastern Europe:** colder, prolonged sub-zero winters, frozen-pitch/snow risk → many adopt winter breaks (Dec–Feb); summers warm/hot 25–30 °C, sometimes humid.
- **Tropical / subtropical (Brazil, much of Africa, SE Asia):** small annual temperature range; main split wet vs dry season; wet = very heavy convective storms (temporary waterlogging even with good drainage) + high humidity/WBGT; dry = hot, pitches hard/dry if irrigation limited.
- **High-altitude (parts of S. America, Mexico, 2000–3500 m):** cooler than lowland tropics, strong solar radiation, big diurnal range, lower air density (longer/faster ball, more fatigue), wet/dry seasons by locale.

## 5. Turning into sim parameters
- Per match generate: temperature, humidity, wind speed/direction, precipitation rate/type, visibility, plus altitude and time of day. Derive WBGT (heat/cooling logic) and pitch moisture/temperature/wear (from weather history + drainage + undersoil heating + usage).
- Apply ball-physics modifiers (air density → flight distance; wind vector → trajectory randomness; surface moisture/hardness → roll speed, bounce height/regularity); player modifiers (stamina/recovery scaled by WBGT/humidity & cold; movement/turning by traction; injury risk by hardness/instability); referee/organiser decisions (pre-match inspection; in-match cooling breaks WBGT ≥ 32, drinks breaks mid-20s+, suspension for lightning/extreme downpour/dense fog, abandonment/postponement at unplayable thresholds).
- Hard triggers close to real practice: **WBGT ≥ 32 °C** cooling breaks; **"ball won't bounce/roll"** waterlogging.

Citations:
[1] https://climavision.com/blog/how-weather-and-technology-impact-the-american-football-industry/
[2] https://www.earthnetworks.com/blog/weather-and-sports-5-ways-changes-the-game/
[3] https://sportsedtv.com/blog/5-ways-altitude-and-climate-affect-soccer-performance
[4] https://pmc.ncbi.nlm.nih.gov/articles/PMC11474995/
[5] https://storymaps.arcgis.com/stories/422216f387e04bf3bae272be4a5b571f
