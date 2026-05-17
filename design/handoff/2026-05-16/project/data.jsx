// data.jsx — sample data, IP-clean
// Currency formatter: German thousand-separator
const eur = (n) => new Intl.NumberFormat('de-DE').format(n) + ' €';
const eurK = (n) => {
  if (Math.abs(n) >= 1_000_000) return (n/1_000_000).toFixed(1).replace('.', ',') + ' Mio. €';
  if (Math.abs(n) >= 1_000) return new Intl.NumberFormat('de-DE').format(n) + ' €';
  return n + ' €';
};

// Squad — FC Hafenstadt, full 14 (11 starters + 3 bench)
const SQUAD = [
  { n:'Lars Wendling',     pos:'TW', age:29, str:7, tal:3, form:'7,4', contract:'06/26', nat:'DE', shirt:1 },
  { n:'Mateo Carrara',     pos:'IV', age:27, str:8, tal:3, form:'7,8', contract:'06/27', nat:'IT', shirt:4 },
  { n:'Felipe Manso',      pos:'IV', age:24, str:7, tal:4, form:'7,1', contract:'06/28', nat:'PT', shirt:5 },
  { n:'Jonas Bredow',      pos:'AV', age:22, str:6, tal:4, form:'6,9', contract:'06/27', nat:'DE', shirt:18 },
  { n:'Kaito Furukawa',    pos:'AV', age:25, str:7, tal:3, form:'7,3', contract:'06/26', nat:'JP', shirt:22 },
  { n:'Sven Holtmann',     pos:'DM', age:31, str:7, tal:2, form:'6,8', contract:'06/26', nat:'DE', shirt:6 },
  { n:'Tobias Reiter',     pos:'ZM', age:28, str:8, tal:3, form:'8,1', contract:'06/28', nat:'DE', shirt:8 },
  { n:'Niko Velten',       pos:'ZM', age:21, str:6, tal:4, form:'7,0', contract:'06/29', nat:'DE', shirt:14 },
  { n:'Marek Brody',       pos:'OM', age:26, str:8, tal:3, form:'8,4', contract:'06/27', nat:'DE', shirt:10 },
  { n:'Aleksy Wieser',     pos:'ST', age:23, str:7, tal:4, form:'7,9', contract:'06/28', nat:'DE', shirt:9 },
  { n:'Florian Kalt',      pos:'ST', age:30, str:7, tal:2, form:'6,5', contract:'06/26', nat:'DE', shirt:11 },
  // Bank
  { n:'Davor Krause',      pos:'TW', age:22, str:5, tal:3, form:'6,4', contract:'06/27', nat:'DE', shirt:31, bench:true },
  { n:'Henrik Voss',       pos:'IV', age:19, str:5, tal:4, form:'6,7', contract:'06/29', nat:'DE', shirt:24, bench:true },
  { n:'Pavel Schramm',     pos:'OM', age:20, str:6, tal:4, form:'7,2', contract:'06/28', nat:'DE', shirt:17, bench:true },
];

// Match feed for the text-feed tier
const FEED = [
  { min:'90+3', kind:'whistle', t:'Abpfiff.', s:'Hafenstadt-Arena tobt. 2:1.' },
  { min:"88'",  kind:'sub',     t:'Wechsel · Hafenstadt', s:'Velten kommt für Holtmann.' },
  { min:"82'",  kind:'goal',    t:'TOR! Brody (Hafenstadt)', s:'Volley aus 14 Metern, unhaltbar.', score:'2:1' },
  { min:"76'",  kind:'card',    t:'Gelb · Northbridge', s:'Foul an Brody, der Schiri zückt die Karte.' },
  { min:"71'",  kind:'chance',  t:'Chance · Hafenstadt', s:'Wieser zwingt den Keeper zur Glanzparade.' },
  { min:"58'",  kind:'goal',    t:'TOR! Tarrant (Northbridge)', s:'Kopfball nach Eckstoß.', score:'1:1' },
  { min:"46'",  kind:'whistle', t:'Wiederanpfiff.', s:'2. Halbzeit läuft.' },
  { min:"45'",  kind:'whistle', t:'Halbzeit.', s:'Hafenstadt führt verdient.' },
  { min:"34'",  kind:'goal',    t:'TOR! Wieser (Hafenstadt)', s:'Konter über links — eiskalt vollendet.', score:'1:0' },
  { min:"12'",  kind:'set',     t:'Eckstoß für Hafenstadt', s:'Reiter tritt — abgeklärt.' },
  { min:"1'",   kind:'whistle', t:'Anpfiff.', s:'Hafenstadt-Arena, 27.412 Zuschauer.' },
];

