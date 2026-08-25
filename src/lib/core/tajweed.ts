/**
 * Tajweed engine (pure TypeScript, zero side effects).
 * Scans Uthmani text for the classical tajweed rules — noon sakinah &
 * tanween outcomes, meem sakinah, ghunna, qalqalah and madd — by
 * working on Arabic glyph clusters (base letter + combining marks).
 * No network, no fonts required: it powers the colored overlays in the
 * Quran Reader and Hifz Trainer and the interactive Lab.
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
  | 'meem-izhar'
  | 'madd';

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
}

/** All rules with display metadata, in legend order. */
export const TAJWEED_RULES: Readonly<Record<TajweedRuleId, TajweedRule>> = {
  izhaar: { label: 'Izhaar', arabic: 'إظهار', color: '#2b8a3e', desc: 'Clear noon — no ghunna, letters from the throat.' },
  ikhfaa: { label: 'Ikhfaa', arabic: 'إخفاء', color: '#862e9c', desc: 'Hide the noon with a 2-count ghunna before 15 letters.' },
  'idghaam-ghunna': { label: 'Idghaam with ghunna', arabic: 'إدغام بغنة', color: '#c92a2a', desc: 'Merge into ي ن م و with a humming ghunna.' },
  'idghaam-bila-ghunna': { label: 'Idghaam without ghunna', arabic: 'إدغام بلا غنة', color: '#e8590c', desc: 'Merge into ل or ر cleanly, no hum.' },
  iqlaab: { label: 'Iqlaab', arabic: 'إقلاب', color: '#1864ab', desc: 'Flip the noon into a hidden meem before ب.' },
  qalqalah: { label: 'Qalqalah', arabic: 'قلقلة', color: '#0b7285', desc: 'Bounce the echoing letters ق ط ب ج د when saakin.' },
  ghunna: { label: 'Ghunna', arabic: 'غنة', color: '#d6336c', desc: 'A 2-count nasal hum: noon or meem with shaddah.' },
  'meem-ikhfaa': { label: 'Ikhfaa shafawi', arabic: 'إخفاء شفوي', color: '#a61e4d', desc: 'Meem sakinah before ب — hide it on the lips.' },
  'meem-idgham': { label: 'Idghaam shafawi', arabic: 'إدغام شفوي', color: '#862e9c', desc: 'Meem sakinah into another meem — merge with ghunna.' },
  'meem-izhar': { label: 'Izhaar shafawi', arabic: 'إظهار شفوي', color: '#2b8a3e', desc: 'Meem sakinah before all other letters — clear lips.' },
  madd: { label: 'Madd', arabic: 'مد', color: '#ae3ec9', desc: 'Stretch the vowel: 2 counts natural, 4–6 when caused.' },
};

/** Legend ordering. */
export const RULE_ORDER: readonly TajweedRuleId[] = [
  'izhaar', 'ikhfaa', 'idghaam-ghunna', 'idghaam-bila-ghunna', 'iqlaab',
  'ghunna', 'qalqalah', 'meem-ikhfaa', 'meem-idgham', 'meem-izhar', 'madd',
];

const THROAT_LETTERS = new Set(['ء', 'ه', 'ع', 'ح', 'غ', 'خ', 'أ', 'إ', 'آ', 'ٱ', 'ئ', 'ؤ']);
const IQLAAB_LETTERS = new Set(['ب']);
const IDGHAAM_GHUNNA_LETTERS = new Set(['ي', 'ن', 'م', 'و']);
const IDGHAAM_BILA_LETTERS = new Set(['ل', 'ر']);
const QALQALAH_LETTERS = new Set(['ق', 'ط', 'ب', 'ج', 'د']);

const SUKUN = '\u0652';
const SHADDA = '\u0651';
const TANWEEN = new Set(['\u064B', '\u064C', '\u064D']);
const MADD_MARKS = new Set(['\u0653', '\u0670', '\u06E4', '\u06E5', '\u06E6']);

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
  rule: TajweedRuleId | null;
}

/** True for Arabic base letters (excludes tatweel). */
function isArabicLetter(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return ((c >= 0x0621 && c <= 0x064a && c !== 0x0640) || c === 0x0671);
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
      clusters.push({ start, end: i, base: ch, marks, rule: null });
    } else {
      i += 1;
    }
  }
  return clusters;
}

/** Next cluster whose base is a letter, skipping mark-only noise. */
function nextLetterCluster(clusters: Cluster[], from: number): Cluster | null {
  for (let j = from + 1; j < clusters.length; j += 1) {
    const c = clusters[j];
    if (c && isArabicLetter(c.base)) return c;
  }
  return null;
}

/** Classifies the outcome for noon sakinah / tanween. */
function noonRuleFor(nextBase: string): TajweedRuleId {
  if (IQLAAB_LETTERS.has(nextBase)) return 'iqlaab';
  if (THROAT_LETTERS.has(nextBase)) return 'izhaar';
  if (IDGHAAM_BILA_LETTERS.has(nextBase)) return 'idghaam-bila-ghunna';
  if (IDGHAAM_GHUNNA_LETTERS.has(nextBase)) return 'idghaam-ghunna';
  return 'ikhfaa';
}

/** Classifies the outcome for meem sakinah. */
function meemRuleFor(nextBase: string): TajweedRuleId {
  if (nextBase === 'ب') return 'meem-ikhfaa';
  if (nextBase === 'م') return 'meem-idgham';
  return 'meem-izhar';
}

/**
 * Analyzes Uthmani text and returns colored tajweed segments.
 * @param text - Raw Arabic text with diacritics.
 * @returns Ordered segments; concatenate to reproduce the input.
 */
export function analyzeTajweed(text: string): TajweedSegment[] {
  const clusters = buildClusters(text);
  for (let i = 0; i < clusters.length; i += 1) {
    const cluster = clusters[i];
    if (!cluster) continue;
    const hasTanween = [...cluster.marks].some((m) => TANWEEN.has(m));
    if (cluster.base === 'ن' && (cluster.marks.has(SUKUN) || hasTanween)) {
      const next = nextLetterCluster(clusters, i);
      if (next) {
        const rule = noonRuleFor(next.base);
        cluster.rule = rule;
        next.rule = rule;
      }
    } else if (cluster.base === 'م' && cluster.marks.has(SUKUN)) {
      const next = nextLetterCluster(clusters, i);
      if (next) {
        const rule = meemRuleFor(next.base);
        cluster.rule = rule === 'meem-izhar' ? null : rule;
        next.rule = rule === 'meem-izhar' ? null : rule;
      }
    } else if ((cluster.base === 'ن' || cluster.base === 'م') && cluster.marks.has(SHADDA)) {
      cluster.rule = 'ghunna';
    } else if (QALQALAH_LETTERS.has(cluster.base) && cluster.marks.has(SUKUN)) {
      cluster.rule = 'qalqalah';
    } else if ([...cluster.marks].some((m) => MADD_MARKS.has(m))) {
      cluster.rule = 'madd';
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
  for (const cluster of clusters) {
    if (cluster.start > cursor) push(text.slice(cursor, cluster.start), null);
    push(text.slice(cluster.start, cluster.end), cluster.rule);
    cursor = cluster.end;
  }
  if (cursor < text.length) push(text.slice(cursor), null);
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
