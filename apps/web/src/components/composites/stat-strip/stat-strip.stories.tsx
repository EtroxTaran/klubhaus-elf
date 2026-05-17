import type { Meta, StoryObj } from '@storybook/react'
import { StatStrip } from '@/components/composites/stat-strip/stat-strip'

const meta = {
  title: 'Composites/StatStrip',
  component: StatStrip,
  parameters: { layout: 'padded' },
  args: { label: 'Ballbesitz', a: '58%', b: '42%', accentSide: 'a' },
} satisfies Meta<typeof StatStrip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sheet: Story = {
  render: () => (
    <div className="w-80">
      <StatStrip label="Ballbesitz" a="58%" b="42%" accentSide="a" />
      <StatStrip label="Torschüsse" a="11" b="7" accentSide="a" />
      <StatStrip label="xG" a="1,8" b="0,9" accentSide="a" hint="Erwartete Tore" />
      <StatStrip label="Ecken" a="4" b="6" accentSide="b" />
    </div>
  ),
}
