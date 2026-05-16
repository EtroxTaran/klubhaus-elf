import { Link } from '@tanstack/react-router'
import { Check, Clock, Filter, MoreHorizontal, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PillBtn } from '@/components/atoms/pill-btn/pill-btn'
import { InboxCard } from '@/components/composites/inbox-card/inbox-card'
import { ScreenShell } from '@/components/layout/screen-shell'
import { INBOX } from '../fixtures'

const FILTERS = ['all', 'board', 'media', 'sponsor', 'scout', 'fan'] as const

export function Posteingang() {
  const { t } = useTranslation(['posteingang', 'common'])
  return (
    <ScreenShell label={t('posteingang:title')}>
      <header className="border-b border-rule px-4 pb-2.5 pt-1">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
              {t('posteingang:unread', { count: 5 })}
            </div>
            <span className="block font-display text-[26px] font-bold leading-none text-ink">
              {t('posteingang:title')}
            </span>
          </div>
          <Link
            to="/"
            aria-label={t('common:back')}
            className="grid h-9 w-9 place-items-center rounded-md border border-rule bg-card text-ink"
          >
            <Filter size={16} aria-label={t('posteingang:filterAria')} />
          </Link>
        </div>
        <div className="mt-2.5 flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f, i) => (
            <span
              key={f}
              className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                i === 0 ? 'border-ink bg-ink text-bg' : 'border-rule text-ink-mute'
              }`}
            >
              {t(`posteingang:filters.${f}`)}
            </span>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-6 pt-2.5">
        {INBOX.map((m) => (
          <InboxCard
            key={m.title}
            tone={m.tone}
            senderLabel={t(`posteingang:filters.${m.tone}`)}
            from={m.from}
            title={m.title}
            body={m.body}
            time={m.time}
          >
            <PillBtn intent="accept" icon={<Check size={14} />}>
              {t('posteingang:actions.accept')}
            </PillBtn>
            <PillBtn intent="soft" icon={<Clock size={13} />}>
              {t('posteingang:actions.defer')}
            </PillBtn>
            <PillBtn intent="neutral" icon={<X size={13} />}>
              {t('posteingang:actions.reject')}
            </PillBtn>
            <button
              type="button"
              aria-label={t('posteingang:actions.more')}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-rule"
            >
              <MoreHorizontal size={16} />
            </button>
          </InboxCard>
        ))}
      </div>
    </ScreenShell>
  )
}
