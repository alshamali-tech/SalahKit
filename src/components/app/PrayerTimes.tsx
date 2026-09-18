import { useMemo, useState } from 'react';
import { addDaysISO, computePrayerTimes, nextPrayer } from '../../lib/core/prayer-engine';
import { PRAYER_LABELS, PRAYER_LABELS_AR, PRAYER_ORDER } from '../../lib/core/constants';
import { toISODate } from '../../lib/core/validator';
import { findCity } from '../../lib/core/geo';
import { formatClockTime } from '../../lib/utils/format';
import { useWallClock } from '../../lib/utils/wallclock';
import { buildPrayerIcs, downloadIcs } from '../../lib/export/ics';
import { useApp } from '../../store';
import { useT } from '../../lib/use-locale';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CountdownNext } from './CountdownNext';
import { LocationPicker } from './LocationPicker';
import { MethodSelector } from './MethodSelector';
import { MethodParamsPanel } from './MethodParamsPanel';
import type { CalcMethodId, Madhab } from '../../types';

/**
 * Prayer times module (S9): on-device astronomical computation with
 * a live countdown, searchable city picker and method presets.
 * @returns The rendered module.
 */
export function PrayerTimes(): JSX.Element {
  const { settings, updateSettings } = useApp();
  const { t } = useT();
  // Wall-clock derived — never accumulates ticks, wakes on visibility.
  const now = useWallClock(1000);
  const [pickerOpen, setPickerOpen] = useState(false);

  /** Hands a month of computed times to the OS calendar (ICS). */
  function exportMonth(): void {
    const city = findCity(settings.city);
    downloadIcs(
      buildPrayerIcs({
        latitude: settings.latitude,
        longitude: settings.longitude,
        method: settings.calcMethod,
        madhab: settings.madhab,
        days: 30,
        cityName: city.name,
      }),
      city.name
    );
  }

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
  const city = findCity(settings.city);

  /** Applies a calculation method. */
  function onMethod(id: CalcMethodId): void {
    void updateSettings({ calcMethod: id });
  }

  return (
    <div className="space-y-5">
      <Card tone="raised" className="relative overflow-hidden">
        <div className="bg-pattern drift-slow absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <CountdownNext />
          <div className="space-y-3 min-w-0">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 py-2.5 text-left hover:border-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]"
            >
              <span className="min-w-0">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)]">{t('modulesUi.prayer.city')}</span>
                <span className="block truncate text-sm font-bold text-[var(--fg)]">
                  {city.name}, {city.country}
                </span>
              </span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="var(--primary)" strokeWidth="1.8" className="shrink-0" aria-hidden="true">
                <path d="M10 17s-5.5-4.7-5.5-9a5.5 5.5 0 1 1 11 0c0 4.3-5.5 9-5.5 9z" strokeLinejoin="round" />
                <circle cx="10" cy="8" r="2" />
              </svg>
            </button>
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] mb-1.5">{t('modulesUi.prayer.asrMadhab')}</span>
              <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                {(['shafi', 'hanafi'] as const).map((m: Madhab) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={settings.madhab === m}
                    onClick={() => void updateSettings({ madhab: m })}
                    className={[
                      'h-10 flex-1 text-xs font-bold transition-colors duration-150',
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
              {isNext ? <Badge tone="primary" className="mt-1.5">{t('modulesUi.prayer.upNext')}</Badge> : null}
            </Card>
          );
        })}
      </div>

      <Card>
        <h3 className="text-sm font-extrabold text-[var(--fg)] mb-3">{t('modulesUi.prayer.method')}</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <MethodSelector value={settings.calcMethod} onChange={onMethod} />
          <div className="rounded-lg border border-[var(--border)] bg-[var(--field)] p-3 text-xs leading-relaxed text-[var(--muted)] min-w-0">
            <p className="font-bold text-[var(--fg)] mb-1">{t('modulesUi.prayer.whichRight')}</p>
            {t('modulesUi.prayer.whichRightBody')}
          </div>
        </div>
      </Card>

      <MethodParamsPanel />

      <p className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <Badge tone="success">{t('modulesUi.prayer.onDevice')}</Badge>
        {t('modulesUi.prayer.computedNote')}
      </p>
      <div className="mt-3">
        <Button variant="outline" size="sm" onClick={exportMonth}>
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <rect x="3" y="4" width="14" height="13" rx="2" />
            <path d="M3 8h14M7 2.5V5M13 2.5V5M7.5 12l2 2 3.5-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('modulesUi.prayer.icsExport')}
        </Button>
      </div>

      <LocationPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
