// Prototype sample data — IP-clean, German content. This is mock domain data
// (not UI chrome) and will be replaced by the real engine/DB. Kept in one
// module so every Phase-1 screen reads consistent figures.
import type { InboxTone } from '@/components/composites/inbox-card/inbox-card'
import type { MatchEventKind } from '@/components/composites/match-event/match-event'
import type { Player } from '@/types/player'
import type { StadiumType, Stand } from '@/types/stadium'

export const SQUAD: Player[] = [
  {
    n: 'Lars Wendling',
    pos: 'TW',
    age: 29,
    str: 7,
    tal: 3,
    form: '7,4',
    contract: '06/26',
    nat: 'DE',
    shirt: 1,
  },
  {
    n: 'Mateo Carrara',
    pos: 'IV',
    age: 27,
    str: 8,
    tal: 3,
    form: '7,8',
    contract: '06/27',
    nat: 'IT',
    shirt: 4,
  },
  {
    n: 'Felipe Manso',
    pos: 'IV',
    age: 24,
    str: 7,
    tal: 4,
    form: '7,1',
    contract: '06/28',
    nat: 'PT',
    shirt: 5,
  },
  {
    n: 'Jonas Bredow',
    pos: 'AV',
    age: 22,
    str: 6,
    tal: 4,
    form: '6,9',
    contract: '06/27',
    nat: 'DE',
    shirt: 18,
  },
  {
    n: 'Kaito Furukawa',
    pos: 'AV',
    age: 25,
    str: 7,
    tal: 3,
    form: '7,3',
    contract: '06/26',
    nat: 'JP',
    shirt: 22,
  },
  {
    n: 'Sven Holtmann',
    pos: 'DM',
    age: 31,
    str: 7,
    tal: 2,
    form: '6,8',
    contract: '06/26',
    nat: 'DE',
    shirt: 6,
  },
  {
    n: 'Tobias Reiter',
    pos: 'ZM',
    age: 28,
    str: 8,
    tal: 3,
    form: '8,1',
    contract: '06/28',
    nat: 'DE',
    shirt: 8,
  },
  {
    n: 'Niko Velten',
    pos: 'ZM',
    age: 21,
    str: 6,
    tal: 4,
    form: '7,0',
    contract: '06/29',
    nat: 'DE',
    shirt: 14,
  },
  {
    n: 'Marek Brody',
    pos: 'OM',
    age: 26,
    str: 8,
    tal: 3,
    form: '8,4',
    contract: '06/27',
    nat: 'DE',
    shirt: 10,
  },
  {
    n: 'Aleksy Wieser',
    pos: 'ST',
    age: 23,
    str: 7,
    tal: 4,
    form: '7,9',
    contract: '06/28',
    nat: 'DE',
    shirt: 9,
  },
  {
    n: 'Florian Kalt',
    pos: 'ST',
    age: 30,
    str: 7,
    tal: 2,
    form: '6,5',
    contract: '06/26',
    nat: 'DE',
    shirt: 11,
  },
  {
    n: 'Davor Krause',
    pos: 'TW',
    age: 22,
    str: 5,
    tal: 3,
    form: '6,4',
    contract: '06/27',
    nat: 'DE',
    shirt: 31,
    bench: true,
  },
  {
    n: 'Henrik Voss',
    pos: 'IV',
    age: 19,
    str: 5,
    tal: 4,
    form: '6,7',
    contract: '06/29',
    nat: 'DE',
    shirt: 24,
    bench: true,
  },
  {
    n: 'Pavel Schramm',
    pos: 'OM',
    age: 20,
    str: 6,
    tal: 4,
    form: '7,2',
    contract: '06/28',
    nat: 'DE',
    shirt: 17,
    bench: true,
  },
]

export interface InboxMessage {
  tone: InboxTone
  from: string
  title: string
  body: string
  time: string
}

