import { getCalcMethod } from '../../lib/core/calc-methods';
import { ASR_SHADOW_FACTOR } from '../../lib/core/constants';
import { useApp } from '../../store';
import { useT } from '../../lib/use-locale';
import { Card } from '../ui/Card';

/**
 * Method transparency panel (P11): shows the exact Fajr/Isha angles,
 * Asr juristic factor and rounding convention behind today's times —
 * converting "why does your Fajr differ from my masjid?" disputes into
 * informed, checkable choices.
 * @returns The rendered parameter card.
 */
export function MethodParamsPanel(): JSX.Element {
  const settings = useApp((s) => s.settings);
  const { t } = useT();
  const preset = getCalcMethod(settings.calcMethod);
  const factor = ASR_SHADOW_FACTOR[settings.madhab];

  const rows: { label: string; value: string }[] = [
    { label: t('prayerParams.fajr'), value: `${preset.fajrAngle}°` },
    preset.ishaIntervalMin !== undefined
      ? { label: t('prayerParams.ishaInterval'), value: `${preset.ishaIntervalMin} min` }
      : { label: t('prayerParams.isha'), value: `${preset.ishaAngle}°` },
    { label: t('prayerParams.asr'), value: settings.madhab === 'hanafi' ? `${factor}× (Hanafi)` : `${factor}× (Shafi'i)` },
    { label: t('prayerParams.rounding'), value: 'UTC → local' },
  ];

  return (
    <Card>
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)]"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="10" cy="10" r="7" />
            <path d="M10 6v4l2.5 2.5" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-[var(--fg)]">{t('prayerParams.title')}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{preset.name}</p>
          <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {rows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-[var(--border)] pb-1.5">
                <dt className="text-xs text-[var(--muted)]">{row.label}</dt>
                <dd className="text-xs font-extrabold tnum text-[var(--fg)]">{row.value}</dd>
              </div>
            ))}
          </dl>
          {Math.abs(settings.latitude) >= 48 ? (
            <p className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] px-3 py-2 text-[11px] leading-relaxed text-[var(--warning)]">
              High latitude ({settings.latitude.toFixed(1)}°): night-middle repair active for Fajr/Isha in summer.
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
