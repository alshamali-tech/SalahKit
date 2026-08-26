/**
 * Reminder runner: ticks every 30s, asks the pure core what is due,
 * and delivers via the system Notification API — falling back to an
 * in-app toast when notifications are unavailable or denied. Works in
 * installed PWAs on mobile, Windows and Linux alike.
 */
import { useEffect, useState } from 'react';
import {
  DEFAULT_REMINDER_CONFIG,
  getDueReminders,
} from './core/reminders';
import type { ReminderConfig } from './core/reminders';
import { computePrayerTimes } from './core/prayer-engine';
import { toISODate } from './core/validator';
import { getDb } from './db/db';
import { getJSON, setJSON } from './utils/storage';
import { emitToast } from './messaging';
import { useApp } from '../store';

const CONFIG_KEY = 'salahkit:reminders';
const FIRED_KEY = 'salahkit:reminders-fired';

/** True when the browser exposes the Notification API. */
export function notificationsSupported(): boolean {
  return typeof Notification !== 'undefined';
}

/** Loads the persisted reminder config (defaults on first run). */
export function loadReminderConfig(): ReminderConfig {
  return { ...DEFAULT_REMINDER_CONFIG, ...getJSON<Partial<ReminderConfig>>(CONFIG_KEY, {}) };
}

/** Persists reminder config. */
export function saveReminderConfig(config: ReminderConfig): void {
  setJSON(CONFIG_KEY, config);
}

/** Delivers one reminder: system notification, else in-app toast. */
function deliver(title: string, body: string): void {
  try {
    if (notificationsSupported() && Notification.permission === 'granted') {
      new Notification(`SalahKit — ${title}`, { body, icon: '/favicon.svg' });
      return;
    }
  } catch {
    // Fall through to the in-app toast.
  }
  emitToast({ title, body, tone: 'info', durationMs: 8000 });
}

/**
 * Runs the reminder loop for the lifetime of the app.
 * @returns The active config, so the UI can reflect state.
 */
export function useReminders(): ReminderConfig {
  const settings = useApp((s) => s.settings);
  const [config, setConfig] = useState<ReminderConfig>(loadReminderConfig);

  useEffect(() => {
    let cancelled = false;

    /** One evaluation pass: compute dues, dedupe, deliver. */
    async function tick(): Promise<void> {
      if (cancelled) return;
      const cfg = loadReminderConfig();
      setConfig(cfg);
      if (!cfg.enabled) return;
      const now = new Date();
      const times = computePrayerTimes(
        toISODate(now),
        settings.latitude,
        settings.longitude,
        settings.calcMethod,
        settings.madhab
      );
      let hifzDue = 0;
      if (cfg.hifz) {
        try {
          hifzDue = await getDb().hifzProgress.where('dueISO').belowOrEqual(toISODate(now)).count();
        } catch {
          hifzDue = 0;
        }
      }
      const due = getDueReminders(now, cfg, times, hifzDue);
      if (due.length === 0) return;
      const today = toISODate(now);
      const fired = getJSON<Record<string, string>>(FIRED_KEY, {});
      for (const r of due) {
        if (fired[r.tag] === today) continue;
        fired[r.tag] = today;
        deliver(r.title, r.body);
      }
      setJSON(FIRED_KEY, fired);
    }

    void tick();
    const id = window.setInterval(() => void tick(), 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [settings]);

  return config;
}
