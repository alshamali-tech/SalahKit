/**
 * End-to-end tajweed suite — Minhāj al-Dārisīn (Damra & Damra, 6th ed.)
 * organized in three reasoning patterns:
 *
 *  • CHAIN OF THOUGHT — rule by rule: each test walks the reasoning
 *    chain (letter → diacritic → neighbour → condition → outcome) on
 *    the book's own authentic examples.
 *  • TREE OF THOUGHT — decision branches: one input family, many
 *    outcomes, exactly like the noon tree a student draws.
 *  • GRAPH OF THOUGHT — whole-ayah golden maps: real verses in, the
 *    complete ordered rule assignment out (regression anchors).
 */
import { describe, expect, it } from 'vitest';
import { analyzeTajweed } from '../../src/lib/core/tajweed';
import type { TajweedRuleId } from '../../src/lib/core/tajweed';

/** Rules present in the analyzed text. */
function rulesIn(text: string): Set<TajweedRuleId> {
  return new Set(
    analyzeTajweed(text)
      .filter((s) => s.rule)
      .map((s) => s.rule as TajweedRuleId)
  );
}

/** Ordered list of rules assigned across the ayah (marked letters only). */
function ruleSequence(text: string): TajweedRuleId[] {
  return analyzeTajweed(text)
    .filter((s) => s.rule)
    .map((s) => s.rule as TajweedRuleId);
}

/* ────────────────────────────────────────────────────────────────── *
 *  CHAIN OF THOUGHT — one reasoning chain per rule                   *
 * ────────────────────────────────────────────────────────────────── */

describe('CoT · noon sakinah & tanween (Ch. 2)', () => {
  it('izhaar — upper rank: the noon meets ء or ه (furthest throat)', () => {
    // مَـنْ + آمَنَ: noon saakin → next letter أ (throat) → clear, no ghunna.
    expect(rulesIn('مَنْ آمَنَ')).toContain('izhaar');
    // مِنْ + هَادٍ: ه is deep-throat → clear.
    expect(rulesIn('مِنْ هَادٍ')).toContain('izhaar');
  });
  it('izhaar — middle rank: ع or ح (mid-throat)', () => {
    expect(rulesIn('مِنْ عِلْمٍ')).toContain('izhaar');
    expect(rulesIn('مِنْ حَكِيمٍ')).toContain('izhaar');
  });
  it('izhaar — lower rank: غ or خ (nearest throat)', () => {
    expect(rulesIn('مِنْ غِلٍّ')).toContain('izhaar');
    expect(rulesIn('مِنْ خَيْرٍ')).toContain('izhaar');
  });
  it('iqlaab — the noon flips to a hidden meem before ب', () => {
    // مِنْ + بَعْدِ: only ب triggers iqlaab; ghunna of 2 counts.
    expect(rulesIn('مِنْ بَعْدِ')).toContain('iqlaab');
    // Tanween follows the same rule: سَمِيعٌ + بَصِيرٌ.
    expect(rulesIn('سَمِيعٌ بَصِيرٌ')).toContain('iqlaab');
  });
  it('ikhfaa — the noon hides before the 15 remaining letters', () => {
    expect(rulesIn('مِنْ قَبْلُ')).toContain('ikhfaa');
    expect(rulesIn('أَنْتُمْ')).toContain('ikhfaa');
    expect(rulesIn('عَيْنٌ جَارِيَةٌ')).toContain('ikhfaa');
  });
  it('the noon and tanween are distinct: tanween drops in writing & waqf', () => {
    // Both share the four rules; the engine treats a bare final noon
    // (tanween) exactly like noon saakinah when a word follows.
    expect(rulesIn('سَمِيعٌ عَلِيمٌ')).toContain('izhaar');
  });
});

