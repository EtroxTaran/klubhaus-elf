import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatBar } from './stat-bar'

describe('StatBar', () => {
  it('renders both values and the label', () => {
    render(<StatBar label="Ballbesitz" a={42} b={58} mode="pct" />)
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('58')).toBeInTheDocument()
    expect(screen.getByText('Ballbesitz')).toBeInTheDocument()
  })

  it('accents the winning side', () => {
    render(<StatBar label="Schüsse" a={9} b={14} mode="count" />)
    expect(screen.getByText('14')).toHaveClass('text-accent')
    expect(screen.getByText('9')).not.toHaveClass('text-accent')
  })

  it('formats xG with a German decimal comma', () => {
    render(<StatBar label="xG" a={1.2} b={2.1} mode="xg" last />)
    expect(screen.getByText('1,2')).toBeInTheDocument()
    expect(screen.getByText('2,1')).toBeInTheDocument()
  })

  it('keeps the hairline unless last', () => {
    const { rerender, container } = render(<StatBar label="x" a={1} b={1} />)
    expect(container.firstChild).toHaveClass('border-b')
    rerender(<StatBar label="x" a={1} b={1} last />)
    expect(container.firstChild).not.toHaveClass('border-b')
  })
})
