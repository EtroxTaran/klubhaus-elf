import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { CrestShape } from '@/types/club'
import { Crest } from './crest'
import { CHARGES } from './crest-paths'

const SHAPES: CrestShape[] = ['heater', 'iberian', 'gonfalon', 'roundel']

describe('Crest', () => {
  it.each(CHARGES)('renders charge %s', (charge) => {
    const { container } = render(<Crest shape="heater" a="#0e3a5f" b="#c8a45a" charge={charge} />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('data-charge')).toBe(charge)
  })

  it.each(SHAPES)('renders shape %s with both tinctures', (shape) => {
    const { container } = render(<Crest shape={shape} a="#111111" b="#ffffff" charge="ball" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('data-shape')).toBe(shape)
    expect(container.innerHTML).toContain('#111111')
  })

  it('exposes an accessible label and respects size', () => {
    const { getByRole } = render(
      <Crest
        shape="heater"
        a="#000"
        b="#fff"
        charge="ship"
        size={40}
        label="Wappen FC Hafenstadt"
      />,
    )
    const img = getByRole('img', { name: 'Wappen FC Hafenstadt' })
    expect(img).toHaveAttribute('width', '40')
  })

  it('renders an optional motto banner', () => {
    const { container, rerender } = render(<Crest shape="heater" a="#000" b="#fff" charge="ship" />)
    expect(container.querySelector('text')).toBeNull()
    rerender(<Crest shape="heater" a="#000" b="#fff" charge="ship" motto="Pro Portu" />)
    expect(container.querySelector('text')?.textContent).toBe('Pro Portu')
  })
})