describe('CoT · meem sakinah & ghunna (Ch. 3)', () => {
  it('idgham shafawi — meem melts into a following meem', () => {
    // لَهُمْ + مَا: مْ + م → one shaddah-ed meem with ghunna.
    expect(rulesIn('لَهُمْ مَّا يَشَاءُونَ')).toContain('meem-idgham');
  });
  it('ikhfaa shafawi — meem hides before ب only', () => {
    expect(rulesIn('تَرْمِيهِم بِحِجَارَةٍ')).toContain('meem-ikhfaa');
  });
  it('izhar shafawi — meem is clear before all but م and ب', () => {
    // هُمْ + نَائِمُونَ: before ن → clear (beware of hiding before و/ف).
    expect(rulesIn('هُمْ نَائِمُونَ')).toContain('izhaar-shafawi');
    expect(rulesIn('أَلَمْ تَرَ')).toContain('izhaar-shafawi');
  });
  it('a voweled meem is never a meem sakinah', () => {
    expect(rulesIn('عَلَيْهِمُ الذِّلَّةُ').has('meem-ikhfaa')).toBe(false);
    expect(rulesIn('عَلَيْهِمُ الذِّلَّةُ').has('izhaar-shafawi')).toBe(false);
  });
  it('ghunna — shaddah-ed noon or meem hums for 2 counts', () => {
    expect(rulesIn('إِنَّ')).toContain('ghunna');
    expect(rulesIn('مِنَ الْجِنَّةِ')).toContain('ghunna');
    expect(rulesIn('ثُمَّ')).toContain('ghunna');
    expect(rulesIn('عَمَّ')).toContain('ghunna');
  });
});

describe('CoT · madd family (Ch. 4)', () => {
  it('tabee‘i — the madd letter with its matching vowel, 2 counts', () => {
    expect(rulesIn('قَالَ')).toContain('madd');
    expect(rulesIn('يَقُولُ')).toContain('madd');
    expect(rulesIn('قِيلَ')).toContain('madd');
  });
  it('wajib muttasil — hamza after the madd in ONE word, 4–5', () => {
    expect(rulesIn('جَاءَ')).toContain('madd-wajib');
    expect(rulesIn('السَّمَاءِ')).toContain('madd-wajib');
  });
  it('jaiz munfasil — the hamza opens the NEXT word, 2–5', () => {
    expect(rulesIn('يَا أَيُّهَا')).toContain('madd-jaiz');
    expect(rulesIn('فِي أُمِّهَا')).toContain('madd-jaiz');
  });
  it('badal — the madd letter REPLACES a second hamza, 2 counts', () => {
    expect(rulesIn('آمَنَ')).toContain('madd-badal');
    expect(rulesIn('إِيمَانٌ')).toContain('madd-badal');
    expect(rulesIn('أُوتُوا')).toContain('madd-badal');
  });
  it('lazim kalimi — original sukun/shaddah after the madd, 6 counts', () => {
    expect(rulesIn('وَلَا الضَّالِّينَ')).toContain('madd-lazim');
    expect(rulesIn('وَمَا مِن دَابَّةٍ')).toContain('madd-lazim');
  });
  it('lazim harfi — the ٓ-marked fawatih letters, 6 counts', () => {
    expect(rulesIn('الٓمٓ')).toContain('madd-lazim');
    expect(rulesIn('مٓ')).toContain('madd-lazim');
    expect(rulesIn('نٓ')).toContain('madd-lazim');
    expect(rulesIn('قٓ')).toContain('madd-lazim');
    expect(rulesIn('صٓ')).toContain('madd-lazim');
  });
  it('the silent article alif never takes a madd rule', () => {
    // Only the ا of تَبَارَكَ is a madd — not the alif of اللَّهُ.
    const counts = ruleSequence('تَبَارَكَ اللَّهُ').filter((r) => r === 'madd');
    expect(counts.length).toBe(1);
    expect(rulesIn('مِنَ النَّاسِ').has('madd-lazim')).toBe(false);
  });
  it('‘arid — stopping turns the last vowel to sukun, 2–4–6', () => {
    expect(rulesIn('إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ')).toContain('madd-arrid');
  });
  it('leen — saakin و/ي after fatha when stopping, 2–4–6', () => {
    expect(rulesIn('مِنْ خَوْفٍ')).toContain('madd-leen');
    expect(rulesIn('لِإِيلَافِ قُرَيْشٍ')).toContain('madd-leen');
  });
});

