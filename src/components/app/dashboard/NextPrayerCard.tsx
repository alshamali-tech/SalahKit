import { useEffect, useMemo, useState } from 'react';
import { computePrayerTimes, nextPrayer, addDaysISO } from '../../../lib/core/prayer-engine';
import { PRAYER_LABELS, TICK_INTERVAL_MS } from '../../../lib/core/constants';
import { toISODate } from '../../../lib/core/validator';
import { formatClockTime, formatCountdown } from '../../../lib/utils/format';
import { useApp } from '../../../store';
import { Card } from '../../ui/Card';

/**
 * Live next-prayer countdown card for the dashboard hub.
 * @returns The rendered card.
 */
export function NextPrayerCard(): JSX.Element {
  const settings = useApp((s) => s.settings);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const todayISO = toISODate(now);
  const next = useMemo(() => {
    const today = computePrayerTimes(todayISO, settings.latitude, settings.longitude, settings.calcMethod, settings.madhab);
    const tomorrow = computePrayerTimes(addDaysISO(todayISO, 1), settings.latitude, settings.longitude, settings.calcMethod, settings.madhab);
    return nextPrayer(today, tomorrow, now);
  }, [todayISO, now, settings.latitude, settings.longitude, settings.calcMethod, settings.madhab]);

  return (
    <Card tone="raised" className="relative overflow-hidden">
      <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">Next prayer</p>
        <p className="mt-1.5 text-2xl font-extrabold text-[var(--fg)]">{PRAYER_LABELS[next.name]}</p>
        <p className="mt-1 text-4xl font-extrabold tnum text-[var(--fg)]" aria-live="polite">
          {formatCountdown(next.at.getTime() - now.getTime())}
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">at {formatClockTime(next.at)}</p>
      </div>
    </Card>
  );
}
