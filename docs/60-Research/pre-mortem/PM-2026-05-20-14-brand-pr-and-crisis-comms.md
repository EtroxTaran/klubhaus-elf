---
title: "Pre-Mortem 2026-05-20 Â· 14 Â· Brand, PR & Crisis Communications + Re-Branding"
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

# Pre-Mortem 2026-05-20 Â· 14 Â· Brand, PR, Crisis Comms + Re-Branding Proposals

> **Failure-Headlines**
> - â€žSports Interactive (SEGA)-Abmahnung â€” Rebrand 3 Wochen vor Soft-Launch â€” alle Wishlists, Discord, Pressekontakte verloren."
> - â€žFootball-Reddit-Thread mit 4 k Upvotes 'Pay-to-Win-Klon' â€” 18 h Schweigen â€” kein Pressekit zur Korrektur."
> - â€žYouTube-Influencer entdeckt Stealth-Beta, 200k Views; Server bei 12k unerwarteten Sign-ups â€” 'Wir machen kein Marketing'-Out-of-Office wird Lachnummer."
> - â€žSave-Korruptions-Bug viral â€” defensiv statt blameless reagiert â€” #FootballManagerXSaveScam trending 6 Tage."
> - â€žRe-Brand-Kandidat zwischen Domain-Recherche und Anmeldung von Cybersquatter geschnappt â€” fÃ¼nfstellige Auktion."

## Top Failure-Hypothesen

### PM-2026-05-20-14-F-01 â€” Marken-Kollision (re-anchored from F-08-05)

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
  - signal: "Erste externe ErwÃ¤hnung (Blog/Reddit/Discord auÃŸerhalb interner Tests)"
  - signal: "Eingehende Briefpost / E-Mail UK/DE-IP-Kanzlei (Bird&Bird, Hogan Lovells, Taylor Wessing)"
mitigation_summary: "Sofort-Rebrand vor jedem Public-Asset; FTO durch DE-MarkenanwÃ¤ltin; DPMA + ggf. EUIPO; defensive Domain-Sicherung Top-3-Finalisten"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]]
linked_specs: [[[PM-2026-05-20-08-legal-consumer-law-and-tax]]]
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
  - title: "DPMA GebÃ¼hren"
    url: "https://www.dpma.de/service/gebuehren/marken/index.html"
    accessed: "2026-05-20"
    publisher: "DPMA"
    confidence: high
  - title: "Lexology Indie Rebrand"
    url: "https://www.lexology.com/library/detail.aspx?g=5f0dc567-4bbe-4f70-a2db-e7eaa53a2bf3"
    accessed: "2026-05-20"
    publisher: "Lexology"
    confidence: high
