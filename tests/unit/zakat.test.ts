import { describe, expect, it } from 'vitest';
import { computeZakat, monthlyEquivalent, round2 } from '../../src/lib/core/zakat';
import { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS } from '../../src/lib/core/constants';

const BASE = {
  goldGrams: 0,
  silverGrams: 0,
  cash: 0,
  investments: 0,
  otherAssets: 0,
  debts: 0,
  goldPricePerGram: 65,
  silverPricePerGram: 0.85,
};

describe('computeZakat', () => {
  it('returns zero below the silver nisab', () => {
    const result = computeZakat({ ...BASE, cash: 100 });
    expect(result.nisabMet).toBe(false);
    expect(result.zakatDue).toBe(0);
  });

  it('charges 2.5% on net assets above nisab', () => {
    const result = computeZakat({ ...BASE, cash: 10000 });
    expect(result.silverNisabValue).toBe(round2(SILVER_NISAB_GRAMS * 0.85));
    expect(result.nisabMet).toBe(true);
    expect(result.zakatDue).toBe(250);
  });

  it('subtracts immediate debts before the nisab test', () => {
    const result = computeZakat({ ...BASE, cash: 10000, debts: 9600 });
    expect(result.netAssets).toBe(400);
    expect(result.nisabMet).toBe(false);
    expect(result.zakatDue).toBe(0);
  });

  it('values gold holdings at the supplied gram price', () => {
    const result = computeZakat({ ...BASE, goldGrams: 100 });
    expect(result.totalAssets).toBe(6500);
    expect(result.goldNisabValue).toBe(round2(GOLD_NISAB_GRAMS * 65));
  });

  it('requires a positive silver price for the nisab test', () => {
    const result = computeZakat({ ...BASE, cash: 100000, silverPricePerGram: 0 });
    expect(result.nisabMet).toBe(false);
    expect(result.zakatDue).toBe(0);
  });

  it('treats negative inputs as zero', () => {
    const result = computeZakat({ ...BASE, cash: -500 });
    expect(result.totalAssets).toBe(0);
    expect(result.zakatDue).toBe(0);
  });

  it('throws on non-finite fields', () => {
    expect(() => computeZakat({ ...BASE, cash: Number.NaN })).toThrow(TypeError);
    expect(() => computeZakat({ ...BASE, goldGrams: Number.POSITIVE_INFINITY })).toThrow(TypeError);
  });
});

describe('monthlyEquivalent / round2', () => {
  it('splits annual Zakat into twelve', () => {
    expect(monthlyEquivalent(1200)).toBe(100);
    expect(monthlyEquivalent(0)).toBe(0);
  });

  it('rounds to two decimals', () => {
    expect(round2(1.005 + 1e-9)).toBe(1.01);
    expect(round2(2.344)).toBe(2.34);
  });
});
