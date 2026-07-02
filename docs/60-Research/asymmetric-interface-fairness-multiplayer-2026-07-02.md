---
title: Asymmetric Interface Fairness in Competitive Multiplayer
status: draft
tags: [research, dual-mode]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-212
sourceType: external
context: [match, watch-party]
related:
  - [[raw-perplexity/raw-asymmetric-interface-fairness-multiplayer-2026-07-02]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]]
  - [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[dual-mode-precedents-sports-management-2026-07-01]]
  - [[assisted-play-parity-auto-coach-2026-07-01]]
  - [[tier-parity-measurement-calibration-2026-07-01]]
  - [[tactic-preset-coverage-and-counters-2026-07-01]]
  - [[in-match-controls-tier-gating-2026-07-01]]
  - [[async-multiplayer-research]]
---

# Asymmetric Interface Fairness in Competitive Multiplayer

## Question

Post-MVP multiplayer is server-authoritative and async-first
([[async-multiplayer-research]], [[../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure|GD-0036]] deadlines,
[[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules|GD-0035]] watch parties).
[[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant|ADR-0108]]
pins **no-pay-to-win** — but not **no-depth-to-win**. Nico has decided (D3,
2026-07-02) a **bounded pro edge**: floor-normalized parity ratio ~0.85–0.95
and head-to-head 52–57% as evidence-shaped placeholders, edge confined to
adaptation decision classes, Easy never a dominated strategy. What does that
decided envelope *mean in multiplayer specifically*? How do competitive games
handle asymmetric interfaces/inputs/assists (crossplay shooters, racing sims,
async manager games); is depth/time asymmetry accepted as skill, segregated,
or normalized; does FMX MP need mode-aware matchmaking/labeling/leagues under
bounded-edge + switch-anytime (D2); what does async-first change; and what is
the risk register — including how a 52–57% pro edge is disclosed to Easy
players without reading as unfair? This note feeds the open forks
(MP treatment, competitive labeling); it decides nothing.

## Summary

