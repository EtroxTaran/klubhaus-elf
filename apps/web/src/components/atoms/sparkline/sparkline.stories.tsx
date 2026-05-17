import type { Meta, StoryObj } from '@storybook/react'
import { Sparkline } from '@/components/atoms/sparkline/sparkline'

const meta = {
  title: 'Atoms/Sparkline',
  component: Sparkline,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Sparkline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: [12, 14, 11, 18, 16, 22, 19, 25],
    label: 'Formverlauf',
    className: 'w-40',
  },
}

export const Empty: Story = {
  args: { data: [], className: 'w-40 h-8' },
}
