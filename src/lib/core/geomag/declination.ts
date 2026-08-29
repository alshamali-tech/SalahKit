/**
 * Magnetic declination lookup (P3, offline-first).
 * Bundled WMM-2020-approximate values per city give a deterministic,
 * network-free true-north correction. When online, the NOAA Geomag
 * adapter (lib/external/declination.ts) may refine the value.
 * Pure TypeScript — no framework imports, no side effects.
 */
import { CITIES } from '../geo';
import declinationData from './declination-data.json';

/** Bundled per-city declination table (degrees east of true north). */
const CITY_DECLINATION: Readonly<Record<string, number>> = declinationData.cities;

/** Model metadata for transparency panels. */
export const DECLINATION_MODEL: Readonly<{ model: string; epoch: string; precisionDeg: number }> = {
  model: declinationData.model,
  epoch: declinationData.epoch,
  precisionDeg: declinationData.precisionDeg,
};

/** Great-circle distance in degrees (cheap approximation for nearest lookup). */
function angularDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = lat1 - lat2;
  const dLng = lng1 - lng2;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Declination for a city id; unknown ids fall back to the nearest
 * bundled city (so traveling users still get a sane correction).
 * @param cityId - City identifier from the bundled list.
 * @param latitude - Observer latitude (used for nearest fallback).
 * @param longitude - Observer longitude (used for nearest fallback).
 * @returns Value in degrees east of true north, plus the city it came from.
 */
export function bundledDeclination(
  cityId: string,
  latitude: number,
  longitude: number
): { value: number; viaCityId: string } {
  const direct = CITY_DECLINATION[cityId];
  if (typeof direct === 'number') return { value: direct, viaCityId: cityId };
  let bestId = '';
  let bestDist = Infinity;
  for (const city of CITIES) {
    if (typeof CITY_DECLINATION[city.id] !== 'number') continue;
    const dist = angularDistance(latitude, longitude, city.latitude, city.longitude);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = city.id;
    }
  }
  if (bestId !== '') return { value: CITY_DECLINATION[bestId] ?? 0, viaCityId: bestId };
  return { value: 0, viaCityId: cityId };
}

/**
 * Human-readable declination, e.g. "+2.1° E" or "3.8° W".
 * @param value - Declination in degrees east.
 * @returns Formatted string.
 */
export function formatDeclination(value: number): string {
  const magnitude = Math.abs(value).toFixed(1);
  if (Math.abs(value) < 0.05) return '0.0°';
  return value > 0 ? `${magnitude}° E` : `${magnitude}° W`;
}
