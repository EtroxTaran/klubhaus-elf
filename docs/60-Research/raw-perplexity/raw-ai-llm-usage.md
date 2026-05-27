---
title: Raw — AI / LLM Usage Analysis & Decision Matrix
status: raw
tags: [research, raw, perplexity, ai, llm, narrative, fallback]
created: 2026-05-27
updated: 2026-05-27
type: raw-research
binding: false
sourceType: external
related: [[../incoming-design-research-2026-05-27]], [[../narrative-content-pipeline]], [[../pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
---

> Lossless import of Nico's external research report (Perplexity-style), filed
> 2026-05-27. **`status: raw` — not implementation authority.** Analysis, vault
> mapping and divergence flags live in [[../incoming-design-research-2026-05-27]].
> The calc-first / deterministic-fallback **principle** here aligns with the
> vault; the proposed **runtime** OpenRouter LLM calls are a Future-Scope-Gate
> item, explicitly **out of MVP scope** (no runtime LLM — D8/D15
> [[../narrative-content-pipeline]]). Raw research may quote competitor / vendor
> names for analysis only; implementation follows [[../ip-and-licensing]] and
> [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

# KI-Einsatz im Fußballmanager – Analyse, Prioritäten & Entscheidungsmatrix

## Executive Summary

KI im Sinne von LLMs (Large Language Models) ist im Fußballmanager **kein notwendiger Bestandteil der Simulation**, aber ein wertvoller optionaler Schicht für Textualisierung, Personalisierung und emergentes Verhalten. Die Kernmechanik – Spielerentwicklung, Match Engine, Finanzen, Transfers – ist korrekt als deterministisches Zahlenspiel beschreibbar. LLMs sollten dort eingesetzt werden, wo statische Templates an Ausdrucksgrenzen stoßen. Das Spiel muss jedoch in jedem Use Case **ohne KI vollständig funktionieren** – KI ist immer eine Verbesserungsschicht, nie eine Abhängigkeit.

***

## Grundprinzip: KI als optionale Narativ-Schicht

Das Spieldesign unterscheidet konsequent zwei Ebenen:

- **Simulationsebene**: Deterministisch, regelbasiert, keine KI nötig. Spielerentwicklung, Match Engine, Finanzen, Taktikauswertung, Scouting – alles berechnet aus Attributen, Faktoren und kontrollierten Zufallswerten.
- **Narativebene**: Textualisierung von Spielereignissen, Pressekonferenzen, Transfers, Verletzungsmeldungen. Hier hat KI echten Mehrwert – sie ersetzt nicht die Berechnung, sondern formuliert das Ergebnis schöner.

Jeder LLM-Aufruf folgt dem Muster: **Berechnung zuerst → Ergebnis steht fest → KI formuliert den Text dazu**. Fällt die KI aus, erscheint ein vordefinierter Fallback-Text. Das Spiel läuft weiter.

***

## Use-Case-Matrix: Alle KI-Kandidaten im Überblick

| Use Case | Kategorie | KI-Typ | Spielimpact | Offline-Fallback | Priorität |
|---|---|---|---|---|---|
| **Verletzungsmeldungen & Ereignisberichte** | Narrativ | LLM Text-Gen | 🟡 Atmosphäre | Standardtext-Template | ⭐ Quick Win |
| **Pressekonferenz-Dialoge** | Narrativ | LLM Text-Gen | 🟡 Atmosphäre | Feste Antworttexte | ⭐ Quick Win |
| **Transferverhandlungs-Flavour-Texte** | Narrativ | LLM Text-Gen | 🟡 Atmosphäre | Standardtexte | ⭐ Quick Win |
| **Zeitungsartikel / Spielberichte** | Narrativ | LLM Text-Gen | 🟢 Immersion | Template-Artikel | ⭐ Quick Win |
| **Co-Trainer / Advisor Empfehlungen** | Analyse | Statistik-Regeln | 🔵 Kein Impact | Identisches System | ❌ Kein LLM nötig |
| **Spielerentwicklung** | Simulation | Mathematisch | 🔵 Kein Impact | Identisches System | ❌ Kein LLM nötig |
| **Finanzflüsse & Budgets** | Simulation | Mathematisch | 🔵 Kein Impact | Identisches System | ❌ Kein LLM nötig |
| **Gegner-KI Taktik & Charakter** | Verhalten | LLM + Regeln | 🔴 Spielverändernd | Regelbasiertes AI-Profil | 🔶 Interessant |
| **Transfer-NPC-Persönlichkeit** | Verhalten | LLM + Regeln | 🔴 Spielverändernd | Regelbasiertes Profil | 🔶 Interessant |
| **Verletzungs-Diagnosetext (medizinisch)** | Narrativ | LLM Text-Gen | 🟡 Atmosphäre | Kategorie-Templates | ⭐ Quick Win |
| **Spieler-Charakter/Reaktionen** | Verhalten | LLM + Profil | 🟠 Mittlerer Impact | Attributbasiertes Verhalten | 🔶 Interessant |
| **Match Commentary (Live-Text)** | Narrativ | LLM Text-Gen | 🟡 Atmosphäre | Event-Templates | ⭐ Quick Win |

***

## Bereich 1 – Quick Wins: Textualisierung ohne Spieleinfluss

Diese Use Cases sind die naheliegendste und risikoärmste Einstiegspunkte für KI. Sie verändern das Spielgeschehen **nicht**, erhöhen aber die Immersion deutlich.

### Verletzungsmeldungen & Ereignistexte

Ein Spieler verletzt sich – das ist eine rein berechnete Tatsache (Verletzungstyp, Ausfallzeit, Schweregrad aus Attributen und Zufallsfaktoren). Was KI hier tut: Aus diesem Datenobjekt einen kurzen, situativen Text (2–3 Sätze) generieren – mit Kontext (Spielminute, Gegner, Saisonphase, Spielercharakter). 

**Prompt-Struktur (Beispiel)**:
```
Spieler: Marco Ferri, 24, Stürmer, Vereinsidol
Verletzung: Muskelfaserriss, Oberschenkel
Kontext: 87. Minute, Pokalfinale, 1:0-Führung
Tone: sachlich, leicht dramatisch
Generiere: 2-3 Sätze für den Spielbericht
```

**Fallback**: `„Marco Ferri musste in der 87. Minute verletzungsbedingt vom Feld."` – Spiel läuft identisch weiter.

### Pressekonferenzen & Interviews

Anstatt fester Textbausteine kann KI situationsabhängige Antworten generieren, die den Manager-Charakter und die Spielsituation widerspiegeln. Die Fragen sind vordefiniert (keine freie Eingabe), die Antworten werden aus dem Spielkontext (Tabellenlage, letztes Ergebnis, Kaderprobleme) generiert. Dies ist bewusst kein Dialog-System – der Spieler *liest*, nicht *schreibt*.

**Fallback**: Vordefinierte Antwortbausteine pro Kategorie (Sieg/Niederlage/Unentschieden, Verletzung, Transfer).

### Zeitungsartikel & Spielberichte

Nach jedem Spieltag kann ein kurzer Artikel (ca. 100–200 Wörter) generiert werden, der das Spiel aus Sicht eines fiktiven Sportjournalisten beschreibt – mit Bezug auf Taktik, Tore, Spieler des Spiels. LLM-Studien zeigen, dass Sportnarrative mit echten Match-Daten als Input gut von LLMs generiert werden können, auch wenn sehr statistische Texte (z.B. genaue Score-Rekapitulation) noch Fehlerquellen haben.

**Fallback**: Statistik-Template mit den Kerndaten.

### Transferverhandlungs-Flavour

Verhandlungsparameter (Angebot, Gegengebot, Einigung/Scheitern) werden rein rechnerisch bestimmt. KI formuliert dazu 2–3 Sätze im Ton des beteiligten Agenten oder Vereins – z.B. „Der Agent machte deutlich, dass sein Klient nur wechseln würde, wenn..." Dies erhöht die Atmosphäre ohne Spielmechanik zu berühren.

***

## Bereich 2 – Kein KI-Einsatz sinnvoll

### Co-Trainer / Advisor-System

Der Co-Trainer, der Formation-Tipps gibt, ist ein klassisches Statistik-Auswertungssystem. Die Empfehlungen entstehen aus messbaren Kaderdaten: Welche Formation passt zu den besten Attributen der verfügbaren Spieler? Welche Position ist unterbesetzt? Dies ist rein algorithmisch lösbar – LLM würde hier Kosten und Latenz erzeugen ohne Mehrwert. **Die Formulierung** des Tipps kann allerdings über ein Template-System variiert werden (z.B. 5–10 vordefinierte Formulierungsvarianten pro Hinweis-Typ).

### Spielerentwicklung, Finanzen, Match Engine

Diese Systeme sind deterministisch und simulationsbasiert. Spielerentwicklung folgt definierten Faktoren (Training, Einrichtungen, Trainer, Spielzeit, Alter, Professionalität). Finanzflüsse sind buchhaltungsähnlich kalkulierbar. Die Match Engine ist ein ereignisbasiertes Attributsystem. **Kein LLM-Einsatz hier** – weder sinnvoll noch notwendig.

***

## Bereich 3 – Interessant: Emergentes Verhalten mit Impact

Diese Use Cases haben echten Spieleinfluss und sind konzeptuell spannend, aber komplexer umzusetzen.

### Gegner-Trainer-Persönlichkeit

Football Manager selbst nutzt mehrere regelbasierte KI-Schichten für Gegner (Match AI, Manager AI, Club AI). Ein interessanter Ansatz für unser Spiel: Gegner-Trainer erhalten **Persönlichkeitsprofile** (z.B. „Risikofreudig, bevorzugt Pressing, reagiert auf Rückstand aggressiv") und **LLM entscheidet im Rahmen dieses Profils** über situative Taktikwechsel. Damit entstehen Gegner, die nicht einfach nur optimal spielen, sondern Charakter haben.

**Kritische Einschränkung**: LLM für Echtzeit-Taktikentscheidungen während eines Matches ist zu langsam (API-Latenz ~500ms–2s). Lösung: KI-Entscheidungen nur zu **festen Spielpunkten** (Halbzeit, nach Torereignis), nicht kontinuierlich. Für jeden Gegner wird ein strukturiertes Profil als Prompt-Kontext verwendet, das deterministische Outputs (JSON mit Taktikparametern) produziert.

**Fallback**: Vollständig regelbasiertes Gegner-Profil (Attribut-Scoring für Taktikwahl). Spiel läuft identisch.

### Transfer-NPC-Persönlichkeit

Real-world Transfers sind kein reines Zahlenspiel – Spielerlokalität, Vereinstreue, Karrierephase, Verhältnis zum aktuellen Trainer spielen eine Rolle. Ein Spieler mit hohem `Loyalität`-Attribut könnte von einer LLM-Entscheidungslogik anders bewertet werden als rein finanziell optimal: Er lehnt einen Top-Verein ab, wenn sein aktueller Club ihm treu war. Dies erzeugt emergente, überraschende Transfermomente.

**Implementierung**: Das `Loyalität`- und `Ehrgeiz`-Attribut (bereits im Attributsystem) als Prompt-Input für eine strukturierte LLM-Entscheidung – Output ist JSON (Bereitschaft 0–100, Begründung als Textsatz). Der Text ist optional; die Zahl ist spielrelevant.

**Fairness-Check**: **Unbedenklich SP**, **kritisch MP** – im Multiplayer darf LLM keine Entscheidungen treffen, die Spieler-vs.-Spieler-Fairness beeinflussen. Im MP: ausschließlich regelbasiert.

### Spieler-Reaktionen & Charaktermomente

Spieler mit bestimmten Charakterprofilen (z.B. `Professionalität: niedrig`, `Ehrgeiz: hoch`) könnten situativ auf Ereignisse reagieren – Nicht-Nominierung, Pokalfinale, Aufstieg. LLM generiert kurze Reaktionstexte aus dem Charakterprofil. Diese haben keinen direkten Spielmechanik-Impact, beeinflussen aber indirekt die Moral (ein simulierter Wert). **Fallback**: Kategorie-Templates pro Charaktertyp.

***

## Bereich 4 – Spielverändernd (Langfristig / Future)

### Dynamische Weltnarrative

Kombiniert man Pressekonferenzen, Vereinshistorie, Rivalitäten und Transfergeschichten zu einem persistenten Weltkontext, könnte KI langfristig ein „lebendes Zeitungsuniversum" erzeugen – Journalisten, die auf Rivalitäten eingehen, Fans die sich an Ereignisse erinnern. Dies ist konzeptuell spannend, aber erst relevant nach Phase 2.

### Match-Commentary (Live)

Dynamischer Live-Kommentar während des Spiels (Text-basiert) wäre spielverändernd für das Spielerlebnis. Technisch schwierig wegen Latenz – hier wäre ein kleines, lokal ausführbares Modell die einzige praktikable Lösung für Offline/Mobile.

***

## Offline-Fallback-Architektur

**Designprinzip**: KI ist immer eine Verbesserungsschicht. Das Spiel läuft vollständig ohne API-Zugang.

```
┌─────────────────────────────────────────────┐
│              Spiel-Event tritt auf           │
└────────────────────┬────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │  API verfügbar?     │
          └──────────┬──────────┘
               Ja    │    Nein
          ┌──────────▼──────────┐   ┌─────────────────────┐
          │  LLM-Request        │   │  Template-Fallback   │
          │  (OpenRouter API)   │   │  (lokal, determin.)  │
          └──────────┬──────────┘   └─────────────────────┘
               Error │    OK
          ┌──────────▼──────────┐
          │  Fallback-Template  │
          └─────────────────────┘
```

**Wichtig für SP/MP-Unterscheidung**:
- **Singleplayer**: LLM-Calls lokal oder API, beides akzeptabel. Keine Fairness-Bedenken.
- **Multiplayer**: LLM **ausschließlich für Narativ-Texte** (nicht für Entscheidungen die andere Spieler betreffen). Gegner-Taktik im MP: vollständig regelbasiert und serverautoritativ.

***

## Kostenabschätzung: OpenRouter API

OpenRouter bietet 2026 über 400 Modelle mit einem Pay-as-you-go-Modell (5,5% Plattformgebühr). Für kurze Narativ-Texte (2–3 Sätze, ~100–200 Output-Tokens) sind günstige Modelle vollkommen ausreichend.

| Modell | Input $/1M | Output $/1M | Eignung Narrativ | Kosten pro 1.000 Events |
|---|---|---|---|---|
| DeepSeek V4 Flash (:free) | $0 | $0 | ✅ Gut für einfache Texte | $0 (rate-limited) |
| MiMo-V2-Flash | $0.09 | $0.09 | ✅ Gut | ~$0.02 |
| Step 3.5 Flash | $0.10 | $0.10 | ✅ Gut | ~$0.02 |
| DeepSeek V3.2 | $0.25 | $0.25 | ✅ Sehr gut | ~$0.05 |
| Gemini 3 Flash | $0.50 | $0.50 | ✅✅ Hervorragend | ~$0.10 |
| GPT-5.3 | $1.75 | $1.75 | Überdimensioniert | ~$0.35 |

**Beispielrechnung für aktiven Spieler (100 Spieltage/Saison)**:
- ~300 Narativ-Events/Saison (Verletzungen, Artikel, Konferenz-Snippets)
- Bei DeepSeek V3.2: ca. **$0.015 pro Saison pro aktivem Nutzer**
- Bei 1.000 aktiven Pro-Nutzern: **~$15/Monat** für die gesamte API-Nutzung

**Free Tier**: OpenRouter bietet 50 Requests/Tag kostenlos (Free Plan) bzw. 200 Requests/Tag bei kostenfreien Modellen. Für Early-Access-Phasen und Beta-Tests reicht das aus.

***

## Lokales Modell: Wann sinnvoll?

Der Übergang von API zu lokalem Modell lohnt sich erst bei höherer Last oder wenn Offline-First für alle Nutzer Pflicht wird.

| Kriterium | API (OpenRouter) | Lokal (Ollama/llama.cpp) |
|---|---|---|
| **Einstiegskosten** | $0 (free tier) | Hardware $0 wenn vorhanden |
| **Skalierungskosten** | Linear pro Token | Fixkosten (Strom/Hardware) |
| **Latenz** | 500ms–2s | 100–800ms (lokal) |
| **Offline-Fähigkeit** | Nein | Ja |
| **Modellqualität für kurze Texte** | Sehr gut | Gut (Llama 3.1 8B, Gemma 3) |
| **Mobile Support** | Via Server | Schwierig (RAM-Limit ~4–8GB) |
| **Wartungsaufwand** | Minimal | Hoch |

**Empfehlung für unser Projekt**:
1. **Phase 1–2**: OpenRouter API, günstige Modelle (DeepSeek Flash, MiMo). Kosten minimal, keine Infrastruktur nötig.
2. **Ab Phase 3 / hohem Traffic**: Evaluiere Hybrid-Ansatz: lokaler Server (z.B. Llama 3.1 8B via Ollama) für Pro-Nutzer-Instanzen, API als Fallback.
3. **On-Device (Mobile)**: Nur für zukünftige Feature, wenn Tiny LLMs (<1.5B Parameter, ~1GB) ausgereift genug sind für Narativ-Qualität. Noch nicht produktionstauglich für Qualitätsansprüche.

***

## Architektur-Integration (DDD-Kontext)

KI-Calls sind ein eigener **AI Narrative Service** – entkoppelt von allen anderen Domänen, exakt wie Training oder Match Engine als austauschbarer Service behandelt.

```
NarrativeService
  Input:  NarrativeRequest { eventType, context: GameContext, fallbackText: string }
  Output: NarrativeResponse { text: string, source: "llm" | "template" }

GameContext {
  player?: PlayerProfile
  match?: MatchSummary
  club?: ClubState
  seasonWeek: number
  tone: "neutral" | "dramatic" | "ironic"
}
```

**Wichtige Designentscheidungen**:
- `fallbackText` ist immer mitgegeben – der Service gibt im Fehlerfall sofort den Fallback zurück
- Kein Blocking: LLM-Calls sind **async, non-blocking** – das Spiel wartet nie auf KI
- **Prompt-Caching**: Gleichartige Events (z.B. Verletzungstyp Muskelfaserriss für ähnliche Spieler) können gecacht werden, um API-Kosten zu senken
- SP: Calls können clientseitig erfolgen (API-Key serverseitig proxied). MP: Calls serverseitig, Text wird als Domain Event verteilt

***

## Entscheidungsmatrix: Finale Priorisierung

| Priorität | Use Case | Wann umsetzen | Kosten | Offline-Fallback |
|---|---|---|---|---|
| 🟢 **Sofort** | Verletzungs- & Ereignistexte | Phase 1 MVP | Minimal (<$1/Monat) | ✅ Template |
| 🟢 **Sofort** | Spielberichte / Match Summary | Phase 1 MVP | Minimal | ✅ Template |
| 🟡 **Phase 2** | Pressekonferenz-Snippets | Phase 2 | Niedrig | ✅ Festtexte |
| 🟡 **Phase 2** | Transfer-Flavour-Texte | Phase 2 | Niedrig | ✅ Templates |
| 🟠 **Phase 2–3** | Spieler-Reaktionsmomente | Phase 2–3 | Niedrig | ✅ Profil-Templates |
| 🔴 **Phase 3** | Gegner-Trainer-Persönlichkeit | Phase 3 (SP only) | Mittel | ✅ Regelbasiertes Profil |
| 🔴 **Phase 3** | Transfer-NPC-Persönlichkeit (SP) | Phase 3 (SP only) | Mittel | ✅ Attributbasiert |
| ⛔ **Nie / Future** | Live Match Commentary | Post-Launch | Hoch/Latenz | Schwieriger Fallback |
| ⛔ **Nie** | Co-Trainer Entscheidungen | — | Unnötig | ✅ Statistik-Algo |
| ⛔ **Nie** | Match Engine Berechnungen | — | Unnötig | ✅ Deterministisch |

***

## Risiken & Markierungen

**P2W / Fairness**:
- Narrative-KI: **unbedenklich MP** – beeinflusst keine Spielergebnisse
- Gegner-KI via LLM: **nur SP** – im MP ausschließlich regelbasiert, sonst nicht deterministisch und nicht fair
- Transfer-NPC-KI: **nur SP** – im MP könnten unterschiedliche LLM-Ergebnisse zu unfairen Szenarien führen

**Technische Risiken**:
- **Halluzination**: LLM darf nie Spielfakten erfinden. Alle Kerndaten (Spielergebnis, Verletzungstyp, Transfersumme) kommen aus der Simulation als Input – KI formuliert nur
- **Prompt Injection**: Spieler-generierte Inhalte (z.B. Vereinsname) müssen sanitisiert werden, bevor sie in Prompts eingehen
- **Rate Limits**: Free-Tier-Limits (200 req/day) erfordern Caching-Strategie und graceful Degradation
- **Kosten-Explosion**: Budget-Caps pro User/Session über OpenRouter-Mechanismen einbauen

**PWA / Offline**:
- KI-Texte werden nach Generierung **gecacht** (IndexedDB), sodass sie offline lesbar bleiben
- Neue KI-Texte nur bei aktiver Verbindung; ansonsten Template-Fallback
- Für SP vollständig offline spielbar ohne jede KI-Funktion