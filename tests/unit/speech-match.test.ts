import { describe, expect, it } from 'vitest';
import {
  charSimilarity,
  levenshtein,
  matchAyah,
  normalizeArabic,
  tokenize,
  tokenRecall,
  MATCH_THRESHOLD,
} from '../../src/lib/core/speech-match';

describe('normalizeArabic', () => {
  it('strips harakat and diacritics to the consonantal skeleton', () => {
    expect(normalizeArabic('بِسْمِ اللَّهِ')).toBe('بسم الله');
    expect(normalizeArabic('الرَّحْمَٰنِ الرَّحِيمِ')).toBe('الرحمن الرحيم');
  });
  it('unifies alef/hamza carriers to plain alef', () => {
    expect(normalizeArabic('آمَنَ إِيمَانٌ أُوتُوا')).toBe('امن ايمان اوتوا');
  });
  it('maps alef-maqsura to ya and ta-marbuta to ha', () => {
    expect(normalizeArabic('هُدًى رَحْمَةٌ')).toBe('هدي رحمه');
  });
  it('removes tatweel and collapses whitespace', () => {
    expect(normalizeArabic('قُــلْ   هُوَ')).toBe('قل هو');
  });
});

describe('tokenize', () => {
  it('splits into normalized non-empty tokens', () => {
    expect(tokenize('قُلْ هُوَ اللَّهُ أَحَدٌ')).toEqual(['قل', 'هو', 'الله', 'احد']);
  });
  it('drops empty segments', () => {
    expect(tokenize('  فِيهَا   ')).toEqual(['فيها']);
  });
});

describe('levenshtein', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshtein('الله', 'الله')).toBe(0);
  });
  it('counts single substitutions/insertions', () => {
    expect(levenshtein('قل', 'كل')).toBe(1);
    expect(levenshtein('بسم', 'باسم')).toBe(1);
  });
  it('handles empty strings', () => {
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('abc', '')).toBe(3);
  });
});

describe('charSimilarity', () => {
  it('is 1 for identical skeletons', () => {
    expect(charSimilarity('بسم الله', 'بسم الله')).toBe(1);
  });
  it('is 1 for empty vs empty', () => {
    expect(charSimilarity('', '')).toBe(1);
  });
  it('decreases with edits', () => {
    expect(charSimilarity('قل هو الله احد', 'قل هو الله احد')).toBeGreaterThan(
      charSimilarity('قل هو الله احد', 'كل هو الله احد')
    );
  });
});

describe('tokenRecall', () => {
  it('is 1 when every target token is spoken', () => {
    expect(tokenRecall(['قل', 'هو', 'الله', 'احد'], ['قل', 'هو', 'الله', 'احد'])).toBe(1);
  });
  it('is order-insensitive (multiset)', () => {
    expect(tokenRecall(['احد', 'الله', 'هو', 'قل'], ['قل', 'هو', 'الله', 'احد'])).toBe(1);
  });
  it('is fractional when some tokens are missing', () => {
    expect(tokenRecall(['قل', 'هو'], ['قل', 'هو', 'الله', 'احد'])).toBe(0.5);
  });
  it('is 0 when nothing matches', () => {
    expect(tokenRecall(['شيء', 'اخر'], ['قل', 'هو', 'الله', 'احد'])).toBe(0);
  });
});

describe('matchAyah', () => {
  const target = 'قُلْ هُوَ اللَّهُ أَحَدٌ';
  it('matches an exact voweled recitation', () => {
    const v = matchAyah('قُلْ هُوَ اللَّهُ أَحَدٌ', target);
    expect(v.matched).toBe(true);
    expect(v.label).toBe('strong');
    expect(v.score).toBeGreaterThanOrEqual(MATCH_THRESHOLD);
  });
  it('matches a bare (unvoweled) recognizer transcript', () => {
    const v = matchAyah('قل هو الله احد', target);
    expect(v.matched).toBe(true);
    expect(v.tokenScore).toBe(1);
  });
  it('still matches with minor letter drift', () => {
    const v = matchAyah('قل هو الله احد الصمد', target);
    expect(v.matched).toBe(true);
  });
  it('rejects an unrelated utterance', () => {
    const v = matchAyah('الحمد لله رب العالمين', target);
    expect(v.matched).toBe(false);
    expect(v.label).not.toBe('strong');
  });
  it('scores partial recitations between weak and strong', () => {
    const v = matchAyah('قل هو', target);
    expect(v.matched).toBe(false);
    expect(v.tokenScore).toBeCloseTo(0.5, 1);
  });
});
