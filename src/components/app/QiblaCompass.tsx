import { useEffect, useMemo, useState } from 'react';
import { compassPoint, distanceToKaabaKm, qiblaBearingDeg } from '../../lib/core/qibla';
import { CITIES, findCity } from '../../lib/core/geo';
import { formatDistanceKm } from '../../lib/utils/format';
import { useApp } from '../../store';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';

/**
 * Qibla compass module - simplified version.
 * Shows the Qibla bearing from the selected city to the Kaaba.
 * @returns The rendered module.
 */
export function QiblaCompass(): JSX.Element {
  const { settings, updateSettings } = useApp();
  const [selectedCity, setSelectedCity] = useState(settings.city);

  const city = findCity(selectedCity);
  const bearing = useMemo(
    () => qiblaBearingDeg(city.latitude, city.longitude),
    [city.latitude, city.longitude]
  );
  const distance = useMemo(
    () => distanceToKaabaKm(city.latitude, city.longitude),
    [city.latitude, city.longitude]
  );

  useEffect(() => {
    if (selectedCity !== settings.city) {
      updateSettings({ city: selectedCity });
    }
  }, [selectedCity, settings.city, updateSettings]);

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden">
        <div className="bg-pattern drift-slow absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col items-center gap-4 px-4 py-7">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge tone="success">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
              Qibla Direction
            </Badge>
          </div>

          {/* Simple compass visualization */}
          <div className="relative w-64 h-64 rounded-full border-4 border-[var(--primary)] bg-[var(--card)] flex items-center justify-center">
            {/* Compass markings */}
            <div className="absolute top-2 text-sm font-bold text-[var(--muted)]">N</div>
            <div className="absolute bottom-2 text-sm font-bold text-[var(--muted)]">S</div>
            <div className="absolute left-2 text-sm font-bold text-[var(--muted)]">W</div>
            <div className="absolute right-2 text-sm font-bold text-[var(--muted)]">E</div>
            
            {/* Qibla arrow */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${bearing}deg)` }}
            >
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-32 border-l-transparent border-r-transparent border-b-[var(--accent)]" />
            </div>
            
            {/* Center circle */}
            <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center">
              <span className="text-white text-2xl">🕋</span>
            </div>
          </div>

          <div className="text-center min-w-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-[var(--success)]">
              Qibla: {bearing.toFixed(1)}° {compassPoint(bearing)}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            options={CITIES.map((c) => ({ value: c.id, label: `${c.name}, ${c.country}` }))}
          />
          <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)]">
            Great-circle direction from {city.name} to the Kaaba in Masjid al-Haram.
          </p>
        </Card>
      </div>
    </div>
  );
}
