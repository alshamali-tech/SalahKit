/**
 * Tajweed engine (pure TypeScript, zero side effects).
 * Detects the classical rules on real Uthmani text, following how the
 * rules are actually applied in recitation:
 * - Noon sakinah / tanween: izhaar, ikhfaa, iqlaab and idghaam. Idghaam
 *   happens only ACROSS words — inside one word (الدُّنْيَا, صِنْوَانٌ)
 *   the noon is read clear. A tanween targets the first letter of the
 *   NEXT word (so هُدًى لِّلْمُتَّقِينَ lands on the ل, not the trailing ى).
 * - Uthmani convention: a bare noon/meem with no sukun written (فَمَن
 *   يَعْمَلْ) is still saakin. Plural pronoun meem (عَلَيْهِمْ) is NOT.
 * - Meem sakinah: idghaam shafawi (م+م) and ikhfaa shafawi (م+ب) only.
 * - Ghunna on noon/meem with shaddah; qalqalah on saakin ق ط ب ج د.
 * - Madd: natural (2 counts) vs caused (4-6: hamzah or sukun/shadda
 *   after the madd letter, or a madda sign). Dagger-alif = natural.
 * - Waqf signs (ۘ ۗ ۖ ۚ ۛ ۜ), which stand alone between words.
 */

/** The tajweed rules the engine detects. */
export type TajweedRuleId =
  | 'ghunna'
  | 'izhaar'
  | 'ikhfaa'
  | 'idghaam-ghunna'
  | 'idghaam-bila-ghunna'
  | 'iqlaab'
  | 'meem-idgham'
  | 'meem-ikhfaa'
  | 'qalqalah'
  | 'madd-caused'
  | 'madd'
  | 'waqf';

/** Display metadata for one rule. */
export interface TajweedRule {
  label: string;
  arabic: string;
  color: string;
  desc: string;
}

export const TAJWEED_RULES: Readonly<Record<TajweedRuleId, TajweedRule>> = {
  ghunna: { label: 'Ghunna', arabic: 'غنة', color: '#d6336c', desc: 'A 2-count nasal hum on noon or meem with shaddah.' },
  izhaar: { label: 'Izhaar', arabic: 'إظهار', color: '#2b8a3e', desc: 'Read the noon crystal-clear before throat letters ء ه ع ح غ خ.' },
  ikhfaa: { label: 'Ikhfaa', arabic: 'إخفاء', color: '#862e9c', desc: 'Hide the noon between clear and merged, with a 2-count hum — 15 letters.' },
  'idghaam-ghunna': { label: 'Idghaam + ghunna', arabic: 'إدغام بغنة', color: '#c92a2a', desc: 'Merge the noon into ي ن م و across words, keeping the hum.' },
  'idghaam-bila-ghunna': { label: 'Idghaam, no hum', arabic: 'إدغام بلا غنة', color: '#e8590c', desc: 'Merge into ل or ر cleanly, with no humming.' },
  iqlaab: { label: 'Iqlaab', arabic: 'إقلاب', color: '#1864ab', desc: 'Flip the noon into a hidden meem before ب.' },
  'meem-idgham': { label: 'Idghaam shafawi', arabic: 'إدغام شفوي', color: '#9c36b5', desc: 'A saakin meem merges into another meem with ghunna.' },
  'meem-ikhfaa': { label: 'Ikhfaa shafawi', arabic: 'إخفاء شفوي', color: '#a61e4d', desc: 'A saakin meem hides on the lips before ب.' },
  qalqalah: { label: 'Qalqalah', arabic: 'قلقلة', color: '#0b7285', desc: 'Bounce the echoing letters ق ط ب ج د when they carry a sukun.' },
  'madd-caused': { label: 'Madd (4–6 counts)', arabic: 'مد واجب/لازم', color: '#5f3dc4', desc: 'A caused stretch: hamzah or sukun/shadda after the madd letter, or a madda sign.' },
  madd: { label: 'Madd (2 counts)', arabic: 'مد طبيعي', color: '#ae3ec9', desc: 'Natural stretch: alif/waw/ya after their matching vowel.' },
  waqf: { label: 'Waqf sign', arabic: 'علامة وقف', color: '#f08c00', desc: 'A stopping sign: ۘ required · ۗ preferred · ۖ permitted · ۚ better not · ۛ either, not both.' },
};

