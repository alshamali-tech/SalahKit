/**
 * Tajweed engine (pure TypeScript, zero side effects).
 * Scans Uthmani text for the classical tajweed rules, working on Arabic
 * glyph clusters (base letter + combining marks) so letter-joining is
 * never broken. Real-world behaviours implemented:
 *  - izhaar colours ONLY the noon (the throat letter stays clear)
 *  - idghaam/ikhfaa/iqlaab colour the noon AND the following letter
 *  - idghaam does NOT occur inside a single word (read clear instead)
 *  - ghunna on noon/meem with shaddah
 *  - qalqalah on saakin ق ط ب ج د
 *  - meem sakinah: idghaam (م+م) and ikhfaa (م+ب); izhaar is the default
 *  - madd (natural + marked) and waqf signs
 * Every cluster carries at most ONE rule (first match wins by priority).
 */

/** The tajweed rules the engine can detect. */
export type TajweedRuleId =
  | 'izhaar'
  | 'ikhfaa'
  | 'idghaam-ghunna'
  | 'idghaam-bila-ghunna'
  | 'iqlaab'
  | 'qalqalah'
  | 'ghunna'
  | 'meem-ikhfaa'
  | 'meem-idgham'
  | 'madd'
  | 'waqf';

/** Display metadata for one rule. */
export interface TajweedRule {
  /** English name. */
  label: string;
  /** Arabic name. */
  arabic: string;
  /** Annotation color (works on light and dark surfaces). */
  color: string;
  /** One-line recitation instruction. */
  desc: string;
  /** Render as an underline instead of recoloured glyphs (used for madd/waqf). */
  underline?: boolean;
}

/** All rules with display metadata, in legend order. */
export const TAJWEED_RULES: Readonly<Record<TajweedRuleId, TajweedRule>> = {
  izhaar: { label: 'Izhaar', arabic: 'إظهار', color: '#2b8a3e', desc: 'Pronounce the noon clearly — no ghunna — before the throat letters ء ه ع ح غ خ.' },
  ikhfaa: { label: 'Ikhfaa', arabic: 'إخفاء', color: '#862e9c', desc: 'Hide the noon between izhaar and idghaam with a 2-count ghunna before 15 letters.' },
  'idghaam-ghunna': { label: 'Idghaam with ghunna', arabic: 'إدغام بغنة', color: '#c92a2a', desc: 'Merge the noon into ي ن م و with a 2-count humming ghunna.' },
  'idghaam-bila-ghunna': { label: 'Idghaam without ghunna', arabic: 'إدغام بلا غنة', color: '#e8590c', desc: 'Merge the noon into ل or ر cleanly, with no hum.' },
  iqlaab: { label: 'Iqlaab', arabic: 'إقلاب', color: '#1864ab', desc: 'Turn the noon into a concealed meem (with ghunna) before ب.' },
  qalqalah: { label: 'Qalqalah', arabic: 'قلقلة', color: '#0b7285', desc: 'Echo/bounce the saakin letters ق ط ب ج د (جمعها: قطب جد).' },
  ghunna: { label: 'Ghunna', arabic: 'غنة', color: '#d6336c', desc: 'A 2-count nasal hum on noon or meem carrying a shaddah (نّ مّ).' },
  'meem-ikhfaa': { label: 'Ikhfaa shafawi', arabic: 'إخفاء شفوي', color: '#a61e4d', desc: 'Conceal the saakin meem on the lips (with ghunna) before ب.' },
  'meem-idgham': { label: 'Idghaam shafawi', arabic: 'إدغام شفوي', color: '#5f3dc4', desc: 'Merge a saakin meem into a following meem with a ghunna.' },
  madd: { label: 'Madd', arabic: 'مد', color: '#ae3ec9', desc: 'Elongate the vowel: 2 counts natural, 4–6 when caused.', underline: true },
  waqf: { label: 'Waqf', arabic: 'وقف', color: '#868e96', desc: 'A stopping sign — observe it to preserve the meaning.', underline: true },
};

/** Legend ordering. */
export const RULE_ORDER: readonly TajweedRuleId[] = [
  'izhaar', 'ikhfaa', 'idghaam-ghunna', 'idghaam-bila-ghunna', 'iqlaab',
  'ghunna', 'qalqalah', 'meem-ikhfaa', 'meem-idgham', 'madd', 'waqf',
];

