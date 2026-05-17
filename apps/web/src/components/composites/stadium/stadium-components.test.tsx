import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { StadiumType, Stand } from '@/types/stadium'
import { CapacityBar } from './capacity-bar'
import {
  GlyphFloodlight,
  GlyphHeating,
  GlyphRoof,
  GlyphRoofOpen,
  GlyphRoofPartial,
  GlyphSeat,
  GlyphStand,
  GlyphVIP,
} from './stadium-glyphs'
import { StadiumPlot } from './stadium-plot'
import { StadiumTypePlan } from './stadium-type-plan'
import { StandSideView } from './stand-side-view'

const stand: Stand = {
  id: 'N',
  name: 'Nordtribüne',
  cap: 8200,
  seats: 5400,
  standing: 2680,
  vip: 120,
  roof: 'full',
  rows: 24,
  blocks: 8,
  upgrade: 'Steh-/Sitz-Umbau',
  upgradeCost: '1,4 Mio. €',
}

describe('stadium glyphs', () => {
  const glyphs = [
    GlyphRoof,
    GlyphRoofOpen,
    GlyphRoofPartial,
    GlyphSeat,
    GlyphStand,
    GlyphFloodlight,
    GlyphHeating,
    GlyphVIP,
  ]
  it('each renders a titled img-role svg', () => {
    for (const G of glyphs) {
      const { container, unmount } = render(<G />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('role', 'img')
      expect(svg?.querySelector('title')?.textContent).toBeTruthy()
      unmount()
    }
  })
})

describe('CapacityBar', () => {
  it('shows standing, seating and VIP numbers with de-DE separators', () => {
    render(<CapacityBar stand={stand} />)
    expect(screen.getByText('2.680')).toBeInTheDocument()
    expect(screen.getByText('5.280')).toBeInTheDocument() // seats - vip
    expect(screen.getByText('120')).toBeInTheDocument()
  })

  it('renders an em dash when there is no VIP block', () => {
    render(<CapacityBar stand={{ ...stand, vip: 0, seats: 5400 }} />)
    expect(screen.getByText('–')).toBeInTheDocument()
  })
})

describe('StandSideView', () => {
  it.each<Stand['roof']>(['full', 'partial', 'open'])('tags the %s roof tier', (roof) => {
    const { container } = render(<StandSideView stand={{ ...stand, roof }} />)
    expect(container.querySelector('svg')).toHaveAttribute('data-roof', roof)
  })
})

describe('StadiumTypePlan', () => {
  it('renders the archetype with its id tag', () => {
    const type: StadiumType = {
      id: 'arena',
      name: 'Geschlossene Arena',
      stands: 4,
      capRange: '40.000 – 75.000',
      pitch: 'Hybridrasen',
      desc: 'Umlaufend.',
    }
    render(<StadiumTypePlan type={type} />)
    expect(screen.getByRole('img', { name: 'Stadiontyp Geschlossene Arena' })).toHaveAttribute(
      'data-type',
      'arena',
    )
  })
})

describe('StadiumPlot', () => {
  it('draws four named stands and the amenities', () => {
    render(
      <StadiumPlot
        amenities={[
          { label: 'Klubhotel', ok: true },
          { label: 'Vereinsrestaurant', ok: false },
        ]}
      />,
    )
    expect(screen.getByText('NORD')).toBeInTheDocument()
    expect(screen.getByText('SÜD')).toBeInTheDocument()
    expect(screen.getByText('Klubhotel')).toBeInTheDocument()
    expect(screen.getByText('Vereinsrestaurant')).toBeInTheDocument()
  })
})
