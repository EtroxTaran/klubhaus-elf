---
title: "Pre-Mortem Threat Model â€” Trust Boundaries 2026-05-20"
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

# Threat Model â€” Trust Boundaries fÃ¼r Pre-Mortem 2026-05-20

> **Zweck.** Ein konsolidiertes Threat-Model, das alle sechs Pre-Mortem-Reports referenzieren. Definiert *Vertrauenszonen*, *Assets*, *Adversare*, *Trust-Boundaries* und liefert eine STRIDE-Matrix, gegen die jedes Finding gemappt wird. So bleibt Security im Wissensgraphen verbunden und nicht in vier Reports verteilt unsichtbar.
>
> **Status: draft.** Diese Note ist Intent-Layer und wird durch konkrete ADRs (`ADR-0026 Command Signing`, `ADR-0027 BYOC Quorum`, `ADR-0028 Save Trust Levels`) operationalisiert.

## Leitsatz

> Single-Player ist das Fundament, aber jedes Datenformat, jeder Command-Pfad und jede State-Ãœbergangsfunktion wird so entworfen, dass sie auch unter dem strengeren Vertrauensmodell von async Multiplayer und (zukÃ¼nftig) Distributed Match Compute (BYOC) trÃ¤gt. Ein Stack mit zuschaltbarem Trust-Level â€” nicht zwei Stacks.

## Trust-Zonen

Von vertrauenswÃ¼rdig (Z0) zu aktiv feindlich (Z5). Jeder Datenfluss Ã¼ber eine Zonengrenze ist eine **Trust-Boundary**, die kryptografisch oder durch Server-Validation abgesichert sein muss.

| Zone | Beispiele | Wer kontrolliert? | Vertrauenslevel |
|------|-----------|-------------------|-----------------|
| **Z0** Server-Kernel | Match-Engine-Worker, Outbox, SurrealDB, Audit-Log | Wir (Server-Code) | Voll vertraut |
| **Z1** Server-Edge | TanStack Start Routes, Auth-Gateway, Webhook-Receiver | Wir (validiert eingehende Inputs) | Vertraut nach Sanitisierung |
| **Z2** Eigener Client | PWA im Browser des authentifizierten Spielers | Spieler kann DevTools / Patch | Teilvertraut (sieht eigene Daten) |
| **Z3** GerÃ¤te-Storage | IndexedDB, Save-Files, lokale Drafts | Spieler hat Vollzugriff (Filesystem, devtools) | Nicht vertraut |
| **Z4** Fremde Clients | Andere Liga-Mitglieder als Validatoren (BYOC) | Potentielle Gegner | Nicht vertraut |
| **Z5** Ã–ffentliches Internet | Save-Sharing, Foren, Discord, fremde URLs | Beliebig | Aktiv feindlich |

## Assets

Was kann ein Adversar gewinnen / wir verlieren?

| ID | Asset | Beschreibung |
|----|-------|-------------|
| A1 | Save-State | VollstÃ¤ndige Klub-Daten, Squad, Finanzen, Historie. |
| A2 | Match-Resultat | Tabelle, Trophies, Statistik. |
| A3 | Leaderboards / Hall of Fame | Globale & Liga-interne Bestenlisten. |
| A4 | Manager-Reputation | Status, Talent-Tree-Punkte, Achievements. |
| A5 | Account-Credentials | Passkey, Session, Recovery-Codes. |
| A6 | In-Game-Wallet | Post-MVP: Premium-Currency, Entitlements. |
| A7 | Determinismus-Garantie | Replay-FÃ¤higkeit als Basis von Anti-Cheat. |
| A8 | PII (DSGVO) | Email, Hash-Identifier, IP-Adresse, Spieldaten. |
| A9 | Liga-Stand | Tabelle, AnstoÃŸzeiten, Validator-Pool. |
| A10 | Engine-Bundle-Hash | Anti-Tamper-Anker; manipulierbar â†’ Anti-Cheat kollabiert. |

## Adversare

| ID | Adversar | Motivation |
|----|----------|------------|
| ADV-1 | Single-Player-SelbstbetrÃ¼ger | Achievements, Hall-of-Fame-Eintrag erschleichen. |
| ADV-2 | Async-MP-Cheater | Liga-Sieg, Prestige, kostenlose Carry-Slots. |
| ADV-3 | BYOC-Validator-Cheater (Future) | Eigenes Match-Resultat verfÃ¤lschen, fremdes manipulieren. |
| ADV-4 | Save-Forger | Manipulierte Saves im Forum/Discord verbreiten. |
| ADV-5 | Account-Ãœbernehmer | Premium-KÃ¤ufe, Liga-Sabotage, Daten-Erpressung. |
| ADV-6 | Mass-Scraper / Bot-Netz | Account-Farming, Refund-Abuse, Marktforschung. |
| ADV-7 | Insider | Direkter DB-Zugang, Code-Commit-Rechte. |
| ADV-8 | DDoS / Marketing-Spike | Bewusste Last-Erzeugung oder versehentlicher Reddit-Hug-of-Death. |
| ADV-9 | Supply-Chain-Angreifer | npm-Dep oder Container-Base-Image kompromittieren. |
| ADV-10 | BehÃ¶rden / Rechtsanspruch | DSGVO-Auskunft, BfDI-Anfrage, Strafverfolgung. |

