import { navigate } from '../../lib/router';
import { Badge } from '../ui/Badge';

interface Row {
  label: string;
  salahkit: string;
  typical: string;
  good: boolean;
}

const ROWS: readonly Row[] = [
  { label: 'Price', salahkit: 'Free forever', typical: '$12.99 / month', good: true },
  { label: 'Ads', salahkit: 'None, ever', typical: 'Banners + video ads', good: true },
  { label: 'Tracking & data sale', salahkit: 'Zero — no analytics at all', typical: 'Location + usage sold', good: true },
  { label: 'Sign-up required', salahkit: 'No account, instant', typical: 'Email + phone wall', good: true },
  { label: 'Offline', salahkit: 'Full toolkit offline', typical: 'Premium-only, partial', good: true },
  { label: 'Your data', salahkit: 'Yours: export / wipe anytime', typical: 'Locked to their cloud', good: true },
];

/**
 * Landing comparison (S8/S10): honest feature table versus typical
 * paid apps. No competitor names appear in UI text (S9 legal rule).
 * @returns The rendered comparison section.
 */
export function Comparison(): JSX.Element {
  return (
    <section id="compare" aria-labelledby="compare-title" className="mx-auto max-w-4xl px-4 py-14">
      <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">The honest math</p>
      <h2 id="compare-title" className="mt-2 text-center text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
        Why pay — and be tracked — for this?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[var(--muted)]">
        The typical paid Muslim app charges a subscription and still shows ads. SalahKit flips both.
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[var(--muted)]">
                Feature
              </th>
              <th scope="col" className="px-5 py-4 text-left">
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--fg)]">
                  SalahKit <Badge tone="success">Free</Badge>
                </span>
              </th>
              <th scope="col" className="px-5 py-4 text-left text-sm font-extrabold text-[var(--muted)]">
                Typical paid app
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
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
          Start with today’s prayer times
        </button>
        <p className="text-xs text-[var(--muted)]">No download. No account. Opens in one tap.</p>
      </div>
    </section>
  );
}
