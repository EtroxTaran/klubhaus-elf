---
title: "Pre-Mortem 2026-05-20 · 06 · Distributed Match Compute (BYOC)"
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

# Pre-Mortem 2026-05-20 · 06 · Distributed Match Compute (BYOC)

> **Scope.** Pre-Mortem für die *zukünftige* Idee, Match-Berechnungen auf den Geräten der Liga-Mitspieler statt nur auf dem Server auszuführen ("Bring Your Own Compute"). Bewusst als eigenständiger Report, weil das die Trust-Topologie fundamental ändert und mit [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer|ADR-0011]] in Spannung steht.
>
> **Status: draft, future-scope.** Dieser Report identifiziert Risiken *bevor* gebaut wird und schlägt ein **Decision-Gate** vor: BYOC wird nicht aus Begeisterung, sondern aus belegbarer Notwendigkeit gebaut.
>
> **Failure-Headline-Kandidaten**
> - ”žWir haben Compute auf die Spielergeräte verteilt — eine Hand voll Cheater hat die Liga-Tabellen wochenlang gefälscht."
> - ”žDie Validator-Quorum-Logik war zu komplex — die Latenz war schlechter als bei Server-Berechnung, und wir mussten zurückrudern."
> - ”žSybil-Angriff: ein Spieler hat 10 Accounts gleichzeitig als Validatoren registriert und Matches systematisch beeinflusst."
> - ”žMobile Geräte konnten Match-Compute nicht zuverlässig liefern (Battery-Saver, Background-Tab-Kill), Latenz P99 ging auf 12 Min."

## Scope

Pre-Mortem für eine *vorgeschlagene* Architektur-Erweiterung. Wir bauen sie nicht jetzt; wir entscheiden hier, **welche Risiken sie hätte und welches Decision-Gate sie passieren muss**, falls sie irgendwann gebaut wird.

**Was BYOC ist (Vorschlag):** statt jedes Liga-Match auf einem Server-Worker zu simulieren, lassen wir N (z. B. 5) ausgewählte Liga-Mitspieler die Simulation auf ihren Geräten ausführen. Server akzeptiert das Quorum-Ergebnis (3-of-5 identische Result-Hashes); bei Disagreement re-simuliert der Server authoritativ.

**Was BYOC nicht ist:** kein Ersatz für Server-Authority bei Save-Persistierung, kein Ersatz für Identity/Auth, kein Cryptocurrency-Mining-Vektor.

## Trust-Modell-Vorschlag (Diskussionsgrundlage)

```
Match-Result = Quorum-of-(N=5) Re-Simulations mit Server-Fallback
              â”œâ”€â”€ Validator-Auswahl: deterministisch aus
              â”‚     hash(worldSeed, matchId, week, validator_pool_state)
              â”œâ”€â”€ Inputs (Lineup, Tactic): server-committed BEFORE match-start
              â”‚     (Commit-Reveal: hashes vor kick-off, reveal nach kick-off)
              â”œâ”€â”€ Engine-Bundle-Hash: per Validator gepinnt, Mismatch → reject
              â”œâ”€â”€ Validator-Output: signiertes Tupel
              â”‚     (resultHash, eventLogMerkleRoot, validatorDeviceKey)
              â”œâ”€â”€ Quorum: 3-of-5 identische Result-Hashes → accept
              â””â”€â”€ Disagreement: Server re-simuliert authoritativ → akzeptiert
                                Validator-Reputation: divergent → -3
                                                       consistent → +1
```

**Spannung zu ADR-0011.** ADR-0011 ist ”žServer-Authoritative" als MVP-Pattern. BYOC ist *”žQuorum-Validated mit Server-Fallback"* — der Server bleibt finale Autorität (kann jederzeit re-simulieren), aber im Happy-Path spart er sich die CPU. Falls BYOC gebaut wird, beschreibt ein neuer, dann zu nummerierender BYOC-ADR die Erweiterung. FMX-182 bestätigt: das alte Platzhalter-Label `ADR-0027 BYOC Match Validation Quorum` ist ungültig; aktuelle ADR-0027 ist das PostgreSQL-Datenmodell. ADR-0011 wird *nicht* superseded, sondern *ergänzt* mit einem Modus-Switch.

## Top Failure-Hypothesen

Jedes Finding hat eine immutable ID (`PM-2026-05-20-06-F-NN`).

---

### PM-2026-05-20-06-F-01 — Sybil-Cluster manipuliert Validator-Pool

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
linked_adrs: [[ADR-0011-server-authoritative-multiplayer]]
linked_specs: [[threat-model]]
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