const THROAT_LETTERS = new Set(['ء', 'ه', 'ع', 'ح', 'غ', 'خ', 'أ', 'إ', 'آ', 'ٱ', 'ئ', 'ؤ']);
const IQLAAB_LETTERS = new Set(['ب']);
const IDGHAAM_GHUNNA_LETTERS = new Set(['ي', 'ن', 'م', 'و']);
const IDGHAAM_BILA_LETTERS = new Set(['ل', 'ر']);
/** Letters that merge (idghaam) — these do NOT merge inside one word. */
const IDGHAAM_ALL = new Set(['ي', 'ن', 'م', 'و', 'ل', 'ر']);
const QALQALAH_LETTERS = new Set(['ق', 'ط', 'ب', 'ج', 'د']);

const SUKUN = '\u0652';
const SHADDA = '\u0651';
const FATHA = '\u064e';
const DAMMA = '\u064f';
const KASRA = '\u0650';
const TANWEEN = new Set(['\u064b', '\u064c', '\u064d']);
/** Explicit elongation signs: maddah above + small high madda. */
const MADD_MARKS = new Set(['\u0653', '\u06e4']);
/** Classical waqf signs (U+06D6..U+06DC). */
const WAQF_MARKS = new Set(['\u06d6', '\u06d7', '\u06d8', '\u06d9', '\u06da', '\u06db', '\u06dc']);

/** One annotated slice of text. */
export interface TajweedSegment {
  /** Raw slice (keeps all diacritics). */
  text: string;
  /** Detected rule, or null for plain text. */
  rule: TajweedRuleId | null;
}

interface Cluster {
  start: number;
  end: number;
  base: string;
  marks: Set<string>;
}

/** True for Arabic base letters (excludes tatweel). */
function isArabicLetter(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x0621 && c <= 0x064a && c !== 0x0640) || c === 0x0671;
}

/** True for combining marks and attached Quranic signs. */
function isMark(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (
    (c >= 0x0610 && c <= 0x061a) ||
    (c >= 0x064b && c <= 0x065f) ||
    c === 0x0670 ||
    (c >= 0x06d6 && c <= 0x06ed)
  );
}

/** Splits text into letter clusters with their marks. */
function buildClusters(text: string): Cluster[] {
  const chars = Array.from(text);
  const clusters: Cluster[] = [];
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i] ?? '';
    if (isArabicLetter(ch)) {
      const start = i;
      const marks = new Set<string>();
      i += 1;
      while (i < chars.length && isMark(chars[i] ?? '')) {
        marks.add(chars[i] ?? '');
        i += 1;
      }
      clusters.push({ start, end: i, base: ch, marks });
    } else {
      i += 1;
    }
  }
  return clusters;
}

/** Index of the next cluster (letters are contiguous in the array). */
function nextIndex(clusters: Cluster[], from: number): number {
  return from + 1 < clusters.length ? from + 1 : -1;
}

/** True when the raw gap between two clusters contains a word break. */
function differentWords(text: string, fromEnd: number, toStart: number): boolean {
  for (let k = fromEnd; k < toStart; k += 1) {
    const ch = text[k];
    if (ch === ' ' || ch === '\u06dd' || (ch !== undefined && ch.codePointAt(0) === 0x06dd)) return true;
  }
  return false;
}

/** Classifies the outcome for noon sakinah / tanween. */
function noonRuleFor(nextBase: string): TajweedRuleId {
  if (IQLAAB_LETTERS.has(nextBase)) return 'iqlaab';
  if (THROAT_LETTERS.has(nextBase)) return 'izhaar';
  if (IDGHAAM_BILA_LETTERS.has(nextBase)) return 'idghaam-bila-ghunna';
  if (IDGHAAM_GHUNNA_LETTERS.has(nextBase)) return 'idghaam-ghunna';
  return 'ikhfaa';
}

/** True when a cluster is a natural madd letter following its vowel. */
function isNaturalMadd(c: Cluster, prev: Cluster | null): boolean {
  if (!prev) return false;
  if (c.base === 'ا' || c.base === 'ى') return prev.marks.has(FATHA);
  if (c.base === 'و') return prev.marks.has(DAMMA);
  if (c.base === 'ي') return prev.marks.has(KASRA);
  return false;
}

