import { useEffect } from 'react';
import { useApp } from './store';
import { watchRoute } from './lib/router';
import { isOnline, watchConnectivity } from './lib/utils/offline';
import { buildPageTitle } from './lib/seo';
import { SkipLink } from './components/ui/SkipLink';
import { Header } from './components/ui/Header';
import { Sidebar } from './components/ui/Sidebar';
import { Footer } from './components/ui/Footer';
import { ToastHost } from './components/ui/Toast';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { Landing } from './components/landing/Landing';
import { OfflineBanner } from './components/app/OfflineBanner';
import { DonationToast } from './components/donation/DonationToast';
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

/**
 * SalahKit application shell (S8 routes via hash router): landing
 * page at /, tool shell at /tools/[module], legal pages, ambient
 * layered background, toasts, donation prompt and settings.
 * @returns The root component.
 */
export default function App(): JSX.Element {
  const { view, module, booted, boot, syncFromHash, sidebarOpen, setSidebarOpen, setOnline } =
    useApp();

  useEffect(() => {
    void boot();
  }, [boot]);

  useEffect(() => {
    syncFromHash();
    return watchRoute(syncFromHash);
  }, [syncFromHash]);

  useEffect(() => {
    setOnline(isOnline());
    return watchConnectivity(setOnline);
  }, [setOnline]);

  useEffect(() => {
    document.title = view === 'landing' ? buildPageTitle() : buildPageTitle(module);
    window.scrollTo({ top: 0 });
  }, [view, module]);

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

      {view === 'landing' ? (
        <>
          <Header />
          <OfflineBanner />
          <main id="main-content" className="min-w-0 flex-1">
            <Landing />
          </main>
        </>
      ) : (
        <>
          <Header />
          <OfflineBanner />
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
        </>
      )}

      <Footer />

      {sidebarOpen ? <Sidebar onClose={() => setSidebarOpen(false)} /> : null}
      <SettingsPanel />
      <DonationToast />
      <ToastHost />
    </div>
  );
}
