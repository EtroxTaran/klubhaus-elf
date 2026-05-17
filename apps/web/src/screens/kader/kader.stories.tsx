import type { Meta, StoryObj } from '@storybook/react'
import { Kader } from '@/screens/kader/kader'

const meta = {
  title: 'Screens/Kader',
  component: Kader,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Kader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
