import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HubTile } from './hub-tile'

describe('HubTile', () => {
  it('renders icon, label and sub', () => {
    render(<HubTile icon={<svg data-testid="ic" />} label="Finanzen" sub="+ 632.000 €" />)
    expect(screen.getByTestId('ic')).toBeInTheDocument()
    expect(screen.getByText('Finanzen')).toBeInTheDocument()
    expect(screen.getByText('+ 632.000 €')).toBeInTheDocument()
  })

  it('shows the scarlet flag line only when provided', () => {
    const { rerender } = render(<HubTile icon={<i />} label="A" sub="b" flag="Druck wächst" />)
    expect(screen.getByText('· Druck wächst')).toHaveClass('text-accent')
    rerender(<HubTile icon={<i />} label="A" sub="b" />)
    expect(screen.queryByText(/Druck/)).toBeNull()
  })

  it('merges a custom class', () => {
    const { container } = render(<HubTile icon={<i />} label="A" sub="b" className="col-span-2" />)
    expect(container.firstChild).toHaveClass('col-span-2', 'bg-card')
  })
})