export const INBOX: InboxMessage[] = [
  {
    tone: 'board',
    from: 'Aufsichtsrat',
    title: 'Drei Punkte — oder es wird ungemütlich.',
    body: '„Lieber Trainer, der Aufsichtsrat erwartet am Sonntag in Northbridge einen Sieg."',
    time: '08:14',
  },
  {
    tone: 'media',
    from: 'Auerbach-Zeitung',
    title: '„Brody schießt sich in die Herzen"',
    body: 'Die Tabloidseite widmet Ihrem Spielmacher eine ganze Seite. Stellungnahme?',
    time: '07:42',
  },
  {
    tone: 'sponsor',
    from: 'Volta Bank',
    title: 'Trikotsponsor — Verlängerung um 2 Jahre',
    body: 'Angebot: 1,8 Mio. € pro Saison. Wir wären stolz, weiter auf Ihrer Brust zu stehen.',
    time: 'gestern',
  },
  {
    tone: 'scout',
    from: 'Scout · Mertens',
    title: 'Talent in Riverdale entdeckt',
    body: 'Rechtsfuß, 18, OM. Mein Bauchgefühl sagt: vier Sterne. Reise lohnt sich.',
    time: 'gestern',
  },
  {
    tone: 'fan',
    from: 'Fanclub Hafentor',
    title: 'Bitte: Mehr Stehplätze in Block N.',
    body: '„Wir stehen, wir singen, wir gewinnen." Petition mit 4.220 Unterschriften.',
    time: 'Mo',
  },
]

export interface FeedEntry {
  min: string
  kind: MatchEventKind
  t: string
  s: string
  score?: string
}

export const FEED: FeedEntry[] = [
  { min: '90+3', kind: 'whistle', t: 'Abpfiff.', s: 'Hafenstadt-Arena tobt. 2:1.' },
  { min: "88'", kind: 'sub', t: 'Wechsel · Hafenstadt', s: 'Velten kommt für Holtmann.' },
  {
    min: "82'",
    kind: 'goal',
    t: 'TOR! Brody (Hafenstadt)',
    s: 'Volley aus 14 Metern, unhaltbar.',
    score: '2:1',
  },
  {
    min: "76'",
    kind: 'card',
    t: 'Gelb · Northbridge',
    s: 'Foul an Brody, der Schiri zückt die Karte.',
  },
  {
    min: "71'",
    kind: 'chance',
    t: 'Chance · Hafenstadt',
    s: 'Wieser zwingt den Keeper zur Glanzparade.',
  },
  {
    min: "58'",
    kind: 'goal',
    t: 'TOR! Tarrant (Northbridge)',
    s: 'Kopfball nach Eckstoß.',
    score: '1:1',
  },
  { min: "46'", kind: 'whistle', t: 'Wiederanpfiff.', s: '2. Halbzeit läuft.' },
  {
    min: "34'",
    kind: 'goal',
    t: 'TOR! Wieser (Hafenstadt)',
    s: 'Konter über links — eiskalt vollendet.',
    score: '1:0',
  },
  { min: "12'", kind: 'set', t: 'Eckstoß für Hafenstadt', s: 'Reiter tritt — abgeklärt.' },
  { min: "1'", kind: 'whistle', t: 'Anpfiff.', s: 'Hafenstadt-Arena, 27.412 Zuschauer.' },
]

export const XG = [
  { min: 1, a: 0, b: 0 },
  { min: 34, a: 0.4, b: 0.9 },
  { min: 45, a: 0.5, b: 1.0 },
  { min: 58, a: 1.0, b: 1.0 },
  { min: 82, a: 1.0, b: 1.7 },
  { min: 90, a: 1.1, b: 1.8 },
]

export const NEXT_FIXTURE = {
  date: 'So 24. Mai',
  time: '15:30',
  comp: 'Aurelia Premier · 32. Spieltag',
  venue: 'Northbridge Arena',
  home: 'Northbridge City',
  away: 'FC Hafenstadt',
}

