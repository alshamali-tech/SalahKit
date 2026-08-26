import { useEffect, useMemo, useState } from 'react';
import {
  countHadiths,
  filterHadiths,
  hadithOfTheDay,
  HADITH_BOOK_LABELS,
  HADITH_CATEGORY_LABELS,
  HADITH_CATEGORY_ORDER,
  searchHadiths,
} from '../../lib/core/hadith-data';
import { getFavoriteHadithIds, toggleHadithFavorite } from '../../lib/db/db';
import { copyText } from '../../lib/utils/clipboard';
import { emitToast } from '../../lib/messaging';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { HadithLibraryFull } from './HadithLibraryFull';
import type { Hadith, HadithBook, HadithCategory } from '../../types';

type CategoryFilter = HadithCategory | 'all' | 'favorites';

/**
 * Horizontal filigree divider with a central eight-point star.
 * @param props - className passthrough.
 * @returns The ornamental SVG.
 */
function Ornament({ className = '' }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 240 24" className={className} aria-hidden="true" fill="none">
      <path d="M8 12h86" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M146 12h86" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M96 12l6-6 6 6-6 6z" fill="currentColor" opacity="0.7" />
      <path d="M132 12l6-6 6 6-6 6z" fill="currentColor" opacity="0.7" />
      <path d="M120 3l2.3 6.7L129 12l-6.7 2.3L120 21l-2.3-6.7L111 12l6.7-2.3z" fill="currentColor" />
    </svg>
  );
}

/**
 * Manuscript corner flourish used on the featured folio.
 * @param props - className passthrough.
 * @returns The corner SVG.
 */
function CornerFlourish({ className = '' }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" fill="none">
      <path
        d="M4 56V22C4 12 12 4 22 4h34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M4 56V38M22 4h18" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="22" cy="22" r="3" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/**
 * Small pill showing which canonical collections record a hadith.
 * @param props - the hadith.
 * @returns Book pill badges.
 */
function BookPills({ hadith }: { hadith: Hadith }): JSX.Element {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {hadith.books.map((b) => (
        <span
          key={b}
          className={[
            'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            b === 'bukhari'
              ? 'border-[color-mix(in_srgb,var(--primary)_40%,transparent)] text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
              : 'border-[color-mix(in_srgb,var(--accent)_45%,transparent)] text-[var(--accent-strong)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]',
          ].join(' ')}
        >
          {b === 'bukhari' ? 'Bukhari' : 'Muslim'}
        </span>
      ))}
      <span className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--success)_40%,transparent)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--success)]">
        Sahih
      </span>
    </span>
  );
}

/**
 * A single hadith folio card.
 * @param props - hadith, favorite state and handlers.
 * @returns The rendered card.
 */
