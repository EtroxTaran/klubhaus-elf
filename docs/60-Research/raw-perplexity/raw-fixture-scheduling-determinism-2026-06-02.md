---
title: "Raw Perplexity — deterministic fixture scheduling (FMX-72)"
status: current
tags: [research, raw, perplexity, league, fixtures, scheduling, determinism, fmx-72]
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-72
sourceType: external
related:
  - [[../fixture-scheduling-determinism-2026-06-02]]
  - [[../../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
---

# Raw Perplexity capture — FMX-72

> Unedited capture of the Perplexity (Sonar) query grounding the FMX-72 dossier
> and ADR-0068. Synthesis at [[../fixture-scheduling-determinism-2026-06-02]].

## Query — deterministic round-robin fixture scheduling

**Prompt (verbatim):** Deterministic sports fixture scheduling for a football
management sim with replay-from-seed. (1) Circle/polygon method vs Berger tables
— equivalent pairings? home/away balance? de-facto standard? which is easier to
implement deterministically. (2) Double round-robin home+away: ensure each pair
plays once home + once away; mirror vs reverse second half. (3) Where randomness
enters — algorithm pure given fixed order, a single seeded shuffle (draw) is the
only RNG; replay-safe seeded Fisher-Yates with a labelled PRNG sub-stream.
(4) Home/away alternation / no-long-streaks — does it need a post-pass.
(5) Idempotency — generate once immutable vs mid-season regeneration.

**Answer (verbatim, condensed to substance):**

Deterministic, replayable fixture generation is essentially a **pure function**
`(teams, seed, constraints) → fixtures`. Common practice (sports + chess): a
deterministic round-robin algorithm (circle/Berger) given an ordered team list +
**one seeded shuffle (“draw”)** to randomize that order; fixtures are
**immutable** — to replay, rerun with the same seed and inputs.

**1. Circle/polygon vs Berger.** Both construct a single round-robin (each pair
meets once, one slot per team per round). The circle method fixes one team,
arranges the rest in a circle, pairs symmetric positions, then rotates all but
the fixed position by one each round; after n−1 rounds the round-robin is
complete (add a dummy “bye” for odd n). **Berger tables are precomputed/tabulated
versions of the same construction** (used in chess + many sports). The set of
pairings per round is **the same** up to renumbering / round permutation /
home-away reversal — Berger is a specific one-factorization with a fixed labeling
+ a symmetric home/away prescription. De-facto standard: chess uses Berger
explicitly; sports leagues use the circle-method one-factorization then modify
for constraints. **Implementation: code the circle method** (trivial for any even
n, dummy for odd); Berger = hard-code tables (not scalable) or generate via the
same circle algorithm + Berger colour rules. For a game, the polygon/circle
algorithm with deterministic indexing is the clean choice.

**2. Double round-robin.** First half = single round-robin (rounds 1..n−1).
Second half options: **(a) mirrored** (most common in football) — round R+r
repeats round r's fixtures with home/away swapped; **(b) reversed** — second half
runs the rounds in reverse order with venues swapped. Both deterministic and
guarantee each pair plays exactly once home + once away. Mirroring is more
common/recognizable.

**3. Randomness.** Best practice: the scheduling algorithm is **pure** (no RNG
given a team order); all randomness is confined to **one seeded shuffle** of the
team list per competition (the “draw”), plus optionally other seeded pre-season
decisions. Replay = re-seed + re-run → bit-identical. Replay-safe seeded
**Fisher-Yates** with an explicitly-seeded, fixed-algorithm PRNG (xorshift/PCG32/
LCG), no global RNG state, rejection-sampling to avoid modulo bias, iterate
i=n−1..1, j=rand[0..i], swap. **Labelled sub-streams:** derive sub-seeds from a
master seed via a fixed hash (e.g. FNV-1a / xxhash) keyed by a stable label
(“PL_2028-29_draw”); lets you add labelled random steps later without changing
existing behaviour as long as labels stay stable.

**4. Home/away streaks.** Leagues avoid long streaks (≥3 home/away), not strictly
two-in-a-row (perfect alternation often impossible). Naive “first team is home”
gives poor balance + streaks; Berger balances colours but base one-factorizations
still produce 2+ streaks. Standard practice: generate pairings via circle/Berger,
then treat home/away assignment + round reordering as a **separate (post-pass)
optimization** — greedy flipping / local search / IP-CP — to bound max
consecutive home/away and global balance. For a game a simple deterministic local
search (flip home/away on streaks > max, fixed iteration order, loop until no
improvement) is enough; just avoiding streaks ≥3 feels plausible.

**5. Idempotency.** Recommendation: idempotent + immutable. At season creation:
gather participants (stable ids), derive a competition seed (master ^ competition
id ^ season number), shuffle, run the deterministic schedule, store. Replay =
re-run with same seed/teams and verify bit-for-bit. **Mid-season regeneration is
problematic** (can rewrite played fixtures, breaks replay). If a mid-season change
is required (promotion/relegation, expansion), model it as a **new competition
instance with a new seed** or a partial extension that keeps played rounds fixed.
For a standard league sim: **season fixtures immutable once generated**; any
change = new competition/next season, not a retroactive edit.

**Concrete pipeline:** comp_seed = subseed(master, competitionId+season) → sort
teams by id → seeded Fisher-Yates shuffle → circle-method single round-robin →
mirror (or reverse) second half → deterministic initial home/away → streak
post-pass → persist; replay re-runs 2–7 and verifies identical. All steps pure +
deterministic; team set + ids stable.

**Citations (as returned):** Wikipedia "Round-robin scheduling"; Trick (CMU)
sports-scheduling survey (mat.tepper.cmu.edu/trick/survey.pdf); IEE/JDMDH/RROIJ
scheduling papers; TOP (Springer) round-robin scheduling.
