/**
 * Canonical, real-world examples for every tajweed rule (pure data).
 * Each entry pairs a genuine Quran ayah with the reason a reciter
 * applies that rule there — and the UI verifies live that the engine
 * actually detects the rule in this exact text.
 */
import type { TajweedRuleId } from './tajweed';

/** One verified rule example. */
export interface RuleExample {
  /** The rule this ayah demonstrates. */
  rule: TajweedRuleId;
  /** Short display label. */
  label: string;
  /** Full ayah text (Uthmani) for engine annotation + rendering. */
  ayah: string;
  /** Surah number (for audio). */
  surah: number;
  /** Ayah number (for audio). */
  ayahNum: number;
  /** Real-life explanation of WHY the rule applies here. */
  why: string;
}

/** One example per rule — the verification suite the UI displays. */
export const RULE_EXAMPLES: readonly RuleExample[] = [
  {
    rule: 'ghunna', label: 'Ghunna — shaddah hum', surah: 108, ayahNum: 1,
    ayah: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
    why: 'The shaddah on the noon of إِنَّا means two noons merged — hold the nasal hum for two counts.',
  },
  {
    rule: 'izhaar', label: 'Izhaar — clear noon', surah: 106, ayahNum: 4,
    ayah: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ',
    why: 'مِنْ before the throat letter خ keeps the noon crisp and clear — no hum, no merge. This ayah also carries idghaam shafawi (مَّ) and ikhfaa (مِّن جُوعٍ).',
  },
  {
    rule: 'ikhfaa', label: 'Ikhfaa — hidden noon', surah: 2, ayahNum: 25,
    ayah: 'وَبَشِّرِ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أَنَّ لَهُمْ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ',
    why: 'مِنْ before ت (one of the 15 ikhfaa letters): the noon is hidden between clear and merged, with a two-count hum through the nose.',
  },
  {
    rule: 'idghaam-ghunna', label: 'Idghaam with hum', surah: 2, ayahNum: 8,
    ayah: 'وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ',
    why: 'The bare noon of مَن (Uthmani writes no sukun here — the bare noon IS saakin) flows into the ي of يَقُولُ across the word boundary, humming as it merges.',
  },
  {
    rule: 'idghaam-bila-ghunna', label: 'Idghaam, clean', surah: 2, ayahNum: 2,
    ayah: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    why: 'The tanween of هُدًى merges into the ل with no hum. Note the tanween targets the first letter of the NEXT word — not the written ى of هُدًى. The paired ۛ are mu’anaqah: stop at one, never both.',
  },
  {
    rule: 'iqlaab', label: 'Iqlaab — noon flips to meem', surah: 2, ayahNum: 181,
    ayah: 'فَمَن بَدَّلَهُ بَعْدَمَا سَمِعَهُ فَإِنَّمَا إِثْمُهُ عَلَى الَّذِينَ يُبَدِّلُونَهُ ۗ إِنَّ اللَّهَ سَمِيعٌ عَلِيمٌ',
    why: 'The bare noon of فَمَن meets ب — it flips into a hidden meem with ghunna (fam-м-baddalahu). The ayah ends with سَمِيعٌ عَلِيمٌ: tanween before ع, a throat letter, read clear (izhaar).',
  },
  {
    rule: 'meem-idgham', label: 'Idghaam shafawi', surah: 105, ayahNum: 5,
    ayah: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ',
    why: 'The saakin meem of كَعَصْفٍ melts into the meem of مَّأْكُولٍ on the lips, with a two-count ghunna.',
  },
  {
    rule: 'meem-ikhfaa', label: 'Ikhfaa shafawi', surah: 105, ayahNum: 4,
    ayah: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ',
    why: 'The saakin meem of تَرْمِيهِم hides on the lips before ب, lightly humming. (The م of plural pronouns like عَلَيْهِمْ is voweled in flow and is NOT a meem sakinah.)',
  },
  {
    rule: 'qalqalah', label: 'Qalqalah — the bounce', surah: 113, ayahNum: 1,
    ayah: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    why: 'قُ لْ — the ساكن ق bounces lightly mid-word (sughra); at the stop of الْفَلَقِ the final ق bounces strongly (kubra).',
  },
  {
    rule: 'madd', label: 'Natural madd — 2 counts', surah: 1, ayahNum: 2,
    ayah: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    why: 'The alif of الْعَا and the ya of ـمِينَ each follow their matching vowel: a calm two-count stretch, the baseline of all elongation.',
  },
  {
    rule: 'madd-caused', label: 'Caused madd — 4–6 counts', surah: 1, ayahNum: 7,
    ayah: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    why: 'In الضَّالِّينَ a shaddah sits right after the madd letter — madd lazim, stretched six counts. جَاءَ (110:1) is the same family: the hamzah in the word forces 4–5 counts.',
  },
  {
    rule: 'waqf', label: 'Waqf — stopping signs', surah: 2, ayahNum: 2,
    ayah: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    why: 'The two ۛ (mu’anaqah, “the embracing pair”) mean: pause at one of them — stopping at both, or at neither, breaks the meaning of “no doubt in it”.',
  },
];

/** Short preset list for the Live Lab. */
export const LAB_PRESETS: readonly { label: string; rule: TajweedRuleId; ayah: string }[] = [
  { label: '2:25 — ikhfaa in مِن تَحْتِهَا', rule: 'ikhfaa', ayah: RULE_EXAMPLES[2].ayah },
  { label: '106:4 — izhaar, shafawi & ikhfaa', rule: 'izhaar', ayah: RULE_EXAMPLES[1].ayah },
  { label: '2:2 — idghaam + waqf pair', rule: 'idghaam-bila-ghunna', ayah: RULE_EXAMPLES[4].ayah },
  { label: '2:8 — bare noon idghaam', rule: 'idghaam-ghunna', ayah: RULE_EXAMPLES[3].ayah },
  { label: '1:7 — six-count madd', rule: 'madd-caused', ayah: RULE_EXAMPLES[10].ayah },
  { label: '113:1 — qalqalah bounce', rule: 'qalqalah', ayah: RULE_EXAMPLES[8].ayah },
];
