import { useState } from 'react';
import { useT } from '../../lib/use-locale';

/**
 * Landing FAQ (S8), including the required “How is this free?” entry (S11).
 * Entries come from the active locale dictionary.
 * @returns The rendered accordion section.
 */
export function FAQ(): JSX.Element {
  const { t, locale } = useT();
  const [open, setOpen] = useState<number>(0);
  const ITEMS = locale.dict.landing.faq;

  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-14">
      <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">{t('landing.faqKicker')}</p>
      <h2 id="faq-title" className="mt-2 text-center text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
        {t('landing.faqTitle')}
      </h2>

      <div className="mt-8 space-y-2.5">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={[
                'rounded-xl border bg-[var(--card)] transition-colors duration-200',
                isOpen ? 'border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] shadow-md shadow-teal-950/5' : 'border-[var(--border)]',
              ].join(' ')}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)] rounded-xl"
              >
                <span className={['text-sm font-extrabold sm:text-base', isOpen ? 'text-[var(--primary)]' : 'text-[var(--fg)]'].join(' ')}>
                  {item.q}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                  className={[
                    'shrink-0 text-[var(--muted)] transition-transform duration-200 ease-out',
                    isOpen ? 'rotate-180 text-[var(--primary)]' : '',
                  ].join(' ')}
                >
                  <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isOpen ? (
                <div id={`faq-panel-${i}`} role="region" className="px-5 pb-5 animate-[fadeIn_180ms_ease-out]">
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{item.a}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
