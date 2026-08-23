/**
 * Input guards for SalahKit. Every public UI input flows through here.
 * Pure TypeScript — no framework imports, no side effects.
 */
import { TASBIH_MAX_COUNT } from './constants';

/**
 * Type guard for real, usable numbers (rejects NaN and Infinity).
 * @param value - Unknown input.
 * @returns True when value is a finite number.
 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Clamps a number into [min, max].
 * @param n - Input number.
 * @param min - Lower bound.
 * @param max - Upper bound.
 * @returns Clamped value.
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Validates a latitude value.
 * @param value - Unknown input.
 * @returns True when value is a finite number in [-90, 90].
 */
export function isValidLatitude(value: unknown): value is number {
  return isFiniteNumber(value) && value >= -90 && value <= 90;
}

/**
 * Validates a longitude value.
 * @param value - Unknown input.
 * @returns True when value is a finite number in [-180, 180].
 */
export function isValidLongitude(value: unknown): value is number {
  return isFiniteNumber(value) && value >= -180 && value <= 180;
}

/**
 * Parses a string into a finite number with a fallback.
 * @param raw - Raw string input.
 * @param fallback - Value returned when parsing fails.
 * @returns Parsed number or fallback.
 */
export function parseNumber(raw: string, fallback: number): number {
  const trimmed = raw.trim();
  if (trimmed === '') return fallback;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Strict YYYY-MM-DD validation, including real calendar dates.
 * @param value - Candidate date string.
 * @returns True for valid ISO calendar dates only.
 */
export function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const probe = new Date(Date.UTC(y, m - 1, d));
  return (
    probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d
  );
}

/**
 * Local date formatted as YYYY-MM-DD.
 * @param date - Date to format (defaults to now).
 * @returns ISO calendar date string in local time.
 */
export function toISODate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Sanitizes a tasbih/dhikr count: integer, clamped to [0, TASBIH_MAX_COUNT].
 * @param value - Unknown input.
 * @returns Safe non-negative integer count.
 */
export function sanitizeCount(value: unknown): number {
  const n = isFiniteNumber(value) ? value : 0;
  return clamp(Math.floor(n), 0, TASBIH_MAX_COUNT);
}

/**
 * Type guard for non-empty, non-whitespace strings.
 * @param value - Unknown input.
 * @returns True for usable strings.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Asserts a value is a finite number; throws otherwise.
 * @param value - Value to check.
 * @param name - Field name used in the error message.
 * @throws TypeError when value is not a finite number.
 */
export function assertFinite(value: unknown, name: string): void {
  if (!isFiniteNumber(value)) {
    throw new TypeError(`SalahKit: "${name}" must be a finite number.`);
  }
}

/**
 * Validates Hijri calendar components.
 * @param year - Hijri year.
 * @param month - Month 1-12.
 * @param day - Day 1-30.
 * @returns True when all components are in range.
 */
export function isValidHijri(year: number, month: number, day: number): boolean {
  return (
    Number.isInteger(year) &&
    year >= 1 &&
    year <= 9999 &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12 &&
    Number.isInteger(day) &&
    day >= 1 &&
    day <= 30
  );
}
