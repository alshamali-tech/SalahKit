<p align="center">
  <img src="public/favicon.svg" alt="SalahKit" width="96" height="96" />
</p>

<h1 align="center">SalahKit <span dir="rtl">· صلاح كيت</span></h1>

<p align="center">
  <strong>Free offline Islamic tools — prayer times, Qibla, the full Quran, tajweed, Arabic, hifz, hadith, dhikr, Zakat and more.</strong><br />
  No ads · No sign-up · No tracking · Works on mobile, Windows and Linux
</p>

<p align="center">
  <img alt="PWA ready" src="https://img.shields.io/badge/PWA-installable-0f766e?style=for-the-badge" />
  <img alt="Offline first" src="https://img.shields.io/badge/offline-first_class-0f766e?style=for-the-badge" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-0f766e?style=for-the-badge" />
  <img alt="Languages" src="https://img.shields.io/badge/i18n-6_languages-0f766e?style=for-the-badge" />
</p>

---

SalahKit is a **privacy-first Islamic toolkit that lives entirely in your browser**. Every calculation — prayer times, Qibla bearing, Hijri dates, Zakat — runs on your device. Your logs, counters and settings sit in IndexedDB and never leave it. The only network calls are optional refinements (calendar dates, hadith streaming, magnetic declination), each cached locally and each with a full offline fallback.

> **Why it exists** — the dominant apps in this space charge $12.99/month, show ads, and were caught selling location data. SalahKit is the honest alternative: free forever, funded only by voluntary tips to its developer.

## What's inside

| Tool | What it does |
|---|---|
| 🕌 **Prayer Times** | Astronomical engine (NOAA series) — 43 cities, 5 calculation methods (MWL · ISNA · Egypt · Karachi · Umm al-Qura), Shafi'i/Hanafi Asr, live next-prayer countdown |
| 🧭 **Qibla Compass** | Live device-heading compass with tilt compensation, NOAA magnetic declination, true-north alignment feedback and haptics — plus a manual needle for sensor-less devices |
| 📅 **Hijri Converter** | Two-way Gregorian ↔ Hijri (tabular + Umm al-Qura refinement via AlAdhan) |
| 🗓️ **Hijri Calendar** | Full month view, Jumu'ah highlighted, today marked |
| ✅ **Prayer Tracker** | Weekly grid, streaks, per-day notes — persisted locally |
| 📖 **Quran Reader** | All 114 surahs (Arabic + EN/UR/FR), colored tajweed overlay, per-ayah audio from 5 reciters, bookmarks, surah picker |
| 🎓 **Tajweed Trainer** | 32-rule engine (Minhaj al-Darisin + al-Jazariyyah), guided path, interactive noon tree, letter map, sifāt explorer, live lab that annotates any ayah, 30+ golden test ayahs |
| 🔤 **Arabic Foundations** | 28 letters in all four contextual forms, harakat, Quran-focused grammar, high-frequency vocabulary — with speech synthesis |
| 📚 **Hadith Library** | Curated gems **plus** the full Sahih al-Bukhari (97 books) and Sahih Muslim (56 books) streamed section-by-section and cached offline |
| 🎧 **Hifz Trainer** | Spaced-repetition memorization (again/hard/good/easy), voice-recall that unhides the ayah when you recite it, progress graph over all 6,236 ayahs |
| 📿 **Dhikr Counter** | Progress-ring tasbih, 33/99/100 targets, undo, daily totals |
| 💰 **Zakat Calculator** | Live 2.5% against silver nisab, 12 currencies, saved records |
| 🤲 **Duas & Adhkar** | 139 authentic supplications across 11 life situations, Arabic + transliteration + translation + source |
| ✨ **99 Names** | Asma ul-Husna with meanings, searchable |
| 🔔 **Reminders** | Salah / adhkar / hifz notifications — system notifications where permitted, in-app fallback everywhere |

Plus: dark/light themes, 6 interface languages (English · العربية · Français · اردو · Türkçe · Bahasa Indonesia) with full RTL support, and installable PWA with automatic update detection.

## The three pillars

```
 ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
 │    FREE      │   │   OFFLINE    │   │   PRIVATE    │
 │  forever     │   │  first-class │   │  by design   │
 ├──────────────┤   ├──────────────┤   ├──────────────┤
 │ No ads       │   │ Every engine │   │ No account   │
 │ No paywall   │   │ runs on your │   │ No cookies   │
 │ No premium   │   │ device; the  │   │ No analytics │
 │   features   │   │ network only │   │ No trackers  │
 │ Tips go to   │   │ refines      │   │ Data in your │
 │ the developer│   │              │   │ IndexedDB    │
 └──────────────┘   └──────────────┘   └──────────────┘
```

## Quick start

