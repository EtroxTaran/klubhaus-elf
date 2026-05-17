import type { Meta, StoryObj } from '@storybook/react'
import {
  GlyphFloodlight,
  GlyphHeating,
  GlyphRoof as GlyphRoofFull,
  GlyphRoofOpen,
  GlyphRoofPartial,
  GlyphSeat,
  GlyphStand,
  GlyphVIP,
} from '@/components/composites/stadium/stadium-glyphs'

const meta = {
  title: 'Composites/Stadium/Glyphs',
  component: GlyphRoofFull,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof GlyphRoofFull>

export default meta
type Story = StoryObj<typeof meta>

export const AllGlyphs: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 text-ink">
      <GlyphRoofFull size={32} />
      <GlyphRoofPartial size={32} />
      <GlyphRoofOpen size={32} />
      <GlyphSeat size={32} />
      <GlyphStand size={32} />
      <GlyphFloodlight size={32} />
      <GlyphHeating size={32} />
      <GlyphVIP size={32} />
    </div>
  ),
}
