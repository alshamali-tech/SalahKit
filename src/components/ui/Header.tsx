import { DONATION_LINKS } from '../../lib/donation';
import { navigate } from '../../lib/router';
import { useT } from '../../lib/use-locale';
import { useApp } from '../../store';
import { Badge } from './Badge';
import { ThemeToggle } from '../app/ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * App header: wordmark, connectivity status, language switcher, theme
 * toggle, donation shortcut, settings and mobile menu trigger.
 * @returns The rendered header bar.
 */
export function Header(): JSX.Element {
  const { view, online, setSettingsOpen, setSidebarOpen, module } = useApp();
  const { t } = useT();
  const kofi = DONATION_LINKS.find((l) => l.primary) ?? DONATION_LINKS[0];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label={t('nav.openMenu')}
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--fg)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          aria-label={t('nav.home')}
        >
          <img src="/favicon.svg" alt="" width="30" height="30" className="shrink-0 rounded-lg" />
          <span className="text-lg font-extrabold tracking-tight text-[var(--fg)] whitespace-nowrap">
            Salah<span className="text-[var(--primary)]">Kit</span>
          </span>
        </button>

        <span className="ml-2 hidden sm:inline-flex">
          <Badge tone={online ? 'success' : 'warning'}>
            <span
              className={[
                'h-1.5 w-1.5 rounded-full',
                online ? 'bg-[var(--success)]' : 'bg-[var(--warning)] animate-[pulseDot_1.6s_ease-in-out_infinite]',
              ].join(' ')}
              aria-hidden="true"
            />
            {online ? t('badges.online') : t('badges.offline')}
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
            <span className="hidden sm:inline">{t('nav.support')}</span>
          </a>

          <LanguageSwitcher />
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label={t('nav.settings')}
            className={[
              'inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors',
              module === 'privacy' || module === 'terms' ? 'text-[var(--primary)]' : 'text-[var(--fg)]',
            ].join(' ')}
          >
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="10" cy="10" r="2.8" />
              <path
                d="M10 1l1.1 2.3c.7.1 1.4.4 2 .7l2.4-.9 1.5 1.5-.9 2.4c.3.6.6 1.3.7 2L19.1 10l-2.3 1.1c-.1.7-.4 1.4-.7 2l.9 2.4-1.5 1.5-2.4-.9c-.6.3-1.3.6-2 .7L10 19.1l-1.1-2.3c-.7-.1-1.4-.4-2-.7l-2.4.9-1.5-1.5.9-2.4c-.3-.6-.6-1.3-.7-2L.9 10l2.3-1.1c.1-.7.4-1.4.7-2L3 4.5l1.5-1.5 2.4.9c.6-.3 1.3-.6 2-.7L10 1z"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