describe('CoT · lam, ra & the Name of Allah (Ch. 6, 8, 10)', () => {
  it('lam of Allah — light after kasra, heavy after fatha/damma', () => {
    // بِسْمِ: the kasra on م (before the article alif) → tarqiq.
    expect(rulesIn('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')).toContain('lam-allah-tarqeeq');
    expect(rulesIn('لِلَّهِ مَا فِي السَّمَاوَاتِ')).toContain('lam-allah-tarqeeq');
    // شَهِدَ: fatha on د → tafkhim.
    expect(rulesIn('شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ')).toContain('lam-allah-tafkhim');
    // هُوَ: fatha on و → tafkhim.
    expect(rulesIn('قُلْ هُوَ اللَّهُ أَحَدٌ')).toContain('lam-allah-tafkhim');
  });
  it('lam shamsiyyah — the article lam assimilates (14 sun letters)', () => {
    expect(rulesIn('وَالشَّمْسِ وَضُحَاهَا')).toContain('lam-shamsi');
    expect(rulesIn('الرَّحْمَٰنِ')).toContain('lam-shamsi');
  });
  it('lam qamariyyah — the article lam is clear (14 moon letters)', () => {
    expect(rulesIn('وَالْقَمَرِ')).toContain('lam-qamari');
    expect(rulesIn('الْحَمْدُ')).toContain('lam-qamari');
  });
  it('ra — voweled: fatha/damma heavy, kasra light', () => {
    expect(rulesIn('رُزِقُوا')).toContain('ra-tafkhim');
    expect(rulesIn('رَبِّهِمْ')).toContain('ra-tafkhim');
    expect(rulesIn('رِزْقٌ')).toContain('ra-tarqeeq');
  });
  it('ra saakinah — after kasra light, unless an isti‘la letter follows', () => {
    expect(rulesIn('فِرْعَوْنَ')).toContain('ra-tarqeeq');
    expect(rulesIn('مِرْصَادًا')).toContain('ra-tafkhim');
    expect(rulesIn('قِرْطَاسٍ')).toContain('ra-tafkhim');
  });
  it('ra saakinah after a ya sakinah is light', () => {
    expect(rulesIn('خَيْرٌ')).toContain('ra-tarqeeq');
    expect(rulesIn('بَصِيرٍ')).toContain('ra-tarqeeq');
  });
});

describe('CoT · hamza, sakt & waqf (Ch. 8, 9, 11)', () => {
  it('hamzat al-wasl is marked', () => {
    expect(rulesIn('ٱقْرَأْ بِاسْمِ رَبِّكَ')).toContain('hamza-wasl');
  });
  it('mu‘anaqah — the embracing pair ۛ ۛ is detected', () => {
    expect(rulesIn('لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ')).toContain('waqf');
  });
  it('a qalqalah letter before a sakt sign ۜ bounces at that stop', () => {
    // يَدْخُلُونَ ۜ — the د stops at the sakt → wusta.
    expect(rulesIn('يَدْخُلُونَ ۜ إِلَّا')).toContain('qalqalah-wusta');
  });
});

/* ────────────────────────────────────────────────────────────────── *
 *  TREE OF THOUGHT — one input family, all branches                  *
 * ────────────────────────────────────────────────────────────────── */

