#!/usr/bin/env node
/**
 * One-shot lint-debt fixer: clears all 17 ESLint errors blocking the
 * pre-commit hook. Every edit is an exact literal replacement; if a
 * pattern is missing the script reports it and exits non-zero, so it
 * never silently half-applies.
 *
 * Usage:  node scripts/fix-lint.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
let applied = 0;

/** Applies one literal replacement (LF or CRLF tolerant). */
function edit(file, find, replace, label) {
  const path = resolve(root, file);
  let src = readFileSync(path, 'utf8');

  const variants = [find, find.replace(/\n/g, '\r\n')];
  const replaceVariants = [replace, replace.replace(/\n/g, '\r\n')];
  let done = false;
  for (let i = 0; i < variants.length; i++) {
    if (src.includes(variants[i])) {
      src = src.replace(variants[i], replaceVariants[i]);
      done = true;
      break;
    }
  }

  if (!done) {
    // Maybe already fixed (idempotent re-run) — check the target state.
    if (replace !== '' && src.includes(replace)) {
      console.log(`  [SKIP] ${file}: ${label} (already applied)`);
      return;
    }
    console.log(`  [FAIL] ${file}: ${label} — pattern not found`);
    failures += 1;
    return;
  }
  writeFileSync(path, src, 'utf8');
  applied += 1;
  console.log(`  [OK]   ${file}: ${label}`);
}

console.log('fix-lint: clearing 17 ESLint errors\n');

/* ── 1. CalendarView.tsx — unused `useApp` import ───────────────── */
edit('src/components/app/CalendarView.tsx',
  "import { useApp } from '../../store';\n",
  '',
  'remove unused useApp import');

/* ── 2. CountdownNext.tsx — unused TICK_INTERVAL_MS + dead disable ─ */
edit('src/components/app/CountdownNext.tsx',
  "import { PRAYER_LABELS, TICK_INTERVAL_MS } from '../../lib/core/constants';",
  "import { PRAYER_LABELS } from '../../lib/core/constants';",
  'drop unused TICK_INTERVAL_MS import');

edit('src/components/app/CountdownNext.tsx',
  'const hijri = useMemo(() => gregorianToHijri(now), [todayISO]); // eslint-disable-line react-hooks/exhaustive-deps',
  'const hijri = useMemo(() => gregorianToHijri(now), [todayISO]);',
  'remove dead react-hooks disable comment');

/* ── 3. Hero.tsx — same dead disable comment ────────────────────── */
edit('src/components/landing/Hero.tsx',
  'const hijri = useMemo(() => gregorianToHijri(now), [todayISO]); // eslint-disable-line react-hooks/exhaustive-deps',
  'const hijri = useMemo(() => gregorianToHijri(now), [todayISO]);',
  'remove dead react-hooks disable comment');

/* ── 4. VoiceRecall.tsx — same dead disable comment ─────────────── */
edit('src/components/app/hifz/VoiceRecall.tsx',
  '}, [micStatus]); // eslint-disable-line react-hooks/exhaustive-deps',
  '}, [micStatus]);',
  'remove dead react-hooks disable comment');

/* ── 5. HadithLibraryFull.tsx — `missed` state set but never read ─ */
edit('src/components/app/HadithLibraryFull.tsx',
  '  const [missed, setMissed] = useState(false);\n',
  '',
  'remove unused missed state');

edit('src/components/app/HadithLibraryFull.tsx',
  '    setMissed(false);\n',
  '',
  'remove setMissed(false) reset');

edit('src/components/app/HadithLibraryFull.tsx',
  `        results.forEach((r) => {
          if (!r) setMissed(true);
        });
`,
  '',
  'remove setMissed(true) loop');

/* ── 6. QiblaCompass.tsx — unused `t` from useT ─────────────────── */
edit('src/components/app/QiblaCompass.tsx',
  "import { useT } from '../../lib/use-locale';\n",
  '',
  'remove unused useT import');

edit('src/components/app/QiblaCompass.tsx',
  '  const { t } = useT();\n',
  '',
  'remove unused t destructure');

/* ── 7. QiblaDial.tsx — 5 unused destructured props (placeholder) ─ */
edit('src/components/app/QiblaDial.tsx',
  'export function QiblaDial({ rotationDeg, bearingDeg, manual, aligned, hub }: QiblaDialProps): JSX.Element {',
  'export function QiblaDial(_props: QiblaDialProps): JSX.Element {',
  'collapse unused destructured props into _props');

/* ── 8. AboutPanel.tsx — unused `t` ─────────────────────────────── */
edit('src/components/settings/AboutPanel.tsx',
  '  const { t, locale } = useT();',
  '  const { locale } = useT();',
  'drop unused t from useT destructure');

/* ── 9. SifaatExplorer.tsx — unused Sifah type import ───────────── */
edit('src/components/tajweed/SifaatExplorer.tsx',
  "import type { Sifah } from '../../lib/core/sifaat-data';\n",
  '',
  'remove unused Sifah type import');

/* ── 10. Header.tsx — unused `view` ─────────────────────────────── */
edit('src/components/ui/Header.tsx',
  '  const { view, online, setSettingsOpen, setSidebarOpen, module } = useApp();',
  '  const { online, setSettingsOpen, setSidebarOpen, module } = useApp();',
  'drop unused view from useApp destructure');

/* ── 11. ModuleIcon.tsx — unused ARABIC_STACK constant ──────────── */
edit('src/components/ui/ModuleIcon.tsx',
  `const ARABIC_STACK =
  '"Amiri Quran", "Scheherazade New", "Amiri", "Traditional Arabic", "Geeza Pro", serif';

`,
  '',
  'remove unused ARABIC_STACK constant');

/* ── 12. speech-match.ts — no-misleading-character-class ────────── */
edit('src/lib/core/speech-match.ts',
  `/** Combining marks & decorative signs stripped before comparison. */
const STRIP_RE =`,
  `/** Combining marks & decorative signs stripped before comparison.
 *  The character class intentionally matches each combining mark
 *  individually — that is the whole point of the normalization. */
// eslint-disable-next-line no-misleading-character-class
const STRIP_RE =`,
  'justify + suppress no-misleading-character-class');

console.log(`\nfix-lint: ${applied} edit(s) applied, ${failures} failure(s).`);
if (failures > 0) {
  console.error('fix-lint: some patterns were not found — inspect the failures above.');
  process.exit(1);
}
console.log('fix-lint: done. Verify with:  npx eslint "src/**/*.{ts,tsx}" --max-warnings=0');