import { DONATION_LINKS, DONATION_TAGLINE } from '../../lib/donation';
import { getPlan, getPlanLabel } from '../../lib/plan';
import { useApp } from '../../store';
import { Badge } from './Badge';
import type { ModuleId } from '../../types';

const TOOL_LINKS: ReadonlyArray<{ module: ModuleId; label: string }> = [
  { module: 'prayer', label: 'Prayer Times' },
  { module: 'qibla', label: 'Qibla' },
  { module: 'hijri', label: 'Hijri Converter' },
  { module: 'quran', label: 'Quran' },
  { module: 'dhikr', label: 'Dhikr Counter' },
  { module: 'zakat', label: 'Zakat' },
];

/**
 * Site footer: brand promise, tool shortcuts, external donation links
 * (S11) and legal navigation. No tracking, no dark patterns.
 * @returns The rendered footer.
 */
export function Footer(): JSX.Element {
  const { setModule } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_60%,var(--bg))]">
      <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="min-w-0 sm:col-span-2 lg:col-span-2">
          <p className="text-lg font-extrabold text-[var(--fg)]">
            Salah<span className="text-[var(--primary)]">Kit</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] max-w-md">
            A free, offline-first Islamic toolkit: prayer times, Qibla, Hijri calendar, Quran,
            dhikr, Zakat, duas and the 99 Names. Your data stays on your device — always.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="success">{getPlanLabel(getPlan())}</Badge>
            <Badge tone="primary">Offline-first</Badge>
            <Badge tone="neutral">No ads · No tracking</Badge>
          </div>
        </div>

        <nav aria-label="Footer tools">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)] mb-2.5">Tools</p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 lg:grid-cols-1">
            {TOOL_LINKS.map((link) => (
              <li key={link.module}>
                <button
                  type="button"
                  onClick={() => {
                    setModule(link.module);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-[var(--fg)] opacity-75 hover:opacity-100 hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)] mb-2.5">Support</p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{DONATION_TAGLINE}</p>
          <ul className="mt-2.5 space-y-1.5">
            {DONATION_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[var(--accent-strong)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setModule('privacy')}
                className="text-sm text-[var(--fg)] opacity-75 hover:opacity-100 hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setModule('terms')}
                className="text-sm text-[var(--fg)] opacity-75 hover:opacity-100 hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded"
              >
                Terms of Service
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 text-xs text-[var(--muted)]">
          <p>© {year} SalahKit. Built with ihsan.</p>
          <p className="sm:ml-auto">
            Prayer times computed on-device · optional refinement via the free{' '}
            <a
              href="https://aladhan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--primary)]"
            >
              AlAdhan API
            </a>{' '}
            and NOAA Geomag (compass declination)
          </p>
        </div>
      </div>
    </footer>
  );
}
