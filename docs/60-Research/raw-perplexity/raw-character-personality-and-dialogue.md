---
title: Raw — Character Personality System & Player Dialogue Layer
status: raw
tags: [research, raw, perplexity, personality, dialogue, npc, llm]
created: 2026-05-27
updated: 2026-05-27
type: raw-research
binding: false
sourceType: external
related:
  - [[../incoming-design-research-2026-05-27]]
  - [[../narrative-content-pipeline]]
  - [[../ai-manager-behaviour]]
---

> Lossless import of Nico's external research report (Perplexity-style), filed
> 2026-05-27. **`status: raw` — not implementation authority.** Analysis, vault
> mapping and divergence flags live in [[../incoming-design-research-2026-05-27]].
> The runtime-LLM dialogue layer proposed here **diverges** from the locked
> MVP line (no runtime LLM; build-time authoring only — D8/D15
> [[../narrative-content-pipeline]]). Raw research may quote competitor names
> for analysis only; implementation follows [[../ip-and-licensing]] and
> [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Und dann natürlich sollte auch jeder Charakter, Zeitung, Jpurnalist, Spieler oder so eigenen Charakterzüge haben.

Und wo das ganze auch Sinn macht sind natürlich Gespräche mit dem Spieler selbst. Da sollten wir auch mehr mit KI die Kontexte setzten.

Damit das funktioniert, brauchst du zwei zusätzliche Layer: ein **Personality-System für alle Akteure** und einen **Dialoglayer für direkte Gespräche (v.a. Spieler)**, der LLM nur als Sprachoberfläche nutzt.

Ich gehe das in vier Schritten durch:

***

## 1. Persönlichkeitsmodell für alle Figuren

Ziel: Jeder Journalist, Spieler, Fan-Vertreter, Vorstands-Typ wirkt konsistent – egal ob Text aus Template oder LLM kommt. Forschung zu NPC-Personas nutzt dafür meist vereinfachte Big-Five-ähnliche Modelle.

### Basis-Persönlichkeitsachsen

Für dein Spiel reichen wenige, domänenspezifische Achsen, statt kompletter Big Five:

- Für **Spieler**:
    - Professionalität (niedrig/hoch)
    - Ehrgeiz (niedrig/hoch)
    - Loyalität (Vereinstreue)
    - Medienverhalten (ruhig/provozierend)
    - Emotionalität (stabil/instabil)
Diese Werte hast du in deinem Design ohnehin schon vorgesehen.
- Für **Journalisten/Medien**:
    - Stil: sachlich vs. boulevardesk
    - Haltung: wohlwollend vs. kritisch vs. zynisch
    - Fokus: Taktik/Statistik vs. Emotion/Skandal
    - Heimatnähe: lokal vs. national (lokale Presse schützt dich eher, nationale schießt drauf).
- Für **Board-/Funktionäre**:
    - Risikoaversion (mutige vs. konservative Entscheidungen)
    - Geduld (Kurzfrist-Ergebnis vs. Langfrist-Projekt)
    - Kommunikationsstil (intern vs. über Medien Druck machen).

Diese Traits werden:

- in jedem **Hook** mitgegeben (z.B. wenn Journalist X eine Frage stellt),
- dem LLM als Kontext übergeben („Du bist Journalist XY, sehr kritisch, boulevardesk…“),
- für die Simulation genutzt (wie stark reagiert Vorstand, wie eskaliert ein Medienkonflikt?).

***

## 2. Charakterkonsistente Texte: LLM + Persona + Wissensbasis

Studien zeigen, dass LLMs Persönlichkeiten relativ konsistent spielen können, wenn sie eine klare Persona + begrenztes Wissensfenster bekommen. Wichtig ist:

- **Persona als strukturierter Block**:
    - Beispiel Journalist:
        - `name: „Lukas Hartmann“`
        - `type: „Boulevardreporter“`
        - `tone: „aggressiv, zugespitzt“`
        - `fav_topics: „Skandale, Trainerdiskussion, Mentalität“`
    - Beispiel Spieler:
        - `professionalism: low`
        - `ambition: high`
        - `loyalty: high`
        - `media_behaviour: „direkt, aber nicht respektlos“`.
- **Game-Fakten als harter Kontext**:
    - Formkurve, Angstgegner-Statistik, letzte Interviews, Fanstimmung, Rivalitätsscore etc.
    - LLM darf nichts erfinden – du gibst die Fakten mit („die letzten 5 Spiele gegen Club X alle verloren“).
- **Dialogrichtlinie**:
    - Du schreibst pro Rolle hohe-Level-Regeln:
        - „Kritischer Journalist stellt selten freundliche Fragen und verwendet oft Suggestivfragen.“
        - „Professionalitäts-niedriger Spieler meckert schneller öffentlich.“
    - Diese Regeln gehen mit in den Prompt, damit die Antworten stilistisch konsistent bleiben, egal welcher Hook dran ist.

***

## 3. Gespräche mit Spielern: Struktur statt „freies Chatten“

Hier macht KI den meisten Sinn: **Gespräche mit Spielern, die Kontext und Persönlichkeit berücksichtigen**, aber du willst trotzdem Kontrolle und Reproduzierbarkeit.

### a) Gesprächs-Typen definieren

Statt freiem Dialog: klar abgegrenzte Szenarien, z.B.:

- „Spieler will mehr Einsatzzeit“
- „Spieler will Wechsel erzwingen“
- „Spieler ist unzufrieden mit Position/Rolle“
- „Vertragsverlängerungsgespräch (Vorgespräch, nicht Zahlenverhandlung)“
- „Krisengespräch nach schwacher Form“
Diese Situationen sind aus deinen Systemen sowieso ableitbar (Minuten, Alter, Status im Kader, Form, Vertragsrestlaufzeit).


### b) Ablauf einer Konversation

1. **Trigger**: Event (z.B. Stammspieler 5 Spiele auf der Bank → Unzufriedenheit steigt → Gespräch werden vorgeschlagen).
2. **Kontext-Building**:
    - Spielerprofil: Persönlichkeit, Status, Form, Vertragslage.
    - Manager-Historie mit diesem Spieler (hat ihn oft verteidigt, oft kritisiert etc.).
    - Clubkontext: Tabellenplatz, Medien-Druck, Fanlage.
3. **LLM generiert 2–3 Eröffnungszeilen des Spielers** im passenden Ton:
    - Respektvoll, trotzig, verzweifelt – abhängig von Traits und Situation.
4. **Der Spieler (User) wählt Antwortoptionen** aus einer kleinen Liste (3–4 Stück), die du als abstrakte „Intents“ definierst:
    - `supportive` („Ich vertraue dir, deine Einsatzzeit kommt…“)
    - `honest` („Du bist aktuell hinter X in der Rangordnung…“)
    - `authoritative` („Entscheidungen treffen hier immer noch wir…“)
    - `appeasement` („Wir reden nach der Hinrunde noch mal…“)
5. **LLM formuliert die gewählte Antwort natürlich aus**, basierend auf Intent + Kontext + Manager-Persönlichkeit.
6. **Mechanischer Effekt**:
    - Spieler-Moral, Loyalität zum Manager, Wechselbereitschaft ändern sich je nach Intent und Traits (z.B. Ehrgeiz).
    - Teamdynamik: manche Antworten gefallen der Kabine, andere verstärken Spaltungen – insbesondere, wenn du Stars bevorzugst etc..

Wichtig: Entscheidend für die Simulation sind deine „Intents“, nicht der konkrete Text. Der Text ist Kosmetik, aber emotional wertvoll.

### c) Sicherheit \& Grenzen

- Keine freie Texteingabe des Users nötig: er wählt Intent, KI macht Formulierung.
- Fallback: Du kannst für jeden Intent feste Textvarianten haben, falls KI nicht verfügbar ist.
- Multiplayer: solche tiefen Spieler-Gespräche sind vor allem im Singleplayer relevant; in Async-MP musst du auf Session-Länge achten.

***

## 4. Zeitungen, Journalisten und „Medien-Ökosystem“

Mit Persona + Hooks kannst du dein eigenes Medien-Universum bauen:

- **Medienprofile**:
    - „Lokale Gazette“ – nah am Club, eher wohlwollend, fokussiert auf Taktik + Nachwuchs.
    - „Boulevardblatt“ – sucht Skandale, macht Druck.
    - „Analytischer Blog“ – nerdig, taktikorientiert.
- **Journalisten als Figuren dieser Medien**:
    - Jede Zeitung hat 1–3 wiederkehrende Autoren mit eigenem Stil.
    - Diese schreiben Artikel bzw. stellen PK-Fragen, immer im Rahmen ihres Profils.
- **Narrative Effekte**:
    - Negative Boulevardkampagnen verstärken Fanfrust (besonders bei Event-Fans und Casuals).
    - Analytischer Lob-Artikel kann Zweifel bei Vorstand/Fans ein wenig dämpfen („trotz schlechter Resultate erkennt man den Plan…“).
    - Wiederkehrende Namen erhöhen Wiedererkennungswert („Schon wieder Hartmann, der dich nach deinem Angstgegner fragt…“).

LLM-Einsatz:

- Du gibst Hook + Medien- und Journalist-Persona + Fakten in den Prompt.
- Modell generiert Frage/Artikel in passendem Ton, du berechnest Effekte je nach Mediengewicht.

***

## 5. Technischer Rahmen: „Persona + Context → Text“

Alle diese Fälle lassen sich durch einen generischen Service erschlagen, z.B.:

```ts
type Persona = {
  id: string
  role: "player" | "journalist" | "board" | "fan_rep"
  traits: Record<string, number | string>
  style: "neutral" | "aggressive" | "supportive" | ...
}

type DialogueIntent = 
  | "player_complaint_playtime"
  | "manager_response_supportive"
  | "manager_response_authoritative"
  | "press_question_rivalry"
  | "press_question_style_drift"
  // ...

type DialogueContext = {
  personas: Persona[]
  facts: GameFacts  // Matchdaten, Tabellen, Historie, Fanwerte
  hook?: StoryHook
}

type GeneratedLine = {
  speakerId: string
  text: string
  meta?: {
    suggested_effects?: SimulationEffect[]
  }
}
```

Der **DialogueService** bekommt `DialogueIntent` + `DialogueContext`, ruft LLM auf, liefert `GeneratedLine` zurück.
Wenn LLM ausfällt, wird eine Template-Version für denselben Intent genutzt.

***

## 6. Welche Reihenfolge ist sinnvoll?

Für dein Projekt würde ich es so staffeln:

1. **Persona-System + einfache Hooks** einbauen (Angstgegner, Stilbruch, gefallener Riese, unzufriedener Spieler).
2. **Pressekonferenzen mit Journalisten-Personas** (Fragen + Antwortoptionen, noch ohne Spieler-NPC-Dialog).
3. Dann **Gespräche mit Spielern** als eigenen Dialogtyp draufsetzen – mit den gleichen Patterns (Intent-basiert, Persona + Kontext in den Prompt).

Damit wird die Welt Schritt für Schritt „bevölkert“, ohne dass du gleich ein vollfreies Chat-RPG baust.

Zum Weiterarbeiten: Soll ich dir als nächstes ein konkretes **Datenmodell + Intent-Liste für Spieler-Gespräche** vorskizzieren, oder zuerst eine kleine **Persona-Matrix (Spieler / Journalist / Vorstand / Fansegmente) mit Werten und klaren Effekten** ausarbeiten?
<span style="display:none">[^1][^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^2][^20][^21][^22][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/html/2407.20382

[^2]: https://www.mdpi.com/2673-2688/6/5/93

[^3]: https://arxiv.org/html/2502.17878v1

[^4]: http://arxiv.org/pdf/2503.20623.pdf

[^5]: https://arxiv.org/pdf/2404.19721.pdf

[^6]: https://aclanthology.org/2023.emnlp-main.814.pdf

[^7]: http://arxiv.org/pdf/2407.03460.pdf

[^8]: https://dl.acm.org/doi/10.1145/3742413.3789221

[^9]: https://aclanthology.org/2025.inlg-demos.1.pdf

[^10]: https://jurnal.itscience.org/index.php/brilliance/article/download/6779/4964/33134

[^11]: https://www.sciencedirect.com/science/article/pii/S0952197626013242

[^12]: https://www.semanticscholar.org/paper/The-Effect-of-Context-aware-LLM-based-NPC-on-Player-Mátyás-Csepregi/30aefdf0ccf7b27c97652cbf7141165967b3d176

[^13]: https://www.smu.edu/news/research/video-game-characters-ai-personalities

[^14]: https://dl.acm.org/doi/10.1145/3706598.3714178

[^15]: https://wordplay-workshop.github.io/accepted/

[^16]: https://www.facebook.com/groups/IndieGameDevs/posts/10155826055286573/

[^17]: https://www.youtube.com/watch?v=PIpqZNaI3NY

[^18]: https://arxiv.org/html/2402.18659v4

[^19]: https://www.facebook.com/thebestofgaming1/posts/ai-driven-npc-dialogue-is-starting-to-blur-the-line-between-scripted-characters-/1420356946114452/

[^20]: https://voltintelligence.com/post/1691700542870x679107088494886900

[^21]: https://www.ijraset.com/best-journal/llmdriven-npc-interaction-for-enhanced-immersion-in-videogame-environments

[^22]: https://air.unimi.it/retrieve/5d784da4-df07-4a44-a3c7-453cf73c5f5c/CoG2022_paper_62.pdf
## Related

- [[../incoming-design-research-2026-05-27]]
- [[../narrative-content-pipeline]]
- [[../ai-manager-behaviour]]
