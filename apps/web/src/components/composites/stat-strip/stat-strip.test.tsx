import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatStrip } from './stat-strip'

describe('StatStrip', () => {
  it('renders both values and the label', () => {
    render(<StatStrip label="Stärke" a="7,4" b="7,6" />)
    expect(screen.getByText('7,4')).toBeInTheDocument()
    expect(screen.getByText('Stärke')).toBeInTheDocument()
    expect(screen.getByText('7,6')).toBeInTheDocument()
  })

  it('highlights the accent side', () => {
    const { rerender } = render(<StatStrip label="L" a="1" b="2" accentSide="b" />)
    expect(screen.getByText('2')).toHaveClass('text-accent')
    expect(screen.getByText('1')).toHaveClass('text-ink')
    rerender(<StatStrip label="L" a="1" b="2" accentSide="a" />)
    expect(screen.getByText('1')).toHaveClass('text-accent')
  })

  it('shows an italic hint when provided', () => {
    render(<StatStrip label="L" a="1" b="2" hint="leichter Vorteil" />)
    expect(screen.getByText('leichter Vorteil')).toHaveClass('italic')
  })

  it('drops the mono face when mono is false', () => {
    render(<StatStrip label="Form" a={<span>x</span>} b={<span>y</span>} mono={false} />)
    expect(screen.getByText('Form')).toBeInTheDocument()
  })
})
