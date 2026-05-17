import type { Club, ClubId, CrestSpec } from '@/types/club'

/**
 * Single source of truth for every fictional club referenced in the design.
 * Every screen that renders a crest or a club-tinted accent reads from here.
 * All clubs, colours and crests are invented (IP-clean per the brief).
 */
export const CLUB_REGISTRY: Record<ClubId, Club> = {
  hafenstadt: {
    id: 'hafenstadt',
    name: 'FC Hafenstadt',
    short: 'FCH',
    primary: '#0e3a5f',
    secondary: '#c8a45a',
    crest: { shape: 'heater', a: '#0e3a5f', b: '#c8a45a', charge: 'ship' },
  },
  northbridge: {
    id: 'northbridge',
    name: 'Northbridge City',
    short: 'NBC',
    primary: '#262626',
    secondary: '#c97a2a',
    crest: { shape: 'roundel', a: '#262626', b: '#c97a2a', charge: 'tower' },
  },
  kaltenbach: {
    id: 'kaltenbach',
    name: 'Sporting Kaltenbach',
    short: 'SPK',
    primary: '#4a2a2a',
    secondary: '#d8c8a8',
    crest: { shape: 'gonfalon', a: '#4a2a2a', b: '#d8c8a8', charge: 'sword' },
  },
  sauveterre: {
    id: 'sauveterre',
    name: 'Olympique Sauveterre',
    short: 'OSV',
    primary: '#1f4a3a',
    secondary: '#e8d28a',
    crest: { shape: 'iberian', a: '#1f4a3a', b: '#e8d28a', charge: 'eagle' },
  },
  auerbach: {
    id: 'auerbach',
    name: 'SV Auerbach 02',
    short: 'SVA',
    primary: '#2b6b3f',
    secondary: '#f4e4b8',
    crest: { shape: 'iberian', a: '#2b6b3f', b: '#f4e4b8', charge: 'wave' },
  },
  valguarda: {
    id: 'valguarda',
    name: 'AC Valguarda',
    short: 'ACV',
    primary: '#7a1a1a',
    secondary: '#f0e8d8',
    crest: { shape: 'gonfalon', a: '#7a1a1a', b: '#f0e8d8', charge: 'lion' },
  },
  riverdale: {
    id: 'riverdale',
    name: 'Riverdale Athletic',
    short: 'RVA',
    primary: '#7a1a1a',
    secondary: '#f0e8d8',
    crest: { shape: 'roundel', a: '#7a1a1a', b: '#f0e8d8', charge: 'lion' },
  },
  oakport: {
    id: 'oakport',
    name: 'Oakport United FC',
    short: 'OAK',
    primary: '#2a221c',
    secondary: '#c97a2a',
    crest: { shape: 'heater', a: '#262626', b: '#c97a2a', charge: 'cog' },
  },
}

export function clubById(id: ClubId): Club {
  return CLUB_REGISTRY[id]
}

/** Lookup by full club name. Falls back to Hafenstadt for unknown names. */
export function clubByName(name: string): Club {
  for (const club of Object.values(CLUB_REGISTRY)) {
    if (club.name === name) return club
  }
  return CLUB_REGISTRY.hafenstadt
}

export function crestFor(name: string): CrestSpec {
  return clubByName(name).crest
}

/** Direction A theme key used to scope a club-tinted theme. */
export function themeKeyFor(clubId: ClubId): string {
  return `A_${clubId}`
}