// Inbox events
const INBOX = [
  {
    from:'Vorstand', avatar:'V', tone:'board',
    title:'Drei Punkte — oder es wird ungemütlich.',
    body:'„Lieber Trainer, der Aufsichtsrat erwartet am Sonntag in Northbridge einen Sieg. Sie wissen, was auf dem Spiel steht."',
    time:'08:14', actions:['Annehmen','Vertagen','Ablehnen','Ignorieren']
  },
  {
    from:'Auerbach-Zeitung', avatar:'A', tone:'media',
    title:'„Brody schießt sich in die Herzen"',
    body:'Die Tabloidseite widmet Ihrem Spielmacher eine ganze Seite. Stellungnahme?',
    time:'07:42', actions:['Annehmen','Vertagen','Ablehnen','Ignorieren']
  },
  {
    from:'Volta Bank', avatar:'V', tone:'sponsor',
    title:'Trikotsponsor — Verlängerung um 2 Jahre',
    body:'Angebot: 1,8 Mio. € pro Saison. Wir wären stolz, weiter auf Ihrer Brust zu stehen.',
    time:'gestern', actions:['Annehmen','Vertagen','Ablehnen','Ignorieren']
  },
  {
    from:'Scout · Mertens', avatar:'M', tone:'scout',
    title:'Talent in Riverdale entdeckt',
    body:'Rechtsfuß, 18, OM. Mein Bauchgefühl sagt: vier Sterne. Reise lohnt sich.',
    time:'gestern', actions:['Annehmen','Vertagen','Ablehnen','Ignorieren']
  },
  {
    from:'Fanclub Hafentor', avatar:'F', tone:'fan',
    title:'Bitte: Mehr Stehplätze in Block N.',
    body:'„Wir stehen, wir singen, wir gewinnen." Petition mit 4.220 Unterschriften beigefügt.',
    time:'Mo', actions:['Annehmen','Vertagen','Ablehnen','Ignorieren']
  },
];

// Fixtures
const FIXTURES = [
  { date:'So 24. Mai',  comp:'Aurelia Premier · 32. Spieltag', home:'Northbridge City', away:'FC Hafenstadt', venue:'Northbridge Arena', tickets:'A · Auswärts' },
  { date:'Mi 28. Mai',  comp:'Confederation Cup · Achtelfinale', home:'FC Hafenstadt', away:'AC Valguarda', venue:'Hafenstadt-Arena', tickets:'H · Heim' },
  { date:'So 01. Jun',  comp:'Aurelia Premier · 33. Spieltag', home:'FC Hafenstadt', away:'SV Auerbach 02', venue:'Hafenstadt-Arena', tickets:'H · Heim' },
];

// Opponent (pre-match)
const OPP = {
  name:'Northbridge City', short:'NBC',
  agg:7.4, form:'WUNSU', tableRank:4, ranking:'4. Tabellenplatz',
  key:[
    { n:'Owen Tarrant', pos:'ST', tag:'9 Tore' },
    { n:'Cory Halligan', pos:'ZM', tag:'Schaltzentrale' },
    { n:'M. Ouellet', pos:'TW', tag:'73% Quote' },
  ],
  h2h:'2N · 1U · 2S (letzte 5)',
};
const OWN = {
  name:'FC Hafenstadt', short:'FCH',
  agg:7.6, form:'SSNSU', tableRank:2, ranking:'2. Tabellenplatz',
  key:[
    { n:'Marek Brody', pos:'OM', tag:'12 Vorlagen' },
    { n:'Tobias Reiter', pos:'ZM', tag:'Spielmacher' },
    { n:'Aleksy Wieser', pos:'ST', tag:'14 Tore' },
  ],
  h2h:'',
};

