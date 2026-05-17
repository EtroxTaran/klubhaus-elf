import type { Meta, StoryObj } from '@storybook/react'
import { LiveXgStrip } from '@/components/composites/live-xg-strip/live-xg-strip'

const meta = {
  title: 'Composites/LiveXgStrip',
  component: LiveXgStrip,
  parameters: { layout: 'padded' },
  args: {
    aLabel: 'Gäste',
    bLabel: 'Hafenstadt',
    className: 'w-80',
    points: [
      { min: 0, a: 0, b: 0 },
      { min: 15, a: 0.1, b: 0.4 },
      { min: 30, a: 0.3, b: 0.7 },
      { min: 45, a: 0.5, b: 1.1 },
      { min: 63, a: 0.8, b: 1.6 },
      { min: 90, a: 0.9, b: 1.8 },
    ],
  },
} satisfies Meta<typeof LiveXgStrip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
