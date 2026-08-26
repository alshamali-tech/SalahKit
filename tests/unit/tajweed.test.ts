import { describe, expect, it } from 'vitest';
import { analyzeTajweed, RULE_ORDER } from '../../src/lib/core/tajweed';
import type { TajweedRuleId } from '../../src/lib/core/tajweed';

function rulesIn(text: string): Set<TajweedRuleId> {
  return new Set(
    analyzeTajweed(text).filter((s) => s.rule).map((s) => s.rule as TajweedRuleId)
  );
}

function ruleOn(text: string, needle: string): TajweedRuleId | null {
  for (const seg of analyzeTajweed(text)) {
    if (seg.text.includes(needle)) return seg.rule;
  }
  return null;
}

describe('noon sakinah & tanween', () => {
  it('ikhfaa before one of the 15 letters', () => {
    expect(rulesIn('مِن تَحْتِهَا')).toContain('ikhfaa');
  });
  it('izhaar before a throat letter, coloring only the noon', () => {
    expect(ruleOn('مِنْ خَوْفٍ', 'مِنْ')).toBe('izhaar');
    expect(ruleOn('مِنْ خَوْفٍ', 'خَوْف')).toBeNull();
  });
  it('idghaam with ghunna before ي ن م و across words', () => {
    expect(ruleOn('مِن نَّعِيمٍ', 'مِن')).toBe('idghaam-ghunna');
    expect(ruleOn('مَن يَقُولُ', 'مَن')).toBe('idghaam-ghunna');
  });
  it('a bare noon with no written sukun is still saakin', () => {
    expect(rulesIn('فَمَن يَعْمَلْ')).toContain('idghaam-ghunna');
  });
  it('tanween targets the first letter of the next word', () => {
    expect(rulesIn('هُدًى لِّلْمُتَّقِينَ')).toContain('idghaam-bila-ghunna');
  });
  it('iqlaab before ب', () => {
    expect(rulesIn('فَمَن بَدَّلَهُ')).toContain('iqlaab');
  });
  it('does not merge idghaam inside a single word', () => {
    expect(rulesIn('الدُّنْيَا').has('idghaam-ghunna')).toBe(false);
  });
});

describe('meem sakinah & ghunna', () => {
  it('idghaam shafawi merges a saakin م into a following م', () => {
    expect(rulesIn('فِي قُلُوبِهِمْ مَّرَضٌ')).toContain('meem-idgham');
  });
  it('a tanween before meem is idghaam with ghunna, not shafawi', () => {
    expect(rulesIn('فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ')).toContain('idghaam-ghunna');
    expect(rulesIn('فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ').has('meem-idgham')).toBe(false);
  });
  it('ikhfaa shafawi before ب; plural-pronoun meem is not saakin', () => {
    expect(rulesIn('تَرْمِيهِم بِحِجَارَةٍ')).toContain('meem-ikhfaa');
    expect(rulesIn('عَلَيْهِمُ الذِّلَّةُ').has('meem-ikhfaa')).toBe(false);
  });
  it('ghunna on shaddah-ed noon/meem', () => {
    expect(rulesIn('إِنَّا')).toContain('ghunna');
    expect(rulesIn('ثُمَّ')).toContain('ghunna');
  });
});

describe('qalqalah', () => {
  it('sughra mid-word, kubra at a word end', () => {
    expect(rulesIn('يَقْطَعُونَ')).toContain('qalqalah');
    expect(rulesIn('قَدْ')).toContain('qalqalah-kubra');
  });
  it('does not mark a voweled qalqalah letter', () => {
    expect(rulesIn('الْفَلَقِ').has('qalqalah')).toBe(false);
  });
});

describe('lam rules', () => {
  it('lam shamsiyyah before a sun letter', () => {
    expect(rulesIn('وَالشَّمْسِ وَضُحَاهَا')).toContain('lam-shamsi');
  });
  it('lam qamariyyah before a moon letter', () => {
    expect(rulesIn('وَالْقَمَرِ إِذَا تَلَاهَا')).toContain('lam-qamari');
  });
});

describe('ra rules', () => {
  it('ra with fatha/damma is tafkhim; with kasra is tarqeeq', () => {
    expect(rulesIn('الرَّحْمَٰنِ الرَّحِيمِ')).toContain('ra-tafkhim');
    // رَبِّ has a FATHA on the ra — that is tafkhim, not tarqeeq.
    expect(rulesIn('رَبِّ الْعَالَمِينَ')).not.toContain('ra-tarqeeq');
    expect(rulesIn('إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ')).toContain('ra-tarqeeq');
  });
});

