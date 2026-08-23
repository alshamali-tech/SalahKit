/**
 * Low-level solar astronomy used by the prayer engine.
 * Implements the NOAA solar position series (declination, equation of time)
 * and the hour-angle equation for a target solar altitude.
 * Pure TypeScript — no side effects, no framework imports.
 */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
const J2000 = 2451545.0;
const DAYS_PER_CENTURY = 36525.0;

/**
 * Converts a calendar date to its Julian Day Number at 12:00 UT (noon).
 * Uses the standard Gregorian-to-JDN algorithm (Fliegel & Van Flandern).
 * @param year - Full Gregorian year (e.g. 2026).
 * @param month - Month, 1-12.
 * @param day - Day of month, 1-31.
 * @returns Julian Day Number (noon epoch).
 */
export function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/**
 * Converts a Julian Day Number back to a Gregorian civil date.
 * Inverse of {@link gregorianToJDN}.
 * @param jdn - Julian Day Number.
 * @returns Tuple [year, month, day].
 */
export function jdnToGregorian(jdn: number): [number, number, number] {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return [year, month, day];
}

/**
 * Julian centuries since J2000.0 for a given Julian Day Number.
 * @param jdn - Julian Day Number (noon epoch).
 * @returns Time in Julian centuries.
 */
export function julianCentury(jdn: number): number {
  return (jdn - J2000) / DAYS_PER_CENTURY;
}

/**
 * Sun declination in degrees (NOAA series).
 * @param t - Julian centuries since J2000.0.
 * @returns Declination in degrees, roughly -23.44 to 23.44.
 */
export function sunDeclinationDeg(t: number): number {
  const l0 = normalizeDeg(280.46646 + 36000.76983 * t);
  const m = normalizeDeg(357.52911 + 35999.05029 * t);
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(m * DEG) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * m * DEG) +
    0.000289 * Math.sin(3 * m * DEG);
  const lambda = normalizeDeg(l0 + c);
  const obliquity = 23.439291 - 0.0130042 * t;
  return Math.asin(Math.sin(obliquity * DEG) * Math.sin(lambda * DEG)) * RAD;
}

/**
 * Equation of time in minutes (NOAA series).
 * Add to apparent solar time to obtain mean solar time.
 * @param t - Julian centuries since J2000.0.
 * @returns Equation of time in minutes (range approx -14.3 to +16.4).
 */
export function equationOfTimeMin(t: number): number {
  const l0 = normalizeDeg(280.46646 + 36000.76983 * t) * DEG;
  const m = normalizeDeg(357.52911 + 35999.05029 * t) * DEG;
  const e = 0.016708634 - 0.000042037 * t;
  const obliquity = (23.439291 - 0.0130042 * t) * DEG;
  const y = Math.tan(obliquity / 2) ** 2;
  const radians =
    y * Math.sin(2 * l0) -
    2 * e * Math.sin(m) +
    4 * e * y * Math.sin(m) * Math.cos(2 * l0) -
    0.5 * y * y * Math.sin(4 * l0) -
    1.25 * e * e * Math.sin(2 * m);
  return 4 * radians * RAD;
}

/**
 * Hour angle (in degrees) at which the sun crosses a target altitude.
 * The result is clamped to [0, 180] so polar-edge dates degrade
 * gracefully instead of producing NaN.
 * @param latitudeDeg - Observer latitude in degrees.
 * @param declinationDeg - Sun declination in degrees.
 * @param altitudeDeg - Target sun altitude in degrees (negative = below horizon).
 * @returns Hour angle in degrees; solar event = solar noon +/- angle/15 hours.
 */
export function hourAngleDeg(
  latitudeDeg: number,
  declinationDeg: number,
  altitudeDeg: number
): number {
  const lat = latitudeDeg * DEG;
  const dec = declinationDeg * DEG;
  const cosH =
    (Math.sin(altitudeDeg * DEG) - Math.sin(lat) * Math.sin(dec)) /
    (Math.cos(lat) * Math.cos(dec));
  const clamped = Math.min(1, Math.max(-1, cosH));
  return Math.acos(clamped) * RAD;
}

/**
 * Sun altitude (degrees) at Asr for a given shadow factor.
 * Asr begins when an object's shadow equals its length plus the shadow
 * at noon: altitude = arccot(factor + tan|lat - dec|).
 * @param latitudeDeg - Observer latitude in degrees.
 * @param declinationDeg - Sun declination in degrees.
 * @param shadowFactor - 1 for Shafi/Maliki/Hanbali, 2 for Hanafi.
 * @returns Asr sun altitude in degrees above the horizon.
 */
export function asrAltitudeDeg(
  latitudeDeg: number,
  declinationDeg: number,
  shadowFactor: number
): number {
  const arg = shadowFactor + Math.tan(Math.abs(latitudeDeg - declinationDeg) * DEG);
  return Math.atan(1 / arg) * RAD;
}

/**
 * Normalizes an angle in degrees to the range [0, 360).
 * @param deg - Angle in degrees.
 * @returns Normalized angle.
 */
export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}
