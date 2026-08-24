import { useState } from 'react';
import { DONATION_LINKS } from '../../lib/donation';

interface FaqItem {
  q: string;
  a: string;
}

const ITEMS: readonly FaqItem[] = [
  {
    q: 'How is this free?',
    a: `SalahKit is built as sadaqah jariyah — ongoing charity. There are no ads, no subscriptions and no data sales because there is nothing to sell: everything runs in your browser. If it helps you, an optional donation via ${DONATION_LINKS[0]?.label ?? 'Ko-fi'} keeps the lights on. No guilt, no paywall, ever.`,
  },
  {
    q: 'Does it really work offline?',
    a: 'Yes. Prayer times, Qibla, the Hijri calendar, the Quran collection, duas and the 99 Names are computed or stored on your device. The optional AlAdhan refinement is the only network feature, and it degrades silently to the built-in algorithms when you are offline.',
  },
  {
    q: 'What happens to my data?',
    a: 'It never leaves your device. Logs, tasbih counts and Zakat records live in your browser’s IndexedDB. You can export everything as JSON, import it on another device, or wipe it completely from Settings. We have no servers, no accounts and no analytics — we could not read your data even if asked.',
  },
  {
    q: 'How accurate are the prayer times?',
    a: 'They use the same open astronomical methods (solar declination, equation of time and hour-angle math) as major timetable authorities, with MWL, ISNA, Egyptian, Karachi and Umm al-Qura presets and Shafi’i/Hanafi Asr. They are typically within a minute of published timetables — still verify fasting and congregation times with your local mosque.',
  },
  {
    q: 'Why no app in the stores?',
    a: 'SalahKit is a PWA: open it in your browser, then “Add to Home Screen” and it behaves like a native app — full screen, own icon, offline cache. No store fees, no update queue, no permission prompts.',
  },
  {
    q: 'Is my donation tax-deductible or required?',
    a: 'Donations are voluntary, one-way and handled entirely by the external provider (Ko-fi, Buy Me a Coffee or PayPal). They unlock nothing because there is nothing locked — every feature is free for everyone, forever.',
  },
];

/**
 * Landing FAQ (S8), including the required “How is this free?” entry (S11).
 * @returns The rendered accordion section.
 */
export function FAQ(): JSX.Element {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-14">
      <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">Questions</p>
      <h2 id="faq-title" className="mt-2 text-center text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
        Asked, answered
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
