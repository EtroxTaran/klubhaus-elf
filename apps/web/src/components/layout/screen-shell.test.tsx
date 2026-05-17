import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScreenShell } from './screen-shell'

describe('ScreenShell', () => {
  it('renders its children inside a main landmark', () => {
    render(
      <ScreenShell>
        <p>Inhalt</p>
      </ScreenShell>,
    )
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(screen.getByText('Inhalt')).toBeInTheDocument()
  })

  it('applies the paper/ink token surface and sans font', () => {
    render(
      <ScreenShell>
        <p>x</p>
      </ScreenShell>,
    )
    const main = screen.getByRole('main')
    expect(main).toHaveClass('bg-bg', 'text-ink', 'font-sans')
  })

  it('constrains content to a centered mobile column', () => {
    const { container } = render(
      <ScreenShell>
        <p>x</p>
      </ScreenShell>,
    )
    const column = container.querySelector('[data-shell-column]')
    expect(column).not.toBeNull()
    expect(column).toHaveClass('mx-auto', 'flex', 'flex-col')
  })

  it('uses an accessible label when provided', () => {
    render(
      <ScreenShell label="Büro">
        <p>x</p>
      </ScreenShell>,
    )
    expect(screen.getByRole('main', { name: 'Büro' })).toBeInTheDocument()
  })

  it('merges extra class names', () => {
    render(
      <ScreenShell className="pb-thumb">
        <p>x</p>
      </ScreenShell>,
    )
    expect(screen.getByRole('main')).toHaveClass('pb-thumb', 'bg-bg')
  })
})
