import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { de } from '../locales/de'

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
      // Only the active language is on the critical path. English is kept
      // ready (i18n rule 70) but loaded on demand as a separate chunk to
      // keep first-load main-thread work (TBT) low — see D-002.
      resources: {
        de,
      },
    })
    .then(() => i18next)

  return initPromise
}

/**
 * Loads the English bundle on demand (e.g. when a language switch is added
 * post-MVP). Kept off the initial hydration path on purpose.
 */
export async function loadEnglish(): Promise<void> {
  const { en } = await import('../locales/en')
  for (const [ns, resources] of Object.entries(en)) {
    i18next.addResourceBundle('en', ns, resources, true, true)
  }
}

// Kick off synchronous init at module load so the singleton is render-ready
// on both server and client (inline resources resolve immediately).
initI18n()

export { i18next as i18n }