describe('ToT · the noon tree — same noon, five fates', () => {
  const branches: [string, TajweedRuleId][] = [
    ['مَنْ آمَنَ', 'izhaar'],
    ['مِنْ هَادٍ', 'izhaar'],
    ['مِنْ عِلْمٍ', 'izhaar'],
    ['مِنْ غِلٍّ', 'izhaar'],
    ['مِنْ خَيْرٍ', 'izhaar'],
    ['مِن بَعْدِ', 'iqlaab'],
    ['مِن نَّعِيمٍ', 'idghaam-ghunna'],
    ['مِن مَّاءٍ', 'idghaam-ghunna'],
    ['مِن وَاقٍ', 'idghaam-ghunna'],
    ['مَن يَّعْمَلْ', 'idghaam-ghunna'],
    ['مِن رَّبِّهِمْ', 'idghaam-bila-ghunna'],
    ['مِن لَّدُنْهُ', 'idghaam-bila-ghunna'],
    ['مِنْ قَبْلُ', 'ikhfaa'],
    ['مِن تَحْتِهَا', 'ikhfaa'],
    ['أَنْكَرَ', 'ikhfaa'],
  ];
  for (const [text, expected] of branches) {
    it(`${text} → ${expected}`, () => {
      expect(rulesIn(text)).toContain(expected);
    });
  }
  it('same-word exception: idgham letters inside one word → clear (izhar mutlaq)', () => {
    expect(rulesIn('الدُّنْيَا').has('idghaam-ghunna')).toBe(false);
    expect(rulesIn('بُنْيَانٌ').has('idghaam-ghunna')).toBe(false);
    expect(rulesIn('صِنْوَانٌ').has('idghaam-ghunna')).toBe(false);
    expect(rulesIn('قِنْوَانٌ').has('idghaam-ghunna')).toBe(false);
    // …while same-word ikhfaa is real.
    expect(rulesIn('عِنْدَ')).toContain('ikhfaa');
    expect(rulesIn('مِنكُمْ')).toContain('ikhfaa');
  });
});

describe('ToT · the qalqalah tree — same letter, four contexts', () => {
  const branches: [string, TajweedRuleId | null][] = [
    ['شَقَقْنَا', 'qalqalah'],          // mid-word sakin
    ['أَطْعَمَهُمْ', 'qalqalah'],        // mid-word sakin
    ['قَدْ سَمِعَ اللَّهُ', 'qalqalah'], // word-end, CONTINUING
    ['سَبَّحَ لِلَّهِ', 'qalqalah'],     // shaddah mid-word, continuing
    ['الْفَلَقِ', 'qalqalah-wusta'],     // stopped on, no shaddah
    ['لَقَدْ', 'qalqalah-wusta'],        // stopped on, no shaddah
    ['الْحَقِّ', 'qalqalah-kubra'],      // stopped on, mushaddad
    ['وَتَبَّ', 'qalqalah-kubra'],       // stopped on, mushaddad
    ['قَدَرُ', null],                    // voweled — never bounces
  ];
  for (const [text, expected] of branches) {
    it(`${text} → ${expected ?? 'no qalqalah'}`, () => {
      const ranks = ['qalqalah', 'qalqalah-wusta', 'qalqalah-kubra'] as const;
      const got = ranks.filter((r) => rulesIn(text).has(r));
      if (expected === null) expect(got).toEqual([]);
      else {
        expect(got).toContain(expected);
        expect(got.length).toBe(1);
      }
    });
  }
});

describe('ToT · the madd tree — same madd letter, every context', () => {
  const branches: [string, TajweedRuleId][] = [
    ['قَالَ', 'madd'],
    ['جَاءَ', 'madd-wajib'],
    ['يَا أَيُّهَا', 'madd-jaiz'],
    ['آمَنَ', 'madd-badal'],
    ['دَابَّةٍ', 'madd-lazim'],
    ['الٓمٓ', 'madd-lazim'],
    ['خَوْفٍ', 'madd-leen'],
  ];
  for (const [text, expected] of branches) {
    it(`${text} → ${expected}`, () => {
      expect(rulesIn(text)).toContain(expected);
    });
  }
});

/* ────────────────────────────────────────────────────────────────── *
 *  GRAPH OF THOUGHT — golden whole-ayah rule maps                    *
 * ────────────────────────────────────────────────────────────────── */

