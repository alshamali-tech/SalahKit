import { useMemo, useState } from 'react';
import { gregorianToHijri, hijriMonthLength, hijriMonthName, hijriToGregorian } from '../../lib/core/hijri';
import { HIJRI_MONTHS_AR } from '../../lib/core/constants';
import { toISODate } from '../../lib/core/validator';
import { useApp } from '../../store';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Hijri calendar module: month grid with Gregorian day mapping and
 * month navigation.
 * @returns The rendered module.
 */
export function CalendarView(): JSX.Element {
  const todayISO = toISODate(new Date());
  const current = useMemo(() => gregorianToHijri(new Date()), []);
  const [view, setView] = useState({ year: current.year, month: current.month });

  const monthStart = useMemo(
    () => hijriToGregorian({ year: view.year, month: view.month, day: 1 }),
    [view]
  );
  const length = useMemo(() => hijriMonthLength(view.year, view.month), [view]);
  const offset = monthStart.getDay();

  /** Shifts the viewed month by delta, rolling years correctly. */
  function shift(delta: number): void {
    setView((v) => {
      let month = v.month + delta;
      let year = v.year;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      if (month > 12) {
        month = 1;
        year += 1;
      }
      return { year, month };
    });
  }

  return (
    <div className="space-y-4">
      <Card tone="raised" className="relative overflow-hidden">
        <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Hijri month</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-[var(--fg)]">
              {hijriMonthName(view.month)} {view.year} AH
            </p>
            <p className="arabic text-lg text-[var(--muted)] mt-0.5">
              {HIJRI_MONTHS_AR[view.month - 1]} {view.year} هـ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => shift(-1)} aria-label="Previous month">←</Button>
            <Button variant="outline" size="sm" onClick={() => setView({ year: current.year, month: current.month })}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => shift(1)} aria-label="Next month">→</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {WEEKDAYS.map((d) => (
            <p key={d} className="text-center text-xs font-bold uppercase tracking-wider text-[var(--muted)] py-1">
              {d}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: offset }, (_, i) => (
            <div key={`blank-${i}`} aria-hidden="true" />
          ))}
          {Array.from({ length: length }, (_, i) => {
            const dayDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), monthStart.getDate() + i);
            const iso = toISODate(dayDate);
            const isToday = iso === todayISO;
            const isFriday = dayDate.getDay() === 5;
            return (
              <div
                key={iso}
                className={[
                  'rounded-lg border p-1.5 sm:p-2 min-h-[52px] sm:min-h-[64px] flex flex-col items-center justify-center transition-colors',
                  isToday
                    ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] ring-1 ring-[var(--primary)]'
                    : isFriday
                      ? 'border-[color-mix(in_srgb,var(--accent)_40%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]'
                      : 'border-[var(--border)] bg-[var(--field)]',
                ].join(' ')}
              >
                <span className={['text-sm sm:text-base font-extrabold tnum', isToday ? 'text-[var(--primary)]' : 'text-[var(--fg)]'].join(' ')}>
                  {i + 1}
                </span>
                <span className="text-[10px] text-[var(--muted)] tnum whitespace-nowrap">
                  {dayDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="primary">Today</Badge>
          <Badge tone="accent">Jumu’ah (Friday)</Badge>
          <Badge tone="neutral">{length} days this month</Badge>
        </div>
      </Card>
    </div>
  );
}