```bash
# Linux / macOS
bash scripts/setup-linux.sh

# Windows (PowerShell)
./scripts/setup-windows.ps1

# …or manually
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run typecheck  # strict TypeScript check
```

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build (static, deployable anywhere) |
| `npm run typecheck` | `tsc --noEmit` |
| `npx vitest run` | Unit + integration tests |
| `npx vitest run --coverage` | With coverage (core target: 95%) |
| `npx playwright test` | E2E (landing, tools, offline, viewports, axe a11y) |
| `bash scripts/check-bundle.sh` | Enforces the <200KB gzipped initial-JS budget |

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 6 (static SPA, hash routing) |
| Styling | Tailwind CSS 4 + CSS custom properties (light/dark tokens) |
| State | Zustand (client-only store) |
| Data | IndexedDB via **Dexie 4** — schema v5, in-place migrations |
| Testing | Vitest + Testing Library + Playwright + axe-core |
| Fonts | System stack + Amiri Quran (Quran text) · Scheherazade New (UI Arabic) |
| Hosting | Any static host (Vercel / Cloudflare Pages / Netlify) |

**Explicitly not used:** server databases, auth, cookies, payment processing, analytics, AI.

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│  PRESENTATION  Header · Sidebar · 15 tool modules · i18n   │
├────────────────────────────────────────────────────────────┤
│  INTERACTION   Zustand store · toasts · audio player dock  │
│                voice recall (Web Speech) · reminders       │
├────────────────────────────────────────────────────────────┤
│  CORE ENGINES  (pure TS, zero side effects, unit-tested)   │
│  prayer-engine · qibla · hijri · zakat · tajweed (32 rules)│
│  hifz scheduler · speech-match · reminders · sifaat        │
├────────────────────────────────────────────────────────────┤
│  DATA          Dexie/IndexedDB (schema v5) · localStorage  │
│                backup/restore/clear · extCache with TTL    │
├────────────────────────────────────────────────────────────┤
│  EXTERNAL      AlAdhan · AlQuran Cloud · hadith-api CDN    │
│  (all keyless, cached, rate-limited, offline-safe)         │
│                NOAA Geomag · Islamic Network audio         │
└────────────────────────────────────────────────────────────┘
```

The core layer is **pure TypeScript with no framework imports** — the same engines drive the UI, the unit tests, and could drive a CLI. Every function is typed, documented, and returns deterministic results.

### Data model (IndexedDB, schema v5)

| Table | Key | Contents |
|---|---|---|
| `settings` | `id` | calc method, coordinates, city, madhab, theme, notif prefs |
| `prayerLog` | `id` · idx `dateISO` | per-day prayer completion + notes |
| `tasbih` | `id` · idx `timestamp` | dhikr counts |
| `zakatRecords` | `id` · idx `dateISO` | saved calculations |
| `quranCache` | `[surahNum+ayahNum]` | streamed Quran text + 3 translations |
| `extCache` | `key` | generic API cache with TTL |
| `userFlags` | `id` | donation-prompt timing, use counts |
| `duaFavorites` | `duaId` | favorite duas |
| `hadithFavorites` | `hadithId` | favorite hadiths |
| `hifzProgress` | `id` · idx `dueISO` | spaced-repetition state per chunk |

**Backup** exports every table to JSON; **import** validates and merges; **clear** wipes IndexedDB + localStorage.

## The tajweed engine

The crown jewel: a rule-as-data evaluator implementing **32 rules** across 10 categories — noon/tanween (izhār, idghām ± ghunna, iqlāb, ikhfā'), meem sakinah, ghunna, qalqalah (ṣughrā/wusṭā/kubrā per al-Jazariyyah), letter idghām (mutamāthilayn/mutajānisayn/mutaqāribayn), lam (shamsiyyah/qamariyyah/Allah), ra (tafkhīm/tarqīq), the full madd family (ṭabī'ī, badal, wājib, jā'iz, lāzim kalimī/ḥarfī, ʿāriḍ, līn, ṣilah), hamzat al-wasl, and waqf signs.

- **Rule-as-data** — each rule is a structured record (trigger, duration in harakāt, ghunna flag, priority, color); conflicts resolve by priority.
- **Golden tests** — `tests/unit/tajweed-suite.test.ts` asserts the *complete* rule assignment for 16+ real ayahs, organized as Chain / Tree / Graph reasoning suites.
- **Stop-aware qalqalah** — kubrā only at a stopping place on a mushaddad letter; wusṭā at a stop without shaddah; ṣughrā mid-flow.
- **Real-example verification** — the UI's "Real Examples" tab re-runs the engine over every canonical ayah and shows "engine agrees / mismatch" live.

## Internationalization

Six locales under `src/lib/i18n/locales/`, type-checked against a single `keys.ts` catalogue so a missing string is a compile error. Arabic and Urdu switch the whole document to `dir="rtl"` automatically. **Quran text is never translated** — only the interface chrome.

## PWA, caching & updates

- `public/sw.js` (versioned `salahkit-vN`): **network-first** for navigations (installed apps always see the newest page when online), **cache-first + stale-while-revalidate** for assets, old caches purged on activation.
- **Update flow** — the app watches for a waiting worker, raises an "Update ready — reload" banner, and reloads into the new version on accept. Settings → *Version & updates* offers a manual **Check now**.
- Installable on Android, iOS (Add to Home Screen), Windows and Linux (Chrome/Edge install).

## External data (all keyless, all optional)

| Source | Data | Cache | Offline fallback |
|---|---|---|---|
| AlAdhan API | Hijri dates | 30 days | local tabular algorithm |
| AlQuran Cloud | Quran text + translations | permanent | bundled short surahs |
| fawazahmed0/hadith-api (jsDelivr) | Sahihayn, section-by-section | 30 days | curated gems |
| NOAA Geomag | magnetic declination | 30 days | assume magnetic north |
| Islamic Network CDN | reciter audio | streamed | silence (UI stays usable) |

Each source is rate-limited client-side and never blocks the UI.

## Security headers

Served from [`public/_headers`](public/_headers) on Cloudflare Pages / Netlify. The full set, audited:

| Header | Value | Purpose |
|---|---|---|
| `X-Frame-Options` | `DENY` | No clickjacking (reinforced by CSP `frame-ancestors 'none'`) |
| `X-Content-Type-Options` | `nosniff` | No MIME-sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Minimal referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(self), geolocation=(), payment=(), usb=(), bluetooth=(), interest-cohort=()` | Only the mic (for hifz voice-recall) is allowed, and only to ourselves |
| `X-XSS-Protection` | `0` | Legacy auditor disabled per modern guidance — CSP is the protection |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | 2-year HTTPS enforcement |
| `Cross-Origin-Opener-Policy` | `same-origin` | Process isolation |
| `Cross-Origin-Resource-Policy` | `same-origin` | Resources aren't hotlinkable cross-origin |
| `Content-Security-Policy` | see below | The core policy |

