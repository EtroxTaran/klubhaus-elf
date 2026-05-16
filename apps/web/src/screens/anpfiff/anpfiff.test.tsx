import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Anpfiff } from './anpfiff'

describe('Anpfiff', () => {
  it('shows both clubs, the stat strips and the H2H quote', async () => {
    await renderScreen(<Anpfiff />, '/anpfiff')
    expect(screen.getByText('Northbridge City')).toBeInTheDocument()
    expect(screen.getByText('FC Hafenstadt')).toBeInTheDocument()
    expect(screen.getByText('Stärke (Ø)')).toBeInTheDocument()
    expect(
      screen.getByText('„Hafenstadt hat in Northbridge zuletzt 2018 verloren."'),
    ).toBeInTheDocument()
  })

  it('routes the Anpfiff CTA to the match feed', async () => {
    await renderScreen(<Anpfiff />, '/anpfiff')
    expect(screen.getByRole('link', { name: 'Anpfiff' })).toHaveAttribute('href', '/spiel')
  })
})
