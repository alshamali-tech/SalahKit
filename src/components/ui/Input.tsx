import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label (accessibility: every input gets one, S6). */
  label: string;
  /** Unique id; label is wired via htmlFor. */
  id: string;
  /** Optional helper line under the field. */
  hint?: string;
  /** Suffix rendered inside the field (unit, currency...). */
  suffix?: string;
}

/**
 * Labeled text/number input, w-full per viewport rules (S6).
 * @param props - Standard input attributes plus label/id/hint/suffix.
 * @returns The rendered field.
 */
export function Input({
  label,
  id,
  hint,
  suffix,
  className = '',
  ...rest
}: InputProps): JSX.Element {
  return (
    <div className={['min-w-0', className].join(' ')}>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={[
            'w-full h-11 rounded-lg border border-[var(--border)] bg-[var(--field)] px-3',
            'text-[var(--fg)] text-sm placeholder:text-[var(--muted)]',
            'transition-colors duration-150',
            'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)]',
            suffix ? 'pr-12' : '',
          ].join(' ')}
          {...rest}
        />
        {suffix ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--muted)] pointer-events-none">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}
