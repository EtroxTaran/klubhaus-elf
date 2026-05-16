import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MiniPitch } from './mini-pitch'

describe('MiniPitch', () => {
  it('renders an svg at the default size', () => {
    const { container } = render(<MiniPitch />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '22')
    expect(svg?.querySelector('title')?.textContent).toBe('Standardsituation')
  })

  it('scales to a custom size and merges a class', () => {
    const { container } = render(<MiniPitch size={40} className="text-ink-mute" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '40')
    expect(svg).toHaveClass('text-ink-mute')
  })
})
