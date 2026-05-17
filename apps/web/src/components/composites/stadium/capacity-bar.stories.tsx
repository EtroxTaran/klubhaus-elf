import type { Meta, StoryObj } from '@storybook/react'
import { CapacityBar } from '@/components/composites/stadium/capacity-bar'
import { STANDS } from '@/screens/fixtures'

const [sampleStand] = STANDS
if (!sampleStand) throw new Error('STANDS fixture is empty')

const meta = {
  title: 'Composites/Stadium/CapacityBar',
  component: CapacityBar,
  parameters: { layout: 'padded' },
  args: { stand: sampleStand, className: 'w-80' },
} satisfies Meta<typeof CapacityBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllStands: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {STANDS.map((s) => (
        <CapacityBar key={s.id} stand={s} />
      ))}
    </div>
  ),
}
