---
title: "Pre-Mortem 2026-05-20 · 14 · Brand, PR & Crisis Communications + Re-Branding"
status: current
tags: [research, pre-mortem, brand, pr, crisis-comms, rebrand, trademark, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-14
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-04-monetization]]
  - [[PM-2026-05-20-07-live-ops-and-client-telemetry]]
  - [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
  - [[../competitor-matrix]]
---

# Pre-Mortem 2026-05-20 · 14 · Brand, PR, Crisis Comms + Re-Branding Proposals

> **Failure-Headlines**
> - ”žSports Interactive (SEGA)-Abmahnung — Rebrand 3 Wochen vor Soft-Launch — alle Wishlists, Discord, Pressekontakte verloren."
> - ”žFootball-Reddit-Thread mit 4 k Upvotes 'Pay-to-Win-Klon' — 18 h Schweigen — kein Pressekit zur Korrektur."
> - ”žYouTube-Influencer entdeckt Stealth-Beta, 200k Views; Server bei 12k unerwarteten Sign-ups — 'Wir machen kein Marketing'-Out-of-Office wird Lachnummer."
> - ”žSave-Korruptions-Bug viral — defensiv statt blameless reagiert — #FootballManagerXSaveScam trending 6 Tage."
> - ”žRe-Brand-Kandidat zwischen Domain-Recherche und Anmeldung von Cybersquatter geschnappt — fünfstellige Auktion."

## Top Failure-Hypothesen

### PM-2026-05-20-14-F-01 — Marken-Kollision (re-anchored from F-08-05)

```yaml
id: PM-2026-05-20-14-F-01
priority: P0
domain: brand
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - signal: "Erster Crawler-Hit / Search-Indexing der Domain football-manager-x.*"
  - signal: "Erste externe Erwähnung (Blog/Reddit/Discord außerhalb interner Tests)"
  - signal: "Eingehende Briefpost / E-Mail UK/DE-IP-Kanzlei (Bird&Bird, Hogan Lovells, Taylor Wessing)"
mitigation_summary: "Sofort-Rebrand vor jedem Public-Asset; FTO durch DE-Markenanwältin; DPMA + ggf. EUIPO; defensive Domain-Sicherung Top-3-Finalisten"
linked_adrs: [[ADR-0007-naming-schema]]
linked_specs: [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
linked_code: ["packages/*", "apps/*"]
sources:
  - title: "Sports Interactive"
    url: "https://www.sports-interactive.com/"
    accessed: "2026-05-20"
    publisher: "Sports Interactive Ltd. (SEGA)"
    confidence: high
  - title: "Game Developer Legal Lessons"
    url: "https://www.gamedeveloper.com/business/5-minute-legal-lessons-for-indie-devs---part-2-game-names-and-trade-mark-troubles"
    accessed: "2026-05-20"
    publisher: "Game Developer"
    confidence: high
  - title: "DPMA Gebühren"
    url: "https://www.dpma.de/service/gebuehren/marken/index.html"
    accessed: "2026-05-20"
    publisher: "DPMA"
    confidence: high
  - title: "Lexology Indie Rebrand"
    url: "https://www.lexology.com/library/detail.aspx?g=5f0dc567-4bbe-4f70-a2db-e7eaa53a2bf3"
    accessed: "2026-05-20"
    publisher: "Lexology"
    confidence: high
verification_notes: "TMview > 40 aktive Marken Sports Interactive in Nice 9/41 EU. '-x'-Suffix beseitigt Verwechslungsgefahr NICHT (BGH-Linie). Streitwert 50–100 k €."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: M
created: 2026-05-20
updated: 2026-05-22
```

(Volle Hypothese in [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-05|08-F-05]]; hier Brand-Perspektive.)

**Mitigation.** Sofortiger Rebrand vor jedem Public-Asset (Domain, Repo, Social-Handles). FTO Top-3-Finalisten (Heimrunde/Klubkönig/Formationfuchs). DPMA-Anmeldung (€ 290 + ggf. € 200 beschleunigt). EUIPO später (€ 850). Defensive Domains Top-3-Finalisten × 4 TLDs (~€ 360/Jahr).

### PM-2026-05-20-14-F-02 — Kein Crisis-Comms-Playbook für erste negative Virality

