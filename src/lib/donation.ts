/**
 * Donation configuration & timing logic (S3: lib/donation.ts, S11).
 * External links only (Ko-fi / Buy Me a Coffee / PayPal) - SalahKit
 * never processes payments. Pure decision functions over user flags.
 */
import { DONATION_COOLDOWN_MS, DONATION_MIN_USE_COUNT } from './core/constants';
import { toISODate } from './core/validator';
import type { UserFlagsRow } from '../types';

/** One external donation destination. */
export interface DonationLink {
  /** Stable identifier. */
  id: 'kofi' | 'bmc' | 'paypal';
  /** Button label. */
  label: string;
  /** External URL (opens in a new tab with rel="noopener"). */
  url: string;
  /** True for the primary destination shown first. */
  primary: boolean;
}

/** Configured donation destinations (S11: Ko-fi primary, BMC, PayPal). */
export const DONATION_LINKS: readonly DonationLink[] = [
  { id: 'kofi', label: 'Ko-fi', url: 'https://ko-fi.com/salahkit', primary: true },
  { id: 'bmc', label: 'Buy Me a Coffee', url: 'https://www.buymeacoffee.com/salahkit', primary: false },
  { id: 'paypal', label: 'PayPal', url: 'https://www.paypal.com/donate/?hosted_button_id=salahkit', primary: false },
];

/** Halal, guilt-free framing used everywhere donations appear (S11). */
export const DONATION_TAGLINE =
  'Free forever. No ads. If this helps, consider a sadaqah.';

/** Input snapshot for the donation prompt decision. */
export interface DonationPromptInput {
  /** Tool uses so far (from userFlags). */
  useCount: number;
  /** ISO datetime of last dismissal, or null. */
  donationDismissedAt: string | null;
  /** YYYY-MM-DD the toast last showed, or null. */
  lastToastDate: string | null;
  /** Whether a prompt already appeared this browser session. */
  sessionShown: boolean;
  /** Current time (injectable for tests). */
  now: Date;
}

/**
 * Donation prompt gate (S11): at most 1 toast per session and per day,
 * never on a first visit, only after DONATION_MIN_USE_COUNT tool uses,
 * and never within DONATION_COOLDOWN_MS of a dismissal.
 * @param input - Current flags and context.
 * @returns True when the gentle prompt may be shown.
 */
export function shouldShowDonationPrompt(input: DonationPromptInput): boolean {
  if (input.useCount < DONATION_MIN_USE_COUNT) return false;
  if (input.sessionShown) return false;
  const today = toISODate(input.now);
  if (input.lastToastDate === today) return false;
  if (input.donationDismissedAt !== null) {
    const dismissed = Date.parse(input.donationDismissedAt);
    if (Number.isFinite(dismissed) && input.now.getTime() - dismissed < DONATION_COOLDOWN_MS) {
      return false;
    }
  }
  return true;
}

/**
 * Flags update after a prompt is shown (marks today; does NOT start cooldown).
 * @param flags - Current flags row.
 * @param now - Current time.
 * @returns Patch to persist via saveFlags.
 */
export function flagsAfterPromptShown(
  flags: UserFlagsRow,
  now: Date
): Partial<UserFlagsRow> {
  return { ...pickIdentity(flags), lastToastDate: toISODate(now) };
}

/**
 * Flags update after the user dismisses the prompt (starts 7-day cooldown).
 * @param flags - Current flags row.
 * @param now - Current time.
 * @returns Patch to persist via saveFlags.
 */
export function flagsAfterPromptDismissed(
  flags: UserFlagsRow,
  now: Date
): Partial<UserFlagsRow> {
  return { ...pickIdentity(flags), donationDismissedAt: now.toISOString() };
}

/** Keeps id and useCount untouched in a patch. */
function pickIdentity(flags: UserFlagsRow): Pick<UserFlagsRow, 'id' | 'useCount'> {
  return { id: flags.id, useCount: flags.useCount };
}