verification_notes: "TMview > 40 aktive Marken Sports Interactive in Nice 9/41 EU. '-x'-Suffix beseitigt Verwechslungsgefahr NICHT (BGH-Linie). Streitwert 50â€“100 k â‚¬."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: M
created: 2026-05-20
updated: 2026-05-22
```

(Volle Hypothese in [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-05|08-F-05]]; hier Brand-Perspektive.)

**Mitigation.** Sofortiger Rebrand vor jedem Public-Asset (Domain, Repo, Social-Handles). FTO Top-3-Finalisten (Heimrunde/KlubkÃ¶nig/Formationfuchs). DPMA-Anmeldung (â‚¬ 290 + ggf. â‚¬ 200 beschleunigt). EUIPO spÃ¤ter (â‚¬ 850). Defensive Domains Top-3-Finalisten Ã— 4 TLDs (~â‚¬ 360/Jahr).

### PM-2026-05-20-14-F-02 â€” Kein Crisis-Comms-Playbook fÃ¼r erste negative Virality

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
    threshold: "> 5Ã— Baseline binnen 4h"
  - metric: "Steam-Review-Velocity-Anomalie"
    threshold: "> 3Ïƒ negativ"
mitigation_summary: "Crisis-Comms-Playbook mit 6â€“7 Szenario-Templates (Atlassian-Vorlagen adaptiert), Statuspage, 4-Stunden-Response-SLO"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-07-live-ops-and-client-telemetry]]]
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

**Mitigation.** Crisis-Comms-Playbook (`docs/40-Operations/crisis-playbook.md`): Atlassian-Templates adaptiert fÃ¼r 6 Szenarien (siehe F-07). Pro Szenario: Decision-Tree (acknowledge/defend/silent-fix), 3 Message-Drafts (kurz/mittel/lang), Escalation-Path, Update-Cadence (â‰¥ 1 h Interval). Statuspage als single source of truth. 4-Stunden-Response-SLO bei P0-Brand-Events (Ã¶ffentliche Anschuldigung > 100 Engagement-Signale). **Inviolable rule**: erste Antwort â‰¤ 4 h = â€žWir sehen das, untersuchen, melden uns binnen X h" â€” niemals defensiv, niemals Schuld zuweisen, immer zeitliche Verbindlichkeit.

### PM-2026-05-20-14-F-03 â€” Stealth-Beta + zufÃ¤llige Entdeckung durch Football-Press/Influencer

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
  - signal: "Erster Discord-Join auÃŸerhalb persÃ¶nlichem Netzwerk"
  - signal: "Erster Google-Alert-Hit auf Brand-Name"
mitigation_summary: "Stealth-Mode-Page (1-Screen, klare Botschaft, Email-Capture), Pressekit ab Tag-1, Founder-Statement-Vorlage fÃ¼r 'unerwartete Coverage'"
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
verification_notes: "Indie-Football-Games werden von Football-Bloggern (FM Blog, FMHub), YouTubern (LOLLUJO, ZEALAND, FM Stag), Reddit-Mods aktiv gesucht â€” gerade weil FM26 Backlash hat."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Stealth-Mode-Landing-Page mit prÃ¤zise gesetzter Botschaft: (a) 1 Satz â€žwas ist es", (b) â€žStealth Beta, Soft-Launch Q4 2026 â€” KEIN Marketing", (c) Email-Capture fÃ¼r Closed-Beta-Invites, (d) Double-Opt-In DSGVO, (e) keine Capsule-Art bevor Rebrand fixiert. Explizit: â€žwir sind kein Football Manager â€” Roguelite-Reinterpretation des Genres". Pressekit-Stub verlinkt von Landing-Page ab Beta-Tag-0. Founder-Statement-Vorlage `docs/40-Operations/unsolicited-coverage-response.md`.

### PM-2026-05-20-14-F-04 â€” Single-Founder-Voice ohne klare Tone-Guidelines

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
mitigation_summary: "Voice-Style-Guide (1 Seite): Ich-Form immer, Demut > Marketing-Speak, Transparenz Ã¼ber Limits, Daten > Versprechen"
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

**Mitigation.** Voice-Style-Guide (1 Seite, `docs/30-Product/voice-style-guide.md`): **Ich-Form** (echter Solo-Dev, niemals "our team"), **Demut > Hype** (zeige Zahlen, nicht Adjektive), **Transparenz Ã¼ber Limits** ("Soft-Launch, ich erwarte Bugs, kein Support"), **Daten statt Versprechen**. 5 Sample-Posts pro Plattform. **Hard Rule**: kein Sock-Puppet, kein zweiter Brand-Account vom selben Founder.

### PM-2026-05-20-14-F-05 â€” Pressekit-Absence beim ersten Journalisten-Anfrage

```yaml
id: PM-2026-05-20-14-F-05
priority: P3
domain: brand
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - signal: "Erste E-Mail 'kÃ¶nnen wir Screenshots/Logo haben?'"
  - signal: "Erster Tweet eines Verified-Journalisten"
mitigation_summary: "Pressekit ab Soft-Launch-Tag-0 unter /press: Logo, 8+ Screenshots, â‰¤90s Trailer, Fact-Sheet (DE+EN), Founder-Bio, ZIP"
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

**Mitigation.** Statisches Pressekit `/press`. Pflichtinhalte (Rami-Ismail-Standard): Logo PNG transparent + SVG; Fact-Sheet 1-Pager DE+EN (Name, Genre, Plattform, Release-Date â€žTBA Q4 2026", Preis â€žFree-to-Play", Languages); 8+ Screenshots 1920Ã—1080 (Squad, Tactic, Match, Saison, HauptmenÃ¼); 1 Trailer â‰¤ 90 s (zunÃ¤chst No-Audio-Loop OK); Founder-Bio + Headshot; Brand-Guidelines; ZIP-Download; Pressekontakt-Email `press@<brand>.de`. Tooling: kein PHP-presskit(), stattdessen MD/MDX in Landing-Page-App.

### PM-2026-05-20-14-F-06 â€” Zero-Cost-Mention-/Sentiment-Monitoring nicht aufgesetzt