```yaml
id: PM-2026-05-20-14-F-02
priority: P2
domain: brand
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - metric: "Reddit/Twitter Mention-Spike"
    threshold: "> 5× Baseline binnen 4h"
  - metric: "Steam-Review-Velocity-Anomalie"
    threshold: "> 3Ïƒ negativ"
mitigation_summary: "Crisis-Comms-Playbook mit 6–7 Szenario-Templates (Atlassian-Vorlagen adaptiert), Statuspage, 4-Stunden-Response-SLO"
linked_adrs: []
linked_specs: [[PM-2026-05-20-07-live-ops-and-client-telemetry]]
linked_code: []
sources:
  - title: "Atlassian Incident Communication Templates"
    url: "https://www.atlassian.com/incident-management/incident-communication/templates"
    accessed: "2026-05-20"
    publisher: "Atlassian"
    confidence: high
  - title: "GitLab Incident Communications Plan"
    url: "https://handbook.gitlab.com/handbook/marketing/corporate-communications/incident-communications-plan/"
    accessed: "2026-05-20"
    publisher: "GitLab"
    confidence: high
  - title: "Wikipedia Review-Bombing"
    url: "https://en.wikipedia.org/wiki/Review_bomb"
    accessed: "2026-05-20"
    publisher: "Wikipedia"
    confidence: medium
verification_notes: "Starbreeze 2018, Sony PSN/Helldivers-2 2024: defensive Reaktion ist der Schaden, nicht das Event."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Crisis-Comms-Playbook (`docs/40-Operations/crisis-playbook.md`): Atlassian-Templates adaptiert für 6 Szenarien (siehe F-07). Pro Szenario: Decision-Tree (acknowledge/defend/silent-fix), 3 Message-Drafts (kurz/mittel/lang), Escalation-Path, Update-Cadence (≥ 1 h Interval). Statuspage als single source of truth. 4-Stunden-Response-SLO bei P0-Brand-Events (öffentliche Anschuldigung > 100 Engagement-Signale). **Inviolable rule**: erste Antwort ≤ 4 h = ”žWir sehen das, untersuchen, melden uns binnen X h" — niemals defensiv, niemals Schuld zuweisen, immer zeitliche Verbindlichkeit.

### PM-2026-05-20-14-F-03 — Stealth-Beta + zufällige Entdeckung durch Football-Press/Influencer

```yaml
id: PM-2026-05-20-14-F-03
priority: P3
domain: brand
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - signal: "Erster externer Backlink (Search Console / Ahrefs free)"
  - signal: "Erster Discord-Join außerhalb persönlichem Netzwerk"
  - signal: "Erster Google-Alert-Hit auf Brand-Name"
mitigation_summary: "Stealth-Mode-Page (1-Screen, klare Botschaft, Email-Capture), Pressekit ab Tag-1, Founder-Statement-Vorlage für 'unerwartete Coverage'"
linked_adrs: []
linked_specs: []
linked_code: ["apps/landing/"]
sources:
  - title: "How To Market A Game (Chris Zukowski)"
    url: "https://howtomarketagame.com/"
    accessed: "2026-05-20"
    publisher: "Chris Zukowski"
    confidence: high
  - title: "Steam Wishlist Conversions (GameDiscoverCo)"
    url: "https://newsletter.gamediscover.co/p/the-state-of-steam-wishlist-conversions"
    accessed: "2026-05-20"
    publisher: "GameDiscoverCo"
    confidence: high
verification_notes: "Indie-Football-Games werden von Football-Bloggern (FM Blog, FMHub), YouTubern (LOLLUJO, ZEALAND, FM Stag), Reddit-Mods aktiv gesucht — gerade weil FM26 Backlash hat."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Stealth-Mode-Landing-Page mit präzise gesetzter Botschaft: (a) 1 Satz ”žwas ist es", (b) ”žStealth Beta, Soft-Launch Q4 2026 — KEIN Marketing", (c) Email-Capture für Closed-Beta-Invites, (d) Double-Opt-In DSGVO, (e) keine Capsule-Art bevor Rebrand fixiert. Explizit: ”žwir sind kein Football Manager — Roguelite-Reinterpretation des Genres". Pressekit-Stub verlinkt von Landing-Page ab Beta-Tag-0. Founder-Statement-Vorlage `docs/40-Operations/unsolicited-coverage-response.md`.

### PM-2026-05-20-14-F-04 — Single-Founder-Voice ohne klare Tone-Guidelines

```yaml
id: PM-2026-05-20-14-F-04
priority: P3
domain: brand
probability: 4
impact: 3
score: 12
confidence: medium
early_warning:
  - signal: "Reddit-DM 'are you a real dev or marketing team?'"
  - signal: "Inkonsistente Tone-Wahrnehmung in Discord-Feedback"
mitigation_summary: "Voice-Style-Guide (1 Seite): Ich-Form immer, Demut > Marketing-Speak, Transparenz über Limits, Daten > Versprechen"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Reddit Astroturfing Risks"
    url: "https://www.subredditsignals.com/blog/reddit-astroturfing-what-every-saas-founder-must-know"
    accessed: "2026-05-20"
    publisher: "Subreddit Signals"
    confidence: medium
verification_notes: "r/footballmanagergames + r/gamedev wittern Astroturfing in Millisekunden. Sock-Puppet = Permaban der Brand."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: XS
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Voice-Style-Guide (1 Seite, `docs/30-Product/voice-style-guide.md`): **Ich-Form** (echter Solo-Dev, niemals "our team"), **Demut > Hype** (zeige Zahlen, nicht Adjektive), **Transparenz über Limits** ("Soft-Launch, ich erwarte Bugs, kein Support"), **Daten statt Versprechen**. 5 Sample-Posts pro Plattform. **Hard Rule**: kein Sock-Puppet, kein zweiter Brand-Account vom selben Founder.

### PM-2026-05-20-14-F-05 — Pressekit-Absence beim ersten Journalisten-Anfrage

```yaml
id: PM-2026-05-20-14-F-05
priority: P3
domain: brand
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - signal: "Erste E-Mail 'können wir Screenshots/Logo haben?'"
  - signal: "Erster Tweet eines Verified-Journalisten"
