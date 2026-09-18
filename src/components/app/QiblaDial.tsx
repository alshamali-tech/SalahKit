import type { ReactNode } from 'react';

export interface QiblaDialProps {
  /** World-referenced rotation applied to the dial (-heading in live mode, 0 in manual). */
  rotationDeg: number;
  /** Qibla bearing from north, drawn on the dial card. */
  bearingDeg: number;
  /** True when the dial is not sensor-driven. */
  manual: boolean;
  /** True within alignment tolerance (drives the glow + hub state). */
  aligned: boolean;
  /** Center hub readout content. */
  hub: ReactNode;
}

/**
 * QiblaDial component - placeholder for future compass dial implementation.
 * @param props - Component props.
 * @returns Placeholder component.
 */
export function QiblaDial({ rotationDeg, bearingDeg, manual, aligned, hub }: QiblaDialProps): JSX.Element {
  return (
    <div className="text-center py-8">
      <p className="text-sm text-[var(--muted)]">
        Advanced compass dial coming soon.
      </p>
    </div>
  );
}
