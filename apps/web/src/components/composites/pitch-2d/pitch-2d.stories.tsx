import type { Meta, StoryObj } from '@storybook/react'
import { Pitch2D } from '@/components/composites/pitch-2d/pitch-2d'
import { TICKER_AWAY, TICKER_HOME } from '@/screens/fixtures'
import { clubByName } from '@/theme/club-registry'

const NBC = clubByName('Northbridge City')
const FCH = clubByName('FC Hafenstadt')

const meta = {
  title: 'Composites/Pitch2D',
  component: Pitch2D,
  parameters: { layout: 'padded' },
  args: {
    className: 'max-w-[420px]',
    northLabel: 'NORD',
    southLabel: 'SÜD',
    away: {
      a: NBC.crest.a,
      b: NBC.crest.b,
      pattern: NBC.kit.pattern,
      sleeveAccent: NBC.kit.sleeveAccent,
      players: TICKER_AWAY,
    },
    home: {
      a: FCH.crest.a,
      b: FCH.crest.b,
      pattern: FCH.kit.pattern,
      sleeveAccent: FCH.kit.sleeveAccent,
      players: TICKER_HOME,
    },
  },
} satisfies Meta<typeof Pitch2D>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
