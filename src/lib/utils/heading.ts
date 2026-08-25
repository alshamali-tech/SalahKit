/**
 * Device heading utilities (smart Qibla compass).
 * Derives a tilt-compensated compass heading from W3C DeviceOrientation
 * events, handling iOS (webkitCompassHeading), Android
 * (deviceorientationabsolute) and screen rotation. Pure math exports
 * are unit-testable; subscription code touches only browser APIs.
 */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

/** A single heading sample from the sensor layer. */
export interface HeadingSample {
  /** Magnetic heading in degrees [0, 360), or null when unfused. */
  headingMagnetic: number | null;
  /** Which sensor stream produced the sample. */
  source: 'ios' | 'absolute' | 'relative';
}

/**
 * Normalizes an angle in degrees to [0, 360).
 * @param deg - Angle in degrees.
 * @returns Normalized angle.
 */
export function normalizeDeg360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Shortest signed angular difference from one heading to another.
 * @param from - Start heading in degrees.
 * @param to - Target heading in degrees.
 * @returns Delta in (-180, 180]; positive means "turn clockwise/right".
 */
export function shortestDelta(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180;
}

/**
 * Circular interpolation between two headings (wrap-around safe).
 * @param current - Current heading in degrees.
 * @param target - Target heading in degrees.
 * @param t - Interpolation factor (0..1).
 * @returns Interpolated heading in [0, 360).
 */
export function angleLerp(current: number, target: number, t: number): number {
  return normalizeDeg360(current + shortestDelta(current, target) * t);
}

/**
 * Tilt-compensated compass heading of the device's top edge.
 * Derived from the W3C Z-X-Y rotation matrix: for portrait the heading
 * reduces to -alpha (tilt-invariant); landscape forms couple gamma.
 * Verified against compass = 360 - (alpha + screenAngle) when flat for
 * all four screen rotations.
 * @param alpha - DeviceOrientation alpha (degrees).
 * @param beta - DeviceOrientation beta (degrees).
 * @param gamma - DeviceOrientation gamma (degrees).
 * @param screenAngleDeg - screen.orientation.angle (0/90/180/270).
 * @returns Magnetic heading of the device top edge in [0, 360).
 */
export function computeDeviceHeading(
  alpha: number,
  beta: number,
  gamma: number,
  screenAngleDeg: number
): number {
  const a = alpha * DEG;
  const b = beta * DEG;
  const g = gamma * DEG;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const cb = Math.cos(b);
  const sb = Math.sin(b);
  const cg = Math.cos(g);
  const sg = Math.sin(g);
  const angle = Math.round(normalizeDeg360(screenAngleDeg));
  let rad: number;
  if (angle === 90) {
    rad = Math.atan2(-(ca * cg - sa * sb * sg), -(sa * cg + ca * sb * sg));
  } else if (angle === 180) {
    rad = Math.atan2(sa * cb, -ca * cb);
  } else if (angle === 270) {
    rad = Math.atan2(ca * cg - sa * sb * sg, sa * cg + ca * sb * sg);
  } else {
    rad = Math.atan2(-sa * cb, ca * cb);
  }
  return normalizeDeg360(rad * RAD);
}

/**
 * True when the browser exposes the DeviceOrientation API.
 * @returns False on desktops without sensors.
 */
export function supportsOrientation(): boolean {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

interface PermissionStatic {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

interface WebkitOrientationEvent extends DeviceOrientationEvent {
  readonly webkitCompassHeading?: number;
}

/**
 * True on platforms (iOS 13+) that gate sensors behind a user gesture.
 * @returns Whether requestPermission exists on the event constructor.
 */
export function orientationPermissionRequired(): boolean {
  const ctor = (globalThis as { DeviceOrientationEvent?: PermissionStatic })
    .DeviceOrientationEvent;
  return typeof ctor?.requestPermission === 'function';
}

/**
 * Asks for motion & orientation access (must run inside a user gesture).
 * @returns 'granted' | 'denied', or 'unsupported' where not required.
 */
export async function requestOrientationPermission(): Promise<
  'granted' | 'denied' | 'unsupported'
> {
  const ctor = (globalThis as { DeviceOrientationEvent?: PermissionStatic })
    .DeviceOrientationEvent;
  if (typeof ctor?.requestPermission !== 'function') return 'unsupported';
  try {
    return await ctor.requestPermission();
  } catch {
    return 'denied';
  }
}

/**
 * Reads the current screen rotation angle across APIs.
 * @returns Angle in degrees (0, 90, 180, 270).
 */
function getScreenAngle(): number {
  try {
    const orientation = screen?.orientation;
    if (orientation && typeof orientation.angle === 'number') return orientation.angle;
    const legacy = (window as unknown as { orientation?: number | string }).orientation;
    if (typeof legacy === 'number') return legacy;
  } catch {
    // Restricted environment; assume portrait.
  }
  return 0;
}

/**
 * Subscribes to fused heading samples from whichever sensor stream the
 * platform provides (prefers absolute events over relative ones).
 * @param onSample - Receives each HeadingSample.
 * @returns Unsubscribe function removing all listeners.
 */
export function subscribeHeading(onSample: (sample: HeadingSample) => void): () => void {
  let gotAbsolute = false;

  const handle = (ev: Event): void => {
    const e = ev as WebkitOrientationEvent;
    if (typeof e.webkitCompassHeading === 'number' && Number.isFinite(e.webkitCompassHeading)) {
      onSample({ headingMagnetic: normalizeDeg360(e.webkitCompassHeading), source: 'ios' });
      return;
    }
    const absolute = e.absolute === true;
    if (e.alpha === null || e.beta === null || e.gamma === null) {
      onSample({ headingMagnetic: null, source: absolute ? 'absolute' : 'relative' });
      return;
    }
    if (absolute) gotAbsolute = true;
    if (!absolute && gotAbsolute) return;
    onSample({
      headingMagnetic: computeDeviceHeading(e.alpha, e.beta, e.gamma, getScreenAngle()),
      source: absolute ? 'absolute' : 'relative',
    });
  };

  window.addEventListener('deviceorientationabsolute', handle);
  window.addEventListener('deviceorientation', handle);
  return () => {
    window.removeEventListener('deviceorientationabsolute', handle);
    window.removeEventListener('deviceorientation', handle);
  };
}
