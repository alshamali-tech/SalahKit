/**
 * Calculation method presets for prayer times (S3: calc-methods.ts).
 * Angles follow each authority's published convention.
 * Pure TypeScript — no framework imports.
 */
import type { CalcMethod, CalcMethodId } from './types';

/** All supported calculation methods, keyed by id. */
export const CALC_METHODS: Readonly<Record<CalcMethodId, CalcMethod>> = {
  MWL: {
    id: 'MWL',
    name: 'Muslim World League',
    fajrAngle: 18,
    ishaAngle: 17,
  },
  ISNA: {
    id: 'ISNA',
    name: 'ISNA (North America)',
    fajrAngle: 15,
    ishaAngle: 15,
  },
  Egypt: {
    id: 'Egypt',
    name: 'Egyptian General Authority',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
  },
  Karachi: {
    id: 'Karachi',
    name: 'Univ. of Islamic Sciences, Karachi',
    fajrAngle: 18,
    ishaAngle: 18,
  },
  UmmAlQura: {
    id: 'UmmAlQura',
    name: 'Umm al-Qura, Makkah',
    fajrAngle: 18.5,
    ishaAngle: 0,
    ishaIntervalMin: 90,
  },
} as const;

/** Ordered list for rendering in selectors. */
export const CALC_METHOD_LIST: readonly CalcMethod[] = [
  CALC_METHODS.MWL,
  CALC_METHODS.ISNA,
  CALC_METHODS.Egypt,
  CALC_METHODS.Karachi,
  CALC_METHODS.UmmAlQura,
];

/**
 * Resolves a method id to its definition.
 * Falls back to MWL for unknown ids so callers never crash.
 * @param id - Calculation method identifier.
 * @returns The matching CalcMethod (MWL when unknown).
 */
export function getCalcMethod(id: string): CalcMethod {
  const key = id as CalcMethodId;
  return CALC_METHODS[key] ?? CALC_METHODS.MWL;
}

/**
 * True when the id is a known calculation method.
 * @param id - Value to test.
 * @returns True for the five supported presets.
 */
export function isCalcMethodId(id: string): id is CalcMethodId {
  return id in CALC_METHODS;
}
