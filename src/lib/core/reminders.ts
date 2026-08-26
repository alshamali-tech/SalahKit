/**
 * Reminder scheduling logic (pure, deterministic — no side effects).
 * Chain of Thought: current instant → user config → prayer/adhkar/hifz
 * state → the list of reminders that are due right now.
 * Works identically on mobile, Windows and Linux because it is pure.
 */
import { PRAYER_LABELS } from './constants';
import type { PrayerName, PrayerTimesResult } from './types';

/** The kinds of reminder SalahKit can raise. */
export type ReminderKind = 'salah' | 'adhkar-morning' | 'adhkar-evening' | 'hifz';

/** Persisted reminder preferences (stored in localStorage). */
export interface ReminderConfig {
  /** Master switch. */
  enabled: boolean;
  /** Prayer-time reminders. */
  salah: boolean;
  /** Morning adhkar reminder. */
  adhkarMorning: boolean;
  /** Evening adhkar reminder. */
  adhkarEvening: boolean;
  /** Hifz review-due reminder. */
  hifz: boolean;
  /** Minutes before each prayer to remind. */
  salahLeadMin: number;
  /** HH:MM local time for morning adhkar. */
  morningTime: string;
  /** HH:MM local time for evening adhkar. */
  eveningTime: string;
  /** HH:MM local time for the hifz review nudge. */
  hifzTime: string;
}

/** Sensible defaults: everything on at reasonable times. */
export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  enabled: true,
  salah: true,
  adhkarMorning: true,
  adhkarEvening: true,
  hifz: true,
  salahLeadMin: 10,
  morningTime: '07:00',
  eveningTime: '18:30',
  hifzTime: '20:00',
};

/** A reminder that is due and ready to deliver. */
export interface DueReminder {
  /** Dedupe key: kind + prayer/date so it fires once per window. */
  tag: string;
  kind: ReminderKind;
  title: string;
  body: string;
}

/** The five daily prayers in order. */
const PRAYERS: readonly PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

/**
 * Parses an "HH:MM" string into minutes since midnight.
 * @param hhmm - Time string.
 * @returns Minutes since midnight, or null when malformed.
 */
export function hhmmToMinutes(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/**
 * True when `now` is inside the reminder window that ends at a target
 * time (i.e. between target-lead and target).
 * @param now - Current instant.
 * @param target - Target instant.
 * @param leadMs - Window length in ms before the target.
 * @returns Whether now falls in [target-lead, target].
 */
export function inWindow(now: Date, target: Date, leadMs: number): boolean {
  const t = target.getTime();
  const n = now.getTime();
  return n >= t - leadMs && n <= t;
}

/**
 * True when `now` has just crossed a daily HH:MM time (within the tick
 * tolerance), so a once-a-day reminder should fire.
 * @param now - Current instant.
 * @param hhmm - Scheduled time of day.
 * @param toleranceMs - How far past the time still counts (default 60s).
 * @returns Whether the daily trigger is hit.
 */
export function crossedDaily(now: Date, hhmm: string, toleranceMs = 60_000): boolean {
  const mins = hhmmToMinutes(hhmm);
  if (mins === null) return false;
  const target = new Date(now);
  target.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  const diff = now.getTime() - target.getTime();
  return diff >= 0 && diff <= toleranceMs;
}

/**
 * Computes which prayer reminders are due right now.
 * @param now - Current instant.
 * @param times - Prayer times for the current local date.
 * @param leadMin - Minutes before each prayer to remind.
 * @returns Due prayer reminders (at most one per prayer).
 */
export function dueSalahReminders(
  now: Date,
  times: PrayerTimesResult,
  leadMin: number
): DueReminder[] {
  const out: DueReminder[] = [];
  const leadMs = Math.max(0, leadMin) * 60_000;
  for (const name of PRAYERS) {
    const at = times.times[name];
    if (inWindow(now, at, leadMs)) {
      out.push({
        tag: `salah:${times.dateISO}:${name}`,
        kind: 'salah',
        title: `${PRAYER_LABELS[name]} in ${Math.max(1, Math.round((at.getTime() - now.getTime()) / 60_000))} min`,
        body: `Time for ${PRAYER_LABELS[name]} prayer. May Allah accept it.`,
      });
    }
  }
  return out;
}

/**
 * Computes the daily adhkar + hifz reminders that are due right now.
 * @param now - Current instant.
 * @param config - User reminder preferences.
 * @param hifzDueCount - Number of hifz chunks due for review today.
 * @returns Due adhkar/hifz reminders.
 */
export function dueDailyReminders(
  now: Date,
  config: ReminderConfig,
  hifzDueCount: number
): DueReminder[] {
  const out: DueReminder[] = [];
  const dateISO = toLocalISO(now);
  if (config.adhkarMorning && crossedDaily(now, config.morningTime)) {
    out.push({
      tag: `adhkar-morning:${dateISO}`,
      kind: 'adhkar-morning',
      title: 'Morning adhkar',
      body: 'Start your day with remembrance — the morning adhkar are ready.',
    });
  }
  if (config.adhkarEvening && crossedDaily(now, config.eveningTime)) {
    out.push({
      tag: `adhkar-evening:${dateISO}`,
      kind: 'adhkar-evening',
      title: 'Evening adhkar',
      body: 'Wind down with the evening adhkar before the night.',
    });
  }
  if (config.hifz && hifzDueCount > 0 && crossedDaily(now, config.hifzTime)) {
    out.push({
      tag: `hifz:${dateISO}`,
      kind: 'hifz',
      title: `Hifz review — ${hifzDueCount} chunk${hifzDueCount > 1 ? 's' : ''} due`,
      body: 'Your memorized portions are waiting for review. A few minutes keeps them strong.',
    });
  }
  return out;
}

/**
 * All reminders due right now, given the full state.
 * @param now - Current instant.
 * @param config - User preferences.
 * @param times - Today's prayer times.
 * @param hifzDueCount - Hifz chunks due today.
 * @returns Combined due reminders.
 */
export function getDueReminders(
  now: Date,
  config: ReminderConfig,
  times: PrayerTimesResult,
  hifzDueCount: number
): DueReminder[] {
  if (!config.enabled) return [];
  const salah = config.salah ? dueSalahReminders(now, times, config.salahLeadMin) : [];
  const daily = dueDailyReminders(now, config, hifzDueCount);
  return [...salah, ...daily];
}

/** Local calendar date as YYYY-MM-DD. */
function toLocalISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
