import type { Meta, StoryObj } from '@storybook/react'
import { Pressekonferenz } from '@/screens/pressekonferenz/pressekonferenz'

const meta = {
  title: 'Screens/Pressekonferenz',
  component: Pressekonferenz,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Pressekonferenz>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
