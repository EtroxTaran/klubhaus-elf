import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormationPitch } from './formation-pitch'

describe('FormationPitch', () => {
  it('defaults to 4-3-3 and draws eleven nodes', () => {
    const { container } = render(<FormationPitch />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('data-formation', '4-3-3')
    expect(container.querySelectorAll('circle')).toHaveLength(12) // 11 players + centre circle
    expect(screen.getByRole('img', { name: 'Formation 4-3-3' })).toBeInTheDocument()
  })

  it('renders the requested formation and label', () => {
    const { container } = render(<FormationPitch formation="3-5-2" label="Aufstellung" />)
    expect(container.querySelector('svg')).toHaveAttribute('data-formation', '3-5-2')
    expect(screen.getByRole('img', { name: 'Aufstellung' })).toBeInTheDocument()
  })
})
