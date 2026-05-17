import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TICKER_AWAY, TICKER_HOME } from '@/screens/fixtures'
import { Pitch2D } from './pitch-2d'

const side = (players: typeof TICKER_HOME) => ({
  a: '#0e3a5f',
  b: '#c8a45a',
  pattern: 'stripes' as const,
  sleeveAccent: true,
  players,
})

describe('Pitch2D', () => {
  it('renders an accessible labelled pitch with both line-ups', () => {
    const { container } = render(
      <Pitch2D
        away={side(TICKER_AWAY)}
        home={side(TICKER_HOME)}
        northLabel="NORD"
        southLabel="SÜD"
        label="2D-Ticker"
      />,
    )
    expect(screen.getByRole('img', { name: '2D-Ticker' })).toBeInTheDocument()
    expect(screen.getByText('NORD')).toBeInTheDocument()
    expect(screen.getByText('SÜD')).toBeInTheDocument()
    // 22 player tokens rendered via foreignObject
    expect(container.querySelectorAll('foreignObject')).toHaveLength(
      TICKER_AWAY.length + TICKER_HOME.length,
    )
  })

  it('draws a highlight ring for the marked player', () => {
    const { container } = render(
      <Pitch2D away={side(TICKER_AWAY)} home={side(TICKER_HOME)} northLabel="N" southLabel="S" />,
    )
    const highlighted = TICKER_HOME.filter((p) => p.highlight).length
    expect(container.querySelectorAll('circle[stroke="var(--c-accent)"]')).toHaveLength(highlighted)
  })
})
