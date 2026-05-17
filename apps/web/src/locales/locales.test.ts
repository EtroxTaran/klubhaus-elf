import { describe, expect, it } from 'vitest'
import { de } from './de'
import { en } from './en'

type Json = Record<string, unknown>

function leafPaths(obj: Json, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k
    return v !== null && typeof v === 'object' ? leafPaths(v as Json, path) : [path]
  })
}

const SCREEN_NAMESPACES = [
  'common',
  'officeHub',
  'posteingang',
  'kader',
  'anpfiff',
  'spiel',
  'halbzeit',
  'finanzen',
  'stadion',
  'onboarding',
  'karriere',
  'identity',
] as const

describe('locale resources', () => {
  it('expose every Phase-1 screen namespace in de', () => {
    for (const ns of SCREEN_NAMESPACES) {
      expect(de, `de.${ns}`).toHaveProperty(ns)
    }
  })

  it('keep de and en key sets in parity', () => {
    const deKeys = leafPaths(de).sort()
    const enKeys = leafPaths(en).sort()
    expect(enKeys).toEqual(deKeys)
  })

  it('carry de-DE Anstoss-register copy', () => {
    expect(de.officeHub.advance).toBe('Weiter zum nächsten Termin')
    expect(de.anpfiff.cta).toBe('Anpfiff')
    expect(de.posteingang.title).toBe('Posteingang')
    expect(de.finanzen.levy).toBe('Verbandsabgabe')
  })
})
