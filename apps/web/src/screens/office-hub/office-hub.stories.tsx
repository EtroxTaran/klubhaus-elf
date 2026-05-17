import type { Meta, StoryObj } from '@storybook/react'
import { OfficeHub } from '@/screens/office-hub/office-hub'

const meta = {
  title: 'Screens/OfficeHub',
  component: OfficeHub,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof OfficeHub>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const KickoffCountdown: Story = { args: { kickoffSeconds: 23 * 60 + 14 } }
