import { describe, expect, it } from 'vitest';
import { analyzeTajweed, countByRule, RULE_ORDER } from '../../src/lib/core/tajweed';
import type { TajweedRuleId } from '../../src/lib/core/tajweed';

/** Collects every rule present in the analyzed text. */
function rulesIn(text: string): Set<TajweedRuleId> {
  return new Set(
    analyzeTajweed(text)
      .filter((s) => s.rule)
      .map((s) => s.rule as TajweedRuleId)
  );
}

describe('noon sakinah & tanween', () => {
  it('ikhfaa before one of the 15 letters, incl. same-word', () => {
    expect(rulesIn('مِنْ قَبْلُ')).toContain('ikhfaa');
    expect(rulesIn('عِنْدَ')).toContain('ikhfaa');
  });
  it('izhaar before a throat letter colors only the noon', () => {
    const segs = analyzeTajweed('مِنْ خَوْفٍ');
    const noon = segs.find((s) => s.text.includes('مِنْ'));
    expect(noon?.rule).toBe('izhaar');
    expect(segs.find((s) => s.text.includes('خَوْف'))?.rule).not.toBe('izhaar');
  });
  it('idghaam across words, incl. a bare noon (no written sukun)', () => {
    expect(rulesIn('مِنْ نَّعِيمٍ')).toContain('idghaam-ghunna');
    expect(rulesIn('فَمَنْ يَعْمَلْ')).toContain('idghaam-ghunna');
    expect(rulesIn('مِنْ رَّبِّهِمْ')).toContain('idghaam-bila-ghunna');
    expect(rulesIn('مِنْ لَّدُنْهُ')).toContain('idghaam-bila-ghunna');
  });
  it('idghaam does NOT apply inside one word — izhaar instead', () => {
    expect(rulesIn('الدُّنْيَا').has('idghaam-ghunna')).toBe(false);
    expect(rulesIn('صِنْوَانٌ').has('idghaam-ghunna')).toBe(false);
    expect(rulesIn('بُنْيَانٌ').has('idghaam-ghunna')).toBe(false);
  });
  it('iqlaab before ب', () => {
    expect(rulesIn('مِنْ بَعْدِ')).toContain('iqlaab');
  });
  it('tanween targets the next word, and never merges into the Name of Allah', () => {
    expect(rulesIn('هُدًى لِّلْمُتَّقِينَ')).toContain('idghaam-bila-ghunna');
    expect(rulesIn('سَمِيعٌ عَلِيمٌ')).toContain('izhaar');
  });
});

describe('meem sakinah', () => {
  it('ikhfaa shafawi before ب — written or bare meem', () => {
    expect(rulesIn('تَرْمِيهِم بِحِجَارَةٍ')).toContain('meem-ikhfaa');
  });
  it('idghaam shafawi into a following meem', () => {
    expect(rulesIn('فِي قُلُوبِهِم مَّرَضٌ')).toContain('meem-idgham');
    expect(rulesIn('لَهُمْ مَّا يَدَّعُونَ')).toContain('meem-idgham');
  });
  it('izhaar shafawi before other letters, and a voweled meem is exempt', () => {
    expect(rulesIn('هُمْ نَائِمُونَ')).toContain('izhaar-shafawi');
    expect(rulesIn('عَلَيْهِمُ الذِّلَّةُ').has('meem-ikhfaa')).toBe(false);
    expect(rulesIn('عَلَيْهِمُ الذِّلَّةُ').has('izhaar-shafawi')).toBe(false);
  });
});

describe('qalqalah — position aware', () => {
  it('saakin mid-word is sughra', () => {
    expect(rulesIn('يَقْطَعُونَ')).toContain('qalqalah');
    expect(rulesIn('يَقْطَعُونَ').has('qalqalah-kubra')).toBe(false);
  });
  it('word-end mid-ayah is still sughra when continuing', () => {
    expect(rulesIn('قَدْ أَفْلَحَ الْمُؤْمِنُونَ')).toContain('qalqalah');
    expect(rulesIn('قَدْ أَفْلَحَ الْمُؤْمِنُونَ').has('qalqalah-kubra')).toBe(false);
  });
  it('the last letter of the text is a stopping place — kubra', () => {
    expect(rulesIn('قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ')).toContain('qalqalah-kubra');
    expect(rulesIn('قُلْ هُوَ اللَّهُ أَحَدٌ')).toContain('qalqalah-kubra');
  });
  it('a saakin qalqalah letter before a waqf sign is kubra', () => {
    expect(rulesIn('يَدْخُلُونَ ۖ إِلَّا')).toContain('qalqalah-kubra');
  });
});

