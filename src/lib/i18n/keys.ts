/**
 * Strongly-typed UI string catalogue. Every locale dictionary conforms
 * to this shape; `translate()` falls back to English for missing keys.
 */

/** Supported interface languages (English + Arabic). */
export type LocaleId = 'en' | 'ar';

/** One FAQ entry (localised). */
export interface FaqEntry {
  q: string;
  a: string;
}

/** One comparison-table row (localised). */
export interface CompareRow {
  label: string;
  salahkit: string;
  typical: string;
}

/** The complete UI string catalogue. */
export interface TranslationKeys {
  app: { name: string; tagline: string };
  nav: {
    home: string;
    settings: string;
    support: string;
    privacy: string;
    terms: string;
    openMenu: string;
    closeMenu: string;
    language: string;
  };
  sidebar: {
    freeBadge: string;
    sections: { daily: string; knowledge: string; practice: string; about: string };
    supportNote: string;
    supportCta: string;
    more: string;
  };
  modules: {
    prayer: string; qibla: string; hijri: string; quran: string; tajweed: string;
    arabic: string; dhikr: string; zakat: string; duas: string; names: string;
    hadith: string; hifz: string; tracker: string; calendar: string;
  };
  badges: { free: string; offline: string; online: string; freeForever: string };
  common: {
    listen: string; copy: string; copied: string; search: string; all: string;
    favorites: string; next: string; back: string; save: string; close: string;
    learnMore: string; reset: string; loading: string;
  };
  landing: {
    kicker: string;
    title: string;
    sub: string;
    ctaTools: string;
    ctaFree: string;
    ctaFaq: string;
    heroBadges: readonly [string, string, string];
    livePrayer: string;
    featuresKicker: string;
    featuresTitle: string;
    featuresSub: string;
    /** Blurbs for the landing feature mosaic, by tile order. */
    featureBlurbs: readonly string[];
    compareKicker: string;
    compareTitle: string;
    compareSub: string;
    compareHeaders: { feature: string; salahkit: string; typical: string };
    compareRows: readonly CompareRow[];
    compareCta: string;
    compareCtaNote: string;
    supportKicker: string;
    faqKicker: string;
    faqTitle: string;
    supportTitle: string;
    supportSub: string;
    supportBtn: string;
    faq: readonly FaqEntry[];
    /** Privacy section (optional — locales fall back to English). */
    privacyKicker?: string;
    privacyTitle?: string;
    privacySub?: string;
    privacyProof?: string;
    privacyItems?: readonly string[];
    /** Offline-first section (optional — locales fall back to English). */
    offlineKicker?: string;
    offlineTitle?: string;
    offlineSub?: string;
    offlineSteps?: readonly { title: string; body: string }[];
  };
  settings: {
    title: string; city: string; method: string; asrMadhab: string; shafi: string;
    hanafi: string; theme: string; light: string; dark: string; plan: string;
    planNote: string; language: string; support: string; supportNote: string; donate: string;
  };
  offline: { message: string };
  donation: { toastTitle: string; toastBody: string; notNow: string };
  footer: { line: string; tools: string; support: string; builtWith: string };
  /** About page/panel (optional — locales fall back to English). */
  about?: {
    title: string;
    mission: string;
    sourcesTitle: string;
    /** Descriptions aligned by index with the source list in AboutPanel. */
    sourceDescs: readonly string[];
    license: string;
  };
  /** Donate page (optional — locales fall back to English). */
  donate?: { title: string; sub: string; note: string; faq: readonly FaqEntry[] };
  /** Per-tool UI chrome (headings, tabs, buttons, empty states). */
  modulesUi: {
    tajweed: {
      introKicker: string; introTitle: string; introSub: string; introListen: string;
      tabs: { path: string; tree: string; check: string; map: string; sifaat: string; lab: string };
      hints: { path: string; tree: string; check: string; map: string; sifaat: string; lab: string };
      masteredOf: string; markMastered: string; mastered: string;
      practice: string; labPlaceholder: string; labLive: string; labFound: string;
      engineAgrees: string; engineMismatch: string; verified: string;
      lettersTitle: string; zonesTitle: string;
    };
    hadith: {
      ofTheDay: string; fullTitle: string; fullSub: string;
      curatedTitle: string; curatedSub: string;
      myFavorites: string; noFavoritesTitle: string; noFavoritesSub: string;
      searchPlaceholder: string; hadiths: string; allSections: string;
      loadingSection: string; cantLoad: string; tryOnline: string; tryAgain: string;
      offlineNote: string; footerNote: string; addedFav: string; removedFav: string;
      hadithCopied: string; copyUnavailable: string;
    };
    hifz: {
      stepListen: string; stepRecite: string; stepReview: string;
      listenChunk: string; allChunks: string; reciteThenTap: string;
      revealAll: string; checked: string;
      again: string; hard: string; good: string; easy: string;
      saveContinue: string;
    };
    quran: {
      listenSurah: string; chooseSurah: string; bookmarks: string; continueReading: string;
      playAyah: string; offlineLocal: string; loadingSurah: string; copiedAyah: string;
    };
    arabic: {
      searchLetters: string; hearIt: string; joins: string; neverJoins: string;
      startsWith: string;
      tabs: { letters: string; harakat: string; grammar: string; vocab: string };
    };
    prayer: {
      city: string; changeCity: string; method: string; whichRight: string; whichRightBody: string;
      asrMadhab: string; upNext: string; onDevice: string; computedNote: string;
      nextPrayer: string; at: string;
    };
    qibla: {
      bearing: string; liveCompass: string; manualDial: string; sensorBlocked: string; paused: string;
      acquiring: string; facing: string; turnRight: string; turnLeft: string; toGo: string;
      qiblaIs: string; fromNorth: string; declination: string; trueNorth: string; unavailable: string;
      noaaLive: string; noaaCached: string; yourCity: string; cityNote: string; enable: string;
      holdFlat: string; toKaaba: string; fromCity: string;
    };
    hijri: {
      today: string; gToH: string; hToG: string; gDate: string; day: string; month: string; year: string;
      hijriMonths: string; pickValid: string; enterValid: string; fromWord: string; tabularNote: string;
      ummAlQura: string; localTabular: string; offlineLocal: string;
    };
    calendar: {
      hijriMonth: string; prevMonth: string; nextMonth: string; todayBtn: string; today: string;
      jumuah: string; daysThisMonth: string;
    };
    tracker: {
      streak: string; day: string; days: string; thisWeek: string; undo: string; noteToday: string;
      notePlaceholder: string; saveNote: string; noteSaved: string; dayHeader: string;
    };
    dhikr: {
      todaysDhikr: string; target: string; dhikrPhrase: string; private: string; privateNote: string;
      undo: string; reset: string; of: string;
    };
    zakat: {
      wealth: string; currency: string; saveRecord: string; zakatDue: string; nisabMet: string;
      belowNisab: string; monthly: string; totalAssets: string; netDebts: string; silverNisab: string;
      goldNisab: string; saved: string; undoDelete: string;
    };
  };
}
