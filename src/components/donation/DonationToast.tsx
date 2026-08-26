import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../../lib/core/constants';
import { getFlags, saveFlags } from '../../lib/db/db';
import {
  DONATION_LINKS,
  DONATION_TAGLINE,
  flagsAfterPromptDismissed,
  flagsAfterPromptShown,
  shouldShowDonationPrompt,
} from '../../lib/donation';
import { isFeatureEnabled } from '../../lib/features';
import { useApp } from '../../store';

/**
 * Donation prompt (S11): appears at most once per session and per day,
 * never before the 5th tool use, and never within 7 days of a
 * dismissal. Halal framing, no guilt, external links only.
 * @returns The prompt card, or null when not eligible.
 */
export function DonationToast(): JSX.Element | null {
  const [visible, setVisible] = useState(false);
  const module = useApp((s) => s.module);

  useEffect(() => {
    if (module === 'privacy' || module === 'terms') return;
    if (!isFeatureEnabled('donations')) return;
    let cancelled = false;
    void (async () => {
      try {
        const flags = await getFlags();
        const useCount = flags.useCount + 1;
        await saveFlags({ useCount });
        const sessionShown =
          typeof sessionStorage !== 'undefined' &&
          sessionStorage.getItem(STORAGE_KEYS.donationSessionShown) === '1';
        const eligible = shouldShowDonationPrompt({
          useCount,
          donationDismissedAt: flags.donationDismissedAt,
          lastToastDate: flags.lastToastDate,
          sessionShown,
          now: new Date(),
        });
        if (!eligible || cancelled) return;
        const updated = await getFlags();
        await saveFlags(flagsAfterPromptShown(updated, new Date()));
        sessionStorage.setItem(STORAGE_KEYS.donationSessionShown, '1');
        setVisible(true);
      } catch {
        // IndexedDB unavailable: prompt silently skipped.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [module]);

  /** Dismisses and starts the 7-day cooldown. */
  async function dismiss(): Promise<void> {
    setVisible(false);
    try {
      const flags = await getFlags();
      await saveFlags(flagsAfterPromptDismissed(flags, new Date()));
    } catch {
      // Non-fatal: cooldown applies from next session at worst.
    }
  }

  if (!visible) return null;
  const kofi = DONATION_LINKS.find((l) => l.primary) ?? DONATION_LINKS[0];

  return (
    <div aria-live="polite" className="fixed bottom-24 sm:bottom-4 left-4 z-[55] w-[calc(100%-2rem)] max-w-sm pointer-events-none">
      <div
        role="status"
        className="pointer-events-auto rounded-xl border border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] border-l-4 border-l-[var(--accent)] bg-[var(--card)] shadow-2xl p-4 animate-[slideIn_240ms_ease-out]"
      >
        <p className="text-sm font-extrabold text-[var(--fg)]">SalahKit is free forever</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{DONATION_TAGLINE}</p>
        <div className="mt-3 flex items-center gap-2">
          <a
            href={kofi.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void dismiss()}
            className="inline-flex h-10 items-center rounded-lg bg-[var(--accent)] px-3.5 text-xs font-bold text-[#3b2305] hover:brightness-105 active:scale-[0.97] transition-all whitespace-nowrap"
          >
            Support on Ko-fi
          </a>
          <button
            type="button"
            onClick={() => void dismiss()}
            className="inline-flex h-10 items-center rounded-lg px-3 text-xs font-bold text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