**Hypothese.** Ein Spieler legt 10 Accounts mit unterschiedlichen Emails an, alle haben Validator-Status, alle stimmen für sein gewünschtes Match-Resultat.

**Mitigation.**
1. **Cross-League-Pool.** Validatoren werden *cross-league* gezogen — die Validatoren eines Matches kommen *nicht* aus der Liga des Matches, nicht aus Freundeslisten und nicht aus geteilten Gruppen.
2. **Passkey-Device-Bindung.** 1 Passkey = 1 Vote. Mehrere Devices/Account sind erlaubt, aber zählen als 1 Validator-Identität.
3. **Reputation-Aufbau erfordert Spielzeit.** Tag-1-Accounts sind keine Validatoren; Validator-Status erfordert ≥ 4 Wochen aktives Spiel + ≥ 50 gespielte Matches als Spieler.
4. **Browser-Fingerprint-Cluster-Detection.** Audit-Heuristik: wenn N Validatoren mit ähnlichen FPs / IP-Ranges für dasselbe Match votieren → Quorum verwerfen, Server-Fallback, Cluster-Investigation.

---

### PM-2026-05-20-06-F-02 — Collusion-Wahrscheinlichkeit unterschätzt

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
mitigation_summary: "Validator-Set erst nach Match-Ende öffentlich; Quorum-Größe 5-of-7 statt 3-of-5; 5 % Server-Stichprobe"
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

**Hypothese.** Drei befreundete Cheater werden zufällig als Validatoren ausgewählt und stimmen für ein gefälschtes Resultat. Quorum 3-of-5 → ihre Lüge gewinnt.

**Mitigation.**
1. **Validator-Set ist erst nach Match-Ende öffentlich.** Vor Voting-Window kennen Validatoren einander nicht — keine Absprache möglich.
2. **Quorum-Größe konfigurierbar.** Standard 5-of-7, nicht 3-of-5; bei Hochrisiko-Matches (Pokalfinale) 7-of-9.
3. **5 %-Server-Stichprobe.** 5 % aller BYOC-Matches werden trotz Quorum *zusätzlich* server-re-simuliert. Stichprobe mit Mismatch → ganzer Validator-Set gesperrt + Audit; manipulierte Match-Results retroaktiv korrigiert.
4. **Friendship-Graph-Exclusion.** Validator-Auswahl exkludiert Accounts mit direkter Liga-/Gruppen-/Freundschafts-Beziehung zu den Match-Teilnehmern.

---

### PM-2026-05-20-06-F-03 — Lineup/Tactic-Manipulation vor Validation

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
mitigation_summary: "Server-committed Inputs mit Merkle-Proof; Validator empfängt mit Server-Sig"
linked_adrs: []
linked_specs: [[PM-2026-05-20-05-security-and-integrity]]
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
2. Validator empfängt Input + Server-Signatur; rechnet nur, wenn Signatur valide.
3. Manipulation würde Signaturprüfung sprengen → Result wird im Quorum-Mismatch sichtbar.

---

### PM-2026-05-20-06-F-04 — Engine-Bundle-Mismatch (modifizierter Match-Code)

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
linked_adrs: [[ADR-0003-match-engine]]
linked_specs: [[PM-2026-05-20-05-security-and-integrity]]
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
1. Jedes Validator-Vote enthält `engine_bundle_hash`.
2. Server akzeptiert nur Votes mit dem aktuell *accepted* Engine-Hash (whitelist).
3. Subresource-Integrity (SRI) für Engine-Bundle-Asset; Browser refuses to execute modified bundle.
4. Cross-Validator-Vergleich entdeckt Hash-Mismatches; divergente Votes → Validator-Sperre.
5. Engine-Bundle-Rotation-Plan (siehe `PM-2026-05-20-05-F-12`).

---

### PM-2026-05-20-06-F-05 — Verfügbarkeits-/Latenz-Kollaps auf Mobile

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
mitigation_summary: "Validator-Pool überdimensioniert (10 angefragt, 5 reichen); Timeout 60s; Mobile-Opt-Out per Default"
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

**Hypothese.** Mobile-Validatoren sind unzuverlässig: Tab geschlossen, Battery-Saver, schwaches Netz. Quorum wird nie erreicht; jedes Match fällt auf Server-Fallback zurück — BYOC spart nichts.

**Mitigation.**
1. Validator-Pool überdimensioniert: 10 angefragt, 5 reichen für Quorum.
2. Timeout: 60 s pro Validator; danach Server-Fallback.
3. Mobile per Default *Opt-Out* von Validator-Aufgaben; Desktop per Default *Opt-In*.
4. User-Toggle ”žValidator nur bei WLAN + Charger".
5. SLO Server-Fallback-Rate ≤ 5 % — wenn überschritten, BYOC pausieren und Pool vergrößern.

