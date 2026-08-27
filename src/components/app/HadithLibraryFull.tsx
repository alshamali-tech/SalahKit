import { useEffect, useMemo, useState } from 'react';
import {
  fetchHadithSection,
  HADITH_COLLECTIONS,
} from '../../lib/external/hadith-api';
import type {
  HadithCollection,
  HadithSectionMeta,
  RemoteHadith,
} from '../../lib/external/hadith-api';
import { useApp } from '../../store';
import { copyText } from '../../lib/utils/clipboard';
import { emitToast } from '../../lib/messaging';
import { listHadithFavorites } from '../../lib/db/db';
import type { HadithFavoriteRow } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface HadithLibraryFullProps {
  /** Currently favorited hadith ids (shared with the curated list). */
  favorites: Set<string>;
  /** Toggle handler; snapshot stored so favorites render offline. */
  onToggle: (id: string, snapshot?: FavoriteSnapshot) => void;
}

/** The text kept alongside a favorite so it renders without a fetch. */
export interface FavoriteSnapshot {
  arabic: string;
  english: string;
  collection: string;
  num: number;
  grade: string;
}

/** Builds a snapshot from a streamed hadith. */
function snapshotOf(h: RemoteHadith, collection: HadithCollection): FavoriteSnapshot {
  return {
    arabic: h.arabic,
    english: h.english,
    collection: collection.name,
    num: h.num,
    grade: h.grade,
  };
}

/** A copy button for a hadith's text. */
function CopyButton({ text, label }: { text: string; label: string }): JSX.Element {
  /** Copies the text. */
  async function copy(): Promise<void> {
    const ok = await copyText(text);
    emitToast(
      ok
        ? { title: 'Hadith copied', tone: 'success' }
        : { title: 'Copy unavailable', tone: 'warning' }
    );
  }
  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
    >
      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="7" y="7" width="9" height="9" rx="2" />
        <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      </svg>
    </button>
  );
}

/** A heart toggle button. */
function HeartButton({ isFavorite, onFavorite }: { isFavorite: boolean; onFavorite: () => void }): JSX.Element {
  return (
    <button
      type="button"
      onClick={onFavorite}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={[
        'inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all active:scale-90',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
        isFavorite ? 'text-[var(--danger)]' : 'text-[var(--muted)] hover:text-[var(--danger)]',
      ].join(' ')}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** One streamed hadith card. */
function StreamedCard({
  hadith,
  collection,
  isFavorite,
  onFavorite,
}: {
  hadith: RemoteHadith;
  collection: HadithCollection;
  isFavorite: boolean;
  onFavorite: () => void;
}): JSX.Element {
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)] tnum">
          № {hadith.num}
        </span>
        <span className="flex items-center gap-1">
          {hadith.grade ? <Badge tone="success">{hadith.grade}</Badge> : null}
          <HeartButton isFavorite={isFavorite} onFavorite={onFavorite} />
          <CopyButton
            label="Copy hadith"
            text={`${hadith.arabic}\n\n${hadith.english}\n\n— ${collection.name} ${hadith.num}${hadith.grade ? ` (${hadith.grade})` : ''}`}
          />
        </span>
      </div>
      <p className="arabic mt-2.5 text-xl leading-[2.1] text-[var(--fg)] text-right">{hadith.arabic}</p>
      {hadith.english ? (
        <p className="mt-2.5 border-t border-[var(--border)] pt-2.5 text-sm leading-relaxed text-[var(--muted)]">
          {hadith.english}
        </p>
      ) : null}
    </Card>
  );
}

