---
title: Raw - Management Delegation and Easy-Mode Surfaces
status: raw
tags: [research, raw, dual-mode]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
sourceType: external
---

# Raw capture - Management Delegation and Easy-Mode Surfaces (FMX-212)

Raw web-research capture for
[[../management-delegation-and-easy-mode-surfaces-2026-07-02]]. Tools:
Perplexity (sonar) + Exa web search, 2026-07-02. Answers condensed to the
substantive claims; every kept claim carries its source URL. Perplexity
prose is a secondary source — the synthesis note downgrades confidence
wherever a primary URL could not be confirmed.

## Q1 (Perplexity) — Football Manager Staff Responsibilities matrix + delegated-AI quality complaints

Prompt: full FM24-FM26 delegation matrix (what is delegable, to which staff
roles), documented community complaints about delegated decision QUALITY per
area, and whether staff attribute quality changes delegated-decision quality.

Substantive answer:

- Delegation matrix (consistent pattern across FM24-FM26): **training,
  media/press, friendlies → assistant manager**; **transfers + contract
  renewals → director of football**; **scouting → chief scout**; **youth
  intake/development → head of youth development**; medical → medical staff.
  Nearly the whole club-administration surface is delegable via the Staff
  Responsibilities screen.
- Official SI framing: delegation is **workload relief**, and the FM26
  official article says to "fill all the needed staff positions with the
  candidates who have the most relevant Attributes" — i.e. staff attributes
  are stated to affect delegated outcomes, but **no formula or benchmark is
  published**.
- Quality complaints concentrate by area: **transfers/contracts loudest**
  (AI blamed for poor fees, bad timing, weak squad building; creators warn
  "never delegate selling players"); **scouting** = usable but generic/
  misaligned with squad needs; **training** = "safe but unambitious";
  media/friendlies = low-risk time savers; youth = fit/identity concerns
  rather than catastrophic errors.
- Staff attributes matter per official guidance, but evidence of *how much*
  is anecdotal community testing only.

Sources:

- https://www.footballmanager.com/the-dugout/delegating-success-football-manager-26 (official SI)
- https://www.passion4fm.com/football-manager-staff-responsibilities-backroom-advices-explained/
- https://www.thehighertempopress.com/2025/08/the-responsibilities-i-delegate-in-football-manager/
- https://www.reddit.com/r/footballmanagergames/comments/16squfi/what_do_you_delegate_and_why/
- https://www.youtube.com/watch?v=xRlUXw-s3Gw (FM24 staff-responsibilities guide)

## Q2 (Perplexity) — OOTP auto-management / delegation model

Prompt: OOTP Manager-only vs GM-only vs GM+Manager split; granular per-area
auto toggles; whether staff ratings drive delegated decisions; commissioner
scoping; known criticisms.

Substantive answer:

- Three human-role modes: **Manager only** (on-field: lineups, depth charts,
  pitching, strategy; AI front office), **GM only** (roster/organisation; AI
  field manager), **GM + Manager** (both).
- **Team Control Settings** (official manual): per-area "who is responsible"
  dropdowns — Setting Lineups/Depth/Pitching Staff; Transactions (signing/
  releasing); Minor League Personnel; Minor League Signings/Releases;
  Minor League Lineups/Depth/Pitching — each delegable to *your team's
  Manager* or to *the Manager of each minor-league affiliate*. If delegated,
  "your Manager will make adjustments weekly, or any time that you or the AI
  makes a roster move".
- Staff ratings matter, unevenly: manager **development/mechanics/aging**
  ratings are the main personnel factors (development esp. for growth);
  **bench coach "far less important than the manager"**; **assistant GM
  mainly affects staff cohesion**, its trade/FA suggestions "not especially
  effective". Different managers take recommendations differently (modelled
  staff autonomy).
- Criticisms: delegation to AI staff "occasionally as janky as you'd
  expect"; an AI assistant GM given transaction powers "might trade your
  favorite players".

Sources:

- https://manuals.ootpdevelopments.com/index.php?man=ootp19&page=help_manager_home_page.options (official manual, Manager Options)
- https://www.youtube.com/watch?v=lALYy0AK2R4 (OOTP 24 personnel tutorial)
- https://forums.ootpdevelopments.com/showthread.php?t=340491 (staff autonomy)
- https://loudpoet.com/2026/01/18/my-newest-data-informed-obsession-ootp26/ (OOTP26 review, "occasionally janky")

## Q3 (Exa) — OOTP Team Control Settings primary source + delegation design discussion

Query: OOTP manual Team Control Settings; design analysis of delegation in
sports sims.

Key primary hits:

