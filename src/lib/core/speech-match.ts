/**
 * Voice-recall matching engine (pure TypeScript, zero side effects).
 * The Chain of Thought: normalize Arabic → tokenize → score similarity
 * → return a verdict. Speech recognizers emit bare, unvoweled text with
 * merged/split words and near-sound letter swaps, so we compare the
 * consonantal skeleton of what was said against the ayah's skeleton.
 */

/** Combining marks & decorative signs stripped before comparison.
 *  The character class intentionally matches each combining mark
 *  individually — that is the whole point of the normalization. */
// eslint-disable-next-line no-misleading-character-class
const STRIP_RE = /[\u064B-\u0652\u0653-\u065F\u0670\u06D6-\u06ED\u06DD\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06EC\u0640\u200F\u200E]/g;

/**
 * Reduces Arabic text to its consonantal skeleton.
 * Removes harakat, tatweel and Quranic signs; unifies alef/hamza
 * carriers, alef-maqsura → ya, Persian ya → ya, and ta-marbuta → ha.
 * @param text - Raw Arabic (voweled or bare).
 * @returns Normalized, whitespace-collapsed skeleton.
 */
export function normalizeArabic(text: string): string {
  let s = text.replace(STRIP_RE, '');
  s = s.replace(/[\u0622\u0623\u0625\u0671\u0672\u0673]/g, '\u0627');
  s = s.replace(/[\u0649\u06CC\u06CE]/g, '\u064A');
  s = s.replace(/\u0629/g, '\u0647');
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Splits normalized text into non-empty word tokens.
 * @param text - Normalized or raw Arabic.
 * @returns Ordered token list.
 */
export function tokenize(text: string): string[] {
  return normalizeArabic(text)
    .split(' ')
    .filter((w) => w.length > 0);
}

/**
 * Classic Levenshtein edit distance (two-row DP).
 * @param a - First string.
 * @param b - Second string.
 * @returns Minimum edits to transform a into b.
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= m; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    const swap = prev;
    prev = curr;
    curr = swap;
  }
  return prev[n];
}

/**
 * Character-level similarity in [0, 1] (1 = identical skeletons).
 * @param a - Normalized string.
 * @param b - Normalized string.
 * @returns 1 - editDistance / maxLength.
 */
export function charSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1;
  const max = Math.max(a.length, b.length);
  return 1 - levenshtein(a, b) / max;
}

/**
 * Multiset token recall: how much of the target's vocabulary the spoken
 * text covers. Recall-oriented because a reciter must produce the ayah.
 * @param spoken - Tokens heard.
 * @param target - Tokens of the ayah.
 * @returns Fraction of target tokens matched, in [0, 1].
 */
export function tokenRecall(spoken: string[], target: string[]): number {
  if (target.length === 0) return spoken.length === 0 ? 1 : 0;
  const pool = [...spoken];
  let hits = 0;
  for (const t of target) {
    const idx = pool.indexOf(t);
    if (idx >= 0) {
      hits += 1;
      pool.splice(idx, 1);
    }
  }
  return hits / target.length;
}

/** Weight of token recall vs character similarity in the verdict. */
const TOKEN_WEIGHT = 0.65;

/** Outcome buckets for UI feedback. */
export type MatchLabel = 'strong' | 'partial' | 'weak';

/** Result of comparing spoken text against a target ayah. */
export interface MatchVerdict {
  /** True when the combined score clears the threshold. */
  matched: boolean;
  /** Combined score in [0, 1]. */
  score: number;
  /** Token-recall component in [0, 1]. */
  tokenScore: number;
  /** Character-similarity component in [0, 1]. */
  charScore: number;
  /** Coarse bucket for styling and copy. */
  label: MatchLabel;
}

/** Default combined-score threshold for an automatic reveal. */
export const MATCH_THRESHOLD = 0.62;

/**
 * Compares a recognized utterance against an ayah's Arabic.
 * @param spoken - Transcript from the speech recognizer.
 * @param target - The ayah's Uthmani Arabic.
 * @param threshold - Score at/above which `matched` is true.
 * @returns The scored verdict.
 */
export function matchAyah(spoken: string, target: string, threshold = MATCH_THRESHOLD): MatchVerdict {
  const s = normalizeArabic(spoken);
  const t = normalizeArabic(target);
  const tokenScore = tokenRecall(tokenize(s), tokenize(t));
  const charScore = charSimilarity(s, t);
  const score = Math.round((TOKEN_WEIGHT * tokenScore + (1 - TOKEN_WEIGHT) * charScore) * 100) / 100;
  const matched = score >= threshold;
  const label: MatchLabel = matched ? 'strong' : score >= threshold * 0.55 ? 'partial' : 'weak';
  return { matched, score, tokenScore, charScore, label };
}
