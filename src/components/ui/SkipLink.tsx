/**
 * Keyboard skip link — first focusable element on the page (S6).
 * @returns An anchor that jumps to the main content.
 */
export function SkipLink(): JSX.Element {
  return (
    <a
      href="#main-content"
      className={[
        'sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]',
        'focus:inline-flex focus:h-11 focus:items-center focus:rounded-lg focus:bg-[var(--primary)]',
        'focus:px-4 focus:text-sm focus:font-bold focus:text-[var(--primary-fg)] focus:shadow-lg',
      ].join(' ')}
    >
      Skip to content
    </a>
  );
}
