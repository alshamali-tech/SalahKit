import { useMemo, useState } from 'react';
import { BASMALA, QURAN_SURAHS, TRANSLATION_LABELS, getAyahsForSurah } from '../../lib/core/quran-data';
import { emitToast } from '../../lib/messaging';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { TranslationLang } from '../../types';

const LANGS: readonly TranslationLang[] = ['en', 'ur', 'fr'];

/**
 * Quran reader module: fully offline short-surah collection with
 * three translations and per-ayah copy.
 * @returns The rendered module.
 */
export function QuranReader(): JSX.Element {
  const [surahNum, setSurahNum] = useState(1);
  const [lang, setLang] = useState<TranslationLang>('en');

  const meta = useMemo(() => QURAN_SURAHS.find((s) => s.num === surahNum) ?? QURAN_SURAHS[0], [surahNum]);
  const ayahs = useMemo(() => getAyahsForSurah(meta.num), [meta.num]);
  const currentIndex = QURAN_SURAHS.findIndex((s) => s.num === meta.num);

  /** Copies an ayah with its translation to the clipboard. */
  async function copyAyah(arabic: string, translation: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(`${arabic}\n\n${translation}`);
      emitToast({ title: 'Ayah copied', tone: 'success' });
    } catch {
      emitToast({ title: 'Copy unavailable', body: 'Your browser blocked clipboard access.', tone: 'warning' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {QURAN_SURAHS.map((s) => (
            <button
              key={s.num}
              type="button"
              aria-pressed={s.num === meta.num}
              onClick={() => setSurahNum(s.num)}
              className={[
                'h-9 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                s.num === meta.num
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm'
                  : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--primary)]',
              ].join(' ')}
            >
              {s.num}. {s.name}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
              className={[
                'h-9 px-3 text-xs font-bold transition-colors duration-150',
                lang === l ? 'bg-[var(--accent)] text-[#3b2305]' : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]',
              ].join(' ')}
            >
              {TRANSLATION_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      <Card tone="raised" className="text-center relative overflow-hidden">
        <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative">
          <p className="arabic text-4xl text-[var(--fg)]">{meta.nameArabic}</p>
          <p className="mt-1 text-sm font-bold text-[var(--primary)]">
            Surah {meta.num} · {meta.name} — “{meta.meaning}”
          </p>
          <div className="mt-2 flex justify-center gap-2">
            <Badge tone="neutral">{meta.revelation}</Badge>
            <Badge tone="neutral">{meta.ayahCount} ayahs</Badge>
            <Badge tone="success">Offline</Badge>
          </div>
        </div>
      </Card>

      {meta.num !== 1 ? (
        <p className="arabic text-center text-2xl text-[var(--muted)]">{BASMALA}</p>
      ) : null}

      <div className="space-y-3">
        {ayahs.map((ayah) => (
          <Card key={`${ayah.surah}:${ayah.ayah}`} hover className="group">
            <div className="flex items-start gap-3">
              <span className="shrink-0 mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-xs font-extrabold text-[var(--primary)] tnum">
                {ayah.ayah}
              </span>
              <div className="min-w-0 flex-1">
                <p className="arabic text-xl sm:text-2xl text-[var(--fg)] text-right">{ayah.arabic}</p>
                <p
                  className={[
                    'mt-2 text-sm leading-relaxed text-[var(--muted)]',
                    lang === 'ur' ? 'arabic text-base' : '',
                  ].join(' ')}
                  dir={lang === 'ur' ? 'rtl' : 'ltr'}
                >
                  {ayah[lang]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void copyAyah(ayah.arabic, ayah[lang])}
                aria-label={`Copy ayah ${ayah.ayah} of surah ${meta.name}`}
                className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] opacity-60 group-hover:opacity-100 hover:bg-[var(--hover)] hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="7" y="7" width="9" height="9" rx="2" />
                  <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                </svg>
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={currentIndex <= 0}
          onClick={() => setSurahNum(QURAN_SURAHS[currentIndex - 1].num)}
        >
          ← Previous surah
        </Button>
        <Button
          variant="outline"
          disabled={currentIndex >= QURAN_SURAHS.length - 1}
          onClick={() => setSurahNum(QURAN_SURAHS[currentIndex + 1].num)}
        >
          Next surah →
        </Button>
      </div>
    </div>
  );
}
