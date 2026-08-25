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

const C = 110;

const TICKS: ReadonlyArray<{ deg: number; major: boolean }> = Array.from(
  { length: 72 },
  (_, i) => ({ deg: i * 5, major: i % 3 === 0 })
);

const CARDINALS: ReadonlyArray<{ deg: number; label: string }> = [
  { deg: 0, label: 'N' },
  { deg: 90, label: 'E' },
  { deg: 180, label: 'S' },
  { deg: 270, label: 'W' },
];

/**
 * Polar helper for dial geometry (0deg = north/up).
 * @param angleDeg - Clockwise-from-north angle.
 * @param radius - Distance from center.
 * @returns [x, y] coordinates in the 220 viewBox.
 */
function point(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [C + radius * Math.sin(rad), C - radius * Math.cos(rad)];
}

/**
 * The compass instrument: a world-fixed card (ticks, cardinals and the
 * amber Qibla marker) that counter-rotates against device heading, with
 * a fixed north index and a live hub readout. In manual mode a needle
 * marks the bearing instead.
 * @param props - rotationDeg/bearingDeg/manual/aligned/hub.
 * @returns The rendered dial.
 */
export function QiblaDial({ rotationDeg, bearingDeg, manual, aligned, hub }: QiblaDialProps): JSX.Element {
  return (
    <div className="relative w-full max-w-[340px] aspect-square select-none" role="img" aria-label="Qibla compass dial">
      {/* Aligned halo */}
      <div
        aria-hidden="true"
        className={[
          'absolute -inset-4 rounded-full blur-2xl transition-opacity duration-300',
          aligned ? 'opacity-100 bg-[color-mix(in_srgb,var(--success)_28%,transparent)]' : 'opacity-0',
        ].join(' ')}
      />

      {/* Bezel */}
      <div
        className={[
          'absolute inset-0 rounded-full border-[10px] bg-[var(--field)] transition-all duration-300',
          'border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] shadow-xl shadow-teal-950/10',
          aligned ? 'shadow-[0_0_0_4px_var(--success),0_0_48px_-10px_var(--success)]' : '',
        ].join(' ')}
      />

      {/* Rotating card */}
      <div
        className="absolute inset-[10px] rounded-full"
        style={{ transform: `rotate(${rotationDeg}deg)`, transition: 'transform 120ms linear' }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 220 220" className="h-full w-full">
          <circle cx={C} cy={C} r="99" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
          <circle cx={C} cy={C} r="62" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 5" />
          {TICKS.map((t) => {
            const [x1, y1] = point(t.deg, t.major ? 84 : 90);
            const [x2, y2] = point(t.deg, 97);
            return (
              <line
                key={t.deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={t.major ? 'var(--fg)' : 'var(--muted)'}
                strokeWidth={t.major ? 2.4 : 1.1}
                opacity={t.major ? 0.65 : 0.4}
                strokeLinecap="round"
              />
            );
          })}
          {CARDINALS.map((c) => {
            const [x, y] = point(c.deg, 71);
            return (
              <text
                key={c.label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="15"
                fontWeight="800"
                fill={c.label === 'N' ? 'var(--primary)' : 'var(--muted)'}
              >
                {c.label}
              </text>
            );
          })}

          {/* Qibla marker on the card */}
          <g transform={`rotate(${bearingDeg} ${C} ${C})`}>
            <path d={`M${C} 15 l8 10 -8 10 -8 -10 z`} fill="var(--accent)" stroke="#92400e" strokeWidth="1" />
            <rect x={C - 4.5} y={21.5} width="9" height="7" rx="1" fill="#1c1917" />
            <line x1={C - 4.5} y1={24} x2={C + 4.5} y2={24} stroke="var(--accent)" strokeWidth="1.2" />
            <text x={C} y={49} textAnchor="middle" fontSize="8.5" fontWeight="800" letterSpacing="2.5" fill="var(--accent-strong)">
              QIBLA
            </text>
            <line x1={C} y1={56} x2={C} y2={88} stroke="var(--accent)" strokeWidth="1.4" strokeDasharray="1 5" strokeLinecap="round" opacity="0.7" />
          </g>

          {/* Manual needle (static mode only) */}
          {manual ? (
            <g transform={`rotate(${bearingDeg} ${C} ${C})`}>
              <path d={`M${C} 34 L${C - 8} ${C} L${C + 8} ${C} Z`} fill="var(--accent)" opacity="0.95" />
              <path d={`M${C} ${C + 52} L${C - 8} ${C} L${C + 8} ${C} Z`} fill="var(--border)" />
            </g>
          ) : null}
        </svg>
      </div>

      {/* Fixed north index */}
      <div aria-hidden="true" className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1">
        <svg width="18" height="14" viewBox="0 0 18 14">
          <path d="M9 14L1 1h16z" fill="var(--accent)" stroke="#92400e" strokeWidth="0.75" />
        </svg>
      </div>

      {/* Fixed hub */}
      <div
        className={[
          'absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full',
          'border-4 bg-[var(--card)] text-center shadow-inner transition-colors duration-300',
          aligned ? 'border-[var(--success)]' : 'border-[var(--border)]',
        ].join(' ')}
      >
        {hub}
      </div>
    </div>
  );
}
