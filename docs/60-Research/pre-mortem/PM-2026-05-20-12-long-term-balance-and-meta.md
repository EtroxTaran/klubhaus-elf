---
title: "Pre-Mortem 2026-05-20 · 12 · Long-Term Balance & Meta"
status: draft
tags: [research, pre-mortem, game-balance, long-term, meta-game, save-bloat, 2026-Q2]
created: 2026-05-20
updated: 2026-05-20
type: research
binding: false
report_id: PM-2026-05-20-12
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-03-gameplay]]
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[PM-2026-05-20-15-browser-device-storage-matrix]]
  - [[PM-2026-05-20-16-test-strategy-depth]]
  - [[../late-game-systems]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/mode-create-a-club-roguelite]]
---

# Pre-Mortem 2026-05-20 · 12 · Long-Term Game-Balance & Meta-Game

> **Failure-Headline-Kandidaten**
> - „Save 50 ist unspielbar — Inflation, Min-Max-Meta, leeres Endgame."
> - „Wir balancierten für Saison 1; Spieler mit 5 Jahren Erfahrung exploiten KI."
> - „Save-Bloat: nach 30 Saisons 45 s Laden auf Mobile."
> - „Hot-Fix Balance-Konstante brach Determinismus-Replay — 40h-Karrieren verloren — Trust permanent weg."

## Top Failure-Hypothesen

### PM-2026-05-20-12-F-01 — Wage- & Prize-Money-Inflation erodiert Economy-Tension

```yaml
id: PM-2026-05-20-12-F-01
priority: P1
domain: game-balance
probability: 4
impact: 5
score: 20
confidence: medium
early_warning:
  - metric: "median_club_cash_to_wage_ratio_by_season"
    threshold: "> 12× by season 10 (FM-Celtic-Benchmark: 4–6×)"
  - metric: "operating_freeze_trigger_rate_after_year_5"
    threshold: "< 5 % aller Saves (Mechanik tot)"
  - metric: "transfer_fee_top_decile_p50_ratio"
    threshold: "> 25 (Galactico runaway)"
mitigation_summary: "Federation-Levy + Wage-Cap-Macro-Anchor + Per-Season-Inflations-Deflator; CI Long-Soak Balance-Test"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../../10-Architecture/09-Decisions/ADR-0004-data-model]]]
linked_specs: [[[../../50-Game-Design/GD-0008-finance-economy]]]
linked_code: ["packages/game-data/src/economy/", "packages/match-engine/src/finance/"]
sources:
  - title: "FM-Community 37-Saison Celtic-Analyse"
    url: "https://community.sports-interactive.com/forums/topic/578360-how-are-transfer-and-wage-budgets-set-analysis-shows-they-are-too-high/"
    accessed: "2026-05-20"
    publisher: "Sports Interactive Forums"
    confidence: medium
  - title: "OOTP Inflation Feature"
    url: "http://site.ootpdevelopments.com/board/showthread.php?t=281250"
    accessed: "2026-05-20"
    publisher: "OOTP"
    confidence: medium
  - title: "OOTP Financials Manual"
    url: "https://manuals.ootpdevelopments.com/index.php?man=ootp21&page=financials"
    accessed: "2026-05-20"
    publisher: "OOTP"
    confidence: medium
verification_notes: "FM-Celtic-37-Saison-Analyse zeigt Wage-Budget-Drift; OOTP 17 hat optional Inflation-Toggle — Branchen-Erkennung."
status: open
owner_suggested: game-design+backend
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Über 30 In-Game-Jahre wachsen Sponsoring/Gates/TV-Geld kumulativ schneller als Wages/Transfers, weil D2-Generatoren Sponsor-Wachstum proportional zur Reputation skalieren, Wage-Tier-Modell aber keinen Lohn-Anker hat (R2-02 offen). Cash-Stockpiling killt GD-0008-Operating-Freeze-Spannung; Saison 8+ Insolvency-Spiral mechanisch tot.

**Mitigation.** (1) **Federation-Levy** (Anstoss-Modell): 4 %/Mo auf Operating-Revenue, skaliert mit `worldGdpIndex`. (2) **League-Wage-Cap** als prozentualer Anteil Liga-Reputation: `maxWageBudget = leagueReputation × 0.6 × decadeInflator` (deterministisch aus worldSeed + Dekade). (3) **Per-Season-Deflator**: am Saisonende Cash-Reserven > 100 % × leagueAvgRevenue mit 8 % „Verwaltungsgebühren" — Druck Geld auszugeben. (4) **CI-Soak**: 50-Saison × 5 worldSeeds; Assert `medianCashToWageRatio < 8`; Inflation-Drift ≤ 1.5×/Dekade.

**Verifikation.** `pnpm test:economy:50y` CI produziert CSV. Manuell: 10 Spielerläufe × 30 Saisons, NPS „fühlte sich Geld in Saison 20 wie Entscheidung an?" ≥ +20.

### PM-2026-05-20-12-F-02 — AI-Manager-Tactical-Convergence kills League-Variety

```yaml
id: PM-2026-05-20-12-F-02
priority: P1
domain: game-balance
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "ai_manager_tactic_family_entropy_per_decade"
    threshold: "< 1.6 bits (4 Archetypen effective)"
  - metric: "human_player_league_win_streak_after_y5"
    threshold: "> 3 consecutive titles"
  - metric: "underdog_promotion_rate_per_decade"
    threshold: "< 8 % (Real-Football-Baseline ~15 %)"
