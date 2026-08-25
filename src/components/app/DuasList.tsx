import { useEffect, useMemo, useState } from 'react';
import {
  DUA_CATEGORY_LABELS,
  DUA_CATEGORY_ORDER,
  DUAS,
  countDuas,
  filterDuas,
  getDuas,
} from '../../lib/core/duas-data';
import { getFavoriteDuaIds, toggleDuaFavorite } from '../../lib/db/db';
import { copyText } from '../../lib/utils/clipboard';
import { emitToast } from '../../lib/messaging';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import type { Dua, DuaCategory } from '../../types';

type Filter = DuaCategory | 'all' | 'favorites';

/**
 * Dua library module: browse collections by clicking chips (Favorites
 * plus 11 life-situation categories), search within any of them, and
 * keep a persistent favorites list. Copy works everywhere.
 * @returns The rendered module.
 */
export function DuasList(): JSX.Element {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    void getFavoriteDuaIds().then((ids) => {
      if (!cancelled) setFavorites(ids);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const base = useMemo(() => {
    if (filter === 'favorites') return DUAS.filter((d) => favorites.has(d.id));
    return getDuas(filter);
  }, [filter, favorites]);
  const visible = useMemo(() => filterDuas(base, query), [base, query]);

  /** Optimistically toggles a favorite and persists to IndexedDB. */
  function handleFavoriteToggle(duaId: string): void {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(duaId)) next.delete(duaId);
      else next.add(duaId);
      return next;
    });
    void toggleDuaFavorite(duaId);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--fg)]">
            Duas & Adhkar
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {DUAS.length} authentic supplications · Hisnul Muslim & the Quran
          </p>
        </div>
        <Badge tone="primary">{visible.length} shown</Badge>
      </div>

      <div className="relative max-w-md">
        <label htmlFor="dua-search" className="sr-only">
          Search duas
        </label>
        <svg
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="9" cy="9" r="5.5" />
          <path d="M13.5 13.5L17 17" strokeLinecap="round" />
        </svg>
        <input
          id="dua-search"
          placeholder="Search Arabic, English, source… e.g. istighfar or رزق"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={[
            'w-full h-11 rounded-lg border border-[var(--border)] bg-[var(--field)] pl-9 pr-9 text-sm text-[var(--fg)]',
            'placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]',
            'focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)] transition-colors',
          ].join(' ')}
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Collection chips: click to browse, Favorites pinned first */}
      <div
        role="group"
        aria-label="Browse duas by collection"
        className="flex gap-2 overflow-x-auto pb-1.5 lg:flex-wrap lg:overflow-visible"
      >
        <FilterChip
          label="Favorites"
          count={favorites.size}
          active={filter === 'favorites'}
          accent="amber"
          onClick={() => setFilter('favorites')}
        />
        <FilterChip
          label={DUA_CATEGORY_LABELS.all}
          count={DUAS.length}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {DUA_CATEGORY_ORDER.map((c) => (
          <FilterChip
            key={c}
            label={DUA_CATEGORY_LABELS[c]}
            count={countDuas(c)}
            active={filter === c}
            onClick={() => setFilter(c)}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <Card tone="outline" className="py-12 text-center">
          {filter === 'favorites' && favorites.size === 0 ? (
            <>
              <svg aria-hidden="true" className="mx-auto text-[var(--accent)]" width="36" height="36" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 16.5s-6.5-4.2-6.5-8.6A3.6 3.6 0 0 1 10 5.6a3.6 3.6 0 0 1 6.5 2.3c0 4.4-6.5 8.6-6.5 8.6z" strokeLinejoin="round" />
              </svg>
              <p className="mt-3 text-sm font-bold text-[var(--fg)]">No favorites yet</p>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[var(--muted)]">
                Tap the heart on any dua to keep it here — your list is saved privately on this device.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-[var(--fg)]">
                Nothing matches “{query}”{filter !== 'all' && filter !== 'favorites' ? ` in ${DUA_CATEGORY_LABELS[filter as DuaCategory]}` : ''}.
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">Try a source like “Bukhari”, a word like “forgive”, or Arabic like “ربنا”.</p>
            </>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {visible.map((dua, i) => (
            <DuaCard
              key={dua.id}
              dua={dua}
              index={i}
              favorited={favorites.has(dua.id)}
              onFavorite={() => handleFavoriteToggle(dua.id)}
              onCategoryClick={() => setFilter(dua.category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  /** Amber treatment for the Favorites chip. */
  accent?: 'amber';
}

/** Clickable collection chip with live count. */
function FilterChip({ label, count, active, onClick, accent }: FilterChipProps): JSX.Element {
  const isAmber = accent === 'amber';
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-bold whitespace-nowrap',
        'transition-all duration-150 ease-out active:scale-95',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        active
          ? isAmber
            ? 'border-transparent bg-[var(--accent)] text-[#3b2305] shadow-sm focus-visible:outline-[var(--accent)]'
            : 'border-transparent bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm focus-visible:outline-[var(--primary)]'
          : isAmber
            ? 'border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[var(--card)] text-[var(--accent-strong)] hover:border-[var(--accent)] focus-visible:outline-[var(--accent)]'
            : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--fg)] focus-visible:outline-[var(--primary)]',
      ].join(' ')}
    >
      {isAmber ? (
        <svg width="13" height="13" viewBox="0 0 20 20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M10 16.5s-6.5-4.2-6.5-8.6A3.6 3.6 0 0 1 10 5.6a3.6 3.6 0 0 1 6.5 2.3c0 4.4-6.5 8.6-6.5 8.6z" strokeLinejoin="round" />
        </svg>
      ) : null}
      {label}
      <span
        className={[
          'rounded-full px-1.5 py-0.5 text-[10px] font-extrabold tnum',
          active ? 'bg-black/15' : 'bg-[var(--hover)] text-[var(--muted)]',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  );
}

interface DuaCardProps {
  dua: Dua;
  index: number;
  favorited: boolean;
  onFavorite: () => void;
  onCategoryClick: () => void;
}

/** One dua: numbered verses, transliteration, translation, actions. */
function DuaCard({ dua, index, favorited, onFavorite, onCategoryClick }: DuaCardProps): JSX.Element {
  /** Copies the full dua text. */
  async function copy(): Promise<void> {
    const ok = await copyText(`${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n— ${dua.source}`);
    if (ok) emitToast({ title: 'Dua copied', tone: 'success' });
    else emitToast({ title: 'Copy unavailable', tone: 'warning' });
  }

  return (
    <Card
      hover
      className="flex flex-col animate-[slideUp_280ms_ease-out_both]"
      style={{ animationDelay: `${Math.min(index * 25, 320)}ms` }}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onCategoryClick}
          aria-label={`Show all ${DUA_CATEGORY_LABELS[dua.category]} duas`}
          className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
        >
          {DUA_CATEGORY_LABELS[dua.category]}
        </button>
        <div className="flex items-center gap-1">
          {(dua.repeat ?? 0) > 0 ? <Badge tone="accent">× {dua.repeat}</Badge> : null}
          <button
            type="button"
            aria-pressed={favorited}
            aria-label={favorited ? `Remove “${dua.transliteration.slice(0, 30)}” from favorites` : `Add “${dua.transliteration.slice(0, 30)}” to favorites`}
            onClick={onFavorite}
            className={[
              'inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)]',
              favorited ? 'text-[var(--accent-strong)]' : 'text-[var(--muted)] hover:text-[var(--accent-strong)] hover:bg-[var(--hover)]',
            ].join(' ')}
          >
            <span key={String(favorited)} className={favorited ? 'inline-flex animate-[pop_220ms_ease-out]' : 'inline-flex'}>
              <svg width="17" height="17" viewBox="0 0 20 20" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M10 16.5s-6.5-4.2-6.5-8.6A3.6 3.6 0 0 1 10 5.6a3.6 3.6 0 0 1 6.5 2.3c0 4.4-6.5 8.6-6.5 8.6z" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <button
            type="button"
            onClick={() => void copy()}
            aria-label="Copy dua"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="7" y="7" width="9" height="9" rx="2" />
              <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            </svg>
          </button>
        </div>
      </div>

      <p className="arabic mt-2.5 text-xl leading-[2.2] text-[var(--fg)] sm:text-[1.35rem]">{dua.arabic}</p>
      <p className="mt-2.5 text-sm font-semibold italic leading-relaxed text-[var(--primary)]">{dua.transliteration}</p>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[var(--muted)]">{dua.translation}</p>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">{dua.source}</p>
    </Card>
  );
}
