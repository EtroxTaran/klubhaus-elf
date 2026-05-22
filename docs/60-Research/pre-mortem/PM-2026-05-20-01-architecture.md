---
title: "Pre-Mortem 2026-05-20 Â· 01 Â· Architecture"
status: current
tags: [research, pre-mortem, architecture, scalability, ddd, surrealdb, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-01
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[../wave-3-gap-analysis]]
  - [[../match-engine-runtime-strategy]]
  - [[../surrealdb-schema-patterns]]
  - [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[../../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  - [[../../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]]
  - [[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../../00-Index/Current-State]]
---

# Pre-Mortem 2026-05-20 Â· 01 Â· Architecture

> **Pre-Mortem-Hypothese (Failure-Headline):**
> "In sechs Monaten waren wir gescheitert, weil unsere Modular-Monolith-Grenzen erodiert sind, SurrealDB unter Last serialisierte und der Wochen-Tick zum Single-Point-of-Pain wurde â€” die Cloud-Migration kam zu spÃ¤t, und im single-node Hetzner-Setup war ein einziger RocksDB-Lock-Sturm tÃ¶dlich."

## Scope

Diese Pre-Mortem-Analyse untersucht die **Architektur-TragfÃ¤higkeit** fÃ¼r 10.000 registrierte Spieler (~2.500 DAU, ~300 CCU am Match-Tick) Ã¼ber zwei Szenarien:

- **Szenario A (Ist):** Single-node Hetzner via Dokploy, SurrealDB RocksDB, Redis ko-lokiert
- **Szenario B (Ziel):** Containerisiert auf Fly.io / ECS / Cloud Run mit horizontalem Autoscaling, managed Datastores, mehreren App-Instanzen

Jede Failure-Hypothese erhÃ¤lt eine immutable ID (`PM-2026-05-20-01-F-NN`) zur Verkettung mit Fixes (ADRs, PRs, Linear-Issues) â€” siehe `## Verfolgung & Verkettung` am Ende.

## Annahmen (Modellgrundlage)

| Parameter | Wert |
|---|---|
| Registrierte Spieler nach 6 Monaten | 10.000 |
| DAU/MAU 25 % | 2.500 DAU |
| Peak CCU (Sa Match-Tick) | 200â€“400 |
| Match-Sims/Tag | ~4.300 |
| Save-GrÃ¶ÃŸe Snapshot | 100â€“500 KB |
| Save-GrÃ¶ÃŸe Event-Log (Human-vs-Human Matches) | bis 5 MB / Saison |
| Match-Sim-Budget | â‰¤ 5 ms AI-vs-AI, â‰¤ 50 ms Live (`[[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]`) |

---

## Top Failure-Hypothesen

### PM-2026-05-20-01-F-01 â€” Bounded-Context-Erosion Ã¼ber impliziten In-Process-Bus

```yaml
id: PM-2026-05-20-01-F-01
domain: architecture
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - metric: "imports across context boundaries (madge)"
    threshold: ">0"
  - metric: "shared mutable lookup tables in surql schema"
    threshold: ">0"
mitigation_summary: "Boundary-Linting (madge/Biome) + Contract-Tests pro Context + ADR-0019-Append zu Bus-VertrÃ¤gen"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
linked_specs:
  - [[../../10-Architecture/bounded-context-map]]
linked_code:
  - "packages/"
  - "apps/web/src/"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: architecture
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Die 11 Bounded Contexts sind heute ein Modular-Monolith â€” die Kompilerwand existiert nur, wenn jemand sie zieht. Unter Time-Pressure (10k Spieler in 6 Monaten) wird ein Entwickler einen Cross-Context-Import abkÃ¼rzen, ein "shared" lookup table einfÃ¼hren, oder den In-Process-Bus mit synchronen Antworten missbrauchen. In Szenario B (Service-Extraktion) bricht dann genau dieser Pfad: er ist nicht JSON-serialisierbar oder hat impliziten gemeinsamen Zustand.

**FrÃ¼hwarnindikatoren.** madge-Reports zeigen Cross-Context-Cycles; SurrealDB-Schemas mit Tabellen, die von 2+ Contexts geschrieben werden; "shared/" Verzeichnisse mit Domain-Logik.

**Mitigation.**
1. CI-Check via `madge --circular --extensions ts packages/` und Biome-Boundary-Rule.
2. Contract-Tests pro Context (in `packages/<context>/contracts/`).
3. Quartals-Audit: jeder Context muss als eigener Service deploybar sein â€” Probe via Test-Build.

**Verifikation.** Test-Build extrahiert in CI mindestens einen Context als eigenen Worker â†’ wenn Build grÃ¼n, Boundary intakt.

---

### PM-2026-05-20-01-F-02 â€” SurrealDB Single-Node ist Single-Point-of-Failure und Skalierungs-Sackgasse

```yaml
id: PM-2026-05-20-01-F-02
domain: architecture
scenario: [single-node-hetzner]
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - metric: "surrealdb_query_duration_seconds_p99"
    threshold: ">500ms"
  - metric: "disk_io_wait_ratio"
    threshold: ">0.3"
  - metric: "active_db_connections"
    threshold: ">80% of pool"
mitigation_summary: "Read-Replica-Pfad + Postgres-Fallback-ADR + automatisierte Snapshots + DR-Drill"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
linked_specs:
  - [[../surrealdb-schema-patterns]]
linked_code:
  - "db/schema.surql"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** SurrealDB ist bei 10k Spielern noch nicht erprobt; RocksDB single-node hat keinen Failover, keine eingebaute Read-Replica, und Schema-Migrationen ohne Downtime sind nicht dokumentiert. Ein Disk-Voll-Event, Kernel-Update, oder Lock-Storm bringt das gesamte Spiel offline. Die `db:migrate`-Pipeline ist heute ein Placeholder (siehe `[[../wave-3-gap-analysis]]` Gap H4).

**FrÃ¼hwarnindikatoren.** Query-P99 > 500 ms, Disk-IO-Wait > 30 %, Lock-Wait-Time wachsend Woche Ã¼ber Woche.

**Mitigation.**
1. **Backup-Cadence:** StÃ¼ndliche Snapshots auf separates Storage, tÃ¤glicher Restore-Test (Gap H3).
2. **Migrations-Story:** Forward-only, online, `DEFINE â€¦ IF NOT EXISTS`-pattern + Outbox-replay nach Schema-Change (ADR-0013).
3. **Postgres-Fallback-ADR:** FrÃ¼hwarnschwelle definieren (z. B. P99 > 300 ms Ã¼ber 7 Tage) und Migrationspfad zu Postgres + Drizzle vorab ausarbeiten.
4. **DR-Drill** alle 60 Tage: vollstÃ¤ndige Wiederherstellung in unter 2 h aus Snapshot.

**Verifikation.** Chaos-Test: SurrealDB-Prozess hart killen, RTO messen. Pass: < 5 Min bis Service wieder up; RPO < 1 h.

---

### PM-2026-05-20-01-F-03 â€” WÃ¶chentlicher Tick als Donnerhall-Lastspitze ohne Batching

```yaml
id: PM-2026-05-20-01-F-03
domain: architecture
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 4
impact: 5
score: 20
confidence: medium
early_warning:
  - metric: "week_tick_duration_seconds"
    threshold: ">90s for 1k saves"
  - metric: "outbox_lag_seconds"
    threshold: ">30s"
mitigation_summary: "Chunked Week-Advance via Outbox + horizontale Worker + Idempotenz-Keys"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
linked_specs:
  - [[../../50-Game-Design/GD-0001-core-loop]]
linked_code:
  - "packages/match-engine/src/"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wenn 10k Saves quasi-gleichzeitig den Week-Tick triggern (z. B. nach 24h-Default oder via Notification-Push am Wochenende), lÃ¤uft alles Ã¼ber denselben SurrealDB-Lock-Bereich (League-Tabelle). Im Ist serialisiert das auf einer CPU; im Cloud-Setup ohne korrektes Sharding bricht die League-Konsistenz.

**FrÃ¼hwarnindikatoren.** Week-Tick > 90 s fÃ¼r 1k Saves; Outbox-Lag > 30 s.

**Mitigation.**
1. **Chunking:** Week-Advance in 50â€“100 Save-Chunks, persistiert via Outbox.
2. **Idempotenz-Keys:** `(save_id, week_id)` als Unique-Constraint â†’ Replays sind sicher.
3. **Horizontale Match-Worker:** Match-Sim aus dem Web-Prozess herausziehen (siehe `[[../match-engine-runtime-strategy]]` Polyglot-Gate).
4. **Backoff fÃ¼r AI-Ligen:** NPC-Ligen Ã¼ber 4â€“6 Stunden verteilt simulieren, nicht synchron.

**Verifikation.** Load-Test-Profil *â€žWeek Advance"* (siehe `## Load-Test-Plan`). Pass: Week-Tick < 60 s @ 1.000 Saves; linear bis 10k.

---

### PM-2026-05-20-01-F-04 â€” Match-Engine nicht in Web-Worker isoliert â†’ Main-Thread-Stalls

```yaml
id: PM-2026-05-20-01-F-04
domain: architecture
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "client_long_task_count"
    threshold: ">0 per match in median session"
  - metric: "server_match_sim_p95_ms"
    threshold: ">80ms"
mitigation_summary: "Web-Worker-Bridge + Match-Worker-Service (ADR-0003 Polyglot-Gate) + Browser-CPU-Budget-Tests"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
linked_specs:
  - [[../match-engine-runtime-strategy]]
  - [[../performance-budgets]]
linked_code:
  - "packages/match-engine/src/"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend+backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Die Match-Engine ist *als Bibliothek* deterministisch und framework-agnostisch (gut), aber wer sie aufruft, entscheidet Ã¼ber Stalls. Wird sie im Main-Thread aus React heraus aufgerufen, friert das UI fÃ¼r 50+ ms ein und WCAG-Latenzziele kippen. Serverseitig blockiert sie den Node-Event-Loop fÃ¼r andere Requests.

**FrÃ¼hwarnindikatoren.** Lighthouse meldet Long-Tasks > 50 ms; Server-P95 Match-Sim > 80 ms.

**Mitigation.**
1. **Client:** Web-Worker-Bridge ab Tag 1 (Gap E13).
2. **Server:** Match-Sim in Worker-Pool (Node `worker_threads`) â€” kein Sync-Aufruf aus Request-Handlern.
3. **CPU-Budget-Test im CI:** 200 Matches sequentiell, Budget enforced.

**Verifikation.** Lighthouse-CI Mobile-Profile zeigt 0 Long-Tasks > 50 ms wÃ¤hrend einer Match-Wiedergabe.

---

### PM-2026-05-20-01-F-05 â€” Spectator-Snapshot-Streaming als unkontrollierter Fan-Out

```yaml
id: PM-2026-05-20-01-F-05
domain: architecture
scenario: [cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: low
early_warning:
  - metric: "ws_connections_per_match"
    threshold: ">100"
  - metric: "egress_bytes_per_match"
    threshold: ">5MB"
mitigation_summary: "Snapshot-Komprimierung + Throttle + Read-Through-Cache + WebSocket-Gateway"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]]
linked_specs:
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
linked_code: []
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Watch-Party / Spectator (ADR-0015) ist post-MVP, aber wenn frÃ¼h eingeschaltet (Marketing-Trigger), explodiert WebSocket-Fan-Out. Ohne Gateway / Throttle steigt Egress + Connection-Count linear mit Spectators, und der App-Server Ã¼bertrÃ¤gt NÂ²-Updates.

**Mitigation.**
1. Spectator-Updates via geteilten Snapshot (Pub/Sub) â€” *nicht* per Connection rendern.
2. Komprimierte Diffs (Î” vs Snapshot), maximal 1 Update/Sekunde.
3. Hard-Cap: Spectators pro Match â‰¤ 100 im MVP, transparent kommuniziert.

**Verifikation.** Load-Test mit 200 Spectators pro Match â†’ Egress < 5 MB total fÃ¼r 90-Min-Spiel.

---

### PM-2026-05-20-01-F-06 â€” Schema-Migration ohne Downtime nicht designed

```yaml
id: PM-2026-05-20-01-F-06
domain: architecture
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "db/schema.surql change without migration script"
    threshold: ">0 in PR diff"
  - metric: "manual SQL in production"
    threshold: ">0 events"
mitigation_summary: "Migration-Framework (forward-only, IF NOT EXISTS), CI-Lint, blue/green Schema-Strategie"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
linked_specs:
  - [[../surrealdb-schema-patterns]]
linked_code:
  - "db/schema.surql"
  - "scripts/db-migrate-placeholder.mjs"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** `pnpm db:migrate` ist heute Placeholder. Der erste echte Breaking-Schema-Change im laufenden Betrieb wird zur 3-Stunden-Downtime â€” und 10k Spieler bekommen einen Wartungsbildschirm zur Prime-Time.

**Mitigation.**
1. Migrations-Runner mit Forward-only-Semantik + Idempotenz.
2. Lint: jede PR die `db/schema.surql` Ã¤ndert, muss eine Migration enthalten.
3. Blue/green-Pattern: Schema-Erweiterungen (Add-Column) gehen ohne Downtime, Renames laufen in zwei Schritten (add new, dual-write, drop old).

**Verifikation.** Mock-Migration in Staging mit 100k DatensÃ¤tzen: Downtime = 0, App-Antworten bleiben innerhalb SLO.

---

### PM-2026-05-20-01-F-07 â€” Session-Store Konsistenz und Cross-Instance-Affinity

```yaml
id: PM-2026-05-20-01-F-07
domain: architecture
scenario: [cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "session_validation_p99_ms"
    threshold: ">100ms"
  - metric: "session_reuse_detection_false_positives_per_day"
    threshold: ">5"
mitigation_summary: "Redis Cluster + opaque Session-IDs + Sticky-Routing nur wo nÃ¶tig + Reuse-Detection-Tuning"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
linked_specs:
  - [[../../30-Implementation/session-management]]
  - [[../../30-Implementation/auth-flows]]
linked_code: []
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** In Szenario B (multi-instance) muss jeder App-Pod auf den gleichen Session-Store schauen; Redis-Cluster-Failover oder Eviction fÃ¼hrt zu spurios Logouts. Reuse-Detection mit zu engen Schwellen lÃ¶st legitime Multi-Tab-Nutzer aus.

**Mitigation.** Cluster + Tuning + Test-Suite fÃ¼r Reuse-Edge-Cases (Multi-Tab, mobiles Netz).

**Verifikation.** Soak-Test: 200 CCU, 12h, kein unbeabsichtigtes Logout, kein Reuse-False-Positive.

---

### PM-2026-05-20-01-F-08 â€” Multi-Region-Latenz wird zur SpielqualitÃ¤t

```yaml
id: PM-2026-05-20-01-F-08
domain: architecture
scenario: [single-node-hetzner]
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "p99_command_latency_by_country_ms"
    threshold: ">800ms for >5% of DAU"
mitigation_summary: "CDN fÃ¼r statische Assets + Region-Selektion bei Cloud-Migration + ehrliche Kommunikation"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Single-node Hetzner (Falkenstein/NÃ¼rnberg) bedeutet 200â€“400 ms RTT fÃ¼r Spieler in NA / APAC. Match-Tick-Aktionen fÃ¼hlen sich trÃ¤ge an; Manager-Spiel toleriert das, aber Negative-Reviews mit "feels laggy" sind mÃ¶glich.

**Mitigation.** CDN fÃ¼r Assets (Cloudflare); Cloud-Region-Strategie in `arc42-07-deployment` festhalten; Marketing in der MVP-Phase auf EU/DACH fokussieren.

---

### PM-2026-05-20-01-F-09 â€” Outbox als kritischer Pfad, aber ohne Beobachtbarkeit

```yaml
id: PM-2026-05-20-01-F-09
domain: architecture
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "outbox_pending_events"
    threshold: ">1000"
  - metric: "outbox_oldest_event_age_seconds"
    threshold: ">300"
mitigation_summary: "Dashboards + Alerts vor Outbox-Implementierung + Dead-Letter-Pfad + Replay-Tool"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  - [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** ADR-0013 ist accepted, aber Outbox ist nur so gut wie ihre Beobachtbarkeit. Wenn ein Event-Konsument hÃ¤ngt und keiner es merkt, akkumulieren Events lautlos, bis die DB voll ist.

**Mitigation.** Outbox-Dashboards bevor erste Outbox-Tabelle in Prod geht. Dead-Letter-Queue. Manuelles Replay-Tool dokumentiert.

---

### PM-2026-05-20-01-F-10 â€” Match-Engine-Storage-Wachstum unterschÃ¤tzt

```yaml
id: PM-2026-05-20-01-F-10
domain: architecture
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 3
impact: 3
score: 9
confidence: low
early_warning:
  - metric: "db_storage_growth_gb_per_week"
    threshold: ">20GB/week"
mitigation_summary: "Hot/Cold-Tiering: nur Snapshot heiÃŸ, Event-Log nach 30 Tagen kalt; Replay-on-Demand"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
  - [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Bei 10k Spielern Ã— 3 Matches/Woche Ã— ~2 MB Event-Log (Human-Matches) â‰ˆ 60 GB/Woche. In 6 Monaten = 1,5 TB. RocksDB-Compaction auf single-node wird teuer; Backups dauern Stunden.

**Mitigation.** Hot/Cold-Tiering, S3-kompatibler Cold-Storage, Replay-on-Demand-Tool, Retention-Policy.

---

## Quantitatives Modell

### Kompute-Bedarf (Szenario A â€” single-node)

| DAU | CCU @ Match-Tick | Match-Sim/s | Cores nÃ¶tig (Server) | RAM | Verdikt |
|---|---|---|---|---|---|
| 1.000 | 80 | 12 | 1 | 4 GB | OK |
| 2.500 | 200 | 30 | 2 | 8 GB | OK auf CCX23 (~30 â‚¬/Monat) |
| 10.000 (registriert) â‡’ 2.500 DAU | 200â€“400 | 30â€“60 | 3â€“4 | 16 GB | **Engpass:** Match-Tick + Week-Advance auf gleicher Box |

Hetzner CCX33 (8 vCPU, 32 GB, ~70 â‚¬/Monat) erlaubt die Last *technisch*, aber **keine Redundanz**: jede Wartung = Downtime.

### Kompute-Bedarf (Szenario B â€” autoscaling)

| Komponente | Provider | GrÃ¶ÃŸe | Kosten/Monat |
|---|---|---|---|
| App (Web + API) | Fly.io | 3Ã— shared-cpu-2x (1 GB) â‰ˆ Autoscale 1â€“6 | 30â€“90 $ |
| Match-Worker | Fly.io | 2Ã— perf-cpu-2x (4 GB) â‰ˆ Autoscale 1â€“4 | 60â€“180 $ |
| SurrealDB â†’ Postgres-Fallback | Neon/Supabase | 8 GB, 4 vCPU | 60â€“120 $ |
| Redis | Upstash | 1 GB persistent | 20 $ |
| Object Storage (Cold Match-Logs) | S3/R2 | 2 TB | 30â€“40 $ |
| Egress | â€” | 200 GB | 0â€“30 $ |
| **Summe** | | | **~200â€“500 $/Monat bei 10k Spielern** |

### Storage-Wachstum

```
Save-Snapshots:   10k Ã— 300 KB Ã— 52 Wochen = ~150 GB/Jahr
Match-Event-Logs: 10k Ã— 3 Ã— 2 MB Ã— 52 = ~3 TB/Jahr (heiÃŸ, brauchen Tiering)
Outbox:           ~5 GB/Woche bei 10k Spielern (gemessen 0,5 KB/Event)
```

â‡’ **Tiering ab Monat 3 unverhandelbar.**

---

## SLO-VorschlÃ¤ge

| Indikator | Ziel-SLO | BegrÃ¼ndung |
|---|---|---|
| App-VerfÃ¼gbarkeit | 99,5 % MVP â†’ 99,9 % nach 90 Tagen | ~3,6 h Downtime/Monat â†’ ~43 Min |
| Command-API P99 | < 500 ms | UI-ReaktionsgefÃ¼hl |
| Match-Sim-Durchsatz | â‰¥ 50/s/Instanz | fÃ¼r 10k Saves Ã— 3/Woche |
| Save-Loss-Rate | 0 | jeder Verlust = Sev-1 |
| Week-Tick-Latenz | < 60 s @ 1k Saves | sonst kaskadiert auf Saturday |
| Outbox-Lag P99 | < 30 s | sonst lÃ¤uft Event-Stream voll |

---

## Load-/Stress-Test-Plan

### Profil *â€žSaturday Match Tick"*
- **Last:** 400 CCU Ã¼ber 2 h, jeder Client triggert Match-Sim + Read-Heavy-Queries.
- **Tool:** k6 mit benutzerdefiniertem Protokoll, das echte Commands feuert.
- **Pass-Kriterium:** P99 Command < 800 ms, Match-Sim â‰¥ 50/s, kein 5xx > 0,1 %.

### Profil *â€žWeek Advance"*
- **Last:** 1.000 simulierte Saves fÃ¼hren Week-Tick simultan aus.
- **Pass-Kriterium:** Week-Tick < 60 s; Outbox-Lag < 30 s; keine Locks > 200 ms.

### Profil *â€žDB Failover"*
- **Last:** Mid-Test SurrealDB-Prozess killen, Wiederanlauf aus Snapshot.
- **Pass-Kriterium:** RTO < 5 Min; RPO < 1 h; 0 Save-Loss in der Test-Population.

### Profil *â€žSoak"*
- **Last:** 200 CCU Ã¼ber 12 h.
- **Pass-Kriterium:** Kein P99-Drift > 20 %, kein OOM, Outbox stabil.

---

## Runbook-Skizzen

### RB-A1: SurrealDB unresponsive (Lock-Storm oder Compaction)
1. **Detect:** Alert "surrealdb_query_p99 > 1s for 5 min".
2. **Triage:** SSH, `surreal sql --pretty "INFO FOR KV"`, Active Connections zÃ¤hlen.
3. **Quick Win:** Idle Sessions killen, Outbox-Worker pausieren.
4. **Fallback:** Read-Only-Modus aktivieren (Feature-Flag), bis Compaction durch.
5. **Postmortem:** binnen 48 h, Finding-Update mit `resolved_by`.

### RB-A2: Week-Tick blockiert die App
1. **Detect:** `week_tick_duration_seconds > 90s`.
2. **Action:** Tick-Worker auf nÃ¤chste Instanz failovern; Chunks halbieren.
3. **Comms:** Status-Page-Eintrag "WochenÃ¼bergang verzÃ¶gert".
4. **Followup:** Chunk-Size in Config persistieren.

### RB-A3: App-Instanz OOM
1. **Detect:** Container-Restart-Count > 0.
2. **Action:** Stack-Trace aus Loki ziehen, GC-Logs prÃ¼fen.
3. **Mitigation:** Memory-Limit anheben (temp), Heap-Dump fÃ¼r Postmortem.

---

## Future-scope decisions (classified future-scope)

1. **DB-Strategie:** SurrealDB beibehalten oder Postgres-Fallback aktivieren? Entscheidung bis Monat 2 vor Launch.
2. **Cloud-Provider:** Fly.io vs AWS vs GCP â€” Lock-In, Region-Coverage, Kosten.
3. **Match-Worker:** Wann Polyglot-Gate auslÃ¶sen (Rust)? Welche Metrik triggert?
4. **Spectator-Streaming:** MVP oder echt post-MVP?
5. **Multi-Region:** wann CDN, wann Multi-Region-Deployment?

---

## â€žWenn-wir-nur-3-Dinge-tun"-Liste

1. **Migrations-Framework bauen** â€” `pnpm db:migrate` ist heute Placeholder, das ist Architektur-Risiko Nr. 1.
2. **Outbox + Dashboards live nehmen** â€” bevor irgendein Feature darauf baut.
3. **Load-Test-Profil â€žWeek Advance" automatisieren** â€” als CI-Gate vor jedem Release-Tag.

---

## Verfolgung & Verkettung (Finding â†’ Fix)

Jedes Finding in diesem Report hat eine immutable ID (`PM-2026-05-20-01-F-NN`).

- **Im Code:** Commit-Messages und PR-Bodies referenzieren als `Addresses PM-2026-05-20-01-F-NN` (analog `Fixes #123`).
- **Im Vault:** ADRs, die als Antwort entstehen, tragen Frontmatter `addresses: [PM-2026-05-20-01-F-NN]`.
- **In Linear:** Tickets verlinken Finding-IDs im Beschreibungs-Header.
- **Status-ÃœbergÃ¤nge:** `open â†’ mitigating â†’ mitigated â†’ verified` (verifiziert durch Test/Load-Test/Audit).
- **Aggregat-Ãœbersicht:** [[findings-registry]] zeigt Status aller Findings Ã¼ber alle Reports hinweg.

## Iteration 2 Addendum (2026-05-20) â€” Security & Single-Player-Foundation

> ErgÃ¤nzt diesen Architektur-Report um Security-Tamper-Findings und einen Single-Player-Foundation-Check. Querverweise: [[threat-model]], [[PM-2026-05-20-05-security-and-integrity]], [[PM-2026-05-20-06-distributed-match-compute]].

### Security & Tamper-Resistance (Architecture)

- **Bounded-Context-Grenzen als Trust-Boundaries.** Jeder Context-Ãœbergang in Z1 fÃ¼hrt einen Authorization-Check und Input-Validation-Schritt â€” sonst wird ein kompromittierter Context zum Lateral-Movement-Vektor. Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-06|05-F-06]].
- **Command-Bus-Signing.** Commands aus Z2 (Client) tragen `(payload, nonce, deviceKey, signature)`; Server lehnt unsignierte oder replay'te Commands ab. Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02|05-F-02]].
- **Outbox-Idempotenz.** Jeder Command hat client-erzeugte `commandId` (UUIDv7); Server speichert verarbeitete IDs 30 Tage. SchÃ¼tzt vor Double-Spend bei Retries und Replay aus DevTools.
- **State-Hashing.** Nach jedem Command wird `state.merkleRoot` aktualisiert und im Audit-Log mitgefÃ¼hrt â€” Forensik wird trivial.
- **Match-Worker-Extraktion (Future).** Falls Polyglot-Gate (Rust) gezogen wird: Worker bekommt Server-State *nur* via signierte Tickets. Extraktion ist sonst Vertrauens-Downgrade.
- **BYOC-Eintrittspunkt.** Falls je BYOC kommt, *einziger* Eintrittspunkt ist der dedizierte Match-Validation-Endpoint. Bounded Contexts bleiben verschlossen. Cross-Ref: [[PM-2026-05-20-06-distributed-match-compute|Report 06]].

### Single-Player-Foundation-Check (Architecture)

- **Commands-im-SP-Modus.** Auch im Offline-SP wird jeder Command als signierte Struktur gespeichert â€” Voraussetzung fÃ¼r spÃ¤teres Cloud-Verify, Achievements, BYOC. Keine â€žDirect-State-Mutations" als Convenience.
- **Save-Format-Invariante.** SP-Save = MP-Save (gleiches Schema, gleiche Signatur-Pflicht, gleicher Merkle-Root). Unterschied nur im `trust_level`-Feld. Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01|05-F-01]] und Â§Save-Format-Vorschlag (Schema v2).
- **Bounded-Context-Boundaries gelten auch SP.** Selbst lokal trennt die Architektur Contexts â€” sonst gewinnen wir die DDD-ErtrÃ¤ge nicht, wenn wir spÃ¤ter Multi-Player skalieren.

---

## Related

- [[00-index]] â€” Pre-Mortem-Cluster-Hub mit Heatmap und Cross-Cutting-Risks
- [[findings-registry]] â€” Status-Tracking fÃ¼r alle Findings
- [[threat-model]] â€” Trust-Boundaries und STRIDE-Matrix
- [[PM-2026-05-20-02-tech-and-ops]] â€” Technische und operative Sicht (Cross-Cutting)
- [[PM-2026-05-20-03-gameplay]] â€” Gameplay-Auswirkungen architektonischer Entscheidungen
- [[PM-2026-05-20-04-monetization]] â€” Kosten-Implikationen pro Szenario
- [[PM-2026-05-20-05-security-and-integrity]] â€” Security-Querschnitt
- [[PM-2026-05-20-06-distributed-match-compute]] â€” BYOC-Future-Scope
- [[../wave-3-gap-analysis]] â€” Quelle der P0/P1-Coverage
- [[../match-engine-runtime-strategy]] â€” Polyglot-Gate-Kontext
- [[../surrealdb-schema-patterns]]
- [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
- [[../../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
- [[../../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]]
- [[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
- [[../../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
- [[../../00-Index/Current-State]]
