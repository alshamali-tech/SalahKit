import { useMemo } from 'react';
import { useWallClock } from '../../lib/utils/wallclock';
import { addDaysISO, computePrayerTimes, nextPrayer, previousPrayer } from '../../lib/core/prayer-engine';
import { PRAYER_LABELS, TICK_INTERVAL_MS } from '../../lib/core/constants';
import { gregorianToHijri } from '../../lib/core/hijri';
import { toISODate } from '../../lib/core/validator';
import { findCity } from '../../lib/core/geo';
import { formatClockTime, formatCountdown, formatFullDate, formatHijriLong } from '../../lib/utils/format';
import { useApp } from '../../store';
import { useT } from '../../lib/use-locale';
import { Badge } from '../ui/Badge';

/**
 * Next-prayer countdown card (S9): live ticking timer, progress bar
 * between the previous and next prayer, Gregorian + Hijri date line.
 * @returns The rendered countdown card.
 */
export function CountdownNext(): JSX.Element {
  const settings = useApp((s) => s.settings);
  const { t } = useT();
  // Wall-clock derived: never accumulates ticks, wakes on visibility.
  const now = useWallClock(1000);

  const todayISO = toISODate(now);
  const today = useMemo(
    () => computePrayerTimes(todayISO, settings.latitude, settings.longitude, settings.calcMethod, settings.madhab),
    [todayISO, settings]
  );
  const tomorrow = useMemo(
    () =>
      computePrayerTimes(
        addDaysISO(todayISO, 1),
        settings.latitude,
        settings.longitude,
        settings.calcMethod,
        settings.madhab
      ),
    [todayISO, settings]
  );
  const next = useMemo(() => nextPrayer(today, tomorrow, now), [today, tomorrow, now]);
  const prev = useMemo(() => previousPrayer(today, now), [today, now]);
  const span = Math.max(1, next.at.getTime() - prev.at.getTime());
  const progress = Math.min(100, Math.max(0, ((now.getTime() - prev.at.getTime()) / span) * 100));
  const hijri = useMemo(() => gregorianToHijri(now), [todayISO]); // eslint-disable-line react-hooks/exhaustive-deps
  const city = findCity(settings.city);

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
          {t('modulesUi.prayer.nextPrayer')} · {PRAYER_LABELS[next.name]}
        </p>
        <Badge tone="neutral">{city.name}</Badge>
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-5xl font-extrabold tracking-tight tnum text-[var(--fg)] sm:text-6xl">
          {formatCountdown(next.at.getTime() - now.getTime())}
        </span>
        <span className="text-lg font-semibold text-[var(--muted)]">{t('modulesUi.prayer.at')} {formatClockTime(next.at)}</span>
      </div>
      <div
        className="mt-4 h-1.5 w-full max-w-md rounded-full bg-[var(--hover)] overflow-hidden"
        role="progressbar"
        aria-label="Progress toward next prayer"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {formatFullDate(now)} · <span className="font-semibold text-[var(--fg)]">{formatHijriLong(hijri)}</span>
      </p>
    </div>
  );
}
