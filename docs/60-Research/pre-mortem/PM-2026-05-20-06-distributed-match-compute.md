---
title: "Pre-Mortem 2026-05-20 Â· 06 Â· Distributed Match Compute (BYOC)"
status: current
tags: [research, pre-mortem, byoc, distributed-compute, match-engine, security, future-scope, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-06
report_set: 2026-05-20
horizon: 2027+ (Future-Scope)
target_dau: 10000
scenarios: [cloud-autoscaling]
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[threat-model]]
  - [[PM-2026-05-20-01-architecture]]
  - [[PM-2026-05-20-02-tech-and-ops]]
  - [[PM-2026-05-20-03-gameplay]]
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[../match-engine-runtime-strategy]]
  - [[../determinism-and-replay]]
  - [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
---

# Pre-Mortem 2026-05-20 Â· 06 Â· Distributed Match Compute (BYOC)

> **Scope.** Pre-Mortem fÃ¼r die *zukÃ¼nftige* Idee, Match-Berechnungen auf den GerÃ¤ten der Liga-Mitspieler statt nur auf dem Server auszufÃ¼hren ("Bring Your Own Compute"). Bewusst als eigenstÃ¤ndiger Report, weil das die Trust-Topologie fundamental Ã¤ndert und mit [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer|ADR-0011]] in Spannung steht.
>
> **Status: draft, future-scope.** Dieser Report identifiziert Risiken *bevor* gebaut wird und schlÃ¤gt ein **Decision-Gate** vor: BYOC wird nicht aus Begeisterung, sondern aus belegbarer Notwendigkeit gebaut.
>
> **Failure-Headline-Kandidaten**
> - â€žWir haben Compute auf die SpielergerÃ¤te verteilt â€” eine Hand voll Cheater hat die Liga-Tabellen wochenlang gefÃ¤lscht."
> - â€žDie Validator-Quorum-Logik war zu komplex â€” die Latenz war schlechter als bei Server-Berechnung, und wir mussten zurÃ¼ckrudern."
> - â€žSybil-Angriff: ein Spieler hat 10 Accounts gleichzeitig als Validatoren registriert und Matches systematisch beeinflusst."
> - â€žMobile GerÃ¤te konnten Match-Compute nicht zuverlÃ¤ssig liefern (Battery-Saver, Background-Tab-Kill), Latenz P99 ging auf 12 Min."

## Scope

Pre-Mortem fÃ¼r eine *vorgeschlagene* Architektur-Erweiterung. Wir bauen sie nicht jetzt; wir entscheiden hier, **welche Risiken sie hÃ¤tte und welches Decision-Gate sie passieren muss**, falls sie irgendwann gebaut wird.

**Was BYOC ist (Vorschlag):** statt jedes Liga-Match auf einem Server-Worker zu simulieren, lassen wir N (z. B. 5) ausgewÃ¤hlte Liga-Mitspieler die Simulation auf ihren GerÃ¤ten ausfÃ¼hren. Server akzeptiert das Quorum-Ergebnis (3-of-5 identische Result-Hashes); bei Disagreement re-simuliert der Server authoritativ.

**Was BYOC nicht ist:** kein Ersatz fÃ¼r Server-Authority bei Save-Persistierung, kein Ersatz fÃ¼r Identity/Auth, kein Cryptocurrency-Mining-Vektor.

## Trust-Modell-Vorschlag (Diskussionsgrundlage)

```
Match-Result = Quorum-of-(N=5) Re-Simulations mit Server-Fallback
              â”œâ”€â”€ Validator-Auswahl: deterministisch aus
              â”‚     hash(worldSeed, matchId, week, validator_pool_state)
              â”œâ”€â”€ Inputs (Lineup, Tactic): server-committed BEFORE match-start
              â”‚     (Commit-Reveal: hashes vor kick-off, reveal nach kick-off)
              â”œâ”€â”€ Engine-Bundle-Hash: per Validator gepinnt, Mismatch â†’ reject
              â”œâ”€â”€ Validator-Output: signiertes Tupel
              â”‚     (resultHash, eventLogMerkleRoot, validatorDeviceKey)
              â”œâ”€â”€ Quorum: 3-of-5 identische Result-Hashes â†’ accept
              â””â”€â”€ Disagreement: Server re-simuliert authoritativ â†’ akzeptiert
                                Validator-Reputation: divergent â†’ -3
                                                       consistent â†’ +1
```