mitigation_summary: "AI-Archetype-Stubbornness + forced Rivalry-Events + Dynamic Title Race Mechanic + Regen-Distribution-Floor"
linked_adrs: []
linked_specs: [[[../ai-manager-behaviour]], [[../late-game-systems]]]
linked_code: ["packages/ai-managers/src/archetypes/"]
sources:
  - title: "FM Long-term save bugs (VideoGamer)"
    url: "https://www.videogamer.com/features/these-annoying-bugs-are-ruining-long-term-football-m/"
    accessed: "2026-05-20"
    publisher: "VideoGamer"
    confidence: high
  - title: "FM23 Regen Development Bug"
    url: "https://community.sports-interactive.com/bugtracker/previous-versions/football-manager-2023-bugs-tracker/759_all-other-issues/regen-development-on-long-term-saves-still-big-issue-r14385/"
    accessed: "2026-05-20"
    publisher: "Sports Interactive"
    confidence: high
verification_notes: "FM-Community-Signal: 'all AI tactics eventually become identical'. FM23 Bug-Tracker bestätigt Regen-Stagnation."
status: open
owner_suggested: game-design+ai
effort: L
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** 10 AI-Archetypen sind kompetitiv unter Beobachtung. Aber wenn Spieler Gegenpress exploitet, kopiert In-Game-Tactic-Learning. Über 10 Saisons kollabiert Entropie auf 2–3 dominante Formations-Familien. Real-Football-Diversität (~6 Familien) weg.

**Mitigation.** (1) `archetypeStubbornness ∈ [0.6, 0.95]` deterministisch aus Manager-Seed; Tinkerman kopiert, Pragmatist nie. (2) **Forced Rivalry-Cap**: bei `playerLeagueWinStreak ≥ 2` spawn „Rising Rival"-Event (D4 §11.2) mit Budget-Boost + Star-Coach für Bottom-Half-Club; max 1/3 Jahre für Replay-Determinismus. (3) Tactic-Diversity-Bonus: Archetyp 3 Saisons gleiche Formation → −2 % Match-Sim-Score. (4) **Regen-Distribution-Floor**: 5-Star-Potenzial verteilt ≥ 1 pro Top-12-Club/Saison.

**Verifikation.** 50-Saison-Headless-Sim: Shannon-Entropie Top-3-Formations ≥ 1.6 bit pro Liga; Title-Race-Diversität ≥ 4 unique Champions in 10 Saisons. NPS „lebendig nach 10 Jahren?" ≥ +25.

### PM-2026-05-20-12-F-03 — Save-Bloat: 30k-Event-Trail blows Mobile Cold-Start-SLO

