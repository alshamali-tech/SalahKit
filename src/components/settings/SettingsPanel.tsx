import { useRef, useState } from 'react';
import { CALC_METHOD_LIST } from '../../lib/core/calc-methods';
import { CITIES } from '../../lib/core/geo';
import { DONATION_LINKS, DONATION_TAGLINE } from '../../lib/donation';
import { getPlan, getPlanLabel } from '../../lib/plan';
import { getAppVersion } from '../../lib/seo';
import { exportBackup, importBackup } from '../../lib/db/backup';
import { clearAllData } from '../../lib/db/clear';
import { emitError, emitToast } from '../../lib/messaging';
import { useApp } from '../../store';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import type { Madhab } from '../../types';

/**
 * Settings dialog: appearance, location, calculation, data management
 * (export / import / clear), support links and about info.
 * @returns The settings modal bound to the store.
 */
export function SettingsPanel(): JSX.Element {
  const { settingsOpen, setSettingsOpen, settings, updateSettings, theme, setTheme, setModule } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [armWipe, setArmWipe] = useState(false);

  /** Downloads a JSON backup of every table. */
  async function onExport(): Promise<void> {
    const json = await exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salahkit-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    emitToast({ title: 'Backup exported', body: 'salahkit-backup.json downloaded.', tone: 'success' });
  }

  /** Reads the chosen file and merges it into the database. */
  async function onImport(file: File): Promise<void> {
    try {
      const text = await file.text();
      const { merged } = await importBackup(text);
      emitToast({ title: 'Backup restored', body: `${merged} records merged into this browser.`, tone: 'success' });
    } catch (err) {
      emitError('Import failed', err instanceof Error ? err.message : 'Invalid backup file.');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  /** Two-step destructive wipe of all local data. */
  async function onClear(): Promise<void> {
    if (!armWipe) {
      setArmWipe(true);
      window.setTimeout(() => setArmWipe(false), 4000);
      return;
    }
    await clearAllData();
    emitToast({ title: 'All data wiped', body: 'Reloading with factory defaults…', tone: 'warning' });
    window.setTimeout(() => window.location.reload(), 900);
  }

  return (
    <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Appearance</h3>
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            {(['light', 'dark'] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={theme === t}
                onClick={() => setTheme(t)}
                className={[
                  'h-11 flex-1 text-sm font-semibold capitalize transition-colors duration-150',
                  theme === t ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'bg-[var(--field)] text-[var(--muted)] hover:text-[var(--fg)]',
                ].join(' ')}
              >
                {t === 'light' ? '☀ Light' : '☾ Dark'}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="City"
            id="settings-city"
            value={settings.city}
            onChange={(e) => {
              const city = CITIES.find((c) => c.id === e.target.value);
              if (city) void updateSettings({ city: city.id, latitude: city.latitude, longitude: city.longitude });
            }}
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
                    settings.madhab === m ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'bg-[var(--field)] text-[var(--muted)] hover:text-[var(--fg)]',
                  ].join(' ')}
                >
                  {m === 'shafi' ? 'Shafi’i' : 'Hanafi'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2.5 cursor-pointer h-11">
              <input
                type="checkbox"
                checked={settings.notifPref}
                onChange={(e) => void updateSettings({ notifPref: e.target.checked })}
                className="h-5 w-5 accent-[var(--primary)]"
              />
              <span className="text-sm font-medium text-[var(--fg)]">Prayer reminders (when supported)</span>
            </label>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Your data</h3>
          <p className="text-xs text-[var(--muted)] mb-3">
            Everything lives in this browser’s IndexedDB. Export anytime, import on any device, or wipe it all.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => void onExport()}>Export backup</Button>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>Import backup</Button>
            <Button variant={armWipe ? 'danger' : 'ghost'} size="sm" onClick={() => void onClear()}>
              {armWipe ? 'Tap again to confirm wipe' : 'Clear all data'}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              aria-label="Import backup file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onImport(file);
              }}
            />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Support SalahKit</h3>
          <p className="text-xs text-[var(--muted)] mb-3">{DONATION_TAGLINE}</p>
          <div className="flex flex-wrap gap-2">
            {DONATION_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-all duration-150 active:scale-[0.97]',
                  link.primary
                    ? 'bg-[var(--accent)] text-[#3b2305] hover:brightness-105'
                    : 'border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[var(--accent)]',
                ].join(' ')}
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
          <Badge tone="success">{getPlanLabel(getPlan())}</Badge>
          <Badge tone="neutral">v{getAppVersion()}</Badge>
          <Button variant="ghost" size="sm" onClick={() => { setModule('privacy'); setSettingsOpen(false); }}>Privacy</Button>
          <Button variant="ghost" size="sm" onClick={() => { setModule('terms'); setSettingsOpen(false); }}>Terms</Button>
        </section>
      </div>
    </Modal>
  );
}