describe('letter idghams', () => {
  it('mutamathilayn merges identical letters across words', () => {
    expect(rulesIn('أَنِ اضْرِب بِّعَصَاكَ الْبَحْرَ')).toContain('idgham-mutamathil');
  });
  it('mutajanisayn merges same-makhraj pairs', () => {
    expect(rulesIn('قَدْ تَّبَيَّنَ الرُّشْدُ')).toContain('idgham-mutajanis');
    expect(rulesIn('قَدْ تَّبَيَّنَ الرُّشْدُ').has('qalqalah')).toBe(false);
  });
  it('mutaqaribayn merges neighbour pairs', () => {
    expect(rulesIn('وَقُل رَّبِّ زِدْنِي عِلْمًا')).toContain('idgham-mutaqarib');
  });
});

describe('lam rules', () => {
  it('shamsi and qamari', () => {
    expect(rulesIn('وَالشَّمْسِ')).toContain('lam-shamsi');
    expect(rulesIn('وَالْقَمَرِ')).toContain('lam-qamari');
  });
  it('the Name of Allah is never an article lam', () => {
    expect(rulesIn('قُلْ هُوَ اللَّهُ أَحَدٌ').has('lam-shamsi')).toBe(false);
    expect(rulesIn('قُلْ هُوَ اللَّهُ أَحَدٌ').has('lam-qamari')).toBe(false);
  });
  it('lam of Allah: heavy after fatha/damma, light after kasra', () => {
    expect(rulesIn('شَهِدَ اللَّهُ')).toContain('lam-allah-tafkhim');
    expect(rulesIn('بِسْمِ اللَّهِ')).toContain('lam-allah-tarqeeq');
    expect(rulesIn('لِلَّهِ مَا فِي السَّمَاوَاتِ')).toContain('lam-allah-tarqeeq');
  });
});

describe('ra rules', () => {
  it('vowelled ra', () => {
    expect(rulesIn('الرَّحْمَٰنِ')).toContain('ra-tafkhim');
    expect(rulesIn('رِحْلَةَ الشِّتَاءِ')).toContain('ra-tarqeeq');
    expect(rulesIn('رَبِّ الْعَالَمِينَ').has('ra-tarqeeq')).toBe(false);
  });
  it('saakin ra after kasra is light, unless an isti’la letter follows', () => {
    expect(rulesIn('فِرْعَوْنَ')).toContain('ra-tarqeeq');
    expect(rulesIn('مِرْصَادًا')).toContain('ra-tafkhim');
  });
  it('saakin ra after a ya sakinah is light', () => {
    expect(rulesIn('خَيْرٌ')).toContain('ra-tarqeeq');
  });
});