mitigation_summary: "Pressekit ab Soft-Launch-Tag-0 unter /press: Logo, 8+ Screenshots, ≤90s Trailer, Fact-Sheet (DE+EN), Founder-Bio, ZIP"
linked_adrs: []
linked_specs: []
linked_code: ["apps/landing/press/"]
sources:
  - title: "presskit() Rami Ismail"
    url: "https://dopresskit.com/"
    accessed: "2026-05-20"
    publisher: "Rami Ismail"
    confidence: high
  - title: "presskit.gg modern alternative"
    url: "https://presskit.gg/"
    accessed: "2026-05-20"
    publisher: "presskit.gg"
    confidence: high
verification_notes: "presskit() seit ~2017 nicht gewartet (PHP 5/FTP). Alternativen: presskit.gg, eigenes statisches Pressekit via Astro/Next.js."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Statisches Pressekit `/press`. Pflichtinhalte (Rami-Ismail-Standard): Logo PNG transparent + SVG; Fact-Sheet 1-Pager DE+EN (Name, Genre, Plattform, Release-Date ”žTBA Q4 2026", Preis ”žFree-to-Play", Languages); 8+ Screenshots 1920×1080 (Squad, Tactic, Match, Saison, Hauptmenü); 1 Trailer ≤ 90 s (zunächst No-Audio-Loop OK); Founder-Bio + Headshot; Brand-Guidelines; ZIP-Download; Pressekontakt-Email `press@<brand>.de`. Tooling: kein PHP-presskit(), stattdessen MD/MDX in Landing-Page-App.

### PM-2026-05-20-14-F-06 — Zero-Cost-Mention-/Sentiment-Monitoring nicht aufgesetzt

```yaml
id: PM-2026-05-20-14-F-06
priority: P2
domain: brand
probability: 5
impact: 3
score: 15
confidence: high
early_warning: []  # this finding IS the early-warning system
mitigation_summary: "Google Alerts + Talkwalker Alerts (free) für Web; F5Bot (free) für Reddit; X/BlueSky-Bookmarklets; Discord-Bot für Brand-Keywords"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Brand Monitoring 2026 Tools"
    url: "https://www.therankmasters.com/insights/brand-monitoring/best-brand-monitoring-tools-with-real-time-alerts"
    accessed: "2026-05-20"
    publisher: "Rankmasters"
    confidence: medium
  - title: "Free Social Listening Tools"
    url: "https://www.socialchamp.com/blog/free-social-media-listening-tools/"
    accessed: "2026-05-20"
    publisher: "Social Champ"
    confidence: medium
verification_notes: "Brand24 Preisanstieg Q4-2025: 79$ → 199–249$ Einstieg. Mentionlytics 69$. Talkwalker Enterprise 12k$/Jahr. Free-Stack ist machbar."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: XS
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** **Zero-Cost-Stack** (ab Tag-0): (1) Google Alerts für Brand + Misspellings. (2) Talkwalker Alerts als Backup für Web-Mentions. (3) F5Bot für Reddit + HackerNews. (4) X-/BlueSky-Search-Bookmarklet 1×/Tag (5 min). (5) Discord-Bot (selbst gehostet ~30 LOC Python) `<Brand>BrandBot` für Keyword im eigenen Server + 3 strategischen Servern. (6) YouTube-Channel-Watch via RSS auf 5 Football-Game-Channels.

**Verifikation.** Drill alle 30 Tage: synthetischer Brand-Mention-Post. Alert in < 30 min.

### PM-2026-05-20-14-F-07 — Crisis-Comms-Message-Archetypes für 7 Szenarien fehlen

```yaml
id: PM-2026-05-20-14-F-07
priority: P2
domain: brand
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - "siehe F-06 (Mention-Monitoring liefert die Alerts)"
mitigation_summary: "7 Templates in docs/40-Operations/crisis-templates/: outage, save-corruption, account-hack, p2w-accusation, a11y-complaint, gdpr-complaint, tm-cease-desist"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Atlassian Template Generator"
    url: "https://www.atlassian.com/incident-management/template-generator"
    accessed: "2026-05-20"
    publisher: "Atlassian"
    confidence: high
  - title: "Public Postmortems (openstatus)"
    url: "https://www.openstatus.dev/guides/public-postmortem-underrated-marketing"
    accessed: "2026-05-20"
    publisher: "OpenStatus"
    confidence: high
