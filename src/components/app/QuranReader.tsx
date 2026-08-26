import { useEffect, useMemo, useState } from 'react';
import { getSurahInfo, showsBasmala } from '../../lib/core/quran-meta';
import { BASMALA, getAyahsForSurah, TRANSLATION_LABELS } from '../../lib/core/quran-data';
import { fetchFullSurah, QURAN_ATTRIBUTION } from '../../lib/external/quran';
import { copyText } from '../../lib/utils/clipboard';
import { getJSON, setJSON } from '../../lib/utils/storage';
import { STORAGE_KEYS } from '../../lib/core/constants';
import { emitToast } from '../../lib/messaging';
import { ayahRef, surahRefs } from '../../lib/core/quran-audio';
import { TajweedText } from '../tajweed/TajweedText';
import { TajweedToggle } from '../tajweed/TajweedToggle';
import { useQuranPlayer } from '../../lib/quran-player-store';
import { listQuranBookmarks, toggleQuranBookmark } from '../../lib/db/db';
import { useApp } from '../../store';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SurahPicker } from './SurahPicker';
import type { FullSurah, ResolvedAyah } from '../../lib/external/quran';
import type { QuranBookmarkRow, TranslationLang } from '../../types';

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
  const { queue, index, status, playQueue } = useQuranPlayer();
  const [surahNum, setSurahNum] = useState(1);
  const [lang, setLang] = useState<TranslationLang>('en');
  const [data, setData] = useState<FullSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tajweedOn, setTajweedOn] = useState(() => getJSON(STORAGE_KEYS.tajweedOverlay, false));

  /** Persists the tajweed overlay preference. */
  function toggleTajweed(on: boolean): void {
    setTajweedOn(on);
    setJSON(STORAGE_KEYS.tajweedOverlay, on);
  }
  const [bookmarks, setBookmarks] = useState<QuranBookmarkRow[]>([]);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  /** Ayah to scroll to once the surah finishes loading. */
  const [scrollTarget, setScrollTarget] = useState<number | null>(null);

  /** Loads the bookmark list (most recent first). */
  function refreshBookmarks(): void {
    void listQuranBookmarks().then(setBookmarks);
  }

  useEffect(() => {
    refreshBookmarks();
  }, []);

  // Once the target surah is rendered, scroll the bookmarked ayah into view.
  useEffect(() => {
    if (scrollTarget === null || loading || !data) return;
    const el = document.getElementById(`ayah-${surahNum}-${scrollTarget}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setScrollTarget(null);
  }, [scrollTarget, loading, data, surahNum]);

  const bookmarkIds = useMemo(() => new Set(bookmarks.map((b) => b.id)), [bookmarks]);

  /** Toggles a bookmark and refreshes the list. */
  async function toggleBookmark(ayahNum: number): Promise<void> {
    const added = await toggleQuranBookmark(surahNum, ayahNum);
    refreshBookmarks();
    emitToast({
      title: added ? `Bookmarked ${surahNum}:${ayahNum}` : `Bookmark removed`,
      tone: added ? 'success' : 'info',
    });
  }

  /** Jumps the reader to a bookmarked position. */
  function goToBookmark(b: QuranBookmarkRow): void {
    setScrollTarget(b.ayahNum);
    setSurahNum(b.surahNum);
    setBookmarksOpen(false);
  }

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

  /** True when this ayah is the one currently sounding. */
  const isSounding = (ayahNum: number): boolean => {
    const cur = queue[index];
    return (
      cur !== undefined &&
      cur.surah === surahNum &&
      cur.ayah === ayahNum &&
      (status === 'playing' || status === 'loading' || status === 'paused')
    );
  };

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
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="amber"
              size="sm"
              onClick={() => playQueue(surahRefs(surahNum), 0)}
              disabled={loading}
              aria-label={`Listen to surah ${info.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6 4l10 6-10 6z" />
              </svg>
              Listen to surah
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBookmarksOpen((v) => !v)}
              aria-pressed={bookmarksOpen}
              aria-label="Toggle bookmarks"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill={bookmarks.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3h8a1 1 0 0 1 1 1v13l-5-3.5L5 17V4a1 1 0 0 1 1-1z" />
              </svg>
              Bookmarks{bookmarks.length > 0 ? ` · ${bookmarks.length}` : ''}
            </Button>
            <TajweedToggle on={tajweedOn} onChange={toggleTajweed} />
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
          </div>
          <p className="text-xs text-[var(--muted)] max-w-xs text-right">
            Reads offline once downloaded · {QURAN_ATTRIBUTION}
          </p>
        </div>

        {bookmarks.length > 0 && !bookmarksOpen ? (
          <button
            type="button"
            onClick={() => goToBookmark(bookmarks[0])}
            className="w-full flex items-center justify-between gap-3 rounded-lg border border-[color-mix(in_srgb,var(--accent)_40%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-3.5 py-2.5 text-left hover:border-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-wider text-[var(--accent-strong)]">Continue reading</span>
              <span className="block text-sm font-semibold text-[var(--fg)] tnum truncate">
                {getSurahInfo(bookmarks[0].surahNum).name} · ayah {bookmarks[0].ayahNum}
              </span>
            </span>
            <span className="text-[var(--accent-strong)] shrink-0" aria-hidden="true">→</span>
          </button>
        ) : null}

        {bookmarksOpen ? (
          <Card className="animate-[moduleIn_200ms_ease-out]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-sm font-extrabold text-[var(--fg)]">Your bookmarks</h3>
              <span className="text-xs font-bold tnum text-[var(--muted)]">{bookmarks.length} saved</span>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No bookmarks yet — tap the ribbon on any ayah to save your place.</p>
            ) : (
              <ul className="max-h-56 overflow-y-auto space-y-1.5">
                {bookmarks.map((b) => (
                  <li key={b.id} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 py-2">
                    <button
                      type="button"
                      onClick={() => goToBookmark(b)}
                      className="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded"
                    >
                      <span className="block text-sm font-bold text-[var(--fg)] tnum truncate">
                        {getSurahInfo(b.surahNum).name} · {b.surahNum}:{b.ayahNum}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void toggleQuranBookmark(b.surahNum, b.ayahNum).then(refreshBookmarks);
                      }}
                      aria-label={`Remove bookmark ${b.surahNum}:${b.ayahNum}`}
                      className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] hover:text-[var(--danger)] focus-visible:outline-2 focus-visible:outline-[var(--danger)] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M5 5l10 10M15 5L5 15" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ) : null}

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
              {data.ayahs.map((ayah) => {
                const sounding = isSounding(ayah.ayahNum);
                const bookmarked = bookmarkIds.has(`${surahNum}:${ayah.ayahNum}`);
                return (
                <Card
                  key={ayah.ayahNum}
                  hover
                  id={`ayah-${surahNum}-${ayah.ayahNum}`}
                  className={[
                    'group scroll-mt-24 transition-all duration-200',
                    sounding ? 'ring-2 ring-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_50%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_5%,var(--card))]' : '',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-xs font-extrabold text-[var(--primary)] tnum">
                      {ayah.ayahNum}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="arabic text-lg sm:text-xl lg:text-2xl text-[var(--fg)] text-right">
                        <TajweedText text={ayah.arabic} enabled={tajweedOn} />
                      </p>
                      <p
                        className={['mt-2 text-sm leading-relaxed text-[var(--muted)]', lang === 'ur' ? 'arabic text-base' : ''].join(' ')}
                        dir={lang === 'ur' ? 'rtl' : 'ltr'}
                      >
                        {ayah[lang]}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => playQueue([ayahRef(surahNum, ayah.ayahNum)], 0)}
                        aria-label={sounding ? `Playing ayah ${ayah.ayahNum}` : `Play ayah ${ayah.ayahNum}`}
                        title={sounding ? 'Playing…' : 'Play this ayah'}
                        className={[
                          'inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-150 active:scale-95',
                          'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]',
                          sounding
                            ? 'bg-[var(--accent)] text-[#3b2305] animate-[pulseDot_1.4s_ease-in-out_infinite]'
                            : 'bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent-strong)] hover:bg-[var(--accent)] hover:text-[#3b2305]',
                        ].join(' ')}
                      >
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 8v4h3l4 3.5v-11L7 8H4z" fill="currentColor" stroke="none" />
                          <path d="M13.5 7.5a4 4 0 0 1 0 5M15.5 5.5a7 7 0 0 1 0 9" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => void toggleBookmark(ayah.ayahNum)}
                        aria-pressed={bookmarked}
                        aria-label={bookmarked ? `Remove bookmark from ayah ${ayah.ayahNum}` : `Bookmark ayah ${ayah.ayahNum}`}
                        title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                        className={[
                          'inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-150 active:scale-95',
                          'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                          bookmarked
                            ? 'bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] text-[var(--primary)]'
                            : 'text-[var(--muted)] opacity-60 group-hover:opacity-100 hover:bg-[var(--hover)] hover:text-[var(--primary)]',
                        ].join(' ')}
                      >
                        <svg width="15" height="15" viewBox="0 0 20 20" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                          <path d="M6 3h8a1 1 0 0 1 1 1v13l-5-3.5L5 17V4a1 1 0 0 1 1-1z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => void copyAyah(ayah)}
                        aria-label={`Copy ayah ${ayah.ayahNum} of surah ${info.name}`}
                        title="Copy"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] opacity-60 group-hover:opacity-100 hover:bg-[var(--hover)] hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-all"
                      >
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <rect x="7" y="7" width="9" height="9" rx="2" />
                          <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Card>
                );
              })}
              </div>          </>
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
