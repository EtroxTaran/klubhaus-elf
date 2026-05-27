---
title: Raw — Match Engine, Offline Strategy & Disconnect Handling
status: raw
tags: [research, raw, perplexity, match-engine, offline, multiplayer, disconnect]
created: 2026-05-27
updated: 2026-05-27
type: raw-research
binding: false
sourceType: external
related:
  - [[../incoming-design-research-2026-05-27]]
  - [[../match-engine-runtime-strategy]]
  - [[../offline-mvp-scope-and-sync-strategy]]
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[../../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
---

> Lossless import of Nico's external research report (Perplexity-style), filed
> 2026-05-27. **`status: raw` — not implementation authority.** Analysis, vault
> mapping and divergence flags live in [[../incoming-design-research-2026-05-27]].
> Its core conclusions (server-authoritative MP, local SP, Canvas 2D + Web
> Worker, deterministic engine, graceful-finish on disconnect) **confirm**
> ADR-0011 / ADR-0020 / ADR-0024 / ADR-0026 and
> [[../match-engine-runtime-strategy]]. The named transports (Colyseus / Nakama)
> are **not** the locked stack — realtime is SSE → Centrifugo
> ([[../../10-Architecture/09-Decisions/ADR-0023-realtime-transport]]). Raw
> research may quote product names for analysis only; implementation follows
> [[../ip-and-licensing]] and
> [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

# Match Engine, Offline-Strategie & Disconnect-Handling

## Executive Summary

Die Kernfrage ist: Wo rechnet wer, was passiert bei Verbindungsverlust, und wie weit kann die PWA offline gehen? Die Antwort ist differenziert – und sie ist für euren Stack gut lösbar. Die **Match Engine** gehört auf den Server, weil sie die teuerste Berechnung ist und im Multiplayer die einzige vertrauenswürdige Wahrheitsquelle sein muss. Gleichzeitig ist eine **vollständige PWA-seitige Offline-Woche** (Transfers, Taktik, Planung, Events) technologisch problemlos umsetzbar, ohne dass es zu einem Grundsatzwiderspruch mit der Server-Autorität kommt. Die Woche läuft offline, das Match läuft auf dem Server – das ist die saubere Trennlinie.

***

## Offline-Strategie: Was kann offline, was muss online sein?

### Die Managerwoche ist offline-tauglich

Für alles, was eine Managerwoche ausmacht – Transfers vorbereiten, Taktik setzen, Events lesen, Spielerentwicklung ansehen, Inbox verwalten – braucht man keine Echtzeit-Verbindung. Asynchrones Multiplayer ist explizit für diesen Use-Case gebaut: Spieler schließen ihre Woche in ihrem eigenen Tempo ab, das System wartet auf ein Quorum[^1]. Das ist genau euer Modell.

Die PWA kann dabei vollständig offline funktionieren, wenn die nötigen Daten vorher gecacht wurden. Mit **IndexedDB** als lokaler Persistenzschicht lassen sich Read-Modelle (Ligastand, Kader, Inbox, offene Transferangebote) lokal vorhalten[^2]. Mutations – also Aktionen wie „Taktik speichern" oder „Transferangebot abgeben" – werden lokal in einer **Command Queue** gepuffert und bei Reconnect automatisch via Workbox Background Sync synchronisiert[^2]. Das ist die Architektur aus den bisherigen Entscheidungen (offline spielbar ja, offline autoritativ nein)[^3].

Entscheidend: Der Spieler kann also im ICE durch den Tunnel fahren und seine gesamte Managerwoche abarbeiten. Beim Reconnect werden die gequeueten Commands validiert und angewendet – oder mit einer klaren Fehlermeldung zurückgewiesen, falls zwischenzeitlich etwas kollidiert ist (z. B. ein Spieler wurde inzwischen von einem anderen Club verpflichtet)[^3].

### Singleplayer darf vollständig lokal rechnen

Im reinen Singleplayer-Modus gibt es keinen Grund, den Server zu benötigen. Training, Spielerentwicklung, Matchsimulation, Ligawoche, Narrative und Events können vollständig lokal in der PWA ablaufen. Die bisherigen Entscheidungen aus dem Design-Doc bestätigen das explizit: „Singleplayer lokal autoritativ"[^3]. Das heißt, für SP ist Offline-First nicht nur möglich – es ist der Sollzustand.

***

## Match Engine: Warum auf dem Server?

### Rechenlast ist managebar, aber besser verteilt

Eine typische Football-Manager-Simulation berechnet das Spiel taktbasiert und ereignisgesteuert: Jede Sekunde wird geprüft, welcher Spieler mit welcher Wahrscheinlichkeit welche Aktion ausführt, basierend auf Attributen, Fitness, Taktik und Zufallsfaktoren[^4]. Das ist kein Physik-Renderer mit 60fps – es ist eine diskrete Ereigniskette. Die Berechnungszeit eines vollständigen Matches in einem Node-Modul oder TypeScript-Service liegt im Bereich von Millisekunden bis einigen Sekunden, abhängig von der Detailtiefe[^5].

Trotzdem gehört die Match Engine im **Multiplayer** auf den Server, weil:

1. **Fairness & Anti-Cheat**: Kein Client darf das eigene Matchergebnis erzeugen. Der Server ist die einzige vertrauenswürdige Instanz[^6][^7].
2. **Konsistenz**: Bei mehreren gleichzeitigen Matches in einer Liga müssen Ergebnisse atomar und in deterministischer Reihenfolge ins System fließen[^3].
3. **Lastverteilung**: Async-MP erlaubt es, Berechnungen zeitlich zu staffeln. Nicht alle Matches einer Woche starten gleichzeitig – das Quorum-Modell gibt dem Server Zeit, die Simulation verteilt zu triggern[^1].

### Singleplayer-Match: Lokal möglich

Im SP berechnet der Client das Match selbst. Das ist technisch kein Problem. Eine JavaScript-basierte Simulation – etwa das npm-Modul `footballsimulationengine` – nimmt zwei Team-JSONs mit Spielerpositionen und Attributen, simuliert das Spiel Sekunde für Sekunde und gibt Timeline, Statistiken und Ergebnis zurück[^5]. Das läuft auf einem modernen Mobilgerät problemlos.

Die kritische Frage: **Beeinträchtigt das die PWA?** Nein – solange die Simulation im **Web Worker** läuft und nicht den Main Thread blockiert[^8]. Web Workers laufen auf einem eigenen Thread, der Main Thread (und damit die UI, die das 2D-Match anzeigt) bleibt reaktionsfähig[^9]. Die Simulationslogik schickt über `postMessage` Events an den Main Thread, der sie rendert.

***

## PWA-Machbarkeit der 2D-Match-Darstellung

### Technisch kein Problem

Für eine 2D-Darstellung – Spieler bewegen sich, Ball rollt, Statistiken aktualisieren – gibt es in der Webplattform alle nötigen Tools:

- **Canvas API / OffscreenCanvas**: Für 2D-Sprites, Bewegungen und Animationen ist Canvas optimal. Pixi.js, Phaser oder auch die native Canvas-API reichen[^10].
- **OffscreenCanvas + WebWorker**: Die Simulationslogik rechnet im Worker. Der Worker überträgt nur Positionen und Events per `postMessage` an den Main Thread, der rendert[^9]. Damit bleibt die UI auch bei intensiverer Simulation flüssig[^8].
- **Performance auf Mobilgeräten**: 2D-Sprites und einfache Animationen auf Canvas sind für moderne Smartphones keine Herausforderung. Football Manager selbst bietet eine 2D-Darstellung auf allen Plattformen, inklusive mobiler Varianten[^11].

### Architektur-Pattern für die Match-Darstellung

```
[Server: Match Engine] → Simulation läuft
       ↓ tick-Events via WebSocket
[Client: UI Thread] → rendert 2D-Canvas
       ↑
[Client: WebWorker] → optional lokale Vorberechnungen / Interpolation
```

Im Singleplayer läuft der Worker lokal, im Multiplayer empfängt der Client Event-Streams vom Server und rendert sie. Das Rendering selbst ist in beiden Fällen gleich – die Datenquelle wechselt.

***

## Disconnect-Handling beim Live-Match

Das ist der heikelste Punkt – und einer, der eine klare Design-Entscheidung erfordert.

### Szenario: Spieler verliert Verbindung während des Live-Matches

Es gibt drei etablierte Patterns:

| Pattern | Beschreibung | Einsatz |
|---|---|---|
| **Pause & Reconnect** | Server pausiert das Match, gibt dem Spieler ein Reconnect-Fenster (z. B. 60–180 Sek.) | Echtzeit-Multiplayer mit zwei aktiven Managern, die gleichzeitig zuschauen |
| **Continue & Sync** | Server rechnet weiter, Spieler bekommt beim Reconnect den aktuellen State | Async-Match, bei dem das Ergebnis sowieso servergeneriert wird |
| **Graceful Finish** | Server berechnet das Match zu Ende, speichert Ergebnis – kein Warten | Async-Multiplayer, kein Live-Viewing-Pflicht |

Für euren Use-Case ist die Entscheidung kontextabhängig:

**Für den Async-Multiplayer (Normalfall):** Das Match wird serverautoritativ berechnet, unabhängig davon, ob der Spieler zusieht. Der Spieler schaut es sich live an, wenn er will – aber der Ausgang hängt nicht von seiner Verbindung ab. Wenn er disconnect, rechnet der Server weiter. Beim Reconnect bekommt er entweder den Live-Stream (falls Match noch läuft) oder das Replay. Das ist das sauberste Modell[^3][^7].

**Für die Watch-Party (mehrere Spieler schauen gemeinsam):** Hier wäre ein kurzes Pause-Fenster sinnvoll – ähnlich wie Unity Lobbies das implementiert: Disconnect erkannt → Match pausiert → 30-Sekunden-Reconnect-Fenster → danach Continue ohne den Spieler[^12]. Das entspricht auch dem Overwatch-League-Ansatz: „Game Admin pausiert das Spiel bis zur Auflösung"[^13].

### Reconnect-Strategie

Die robuste Standardimplementierung sieht so aus[^14][^15]:

1. **Persistent Player Session**: Jeder Spieler hat eine eindeutige persistente ID. Der Server hält den Session-Kontext für N Minuten aktiv, auch nach Verbindungsabbruch.
2. **Reconnect-Timer**: Server markiert Spieler als `disconnected`, startet einen Timer (z. B. 3 Minuten für Watch-Party, unbegrenzt für Async-Match).
3. **State-Sync bei Reconnect**: Beim erneuten Verbindungsaufbau erhält der Client einen vollständigen State-Snapshot des aktuellen Match-Stands, ergänzt um die verpassten Events als Timeline-Replay[^16].
4. **Graceful Fallback**: Nach Ablauf des Timers – oder wenn der Spieler gar nicht reconnected – wird das Match zu Ende simuliert und das Ergebnis gespeichert. Kein Abbruch, kein verlorenes Match.

Im TypeScript/Colyseus- oder Nakama-Kontext sieht das so aus:
- `onLeave(client, consented)` wird gefeuert, der Server setzt `playerState = "disconnected"`.
- Ein Timeout-Job wird geplant (z. B. via Worker/Queue).
- Bei Reconnect: `onJoin` → State-Snapshot senden, `playerState = "reconnected"`.

```typescript
// Konzept-Skizze für Match-Session-Handling
type PlayerMatchState = "connected" | "disconnected" | "reconnecting" | "finished"

interface MatchSession {
  playerId: string
  matchId: string
  playerState: PlayerMatchState
  disconnectedAt?: Date
  reconnectDeadline?: Date // null = unbegrenzt (Async-Match)
}
```

### Was passiert ohne Reconnect?

Der Server rechnet das Match zu Ende[^3]. Das Ergebnis ist valide. Beim nächsten Login des Spielers bekommt er das Ergebnis als fertige Meldung in der Inbox – mit Replay-Option. Das ist der Standard-Flow für alle Async-Matches, bei denen kein Live-Viewing stattfindet.

***

## Lastverteilung bei Multiplayer-Matchdays

### Das Problem

Mehrere menschliche Manager spielen am selben Spieltag. Wenn alle Matches gleichzeitig starten, entsteht Spitzen-Last auf dem Server.

### Lösung: Gestaffelte Simulation

Das Quorum-Modell aus dem bestehenden Design hilft hier direkt[^3]: Matches starten nicht synchron, sondern nach Quorum + Countdown. Das erlaubt:

1. **Priorisierung**: Das Match des eigenen Spielers wird zuerst simuliert (oder parallel, aber mit höherer Prio).
2. **Gestaffelte NPC-Matches**: Alle anderen Ligaspiele (NPC-Teams) können zu einem beliebigen Zeitpunkt innerhalb des Spielfensters simuliert werden – mit vereinfachten Berechnungsmodellen.
3. **Skalierung**: In einem späteren Stadium können mehrere Worker/Server Matches parallel berechnen – das ist ein horizontal skalierbares Problem, weil jedes Match unabhängig ist.

### Berechnungsstufen (Simulation Depth)

| Match-Typ | Detailtiefe | Berechnungsort | Dauer (ca.) |
|---|---|---|---|
| **Spieler-eigenes Match (SP)** | Vollständig (jede Sekunde, alle Attribute) | Client (WebWorker) | < 5 Sek. |
| **Spieler-eigenes Match (MP)** | Vollständig, deterministisch | Server (dedizierter Job) | < 5 Sek. |
| **MP-Match, andere Menschen** | Vollständig | Server | < 5 Sek. |
| **NPC-Matches der eigenen Liga** | Mittel (Ergebnis + Key Events) | Server, lazy | Millisekunden |
| **NPC-Matches anderer Ligen** | Minimal (nur Ergebnis, Tabelle) | Server, Batch | Microsekunden |

Diese Abstufung ist standard in Football-Manager-Spielen: Nur das eigene Match (und ggf. direkte Konkurrenten) wird detailliert simuliert[^4][^17]. Alles andere verwendet vereinfachte Formeln.

***

## Plausibilitätschecks & Sync

### Servervalidierung bei Command-Replay

Wenn der Client Commands offline gepuffert hat und beim Reconnect einspielt, prüft der Server jeden Command gegen den aktuellen State:

- Ist der Spieler noch verfügbar (kein Transferabschluss inzwischen)?
- Ist der Spieltag noch offen (Deadline nicht überschritten)?
- Ist die Taktik noch änderbar (kein `matchdayLocked`-State)?

Scheitert ein Command, wird er mit Fehlergrund zurückgewiesen und der Client erhält eine klare UI-Meldung. Kein Merge-Automat – klare Zurückweisung + neue Handlungsoption[^3].

### Determinismus der Match Engine

Für Replay-Fähigkeit und Server-Validierung sollte die Match Engine **deterministisch** sein: gleicher Input-State + gleicher RNG-Seed → immer gleiches Ergebnis. Das erlaubt:
- Replays auf Basis gespeicherter Seeds (keine Speicherung aller Frames nötig)[^3]
- Nachträgliche Verifikation durch den Server
- Debug-Möglichkeit bei gemeldeten Ergebnisanomalien

***

## Risiken & offene Entscheidungen

| Thema | Risiko | Empfehlung |
|---|---|---|
| **Offline-Commands mit Konflikt** | Spieler arbeitet offline, State ist veraltet | Kurze TTL für gecachte Read-Modelle, klare Fehlermeldungen bei Konflikten |
| **Reconnect-Timeout zu kurz** | Spieler in mobilem Tunnel verliert Match-Erlebnis | Async-Match: kein Timeout. Watch-Party: 3 Min. konfigurierbares Fenster |
| **Match Engine Performance im Worker** | Zu viele gleichzeitige Worker-Tasks auf Mobilgeräten | Simulation außerhalb Render-Zyklus timen, Ergebnisse gebuffert rendern |
| **Server-Last bei Matchday-Peak** | Alle Matches starten gleichzeitig | Quorum-Modell + gestaffelte Simulation + NPC-Abstufung |
| **IndexedDB-Limits auf iOS** | Safari kann IndexedDB unter Storage-Druck löschen | Wichtige Offline-Daten mit `navigator.storage.persist()` sichern |

### Offene Designfrage: Watch-Party bei Disconnect

Pausiert das Match, wenn ein Zuschauer (nicht Teilnehmer) die Verbindung verliert? Empfehlung: **Nein** – nur aktive Teilnehmer (also Manager mit Taktik-Eingabe) lösen eine Pause aus. Passive Zuschauer gehen einfach aus dem Stream.

***

## Empfohlener Ansatz für euer Projekt

**Für uns ist das richtige Modell:**

- **Singleplayer:** Vollständig offline. PWA rechnet alles lokal – Woche, Training, Events, Match (WebWorker). Keine Serverabhängigkeit.
- **Multiplayer – Managerwoche:** Offline möglich. Commands werden lokal gepuffert, bei Reconnect synced und validiert. Keine Match-Simulation lokal.
- **Multiplayer – Match:** Server berechnet deterministisch. Spieler schaut Live-Stream oder Replay. Verbindungsverlust stoppt die Simulation **nicht** – der Server rechnet weiter.
- **Watch-Party-Disconnect:** Kurzes Pause-Fenster (konfigurierbar, z. B. 3 Min.) für aktive Teilnehmer, danach Auto-Continue oder Kick.
- **2D-Darstellung in der PWA:** Technisch kein Problem. Canvas/OffscreenCanvas + WebWorker. Gleicher Renderer für SP (lokale Simulation) und MP (Server-Event-Stream).
- **NPC-Matches:** Abgestufte Berechnung – volle Simulation nur für relevante Matches, Rest via vereinfachte Formeln.

---

## References

1. [Asynchronous Multiplayer](https://docs.chilliconnect.com/guide/multiplayer-async/)

2. [Progressive web apps - MDN Web Docs - Mozilla](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) - A progressive web app (PWA) is an app that's built using web platform technologies, but that provide...

3. [ich-mochte-eine-Art-Fussballmanager-als-app-_Entwi.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_fdf1dd79-bbbe-41c4-a356-052e376b8b7c/820c4b98-64c9-4347-9e3e-cf52dc40d1ed/ich-mochte-eine-Art-Fussballmanager-als-app-_Entwi.md?AWSAccessKeyId=ASIA2F3EMEYEUN3OGD7N&Signature=5iUrUu%2FgI2zKbCbPVom27sIkpPk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEMv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIAv0NuUevEjiSTwZIZwnUExXTCzPoexKQG9Zplok3A4qAiEAmgb0HUHJgU8gXhyEKiviF9oBPA3AucnMvCjMDJ3Gve0q%2FAQIlP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw2OTk3NTMzMDk3MDUiDIoahq3%2BVUAuXBACWyrQBFFEXA0h%2BiZUXpAIcanbFG3nBD%2BpR2EOpUjgttjvBpSjgABlcdRXRBAlzYbnxUFN3bRG9%2FMJ7oRCCYWFx3l3kqkCdLGj0qJjs%2FEuNM9NrtPUwqrfnX3E4J9%2FyKeN1z3epunNFwxo5NXShoS2gijVN4uOqqZM5pxbrDujRnBm80odD1DVH3KBLzCf1%2BQQDCkMfMQr%2BWtpdfQEd34QUl9hrnezH7qjDH2ij%2FtDzMuB8qOt9Ly4XP%2FxoiWdZPFAG9cT5XVOScUwhOUH3H6t%2BjCtKRtDadJvRYEWUrervu2%2BrQUs%2FgWcDOFHKGIiv235eYfl0%2BsStbLZZ7hJvVMsb1jAbHm5PayEOZP9ZfO%2F6nAF8hUwZDRxe%2BJuZ7mAETglgazvAoxHZQNCnZFlNIUpUndvtwN9JLebYdw4viGHA9cZpEhdJ8bpmxm0lIb%2BCC4STLzwB7aOdo10VaxhE7f%2B0yDTcSNKBKWzSItxpwh48RCM2FtdGjnQkx2hMRCUntQXIEKWrHxXNO8JSF%2FTozWJkLMUFquUMIRjku93bGnyLPGHa7ZkkjWOsfbD%2B%2FAxDr5Aj3fQgK59wNkQZB2H%2FfXO7xN5OrZNOiH7I3lEL8Z0duSK60XkryXnqJGUFmN0LmzZelf8uuXMClg81gm5m8y6fBYEufdNrKagtjQS3AKpGLq2P83fYdKV5VcBdQi%2F5EzmvWN0vj3D3kQSoCm9CjONZlW%2F4YvaVWCfe%2FKBY%2FEFZlI5Hl9JSwwT6nTmZFYbO3pRHPw1SPNWnblsOrt9Brdm2zuKtXQwupvb0AY6mAFm9k2STuqOFg1iL%2BZhf6g77ozKfUFJl6VDW9vEUFK4%2F3bBQcwoVZQxhwAqrr4i4w0hUlKdpdjYIrwme9cyx80PN1gO080ND%2FvhtEXJZyXchi9GVZ36MY0pz20NmTTl%2BhmflHZps0UTbiJSY1SoW6rRxJ%2Bt%2FcSih2rc844eqCiDHOIRYC16SRjaadcxY4RuUXDyL4Kf9EbO%2Bw%3D%3D&Expires=1779882893) - Die wichtigsten klaren Entscheidungen wren - Singleplayer lokal autoritativ, Multiplayer serverautor...

4. [Is the game scripted? : r/footballmanagergames - Reddit](https://www.reddit.com/r/footballmanagergames/comments/pp7rbd/is_the_game_scripted/) - The FM match engine is essentially doing calculations every second based on your player's attributes...

5. [Node JS Football / Soccer Simulation Engine Module](https://aidensgallyvanting.blogspot.com/2018/01/node-js-football-soccer-simulation.html) - A football / Soccer simulation engine for use in Node JS and is available as an np download.

6. [Question about server vs client : r/gamedev - Reddit](https://www.reddit.com/r/gamedev/comments/8tdmaa/question_about_server_vs_client/) - The server takes those inputs, calculates what's ACTUALLY happening in the game and sends that data ...

7. [What are Server-Authoritative Realtime Games? [Updated for 2026]](https://www.metaplay.io/blog/server-authoritative-games) - Server-authoritative games ensure all player actions are simulated and validated by the server, prov...

8. [Running JS physics in a webworker - proof of concept](https://dev.to/jerzakm/running-js-physics-in-a-webworker-part-1-proof-of-concept-ibj) - series: Exploring Javascript physics world Web workers are a great way of offloading...

9. [Using Web Workers and OffscreenCanvas for Smooth Rendering in JavaScript](https://medium.com/@lightxdesign55/using-web-workers-and-offscreencanvas-for-smooth-rendering-in-javascript-1c9df43fdb52) - Smooth animations and responsive graphics are key to delivering high-quality user experiences — espe...

10. [Creating web based football simulation game [closed] - Stack Overflow](https://stackoverflow.com/questions/16897743/creating-web-based-football-simulation-game) - I am creating an online football/soccer management game. I want to implement some simple 2d (in futu...

11. [Game Comparison - Football Manager](https://www.footballmanager.com/compare-games) - Discover what the differences are between each Football Manager 2024 game across platforms, so you c...

12. [What's the correct way to handle disconnects/reconnects with ...](https://discussions.unity.com/t/whats-the-correct-way-to-handle-disconnects-reconnects-with-lobbies-relay-netcode/894293) - I’m trying to dissect the UGS sample project but am having a hard time understanding the way to prop...

13. [Pause match on disconnect - General Discussion - Overwatch Forums](https://us.forums.blizzard.com/en/overwatch/t/pause-match-on-disconnect/303641) - I have a suggestion on the issue of disconnects in a competitive match: Pause the game automatically...

14. [How to Successfully Create a Reconnect Ability in Multiplayer Games](https://www.getgud.io/blog/how-to-successfully-create-a-reconnect-ability-in-multiplayer-games/) - Implementing a robust reconnect feature in a multiplayer game is crucial for ensuring a seamless and...

15. [Reconnecting to authoritative server match after disconnect best practice](https://forum.heroiclabs.com/t/reconnecting-to-authoritative-server-match-after-disconnect-best-practice/4498) - Hello there! At the moment I’m writing a feature to handle re-connections/re-authentications if a pl...

16. [How should a player rejoin a match after reconnecting? - Heroic Labs](https://forum.heroiclabs.com/t/how-should-a-player-rejoin-a-match-after-reconnecting/2601) - The server keeps the matches going just fine and the client authenticates ok, but match data doesn't...

17. [Match Engine / Simulation - EHM The Blue Line](https://www.ehmtheblueline.com/forums/viewtopic.php?t=5490) - The reason I ask is that if the game is simulating every second of the match then technically you'll...
## Related

- [[../incoming-design-research-2026-05-27]]
- [[../match-engine-runtime-strategy]]
- [[../offline-mvp-scope-and-sync-strategy]]
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
- [[../../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