function HadithCard({
  hadith,
  isFavorite,
  onFavorite,
  onCopy,
}: {
  hadith: Hadith;
  isFavorite: boolean;
  onFavorite: () => void;
  onCopy: () => void;
}): JSX.Element {
  return (
    <Card hover className="group flex flex-col gap-3 relative overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary)]">
          {HADITH_CATEGORY_LABELS[hadith.category]}
        </span>
        <BookPills hadith={hadith} />
      </div>

      <p className="arabic text-lg sm:text-xl text-[var(--fg)] leading-[2.1]">{hadith.arabic}</p>

      <Ornament className="h-4 w-40 text-[var(--accent)]" />

      <p className="text-sm leading-relaxed text-[var(--muted)] flex-1">{hadith.translation}</p>

      <div className="mt-1 flex items-end justify-between gap-2 border-t border-[var(--border)] pt-3">
        <div className="min-w-0">
          <p className="text-xs text-[var(--fg)] font-semibold truncate">
            Narrated by {hadith.narrator}
          </p>
          <p className="text-[11px] text-[var(--muted)] tnum">{hadith.source}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy hadith"
            title="Copy"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] opacity-60 transition-all hover:bg-[var(--hover)] hover:text-[var(--primary)] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="7" y="7" width="9" height="9" rx="2" />
              <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            title="Favorite"
            className={[
              'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-[var(--accent)]',
              isFavorite
                ? 'text-[var(--accent-strong)]'
                : 'text-[var(--muted)] opacity-60 hover:bg-[var(--hover)] hover:text-[var(--accent-strong)] hover:opacity-100',
            ].join(' ')}
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Hadith library from the two Sahih collections. Opens on a featured
 * "hadith of the day" folio, with collection/category/search filters
 * and a persistent favorites list.
 * @returns The rendered module.
 */
export function HadithList(): JSX.Element {
  const [book, setBook] = useState<HadithBook | 'all'>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getFavoriteHadithIds().then((ids) => {
      if (!cancelled) {
        setFavorites(ids);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = useMemo(() => hadithOfTheDay(), []);

  const visible = useMemo(() => {
    let list: readonly Hadith[] =
      query.trim() !== '' ? searchHadiths(query, book) : filterHadiths(book, category === 'favorites' ? 'all' : category);
    if (category === 'favorites') {
      list = list.filter((h) => favorites.has(h.id));
    }
    return list;
  }, [book, category, query, favorites]);

  /** Toggles a favorite with an optimistic local update. */
  async function toggleFavorite(hadithId: string): Promise<void> {
    const isFav = await toggleHadithFavorite(hadithId);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (isFav) next.add(hadithId);
      else next.delete(hadithId);
      return next;
    });
    emitToast({
      title: isFav ? 'Added to favorites' : 'Removed from favorites',
      tone: isFav ? 'success' : 'info',
    });
  }

  /** Copies a hadith's full text with attribution. */
  async function copy(hadith: Hadith): Promise<void> {
    const ok = await copyText(
      `${hadith.arabic}\n\n${hadith.translation}\n\n— Narrated by ${hadith.narrator}, ${hadith.source}`
    );
    emitToast(
      ok
        ? { title: 'Hadith copied', tone: 'success' }
        : { title: 'Copy unavailable', body: 'Your browser blocked clipboard access.', tone: 'warning' }
    );
  }

  const books: readonly (HadithBook | 'all')[] = ['all', 'bukhari', 'muslim'];

  return (
    <div className="space-y-5">
      {/* Featured hadith of the day — manuscript folio */}
      <Card tone="raised" className="relative overflow-hidden">
        <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <CornerFlourish className="absolute left-2 top-2 h-12 w-12 text-[var(--accent)]" />
        <CornerFlourish className="absolute right-2 top-2 h-12 w-12 rotate-90 text-[var(--accent)]" />
        <CornerFlourish className="absolute bottom-2 right-2 h-12 w-12 rotate-180 text-[var(--accent)]" />
        <CornerFlourish className="absolute bottom-2 left-2 h-12 w-12 -rotate-90 text-[var(--accent)]" />

        <div className="relative flex flex-col items-center gap-4 px-4 py-8 text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent-strong)]">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 2l2.3 5.7L18 10l-5.7 2.3L10 18l-2.3-5.7L2 10l5.7-2.3z" />
            </svg>
            Hadith of the Day
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 2l2.3 5.7L18 10l-5.7 2.3L10 18l-2.3-5.7L2 10l5.7-2.3z" />
            </svg>
          </span>

          <p className="arabic max-w-3xl text-xl sm:text-2xl text-[var(--fg)] leading-[2.15]">
            {featured.arabic}
          </p>

          <Ornament className="h-5 w-56 text-[var(--accent)]" />

          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--muted)]">
            {featured.translation}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge tone="primary">{featured.narrator}</Badge>
            <Badge tone="neutral">{featured.source}</Badge>
            <BookPills hadith={featured} />
          </div>
        </div>
      </Card>

      {/* Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex shrink-0 rounded-lg border border-[var(--border)] overflow-hidden">
            {books.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={book === b}
                onClick={() => setBook(b)}
                className={[
                  'h-10 px-3.5 text-xs font-bold transition-colors duration-150 whitespace-nowrap',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)]',
                  book === b
                    ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                    : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]',
                ].join(' ')}
              >
                {HADITH_BOOK_LABELS[b]}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-0">
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
              <circle cx="9" cy="9" r="6" />
              <path d="M13.5 13.5L17 17" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              aria-label="Search hadiths"
              placeholder="Search hadiths, narrators, topics…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={[
                'w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--field)] pl-9 pr-3 text-sm text-[var(--fg)]',
                'placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]',
                'focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)] transition-colors',
              ].join(' ')}
            />
          </div>

          <Badge tone="neutral" className="shrink-0">{visible.length} hadith{visible.length === 1 ? '' : 's'}</Badge>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-pressed={category === 'favorites'}
            onClick={() => setCategory(category === 'favorites' ? 'all' : 'favorites')}
            className={[
              'h-9 px-3 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]',
              category === 'favorites'
                ? 'bg-[var(--accent)] text-[#3b2305] shadow-sm'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--accent-strong)] hover:border-[var(--accent)]',
            ].join(' ')}
          >
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z" />
            </svg>
            Favorites
            {loaded && favorites.size > 0 ? <span className="tnum">({favorites.size})</span> : null}
          </button>

          <button
            type="button"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
            className={[
              'h-9 px-3 rounded-lg text-xs font-bold transition-all duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
              category === 'all'
                ? 'bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--primary)]',
            ].join(' ')}
          >
            All <span className="tnum opacity-70">({countHadiths('all', book)})</span>
          </button>

          {HADITH_CATEGORY_ORDER.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(category === c ? 'all' : c)}
              className={[
                'h-9 px-3 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap',
                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                category === c
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm'
                  : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--primary)]',
              ].join(' ')}
            >
              {HADITH_CATEGORY_LABELS[c]} <span className="tnum opacity-70">({countHadiths(c, book)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hadith grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {visible.map((h) => (
            <HadithCard
              key={h.id}
              hadith={h}
              isFavorite={favorites.has(h.id)}
              onFavorite={() => void toggleFavorite(h.id)}
              onCopy={() => void copy(h)}
            />
          ))}
        </div>
      ) : (
        <Card tone="outline" className="py-12 text-center">
          {category === 'favorites' ? (
            <>
              <svg width="32" height="32" viewBox="0 0 20 20" fill="none" stroke="var(--muted)" strokeWidth="1.4" className="mx-auto mb-3" aria-hidden="true">
                <path d="M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-semibold text-[var(--fg)]">No favorites yet</p>
              <p className="text-xs text-[var(--muted)] mt-1">Tap the heart on any hadith to keep it here.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[var(--fg)]">No hadiths match your search</p>
              <p className="text-xs text-[var(--muted)] mt-1">Try a different word, narrator, or topic.</p>
            </>
          )}
        </Card>
      )}

      <HadithLibraryFull favorites={favorites} onToggle={(id) => void toggleFavorite(id)} />

      <p className="text-xs text-[var(--muted)] text-center pt-2">
        Curated gems above; the complete collections stream below. Reference numbers follow
        standard editions of Sahih al-Bukhari and Sahih Muslim.
      </p>
    </div>
  );
}
