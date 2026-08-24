import { useEffect, useMemo, useState } from 'react';
import { addDaysISO, computePrayerTimes, nextPrayer } from '../../lib/core/prayer-engine';
import { PRAYER_LABELS, PRAYER_LABELS_AR, PRAYER_ORDER, TICK_INTERVAL_MS } from '../../lib/core/constants';
import { gregorianToHijri } from '../../lib/core/hijri';
import { findCity } from '../../lib/core/geo';
import { toISODate } from '../../lib/core/validator';
import { formatClockTime, formatCountdown, formatHijriLong } from '../../lib/utils/format';
import { navigate } from '../../lib/router';
import { useApp } from '../../store';
import { Badge } from '../ui/Badge';

/**
 * Landing hero (S8 '/'): opens with the product itself — a live
 * next-prayer countdown computed on-device for the saved city.
 * @returns The rendered hero section.
 */
export function Hero(): JSX.Element {
  const settings = useApp((s) => s.settings);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const todayISO = toISODate(now);
  const today = useMemo(
    () => computePrayerTimes(todayISO, settings.latitude, settings.longitude, settings.calcMethod, settings.madhab),
    [todayISO, settings]
  );
  const tomorrow = useMemo(
    () =>
      computePrayerTimes(
        addDaysISO(todayISO, 1),
        settings.latitude,
        settings.longitude,
        settings.calcMethod,
        settings.madhab
      ),
    [todayISO, settings]
  );
  const next = useMemo(() => nextPrayer(today, tomorrow, now), [today, tomorrow, now]);
  const hijri = useMemo(() => gregorianToHijri(now), [todayISO]); // eslint-disable-line react-hooks/exhaustive-deps
  const city = findCity(settings.city);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pt-20">
        <div className="min-w-0">
          <p className="arabic text-lg text-[var(--primary)] opacity-90">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--fg)] sm:text-5xl lg:text-6xl">
            Your deen,
            <br />
            <span className="text-[var(--primary)]">offline.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Prayer times, Qibla, Hijri calendar, Quran, dhikr, Zakat, duas and the 99 Names —
            a complete Islamic toolkit that lives in your browser.{' '}
            <strong className="font-bold text-[var(--fg)]">Free forever. No ads. No sign-up. No tracking.</strong>
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/tools/prayer')}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--primary)] px-6 text-sm font-bold text-[var(--primary-fg)] shadow-lg shadow-teal-900/20 hover:brightness-110 active:scale-[0.97] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              Open the toolkit
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 10h12m-5-5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex h-12 items-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 text-sm font-bold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-[0.97] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              How is it free?
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="success">100% free</Badge>
            <Badge tone="primary">Works offline</Badge>
            <Badge tone="neutral">Data stays on your device</Badge>
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="absolute -inset-6 rounded-[2rem] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] blur-2xl" aria-hidden="true" />
          <div className="relative rounded-2xl border border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] bg-[var(--card)] p-6 shadow-2xl shadow-teal-950/15 sm:p-7">
            <div className="bg-pattern absolute inset-0 rounded-2xl pointer-events-none" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                  Next prayer · {PRAYER_LABELS[next.name]}
                </p>
                <Badge tone="neutral">{city.name}</Badge>
              </div>
              <p className="mt-3 text-5xl font-extrabold tracking-tight tnum text-[var(--fg)] sm:text-6xl">
                {formatCountdown(next.at.getTime() - now.getTime())}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--muted)]">
                {PRAYER_LABELS_AR[next.name]} at {formatClockTime(next.at)} · {formatHijriLong(hijri)}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                {PRAYER_ORDER.map((name) => {
                  const active = name === next.name;
                  const past = today.times[name].getTime() <= now.getTime() && !active;
                  return (
                    <div
                      key={name}
                      className={[
                        'rounded-lg border px-1 py-2 text-center transition-colors',
                        active
                          ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]'
                          : 'border-[var(--border)] bg-[var(--field)]',
                        past && !active ? 'opacity-55' : '',
                      ].join(' ')}
                    >
                      <p className={['text-[10px] font-bold uppercase tracking-wide', active ? 'text-[var(--primary)]' : 'text-[var(--muted)]'].join(' ')}>
                        {PRAYER_LABELS[name]}
                      </p>
                      <p className="mt-0.5 text-xs font-bold tnum text-[var(--fg)]">{formatClockTime(today.times[name])}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-[var(--muted)]">
                Live, computed on this device with open astronomical math — zero network required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
