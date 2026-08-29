import { useEffect, useState } from 'react';
import { formatSkew, isSkewSignificant, measureClockSkewMs } from '../../lib/utils/clockskew';
import { useT } from '../../lib/use-locale';

/**
 * Device clock skew notice (P20). Prayer countdowns trust the device
 * clock; when online we compare it against a network time source and,
 * if it is off by more than a couple of minutes, show a calm warning so
 * the user knows the countdown may be wrong.
 * @returns The notice, or null when the clock is fine / offline.
 */
export function ClockSkewNotice(): JSX.Element | null {
  const { t } = useT();
  const [skew, setSkew] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void measureClockSkewMs().then((ms) => {
      if (!cancelled) setSkew(ms);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (dismissed || !isSkewSignificant(skew)) return null;

  return (
    <div
      role="status"
      className="border-b border-[color-mix(in_srgb,var(--warning)_40%,var(--border))] bg-[color-mix(in_srgb,var(--warning)_12%,var(--card))]"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="var(--warning)" strokeWidth="1.8" aria-hidden="true" className="shrink-0">
          <circle cx="10" cy="10" r="7.5" />
          <path d="M10 6v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="min-w-0 flex-1 text-xs font-semibold text-[var(--warning)]">
          {t('clock.offA')} <strong className="tnum">{skew !== null ? formatSkew(skew) : ''}</strong> {t('clock.offB')}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss clock warning"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--warning)] hover:bg-[color-mix(in_srgb,var(--warning)_18%,transparent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--warning)]"
        >
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
