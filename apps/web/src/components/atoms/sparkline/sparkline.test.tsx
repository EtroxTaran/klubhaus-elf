import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Sparkline, sparkPoints } from './sparkline'

describe('sparkPoints', () => {
  it('returns nothing for an empty series', () => {
    expect(sparkPoints([])).toEqual([])
  })

  it('centres a single point', () => {
    expect(sparkPoints([5], 120, 32)).toEqual([{ x: 60, y: 32 }])
  })

  it('spreads many points and inverts the y axis', () => {
    const pts = sparkPoints([0, 10], 100, 20)
    expect(pts[0]).toEqual({ x: 0, y: 20 })
    expect(pts[1]).toEqual({ x: 100, y: 0 })
  })

  it('handles a flat series without dividing by zero', () => {
    const pts = sparkPoints([4, 4, 4], 100, 20)
    expect(pts.every((p) => Number.isFinite(p.y))).toBe(true)
  })
})

describe('Sparkline', () => {
  it('renders an empty marker when there is no data', () => {
    const { container } = render(<Sparkline data={[]} />)
    expect(container.querySelector('svg')).toHaveAttribute('data-empty')
    expect(screen.getByRole('img', { name: 'Keine Daten' })).toBeInTheDocument()
  })

  it('draws a polyline and an emphasised last point', () => {
    const { container } = render(<Sparkline data={[1, 3, 2, 5]} label="Form" />)
    expect(container.querySelector('polyline')).not.toBeNull()
    expect(container.querySelector('circle')).not.toBeNull()
    expect(screen.getByRole('img', { name: 'Form' })).toBeInTheDocument()
  })
})
