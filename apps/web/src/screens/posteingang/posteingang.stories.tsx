import type { Meta, StoryObj } from '@storybook/react'
import { Posteingang } from '@/screens/posteingang/posteingang'

const meta = {
  title: 'Screens/Posteingang',
  component: Posteingang,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Posteingang>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