```yaml
id: PM-2026-05-20-12-F-03
priority: P1
domain: performance
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "p95_save_load_ms_at_30_seasons_low_ram_android"
    threshold: "> 3000 ms"
  - metric: "indexeddb_event_table_brotli_compressed_mb"
    threshold: "> 5 MB at year 30"
  - metric: "snapshot_serialization_ms"
    threshold: "> 800 ms mid-range mobile"
mitigation_summary: "Event-Pruning (highlight-tier); hot/cold-tiering; Brotli + chunked IndexedDB stores; SLO 2 MB compressed at y30"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0005-save-format]], [[../../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]]
linked_specs: [[[../../50-Game-Design/GD-0014-save-career-model]], [[../performance-budgets]], [[PM-2026-05-20-15-browser-device-storage-matrix]]]
linked_code: ["packages/persistence/src/save/", "packages/persistence/src/dexie/"]
sources:
  - title: "RxDB Slow IndexedDB"
    url: "https://rxdb.info/slow-indexeddb.html"
    accessed: "2026-05-20"
    publisher: "RxDB"
    confidence: high
  - title: "Speeding up IndexedDB (Nolan Lawson)"
    url: "https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/"
    accessed: "2026-05-20"
    publisher: "Nolan Lawson"
    confidence: high
  - title: "Maximum IDB Performance with Storage Buckets"
    url: "https://developer.chrome.com/blog/maximum-idb-performance-with-storage-buckets"
    accessed: "2026-05-20"
    publisher: "Chrome for Developers"
    confidence: high
verification_notes: "30 Jahre × 50 Wochen × 20 Events = 30k Events. Roh-JSON ~200 B/Event → 6 MB; Brotli-Q5 ~6× → ~1 MB Events + 500 KB Snapshot. Mobile (Pixel 4a, 4 GB) 3 s für 800 MB DB-Load."
status: open
owner_suggested: backend+platform
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** (1) **Event-Tiering**: `cold` (>5 Saisons, nur Highlights), `warm` (1–5), `hot` (current). (2) **Pruning-Pipeline** am Saisonende; Importance-Score (Trophy=10, Goal=2, Pass=0.1). Replay-Determinismus über pruned Events NICHT garantiert → `replayable_until: seasonEnd` Marker. (3) **Chunked Storage**: ein IDB-Store pro 5-Jahres-Chunk (Storage-Buckets-API als Phase 2). (4) **Brotli-Q6** für cold, **Q3** hot; WASM-Decoder bei Browser ohne `CompressionStream(brotli)`. (5) **Save-Size-SLO** ≤ 2 MB komprimiert bei 30 Jahren.

**Verifikation.** CI simuliert 30-Jahre-Save deterministisch: Brotli ≤ 2 MB; Cold-Start auf Pixel-4a-Profil ≤ 3000 ms.

### PM-2026-05-20-12-F-04 — Roguelite Carry-Slot-Compound → God-Mode nach Run 10

```yaml
id: PM-2026-05-20-12-F-04
priority: P2
domain: game-balance
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - metric: "median_first_insolvency_season_by_run_number"
    threshold: "> 15 Saisons by run 10 (Ziel: 5–8)"
  - metric: "carry_slot_count_per_run"
    threshold: "> 8 (god-mode)"
  - metric: "run_win_rate_run_5_to_run_10"
    threshold: "> 85 %"
mitigation_summary: "Slot-Diminishing-Returns (1/sqrt(N)) + soft-cap 6 + Prestige-Reset-Option"
linked_adrs: []
linked_specs: [[[../../50-Game-Design/mode-create-a-club-roguelite]]]
linked_code: ["packages/game-data/src/roguelite/legacy/"]
sources:
  - title: "Hades meta-progression analysis"
    url: "https://merrygoroundmagazine.com/hades-proves-roguelikes-dont-have-to-be-about-getting-good/"
    accessed: "2026-05-20"
    publisher: "Merry Go Round Magazine"
    confidence: medium
  - title: "Meta-progression discussion (ResetEra)"
    url: "https://www.resetera.com/threads/do-you-like-meta-progression-in-your-roguelikes-roguelites.1341955/"
    accessed: "2026-05-20"
    publisher: "ResetEra"
    confidence: medium
verification_notes: "Carry-Slot wächst mit Run-Length; bei 10 Runs × Ø 12 Saisons → 120 Slot-Earning-Events. Selbst harte Cap 1 Slot/6 Saisons = 20 Slots. Compound trivializes Run 10."
status: open
owner_suggested: game-design
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** (1) **Diminishing Returns** Slot N: `1/sqrt(N)` (Slot 9 = 33 %); gleicher Effekt-Stack max 3×. (2) **Hard Cap 6 aktive Slots/Run**; ungenutzte als „Legacy-Tokens" (cosmetic/HoF only). (3) **Prestige-Reset** nach Run 10: Slots zurücksetzen, neue Cosmetic-Crests, schwererer Modus (−20 % Sponsor-Income). (4) Variant-Slot-Costs: starke Slots kosten 2 Plätze. (5) CI-Balance-Test: `median_run_length_run_10 ≥ run_3 × 1.2`.

