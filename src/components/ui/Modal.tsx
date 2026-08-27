import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export interface ModalProps {
  /** Controls visibility. */
  open: boolean;
  /** Called on backdrop click, Escape, or close button. */
  onClose: () => void;
  /** Dialog title (used as accessible name). */
  title: string;
  /** Dialog body. */
  children: ReactNode;
}

/**
 * Accessible modal dialog (S6): aria-modal, labelled by title, Escape
 * closes, focus moves in on open (preferring an [autofocus] field so
 * search boxes are live immediately) and back on close, body scroll
 * locks, content capped at 90vh with internal scroll (viewport rules).
 * The focus routine runs once per open and is immune to the parent
 * re-rendering with a fresh onClose identity.
 * @param props - open/onClose/title/children.
 * @returns The dialog, or null when closed.
 */
export function Modal({ open, onClose, title, children }: ModalProps): JSX.Element | null {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  // Keep the latest handler without re-running the focus effect.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    // Prefer an explicit autofocus target (e.g. a search input),
    // otherwise park focus on the close button.
    const auto = panelRef.current?.querySelector<HTMLElement>('[autofocus]');
    (auto ?? closeRef.current)?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px] cursor-default animate-[fadeIn_150ms_ease-out]"
        onClick={() => onCloseRef.current()}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl animate-[slideUp_220ms_ease-out]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)] bg-[var(--card)]">
          <h2 className="text-base font-bold text-[var(--fg)] truncate">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => onCloseRef.current()}
            aria-label="Close"
            className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
