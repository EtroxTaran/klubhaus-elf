---
title: "Pre-Mortem Threat Model — Trust Boundaries 2026-05-20"
status: current
tags: [research, pre-mortem, threat-model, security, trust-boundaries, stride, 2026-Q2]
created: 2026-05-20
updated: 2026-05-20
type: research
binding: false
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-01-architecture]]
  - [[PM-2026-05-20-02-tech-and-ops]]
  - [[PM-2026-05-20-03-gameplay]]
  - [[PM-2026-05-20-04-monetization]]
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[PM-2026-05-20-06-distributed-match-compute]]
  - [[../determinism-and-replay]]
  - [[../gdpr-compliance]]
  - [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[../../30-Implementation/auth-flows]]
  - [[../../30-Implementation/session-management]]
  - [[../../30-Implementation/rate-limiting-anti-abuse]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Threat Model — Trust Boundaries für Pre-Mortem 2026-05-20

> **Zweck.** Ein konsolidiertes Threat-Model, das alle sechs Pre-Mortem-Reports referenzieren. Definiert *Vertrauenszonen*, *Assets*, *Adversare*, *Trust-Boundaries* und liefert eine STRIDE-Matrix, gegen die jedes Finding gemappt wird. So bleibt Security im Wissensgraphen verbunden und nicht in vier Reports verteilt unsichtbar.
>
> **Status: draft.** Diese Note ist Intent-Layer und wird durch konkrete ADRs (`ADR-0026 Command Signing`, `ADR-0027 BYOC Quorum`, `ADR-0028 Save Trust Levels`) operationalisiert.

## Leitsatz

> Single-Player ist das Fundament, aber jedes Datenformat, jeder Command-Pfad und jede State-Übergangsfunktion wird so entworfen, dass sie auch unter dem strengeren Vertrauensmodell von async Multiplayer und (zukünftig) Distributed Match Compute (BYOC) trägt. Ein Stack mit zuschaltbarem Trust-Level — nicht zwei Stacks.

## Trust-Zonen

Von vertrauenswürdig (Z0) zu aktiv feindlich (Z5). Jeder Datenfluss über eine Zonengrenze ist eine **Trust-Boundary**, die kryptografisch oder durch Server-Validation abgesichert sein muss.

| Zone | Beispiele | Wer kontrolliert? | Vertrauenslevel |
|------|-----------|-------------------|-----------------|
| **Z0** Server-Kernel | Match-Engine-Worker, Outbox, SurrealDB, Audit-Log | Wir (Server-Code) | Voll vertraut |
| **Z1** Server-Edge | TanStack Start Routes, Auth-Gateway, Webhook-Receiver | Wir (validiert eingehende Inputs) | Vertraut nach Sanitisierung |
| **Z2** Eigener Client | PWA im Browser des authentifizierten Spielers | Spieler kann DevTools / Patch | Teilvertraut (sieht eigene Daten) |
| **Z3** Geräte-Storage | IndexedDB, Save-Files, lokale Drafts | Spieler hat Vollzugriff (Filesystem, devtools) | Nicht vertraut |
| **Z4** Fremde Clients | Andere Liga-Mitglieder als Validatoren (BYOC) | Potentielle Gegner | Nicht vertraut |
| **Z5** Öffentliches Internet | Save-Sharing, Foren, Discord, fremde URLs | Beliebig | Aktiv feindlich |

## Assets

Was kann ein Adversar gewinnen / wir verlieren?

| ID | Asset | Beschreibung |
|----|-------|-------------|
| A1 | Save-State | Vollständige Klub-Daten, Squad, Finanzen, Historie. |
| A2 | Match-Resultat | Tabelle, Trophies, Statistik. |
| A3 | Leaderboards / Hall of Fame | Globale & Liga-interne Bestenlisten. |
| A4 | Manager-Reputation | Status, Talent-Tree-Punkte, Achievements. |
| A5 | Account-Credentials | Passkey, Session, Recovery-Codes. |
| A6 | In-Game-Wallet | Post-MVP: Premium-Currency, Entitlements. |
| A7 | Determinismus-Garantie | Replay-Fähigkeit als Basis von Anti-Cheat. |
| A8 | PII (DSGVO) | Email, Hash-Identifier, IP-Adresse, Spieldaten. |
| A9 | Liga-Stand | Tabelle, Anstoßzeiten, Validator-Pool. |
| A10 | Engine-Bundle-Hash | Anti-Tamper-Anker; manipulierbar → Anti-Cheat kollabiert. |

## Adversare

| ID | Adversar | Motivation |
|----|----------|------------|
| ADV-1 | Single-Player-Selbstbetrüger | Achievements, Hall-of-Fame-Eintrag erschleichen. |
| ADV-2 | Async-MP-Cheater | Liga-Sieg, Prestige, kostenlose Carry-Slots. |
| ADV-3 | BYOC-Validator-Cheater (Future) | Eigenes Match-Resultat verfälschen, fremdes manipulieren. |
| ADV-4 | Save-Forger | Manipulierte Saves im Forum/Discord verbreiten. |
| ADV-5 | Account-Übernehmer | Premium-Käufe, Liga-Sabotage, Daten-Erpressung. |
| ADV-6 | Mass-Scraper / Bot-Netz | Account-Farming, Refund-Abuse, Marktforschung. |
| ADV-7 | Insider | Direkter DB-Zugang, Code-Commit-Rechte. |
| ADV-8 | DDoS / Marketing-Spike | Bewusste Last-Erzeugung oder versehentlicher Reddit-Hug-of-Death. |
| ADV-9 | Supply-Chain-Angreifer | npm-Dep oder Container-Base-Image kompromittieren. |
| ADV-10 | Behörden / Rechtsanspruch | DSGVO-Auskunft, BfDI-Anfrage, Strafverfolgung. |

## Trust-Level pro Spielmodus

| Modus | Save-Quelle | Effektives Trust-Level | Konsequenz |
|-------|-------------|------------------------|------------|
| Singleplayer offline | Z3 lokales Save | Z2 zählt, Z3 nicht | Tampering möglich, nur lokale Achievements. Cloud-Sync = `unverified`. |
| Singleplayer cloud-sync | Z3 → Z1 | Server validiert via Replay | Nur replizierbare Saves → `verified`-Badge. |
| Async MP private group | Z2 ←” Z1 ←” Z2 | Server-authoritative (ADR-0011) | Commands signiert, Replay-Protection, Server-Re-Sim. |
| BYOC distributed (Future) | Z4 ←” Z4 ←” Z1 | Quorum-validiert + Server-Fallback | Multi-Validator Re-Sim + 5 % Server-Stichprobe. |
| Save-Import (Community) | Z5 → Z2 → optional Z1 | Schema-validiert; nur Server-Replay → `verified` | ”žVerified" nur mit vollständigem Command-Log. |

## STRIDE × Trust-Boundary (Matrix)

Zellen: âœ… = mitigiert mit Verweis · âš ï¸ = teilweise · X = unmitigated-at-report-time · — = nicht anwendbar. Volle Verweise stehen in den Findings.

| Boundary | Spoof | Tamper | Repudiation | Info-Disc | DoS | Eskalation |
|----------|-------|--------|-------------|-----------|-----|------------|
| Z5→Z2 (Save-Import) | âš ï¸ Schema-Validate · [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-04\|05-F-04]] | âš ï¸ HMAC fehlt heute · [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01\|05-F-01]] | — | âš ï¸ Save kann PII enthalten · [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-09\|05-F-09]] | âš ï¸ Size-Limit erforderlich · 05-F-04 | âš ï¸ Prototype-Pollution-Härtung · 05-F-04 |
| Z2→Z1 (Commands) | âŒ Heute nicht signiert · [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02\|05-F-02]] | âŒ Replay möglich · 05-F-02 | âŒ Audit-Log incomplete · 05-F-08 | âœ… TLS · `auth-flows` | âš ï¸ Rate-Limits · `rate-limiting-anti-abuse` | âš ï¸ Authorization-Check · 05-F-06 |
| Z3→Z2 (lokales Save laden) | — | âš ï¸ AES-GCM ohne Server-HMAC · 05-F-01 | — | — | — | — |
| Z1→Z0 (Context-Bus) | — | âš ï¸ In-Process-Bus · [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-01\|01-F-01]] | âœ… Outbox-Audit · [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-09\|01-F-09]] | — | âš ï¸ Lock-Contention · 01-F-02 | âš ï¸ Bounded-Context-Authz · 05-F-06 |
| Z4→Z1 (BYOC-Validator-Vote) | âš ï¸ Future · [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-01\|06-F-01]] | âš ï¸ Future · 06-F-04 | âš ï¸ Future · 06-F-07 | âš ï¸ Tactic-Leak · 06-F-06 | âš ï¸ Geräte-Erschöpfung · 06-F-08 | âš ï¸ Engine-Patch · 06-F-04 |
| Z2→Z2 (Save-Sharing) | — | âš ï¸ Signatur fehlt · 05-F-01 | — | âš ï¸ PII im Save · 05-F-09 | — | — |
| Server→Player-Device (Notification) | âœ… Server-signed | — | — | âœ… TLS | — | — |

