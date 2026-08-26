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
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface HadithLibraryFullProps {
  /** Currently favorited hadith ids (shared with the curated list). */
  favorites: Set<string>;
  /** Toggle handler (optimistic; parent owns state). */
  onToggle: (id: string) => void;
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
  /** Copies arabic + english with attribution. */
  async function copy(): Promise<void> {
    const ok = await copyText(
      `${hadith.arabic}\n\n${hadith.english}\n\n— ${collection.name} ${hadith.num}${hadith.grade ? ` (${hadith.grade})` : ''}`
    );
    emitToast(
      ok
        ? { title: 'Hadith copied', tone: 'success' }
        : { title: 'Copy unavailable', tone: 'warning' }
    );
  }

  return (
    <Card hover className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)] tnum">
          № {hadith.num}
        </span>
        <span className="flex items-center gap-1">
          {hadith.grade ? <Badge tone="success">{hadith.grade}</Badge> : null}
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
          <button
            type="button"
            onClick={() => void copy()}
            aria-label="Copy hadith"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="7" y="7" width="9" height="9" rx="2" />
              <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            </svg>
          </button>
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

/**
 * The full Sahihayn, streamed section by section from the free
 * fawazahmed0/hadith-api CDN — nothing is bundled, everything opened
 * is cached 30 days for offline re-reading.
 * @param props - shared favorites state.
 * @returns The rendered full-library browser.
 */
export function HadithLibraryFull({ favorites, onToggle }: HadithLibraryFullProps): JSX.Element {
  const online = useApp((s) => s.online);
  const [collId, setCollId] = useState<'bukhari' | 'muslim'>('bukhari');
  const [titles, setTitles] = useState<Record<string, HadithSectionMeta>>({});
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

      {!online && missed ? (
        <Card tone="outline" className="py-3">
          <p className="text-xs text-[var(--muted)]">
            You’re offline — showing sections cached from earlier visits. Untitled sections haven’t been opened yet on this device.
          </p>
        </Card>
      ) : null}

      {openSection === null ? (
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
                      <span className="block truncate text-sm font-bold text-[var(--fg)]">{meta.title}</span>
                      <span className="arabic block truncate text-xs text-[var(--muted)]">{meta.titleAr}</span>
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
                {sectionData.meta.title} · {sectionData.hadiths.length} hadiths
              </Badge>
            ) : null}
          </div>
          {sectionData?.meta.titleAr ? (
            <p className="arabic text-xl text-[var(--fg)] text-right">{sectionData.meta.titleAr}</p>
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
                  onFavorite={() => onToggle(h.id)}
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