**Verifikation.** Headless-Sim 20 Runs × 5 Player-Profile; Win-Rate-Curve; flag falls Run-10 > Run-3 × 1.5.

### PM-2026-05-20-12-F-05 — Narrative-Template Burn nach Save 2

```yaml
id: PM-2026-05-20-12-F-05
priority: P2
domain: content
probability: 5
impact: 3
score: 15
confidence: high
early_warning:
  - metric: "narrative_template_repeat_rate_per_season"
    threshold: "> 35 % seen-before"
  - metric: "median_unique_templates_per_decade"
    threshold: "< 60"
mitigation_summary: "Template-Cooldown + Markov-Slot-Filling (deterministisch geseedet, 5× Variant-Expansion ohne Runtime-LLM) + Adaptive Variant-Selection + Per-Decade-Themen-Pakete"
linked_adrs: []
linked_specs: [[[../narrative-content-pipeline]], [[../late-game-systems]]]
linked_code: ["packages/game-data/src/inbox/", "packages/narrative/src/"]
sources:
  - title: "Markov Chains Procedural Generation (Nick McDonald)"
    url: "https://nickmcd.me/2019/10/30/markov-chains-for-procedural-buildings/"
    accessed: "2026-05-20"
    publisher: "Nick McDonald"
    confidence: medium
  - title: "PCG Wiki Markov Chain"
    url: "http://pcg.wikidot.com/pcg-algorithm:markov-chain"
    accessed: "2026-05-20"
    publisher: "PCG Wiki"
    confidence: medium
verification_notes: "80–120 Templates ÷ ~50 Events/Saison = 2 Saisons bis statistisch jedes Template einmal gesehen. Mit Cooldown 3–4 Saisons. 50-Jahres-Saves erleben 10–15× Wiederholung."
status: open
owner_suggested: game-design+content
effort: L
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** (1) **Markov-Slot-Generator (build-time)**: pro Template Autor-Slots (`{adjective}`, `{verbPast}`, `{rivalEpithet}`) mit Wortpool 5–15 Varianten, deterministisch geseedet aus `worldSeed + eventTime`. 5–10× mehr Surface-Varianten ohne Runtime-LLM. (2) **Template-Cooldown** mit `minRecurrenceSeasons` (Default 3). (3) **Adaptive Variant-Selection** mit Boltzmann-Sampling. (4) **Per-Decade-Themen-Pakete**: alle 10 In-Game-Jahre 10–15 zeitgebundene Templates. (5) Soft-Target post-MVP: 200 → 400 Templates.

**Verifikation.** 50-Saison-Headless-Sim, `templateImpressions[id]` max-Impression-Rate < 35 %.

### PM-2026-05-20-12-F-06 — Insolvency-Spiral trivial ODER unvermeidbar across Saves

```yaml
id: PM-2026-05-20-12-F-06
priority: P3
domain: game-balance
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "p50_first_insolvency_season"
    threshold: "< 3 (zu brutal) oder > 20 (zu forgiving)"
  - metric: "insolvency_close_call_recovery_rate"
    threshold: "< 10 % oder > 80 %"
mitigation_summary: "Insolvency-Rate konstant 8–12 % p.a. für Bottom-Half; Escape-Valve 'Administration' (−9 League-Points + Lohn-Cap statt Run-Ende); Carry-Slot-Audit"
linked_adrs: []
linked_specs: [[[../../50-Game-Design/GD-0008-finance-economy]], [[../../50-Game-Design/mode-create-a-club-roguelite]]]
linked_code: ["packages/game-data/src/economy/insolvency/"]
sources:
  - title: "European Football Bankruptcy"
    url: "https://www.tandfonline.com/doi/full/10.1080/23750472.2025.2451952"
    accessed: "2026-05-20"
    publisher: "Tandfonline"
    confidence: medium
  - title: "Wage inflation (Off The Pitch)"
    url: "https://offthepitch.com/a/analysis-footballs-income-surge-offset-rapid-wage-inflation"
    accessed: "2026-05-20"
    publisher: "Off The Pitch"
    confidence: medium
