import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BreakBar, type BreakRow } from './break-bar'

const rows: BreakRow[] = [
  { label: 'Sponsoring', value: 44, color: '#3f6a2f' },
  { label: 'Ticketing', value: 24, color: 'var(--c-accent)' },
  { label: 'TV', value: 32, color: '#1f6f9a' },
]

describe('BreakBar', () => {
  it('renders a legend entry per row with its share', () => {
    render(<BreakBar rows={rows} />)
    expect(screen.getByText('Sponsoring')).toBeInTheDocument()
    expect(screen.getByText('44%')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('sizes each segment by its percentage', () => {
    const { container } = render(<BreakBar rows={rows} />)
    const segs = container.querySelectorAll('.rounded-full > div')
    expect(segs).toHaveLength(3)
    expect(segs[0]).toHaveStyle({ width: '44%' })
  })

  it('renders nothing in the legend for an empty series', () => {
    render(<BreakBar rows={[]} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
