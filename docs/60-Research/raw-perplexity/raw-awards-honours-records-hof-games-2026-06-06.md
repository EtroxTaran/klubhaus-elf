---
title: "Raw — Awards/Honours/Records/HoF in comparable sports-management & franchise sims (FMX-95)"
status: raw
tags: [research, raw, perplexity, awards, honours, records, hall-of-fame, prior-art, fmx-95]
created: 2026-06-06
updated: 2026-06-06
type: research
binding: false
linear: FMX-95
related:
  - [[../awards-honours-records-hof-owner-2026-06-06]]
---

# Raw capture — Other games (Perplexity, 2026-06-06)

Verbatim capture of the Perplexity strand on how comparable long-career
sports-management / franchise sims model awards, honours, records and Hall of
Fame — especially **across multiple saves / a profile**, not just within one save.
Synthesis in [[../awards-honours-records-hof-owner-2026-06-06]].

## Prompt (summary)

How do Football Manager, OOTP, Eastside Hockey Manager, NBA 2K MyNBA/MyLeague and
Madden Franchise model: (1) record categories (club/competition/player/manager,
season vs all-time, per-save vs cross-save); (2) Hall-of-Fame induction (formula
vs voting vs hybrid; inputs); (3) per-save only vs cross-save/profile-global
"all-time" layer; (4) awards/honours (PotY, Best XI, MotY) generation and how they
feed legend/HoF; (5) pitfalls (record inflation, HoF dilution over 50–100 seasons,
runaway-dynasty era distortion). Finish with design lessons for a determinism-first
football manager.

## Response (captured)

High-level: all five model awards and records **mostly within a save**; they differ
in how much they expose a *legacy layer* vs a single-save history. **OOTP** is the
most explicit about multi-layer historical recordkeeping and the only one with a
strongly simulated Hall of Fame (career value + peak + awards + championships +
era-adjusted dominance, hybrid voting). **Football Manager** is strong on per-save
history/statistics and a dedicated *manager history/records* screen, but is **not** a
true cross-save/global legacy system; legacy is represented through records,
reputation, awards and manager history rather than a formal HoF chamber. **NBA 2K
MyNBA/MyLeague** and **Madden Franchise** are primarily save-bound with lighter
"lifetime" persistence; legend progression is milestone/legacy-driven, not a rich
voting sim. **EHM** is closer to FM's philosophy than to a global metagame.

### 1. Record categories (genre behaviour)
- All track: club/team records, competition/league records, player career records,
  manager/coach records; both single-season and all-time.
- Cross-save / profile-global layer is **uncommon**; the mainstream approach is
  **save-bound history, not account-wide history**. (Only FM's manager
  history/records point is directly evidenced; the rest is genre inference.)

### 2. Hall-of-Fame induction
- FM: no formal HoF chamber in the baseball-game sense; legacy via
  records/reputation/awards/manager-history.
- OOTP: formal HoF with voting/eligibility logic + strong statistical weighting;
  career value + peak performance + awards + championships + longevity; era-adjusted.
- NBA 2K / Madden: lightweight milestone/legacy recognition rather than deep voting.
- Real-world analogue cited (Pro Football HoF): recognises multiple **contributor
  categories**, values long-term service/contribution, not a single stat threshold.
- The three induction shapes: **hard formula/threshold**, **simulated voting**,
  **hybrid** (formula preselects candidates, voting finalises). OOTP ≈ hybrid.

### 3. Per-save vs cross-save
- FM/EHM: history is save-bound (in-save manager history + records screens). No
  evidence of a true cross-save all-time profile ledger.
- OOTP: league/save-centric persistence, even if more elaborate.
- NBA 2K / Madden: per-save franchise history.
- Takeaway for design: cross-save/profile-global legacy is **uncommon and risky**;
  if added, make it clearly distinct from save-specific history.

### 4. Awards / honours
- Awards are usually media/vote-based with performance + reputation inputs (season
  awards, team of the year, player/manager awards). They feed reputation, then
  reputation feeds long-term legacy.
- Transferable pattern: **awards are yearly signals; records are cumulative proof;
  Hall of Fame / legend status is a synthesis layer** on top.

### 5. Pitfalls
- **Record inflation** in long saves (dominant user club monopolising a league).
- **HoF dilution** after 50–100 seasons if every season inducts several.
- **Era distortion** from runaway dynasties unless normalised by league
  strength/parity/peer comparison.
- **Stat-compression**: over-reliance on raw totals lets durability beat brilliance;
  peak seasons under-valued.
- **Voting bias drift**: simulated voting over-values fame/championships/recency
  without era-adjustment.
- **Save-local historical collapse** if no stable archive is preserved.

### Design lessons for a determinism-first football manager (verbatim list)
- Separate three layers: season awards, career records, legacy induction.
- Keep legacy induction deterministic: prefer a transparent formula over opaque
  voting if predictability matters.
- Use both peak and longevity (so "durable mediocrity" doesn't outrank "short
  brilliance").
- Normalize by era (compare against league context, not raw totals).
- Cap award dilution (induction quotas / scarcity rules → HoF stays selective).
- Preserve save-local history aggressively (records survive long saves).
- Treat club and competition records separately from individual excellence.
- Make criteria inspectable (surface *why* someone was inducted/declined/shortlisted).
- Avoid cross-save ambiguity unless intentional and clearly distinct.
- Design for dynasty distortion (competition-strength adjustment).

(Citations returned were general HoF/web links; the substantive value is the genre
pattern + design-lesson list above.)
