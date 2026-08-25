import { describe, expect, it } from 'vitest';
import { analyzeTajweed, countByRule } from '../../src/lib/core/tajweed';
import type { TajweedRuleId } from '../../src/lib/core/tajweed';

/** Collects every rule present in the analyzed text. */
function rulesIn(text: string): Set<TajweedRuleId> {
  return new Set(
    analyzeTajweed(text)
      .filter((s) => s.rule)
      .map((s) => s.rule as TajweedRuleId)
  );
}

/** The rule applied to a specific substring, if any. */
function ruleOn(text: string, needle: string): TajweedRuleId | null {
  for (const seg of analyzeTajweed(text)) {
    if (seg.text.includes(needle)) return seg.rule;
  }
  return null;
}

describe('noon sakinah & tanween (real-world outcomes)', () => {
  it('ikhfaa before one of the 15 letters', () => {
    expect(rulesIn('مِن قَبْلُ')).toContain('ikhfaa');
    expect(rulesIn('عِنْدَ')).toContain('ikhfaa');
  });

  it('izhaar before a throat letter', () => {
    expect(rulesIn('مِنْ خَوْفٍ')).toContain('izhaar');
    expect(rulesIn('مِنْ هَادٍ')).toContain('izhaar');
  });

  it('idghaam with ghunna before ي ن م و', () => {
    expect(rulesIn('مِن نَّعِيمٍ')).toContain('idghaam-ghunna');
    expect(rulesIn('مَن يَقُولُ')).toContain('idghaam-ghunna');
  });

  it('idghaam without ghunna before ل or ر', () => {
    expect(rulesIn('مِن رَّبِّهِمْ')).toContain('idghaam-bila-ghunna');
  });

  it('iqlaab before ب', () => {
    expect(rulesIn('مِن بَعْدِ')).toContain('iqlaab');
  });

  it('does NOT merge idghaam inside a single word — read clear', () => {
    // الدُّنْيَا: noon-sakinah + ي within ONE word must stay clear (izhaar).
    const found = rulesIn('الدُّنْيَا');
    expect(found.has('idghaam-ghunna')).toBe(false);
    expect(found.has('izhaar')).toBe(true);
  });

  it('still applies ikhfaa inside a word (only idghaam is blocked)', () => {
    // عِنْدَ is a genuine same-word ikhfaa.
    expect(rulesIn('عِنْدَ').has('ikhfaa')).toBe(true);
  });

  it('tanween follows the same rules', () => {
    // طَيْرًا أَبَابِيل: tanween fatha on ر before أ (hamza) → izhaar.
    expect(rulesIn('طَيْرًا أَبَابِيلَ')).toContain('izhaar');
  });
});

describe('ghunna & qalqalah', () => {
  it('ghunna on noon/meem with shaddah', () => {
    expect(rulesIn('إِنَّا')).toContain('ghunna');
    expect(rulesIn('ثُمَّ')).toContain('ghunna');
  });

  it('qalqalah on saakin ق ط ب ج د', () => {
    expect(rulesIn('قُلْ')).toContain('qalqalah'); // قْ
    expect(rulesIn('يَدْخُلُونَ')).toContain('qalqalah'); // دْ
    expect(rulesIn('الْفَلَقِ')).not.toContain('qalqalah'); // ق carries a vowel
  });
});

describe('meem sakinah', () => {
  it('ikhfaa shafawi before ب', () => {
    expect(rulesIn('تَرْمِيهِم بِحِجَارَةٍ')).toContain('meem-ikhfaa');
  });

  it('idghaam shafawi into another meem', () => {
    // مْ of وَهُم followed by the meem of مُّهْتَدُونَ.
    expect(rulesIn('وَهُم مُّهْتَدُونَ')).toContain('meem-idgham');
  });

  it('tanween before meem is idghaam with ghunna, not shafawi', () => {
    expect(rulesIn('كَعَصْفٍ مَّأْكُولٍ')).toContain('idghaam-ghunna');
  });

  it('does not colour the default izhaar-shafawi case', () => {
    expect(rulesIn('وَلَسَوْفَ')).not.toContain('meem-ikhfaa');
    expect(rulesIn('وَلَسَوْفَ')).not.toContain('meem-idgham');
  });
});

describe('madd & waqf', () => {
  it('natural madd on a long-vowel letter', () => {
    expect(rulesIn('قَالَ')).toContain('madd');
    expect(rulesIn('قِيلَ')).toContain('madd');
    expect(rulesIn('يَقُولُ')).toContain('madd');
  });

  it('detects waqf signs', () => {
    expect(rulesIn('لَا رَيْبَ ۛ فِيهِ')).toContain('waqf');
  });
});

describe('segmentation integrity', () => {
  it('reconstructs the exact input', () => {
    const input = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ';
    const joined = analyzeTajweed(input)
      .map((s) => s.text)
      .join('');
    expect(joined).toBe(input);
  });

  it('never leaves a cluster with more than one rule', () => {
    const counts = countByRule(analyzeTajweed('مِن نَّعِيمٍ ۝ مِنْ خَوْفٍ ۝ مِن رَّبِّهِمْ'));
    expect(Object.values(counts).every((n) => n >= 1)).toBe(true);
  });

  it('handles empty and non-Arabic input gracefully', () => {
    expect(analyzeTajweed('')).toEqual([]);
    expect(rulesIn('hello')).size.toBe(0);
  });
});
