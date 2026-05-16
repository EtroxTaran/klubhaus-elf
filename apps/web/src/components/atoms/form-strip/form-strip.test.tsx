import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormStrip } from './form-strip'

describe('FormStrip', () => {
  it('renders each result as a visible letter with an accessible label', () => {
    render(<FormStrip form="SUN" />)
    const el = screen.getByRole('img', { name: 'Form: S U N' })
    expect(el).toHaveTextContent('SUN')
  })

  it('colours wins, draws and losses distinctly', () => {
    const { container } = render(<FormStrip form="SUN" />)
    const tiles = container.querySelectorAll('span')
    expect(tiles[0]).toHaveClass('bg-ok')
    expect(tiles[1]).toHaveClass('bg-warn')
    expect(tiles[2]).toHaveClass('bg-danger')
  })

  it('merges a custom class', () => {
    render(<FormStrip form="S" className="mt-1" />)
    expect(screen.getByRole('img')).toHaveClass('mt-1')
  })
})