/** A favorite rendered from its stored snapshot (works offline). */
function FavoriteCard({
  fav,
  isFavorite,
  onFavorite,
}: {
  fav: HadithFavoriteRow;
  isFavorite: boolean;
  onFavorite: () => void;
}): JSX.Element {
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent-strong)] tnum truncate">
          {fav.collection} {fav.num ?? ''}
        </span>
        <span className="flex items-center gap-1">
          {fav.grade ? <Badge tone="success">{fav.grade}</Badge> : null}
          <HeartButton isFavorite={isFavorite} onFavorite={onFavorite} />
          <CopyButton
            label="Copy hadith"
            text={`${fav.arabic ?? ''}\n\n${fav.english ?? ''}\n\n— ${fav.collection ?? ''} ${fav.num ?? ''}${fav.grade ? ` (${fav.grade})` : ''}`}
          />
        </span>
      </div>
      {fav.arabic ? (
        <p className="arabic mt-2.5 text-xl leading-[2.1] text-[var(--fg)] text-right">{fav.arabic}</p>
      ) : null}
      {fav.english ? (
        <p className="mt-2.5 border-t border-[var(--border)] pt-2.5 text-sm leading-relaxed text-[var(--muted)]">
          {fav.english}
        </p>
      ) : null}
    </Card>
  );
}

/**
 * The full Sahihayn, streamed section by section from the free
 * fawazahmed0/hadith-api CDN — nothing is bundled, everything opened
 * is cached 30 days for offline re-reading. Includes a favorites
 * browser backed by stored text snapshots.
 * @param props - shared favorites state.
 * @returns The rendered full-library browser.
 */
