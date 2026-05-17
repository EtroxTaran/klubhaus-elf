import { describe, expect, it } from 'vitest'
import { CLUB_REGISTRY, clubById, clubByName, crestFor, kitFor, themeKeyFor } from './club-registry'

describe('CLUB_REGISTRY', () => {
  it('contains the eight fictional clubs with IP-clean names', () => {
    expect(Object.keys(CLUB_REGISTRY)).toHaveLength(8)
    expect(CLUB_REGISTRY.hafenstadt.name).toBe('FC Hafenstadt')
    expect(CLUB_REGISTRY.hafenstadt.primary).toBe('#0e3a5f')
  })

  it('every club carries a complete crest spec', () => {
    for (const club of Object.values(CLUB_REGISTRY)) {
      expect(club.crest.shape).toBeTruthy()
      expect(club.crest.charge).toBeTruthy()
      expect(club.crest.a).toMatch(/^#[0-9a-f]{6}$/i)
      expect(club.crest.b).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('every club carries a kit spec', () => {
    for (const club of Object.values(CLUB_REGISTRY)) {
      expect(club.kit.pattern).toBeTruthy()
      expect(typeof club.kit.sleeveAccent).toBe('boolean')
    }
  })
})

describe('kitFor', () => {
  it('returns the kit of a named club', () => {
    expect(kitFor('FC Hafenstadt')).toEqual(CLUB_REGISTRY.hafenstadt.kit)
  })

  it('falls back to the Hafenstadt kit for an unknown name', () => {
    expect(kitFor('Unbekannter SV')).toEqual(CLUB_REGISTRY.hafenstadt.kit)
  })
})

describe('clubByName', () => {
  it('resolves an exact club name', () => {
    expect(clubByName('Northbridge City').id).toBe('northbridge')
  })

  it('falls back to Hafenstadt for an unknown name', () => {
    expect(clubByName('Unbekannter SV').id).toBe('hafenstadt')
  })
})

describe('clubById', () => {
  it('resolves a known id', () => {
    expect(clubById('kaltenbach').short).toBe('SPK')
  })
})

describe('crestFor', () => {
  it('returns the crest of a named club', () => {
    expect(crestFor('SV Auerbach 02')).toEqual(CLUB_REGISTRY.auerbach.crest)
  })
})

describe('themeKeyFor', () => {
  it('derives the Direction A theme key for a club', () => {
    expect(themeKeyFor('sauveterre')).toBe('A_sauveterre')
  })
})
