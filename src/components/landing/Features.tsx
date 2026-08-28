import { navigate } from '../../lib/router';
import { useT } from '../../lib/use-locale';
import type { ModuleId } from '../../types';
import { ModuleIcon } from '../ui/ModuleIcon';

interface Feature {
  module: ModuleId;
  title: string;
  blurb: string;
  icon: string;
  /** Grid span classes for the mosaic layout. */
  span: string;
  /** Accent color for the icon chip. */
  accent: 'primary' | 'amber';
}

const FEATURES: readonly Feature[] = [
  {
    module: 'prayer', title: 'Prayer Times', icon: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM10 6v4l2.6 2.6',
    blurb: 'Astronomically exact times for 43 cities and 5 calculation methods — computed on-device, accurate at 30,000 ft or underground.',
    span: 'sm:col-span-2', accent: 'primary',
  },
  {
    module: 'qibla', title: 'Qibla Compass', icon: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM13.2 6.8l-1.9 4.5-4.5 1.9 1.9-4.5z',
    blurb: 'Great-circle bearing to the Kaaba with distance — no GPS permission needed.',
    span: '', accent: 'amber',
  },
  {
    module: 'quran', title: 'Quran Reader', icon: 'M10 4.6C8.2 3.3 5.6 3 3.5 3.5v12c2.1-.5 4.7-.2 6.5 1.1 1.8-1.3 4.4-1.6 6.5-1.1v-12c-2.1-.5-4.7-.2-6.5 1.1zM10 4.6v12',
    blurb: 'The full Quran with translations, colored tajweed and reciter audio — readable in airplane mode.',
    span: 'sm:col-span-2', accent: 'primary',
  },
  {
    module: 'tajweed', title: 'Tajweed Trainer', icon: 'M4 4h12v12H4zM7 7.4c1 1 2.5 1 3 0M11.5 7.4c.5 1 2 1 3 0M7.5 11h5M8.5 13.4h3',
    blurb: 'A guided path, the interactive noon tree and a live lab that color-codes any ayah you paste.',
    span: '', accent: 'amber',
  },
  {
    module: 'arabic', title: 'Arabic Foundations', icon: 'M13 4.5v9a2.5 2.5 0 0 1-2.5 2.5M10.4 3.4l5.2-1.8M5 15.5c1.5-1.8 2.3-4 2.3-6.5M5 9.2c1.2.2 2.3.7 3.1 1.5',
    blurb: 'Letters with their four forms, harakat, Quran grammar and vocabulary — offline and audible.',
    span: '', accent: 'primary',
  },
  {
    module: 'hijri', title: 'Hijri Calendar', icon: 'M15 12.8A6.2 6.2 0 0 1 7.2 5a6.2 6.2 0 1 0 7.8 7.8z',
    blurb: 'Two-way Gregorian ↔ Hijri conversion plus a full month calendar, refined online via AlAdhan when you are connected.',
    span: '', accent: 'amber',
  },
  {
    module: 'dhikr', title: 'Dhikr Counter', icon: 'M10 2.8a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4zM10 7.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z',
    blurb: 'A satisfying tasbih with progress ring, targets of 33/99/100 and undo.',
    span: '', accent: 'primary',
  },
  {
    module: 'zakat', title: 'Zakat Calculator', icon: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM10 6v8M7.7 8h3.6a1.6 1.6 0 0 1 0 3.2H8.7a1.6 1.6 0 0 0 0 3.2h3.6',
    blurb: 'Live 2.5% against the silver nisab in 12 currencies, with private saved records.',
    span: '', accent: 'amber',
  },
  {
    module: 'duas', title: 'Duas & Adhkar', icon: 'M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z',
    blurb: 'Morning, evening, salah and sleep adhkar — Arabic, transliteration, translation, source.',
    span: '', accent: 'primary',
  },
  {
    module: 'names', title: '99 Names', icon: 'M10 2.3l2.3 4.7 5.1.8-3.7 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.7-3.6 5.1-.8z',
    blurb: 'Asma ul-Husna with meanings, searchable by name or attribute.',
    span: '', accent: 'amber',
  },
  {
    module: 'hadith', title: 'Hadith Library', icon: 'M3.5 3.5h13v13h-13zM6.5 7h7M6.5 10h7M6.5 13h4.5',
    blurb: 'The two Sahihs streamed section by section — thousands of hadiths, cached for offline reading.',
    span: 'sm:col-span-2', accent: 'primary',
  },
  {
    module: 'hifz', title: 'Hifz Trainer', icon: 'M10 4.6C8.2 3.3 5.6 3 3.5 3.5v12c2.1-.5 4.7-.2 6.5 1.1 1.8-1.3 4.4-1.6 6.5-1.1v-12c-2.1-.5-4.7-.2-6.5 1.1zM10 4.6v12M7 9l2 2 4-4.6',
    blurb: 'Memorize with spaced repetition — listen, recite aloud, and let your voice reveal the ayah.',
    span: '', accent: 'amber',
  },
  {
    module: 'tracker', title: 'Prayer Tracker', icon: 'M3.5 5.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2zM6.8 10.4l2.2 2.2 4.4-5',
    blurb: 'A weekly grid with streaks and notes — accountability without an account.',
    span: 'sm:col-span-2', accent: 'primary',
  },
  {
    module: 'calendar', title: 'Hijri Calendar', icon: 'M3 5.5A1.5 1.5 0 0 1 4.5 4h11A1.5 1.5 0 0 1 17 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 14.5zM3 8h14M7 2.5V5M13 2.5V5M6.5 11.5h2v2h-2z',
    blurb: 'A full Hijri month view with today marked and Jumu’ah highlighted.',
    span: '', accent: 'amber',
  },
];

/**
 * Landing features mosaic (S8): every tool is a live tile that
 * navigates straight into it.
 * @returns The rendered features section.
 */
export function Features(): JSX.Element {
  const { t, locale } = useT();
  const blurbs = locale.dict.landing.featureBlurbs;
  return (
    <section id="features" aria-labelledby="features-title" className="mx-auto max-w-7xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">{t('landing.featuresKicker')}</p>
          <h2 id="features-title" className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
            {t('landing.featuresTitle')}
          </h2>
        </div>
        <p className="max-w-xs text-sm text-[var(--muted)]">{t('landing.featuresSub')}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <button
            key={f.module}
            type="button"
            onClick={() => navigate(`/tools/${f.module}`)}
            style={{ animationDelay: `${Math.min(i * 45, 400)}ms` }}
            className={[
              'group relative flex flex-col items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-left min-w-0',
              'transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-950/10 hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
              'animate-[slideUp_300ms_ease-out_both]',
              f.span,
            ].join(' ')}
          >
            <span
              className={[
                'inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3',
                f.accent === 'amber'
                  ? 'bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent-strong)]'
                  : 'bg-[color-mix(in_srgb,var(--primary)_13%,transparent)] text-[var(--primary)]',
              ].join(' ')}
            >
              <ModuleIcon module={f.module} d={f.icon} size={22} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-base font-extrabold text-[var(--fg)]">
                {t(`modules.${f.module}`)}
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--primary)] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true">
                  <path d="M4 10h12m-5-5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">{blurbs[i] ?? f.blurb}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