verification_notes: "Real-Bankruptcy-Rate Europa: ~3–5 %/Jahr. Spiel-Ziel: 8–15 %/Jahr (Roguelite-Druck). Variance via Slot-Compound zu hoch."
status: open
owner_suggested: game-design+backend
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** (1) Konstante 8–12 %/Jahr Insolvency-Rate Bottom-Half — vom decadeInflator entkoppelt; aus 50-Saison-Soak kalibriert. (2) **Escape-Valve „Administration"**: 6-Monats-Phase mit −9 League-Points + Lohn-Cap statt Run-Ende — Soft-End. (3) Carry-Slot-Credit-Bonus max +20 % Starting-Cash, nicht durations-extending. (4) **Per-Season-Risk-Indicator UI**: „Insolvency-Risk: HIGH" 4 Wochen vor Threshold.

### PM-2026-05-20-12-F-07 — Continental-Cup Cycle Repetition without Escalation

```yaml
id: PM-2026-05-20-12-F-07
priority: P4
domain: game-balance
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "continental_cup_engagement_drop_after_season_5"
    threshold: "> 40 % skip-to-end"
mitigation_summary: "Tier-Promotion-Ceremonies + IFC Club World Masters + Dynamic Format-Reform alle 8–10 Saisons"
linked_adrs: []
linked_specs: [[[../late-game-systems]]]
linked_code: ["packages/competitions/src/continental/"]
sources:
  - title: "FM long-term routine cup wins"
    url: "https://www.videogamer.com/features/these-annoying-bugs-are-ruining-long-term-football-m/"
    accessed: "2026-05-20"
    publisher: "VideoGamer"
    confidence: low
verification_notes: "Spekulativ; basiert auf FM/EA-FC-Career-Mode-Pattern."
status: open
owner_suggested: game-design
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** Format-Reform alle 8–10 Saisons (Group/Swiss/Bracket); Tier-Promotion-Ceremony als visuelles Event; Dynamic Power-Shift-Events („European Dominance Era 2032-40"); IFC Club World Masters alle 2 Jahre.

### PM-2026-05-20-12-F-08 — Balance-Hotfix bricht Deterministic Replay

```yaml
id: PM-2026-05-20-12-F-08
priority: P1
domain: ops+trust
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "save_migration_failure_rate"
    threshold: "> 2 %"
  - metric: "replay_drift_after_balance_patch"
    threshold: "any non-zero"
  - metric: "social_media_negative_sentiment_post_patch_24h"
    threshold: "> 15 %"
mitigation_summary: "Versioned balance constants + save-tagged engine version + opt-in re-balancing; Migration-Replay-Test in CI"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]]
linked_specs: [[[../determinism-and-replay]], [[PM-2026-05-20-05-security-and-integrity]], [[PM-2026-05-20-16-test-strategy-depth]]]
linked_code: ["packages/match-engine/src/version/", "packages/persistence/src/migration/"]
sources:
  - title: "Temporal Workflow Versioning"
    url: "https://docs.temporal.io/develop/typescript/workflows/versioning"
    accessed: "2026-05-20"
    publisher: "Temporal"
    confidence: high
  - title: "Game Developer: Replay System"
    url: "https://www.gamedeveloper.com/programming/developing-your-own-replay-system"
    accessed: "2026-05-20"
    publisher: "Game Developer"
    confidence: medium
verification_notes: "Mechabellum, Factorio, Hearts of Iron — alle Patterns. Temporal-Workflow-Versioning ist direkt übertragbar."
status: open
owner_suggested: backend+game-design
effort: L
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Spieler hat 30-Jahre-Karriere mit 5-Slot-Build perfektioniert. Wir nerfen Credit-Bonus von 25 % auf 15 %. Nächste In-Game-Saison kollidiert mit neuer Konstante; Replay-Bit zerbricht; Spieler verliert 40h-Investment ODER unsere Anti-Cheat-Foundation. **Trust permanent verloren.**

