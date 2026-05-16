import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { eventMeta, MatchEvent, type MatchEventKind } from './match-event'

describe('eventMeta', () => {
  it.each<[MatchEventKind, string]>([
    ['goal', 'text-accent'],
    ['chance', 'text-warn'],
    ['card', 'text-warn'],
    ['sub', 'text-ink-mute'],
    ['whistle', 'text-ink-soft'],
    ['set', 'text-ink-mute'],
  ])('maps %s to a tone', (kind, tone) => {
    expect(eventMeta(kind).text).toBe(tone)
  })
})

describe('MatchEvent', () => {
  it('renders a goal with score and accent headline', () => {
    render(<MatchEvent min="82'" kind="goal" title="TOR! Brody" sub="Volley" score="2:1" />)
    expect(screen.getByText("82'")).toBeInTheDocument()
    expect(screen.getByText('2:1')).toBeInTheDocument()
    const title = screen.getByText('TOR! Brody')
    expect(title).toHaveClass('text-accent')
  })

  it('uses the mini pitch glyph for set pieces and omits score', () => {
    const { container } = render(
      <MatchEvent min="12'" kind="set" title="Eckstoß" sub="Reiter tritt" />,
    )
    expect(container.querySelector('[data-kind="set"]')).not.toBeNull()
    expect(container.querySelector('svg')).not.toBeNull()
    expect(screen.queryByText(/:/)).toBeNull()
  })

  it('renders non-goal events with an italic sub', () => {
    render(<MatchEvent min="46'" kind="whistle" title="Wiederanpfiff" sub="2. HZ" />)
    expect(screen.getByText('2. HZ')).toHaveClass('italic')
  })
})