// Finance — monthly
const FIN = {
  cash: 14_280_500,
  monthlyRev: 4_120_000,
  monthlyExp: 3_488_000,
  ops: [
    { k:'Ticketing',          v: 980_000 },
    { k:'Sponsoring',          v: 1_800_000 },
    { k:'TV-Gelder',           v: 1_120_000 },
    { k:'Fanartikel',          v: 220_000 },
  ],
  expenses: [
    { k:'Gehälter',            v: -2_410_000 },
    { k:'Stadion & Betrieb',   v: -480_000 },
    { k:'Reise & Logistik',    v: -118_000 },
    { k:'Nachwuchs',           v: -180_000 },
    { k:'Verbandsabgabe',      v: -300_000 },
  ],
  investBudget: 8_500_000,
  investSpent:  2_300_000,
};

// Stadium — capacity total derived from stands
const STADIUM_INFO = {
  name:'Hafenstadt-Arena',
  capacity: 27412,
  built:'1968 · saniert 2014',
};
// Stands (Tribünen) — rich breakdown
const STANDS = [
  { id:'N', name:'Nordtribüne',  cap:8200,  seats:5400, standing:2680, vip:120,
    roof:'full',  rows:24, blocks:8,
    upgrade:'Steh-/Sitz-Umbau möglich · + 1.200 Sitzplätze',
    upgradeCost:'1,4 Mio. €' },
  { id:'S', name:'Südtribüne',   cap:7800,  seats:2200, standing:5600, vip:0,
    roof:'open',  rows:18, blocks:6,
    upgrade:'Überdachung möglich · Komplettdach',
    upgradeCost:'3,2 Mio. €' },
  { id:'O', name:'Osttribüne',   cap:5900,  seats:5340, standing:0,    vip:560,
    roof:'full',  rows:22, blocks:5,
    upgrade:'VIP-Logen aufstocken · + 40 Plätze',
    upgradeCost:'960.000 €' },
  { id:'W', name:'Westtribüne',  cap:5512,  seats:3712, standing:1800, vip:0,
    roof:'partial', rows:20, blocks:5,
    upgrade:'Dach vorziehen · vollständig überdacht',
    upgradeCost:'1,1 Mio. €' },
];
// Stadium type progression — five archetypes, used as a horizontal gallery
const STADIUM_TYPES = [
  { id:'dorf',    name:'Dorfplatz',     stands:1, capRange:'500 – 3.000',
    pitch:'Naturrasen', desc:'Eine Stehtribüne längs zum Spielfeld, ein Container als Klubhaus.' },
  { id:'garten',  name:'Klubgarten',    stands:2, capRange:'3.000 – 12.000',
    pitch:'Naturrasen', desc:'Zwei Längstribünen, davon eine überdacht. Hintertorbereich offen.' },
  { id:'standard',name:'Standard',      stands:4, capRange:'12.000 – 40.000',
    pitch:'Hybridrasen', desc:'Vier Tribünen, ein Block für Auswärtsfans. Klassisches Vereinsstadion.',
    current:true },
  { id:'huf',     name:'Hufeisen',      stands:3, capRange:'25.000 – 55.000',
    pitch:'Hybridrasen', desc:'Drei verbundene Tribünen, eine offene Stirnseite — wahlweise Bühne.' },
  { id:'arena',   name:'Geschlossene Arena', stands:4, capRange:'40.000 – 75.000',
    pitch:'Hybridrasen · klimatisiert', desc:'Komplett umlaufende Tribüne, Vollüberdachung, mehrzweck­tauglich.' },
];
// Rasen & Licht
const PITCH_LIGHT = [
  { id:'grass',  name:'Rasenheizung',  status:'Aktiv · ganzjährig', detail:'Frostschäden im Winter ausgeschlossen', cost:null },
  { id:'drain',  name:'Drainage',      status:'Stufe 2 von 3',      detail:'+ 12 % Spielfähigkeit bei Starkregen', cost:'420.000 €' },
  { id:'light',  name:'Flutlicht',     status:'1.800 Lux · UEFA-tauglich', detail:'Stufe 3 von 4 · Upgrade auf 2.400 Lux möglich', cost:'680.000 €' },
  { id:'screen', name:'Anzeigetafel',  status:'LED · 12×6 m',       detail:'Sponsorenflächen ausgebaut',             cost:null },
];
// Anbauten — buildings around the stadium
const STADIUM = [
  { id:'hotel',    name:'Klubhotel',        status:'Stufe 2', detail:'120 Zimmer · 78% Auslastung', roi:'+ 42.000 € / Monat', cost:'1,8 Mio. €' },
  { id:'shop',     name:'Fanshop',          status:'Stufe 3', detail:'650 m² · zwei Stockwerke',     roi:'+ 28.500 € / Monat', cost:'820.000 €' },
  { id:'academy',  name:'Nachwuchszentrum', status:'Stufe 1', detail:'4 Plätze · Internat geplant',  roi:'+ 1 Talent / Saison', cost:'2,4 Mio. €' },
  { id:'club',     name:'Klubhaus',         status:'Stufe 2', detail:'Vereinsheim · Mitgliederlounge', roi:'+ 8.400 € / Monat',  cost:'540.000 €' },
  { id:'food',     name:'Vereinsrestaurant',status:'Slot frei', detail:'Empfehlung des Vorstands',    roi:'Schätzung: + 18.000 € / Monat', cost:'640.000 €' },
];
// Gastronomie an Spieltagen
const GASTRO = [
  { id:'beer',    name:'Bierstände',          status:'14 Stände',     detail:'1 pro 1.960 Zuschauer',   roi:'+ 22.000 € / Heimspiel', cost:'2.400 € / Stand' },
  { id:'wurst',   name:'Würstchenbuden',      status:'9 Stände',      detail:'eng am Block N und S',    roi:'+ 14.500 € / Heimspiel', cost:'1.800 € / Stand' },
  { id:'vip',     name:'VIP-Catering',        status:'Stufe 2',       detail:'88 Logenplätze versorgt',  roi:'+ 9.200 € / Heimspiel',  cost:null },
  { id:'kiosk',   name:'Fan-Kioske',          status:'Slot frei',     detail:'Brezel, Cola, Programmheft', roi:'Schätzung: + 6.000 € / Heimspiel', cost:'180.000 €' },
];