## Trust-Level pro Spielmodus

| Modus | Save-Quelle | Effektives Trust-Level | Konsequenz |
|-------|-------------|------------------------|------------|
| Singleplayer offline | Z3 lokales Save | Z2 zÃ¤hlt, Z3 nicht | Tampering mÃ¶glich, nur lokale Achievements. Cloud-Sync = `unverified`. |
| Singleplayer cloud-sync | Z3 â†’ Z1 | Server validiert via Replay | Nur replizierbare Saves â†’ `verified`-Badge. |
| Async MP private group | Z2 â†” Z1 â†” Z2 | Server-authoritative (ADR-0011) | Commands signiert, Replay-Protection, Server-Re-Sim. |
| BYOC distributed (Future) | Z4 â†” Z4 â†” Z1 | Quorum-validiert + Server-Fallback | Multi-Validator Re-Sim + 5 % Server-Stichprobe. |
| Save-Import (Community) | Z5 â†’ Z2 â†’ optional Z1 | Schema-validiert; nur Server-Replay â†’ `verified` | â€žVerified" nur mit vollstÃ¤ndigem Command-Log. |

## STRIDE Ã— Trust-Boundary (Matrix)

Zellen: âœ… = mitigiert mit Verweis Â· âš ï¸ = teilweise Â· X = unmitigated-at-report-time Â· â€” = nicht anwendbar. Volle Verweise stehen in den Findings.

| Boundary | Spoof | Tamper | Repudiation | Info-Disc | DoS | Eskalation |
|----------|-------|--------|-------------|-----------|-----|------------|
| Z5â†’Z2 (Save-Import) | âš ï¸ Schema-Validate Â· [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-04\|05-F-04]] | âš ï¸ HMAC fehlt heute Â· [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01\|05-F-01]] | â€” | âš ï¸ Save kann PII enthalten Â· [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-09\|05-F-09]] | âš ï¸ Size-Limit erforderlich Â· 05-F-04 | âš ï¸ Prototype-Pollution-HÃ¤rtung Â· 05-F-04 |
| Z2â†’Z1 (Commands) | âŒ Heute nicht signiert Â· [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02\|05-F-02]] | âŒ Replay mÃ¶glich Â· 05-F-02 | âŒ Audit-Log incomplete Â· 05-F-08 | âœ… TLS Â· `auth-flows` | âš ï¸ Rate-Limits Â· `rate-limiting-anti-abuse` | âš ï¸ Authorization-Check Â· 05-F-06 |
| Z3â†’Z2 (lokales Save laden) | â€” | âš ï¸ AES-GCM ohne Server-HMAC Â· 05-F-01 | â€” | â€” | â€” | â€” |
| Z1â†’Z0 (Context-Bus) | â€” | âš ï¸ In-Process-Bus Â· [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-01\|01-F-01]] | âœ… Outbox-Audit Â· [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-09\|01-F-09]] | â€” | âš ï¸ Lock-Contention Â· 01-F-02 | âš ï¸ Bounded-Context-Authz Â· 05-F-06 |
| Z4â†’Z1 (BYOC-Validator-Vote) | âš ï¸ Future Â· [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-01\|06-F-01]] | âš ï¸ Future Â· 06-F-04 | âš ï¸ Future Â· 06-F-07 | âš ï¸ Tactic-Leak Â· 06-F-06 | âš ï¸ GerÃ¤te-ErschÃ¶pfung Â· 06-F-08 | âš ï¸ Engine-Patch Â· 06-F-04 |
| Z2â†’Z2 (Save-Sharing) | â€” | âš ï¸ Signatur fehlt Â· 05-F-01 | â€” | âš ï¸ PII im Save Â· 05-F-09 | â€” | â€” |
| Serverâ†’Player-Device (Notification) | âœ… Server-signed | â€” | â€” | âœ… TLS | â€” | â€” |

VollstÃ¤ndige Matrix mit Status-Vermerken liegt im [[PM-2026-05-20-05-security-and-integrity|Security & Integrity Report]] Â§3.

## Kryptografie-Bausteine (Empfehlungen)

