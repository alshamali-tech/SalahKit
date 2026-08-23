/**
 * Qibla direction math (S3: qibla.ts).
 * Great-circle initial bearing from any coordinate to the Kaaba.
 * Pure TypeScript — no framework imports, no side effects.
 */
import { KAABA } from './constants';
import { isValidLatitude, isValidLongitude } from './validator';

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
const EARTH_RADIUS_KM = 6371;

/**
 * Qibla bearing in degrees clockwise from true north.
 * Uses the spherical great-circle initial bearing formula:
 * θ = atan2(sin Δλ · cos φ₂, cos φ₁ · sin φ₂ − sin φ₁ · cos φ₂ · cos Δλ)
 * @param latitude - Observer latitude in degrees.
 * @param longitude - Observer longitude in degrees.
 * @returns Bearing in degrees, normalized to [0, 360).
 * @throws Error when coordinates are out of range.
 */
export function qiblaBearingDeg(latitude: number, longitude: number): number {
  if (!isValidLatitude(latitude)) throw new Error('SalahKit: latitude out of range.');
  if (!isValidLongitude(longitude)) throw new Error('SalahKit: longitude out of range.');
  const phi1 = latitude * DEG;
  const phi2 = KAABA.latitude * DEG;
  const deltaLambda = (KAABA.longitude - longitude) * DEG;
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  return (((Math.atan2(y, x) * RAD) % 360) + 360) % 360;
}

/**
 * Great-circle distance from a location to the Kaaba.
 * @param latitude - Observer latitude in degrees.
 * @param longitude - Observer longitude in degrees.
 * @returns Distance in kilometers (haversine).
 * @throws Error when coordinates are out of range.
 */
export function distanceToKaabaKm(latitude: number, longitude: number): number {
  if (!isValidLatitude(latitude)) throw new Error('SalahKit: latitude out of range.');
  if (!isValidLongitude(longitude)) throw new Error('SalahKit: longitude out of range.');
  const phi1 = latitude * DEG;
  const phi2 = KAABA.latitude * DEG;
  const dPhi = (KAABA.latitude - latitude) * DEG;
  const dLambda = (KAABA.longitude - longitude) * DEG;
  const a =
    Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

const WIND_ROSE: readonly string[] = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

/**
 * Converts a bearing to its 16-point compass label.
 * @param bearingDeg - Bearing in degrees [0, 360).
 * @returns Compass point abbreviation, e.g. "SE".
 */
export function compassPoint(bearingDeg: number): string {
  const normalized = ((bearingDeg % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return WIND_ROSE[index] ?? 'N';
}