```yaml
id: PM-2026-05-20-14-F-06
priority: P2
domain: brand
probability: 5
impact: 3
score: 15
confidence: high
early_warning: []  # this finding IS the early-warning system
mitigation_summary: "Google Alerts + Talkwalker Alerts (free) fÃ¼r Web; F5Bot (free) fÃ¼r Reddit; X/BlueSky-Bookmarklets; Discord-Bot fÃ¼r Brand-Keywords"
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
verification_notes: "Brand24 Preisanstieg Q4-2025: 79$ â†’ 199â€“249$ Einstieg. Mentionlytics 69$. Talkwalker Enterprise 12k$/Jahr. Free-Stack ist machbar."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: XS
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** **Zero-Cost-Stack** (ab Tag-0): (1) Google Alerts fÃ¼r Brand + Misspellings. (2) Talkwalker Alerts als Backup fÃ¼r Web-Mentions. (3) F5Bot fÃ¼r Reddit + HackerNews. (4) X-/BlueSky-Search-Bookmarklet 1Ã—/Tag (5 min). (5) Discord-Bot (selbst gehostet ~30 LOC Python) `<Brand>BrandBot` fÃ¼r Keyword im eigenen Server + 3 strategischen Servern. (6) YouTube-Channel-Watch via RSS auf 5 Football-Game-Channels.

**Verifikation.** Drill alle 30 Tage: synthetischer Brand-Mention-Post. Alert in < 30 min.

### PM-2026-05-20-14-F-07 â€” Crisis-Comms-Message-Archetypes fÃ¼r 7 Szenarien fehlen

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
verification_notes: "Atlassian-Vorlagen battle-tested, aber B2B-flavored. FÃ¼r Indie-Game-Audience emotionaler/persÃ¶nlicher umformulieren."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** 7 Crisis-Templates (â‰¤ 200 WÃ¶rter, DE+EN, Variablen-Block, publish-checklist): (1) **Outage** Atlassian-Vorlage. (2) **Save-Corruption-Mass-Event**: erst BestÃ¤tigung (Daten-Erhalt-Prio), dann Recovery-Plan, Postmortem-Versprechen binnen 7 Tagen. (3) **Account-Hack-Claim**: nie Schuld zuweisen vor Forensik; Passwort-Reset-Angebot; 2FA-Reminder. (4) **P2W-Accusation** (post-MVP): Daten-driven, Drop-Rate-Tabellen, Roadmap-Anker, nie defensiv. (5) **A11y-Complaint**: Anerkennung als Bug, Triage-Issue Ã¶ffentlich, konkretes Fix-Datum. (6) **GDPR-Complaint**: 72h-Frist Art. 33; BfDI-Hamburg/Berlin-Kontakt; Privacy-Page-Link. (7) **TM-Cease-and-Desist**: **NIEMALS Ã¶ffentlich** kommentieren vor AnwÃ¤ltin; Standard-Acknowledge-Brief; intern Renaming-Runbook starten.

### PM-2026-05-20-14-F-08 â€” Reputation-Archiv fehlt

```yaml
id: PM-2026-05-20-14-F-08
priority: P4
domain: brand
probability: 3
impact: 2
score: 6
confidence: medium
early_warning:
  - signal: "Erste positive ErwÃ¤hnung in Tier-3-Outlet"
