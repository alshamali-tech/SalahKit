/**
 * Display formatting helpers (S3: utils/format.ts).
 * Pure formatting - no state, no framework imports.
 */
import { HIJRI_MONTHS } from '../core/constants';
import type { HijriDate } from '../core/types';

/**
 * Formats a Date as a clock time, e.g. "5:03 AM" or "17:03".
 * @param date - Date to format.
 * @param hour12 - Use 12-hour clock (default true).
 * @returns Locale-aware time string.
 */
export function formatClockTime(date: Date, hour12 = true): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12,
  });
}

/**
 * Formats a full human date, e.g. "Friday, 20 March 2026".
 * @param date - Date to format.
 * @returns Locale-aware long date string.
 */
export function formatFullDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formats a short date, e.g. "20 Mar 2026".
 * @param date - Date to format.
 * @returns Locale-aware short date string.
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats a Hijri date, e.g. "1 Ramadan 1447 AH".
 * @param hijri - Hijri year/month/day.
 * @returns Formatted Hijri date string.
 */
export function formatHijriLong(hijri: HijriDate): string {
  const monthName = HIJRI_MONTHS[hijri.month - 1] ?? '';
  return `${hijri.day} ${monthName} ${hijri.year} AH`;
}

/** Zero-pads to two digits.
 * @param n - Non-negative integer.
 * @returns Two-character string.
 */
function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Formats a remaining duration as HH:MM:SS.
 * @param ms - Remaining milliseconds (negatives render as 00:00:00).
 * @returns Countdown string.
 */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

/**
 * Formats a number with locale thousands separators.
 * @param n - Number to format.
 * @param decimals - Maximum fraction digits (default 0).
 * @returns Formatted number string.
 */
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a currency amount, e.g. "$1,250.00".
 * @param n - Amount.
 * @param currency - ISO 4217 code (default USD).
 * @returns Formatted currency string.
 */
export function formatCurrency(n: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${currency} ${formatNumber(n, 2)}`;
  }
}

/**
 * Formats a distance in km with sensible precision.
 * @param km - Distance in kilometers.
 * @returns E.g. "8,452 km" or "312.4 km".
 */
export function formatDistanceKm(km: number): string {
  return km >= 100 ? `${formatNumber(Math.round(km))} km` : `${formatNumber(km, 1)} km`;
}

/**
 * Truncates text with an ellipsis when it exceeds a length.
 * @param text - Source text.
 * @param max - Maximum characters before truncation.
 * @returns Original or truncated string.
 */
export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, Math.max(1, max - 1)).trimEnd()}…`;
}
