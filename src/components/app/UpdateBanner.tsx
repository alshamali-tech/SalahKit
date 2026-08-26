import { useEffect, useState } from 'react';
import { applyUpdate, checkForUpdates, onUpdateStatus } from '../../lib/sw-update';
import type { UpdateStatus } from '../../lib/sw-update';
import { emitToast } from '../../lib/messaging';

/**
 * Floating "new version available" pill. Appears only when the service
 * worker has a pending update, and applies it with one tap. Sits above
 * the audio dock on mobile.
 * @returns The banner, or null when no update is pending.
 */
export function UpdateBanner(): JSX.Element | null {
  const [status, setStatus] = useState<UpdateStatus>('unsupported');
  const [checking, setChecking] = useState(false);

  useEffect(() => onUpdateStatus(setStatus), []);

  /** Manual check from the banner's secondary action. */
  async function recheck(): Promise<void> {
    setChecking(true);
    const result = await checkForUpdates();
    setChecking(false);
    if (result === 'up-to-date') {
      emitToast({ title: 'You’re on the latest version', tone: 'success' });
    }
  }

  if (status !== 'update-available') return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-[70] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 sm:bottom-5">
      <div
        role="status"
        className="flex items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] bg-[var(--card)] p-3 shadow-2xl shadow-teal-950/25 animate-[slideUp_240ms_ease-out]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M10 3v8m0 0l-3-3m3 3l3-3M4 15.5h12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-[var(--fg)]">A new version of SalahKit is ready</p>
          <p className="text-[11px] text-[var(--muted)]">Reload to get the latest features — your data is safe.</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => void recheck()}
            disabled={checking}
            className="inline-flex h-9 items-center rounded-lg px-2.5 text-xs font-bold text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)] transition-colors disabled:opacity-50"
          >
            {checking ? 'Checking…' : 'Later'}
          </button>
          <button
            type="button"
            onClick={applyUpdate}
            className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-3.5 text-xs font-bold text-[var(--primary-fg)] hover:brightness-110 active:scale-[0.97] transition-all"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
