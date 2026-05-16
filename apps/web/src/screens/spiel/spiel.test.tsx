import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Spiel } from './spiel'

describe('Spiel', () => {
  it('renders the pinned score header, xG strip and feed', async () => {
    await renderScreen(<Spiel />, '/spiel')
    expect(screen.getByText('● LIVE · 90+3')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'xG-Verlauf FCH gegen NBC' })).toBeInTheDocument()
    expect(screen.getByText('TOR! Brody (Hafenstadt)')).toBeInTheDocument()
  })

  it('does not show the half-time sheet by default', async () => {
    await renderScreen(<Spiel />, '/spiel')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('shows the half-time sheet when opened', async () => {
    await renderScreen(<Spiel halftimeOpen />, '/spiel')
    expect(screen.getByRole('dialog', { name: 'Was passen wir an?' })).toBeInTheDocument()
  })
})