/**
 * Analyzes Uthmani text and returns colored tajweed segments.
 * Adjacent clusters with the same rule are merged so Arabic letter
 * joining is preserved; concatenating the segments reproduces the input.
 * @param text - Raw Arabic text with diacritics.
 * @returns Ordered segments.
 */
export function analyzeTajweed(text: string): TajweedSegment[] {
  const clusters = buildClusters(text);
  const ruleOf: (TajweedRuleId | null)[] = new Array(clusters.length).fill(null);

  for (let i = 0; i < clusters.length; i += 1) {
    const c = clusters[i];
    if (!c || ruleOf[i] !== null) continue;
    const marks = c.marks;
    const hasTanween = [...marks].some((m) => TANWEEN.has(m));

    // Ghunna: noon or meem with shaddah.
    if ((c.base === 'ن' || c.base === 'م') && marks.has(SHADDA)) {
      ruleOf[i] = 'ghunna';
      continue;
    }

    // Noon sakinah / tanween and meem sakinah.
    if ((c.base === 'ن' && (marks.has(SUKUN) || hasTanween)) || (c.base === 'م' && marks.has(SUKUN))) {
      const ni = nextIndex(clusters, i);
      if (ni >= 0) {
        const nc = clusters[ni];
        if (nc) {
          const sameWord = !differentWords(text, c.end, nc.start);
          let rule = c.base === 'ن' ? noonRuleFor(nc.base) : (nc.base === 'ب' ? 'meem-ikhfaa' : nc.base === 'م' ? 'meem-idgham' : null);
          // Idghaam never happens inside a single word — read clear.
          if (sameWord && c.base === 'ن' && IDGHAAM_ALL.has(nc.base)) rule = 'izhaar';
          if (rule) {
            ruleOf[i] = rule;
            if (rule !== 'izhaar' && ruleOf[ni] === null) ruleOf[ni] = rule;
          }
        }
      }
      continue;
    }

    // Qalqalah: saakin echoing letters.
    if (QALQALAH_LETTERS.has(c.base) && marks.has(SUKUN)) {
      ruleOf[i] = 'qalqalah';
      continue;
    }

    // Madd: explicit sign or a natural long-vowel letter.
    const prev = i > 0 ? clusters[i - 1] ?? null : null;
    if ([...marks].some((m) => MADD_MARKS.has(m)) || isNaturalMadd(c, prev)) {
      ruleOf[i] = 'madd';
      continue;
    }

    // Waqf signs.
    if ([...marks].some((m) => WAQF_MARKS.has(m))) {
      ruleOf[i] = 'waqf';
    }
  }

  const segments: TajweedSegment[] = [];
  let cursor = 0;
  const push = (chunk: string, rule: TajweedRuleId | null): void => {
    if (chunk === '') return;
    const last = segments[segments.length - 1];
    if (last && last.rule === rule) last.text += chunk;
    else segments.push({ text: chunk, rule });
  };
  // Waqf signs are written standalone (after a space), so they never
  // attach to a letter cluster — split them out of the plain gaps here.
  const pushGap = (chunk: string): void => {
    let buf = '';
    for (const ch of chunk) {
      if (WAQF_MARKS.has(ch)) {
        if (buf !== '') {
          push(buf, null);
          buf = '';
        }
        push(ch, 'waqf');
      } else {
        buf += ch;
      }
    }
    if (buf !== '') push(buf, null);
  };
  for (let i = 0; i < clusters.length; i += 1) {
    const c = clusters[i];
    if (!c) continue;
    if (c.start > cursor) pushGap(text.slice(cursor, c.start));
    push(text.slice(c.start, c.end), ruleOf[i] ?? null);
    cursor = c.end;
  }
  if (cursor < text.length) pushGap(text.slice(cursor));
  return segments;
}

/**
 * Counts rule occurrences in analyzed segments.
 * @param segments - Output of analyzeTajweed.
 * @returns Map of rule id → count (only rules present).
 */
export function countByRule(segments: readonly TajweedSegment[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const seg of segments) {
    if (seg.rule) counts[seg.rule] = (counts[seg.rule] ?? 0) + 1;
  }
  return counts;
}