describe('madd family', () => {
  it('madd tabee\'i (2 counts) on matching vowels', () => {
    expect(rulesIn('قَالَ')).toContain('madd');
    expect(rulesIn('رَبِّ الْعَالَمِينَ')).toContain('madd');
  });
  it('madd badal after a hamza', () => {
    expect(rulesIn('وَمَا أُوتِيَ النَّبِيُّونَ')).toContain('madd-badal');
  });
  it('madd wajib when the hamza is in the same word', () => {
    expect(rulesIn('إِذَا جَاءَ نَصْرُ اللَّهِ')).toContain('madd-wajib');
  });
  it('madd jaiz across a word boundary into a hamza', () => {
    expect(rulesIn('يَا أَيُّهَا النَّاسُ')).toContain('madd-jaiz');
  });
  it('madd lazim before a shaddah in the same word', () => {
    expect(rulesIn('وَلَا الضَّالِّينَ')).toContain('madd-lazim');
    expect(rulesIn('وَمَا مِن دَابَّةٍ')).toContain('madd-lazim');
  });
  it('the silent article alif never takes a madd rule', () => {
    // Only the ا of تَبَارَكَ is a madd — not the alif of اللَّهُ.
    const counts = countByRule(analyzeTajweed('تَبَارَكَ اللَّهُ'));
    expect(counts['madd'] ?? 0).toBe(1);
    expect(rulesIn('الَّذِينَ').has('madd-lazim')).toBe(false);
    expect(rulesIn('النَّاسِ').has('madd-lazim')).toBe(false);
  });
  it('madd does not leak across a word boundary', () => {
    // The article alif of النَّاسِ follows a fatha from the PREVIOUS word.
    expect(rulesIn('مِنَ النَّاسِ').has('madd')).toBe(false);
  });
  it('a meem sakinah written bare (no sukun) still triggers its rules', () => {
    expect(rulesIn('تَرْمِيهِم بِحِجَارَةٍ')).toContain('meem-ikhfaa');
  });
  it('a voweled plural meem is not a meem sakinah', () => {
    expect(rulesIn('عَلَيْهِمُ الذِّلَّةُ').has('meem-ikhfaa')).toBe(false);
  });
  it('combined alif-madda (آ) is a madd badal', () => {
    expect(rulesIn('آمَنُوا').has('madd-badal') || rulesIn('آمَنُوا').has('madd')).toBe(true);
    expect(rulesIn('إِيمَانٍ')).toContain('madd-badal');
  });
  it('the Name of Allah is not marked as an article lam', () => {
    expect(rulesIn('قُلْ هُوَ اللَّهُ أَحَدٌ').has('lam-shamsi')).toBe(false);
    expect(rulesIn('قُلْ هُوَ اللَّهُ أَحَدٌ').has('lam-qamari')).toBe(false);
  });
});

describe('waqf & integrity', () => {
  it('detects standalone waqf signs', () => {
    expect(rulesIn('لَا رَيْبَ ۛ فِيهِ')).toContain('waqf');
  });
  it('reconstructs the exact input', () => {
    const input = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ';
    expect(analyzeTajweed(input).map((s) => s.text).join('')).toBe(input);
  });
  it('every rule in RULE_ORDER is detectable in a canonical example', () => {
    const all = new Set<TajweedRuleId>();
    [
      'إِنَّا', 'مِنْ خَوْفٍ', 'مِن تَحْتِهَا', 'مِن نَّعِيمٍ', 'مِن رَّبِّهِمْ',
      'فَمَن بَدَّلَهُ', 'تَرْمِيهِم بِحِجَارَةٍ', 'فِي قُلُوبِهِمْ مَّرَضٌ',
      'يَقْطَعُونَ', 'قَدْ', 'وَالشَّمْسِ', 'وَالْقَمَرِ', 'الرَّحْمَٰنِ', 'رِحْلَةَ الشِّتَاءِ',
      'قَالَ', 'وَمَا أُوتِيَ', 'إِذَا جَاءَ', 'يَا أَيُّهَا', 'وَلَا الضَّالِّينَ',
      'لَا رَيْبَ ۛ فِيهِ',
    ].forEach((t) => analyzeTajweed(t).forEach((s) => { if (s.rule) all.add(s.rule); }));
    expect(all.size).toBe(RULE_ORDER.length);
  });
  it('handles empty and non-Arabic input gracefully', () => {
    expect(analyzeTajweed('')).toEqual([]);
    expect(rulesIn('hello')).size.toBe(0);
  });
});
