import type { Meta, StoryObj } from '@storybook/react'
import { Spiel } from '@/screens/spiel/spiel'

const meta = {
  title: 'Screens/Spiel',
  component: Spiel,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Spiel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Halftime: Story = { args: { halftimeOpen: true } }
