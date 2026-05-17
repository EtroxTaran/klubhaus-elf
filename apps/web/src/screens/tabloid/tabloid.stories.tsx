import type { Meta, StoryObj } from '@storybook/react'
import { Tabloid } from '@/screens/tabloid/tabloid'

const meta = {
  title: 'Screens/Tabloid',
  component: Tabloid,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Tabloid>

export default meta
type Story = StoryObj<typeof meta>

export const Triumph: Story = { args: { tone: 'triumph' } }
export const Storm: Story = { args: { tone: 'storm' } }