---

### PM-2026-05-20-06-F-06 — Privacy-Leak: Validator sieht fremde Tactic

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
mitigation_summary: "Validator empfängt Inputs erst NACH Kickoff-Commit; nach Match-Ende ist Tactic ohnehin im Report sichtbar"
linked_adrs: []
linked_specs: [[privacy-and-consent]]
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

**Hypothese.** Validator sieht die taktische Aufstellung eines anderen Spielers *vor* Match-Ende und kann die Information missbrauchen (Wetten? Spoilern?). Selbst wenn Match nur zwischen anderen Spielern läuft.

**Mitigation.**
1. Validator empfängt Inputs **erst nach Kickoff-Commit** (Commit-Reveal-Schema): vor Kickoff nur Hashes, nach Kickoff Klartext.
2. Nach Match-Ende ist Tactic ohnehin im Match-Report sichtbar (analog zum echten Fußball).
3. Zeitlich: Validator-Voting-Window beginnt nach simulierter Match-Endzeit, nicht vor.

**Restrisiko.** Validator hat Insider-Wissen 90 Min früher als Public-Spectator. Akzeptiert, weil Wett-/Spoiler-Markt nicht existiert.

---

### PM-2026-05-20-06-F-07 — Reputations- und Slashing-System dysfunktional

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
1. Klares Schema: konsistentes Voting +1, divergent ohne bekannten Engine-Bug -3, nicht-Voting bei Assignment -1, Engine-Hash-Mismatch → Reset auf 0 + 30-Tage-Sperre.
2. Periodischer Reset alle 90 Tage auf max(0, currentRep) — Gnade für Altfehler.
3. Appeal-Pfad: Spieler kann Validator-Sperre kontextualisieren (Support-Ticket); Operator-Override möglich.
4. Distribution-Monitor: wenn Reputation bimodal wird (alle bei +N oder alle bei -M), prüfen ob Schema-Bug.

---

### PM-2026-05-20-06-F-08 — DoS via Geräte-Erschöpfung (legal, aber giftig)

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

**Hypothese.** BYOC-Aufgaben verbrauchen Battery + Mobile-Daten. Spieler bemerken Lüfter, App-Reviews stürzen ab.

**Mitigation.**
1. Max 3 Validator-Aufgaben/Tag pro Spieler.
2. Mobile per Default Opt-Out, Desktop per Default Opt-In, User-Toggle.
3. Validator-Anfrage ist sichtbar im UI ("Möchtest du ein Match validieren? Dauert ~5 s, läuft im Hintergrund."), ablehnbar.
4. ”žWLAN-only" und ”žNur am Charger" als User-Settings.
5. App Store / Play Store Energie-Compliance prüfen.

---

### PM-2026-05-20-06-F-09 — DSGVO/Auftragsverarbeitung unklar

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
mitigation_summary: "DPIA vor Launch; explizites Validator-Opt-In; nicht für Minderjährige"
linked_adrs: []
linked_specs: [[gdpr-compliance]], [[../../30-Implementation/privacy-and-consent]]
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

**Hypothese.** Validator-Compute auf Spielergeräten verarbeitet Daten anderer Spieler (Lineup, Squad-State). Rechtsverhältnis: Auftragsverarbeitung-ähnlich. Ohne klare Dokumentation → Risiko bei DSGVO-Audit.

**Mitigation.**
1. **DPIA (Data Protection Impact Assessment)** vor BYOC-Launch.
2. **Explizites Validator-Opt-In** (separates Toggle, nicht Default).
3. **Minderjährige (16-) ausgeschlossen** vom Validator-Pool (auch wenn registriert).
4. **Datenschutzerklärung** aktualisiert: was passiert auf Validator-Devices, welche Daten, Speicherdauer (kurz, max. Match-Dauer), keine Weitergabe.

---

### PM-2026-05-20-06-F-10 — Wirtschaftlichkeit nicht gegeben

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
effort: —
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wir bauen BYOC aus architektonischem Interesse, sparen aber kein nennenswertes Geld — Engineering-Aufwand übersteigt Server-Einsparungen um Faktoren.

**Mitigation.** Decision-Gate (siehe §Decision-Gate). Wenn Server-Match-Compute < 500 €/Monat, **nicht** bauen.

## Quantitatives Modell

### Server-Compute-Einsparung