**Mitigation.** (1) **Engine-Versions-getaggte Saves**: jeder Save speichert `engineVersion: "1.2.3"`, `balanceConstantsHash: "sha256:..."`. Saves laden NUR mit identischem Hash; sonst Modal: (a) read-only, (b) Upgrade mit Risiko, (c) abbrechen. (2) **Versioned Balance Constants** in Code: `BALANCE_V1_2`, `BALANCE_V1_3`; Engine wählt anhand `save.balanceVersion`. (3) **Opt-in Re-Balancing** mit Patch-Notes-Modal. (4) **Migration-Replay-Test in CI**: alle Test-Save-Fixtures mit ≥ N-2-Versionen laden, deterministisches Replay assert. (5) **Public Patch-Notes-Policy**: „Balance-Patches nur in Major-Versions; aktive Saves bleiben auf alter Balance."

**Verifikation.** CI lädt Test-Save-Fixtures mit aktuellem + N-2 Patch; byte-identisches Replay-Output. Beta-Programm: 50 Spieler über 3 Patches; < 2 % Save-Load-Failures.

### PM-2026-05-20-12-F-09 — Player-Attribute-Edge-Case-Interactions create Outliers

```yaml
id: PM-2026-05-20-12-F-09
priority: P3
domain: game-balance
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "attribute_combo_outlier_rate_per_squad"
    threshold: "> 5 %"
  - metric: "broken_regen_reports_per_kdau"
    threshold: "> 0.5 per 1000 DAU"
mitigation_summary: "Property-based testing (fast-check) auf Player-Generator + Match-Sim-Invariants"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]]
linked_specs: [[[../../50-Game-Design/GD-0003-squad-players]]]
linked_code: ["packages/match-engine/src/sim/", "packages/game-data/src/generators/players/"]
sources:
  - title: "FM Regen Development Issue"
    url: "https://www.videogamer.com/features/these-annoying-bugs-are-ruining-long-term-football-m/"
    accessed: "2026-05-20"
    publisher: "VideoGamer"
    confidence: high
  - title: "FM Scout Regens Q&A"
    url: "https://www.fmscout.com/q-23077-Regensyoung-players-not-developing.html"
    accessed: "2026-05-20"
    publisher: "FM Scout"
    confidence: medium
verification_notes: "FM23 Bug-Tracker bestätigt 'regens come through with very low mental + decent technicals'. 3.75 Mio Spieler-Lifetimes über 50 Saisons = kombinatorische Tiefe."
status: open
owner_suggested: backend+game-design
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** (1) **fast-check Property-Tests** Player-Generator: `mental_avg >= 6 unless age < 19`, `pace - acceleration ≤ 4`. (2) **Attribute-Correlation-Floor**: pearson-correlation mental↔technical ≥ 0.3. (3) Match-Sim-Invariants in CI: 1000 Sample-Matches; keine NaN/Inf; Event-Rates in Erwartungsbändern. (4) Outlier-Telemetrie (anonym, opt-in).

### PM-2026-05-20-12-F-10 — Achievement Saturation/Drought + Endgame "Is It Over?"

```yaml
id: PM-2026-05-20-12-F-10
priority: P2
domain: retention
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - metric: "achievements_unlocked_per_save_at_y5"
    threshold: "> 8/12 (saturation) oder < 2/12 (drought)"
  - metric: "save_retire_rate_after_y10"
    threshold: "< 10 %"
  - metric: "save_2_start_rate"
    threshold: "< 30 %"
mitigation_summary: "Tiered Achievements (Bronze/Silver/Gold) + Hall-of-Fame als Save-übergreifender Score + Prestige/Retire-Path + Dynamic-Carrot via Story-Arcs"
linked_adrs: []
linked_specs: [[[../onboarding-strategy]], [[../late-game-systems]], [[../../50-Game-Design/GD-0011-career-progression]]]
linked_code: ["packages/achievements/src/"]
sources:
  - title: "GameAnalytics Retention Curve"
    url: "https://www.gameanalytics.com/reports/the-retention-curve"
    accessed: "2026-05-20"
    publisher: "GameAnalytics"
    confidence: medium
  - title: "CK3 Dynasty Legacies"
    url: "https://ck3.paradoxwikis.com/Dynasty"
    accessed: "2026-05-20"
    publisher: "Paradox Wiki"
    confidence: high