verification_notes: "Atlassian-Vorlagen battle-tested, aber B2B-flavored. Für Indie-Game-Audience emotionaler/persönlicher umformulieren."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** 7 Crisis-Templates (≤ 200 Wörter, DE+EN, Variablen-Block, publish-checklist): (1) **Outage** Atlassian-Vorlage. (2) **Save-Corruption-Mass-Event**: erst Bestätigung (Daten-Erhalt-Prio), dann Recovery-Plan, Postmortem-Versprechen binnen 7 Tagen. (3) **Account-Hack-Claim**: nie Schuld zuweisen vor Forensik; Passwort-Reset-Angebot; 2FA-Reminder. (4) **P2W-Accusation** (post-MVP): Daten-driven, Drop-Rate-Tabellen, Roadmap-Anker, nie defensiv. (5) **A11y-Complaint**: Anerkennung als Bug, Triage-Issue öffentlich, konkretes Fix-Datum. (6) **GDPR-Complaint**: 72h-Frist Art. 33; BfDI-Hamburg/Berlin-Kontakt; Privacy-Page-Link. (7) **TM-Cease-and-Desist**: **NIEMALS öffentlich** kommentieren vor Anwältin; Standard-Acknowledge-Brief; intern Renaming-Runbook starten.

### PM-2026-05-20-14-F-08 — Reputation-Archiv fehlt

```yaml
id: PM-2026-05-20-14-F-08
priority: P4
domain: brand
probability: 3
impact: 2
score: 6
confidence: medium
early_warning:
  - signal: "Erste positive Erwähnung in Tier-3-Outlet"
mitigation_summary: "Markdown-Datenbank docs/60-Research/reputation-archive.md mit URL+Datum+Quote+Permissions-Status; monatliches Bookmark-Sweep"
linked_adrs: []
linked_specs: []
linked_code: []
sources: []
verification_notes: "Testimonials = Marketing-Asset-Goldstandard für Soft-Launch-to-Launch-Übergang."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: XS
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** `docs/60-Research/reputation-archive.md`: URL, Datum, Autor, Outlet, Quote (≤ 2 Sätze), Sentiment, **Permission-Status** (explizit angefragt? ja/nein/standing), Use-Cases. Monatlich 15-min-Sweep. Bei wichtigen Quotes proaktiv Permission (”žHi, danke für den positiven Kommentar — darf ich dich auf der Landing-Page zitieren?").

### PM-2026-05-20-14-F-09 — Apology-/Reparatur-Stil ohne Muster; Discord/Reddit-Astroturfing-Risiko

```yaml
id: PM-2026-05-20-14-F-09
priority: P3
domain: brand
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - signal: "Erste Discord-Spam-Beschwerde gegen Founder-Account"
  - signal: "Reddit-Mod-Removal eines Founder-Posts wegen 'self-promotion'"
mitigation_summary: "Engagement-Regeln 90/10; Reddit-Karma-Building 3 Mo. vor erstem Self-Promo; Apology-Patterns GitLab-Style (Acknowledge < 4h, Diagnose < 24h, Promise < 48h, Postmortem < 7d)"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "GitLab Public Postmortem Marketing"
    url: "https://www.openstatus.dev/guides/public-postmortem-underrated-marketing"
    accessed: "2026-05-20"
    publisher: "OpenStatus"
    confidence: high
  - title: "GitLab Blameless RCA"
    url: "https://handbook.gitlab.com/handbook/customer-success/professional-services-engineering/workflows/internal/root-cause-analysis/"
    accessed: "2026-05-20"
    publisher: "GitLab"
    confidence: high
verification_notes: "GitLab-DB-Loss-Postmortem 2017: brutale Ehrlichkeit + Failure-Modes + Fix-Plan = Reputation-Gewinn."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: XS
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Engagement-Regeln (`docs/30-Product/engagement-rules.md`): **90/10-Regel** (90 % Hilfe/Antwort, 10 % Brand-Posts). **Karma-Floor**: Reddit-Self-Promo erst > 500 Karma + > 3 Mo Account-Alter + nur erlaubte Subs (r/IndieDev, r/footballmanagergames Self-Promo-Friday). **Disclosure-Rule**: bei jedem Brand-Bezug volle Offenlegung im ersten Satz. **Apology-Patterns** (GitLab): Acknowledge < 4 h → Diagnose < 24 h → Promise < 48 h → Postmortem-Publish < 7 d, blameless. **Silent-Fix nur** wenn keine Außenwirkung + keine Daten betroffen + keine öffentliche Beschwerde.

## Part B — Re-Branding-Kandidaten (CORE OUTPUT)

**Search-URL-Template:**
- TMview: `https://www.tmdn.org/tmview/#/tmview/results?_searchKey=<NAME>&_niceClass=9,41&_jurisdiction=DE,EM`
- DPMA: `https://register.dpma.de/DPMAregister/marke/einsteiger?LANG=de`
- EUIPO eSearch plus: `https://euipo.europa.eu/eSearch/#advanced/trademarks/1/100/n1=MarkVerbalElementText&v1=<NAME>`

