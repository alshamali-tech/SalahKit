/**
 * ICS calendar export (P0: OS handoff for prayer reminders).
 * The browser cannot ring an adhan when closed, so the honest primary
 * is handing a month of computed prayer times to the OS calendar —
 * the OS then owns the alarms. Pure, deterministic, no network.
 */
import { addDaysISO, computePrayerTimes } from '../core/prayer-engine';
import { PRAYER_LABELS } from '../core/constants';
import { toISODate } from '../core/validator';
import type { CalcMethodId, Madhab } from '../core/types';

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

/** Formats a local Date as an ICS floating-time stamp (YYYYMMDDTHHMMSS). */
function icsStamp(d: Date): string {
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(
    d.getMinutes()
  )}00`;
}

/** Escapes ICS TEXT values. */
function icsEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/**
 * Builds a VCALENDAR containing `days` days of prayer events, each
 * with a 10-minute VALARM. Times are floating (device-local), matching
 * how the engine computes them.
 * @param opts - Coordinates, method, madhab, day count and city name.
 * @returns A complete .ics document as a string.
 */
export function buildPrayerIcs(opts: {
  latitude: number;
  longitude: number;
  method: CalcMethodId;
  madhab: Madhab;
  days?: number;
  cityName: string;
}): string {
  const days = opts.days ?? 30;
  const events: string[] = [];
  const todayISO = toISODate(new Date());

  for (let i = 0; i < days; i += 1) {
    const dateISO = addDaysISO(todayISO, i);
    const result = computePrayerTimes(dateISO, opts.latitude, opts.longitude, opts.method, opts.madhab);
    for (const name of PRAYERS) {
      const at = result.times[name];
      const uid = `salahkit-${dateISO}-${name}@salahkit`;
      events.push(
        [
          'BEGIN:VEVENT',
          `UID:${uid}`,
          `DTSTAMP:${icsStamp(new Date())}`,
          `DTSTART:${icsStamp(at)}`,
          `SUMMARY:${icsEscape(`${PRAYER_LABELS[name]} · ${opts.cityName} — SalahKit`)}`,
          `DESCRIPTION:${icsEscape(
            'Computed on-device by SalahKit (open astronomical math). Verify with your local mosque timetable.'
          )}`,
          'BEGIN:VALARM',
          'TRIGGER:-PT10M',
          'ACTION:DISPLAY',
          `DESCRIPTION:${icsEscape(`${PRAYER_LABELS[name]} in 10 minutes`)}`,
          'END:VALARM',
          'END:VEVENT',
        ].join('\r\n')
      );
    }
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SalahKit//Prayer Times//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Downloads the ICS month as a file.
 * @param ics - Document from buildPrayerIcs.
 * @param cityName - Used in the filename.
 */
export function downloadIcs(ics: string, cityName: string): void {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `salahkit-prayer-times-${cityName.toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
