/**
 * LemonSqueezy premium seam — a documented stub (S2/S11).
 *
 * SalahKit is free forever. There is NO payment code, NO SDK, and NO
 * checkout anywhere in the app. This module exists only to mark where a
 * hypothetical future premium tier could be wired, should the project
 * ever add one. Every export is a no-op that keeps the app free.
 *
 * Guarantees this stub upholds:
 *  - getPlan() always resolves to 'free'.
 *  - No feature is ever gated behind a purchase.
 *  - No network call, no script tag, no tracking pixel is added.
 */
import { getPlan, type PlanId } from '../plan';

/** The set of capabilities a premium tier might gate (none do today). */
export interface PremiumEntitlements {
  /** Reserved. Always false. */
  customAdhanPacks: boolean;
  /** Reserved. Always false. */
  cloudSync: boolean;
  /** Reserved. Always false. */
  printableTimetables: boolean;
}

/**
 * Returns the active plan. Always 'free' — this stub never upgrades.
 * @returns The plan id.
 */
export function currentPlan(): PlanId {
  return getPlan();
}

/**
 * Entitlements for the current plan. All premium flags are false; the
 * free tier includes every feature.
 * @returns A PremiumEntitlements with every premium flag false.
 */
export function entitlements(): PremiumEntitlements {
  return { customAdhanPacks: false, cloudSync: false, printableTimetables: false };
}

/**
 * No-op checkout. Documented seam only — invoking it does nothing and
 * returns false, because SalahKit never processes payments.
 * @returns Always false.
 */
export function openCheckout(): boolean {
  return false;
}

/**
 * Whether premium is even a live concept. Always false.
 * @returns false.
 */
export function isPremiumEnabled(): boolean {
  return false;
}
