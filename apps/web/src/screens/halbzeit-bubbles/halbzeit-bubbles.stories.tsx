import type { Meta, StoryObj } from '@storybook/react'
import { HalbzeitBubbles } from '@/screens/halbzeit-bubbles/halbzeit-bubbles'

const meta = {
  title: 'Screens/HalbzeitBubbles',
  component: HalbzeitBubbles,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HalbzeitBubbles>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