/** Legend ordering. */
export const RULE_ORDER: readonly TajweedRuleId[] = [
  'ghunna', 'izhaar', 'ikhfaa', 'idghaam-ghunna', 'idghaam-bila-ghunna', 'iqlaab',
  'meem-idgham', 'meem-ikhfaa', 'qalqalah', 'madd-caused', 'madd', 'waqf',
];

const THROAT = new Set(['ء', 'ه', 'ع', 'ح', 'غ', 'خ', 'أ', 'إ', 'آ', 'ٱ', 'ئ', 'ؤ']);
const IDGH_GHUNNA = new Set(['ي', 'ن', 'م', 'و']);
const IDGH_BILA = new Set(['ل', 'ر']);
const QALQALAH = new Set(['ق', 'ط', 'ب', 'ج', 'د']);
const MAD = new Set(['ا', 'و', 'ي']);
const SUKUN = '\u0652';
const SHADDA = '\u0651';
const TANWEEN = new Set(['\u064B', '\u064C', '\u064D']);
const MADDA_SIGNS = new Set(['\u0653', '\u06E4', '\u06E5', '\u06E6']);
const WAQF_SIGNS = new Set(['\u06D6', '\u06D7', '\u06D8', '\u06DA', '\u06DB', '\u06DC']);

export interface TajweedSegment {
  text: string;
  rule: TajweedRuleId | null;
}

interface Cluster {
  start: number;
  end: number;
  base: string;
  marks: Set<string>;
  rule: TajweedRuleId | null;
}

function isArabicLetter(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x0621 && c <= 0x064a && c !== 0x0640) || c === 0x0671;
}

function isMark(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x0610 && c <= 0x061a) || (c >= 0x064b && c <= 0x065f) || c === 0x0670 || (c >= 0x06d6 && c <= 0x06ed);
}

function buildClusters(text: string): Cluster[] {
  const chars = Array.from(text);
  const clusters: Cluster[] = [];
  let i = 0;
  while (i < chars.length) {
    if (isArabicLetter(chars[i] ?? '')) {
      const start = i;
      const marks = new Set<string>();
      i += 1;
      while (i < chars.length && isMark(chars[i] ?? '')) {
        marks.add(chars[i] ?? '');
        i += 1;
      }
      clusters.push({ start, end: i, base: chars[start] ?? '', marks, rule: null });
    } else i += 1;
  }
  return clusters;
}

/** Noon/tanween outcome. */
function noonRuleFor(nextBase: string, sameWord: boolean): TajweedRuleId {
  if (nextBase === 'ب') return 'iqlaab';
  if (THROAT.has(nextBase)) return 'izhaar';
  const idghaam = IDGH_BILA.has(nextBase) ? 'idghaam-bila-ghunna' : IDGH_GHUNNA.has(nextBase) ? 'idghaam-ghunna' : null;
  if (idghaam) return sameWord ? 'izhaar' : idghaam;
  return 'ikhfaa';
}

/**
 * Analyzes Uthmani text into colored tajweed segments.
 * @param text - Arabic text with diacritics.
 * @returns Ordered segments; concatenating them reproduces the input.
 */
