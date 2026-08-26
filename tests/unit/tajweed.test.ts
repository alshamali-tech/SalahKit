import { describe, expect, it } from 'vitest';
import { analyzeTajweed, RULE_ORDER } from '../../src/lib/core/tajweed';
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

  it('izhaar before a throat letter, and colors ONLY the noon', () => {
    expect(ruleOn('مِنْ خَوْفٍ', 'مِنْ')).toBe('izhaar');
    expect(ruleOn('مِنْ خَوْفٍ', 'خَوْف')).toBeNull();
  });

  it('idghaam with ghunna before ي ن م و across words', () => {
    expect(ruleOn('مِن نَّعِيمٍ', 'مِن')).toBe('idghaam-ghunna');
    expect(ruleOn('مَن يَقُولُ', 'مَن')).toBe('idghaam-ghunna');
  });

  it('a bare noon with no written sukun is still saakin (Uthmani convention)', () => {
    expect(rulesIn('فَمَن يَعْمَلْ')).toContain('idghaam-ghunna');
    expect(rulesIn('فَمَن بَدَّلَهُ')).toContain('iqlaab');
  });

  it('tanween targets the first letter of the NEXT word, not a trailing ى', () => {
    // هُدًى لِّلْمُتَّقِينَ: idghaam-bila onto the ل, not the written ى.
    expect(rulesIn('هُدًى لِّلْمُتَّقِينَ')).toContain('idghaam-bila-ghunna');
  });

  it('idghaam without ghunna before ل or ر', () => {
    expect(rulesIn('مِن رَّبِّهِمْ')).toContain('idghaam-bila-ghunna');
  });

  it('iqlaab before ب', () => {
    expect(rulesIn('مِن بَعْدِ')).toContain('iqlaab');
  });

  it('does NOT merge idghaam inside a single word — read clear', () => {
    expect(rulesIn('الدُّنْيَا').has('idghaam-ghunna')).toBe(false);
    expect(rulesIn('الدُّنْيَا').has('izhaar')).toBe(true);
    expect(rulesIn('صِنْوَانٌ').has('idghaam-ghunna')).toBe(false);
  });

  it('same-word ikhfaa is still real', () => {
    expect(rulesIn('عِنْدَ').has('ikhfaa')).toBe(true);
    expect(rulesIn('مِنكُمْ').has('ikhfaa')).toBe(true);
  });

  it('tanween follows the same rules', () => {
    expect(rulesIn('طَيْرًا أَبَابِيلَ')).toContain('izhaar');
    // ت is one of the 15 ikhfaa letters — NOT an idghaam letter.
    expect(rulesIn('جَنَّاتٍ تَجْرِي')).toContain('ikhfaa');
    expect(rulesIn('جَنَّاتٍ تَجْرِي').has('idghaam-ghunna')).toBe(false);
  });
});

describe('ghunna, qalqalah & meem sakinah', () => {
  it('ghunna on noon/meem with shaddah', () => {
    expect(rulesIn('إِنَّا')).toContain('ghunna');
    expect(rulesIn('ثُمَّ')).toContain('ghunna');
  });

  it('madd after shaddah is still a natural stretch (vowel absorbed)', () => {
    expect(rulesIn('إِنَّا')).toContain('madd');
    expect(rulesIn('يُحِبُّونَ')).toContain('madd');
  });

  it('qalqalah only on the saakin echoing letters', () => {
    expect(rulesIn('قُلْ')).toContain('qalqalah');
    expect(rulesIn('فَجَعَلَهُمْ كَعَصْفٍ')).toContain('qalqalah');
    expect(rulesIn('الْفَلَقِ').has('qalqalah')).toBe(false);
  });

  it('idghaam shafawi merges a saakin م into م', () => {
    expect(rulesIn('كَم مِّن فِئَةٍ')).toContain('meem-idgham');
  });

  it('ikhfaa shafawi before ب, and plural-pronoun meem is NOT saakin', () => {
    expect(rulesIn('تَرْمِيهِم بِحِجَارَةٍ')).toContain('meem-ikhfaa');
    expect(rulesIn('عَلَيْهِمُ الذِّلَّةُ').has('meem-ikhfaa')).toBe(false);
  });
});

describe('madd & waqf', () => {
  it('natural madd (2 counts) on matching vowels and dagger-alif', () => {
    expect(rulesIn('قَالَ')).toContain('madd');
    expect(rulesIn('يَقُولُ')).toContain('madd');
    expect(rulesIn('ذَٰلِكَ').has('madd')).toBe(true);
    expect(rulesIn('ذَٰلِكَ').has('madd-caused')).toBe(false);
  });

  it('caused madd (4-6 counts) before hamzah or shaddah/sukun', () => {
    expect(rulesIn('جَاءَ')).toContain('madd-caused');
    expect(rulesIn('وَلَا الضَّالِّينَ')).toContain('madd-caused');
  });

  it('madda sign gives caused madd', () => {
    expect(rulesIn('الرَّحْمَٰنِ')).toContain('madd-caused');
  });

  it('detects standalone waqf signs', () => {
    expect(rulesIn('لَا رَيْبَ ۛ فِيهِ')).toContain('waqf');
  });
});

describe('segmentation integrity', () => {
  it('reconstructs the exact input', () => {
    const input = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ';
    expect(analyzeTajweed(input).map((s) => s.text).join('')).toBe(input);
  });

  it('detects all twelve rules in canonical examples', () => {
    const all = new Set<TajweedRuleId>();
    [
      'إِنَّا', 'مِنْ خَوْفٍ', 'مِن قَبْلُ', 'مِن نَّعِيمٍ', 'مِن رَّبِّهِمْ',
      'مِن بَعْدِ', 'كَم مِّن فِئَةٍ', 'تَرْمِيهِم بِحِجَارَةٍ', 'قُلْ',
      'جَاءَ', 'قَالَ', 'لَا رَيْبَ ۛ فِيهِ',
    ].forEach((t) => analyzeTajweed(t).forEach((s) => { if (s.rule) all.add(s.rule); }));
    expect(all.size).toBe(RULE_ORDER.length);
  });

  it('handles empty and non-Arabic input gracefully', () => {
    expect(analyzeTajweed('')).toEqual([]);
    expect(rulesIn('hello')).size.toBe(0);
  });
});
