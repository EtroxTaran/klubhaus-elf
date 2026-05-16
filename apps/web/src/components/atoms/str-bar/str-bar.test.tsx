import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StrBar } from './str-bar'

describe('StrBar', () => {
  it('shows the numeric value and an accessible label', () => {
    render(<StrBar n={7} />)
    const el = screen.getByRole('img', { name: 'Stärke 7 von 10' })
    expect(el).toBeInTheDocument()
    expect(el).toHaveTextContent('7')
  })

  it('fills n cells with ink and the rest with rule', () => {
    const { container } = render(<StrBar n={3} max={5} />)
    const cells = container.querySelectorAll('[role="img"] > div > div')
    expect(cells).toHaveLength(5)
    expect(cells[0]).toHaveClass('bg-ink')
    expect(cells[2]).toHaveClass('bg-ink')
    expect(cells[3]).toHaveClass('bg-rule')
  })

  it('merges a custom class name', () => {
    render(<StrBar n={1} className="mt-2" />)
    expect(screen.getByRole('img')).toHaveClass('mt-2')
  })
})
