import { fireEvent, screen } from '@testing-library/react'
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

  it('switches to the 2D ticker tab and shows the pitch + live stats', async () => {
    await renderScreen(<Spiel />, '/spiel')
    expect(screen.queryByRole('img', { name: '2D-Ticker' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '2D-Ticker' }))
    expect(screen.getByRole('img', { name: '2D-Ticker' })).toBeInTheDocument()
    expect(screen.getByText('Statistiken · live')).toBeInTheDocument()
    expect(screen.getByText("82' · TOR Brody · Volley")).toBeInTheDocument()
  })

  it('honours the initialTab prop and the deferred line-up note', async () => {
    await renderScreen(<Spiel initialTab="lineup" />, '/spiel')
    expect(screen.getByText('Aufstellung — eigener Screen, folgt.')).toBeInTheDocument()
  })
})