| Baustein | Zweck | Wo |
|----------|-------|-----|
| **Ed25519** (WebAuthn-abgeleitet oder generiert + server-registriert) | Device-Identity, Signatur von Commands, Save-Exports, Validator-Votes | Z2, Z4 |
| **HMAC-SHA-256** (Server-SchlÃ¼ssel) | Save-Integrity (Server-Gegenzeichnung); zusÃ¤tzlich zu AES-256-GCM-Envelope | Z1 schreibt, Z2/Z3 prÃ¼ft |
| **AES-256-GCM** | Save-Envelope-VerschlÃ¼sselung (ADR-0005) â€” schÃ¼tzt SchlÃ¼ssel-Kenntnis, **nicht** Herkunft | Z3 |
| **BLAKE3** | Merkle-Root Ã¼ber Event-Log; Engine-Bundle-Hash | Z0, Z1, Z2 |
| **PCG32 + Seed-Pinning** (ADR-0003) | Determinismus = Anti-Cheat-Foundation | Z0, Z2 (Replay), Z4 (Validator) |
| **Commit-Reveal-Schema** | Tactics committen vor Kickoff (Future BYOC) | Z2 â†’ Z1 â†’ Z4 |
| **UUIDv7 Command-IDs + Nonce-Window** | Idempotenz, Replay-Protection | Z2 â†’ Z1 |

## FrÃ¼hwarnsignale (Detection-Layer)

Aufgenommen in Loki-Stream `stream=audit` und `stream=auth`, mit Grafana-Alerts:

- `cmd_signature_invalid_total` > 1 % aller Commands â†’ Token-Compromise oder Bug.
- `cmd_nonce_replay_total` > 0 â†’ Replay-Angriff.
- `save_import_schema_mismatch_total` Spike â†’ Forger-Tool kursiert.
- `engine_bundle_hash_mismatch_total` > 0 (vor Engine-Update) â†’ Engine-Patch im Umlauf.
- `validator_divergence_total` > 0,1 % (Future BYOC) â†’ Tampering oder Engine-Bug.
- `match_resim_mismatch_total` > 0 â†’ Determinismus-Drift, sofort Severity-1.
- `auth_token_reuse_detected_total` > 0 â†’ Refresh-Family-Compromise.
- `dsar_export_with_pii_in_logs_total` > 0 â†’ Privacy-Compliance-Bug.

## Relation zu existierenden Specs

- **Erweitert** (nicht ersetzt):
  - [[../../10-Architecture/09-Decisions/ADR-0005-save-format]] â€” Envelope ist gut, fehlt Server-HMAC fÃ¼r `trust_level`.
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]] â€” Bleibt MVP-Default; BYOC-Future-Scope steht auÃŸerhalb.
  - [[../../30-Implementation/auth-flows]], [[../../30-Implementation/session-management]] â€” Verweisen auf Threat-Model.
  - [[../../30-Implementation/rate-limiting-anti-abuse]] â€” Liefert Schwellen fÃ¼r Detection-Signale.
  - [[../../30-Implementation/privacy-and-consent]] â€” DSGVO-Kontext.
  - [[../determinism-and-replay]] â€” Determinismus als Anti-Cheat-Anker.
- **Liefert Input fÃ¼r** *neue* ADRs:
  - `ADR-0026 Command Signing & Replay Protection` (proposed)
  - `ADR-0027 BYOC Match Validation Quorum` (proposed, Future-Scope)
  - `ADR-0028 Save Import/Export Trust Levels` (proposed)

## Future-scope notes (classified future-scope)

- **OQ-TM-01.** Werden Passkey-Device-Keys direkt fÃ¼r Command-Signing wiederverwendet (Ergonomie) oder leiten wir App-spezifische Sub-Keys ab (Hygiene)?
- **OQ-TM-02.** Speichert der Server zu jedem Account die Liste seiner Device-Public-Keys? Wenn ja, Verteilungs-GrÃ¶ÃŸe bei 10k Accounts Ã— 3 Devices = 30k Keys (~1 MB) â€” unproblematisch.
- **OQ-TM-03.** Verifiziert der Client serverseitige `CommandReceipt`s tatsÃ¤chlich? Wenn nein: Server kann Commands â€žverlieren" und Spieler hat keinen Beweis.
- **OQ-TM-04.** Wie modellieren wir â€žAccount-Wechsel auf neuem GerÃ¤t" sodass das alte GerÃ¤t keine gefÃ¤lschten Commands mehr senden kann? (Session-Revoke ist Pflichtschritt.)
- **OQ-TM-05.** Welche Loki-Felder dÃ¼rfen unredigiert bleiben, welche mÃ¼ssen gehasht werden? Konkrete Allow-List statt Deny-List.

## Related

- [[00-index]] â€” Pre-Mortem-Cluster-Hub mit Heatmap und Cross-Cutting-Risks
- [[findings-registry]] â€” Status-Tracking fÃ¼r alle Findings
- [[PM-2026-05-20-01-architecture]] Â· [[PM-2026-05-20-02-tech-and-ops]] Â· [[PM-2026-05-20-03-gameplay]] Â· [[PM-2026-05-20-04-monetization]] Â· [[PM-2026-05-20-05-security-and-integrity]] Â· [[PM-2026-05-20-06-distributed-match-compute]]
- [[../determinism-and-replay]] â€” Replay als Anti-Cheat-Anker
- [[../gdpr-compliance]] â€” Privacy-Kontext
- [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
- [[../../30-Implementation/auth-flows]]
- [[../../30-Implementation/session-management]]
- [[../../30-Implementation/rate-limiting-anti-abuse]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../00-Index/Current-State]]
