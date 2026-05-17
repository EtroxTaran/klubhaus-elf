import type { Meta, StoryObj } from '@storybook/react'
import { Portrait } from '@/components/atoms/portrait/portrait'

const meta = {
  title: 'Atoms/Portrait',
  component: Portrait,
  parameters: { layout: 'centered' },
  args: { name: 'Luca Hartmann' },
} satisfies Meta<typeof Portrait>

export default meta
type Story = StoryObj<typeof meta>

export const Staff: Story = { args: { variant: 'staff', size: 56 } }
export const Player: Story = { args: { variant: 'player', size: 56 } }

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Portrait name="Luca Hartmann" size={32} />
      <Portrait name="Luca Hartmann" size={48} />
      <Portrait name="Luca Hartmann" size={72} variant="player" />
    </div>
  ),
}
