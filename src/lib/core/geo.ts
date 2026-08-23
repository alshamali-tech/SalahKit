/**
 * Static city coordinate list (S3: geo.ts). No network required.
 * Pure TypeScript — no framework imports.
 */
import type { City } from './types';

/** Supported cities with WGS84 coordinates. */
export const CITIES: readonly City[] = [
  { id: 'makkah', name: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },
  { id: 'madinah', name: 'Madinah', country: 'Saudi Arabia', latitude: 24.4703, longitude: 39.61 },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753 },
  { id: 'jeddah', name: 'Jeddah', country: 'Saudi Arabia', latitude: 21.4858, longitude: 39.1925 },
  { id: 'dubai', name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708 },
  { id: 'abu-dhabi', name: 'Abu Dhabi', country: 'UAE', latitude: 24.4539, longitude: 54.3773 },
  { id: 'doha', name: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.531 },
  { id: 'kuwait-city', name: 'Kuwait City', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774 },
  { id: 'manama', name: 'Manama', country: 'Bahrain', latitude: 26.2285, longitude: 50.586 },
  { id: 'muscat', name: 'Muscat', country: 'Oman', latitude: 23.588, longitude: 58.3829 },
  { id: 'amman', name: 'Amman', country: 'Jordan', latitude: 31.9539, longitude: 35.9106 },
  { id: 'jerusalem', name: 'Jerusalem', country: 'Palestine', latitude: 31.7683, longitude: 35.2137 },
  { id: 'beirut', name: 'Beirut', country: 'Lebanon', latitude: 33.8938, longitude: 35.5018 },
  { id: 'damascus', name: 'Damascus', country: 'Syria', latitude: 33.5138, longitude: 36.2765 },
  { id: 'baghdad', name: 'Baghdad', country: 'Iraq', latitude: 33.3152, longitude: 44.3661 },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
  { id: 'alexandria', name: 'Alexandria', country: 'Egypt', latitude: 31.2001, longitude: 29.9187 },
  { id: 'istanbul', name: 'Istanbul', country: 'Türkiye', latitude: 41.0082, longitude: 28.9784 },
  { id: 'ankara', name: 'Ankara', country: 'Türkiye', latitude: 39.9334, longitude: 32.8597 },
  { id: 'tehran', name: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.389 },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011 },
  { id: 'lahore', name: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587 },
  { id: 'islamabad', name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479 },
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125 },
  { id: 'delhi', name: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.209 },
  { id: 'mumbai', name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777 },
  { id: 'kolkata', name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639 },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.139, longitude: 101.6869 },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { id: 'casablanca', name: 'Casablanca', country: 'Morocco', latitude: 33.5731, longitude: -7.5898 },
  { id: 'algiers', name: 'Algiers', country: 'Algeria', latitude: 36.7538, longitude: 3.0588 },
  { id: 'tunis', name: 'Tunis', country: 'Tunisia', latitude: 36.8065, longitude: 10.1815 },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792 },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', latitude: -26.2041, longitude: 28.0473 },
  { id: 'london', name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { id: 'paris', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { id: 'berlin', name: 'Berlin', country: 'Germany', latitude: 52.52, longitude: 13.405 },
  { id: 'new-york', name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { id: 'chicago', name: 'Chicago', country: 'United States', latitude: 41.8781, longitude: -87.6298 },
  { id: 'toronto', name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', latitude: 34.0522, longitude: -118.2437 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
];

/** Default city id used on first launch. */
export const DEFAULT_CITY_ID = 'makkah';

/**
 * Finds a city by id, falling back to Makkah for unknown ids.
 * @param id - City identifier.
 * @returns The matching city (never undefined).
 */
export function findCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? (CITIES[0] as City);
}

/**
 * Searches cities by name or country substring (case-insensitive).
 * @param query - Search text.
 * @returns Matching cities; all cities when query is empty.
 */
export function searchCities(query: string): readonly City[] {
  const q = query.trim().toLowerCase();
  if (q === '') return CITIES;
  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
  );
}
