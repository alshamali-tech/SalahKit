/**
 * Theme bootstrap — runs before first paint to prevent a flash of the
 * wrong theme. Kept as an external file (not inline) so a strict
 * Content-Security-Policy with no 'unsafe-inline' scripts still allows it.
 */
(function () {
  try {
    var stored = localStorage.getItem('salahkit:theme');
    var dark =
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) {
    /* Storage blocked — the app applies its default theme after boot. */
  }
})();
