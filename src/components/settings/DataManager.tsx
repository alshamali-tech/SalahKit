import { useEffect, useState } from 'react';
import { getDb } from '../../lib/db/db';
import { clearAllData } from '../../lib/db/clear';
import { emitError, emitSuccess } from '../../lib/messaging';
import { formatNumber } from '../../lib/utils/format';
import { ExportImport } from '../app/ExportImport';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/**
 * Settings data manager (S9): storage stats, export/import and a
 * two-step destructive wipe (no native dialogs).
 * @returns The rendered card.
 */
export function DataManager(): JSX.Element {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const db = getDb();
        const rows: Record<string, number> = {
          prayerLog: await db.prayerLog.count(),
          tasbih: await db.tasbih.count(),
          zakatRecords: await db.zakatRecords.count(),
          hifzProgress: await db.hifzProgress.count(),
          duaFavorites: await db.duaFavorites.count(),
          hadithFavorites: await db.hadithFavorites.count(),
          extCache: await db.extCache.count(),
        };
        if (!cancelled) setCounts(rows);
      } catch {
        // IndexedDB unavailable: stats hidden.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Wipes IndexedDB + browser storage after explicit confirmation. */
  async function wipe(): Promise<void> {
    try {
      await clearAllData();
      setConfirming(false);
      setCounts(null);
      emitSuccess('All data wiped', 'SalahKit is back to a fresh state.');
      window.setTimeout(() => window.location.reload(), 1400);
    } catch {
      emitError('Wipe failed', 'Your browser blocked the deletion. Try again.');
    }
  }

  return (
    <Card>
      <h3 className="text-sm font-extrabold text-[var(--fg)]">Your data</h3>
      {counts ? (
        <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(counts).map(([table, count]) => (
            <div key={table} className="rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 py-2">
              <dt className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] truncate">{table}</dt>
              <dd className="text-lg font-extrabold tnum text-[var(--fg)]">{formatNumber(count)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-2 text-xs text-[var(--muted)]">Storage stats unavailable in this browser.</p>
      )}

      <div className="mt-4">
        <ExportImport />
      </div>

      <div className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--danger)_35%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_6%,transparent)] p-3">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold text-[var(--danger)] min-w-0 flex-1">
              Delete all logs, counts, records and settings? This cannot be undone.
            </p>
            <Button variant="danger" size="sm" onClick={() => void wipe()}>Yes, delete</Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[var(--muted)]">Danger zone: erase everything SalahKit stores.</p>
            <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>Clear all data</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
