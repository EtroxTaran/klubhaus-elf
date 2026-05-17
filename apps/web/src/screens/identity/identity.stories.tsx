import type { Meta, StoryObj } from '@storybook/react'
import { Identity } from '@/screens/identity/identity'

const meta = {
  title: 'Screens/Identity',
  component: Identity,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Identity>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
