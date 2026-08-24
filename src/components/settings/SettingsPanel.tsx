import { useState } from 'react';
import { useApp } from '../../store';
import { getPlan, getPlanLabel } from '../../lib/plan';
import { CITIES } from '../../lib/core/geo';
import { CALC_METHOD_LIST } from '../../lib/core/calc-methods';
import { DonationModal } from '../donation/DonationModal';
import { DataManager } from './DataManager';
import { PrivacyInfo } from './PrivacyInfo';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import type { Madhab } from '../../types';

/**
 * Settings dialog (S9): prayer preferences, theme, plan badge,
 * support section, privacy summary and data manager.
 * @returns The dialog, rendered from store state.
 */
export function SettingsPanel(): JSX.Element {
  const { settingsOpen, setSettingsOpen, settings, updateSettings, theme, setTheme } = useApp();
  const [donateOpen, setDonateOpen] = useState(false);

  /** Applies a city selection to settings. */
  function onCityChange(cityId: string): void {
    const city = CITIES.find((c) => c.id === cityId);
    if (city) {
      void updateSettings({ city: city.id, latitude: city.latitude, longitude: city.longitude });
    }
  }

  return (
    <>
      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
        <div className="space-y-4">
          <section aria-label="Prayer preferences" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="City"
              id="settings-city"
              value={settings.city}
              onChange={(e) => onCityChange(e.target.value)}
              options={CITIES.map((c) => ({ value: c.id, label: `${c.name}, ${c.country}` }))}
            />
            <Select
              label="Calculation method"
              id="settings-method"
              value={settings.calcMethod}
              onChange={(e) => void updateSettings({ calcMethod: e.target.value as typeof settings.calcMethod })}
              options={CALC_METHOD_LIST.map((m) => ({ value: m.id, label: m.name }))}
            />
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">Asr madhab</span>
              <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                {(['shafi', 'hanafi'] as const).map((m: Madhab) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={settings.madhab === m}
                    onClick={() => void updateSettings({ madhab: m })}
                    className={[
                      'h-11 flex-1 text-sm font-semibold transition-colors duration-150',
                      'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)]',
                      settings.madhab === m
                        ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                        : 'bg-[var(--field)] text-[var(--muted)] hover:text-[var(--fg)]',
                    ].join(' ')}
                  >
                    {m === 'shafi' ? 'Shafi’i (1×)' : 'Hanafi (2×)'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">Theme</span>
              <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                {(['light', 'dark'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={theme === t}
                    onClick={() => setTheme(t)}
                    className={[
                      'h-11 flex-1 text-sm font-semibold capitalize transition-colors duration-150',
                      'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)]',
                      theme === t
                        ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                        : 'bg-[var(--field)] text-[var(--muted)] hover:text-[var(--fg)]',
                    ].join(' ')}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section aria-label="Plan" className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--fg)]">Plan</p>
              <p className="text-xs text-[var(--muted)]">Every feature is included. Forever.</p>
            </div>
            <Badge tone="success">{getPlanLabel(getPlan())}</Badge>
          </section>

          <section aria-label="Support" className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_40%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-3 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[var(--fg)]">Support SalahKit</p>
                <p className="text-xs text-[var(--muted)]">Free forever. No ads. If this helps, consider a sadaqah.</p>
              </div>
              <Button variant="amber" size="sm" onClick={() => setDonateOpen(true)}>Donate</Button>
            </div>
          </section>

          <PrivacyInfo />
          <DataManager />
        </div>
      </Modal>
      <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}
