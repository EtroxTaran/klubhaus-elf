---
title: "Pre-Mortem Findings Registry"
status: current
tags: [research, pre-mortem, registry, tracking, 2026-Q2]
created: 2026-05-20
updated: 2026-05-20
type: registry
binding: false
report_set: 2026-05-20
related:
  - [[00-index]]
  - [[PM-2026-05-20-01-architecture]]
  - [[PM-2026-05-20-02-tech-and-ops]]
  - [[PM-2026-05-20-03-gameplay]]
  - [[PM-2026-05-20-04-monetization]]
  - [[../wave-3-gap-analysis]]
  - [[../../00-Index/Current-State]]
---

# Pre-Mortem Findings Registry — 2026-05-20

Aggregierte Status-Übersicht aller Findings aus dem Pre-Mortem-Cluster vom 2026-05-20. **Single Source of Truth** für "was ist noch offen, was wird gerade gefixt, was ist mitigiert".

## Verwendung

- Beim Eröffnen eines Fixes:
  1. Setze Finding-`status: mitigating` im Quell-Report.
  2. Trage Linear-Issue-ID in `linked_issues:` ein.
  3. Aktualisiere `updated:` auf das heutige Datum.
  4. Spiegele den Status hier in dieser Tabelle.
- Beim Mergen des Fix-PRs:
  1. Setze `status: mitigated`, trage PR-Nummer in `resolved_by:` ein.
  2. Wenn der Fix eine ADR/GDDR erzeugt hat → trage Frontmatter `addresses: [PM-2026-05-20-XX-F-NN]` dort ein.
- Bei Verifikation (Test/Load-Test/Audit):
  1. Setze `status: verified`.

**Status-Werte:** `open` · `mitigating` · `mitigated` · `verified` · `accepted-risk` · `obsolete`

## Übersicht nach Score

Sortiert nach **Risiko-Score (Probability × Impact)**, höchster zuerst.

| Finding | Domain | Score | Status | Owner | Linear / PR | Letzte Aktualisierung |
|---|---|---|---|---|---|---|
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02\|01-F-02 — SurrealDB Single-Node SPOF]] | architecture | 25 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-04\|02-F-04 — Backups nie restored]] | ops | 25 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-01\|04-F-01 — Keine Monetarisierungs-Hypothese]] | monetization | 25 | open | product | — | 2026-05-20 |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-03\|01-F-03 — Week-Tick-Lastspitze ohne Batching]] | architecture | 20 | open | backend | — | 2026-05-20 |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-06\|01-F-06 — Schema-Migration ohne Downtime nicht designed]] | architecture | 20 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-02\|02-F-02 — Determinismus-Drift unentdeckt]] | tech | 20 | open | backend | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-03\|02-F-03 — Observability ohne Dashboards/Alerts]] | ops | 20 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-01\|03-F-01 — Match-Engine-Varianz zu niedrig]] | gameplay | 20 | open | game-design+backend | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-02\|03-F-02 — Determinismus-Drift sichtbar bei Replays]] | gameplay | 20 | open | backend | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-03\|03-F-03 — Onboarding 60s-Spec vs Realität]] | gameplay | 20 | open | design+frontend | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-02\|04-F-02 — Kein Product-Analytics]] | monetization | 20 | open | data+platform | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-07\|04-F-07 — Retention-Loop fehlt]] | monetization | 20 | open | product+marketing | — | 2026-05-20 |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-01\|01-F-01 — Bounded-Context-Erosion]] | architecture | 16 | open | architecture | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-01\|02-F-01 — TanStack Start Beta-Bruch]] | tech | 16 | open | frontend | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-10\|02-F-10 — Incident-Response nur auf Papier]] | ops | 16 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-04\|03-F-04 — Insolvency-Spiral unverständlich]] | gameplay | 16 | open | design | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-04\|04-F-04 — Kein Soft-Launch / Beta]] | monetization | 16 | open | product+marketing | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-06\|02-F-06 — Auth/Recovery-Lücken nicht code-vollständig]] | security | 15 | open | backend+security | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-06\|04-F-06 — DSGVO/Verbraucherschutz beim Bezahlen]] | compliance | 15 | open | legal+product | — | 2026-05-20 |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-04\|01-F-04 — Match-Engine nicht in Web-Worker]] | architecture | 12 | open | frontend+backend | — | 2026-05-20 |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-05\|01-F-05 — Spectator-Snapshot Fan-Out]] | architecture | 12 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-07\|01-F-07 — Session-Store / Cross-Instance]] | architecture | 12 | open | backend | — | 2026-05-20 |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-09\|01-F-09 — Outbox ohne Beobachtbarkeit]] | architecture | 12 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-05\|02-F-05 — Kein blue/green oder Rollback]] | ops | 12 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-07\|02-F-07 — Rate-Limiting nicht enforced]] | security | 12 | open | backend+security | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-08\|02-F-08 — Secrets-Rotation nie geübt]] | security | 12 | open | platform+security | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-05\|03-F-05 — Content-Burn]] | gameplay | 12 | open | writing+design | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-06\|03-F-06 — Mobile-Performance-Budget]] | gameplay | 12 | open | frontend+backend | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-08\|03-F-08 — Endgame leer]] | gameplay | 12 | open | game-design | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-03\|04-F-03 — Keine Feature-Flags / A/B]] | monetization | 12 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-08\|04-F-08 — Kein Customer-Support]] | monetization | 12 | open | support | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-10\|04-F-10 — Refund-/Chargeback-Welle]] | monetization | 12 | open | backend+finance | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-05\|04-F-05 — Payment-Provider-Lock-In]] | monetization | 10 | open | backend+finance | — | 2026-05-20 |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-08\|01-F-08 — Multi-Region-Latenz]] | architecture | 9 | open | platform | — | 2026-05-20 |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-10\|01-F-10 — Storage-Wachstum]] | architecture | 9 | open | backend | — | 2026-05-20 |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-09\|02-F-09 — Coverage-Ratchet greenfield-blind]] | tech | 9 | open | tech-lead | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-07\|03-F-07 — Async-Multiplayer Zeitzonen]] | gameplay | 9 | open | design+backend | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-09\|03-F-09 — Accessibility-Schuld]] | gameplay | 9 | open | design+frontend | — | 2026-05-20 |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-10\|03-F-10 — PWA-Offline-Erwartung]] | gameplay | 9 | open | design+product | — | 2026-05-20 |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-09\|04-F-09 — Kosten-Explosion viraler Spike]] | monetization | 8 | open | platform+finance | — | 2026-05-20 |

