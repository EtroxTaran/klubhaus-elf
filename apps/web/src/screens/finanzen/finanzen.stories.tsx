import type { Meta, StoryObj } from '@storybook/react'
import { Finanzen } from '@/screens/finanzen/finanzen'

const meta = {
  title: 'Screens/Finanzen',
  component: Finanzen,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Finanzen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
