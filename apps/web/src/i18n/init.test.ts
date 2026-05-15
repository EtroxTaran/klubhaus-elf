import { describe, expect, it } from 'vitest'
import { initI18n } from './init'

describe('initI18n', () => {
  it('loads German home copy by default', async () => {
    const i18n = await initI18n()

    expect(i18n.t('home:badge')).toBe('Phase 0 Bootstrap')
  })
})