**Gesamt:** 40 Findings, 0 mitigated, 40 open.

## Status-Heatmap

| Domain | open | mitigating | mitigated | verified | total | Ø Score |
|---|---|---|---|---|---|---|
| Architecture | 10 | 0 | 0 | 0 | 10 | 14,4 |
| Tech | 3 | 0 | 0 | 0 | 3 | 15,0 |
| Ops | 4 | 0 | 0 | 0 | 4 | 18,3 |
| Security | 3 | 0 | 0 | 0 | 3 | 13,0 |
| Gameplay | 10 | 0 | 0 | 0 | 10 | 13,8 |
| Monetization | 9 | 0 | 0 | 0 | 9 | 16,0 |
| Compliance | 1 | 0 | 0 | 0 | 1 | 15,0 |

## Cross-Cutting-Findings

Diese Findings haben dieselbe Root-Cause aber Auswirkungen in mehreren Domänen — werden gemeinsam gefixt:

- **Determinismus-Drift**: [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-02]] (Tech) ↔ [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-02]] (Gameplay).
- **Web-Worker für Match-Engine**: [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-04]] (Architecture) ↔ [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-06]] (Gameplay-Performance).
- **Single-Node-Outage trifft Monetarisierung**: [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02]] ↔ [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-09]] (Cost / Revenue-Verlust).

## Konvention für Fix-Verkettung

In Code-Commits, ADRs und Linear-Issues verwenden wir konsistente Marker:

```
Addresses PM-2026-05-20-01-F-07
```

oder

```
Fixes PM-2026-05-20-01-F-07
```

Diese Marker werden bei Tag-CI gegen die Registry validiert (Skript-Idee, Gap E11).

## Re-Review

- **Nach 30 Tagen:** Status-Update aller Findings (mindestens Owner-Touch).
- **Nach 60 Tagen:** Cluster-Index aktualisieren, Heatmap.
- **Nach Soft-Launch:** Neues Pre-Mortem-Bündel `PM-<soft-launch-date>-…` erstellen, dieses Bündel `status: superseded` wenn massiv überholt.

## Related

- [[00-index]]
- [[PM-2026-05-20-01-architecture]]
- [[PM-2026-05-20-02-tech-and-ops]]
- [[PM-2026-05-20-03-gameplay]]
- [[PM-2026-05-20-04-monetization]]
- [[../wave-3-gap-analysis]]
- [[../../00-Index/Current-State]]
