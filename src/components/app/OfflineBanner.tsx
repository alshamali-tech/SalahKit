import { useApp } from '../../store';

/**
 * Offline notice strip (S5: "offline mode" badge, UI never blocked).
 * Visible only while the browser reports no connectivity.
 * @returns The banner, or null when online.
 */
export function OfflineBanner(): JSX.Element | null {
  const online = useApp((s) => s.online);
  if (online) return null;
  return (
    <div
      role="status"
      className="border-b border-[color-mix(in_srgb,var(--warning)_35%,transparent)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)]"
    >
      <p className="mx-auto max-w-7xl px-4 py-2 text-xs font-semibold text-[var(--warning)] flex items-center gap-2 flex-wrap">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M2.5 7.5a11 11 0 0 1 15 0M5.5 10.7a7 7 0 0 1 9 0M8.5 13.8a3 3 0 0 1 3 0M10 16.5v.01" strokeLinecap="round" />
          <path d="M3 3l14 14" strokeLinecap="round" />
        </svg>
        Offline mode — every tool still works. Your data never leaves this device.
      </p>
    </div>
  );
}
