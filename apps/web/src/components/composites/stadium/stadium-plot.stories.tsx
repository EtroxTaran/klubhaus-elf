import type { Meta, StoryObj } from '@storybook/react'
import { StadiumPlot } from '@/components/composites/stadium/stadium-plot'
import { STADIUM_AMENITIES } from '@/screens/fixtures'

const meta = {
  title: 'Composites/Stadium/StadiumPlot',
  component: StadiumPlot,
  parameters: { layout: 'centered' },
  args: { amenities: STADIUM_AMENITIES, className: 'w-96' },
} satisfies Meta<typeof StadiumPlot>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
