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
      react: {
        // Inline resources are synchronous — no Suspense needed (SSR-safe).
        useSuspense: false,
      },
      resources: {
        de,
        en,
      },
    })
    .then(() => i18next)

  return initPromise
}

// Kick off synchronous init at module load so the singleton is render-ready
// on both server and client (inline resources resolve immediately).
initI18n()

export { i18next as i18n }
