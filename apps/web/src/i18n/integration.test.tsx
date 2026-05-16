import { render, screen } from '@testing-library/react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import { i18n } from './init'

function Sample() {
  const { t } = useTranslation()
  return (
    <div>
      <span data-testid="advance">{t('officeHub:advance')}</span>
      <span data-testid="count">{t('posteingang:unread', { count: 5 })}</span>
    </div>
  )
}

describe('i18n wiring', () => {
  it('renders German copy through the configured instance without suspense', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Sample />
      </I18nextProvider>,
    )
    expect(screen.getByTestId('advance')).toHaveTextContent('Weiter zum nächsten Termin')
    expect(screen.getByTestId('count')).toHaveTextContent('5 ungelesen')
  })
})