export const OPP = {
  name: 'Northbridge City',
  short: 'NBC',
  ranking: '4. Tabellenplatz',
  key: [
    { n: 'Owen Tarrant', pos: 'ST', tag: '9 Tore' },
    { n: 'Cory Halligan', pos: 'ZM', tag: 'Schaltzentrale' },
    { n: 'M. Ouellet', pos: 'TW', tag: '73% Quote' },
  ],
}

export const OWN = {
  name: 'FC Hafenstadt',
  short: 'FCH',
  ranking: '2. Tabellenplatz',
  key: [{ n: 'Marek Brody', pos: 'OM', tag: '12 Vorlagen' }],
}

export const H2H = [
  { c: 'N', l: '2:1' },
  { c: 'U', l: '1:1' },
  { c: 'S', l: '0:2' },
  { c: 'S', l: '1:3' },
  { c: 'N', l: '2:0' },
] as const

export const FIN = {
  cash: 14_280_500,
  monthlyRev: 4_120_000,
  monthlyExp: 3_488_000,
  ops: [
    { k: 'Ticketing', v: 980_000 },
    { k: 'Sponsoring', v: 1_800_000 },
    { k: 'TV-Gelder', v: 1_120_000 },
    { k: 'Fanartikel', v: 220_000 },
  ],
  expenses: [
    { k: 'Gehälter', v: -2_410_000 },
    { k: 'Stadion & Betrieb', v: -480_000 },
    { k: 'Reise & Logistik', v: -118_000 },
    { k: 'Nachwuchs', v: -180_000 },
    { k: 'Verbandsabgabe', v: -300_000 },
  ],
  investBudget: 8_500_000,
  investSpent: 2_300_000,
}

export const STADIUM_INFO = {
  name: 'Hafenstadt-Arena',
  capacity: 27_412,
  built: '1968 · saniert 2014',
}

export const STANDS: Stand[] = [
  {
    id: 'N',
    name: 'Nordtribüne',
    cap: 8200,
    seats: 5400,
    standing: 2680,
    vip: 120,
    roof: 'full',
    rows: 24,
    blocks: 8,
    upgrade: 'Steh-/Sitz-Umbau · + 1.200 Sitzplätze',
    upgradeCost: '1,4 Mio. €',
  },
  {
    id: 'S',
    name: 'Südtribüne',
    cap: 7800,
    seats: 2200,
    standing: 5600,
    vip: 0,
    roof: 'open',
    rows: 18,
    blocks: 6,
    upgrade: 'Überdachung · Komplettdach',
    upgradeCost: '3,2 Mio. €',
  },
  {
    id: 'O',
    name: 'Osttribüne',
    cap: 5900,
    seats: 5340,
    standing: 0,
    vip: 560,
    roof: 'full',
    rows: 22,
    blocks: 5,
    upgrade: 'VIP-Logen aufstocken · + 40 Plätze',
    upgradeCost: '960.000 €',
  },
  {
    id: 'W',
    name: 'Westtribüne',
    cap: 5512,
    seats: 3712,
    standing: 1800,
    vip: 0,
    roof: 'partial',
    rows: 20,
    blocks: 5,
    upgrade: 'Dach vorziehen · vollständig überdacht',
    upgradeCost: '1,1 Mio. €',
  },
]

export const STADIUM_TYPES: StadiumType[] = [
  {
    id: 'dorf',
    name: 'Dorfplatz',
    stands: 1,
    capRange: '500 – 3.000',
    pitch: 'Naturrasen',
    desc: 'Eine Stehtribüne längs zum Spielfeld, ein Container als Klubhaus.',
  },
  {
    id: 'garten',
    name: 'Klubgarten',
    stands: 2,
    capRange: '3.000 – 12.000',
    pitch: 'Naturrasen',
    desc: 'Zwei Längstribünen, davon eine überdacht.',
  },
  {
    id: 'standard',
    name: 'Standard',
    stands: 4,
    capRange: '12.000 – 40.000',
    pitch: 'Hybridrasen',
    desc: 'Vier Tribünen, ein Block für Auswärtsfans.',
    current: true,
  },
  {
    id: 'huf',
    name: 'Hufeisen',
    stands: 3,
    capRange: '25.000 – 55.000',
    pitch: 'Hybridrasen',
    desc: 'Drei verbundene Tribünen, eine offene Stirnseite.',
  },
  {
    id: 'arena',
    name: 'Geschlossene Arena',
    stands: 4,
    capRange: '40.000 – 75.000',
    pitch: 'Hybridrasen · klimatisiert',
    desc: 'Komplett umlaufende Tribüne, Vollüberdachung.',
  },
]

