import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { initials, Portrait } from './portrait'

describe('initials', () => {
  it('takes first and last initials for multi-part names', () => {
    expect(initials('Julia Lindquist')).toBe('JL')
    expect(initials('Marek Anton Brody')).toBe('MB')
  })
  it('takes two letters for a single name', () => {
    expect(initials('Brody')).toBe('BR')
  })
  it('handles empty input', () => {
    expect(initials('   ')).toBe('?')
  })
})

describe('Portrait', () => {
  it('renders initials with an accessible label', () => {
    render(<Portrait name="Julia Lindquist" />)
    const el = screen.getByRole('img', { name: 'Julia Lindquist' })
    expect(el).toHaveTextContent('JL')
  })

  it('adds an accent ring for the player variant only', () => {
    const { rerender } = render(<Portrait name="A B" variant="player" />)
    expect(screen.getByRole('img')).toHaveClass('ring-accent')
    rerender(<Portrait name="A B" variant="staff" />)
    expect(screen.getByRole('img')).not.toHaveClass('ring-accent')
  })

  it('scales to the requested size', () => {
    render(<Portrait name="A B" size={120} />)
    expect(screen.getByRole('img')).toHaveStyle({ width: '120px', height: '120px' })
  })
})