**Domain-Status-Hinweis**: DNS-Resolution-Tests in Sandbox unzuverlässig. Alle Angaben ”žplausibel verfügbar (DNS-quiet), WHOIS-Verifikation vor Registrierung nötig". Founder muss `whois <name>.{de,com,gg,app}` lokal + auf https://denic.de/webwhois (.de) + https://www.namecheap.com (.com/.app/.gg) cross-checken.

### Candidate Comparison

| # | Name | Etymology / Vibe | TMview Nice 9/41 | Domain (.de/.com/.gg/.app) | Risk | Notes |
|---|---|---|---|---|---|---|
| 1 | **Heimrunde** | "Heim-Runde" = Heimspielrunde, Roguelite-Run-Doppeldeutigkeit. Warm, vereinsnah, DE | TMview `heimrunde` keine identischen Treffer | needs WHOIS — DNS-quiet | **Low** | Sehr DE; EN müssen "home-round" lernen. Roguelite-Bezug subtil |
| 2 | **Trainerleben** | "Trainer-Leben" = career-as-coach. Lebenswelt-Frame statt Sim-Frame. DE+EN pronounceable | TMview `trainerleben` kein Treffer | needs WHOIS | **Low** | Möglicherweise generisch-beschreibend für Coaching-Apps; Distinctiveness braucht Logo |
| 3 | **Klubkönig** | "Klub-König" = König-deines-Klubs, royaler Roguelite-Vibe. DE, Umlaut | TMview `klubkönig`/`klubkoenig` kein Treffer | needs WHOIS — Punycode-Risiko `.de` `xn--klubknig-66a` | **Low-Medium** | Umlaut-Punycode-Risiko; ASCII `klubkoenig` als Primärdomain. International limitiert (König) |
| 4 | **Sechzehnerklub** | "Sechzehner" = Strafraum-Slang DE-Football. Insider-Brand für Fans | TMview `sechzehnerklub` kein Treffer | needs WHOIS | **Low** | 14 Zeichen, unhandlich für URLs. International unbekannt. Hoch-distinktiv |
| 5 | **Doppelpasser** | "Doppelpass" = Football classic + Streetpass-Vibe. Single-word, knackig | TMview `doppelpasser` kein Treffer | needs WHOIS | **Medium** | "Doppelpass" als Football-Begriff verbreitet, könnte zu beschreibend (§ 8 Abs. 2 Nr. 2 MarkenG). Wortbildmarke statt Wortmarke |
| 6 | **Elfersaga** | "Elfer-Saga" = Penalty-Saga, Roguelite-Story-Frame. Klangvoll, modern | TMview `elfersaga` kein Treffer | needs WHOIS | **Low-Medium** | "Saga" ist King-Trademark in Nice 9/41 (Candy Crush Saga) — aggressive TM-Strategie. Risiko-Check mit Anwältin. Backup: `Elferzeit` |
| 7 | **Formationfuchs** | "Formation" + "Fuchs" = tactical fox. Doppelsprachig denkbar | TMview `formationfuchs` kein Treffer | needs WHOIS | **Low** | Charmant, einprägsam. "Fuchs" gut DE/EN-pronounceable. Mascot-Potential |
| 8 | **Tribüne Tactics** | "Tribüne" (DE stand/grandstand) + "Tactics" = bilingual | TMview `tribüne tactics` kein Treffer | needs WHOIS | **Low** | Bilinguale Brand stark bei DE-first/EN-second. Umlaut-Behandlung wie #3. Längere Domain |
| 9 | **Viereckpass** | "Viereck-Pass" = tactical drill (rondo). Coaching-Vokabular | TMview `viereckpass` kein Treffer | needs WHOIS | **Low** | Sehr Football-fachlich. Limitiert int. Reichweite. Coaching-Authentizität-Plus |
| 10 | **Aufstiegsroman** | "Aufstieg" + "Roman" = literarische Roguelite-Career | TMview `aufstiegsroman` kein Treffer | needs WHOIS | **Low** | Sehr DE, literarisch-erwachsen. Schwierige Aussprache für EN |
| 11 | **Kaderschmiede** | "Kader-Schmiede" = squad-forge. Bereits im Football-Discourse | TMview `kaderschmiede` einzelne Treffer DE für andere Klassen (Bildung/Coaching); Nice 9/41 frei | needs WHOIS — `.de` Caution (bereits begrifflich in Benutzung) | **Medium** | Etabliertes Fachwort = niedrige Distinctiveness. Wortbildmarke + Disclaimer-Strategie nötig |
| 12 | **Standardsituation** | "Standard-Situation" = set-piece DE-football. Klassisch, fachlich | TMview kein Nice 9/41 Treffer | needs WHOIS | **Medium-High** | Sehr beschreibend → Eintragungs-Hürde (§ 8 Abs. 2 Nr. 2 MarkenG). Eventuell als sekundärer Werktitel |

### Top-3 Finalisten