describe('GoT · golden ayah maps (regression anchors)', () => {
  const goldens: [string, TajweedRuleId[]][] = [
    // Minhaj Ch.2 — izhaar (lower rank) + leen on the final و.
    ['مِنْ خَوْفٍ', ['izhaar', 'madd-leen']],
    // Ch.2 — iqlaab before ب.
    ['مِنْ بَعْدِ', ['iqlaab']],
    // Ch.2 — idgham bila ghunna + heavy ra.
    ['مِنْ رَّبِّهِمْ', ['idghaam-bila-ghunna', 'ra-tafkhim']],
    // Ch.2 — idgham with ghunna; the merged نّ hums.
    ['مِن نَّعِيمٍ', ['idghaam-ghunna', 'ghunna']],
    // Ch.8/11 — qamari lam + wusta qalqalah on the final stopped ق.
    ['قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', ['lam-qamari', 'qalqalah-wusta']],
    // Ch.6 — lam of Allah heavy (fatha on و) + wusta on stopped د.
    ['قُلْ هُوَ اللَّهُ أَحَدٌ', ['lam-allah-tafkhim', 'qalqalah-wusta']],
    // Ch.6 — the full basmala: light lam of Allah, two shamsi lams (ر is a
    // sun letter), heavy ras, and the dagger-alif madd of الرَّحْمَٰنِ.
    [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      ['lam-allah-tarqeeq', 'lam-shamsi', 'ra-tafkhim', 'madd', 'lam-shamsi', 'ra-tafkhim'],
    ],
    // Ch.4 — badal (آ) + tabee‘i (the و of ـنُوا).
    ['آمَنُوا', ['madd-badal', 'madd']],
    // Ch.4 — jaiz + shamsi + ghunna + ‘arid on the final ا.
    ['يَا أَيُّهَا النَّاسُ', ['madd-jaiz', 'lam-shamsi', 'ghunna', 'madd-arrid']],
    // Ch.4 — ikhfaa, lazim muthaqqal, ghunna, tanween-ikhfaa, qamari, heavy ra.
    [
      'وَمَا مِن دَابَّةٍ فِي الْأَرْضِ',
      ['ikhfaa', 'madd-lazim', 'ghunna', 'ikhfaa', 'lam-qamari', 'ra-tafkhim'],
    ],
    // Ch.4 — the fawatih: both ٓ-marked letters are lazim harfi.
    ['الٓمٓ', ['madd-lazim', 'madd-lazim']],
    // Ch.11 — sughra mid-flow + lam of Allah heavy.
    ['قَدْ سَمِعَ اللَّهُ', ['qalqalah', 'lam-allah-tafkhim']],
    // Ch.11 — sughra, tabee‘i ya, tanween idgham, kubra on the stopped بّ.
    [
      'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
      ['qalqalah', 'madd', 'idghaam-ghunna', 'qalqalah-kubra'],
    ],
    // Ch.4 — jaiz + ghunna; no silah inside the word.
    ['فِي أُمِّهَا', ['madd-jaiz', 'ghunna']],
    // Ch.8 — shamsi + izhar shafawi + tabee‘i on the final ا.
    ['وَالشَّمْسِ وَضُحَاهَا', ['lam-shamsi', 'izhaar-shafawi', 'madd']],
    // Ch.4 — two tabee‘i madds + heavy ra + leen on the final ي.
    ['لِإِيلَافِ قُرَيْشٍ', ['madd', 'madd', 'ra-tafkhim', 'madd-leen']],
  ];

  for (const [ayah, expected] of goldens) {
    it(`maps ${ayah}`, () => {
      expect(ruleSequence(ayah)).toEqual(expected);
    });
  }

  it('reconstructs every golden ayah byte-for-byte', () => {
    for (const [ayah] of goldens) {
      expect(analyzeTajweed(ayah).map((s) => s.text).join('')).toBe(ayah);
    }
  });
});
