// prototype-app.jsx — Match-Day Weekend flow definition.
// Shell + state lives in prototype-shell.jsx; this file is just the script.

const MATCH_DAY_FLOW = [
  {
    id: 'hub',
    name: 'Hub',
    title: 'Büro · Sonntagvormittag',
    sub: 'Tippe auf den Anpfiff-Knopf unten — der einzige scharlachrote Block der App.',
    render: () => <ScreenHub theme="A" scheme="light" />,
    hint: { x: '50%', y: '93%', label: 'Anpfiff', dir: 'down' },
  },
  {
    id: 'inbox',
    name: 'Posteingang',
    title: 'Vorstandsbrief',
    sub: 'Der Vorstand erwartet einen Heimsieg. Tippe die Karte an, um zur Spielvorbereitung zu wechseln.',
    render: () => <ScreenInbox theme="A" scheme="light" />,
    hint: { x: '50%', y: '24%', label: 'Pflicht: Heimsieg', dir: 'up' },
  },
  {
    id: 'prematch',
    name: 'Vor dem Anpfiff',
    title: 'Aurelia FC vs Auerbach',
    sub: 'Aufstellung, Direktvergleich, Schlüsselspieler. Der scharlachrote Anpfiff-CTA gewinnt jeden Vergleich.',
    render: () => <ScreenPreMatch theme="A" scheme="light" />,
    hint: { x: '50%', y: '93%', label: 'Anpfiff', dir: 'down' },
  },
  {
    id: 'match',
    name: 'Spielreportage',
    title: '1. Halbzeit · live',
    sub: 'Newspaper-Typo, Minute links, Schlagzeile rechts. Tippe, um zur Halbzeit zu springen.',
    render: () => <ScreenMatchFeed theme="A" scheme="light" />,
    hint: { x: '50%', y: '93%', label: 'Halbzeitpfiff', dir: 'down' },
  },
  {
    id: 'halftime',
    name: 'Halbzeit',
    title: 'Pausenkabine',
    sub: 'Drei Pflichtknöpfe: Formation, Mentalität, vorgeschlagener Wechsel. Tippe, um die zweite Hälfte zu starten.',
    render: () => <ScreenHalftime theme="A" scheme="light" />,
    hint: { x: '50%', y: '93%', label: 'Zweite Hälfte', dir: 'down' },
  },
  {
    id: 'tabloid',
    name: 'Tabloid · Sonntag',
    title: 'Schlagzeile am nächsten Morgen',
    sub: 'Heimsieg. Ende der Schleife. Tippe, um die Karriere von vorn zu starten.',
    render: () => <ScreenTabloidCover theme="A" scheme="light" tone="triumph" />,
    hint: { x: '50%', y: '95%', label: 'Neue Woche', dir: 'down' },
  },
];

mountPrototype(MATCH_DAY_FLOW, { kicker: 'Clickable Prototype · Match-Day Weekend' });