1. **Heimrunde** — Top-Pick. Kurz, klangvoll, transportiert Roguelite-DNA (`Runde` = run/round) UND Football-Heim-Atmosphäre. Distinctiveness hoch, keine TMview-Kollision Nice 9/41 sichtbar. Logo-Potential stark (Stadion-Silhouette + Würfel-Element). EN ”žHome Round" patent-mäßig schwächer, aber DE-first-Markt zentral. **Risiko**: kleine deutsche Audio/Podcast-Marken mit ”žHeimrunde" möglich (Nice 41 audio/streaming) — Anwältin muss prüfen.

2. **Klubkönig** — Strong. Royaler Roguelite-Twist, warm, vereinsnah. Stark distinktiv durch Kompositum. **Risiko**: Umlaut-Domain-Komplexität → `klubkoenig.de/.com` als Primär-URLs, `klubkönig` als Brand-Spelling.

3. **Formationfuchs** — Smart. Charmant, einprägsam, Mascot-Potential (”žclever like a fox"). Funktioniert auch im EN-Markt halbwegs (”žFormation Fox" als sekundärer Brand-Layer). Distinctiveness hoch.

**Backup-Finalisten**: Sechzehnerklub (distinktiv aber lang), Trainerleben (intuitiv aber eventuell zu beschreibend), Elfersaga (gefällig aber King-Saga-Risiko).

### Process Notes for FTO Lawyer Engagement

- **Anwältin-Auswahl**: DE-Markenanwältin mit Software-/Games-Erfahrung. Hamburg/Berlin/Köln/München, IP-Schwerpunkt (PWB, ABEL, Spirit Legal). Stundensatz 250–350 €/h.
- **Kosten**:
  - Erstberatung 1–2 h: € 300–700
  - FTO Top-3 Nice 9/41 DE+EU: € 500–1.500
  - DPMA-Anmeldung: € 500–800 + € 290 Amt (3 Klassen) + € 200 beschleunigt optional
  - EUIPO (nach Beta-Success): € 850–1.200 Anwalt + € 850 Amt (1.) + € 50 (2.) + € 150 (ab 3.)
  - **Gesamt MVP-Phase (DPMA + Top-1)**: **~€ 2.500**
  - **Welle-2 (mit EUIPO + 18 Mo Domains)**: **~€ 5.000**
- **Timeline**: FTO 2–4 Wochen, DPMA 6–8 Mo (3–4 beschleunigt), EUIPO 4–6 Mo. **Markenschutz 4–6 Monate vor Soft-Launch starten.**
- **Auftrag**: (1) FTO Top-3 Nice 9/41 DE-national + EU-weit + Quick-Check USPTO. (2) Distinctiveness-Bewertung (§ 8 Abs. 2 Nr. 1, Nr. 2 MarkenG). (3) Empfehlung Wort vs Wortbildmarke. (4) Schutzbereich: Nice 9 + 41 oder zusätzlich 25 (Bekleidung) + 35 (Werbung)?
- **Zwischen FTO und Eintragung**: defensive Domain-Sicherung sofort (~€ 10/Domain/Jahr `.de`, ~€ 12 `.com`, ~€ 70 `.gg`, ~€ 15 `.app` = ~€ 120/Name × 3 Finalisten = **~€ 360/Jahr**).
- **Social-Handle-Sicherung**: Discord-Server, BlueSky, Mastodon, X, Reddit, GitHub-org parallel für alle 3 Finalisten (kostenlos, ~30 min/Name).

## Part C — Marketing-Stance MVP (Stealth-Strategy)

**User-Decision (Welle-2)**: MVP = **stealth-beta / soft-launch only**, kein aktives Marketing, kein Runtime-LLM, kein App-Store.

**Empfehlungen:**

1. **Schweigen ≠ Unsichtbarkeit, sondern *kuratierte Sichtbarkeit*.** ”žNo marketing" heißt nicht ”žno presence". Gepflegte Owned-Channels (Landing-Page, GitHub-README, Discord-Beschreibung) müssen für zufällige Entdecker funktionieren.

