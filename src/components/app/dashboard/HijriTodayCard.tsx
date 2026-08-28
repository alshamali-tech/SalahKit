import { useMemo } from 'react';
import { gregorianToHijri } from '../../../lib/core/hijri';
import { HIJRI_MONTHS, HIJRI_MONTHS_AR } from '../../../lib/core/constants';
import { formatFullDate, getFormatLocale } from '../../../lib/utils/format';
import { useT } from '../../../lib/use-locale';
import { Card } from '../../ui/Card';

/**
 * Today's date on both calendars for the dashboard hub. Hijri month
 * names follow the active interface language.
 * @returns The rendered dual-calendar card.
 */
export function HijriTodayCard(): JSX.Element {
  const { t } = useT();
  const today = useMemo(() => new Date(), []);
  const hijri = useMemo(() => gregorianToHijri(today), [today]);
  const isAr = getFormatLocale() === 'ar';
  const months = isAr ? HIJRI_MONTHS_AR : HIJRI_MONTHS;
  const monthName = months[hijri.month - 1] ?? '';

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
          {t('modulesUi.dashboard.today')}
        </p>
        <p className="mt-1.5 text-2xl font-extrabold tnum text-[var(--fg)]">
          {hijri.day} {monthName} {hijri.year}
        </p>
        <p className="text-sm font-semibold text-[var(--primary)]">{t('modulesUi.dashboard.ah')}</p>
      </div>
      <p className="mt-3 border-t border-[var(--border)] pt-2 text-xs text-[var(--muted)]">
        {formatFullDate(today)}
      </p>
    </Card>
  );
}
