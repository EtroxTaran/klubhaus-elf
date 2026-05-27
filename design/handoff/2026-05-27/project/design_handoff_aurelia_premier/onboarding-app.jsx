// onboarding-app.jsx — Onboarding flow definition.
// Shell + state lives in prototype-shell.jsx.

const ONBOARDING_FLOW = [
  {
    id: 'country',
    name: 'Land & Liga',
    title: 'Wo willst du trainieren?',
    sub: 'Land + Spielklasse in einem Schritt. Echte Liganamen, nur ein paar Auswahlen — keine Endlosliste.',
    render: () => <ScreenOnboardingCountry theme="A" scheme="light" />,
    hint: { x: '50%', y: '94%', label: 'Weiter', dir: 'down' },
  },
  {
    id: 'club',
    name: 'Verein',
    title: 'Wähle deinen Verein',
    sub: 'Sechs prozedural gewürfelte Klubs mit Wappen, Stadt, Spielklasse und Saison-Erwartung. Der Würfel-Knopf wirft neue Optionen.',
    render: () => <ScreenOnboardingClub theme="A" scheme="light" />,
    hint: { x: '50%', y: '94%', label: 'Weiter', dir: 'down' },
  },
  {
    id: 'manager',
    name: 'Manager',
    title: 'Erstelle deinen Manager',
    sub: 'Name, Initialen, Spielstil. Kein Foto-Upload — der Initialen-Chip wird zur Marke des Karriere-Slots.',
    render: () => <ScreenOnboardingManager theme="A" scheme="light" />,
    hint: { x: '50%', y: '94%', label: 'Karriere starten', dir: 'down' },
  },
  {
    id: 'welcome',
    name: 'Willkommen',
    title: 'Hafenstadt heißt dich willkommen',
    sub: 'Welcome-Moment: Wappen, Heimtrikot, Manager-Initialen, erste Schlagzeile. Trikot wird über Identity-Studio prozedural komponiert.',
    render: () => (
      <ScreenIdentityWelcome
        theme="A"
        scheme="light"
        clubId="hafenstadt"
        mgrName="Julia Lindquist"
        mgrInitials="JL"
      />
    ),
    hint: { x: '50%', y: '94%', label: 'Zum Büro', dir: 'down' },
  },
  {
    id: 'hub',
    name: 'Erster Tag',
    title: 'Dein erster Tag im Büro',
    sub: 'Der Hub übernimmt sofort die Klubfarbe. Ab hier beginnt der Anpfiff-Loop — Tippe, um die Onboarding-Schleife neu zu starten.',
    render: () => <ScreenHub theme="A" scheme="light" />,
    hint: { x: '50%', y: '93%', label: 'Nächster Termin', dir: 'down' },
  },
];

mountPrototype(ONBOARDING_FLOW, { kicker: 'Clickable Prototype · Onboarding' });
