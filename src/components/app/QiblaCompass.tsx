import { useMemo } from 'react';
import { compassPoint, distanceToKaabaKm, qiblaBearingDeg } from '../../lib/core/qibla';
import { CITIES, findCity } from '../../lib/core/geo';
import { formatDistanceKm } from '../../lib/utils/format';
import { useApp } from '../../store';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';

const CX = 100;
const CY = 100;

/**
 * Polar to cartesian helper for dial geometry (0deg = up/north).
 * @param angleDeg - Angle clockwise from north.
 * @param radius - Distance from center.
 * @returns [x, y] coordinates.
 */
function point(angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [CX + radius * Math.sin(rad), CY - radius * Math.cos(rad)];
}

/** Tick marks every 5 degrees; longer every 15. */
const TICKS: ReadonlyArray<{ deg: number; major: boolean }> = Array.from({ length: 72 }, (_, i) => ({
  deg: i * 5,
  major: i % 3 === 0,
}));

const CARDINALS: ReadonlyArray<{ deg: number; label: string }> = [
  { deg: 0, label: 'N' },
  { deg: 90, label: 'E' },
  { deg: 180, label: 'S' },
  { deg: 270, label: 'W' },
];

/**
 * Qibla module: great-circle bearing from the selected city to the
 * Kaaba, rendered as an animated compass dial.
 * @returns The rendered module.
 */
export function QiblaCompass(): JSX.Element {
  const { settings, updateSettings } = useApp();
  const city = findCity(settings.city);

  const bearing = useMemo(
    () => qiblaBearingDeg(settings.latitude, settings.longitude),
    [settings.latitude, settings.longitude]
  );
  const distance = useMemo(
    () => distanceToKaabaKm(settings.latitude, settings.longitude),
    [settings.latitude, settings.longitude]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
      <Card className="flex flex-col items-center py-8">
        <svg viewBox="0 0 200 200" className="w-full max-w-[340px]" role="img" aria-label={`Qibla compass pointing ${Math.round(bearing)} degrees from north`}>
          <circle cx={CX} cy={CY} r="96" fill="var(--field)" stroke="var(--border)" strokeWidth="1.5" />
          <circle cx={CX} cy={CY} r="70" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />
          {TICKS.map((t) => {
            const [x1, y1] = point(t.deg, t.major ? 84 : 89);
            const [x2, y2] = point(t.deg, 94);
            return (
              <line
                key={t.deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={t.major ? 'var(--fg)' : 'var(--muted)'}
                strokeWidth={t.major ? 2 : 1}
                opacity={t.major ? 0.7 : 0.45}
              />
            );
          })}
          {CARDINALS.map((c) => {
            const [x, y] = point(c.deg, 76);
            return (
              <text
                key={c.label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fontWeight="800"
                fill={c.label === 'N' ? 'var(--primary)' : 'var(--muted)'}
              >
                {c.label}
              </text>
            );
          })}
          <g
            style={{
              transform: `rotate(${bearing}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 300ms ease-out',
            }}
          >
            <path d="M100 26L90 100h20z" fill="var(--accent)" />
            <path d="M100 174l-8-74h16z" fill="var(--border)" />
            <rect x="93" y="30" width="14" height="14" rx="2.5" fill="#1c1917" stroke="var(--accent)" strokeWidth="1.5" />
            <line x1="93" y1="35" x2="107" y2="35" stroke="var(--accent)" strokeWidth="1.5" />
          </g>
          <circle cx={CX} cy={CY} r="7" fill="var(--card)" stroke="var(--primary)" strokeWidth="2.5" />
        </svg>
        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Face the amber needle. Showing <strong className="text-[var(--fg)]">true north</strong> —
          adjust for your local magnetic declination.
        </p>
      </Card>

      <div className="space-y-4 min-w-0">
        <Card tone="raised">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Qibla bearing</p>
          <p className="mt-1 text-4xl font-extrabold tnum text-[var(--fg)]">
            {bearing.toFixed(1)}°
            <span className="ml-2 text-base font-bold text-[var(--muted)]">{compassPoint(bearing)}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="primary">From {city.name}</Badge>
            <Badge tone="neutral">{formatDistanceKm(distance)} to Kaaba</Badge>
          </div>
        </Card>
        <Card>
          <Select
            label="Your city"
            id="qibla-city"
            value={settings.city}
            onChange={(e) => {
              const next = CITIES.find((c) => c.id === e.target.value);
              if (next) void updateSettings({ city: next.id, latitude: next.latitude, longitude: next.longitude });
            }}
            options={CITIES.map((c) => ({ value: c.id, label: `${c.name}, ${c.country}` }))}
          />
          <p className="mt-3 text-xs text-[var(--muted)]">
            Bearing is the great-circle direction from {city.name} ({city.latitude.toFixed(2)}°,{' '}
            {city.longitude.toFixed(2)}°) to the Kaaba in Masjid al-Haram, Makkah.
          </p>
        </Card>
      </div>
    </div>
  );
}
