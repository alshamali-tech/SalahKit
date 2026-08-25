import { useEffect, useState } from 'react';
import { getSurahInfo, showsBasmala } from '../../lib/core/quran-meta';
import { BASMALA, getAyahsForSurah, TRANSLATION_LABELS } from '../../lib/core/quran-data';
import { fetchFullSurah, QURAN_ATTRIBUTION } from '../../lib/external/quran';
import { copyText } from '../../lib/utils/clipboard';
import { emitToast } from '../../lib/messaging';
import { useApp } from '../../store';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SurahPicker } from './SurahPicker';
import type { FullSurah, ResolvedAyah } from '../../lib/external/quran';
import type { TranslationLang } from '../../types';

const LANGS: readonly TranslationLang[] = ['en', 'ur', 'fr'];

/** Geometric divider used above and below the surah header. */
function Divider(): JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 12" className="mx-auto h-3 w-56 text-[var(--primary)] opacity-60" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M0 6h120M180 6h120" />
      <path d="M150 1l4 5-4 5-4-5zM132 6h8M160 6h8" />
    </svg>
  );
}

/**
 * Quran reader module: all 114 surahs streamed from the free AlQuran
 * Cloud API and cached permanently on-device; the bundled short
 * surahs remain readable with zero connectivity.
 * @returns The rendered module.
 */
export function QuranReader(): JSX.Element {
  const online = useApp((s) => s.online);
  const [surahNum, setSurahNum] = useState(1);
  const [lang, setLang] = useState<TranslationLang>('en');
  const [data, setData] = useState<FullSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      const full = await fetchFullSurah(surahNum);
      if (cancelled) return;
      if (full) {
        setData(full);
        setLoading(false);
        return;
      }
      const local = getAyahsForSurah(surahNum).map(
        (a): ResolvedAyah => ({ ayahNum: a.ayah, arabic: a.arabic, en: a.en, ur: a.ur, fr: a.fr })
      );
      setData(local.length > 0 ? { num: surahNum, source: 'cache', ayahs: local } : null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [surahNum]);

  useEffect(() => {
    if (surahNum < 114 && data) void fetchFullSurah(surahNum + 1);
  }, [surahNum, data]);

  const info = getSurahInfo(surahNum);

  /** Copies one ayah with its active translation. */
  async function copyAyah(ayah: ResolvedAyah): Promise<void> {
    const ok = await copyText(`${ayah.arabic}\n\n${ayah[lang]}`);
    if (ok) {
      emitToast({ title: `Ayah ${ayah.ayahNum} copied`, tone: 'success' });
    } else {
      emitToast({ title: 'Copy unavailable', body: 'Select the text manually to copy it.', tone: 'warning' });
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr] lg:items-start">
      <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
        <Button variant="outline" full className="lg:hidden" onClick={() => setPickerOpen((v) => !v)}>
          {pickerOpen ? 'Hide surah list' : `Browse surahs — ${info.num}. ${info.name}`}
        </Button>
        <Card className={['mt-2 lg:mt-0 overflow-hidden p-0', pickerOpen ? 'block' : 'hidden lg:block'].join(' ')}>
          <div className="h-[420px] lg:h-[calc(100vh-13rem)]">
            <SurahPicker active={surahNum} onSelect={(n) => setSurahNum(n)} />
          </div>
        </Card>
      </div>

      <div className="min-w-0 space-y-4">
        <Card tone="raised" className="relative overflow-hidden text-center">
          <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="relative py-2">
            <p className="arabic text-4xl text-[var(--fg)]">{info.nameArabic}</p>
            <Divider />
            <p className="mt-1 text-sm font-bold text-[var(--primary)]">
              Surah {info.num} · {info.name} — “{info.meaning}”
            </p>
            <div className="mt-2.5 flex flex-wrap justify-center gap-2">
              <Badge tone="neutral">{info.revelation}</Badge>
              <Badge tone="neutral">{info.ayahCount} ayahs</Badge>
              {loading ? (
                <Badge tone="primary">Loading…</Badge>
              ) : data?.source === 'network' ? (
                <Badge tone="accent">Just downloaded</Badge>
              ) : (
                <Badge tone="success">On device</Badge>
              )}
              {!online && !loading ? <Badge tone="warning">Offline copy</Badge> : null}
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={[
                  'h-10 px-3.5 text-xs font-bold transition-colors duration-150',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)]',
                  lang === l ? 'bg-[var(--accent)] text-[#3b2305]' : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]',
                ].join(' ')}
              >
                {TRANSLATION_LABELS[l]}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--muted)] max-w-xs text-right">
            Reads offline once downloaded · {QURAN_ATTRIBUTION}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3" role="status" aria-label="Loading surah">
            {[72, 88, 64, 80].map((w, i) => (
              <Card key={i} className="animate-pulse">
                <div className="ml-auto rounded bg-[var(--hover)]" style={{ width: `${w}%`, height: 22 }} />
                <div className="mt-3 rounded bg-[var(--hover)]" style={{ width: `${100 - i * 9}%`, height: 12 }} />
              </Card>
            ))}
          </div>
        ) : data && data.ayahs.length > 0 ? (
          <>
            {showsBasmala(surahNum) ? (
              <p className="arabic text-center text-2xl text-[var(--muted)]">{BASMALA}</p>
            ) : null}
            <div className="space-y-3">
              {data.ayahs.map((ayah) => (
                <Card key={ayah.ayahNum} hover className="group">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-xs font-extrabold text-[var(--primary)] tnum">
                      {ayah.ayahNum}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="arabic text-xl sm:text-2xl text-[var(--fg)] text-right">{ayah.arabic}</p>
                      <p
                        className={['mt-2 text-sm leading-relaxed text-[var(--muted)]', lang === 'ur' ? 'arabic text-base' : ''].join(' ')}
                        dir={lang === 'ur' ? 'rtl' : 'ltr'}
                      >
                        {ayah[lang]}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void copyAyah(ayah)}
                      aria-label={`Copy ayah ${ayah.ayahNum} of surah ${info.name}`}
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
          </>
        ) : (
          <Card tone="outline" className="py-12 text-center">
            <p className="text-sm font-bold text-[var(--fg)]">
              {online ? 'This surah could not be fetched.' : 'This surah is not on your device yet.'}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)] max-w-sm mx-auto">
              {online
                ? 'Check the connection and try again — the bundled surahs (1, 103, 108, 110–114) always work.'
                : 'Open it once while online and it stays readable offline forever.'}
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setSurahNum(1)}>
              Read Al-Fatihah (always offline)
            </Button>
          </Card>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" disabled={surahNum <= 1} onClick={() => setSurahNum((n) => n - 1)}>
            ← Previous surah
          </Button>
          <span className="text-xs font-bold tnum text-[var(--muted)]">{surahNum} / 114</span>
          <Button variant="outline" disabled={surahNum >= 114} onClick={() => setSurahNum((n) => n + 1)}>
            Next surah →
          </Button>
        </div>
      </div>
    </div>
  );
}
