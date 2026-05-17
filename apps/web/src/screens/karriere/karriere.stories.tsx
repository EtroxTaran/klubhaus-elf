import type { Meta, StoryObj } from '@storybook/react'
import { Karriere } from '@/screens/karriere/karriere'

const meta = {
  title: 'Screens/Karriere',
  component: Karriere,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Karriere>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