| DAU | Matches/Tag | Server-Sim-CPU (5 ms/Match) | Server-CPU-Sec/Tag | Monatliche CPU-Stunden |
|-----|-------------|------------------------------|----------------------|------------------------|
| 1.000 | 430 | 2,1 s | 64 | 0,5 h |
| 10.000 | 4.300 | 21 s | 645 | 5,4 h |
| 100.000 | 43.000 | 215 s | 6.450 | 54 h |
| 1.000.000 | 430.000 | 2.150 s | 64.500 | 537 h |

Bei AWS Fargate-Preisen (~0,05 $/vCPU-Stunde) ergibt das bei **10k DAU monatliche Match-Sim-Kosten von ~0,27 $**.

**Schlussfolgerung.** Bei 10k DAU ist BYOC wirtschaftlich nicht begründbar. Erst ab ~100k DAU werden monatliche Sim-Kosten relevant; ab ~1 Mio DAU richtig spürbar. **BYOC ist Future-Scope für 100k+ DAU-Szenario.**

### Engineering-Aufwand

Schätzung (sehr grob):
- Validator-Protokoll-Design + ADR: 2–3 Wochen.
- Server-Quorum-Logik + Fallback: 3–4 Wochen.
- Client-Validator-Worker + UI: 3–4 Wochen.
- Reputation-System + Sanctions: 2 Wochen.
- DPIA + Datenschutz-Update: 1–2 Wochen.
- Pen-Test extern für BYOC: 1 Woche.
- Load-Tests + Sybil-Sim + Collusion-Sim: 2 Wochen.

**Summe: ~14–18 Engineer-Wochen ≈ 3,5–4,5 Monate FTE.** Bei einem Engineer-Tagessatz von 600 € ≈ **42.000–54.000 €.**

**Break-Even (vereinfachend):** ab >50.000 €/Monat Server-Sim-Kosten amortisiert sich BYOC binnen Jahr. Das entspricht ~20 Mio DAU. Realistisch nie.

