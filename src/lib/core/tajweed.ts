/**
 * Tajweed rule engine (Layer 3 of the blueprint).
 * A forward pass walks the tokenized Uthmani text calling one detector
 * per rule family; a small post-pass handles the stop-based madd leen.
 * Conflicts resolve by the priority field in the rule table (§5.3).
 * Qalqalah kubra is position-aware: it only fires at a stopping place
 * (end of the text or before a waqf sign) — mid-flow it is sughra.
 * Pure and deterministic: same text → same annotations. Hafs 'an 'Asim.
 */
import {
  TAJWEED_RULES,
  RULE_ORDER,
  RULE_CATEGORIES,
  SUN_LETTERS,
  MOON_LETTERS,
  MUTAJANIS_PAIRS,
  MUTAQARIB_PAIRS,
} from './tajweed-rules';
import type { TajweedRuleId, RuleCategory, TajweedRule } from './tajweed-rules';

export { TAJWEED_RULES, RULE_ORDER, RULE_CATEGORIES };
export type { TajweedRuleId, RuleCategory, TajweedRule };

const SUKUN = '\u0652';
const SHADDA = '\u0651';
const FATHA = '\u064e';
const DAMMA = '\u064f';
const KASRA = '\u0650';
const DAGGER_ALIF = '\u0670';
const MADDA = '\u0653';
const SMALL_WAW = '\u06e5';
const SMALL_YA = '\u06e6';
const HAMZA_WASL = '\u0671';
const ALIF = '\u0627';
const NOON = '\u0646';
const MEEM = '\u0645';
const LAM = '\u0644';
const RA = '\u0631';
const HA = '\u0647';
const BA = '\u0628';
const WAW = '\u0648';
const YA = '\u064a';
const ALIF_MAQSURA = '\u0649';
const ALEF_MADDA = '\u0622';

const TANWEEN = new Set(['\u064b', '\u064c', '\u064d']);
const HAMZA_CARRIERS = new Set(['\u0621', '\u0623', '\u0625', ALEF_MADDA, '\u0626', '\u0624']);
const ARTICLE_ALIFS = new Set([ALIF, ALEF_MADDA, HAMZA_WASL]);
const MADD_LETTERS = new Set([ALIF, WAW, YA, ALIF_MAQSURA]);
const QALQALAH_LETTERS = new Set(['\u0642', '\u0637', BA, '\u062c', '\u062f']);
const THROAT_LETTERS = new Set(['\u0621', HA, '\u0639', '\u062d', '\u063a', '\u062e', '\u0623', '\u0625', ALEF_MADDA, HAMZA_WASL]);
const IDGHAAM_GHUNNA_LETTERS = new Set([YA, NOON, MEEM, WAW]);
const IDGHAAM_BILA_LETTERS = new Set([LAM, RA]);
const ISTIALA_LETTERS = new Set(['\u062e', '\u0635', '\u0636', '\u063a', '\u0637', '\u0642', '\u0638']);

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

