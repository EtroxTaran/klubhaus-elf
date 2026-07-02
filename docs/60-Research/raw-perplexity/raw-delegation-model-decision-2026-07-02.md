---
title: "Raw capture — Delegation-to-staff model decision (FMX-215 pressure-test)"
status: raw
tags: [research, raw, dual-mode, fork-resolution]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-215
sourceType: external
---

# Raw capture — Delegation-to-staff model (FMX-215)

External web/Perplexity/Exa captures gathered to pressure-test ADR-0136 (option A
OOTP-style per-area responsibility ladder; manual/propose/delegate consent; deterministic
throttled-expert execution; 8 DL invariants; deterministic-execution → free MP/competitive
labeling claim). Queries and substantive answers with source URLs are recorded verbatim-ish
below; nothing here is a decision. Confidence and verifiability marked per item.

---

## Q1 (Perplexity) — Do delegation systems protect player-pinned assets, provide act-and-report logs / undo, and are there documented AI-override cases?

**Prompt:** OOTP Team Control Settings / FM staff responsibilities — do they protect
player-"pinned"/protected assets (do-not-sell, protected players, locked lineup slots) from
delegated AI; do they provide an act-and-report feed/undo; any documented case of delegated AI
ignoring an explicit protection setting? Cite primary sources; mark unverifiable.

**Answer (substantive):**
- OOTP has an explicit **Protected Players** mechanism, but it is documented specifically for the
  **expansion-draft** process, not proven as a universal "AI can never override my protection"
  rule across every delegated/automation path. The manual also notes the game can *auto-protect*
  some players by experience (protection is partly system-driven).
  Source (primary): https://manuals.ootpdevelopments.com/index.php?man=ootp21&page=draft_page.protect
- **Football Manager:** no primary-source manual/dev post in results documented a master
  "every protected slot is immune to all delegated AI actions" rule → **unverified**.
- **Act-and-report log / undo:** not verified from primary sources for either game. Neither a
  generalized delegated-actions audit feed nor an undo for delegated AI actions is documented in
  the sourced material. → **unverified / likely absent as a first-class feature.**
- **Documented AI-override-of-protection case:** none found in primary sources. Only a community
  Reddit report of losing players in an expansion draft, attributed to *missed protection-list
  submission*, not AI overriding a submitted protection. → **not established.**
- Sources: OOTP manual (protect page, [1]); r/OOTP expansion-draft loss thread [2].

**Takeaway for ADR-0136:** DL1 (never overwrite manual pins) and DL2 (mandatory act-and-report
feed with explanation) are **stronger than the genre norm**, not merely a restatement of it. The
genre does *not* reliably give either. This strengthens FMX's differentiation but means these
invariants carry design cost FMX must actually build, and cannot lean on "OOTP already does this."
**Confidence:** high that the genre lacks a universal protection guarantee / audit-undo; the
protected-list existence is high-confidence primary-sourced.

Citations:
[1] https://manuals.ootpdevelopments.com/index.php?man=ootp21&page=draft_page.protect
[2] https://www.reddit.com/r/OOTP/comments/1m4k3sk/was_hit_by_an_expansion_draft_and_lost_all_my/

---

## Q2 (Perplexity) — Competitive fairness of asymmetric automation: disclosure vs lockout; is deterministic execution ever cited as a precondition for allowing assist?

**Prompt:** For online/MP sports-management or strategy games with AI-assist tiers, is automation
DISCLOSED to opponents or LOCKED OUT in ranked? Is deterministic/replay-reproducible AI cited
anywhere as a precondition for allowing assist in competitive modes?

