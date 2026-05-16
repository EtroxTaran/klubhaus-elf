import { describe, expect, it } from 'vitest'
import { i18n, initI18n, loadEnglish } from './init'

describe('initI18n', () => {
  it('loads German home copy by default', async () => {
    const i18n = await initI18n()

    expect(i18n.t('home:badge')).toBe('Phase 0 Bootstrap')
  })

  it('does not ship English on the critical path', async () => {
    await initI18n()
    expect(i18n.hasResourceBundle('en', 'officeHub')).toBe(false)
  })
})

describe('loadEnglish', () => {
  it('adds the English bundles on demand', async () => {
    await initI18n()
    await loadEnglish()

    expect(i18n.hasResourceBundle('en', 'officeHub')).toBe(true)
    expect(i18n.t('officeHub:advance', { lng: 'en' })).toBe('Advance to next event')
  })
})