// Onboarding club choices
const CLUBS_PROC = [
  { n:'FC Hafenstadt',     league:'Aurelia Premier',  pitch:'Hafenstadt erwartet einen Trainer mit ruhiger Hand.', shape:'heater', a:'#0e3a5f', b:'#c8a45a', charge:'ship' },
  { n:'SV Auerbach 02',    league:'Liga Norvania',    pitch:'Provinzklub mit großem Herz. Aufstieg in Reichweite.', shape:'iberian', a:'#2b6b3f', b:'#f4e4b8', charge:'wave' },
  { n:'Sporting Kaltenbach',league:'Liga Norvania',  pitch:'Strenges Budget, eiserne Disziplin. Wer hier formt, formt Helden.', shape:'gonfalon', a:'#4a2a2a', b:'#d8c8a8', charge:'sword' },
  { n:'Riverdale Athletic',league:'Aurelia Premier',  pitch:'Reiche Tradition, hungriger Vorstand. Schnell liefern.', shape:'roundel', a:'#7a1a1a', b:'#f0e8d8', charge:'lion' },
  { n:'Olympique Sauveterre',league:'Liga Norvania', pitch:'Romantischer Außenseiter. Talente reifen, Trainer ergrauen.', shape:'iberian', a:'#1f4a3a', b:'#e8d28a', charge:'eagle' },
  { n:'Oakport United FC', league:'Aurelia Premier',  pitch:'Industriestadt, kalter Wind, treue Fans. Geld kommt selten.', shape:'heater', a:'#262626', b:'#c97a2a', charge:'cog' },
];