/** True for combining marks (excludes standalone waqf signs). */
function isMark(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (
    ((c >= 0x0610 && c <= 0x061a) || (c >= 0x064b && c <= 0x065f) || c === 0x0670) &&
    !isWaqfSign(ch)
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
      while (i < chars.length && isMark(chars[i] ?? '')) {
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

/** Index of the last letter cluster, or -1. */
function lastLetterIndex(clusters: Cluster[]): number {
  for (let j = clusters.length - 1; j >= 0; j -= 1) {
    const c = clusters[j];
    if (c && isLetter(c.base)) return j;
  }
  return -1;
}

/**
 * Determines the vowel quality that governs the lam of Allah. Walks back
 * from the name-lam over the article (ا + ل) to the deciding letter:
 * an explicit kasra → light; fatha/damma → heavy; a bare madd letter
 * stands for its own vowel (و/ا carry a heavy quality, ي a light one).
 * Returns null when no deciding letter is found.
 */
function vowelQualityBefore(clusters: Cluster[], i: number): 'light' | 'heavy' | null {
  for (let j = i - 1; j >= Math.max(0, i - 4); j -= 1) {
    const s = clusters[j];
    if (!s) continue;
    if (hasVowel(s)) return s.marks.has(KASRA) ? 'light' : 'heavy';
    // The article alif of الله (always immediately before the article lam).
    const after = clusters[j + 1];
    const isArticleAlif =
      (s.base === ALIF || s.base === HAMZA_WASL || s.base === ALEF_MADDA) &&
      after !== undefined &&
      after.base === LAM &&
      after.wordId === s.wordId;
    if (isArticleAlif) continue;
    // The article lam of الله.
    if (s.base === LAM) continue;
    // A bare madd letter (no marks) represents its vowel: و/ا → heavy, ي → light.
    if (s.marks.size === 0 && MADD_LETTERS.has(s.base)) {
      return s.base === YA || s.base === ALIF_MAQSURA ? 'light' : 'heavy';
    }
    break;
  }
  return null;
}

/** True when the word at idx is the Name of Allah (ا لّ ه). */
function isDivineNameAt(clusters: Cluster[], idx: number): boolean {
  const first = clusters[idx];
  const second = clusters[idx + 1];
  const third = clusters[idx + 2];
  return Boolean(
    first &&
      (first.base === ALIF || first.base === HAMZA_WASL) &&
      second &&
      second.base === LAM &&
      second.marks.has(SHADDA) &&
      third &&
      third.base === HA
  );
}

/** A trailing silent alif of a word (plural ا, tanween-fath ا, ى). */
function isSilentTail(c: Cluster): boolean {
  return (c.base === ALIF || c.base === ALIF_MAQSURA) && c.marks.size === 0;
}

/** First letter of the next word, skipping silent trailing alifs. */
function firstLetterOfNextWord(clusters: Cluster[], i: number): { c: Cluster; idx: number } | null {
  const current = clusters[i];
  if (!current) return null;
  for (let j = i + 1; j < clusters.length; j += 1) {
    const n = clusters[j];
    if (!n) break;
    if (n.wordId === current.wordId) {
      if (isLetter(n.base) && !isSilentTail(n)) return null;
    } else if (isLetter(n.base)) {
      return { c: n, idx: j };
    }
  }
  return null;
}

/** Noon-sakinah / tanween outcome by the following letter. */
function noonRuleFor(nextBase: string): TajweedRuleId {
  if (nextBase === BA) return 'iqlaab';
  if (THROAT_LETTERS.has(nextBase)) return 'izhaar';
  if (IDGHAAM_BILA_LETTERS.has(nextBase)) return 'idghaam-bila-ghunna';
  if (IDGHAAM_GHUNNA_LETTERS.has(nextBase)) return 'idghaam-ghunna';
  return 'ikhfaa';
}

/** True when a madd letter follows its matching short vowel. */
function hasMatchingVowel(c: Cluster, prev: Cluster | null): boolean {
  if (!prev) return false;
  if (c.base === ALIF) return prev.marks.has(FATHA);
  if (c.base === WAW) return prev.marks.has(DAMMA);
  if (c.base === YA || c.base === ALIF_MAQSURA) return prev.marks.has(KASRA);
  return false;
}

/** Ghunna: شaddah-ed noon or meem. Returns true when consumed. */
function checkGhunna(c: Cluster): boolean {
  if ((c.base === NOON || c.base === MEEM) && c.marks.has(SHADDA)) {
    assign(c, 'ghunna');
    return true;
  }
  return false;
}

/** Noon sakinah & tanween (Category A). */
function checkNoon(c: Cluster, clusters: Cluster[], i: number): boolean {
  const isTanween = [...c.marks].some((m) => TANWEEN.has(m));
  if (c.base === NOON && (c.marks.has(SUKUN) || !hasVowel(c))) {
    const next = clusters[i + 1];
    if (next && isLetter(next.base)) {
      let rule = noonRuleFor(next.base);
      const sameWord = next.wordId === c.wordId;
      if (sameWord && (rule === 'idghaam-ghunna' || rule === 'idghaam-bila-ghunna')) rule = 'izhaar';
      assign(c, rule);
      return true;
    }
    return false;
  }
  if (isTanween) {
    const nw = firstLetterOfNextWord(clusters, i);
    if (nw && !isDivineNameAt(clusters, nw.idx)) {
      assign(c, noonRuleFor(nw.c.base));
      return true;
    }
  }
  return false;
}

/** Meem sakinah: shafawi ikhfaa / idgham / izhaar (Category B). */
function checkMeem(c: Cluster, clusters: Cluster[], i: number): boolean {
  if (c.base !== MEEM || c.marks.has(SHADDA)) return false;
  if (!(c.marks.has(SUKUN) || !hasVowel(c))) return false;
  const next = clusters[i + 1];
  if (next && isLetter(next.base)) {
    if (next.base === BA) assign(c, 'meem-ikhfaa');
    else if (next.base === MEEM) assign(c, 'meem-idgham');
    else assign(c, 'izhaar-shafawi');
  }
  return true;
}

/** Cross-word letter idghams: mutamathil / mutajanis / mutaqaribayn. */
function checkLetterIdgham(c: Cluster, clusters: Cluster[], i: number): boolean {
  // Before idgham the first letter is saakin — written with a sukūn OR
  // left bare in Uthmani script (اضْرِب بِّعَصَاكَ, وَقُل رَّبِّ).
  if (!isSaakin(c)) return false;
  const next = clusters[i + 1];
  if (!next || !isLetter(next.base) || next.wordId === c.wordId) return false;
  if (!next.marks.has(SHADDA)) return false;
  if (next.base === c.base) assign(c, 'idgham-mutamathil');
  else if (MUTAJANIS_PAIRS[c.base] === next.base) assign(c, 'idgham-mutajanis');
  else if (MUTAQARIB_PAIRS[c.base] === next.base) assign(c, 'idgham-mutaqarib');
  else return false;
  return true;
}

/**
 * Qalqalah — the three أقسام of Minhāj al-Dārisīn. The deciding factor
 * is whether the sākin letter is a STOPPING place (موقوف عليه), per the
 * book's own definitions and Ibn al-Jazarī's الجَزَريَّة:
 *   «وبَيِّنَنْ مُقَلْقَلًا إن سَكَّنَا ... وإن يَكُنْ في الوَقْفِ كَانَ أَبْيَنَا»
 *   kubrā  — MUSHADDAH and stopped upon          (وَتَبَّ، الْحَقُّ، الْحَجُّ)
 *   wusṭā  — sākin, NO shaddah, stopped upon      (الْفَلَقِ، لَقَدْ)
 *   ṣughrā — sākin, NOT stopped upon              (شَقَقْنَا، قَدْ سَمِعَ)
 * A stop = the very last letter of the text, or the letter right before
 * a waqf sign. Word-end while CONTINUING (قَدْ سَمِعَ) is ṣughrā.
 */
function checkQalqalah(c: Cluster, clusters: Cluster[], i: number, lastIdx: number): boolean {
  if (!QALQALAH_LETTERS.has(c.base)) return false;
  const hasShadda = c.marks.has(SHADDA);
  const next = clusters[i + 1];
  const atStop = i === lastIdx || (next !== undefined && next.rule === 'waqf');
  if (atStop) {
    // Stopping places the letter in a TEMPORARY sukūn (ʿāriḍ) even when a
    // short vowel is written — the qalqalah still fires: mushaddad → kubrā,
    // otherwise → wusṭā. This is why the final قِ of الْفَلَقِ bounces.
    assign(c, hasShadda ? 'qalqalah-kubra' : 'qalqalah-wusta');
    return true;
  }
  // Not a stopping place: only an ORIGINAL sukūn (written, or a bare
  // consonant) bounces — ṣughrā. A voweled letter mid-flow never does.
  if (c.marks.has(SUKUN) || !hasVowel(c)) {
    assign(c, 'qalqalah');
    return true;
  }
  return false;
}

/** Lam: the Name of Allah first, then the definite article. */
function checkLam(c: Cluster, clusters: Cluster[], i: number): boolean {
  if (c.base !== LAM) return false;
  const prev = clusters[i - 1];
  const next = clusters[i + 1];
  const nextNext = clusters[i + 2];
  if (c.marks.has(SHADDA) && next && next.base === HA) {
    // The deciding vowel sits on the letter BEFORE the article alif of
    // الله (e.g. the مِ of بِسْمِ, the دَ of شَهِدَ), or directly before
    // in لِـللَّهِ. kasra → light; fatha/damma → heavy.
    const quality = vowelQualityBefore(clusters, i);
    if (quality === 'light') assign(c, 'lam-allah-tarqeeq');
    else if (quality === 'heavy') assign(c, 'lam-allah-tafkhim');
    return true;
  }
  if (prev && ARTICLE_ALIFS.has(prev.base) && prev.wordId === c.wordId) {
    // The Name of Allah is ا + ل + لّ + ه. When this article lam is followed
    // by a mushaddah lam and then ha, it belongs to the Name — the name-lam
    // branch above carries the tafkhim/tarqeeq, so skip it here (otherwise
    // the bare ل would be misread as a shamsiyyah article before ل).
    const isDivineArticle =
      next && next.base === LAM && next.marks.has(SHADDA) && nextNext && nextNext.base === HA;
    if (isDivineArticle) return true;
    if (next && isLetter(next.base)) {
      if (SUN_LETTERS.has(next.base)) assign(c, 'lam-shamsi');
      else if (MOON_LETTERS.has(next.base)) assign(c, 'lam-qamari');
    }
    return true;
  }
  return false;
}

/** Ra: tafkhim / tarqeeq, incl. the isti'la exception (مِرْصَادًا). */
function checkRa(c: Cluster, clusters: Cluster[], i: number): boolean {
  if (c.base !== RA) return false;
  if (c.marks.has(FATHA) || c.marks.has(DAMMA)) assign(c, 'ra-tafkhim');
  else if (c.marks.has(KASRA)) assign(c, 'ra-tarqeeq');
  else if (isSaakin(c)) {
    const prev = clusters[i - 1];
    const next = clusters[i + 1];
    if (prev) {
      if (prev.marks.has(KASRA)) {
        assign(c, next && ISTIALA_LETTERS.has(next.base) ? 'ra-tafkhim' : 'ra-tarqeeq');
      } else if (prev.base === YA && isSaakin(prev)) assign(c, 'ra-tarqeeq');
      else if (prev.marks.has(FATHA) || prev.marks.has(DAMMA)) assign(c, 'ra-tafkhim');
    }
  }
  return true;
}

/** Madd silah: the pronoun هُ / هِ between voweled letters. */
function checkSilah(c: Cluster, clusters: Cluster[], i: number): boolean {
  if (c.base !== HA) return false;
  const prev = clusters[i - 1];
  const hasSilahMark = c.marks.has(SMALL_WAW) || c.marks.has(SMALL_YA);
  const pronoun =
    hasSilahMark ||
    ((c.marks.has(DAMMA) || c.marks.has(KASRA)) && prev && prev.wordId === c.wordId && hasVowel(prev));
  if (!pronoun) return false;
  const next = clusters[i + 1];
  if (next && isLetter(next.base) && next.wordId !== c.wordId) {
    if (HAMZA_CARRIERS.has(next.base) && !isDivineNameAt(clusters, i + 1)) assign(c, 'madd-silah-kubra');
    else if (hasVowel(next) || next.marks.has(SHADDA)) assign(c, 'madd-silah-sughra');
  }
  return true;
}

/** The madd family (Category C), checked lazim → wajib → badal → jaiz. */
function checkMadd(c: Cluster, clusters: Cluster[], i: number, lastIdx: number): boolean {
  if (c.base === ALEF_MADDA) {
    assign(c, 'madd-badal');
    return true;
  }
  if (!MADD_LETTERS.has(c.base)) return false;
  // A combining maddah (ٓ U+0653) marks the 6-count madd lāzim of the
  // fawātiḥ (يسٓ, the ي of which is a madd letter).
  if (c.marks.has(MADDA)) {
    assign(c, 'madd-lazim');
    return true;
  }
  const prev = clusters[i - 1];
  const prevSameWord = prev && prev.wordId === c.wordId ? prev : null;
  const afterHamza = prevSameWord !== null && HAMZA_CARRIERS.has(prevSameWord.base);
  const isTrueMadd =
    c.marks.has(DAGGER_ALIF) || afterHamza || hasMatchingVowel(c, prevSameWord);
  if (isTrueMadd) {
    const next = clusters[i + 1];
    const nextSameWord = next && next.wordId === c.wordId ? next : null;
    if (nextSameWord && (nextSameWord.marks.has(SHADDA) || (nextSameWord.marks.has(SUKUN) && !hasVowel(nextSameWord)))) {
      assign(c, 'madd-lazim');
    } else if (nextSameWord && i + 1 === lastIdx && hasVowel(nextSameWord)) {
      assign(c, 'madd-arrid');
    } else if (nextSameWord && HAMZA_CARRIERS.has(nextSameWord.base)) {
      assign(c, 'madd-wajib');
    } else if (afterHamza) {
      assign(c, 'madd-badal');
    } else {
      const nw = firstLetterOfNextWord(clusters, i);
      if (nw && HAMZA_CARRIERS.has(nw.c.base) && !isDivineNameAt(clusters, nw.idx)) assign(c, 'madd-jaiz');
      else assign(c, 'madd');
    }
  }
  return true;
}

/** Post-pass: madd leen on a saakin و/ي (after fatha) in the final word. */
function applyLeen(clusters: Cluster[], lastIdx: number): void {
  if (lastIdx < 0) return;
  const last = clusters[lastIdx];
  if (!last) return;
  for (let j = lastIdx; j >= 0; j -= 1) {
    const w = clusters[j];
    if (!w || w.wordId !== last.wordId) break;
    if ((w.base === WAW || w.base === YA) && !w.marks.has(SHADDA) && (w.marks.has(SUKUN) || !hasVowel(w))) {
      const p = clusters[j - 1];
      if (p && p.wordId === w.wordId && p.marks.has(FATHA)) assign(w, 'madd-leen');
      break;
    }
  }
}

/**
 * Analyzes Uthmani text and returns ordered tajweed segments.
 * @param text - Raw Arabic text with diacritics.
 * @returns Segments; concatenating reproduces the input exactly.
 */
export function analyzeTajweed(text: string): TajweedSegment[] {
  const clusters = buildClusters(text);
  const lastIdx = lastLetterIndex(clusters);

  for (let i = 0; i < clusters.length; i += 1) {
    const c = clusters[i];
    if (!c || c.rule === 'waqf') continue;
    // The Uthmani maddah (ٓ) is decisive: it only ever appears on the
    // fawātiḥ letters (الٓمٓ, قٓ, نٓ, صٓ…) and means madd lāzim ḥarfī
    // (6 counts). The dagger alif (ٰ) is a 2-count natural madd (طٰهٰ,
    // الرَّحْمَٰنِ). Both outrank every other rule on the letter.
    if (c.marks.has(MADDA)) {
      assign(c, 'madd-lazim');
      continue;
    }
    if (c.marks.has(DAGGER_ALIF) && !MADD_LETTERS.has(c.base)) {
      assign(c, 'madd');
      continue;
    }
    if (checkGhunna(c)) continue;
    if (c.base === HAMZA_WASL) {
      assign(c, 'hamza-wasl');
      continue;
    }
    if (checkNoon(c, clusters, i)) continue;
    if (checkMeem(c, clusters, i)) continue;
    if (checkLetterIdgham(c, clusters, i)) continue;
    if (checkQalqalah(c, clusters, i, lastIdx)) continue;
    if (checkLam(c, clusters, i)) continue;
    if (checkRa(c, clusters, i)) continue;
    if (checkSilah(c, clusters, i)) continue;
    if (checkMadd(c, clusters, i, lastIdx)) continue;
    // Non-madd letters bearing a maddah (لٓ مٓ نٓ قٓ صٓ in the fawātiḥ)
    // carry the 6-count madd lāzim ḥarfī; a dagger-alif is 2-count tabee'ī.
    if (c.marks.has(MADDA)) assign(c, 'madd-lazim');
    else if (c.marks.has(DAGGER_ALIF)) assign(c, 'madd');
  }
  applyLeen(clusters, lastIdx);

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