export function analyzeTajweed(text: string): TajweedSegment[] {
  const clusters = buildClusters(text);
  for (let i = 0; i < clusters.length; i += 1) {
    const cl = clusters[i];
    if (!cl || cl.rule) continue;
    const hasTanween = [...cl.marks].some((m) => TANWEEN.has(m));
    const bare = cl.marks.size === 0 && text[cl.end] === ' ';
    const next = nextTarget(clusters, i, text, hasTanween);
    if (cl.base === 'ن' && (cl.marks.has(SUKUN) || hasTanween || bare)) {
      if (next) {
        const sameWord = !text.slice(cl.end, next.cluster.start).includes(' ');
        const rule = noonRuleFor(next.cluster.base, sameWord);
        cl.rule = rule;
        if (rule !== 'izhaar') next.cluster.rule = rule;
      }
    } else if (cl.base === 'م' && (cl.marks.has(SUKUN) || (bare && next?.cluster.base === 'م'))) {
      if (next) {
        if (next.cluster.base === 'م') cl.rule = next.cluster.rule = 'meem-idgham';
        else if (next.cluster.base === 'ب') cl.rule = next.cluster.rule = 'meem-ikhfaa';
      }
    } else if ((cl.base === 'ن' || cl.base === 'م') && cl.marks.has(SHADDA)) {
      cl.rule = 'ghunna';
    } else if (QALQALAH.has(cl.base) && cl.marks.has(SUKUN)) {
      cl.rule = 'qalqalah';
    } else if (MAD.has(cl.base) && !cl.marks.has(SUKUN) && !hasTanween) {
      cl.rule = maddRuleFor(clusters, i, text);
    }
  }
  return buildSegments(text, clusters);
}

/** Next letter cluster a saakin letter interacts with. */
function nextTarget(
  clusters: Cluster[],
  from: number,
  _text: string,
  viaTanween: boolean
): { cluster: Cluster } | null {
  for (let j = from + 1; j < clusters.length; j += 1) {
    const c = clusters[j];
    const prev = clusters[j - 1];
    if (!c) continue;
    if (viaTanween) {
      // A tanween is word-final: skip trailing same-word letters (e.g.
      // the ى of هُدًى) until the first letter of the next word.
      if (prev && _text.slice(prev.end, c.start).includes(' ')) return { cluster: c };
    } else {
      return { cluster: c };
    }
  }
  return null;
}

/** Madd classification: caused (4-6) vs natural (2) vs none. */
function maddRuleFor(clusters: Cluster[], i: number, text: string): TajweedRuleId | null {
  const cl = clusters[i];
  if (!cl) return null;
  if ([...cl.marks].some((m) => MADDA_SIGNS.has(m))) return 'madd-caused';
  const next = clusters[i + 1];
  const nextSameWord = next ? !text.slice(cl.end, next.start).includes(' ') : false;
  if (next && nextSameWord && (next.marks.has(SHADDA) || next.marks.has(SUKUN))) return 'madd-caused';
  if (next && nextSameWord && next.base === 'ء') return 'madd-caused';
  const prev = clusters[i - 1];
  if (!prev) return null;
  // After a shaddah the short vowel is absorbed (إِنَّا, يُحِبُّونَ):
  // a following madd letter is still a natural 2-count stretch.
  if (prev.marks.has(SHADDA)) return 'madd';
  const vow = (cl.base === 'ا' && prev.marks.has('\u064E')) ||
    (cl.base === 'و' && prev.marks.has('\u064F')) ||
    (cl.base === 'ي' && prev.marks.has('\u0650'));
  return vow ? 'madd' : null;
}

/** Merges clusters back into contiguous segments, plus standalone waqf. */
function buildSegments(text: string, clusters: Cluster[]): TajweedSegment[] {
  const segments: TajweedSegment[] = [];
  const push = (chunk: string, rule: TajweedRuleId | null): void => {
    if (chunk === '') return;
    const last = segments[segments.length - 1];
    if (last && last.rule === rule) last.text += chunk;
    else segments.push({ text: chunk, rule });
  };
  let cursor = 0;
  for (const cl of clusters) {
    if (cl.start > cursor) pushWaqfAware(text.slice(cursor, cl.start), push);
    push(text.slice(cl.start, cl.end), cl.rule);
    cursor = cl.end;
  }
  if (cursor < text.length) pushWaqfAware(text.slice(cursor), push);
  return segments;
}

/** Splits a plain-text gap so waqf signs get their own rule. */
function pushWaqfAware(
  gap: string,
  push: (chunk: string, rule: TajweedRuleId | null) => void
): void {
  let run = '';
  let inWaqf = false;
  for (const ch of Array.from(gap)) {
    const isWaqf = WAQF_SIGNS.has(ch);
    if (isWaqf !== inWaqf) {
      push(run, inWaqf ? 'waqf' : null);
      run = '';
      inWaqf = isWaqf;
    }
    run += ch;
  }
  push(run, inWaqf ? 'waqf' : null);
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
