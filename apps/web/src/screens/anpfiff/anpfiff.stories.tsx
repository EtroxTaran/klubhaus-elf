import type { Meta, StoryObj } from '@storybook/react'
import { Anpfiff } from '@/screens/anpfiff/anpfiff'

const meta = {
  title: 'Screens/Anpfiff',
  component: Anpfiff,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Anpfiff>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
