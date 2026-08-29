import { useEffect, useState } from 'react';
import { exportBackup } from '../../lib/db/backup';
import { getDb } from '../../lib/db/db';
import { en } from '../../lib/i18n/locales/en';
import { useT } from '../../lib/use-locale';
import { emitSuccess, emitError } from '../../lib/messaging';
import {
  ensurePersistentStorage,
  getLastBackupAt,
  getVisitGapDays,
  isQuotaError,
  markBackedUp,
  storageSnapshot,
} from '../../lib/utils/capabilities';
import type { StorageSnapshot } from '../../lib/utils/capabilities';
import { formatShortDate } from '../../lib/utils/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/** Formats bytes as a short human-readable size. */
function fmtBytes(n: number | null): string {
  if (n === null) return '—';
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Storage-survival triad card (P0): live usage meter + persisted
 * status + last-backup date with one-tap export, plus calm notices
 * for ephemeral contexts, long absences (iOS ~7-day risk) and
 * tracked-but-never-backed-up data.
 * @returns The rendered card.
 */
export function StorageHealth(): JSX.Element {
  const { locale } = useT();
  const s = locale.dict.storage ?? en.storage!;
  const [snap, setSnap] = useState<StorageSnapshot | null>(null);
  const [tracked, setTracked] = useState(0);
  const [lastBackup, setLastBackup] = useState<string | null>(getLastBackupAt());
  const [busy, setBusy] = useState(false);
  const gap = getVisitGapDays();

  useEffect(() => {
    let cancelled = false;
    void storageSnapshot().then((v) => {
      if (!cancelled) setSnap(v);
    });
    void getDb()
      .prayerLog.count()
      .then((c) => {
        if (!cancelled) setTracked(c);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  /** Downloads a fresh backup and records the moment. */
  async function backupNow(): Promise<void> {
    setBusy(true);
    try {
      const json = await exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `salahkit-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      markBackedUp();
      setLastBackup(new Date().toISOString());
      emitSuccess(s.backupDone);
    } catch (err) {
      emitError(isQuotaError(err) ? s.quotaTitle : 'Export failed', isQuotaError(err) ? s.quotaBody : undefined);
    } finally {
      setBusy(false);
    }
  }

  /** Requests persistent storage and reflects the result. */
  async function persist(): Promise<void> {
    const ok = await ensurePersistentStorage();
    setSnap((prev) => (prev ? { ...prev, persisted: ok || prev.persisted } : prev));
    emitSuccess(s.persistedDone);
  }

  const pct =
    snap?.usage !== null && snap?.quota && snap.usage !== null
      ? Math.min(100, Math.max(2, (snap.usage / snap.quota) * 100))
      : null;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[var(--fg)]">{s.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)] max-w-md">{s.subtitle}</p>
        </div>
        {snap ? (
          <Badge tone={snap.persisted ? 'success' : 'warning'}>
            {snap.persisted ? s.persisted : s.bestEffort}
          </Badge>
        ) : null}
      </div>

      {/* Usage meter */}
      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--field)] p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{s.usage}</span>
          <span className="text-xs font-bold tnum text-[var(--fg)]">
            {fmtBytes(snap?.usage ?? null)}{' '}
            <span className="text-[var(--muted)]">
              {s.ofQuota} · {fmtBytes(snap?.quota ?? null)}
            </span>
          </span>
        </div>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--hover)]"
          role="progressbar"
          aria-label={s.usage}
          aria-valuenow={pct !== null ? Math.round(pct) : 0}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-700 ease-out"
            style={{ width: `${pct ?? 2}%` }}
          />
        </div>
        {snap && snap.persisted === false ? (
          <Button variant="outline" size="sm" className="mt-3" onClick={() => void persist()}>
            {s.makePersistent}
          </Button>
        ) : null}
      </div>

      {/* Backup row */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--field)] p-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{s.lastBackup}</p>
          <p className="text-sm font-bold text-[var(--fg)]">
            {lastBackup ? formatShortDate(new Date(lastBackup)) : s.neverBackedUp}
          </p>
        </div>
        <Button variant="amber" size="sm" onClick={() => void backupNow()} disabled={busy}>
          {busy ? '…' : s.exportNow}
        </Button>
      </div>

      {/* Calm notices */}
      <div className="mt-3 space-y-2">
        {snap?.likelyEphemeral ? (
          <Notice tone="warning" title={s.ephemeralTitle} body={s.ephemeralBody} />
        ) : null}
        {gap >= 5 ? <Notice tone="warning" title={s.gapTitle} body={s.gapBody} /> : null}
        {tracked >= 10 && lastBackup === null ? (
          <Notice tone="info" title={s.trackedNoBackup} body="" />
        ) : null}
      </div>
    </Card>
  );
}

/** A small inline notice strip. */
function Notice({ tone, title, body }: { tone: 'warning' | 'info'; title: string; body: string }): JSX.Element {
  return (
    <div
      className={[
        'rounded-lg border p-3',
        tone === 'warning'
          ? 'border-[color-mix(in_srgb,var(--warning)_40%,var(--border))] bg-[color-mix(in_srgb,var(--warning)_8%,transparent)]'
          : 'border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] bg-[color-mix(in_srgb,var(--primary)_7%,transparent)]',
      ].join(' ')}
    >
      <p className={['text-xs font-extrabold', tone === 'warning' ? 'text-[var(--warning)]' : 'text-[var(--primary)]'].join(' ')}>
        {title}
      </p>
      {body ? <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{body}</p> : null}
    </div>
  );
}
