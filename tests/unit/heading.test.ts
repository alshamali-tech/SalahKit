import { describe, expect, it } from 'vitest';
import {
  angleLerp,
  computeDeviceHeading,
  normalizeDeg360,
  shortestDelta,
} from '../../src/lib/utils/heading';

describe('computeDeviceHeading', () => {
  it('matches compass = 360 - (alpha + screenAngle) when flat, all rotations', () => {
    for (const alpha of [0, 30, 90, 137, 270]) {
      for (const screenAngle of [0, 90, 180, 270]) {
        const expected = ((360 - (alpha + screenAngle)) % 360 + 360) % 360;
        expect(computeDeviceHeading(alpha, 0, 0, screenAngle)).toBeCloseTo(expected, 6);
      }
    }
  });

  it('is tilt-invariant in portrait (beta/gamma do not move the top edge azimuth)', () => {
    const flat = computeDeviceHeading(42, 0, 0, 0);
    expect(computeDeviceHeading(42, 60, 25, 0)).toBeCloseTo(flat, 6);
    expect(computeDeviceHeading(42, -45, -80, 0)).toBeCloseTo(flat, 6);
    expect(computeDeviceHeading(42, 89, 10, 180)).toBeCloseTo(
      computeDeviceHeading(42, 0, 0, 180),
      6
    );
  });

  it('points north when alpha is 0 and flat', () => {
    expect(computeDeviceHeading(0, 0, 0, 0)).toBeCloseTo(0, 6);
  });

  it('rotates counter-clockwise correctly (alpha 90 => west)', () => {
    expect(computeDeviceHeading(90, 0, 0, 0)).toBeCloseTo(270, 6);
  });

  it('stays correct in landscape as the device tilts sideways (gamma coupling)', () => {
    // At screenAngle 90 the top edge is along -x; tilting about y (gamma)
    // must not change its horizontal azimuth until it points straight up.
    expect(computeDeviceHeading(0, 0, 45, 90)).toBeCloseTo(270, 6);
    expect(computeDeviceHeading(0, 0, 0, 90)).toBeCloseTo(270, 6);
    expect(computeDeviceHeading(45, 0, 30, 90)).toBeCloseTo(
      computeDeviceHeading(45, 0, 0, 90),
      6
    );
  });

  it('always returns degrees in [0, 360)', () => {
    for (let a = -720; a <= 720; a += 37) {
      const h = computeDeviceHeading(a, 33, -21, 90);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(360);
    }
  });
});

describe('angle helpers', () => {
  it('normalizeDeg360 wraps both directions', () => {
    expect(normalizeDeg360(370)).toBe(10);
    expect(normalizeDeg360(-10)).toBe(350);
    expect(normalizeDeg360(0)).toBe(0);
  });

  it('shortestDelta picks the short way around the circle', () => {
    expect(shortestDelta(350, 10)).toBeCloseTo(20, 9);
    expect(shortestDelta(10, 350)).toBeCloseTo(-20, 9);
    expect(shortestDelta(0, 90)).toBeCloseTo(90, 9);
    expect(Math.abs(shortestDelta(0, 180))).toBeCloseTo(180, 9);
  });

  it('angleLerp interpolates across the 0/360 seam', () => {
    expect(angleLerp(350, 10, 0.5)).toBeCloseTo(0, 9);
    expect(angleLerp(10, 350, 0.5)).toBeCloseTo(0, 9);
    expect(angleLerp(90, 180, 0.25)).toBeCloseTo(112.5, 9);
  });
});
