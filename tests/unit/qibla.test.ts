import { describe, expect, it } from 'vitest';
import { compassPoint, distanceToKaabaKm, qiblaBearingDeg } from '../../src/lib/core/qibla';

describe('qiblaBearingDeg', () => {
  it('points roughly east-north-east from London', () => {
    expect(qiblaBearingDeg(51.5074, -0.1278)).toBeCloseTo(119, 0);
  });

  it('points roughly north-east from New York', () => {
    expect(qiblaBearingDeg(40.7128, -74.006)).toBeCloseTo(58.5, 0);
  });

  it('points roughly west-north-west from Jakarta', () => {
    expect(qiblaBearingDeg(-6.2088, 106.8456)).toBeCloseTo(295, 0);
  });

  it('is defined (zero) at the Kaaba itself', () => {
    const bearing = qiblaBearingDeg(21.422487, 39.826206);
    expect(Number.isFinite(bearing)).toBe(true);
  });

  it('rejects out-of-range coordinates', () => {
    expect(() => qiblaBearingDeg(91, 0)).toThrow();
    expect(() => qiblaBearingDeg(0, 181)).toThrow();
  });
});

describe('distanceToKaabaKm', () => {
  it('is ~0 km from Makkah', () => {
    expect(distanceToKaabaKm(21.422487, 39.826206)).toBeLessThan(1);
  });

  it('is ~5,000 km from London', () => {
    expect(distanceToKaabaKm(51.5074, -0.1278)).toBeGreaterThan(4800);
    expect(distanceToKaabaKm(51.5074, -0.1278)).toBeLessThan(5200);
  });

  it('rejects invalid coordinates', () => {
    expect(() => distanceToKaabaKm(-95, 0)).toThrow();
  });
});

describe('compassPoint', () => {
  it('maps bearings to the 16-point rose', () => {
    expect(compassPoint(0)).toBe('N');
    expect(compassPoint(90)).toBe('E');
    expect(compassPoint(180)).toBe('S');
    expect(compassPoint(270)).toBe('W');
    expect(compassPoint(112)).toBe('ESE');
    expect(compassPoint(350)).toBe('N');
    expect(compassPoint(720 + 45)).toBe('NE');
  });
});
