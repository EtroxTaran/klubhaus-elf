import type { Meta, StoryObj } from '@storybook/react'
import { PillBtn } from '@/components/atoms/pill-btn/pill-btn'

const meta = {
  title: 'Atoms/PillBtn',
  component: PillBtn,
  parameters: { layout: 'centered' },
  args: { children: 'Annehmen' },
} satisfies Meta<typeof PillBtn>

export default meta
type Story = StoryObj<typeof meta>

export const Accept: Story = { args: { intent: 'accept', children: 'Annehmen' } }
export const Neutral: Story = { args: { intent: 'neutral', children: 'Später' } }
export const Soft: Story = { args: { intent: 'soft', children: 'Archivieren' } }
export const Danger: Story = { args: { intent: 'danger', children: 'Ablehnen' } }

export const AllIntents: Story = {
  render: () => (
    <div className="flex gap-2">
      <PillBtn intent="accept">Annehmen</PillBtn>
      <PillBtn intent="neutral">Später</PillBtn>
      <PillBtn intent="soft">Archivieren</PillBtn>
      <PillBtn intent="danger">Ablehnen</PillBtn>
    </div>
  ),
}