- **OOTP official manual, Team Control Settings** (verified verbatim):
  "The Team Control Settings page is used to determine what mode you play
  in, which areas of the game you control yourself or delegate to an
  assistant." Per-area table confirmed: Setting Lineups/Depth/Pitching
  Staff · Transactions · Minor League Personnel · Minor League
  Signings/Releases · Minor League Lineups/Depth/Pitching Staffs, each
  "manage yourself or delegate to your team's Manager / the Manager of each
  minor league team".
  https://manuals.ootpdevelopments.com/index.php?man=ootp18&page=team_control
  https://manuals.ootpdevelopments.com/index.php?man=ootp21&page=manager_options
  https://wiki.ootpdevelopments.com/index.php?title=OOTP_Baseball%3AScreens_and_Menus%2FManager_Menu%2FManager_Options
- **Steam community onboarding pattern** (OOTP21 forum): new player asks to
  "automate everything ... then gradually start disabling things that are
  automated as you get to grips with the game" (citing Distant Worlds:
  Universe as precedent); answer confirms Team Control Settings supports
  exactly this, with the warning that a fully-empowered AI assistant GM may
  trade favourites — "that is the price you pay to let somebody else take
  charge."
  https://steamcommunity.com/app/1087280/discussions/0/4009846212733859703/
- **Operation Sports, "Which Responsibilities You Should and Shouldn't
  Delegate in FM26"** (2026-01-14): delegation "not just possible but
  encouraged" for new players; three rules — delegate what you don't
  understand yet; "you're only as good as the staff you delegate to";
  for tactics, *don't delegate — use a pre-built tactic* as the foundation
  instead (directly matches FMX's ratified native-dials-not-delegation
  easy-tactics decision).
  https://www.operationsports.com/which-responsibilities-you-should-and-shouldnt-delegate-in-football-manager-26/

## Q4 (Perplexity) — NBA 2K MyGM/MyNBA delegation + Anstoss assistant

Substantive answer:

- **NBA 2K (2K23-2K26):** no explicit per-task delegate buttons; delegation
  is implicit in **staff roles + AI settings + sim logic**: ACE (Adaptive
  Coaching Engine) = delegated in-game tactics; auto-scouting quality driven
  by scout ratings/badges; 2K26 sim modes Normal/Smarter/Faster trade sim
  speed against AI decision thoroughness; facilities/finance run on
  system rules once high-level choices are made; governor **Directives** +
  approval sit above the automated layer. Staff badges/ratings are the
  parameters of automated decision quality.
- **Anstoss 2/3/2022:** the Co-Trainer/assistant can **propose the lineup
  ("Aufstellung übernehmen") and training plans**, optionally handle
  in-match decisions; delegation is **explicit accept-a-proposal**, not a
  standing autopilot. Stadium/finance surfaces are deliberately **coarse**:
  discrete build projects (lump-sum, auto-progress) and low/medium/high
  sliders for marketing/youth/scouting budgets. Caveat: exact menu labels
  are community-retrospective level (Kultboy/fan sites named but no
  specific verifiable URL returned) — treated as low-confidence detail.

Sources:

- https://nba.2k.com/2k26/courtside-report/mynba/ (official 2K26 courtside report)
- https://www.espn.com/gaming/story/_/id/46087339/nba-2k26-wnba-mynba-mywnba-mygm
- https://nba2k.fandom.com/wiki/MyGM
- https://www.gamingnexus.com/News/70855/NBA-2K26-details-improvements-to-MyNBA-and-MyGM-modes
- Anstoss specifics: Perplexity synthesis over Kultboy/fan retrospectives — no single stable URL captured; see also vault note [[../anstoss-series-deep-dive]].

## Q5 (Perplexity) — deterministic vs persona-driven delegated AI; staff-skill coupling precedents

Prompt: published designer commentary on deterministic vs stochastic
delegated decisions; automation default-on for casual vs off for hardcore;
documented staff-skill → automation-quality couplings.

Substantive answer:

- **No published sports-sim doctrine found** on deterministic-vs-stochastic
  delegated decisions or on automation defaults per difficulty. Industry
  practice inferred: simulations are **seeded-stochastic** (fixed RNG stream
  per save → replay-safe within a run); local delegated decisions may sample
  from distributions under that stream.
- General decision-automation UX writing supports: automate low-judgment
  chores for casual users, keep judgment-heavy decisions manual where the
  decision *is* the fun.
  https://www.uxtools.co/blog/stochastic-vs-deterministic-design
- **Staff-skill → automation-quality coupling is a documented cross-genre
  pattern** (descriptive, never formulaic): FM staff attribute descriptions
  (Tactical Knowledge, Motivating, Working With Youngsters); OOTP manager
  development ratings → player growth; Paradox leader skill levels scaling
  automated-system output; Two Point Hospital staff skills → treatment/
  diagnosis quality; Motorsport Manager engineer stats → setup/pit quality.
  Exact weights are community reverse-engineering everywhere.
- Explicitly flagged as NOT found: any developer statement "delegated AI
  must be deterministic/replay-safe" or "automation defaults on in easy
  mode" — these remain design inferences, not sourced doctrine.

## Coverage note

All external claims above feed the synthesis note with per-finding
confidence; claims resting only on Perplexity prose without a confirmed
primary URL (Anstoss menu details, per-franchise automation folklore) are
marked medium/low there.