const SAVE_SLOTS = [
  { i:1, name:'FC Hafenstadt — Saison 3', stamp:'gespeichert · vor 4 Min.', size:46, ratio:0.18, mgr:'JL', club:'FC Hafenstadt', season:'2026/27' },
  { i:2, name:'SV Auerbach 02 — Aufstiegsjahr', stamp:'gespeichert · gestern', size:31, ratio:0.12, mgr:'JL', club:'SV Auerbach 02', season:'2025/26' },
  { i:3, name:'Leer', empty:true },
];

// ---------- CLUB_REGISTRY ----------
// Single source of truth for every fictional club referenced in the design.
// Every screen that renders a crest or a club-tinted accent reads from here.
// `id` is the stable key used to register a derived theme (see more.jsx).
const CLUB_REGISTRY = {
  hafenstadt: { id:'hafenstadt', name:'FC Hafenstadt',        short:'FCH', primary:'#0e3a5f', secondary:'#c8a45a',
                crest:{shape:'heater',   a:'#0e3a5f', b:'#c8a45a', charge:'ship'} },
  northbridge:{ id:'northbridge', name:'Northbridge City',    short:'NBC', primary:'#262626', secondary:'#c97a2a',
                crest:{shape:'roundel',  a:'#262626', b:'#c97a2a', charge:'tower'} },
  kaltenbach: { id:'kaltenbach', name:'Sporting Kaltenbach',  short:'SPK', primary:'#4a2a2a', secondary:'#d8c8a8',
                crest:{shape:'gonfalon', a:'#4a2a2a', b:'#d8c8a8', charge:'sword'} },
  sauveterre: { id:'sauveterre', name:'Olympique Sauveterre', short:'OSV', primary:'#1f4a3a', secondary:'#e8d28a',
                crest:{shape:'iberian',  a:'#1f4a3a', b:'#e8d28a', charge:'eagle'} },
  auerbach:   { id:'auerbach', name:'SV Auerbach 02',         short:'SVA', primary:'#2b6b3f', secondary:'#f4e4b8',
                crest:{shape:'iberian',  a:'#2b6b3f', b:'#f4e4b8', charge:'wave'} },
  valguarda:  { id:'valguarda', name:'AC Valguarda',          short:'ACV', primary:'#7a1a1a', secondary:'#f0e8d8',
                crest:{shape:'gonfalon', a:'#7a1a1a', b:'#f0e8d8', charge:'lion'} },
  riverdale:  { id:'riverdale', name:'Riverdale Athletic',    short:'RVA', primary:'#7a1a1a', secondary:'#f0e8d8',
                crest:{shape:'roundel',  a:'#7a1a1a', b:'#f0e8d8', charge:'lion'} },
  oakport:    { id:'oakport', name:'Oakport United FC',       short:'OAK', primary:'#2a221c', secondary:'#c97a2a',
                crest:{shape:'heater',   a:'#262626', b:'#c97a2a', charge:'cog'} },
};
// Lookup by full club name (used by inline screens). Falls back to Hafenstadt.
const clubByName = (name) => {
  for (const k in CLUB_REGISTRY) {
    if (CLUB_REGISTRY[k].name === name) return CLUB_REGISTRY[k];
  }
  return CLUB_REGISTRY.hafenstadt;
};
const crestFor   = (name) => clubByName(name).crest;
const themeKeyFor = (clubId) => 'A_' + clubId;

Object.assign(window, {
  SQUAD, FEED, INBOX, FIXTURES, OPP, OWN, FIN, STADIUM, STADIUM_INFO,
  STANDS, STADIUM_TYPES, PITCH_LIGHT, GASTRO, CLUBS_PROC, SAVE_SLOTS,
  CLUB_REGISTRY, clubByName, crestFor, themeKeyFor,
  eur, eurK,
});