export const STADIUM_AMENITIES = [
  { label: 'Klubhotel', ok: true },
  { label: 'Nachwuchszentrum', ok: true },
  { label: 'Fanshop', ok: true },
  { label: 'Klubhaus', ok: true },
  { label: 'Bierstände ×14', ok: true },
  { label: 'Würstchenbude ×9', ok: true },
  { label: 'VIP-Catering', ok: true },
  { label: 'Vereinsrestaurant', ok: false },
]

export const ONBOARDING_CLUBS = [
  {
    id: 'hafenstadt',
    name: 'FC Hafenstadt',
    league: 'Aurelia Premier',
    pitch: 'Hafenstadt erwartet einen Trainer mit ruhiger Hand.',
  },
  {
    id: 'auerbach',
    name: 'SV Auerbach 02',
    league: 'Liga Norvania',
    pitch: 'Provinzklub mit großem Herz. Aufstieg in Reichweite.',
  },
  {
    id: 'kaltenbach',
    name: 'Sporting Kaltenbach',
    league: 'Liga Norvania',
    pitch: 'Strenges Budget, eiserne Disziplin.',
  },
  {
    id: 'riverdale',
    name: 'Riverdale Athletic',
    league: 'Aurelia Premier',
    pitch: 'Reiche Tradition, hungriger Vorstand.',
  },
  {
    id: 'sauveterre',
    name: 'Olympique Sauveterre',
    league: 'Liga Norvania',
    pitch: 'Romantischer Außenseiter.',
  },
  {
    id: 'oakport',
    name: 'Oakport United FC',
    league: 'Aurelia Premier',
    pitch: 'Industriestadt, kalter Wind, treue Fans.',
  },
] as const

export const COUNTRIES = [
  {
    n: 'Deutschland',
    flag: '🇩🇪',
    league: 'Aurelia Premier',
    tier: '1. Liga · 18 Klubs',
    sel: true,
  },
  { n: 'Italien', flag: '🇮🇹', league: 'Liga Norvania', tier: '1. Liga · 20 Klubs' },
  { n: 'Frankreich', flag: '🇫🇷', league: 'Liga Norvania', tier: '1. Liga · 20 Klubs' },
  { n: 'Japan', flag: '🇯🇵', league: 'Liga Norvania', tier: '1. Liga · 18 Klubs' },
  { n: 'Portugal', flag: '🇵🇹', league: 'Liga Norvania', tier: '1. Liga · 18 Klubs' },
]

export interface FilledSlot {
  i: number
  empty?: false
  name: string
  stamp: string
  size: number
  ratio: number
  mgr: string
  club: string
  season: string
}

export interface EmptySlot {
  i: number
  empty: true
}

export type SaveSlot = FilledSlot | EmptySlot

export const SAVE_SLOTS: SaveSlot[] = [
  {
    i: 1,
    name: 'FC Hafenstadt — Saison 3',
    stamp: 'gespeichert · vor 4 Min.',
    size: 46,
    ratio: 0.18,
    mgr: 'JL',
    club: 'FC Hafenstadt',
    season: '2026/27',
  },
  {
    i: 2,
    name: 'SV Auerbach 02 — Aufstiegsjahr',
    stamp: 'gespeichert · gestern',
    size: 31,
    ratio: 0.12,
    mgr: 'JL',
    club: 'SV Auerbach 02',
    season: '2025/26',
  },
  { i: 3, empty: true },
]

export const nf = new Intl.NumberFormat('de-DE')
export const eur = (n: number) => `${nf.format(n)} €`
