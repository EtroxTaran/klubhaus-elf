import type { Meta, StoryObj } from '@storybook/react'
import { LandingHero } from '@/components/landing/landing-hero'

const meta = {
  title: 'Screens/LandingHero',
  component: LandingHero,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LandingHero>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
