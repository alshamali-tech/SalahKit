import { useEffect } from 'react';
import { useApp } from './store';
import { STORAGE_KEYS } from './lib/core/constants';
import { getFlags, saveFlags } from './lib/db/db';
import { flagsAfterPromptShown, shouldShowDonationPrompt } from './lib/donation';
import { isFeatureEnabled } from './lib/features';
import { emitToast } from './lib/messaging';
import { buildPageTitle } from './lib/seo';
import { isOnline, watchConnectivity } from './lib/utils/offline';
import { SkipLink } from './components/ui/SkipLink';
import { Header } from './components/ui/Header';
import { Sidebar } from './components/ui/Sidebar';
import { Footer } from './components/ui/Footer';
import { ToastHost } from './components/ui/Toast';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { PrayerTimes } from './components/app/PrayerTimes';
import { QiblaCompass } from './components/app/QiblaCompass';
import { HijriConverter } from './components/app/HijriConverter';
import { CalendarView } from './components/app/CalendarView';
import { PrayerTracker } from './components/app/PrayerTracker';
import { QuranReader } from './components/app/QuranReader';
import { DuasList } from './components/app/DuasList';
import { NamesList } from './components/app/NamesList';
import { DhikrCounter } from './components/app/DhikrCounter';
import { ZakatCalc } from './components/app/ZakatCalc';
import { LegalPage } from './components/app/LegalPage';
import type { ModuleId } from './types';

/**
 * Renders the active tool module.
 * @param props - module id.
 * @returns The module component.
 */
function ModuleView({ module }: { module: ModuleId }): JSX.Element {
  switch (module) {
    case 'qibla':
      return <QiblaCompass />;
    case 'hijri':
      return <HijriConverter />;
    case 'calendar':
      return <CalendarView />;
    case 'tracker':
      return <PrayerTracker />;
    case 'quran':
      return <QuranReader />;
    case 'duas':
      return <DuasList />;
    case 'names':
      return <NamesList />;
    case 'dhikr':
      return <DhikrCounter />;
    case 'zakat':
      return <ZakatCalc />;
    case 'privacy':
      return <LegalPage kind="privacy" />;
    case 'terms':
      return <LegalPage kind="terms" />;
    case 'prayer':
    default:
      return <PrayerTimes />;
  }
}

/** Slim offline notice shown while the browser has no connectivity. */
function OfflineStrip(): JSX.Element {
  return (
    <div role="status" className="border-b border-[color-mix(in_srgb,var(--warning)_35%,transparent)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)]">
      <p className="mx-auto max-w-7xl px-4 py-2 text-xs font-semibold text-[var(--warning)] flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M2.5 7.5a11 11 0 0 1 15 0M5.5 10.7a7 7 0 0 1 9 0M8.5 13.8a3 3 0 0 1 3 0M10 16.5v.01" strokeLinecap="round" />
          <path d="M3 3l14 14" strokeLinecap="round" />
        </svg>
        You’re offline — every tool still works. Data never leaves this device.
      </p>
    </div>
  );
}

/**
 * SalahKit application shell: ambient layered background, header,
 * collapsible sidebar, active tool module, footer, toasts, settings
 * dialog, donation timing (S11) and connectivity handling.
 * @returns The root component.
 */
export default function App(): JSX.Element {
  const { module, booted, boot, sidebarOpen, setSidebarOpen, online, setOnline } = useApp();

  useEffect(() => {
    void boot();
  }, [boot]);

  useEffect(() => {
    setOnline(isOnline());
    return watchConnectivity(setOnline);
  }, [setOnline]);

  useEffect(() => {
    document.title = buildPageTitle(module);
  }, [module]);

  /* Donation prompt (S11): counts tool uses, never prompts on first
     visits, max once per session and per day, 7-day dismissal cooldown. */
  useEffect(() => {
    if (module === 'privacy' || module === 'terms') return;
    if (!isFeatureEnabled('donations')) return;
    void (async () => {
      try {
        const flags = await getFlags();
        const useCount = flags.useCount + 1;
        await saveFlags({ useCount });
        const sessionShown =
          typeof sessionStorage !== 'undefined' &&
          sessionStorage.getItem(STORAGE_KEYS.donationSessionShown) === '1';
        const eligible = shouldShowDonationPrompt({
          useCount,
          donationDismissedAt: flags.donationDismissedAt,
          lastToastDate: flags.lastToastDate,
          sessionShown,
          now: new Date(),
        });
        if (!eligible) return;
        const updated = await getFlags();
        await saveFlags(flagsAfterPromptShown(updated, new Date()));
        sessionStorage.setItem(STORAGE_KEYS.donationSessionShown, '1');
        emitToast({
          title: 'SalahKit is free forever',
          body: 'No ads, no tracking. If it helps you, consider a sadaqah — links under Support in Settings.',
          tone: 'info',
          durationMs: 9000,
        });
      } catch {
        // IndexedDB unavailable: donation logic silently skipped.
      }
    })();
  }, [module]);

  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <SkipLink />

      {/* Ambient layered background: lattice + soft radial glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-pattern drift-slow" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-3xl" />
      </div>

      <Header />
      {!online ? <OfflineStrip /> : null}

      <div className="mx-auto flex w-full max-w-7xl flex-1 items-start gap-6 px-4 py-6">
        <Sidebar />
        <main id="main-content" className="min-w-0 flex-1 scroll-mt-20">
          {!booted ? (
            <div className="flex items-center justify-center py-24" role="status" aria-label="Loading SalahKit">
              <span className="h-8 w-8 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)] animate-spin" />
            </div>
          ) : (
            <div key={module} className="module-enter">
              <ModuleView module={module} />
            </div>
          )}
        </main>
      </div>

      <Footer />

      {sidebarOpen ? <Sidebar onClose={() => setSidebarOpen(false)} /> : null}
      <SettingsPanel />
      <ToastHost />
    </div>
  );
}