Vollständige Matrix mit Status-Vermerken liegt im [[PM-2026-05-20-05-security-and-integrity|Security & Integrity Report]] §3.

## Kryptografie-Bausteine (Empfehlungen)

| Baustein | Zweck | Wo |
|----------|-------|-----|
| **Ed25519** (WebAuthn-abgeleitet oder generiert + server-registriert) | Device-Identity, Signatur von Commands, Save-Exports, Validator-Votes | Z2, Z4 |
| **HMAC-SHA-256** (Server-Schlüssel) | Save-Integrity (Server-Gegenzeichnung); zusätzlich zu AES-256-GCM-Envelope | Z1 schreibt, Z2/Z3 prüft |
| **AES-256-GCM** | Save-Envelope-Verschlüsselung (ADR-0005) — schützt Schlüssel-Kenntnis, **nicht** Herkunft | Z3 |
| **BLAKE3** | Merkle-Root über Event-Log; Engine-Bundle-Hash | Z0, Z1, Z2 |
| **PCG32 + Seed-Pinning** (ADR-0003) | Determinismus = Anti-Cheat-Foundation | Z0, Z2 (Replay), Z4 (Validator) |
| **Commit-Reveal-Schema** | Tactics committen vor Kickoff (Future BYOC) | Z2 → Z1 → Z4 |
| **UUIDv7 Command-IDs + Nonce-Window** | Idempotenz, Replay-Protection | Z2 → Z1 |

