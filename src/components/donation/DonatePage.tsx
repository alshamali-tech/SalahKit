import { useState } from 'react';
import { DONATION_LINKS } from '../../lib/donation';
import { useT } from '../../lib/use-locale';
import { en } from '../../lib/i18n/locales/en';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

/**
 * Donate page (S8 /donate, S11): external provider links only, halal
 * framing, no guilt copy, and the "free forever" guarantee up front.
 * @returns The rendered page.
 */
export function DonatePage(): JSX.Element {
  const { t, locale } = useT();
  const donate = locale.dict.donate ?? en.donate;
  const [open, setOpen] = useState<number>(0);
  if (!donate) return <Card />;
  const primary = DONATION_LINKS.find((l) => l.primary) ?? DONATION_LINKS[0];
  const secondary = DONATION_LINKS.filter((l) => !l.primary);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Sadaqah jariyah</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">{donate.title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[var(--muted)]">{donate.sub}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Badge tone="success">{t('badges.freeForever')}</Badge>
          <Badge tone="neutral">{t('modules.duas')} · {t('modules.prayer')} · +11</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <a
          href={primary.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,var(--card))] px-4 py-7 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-[#3b2305] transition-transform duration-200 group-hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 2C9 4 9 6 12 8c-3 2-5 1-6-1M4 10h9a3 3 0 0 1 0 6H7a3 3 0 0 1-3-3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-base font-extrabold text-[var(--fg)]">{primary.label}</span>
          <span className="text-xs font-bold text-[var(--accent-strong)]">Primary ↗</span>
        </a>
        {secondary.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-7 text-center transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_50%,var(--border))] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--hover)] text-[var(--muted)] transition-transform duration-200 group-hover:scale-110 group-hover:text-[var(--accent-strong)]">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-base font-extrabold text-[var(--fg)]">{link.label}</span>
            <span className="text-xs font-bold text-[var(--muted)]">External ↗</span>
          </a>
        ))}
      </div>

      <Card>
        <p className="text-sm leading-relaxed text-[var(--muted)]">{donate.note}</p>
      </Card>

      <div className="space-y-2.5">
        {donate.faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <Card key={item.q} className={isOpen ? 'border-[color-mix(in_srgb,var(--primary)_40%,var(--border))]' : ''}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] rounded"
              >
                <span className="text-sm font-extrabold text-[var(--fg)]">{item.q}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                  className={
                    'shrink-0 text-[var(--muted)] transition-transform duration-200 ' + (isOpen ? 'rotate-180 text-[var(--primary)]' : '')
                  }
                >
                  <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isOpen ? <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)] animate-[fadeIn_180ms_ease-out]">{item.a}</p> : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
