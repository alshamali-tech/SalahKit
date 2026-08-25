import { DONATION_LINKS, DONATION_TAGLINE } from '../../lib/donation';
import { useApp } from '../../store';
import { Badge } from './Badge';
import type { ModuleId } from '../../types';

interface NavItem {
  module: ModuleId;
  label: string;
  /** Inline SVG path data (20x20 viewBox, stroked). */
  d: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: readonly NavSection[] = [
  {
    title: 'Daily',
    items: [
      { module: 'prayer', label: 'Prayer Times', d: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM10 6v4l2.6 2.6' },
      { module: 'qibla', label: 'Qibla Compass', d: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM13.2 6.8l-1.9 4.5-4.5 1.9 1.9-4.5z' },
      { module: 'hijri', label: 'Hijri Converter', d: 'M15 12.8A6.2 6.2 0 0 1 7.2 5a6.2 6.2 0 1 0 7.8 7.8z' },
      { module: 'calendar', label: 'Hijri Calendar', d: 'M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 8h14M6.8 1.8V5M13.2 1.8V5' },
      { module: 'tracker', label: 'Prayer Tracker', d: 'M3.5 5.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2zM6.8 10.4l2.2 2.2 4.4-5' },
    ],
  },
  {
    title: 'Knowledge',
    items: [
      { module: 'quran', label: 'Quran Reader', d: 'M10 4.6C8.2 3.3 5.6 3 3.5 3.5v12c2.1-.5 4.7-.2 6.5 1.1 1.8-1.3 4.4-1.6 6.5-1.1v-12c-2.1-.5-4.7-.2-6.5 1.1zM10 4.6v12' },
      { module: 'tajweed', label: 'Tajweed', d: 'M4 4h12v12H4zM7 7.4c1 1 2.5 1 3 0M11.5 7.4c.5 1 2 1 3 0M7.5 11h5M8.5 13.4h3' },
      { module: 'hadith', label: 'Hadith Library', d: 'M3.5 3.5h13v13h-13zM6.5 7h7M6.5 10h7M6.5 13h4.5' },
      { module: 'duas', label: 'Duas & Adhkar', d: 'M10 16.2s-6.2-4-6.2-8.2a3.5 3.5 0 0 1 6.2-2 3.5 3.5 0 0 1 6.2 2c0 4.2-6.2 8.2-6.2 8.2z' },
      { module: 'names', label: '99 Names', d: 'M10 2.3l2.3 4.7 5.1.8-3.7 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.7-3.6 5.1-.8z' },
    ],
  },
  {
    title: 'Practice',
    items: [
      { module: 'dhikr', label: 'Dhikr Counter', d: 'M10 2.8a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4zM10 7.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z' },
      { module: 'zakat', label: 'Zakat Calculator', d: 'M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM10 6v8M7.7 8h3.6a1.6 1.6 0 0 1 0 3.2H8.7a1.6 1.6 0 0 0 0 3.2h3.6' },
      { module: 'hifz', label: 'Hifz Trainer', d: 'M10 4.6C8.2 3.3 5.6 3 3.5 3.5v12c2.1-.5 4.7-.2 6.5 1.1 1.8-1.3 4.4-1.6 6.5-1.1v-12c-2.1-.5-4.7-.2-6.5 1.1zM10 4.6v12M7 9l2 2 4-4.6' },
    ],
  },
  {
    title: 'About',
    items: [
      { module: 'privacy', label: 'Privacy Policy', d: 'M10 2.3l6.2 2.5v5.1c0 4.1-2.8 6.7-6.2 7.8-3.4-1.1-6.2-3.7-6.2-7.8V4.8zM7.4 10l1.9 1.9 3.4-3.8' },
      { module: 'terms', label: 'Terms of Service', d: 'M5 2.5h7l3 3.2V17.5H5zM12 2.5v3.2h3M7.5 9.5h5M7.5 12.5h5' },
    ],
  },
];

export interface SidebarProps {
  /** When provided, renders as a mobile drawer with backdrop. */
  onClose?: () => void;
}

/**
 * Navigation sidebar (S7: 240px, collapses below 768px into a drawer).
 * @param props - Optional onClose enabling drawer mode.
 * @returns Desktop aside or mobile drawer.
 */
export function Sidebar({ onClose }: SidebarProps): JSX.Element {
  const { module, setModule, setSettingsOpen } = useApp();
  const kofi = DONATION_LINKS.find((l) => l.primary) ?? DONATION_LINKS[0];

  const nav = (
    <>
      <div className="px-3 pt-4 pb-2 flex items-center justify-between gap-2">
        <Badge tone="success">Free forever</Badge>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>

      <nav aria-label="Tool modules" className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = module === item.module;
                return (
                  <li key={item.module}>
                    <button
                      type="button"
                      onClick={() => setModule(item.module)}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'w-full flex items-center gap-2.5 rounded-lg px-2.5 h-10 text-sm min-w-0 transition-all duration-150',
                        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                        active
                          ? 'bg-[color-mix(in_srgb,var(--primary)_13%,transparent)] text-[var(--primary)] font-bold'
                          : 'text-[var(--fg)] opacity-80 hover:opacity-100 hover:bg-[var(--hover)] font-medium',
                      ].join(' ')}
                    >
                      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                        <path d={item.d} />
                      </svg>
                      <span className="truncate">{item.label}</span>
                      {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0" aria-hidden="true" /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-[var(--border)]">
        <div className="rounded-xl bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] p-3">
          <p className="text-xs font-semibold text-[var(--fg)] leading-snug">{DONATION_TAGLINE}</p>
          <div className="mt-2.5 flex gap-2">
            <a
              href={kofi.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-lg bg-[var(--accent)] px-3 text-xs font-bold text-[#3b2305] hover:brightness-105 active:scale-[0.97] transition-all whitespace-nowrap"
            >
              Ko-fi
            </a>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-bold text-[var(--fg)] hover:border-[var(--accent)] transition-colors whitespace-nowrap"
            >
              More
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="absolute inset-0 bg-black/55 backdrop-blur-[2px] animate-[fadeIn_150ms_ease-out] cursor-default"
        />
        <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-r border-[var(--border)] bg-[var(--card)] shadow-2xl animate-[slideIn_200ms_ease-out]">
          {nav}
        </aside>
      </div>
    );
  }

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] self-start sticky top-20 max-h-[calc(100vh-6rem)]">
      {nav}
    </aside>
  );
}