## Frühwarnsignale (Detection-Layer)

Aufgenommen in Loki-Stream `stream=audit` und `stream=auth`, mit Grafana-Alerts:

- `cmd_signature_invalid_total` > 1 % aller Commands → Token-Compromise oder Bug.
- `cmd_nonce_replay_total` > 0 → Replay-Angriff.
- `save_import_schema_mismatch_total` Spike → Forger-Tool kursiert.
- `engine_bundle_hash_mismatch_total` > 0 (vor Engine-Update) → Engine-Patch im Umlauf.
- `validator_divergence_total` > 0,1 % (Future BYOC) → Tampering oder Engine-Bug.
- `match_resim_mismatch_total` > 0 → Determinismus-Drift, sofort Severity-1.
- `auth_token_reuse_detected_total` > 0 → Refresh-Family-Compromise.
- `dsar_export_with_pii_in_logs_total` > 0 → Privacy-Compliance-Bug.

## Relation zu existierenden Specs

- **Erweitert** (nicht ersetzt):
  - [[../../10-Architecture/09-Decisions/ADR-0005-save-format]] — Envelope ist gut, fehlt Server-HMAC für `trust_level`.
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]] — Bleibt MVP-Default; BYOC-Future-Scope steht außerhalb.
  - [[../../30-Implementation/auth-flows]], [[../../30-Implementation/session-management]] — Verweisen auf Threat-Model.
  - [[../../30-Implementation/rate-limiting-anti-abuse]] — Liefert Schwellen für Detection-Signale.
  - [[../../30-Implementation/privacy-and-consent]] — DSGVO-Kontext.
  - [[../determinism-and-replay]] — Determinismus als Anti-Cheat-Anker.
- **Liefert Input für** *neue* ADRs:
  - `ADR-0026 Command Signing & Replay Protection` (proposed)
  - `ADR-0027 BYOC Match Validation Quorum` (proposed, Future-Scope)
  - `ADR-0028 Save Import/Export Trust Levels` (proposed)

## Future-scope notes (classified future-scope)

- **OQ-TM-01.** Werden Passkey-Device-Keys direkt für Command-Signing wiederverwendet (Ergonomie) oder leiten wir App-spezifische Sub-Keys ab (Hygiene)?
- **OQ-TM-02.** Speichert der Server zu jedem Account die Liste seiner Device-Public-Keys? Wenn ja, Verteilungs-Größe bei 10k Accounts × 3 Devices = 30k Keys (~1 MB) — unproblematisch.
- **OQ-TM-03.** Verifiziert der Client serverseitige `CommandReceipt`s tatsächlich? Wenn nein: Server kann Commands ”žverlieren" und Spieler hat keinen Beweis.
- **OQ-TM-04.** Wie modellieren wir ”žAccount-Wechsel auf neuem Gerät" sodass das alte Gerät keine gefälschten Commands mehr senden kann? (Session-Revoke ist Pflichtschritt.)
- **OQ-TM-05.** Welche Loki-Felder dürfen unredigiert bleiben, welche müssen gehasht werden? Konkrete Allow-List statt Deny-List.

## Related

- [[00-index]] — Pre-Mortem-Cluster-Hub mit Heatmap und Cross-Cutting-Risks
- [[findings-registry]] — Status-Tracking für alle Findings
- [[PM-2026-05-20-01-architecture]] · [[PM-2026-05-20-02-tech-and-ops]] · [[PM-2026-05-20-03-gameplay]] · [[PM-2026-05-20-04-monetization]] · [[PM-2026-05-20-05-security-and-integrity]] · [[PM-2026-05-20-06-distributed-match-compute]]
- [[../determinism-and-replay]] — Replay als Anti-Cheat-Anker
- [[../gdpr-compliance]] — Privacy-Kontext
- [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
- [[../../30-Implementation/auth-flows]]
- [[../../30-Implementation/session-management]]
- [[../../30-Implementation/rate-limiting-anti-abuse]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../00-Index/Current-State]]
