# SalahKit — Free Offline Islamic Toolkit

A free, offline-first, private web toolkit for everyday Islamic practice:
prayer times, qibla, the full Quran with tajweed, Arabic foundations, Hijri
calendar, dhikr counter, zakat calculator, duas, the 99 Names, a streamed
hadith library, a spaced-repetition hifz trainer, and a prayer tracker.

**Free forever. No ads. No sign-up. No tracking. Works offline.**

## Philosophy

- **Offline-first** — prayer math, qibla, Hijri conversion and tajweed run as
  pure TypeScript on your device. Fetched content (hadith, audio, calendar
  refinement) is cached in IndexedDB and stays yours.
- **Private by architecture** — no servers, no accounts, no cookies, no
  analytics. Everything you log lives in your browser and can be exported,
  imported or wiped from Settings.
- **Halal by design** — donations are strictly optional, handled by external
  providers, and never unlock features (nothing is locked).

## Getting started

```sh
npm install        # install dependencies
npm run dev        # start the dev server
npm run build      # production build (static)
npm test           # unit + integration tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright)
```

Node 20+ is required (see `.nvmrc`).

## Stack

| Layer        | Choice                                    |
| ------------ | ----------------------------------------- |
| Framework    | Vite + React 18 + TypeScript (strict)     |
| Styling      | Tailwind CSS 4 + CSS variables (light/dark) |
| Local data   | Dexie.js (IndexedDB) — no server DB       |
| State        | Zustand + localStorage (prefs only)       |
| PWA          | `public/manifest.json` + `public/sw.js`   |
| Unit tests   | Vitest + Testing Library + fake-indexeddb |
| E2E tests    | Playwright (320 → 1440 viewports)         |

## Architecture

- `src/lib/core/` — pure, deterministic business logic (zero React): prayer
  astronomy, qibla geodesy, Hijri conversion, zakat, SM-2 spaced repetition,
  the tajweed engine and Arabic data.
- `src/lib/db/` — Dexie schema, repositories, backup/restore and the external
  cache layer.
- `src/lib/external/` — keyless, cached, rate-limited adapters (AlAdhan,
  hadith-api, NOAA declination, Quran CDN).
- `src/components/` — UI kit, landing, per-tool modules, settings, donation.
- `public/` — PWA manifest, service worker, icons, offline fallback.

Every external source is **optional**: each has an offline fallback so the
core works with no network at all. Sources are attributed in `/about` and in
`LICENSE`.

## Donations

Donations never unlock features and are never required. If SalahKit helps
you, consider supporting the developer:

- Ko-fi — https://ko-fi.com/mammonalshamali

## Contact

Bug reports and feature requests are welcome:

- Email — mamoonalshamali@gmail.com
- LinkedIn — https://www.linkedin.com/in/mammon-alshamali-366b10406/

## License

MIT — see [LICENSE](./LICENSE) for the full text and content attributions.
