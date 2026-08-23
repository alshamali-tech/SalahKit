import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  /** Option value. */
  value: string;
  /** Display label. */
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Visible label (S6: labels on every input). */
  label: string;
  /** Unique id; label is wired via htmlFor. */
  id: string;
  /** Options list. */
  options: readonly SelectOption[];
}

/**
 * Labeled native select, w-full, keyboard accessible (S6).
 * @param props - Standard select attributes plus label/id/options.
 * @returns The rendered select field.
 */
export function Select({
  label,
  id,
  options,
  className = '',
  ...rest
}: SelectProps): JSX.Element {
  return (
    <div className={['min-w-0', className].join(' ')}>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={[
            'w-full h-11 appearance-none rounded-lg border border-[var(--border)] bg-[var(--field)]',
            'px-3 pr-9 text-sm text-[var(--fg)]',
            'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)]',
            'transition-colors duration-150 cursor-pointer',
          ].join(' ')}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
