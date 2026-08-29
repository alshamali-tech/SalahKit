# Platform quirks — the honest ledger

SalahKit is 100% client-side by design. Browsers impose real limits; this
document lists each one and what the app does about it. Trust > magic.

## Timers & background behavior
- **Hidden tabs are throttled** (Chrome 88+, all modern engines). SalahKit
  never accumulates timer ticks: every countdown re-derives from
  `Date.now()` on wall-clock boundaries and snaps to truth on
  visibility/focus (`lib/utils/wallclock.ts`).
- **The app cannot ring an adhan when closed.** Web Push needs a server,
  which SalahKit refuses to run. The primary reminder path is the **ICS
  export** on the Prayer Times page: a month of computed times lands in the
  OS calendar, and the OS owns the alarms even when the app is shut.
  Secondary: in-app prayer-boundary alerts while the tab is open.

## Storage & data survival
- Browser storage is **best-effort**: Chromium can evict the whole origin
  under device storage pressure; WebKit expires script-writable storage
  after **~7 days without a visit**; private windows are ephemeral.
- Defense layers: `navigator.storage.persist()` requested at boot and from
  Settings; the **Storage health card** shows usage, persisted state and
  last-backup date; one-tap export; calm notices for long absences,
  private mode and tracked-but-never-backed-up data; `QuotaExceededError`
  surfaces as a toast instead of a silent failure.
- **Rule of thumb for users:** install the PWA (installed apps get far
  better persistence) and export a backup monthly.

## Sensors & media
- **Compass:** iOS requires a user-gesture permission
  (`DeviceOrientationEvent.requestPermission`); headings are magnetic —
  SalahKit corrects to true north with NOAA declination when online and
  labels the status clearly ("magnetic north") when it cannot.
- **Audio:** playback is always user-initiated (autoplay is rejected by
  policy). On iPhones the hardware silent switch mutes HTML5 audio —
  that is an OS choice, not a bug.
- **Vibration / wake lock:** feature-detected; silent no-ops on iOS.

## Religious accuracy
- **High latitudes (≥48°):** naive twilight math breaks in summer; the
  engine applies the deterministic Angle-Based rule (Middle-of-night and
  One-seventh available in `lib/core/highlat.ts`).
- **Hijri calendar** is Umm al-Qura arithmetic — moon-sighting authorities
  may differ by ±1–2 days around month boundaries. The `hijriAdjust`
  setting compensates; verify with your local authority.
- **Tajweed engine** is an educational aid. It detects rules
  deterministically but cannot replace a qualified teacher — every entry
  point says so.
- **Zakat** nisab uses a cached silver price; stale values (>7 days) are
  badged with their date and can be overridden manually. The tool is
  educational — consult a scholar.

## Updates
- The service worker is versioned (`salahkit-vN`). On a new release the
  app shows an **"Update ready"** banner; accepting skips waiting and
  reloads. Cached app data (IndexedDB) is never touched by updates.
