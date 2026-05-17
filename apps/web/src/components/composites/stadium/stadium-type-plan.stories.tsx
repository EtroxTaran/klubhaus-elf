import type { Meta, StoryObj } from '@storybook/react'
import { StadiumTypePlan } from '@/components/composites/stadium/stadium-type-plan'
import { STADIUM_TYPES } from '@/screens/fixtures'

const [sampleType] = STADIUM_TYPES
if (!sampleType) throw new Error('STADIUM_TYPES fixture is empty')

const meta = {
  title: 'Composites/Stadium/StadiumTypePlan',
  component: StadiumTypePlan,
  parameters: { layout: 'centered' },
  args: { type: sampleType, className: 'w-56' },
} satisfies Meta<typeof StadiumTypePlan>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {STADIUM_TYPES.map((tpe) => (
        <StadiumTypePlan key={tpe.id} type={tpe} className="w-40" />
      ))}
    </div>
  ),
}
