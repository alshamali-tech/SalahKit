import { useEffect, useMemo, useState } from 'react';
import { addDaysISO, computePrayerTimes, nextPrayer, previousPrayer } from '../../lib/core/prayer-engine';
import { PRAYER_LABELS, PRAYER_LABELS_AR, PRAYER_ORDER, TICK_INTERVAL_MS } from '../../lib/core/constants';
import { gregorianToHijri } from '../../lib/core/hijri';
import { toISODate } from '../../lib/core/validator';
import { CITIES } from '../../lib/core/geo';
import { CALC_METHOD_LIST } from '../../lib/core/calc-methods';
import { formatClockTime, formatCountdown, formatFullDate, formatHijriLong } from '../../lib/utils/format';
import { useApp } from '../../store';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import type { Madhab } from '../../types';

/**
 * Prayer times module: on-device astronomical computation (S5 offline
 * fallback is the default), live next-prayer countdown and progress.
 * @returns The rendered module.
 */
export function PrayerTimes(): JSX.Element {
  const { settings, updateSettings } = useApp();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const todayISO = toISODate(now);
  const today = useMemo(
    () => computePrayerTimes(todayISO, settings.latitude, settings.longitude, settings.calcMethod, settings.madhab),
    [todayISO, settings.latitude, settings.longitude, settings.calcMethod, settings.madhab]
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
    [todayISO, settings.latitude, settings.longitude, settings.calcMethod, settings.madhab]
  );

  const next = useMemo(() => nextPrayer(today, tomorrow, now), [today, tomorrow, now]);
  const prev = useMemo(() => previousPrayer(today, now), [today, now]);
  const span = Math.max(1, next.at.getTime() - prev.at.getTime());
  const progress = Math.min(100, Math.max(0, ((now.getTime() - prev.at.getTime()) / span) * 100));
  const hijri = useMemo(() => gregorianToHijri(now), [todayISO]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <Card tone="raised" className="overflow-hidden relative">
        <div className="bg-pattern drift-slow absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col lg:flex-row gap-6 lg:items-end">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              Next prayer · {PRAYER_LABELS[next.name]}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight tnum text-[var(--fg)]">
                {formatCountdown(next.at.getTime() - now.getTime())}
              </span>
              <span className="text-lg font-semibold text-[var(--muted)]">
                at {formatClockTime(next.at)}
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full max-w-md rounded-full bg-[var(--hover)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {formatFullDate(now)} · <span className="text-[var(--fg)] font-medium">{formatHijriLong(hijri)}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:w-56 shrink-0">
            <Select
              label="City"
              id="prayer-city"
              value={settings.city}
              onChange={(e) => {
                const city = CITIES.find((c) => c.id === e.target.value);
                if (city) void updateSettings({ city: city.id, latitude: city.latitude, longitude: city.longitude });
              }}
              options={CITIES.map((c) => ({ value: c.id, label: `${c.name}, ${c.country}` }))}
            />
            <Select
              label="Method"
              id="prayer-method"
              value={settings.calcMethod}
              onChange={(e) => void updateSettings({ calcMethod: e.target.value as typeof settings.calcMethod })}
              options={CALC_METHOD_LIST.map((m) => ({ value: m.id, label: m.name }))}
            />
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                Asr madhab
              </span>
              <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                {(['shafi', 'hanafi'] as const).map((m: Madhab) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={settings.madhab === m}
                    onClick={() => void updateSettings({ madhab: m })}
                    className={[
                      'h-11 flex-1 text-sm font-semibold capitalize transition-colors duration-150',
                      'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)]',
                      settings.madhab === m
                        ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                        : 'bg-[var(--field)] text-[var(--muted)] hover:text-[var(--fg)]',
                    ].join(' ')}
                  >
                    {m === 'shafi' ? 'Shafi’i' : 'Hanafi'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PRAYER_ORDER.map((name) => {
          const at = today.times[name];
          const isNext = name === next.name;
          const isPast = at.getTime() <= now.getTime() && !isNext;
          return (
            <Card
              key={name}
              hover
              tone={isNext ? 'raised' : 'default'}
              className={[isNext ? 'ring-2 ring-[var(--primary)]' : '', isPast ? 'opacity-60' : ''].join(' ')}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--fg)] truncate">{PRAYER_LABELS[name]}</p>
                  <p className="text-xs text-[var(--muted)] arabic leading-6">{PRAYER_LABELS_AR[name]}</p>
                </div>
                {isNext ? (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)] animate-[pulseDot_1.6s_ease-in-out_infinite]" aria-hidden="true" />
                ) : isPast && name !== 'sunrise' ? (
                  <svg aria-label="Passed" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="var(--success)" strokeWidth="2" className="mt-1 shrink-0">
                    <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </div>
              <p className="mt-2 text-lg font-bold tnum text-[var(--fg)]">{formatClockTime(at)}</p>
              {isNext ? <Badge tone="primary" className="mt-1.5">Up next</Badge> : null}
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-[var(--muted)] flex items-center gap-2 flex-wrap">
        <Badge tone="success">100% on-device</Badge>
        Times are computed locally with open astronomical math — they work with zero connectivity.
        Verify critical timings with your local mosque.
      </p>
    </div>
  );
}