**Spannung zu ADR-0011.** ADR-0011 ist â€žServer-Authoritative" als MVP-Pattern. BYOC ist *â€žQuorum-Validated mit Server-Fallback"* â€” der Server bleibt finale AutoritÃ¤t (kann jederzeit re-simulieren), aber im Happy-Path spart er sich die CPU. Falls BYOC gebaut wird, beschreibt ein neuer `ADR-0027 BYOC Match Validation Quorum` die Erweiterung â€” ADR-0011 wird *nicht* superseded, sondern *ergÃ¤nzt* mit einem Modus-Switch.

## Top Failure-Hypothesen

Jedes Finding hat eine immutable ID (`PM-2026-05-20-06-F-NN`).

---

### PM-2026-05-20-06-F-01 â€” Sybil-Cluster manipuliert Validator-Pool

```yaml
id: PM-2026-05-20-06-F-01
domain: byoc
scenario: [cloud-autoscaling]
probability: 4
impact: 5
score: 20
confidence: medium
early_warning:
  - metric: "validator_pool_account_density"
    threshold: "Mehr als 3 Validatoren mit gleichem IP-Range oder Browser-FP"
  - metric: "validator_divergence_correlated_total"
    threshold: "Cluster-Pattern erkennbar"
mitigation_summary: "Cross-League-Validator-Pool, Passkey-Device-Bindung, Reputation-Aufbau erfordert Spielzeit"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]]
linked_specs: [[[threat-model]]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: backend
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ein Spieler legt 10 Accounts mit unterschiedlichen Emails an, alle haben Validator-Status, alle stimmen fÃ¼r sein gewÃ¼nschtes Match-Resultat.

**Mitigation.**
1. **Cross-League-Pool.** Validatoren werden *cross-league* gezogen â€” die Validatoren eines Matches kommen *nicht* aus der Liga des Matches, nicht aus Freundeslisten und nicht aus geteilten Gruppen.
2. **Passkey-Device-Bindung.** 1 Passkey = 1 Vote. Mehrere Devices/Account sind erlaubt, aber zÃ¤hlen als 1 Validator-IdentitÃ¤t.
3. **Reputation-Aufbau erfordert Spielzeit.** Tag-1-Accounts sind keine Validatoren; Validator-Status erfordert â‰¥ 4 Wochen aktives Spiel + â‰¥ 50 gespielte Matches als Spieler.
4. **Browser-Fingerprint-Cluster-Detection.** Audit-Heuristik: wenn N Validatoren mit Ã¤hnlichen FPs / IP-Ranges fÃ¼r dasselbe Match votieren â†’ Quorum verwerfen, Server-Fallback, Cluster-Investigation.

---

### PM-2026-05-20-06-F-02 â€” Collusion-Wahrscheinlichkeit unterschÃ¤tzt

```yaml
id: PM-2026-05-20-06-F-02
domain: byoc
scenario: [cloud-autoscaling]
probability: 3
impact: 5
score: 15
confidence: medium
early_warning:
  - metric: "validator_friendship_cluster_total"
    threshold: "> 0"
mitigation_summary: "Validator-Set erst nach Match-Ende Ã¶ffentlich; Quorum-GrÃ¶ÃŸe 5-of-7 statt 3-of-5; 5 % Server-Stichprobe"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Drei befreundete Cheater werden zufÃ¤llig als Validatoren ausgewÃ¤hlt und stimmen fÃ¼r ein gefÃ¤lschtes Resultat. Quorum 3-of-5 â†’ ihre LÃ¼ge gewinnt.

**Mitigation.**
1. **Validator-Set ist erst nach Match-Ende Ã¶ffentlich.** Vor Voting-Window kennen Validatoren einander nicht â€” keine Absprache mÃ¶glich.
2. **Quorum-GrÃ¶ÃŸe konfigurierbar.** Standard 5-of-7, nicht 3-of-5; bei Hochrisiko-Matches (Pokalfinale) 7-of-9.
3. **5 %-Server-Stichprobe.** 5 % aller BYOC-Matches werden trotz Quorum *zusÃ¤tzlich* server-re-simuliert. Stichprobe mit Mismatch â†’ ganzer Validator-Set gesperrt + Audit; manipulierte Match-Results retroaktiv korrigiert.
4. **Friendship-Graph-Exclusion.** Validator-Auswahl exkludiert Accounts mit direkter Liga-/Gruppen-/Freundschafts-Beziehung zu den Match-Teilnehmern.

