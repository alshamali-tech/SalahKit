import { useMemo, useState } from 'react';
import { DIVINE_NAMES, searchDivineNames } from '../../lib/core/names-data';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

/**
 * Asma ul-Husna module: all 99 Names with meanings and live search.
 * @returns The rendered module.
 */
export function NamesList(): JSX.Element {
  const [query, setQuery] = useState('');
  const names = useMemo(() => searchDivineNames(query), [query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-full sm:w-72">
          <Input
            label="Search the 99 Names"
            id="names-search"
            placeholder="e.g. Merciful, Al-Karim…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Badge tone="primary">{names.length} of {DIVINE_NAMES.length}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {names.map((name) => (
          <Card key={name.n} hover className="flex items-start gap-3">
            <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-sm font-extrabold text-[var(--primary)] tnum">
              {name.n}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-extrabold text-[var(--fg)] truncate">{name.transliteration}</p>
                <p className="arabic text-lg text-[var(--primary)] shrink-0 leading-7">{name.arabic}</p>
              </div>
              <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed">{name.meaning}</p>
            </div>
          </Card>
        ))}
      </div>

      {names.length === 0 ? (
        <Card tone="outline" className="text-center py-10">
          <p className="text-sm font-semibold text-[var(--fg)]">No names match “{query}”.</p>
          <p className="text-xs text-[var(--muted)] mt-1">Try a transliteration like “Rahman” or a meaning like “Merciful”.</p>
        </Card>
      ) : null}
    </div>
  );
}
