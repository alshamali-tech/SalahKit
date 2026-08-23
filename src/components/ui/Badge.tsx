import type { ReactNode } from 'react';

/** Semantic badge tones. */
export type BadgeTone = 'primary' | 'accent' | 'success' | 'neutral' | 'danger' | 'warning';

export interface BadgeProps {
  /** Semantic tone. */
  tone?: BadgeTone;
  /** Badge content. */
  children: ReactNode;
  /** Extra classes. */
  className?: string;
}

const TONE_CLASSES: Readonly<Record<BadgeTone, string>> = {
  primary: 'bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)] border-[color-mix(in_srgb,var(--primary)_30%,transparent)]',
  accent: 'bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent-strong)] border-[color-mix(in_srgb,var(--accent)_35%,transparent)]',
  success: 'bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)] border-[color-mix(in_srgb,var(--success)_32%,transparent)]',
  neutral: 'bg-[var(--hover)] text-[var(--muted)] border-[var(--border)]',
  danger: 'bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-[var(--danger)] border-[color-mix(in_srgb,var(--danger)_30%,transparent)]',
  warning: 'bg-[color-mix(in_srgb,var(--warning)_16%,transparent)] text-[var(--warning)] border-[color-mix(in_srgb,var(--warning)_35%,transparent)]',
};

/**
 * Small status label. The 'success' outline style doubles as the
 * "Free forever" badge required by S7/S11.
 * @param props - Tone + children.
 * @returns The rendered badge.
 */
export function Badge({ tone = 'neutral', children, className = '' }: BadgeProps): JSX.Element {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5',
        'text-xs font-semibold whitespace-nowrap',
        TONE_CLASSES[tone],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
