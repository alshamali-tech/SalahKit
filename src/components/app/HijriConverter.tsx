import { useEffect, useMemo, useState } from 'react';
import { gregorianToHijri, hijriMonthLength, hijriMonthName, hijriToGregorian } from '../../lib/core/hijri';
import { HIJRI_MONTHS_AR } from '../../lib/core/constants';
import { isValidHijri, isValidISODate, parseNumber } from '../../lib/core/validator';
import { formatFullDate, formatHijriLong, formatShortDate } from '../../lib/utils/format';
import { fetchAlAdhanHijri } from '../../lib/external/aladhan';
import { useApp } from '../../store';
import { useT } from '../../lib/use-locale';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import type { HijriDate } from '../../types';

/**
 * Hijri calendar module: bidirectional conversion between Gregorian
 * and Hijri dates, with optional online Umm al-Qura refinement (S5:
 * cached 30d, rate-limited, graceful offline fallback).
 * @returns The rendered module.
 */
export function HijriConverter(): JSX.Element {
  const { online, settings, updateSettings } = useApp();
  const { t } = useT();
  const [today] = useState(() => new Date());
  const [remote, setRemote] = useState<HijriDate | null>(null);
  const [gDate, setGDate] = useState(() => today.toISOString().slice(0, 10));
  const [hYear, setHYear] = useState('1447');
  const [hMonth, setHMonth] = useState('9');
  const [hDay, setHDay] = useState('1');

  const adjust = settings.hijriAdjust ?? 0;
  const localToday = useMemo(() => {
    const shifted = new Date(today);
    shifted.setDate(shifted.getDate() + adjust);
    return gregorianToHijri(shifted);
  }, [today, adjust]);

  useEffect(() => {
    let cancelled = false;
    const d = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    void fetchAlAdhanHijri(d).then((r) => {
      if (!cancelled) setRemote(r);
    });
    return () => {
      cancelled = true;
    };
  }, [today]);

  const gToHResult = useMemo(() => {
    if (!isValidISODate(gDate)) return null;
    const [y, m, d] = gDate.split('-').map(Number);
    return gregorianToHijri(new Date(y, m - 1, d));
  }, [gDate]);

  const hToGResult = useMemo(() => {
    const y = parseNumber(hYear, NaN);
    const m = parseNumber(hMonth, NaN);
    const rawD = parseNumber(hDay, NaN);
    if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return null;
    const maxDay = Number.isFinite(y) && y >= 1 ? hijriMonthLength(y, m) : 30;
    const d = Math.min(Math.max(1, Math.floor(rawD)), maxDay);
    if (!isValidHijri(y, m, d)) return null;
    return { date: hijriToGregorian({ year: y, month: m, day: d }), hijri: { year: y, month: m, day: d } };
  }, [hYear, hMonth, hDay]);

  return (
    <div className="space-y-5">
      <Card tone="raised" className="relative overflow-hidden">
        <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Today</p>
            <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[var(--fg)]">{formatHijriLong(localToday)}</p>
            <p className="arabic text-xl text-[var(--muted)] mt-1">
              {localToday.day} {HIJRI_MONTHS_AR[localToday.month - 1]} {localToday.year} هـ
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{formatFullDate(today)}</p>
          </div>
          <div className="flex flex-col items-start gap-1.5">
            {remote ? (
              <>
                <Badge tone="accent">Umm al-Qura · AlAdhan</Badge>
                <span className="text-sm font-semibold text-[var(--fg)]">{formatHijriLong(remote)}</span>
              </>
            ) : (
              <Badge tone="neutral">{online ? 'Local tabular calendar' : 'Offline · local calendar'}</Badge>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-[var(--fg)]">{t('hijriAdjust.title')}</p>
            <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-[var(--muted)]">{t('hijriAdjust.note')}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {([-1, 0, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={adjust === d}
                onClick={() => void updateSettings({ hijriAdjust: d })}
                className={[
                  'h-10 min-w-11 rounded-lg px-3 text-sm font-extrabold tnum transition-all duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                  adjust === d
                    ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                    : 'border border-[var(--border)] bg-[var(--field)] text-[var(--muted)] hover:text-[var(--fg)]',
                ].join(' ')}
              >
                {d > 0 ? `+${d}` : d}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--warning)]">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M13.5 11.5A6 6 0 0 1 6.5 4.5a6 6 0 1 0 7 7z" strokeLinejoin="round" />
          </svg>
          {t('hijriAdjust.verify')}
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card hover>
          <h3 className="text-sm font-bold text-[var(--fg)] mb-3">Gregorian → Hijri</h3>
          <Input
            label="Gregorian date"
            id="g-to-h"
            type="date"
            value={gDate}
            onChange={(e) => setGDate(e.target.value)}
          />
          <div className="mt-4 rounded-lg bg-[var(--field)] border border-[var(--border)] p-3">
            {gToHResult ? (
              <>
                <p className="text-lg font-bold text-[var(--fg)]">{formatHijriLong(gToHResult)}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {hijriMonthName(gToHResult.month)} · tabular civil calendar (±1 day vs Umm al-Qura)
                </p>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">Pick a valid date to convert.</p>
            )}
          </div>
        </Card>

        <Card hover>
          <h3 className="text-sm font-bold text-[var(--fg)] mb-3">Hijri → Gregorian</h3>
          <div className="grid grid-cols-3 gap-2">
            <Input label="Day" id="h-day" inputMode="numeric" value={hDay} onChange={(e) => setHDay(e.target.value)} />
            <Input label="Month" id="h-month" inputMode="numeric" value={hMonth} onChange={(e) => setHMonth(e.target.value)} hint="1–12" />
            <Input label="Year" id="h-year" inputMode="numeric" value={hYear} onChange={(e) => setHYear(e.target.value)} hint="AH" />
          </div>
          <div className="mt-4 rounded-lg bg-[var(--field)] border border-[var(--border)] p-3">
            {hToGResult ? (
              <>
                <p className="text-lg font-bold text-[var(--fg)]">{formatFullDate(hToGResult.date)}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {formatShortDate(hToGResult.date)} · from {hijriMonthName(hToGResult.hijri.month)} {hToGResult.hijri.year} AH
                </p>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">Enter a valid Hijri date.</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-bold text-[var(--fg)] mb-3">Hijri months</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {HIJRI_MONTHS_AR.map((ar, i) => (
            <div
              key={ar}
              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--fg)] truncate">
                  {i + 1}. {['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Shaban','Ramadan','Shawwal','Dhul-Qadah','Dhul-Hijjah'][i]}
                </p>
              </div>
              <span className="arabic text-sm text-[var(--muted)] shrink-0 leading-6">{ar}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
