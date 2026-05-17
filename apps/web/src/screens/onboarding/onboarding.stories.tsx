import type { Meta, StoryObj } from '@storybook/react'
import { Onboarding } from '@/screens/onboarding/onboarding'

const meta = {
  title: 'Screens/Onboarding',
  component: Onboarding,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Onboarding>

export default meta
type Story = StoryObj<typeof meta>

export const Step1: Story = { args: { step: 1 } }
export const Step2: Story = { args: { step: 2 } }
export const Step3: Story = { args: { step: 3 } }
