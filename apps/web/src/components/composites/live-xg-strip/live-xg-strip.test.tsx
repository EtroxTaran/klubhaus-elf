import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LiveXgStrip, type XgPoint, xgPath } from './live-xg-strip'

const pts: XgPoint[] = [
  { min: 1, a: 0, b: 0 },
  { min: 45, a: 0.5, b: 1 },
  { min: 90, a: 1.1, b: 1.8 },
]

describe('xgPath', () => {
  it('returns an empty string for no points', () => {
    expect(xgPath([], 'a')).toBe('')
  })

  it('starts with a move command and scales to the viewBox', () => {
    const d = xgPath(pts, 'b')
    expect(d.startsWith('M')).toBe(true)
    expect(d).toContain('L')
  })
})

describe('LiveXgStrip', () => {
  it('renders both team lines with an accessible label', () => {
    const { container } = render(<LiveXgStrip points={pts} aLabel="NBC" bLabel="FCH" />)
    expect(container.querySelectorAll('path')).toHaveLength(2)
    expect(screen.getByRole('img', { name: 'xG-Verlauf FCH gegen NBC' })).toBeInTheDocument()
  })
})
