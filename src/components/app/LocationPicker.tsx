import { useMemo, useState } from 'react';
import { searchCities } from '../../lib/core/geo';
import { findCity } from '../../lib/core/geo';
import { useApp } from '../../store';
import { Modal } from '../ui/Modal';

export interface LocationPickerProps {
  /** Controls the dialog. */
  open: boolean;
  /** Close handler. */
  onClose: () => void;
}

/**
 * Searchable city picker dialog (S9). Updates latitude/longitude and
 * the saved city id; everything else recomputes from settings.
 * @param props - open/onClose.
 * @returns The rendered dialog.
 */
export function LocationPicker({ open, onClose }: LocationPickerProps): JSX.Element {
  const { settings, updateSettings } = useApp();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchCities(query), [query]);
  const current = findCity(settings.city);

  /** Applies the chosen city and closes the dialog. */
  function choose(id: string): void {
    const city = searchCities('').find((c) => c.id === id);
    if (city) {
      void updateSettings({ city: city.id, latitude: city.latitude, longitude: city.longitude });
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Choose your city">
      <label htmlFor="city-search" className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
        Search 43 built-in cities
      </label>
      <input
        id="city-search"
        autoFocus
        placeholder="e.g. Istanbul, Lahore, London…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={[
          'w-full h-11 rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 text-sm text-[var(--fg)]',
          'placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]',
          'focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)] transition-colors',
        ].join(' ')}
      />
      <ul className="mt-3 max-h-[46vh] overflow-y-auto space-y-1" role="listbox" aria-label="Cities">
        {results.map((city) => {
          const active = city.id === current.id;
          return (
            <li key={city.id} role="option" aria-selected={active}>
              <button
                type="button"
                onClick={() => choose(city.id)}
                className={[
                  'w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left min-w-0 transition-colors duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                  active
                    ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                    : 'border-transparent hover:bg-[var(--hover)]',
                ].join(' ')}
              >
                <span className="min-w-0">
                  <span className={['block truncate text-sm font-bold', active ? 'text-[var(--primary)]' : 'text-[var(--fg)]'].join(' ')}>
                    {city.name}
                  </span>
                  <span className="block text-xs text-[var(--muted)]">{city.country}</span>
                </span>
                <span className="shrink-0 text-[11px] font-semibold tnum text-[var(--muted)]">
                  {city.latitude.toFixed(1)}°, {city.longitude.toFixed(1)}°
                </span>
              </button>
            </li>
          );
        })}
        {results.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-[var(--muted)]">
            No city matches “{query}”.
          </li>
        ) : null}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
        Coordinates ship with the app — choosing a city never calls the network.
      </p>
    </Modal>
  );
}