2. **Coming-Soon-Landing-Page: JA** (mit Maßgaben):
   - 1-Screen-Single-Pager unter `<brand>.de`.
   - **Kernmessage**: 1-Satz-Was, 1-Satz-Wann, 1-Satz-Wie. Beispiel: ”ž*<Heimrunde>* ist eine Roguelite-Reinterpretation des Football-Manager-Genres. Geschlossener Beta-Start Q3 2026 in DE/EN. Trage dich für eine Einladung ein."
   - **Anti-Pattern vermeiden**: ”žRevolutionary", ”žGame-changing", ”žAAA-quality" → out (wir sind Single-Founder-Indie).
   - **Email-Capture**: Double-Opt-In via Buttondown/Listmonk/Sendy (self-hosted GDPR), DSGVO-Footer, transparenter Use (”žmax 1 Mail/Mo bis Beta, dann Invite").
   - **Zielgröße**: 200–500 Pre-Beta-Email-Signups (realistisch 0-Marketing-Stealth in 4 Monaten via word-of-mouth + organische Discovery).

3. **Closed-Beta-Invite-Strategie**: Welle-Roll-Out 50 → 200 → 500 → 2.000. Bei 2.000 Soft-Launch-Switch. Wave-Trigger nicht ”žDatum" sondern *”žStabilität-SLO erfüllt"* (Crash-Rate < 0.5 %, P95-Latency stabil, 10 aufeinanderfolgende Tage ohne P0).

4. **Stealth-to-Launch-Switch-Kriterien**:
   - SLO-Stabilität min 30 Tage
   - 50+ Feedback-Items aus Beta verarbeitet
   - Pressekit fertig (F-05)
   - Crisis-Playbook getestet (1 Tabletop-Drill)
   - Brand-Marken-Anmeldung DPMA eingereicht (Antrag genügt)
   - Mention-Monitoring läuft 60+ Tage

5. **Defensive Social-Handle-Reservierung** für gewählten Brand: Discord (Server), BlueSky, Mastodon (norden.social oder eigener Single-User), X/Twitter (defensiv), Reddit (defensiv, keine Postings), YouTube (defensiv), GitHub (org-rename).

6. **Was *nicht* tun**:
   - Keine Steam-Page (würde Wishlist-Aufbau erzwingen, < 50 Reviews = Steam zeigt dich nicht).
   - Kein Reddit-Posting in r/footballmanagergames (Mod-Risiko, siehe F-09).
   - Keinen Discord-Boost in fremden Servern.
   - Keine Pressekit-Versendung an Outlets (nur reaktiv auf Anfragen).
   - Keine Devlog-Vlog-Serie (frisst Solo-Founder-Zeit).

## Quantitatives Modell

**Indie-Game-Marketing-Benchmarks:**
- Steam Wishlist Conversion: Median 0.15× (>25k WL), 0.10× (>10$). F2P andere Mechanik → irrelevant MVP.
- Steam Next Fest: 2.000 WL Minimum (Chris Zukowski).
- Capsule-Art-Conversion: 68–88 % Next-Fest-WL aus Capsule + Screenshots + Trailer — nicht aus Demo.
- < 50 Steam Reviews = quasi unsichtbar.
- Indie-Landing-Page-Email-Conversion: 8–15 %.

**Brand-Monitoring-Tier-Preise 2026:**
- Google Alerts / Talkwalker Alerts / F5Bot: **free**
- Brand24: $199–249/Mo (Q4-2025 erhöht von $79)
- Mentionlytics: $69/Mo (Solo)
- Talkwalker Enterprise: ab $12.000/Jahr
- **MVP-Phase**: **$0/Mo**

**Kostenrahmen Brand-Sicherung Soll-Budget** (1 Brand, 18 Mo Schutz):

| Posten | Kosten |
|---|---|
| Anwältin FTO + DPMA-Begleitung | € 1.500–2.500 |
| DPMA-Gebühr (Klasse 9, 41) | € 290 |
| EUIPO-Erweiterung (nach Beta-Success) | € 1.700–2.100 |
| Defensive Domains (3 Finalisten × 4 TLDs, 1 Jahr) | ~€ 360 |
| Social-Handle-Reservierung | € 0 |
| **MVP-Phase nur DPMA Top-1** | **~€ 2.500** |
| **Welle-2 mit EUIPO + 18 Mo** | **~€ 5.000** |

## SLO-Vorschläge

| SLO | Ziel |
|---|---|
| Brand-Mention-Response-Time | P0-Event ≤ 4 h Acknowledge, ≤ 24 h Bestätigung |
| Mention-Monitoring-Coverage | 100 % Brand-Mentions auf Reddit + Top-5-YT + Google-Index in < 30 min (Quartärlicher Drill) |
| Press-Kit-Availability | `/press` 99,9 % Uptime; ZIP ≤ 90 Tage alt |
| Crisis-Comms-Template-Freshness | alle 7 Templates jährlich reviewed; keiner > 12 Monate |
| Brand-Domain-Renewal | T-30 vor Ablauf verlängert; Auto-Renew + Pre-Pay ≥ 2 Jahre |

## Test-Plan

**Crisis-Comms-Tabletop (quartärlich, 60 min):**
1. **TM-Cease-and-Desist Drill**: Anwältinnen-Schreiben ”žrebrand binnen 14 Tagen" Mock. Founder in 30 min: (a) Notfall-Checkliste, (b) Anwältin-Termin, (c) Public-Comms-Embargo, (d) Backup-Brand-Auswahl.
2. **Reddit-Review-Bombing Drill**: Mock-Post ”žPay-to-Win-Scam" mit 2k Upvotes. Response < 4 h.
3. **Outage + GDPR-Concern Drill**: 2h-Outage-Mock + User-Behauptung ”žmeine Daten weg".
4. **Influencer-Misinformation Drill**: Mock-YouTube-Video ”žFM-Klon ohne Lizenzen" 50k Views. Founder < 8 h: Pressekit-Link versendet, Statement-Comment, BlueSky/Mastodon-Statement.

**Mention-Monitoring-Drill (monatlich, 15 min):** synthetischer Brand-Mention auf Test-Subreddit, Throwaway-Mastodon, Bluesky. Alle Sources müssen Mention in < 30 min liefern.

**Pressekit-Completeness-Check** (vor jedem Soft-Launch-Milestone): externe Testperson erhält `/press`-Link, 200-Wort-Artikel in 30 min ohne Rückfrage.

**Voice-Style-Guide-Audit (quartärlich):** 10 zufällige Founder-Posts; Score < 80 % → Style-Guide nachschärfen.

## Runbook-Skizzen

### `runbook-tm-cease-and-desist.md`
1. NIEMALS öffentlich kommentieren. 2. Anwältin binnen 24 h. 3. Renaming-Trigger-Plan starten (Top-3-Backup-Brands aus FTO). 4. 30/60/90-Tage-Rename-Roadmap. 5. Repo-Rename, Domain-301, Social-Handle-Migration. 6. Email an Beta-Tester. 7. Pressekit-Update.

### `runbook-mass-negative-virality.md`
1. Severity-Klassifizierung (P0 > 1k Engagement, P1 100–1k, P2 < 100). 2. Atlassian-Template aus `crisis-templates/<scenario>.md`. 3. Variables füllen, DE+EN. 4. Doppel-Review gegen Voice-Style-Guide. 5. Publish-Reihenfolge: Statuspage → Discord-Pin → BlueSky → Mastodon → X (optional) → Reddit-Sticky. 6. Update-Cadence 1 h initial, 4 h sustained, 24 h daily bis Resolved. 7. Postmortem GitLab-style blameless.

### `runbook-outage-publicly-visible.md`
1. Statuspage-Incident binnen 5 min (”žinvestigating"). 2. Discord-#status. 3. BlueSky-Post bei > 30 min Outage. 4. Postmortem-Promise binnen 7 Tagen. 5. Postmortem-Publication public, mit Action-Items.

### `runbook-journalist-press-request.md`
1. Pressekit-Link senden (60s-Antwort). 2. Standard-Q&A beifügen. 3. Bei Interview: ja, aber asynchron (Email/Doc) statt live. 4. Quote-Approval. 5. Artikel in `reputation-archive.md` taggen.

### `runbook-unsolicited-influencer-coverage.md`
1. Im `reputation-archive.md` tracken. 2. Positiv: höfliches "thanks for covering!" via DM. 3. Negativ mit Misinformation: Korrektur-DM, dann Public-Comment. 4. Negativ legitime Kritik: Acknowledge, Lesson-Learned, Roadmap-Anker. 5. Niemals ”žcomment battle".

## Future-scope decisions (classified future-scope)
1. **Welche Anwältin?** Recherche-Task Founder (3–5 Kandidat-Kanzleien, 30-min-Erstgespräche).
2. **Wann markenanmelden?** Vor Soft-Launch (Schutz früh) oder nach (Brand-Validation, aber Cybersquatter-Risiko)? Empfehlung: vor Soft-Launch nach Beta-Tester-Pre-Validation.
3. **EU-Strategie?** Nur DPMA (~€ 290) oder DPMA + EUIPO (~€ 1.140 Amt)? Skaliert mit Reichweite — EU spät-erweiterbar via Madrid-Protokoll.
4. **Voice-Plattform-Priorität?** BlueSky-First (gamedev-positiv), Mastodon-First (DE-tech), X-defensiv, Discord-Primary? Solo-Founder max 2 aktive + 2 defensive.
5. **Pressekit-Sprachen?** Nur DE+EN für MVP-Stealth oder direkt FR/ES/IT? Empfehlung: DE+EN start, andere ab Welle-2.

## "Wenn wir nur 3 Dinge tun"-Liste

1. **Rebrand starten — sofort.** FTO-Erstgespräch mit DE-Markenanwältin buchen (€ 500). Top-3-Finalisten (Heimrunde/Klubkönig/Formationfuchs) prüfen lassen. Defensive Domain-Sicherung Top-1 + Backups (~€ 120).
2. **Mention-Monitoring-Stack live schalten** (1 PT, € 0). Google Alerts + Talkwalker Alerts + F5Bot + Discord-Brand-Bot. Bevor irgendein öffentlicher Asset live geht.
3. **Crisis-Comms-Skeleton schreiben** (2 PT). 7 Markdown-Templates in `docs/40-Operations/crisis-templates/`, Atlassian-Vorlagen adaptiert. Plus `voice-style-guide.md` (1 Seite). Plus `engagement-rules.md` (90/10-Regel). Damit hat Founder im Krisenfall eine Schublade zum Hineingreifen statt einer leeren Seite.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-14-F-NN`. Aggregat: [[findings-registry]].

## Related

- [[00-index]] · [[findings-registry]]
- [[PM-2026-05-20-04-monetization]] · [[PM-2026-05-20-07-live-ops-and-client-telemetry]] (Statuspage/Postmortem) · [[PM-2026-05-20-08-legal-consumer-law-and-tax]] (Markenrechts-Kollision F-08-05)
- [[../competitor-matrix]] · [[../club-boss-analysis]]
- [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
