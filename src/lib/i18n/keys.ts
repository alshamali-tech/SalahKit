/**
 * Strongly-typed UI string catalogue. Every locale dictionary conforms
 * to this shape; `translate()` falls back to English for missing keys.
 */

/** Supported interface languages. */
export type LocaleId = 'en' | 'ar' | 'fr' | 'ur' | 'tr' | 'id';

/** One FAQ entry (localised). */
export interface FaqEntry {
  q: string;
  a: string;
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
    livePrayer: string;
    featuresKicker: string;
    featuresTitle: string;
    featuresSub: string;
    compareKicker: string;
    compareTitle: string;
    compareSub: string;
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
}
