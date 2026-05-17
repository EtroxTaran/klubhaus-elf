import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PosPill, posColor } from './pos-pill'

describe('posColor', () => {
  it.each([
    ['TW', '#a3680f'],
    ['IV', '#3f6a2f'],
    ['AV', '#3f6a2f'],
    ['DM', '#1f6f9a'],
    ['ZM', '#1f6f9a'],
    ['OM', '#7a3a8a'],
    ['FL', '#7a3a8a'],
    ['ST', 'var(--c-accent)'],
  ])('maps %s to its semantic colour', (pos, expected) => {
    expect(posColor(pos)).toBe(expected)
  })

  it('falls back to ink for an unknown position', () => {
    expect(posColor('XX')).toBe('var(--c-ink)')
  })
})

describe('PosPill', () => {
  it('renders the position label and tags it', () => {
    render(<PosPill pos="OM" />)
    const el = screen.getByText('OM')
    expect(el).toHaveAttribute('data-pos', 'OM')
  })

  it('merges a custom class', () => {
    render(<PosPill pos="ST" className="ml-2" />)
    expect(screen.getByText('ST')).toHaveClass('ml-2')
  })
})
