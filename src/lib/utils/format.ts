/**
 * Display formatting helpers (S3: utils/format.ts).
 * Pure formatting — no state, no framework imports. All locale-aware
 * helpers honour the active UI language, set by the i18n layer via
 * setFormatLocale (so dates, numbers and currency render in Arabic
 * when the interface is Arabic).
 */
import { HIJRI_MONTHS, HIJRI_MONTHS_AR } from '../core/constants';
import type { HijriDate } from '../core/types';

/** Active UI language tag (BCP-47), defaulting to English. */
let activeLocale = 'en';

/**
 * Sets the locale used by every formatter below.
 * @param tag - BCP-47 language tag, e.g. 'en' or 'ar'.
 */
export function setFormatLocale(tag: string): void {
  activeLocale = tag && tag.length > 0 ? tag : 'en';
}

/** @returns The active locale tag. */
export function getFormatLocale(): string {
  return activeLocale;
}

/**
 * Formats a Date as a clock time, e.g. "5:03 AM" or "٥:٠٣ ص".
 * @param date - Date to format.
 * @param hour12 - Use 12-hour clock (default true).
 * @returns Locale-aware time string.
 */
export function formatClockTime(date: Date, hour12 = true): string {
  return date.toLocaleTimeString(activeLocale, {
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
  return date.toLocaleDateString(activeLocale, {
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
  return date.toLocaleDateString(activeLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats a weekday abbreviation, e.g. "Mon" / "الاثنين".
 * @param date - Date to format.
 * @returns Locale-aware short weekday.
 */
export function formatWeekday(date: Date): string {
  return date.toLocaleDateString(activeLocale, { weekday: 'short' });
}

/**
 * Formats a Hijri date, e.g. "1 Ramadan 1447 AH" — month names switch
 * to Arabic script when the UI language is Arabic.
 * @param hijri - Hijri year/month/day.
 * @returns Formatted Hijri date string.
 */
export function formatHijriLong(hijri: HijriDate): string {
  const months = activeLocale === 'ar' ? HIJRI_MONTHS_AR : HIJRI_MONTHS;
  const monthName = months[hijri.month - 1] ?? '';
  const num = (n: number): string => n.toLocaleString(activeLocale);
  return activeLocale === 'ar'
    ? `${num(hijri.day)} ${monthName} ${num(hijri.year)} هـ`
    : `${num(hijri.day)} ${monthName} ${num(hijri.year)} AH`;
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
 * @returns Countdown string (always Latin digits for tabular alignment).
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
  return n.toLocaleString(activeLocale, {
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
    return new Intl.NumberFormat(activeLocale, {
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
