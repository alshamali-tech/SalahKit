import type { ButtonHTMLAttributes } from 'react';

/** Visual variants aligned with the SalahKit design system (S7). */
export type ButtonVariant = 'primary' | 'amber' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Defaults to 'primary'. */
  variant?: ButtonVariant;
  /** Touch-target size; md satisfies the 44px accessibility minimum. */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to the container width. */
  full?: boolean;
}

const VARIANT_CLASSES: Readonly<Record<ButtonVariant, string>> = {
  primary:
    'bg-[var(--primary)] text-[var(--primary-fg)] hover:brightness-110 shadow-sm shadow-teal-900/20',
  amber: 'bg-[var(--accent)] text-[#3b2305] hover:brightness-105 shadow-sm shadow-amber-900/20',
  outline:
    'border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
  ghost: 'text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)]',
  danger: 'bg-[var(--danger)] text-white hover:brightness-110',
};

const SIZE_CLASSES: Readonly<Record<NonNullable<ButtonProps['size']>, string>> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Accessible button: visible focus ring, 44px default touch target,
 * truncating label, press feedback.
 * @param props - Standard button attributes plus variant/size/full.
 * @returns The rendered button element.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
        'whitespace-nowrap overflow-hidden text-ellipsis select-none',
        'transition-all duration-150 ease-out active:scale-[0.97]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
        'disabled:opacity-50 disabled:pointer-events-none',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        full ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