**CSP breakdown** — no `'unsafe-inline'` anywhere; the theme bootstrap is an external file and everything else is build-time CSS:

```
default-src  'self'
script-src   'self'                    # no inline scripts
worker-src   'self'                    # service worker
style-src    'self' fonts.googleapis.com
img-src      'self' data:
font-src     'self' fonts.gstatic.com
media-src    'self' cdn.islamic.network audio.islamic.network
connect-src  'self' api.aladhan.com api.alquran.cloud
             www.ngdc.noaa.gov cdn.jsdelivr.net
manifest-src 'self'
object-src   'none'                    # no plugin injection
frame-ancestors 'none'
base-uri     'self'
form-action  'self'
upgrade-insecure-requests
```

Verify a deployment with:

```bash
curl -sI https://<your-host>/ | grep -iE 'content-security-policy|permissions-policy|strict-transport'
```

## Testing

- **Unit** (Vitest): prayer-engine, qibla, hijri round-trips, zakat, validators, DB CRUD, cache TTL, backup/restore, speech-match, hifz scheduler, and the tajweed golden suite.
- **Integration**: PrayerTimes renders + calculates; QuranReader navigates surahs.
- **E2E** (Playwright + axe): landing, tool navigation, settings persistence, offline mode via network blocking, viewports 320/768/1024/1440, WCAG 2.1 AA scan.
- **Budget**: `scripts/check-bundle.sh` fails CI if initial JS exceeds 200KB gzipped (current: ~105KB).
- **Code-splitting**: each tool is a lazy chunk; non-English UI dictionaries, the settings/data-manager panel, the audio dock and the update banner all load on demand, so first paint only pays for the landing shell and core engines.

## Support the developer

SalahKit is free forever and will never have a paywall. If it helps you, voluntary tips keep the hosting and development going — handled entirely by external providers, never by this app:

- [Ko-fi](https://ko-fi.com/salahkit) (primary)
- [Buy Me a Coffee](https://www.buymeacoffee.com/salahkit)
- [PayPal](https://www.paypal.com/donate/?hosted_button_id=salahkit)

## Privacy & legal

Zero data collected. No cookies, no analytics, no third-party trackers. Everything you enter stays in your browser's IndexedDB — export it, import it elsewhere, or wipe it from Settings at any time. Full [Privacy Policy](https://salahkit.app/#/privacy) and [Terms of Service](https://salahkit.app/#/terms) ship in the app.

## Credits & attributions

- Prayer calculations — open astronomical methods (NOAA solar series)
- Quran text & translations — [AlQuran Cloud](https://alquran.cloud) (public-domain translations)
- Reciter audio — [Islamic Network CDN](https://cdn.islamic.network)
- Hadith — [fawazahmed0/hadith-api](https://github.com/fawazahmed0/hadith-api)
- Hijri refinement — [AlAdhan API](https://aladhan.com)
- Magnetic declination — [NOAA Geomag](https://www.ngdc.noaa.gov)
- Tajweed rules — Minhaj al-Darisin (Damra & Damra), al-Muqaddimah al-Jazariyyah, Tuḥfat al-Aṭfāl

May Allah accept this as ongoing charity. **وَقُل رَّبِّ زِدْنِي عِلْمًا**