---

### PM-2026-05-20-06-F-03 â€” Lineup/Tactic-Manipulation vor Validation

```yaml
id: PM-2026-05-20-06-F-03
domain: byoc
scenario: [cloud-autoscaling]
probability: 3
impact: 5
score: 15
confidence: high
early_warning:
  - metric: "input_signature_invalid_total"
    threshold: "> 0"
mitigation_summary: "Server-committed Inputs mit Merkle-Proof; Validator empfÃ¤ngt mit Server-Sig"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-05-security-and-integrity]]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ein Validator modifiziert Inputs (eigene Lineup zugunsten eines kompromittierten Resultats) bevor er re-simuliert.

**Mitigation.**
1. Inputs (Lineup, Tactic, Squad-State, Wetter, Schiri) sind **server-committed mit Merkle-Proof** *vor* Kickoff. Server signiert: `serverSig(matchId, inputHash, kickoff_time)`.
2. Validator empfÃ¤ngt Input + Server-Signatur; rechnet nur, wenn Signatur valide.
3. Manipulation wÃ¼rde SignaturprÃ¼fung sprengen â†’ Result wird im Quorum-Mismatch sichtbar.

---

### PM-2026-05-20-06-F-04 â€” Engine-Bundle-Mismatch (modifizierter Match-Code)

```yaml
id: PM-2026-05-20-06-F-04
domain: byoc
scenario: [cloud-autoscaling]
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "engine_bundle_hash_mismatch_total"
    threshold: "> 0"