Competitive games resolve interface asymmetry with three patterns —
**segregate by interface** (Halo Infinite input-based ranked, XDefiant input
priority + input locking), **normalize via tuning** (Fortnite legacy-aim
removal, Apex 0.4→0.3), or **accept as skill** (Call of Duty, iRacing/GT
assists, all async manager games) — and the evidence splits cleanly on *why*
the asymmetry exists. Device-imposed capability asymmetry (controller vs
mouse) generates perpetual controversy under tuning and eventually forces
segregation; **freely chosen decision-depth asymmetry is broadly accepted as
legitimate skill**, which is exactly FMX's situation: both worlds write the
same tactic contract, and mode is a choice, not a peripheral. Hattrick — the
genre's 20+-year async precedent — openly markets FMX's D3 promise ("log in
every day or just once a week … the same chance to be a champion if you make
the right calls") and pairs it with an ADR-0108-style no-paid-advantage
Supporter model, without any engagement-segregated leagues: performance-based
promotion/relegation does the sorting. Fairness-perception research
(attribution theory, procedural justice, disclosed-handicap practice in golf/
Go/chess) says the dangerous thing is not a bounded edge but an **invisible or
opaque** one; openly disclosed, rule-shaped, quantified asymmetry preserves
perceived fairness, while hidden tuning breeds rigging narratives (EOMM
backlash). Async-first structure further de-fangs the edge: with no twitch
execution, the pro edge is pure decision quality applied at deadlines and
bounded intervention points, and a 52–57% head-to-head materializes only as a
season-scale table drift, not as a legible per-match beating. The
evidence-based recommendation (not a decision) is mode-blind unified
competition with strong mode *transparency* (labels/audit, Hattrick+handicap
pattern) rather than segregated ladders or normalization boosts — with
group-level "Easy-only league" configuration as an opt-in social knob, and the
D3 envelope monitored as an MP telemetry invariant.

## Findings

1. **Finding:** Crossplay shooters converged on three resolution patterns for
   interface asymmetry: (a) *segregation* — Halo Infinite restricts ranked
   "based on input type, not console versus PC" because "input is the biggest
   differentiator in gameplay ability" (343, Inside Infinite April 2021);
   XDefiant prioritizes same-input matches and **locks the input device once
   ranked matchmaking starts** "to prevent players from intentionally joining
   with the wrong input device to trick the matchmaker" (Ubisoft); (b)
   *normalization via tuning* — Fortnite removed legacy aim assist and capped
   high-refresh aim-assist strength (2020); Apex reduced PC-lobby aim assist
   0.4→0.3 (−25%, Season 22, 2024); (c) *acceptance* — Call of Duty keeps
   always-on crossplay with strong aim assist despite sustained backlash.
   **Source:** halowaypoint.com "Inside Infinite – April 2021";
   esports.gg/guides/xdefiant/xdefiant-ranked-system-explained (quoting
   Ubisoft's matchmaking page); hothardware.com/news/fortnite-gamepad-change;
   dotesports.com Apex S22 patch notes; details in
   [[raw-perplexity/raw-asymmetric-interface-fairness-multiplayer-2026-07-02|raw capture]].
   **Confidence:** high (primary/major-outlet sources), except the CoD
   acceptance characterization (medium — widely reported, no single primary
   statement).

2. **Finding:** Normalization-by-tuning never settles the fairness debate when
   the asymmetry is *device-imposed*: Respawn's own dev note concedes the
   S22 nerf "doesn't solve the intricacies of all aim assist hot topics" while
   confirming encounter-win-rate data showed controller over-performance
   ("simply put, aim assist is too strong … will never be removed as it's a
   critical accessibility feature"); Fortnite's repeated silent re-tuning fed
   years of controversy. A measured, persistent cross-interface win-rate gap
   in the same queue is exactly the state D3's envelope would institutionalize
   — the shooter evidence says such a gap stays visible and contested when
   players cannot opt out of their side of the asymmetry.
   **Source:** pcgamesn.com/apex-legends/aim-assist-nerf-season-22 (full
   Respawn quote); svg.com/213476 (Fortnite tuning history).
   **Confidence:** high for the facts; the transfer to FMX is analysis.

3. **Finding:** The shooter analogy breaks in FMX's favor on two axes: the
   asymmetry is **chosen, reversible any time (D2), and available to everyone
   at no cost** — unlike a peripheral, nothing stops an Easy player opening
   the Pro surface next match — and both surfaces compile into the **same
   tactic contract** (Easy-tactic decision, 2026-07-02), so there is no
   engine-side favoritism to hide. Racing games are the closer precedent for
   chosen interface restriction: GT7 Sport Mode, F1 ranked and Forza featured
   multiplayer all allow assists in ranked and match by performance rating,
   never by assist flags; iRacing gates by license tier (Rookie/D/C allow all
   aids, B/A/Pro disallow all but clutch). Assists are designed/perceived as
   mostly self-balancing (slower), with "professional" assists (ABS, low TC)
   remaining viable at the top — i.e. a well-built restricted surface can stay
   genuinely competitive without matchmaking ever reading the assist state.
   **Source:** support.iracing.com article 31000133499 ("Driving Aids");
   r/iRacing community testing; GT/F1/Forza consensus (medium) — see raw
   capture. **Confidence:** high for iRacing policy; medium for GT/F1/Forza
   details.

4. **Finding:** Async manager games — the direct genre precedent — treat
   depth and time investment as **legitimate skill, never segregated**.
   Hattrick's official pitch is D3 almost verbatim: "Log in every day or just
   once a week – if you make the right calls you'll have the same chance to be
   a champion!" and "30 minutes a week … you will be able to compete and
   perform well in the main competitions – as long as you make smart
   decisions." Structure enforces it: weekly match/training ticks, capped
   experience and squad size — presence cannot outrun the calendar, so the
   remaining asymmetry is decision quality. No surveyed title (Hattrick,
   Trophy Manager, ManagerZone, FM network games) segregates leagues by
   engagement or interface depth; sorting happens through promotion/relegation
   performance tiers, and FM network groups handle delegation asymmetry
   socially via house rules.
   **Source:** hattrick.org/en (official copy); wiki.hattrick.org/wiki/Rules;
   en.wikipedia.org/wiki/Hattrick_(video_game); FM-community norms (medium).
   **Confidence:** high for Hattrick; medium for the genre-wide
   no-segregation claim (absence-of-evidence across surveyed titles).

5. **Finding:** Depth asymmetry partially escapes any UI-tier design: in
   Hattrick, dedicated players reverse-engineer the hidden engine with
   external tools — up to published Bayesian-network structure-learning of
   the game's mechanisms (Constantinou et al. 2025) — and communities treat
   this as the meta of skilled play. Implication for D3: the *measurable*
   envelope (floor-normalized ratio on native surfaces) will not capture
   out-of-game knowledge edges, which exist even between two Pro players;
   tier-envelope telemetry should therefore compare *interfaces*, not
   *players*, and accept a residual knowledge edge as genre-normal skill.
   **Source:** arxiv.org/pdf/2504.09499; Hattrick community guides (raw
   capture). **Confidence:** high for the datamining existence; medium for
   the acceptance claim.

6. **Finding:** Fairness-perception research locates the harm in
   **invisibility, not in the edge itself**. Attribution theory: players
   self-servingly blame losses on external causes, and opaque systems (hidden
   MMR, unknown assists, undisclosed interface differences) are the textbook
   trigger for "rigged" attributions; transparency reframes identical losses
   as controllable ("I could switch to Pro / play better"). Procedural
   justice (Tyler; Colquitt): outcomes are accepted as fair when the process
   is visibly consistent, rule-based and non-targeted — the SBMM/EOMM
   backlash after Activision's engagement-optimized-matchmaking patents was
   driven by opacity and suspected profit motive, not by skill matching as
   such. Openly disclosed structured handicaps (golf handicaps, Go stones +
   komi, chess rating classes) preserve perceived fairness because the edge is
   visible, quantified and procedurally applied; complaints target process
   manipulation (sandbagging), not the concept.
   **Source:** imotions.com attribution-theory overview; Elson/Breuer et al.,
   J. Media Psychology 2013 (doi 10.1027/1864-1105/a000168); F. Tam,
   "Understanding Motivation in Games – Attribution Theory" (LinkedIn);
   procedural-justice transfer per raw capture. **Confidence:** high for the
   theory base; medium for the games transfer (direct experimental work on
   opponents' fairness judgments of disclosed assists is sparse — flagged by
   the source itself).

7. **Finding:** Async-first structure materially shrinks what depth asymmetry
   can *feel like* compared to realtime games. (a) No execution skill: the
   pro edge cannot manifest as visible mechanical outplay, only as decision
   quality — and D3 confines it to adaptation decision classes. (b) The
   time-pressure surfaces are already bounded by ratified design: GD-0035
   caps live-coaching throughput identically for everyone (buffer caps,
   pause budgets, tactics pause per side) and
   [[in-match-controls-tier-gating-2026-07-01]] covers tier gating of the
   in-match kit; GD-0036's deadline/inactivity pressure is presence-shaped
   but tier-neutral (an Easy player who answers bids on time suffers nothing).
   (c) A 52–57% head-to-head edge is *illegible per match* — any single loss
   sits comfortably inside normal football variance — and only becomes
   visible as slow table drift across a season; contrast shooters where the
   asymmetry is re-experienced in every encounter. This makes async MP the
   most forgiving competitive format for a bounded interface edge.
   **Source:** internal synthesis over GD-0035/GD-0036 +
   [[tier-parity-measurement-calibration-2026-07-01]]; per-match illegibility
   is standard sports-variance reasoning. **Confidence:** medium (analysis,
   not external measurement).

8. **Finding:** Switch-anytime (D2) actively undermines any *mode-keyed*
   matchmaking: XDefiant had to introduce input-device locking in ranked
   precisely because free switching lets players "trick the matchmaker", and
   Halo's input-based ranked works because input is sticky for a session. A
   mode-segregated ladder in FMX would either require per-competition mode
   locks (in tension with D2's "switchable anytime, everywhere") or be
   trivially gameable (enter as Easy, play Pro). Under bounded edge + same
   contract, mode is a weak, unstable matchmaking key; performance-based
   sorting (Hattrick pyramids, TrueSkill-style rating) absorbs whatever the
   edge is worth without needing to read the mode at all.
   **Source:** esports.gg XDefiant ranked explainer (Ubisoft quote);
   halowaypoint.com April 2021; analysis. **Confidence:** high for the
   precedents; the FMX transfer is analysis.

9. **Finding:** ADR-0108's machinery generalizes cleanly from money to mode
   and is the natural home for the MP half of D3: its zero-effect property
   ("identical authoritative outputs with entitlements stripped or shuffled")
   has a mode twin — *identical engine behaviour given the same tactic
   contract, regardless of which surface authored it* — which is already
   implied by the Easy-tactic compile-to-same-contract decision and is
   testable the same way (property-based checks over authored-by-Easy vs
   authored-by-Pro contracts). Hattrick demonstrates the combined posture
   commercially: no paid advantage (Supporter = QoL only, matching ADR-0108's
   `supporter_qol`) *plus* openly-advertised low-time viability, in the same
   product, for two decades.
   **Source:** ADR-0108 (vault); hattrick.org/en Supporter copy.
   **Confidence:** high.

## Inputs For Decisions

### Open fork: MP treatment of the two worlds under bounded edge (D3) + switch-anytime (D2)

How should post-MVP MP treat Easy vs Pro participants?

- **Option A — Mode-blind unified competition + full mode transparency.**
  One competitive pool; matchmaking/leagues sort by performance
  (promotion/relegation, rating), never by mode; mode is visible (see
  labeling fork) and the D3 envelope is monitored in MP telemetry.
  *Pros:* genre-native (Finding 4 — no async manager segregates by
  engagement/depth); immune to D2 gaming (Finding 8); protects small async
  player pools from queue splitting (Halo/XDefiant accepted queue-time costs
  FMX's small friend-group MP cannot pay); consistent with the racing pattern
  where chosen assists never enter matchmaking (Finding 3); the bounded edge
  surfaces only as season-scale drift in async play (Finding 7).
  *Cons:* Easy players in mixed ladders will, over a long season, sit
  slightly lower on average — must be communicated (see risk register R1/R5);
  top-of-ladder play will skew Pro (iRacing/GT top-split pattern), which
  needs honest framing.
- **Option B — Mode-aware matchmaking / segregated Easy and Pro ladders**
  (Halo Infinite pattern).
  *Pros:* cleanest optics for ranked purists; removes cross-mode fairness
  debate inside a ladder entirely.
  *Cons:* requires mode-locking per competition, in direct tension with the
  ratified D2; trivially gameable without locks (Finding 8); splits an
  already small async population (private groups of 2–8 managers cannot split
  at all); precedent mismatch — segregation is the pattern for *device-imposed*
  asymmetry, not chosen depth (Findings 1, 3, 4); brands Easy as a protected
  lower class, undermining D1's two-worlds-equal branding.
- **Option C — Mode-normalization: give Easy sides a compensating boost (komi-style)
  or throttle Pro inputs in MP.**
  *Pros:* could push head-to-head toward 50% in official ladders; komi/golf
  handicaps show disclosed compensation can be perceived as fair (Finding 6).
  *Cons:* breaks the one-sim-core/one-contract invariant (the engine would
  read the authoring surface — exactly what Finding 9's mode-twin property
  forbids); contradicts the decided D3 shape (bounded edge, not enforced
  parity); hidden or engine-level compensation is the *most* rigging-prone
  design per procedural-justice evidence; handicap systems work in games
  where the handicap is board-visible — a simulation boost is not.

**Recommendation (recommendation, not a decision):** Option A. It is the only
option compatible with the ratified D2 and D3 as they stand, matches every
surveyed genre precedent, and shifts the fairness burden to transparency —
where the evidence says it belongs. Option B should stay explicitly reopenable
if MP ever grows an official large-population ranked ladder (see future
scope); Option C should be recorded as rejected-by-evidence unless D3 itself
is revised.

### Open fork: competitive labeling of modes in MP

Given mode-blind competition, what do opponents *see*?

- **Option A — Always-visible mode badge + per-match mode log + season mode profile.**
  Each manager's current world (and per-match world actually used, since D2
  allows switching) is shown on match cards, league tables and the
  end-of-match report, mirroring GD-0035's audit-everything pause pattern;
  a season profile ("played 28 of 34 matchdays in Easy") keeps switch-anytime
  honest post-hoc instead of locking it pre-hoc.
  *Pros:* directly implements the disclosed-handicap/procedural-justice
  pattern (Finding 6): the asymmetry becomes a visible, rule-shaped fact, so
  losses are attributable ("they play Pro and adapted at halftime") instead
  of mysterious; costs nothing mechanically; strengthens the D1 two-worlds
  branding as identity rather than tier.
  *Cons:* mild stigma/prestige dynamics ("Easy farmer", "tryhard Pro") are
  possible — watch-party social tooling should not amplify them (no
  mode-based rankings or badges of honor); adds one more surface to keep
  IP-clean and German-first.
- **Option B — No mode visibility.**
  *Pros:* zero stigma channel; simplest.
  *Cons:* recreates the invisible-advantage condition that attribution
  research identifies as the main frustration driver (Finding 6); rumors and
  third-party tooling would out modes anyway, at worse optics (EOMM-pattern
  distrust).
- **Option C — Upfront competition-level mode declaration with lock.**
  *Pros:* strongest ex-ante clarity.
  *Cons:* conflicts with ratified D2; XDefiant-style locking is the tool of
  segregated queues (Option B of the previous fork), not of unified pools.

**Recommendation (recommendation, not a decision):** Option A — transparency
without locks. Pair it with communication guardrails from risk R5.

### NEW fork: NEW-mp-group-mode-config — group-level mode composition as a social knob

Discovered fork: private async groups already get per-group pause/deadline
knobs (GD-0035 lobby settings, GD-0036 group config). Should "league mode
composition" (e.g. Easy-only league, Pro-only league, open league) be one more
group-configurable setting?

- **Option A — Yes, as opt-in group config within the mode-blind platform.**
  Friend groups can declare an Easy-only season the way they configure pause
  budgets; the platform itself never segregates. *Pros:* gives the FM-network
  "house rules" practice (Finding 4) first-class support instead of leaving
  it to social enforcement; harmless to D2 if a group's setting is a
  membership rule, not an account lock (a member switching to Pro mid-season
  is a visible rule breach handled like any group-rule breach, with the mode
  log from labeling Option A as evidence). *Cons:* needs a small rules/audit
  surface; groups can create stigma pockets.
- **Option B — No; keep mode composition purely social.**
  *Pros:* zero scope. *Cons:* wastes the existing per-group-config pattern;
  pushes enforcement onto screenshots and arguments.

**Recommendation (recommendation, not a decision):** Option A, post-MVP,
scoped as group config + mode log; it converts the genre's informal house-rule
practice into an auditable setting without touching platform matchmaking.

### Input to ratified D3 (stress evidence, not reopening)

- The 52–57% placeholder should ultimately be validated against *perception*,
  not only simulation: shooter evidence (Finding 2) shows a measured
  cross-interface encounter-win-rate gap stays permanently contested when
  players feel they cannot opt out; FMX's opt-out is free and instant (D2),
  which is the main reason the envelope is defensible. Any future design that
  weakens D2 (mode locks, paid mode features — already excluded by ADR-0108)
  would silently weaken D3's acceptability too.
- The envelope needs an MP telemetry twin: a GD-0043-style calibration slot
  (e.g. `mp.tierParity`) tracking realized Easy-vs-Pro head-to-head and
  floor-normalized ratio per engine/balance version, with the D3 envelope as
  the acceptance gate — otherwise ordinary balance patches will drift the
  live edge outside the decided band unnoticed (see
  [[tier-parity-measurement-calibration-2026-07-01]] for the measurement
  machinery).
- ADR-0108 extension input: add the mode-twin zero-effect property (Finding
  9) — authoritative outputs must be identical for identical tactic contracts
  regardless of authoring surface — to the future `no-p2w-architecture-contract`
  gate family, so "no-depth-to-win beyond D3's envelope" gets the same CI
  standing as no-pay-to-win.

### Risk register — bounded pro edge (D3) in multiplayer

| # | Risk | Evidence anchor | Mitigation direction (input, not decision) |
|---|---|---|---|
| R1 | **Invisible-edge attribution spiral:** Easy players who lose to undisclosed Pro depth read it as rigging; trust damage generalizes to the engine ("the sim favors Pros"). | Attribution/procedural-justice findings; EOMM backlash (Finding 6) | Labeling Option A (visible mode, per-match log); publish the fairness *rules*, not just outcomes. |
| R2 | **Envelope drift under live balancing:** patches quietly push the real MP edge outside 0.85–0.95 / 52–57%, falsifying published fairness claims. | Fortnite silent re-tuning controversy (Finding 2); GD-0043 gate philosophy | `mp.tierParity` telemetry slot + acceptance gate per parameter-pack version; treat breach as release blocker like other calibration gates. |
| R3 | **Mode-switch meta-gaming:** managers register as Easy for optics, switch to Pro for decisive fixtures — labels become misleading while D2 makes switching legitimate. | XDefiant input-lock rationale (Finding 8) | Do not lock (D2); make the per-match mode log and season mode profile the truth surface; group-level rules (NEW fork) for communities that care. |
| R4 | **Out-of-game depth escapes the envelope:** spreadsheet/datamined knowledge creates edges the interface envelope neither causes nor can bound; players blame the tier system. | Hattrick datamining, arXiv 2504.09499 (Finding 5) | Scope all parity claims explicitly to *interfaces*, not players; genre precedent says knowledge edge is accepted as skill — say so in copy. |
| R5 | **Communication backfire of "52–57%":** publishing a raw pro-favored number as marketing reads as "Easy = second class", contradicting D1's two-equal-worlds branding. | Disclosed-handicap framing evidence (Finding 6); Hattrick copy (Finding 4) | Communicate the *invariants*, Hattrick-style ("smart calls in Easy can win the league; Pro adds adaptation tools, roughly a one-extra-win-in-twenty edge at equal skill — never an auto-win"), keep exact envelope numbers in docs/patch notes for those who look, never as a storefront claim; ADR-0108's copy-gate rule (no fairness claims without a backing test) applies verbatim. |
| R6 | **Pool-splitting pressure:** if segregated ladders are ever adopted, small async groups and MVP-scale populations cannot sustain split queues. | Halo/XDefiant queue-time trade-offs (Findings 1, 8) | Keep platform mode-blind (MP-treatment Option A); satisfy segregation demand via group config (NEW fork). |
| R7 | **Top-ladder optics:** any future official ranked apex will skew Pro (racing top-split pattern), inviting "Easy is a lie" takes even inside the envelope. | iRacing/GT/F1 top-level assist convergence (Finding 3) | Frame Easy as viable-not-ceiling from day one; if an official ranked apex ships, revisit MP-treatment fork with population data (future scope). |
| R8 | **Stigma channel via labels:** visible mode badges create social pressure ("switch to Pro or you're deadweight") in watch parties. | Assist-stigma pattern in accessibility discourse (Finding 6, flagged medium) | No mode-based rewards/rankings; badges informational only; watch-party social features stay mode-neutral. |

## Future-scope notes

- **Official large-population ranked ladder:** if FMX ever ships a global
  ranked ladder (beyond private async groups), re-run the MP-treatment fork
  with real queue-population data; segregated or mode-filtered ladders only
  become affordable — and possibly desirable — at scale. Until then the
  question is academic.
- **Realtime/synchronous MP modes:** all conclusions about per-match
  illegibility of the edge (Finding 7) assume async cadence + GD-0035
  bounding; a future realtime mode re-imports the shooter dynamics and would
  need its own fairness pass.
- **Accessibility overlap:** Respawn's "aim assist is a critical accessibility
  feature" framing suggests a future question — whether Easy mode is also
  FMX's accessibility surface in MP contexts, which would strengthen the case
  against ever segregating it (segregating an accessibility surface has its
  own fairness/optics problems). Not analyzed here.
- **Unverified items to close later:** Destiny 2's exact competitive input
  policy (no primary source captured); any formal retention study on casual
  churn in async managers under hardcore dominance (none found — worth
  first-party telemetry once MP exists); experimental work on opponents'
  fairness perception of disclosed assists (sparse; the transparency
  recommendation rests on adjacent theory plus practice, not direct
  experiments).
