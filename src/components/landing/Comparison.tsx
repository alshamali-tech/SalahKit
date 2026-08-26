import { navigate } from '../../lib/router';
import { useT } from '../../lib/use-locale';
import { Badge } from '../ui/Badge';

/**
 * Landing comparison (S8/S10): honest feature table versus typical
 * paid apps. No competitor names appear in UI text (S9 legal rule).
 * Rows come from the active locale dictionary.
 * @returns The rendered comparison section.
 */
export function Comparison(): JSX.Element {
  const { t, locale } = useT();
  const { compareHeaders: headers, compareRows: rows } = locale.dict.landing;
  return (
    <section id="compare" aria-labelledby="compare-title" className="mx-auto max-w-4xl px-4 py-14">
      <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">{t('landing.compareKicker')}</p>
      <h2 id="compare-title" className="mt-2 text-center text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
        {t('landing.compareTitle')}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[var(--muted)]">
        {t('landing.compareSub')}
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[var(--muted)]">
                {headers.feature}
              </th>
              <th scope="col" className="px-5 py-4 text-left">
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--fg)]">
                  {headers.salahkit} <Badge tone="success">{t('badges.free')}</Badge>
                </span>
              </th>
              <th scope="col" className="px-5 py-4 text-left text-sm font-extrabold text-[var(--muted)]">
                {headers.typical}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--hover)]">
                <th scope="row" className="px-5 py-3.5 text-left font-bold text-[var(--fg)]">{row.label}</th>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-start gap-2 font-semibold text-[var(--fg)]">
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="var(--success)" strokeWidth="2.2" className="mt-0.5 shrink-0" aria-label="Included">
                      <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {row.salahkit}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-start gap-2 text-[var(--muted)]">
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="var(--danger)" strokeWidth="2.2" className="mt-0.5 shrink-0 opacity-70" aria-label="Not included">
                      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                    </svg>
                    {row.typical}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <button
          type="button"
          onClick={() => navigate('/tools/prayer')}
          className="inline-flex h-12 items-center rounded-lg bg-[var(--accent)] px-7 text-sm font-bold text-[#3b2305] shadow-lg shadow-amber-900/20 hover:brightness-105 active:scale-[0.97] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          {t('landing.compareCta')}
        </button>
        <p className="text-xs text-[var(--muted)]">{t('landing.compareCtaNote')}</p>
      </div>
    </section>
  );
}
