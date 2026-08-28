import { useEffect, useState } from 'react';
import { useApp } from '../../store';
import { getPlan, getPlanLabel } from '../../lib/plan';
import { CITIES } from '../../lib/core/geo';
import { CALC_METHOD_LIST } from '../../lib/core/calc-methods';
import { getAppVersion } from '../../lib/seo';
import { checkForUpdates, onUpdateStatus } from '../../lib/sw-update';
import type { UpdateStatus } from '../../lib/sw-update';
import {
  loadReminderConfig,
  notificationsSupported,
  saveReminderConfig,
} from '../../lib/use-reminders';
import type { ReminderConfig } from '../../lib/core/reminders';
import { emitToast } from '../../lib/messaging';
import { LOCALES } from '../../lib/i18n';
import { useT } from '../../lib/use-locale';
import { DonationModal } from '../donation/DonationModal';
import { DataManager } from './DataManager';
import { PrivacyInfo } from './PrivacyInfo';
import { AboutPanel } from './AboutPanel';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import type { Madhab } from '../../types';

/** Human-readable label for the update-check state. */
const STATUS_LABELS: Record<UpdateStatus, string> = {
  unsupported: 'Updates run through your browser',
  active: 'Up to date · auto-checks every 30 min',
  checking: 'Checking for a newer version…',
  'update-available': 'New version ready — use the banner below',
  'up-to-date': 'Up to date',
};

/**
 * Version & updates card: shows the app version and lets the user
 * trigger a manual update check (automatic checks also run on focus
 * and every 30 minutes once the PWA is installed).
 * @returns The rendered card.
 */
function VersionCard(): JSX.Element {
  const [status, setStatus] = useState<UpdateStatus>('active');
  const [busy, setBusy] = useState(false);

  useEffect(() => onUpdateStatus(setStatus), []);

  /** Runs a manual check and reports the outcome. */
  async function check(): Promise<void> {
    setBusy(true);
    const result = await checkForUpdates();
    setBusy(false);
    if (result === 'up-to-date') {
      emitToast({ title: 'You’re on the latest version', tone: 'success' });
    } else if (result === 'update-available') {
      emitToast({ title: 'Update found', body: 'Use the banner to reload into the new version.', tone: 'info' });
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[var(--fg)]">Version & updates</p>
          <p className="text-xs text-[var(--muted)]">{STATUS_LABELS[status]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="neutral">v{getAppVersion()}</Badge>
          <Button variant="outline" size="sm" onClick={() => void check()} disabled={busy || status === 'unsupported'}>
            {busy ? 'Checking…' : 'Check for updates'}
          </Button>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted)]">
        Installed apps reload into new versions automatically; your data in this browser is never touched by updates.
      </p>
    </Card>
  );
}

