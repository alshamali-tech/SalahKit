import { useEffect, useMemo, useRef, useState } from 'react';
import { PRAYER_LABELS } from '../../lib/core/constants';
import { toISODate } from '../../lib/core/validator';
import { todayInCity } from '../../lib/core/city-time';
import { getLogForDate, listPrayerLogs, upsertPrayerLog } from '../../lib/db/db';
import { emitToast } from '../../lib/messaging';
import { useApp } from '../../store';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import type { PrayerLogRow } from '../../types';

const TRACKED: readonly (keyof Pick<PrayerLogRow, 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'>)[] = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

/**
 * Prayer tracker module: weekly grid of per-prayer toggles persisted
 * to IndexedDB, with streaks and one-step undo (in-memory snapshot).
 * @returns The rendered module.
 */
export function PrayerTracker(): JSX.Element {
  const cityId = useApp((s) => s.settings.city);
  const [logs, setLogs] = useState<Record<string, PrayerLogRow>>({});
  const [note, setNote] = useState('');
  const snapshot = useRef<{ dateISO: string; previous: PrayerLogRow | null } | null>(null);

  // Anchor "today" in the selected city's timezone (not the device's).
  const todayISO = useMemo(() => todayInCity(cityId), [cityId]);
  const days = useMemo(() => {
    const out: Date[] = [];
    const base = new Date(`${todayISO}T12:00:00`);
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      out.push(d);
    }
    return out;
  }, [todayISO]);

  useEffect(() => {
    void listPrayerLogs().then((rows) => {
      const map: Record<string, PrayerLogRow> = {};
      rows.forEach((r) => {
        map[r.dateISO] = r;
      });
      setLogs(map);
      const today = rows.find((r) => r.dateISO === todayISO);
      if (today) setNote(today.note);
    });
  }, [todayISO]);

  const stats = useMemo(() => {
    let done = 0;
    let total = 0;
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i -= 1) {
      const log = logs[toISODate(days[i])];
      const complete = log ? TRACKED.every((p) => log[p]) : false;
      if (complete) streak += 1;
      else if (i !== days.length - 1) break;
    }
    days.forEach((d) => {
      const log = logs[toISODate(d)];
      total += TRACKED.length;
      if (log) done += TRACKED.filter((p) => log[p]).length;
    });
    return { streak, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
  }, [logs, days]);

  /** Optimistically toggles a prayer for a date and persists it. */
  async function toggle(dateISO: string, prayer: (typeof TRACKED)[number]): Promise<void> {
    const previous = logs[dateISO] ?? null;
    snapshot.current = { dateISO, previous };
    const current = previous ?? (await getLogForDate(dateISO)) ?? null;
    const nextValue = current ? !current[prayer] : true;
    const base: PrayerLogRow = current
      ? { ...current, [prayer]: nextValue }
      : {
          id: `log-${dateISO}`,
          dateISO,
          fajr: prayer === 'fajr',
          dhuhr: prayer === 'dhuhr',
          asr: prayer === 'asr',
          maghrib: prayer === 'maghrib',
          isha: prayer === 'isha',
          note: '',
        };
    setLogs((prev) => ({ ...prev, [dateISO]: base }));
    await upsertPrayerLog(dateISO, { [prayer]: nextValue } as Partial<PrayerLogRow>);
  }

  /** Reverts the last toggle from the in-memory snapshot. */
  async function undo(): Promise<void> {
    const snap = snapshot.current;
    if (!snap) return;
    snapshot.current = null;
    setLogs((prev) => {
      const next = { ...prev };
      if (snap.previous) next[snap.dateISO] = snap.previous;
      else delete next[snap.dateISO];
      return next;
    });
    if (snap.previous) {
      await upsertPrayerLog(snap.dateISO, snap.previous);
    }
  }

  /** Saves today's note alongside the log row. */
  async function saveNote(): Promise<void> {
    await upsertPrayerLog(todayISO, { note });
    emitToast({ title: 'Note saved', tone: 'success' });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="primary">{stats.percent}% this week</Badge>
        <Badge tone="accent">Streak: {stats.streak} {stats.streak === 1 ? 'day' : 'days'}</Badge>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => void undo()} disabled={!snapshot.current}>
          Undo last toggle
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-separate border-spacing-y-1.5">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)] px-2 pb-1">Day</th>
              {TRACKED.map((p) => (
                <th key={p} className="text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)] px-1 pb-1">
                  {PRAYER_LABELS[p]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const iso = toISODate(day);
              const log = logs[iso];
              const isToday = iso === todayISO;
              return (
                <tr key={iso}>
                  <td className="px-2">
                    <p className={['text-sm font-bold whitespace-nowrap', isToday ? 'text-[var(--primary)]' : 'text-[var(--fg)]'].join(' ')}>
                      {day.toLocaleDateString(undefined, { weekday: 'short' })}
                    </p>
                    <p className="text-xs text-[var(--muted)] tnum">
                      {day.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </p>
                  </td>
                  {TRACKED.map((p) => {
                    const done = Boolean(log?.[p]);
                    return (
                      <td key={p} className="text-center px-1">
                        <button
                          type="button"
                          aria-pressed={done}
                          aria-label={`${PRAYER_LABELS[p]} on ${iso}: ${done ? 'prayed' : 'not prayed'}`}
                          onClick={() => void toggle(iso, p)}
                          className={[
                            'inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-150 active:scale-90',
                            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                            done
                              ? 'bg-[var(--success)] border-transparent text-white shadow-sm'
                              : 'bg-[var(--field)] border-[var(--border)] text-transparent hover:border-[var(--primary)]',
                          ].join(' ')}
                        >
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                            <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <Input
            label="Note for today"
            id="tracker-note"
            placeholder="e.g. Prayed Fajr at the masjid…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1"
          />
          <Button variant="primary" onClick={() => void saveNote()}>Save note</Button>
        </div>
      </Card>
    </div>
  );
}
