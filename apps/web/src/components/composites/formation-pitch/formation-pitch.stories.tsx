import type { Meta, StoryObj } from '@storybook/react'
import { FormationPitch } from '@/components/composites/formation-pitch/formation-pitch'

const meta = {
  title: 'Composites/FormationPitch',
  component: FormationPitch,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FormationPitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { formation: '4-3-3' } }

export const Formations: Story = {
  render: () => (
    <div className="flex gap-4">
      <FormationPitch formation="4-3-3" className="w-32" />
      <FormationPitch formation="4-4-2" className="w-32" />
      <FormationPitch formation="3-5-2" className="w-32" />
    </div>
  ),
}
