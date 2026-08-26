/**
 * Tajweed rule engine (Layer 3 of the blueprint).
 * A single forward pass walks the tokenized Uthmani text and, at each
 * letter, evaluates the registered rule detectors. Conflicts resolve by
 * the priority field in the rule table (§5.3). The engine is pure and
 * deterministic: same text → same annotations, colours and durations.
 */
import {
  TAJWEED_RULES,
  RULE_ORDER,
  RULE_CATEGORIES,
  SUN_LETTERS,
  MOON_LETTERS,
} from './tajweed-rules';
import type { TajweedRuleId, RuleCategory, RuleDefinition } from './tajweed-rules';

// Re-export the rule table so consumers keep a single import surface.
export { TAJWEED_RULES, RULE_ORDER, RULE_CATEGORIES };
export type { TajweedRuleId, RuleCategory, RuleDefinition };

const SUKUN = '\u0652';
const SHADDA = '\u0651';
const FATHA = '\u064e';
const DAMMA = '\u064f';
const KASRA = '\u0650';
const DAGGER_ALIF = '\u0670';
const MADDA = '\u0653';

const TANWEEN = new Set(['\u064b', '\u064c', '\u064d']);
const HAMZA_CARRIERS = new Set(['\u0621', '\u0623', '\u0625', '\u0622', '\u0626', '\u0624']);
const ARTICLE_ALIFS = new Set(['\u0627', '\u0622', '\u0671']);
const MADD_LETTERS = new Set(['\u0627', '\u0648', '\u064a', '\u0649']);
const QALQALAH_LETTERS = new Set(['\u0642', '\u0637', '\u0628', '\u062c', '\u062f']);
const THROAT_LETTERS = new Set(['\u0621', '\u0647', '\u0639', '\u062d', '\u063a', '\u062e', '\u0623', '\u0625', '\u0622', '\u0671']);
const IDGHAAM_GHUNNA_LETTERS = new Set(['\u064a', '\u0646', '\u0645', '\u0648']);
const IDGHAAM_BILA_LETTERS = new Set(['\u0644', '\u0631']);

/** One annotated slice of text. */
export interface TajweedSegment {
  text: string;
  rule: TajweedRuleId | null;
}

interface Cluster {
  start: number;
  end: number;
  base: string;
  marks: Set<string>;
  wordId: number;
  rule: TajweedRuleId | null;
}

/** True for Arabic base letters (excludes tatweel). */
function isLetter(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x0621 && c <= 0x064a && c !== 0x0640) || c === 0x0671;
}

/** True for combining marks / Quranic signs. */
function isMark(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (
    (c >= 0x0610 && c <= 0x061a) ||
    (c >= 0x064b && c <= 0x065f) ||
    c === 0x0670 ||
    (c >= 0x06d6 && c <= 0x06ed)
  );
}

/** True for standalone waqf / ayah-end signs. */
function isWaqfSign(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x06d6 && c <= 0x06dd) || c === 0x06de || c === 0x06e9;
}

/** Splits text into letter clusters (base + marks) tagged by word. */
function buildClusters(text: string): Cluster[] {
  const chars = Array.from(text);
  const clusters: Cluster[] = [];
  let wordId = 0;
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i] ?? '';
    if (ch === ' ' || ch === '\u06dd') {
      wordId += 1;
      if (ch === '\u06dd') clusters.push({ start: i, end: i + 1, base: ch, marks: new Set(), wordId, rule: 'waqf' });
      i += 1;
      continue;
    }
    if (isWaqfSign(ch)) {
      clusters.push({ start: i, end: i + 1, base: ch, marks: new Set(), wordId, rule: 'waqf' });
      i += 1;
      continue;
    }
    if (isLetter(ch)) {
      const start = i;
      const marks = new Set<string>();
      i += 1;
      while (i < chars.length && isMark(chars[i] ?? '') && !isWaqfSign(chars[i] ?? '')) {
        marks.add(chars[i] ?? '');
        i += 1;
      }
      clusters.push({ start, end: i, base: ch, marks, wordId, rule: null });
      continue;
    }
    i += 1;
  }
  return clusters;
}

function hasVowel(c: Cluster): boolean {
  return c.marks.has(FATHA) || c.marks.has(DAMMA) || c.marks.has(KASRA);
}

function isSaakin(c: Cluster): boolean {
  return c.marks.has(SUKUN) || !hasVowel(c);
}