mitigation_summary: "Markdown-Datenbank docs/60-Research/reputation-archive.md mit URL+Datum+Quote+Permissions-Status; monatliches Bookmark-Sweep"
linked_adrs: []
linked_specs: []
linked_code: []
sources: []
verification_notes: "Testimonials = Marketing-Asset-Goldstandard fÃ¼r Soft-Launch-to-Launch-Ãœbergang."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: XS
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** `docs/60-Research/reputation-archive.md`: URL, Datum, Autor, Outlet, Quote (â‰¤ 2 SÃ¤tze), Sentiment, **Permission-Status** (explizit angefragt? ja/nein/standing), Use-Cases. Monatlich 15-min-Sweep. Bei wichtigen Quotes proaktiv Permission (â€žHi, danke fÃ¼r den positiven Kommentar â€” darf ich dich auf der Landing-Page zitieren?").

### PM-2026-05-20-14-F-09 â€” Apology-/Reparatur-Stil ohne Muster; Discord/Reddit-Astroturfing-Risiko

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

**Mitigation.** Engagement-Regeln (`docs/30-Product/engagement-rules.md`): **90/10-Regel** (90 % Hilfe/Antwort, 10 % Brand-Posts). **Karma-Floor**: Reddit-Self-Promo erst > 500 Karma + > 3 Mo Account-Alter + nur erlaubte Subs (r/IndieDev, r/footballmanagergames Self-Promo-Friday). **Disclosure-Rule**: bei jedem Brand-Bezug volle Offenlegung im ersten Satz. **Apology-Patterns** (GitLab): Acknowledge < 4 h â†’ Diagnose < 24 h â†’ Promise < 48 h â†’ Postmortem-Publish < 7 d, blameless. **Silent-Fix nur** wenn keine AuÃŸenwirkung + keine Daten betroffen + keine Ã¶ffentliche Beschwerde.

## Part B â€” Re-Branding-Kandidaten (CORE OUTPUT)

**Search-URL-Template:**
- TMview: `https://www.tmdn.org/tmview/#/tmview/results?_searchKey=<NAME>&_niceClass=9,41&_jurisdiction=DE,EM`
- DPMA: `https://register.dpma.de/DPMAregister/marke/einsteiger?LANG=de`
- EUIPO eSearch plus: `https://euipo.europa.eu/eSearch/#advanced/trademarks/1/100/n1=MarkVerbalElementText&v1=<NAME>`

**Domain-Status-Hinweis**: DNS-Resolution-Tests in Sandbox unzuverlÃ¤ssig. Alle Angaben â€žplausibel verfÃ¼gbar (DNS-quiet), WHOIS-Verifikation vor Registrierung nÃ¶tig". Founder muss `whois <name>.{de,com,gg,app}` lokal + auf https://denic.de/webwhois (.de) + https://www.namecheap.com (.com/.app/.gg) cross-checken.

### Candidate Comparison

| # | Name | Etymology / Vibe | TMview Nice 9/41 | Domain (.de/.com/.gg/.app) | Risk | Notes |
|---|---|---|---|---|---|---|
| 1 | **Heimrunde** | "Heim-Runde" = Heimspielrunde, Roguelite-Run-Doppeldeutigkeit. Warm, vereinsnah, DE | TMview `heimrunde` keine identischen Treffer | needs WHOIS â€” DNS-quiet | **Low** | Sehr DE; EN mÃ¼ssen "home-round" lernen. Roguelite-Bezug subtil |
| 2 | **Trainerleben** | "Trainer-Leben" = career-as-coach. Lebenswelt-Frame statt Sim-Frame. DE+EN pronounceable | TMview `trainerleben` kein Treffer | needs WHOIS | **Low** | MÃ¶glicherweise generisch-beschreibend fÃ¼r Coaching-Apps; Distinctiveness braucht Logo |
| 3 | **KlubkÃ¶nig** | "Klub-KÃ¶nig" = KÃ¶nig-deines-Klubs, royaler Roguelite-Vibe. DE, Umlaut | TMview `klubkÃ¶nig`/`klubkoenig` kein Treffer | needs WHOIS â€” Punycode-Risiko `.de` `xn--klubknig-66a` | **Low-Medium** | Umlaut-Punycode-Risiko; ASCII `klubkoenig` als PrimÃ¤rdomain. International limitiert (KÃ¶nig) |
| 4 | **Sechzehnerklub** | "Sechzehner" = Strafraum-Slang DE-Football. Insider-Brand fÃ¼r Fans | TMview `sechzehnerklub` kein Treffer | needs WHOIS | **Low** | 14 Zeichen, unhandlich fÃ¼r URLs. International unbekannt. Hoch-distinktiv |
| 5 | **Doppelpasser** | "Doppelpass" = Football classic + Streetpass-Vibe. Single-word, knackig | TMview `doppelpasser` kein Treffer | needs WHOIS | **Medium** | "Doppelpass" als Football-Begriff verbreitet, kÃ¶nnte zu beschreibend (Â§ 8 Abs. 2 Nr. 2 MarkenG). Wortbildmarke statt Wortmarke |
| 6 | **Elfersaga** | "Elfer-Saga" = Penalty-Saga, Roguelite-Story-Frame. Klangvoll, modern | TMview `elfersaga` kein Treffer | needs WHOIS | **Low-Medium** | "Saga" ist King-Trademark in Nice 9/41 (Candy Crush Saga) â€” aggressive TM-Strategie. Risiko-Check mit AnwÃ¤ltin. Backup: `Elferzeit` |
| 7 | **Formationfuchs** | "Formation" + "Fuchs" = tactical fox. Doppelsprachig denkbar | TMview `formationfuchs` kein Treffer | needs WHOIS | **Low** | Charmant, einprÃ¤gsam. "Fuchs" gut DE/EN-pronounceable. Mascot-Potential |
| 8 | **TribÃ¼ne Tactics** | "TribÃ¼ne" (DE stand/grandstand) + "Tactics" = bilingual | TMview `tribÃ¼ne tactics` kein Treffer | needs WHOIS | **Low** | Bilinguale Brand stark bei DE-first/EN-second. Umlaut-Behandlung wie #3. LÃ¤ngere Domain |
| 9 | **Viereckpass** | "Viereck-Pass" = tactical drill (rondo). Coaching-Vokabular | TMview `viereckpass` kein Treffer | needs WHOIS | **Low** | Sehr Football-fachlich. Limitiert int. Reichweite. Coaching-AuthentizitÃ¤t-Plus |
| 10 | **Aufstiegsroman** | "Aufstieg" + "Roman" = literarische Roguelite-Career | TMview `aufstiegsroman` kein Treffer | needs WHOIS | **Low** | Sehr DE, literarisch-erwachsen. Schwierige Aussprache fÃ¼r EN |
| 11 | **Kaderschmiede** | "Kader-Schmiede" = squad-forge. Bereits im Football-Discourse | TMview `kaderschmiede` einzelne Treffer DE fÃ¼r andere Klassen (Bildung/Coaching); Nice 9/41 frei | needs WHOIS â€” `.de` Caution (bereits begrifflich in Benutzung) | **Medium** | Etabliertes Fachwort = niedrige Distinctiveness. Wortbildmarke + Disclaimer-Strategie nÃ¶tig |
| 12 | **Standardsituation** | "Standard-Situation" = set-piece DE-football. Klassisch, fachlich | TMview kein Nice 9/41 Treffer | needs WHOIS | **Medium-High** | Sehr beschreibend â†’ Eintragungs-HÃ¼rde (Â§ 8 Abs. 2 Nr. 2 MarkenG). Eventuell als sekundÃ¤rer Werktitel |

### Top-3 Finalisten

1. **Heimrunde** â€” Top-Pick. Kurz, klangvoll, transportiert Roguelite-DNA (`Runde` = run/round) UND Football-Heim-AtmosphÃ¤re. Distinctiveness hoch, keine TMview-Kollision Nice 9/41 sichtbar. Logo-Potential stark (Stadion-Silhouette + WÃ¼rfel-Element). EN â€žHome Round" patent-mÃ¤ÃŸig schwÃ¤cher, aber DE-first-Markt zentral. **Risiko**: kleine deutsche Audio/Podcast-Marken mit â€žHeimrunde" mÃ¶glich (Nice 41 audio/streaming) â€” AnwÃ¤ltin muss prÃ¼fen.

2. **KlubkÃ¶nig** â€” Strong. Royaler Roguelite-Twist, warm, vereinsnah. Stark distinktiv durch Kompositum. **Risiko**: Umlaut-Domain-KomplexitÃ¤t â†’ `klubkoenig.de/.com` als PrimÃ¤r-URLs, `klubkÃ¶nig` als Brand-Spelling.

3. **Formationfuchs** â€” Smart. Charmant, einprÃ¤gsam, Mascot-Potential (â€žclever like a fox"). Funktioniert auch im EN-Markt halbwegs (â€žFormation Fox" als sekundÃ¤rer Brand-Layer). Distinctiveness hoch.

**Backup-Finalisten**: Sechzehnerklub (distinktiv aber lang), Trainerleben (intuitiv aber eventuell zu beschreibend), Elfersaga (gefÃ¤llig aber King-Saga-Risiko).

### Process Notes for FTO Lawyer Engagement

- **AnwÃ¤ltin-Auswahl**: DE-MarkenanwÃ¤ltin mit Software-/Games-Erfahrung. Hamburg/Berlin/KÃ¶ln/MÃ¼nchen, IP-Schwerpunkt (PWB, ABEL, Spirit Legal). Stundensatz 250â€“350 â‚¬/h.
- **Kosten**:
  - Erstberatung 1â€“2 h: â‚¬ 300â€“700
  - FTO Top-3 Nice 9/41 DE+EU: â‚¬ 500â€“1.500
  - DPMA-Anmeldung: â‚¬ 500â€“800 + â‚¬ 290 Amt (3 Klassen) + â‚¬ 200 beschleunigt optional
  - EUIPO (nach Beta-Success): â‚¬ 850â€“1.200 Anwalt + â‚¬ 850 Amt (1.) + â‚¬ 50 (2.) + â‚¬ 150 (ab 3.)
  - **Gesamt MVP-Phase (DPMA + Top-1)**: **~â‚¬ 2.500**
  - **Welle-2 (mit EUIPO + 18 Mo Domains)**: **~â‚¬ 5.000**
- **Timeline**: FTO 2â€“4 Wochen, DPMA 6â€“8 Mo (3â€“4 beschleunigt), EUIPO 4â€“6 Mo. **Markenschutz 4â€“6 Monate vor Soft-Launch starten.**
- **Auftrag**: (1) FTO Top-3 Nice 9/41 DE-national + EU-weit + Quick-Check USPTO. (2) Distinctiveness-Bewertung (Â§ 8 Abs. 2 Nr. 1, Nr. 2 MarkenG). (3) Empfehlung Wort vs Wortbildmarke. (4) Schutzbereich: Nice 9 + 41 oder zusÃ¤tzlich 25 (Bekleidung) + 35 (Werbung)?
- **Zwischen FTO und Eintragung**: defensive Domain-Sicherung sofort (~â‚¬ 10/Domain/Jahr `.de`, ~â‚¬ 12 `.com`, ~â‚¬ 70 `.gg`, ~â‚¬ 15 `.app` = ~â‚¬ 120/Name Ã— 3 Finalisten = **~â‚¬ 360/Jahr**).
- **Social-Handle-Sicherung**: Discord-Server, BlueSky, Mastodon, X, Reddit, GitHub-org parallel fÃ¼r alle 3 Finalisten (kostenlos, ~30 min/Name).

## Part C â€” Marketing-Stance MVP (Stealth-Strategy)

**User-Decision (Welle-2)**: MVP = **stealth-beta / soft-launch only**, kein aktives Marketing, kein Runtime-LLM, kein App-Store.

**Empfehlungen:**

1. **Schweigen â‰  Unsichtbarkeit, sondern *kuratierte Sichtbarkeit*.** â€žNo marketing" heiÃŸt nicht â€žno presence". Gepflegte Owned-Channels (Landing-Page, GitHub-README, Discord-Beschreibung) mÃ¼ssen fÃ¼r zufÃ¤llige Entdecker funktionieren.

2. **Coming-Soon-Landing-Page: JA** (mit MaÃŸgaben):
   - 1-Screen-Single-Pager unter `<brand>.de`.
   - **Kernmessage**: 1-Satz-Was, 1-Satz-Wann, 1-Satz-Wie. Beispiel: â€ž*<Heimrunde>* ist eine Roguelite-Reinterpretation des Football-Manager-Genres. Geschlossener Beta-Start Q3 2026 in DE/EN. Trage dich fÃ¼r eine Einladung ein."
   - **Anti-Pattern vermeiden**: â€žRevolutionary", â€žGame-changing", â€žAAA-quality" â†’ out (wir sind Single-Founder-Indie).
   - **Email-Capture**: Double-Opt-In via Buttondown/Listmonk/Sendy (self-hosted GDPR), DSGVO-Footer, transparenter Use (â€žmax 1 Mail/Mo bis Beta, dann Invite").
   - **ZielgrÃ¶ÃŸe**: 200â€“500 Pre-Beta-Email-Signups (realistisch 0-Marketing-Stealth in 4 Monaten via word-of-mouth + organische Discovery).

3. **Closed-Beta-Invite-Strategie**: Welle-Roll-Out 50 â†’ 200 â†’ 500 â†’ 2.000. Bei 2.000 Soft-Launch-Switch. Wave-Trigger nicht â€žDatum" sondern *â€žStabilitÃ¤t-SLO erfÃ¼llt"* (Crash-Rate < 0.5 %, P95-Latency stabil, 10 aufeinanderfolgende Tage ohne P0).

4. **Stealth-to-Launch-Switch-Kriterien**:
   - SLO-StabilitÃ¤t min 30 Tage
   - 50+ Feedback-Items aus Beta verarbeitet
   - Pressekit fertig (F-05)
   - Crisis-Playbook getestet (1 Tabletop-Drill)
   - Brand-Marken-Anmeldung DPMA eingereicht (Antrag genÃ¼gt)
   - Mention-Monitoring lÃ¤uft 60+ Tage

5. **Defensive Social-Handle-Reservierung** fÃ¼r gewÃ¤hlten Brand: Discord (Server), BlueSky, Mastodon (norden.social oder eigener Single-User), X/Twitter (defensiv), Reddit (defensiv, keine Postings), YouTube (defensiv), GitHub (org-rename).

6. **Was *nicht* tun**:
   - Keine Steam-Page (wÃ¼rde Wishlist-Aufbau erzwingen, < 50 Reviews = Steam zeigt dich nicht).
   - Kein Reddit-Posting in r/footballmanagergames (Mod-Risiko, siehe F-09).
   - Keinen Discord-Boost in fremden Servern.
   - Keine Pressekit-Versendung an Outlets (nur reaktiv auf Anfragen).
   - Keine Devlog-Vlog-Serie (frisst Solo-Founder-Zeit).

## Quantitatives Modell

**Indie-Game-Marketing-Benchmarks:**
- Steam Wishlist Conversion: Median 0.15Ã— (>25k WL), 0.10Ã— (>10$). F2P andere Mechanik â†’ irrelevant MVP.
- Steam Next Fest: 2.000 WL Minimum (Chris Zukowski).
- Capsule-Art-Conversion: 68â€“88 % Next-Fest-WL aus Capsule + Screenshots + Trailer â€” nicht aus Demo.
- < 50 Steam Reviews = quasi unsichtbar.
- Indie-Landing-Page-Email-Conversion: 8â€“15 %.

**Brand-Monitoring-Tier-Preise 2026:**
- Google Alerts / Talkwalker Alerts / F5Bot: **free**
- Brand24: $199â€“249/Mo (Q4-2025 erhÃ¶ht von $79)
- Mentionlytics: $69/Mo (Solo)
- Talkwalker Enterprise: ab $12.000/Jahr
- **MVP-Phase**: **$0/Mo**

**Kostenrahmen Brand-Sicherung Soll-Budget** (1 Brand, 18 Mo Schutz):

| Posten | Kosten |
|---|---|
| AnwÃ¤ltin FTO + DPMA-Begleitung | â‚¬ 1.500â€“2.500 |
| DPMA-GebÃ¼hr (Klasse 9, 41) | â‚¬ 290 |
| EUIPO-Erweiterung (nach Beta-Success) | â‚¬ 1.700â€“2.100 |
| Defensive Domains (3 Finalisten Ã— 4 TLDs, 1 Jahr) | ~â‚¬ 360 |
| Social-Handle-Reservierung | â‚¬ 0 |
| **MVP-Phase nur DPMA Top-1** | **~â‚¬ 2.500** |
| **Welle-2 mit EUIPO + 18 Mo** | **~â‚¬ 5.000** |

## SLO-VorschlÃ¤ge

| SLO | Ziel |
|---|---|
| Brand-Mention-Response-Time | P0-Event â‰¤ 4 h Acknowledge, â‰¤ 24 h BestÃ¤tigung |
| Mention-Monitoring-Coverage | 100 % Brand-Mentions auf Reddit + Top-5-YT + Google-Index in < 30 min (QuartÃ¤rlicher Drill) |
| Press-Kit-Availability | `/press` 99,9 % Uptime; ZIP â‰¤ 90 Tage alt |
| Crisis-Comms-Template-Freshness | alle 7 Templates jÃ¤hrlich reviewed; keiner > 12 Monate |
| Brand-Domain-Renewal | T-30 vor Ablauf verlÃ¤ngert; Auto-Renew + Pre-Pay â‰¥ 2 Jahre |

## Test-Plan

**Crisis-Comms-Tabletop (quartÃ¤rlich, 60 min):**
1. **TM-Cease-and-Desist Drill**: AnwÃ¤ltinnen-Schreiben â€žrebrand binnen 14 Tagen" Mock. Founder in 30 min: (a) Notfall-Checkliste, (b) AnwÃ¤ltin-Termin, (c) Public-Comms-Embargo, (d) Backup-Brand-Auswahl.
2. **Reddit-Review-Bombing Drill**: Mock-Post â€žPay-to-Win-Scam" mit 2k Upvotes. Response < 4 h.
3. **Outage + GDPR-Concern Drill**: 2h-Outage-Mock + User-Behauptung â€žmeine Daten weg".
4. **Influencer-Misinformation Drill**: Mock-YouTube-Video â€žFM-Klon ohne Lizenzen" 50k Views. Founder < 8 h: Pressekit-Link versendet, Statement-Comment, BlueSky/Mastodon-Statement.

**Mention-Monitoring-Drill (monatlich, 15 min):** synthetischer Brand-Mention auf Test-Subreddit, Throwaway-Mastodon, Bluesky. Alle Sources mÃ¼ssen Mention in < 30 min liefern.

**Pressekit-Completeness-Check** (vor jedem Soft-Launch-Milestone): externe Testperson erhÃ¤lt `/press`-Link, 200-Wort-Artikel in 30 min ohne RÃ¼ckfrage.

**Voice-Style-Guide-Audit (quartÃ¤rlich):** 10 zufÃ¤llige Founder-Posts; Score < 80 % â†’ Style-Guide nachschÃ¤rfen.

## Runbook-Skizzen

### `runbook-tm-cease-and-desist.md`
1. NIEMALS Ã¶ffentlich kommentieren. 2. AnwÃ¤ltin binnen 24 h. 3. Renaming-Trigger-Plan starten (Top-3-Backup-Brands aus FTO). 4. 30/60/90-Tage-Rename-Roadmap. 5. Repo-Rename, Domain-301, Social-Handle-Migration. 6. Email an Beta-Tester. 7. Pressekit-Update.

### `runbook-mass-negative-virality.md`
1. Severity-Klassifizierung (P0 > 1k Engagement, P1 100â€“1k, P2 < 100). 2. Atlassian-Template aus `crisis-templates/<scenario>.md`. 3. Variables fÃ¼llen, DE+EN. 4. Doppel-Review gegen Voice-Style-Guide. 5. Publish-Reihenfolge: Statuspage â†’ Discord-Pin â†’ BlueSky â†’ Mastodon â†’ X (optional) â†’ Reddit-Sticky. 6. Update-Cadence 1 h initial, 4 h sustained, 24 h daily bis Resolved. 7. Postmortem GitLab-style blameless.

### `runbook-outage-publicly-visible.md`
1. Statuspage-Incident binnen 5 min (â€žinvestigating"). 2. Discord-#status. 3. BlueSky-Post bei > 30 min Outage. 4. Postmortem-Promise binnen 7 Tagen. 5. Postmortem-Publication public, mit Action-Items.

### `runbook-journalist-press-request.md`
1. Pressekit-Link senden (60s-Antwort). 2. Standard-Q&A beifÃ¼gen. 3. Bei Interview: ja, aber asynchron (Email/Doc) statt live. 4. Quote-Approval. 5. Artikel in `reputation-archive.md` taggen.

### `runbook-unsolicited-influencer-coverage.md`
1. Im `reputation-archive.md` tracken. 2. Positiv: hÃ¶fliches "thanks for covering!" via DM. 3. Negativ mit Misinformation: Korrektur-DM, dann Public-Comment. 4. Negativ legitime Kritik: Acknowledge, Lesson-Learned, Roadmap-Anker. 5. Niemals â€žcomment battle".

## Future-scope decisions (classified future-scope)
1. **Welche AnwÃ¤ltin?** Recherche-Task Founder (3â€“5 Kandidat-Kanzleien, 30-min-ErstgesprÃ¤che).
2. **Wann markenanmelden?** Vor Soft-Launch (Schutz frÃ¼h) oder nach (Brand-Validation, aber Cybersquatter-Risiko)? Empfehlung: vor Soft-Launch nach Beta-Tester-Pre-Validation.
3. **EU-Strategie?** Nur DPMA (~â‚¬ 290) oder DPMA + EUIPO (~â‚¬ 1.140 Amt)? Skaliert mit Reichweite â€” EU spÃ¤t-erweiterbar via Madrid-Protokoll.
4. **Voice-Plattform-PrioritÃ¤t?** BlueSky-First (gamedev-positiv), Mastodon-First (DE-tech), X-defensiv, Discord-Primary? Solo-Founder max 2 aktive + 2 defensive.
5. **Pressekit-Sprachen?** Nur DE+EN fÃ¼r MVP-Stealth oder direkt FR/ES/IT? Empfehlung: DE+EN start, andere ab Welle-2.

## "Wenn wir nur 3 Dinge tun"-Liste

1. **Rebrand starten â€” sofort.** FTO-ErstgesprÃ¤ch mit DE-MarkenanwÃ¤ltin buchen (â‚¬ 500). Top-3-Finalisten (Heimrunde/KlubkÃ¶nig/Formationfuchs) prÃ¼fen lassen. Defensive Domain-Sicherung Top-1 + Backups (~â‚¬ 120).
2. **Mention-Monitoring-Stack live schalten** (1 PT, â‚¬ 0). Google Alerts + Talkwalker Alerts + F5Bot + Discord-Brand-Bot. Bevor irgendein Ã¶ffentlicher Asset live geht.
3. **Crisis-Comms-Skeleton schreiben** (2 PT). 7 Markdown-Templates in `docs/40-Operations/crisis-templates/`, Atlassian-Vorlagen adaptiert. Plus `voice-style-guide.md` (1 Seite). Plus `engagement-rules.md` (90/10-Regel). Damit hat Founder im Krisenfall eine Schublade zum Hineingreifen statt einer leeren Seite.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-14-F-NN`. Aggregat: [[findings-registry]].

## Related

- [[00-index]] Â· [[findings-registry]]
- [[PM-2026-05-20-04-monetization]] Â· [[PM-2026-05-20-07-live-ops-and-client-telemetry]] (Statuspage/Postmortem) Â· [[PM-2026-05-20-08-legal-consumer-law-and-tax]] (Markenrechts-Kollision F-08-05)
- [[../competitor-matrix]] Â· [[../club-boss-analysis]]
- [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
