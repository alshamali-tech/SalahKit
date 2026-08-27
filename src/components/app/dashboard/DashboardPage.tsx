import { useT } from '../../../lib/use-locale';
import { NextPrayerCard } from './NextPrayerCard';
import { HijriTodayCard } from './HijriTodayCard';
import { StreakCard } from './StreakCard';
import { ToolGrid } from './ToolGrid';

/**
 * The dashboard hub: next prayer, Hijri today, streak, and the 13-tool
 * launcher. The default landing inside the app shell.
 * @returns The rendered hub.
 */
export function DashboardPage(): JSX.Element {
  const { t } = useT();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--fg)] sm:text-3xl">
          {t('app.name')}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{t('app.tagline')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NextPrayerCard />
        <HijriTodayCard />
        <StreakCard />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">
          Tools
        </h3>
        <ToolGrid />
      </div>
    </div>
  );
}
