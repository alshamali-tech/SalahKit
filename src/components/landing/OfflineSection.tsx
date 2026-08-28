import { navigate } from '../../lib/router';
import { useT } from '../../lib/use-locale';
import { en } from '../../lib/i18n/locales/en';

/**
 * Landing offline-first section (S5/S8): how SalahKit works with no
 * connection, told as a three-step descent rail on a teal panel.
 * @returns The rendered section.
 */
export function OfflineSection(): JSX.Element {
  const { t, locale } = useT();
  const steps = locale.dict.landing.offlineSteps ?? en.landing.offlineSteps ?? [];

  return (
    <section aria-labelledby="offline-title" className="mx-auto max-w-7xl px-4 pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-[#0c4a44] px-6 py-12 text-[#e9f6f2] sm:px-12 sm:py-16">
        {/* Ambient layers */}
        <div className="bg-pattern absolute inset-0 opacity-[0.09]" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#2dd4bf]/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#f59e0b]/10 blur-3xl" aria-hidden="true" />
        {/* Flight path */}
        <svg className="pointer-events-none absolute right-6 top-6 h-40 w-64 opacity-50" viewBox="0 0 256 160" aria-hidden="true">
          <path d="M8 130C70 120 120 40 248 26" fill="none" stroke="#99f6e4" strokeWidth="1.5" strokeDasharray="3 7" strokeLinecap="round" />
          <g transform="translate(228 28) rotate(14)">
            <path d="M0 -8l22 8-22 8 5-8z" fill="#fbbf24" />
          </g>
        </svg>

        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#2dd4bf]/40 bg-[#2dd4bf]/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7df0dd]">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.5 2.2a.75.75 0 0 1 .7.05l6.5 4a.75.75 0 0 1 .13 1.2L13 11.5l-1.2 5.2a.75.75 0 0 1-1.26.33l-2.2-2.2-3.4 1.7a.75.75 0 0 1-.97-.97l1.7-3.4-2.2-2.2a.75.75 0 0 1 .33-1.26L9 6.5l.55-3.6a.75.75 0 0 1 .95-.7z" opacity="0" />
                <path d="M17.5 10.7L11 13.4l-2.6 4.4-1-3.5-4.9-1.4 4.4-2.6L8.3 3l3.5 3.5 5.7-1.2z" transform="translate(-1.5 0.6) scale(0.95)" />
              </svg>
              {t('landing.offlineKicker')}
            </p>
            <h2 id="offline-title" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {t('landing.offlineTitle')}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#bfe8de]">
              {t('landing.offlineSub')}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex h-12 items-center rounded-lg bg-[#f59e0b] px-6 text-sm font-extrabold text-[#3b2305] shadow-lg shadow-black/20 transition-all duration-150 ease-out hover:brightness-110 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
              >
                {t('landing.ctaTools')}
              </button>
              <span className="inline-flex items-center gap-2 rounded-lg border border-[#2dd4bf]/30 px-3 py-2 text-xs font-semibold text-[#9fe8d9]">
                <kbd className="rounded border border-[#2dd4bf]/40 bg-[#0f5a52] px-1.5 py-0.5 font-mono text-[10px]">F12</kbd>
                Network → Offline — everything still works
              </span>
            </div>
          </div>

          {/* Descent rail */}
          <ol className="relative min-w-0 space-y-7 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-[#2dd4bf]/30">
            {steps.map((step, i) => (
              <li
                key={step.title}
                style={{ animationDelay: `${Math.min(i * 90, 270)}ms` }}
                className="group relative flex gap-5 animate-[slideUp_300ms_ease-out_both]"
              >
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2dd4bf]/50 bg-[#0c4a44] font-mono text-sm font-extrabold text-[#7df0dd] transition-all duration-200 group-hover:border-[#f59e0b] group-hover:text-[#fbbf24]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 pt-1">
                  <h3 className="text-lg font-extrabold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#bfe8de]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
