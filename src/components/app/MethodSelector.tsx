import { CALC_METHOD_LIST } from '../../lib/core/calc-methods';
import type { CalcMethodId } from '../../types';

export interface MethodSelectorProps {
  /** Currently selected method id. */
  value: string;
  /** Change handler. */
  onChange: (id: CalcMethodId) => void;
}

/**
 * Calculation-method selector (S9): radio cards showing each
 * authority's Fajr/Isha conventions.
 * @param props - value/onChange.
 * @returns The rendered radio group.
 */
export function MethodSelector({ value, onChange }: MethodSelectorProps): JSX.Element {
  return (
    <div role="radiogroup" aria-label="Prayer time calculation method" className="space-y-1.5">
      {CALC_METHOD_LIST.map((method) => {
        const active = method.id === value;
        return (
          <button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(method.id)}
            className={[
              'w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left min-w-0',
              'transition-all duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
              active
                ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] shadow-sm'
                : 'border-[var(--border)] bg-[var(--field)] hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))]',
            ].join(' ')}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span
                aria-hidden="true"
                className={[
                  'inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2',
                  active ? 'border-[var(--primary)]' : 'border-[var(--border)]',
                ].join(' ')}
                style={{ width: 18, height: 18 }}
              >
                {active ? <span className="h-2 w-2 rounded-full bg-[var(--primary)]" /> : null}
              </span>
              <span className={['truncate text-sm font-bold', active ? 'text-[var(--primary)]' : 'text-[var(--fg)]'].join(' ')}>
                {method.name}
              </span>
            </span>
            <span className="shrink-0 text-[11px] font-semibold tnum text-[var(--muted)] whitespace-nowrap">
              Fajr {method.fajrAngle}° · {method.ishaIntervalMin ? `Isha +${method.ishaIntervalMin}m` : `Isha ${method.ishaAngle}°`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
