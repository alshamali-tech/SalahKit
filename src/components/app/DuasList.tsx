import { useMemo, useState } from 'react';
import { DUA_CATEGORY_LABELS, getDuas } from '../../lib/core/duas-data';
import { copyText } from '../../lib/utils/clipboard';
import { emitToast } from '../../lib/messaging';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import type { DuaCategory } from '../../types';

const CATEGORIES: readonly (DuaCategory | 'all')[] = ['all', 'morning', 'evening', 'salah', 'daily', 'sleep'];

/**
 * Daily duas & adhkar module: filterable collection with Arabic,
 * transliteration, translation, source and copy action.
 * @returns The rendered module.
 */
export function DuasList(): JSX.Element {
  const [category, setCategory] = useState<DuaCategory | 'all'>('all');
  const duas = useMemo(() => getDuas(category), [category]);

  /** Copies the full dua text. */
  async function copy(arabic: string, transliteration: string, translation: string): Promise<void> {
    const ok = await copyText(`${arabic}\n\n${transliteration}\n\n${translation}`);
    if (ok) {
      emitToast({ title: 'Dua copied', tone: 'success' });
    } else {
      emitToast({ title: 'Copy unavailable', body: 'Select the text manually to copy it.', tone: 'warning' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          label="Dua categories"
          tabs={CATEGORIES.map((c) => ({ id: c, label: DUA_CATEGORY_LABELS[c] }))}
          active={category}
          onChange={(id) => setCategory(id as DuaCategory | 'all')}
        />
        <Badge tone="neutral">{duas.length} adhkar</Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {duas.map((dua) => (
          <Card key={dua.id} hover className="flex flex-col">
            <p className="arabic text-xl sm:text-[1.35rem] text-[var(--fg)]">{dua.arabic}</p>
            <p className="mt-3 text-sm font-semibold italic text-[var(--primary)]">{dua.transliteration}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)] flex-1">{dua.translation}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="primary">{DUA_CATEGORY_LABELS[dua.category]}</Badge>
                {dua.repeat ? <Badge tone="accent">× {dua.repeat}</Badge> : null}
                <Badge tone="neutral">{dua.source}</Badge>
              </div>
              <button
                type="button"
                onClick={() => void copy(dua.arabic, dua.transliteration, dua.translation)}
                aria-label="Copy dua"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="7" y="7" width="9" height="9" rx="2" />
                  <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                </svg>
                Copy
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