verification_notes: "Sim-genre D1 45–60 %, D30 20–30 % (GameAnalytics). Save-2-Retention nicht öffentlich. CK3 Dynasty-Legacies + Civ Hall-of-Fame als Inspiration."
status: open
owner_suggested: game-design+product
effort: L
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** (1) **3-Tier-Achievement**: Bronze (1.Saison) / Silver (5–10) / Gold (15+, „5 verschiedene Ligen gewonnen"). (2) **Hall-of-Fame Save-übergreifend** (D6 §8): „Manager Rating 78 → 84 in Save 2" als Save-2-Hook. (3) **Soft-End-Trigger** Saison 25: „Prestige Reset? +1 Legacy-Slot im nächsten Save." (4) **Dynamic-Carrot**: nicht-erreichte Achievements in Story-Arcs („Journalist fragt, ob du je 3 Ligen gewinnst"). (5) Long-Goals: Bundestrainer-Unlock (D6 §4) als jenseits-Saison-25-Hooks.

**Verifikation.** Telemetrie-Cohort: median Achievements/Save bei Saison 5 in [3, 7]; Save-2-Start-Rate ≥ 35 %; Hall-of-Fame-Open-Rate ≥ 25 %.

## Quantitatives Modell

**Save-Size-Growth (Brotli-Q5):**

| In-game Jahr | Events | Raw JSON | Compressed | Snapshot | Total |
|---|---|---|---|---|---|
| y1 | 1.000 | 200 KB | 33 KB | 200 KB | ~250 KB |
| y5 | 5.000 | 1.0 MB | 170 KB | 250 KB | ~450 KB |
| y10 | 10.000 | 2.0 MB | 340 KB | 300 KB | ~700 KB |
| y30 | 30.000 | 6.0 MB | 1.0 MB | 500 KB | **~1.6 MB** |
| y50 | 50.000 | 10.0 MB | 1.7 MB | 750 KB | ~2.5 MB |

Mit Event-Tiering (cold ≤ 10 % warm-rate): @ y30 ≈ 1.0 MB compressed total.

**Narrative-Template-Burn**: E=50 Events/Saison, T=100 Templates. Saturation (90 % gesehen): ~6 Saisons. Repeat-Rate y10 median 5× pro Template. Mit Markov-Slots (T_eff=500): Saturation ~30 Saisons.

**Retention-Assumption pro Save (Sim-Benchmarks + Extrapolation):** D1 60 %, D7 25 %, D30 12 %, Save-1-retire 4 %, Save-2-start 1.6 %. Save-2-rate ÷ Save-1-retire = **40 %** = Hall-of-Fame-Hook-KPI.

**AI-Tactical-Entropy-Decay**: bei stubbornness=0.7 mean, drift 12 %/Saison; ohne Intervention -0.15 bit/Saison → von 3.0 bit (10 Archetypen) auf 1.5 bit nach Saison 10. Stubbornness-Floor 0.6 + Rivalry-Events → Drift ≤ 5 %, Entropie ≥ 2.0 bit durch Saison 30.

## SLO-Vorschläge

1. **save_load_p95_at_30_seasons** ≤ 3000 ms auf Pixel-4a (F-03).
2. **narrative_template_unique_per_season** ≥ 60 % (F-05).
3. **achievement_unlock_distribution_y5: median ∈ [3, 7] of 12** (F-10).
4. **insolvency_first_event_p50 ∈ [Saison 5, 15]** across Runs 1–10 (F-04, F-06).
5. **ai_manager_tactic_family_entropy ≥ 2.0 bit at season 20** in headless soak (F-02).
6. **balance_patch_save_migration_success ≥ 99 %** within 1 patch-version step (F-08).

## Test-Plan

- **Long-Run-Soak** (`pnpm test:soak:50y`): deterministisch, 5 worldSeeds × 50 Saisons, ≤ 15 min CI. Assert SLOs F-01/F-02/F-04/F-06.
- **Balance-Regression**: pro Balance-Konstante-Change Load 100 Test-Save-Fixtures aus N-2 Patches; identical Replay where engineVersion matches.
- **Replay-Compat-After-Rebalance**: CI byte-Hash vergleich + Sanity-Check (absichtliche Balance-Konstanten-Änderung MUSS Replay brechen).
- **Mobile Cold-Start-Soak**: Real-Device Pixel-4a, Galaxy A14, iPhone SE-3; 30-Jahres-Save 10× laden; median ≤ 2 s, p95 ≤ 3 s.
- **Property-Based Player-Generator**: fast-check, 10k Generierungen/Run; Outlier-Rate < 1 %.

