import type { Decorator } from '@storybook/react'
import { I18nextProvider } from 'react-i18next'
import { i18n } from '@/i18n/init'

// The i18n singleton auto-inits synchronously (de) at import time.
export const withI18n: Decorator = (Story) => (
  <I18nextProvider i18n={i18n}>
    <Story />
  </I18nextProvider>
)
