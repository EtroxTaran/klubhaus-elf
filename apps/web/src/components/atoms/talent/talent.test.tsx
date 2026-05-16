import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Talent } from './talent'

describe('Talent', () => {
  it('labels the rating accessibly', () => {
    render(<Talent n={3} />)
    expect(screen.getByRole('img', { name: 'Talent 3 von 4' })).toBeInTheDocument()
  })

  it('fills n stars and leaves the rest empty', () => {
    const { container } = render(<Talent n={2} max={4} />)
    const stars = container.querySelectorAll('svg')
    expect(stars).toHaveLength(4)
    expect(stars[0]).toHaveClass('fill-accent')
    expect(stars[1]).toHaveClass('fill-accent')
    expect(stars[2]).toHaveClass('text-rule')
    expect(stars[2]).not.toHaveClass('fill-accent')
  })

  it('supports a custom max and class', () => {
    const { container } = render(<Talent n={5} max={5} className="ml-1" />)
    expect(screen.getByRole('img', { name: 'Talent 5 von 5' })).toHaveClass('ml-1')
    expect(container.querySelectorAll('svg')).toHaveLength(5)
  })
})
