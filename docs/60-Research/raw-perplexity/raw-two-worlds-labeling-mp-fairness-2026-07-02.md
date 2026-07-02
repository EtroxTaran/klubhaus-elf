---
title: "RAW — Two-worlds competitive labeling + multiplayer fairness treatment (fork resolution)"
status: raw
tags: [research, raw, dual-mode, fork-resolution]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-214
sourceType: external
---

# RAW capture — competitive labeling + MP fairness treatment (FMX-214)

Raw external-research capture feeding the FMX-214 convergence of the two
OPEN forks carried by ADR-0138 and GD-0046: (a) **competitive labeling**
(how leaderboards/competitions show the world) and (b) **MP treatment**
(mode-blind + transparency vs segregated/mode-aware). Grounds the choice
between the labeling packet's ★ Option C (co-equal per-world chess-model
ladders) and the fairness packet's ★ Option A (mode-blind unified +
transparency), and how a bounded pro edge (D3) is disclosed to Easy players
without reading as unfair. Queries verbatim; answers are substantive
extracts with source URLs. Confidence + inference flags preserved from the
tool output. This is a raw capture — not a decision.

---

## Q1 — Assist/difficulty labeling on shared leaderboards vs separate boards (racing sims; small populations)

**Query:** In online games and sports/management sims, when two populations
play with different assist/interface depth but compete on shared
leaderboards, what is the documented best practice for LABELING entries by
the assist used vs splitting into separate boards? (1) racing sims (Forza,
GT) mixing assists on a main board plus optional pure/hardcore boards +
sentiment; (2) whether a visible assist badge / input icon reads as
prestige-neutral vs stigma; (3) evidence on unified board + transparency
badge vs fully separate boards for fairness perception and fragmentation in
SMALL populations. Cite named sources; flag inference vs sourced.

**Answer (substantive extract):**

- **Dominant design intuition (partly sourced, partly inference):** in small,
  mixed-difficulty communities, keep **one unified leaderboard with visible
  per-entry assist/input labeling**, plus **opt-in "pure"/assists-off side
  boards** for purists. This avoids fragmenting the player base while keeping
  differences transparent. Fully separate boards per assist-combo thin out
  each board, reduce learning/visibility, and make some boards feel
  "secondary" (low population, buried top times) — fragmentation is
  "structural and hard to repair" whereas badge-stigma is "social and
  manageable."
- **iRacing:** shared performance metrics (iRating/Safety Rating) are
  **unified across players**; competition purity is achieved via **series/
  class splitting and license-gated assist limits**, not by fragmenting the
  underlying rating or per-entry badges. (Source: coachdaveacademy.com
  racecraft guide — cross-sim; leaderboard-layout specifics are inference.)
- **RaceRoom:** praised for a **unified per-combo leaderboard** with
  transparency tooling (challenge any time, view ghost/racing line) rather
  than hard splits by assists. (Source:
  reddit.com/r/simracing best-time-trial thread.)
- **Forza / Gran Turismo (inference; direct docs not fetched):**
  historically **single global leaderboard per car/track**, assists allowed
  but affecting performance/payout, with **"hardcore"/no-assist recognition
  via dedicated events or filtered views** rather than a wholly separate data
  structure. Matches the "main mixed board + optional purist board/events"
  pattern, chiefly to avoid splitting the casual base and keep matchmaking
  pools healthy.
