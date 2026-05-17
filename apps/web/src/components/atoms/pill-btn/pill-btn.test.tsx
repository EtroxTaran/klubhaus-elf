import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PillBtn, type PillIntent } from './pill-btn'

describe('PillBtn', () => {
  it.each<[PillIntent, string]>([
    ['accept', 'bg-accent'],
    ['neutral', 'border-rule'],
    ['soft', 'bg-bg-ink'],
    ['danger', 'text-danger'],
  ])('styles the %s intent', (intent, cls) => {
    render(<PillBtn intent={intent}>Tu es</PillBtn>)
    expect(screen.getByRole('button', { name: 'Tu es' })).toHaveClass(cls)
  })

  it('defaults to the neutral intent', () => {
    render(<PillBtn>Neutral</PillBtn>)
    expect(screen.getByRole('button')).toHaveClass('text-ink')
  })

  it('renders an icon and forwards clicks', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <PillBtn icon={<svg data-testid="ic" />} onClick={onClick}>
        Annehmen
      </PillBtn>,
    )
    expect(screen.getByTestId('ic')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Annehmen' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
