/**
 * High-latitude adjustment (P0: religious accuracy).
 * Above ~48° latitude in summer the sun never reaches the twilight
 * angles, so naive Fajr/Isha collapse. The three standard deterministic
 * rules repair them; the Angle-Based rule is the default and the
 * others remain selectable for parity with major timetables.
 */

/** The three classical adjustment rules. */
export type HighLatRule = 'angle' | 'nightMiddle' | 'seventh';

/** Default rule applied by the engine. */
export const DEFAULT_HIGH_LAT_RULE: HighLatRule = 'angle';

/** Latitude (absolute) beyond which adjustment activates. */
export const HIGH_LAT_THRESHOLD = 48;

/** True when a location needs high-latitude handling. */
export function isHighLatitude(latitude: number): boolean {
  return Math.abs(latitude) >= HIGH_LAT_THRESHOLD;
}

/** Raw hour-of-day times the rules operate on. */
export interface HighLatInput {
  fajr: number;
  sunrise: number;
  /** Sunset (≈ maghrib before the +1 min convention). */
  sunset: number;
  isha: number;
}

/** Adjusted fajr/isha in the same hour-of-day units. */
export interface HighLatOutput {
  fajr: number;
  isha: number;
  /** True when any adjustment was applied. */
  adjusted: boolean;
}

/**
 * Applies the selected high-latitude rule.
 * Night portion = sunset → next sunrise (24h + sunrise − sunset).
 * - angle: clamp Fajr/Isha so twilight never exceeds angle/15 hours;
 * - nightMiddle: Fajr/Isha sit at the middle of the night;
 * - seventh: Fajr/Isha sit one seventh of the night from each end.
 * Broken results (Fajr ≥ sunrise, Isha ≤ sunset) are always repaired
 * with the night-middle fallback regardless of the chosen rule.
 * @param input - Raw hour-of-day times.
 * @param latitude - Observer latitude.
 * @param fajrAngle - Method's Fajr depression angle in degrees.
 * @param ishaAngle - Method's Isha angle (ignored when interval set).
 * @param ishaIntervalMin - Umm al-Qura style fixed interval, if any.
 * @param rule - Adjustment rule.
 * @returns Adjusted fajr/isha plus whether anything changed.
 */
export function adjustHighLatHours(
  input: HighLatInput,
  latitude: number,
  fajrAngle: number,
  ishaAngle: number,
  ishaIntervalMin: number | undefined,
  rule: HighLatRule
): HighLatOutput {
  const { sunrise, sunset } = input;
  let { fajr, isha } = input;
  if (!isHighLatitude(latitude)) return { fajr, isha, adjusted: false };

  const night = 24 + sunrise - sunset;
  const broken = !(fajr < sunrise) || !(isha > sunset) || !(fajr < isha);

  if (rule === 'nightMiddle' || broken) {
    fajr = sunrise - night / 2;
    isha = sunset + night / 2;
    return { fajr, isha, adjusted: true };
  }
  if (rule === 'seventh') {
    fajr = sunrise - night / 7;
    isha = sunset + night / 7;
    return { fajr, isha, adjusted: true };
  }
  // Angle-based: clamp only the portions that exceed the angle's share.
  const fajrLimit = fajrAngle / 15;
  const ishaLimit = ishaIntervalMin !== undefined ? ishaIntervalMin / 60 : ishaAngle / 15;
  let adjusted = false;
  if (sunrise - fajr > fajrLimit) {
    fajr = sunrise - fajrLimit;
    adjusted = true;
  }
  if (isha - sunset > ishaLimit) {
    isha = sunset + ishaLimit;
    adjusted = true;
  }
  return { fajr, isha, adjusted };
}

/** Human-readable labels for the rule picker. */
export const HIGH_LAT_RULE_LABELS: Readonly<Record<HighLatRule, { en: string; ar: string; note: string }>> = {
  angle: { en: 'Angle-based', ar: 'حسب الزاوية', note: 'Clamps twilight to each method’s own angle.' },
  nightMiddle: { en: 'Middle of night', ar: 'منتصف الليل', note: 'Fajr and Isha at the night’s midpoint.' },
  seventh: { en: 'One seventh', ar: 'سُبع الليل', note: 'Fajr and Isha one seventh from each end.' },
};
