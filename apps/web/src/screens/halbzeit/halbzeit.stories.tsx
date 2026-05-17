import type { Meta, StoryObj } from '@storybook/react'
import { Halbzeit } from '@/screens/halbzeit/halbzeit'

const meta = {
  title: 'Screens/Halbzeit',
  component: Halbzeit,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Halbzeit>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
