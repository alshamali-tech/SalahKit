/**
 * Pre-paint bootstrap (external so the strict CSP needs no 'unsafe-inline'):
 * 1. Applies the stored theme before first paint (no flash).
 * 2. Starts loading the Amiri Quran font CSS without blocking rendering —
 *    display=swap keeps text visible on system fonts until it arrives.
 */
(function () {
  try {
    var stored = localStorage.getItem('salahkit:theme');
    var dark =
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) {
    /* defaults stay */
  }

  // Non-blocking font load: the stylesheet is appended at runtime, so it
  // never sits in the critical render path.
  try {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap';
    document.head.appendChild(link);
  } catch (e) {
    /* UI falls back to the system Arabic stack */
  }
})();