/** A labelled on/off row. */
function ToggleRow({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (on: boolean) => void;
  hint?: string;
}): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="min-w-0">
        <p className="text-sm font-bold text-[var(--fg)]">{label}</p>
        {hint ? <p className="text-[11px] text-[var(--muted)]">{hint}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={[
          'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
          checked ? 'bg-[var(--primary)]' : 'bg-[var(--hover)]',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-150',
            checked ? 'left-[22px]' : 'left-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  );
}

/**
 * Reminders card: salah / adhkar / hifz notifications with times.
 * Delivered through the system Notification API when permitted, or as
 * in-app toasts otherwise.
 * @returns The rendered card.
 */
function ReminderCard(): JSX.Element {
  const [config, setConfig] = useState<ReminderConfig>(loadReminderConfig);
  const [perm, setPerm] = useState<string>(() =>
    notificationsSupported() ? Notification.permission : 'unsupported'
  );

  /** Applies a partial change and persists it. */
  function update(patch: Partial<ReminderConfig>): void {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      saveReminderConfig(next);
      return next;
    });
  }

  /** Asks the browser for notification permission. */
  async function askPermission(): Promise<void> {
    if (!notificationsSupported()) return;
    try {
      const result = await Notification.requestPermission();
      setPerm(result);
      if (result === 'granted') {
        new Notification('SalahKit — reminders on', {
          body: 'Prayer, adhkar and hifz reminders will appear here.',
          icon: '/favicon.svg',
        });
      }
    } catch {
      setPerm('denied');
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-extrabold text-[var(--fg)]">Reminders</p>
        {perm === 'granted' ? (
          <Badge tone="success">System notifications on</Badge>
        ) : perm === 'unsupported' ? (
          <Badge tone="neutral">In-app reminders</Badge>
        ) : (
          <Button variant="outline" size="sm" onClick={() => void askPermission()}>
            Enable notifications
          </Button>
        )}
      </div>
      <p className="mt-1 text-[11px] text-[var(--muted)]">
        Work on mobile, Windows and Linux — as system notifications when allowed, otherwise as in-app banners while SalahKit is open.
      </p>

      <div className="mt-2 divide-y divide-[var(--border)]">
        <ToggleRow label="All reminders" checked={config.enabled} onChange={(on) => update({ enabled: on })} />
        <ToggleRow
          label="Prayer times"
          hint={`Remind ${config.salahLeadMin} minutes before each prayer`}
          checked={config.salah && config.enabled}
          onChange={(on) => update({ salah: on })}
        />
        <div className="flex items-center justify-between gap-3 py-2 pl-4">
          <label htmlFor="rem-lead" className="text-xs font-semibold text-[var(--muted)]">Lead time</label>
          <select
            id="rem-lead"
            value={config.salahLeadMin}
            onChange={(e) => update({ salahLeadMin: Number(e.target.value) })}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--field)] px-2 text-xs font-bold text-[var(--fg)] focus:outline-none focus:border-[var(--primary)]"
          >
            {[5, 10, 15, 20, 30].map((m) => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="min-w-0 flex-1">
            <ToggleRow label="Morning adhkar" checked={config.adhkarMorning && config.enabled} onChange={(on) => update({ adhkarMorning: on })} />
          </div>
          <input
            type="time"
            aria-label="Morning adhkar time"
            value={config.morningTime}
            onChange={(e) => update({ morningTime: e.target.value })}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--field)] px-2 text-xs font-bold text-[var(--fg)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="min-w-0 flex-1">
            <ToggleRow label="Evening adhkar" checked={config.adhkarEvening && config.enabled} onChange={(on) => update({ adhkarEvening: on })} />
          </div>
          <input
            type="time"
            aria-label="Evening adhkar time"
            value={config.eveningTime}
            onChange={(e) => update({ eveningTime: e.target.value })}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--field)] px-2 text-xs font-bold text-[var(--fg)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="min-w-0 flex-1">
            <ToggleRow
              label="Hifz review"
              hint="Nudges only when portions are due"
              checked={config.hifz && config.enabled}
              onChange={(on) => update({ hifz: on })}
            />
          </div>
          <input
            type="time"
            aria-label="Hifz review time"
            value={config.hifzTime}
            onChange={(e) => update({ hifzTime: e.target.value })}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--field)] px-2 text-xs font-bold text-[var(--fg)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>
    </Card>
  );
}

/**
 * Settings dialog (S9): prayer preferences, theme, plan badge,
 * support section, privacy summary and data manager.
 * @returns The dialog, rendered from store state.
 */
export function SettingsPanel(): JSX.Element {
  const { settingsOpen, setSettingsOpen, settings, updateSettings, theme, setTheme } = useApp();
  const { locale, t, setLocale } = useT();
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
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                {t('settings.language')}
              </span>
              <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                {LOCALES.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={locale.id === l.id}
                    onClick={() => setLocale(l.id)}
                    className={[
                      'h-11 flex-1 text-sm font-semibold transition-colors duration-150',
                      'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)]',
                      locale.id === l.id
                        ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                        : 'bg-[var(--field)] text-[var(--muted)] hover:text-[var(--fg)]',
                      l.rtl ? 'arabic text-base' : '',
                    ].join(' ')}
                  >
                    {l.native}
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
                <p className="text-xs text-[var(--muted)]">Free forever. No ads. If this helps, consider supporting the developer.</p>
              </div>
              <Button variant="amber" size="sm" onClick={() => setDonateOpen(true)}>Donate</Button>
            </div>
          </section>

          <PrivacyInfo />
          <VersionCard />
          <AboutPanel />
          <ReminderCard />
          <DataManager />
        </div>
      </Modal>
      <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}
