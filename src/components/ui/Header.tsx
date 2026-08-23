import { DONATION_LINKS } from '../../lib/donation';
import { useApp } from '../../store';
import { Badge } from './Badge';

/**
 * App header: wordmark, connectivity status, theme toggle,
 * donation shortcut, settings and mobile menu trigger.
 * @returns The rendered header bar.
 */
export function Header(): JSX.Element {
  const { theme, setTheme, online, setSettingsOpen, setSidebarOpen, module } = useApp();
  const kofi = DONATION_LINKS.find((l) => l.primary) ?? DONATION_LINKS[0];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--fg)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
          </svg>
        </button>

        <a href="#main-content" className="flex items-center gap-2.5 min-w-0" aria-label="SalahKit home">
          <img src="/favicon.svg" alt="" width="30" height="30" className="shrink-0 rounded-lg" />
          <span className="text-lg font-extrabold tracking-tight text-[var(--fg)] whitespace-nowrap">
            Salah<span className="text-[var(--primary)]">Kit</span>
          </span>
        </a>

        <span className="ml-2 hidden sm:inline-flex">
          <Badge tone={online ? 'success' : 'warning'}>
            <span
              className={[
                'h-1.5 w-1.5 rounded-full',
                online ? 'bg-[var(--success)]' : 'bg-[var(--warning)] animate-[pulseDot_1.6s_ease-in-out_infinite]',
              ].join(' ')}
              aria-hidden="true"
            />
            {online ? 'Online' : 'Offline · still works'}
          </Badge>
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <a
            href={kofi.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xs:inline-flex sm:inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 text-sm font-bold text-[#3b2305] hover:brightness-105 active:scale-[0.97] transition-all whitespace-nowrap"
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 2C9 4 9 6 12 8c-3 2-5 1-6-1M4 10h9a3 3 0 0 1 0 6H7a3 3 0 0 1-3-3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Support</span>
          </a>

          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--fg)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
          >
            {theme === 'light' ? (
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M16.5 11.5A7 7 0 0 1 8.5 3.5a7 7 0 1 0 8 8z" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <circle cx="10" cy="10" r="4" />
                <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M16 4l-1.4 1.4M5.4 14.6L4 16" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
            className={[
              'inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors',
              module === 'privacy' || module === 'terms' ? 'text-[var(--primary)]' : 'text-[var(--fg)]',
            ].join(' ')}
          >
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="10" cy="10" r="2.6" />
              <path d="M10 1.8l1 2.3a6 6 0 0 1 2 .8l2.4-.7 1.4 2.4-1.5 1.9a6 6 0 0 1 0 2.3l1.5 1.9-1.4 2.4-2.4-.7a6 6 0 0 1-2 .8l-1 2.3H8l-1-2.3a6 6 0 0 1-2-.8l-2.4.7L1.2 13l1.5-1.9a6 6 0 0 1 0-2.3L1.2 6.9l1.4-2.4 2.4.7a6 6 0 0 1 2-.8l1-2.3z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
