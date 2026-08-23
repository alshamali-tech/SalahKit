/**
 * Zakat computation (S3: zakat.ts).
 * Classic fiqh rules: 2.5% on net zakatable wealth above the nisab.
 * Currency-agnostic pure math. No framework imports, no side effects.
 */
import { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS, ZAKAT_RATE } from './constants';
import { assertFinite } from './validator';
import type { ZakatInput, ZakatResult } from './types';

/** Field names checked by {@link computeZakat}, used in error messages. */
const INPUT_FIELDS: readonly (keyof ZakatInput)[] = [
  'goldGrams',
  'silverGrams',
  'cash',
  'investments',
  'otherAssets',
  'debts',
  'goldPricePerGram',
  'silverPricePerGram',
];

/**
 * Sanitizes a numeric Zakat input field to a non-negative finite value.
 * @param value - Raw field value.
 * @returns Max(0, value) or 0 when not finite.
 */
function nonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Computes Zakat for a set of assets and liabilities.
 * Nisab is evaluated against the silver threshold (the more inclusive
 * classical position); both gold and silver threshold values are returned
 * for transparency.
 * @param input - Assets, debts and current metal prices.
 * @returns Breakdown including whether nisab is met and Zakat due.
 * @throws TypeError when any field is not a finite number.
 */
export function computeZakat(input: ZakatInput): ZakatResult {
  for (const field of INPUT_FIELDS) {
    assertFinite(input[field], field);
  }
  const goldValue = nonNegative(input.goldGrams) * nonNegative(input.goldPricePerGram);
  const silverValue = nonNegative(input.silverGrams) * nonNegative(input.silverPricePerGram);
  const totalAssets =
    goldValue +
    silverValue +
    nonNegative(input.cash) +
    nonNegative(input.investments) +
    nonNegative(input.otherAssets);
  const netAssets = Math.max(0, totalAssets - nonNegative(input.debts));
  const goldNisabValue = GOLD_NISAB_GRAMS * nonNegative(input.goldPricePerGram);
  const silverNisabValue = SILVER_NISAB_GRAMS * nonNegative(input.silverPricePerGram);
  const nisabMet = silverNisabValue > 0 && netAssets >= silverNisabValue;
  const zakatDue = nisabMet ? round2(netAssets * ZAKAT_RATE) : 0;
  return {
    totalAssets: round2(totalAssets),
    netAssets: round2(netAssets),
    goldNisabValue: round2(goldNisabValue),
    silverNisabValue: round2(silverNisabValue),
    nisabMet,
    zakatDue,
  };
}

/**
 * Rounds to 2 decimal places (banker-safe for display purposes).
 * @param n - Input number.
 * @returns Number rounded to 2 decimals.
 */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Annual Zakat expressed as a monthly savings target.
 * @param zakatDue - Annual Zakat amount.
 * @returns One twelfth of the annual amount, rounded to 2 decimals.
 */
export function monthlyEquivalent(zakatDue: number): number {
  assertFinite(zakatDue, 'zakatDue');
  return round2(zakatDue / 12);
}
