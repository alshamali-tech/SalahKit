import { useCallback, useEffect, useState } from 'react';
import { onToast } from '../../lib/messaging';
import type { ToastMessage, ToastTone } from '../../lib/messaging';

const TONE_STYLES: Readonly<Record<ToastTone, { border: string; iconColor: string }>> = {
  info: { border: 'border-l-[var(--primary)]', iconColor: 'text-[var(--primary)]' },
  success: { border: 'border-l-[var(--success)]', iconColor: 'text-[var(--success)]' },
  warning: { border: 'border-l-[var(--warning)]', iconColor: 'text-[var(--warning)]' },
  danger: { border: 'border-l-[var(--danger)]', iconColor: 'text-[var(--danger)]' },
};

/**
 * Renders the toast stack. Subscribes to the messaging bus; announces
 * via an aria-live polite region (S6). Auto-dismisses per toast.
 * @returns The fixed toast host.
 */
export function ToastHost(): JSX.Element {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    const unsubscribe = onToast((toast) => {
      setToasts((prev) => [...prev.slice(-2), toast]);
      timers.push(window.setTimeout(() => dismiss(toast.id), toast.durationMs));
    });
    return () => {
      unsubscribe();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [dismiss]);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-[60] flex flex-col gap-2 sm:w-80 pointer-events-none"
    >
      {toasts.map((toast) => {
        const tone = TONE_STYLES[toast.tone];
        return (
          <div
            key={toast.id}
            role="status"
            className={[
              'pointer-events-auto rounded-lg border border-[var(--border)] border-l-4 bg-[var(--card)] shadow-lg p-3 flex items-start gap-2.5',
              'animate-[slideIn_200ms_ease-out]',
              tone.border,
            ].join(' ')}
          >
            <svg
              aria-hidden="true"
              className={`shrink-0 mt-0.5 ${tone.iconColor}`}
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              {toast.tone === 'success' ? (
                <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
              ) : toast.tone === 'danger' ? (
                <path d="M10 5v6M10 14.5v.5" strokeLinecap="round" />
              ) : (
                <path d="M10 9v6M10 5v.5" strokeLinecap="round" />
              )}
              <circle cx="10" cy="10" r="8.2" opacity="0.5" />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--fg)] truncate">{toast.title}</p>
              {toast.body ? <p className="text-xs text-[var(--muted)] mt-0.5">{toast.body}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
