import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Kader } from './kader'

describe('Kader', () => {
  it('lists the squad with a bench divider', async () => {
    await renderScreen(<Kader />, '/kader')
    expect(screen.getByText('Erste Mannschaft')).toBeInTheDocument()
    expect(screen.getByText('Kader · 14 Spieler')).toBeInTheDocument()
    expect(screen.getByText('Marek Brody')).toBeInTheDocument()
    expect(screen.getByText('Bank')).toBeInTheDocument()
    expect(screen.getByText('Pavel Schramm')).toBeInTheDocument()
  })

  it('shows the sort chips', async () => {
    await renderScreen(<Kader />, '/kader')
    expect(screen.getByText('Stärke')).toBeInTheDocument()
    expect(screen.getByText('Vertrag')).toBeInTheDocument()
  })
})
