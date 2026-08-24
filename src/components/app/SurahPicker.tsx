import { useEffect, useMemo, useState } from 'react';
import { ALL_SURAHS, searchSurahs } from '../../lib/core/quran-meta';
import { isSurahCached } from '../../lib/external/quran';
import { LOCAL_SURAH_NUMS } from '../../lib/core/quran-data';
import { Badge } from '../ui/Badge';

export interface SurahPickerProps {
  /** Currently displayed surah number. */
  active: number;
  /** Select handler. */
  onSelect: (num: number) => void;
}

/**
 * Full 114-surah navigation panel with live search and availability
 * markers: green = already on this device, amber = bundled offline
 * copy, neutral = streams on first open.
 * @param props - active/onSelect.
 * @returns The rendered picker.
 */
export function SurahPicker({ active, onSelect }: SurahPickerProps): JSX.Element {
  const [query, setQuery] = useState('');
  const [cached, setCached] = useState<ReadonlySet<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const flags = await Promise.all(ALL_SURAHS.map(async (s) => isSurahCached(s.num)));
      if (!cancelled) {
        setCached(new Set(ALL_SURAHS.filter((_, i) => flags[i]).map((s) => s.num)));
      }
    })();
    const id = window.setInterval(async () => {
      const flags = await Promise.all(ALL_SURAHS.map(async (s) => isSurahCached(s.num)));
      if (!cancelled) {
        setCached(new Set(ALL_SURAHS.filter((_, i) => flags[i]).map((s) => s.num)));
      }
    }, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const results = useMemo(() => searchSurahs(query), [query]);

  /**
   * Availability state for one surah row.
   * @param num - Surah number.
   * @returns 'cached' | 'local' | 'stream'.
   */
  function availability(num: number): 'cached' | 'local' | 'stream' {
    if (cached.has(num)) return 'cached';
    if (LOCAL_SURAH_NUMS.includes(num)) return 'local';
    return 'stream';
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="p-3 border-b border-[var(--border)]">
        <label htmlFor="surah-search" className="sr-only">
          Search surahs
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            width="15"
            height="15"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="9" cy="9" r="5.5" />
            <path d="M13.5 13.5L17 17" strokeLinecap="round" />
          </svg>
          <input
            id="surah-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 114 surahs…"
            className={[
              'w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--field)] pl-9 pr-3 text-sm',
              'text-[var(--fg)] placeholder:text-[var(--muted)]',
              'focus:outline-none focus:border-[var(--primary)] focus:ring-2',
              'focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)] transition-colors',
            ].join(' ')}
          />
        </div>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto p-2 space-y-1" role="listbox" aria-label="Surahs">
        {results.map((s) => {
          const state = availability(s.num);
          const isActive = s.num === active;
          return (
            <li key={s.num} role="option" aria-selected={isActive}>
              <button
                type="button"
                onClick={() => onSelect(s.num)}
                className={[
                  'w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left min-w-0',
                  'transition-all duration-150 ease-out',
                  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                  isActive
                    ? 'bg-[color-mix(in_srgb,var(--primary)_13%,transparent)] shadow-sm'
                    : 'hover:bg-[var(--hover)]',
                ].join(' ')}
              >
                <span
                  className={[
                    'shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-extrabold tnum',
                    isActive
                      ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                      : 'bg-[var(--field)] border border-[var(--border)] text-[var(--muted)]',
                  ].join(' ')}
                >
                  {s.num}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={[
                      'block truncate text-sm font-bold',
                      isActive ? 'text-[var(--primary)]' : 'text-[var(--fg)]',
                    ].join(' ')}
                  >
                    {s.name}
                  </span>
                  <span className="block text-[11px] text-[var(--muted)] truncate">
                    {s.meaning} · {s.ayahCount} ayahs
                  </span>
                </span>
                <span className="shrink-0 flex flex-col items-end gap-1">
                  <span className="arabic text-sm leading-6 text-[var(--muted)]">{s.nameArabic}</span>
                  <span
                    aria-label={
                      state === 'cached'
                        ? 'Available offline'
                        : state === 'local'
                          ? 'Bundled offline copy'
                          : 'Streams on first open'
                    }
                    className={[
                      'h-1.5 w-1.5 rounded-full',
                      state === 'cached'
                        ? 'bg-[var(--success)]'
                        : state === 'local'
                          ? 'bg-[var(--accent)]'
                          : 'bg-[var(--border)]',
                    ].join(' ')}
                  />
                </span>
              </button>
            </li>
          );
        })}
        {results.length === 0 ? (
          <li className="px-3 py-8 text-center text-sm text-[var(--muted)]">
            No surah matches “{query}”.
          </li>
        ) : null}
      </ul>

      <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-[var(--border)] px-3 py-2.5 text-[10px] font-semibold text-[var(--muted)]">
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden="true" /> on device
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" /> bundled
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--border)]" aria-hidden="true" /> streams once
        </span>
        <Badge tone="neutral" className="ml-auto">114 surahs</Badge>
      </div>
    </div>
  );
}
