---
title: Raw Capture - Easy-World Tactic Preset Library and Aggressiveness Dial (GD-0047)
status: raw
tags: [research, raw, dual-mode, fork-resolution]
context: tactics
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-217
sourceType: external
related:
  - [[../tactic-preset-coverage-and-counters-2026-07-01]]
  - [[../../50-Game-Design/tactics-system]]
  - [[../../50-Game-Design/GD-0004-tactics]]
  - [[../../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
---

# Raw Capture - Easy-World Tactic Preset Library and Aggressiveness Dial (GD-0047)

Raw web-research capture for FMX-217 (author GD-0047: the Easy-world tactic
preset library as a soft-counter cycle + the single macro Aggressiveness dial).
Queries ran via Perplexity Sonar and Exa web search on 2026-07-02. Substantive
answers, quotes and source URLs below. Editorial judgement lives in the GD-0047
draft and the findings synthesis, not here.

---

## Query 1 (Perplexity) — Intransitive style-counter cycle in real football + formation mapping

**Prompt:** In real football, what are the widely-accepted counter relationships
between team styles forming a rock-paper-scissors / intransitive cycle
(high-press vs slow possession-build; direct/long-ball or fast counter vs
high-press; patient possession vs deep low-block)? Which formations map to each
style? Name authoritative sources.

**Substantive answer:**
- There is **no fixed universal RPS cycle**, but tactical literature describes
  strong *tendencies* that are contextual (execution, player quality, game
  state matter as much as nominal style).
- **High press / gegenpress tends to beat slow build-from-the-back possession**
  when the possession team lacks press-resistance or vertical out-balls (Klopp
  Dortmund/Liverpool, Rangnick "anti-possession" school; Spielverlagerung press
  traps designed against Guardiola short build-up). Once the first press line is
  beaten, the pressing team is exposed behind its midfield — which flips the
  advantage.
- **Direct / long-ball / fast counter-attacks tend to beat a high press**: play
  long and early to bypass pressed zones, making the press irrelevant; Simeone's
  Atlético framed explicitly as exploiting high-pressing high-line teams by
  defending compactly then attacking vertically into the vacated space. "If the
  opponent overloads the first line (press), overload the last line
  (runs/targets)."
- **Patient possession is the necessary approach vs a deep low block** but not a
  guaranteed win — Guardiola positional play (width, half-spaces, box overloads)
  breaks blocks; but low blocks (Simeone, Mourinho) frustrate sterile possession
  and punish over-commitment on the counter.
- Summary intransitive table (with caveats) provided by the model:
  | Style | Strong against | Vulnerable to |
  |---|---|---|
  | High press / gegenpress | Slow short build-up | Direct / long-ball / fast counter (space behind press) |
  | Patient short possession | Medium/high blocks (space between lines) | Aggressive high press (if low press-resistance); compact low block if no penetration |
  | Direct / long-ball / fast transition | High presses / high lines | Well-drilled deep block winning aerials + second balls; elite possession w/ strong rest-defence |
  | Deep low block + counter | Sterile / impatient possession | Elite varied possession + strong rest-defence; sustained pressure wearing down concentration |
- **Formation → style mapping** (mainstream tactical writing):
  - High press / gegenpress: **4-3-3**, **4-2-3-1**, **3-4-3 / 3-4-2-1**
  - Mid-block organisational defence: **4-4-2**, **4-1-4-1**, **4-4-1-1**
  - Wing overload / 3-at-the-back attacking: **3-5-2**, **3-4-3**
  - Possession: **4-3-3**, **4-2-3-1** (building into 3-2-5 / 2-3-5)
  - Low block: **5-3-2**, **5-4-1**, **4-5-1**, **4-4-2**
  - Direct / long-ball: **4-4-2**, **4-4-1-1**, **3-5-2** (target man + second-ball)
- Jonathan Wilson (*Inverting the Pyramid*) frames this as a historical cycle:
  pass-and-move → catenaccio → total football → pressing → positional play, each
  phase exploiting the previous.

**Sources named:** Jonathan Wilson (*Inverting the Pyramid* + columns);
Spielverlagerung (Klopp/Guardiola press-trap analyses); Coaches' Voice (manager
first-person style-vs-style pieces); tactical writing on Klopp, Rangnick,
Simeone, Guardiola. (Perplexity's own numbered citation list returned generic
RPS/PE-lesson URLs, NOT the tactical sources it named in prose — treat the named
analysts as the real authorities, the returned citation list as low-confidence
/ mismatched.)

**Confidence:** high for the qualitative counter-tendencies and formation
mapping (convergent, mainstream); low for any specific magnitude — these are
tendencies, not measured percentages.

---

## Query 2 (Perplexity) — EA FC Game Plans + FM Mentality bands: single slider → underlying params

**Prompt:** How do EA FC D-pad Game Plans / mentality bands work (Ultra
Defensive → Ultra Attacking) and what does each change? How does FM expose
Mentality as bands and what defaults does each set? Want authoritative/community
mappings of a single mentality slider to underlying tactical parameters.

**Substantive answer:**
- **Legacy FIFA** had a clean 5-band D-pad ladder: **Ultra Defensive /
  Defensive / Balanced / Attacking / Ultra Attacking**, cycled mid-match.
  Changing band shifts player positions along their positioning arrows, changes
  how many players commit forward (incl. set pieces), and scales run-frequency /
  risk-taking. **EA never published numeric mappings** — community docs are
  qualitative (relative "more depth / more pressure / more players in box").
- **EA FC 24/25 (FC IQ)** overhauled this: up to **5 Game Plans** are now
  independent user-defined custom-tactic slots (each its own formation, defensive
  style, width, depth, build-up, players-in-box, roles); only the XI is shared.
  The single hidden mentality slider is effectively gone — parameters are
  directly exposed. Guides still use the 5 named plans functionally: one default
  (Balanced), 1-2 main tactics, one "close out game" (Ultra Defensive: lower
  depth, fewer players in box, slow/long build-up, drop-back), one "comeback"
  (Ultra Attacking: high depth up to 95, constant pressure / press-after-loss,
  fast build-up, direct passing, more players in box).
- **Football Manager** keeps a **single Mentality band** — Very Defensive /
  Defensive / Cautious / Balanced / Positive / Attacking / Very Attacking (names
  vary by version; "Standard"/"Control"/"Contain" in older FMs). Mentality =
  overall **risk level**; each band presets baselines across MULTIPLE team
  instructions: defensive line height, line of engagement, pressing intensity,
  passing directness, tempo, time-wasting, number of players breaking forward.
  More attacking = higher line, higher press, faster tempo, less time-wasting,
  more players committed. SI explains this qualitatively but has **never
  published an exact numeric per-band table**; the UI shows direction-of-change
  slider bars.

**Sources named:** EA FC 25 FC IQ pitch-notes
(ea.com/en/games/ea-sports-fc/fc-25/news/pitch-notes-fc-25-fc-iq-deep-dive);
theguide.gg FC 24 tactics tutorial; r/FifaCareers mentality explainer
(reddit.com/r/FifaCareers/comments/2c1dcr); FM manual + SI forum paraphrase
(community, not an official numeric table).

**Confidence:** high that a single mentality band canonically drives
line/press/tempo/directness/time-wasting/commitment together; high that FIFA
used exactly 5 visible bands; medium-low that any exact numeric mapping is
publicly documented (it is not — mappings are inferred).

**Key takeaway for GD-0047:** genre canon = a single risk band that fans out
into several team instructions is a proven, legible pattern. Supports mapping
one Aggressiveness dial → (mentality band, pressing step) pair without engine
change.

---

## Query 3 (Perplexity) — OSM / Top Eleven / Soccer Manager formation-counter tables

**Prompt:** How do community formation-counter tables in OSM / Top Eleven /
Soccer Manager work? Are they intransitive? How soft are the advantages? How do
these tiny-option-set games keep every formation viable / avoid dead options?

**Substantive answer:**
- Counter tables are **folk metagames**: start from the OPPONENT'S formation,
  then the table gives best-reply formation + slider/line instructions, usually
  **graded by relative strength** (much stronger / equal / weaker).
- **Yes, the meta is intransitive**, not a linear tier list: attacking 4-3-3
  overruns basic 4-4-2; deep 5-3-2 / 4-5-1 with "protect defense" + deep line
  can smother 4-3-3; midfield-heavy 3-5-2 out-controls rigid deep blocks. This
  naturally yields "A beats B when stronger, B beats C when equal, C beats A when
  weaker" loops.
- **Advantages are SOFT and probabilistic** — the engine also weighs squad
  strength, roles, condition, home advantage (stadium/pitch upgrades). A counter
  improves odds but does not override big quality gaps; forums report "bad beats"
  when quality/roles/coherence are wrong. A counter only works if the whole plan
  is **coherent** (don't pair an attacking style with a defensive shape).
- **Viability / no-dead-options is kept by three levers:**
  1. **Role-based strengths/weaknesses, not rigid tiers** — defensive shapes
     (5-3-2/5-4-1/4-5-1) are *for* underdogs; balanced (4-4-2/3-5-2/4-2-3-1) for
     midfield control; attacking (4-3-3) for when stronger. Strength-bucketed
     recommendations mean every category must stay viable or a dominant
     all-purpose shape would emerge (community does not report one).
  2. **Multiple tactical dimensions attached to the same shape** — each formation
     has several viable "personas" (a 5-3-2 as park-the-bus counter OR as
     proactive wing-back attack) via forward/midfield/defensive line instructions
     + pressure/tempo/tackling/marking/style. A shape weak as high-press can be
     strong as a deep block.
  3. **Context-sensitive balancing** — relative strength buckets + home advantage
     + role/stat fit; when many players flock to a meta shape, its natural
     counters become more attractive, pushing a broad RPS loop rather than one
     best option.

**Sources named:** OSM Tactical Roadmap
(forum.onlinesoccermanager.com/topic/76401); osmtacticsassistant.com/osm-counter-tactics;
osmguide.com/tactics/counter-tactics; r/onlinesoccermanager best-tactics thread.
Top Eleven / Soccer Manager described as analogous (crowd-aggregated
spreadsheets), same logic, different numbers.

**Confidence:** medium-high — convergent community documentation, no developer
primary docs; the "soft, strength-conditioned, coherence-dependent" character is
strongly and repeatedly attested.

**Key takeaway for GD-0047:** confirms (a) a small preset set stays healthy when
each preset has a functional niche + squad-fit gating, (b) counters must be soft
and coherence-gated, (c) the same shape carrying multiple personas is exactly
what the Aggressiveness dial provides on top of each preset.

---

## Query 4 (Exa) — Single "intensity/aggression" slider → multiple params + stamina tradeoff

**Prompt:** game design single aggression/intensity slider mapping to multiple
tactical parameters, pressing/stamina/fatigue tradeoff, Football Manager.

**Substantive answer (top sources):**
- **FM-Arena "Adjusting the Intensity of your tactic during matches"**
  (fm-arena.com/thread/3241): top-tested tactics run Intensity near maximum, but
  in a real save (unlike the testing league where everyone starts at 100%
  condition) Intensity must be managed. Concretely, **"Intensity" is a composite
  you raise/lower by moving several levers together**: *Mentality, Tempo,
  Pressing Intensity, Line of Engagement, Time-Wasting, and attacking-vs-support
  duties.* A high-Intensity match drops average physical condition from ~10.0k to
  ~6.8k vs ~7.2k for low-Intensity — i.e. **higher aggression carries a real,
  measured stamina cost**; the advice is to run a "light version" of the tactic
  when 2-3 goals ahead. This directly grounds the Aggressiveness dial as one
  visible control that internally moves mentality + pressing together, with a
  stamina cost that makes max-aggression non-dominant.
- **AssMan.AI "Pressing Triggers and Intensity"**
  (assman.ai/guides/pressing-triggers-intensity): pressing is TWO independent
  decisions — Counter-Press/Regroup (transition) and **Pressing Intensity (5
  levels: Much Less Urgent / Less Urgent / Standard / More Urgent / Extremely
  Urgent)**. Higher intensity = more closing down, smaller passing windows,
  **faster gas consumption**; the two extremes are situational (Much Less Urgent
  = deep block / defend a lead / thin squad; Extremely Urgent = only vs weaker
  opponents with a fresh deep squad, in stretches). Critical pairing rule:
  **pressing intensity and defensive line must move together** — the gap between
  a pressing front line and a low back line is exactly the Simeone-exploited
  vulnerability that direct counter-attacks feast on (ties Query 1's cycle to a
  concrete parameter interaction).
- **AssMan.AI Gegenpressing guide + FootballGPT / 360TFT**: gegenpress viability
  needs Stamina ≥14, Work Rate ≥14, Aggression ≥13, Anticipation ≥13; formation
  **4-3-3 or 4-2-3-1** (width + central numbers + high line); "if they play long
  balls, drop your defensive line" (again the direct-counter answer to the
  press). Pressing without stamina → intensity drops after ~60', concede late.

**Sources:** fm-arena.com/thread/3241; assman.ai/guides/pressing-triggers-intensity;
assman.ai/guides/gegenpressing; footballgpt.co/fm/fm-gegenpressing;
fm-arena.com/thread/16275 (conditions management).

**Confidence:** high that a single "intensity" concept legitimately bundles
mentality + tempo + pressing + line + time-wasting; high that higher aggression
costs stamina (measured in FM-Arena's own condition tests, ~10.0k→6.8k); high on
the press/defensive-line pairing constraint.

**Key takeaway for GD-0047:** the macro Aggressiveness dial mapping each band to
a (mentality band, pressing step) pair per preset is genre-canonical, not
invented; the stamina cost of high aggression is the built-in trade-off that
keeps the top band from being strictly dominant (the anti-dominance mechanism
the parity contract needs).

---

## Cross-query notes (for the synthesis, not decisions)

- The intransitive triangle **press > possession-build > direct > press** is
  attested in real-football tactical literature (Query 1) AND reproduced as a
  soft, strength-conditioned loop in tiny-option-set manager games (Query 3).
  It is the safe spine for the preset cycle.
- Genre canon strongly supports **5 visible bands** for the single risk/mentality
  control (Query 2, FIFA), matching the vault's drafted 5-visible / 7-internal
  mentality model — so the Aggressiveness dial needs zero engine change.
- The measured **stamina cost of aggression** (Query 4, FM-Arena) is the
  non-dominance guarantee for the dial's top band, and the **press/back-line gap**
  is the concrete mechanism by which the "direct beats press" edge is realised —
  both should be encoded as authored preset parameter differences, then
  *measured* by the ADR-0135 harness, not asserted as matchup multipliers.
- Every source stresses **squad-fit / coherence gating**: a preset only performs
  if the squad supports the shape (wingers for flank overloads, target man for
  direct, press-resistant CBs + stamina for gegenpress). This is the Anstoss /
  Hattrick "up to 20% penalty for unsupported shape" lesson restated.
</content>
</invoke>