- **Badge neutrality (inference from community sentiment):** designers
  *intend* assist badges / input icons as prestige-neutral metadata, but
  **community meaning drifts**: input icons (wheel/pad) stay fairly neutral
  ("ergonomic fact"); **assist badges skew hierarchical** — "no badge" or
  "hardcore" becomes implicitly prestigious, visible aids a soft stigma in
  high-skill spaces. Mitigations: neutral iconography/wording ("Assists
  used", "Input: Pad") not "Beginner/Arcade/Real"; **do not color-code
  badges to imply better/worse**; let prestige stay community-driven, not
  UI-encoded gold-vs-grey tiers.
- **Practical pattern (inference synthesis):** one main board per combo +
  always record assists/inputs internally + compact badges + a filtered
  "pure" view promoted as a "Hardcore/Assists-Off Ranking" (really a filtered
  subset, not a separate data structure).

**Sources:** coachdaveacademy.com/tutorials/racecraft-how-to-get-better-in-sim-racing/ ;
reddit.com/r/simracing/comments/1j73lba/whats_the_best_sim_racing_title_for_time_trials/ .
**Confidence:** medium — RaceRoom/Coach-Dave sourced; Forza/GT specifics and
the small-population unified-board conclusion are explicitly inference.

---

## Q2 — Chess parallel co-equal ladders: prestige drift + small-population sustainability

**Query:** Chess platforms keep co-equal parallel rating ladders per time
control/variant. Evidence on (1) whether they stay co-equal in prestige or
drift to one format; (2) operational cost / player experience of multiple
parallel ladders (fragmentation, thin niche pools, queue depth); (3) whether
a SMALL population can sustain multiple parallel ranked ladders without
pairing problems. Cite named sources; flag inference vs sourced.

**Answer (substantive extract):**

- **Prestige is NOT co-equal (sourced framing + inference):** despite equal
  *structure* (separate ratings/leaderboards per format), prestige drifts —
  **classical OTB (FIDE/USCF)** is the canonical benchmark, **online blitz/
  rapid** secondary-but-respected, **bullet/variants** tertiary "fun"
  ladders. Evidence: ChessGoals rating-comparison warns online ratings are
  inflated vs USCF/FIDE and not directly comparable; ChessDojo's Universal
  Rating Converter exists specifically to map online → OTB "real strength"
  (the need for the tool reflects OTB as the reference point). This is a
  direct counter to assuming parallel ladders self-balance in prestige.
- **Operational cost (sourced + inference):** each ladder splits the base
  into separate rating pools needing independent calibration
  (inflation/deflation control), adds DB/compute overhead, and creates
  user-experience complexity ("why am I 1500 blitz / 1300 rapid?"). Rating
  distributions differ materially per format (e.g. Lichess rapid 1800 ≈ USCF
  1400 ≈ FIDE 1595).
- **Small populations (inference, grounded in matchmaking theory):** a small
  population **cannot** sustain many parallel co-equal rated ladders without
  queue/pairing problems — with ~100–200 active players, per-ladder
  concurrency drops to single digits off-peak, forcing either wide-rating
  pairings (weak fairness/volatile ratings) or long queues. Best practice for
  small pools: **concentrate into 1–2 primary rated ladders** or a single
  global rating; treat niche formats as casual/unrated. Large sites can
  afford many ladders precisely because they are large.

**Sources:** chessgoals.com/rating-comparison/ ;
chessdojo.club/blog/new-ratings/noseknowsall ;
reddit.com/r/chess/comments/16uhywc/ (Chess.com vs Lichess population).
**Confidence:** medium-high for prestige-drift framing (sourced); small-pop
sustainability is inference from rating/matchmaking theory (no primary
platform statement on minimum pool size).

**Direct bearing on the fork:** this is the key evidence weakening the
labeling packet's ★ Option C (co-equal per-world chess-model ladders) for
FMX: the chess precedent it rests on **does not actually deliver co-equal
prestige** and **fragments small populations** — exactly FMX's
private-group / MVP-scale async situation. The chess model's co-equality is
aspirational, not observed.

---

## Q3 — Disclosing a small deliberate edge without reading as unfair (handicaps, procedural justice, crossplay icons, invariants-vs-raw-number)

**Query:** How to DISCLOSE a small deliberate competitive edge held by one
group without it reading as unfair/effort-to-win? (1) golf handicaps, Go
handicap stones + komi, chess rating classes as disclosed structured
handicaps perceived as fair; (2) attribution + procedural-justice research on
why HIDDEN advantages breed "rigged" perceptions; (3) crossplay aim-assist:
did input-type icons (transparency without segregation) reduce complaints?
Is it better to communicate fairness INVARIANTS/RULES ("the lighter mode can
still win the league; pro adds adaptation tools worth ~one extra win in
twenty at equal skill, never an auto-win") than to publish the raw
win-probability number? Cite named sources; flag inference vs sourced.

**Answer (substantive extract):**

- **Correction to the naive framing (important):** the strongest evidence is
  **not** "transparent handicaps are always perceived as fair" — it is that
  **visible, rule-governed, procedurally-applied adjustments are the standard
  legitimacy model**, while **hidden adjustments reliably trigger unfairness
  suspicion**. Transparency **helps but does not guarantee** acceptance if
  the underlying asymmetry is still felt as large/skill-relevant.
- **Disclosed structured handicaps (sourced):** USGA World Handicap System
  lets different-ability players "compete on a fair basis" via a **formal
  disclosed rule system** (soft/hard caps, exceptional-score reduction);
  scholarship states a fair handicap targets **P(one beats the other) = 0.5**
  — fairness is procedural, not secrecy-based. Go: IGF rules make **handicap
  stones (pre-game) and komi (fixed score compensation)** openly applied and
  numerically specified. Chess: FIDE ratings are numerically calculated and
  used for transparent classification.
- **Why hidden edges breed "rigged" perceptions (sourced theory):**
  **Weiner** attribution theory — unexplained edges get attributed to "the
  system" not one's own play; **Leventhal/Karuza/Fry** procedural-justice
  criteria (consistent, unbiased, accurate, correctable, ethical); **Tom R.
  Tyler** — perceived legitimacy rises with transparent/neutral procedures
  even under unfavorable outcomes. Hidden matchmaking/undisclosed assists
  violate these criteria → "rigged" inference.
- **Crossplay input icons (NOT sourced as a fix):** no authoritative primary
  study found showing input-type icons *reliably reduced* fairness
  complaints; the safe statement is **transparency can help but does not
  guarantee acceptance** when the asymmetry is still felt as large. Do not
  claim icons "solved" the controversy.
- **Communicate invariants/rules over a raw number (inference from theory):**
  stating scope + boundary + comparative effect + process ("adds adaptation
  tools; does not change the win condition; bounded, cannot guarantee
  victory; the weaker side can still win; applied consistently, visible
  before play") is **rhetorically and procedurally stronger** than a naked
  ratio. A raw "+5% win probability" **detached from rules invites pay/
  effort-to-win reading**. Lead with the rule and the boundary, not the
  marketing ratio.

**Sources:** usga.org World Handicap System FAQ ; sfu.ca/~tswartz/papers/golf.pdf
(equitable-handicap P=0.5) ; International Go Federation rules (handicap/komi) ;
FIDE rating regulations ; Weiner (attribution theory) ; Leventhal, Karuza & Fry
(procedural justice) ; Tyler (procedural justice/legitimacy).
**Confidence:** high for handicap-system facts and the justice-theory base;
the games-transfer and the invariants-over-number communication rule are
inference from that theory (consistent with ADR-0108's copy gate and the
GD-0046 R5/R1 guardrails).

---

## Q4 — Async manager precedent (Hattrick): engagement fairness, no segregation, over-transparency caution

**Query:** Hattrick async football manager — can a casual low-time player
compete with hardcore daily players on the same league ladder without
engagement-based segregation?

**Answer (substantive extract):**

- **No engagement/depth segregation (sourced):** Hattrick's competitive
  structure is organised as **country league pyramids + national cups**, with
  promotion/relegation doing the sorting; winners feed the Hattrick Masters.
  Matches occur **once or twice a week** — the weekly tick structurally caps
  how far presence can outrun the calendar, leaving decision quality as the
  residual asymmetry. No surveyed segregation by activity level. Community
  ("Role of Luck") frames outcomes as skill applied to stochastic events, not
  as effort-gating. (arxiv 2504.09499; hattrick.org press.)
- **No-paid-advantage confirmed (sourced):** paid membership "strictly offer[s]
  no in-game advantage" — the ADR-0108 `supporter_qol` pattern, in a 200k+
  user, 25+-year live product. (arxiv 2504.09499.)
- **Retention machinery is engagement-neutral to competition (sourced):**
  Hattrick's Login Streaks A/B test lifted 30-day retention +52%, but the
  cash gift is explicitly "cash that doesn't affect the competition in the
  league" — retention hooks kept OFF the competitive-fairness surface.
  (devblog.hattrick.org 2021-01.)
- **Over-transparency caution (sourced — key nuance):** Hattrick's Q1-2021
  user survey found their multi-year move "from mystery … towards absolute
  transparency" **backfired on feel**: "the more explicitly we tell you about
  how the game works, the less in control you will feel, making the game feel
  unpredictable" and shifting perception "to something more of a number
  simulation and less of a football game." Directly supports communicating
  **invariants/rules, not raw envelope numbers**, to Easy players — publishing
  the raw 52–57% as a headline risks the same number-simulation feel and
  Easy-as-second-class reading (GD-0046 R5).

**Sources:** arxiv.org/pdf/2504.09499 (Constantinou et al. 2025) ;
devblog.hattrick.org/2021/01/in-a-few-days-but-i-want-it-now/ ;
devblog.hattrick.org/2021/07/user-survey-insights-q1-2021/ ;
hattrick.org/en/Community/Press/?ArticleID=23837 .
**Confidence:** high (primary Hattrick devblog + peer-reviewed-style arXiv
paper); genre-wide "no segregation" is medium (Hattrick strong, other titles
absence-of-evidence per the sibling fairness packet).

---

## Cross-cutting synthesis (raw notes for the ADR edit)

1. **Both open forks converge on the SAME primitive:** one shared/mode-blind
   competition + per-entry (per-run/per-match) world transparency, plus
   opt-in Pro-pure surfaces — for BOTH single-player leaderboards AND async
   MP. The chess-model co-equal-ladder alternative (labeling packet ★ C) is
   **weakened by Q2**: chess parallel ladders neither stay co-equal in
   prestige nor survive small populations — the two properties the "two
   worlds, co-equal, small async groups" design most needs.
2. **The unifying evidence chain:** racing (Q1 — unified board + badge +
   opt-in pure, small-pop fragmentation is worse) + chess (Q2 — parallel
   ladders drift + fragment) + procedural justice (Q3 — visible rule-shaped
   edge is legitimate, hidden edge is "rigged") + Hattrick (Q4 — genre
   precedent: one pyramid, no segregation, no-paid-advantage, over-
   transparency of raw numbers backfires). All four point to **mode-blind
   unified competition + transparency-without-locks**, with prestige for
   purists delivered as an **additive opt-in Pro-pure surface**, not a
   segregated ladder or a normalization boost.
3. **Disclosure of the bounded edge:** communicate **invariants** (Easy never
   dominated; Pro edge bounded, from adaptation only; weaker side can still
   win the league) and the **rules/process**, never the raw 52–57% as a
   storefront claim (Q3 + Q4). This is procedurally the most fairness-robust
   framing and matches ADR-0108's copy gate + GD-0046 §Player-promise R5/R1.
4. **Badge design constraint (Q1):** badges must be **prestige-neutral by
   construction** — informational world/mode metadata, no color-coded
   gold-vs-grey tiers, no mode-based rewards/rankings; else the badge becomes
   the stigma channel (fairness packet R8).
5. **Per-area override:** stays a stigma/mislabeling risk (a straddling
   player's single "world" badge would be untruthful) — remains explicitly
   **deferred and gated on this fork's resolution**; nothing in this capture
   argues to open it now. The family-B per-match snapshot already records the
   truthful per-surface reality regardless.
6. **Population-scale caveat:** the mode-blind recommendation is
   scale-robust; **segregation only becomes affordable/desirable at large
   ranked-ladder scale** (Q1 + Q2 fragmentation cost). Keep Option B
   (segregation) explicitly reopenable if an official large-population ranked
   ladder ever ships — do not adopt it for MVP/private-group async.
</content>
</invoke>
