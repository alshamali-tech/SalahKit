/**
 * Feature flags (S3: lib/features.ts). Stored as JSON in localStorage.
 * All flags ship TRUE (free mode). Flags exist so individual tools can
 * be toggled without a deploy.
 */
import { STORAGE_KEYS } from './core/constants';
import { getJSON, setJSON, safeRemove } from './utils/storage';

/** Every feature flag known to the app. */
export type FeatureName =
  | 'prayer'
  | 'qibla'
  | 'hijri'
  | 'quran'
  | 'dhikr'
  | 'zakat'
  | 'duas'
  | 'names'
  | 'tracker'
  | 'calendar'
  | 'tajweed'
  | 'donations'
  | 'externalApi'
  | 'premiumStub';

/** Default flag values: everything enabled (free, open toolkit). */
export const DEFAULT_FEATURE_FLAGS: Readonly<Record<FeatureName, boolean>> = {
  prayer: true,
  qibla: true,
  hijri: true,
  quran: true,
  dhikr: true,
  zakat: true,
  duas: true,
  names: true,
  tracker: true,
  calendar: true,
  tajweed: true,
  donations: true,
  externalApi: true,
  premiumStub: true,
};

/**
 * Reads the current (persisted) flag map, merged over defaults.
 * @returns Complete flag map with stored overrides applied.
 */
export function getFeatureFlags(): Record<FeatureName, boolean> {
  const stored = getJSON<Partial<Record<FeatureName, boolean>>>(
    STORAGE_KEYS.featureFlags,
    {}
  );
  return { ...DEFAULT_FEATURE_FLAGS, ...stored };
}

/**
 * Checks whether a feature is enabled.
 * @param name - Feature flag name.
 * @returns True when enabled (unknown flags default to enabled).
 */
export function isFeatureEnabled(name: FeatureName): boolean {
  return getFeatureFlags()[name] ?? true;
}

/**
 * Persists a flag override.
 * @param name - Feature flag name.
 * @param enabled - New value.
 */
export function setFeatureFlag(name: FeatureName, enabled: boolean): void {
  const flags = getFeatureFlags();
  flags[name] = enabled;
  setJSON(STORAGE_KEYS.featureFlags, flags);
}

/**
 * Resets all flags to their shipped defaults (all true).
 */
export function resetFeatureFlags(): void {
  safeRemove(STORAGE_KEYS.featureFlags);
}
