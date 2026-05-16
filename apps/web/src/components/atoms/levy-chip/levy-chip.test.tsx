import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LevyChip } from './levy-chip'

describe('LevyChip', () => {
  it('renders the levy label on the accent-soft surface', () => {
    render(<LevyChip label="Verbandsabgabe · 300.000 €" />)
    const el = screen.getByText('Verbandsabgabe · 300.000 €')
    expect(el).toHaveClass('bg-accent-soft', 'text-accent')
  })

  it('merges a custom class', () => {
    render(<LevyChip label="X" className="ml-2" />)
    expect(screen.getByText('X')).toHaveClass('ml-2')
  })
})