mitigation_summary: "Per Validator Engine-Bundle-Hash pinning; nur whitelisted Hashes akzeptiert"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]]
linked_specs: [[[PM-2026-05-20-05-security-and-integrity]]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ein Validator nutzt eine gepatchte Engine (Browser-DevTools-Modifikation, lokale Datei-Substitution, MITM beim Bundle-Download).

**Mitigation.**
1. Jedes Validator-Vote enthÃ¤lt `engine_bundle_hash`.
2. Server akzeptiert nur Votes mit dem aktuell *accepted* Engine-Hash (whitelist).
3. Subresource-Integrity (SRI) fÃ¼r Engine-Bundle-Asset; Browser refuses to execute modified bundle.
4. Cross-Validator-Vergleich entdeckt Hash-Mismatches; divergente Votes â†’ Validator-Sperre.
5. Engine-Bundle-Rotation-Plan (siehe `PM-2026-05-20-05-F-12`).

---

### PM-2026-05-20-06-F-05 â€” VerfÃ¼gbarkeits-/Latenz-Kollaps auf Mobile

```yaml
id: PM-2026-05-20-06-F-05
domain: byoc
scenario: [cloud-autoscaling]
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "quorum_timeout_total"
    threshold: "> 5% of BYOC matches"
  - metric: "server_fallback_rate"
    threshold: "> 5%"
mitigation_summary: "Validator-Pool Ã¼berdimensioniert (10 angefragt, 5 reichen); Timeout 60s; Mobile-Opt-Out per Default"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Mobile-Validatoren sind unzuverlÃ¤ssig: Tab geschlossen, Battery-Saver, schwaches Netz. Quorum wird nie erreicht; jedes Match fÃ¤llt auf Server-Fallback zurÃ¼ck â€” BYOC spart nichts.

**Mitigation.**
1. Validator-Pool Ã¼berdimensioniert: 10 angefragt, 5 reichen fÃ¼r Quorum.
2. Timeout: 60 s pro Validator; danach Server-Fallback.
3. Mobile per Default *Opt-Out* von Validator-Aufgaben; Desktop per Default *Opt-In*.
4. User-Toggle â€žValidator nur bei WLAN + Charger".
5. SLO Server-Fallback-Rate â‰¤ 5 % â€” wenn Ã¼berschritten, BYOC pausieren und Pool vergrÃ¶ÃŸern.

---

### PM-2026-05-20-06-F-06 â€” Privacy-Leak: Validator sieht fremde Tactic

```yaml
id: PM-2026-05-20-06-F-06
domain: byoc
scenario: [cloud-autoscaling]
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "user_complaint_tactic_visibility_total"
    threshold: "Forum-Reports"
mitigation_summary: "Validator empfÃ¤ngt Inputs erst NACH Kickoff-Commit; nach Match-Ende ist Tactic ohnehin im Report sichtbar"
linked_adrs: []
linked_specs: [[[../../30-Implementation/privacy-and-consent]]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: product
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Validator sieht die taktische Aufstellung eines anderen Spielers *vor* Match-Ende und kann die Information missbrauchen (Wetten? Spoilern?). Selbst wenn Match nur zwischen anderen Spielern lÃ¤uft.

**Mitigation.**
1. Validator empfÃ¤ngt Inputs **erst nach Kickoff-Commit** (Commit-Reveal-Schema): vor Kickoff nur Hashes, nach Kickoff Klartext.
2. Nach Match-Ende ist Tactic ohnehin im Match-Report sichtbar (analog zum echten FuÃŸball).
3. Zeitlich: Validator-Voting-Window beginnt nach simulierter Match-Endzeit, nicht vor.

**Restrisiko.** Validator hat Insider-Wissen 90 Min frÃ¼her als Public-Spectator. Akzeptiert, weil Wett-/Spoiler-Markt nicht existiert.

---

### PM-2026-05-20-06-F-07 â€” Reputations- und Slashing-System dysfunktional

```yaml
id: PM-2026-05-20-06-F-07
domain: byoc
scenario: [cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: low
early_warning:
  - metric: "validator_reputation_distribution"
    threshold: "Bimodal oder degenerate Verteilung"
mitigation_summary: "Klare Reputation-Werte (+1/-3/-Reset); periodischer Reset-Mechanismus; Appeal-Pfad"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Reputations-System ist zu strikt (legitime Engine-Updates lassen alle ehrlichen Validatoren auf -âˆž fallen) oder zu lax (Cheater bleiben aktiv).

**Mitigation.**
1. Klares Schema: konsistentes Voting +1, divergent ohne bekannten Engine-Bug -3, nicht-Voting bei Assignment -1, Engine-Hash-Mismatch â†’ Reset auf 0 + 30-Tage-Sperre.
2. Periodischer Reset alle 90 Tage auf max(0, currentRep) â€” Gnade fÃ¼r Altfehler.
3. Appeal-Pfad: Spieler kann Validator-Sperre kontextualisieren (Support-Ticket); Operator-Override mÃ¶glich.
4. Distribution-Monitor: wenn Reputation bimodal wird (alle bei +N oder alle bei -M), prÃ¼fen ob Schema-Bug.

---

### PM-2026-05-20-06-F-08 â€” DoS via GerÃ¤te-ErschÃ¶pfung (legal, aber giftig)

```yaml
id: PM-2026-05-20-06-F-08
domain: byoc
scenario: [cloud-autoscaling]
probability: 4
impact: 3
score: 12
confidence: medium
early_warning:
  - metric: "validator_battery_complaint_total"
    threshold: "Forum-/Review-Spikes"
  - metric: "validator_assignment_per_day_p99"
    threshold: "> 5"
mitigation_summary: "Max 3 Aufgaben/Tag; Mobile-Default Opt-Out; sichtbare ablehnbare Anfrage; WLAN-only-Option"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: product
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** BYOC-Aufgaben verbrauchen Battery + Mobile-Daten. Spieler bemerken LÃ¼fter, App-Reviews stÃ¼rzen ab.

**Mitigation.**
1. Max 3 Validator-Aufgaben/Tag pro Spieler.
2. Mobile per Default Opt-Out, Desktop per Default Opt-In, User-Toggle.
3. Validator-Anfrage ist sichtbar im UI ("MÃ¶chtest du ein Match validieren? Dauert ~5 s, lÃ¤uft im Hintergrund."), ablehnbar.
4. â€žWLAN-only" und â€žNur am Charger" als User-Settings.
5. App Store / Play Store Energie-Compliance prÃ¼fen.

---

### PM-2026-05-20-06-F-09 â€” DSGVO/Auftragsverarbeitung unklar

```yaml
id: PM-2026-05-20-06-F-09
domain: byoc
scenario: [cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: low
early_warning:
  - metric: "dpia_signoff_status"
    threshold: "Missing for BYOC"
mitigation_summary: "DPIA vor Launch; explizites Validator-Opt-In; nicht fÃ¼r MinderjÃ¤hrige"
linked_adrs: []
linked_specs: [[[../gdpr-compliance]], [[../../30-Implementation/privacy-and-consent]]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: product
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Validator-Compute auf SpielergerÃ¤ten verarbeitet Daten anderer Spieler (Lineup, Squad-State). RechtsverhÃ¤ltnis: Auftragsverarbeitung-Ã¤hnlich. Ohne klare Dokumentation â†’ Risiko bei DSGVO-Audit.

**Mitigation.**
1. **DPIA (Data Protection Impact Assessment)** vor BYOC-Launch.
2. **Explizites Validator-Opt-In** (separates Toggle, nicht Default).
3. **MinderjÃ¤hrige (16-) ausgeschlossen** vom Validator-Pool (auch wenn registriert).
4. **DatenschutzerklÃ¤rung** aktualisiert: was passiert auf Validator-Devices, welche Daten, Speicherdauer (kurz, max. Match-Dauer), keine Weitergabe.

---

### PM-2026-05-20-06-F-10 â€” Wirtschaftlichkeit nicht gegeben

```yaml
id: PM-2026-05-20-06-F-10
domain: byoc
scenario: [cloud-autoscaling]
probability: 4
impact: 3
score: 12
confidence: medium
early_warning:
  - metric: "server_match_compute_cost_eur_month"
    threshold: "< 500 = BYOC nicht sinnvoll"
mitigation_summary: "Decision-Gate (siehe unten) ehrlich anwenden"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: accepted-risk
owner_suggested: product
effort: â€”
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wir bauen BYOC aus architektonischem Interesse, sparen aber kein nennenswertes Geld â€” Engineering-Aufwand Ã¼bersteigt Server-Einsparungen um Faktoren.

**Mitigation.** Decision-Gate (siehe Â§Decision-Gate). Wenn Server-Match-Compute < 500 â‚¬/Monat, **nicht** bauen.

## Quantitatives Modell

### Server-Compute-Einsparung

| DAU | Matches/Tag | Server-Sim-CPU (5 ms/Match) | Server-CPU-Sec/Tag | Monatliche CPU-Stunden |
|-----|-------------|------------------------------|----------------------|------------------------|
| 1.000 | 430 | 2,1 s | 64 | 0,5 h |
| 10.000 | 4.300 | 21 s | 645 | 5,4 h |
| 100.000 | 43.000 | 215 s | 6.450 | 54 h |
| 1.000.000 | 430.000 | 2.150 s | 64.500 | 537 h |

Bei AWS Fargate-Preisen (~0,05 $/vCPU-Stunde) ergibt das bei **10k DAU monatliche Match-Sim-Kosten von ~0,27 $**.

**Schlussfolgerung.** Bei 10k DAU ist BYOC wirtschaftlich nicht begrÃ¼ndbar. Erst ab ~100k DAU werden monatliche Sim-Kosten relevant; ab ~1 Mio DAU richtig spÃ¼rbar. **BYOC ist Future-Scope fÃ¼r 100k+ DAU-Szenario.**

### Engineering-Aufwand

SchÃ¤tzung (sehr grob):
- Validator-Protokoll-Design + ADR: 2â€“3 Wochen.
- Server-Quorum-Logik + Fallback: 3â€“4 Wochen.
- Client-Validator-Worker + UI: 3â€“4 Wochen.
- Reputation-System + Sanctions: 2 Wochen.
- DPIA + Datenschutz-Update: 1â€“2 Wochen.
- Pen-Test extern fÃ¼r BYOC: 1 Woche.
- Load-Tests + Sybil-Sim + Collusion-Sim: 2 Wochen.

**Summe: ~14â€“18 Engineer-Wochen â‰ˆ 3,5â€“4,5 Monate FTE.** Bei einem Engineer-Tagessatz von 600 â‚¬ â‰ˆ **42.000â€“54.000 â‚¬.**

**Break-Even (vereinfachend):** ab >50.000 â‚¬/Monat Server-Sim-Kosten amortisiert sich BYOC binnen Jahr. Das entspricht ~20 Mio DAU. Realistisch nie.

**Alternativ-Motivation.** BYOC kann gerechtfertigt sein fÃ¼r:
- Latenz-Reduktion (lokales Compute statt Round-Trip) â€” aber Latenz ist *schlechter*, siehe F-05.
- Community-Engagement (â€žDu bist Teil der Liga-Infrastruktur") â€” Marketing-Wert schwer zu beziffern.
- Trust-Story (â€žErgebnisse von Liga-Mitgliedern verifiziert") â€” GlaubwÃ¼rdigkeit.

### Latenz-Modell

| Modus | P50 Match-Settle | P99 |
|-------|------------------|-----|
| Server-Sync | ~50 ms | ~500 ms |
| BYOC (Desktop, Browser-permitted) | ~3 s | ~30 s |
| BYOC (Mobile, Background) | ~10 s | ~60 s + Fallback |

**BYOC ist langsamer**, nicht schneller. Wenn Latenz das Argument war, ist es das falsche Argument.

## SLO-VorschlÃ¤ge

| SLO | Ziel | Severity |
|-----|------|----------|
| Quorum-Reach-Rate | â‰¥ 99 % der BYOC-Matches erreichen Quorum in â‰¤ 90 s | S2 |
| Server-Fallback-Rate | â‰¤ 5 % | S2 (sonst BYOC pausieren) |
| Validator-Divergence-Rate | â‰¤ 0,1 % (auÃŸer bei Engine-Update-Tag) | S1 |
| Server-Stichprobenvalidierungs-Mismatch-Rate | 0 % | S1 |
| Mobile-Battery-Impact pro Validation | < 50 mAh @ Mid-Tier Android | S3 |

## Load-/Stress-Test-Plan

### Sybil-Sim
- 100 simulierte Accounts (gleiches Browser-FP, gleicher IP-Range) versuchen Validator-Status zu erlangen.
- Pass: â‰¤ 5 % gelangen in einen Pool; jene niemals als 3 Validatoren im selben Match.

### Collusion-Sim
- 3 befreundete Accounts gezielt mit hoher Reputation; Match wird beobachtet, ob Auswahl je 3-fach kommt.
- Pass: Wahrscheinlichkeit < 0,01 % Ã¼ber 10.000 Match-Sims.

### Mobile-Stress
- 50 echte Mobile-Devices (Android Mid-Tier) fÃ¼hren 100 Validation-Runs aus.
- Pass: kein Crash, P99 Wall-Time < 8 s, kein Tab-Killed-by-Browser.

### Adversarial-Validator
- Validator gibt absichtlich falsche Hashes ab.
- Pass: Quorum-Logik erkennt als Outlier; Reputation sinkt korrekt; nach 3 VorfÃ¤llen automatische Sperre.

### Engine-Update-Simulation
- Engine-Bundle-Hash wird kontrolliert geÃ¤ndert; manche Validatoren updaten sofort, andere nicht.
- Pass: Server akzeptiert nur whitelisted Hashes; alte Validatoren bekommen Update-Hint, keine Reputations-Sanction.

## Runbook-Skizzen

### RB-B1: Validator-Quorum kollabiert flÃ¤chendeckend
1. **Detect:** `quorum_timeout_total` Spike, `server_fallback_rate > 30 %`.
2. **Sofort:** BYOC pausieren via Feature-Flag, Server-Only-Mode aktivieren.
3. **Triage:** war es Engine-Update? Mobile-Pool-Outage? Bug im Quorum-Code?
4. **Comms:** Status-Page, Spieler-Kommunikation.
5. **Postmortem.**

### RB-B2: Sybil-Cluster identifiziert
1. **Detect:** Audit-Heuristik flaggt Account-Cluster.
2. **Action:** Devices der Cluster-Accounts sperren (Validator-Status revoken), Match-Results retroaktiv re-simulieren.
3. **Comms:** Betroffene Liga-Mitglieder informieren, Tabellen korrigieren.
4. **Followup:** Cluster-Detection-Pattern in Audit-Pipeline aufnehmen.

### RB-B3: Mass-Reputation-Reset nach Bug
1. **Detect:** Reputation-Verteilung degenerate (z. B. alle -âˆž nach Engine-Update).
2. **Action:** Migration-Plan, Reputation Reset auf max(0, currentRep) fÃ¼r alle.
3. **Comms:** Spieler-Update.

## Decision-Gate (vor Implementierung)

**BYOC wird nicht gebaut, bis alle vier Bedingungen erfÃ¼llt sind:**

1. **Compute-Kosten Ã¼berschreiten Gate-Schwelle:** Server-Match-Compute > 500 â‚¬/Monat (entspricht ~50k DAU mit moderater AktivitÃ¤t).
2. **Threat-Model-Review extern:** externe Security-Boutique signiert Threat-Modell ab.
3. **Baseline-Daten:** mindestens 1 Quartal Server-only-Betrieb in Production mit stabilem Determinism-CI-Gate, sodass â€žnormal divergence rate" bekannt ist.
4. **DPIA abgeschlossen:** Data Protection Impact Assessment fÃ¼r BYOC vorhanden, DSGVO-Compliance bestÃ¤tigt.

**Anti-Bedingung (Show-Stopper):** wenn auch nur eine der vier nicht erfÃ¼llt â†’ BYOC nicht bauen, Resource-Allocation in andere WertschÃ¶pfung.

## Single-Player-Foundation-Check

Auch wenn BYOC nie gebaut wird, *bereiten* wir die Foundation:

- **Save-Schema enthÃ¤lt bereits `engine_bundle_hash`** (siehe `PM-2026-05-20-05-F-01`) â€” Re-Sim-fÃ¤higkeit ist da.
- **Match-Records enthalten bereits Command-Log + Seed + Lineup-Snapshot** â€” Re-Simulation ist mechanisch mÃ¶glich.
- **Determinismus-CI-Gate** (siehe `PM-2026-05-20-05-F-03`) ist Voraussetzung â€” ohne Determinismus kein BYOC.

Diese Foundation kostet nichts extra (sie ist sowieso Security/Anti-Cheat-Foundation fÃ¼r MP), gewinnt aber: BYOC bleibt jederzeit *einschaltbar*, wenn DAU eines Tages 100k+ erreicht.

## Future-scope decisions (classified future-scope)

- **OQ-B-01.** Wenn Server-Fallback-Rate hoch ist (z. B. nachts mit wenig aktiven Validatoren), ist das schlimm? Akzeptables Worst-Case ist welcher Anteil?
- **OQ-B-02.** Reward-System fÃ¼r Validatoren? (Bonus-XP? Sichtbarkeit? Talent-Tree-Punkte?) â€” Risiko: Ã¼ber-incentiviert â†’ Sybil-Pull.
- **OQ-B-03.** Wenn Validator selbst in einer Liga mit Ã¤hnlichem Match spielt, ist das ein Konflikt? (Probably ja â†’ ausschlieÃŸen.)
- **OQ-B-04.** WebGPU-Beschleunigung fÃ¼r Match-Sim auf GerÃ¤ten? Wenn ja, Ã¤ndert Determinismus-Garantie (GPU-Determinismus ist tricky).
- **OQ-B-05.** Validator-Telemetrie: was loggen wir, wie lange? Privacy-Bilanz.

## â€žWenn wir BYOC bauen, nur diese 3 Dinge"-Liste

1. **Cross-League-Validator-Pool als Fundament** â€” alles andere bricht ohne das.
2. **5 %-Server-Stichprobe parallel zur BYOC-Validierung** â€” kontinuierlicher Plausibility-Check ohne Compute-Vorteil aufzugeben.
3. **Decision-Gate ehrlich anwenden** â€” wenn die Server-Compute-Kosten und Liga-GrÃ¶ÃŸen es nicht rechtfertigen, **nicht** bauen, egal wie spannend die Architektur klingt.

## Verfolgung & Verkettung (Finding â†’ Fix)

Jedes Finding hat eine immutable ID (`PM-2026-05-20-06-F-NN`). Da BYOC Future-Scope ist, sind Findings hier **vorerst `accepted-risk` und durch [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]] konzeptionell geschlossen** â€” sie werden aktiviert, sobald Decision-Gate erfÃ¼llt ist und Implementierung beginnt.

## Related

- [[00-index]] Â· [[findings-registry]] Â· [[threat-model]]
- [[PM-2026-05-20-01-architecture]] Â· [[PM-2026-05-20-02-tech-and-ops]] Â· [[PM-2026-05-20-03-gameplay]] Â· [[PM-2026-05-20-04-monetization]] Â· [[PM-2026-05-20-05-security-and-integrity]]
- [[../match-engine-runtime-strategy]] â€” Polyglot-Gate-Kontext fÃ¼r Match-Worker-Extraktion
- [[../determinism-and-replay]] â€” Determinismus als Validator-Foundation
- [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]] â€” ErgÃ¤nzt, nicht ersetzt
- [[../../30-Implementation/privacy-and-consent]]
- [[../gdpr-compliance]]
- [[../../00-Index/Current-State]]