export function HadithLibraryFull({ favorites, onToggle }: HadithLibraryFullProps): JSX.Element {
  const online = useApp((s) => s.online);
  const [collId, setCollId] = useState<'bukhari' | 'muslim'>('bukhari');
  const [titles, setTitles] = useState<Record<string, HadithSectionMeta>>({});
  const [showFavorites, setShowFavorites] = useState(false);
  const [storedFavs, setStoredFavs] = useState<HadithFavoriteRow[]>([]);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [sectionData, setSectionData] = useState<{ meta: HadithSectionMeta; hadiths: RemoteHadith[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [missed, setMissed] = useState(false);

  const coll = useMemo(
    () => HADITH_COLLECTIONS.find((c) => c.id === collId) ?? HADITH_COLLECTIONS[0],
    [collId]
  );
  const sectionNumbers = useMemo(
    () => Array.from({ length: coll.sections }, (_, i) => i + 1),
    [coll]
  );

  // Load stored favorites whenever the favorites set changes.
  useEffect(() => {
    let cancelled = false;
    void listHadithFavorites().then((rows) => {
      if (!cancelled) setStoredFavs(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [favorites]);

  // Stream section titles in the background, in small batches.
  useEffect(() => {
    let cancelled = false;
    setTitles({});
    setOpenSection(null);
    setSectionData(null);
    setMissed(false);
    void (async () => {
      for (let i = 0; i < coll.sections; i += 4) {
        if (cancelled) return;
        const batch = sectionNumbers.slice(i, i + 4);
        const results = await Promise.all(batch.map((n) => fetchHadithSection(coll, n)));
        if (cancelled) return;
        setTitles((prev) => {
          const next = { ...prev };
          results.forEach((r) => {
            if (r) next[`${coll.id}-${r.meta.section}`] = r.meta;
          });
          return next;
        });
        results.forEach((r) => {
          if (!r) setMissed(true);
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [coll, sectionNumbers]);

  /** Opens one section, fetching (or reading cache) on demand. */
  async function open(n: number): Promise<void> {
    setShowFavorites(false);
    setOpenSection(n);
    setLoading(true);
    setSectionData(null);
    const result = await fetchHadithSection(coll, n);
    setLoading(false);
    setSectionData(result);
    if (!result && !online) {
      emitToast({
        title: 'Offline',
        body: 'This section isn’t cached yet — open it once while online and it stays available.',
        tone: 'warning',
      });
    }
  }

  /** Shows the favorites browser. */
  function openFavorites(): void {
    setOpenSection(null);
    setSectionData(null);
    setShowFavorites(true);
  }

  return (
    <section aria-label="Full hadith library" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold tracking-tight text-[var(--fg)]">
            The full Sahihayn <span className="arabic text-base text-[var(--muted)]">الصحيحان كاملين</span>
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Streamed from the free hadith-api CDN — open a section once and it’s yours offline.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={showFavorites}
            onClick={openFavorites}
            className={[
              'inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-all',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]',
              showFavorites
                ? 'bg-[var(--accent)] border-transparent text-[#3b2305] shadow-sm'
                : 'bg-[var(--card)] border-[var(--border)] text-[var(--accent-strong)] hover:border-[var(--accent)]',
            ].join(' ')}
          >
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z" />
            </svg>
            My favorites
            {storedFavs.length > 0 ? <span className="tnum">({storedFavs.length})</span> : null}
          </button>
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            {HADITH_COLLECTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === collId}
                onClick={() => setCollId(c.id)}
                className={[
                  'h-10 px-3.5 text-xs font-bold transition-colors',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)]',
                  c.id === collId
                    ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                    : 'bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)]',
                ].join(' ')}
              >
                {c.name} <span className="arabic text-sm">{c.nameAr}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showFavorites ? (
        storedFavs.length === 0 ? (
          <Card tone="outline" className="py-12 text-center">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none" stroke="var(--muted)" strokeWidth="1.4" className="mx-auto mb-3" aria-hidden="true">
              <path d="M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z" strokeLinejoin="round" />
            </svg>
            <p className="text-sm font-semibold text-[var(--fg)]">No favorites yet</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Tap the heart on any hadith — it is saved with its text, so it stays here even offline.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <Button variant="ghost" size="sm" onClick={() => setShowFavorites(false)}>
              ← All sections
            </Button>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {storedFavs.map((fav) => (
                <FavoriteCard
                  key={fav.hadithId}
                  fav={fav}
                  isFavorite={favorites.has(fav.hadithId)}
                  onFavorite={() => onToggle(fav.hadithId)}
                />
              ))}
            </div>
          </div>
        )
      ) : openSection === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {sectionNumbers.map((n) => {
            const meta = titles[`${coll.id}-${n}`];
            return (
              <button
                key={n}
                type="button"
                onClick={() => void open(n)}
                className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-sm font-extrabold text-[var(--primary)] tnum">
                  {n}
                </span>
                <span className="min-w-0 flex-1">
                  {meta ? (
                    <>
                      <span className="arabic block truncate text-sm font-bold text-[var(--fg)]">{meta.titleAr}</span>
                      <span className="block truncate text-[11px] text-[var(--muted)]">{meta.title}</span>
                    </>
                  ) : (
                    <span className="block h-4 w-2/3 animate-pulse rounded bg-[var(--hover)]" aria-hidden="true" />
                  )}
                </span>
                {meta && meta.last > 0 ? (
                  <span className="shrink-0 text-[10px] font-bold text-[var(--muted)] tnum">
                    {meta.first}–{meta.last}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpenSection(null)}>
              ← All sections
            </Button>
            {sectionData ? (
              <Badge tone="primary">
                {sectionData.meta.titleAr} · {sectionData.hadiths.length} hadiths
              </Badge>
            ) : null}
          </div>
          {sectionData?.meta ? (
            <p className="text-sm font-bold text-[var(--fg)]">
              {sectionData.meta.titleAr} <span className="font-normal text-[var(--muted)]">— {sectionData.meta.title}</span>
            </p>
          ) : null}
          {loading ? (
            <div className="flex items-center justify-center py-16" role="status" aria-label="Loading section">
              <span className="h-8 w-8 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)] animate-spin" />
            </div>
          ) : sectionData ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {sectionData.hadiths.map((h) => (
                <StreamedCard
                  key={h.id}
                  hadith={h}
                  collection={coll}
                  isFavorite={favorites.has(h.id)}
                  onFavorite={() => onToggle(h.id, snapshotOf(h, coll))}
                />
              ))}
            </div>
          ) : (
            <Card tone="outline" className="py-12 text-center">
              <p className="text-sm font-semibold text-[var(--fg)]">Couldn’t load this section</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {online ? 'Try again in a moment.' : 'Connect once, open it, and it stays cached for offline reading.'}
              </p>
            </Card>
          )}
        </div>
      )}

      <p className="text-[11px] text-[var(--muted)] text-center">
        Text via the free, keyless fawazahmed0/hadith-api — cached privately in your browser for 30 days.
      </p>
    </section>
  );
}
