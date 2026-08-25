import { useMemo, useState } from 'react';
import {
  DUA_CATEGORY_LABELS,
  DUA_CATEGORY_ORDER,
  countDuas,
  searchDuas,
} from '../../lib/core/duas-data';
import { copyText } from '../../lib/utils/clipboard';
import { emitToast } from '../../lib/messaging';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import type { Dua, DuaCategory } from '../../types';

/**
 * Duas & adhkar library: 136 authentic supplications across 11 life
 * situations, filterable by category and searchable in any language
 * of the text. Offline by nature — the collection ships with the app.
 * @returns The rendered module.
 */
export function DuasList(): JSX.Element {
  const [category, setCategory] = useState<DuaCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const searched = searchDuas(query);
    if (category === 'all') return searched;
    return searched.filter((d) => d.category === category);
  }, [category, query]);

  /** Copies the full dua text in all three forms. */
  async function copy(dua: Dua): Promise<void> {
    const ok = await copyText(`${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}`);
    emitToast(ok ? { title: 'Dua copied', tone: 'success' } : { title: 'Copy unavailable', tone: 'warning' });
  }

  /** Renders one dua card. */
  function DuaCard({ dua, index }: { dua: Dua; index: number }): JSX.Element {
    return (
      <Card
        hover
        className="flex flex-col animate-[slideUp_280ms_ease-out_both]"
        style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
      >
        <p className="arabic text-xl text-[var(--fg)] sm:text-[1.35rem]">{dua.arabic}</p>
        <p className="mt-3 text-sm font-semibold italic text-[var(--primary)]">{dua.transliteration}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)] flex-1">{dua.translation}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            <Badge tone="primary">{DUA_CATEGORY_LABELS[dua.category]}</Badge>
            {dua.repeat ? <Badge tone="accent">× {dua.repeat}</Badge> : null}
            <Badge tone="neutral">{dua.source}</Badge>
          </div>
          <button
            type="button"
            onClick={() => void copy(dua)}
            aria-label={`Copy dua: ${dua.transliteration}`}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-[var(--muted)] transition-colors hover:bg-[var(--hover)] hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="7" y="7" width="9" height="9" rx="2" />
              <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            </svg>
            Copy
          </button>
        </div>
      </Card>
    );
  }

  /** Category button used in the rail and the mobile strip. */
  function CategoryButton({ id }: { id: DuaCategory | 'all' }): JSX.Element {
    const active = category === id;
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => setCategory(id)}
        className={[
          'flex items-center justify-between gap-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
          'w-full shrink-0 px-3 py-2.5',
          active
            ? 'bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm'
            : 'bg-[var(--field)] border border-[var(--border)] text-[var(--fg)] hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))]',
        ].join(' ')}
      >
        <span className="truncate">{DUA_CATEGORY_LABELS[id]}</span>
        <span
          className={[
            'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold tnum',
            active ? 'bg-[var(--primary-fg)] text-[var(--primary)]' : 'bg-[var(--hover)] text-[var(--muted)]',
          ].join(' ')}
        >
          {countDuas(id)}
        </span>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr] lg:items-start">
        <aside className="min-w-0 lg:sticky lg:top-20">
          <div className="mb-2.5">
            <Input
              label={`Search ${countDuas('all')} authentic duas`}
              id="duas-search"
              placeholder="e.g. istighfar, رزق, patience…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:space-y-1.5">
            <CategoryButton id="all" />
            {DUA_CATEGORY_ORDER.map((id) => (
              <CategoryButton key={id} id={id} />
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
              {DUA_CATEGORY_LABELS[category]}
            </p>
            <Badge tone="neutral">{results.length} dua{results.length === 1 ? '' : 's'}</Badge>
          </div>

          {results.length === 0 ? (
            <Card tone="outline" className="py-12 text-center">
              <p className="text-sm font-semibold text-[var(--fg)]">Nothing matches “{query}”.</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Try a word like “mercy”, “rizq” or an Arabic phrase.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {results.map((dua, i) => (
                <DuaCard key={dua.id} dua={dua} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[var(--muted)]">
        Collected from the Quran and the authentic Sunnah (Bukhari, Muslim, Abu Dawud, Tirmidhi and
        others) following Al-Adhkar and Hisnul Muslim. Recite what you can — constancy beats quantity.
      </p>
    </div>
  );
}
