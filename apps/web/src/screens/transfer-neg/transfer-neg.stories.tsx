import type { Meta, StoryObj } from '@storybook/react'
import { TransferNeg } from '@/screens/transfer-neg/transfer-neg'

const meta = {
  title: 'Screens/TransferNeg',
  component: TransferNeg,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TransferNeg>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
