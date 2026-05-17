import type { Meta, StoryObj } from '@storybook/react'
import { Talent } from '@/components/atoms/talent/talent'

const meta = {
  title: 'Atoms/Talent',
  component: Talent,
  parameters: { layout: 'centered' },
  args: { n: 3 },
} satisfies Meta<typeof Talent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tiers: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      {[1, 2, 3, 4].map((n) => (
        <Talent key={n} n={n} />
      ))}
    </div>
  ),
}
