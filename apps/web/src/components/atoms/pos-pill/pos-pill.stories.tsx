import type { Meta, StoryObj } from '@storybook/react'
import { PosPill } from '@/components/atoms/pos-pill/pos-pill'

const meta = {
  title: 'Atoms/PosPill',
  component: PosPill,
  parameters: { layout: 'centered' },
  args: { pos: 'ST' },
} satisfies Meta<typeof PosPill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllPositions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-1.5">
      {['TW', 'IV', 'AV', 'DM', 'ZM', 'OM', 'FL', 'ST'].map((p) => (
        <PosPill key={p} pos={p} />
      ))}
    </div>
  ),
}