## Runbook-Skizzen

### RB-12-A: "Hot-fix balance number breaks active saves"
1. Neue Balance-Datei `balance/v1_3.ts`; `v1_2.ts` bleibt.
2. Engine wählt anhand `save.balanceVersion`; Default neue Saves v1_3.
3. Migration-UI: Modal „Patch v1.3 verfügbar — neue Balance? [Bleiben/Upgraden/Read-only]".
4. Patch-Notes mit Diff: „Credit-Slot-Bonus: 25 % → 15 % (nur neue Saves)".
5. CI re-run aller Test-Save-Fixtures gegen beide Constants-Files; determinism intact.
6. Telemetrie: `balance_upgrade_decision_rate` 30 Tage; bei > 40 % „abandon save" → rollback.

### RB-12-B: "30-year save loads in 12 s on mid-range Android"
1. Telemetry-Drilldown: Event-Volume + Devices.
2. `prune-events`-Job für Save (Backup vor Pruning).
3. UI: „Career-Archiv verfügbar — older events compressed. Replay funktioniert für aktuelle Saison."
4. Falls Pruning Determinismus bricht: `save.replayableFromSeason: 2034` Marker; Spieler-spezifisches Highlight-Browsing bleibt.
5. Folge-Patch: chunked Storage-Buckets-API für neue Saves.

### RB-12-C: "League becomes coronation — Big Club wins 5× in a row"
1. Spawn deterministisch „Rising Rival"-Event im nächsten Saisonübergang.
2. Boost: Bottom-Half-Club +30 % Transfer-Budget, neuer Star-Coach != Spieler-Tactic.
3. Optional UI-Nudge: „Story-Mission: Beat the new Rival in their stadium" als Inbox-Story-Arc.
4. Nach 2 Saisons keine Wirkung: trigger „Owner Takeover Story-Arc" beim Spieler-Club (D6 §6).
5. Telemetrie: `intervention_effectiveness` — sinkt Win-Streak?

## Offene Fragen

1. **Replay-Determinismus-Vertrag nach Pruning?** Byte-identical Replay-Promise oder nur Highlight-Replay? Trade-off F-03.
2. **Soft- vs Hard-Endgame-Trigger?** Saison 25 Modal „Prestige?" oder unbegrenzt weiterspielen mit passiven Hall-of-Fame-Hooks?
3. **Markov-Slot-Pool-Größe vs Translator-Workload**: 10 Varianten × 7 Sprachen × 200 Slots = 14k Übersetzungen. ROI?
4. **Carry-Slot-Diminishing**: log oder sqrt? Alt: explizite „Slot Tax".
5. **Versioned-Balance-Constants Engineering-Cost**: 5+ Versionen pro Konstante (Code) oder Save-Upgrades nach N Versionen forcen (UX-Pain)?

## "Wenn wir nur 3 Dinge tun"-Liste

1. **Versioned Balance Constants + Engine-Version-tagged Saves (F-08)** — non-negotiable. Ohne dies bricht jeder Balance-Patch hunderte Karrieren + tötet Determinismus-Anti-Cheat.
2. **Event-Tiering + 30-year-soak SLO (F-03)** — Mobile-First-MVP-Versprechen steht und fällt damit. Pixel-4a cold-start ≤ 3 s hard-constraint.
3. **AI-Manager-Stubbornness + Rising-Rival-Cap (F-02)** — billigste Hebel mit größtem Long-Term-Engagement-Effekt. Verhindert Coronation-Endgame; speist Save-2-Replay-Hook (F-10).

## Verfolgung & Verkettung

IDs `PM-2026-05-20-12-F-NN`. Aggregat: [[findings-registry]].

## Related

- [[00-index]] · [[findings-registry]]
- [[PM-2026-05-20-03-gameplay]] · [[PM-2026-05-20-05-security-and-integrity]] (Determinismus) · [[PM-2026-05-20-15-browser-device-storage-matrix]] (Save-Storage) · [[PM-2026-05-20-16-test-strategy-depth]] (50-y-Soak-Test)
- [[../late-game-systems]] · [[../narrative-content-pipeline]] · [[../determinism-and-replay]]
- [[../../50-Game-Design/GD-0008-finance-economy]] · [[../../50-Game-Design/mode-create-a-club-roguelite]]
