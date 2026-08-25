import { lazy, Suspense, useEffect } from 'react';
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
import { QuranAudioDock } from './components/app/QuranAudioDock';
import type { ModuleId } from './types';

/* Tool modules are code-split: the initial bundle carries only the
   shell + landing (S13 <200KB budget); each tool streams in on demand. */
const PrayerTimes = lazy(() => import('./components/app/PrayerTimes').then((m) => ({ default: m.PrayerTimes })));
const QiblaCompass = lazy(() => import('./components/app/QiblaCompass').then((m) => ({ default: m.QiblaCompass })));
const HijriConverter = lazy(() => import('./components/app/HijriConverter').then((m) => ({ default: m.HijriConverter })));
const CalendarView = lazy(() => import('./components/app/CalendarView').then((m) => ({ default: m.CalendarView })));
const PrayerTracker = lazy(() => import('./components/app/PrayerTracker').then((m) => ({ default: m.PrayerTracker })));
const QuranReader = lazy(() => import('./components/app/QuranReader').then((m) => ({ default: m.QuranReader })));
const DuasList = lazy(() => import('./components/app/DuasList').then((m) => ({ default: m.DuasList })));
const HadithList = lazy(() => import('./components/app/HadithList').then((m) => ({ default: m.HadithList })));
const NamesList = lazy(() => import('./components/app/NamesList').then((m) => ({ default: m.NamesList })));
const DhikrCounter = lazy(() => import('./components/app/DhikrCounter').then((m) => ({ default: m.DhikrCounter })));
const ZakatCalc = lazy(() => import('./components/app/ZakatCalc').then((m) => ({ default: m.ZakatCalc })));
const HifzTrainer = lazy(() => import('./components/app/HifzTrainer').then((m) => ({ default: m.HifzTrainer })));
const TajweedModule = lazy(() => import('./components/app/TajweedModule').then((m) => ({ default: m.TajweedModule })));
const LegalPage = lazy(() => import('./components/app/LegalPage').then((m) => ({ default: m.LegalPage })));

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
    case 'hadith':
      return <HadithList />;
    case 'names':
      return <NamesList />;
    case 'dhikr':
      return <DhikrCounter />;
    case 'zakat':
      return <ZakatCalc />;
    case 'hifz':
      return <HifzTrainer />;
    case 'tajweed':
      return <TajweedModule />;
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
    try {
      window.scrollTo({ top: 0 });
    } catch {
      // Scroll APIs can be blocked in sandboxed embeds; non-fatal.
    }
  }, [view, module]);

  useEffect(() => {
    // SW registration must never crash the app: in non-secure or
    // sandboxed contexts the APIs can throw synchronously.
    try {
      if (
        import.meta.env.PROD &&
        'serviceWorker' in navigator &&
        typeof window.isSecureContext === 'boolean' &&
        window.isSecureContext
      ) {
        navigator.serviceWorker.register('/sw.js').catch(() => undefined);
      }
    } catch {
      // Offline caching simply stays disabled.
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
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center py-24" role="status" aria-label="Loading tool">
                      <span className="h-8 w-8 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)] animate-spin" />
                    </div>
                  }
                >
                  <div key={module} className="module-enter">
                    <ModuleView module={module} />
                  </div>
                </Suspense>
              )}
            </main>
          </div>
        </>
      )}

      <Footer />

      {sidebarOpen ? <Sidebar onClose={() => setSidebarOpen(false)} /> : null}
      <SettingsPanel />
      <DonationToast />
      <QuranAudioDock />
      <ToastHost />
    </div>
  );
}
