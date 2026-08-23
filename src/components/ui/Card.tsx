import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover lift + border glow micro-interaction. */
  hover?: boolean;
  /** Visual emphasis used for the active/hero card. */
  tone?: 'default' | 'raised' | 'outline';
}

/**
 * Surface container per S7: rounded-xl, bordered, soft shadow, p-4 by default.
 * @param props - Standard div attributes plus hover/tone.
 * @returns The rendered card element.
 */
export function Card({
  hover = false,
  tone = 'default',
  className = '',
  children,
  ...rest
}: CardProps): JSX.Element {
  const toneClass =
    tone === 'raised'
      ? 'shadow-md shadow-teal-950/10 border-[color-mix(in_srgb,var(--primary)_35%,var(--border))]'
      : tone === 'outline'
        ? 'shadow-none border-dashed'
        : 'shadow-sm';
  return (
    <div
      className={[
        'rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 min-w-0',
        toneClass,
        hover
          ? 'transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))]'
          : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
