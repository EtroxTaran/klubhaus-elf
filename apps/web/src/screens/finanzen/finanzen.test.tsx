import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Finanzen } from './finanzen'

describe('Finanzen', () => {
  it('shows the balance, monthly result and the persistent levy chip', async () => {
    await renderScreen(<Finanzen />, '/finanzen')
    expect(screen.getByText('14.280.500 €')).toBeInTheDocument()
    expect(screen.getByText('+ 632.000 €')).toBeInTheDocument()
    expect(screen.getByText('Verbandsabgabe · 300.000 €')).toBeInTheDocument()
  })

  it('lists income and expense rows with German amounts', async () => {
    await renderScreen(<Finanzen />, '/finanzen')
    expect(screen.getByText('Sponsoring')).toBeInTheDocument()
    expect(screen.getByText('Gehälter')).toBeInTheDocument()
    expect(screen.getByText('+ 1.800.000 €')).toBeInTheDocument()
    expect(screen.getByText('– 2.410.000 €')).toBeInTheDocument()
  })
})
