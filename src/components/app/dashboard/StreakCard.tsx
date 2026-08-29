import { useEffect, useState } from 'react';
import { streakReport } from '../../../lib/core/streaks/streak';
import type { DayCompletion } from '../../../lib/core/streaks/streak';
import { todayInCity } from '../../../lib/core/city-time';
import { listPrayerLogs } from '../../../lib/db/db';
import { useApp } from '../../../store';
import { useT } from '../../../lib/use-locale';
import { Card } from '../../ui/Card';

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

/**
 * Prayer streak card for the dashboard hub, sourced from the tracker.
 * @returns The rendered streak card.
 */
export function StreakCard(): JSX.Element {
  const { t } = useT();
  const cityId = useApp((s) => s.settings.city);
  const [report, setReport] = useState({ current: 0, best: 0, percent: 0 });

  useEffect(() => {
    let cancelled = false;
    void listPrayerLogs().then((logs) => {
      if (cancelled) return;
      const days = new Map<string, DayCompletion>();
      for (const log of logs) {
        const done = PRAYERS.filter((p) => log[p]).length;
        days.set(log.dateISO, { done, total: PRAYERS.length });
      }
      // Anchor "today" in the selected city's timezone, not the device's.
      const today = new Date(`${todayInCity(cityId)}T12:00:00`);
      setReport(streakReport(days, today, PRAYERS.length));
    });
    return () => {
      cancelled = true;
    };
  }, [cityId]);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
          {t('modulesUi.dashboard.streak')}
        </p>
        <p className="mt-1.5 text-4xl font-extrabold tnum text-[var(--fg)]">
          {report.current}
          <span className="ms-1.5 text-sm font-bold text-[var(--muted)]">
            {report.current === 1 ? t('modulesUi.dashboard.day') : t('modulesUi.dashboard.days')}
          </span>
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-2 text-xs text-[var(--muted)]">
        <span>
          {t('modulesUi.dashboard.best')} <strong className="tnum text-[var(--fg)]">{report.best}</strong>
        </span>
        <span>
          {t('modulesUi.dashboard.thisWeek')} <strong className="tnum text-[var(--fg)]">{report.percent}%</strong>
        </span>
      </div>
    </Card>
  );
}