**Answer (substantive):**
- Mainstream practice is **binary**: in-client, symmetric, developer-controlled automation
  (FM staff delegation, OOTP AI control, assistant recommendations) is treated as **part of skill
  expression, available to all, not individually disclosed**; external automation (scripts, bots,
  chess engines) is **locked out / cheating**. There is **no mainstream ranked ladder that
  advertises per-player assist tiers requiring disclosure to opponents** ("User A = high
  automation, User B = manual").
- Chess is the clearest regulated case: engines are banned in rated play (anti-cheat + bans);
  where engine help is allowed (analysis, centaur/freestyle variants) it is a *separately labeled
  format*, not mixed into the normal rating pool.
- **Deterministic/replay-reproducible AI as a stated precondition for competitive assist: NOT
  found.** Determinism is valued for *simulation integrity, debugging, balance, and
  officiating auditability/trust*, but no game or league rule set was found stating "we allow AI
  assist in competitive modes only if its decisions are deterministic and replay-reproducible."
  A league where players openly declare different assist levels while sharing one ranked ladder
  would be **novel by current mainstream standards** and would need custom governance / separate
  rating structures.
- Sources: general competitive-integrity/anti-cheat and AI-in-sport governance literature; FM/OOTP
  automation-as-feature framing (community + reddit gmgames survey). Many claims flagged by the
  model as **inference** rather than a single codified rule.

**Takeaway for ADR-0136:** The ADR's §7 claim that deterministic execution makes competitive
labeling "reduce to disclosure" is **directionally sound but overstated as if externally
grounded**. Determinism *enables* measurement/disclosure and removes a hidden-variance objection,
but it does **not by itself make MP/labeling "free"** — the fairness/governance question (share a
ladder? Easy-only vs Pro-only rooms? disclose assist level?) is genuinely open and is correctly
deferred to ADR-0138 fact-family D / GD-0046. The honest framing: determinism is a **necessary
enabler, not a sufficient resolver.** **Confidence:** high on the not-found; medium on the mapping
inference (the model's own caveat).

---

## Q3 (Perplexity) — UX/game-design doctrine for graduated autonomy, per-task granularity, undo, audit logs; who articulates "automate low-judgment chores, keep high-judgment manual"?

**Prompt:** Named patterns/principles for the manual / propose-then-confirm / act-and-report
ladder; graduated autonomy, per-task granularity, reversibility, audit logs; and the
"automate low-judgment chores, keep high-judgment decisions manual" principle.

**Answer (substantive):**
- The three consent levels map cleanly onto **established named patterns**:
  - manual = NN/g **user autonomy** baseline / Stage 0-1 of graduated autonomy.
  - propose-then-confirm = **human-in-the-loop (HITL)** / advisory / "suggest-then-act" / approval
    gate — the most-recommended trust-preserving level for higher-judgment actions.
  - act-and-report = **human-on-the-loop** / supervised autonomy — autonomous action + override,
    audit history, and (ideally) undo.
- **Graduated Autonomy** is an explicitly named doctrine (SmartDev): autonomy is "earned, not
  assumed," starts advisory, advances to autonomous only after proven reliability, and
  **override capability is maintained at every stage**; scope is defined **per task/workflow**.
- Agentic-AI UX (UXmatters, UXmag) and automation UX (uxdesign.cc "4 principles":
  transparency, predictability, adaptability, level-of-automation) recommend: adjustable/
  per-task autonomy, clear override & emergency stop, **view-history / audit logs for autonomous
  actions**, undo/"this seems wrong" affordances, and explanation of what was done and why.
- The "**automate routine/low-judgment, keep risky/high-judgment under human confirmation**"
  principle is directly articulated (UX-for-AI-agents: a medical AI auto-handles scheduling but
  *defers or requests confirmation on risky treatment*); SmartDev frames the same as putting human
  control "where it adds the most value." The exact FMX phrasing is a synthesis, but the
  substance is well-sourced.
- Sources: [1] uxmatters designing-for-autonomy; [2] uxmag agentic-AI; [3] uxdesign.cc automation
  4 principles; [4] nngroup user-autonomy; [5] UX-for-AI-agents (undo/escape-hatch); [7] SmartDev
  Graduated Autonomy glossary.

**Takeaway for ADR-0136:** The three-level ladder (O2=A), per-area granularity (O1=A), DL1 pins,
DL2 audit feed, and the value-sensitive-carve-out (§4, DL8 financing player-confirmed) are all
**squarely on established UX/agentic-AI doctrine** — the ADR is not inventing an unusual grammar.
The one nuance: doctrine ties the autonomy level to **task risk/judgment**, which supports FMX's
*per-decision-class* carve-outs (construction = propose, financing = always confirm) more strongly
than a flat per-area toggle would. **Confidence:** high.

Citations:
[1] https://www.uxmatters.com/mt/archives/2025/12/designing-for-autonomy-ux-principles-for-agentic-ai.php
[2] https://uxmag.com/articles/designing-for-autonomy-ux-principles-for-agentic-ai-systems
[3] https://uxdesign.cc/4-principles-for-designing-automation-with-great-user-experience-c425878c4f64
[4] https://www.nngroup.com/articles/increase-user-autonomy/
[5] https://www.linkedin.com/pulse/ux-ai-agents-designing-systems-decide-instead-suggest-aufaitux-xozec
[7] https://smartdev.com/glossary-graduated-autonomy/

---

## Q4 (Exa) — FM director-of-football / delegated-selling weakness (value-sensitive collapse) and the learning-ramp bridge

**Prompt:** FM director of football delegation, selling players badly, "never delegate selling",
community complaints; and staff-responsibilities grammar.

**Answer (substantive):**
- **FM staff-responsibilities grammar (primary-ish):** the Staff Responsibilities wiki confirms
  per-task assignment to Manager / Director of Football / Chairman / Directors, split by
  Transfer (Incoming) vs (Outgoing) and First-Team vs Youth-Team, plus a **Backroom Advice** tab
  (how often, which staff advises) and a **Personal Assistant** tab (scout/shortlist duration
  presets, offer presets). Confirms the role-first, per-area delegation matrix FMX generalizes.
  Source: https://footballmanager.fandom.com/wiki/Staff_Responsibilities
- **Value-sensitive delegated collapse (community, FM26):** DoF widely reported as "more of a
  hindrance than help" — "every bid does not match their valuation," Loans Manager "turns down
  every bid ... even from teams offering Regular starts," DoF "only appoints staff rated
  'unsuitable'." Multiple users say the DoF squad-building AI is "quite poor and glitchy if you
  wanted to let him be in charge." Player-sales-are-impossible / board-blocks-sale threads echo
  the value-sensitivity of the sell side.
  Sources: FM26 DoF discussion; FM24 "player sales almost impossible"; "board relinquish control".
- **Learning-ramp bridge (community, direct quote):** FM24 "It's too complicated" thread — a
  player articulates the OOTP ramp almost verbatim: "delegate everything except one thing that
  sounds fun ... Next season delegate the signing and selling and do the scouting ... now I can
  micromanage or delegate everything and go on holiday except for transfer windows."

**Takeaway for ADR-0136:** Strongly validates (a) DL4's floor risk being **real and
area-concentrated in transfers/value decisions** — FM's own delegated sell/loan AI is the live
cautionary tale; (b) the **per-area learning-ramp** as the two-worlds bridge (D1/D2) is not
theoretical — real FM players describe exactly this take-one-area-back loop; (c) the role-first
matrix as *flavour* (assignment names the staff role) while FMX avoids FM's *separately authored
heuristic brains* (the documented failure). **Confidence:** high for the grammar and the
complaint pattern; the magnitudes are community-reported (medium).

Citations:
- https://footballmanager.fandom.com/wiki/Staff_Responsibilities
- https://www.footballmanager.com/features/introducing-intermediaries-and-offloading-players
- https://steamcommunity.com/app/3551340/discussions/0/780947379776091367/ (FM26 DoF)
- https://steamcommunity.com/app/2252570/discussions/0/3879346999824363743/ (sales impossible)
- https://steamcommunity.com/app/2252570/discussions/0/3957035999324108595/ (too complicated / ramp)

---

## Q5a (Exa) — OOTP "automate everything, gradually take control" onboarding + the propose/on-demand middle in a shipping game

**Prompt:** OOTP automate-everything AI-GM learning ramp; gradually take control; delegation
onboarding advice.

**Answer (substantive):**
- **Learning ramp is documented editorial advice, not just forum lore:** Operation Sports'
  OOTP beginners' guide — "you can choose to delegate responsibilities and can update this as you
  play ... If there's a system you don't understand yet and you're worried it will tank your club,
  delegate it! ... then slowly add in others as you get a better understanding."
  Source: https://www.operationsports.com/a-beginners-guide-to-out-of-the-park-baseball/
- **The propose / on-demand middle exists in a shipping game (strong precedent for O2=A's
  `propose` level):** Whalehead "Commish" tips describe keeping full control but **periodically
  triggering "Ask AI"** to set lineups/rosters, with the key line: "keep control of your team and
  manually choosing this setting allows you to use the AI, **with an option to adjust them before
  the changes get used.**" i.e. propose-then-confirm is a real, used OOTP mode — and it is noted
  to **avoid a bug** that full auto-control ("Prevent AI from making roster changes") could
  trigger.
  Source: https://whaleheads.com/2019/06/26/ootp-game-playing-tips-from-the-commish/
  Corroborating forum on the roster-change toggle:
  https://forums.ootpdevelopments.com/showthread.php?t=281644
- OOTP AI Options screen confirms centrally tunable AI evaluation, "Apply Changes Now" recompute.
  Source: https://manuals.ootpdevelopments.com/index.php/?man=ootp21&page=ai_options

**Takeaway:** The three-level ladder's **middle (`propose`)** is not a FMX invention — OOTP's
"Ask AI, adjust before applying" is exactly it, and community lore even prefers the on-demand
middle over full auto for reliability. Reinforces O2=A over O2=C (binary) and over O2=B (timeout
auto-confirm). **Confidence:** high.

---

## Q5b (Perplexity) — Is neglect-and-delegate a dominant/degenerate strategy, or is delegation a trap? (DL4 no-domination stress test)

**Prompt:** When delegated quality is coupled to staff skill, is neglect-and-delegate ever
dominant/degenerate; conversely is badly-tuned delegation a trap? Concrete FM/OOTP examples,
documented vs inferred.

**Answer (substantive):**
- **Documented:** delegation is intentionally **strong but not fully dominant**. FM (SI official
  "Delegating for success in FM26") designs delegation to be viable; guides recommend delegating
  nearly everything *except matchday + signing key players* — i.e. broad delegation is
  competitive for routine subsystems, but the **high-leverage decisions are explicitly reserved**
  for manual play. OOTP players report "felt more in control as GM than in FM," implying manual
  GM decisions still carry a real edge.
- **No cited source claims full-auto equals expert manual play.** Delegation is *locally*
  dominant in low-leverage areas (training, youth/B-team, set pieces), a *relative trap* in
  high-leverage ones (tactics, senior transfers) if delegated blindly.
- **Inferred design risk (model's own inference, not sourced):** if AI quality couples to staff
  skill and **staff quality is easy to stack / scales faster than the challenge**, "hire great
  staff, press continue" could approach optimal in weak-competition single-player saves — unless
  the delegated AI is **deliberately capped below high-level human performance.** FM mitigates by
  keeping tactics/matchday deep and manual; OOTP by making roster/finance evaluation reward human
  skill.
- Sources: [8] FM26 "Delegating for success"; [2] FM24 delegation guide (retain matchday +
  signings); [7] loudpoet OOTP26 review; [3] r/OOTP FM-vs-OOTP delegation styles.

**Takeaway for ADR-0136:** This is the sharpest external validation of **DL4's two-sided
tension**. The ADR's DL4 handles the *floor* (worst staff band must not sink below the easy floor
→ delegation never a trap). But the model surfaces the **ceiling/domination risk from the other
side**: because FMX *deliberately* couples delegated quality to staff bands (GD-0021) AND wants
"Easy never dominated" AND "hire good people is the meaningful Easy lever," the D3 envelope must
**cap the best staff-band delegated strength inside the corridor** so neglect-and-delegate does
not dominate deliberate Pro play — otherwise the two-worlds parity promise inverts. ADR-0136's DL4
names the floor explicitly but the **cap side is only implicit** (it points to ADR-0135's envelope
and "low inside the corridor"). Recommend DL4 state the cap symmetrically, or add a note that the
staff-band→delegated-strength map is itself bounded by the D3 cap, not just the floor.
**Confidence:** high (documented that delegation is strong-but-not-dominant); the coupling-exploit
is a design inference (medium), but it is the exact structural risk FMX's staff-coupling creates.

Citations:
- https://www.footballmanager.com/the-dugout/delegating-success-football-manager-26
- https://www.reddit.com/r/OOTP/comments/1l91qx1/football_manager/
- https://loudpoet.com/2026/01/18/my-newest-data-informed-obsession-ootp26/
- https://www.operationsports.com/a-beginners-guide-to-out-of-the-park-baseball/

---

## Cross-cutting notes / could-not-verify

- No primary source documents a generalized delegated-actions **audit feed with undo** in FM or
  OOTP (DL2/undo is FMX going beyond genre).
- No source states deterministic AI as a **precondition** for competitive assist (ADR-0136 §7
  claim is a novel design position, honest-but-not-externally-grounded; keep it as "enabler").
- Exact staff-attribute → delegated-quality weights are unpublished in every title (banded
  coupling is genre-standard; corroborates GD-0021 banded approach and DL4/DL6).
- FM26 DoF complaints are current-version community reports (magnitudes medium-confidence) but
  consistently locate the collapse in **value-sensitive/adaptive** decisions — the D3-sensitive area.
</content>
</invoke>
