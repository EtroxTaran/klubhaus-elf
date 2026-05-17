import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InboxCard, type InboxTone, toneMeta } from './inbox-card'

describe('toneMeta', () => {
  it.each<[InboxTone, string]>([
    ['board', '§'],
    ['media', '¶'],
    ['sponsor', '€'],
    ['scout', '◎'],
    ['fan', '♪'],
  ])('gives %s a distinct glyph', (tone, glyph) => {
    expect(toneMeta(tone).glyph).toBe(glyph)
  })
})

describe('InboxCard', () => {
  it('renders sender, title, body, time and actions', () => {
    render(
      <InboxCard
        tone="board"
        senderLabel="Vorstand"
        from="Aufsichtsrat"
        title="Drei Punkte"
        body="Sonntag zählt."
        time="08:14"
      >
        <button type="button">Annehmen</button>
      </InboxCard>,
    )
    expect(screen.getByText(/Vorstand · Aufsichtsrat/)).toBeInTheDocument()
    expect(screen.getByText('Drei Punkte')).toBeInTheDocument()
    expect(screen.getByText('Sonntag zählt.')).toBeInTheDocument()
    expect(screen.getByText('08:14')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annehmen' })).toBeInTheDocument()
  })

  it('tags the article with its tone', () => {
    const { container } = render(
      <InboxCard tone="sponsor" senderLabel="Sponsor" from="Volta Bank" title="t" body="b" time="x">
        <span />
      </InboxCard>,
    )
    expect(container.querySelector('article')).toHaveAttribute('data-tone', 'sponsor')
  })
})
