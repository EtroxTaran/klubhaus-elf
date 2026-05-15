import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { de } from '../locales/de'
import { en } from '../locales/en'

let initPromise: Promise<typeof i18next> | undefined

export function initI18n() {
  initPromise ??= i18next
    .use(initReactI18next)
    .init({
      fallbackLng: 'de',
      interpolation: {
        escapeValue: false,
      },
      lng: 'de',
      resources: {
        de,
        en,
      },
    })
    .then(() => i18next)

  return initPromise
}
