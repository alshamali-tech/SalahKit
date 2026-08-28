import { navigate } from '../../lib/router';
import { useT } from '../../lib/use-locale';
import { en } from '../../lib/i18n/locales/en';

const ZERO_STATS: readonly string[] = ['cookies', 'analytics', 'ads', 'accounts', 'trackers', 'pixels'];

/**
 * Landing privacy section (S8): the zero-ledger and a diagram of where
 * data actually lives — your device, and nowhere else.
 * @returns The rendered section.
 */
export function PrivacySection(): JSX.Element {
  const { t, locale } = useT();
  const dict = locale.dict;
  const items = dict.landing.privacyItems ?? en.landing.privacyItems ?? [];

  return (
    <section id="privacy" aria-labelledby="privacy-title" className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">
            {t('landing.privacyKicker')}
          </p>
          <h2 id="privacy-title" className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl lg:text-5xl">
            {t('landing.privacyTitle')}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)]">
            {t('landing.privacySub')}
          </p>

          <ul className="mt-7 space-y-2.5">
            {items.map((item, i) => (
              <li
                key={item}
                style={{ animationDelay: `${Math.min(i * 60, 360)}ms` }}
                className="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 -mx-2 transition-all duration-200 ease-out hover:border-[var(--border)] hover:bg-[var(--card)] animate-[slideUp_300ms_ease-out_both]"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-[var(--danger)] transition-transform duration-200 group-hover:scale-110"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="6" cy="6" r="5" />
                    <path d="M2.6 2.6l6.8 6.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-[var(--fg)]">{item}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => navigate('/privacy')}
            className="group mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--primary)] hover:text-[color-mix(in_srgb,var(--primary)_80%,var(--fg))] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)] rounded"
          >
            {t('landing.privacyProof')}
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
              <path d="M4 10h12m-5-5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="min-w-0">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
            <svg viewBox="0 0 460 260" className="w-full" role="img" aria-label="Diagram: data stays inside your device and never reaches the cloud">
              {/* Your device boundary */}
              <rect x="14" y="14" width="290" height="232" rx="18" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="6 5" opacity="0.5" />
              <text x="30" y="42" fontSize="11" fontWeight="800" letterSpacing="2" fill="var(--primary)">YOUR DEVICE</text>

              {/* Browser block */}
              <rect x="40" y="70" width="104" height="72" rx="12" fill="color-mix(in srgb, var(--primary) 10%, var(--card))" stroke="var(--primary)" strokeWidth="1.5" />
              <circle cx="56" cy="86" r="3" fill="var(--primary)" opacity="0.7" />
              <circle cx="66" cy="86" r="3" fill="var(--primary)" opacity="0.45" />
              <circle cx="76" cy="86" r="3" fill="var(--primary)" opacity="0.25" />
              <text x="92" y="116" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--fg)">SalahKit</text>

              {/* IndexedDB cylinder */}
              <g>
                <ellipse cx="222" cy="80" rx="40" ry="11" fill="color-mix(in srgb, var(--accent) 16%, var(--card))" stroke="var(--accent-strong)" strokeWidth="1.5" />
                <path d="M182 80v56c0 6.1 17.9 11 40 11s40-4.9 40-11V80" fill="color-mix(in srgb, var(--accent) 10%, var(--card))" stroke="var(--accent-strong)" strokeWidth="1.5" />
                <ellipse cx="222" cy="136" rx="40" ry="11" fill="none" stroke="var(--accent-strong)" strokeWidth="1.5" opacity="0.4" />
                <text x="222" y="112" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--fg)">IndexedDB</text>
              </g>

              {/* Two-way local arrow */}
              <g stroke="var(--primary)" strokeWidth="2" fill="none">
                <path d="M146 96h32" strokeLinecap="round" />
                <path d="M178 96l-7-5v10z" fill="var(--primary)" stroke="none" />
                <path d="M178 118h-32" strokeLinecap="round" />
                <path d="M146 118l7-5v10z" fill="var(--primary)" stroke="none" />
              </g>

              {/* Blocked cloud */}
              <g opacity="0.75">
                <path
                  d="M352 108c-2.5-13 8-24 21-23 3-10 16-14 24-8 11-4 22 4 22 15 9 2 14 12 10 20 4 8-2 18-12 18h-56c-9 0-15-8-13-16-2-2-2-4 4-6z"
                  transform="translate(-18 6) scale(0.82)"
                  fill="var(--hover)"
                  stroke="var(--muted)"
                  strokeWidth="1.5"
                />
                <text x="372" y="122" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--muted)">servers</text>
              </g>

              {/* Blocked arrow */}
              <g>
                <path d="M306 108h46" stroke="var(--muted)" strokeWidth="2" strokeDasharray="4 5" fill="none" strokeLinecap="round" />
                <g transform="translate(330 108)">
                  <circle r="12" fill="var(--card)" stroke="var(--danger)" strokeWidth="2" />
                  <path d="M-5 -5l10 10M5 -5l-10 10" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" />
                </g>
              </g>

              <text x="372" y="170" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--muted)">nothing ever</text>
              <text x="372" y="184" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--muted)">leaves</text>
            </svg>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {ZERO_STATS.map((label, i) => (
              <div
                key={label}
                style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-2 py-3 text-center transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] animate-[slideUp_280ms_ease-out_both]"
              >
                <dt className="order-2 mt-0.5 block text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">{label}</dt>
                <dd className="text-2xl font-extrabold tnum leading-none text-[var(--primary)]">0</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