**Alternativ-Motivation.** BYOC kann gerechtfertigt sein für:
- Latenz-Reduktion (lokales Compute statt Round-Trip) — aber Latenz ist *schlechter*, siehe F-05.
- Community-Engagement (”žDu bist Teil der Liga-Infrastruktur") — Marketing-Wert schwer zu beziffern.
- Trust-Story (”žErgebnisse von Liga-Mitgliedern verifiziert") — Glaubwürdigkeit.

### Latenz-Modell

| Modus | P50 Match-Settle | P99 |
|-------|------------------|-----|
| Server-Sync | ~50 ms | ~500 ms |
| BYOC (Desktop, Browser-permitted) | ~3 s | ~30 s |
| BYOC (Mobile, Background) | ~10 s | ~60 s + Fallback |

**BYOC ist langsamer**, nicht schneller. Wenn Latenz das Argument war, ist es das falsche Argument.

## SLO-Vorschläge

| SLO | Ziel | Severity |
|-----|------|----------|
| Quorum-Reach-Rate | ≥ 99 % der BYOC-Matches erreichen Quorum in ≤ 90 s | S2 |
| Server-Fallback-Rate | ≤ 5 % | S2 (sonst BYOC pausieren) |
| Validator-Divergence-Rate | ≤ 0,1 % (außer bei Engine-Update-Tag) | S1 |
| Server-Stichprobenvalidierungs-Mismatch-Rate | 0 % | S1 |
| Mobile-Battery-Impact pro Validation | < 50 mAh @ Mid-Tier Android | S3 |

## Load-/Stress-Test-Plan

### Sybil-Sim
- 100 simulierte Accounts (gleiches Browser-FP, gleicher IP-Range) versuchen Validator-Status zu erlangen.
- Pass: ≤ 5 % gelangen in einen Pool; jene niemals als 3 Validatoren im selben Match.

### Collusion-Sim
- 3 befreundete Accounts gezielt mit hoher Reputation; Match wird beobachtet, ob Auswahl je 3-fach kommt.
- Pass: Wahrscheinlichkeit < 0,01 % über 10.000 Match-Sims.

### Mobile-Stress
- 50 echte Mobile-Devices (Android Mid-Tier) führen 100 Validation-Runs aus.
- Pass: kein Crash, P99 Wall-Time < 8 s, kein Tab-Killed-by-Browser.

### Adversarial-Validator
- Validator gibt absichtlich falsche Hashes ab.
- Pass: Quorum-Logik erkennt als Outlier; Reputation sinkt korrekt; nach 3 Vorfällen automatische Sperre.

### Engine-Update-Simulation
- Engine-Bundle-Hash wird kontrolliert geändert; manche Validatoren updaten sofort, andere nicht.
- Pass: Server akzeptiert nur whitelisted Hashes; alte Validatoren bekommen Update-Hint, keine Reputations-Sanction.

## Runbook-Skizzen

### RB-B1: Validator-Quorum kollabiert flächendeckend
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
2. **Action:** Migration-Plan, Reputation Reset auf max(0, currentRep) für alle.
3. **Comms:** Spieler-Update.

## Decision-Gate (vor Implementierung)

**BYOC wird nicht gebaut, bis alle vier Bedingungen erfüllt sind:**

1. **Compute-Kosten überschreiten Gate-Schwelle:** Server-Match-Compute > 500 €/Monat (entspricht ~50k DAU mit moderater Aktivität).
2. **Threat-Model-Review extern:** externe Security-Boutique signiert Threat-Modell ab.
3. **Baseline-Daten:** mindestens 1 Quartal Server-only-Betrieb in Production mit stabilem Determinism-CI-Gate, sodass ”žnormal divergence rate" bekannt ist.
4. **DPIA abgeschlossen:** Data Protection Impact Assessment für BYOC vorhanden, DSGVO-Compliance bestätigt.

**Anti-Bedingung (Show-Stopper):** wenn auch nur eine der vier nicht erfüllt → BYOC nicht bauen, Resource-Allocation in andere Wertschöpfung.

## Single-Player-Foundation-Check

Auch wenn BYOC nie gebaut wird, *bereiten* wir die Foundation:

- **Save-Schema enthält bereits `engine_bundle_hash`** (siehe `PM-2026-05-20-05-F-01`) — Re-Sim-fähigkeit ist da.
- **Match-Records enthalten bereits Command-Log + Seed + Lineup-Snapshot** — Re-Simulation ist mechanisch möglich.
- **Determinismus-CI-Gate** (siehe `PM-2026-05-20-05-F-03`) ist Voraussetzung — ohne Determinismus kein BYOC.

Diese Foundation kostet nichts extra (sie ist sowieso Security/Anti-Cheat-Foundation für MP), gewinnt aber: BYOC bleibt jederzeit *einschaltbar*, wenn DAU eines Tages 100k+ erreicht.

## Future-scope decisions (classified future-scope)

- **OQ-B-01.** Wenn Server-Fallback-Rate hoch ist (z. B. nachts mit wenig aktiven Validatoren), ist das schlimm? Akzeptables Worst-Case ist welcher Anteil?
- **OQ-B-02.** Reward-System für Validatoren? (Bonus-XP? Sichtbarkeit? Talent-Tree-Punkte?) — Risiko: über-incentiviert → Sybil-Pull.
- **OQ-B-03.** Wenn Validator selbst in einer Liga mit ähnlichem Match spielt, ist das ein Konflikt? (Probably ja → ausschließen.)
- **OQ-B-04.** WebGPU-Beschleunigung für Match-Sim auf Geräten? Wenn ja, ändert Determinismus-Garantie (GPU-Determinismus ist tricky).
- **OQ-B-05.** Validator-Telemetrie: was loggen wir, wie lange? Privacy-Bilanz.

## ”žWenn wir BYOC bauen, nur diese 3 Dinge"-Liste

1. **Cross-League-Validator-Pool als Fundament** — alles andere bricht ohne das.
2. **5 %-Server-Stichprobe parallel zur BYOC-Validierung** — kontinuierlicher Plausibility-Check ohne Compute-Vorteil aufzugeben.
3. **Decision-Gate ehrlich anwenden** — wenn die Server-Compute-Kosten und Liga-Größen es nicht rechtfertigen, **nicht** bauen, egal wie spannend die Architektur klingt.

## Verfolgung & Verkettung (Finding → Fix)

Jedes Finding hat eine immutable ID (`PM-2026-05-20-06-F-NN`). Da BYOC Future-Scope ist, sind Findings hier **vorerst `accepted-risk` und durch [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]] konzeptionell geschlossen** — sie werden aktiviert, sobald Decision-Gate erfüllt ist und Implementierung beginnt.

## Related

- [[00-index]] · [[findings-registry]] · [[threat-model]]
- [[PM-2026-05-20-01-architecture]] · [[PM-2026-05-20-02-tech-and-ops]] · [[PM-2026-05-20-03-gameplay]] · [[PM-2026-05-20-04-monetization]] · [[PM-2026-05-20-05-security-and-integrity]]
- [[../match-engine-runtime-strategy]] — Polyglot-Gate-Kontext für Match-Worker-Extraktion
- [[../determinism-and-replay]] — Determinismus als Validator-Foundation
- [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]] — Ergänzt, nicht ersetzt
- [[../../30-Implementation/privacy-and-consent]]
- [[../gdpr-compliance]]
- [[../../00-Index/Current-State]]
