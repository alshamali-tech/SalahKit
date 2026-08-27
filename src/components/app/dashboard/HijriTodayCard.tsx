import { useMemo } from 'react';
import { gregorianToHijri, hijriMonthName } from '../../../lib/core/hijri';
import { formatFullDate } from '../../../lib/utils/format';
import { Card } from '../../ui/Card';

/**
 * Today's date on both calendars for the dashboard hub.
 * @returns The rendered dual-calendar card.
 */
export function HijriTodayCard(): JSX.Element {
  const today = useMemo(() => new Date(), []);
  const hijri = useMemo(() => gregorianToHijri(today), [today]);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">Today</p>
        <p className="mt-1.5 text-2xl font-extrabold tnum text-[var(--fg)]">
          {hijri.day} {hijriMonthName(hijri.month)} {hijri.year}
        </p>
        <p className="text-sm font-semibold text-[var(--primary)]">AH</p>
      </div>
      <p className="mt-3 border-t border-[var(--border)] pt-2 text-xs text-[var(--muted)]">
        {formatFullDate(today)}
      </p>
    </Card>
  );
}
