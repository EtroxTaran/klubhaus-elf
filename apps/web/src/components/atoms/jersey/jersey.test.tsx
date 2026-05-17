import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Jersey } from './jersey'
import { JERSEY_PATTERNS } from './jersey-paths'

describe('Jersey', () => {
  it.each(JERSEY_PATTERNS)('renders pattern %s', (pattern) => {
    const { container } = render(<Jersey pattern={pattern} a="#0e3a5f" b="#c8a45a" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('data-pattern')).toBe(pattern)
    expect(container.innerHTML).toContain('#0e3a5f')
  })

  it('shows the chest crest on the front and hides it on the back', () => {
    const crest = { shape: 'heater', a: '#0e3a5f', b: '#c8a45a', charge: 'ship' } as const
    const front = render(<Jersey crest={crest} />)
    expect(front.container.querySelector('[data-shape]')).not.toBeNull()
    front.unmount()
    const back = render(<Jersey crest={crest} showBack number="9" name="Brody" />)
    expect(back.container.querySelector('[data-shape]')).toBeNull()
    expect(back.container.textContent).toContain('BRODY')
    expect(back.container.textContent).toContain('9')
  })

  it('drops the sleeve accent when disabled', () => {
    const { container } = render(<Jersey sleeveAccent={false} a="#0e3a5f" b="#c8a45a" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('data-side')).toBe('front')
  })

  it('exposes an accessible label and respects size', () => {
    const { getByRole } = render(<Jersey size={48} label="Heimtrikot FC Hafenstadt" />)
    const img = getByRole('img', { name: 'Heimtrikot FC Hafenstadt' })
    expect(img).toHaveAttribute('width', '48')
  })
})
