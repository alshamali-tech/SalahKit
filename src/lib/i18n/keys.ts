/**
 * Strongly-typed UI string catalogue. Every locale dictionary conforms
 * to this shape; `translate()` falls back to English for missing keys.
 */

/** Supported interface languages. */
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
  };
  settings: {
    title: string; city: string; method: string; asrMadhab: string; shafi: string;
    hanafi: string; theme: string; light: string; dark: string; plan: string;
    planNote: string; language: string; support: string; supportNote: string; donate: string;
  };
  offline: { message: string };
  donation: { toastTitle: string; toastBody: string; notNow: string };
  footer: { line: string; tools: string; support: string; builtWith: string };
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
  };
}
