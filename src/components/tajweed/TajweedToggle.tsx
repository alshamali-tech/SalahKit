export interface TajweedToggleProps {
  /** Whether the tajweed overlay is on. */
  on: boolean;
  /** Change handler. */
  onChange: (on: boolean) => void;
}

/**
 * Compact overlay switch shared by the Quran Reader and Hifz Trainer.
 * Toggles the colored tajweed annotation on the Arabic text.
 * @param props - on/onChange.
 * @returns The toggle button.
 */
export function TajweedToggle({ on, onChange }: TajweedToggleProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      aria-label="Toggle tajweed color overlay"
      className={[
        'inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs font-bold transition-all duration-150 whitespace-nowrap',
        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)] active:scale-[0.97]',
        on
          ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)] shadow-sm'
          : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--primary)]',
      ].join(' ')}
    >
      <span aria-hidden="true" className="flex items-center gap-[3px]">
        <span className="h-2 w-2 rounded-full bg-[#2b8a3e]" />
        <span className="h-2 w-2 rounded-full bg-[#c92a2a]" />
        <span className="h-2 w-2 rounded-full bg-[#1864ab]" />
        <span className="h-2 w-2 rounded-full bg-[#862e9c]" />
      </span>
      <span className="arabic text-sm leading-none">تجويد</span>
      <span>{on ? 'On' : 'Off'}</span>
    </button>
  );
}