describe('madd family', () => {
  it('tabee’i only on true madd letters, never on the silent article alif', () => {
    expect(rulesIn('قَالَ')).toContain('madd');
    expect(countByRule(analyzeTajweed('تَبَارَكَ اللَّهُ'))['madd'] ?? 0).toBe(1);
    expect(rulesIn('مِنَ النَّاسِ').has('madd')).toBe(false);
  });
  it('badal after a hamza, incl. combined آ', () => {
    expect(rulesIn('وَمَا أُوتِيَ النَّبِيُّونَ')).toContain('madd-badal');
    expect(rulesIn('آمَنُوا')).toContain('madd-badal');
  });
  it('wajib when the hamza is in the same word', () => {
    expect(rulesIn('إِذَا جَاءَ نَصْرُ اللَّهِ')).toContain('madd-wajib');
    expect(rulesIn('السَّمَاءَ')).toContain('madd-wajib');
  });
  it('jaiz across a word boundary, even with the silent plural alif', () => {
    expect(rulesIn('يَا أَيُّهَا النَّاسُ')).toContain('madd-jaiz');
    expect(rulesIn('قَالُوا آمَنَّا')).toContain('madd-jaiz');
  });
  it('jaiz never fires into the Name of Allah (hamzat al-wasl)', () => {
    expect(rulesIn('قُلْ هُوَ اللَّهُ أَحَدٌ').has('madd-jaiz')).toBe(false);
  });
  it('lazim before a shaddah/sukun in the same word', () => {
    expect(rulesIn('وَلَا الضَّالِّينَ')).toContain('madd-lazim');
    expect(rulesIn('وَمَا مِن دَابَّةٍ')).toContain('madd-lazim');
    expect(rulesIn('الَّذِينَ').has('madd-lazim')).toBe(false);
  });
  it('arid when the madd sits before the final voweled letter', () => {
    expect(rulesIn('وَإِيَّاكَ نَسْتَعِينُ')).toContain('madd-arrid');
  });
  it('leen on a saakin و/ي after fatha in the final word', () => {
    expect(rulesIn('مِنْ خَوْفٍ')).toContain('madd-leen');
    expect(rulesIn('لِإِيلَافِ قُرَيْشٍ').has('madd-leen')).toBe(false);
  });
  it('silah sughra between voweled letters, kubra before hamza', () => {
    expect(rulesIn('لَهُ مَا فِي السَّمَاوَاتِ')).toContain('madd-silah-sughra');
    expect(rulesIn('وَلَا تَنفَعُ الشَّفَاعَةُ عِندَهُ إِلَّا لِمَنْ أَذِنَ لَهُ')).toContain('madd-silah-kubra');
  });
  it('no silah after a saakin letter (فِيهِ)', () => {
    expect(rulesIn('فِيهِ شِفَاءٌ').has('madd-silah-sughra')).toBe(false);
  });
});

describe('hamza & waqf & integrity', () => {
  it('hamzat al-wasl is marked', () => {
    expect(rulesIn('ٱقْرَأْ بِاسْمِ رَبِّكَ')).toContain('hamza-wasl');
  });
  it('waqf signs are detected', () => {
    expect(rulesIn('لَا رَيْبَ ۛ فِيهِ')).toContain('waqf');
  });
  it('reconstructs the exact input', () => {
    const input = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ';
    expect(analyzeTajweed(input).map((s) => s.text).join('')).toBe(input);
  });
  it('all 31 rules are detectable in canonical examples', () => {
    const all = new Set<TajweedRuleId>();
    [
      'مِنْ خَوْفٍ', 'مِنْ قَبْلُ', 'فَمَنْ يَعْمَلْ', 'مِنْ رَّبِّهِمْ', 'مِنْ بَعْدِ',
      'تَرْمِيهِم بِحِجَارَةٍ', 'فِي قُلُوبِهِم مَّرَضٌ', 'هُمْ نَائِمُونَ', 'إِنَّ',
      'يَقْطَعُونَ', 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      'أَنِ اضْرِب بِّعَصَاكَ', 'قَدْ تَّبَيَّنَ الرُّشْدُ', 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
      'وَالشَّمْسِ', 'وَالْقَمَرِ', 'شَهِدَ اللَّهُ', 'بِسْمِ اللَّهِ',
      'الرَّحْمَٰنِ', 'رِحْلَةَ الشِّتَاءِ',
      'قَالَ', 'وَمَا أُوتِيَ', 'إِذَا جَاءَ', 'يَا أَيُّهَا', 'وَلَا الضَّالِّينَ',
      'وَإِيَّاكَ نَسْتَعِينُ', 'مِنْ خَوْفٍ', 'لَهُ مَا فِي السَّمَاوَاتِ',
      'عِندَهُ إِلَّا', 'ٱقْرَأْ', 'لَا رَيْبَ ۛ فِيهِ',
    ].forEach((t) => analyzeTajweed(t).forEach((s) => { if (s.rule) all.add(s.rule); }));
    expect(all.size).toBe(RULE_ORDER.length);
  });
  it('handles empty and non-Arabic input gracefully', () => {
    expect(analyzeTajweed('')).toEqual([]);
    expect(rulesIn('hello')).size.toBe(0);
  });
});
