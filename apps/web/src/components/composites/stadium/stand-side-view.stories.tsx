import type { Meta, StoryObj } from '@storybook/react'
import { StandSideView } from '@/components/composites/stadium/stand-side-view'
import { STANDS } from '@/screens/fixtures'

const [sampleStand] = STANDS
if (!sampleStand) throw new Error('STANDS fixture is empty')

const meta = {
  title: 'Composites/Stadium/StandSideView',
  component: StandSideView,
  parameters: { layout: 'centered' },
  args: { stand: sampleStand, className: 'w-72' },
} satisfies Meta<typeof StandSideView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllStands: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {STANDS.map((s) => (
        <StandSideView key={s.id} stand={s} className="w-60" />
      ))}
    </div>
  ),
}
