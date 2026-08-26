import { useEffect, useRef, useState } from 'react';
import { LOCALES } from '../../lib/i18n';
import { useT } from '../../lib/use-locale';

/**
 * Interface language switcher (S16). Opens a dropdown of every
 * supported language, listed in its native script. Selecting one
 * re-renders the UI and flips <html dir> for RTL locales.
 * @returns The switcher button + dropdown.
 */
export function LanguageSwitcher(): JSX.Element {
  const { locale, setLocale, t } = useT();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent): void => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('nav.language')}
        title={t('nav.language')}
        className="inline-flex h-11 items-center gap-1.5 rounded-lg px-2.5 text-sm font-bold text-[var(--fg)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" />
          <path d="M2.5 10h15M10 2.5c-2.2 2-3.3 4.6-3.3 7.5S7.8 15.5 10 17.5c2.2-2 3.3-4.6 3.3-7.5S12.2 4.5 10 2.5z" strokeLinecap="round" />
        </svg>
        <span className="uppercase tracking-wide">{locale.id}</span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t('nav.language')}
          className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-xl animate-[fadeIn_150ms_ease-out]"
        >
          {LOCALES.map((l) => {
            const active = l.id === locale.id;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLocale(l.id);
                    setOpen(false);
                  }}
                  className={[
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-[var(--primary)]',
                    active ? 'bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] font-bold text-[var(--primary)]' : 'text-[var(--fg)] hover:bg-[var(--hover)]',
                  ].join(' ')}
                >
                  <span className={l.rtl ? 'arabic text-base leading-none' : ''}>{l.native}</span>
                  {active ? (
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                      <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[11px] font-semibold text-[var(--muted)]">{l.english}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