/** Assigns a rule only if it outranks whatever is already set (§5.3). */
function assign(c: Cluster, id: TajweedRuleId): void {
  const p = TAJWEED_RULES[id].priority;
  if (c.rule === null || p > TAJWEED_RULES[c.rule].priority) c.rule = id;
}

/** Noon-sakinah / tanween outcome by the following letter. */
function noonRuleFor(nextBase: string): TajweedRuleId {
  if (nextBase === '\u0628') return 'iqlaab';
  if (THROAT_LETTERS.has(nextBase)) return 'izhaar';
  if (IDGHAAM_BILA_LETTERS.has(nextBase)) return 'idghaam-bila-ghunna';
  if (IDGHAAM_GHUNNA_LETTERS.has(nextBase)) return 'idghaam-ghunna';
  return 'ikhfaa';
}

/**
 * Analyzes Uthmani text and returns ordered tajweed segments.
 * @param text - Raw Arabic text with diacritics.
 * @returns Segments; concatenating reproduces the input exactly.
 */
export function analyzeTajweed(text: string): TajweedSegment[] {
  const clusters = buildClusters(text);
  const at = (i: number): Cluster | null => clusters[i] ?? null;

  for (let i = 0; i < clusters.length; i += 1) {
    const c = clusters[i];
    if (!c || c.rule === 'waqf') continue;

    // Ghunnah: shaddah-ed noon or meem (highest priority).
    if ((c.base === '\u0646' || c.base === '\u0645') && c.marks.has(SHADDA)) {
      assign(c, 'ghunna');
      continue;
    }

    // Noon sakinah & tanween.
    const isTanween = [...c.marks].some((m) => TANWEEN.has(m));
    if (c.base === '\u0646' && (c.marks.has(SUKUN) || !hasVowel(c))) {
      const next = at(i + 1);
      if (next && isLetter(next.base)) {
        let rule = noonRuleFor(next.base);
        const sameWord = next.wordId === c.wordId;
        if (sameWord && (rule === 'idghaam-ghunna' || rule === 'idghaam-bila-ghunna')) rule = 'izhaar';
        assign(c, rule);
        continue;
      }
    } else if (isTanween) {
      // Tanween acts across to the first letter of the NEXT word.
      let j = i + 1;
      while (j < clusters.length && clusters[j] && clusters[j].wordId === c.wordId) j += 1;
      const nextWord = at(j);
      if (nextWord && isLetter(nextWord.base)) {
        assign(c, noonRuleFor(nextWord.base));
        continue;
      }
    }

    // Meem sakinah — a written sukun OR a bare (vowel-less) meem, e.g.
    // the final م of تَرْمِيهِم before بِحِجَارَةٍ (not shaddah-ed).
    if (c.base === '\u0645' && (c.marks.has(SUKUN) || !hasVowel(c)) && !c.marks.has(SHADDA)) {
      const next = at(i + 1);
      if (next && isLetter(next.base)) {
        if (next.base === '\u0628') assign(c, 'meem-ikhfaa');
        else if (next.base === '\u0645') assign(c, 'meem-idgham');
      }
      continue;
    }

    // Qalqalah on saakin ق ط ب ج د (kubra at word end, else sughra).
    if (QALQALAH_LETTERS.has(c.base) && c.marks.has(SUKUN) && !hasVowel(c)) {
      assign(c, isWordEnd(clusters, i) ? 'qalqalah-kubra' : 'qalqalah');
      continue;
    }

    // Lam of the definite article (shamsi / qamari).
    if (c.base === '\u0644') {
      const prev = at(i - 1);
      if (prev && ARTICLE_ALIFS.has(prev.base) && prev.wordId === c.wordId) {
        const next = at(i + 1);
        // ا-ل-لّ is the Name of Allah, not an article + assimilated lam.
        const isDivineName = next?.base === '\u0644' && next.marks.has(SHADDA);
        if (next && isLetter(next.base) && !isDivineName) {
          if (SUN_LETTERS.has(next.base)) assign(c, 'lam-shamsi');
          else if (MOON_LETTERS.has(next.base)) assign(c, 'lam-qamari');
        }
        continue;
      }
      // Ra rules are separate; fall through to ra/ra below only for ر.
    }

    // Ra tafkhim / tarqeeq.
    if (c.base === '\u0631') {
      if (c.marks.has(FATHA) || c.marks.has(DAMMA)) assign(c, 'ra-tafkhim');
      else if (c.marks.has(KASRA)) assign(c, 'ra-tarqeeq');
      else if (isSaakin(c)) {
        const prev = at(i - 1);
        if (prev) {
          if (prev.marks.has(KASRA)) assign(c, 'ra-tarqeeq');
          else if (prev.base === '\u064a' && isSaakin(prev)) assign(c, 'ra-tarqeeq');
          else if (prev.marks.has(FATHA) || prev.marks.has(DAMMA)) assign(c, 'ra-tafkhim');
        }
      }
      continue;
    }

    // Combined hamza-with-madda (آ) is always a madd badal.
    if (c.base === '\u0622') {
      assign(c, 'madd-badal');
      continue;
    }

    // Madd family. Gate: only a *true* madd letter qualifies — one that
    // follows its matching short vowel within the SAME word, or carries
    // a dagger-alif/madda. The silent article alif of الَّذِي / النَّاسِ
    // never qualifies, which removes false tabee'i/lazim on ال- words.
    if (MADD_LETTERS.has(c.base)) {
      const prev = at(i - 1);
      const prevSameWord = prev && prev.wordId === c.wordId ? prev : null;
      // A madd letter after a hamza (آمَنُوا) qualifies too — that is
      // exactly the madd badal case.
      const isTrueMadd =
        c.marks.has(DAGGER_ALIF) ||
        c.marks.has(MADDA) ||
        hasMatchingVowel(c, prevSameWord) ||
        (prevSameWord !== null && HAMZA_CARRIERS.has(prevSameWord.base));
      if (isTrueMadd) {
        const next = at(i + 1);
        const nextSameWord = next && next.wordId === c.wordId ? next : null;
        if (
          nextSameWord &&
          (nextSameWord.marks.has(SHADDA) ||
            (nextSameWord.marks.has(SUKUN) && !hasVowel(nextSameWord)))
        ) {
          // Madd lazim: shaddah (muthaqqal) or sukun (mukhaffaf) inside
          // the same word — دَابَّةٍ, الضَّالِّينَ — a full 6 counts.
          assign(c, 'madd-lazim');
        } else if (nextSameWord && HAMZA_CARRIERS.has(nextSameWord.base)) {
          assign(c, 'madd-wajib');
        } else if (prevSameWord && HAMZA_CARRIERS.has(prevSameWord.base)) {
          assign(c, 'madd-badal');
        } else if (isWordEnd(clusters, i) && startsNextWordWithHamza(clusters, i)) {
          assign(c, 'madd-jaiz');
        } else {
          assign(c, 'madd');
        }
      }
      continue;
    }

    // Dagger-alif / madda on a non-madd letter (e.g. ذَٰلِكَ).
    if (c.marks.has(DAGGER_ALIF) || c.marks.has(MADDA)) {
      assign(c, 'madd');
    }
  }

  // Emit contiguous segments.
  const segments: TajweedSegment[] = [];
  let cursor = 0;
  const push = (chunk: string, rule: TajweedRuleId | null): void => {
    if (chunk === '') return;
    const last = segments[segments.length - 1];
    if (last && last.rule === rule) last.text += chunk;
    else segments.push({ text: chunk, rule });
  };
  for (const c of clusters) {
    if (c.start > cursor) push(text.slice(cursor, c.start), null);
    push(text.slice(c.start, c.end), c.rule);
    cursor = c.end;
  }
  if (cursor < text.length) push(text.slice(cursor), null);
  return segments;
}

/** True when cluster i is the last letter of its word. */
function isWordEnd(clusters: Cluster[], i: number): boolean {
  const c = clusters[i];
  const next = clusters[i + 1];
  if (!c) return false;
  return !next || next.wordId !== c.wordId;
}

/** True when the next word begins with a hamza carrier (for jaiz). */
function startsNextWordWithHamza(clusters: Cluster[], i: number): boolean {
  const c = clusters[i];
  if (!c) return false;
  let j = i + 1;
  while (j < clusters.length && clusters[j] && clusters[j].wordId === c.wordId) j += 1;
  const nextWord = clusters[j];
  return Boolean(nextWord && HAMZA_CARRIERS.has(nextWord.base));
}

/** True when a madd letter follows its matching short vowel. */
function hasMatchingVowel(c: Cluster, prev: Cluster | null): boolean {
  if (!prev) return false;
  if (c.base === '\u0627') return prev.marks.has(FATHA);
  if (c.base === '\u0648') return prev.marks.has(DAMMA);
  if (c.base === '\u064a' || c.base === '\u0649') return prev.marks.has(KASRA);
  return false;
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
