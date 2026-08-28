import { useT } from '../../lib/use-locale';
import { en } from '../../lib/i18n/locales/en';
import { getAppVersion } from '../../lib/seo';
import { Card } from '../ui/Card';

/** Source proper nouns + URLs (identical across locales). */
export const SOURCES: readonly { name: string; url: string }[] = [
  { name: 'AlAdhan API', url: 'https://aladhan.com' },
  { name: 'Islamic Network CDN', url: 'https://islamic.network' },
  { name: 'fawazahmed0/hadith-api', url: 'https://github.com/fawazahmed0/hadith-api' },
  { name: 'NOAA Geomag', url: 'https://www.ngdc.noaa.gov/api/v1/magdecl' },
  { name: 'Quran text (public domain)', url: 'https://quran.com' },
];

/**
 * About panel (S9/S14): mission and full source attribution. Used in
 * Settings and rendered full-size on the About page.
 * @returns The rendered panel.
 */
export function AboutPanel(): JSX.Element {
  const { t, locale } = useT();
  const about = locale.dict.about ?? en.about;
  if (!about) return <Card />;
  const descs = about.sourceDescs ?? [];

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-sm font-extrabold text-[var(--fg)]">{about.title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{about.mission}</p>
      </div>

      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)]">{about.sourcesTitle}</p>
        <ul className="mt-2.5 space-y-2">
          {SOURCES.map((src, i) => (
            <li
              key={src.name}
              className="flex flex-col gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 py-2.5 transition-colors duration-150 hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))] sm:flex-row sm:items-baseline sm:gap-3"
            >
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm font-extrabold text-[var(--primary)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] rounded"
              >
                {src.name} ↗
              </a>
              <span className="min-w-0 text-xs leading-relaxed text-[var(--muted)]">{descs[i] ?? ''}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
        <p className="text-xs text-[var(--muted)]">{about.license}</p>
        <p className="text-xs font-bold tnum text-[var(--muted)]">v{getAppVersion()}</p>
      </div>
    </Card>
  );
}
