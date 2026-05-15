export const de = {
  home: {
    badge: 'Phase 0 Bootstrap',
    title: 'Dein Fußballverein, offline spielbar und bereit für lange Karrieren.',
    intro:
      'soccer-manager legt die technische Basis für Liga, Pokal, Stadion, Finanzen, Transfers, Jugend und eine deterministische Match-Simulation.',
    cards: {
      offline: {
        title: 'Offline-first',
        body: 'Karrieren werden lokal in IndexedDB vorbereitet; Cloud-Sync bleibt optional.',
      },
      simulation: {
        title: 'Deterministisch',
        body: 'Die Match-Engine wird seed-basiert, testbar und frei von React-Abhängigkeiten.',
      },
      career: {
        title: 'Karriere-Fokus',
        body: 'Mobile-first Bedienung für Saisonrhythmus, Kaderplanung und Vereinsentwicklung.',
      },
    },
  },
} as const
