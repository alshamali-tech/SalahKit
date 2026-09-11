/* 
 * TODO: QiblaDial component is temporarily disabled.
 * Will be re-enabled in the future when ready and bug-free.
 * 
 * Original implementation was a complex SVG-based compass dial component.
 */

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
  hub: React.ReactNode;
}

/**
 * QiblaDial is temporarily disabled.
 * @param props - Component props.
 * @returns Placeholder component.
 */
export function QiblaDial({ rotationDeg, bearingDeg, manual, aligned, hub }: QiblaDialProps): JSX.Element {
  return (
    <div className="text-center py-8">
      <p className="text-sm text-[var(--muted)]">
        Compass dial component is temporarily disabled.
      </p>
    </div>
  );
}
