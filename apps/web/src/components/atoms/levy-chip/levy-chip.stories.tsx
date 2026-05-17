import type { Meta, StoryObj } from '@storybook/react'
import { LevyChip } from '@/components/atoms/levy-chip/levy-chip'

const meta = {
  title: 'Atoms/LevyChip',
  component: LevyChip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LevyChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Verbandsabgabe · 300.000 €' },
}
