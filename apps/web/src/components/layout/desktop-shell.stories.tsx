import type { Meta, StoryObj } from '@storybook/react'
import { DesktopShell } from '@/components/layout/desktop-shell'

const SampleCard = ({ title }: { title: string }) => (
  <section className="mb-3.5 rounded-[14px] border border-rule bg-card p-4">
    <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-mute">Büro</div>
    <span className="mt-0.5 block font-display text-lg font-bold text-ink">{title}</span>
    <p className="mt-1 text-sm text-ink-mute">
      Dieselben Phone-Primitive, in das Desktop-Cockpit umgelegt. Ab <code>lg</code> erscheint die
      Chrome; darunter rendern die Screens unverändert wie auf dem Phone.
    </p>
  </section>
)

const meta = {
  title: 'Layout/DesktopShell',
  component: DesktopShell,
  parameters: { layout: 'fullscreen' },
  args: {
    children: (
      <>
        <SampleCard title="Übersicht" />
        <SampleCard title="Nächster Termin" />
      </>
    ),
  },
} satisfies Meta<typeof DesktopShell>

export default meta
type Story = StoryObj<typeof meta>

// Resize the Storybook canvas to see the breakpoints: < lg = phone passthrough,
// lg = 2-column cockpit, xl with a rightRail = 3-column.
export const Default: Story = {}

export const ActiveSquad: Story = {
  args: { section: 'squad', breadcrumb: 'Kader · Übersicht' },
}

export const WithRightRail: Story = {
  args: {
    section: 'finance',
    breadcrumb: 'Finanzen · Bilanz',
    rightRail: (
      <div className="rounded-[12px] border border-rule p-3 text-sm text-ink-mute">
        Kontext-Rail (nur ab <code>xl</code>)
      </div>
    ),
  },
}
