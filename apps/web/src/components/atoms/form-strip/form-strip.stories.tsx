import type { Meta, StoryObj } from '@storybook/react'
import { FormStrip } from '@/components/atoms/form-strip/form-strip'

const meta = {
  title: 'Atoms/FormStrip',
  component: FormStrip,
  parameters: { layout: 'centered' },
  args: { form: 'SSUNS' },
} satisfies Meta<typeof FormStrip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <FormStrip form="SSSSS" />
      <FormStrip form="SUNUS" />
      <FormStrip form="NNNUN" />
    </div>
  ),
}
