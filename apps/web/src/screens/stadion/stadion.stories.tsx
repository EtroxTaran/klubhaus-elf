import type { Meta, StoryObj } from '@storybook/react'
import { Stadion } from '@/screens/stadion/stadion'

const meta = {
  title: 'Screens/Stadion',
  component: Stadion,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Stadion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
