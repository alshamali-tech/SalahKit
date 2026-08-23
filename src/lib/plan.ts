/**
 * Plan state (S3: lib/plan.ts).
 * SalahKit is free forever. A premium plan type exists ONLY as a stub
 * for a possible future LemonSqueezy integration - it can never be
 * activated from the client and gates nothing today.
 */

/** Plan identifiers. 'premium' is a locked future stub. */
export type PlanId = 'free' | 'premium';

/** Human-readable plan labels. */
export const PLAN_LABELS: Readonly<Record<PlanId, string>> = {
  free: 'Free forever',
  premium: 'Supporter (coming soon)',
};

/**
 * Returns the active plan. Always 'free': SalahKit has no paywall,
 * no sign-up and no account system.
 * FUTURE (LemonSqueezy stub): read a locally-verified entitlement here.
 * @returns The active plan id.
 */
export function getPlan(): PlanId {
  return 'free';
}

/**
 * Whether the user holds premium entitlements.
 * FUTURE (LemonSqueezy stub): verify an offline license token here.
 * @returns Always false in the current release.
 */
export function isPremium(): boolean {
  return false;
}

/**
 * Display label for a plan id.
 * @param plan - Plan id.
 * @returns Human-readable label.
 */
export function getPlanLabel(plan: PlanId): string {
  return PLAN_LABELS[plan];
}

/**
 * Ideas parked for a future optional supporter tier. None of these are
 * implemented, gated or promised; every current feature is free.
 */
export const PREMIUM_ROADMAP: readonly string[] = [
  'Custom adhan sounds pack',
  'Extended duas library sync across devices (user-initiated)',
  'Printable prayer timetable PDFs',
];
