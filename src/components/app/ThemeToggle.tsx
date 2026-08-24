import { useApp } from '../../store';

/**
 * Theme toggle (S9 component list). Theme lives in localStorage only
 * and is applied via [data-theme] (S6/S7).
 * @returns The toggle button.
 */
export function ThemeToggle(): JSX.Element {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-pressed={!isLight}
      className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg text-[var(--fg)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
    >
      <span
        key={theme}
        className="inline-flex animate-[fadeIn_200ms_ease-out]"
        aria-hidden="true"
      >
        {isLight ? (
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M16.5 11.5A7 7 0 0 1 8.5 3.5a7 7 0 1 0 8 8z" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="10" cy="10" r="4" />
            <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M16 4l-1.4 1.4M5.4 14.6L4 16" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
