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
  /** Ayah text (Uthmani) for engine annotation + rendering. */
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
    why: 'The bare noon of مَن (Uthmani writes no sukun — the bare noon IS saakin) flows into the ي of يَقُولُ across the word boundary, humming as it merges.',
  },
  {
    rule: 'idghaam-bila-ghunna', label: 'Idghaam, clean', surah: 2, ayahNum: 2,
    ayah: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    why: 'The tanween of هُدًى merges into the ل with no hum. Note the tanween targets the first letter of the NEXT word — not the written ى. The paired ۛ are mu’anaqah: stop at one, never both.',
  },
  {
    rule: 'iqlaab', label: 'Iqlaab — noon flips to meem', surah: 2, ayahNum: 181,
    ayah: 'فَمَن بَدَّلَهُ بَعْدَمَا سَمِعَهُ فَإِنَّمَا إِثْمُهُ عَلَى الَّذِينَ يُبَدِّلُونَهُ ۗ إِنَّ اللَّهَ سَمِيعٌ عَلِيمٌ',
    why: 'The bare noon of فَمَن meets ب — it flips into a hidden meem with ghunna. The ayah ends سَمِيعٌ عَلِيمٌ: tanween before the throat letter ع, read clear (izhaar).',
  },
  {
    rule: 'ghunna', label: 'Ghunna — shaddah hum', surah: 108, ayahNum: 1,
    ayah: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
    why: 'The shaddah on the noon of إِنَّا means two noons merged — hold the nasal hum for two full counts.',
  },
  {
    rule: 'meem-idgham', label: 'Idghaam shafawi', surah: 2, ayahNum: 10,
    ayah: 'فِي قُلُوبِهِمْ مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا',
    why: 'The saakin meem of قُلُوبِهِمْ melts into the meem of مَّرَضٌ on the lips, with a two-count ghunna. (Note: كَعَصْفٍ مَّأْكُولٍ is a tanween before meem — that is idghaam with ghunna, not shafawi.)',
  },
  {
    rule: 'meem-ikhfaa', label: 'Ikhfaa shafawi', surah: 105, ayahNum: 4,
    ayah: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ',
    why: 'The saakin meem of تَرْمِيهِم hides on the lips before ب, lightly humming. (A plural-pronoun meem like عَلَيْهِمْ is voweled in flow — not a meem sakinah.)',
  },
  {
    rule: 'qalqalah', label: 'Qalqalah sughra — light bounce', surah: 9, ayahNum: 121,
    ayah: 'وَلَا يَقْطَعُونَ وَادِيًا إِلَّا كُتِبَ لَهُمْ',
    why: 'The ق of يَقْطَعُونَ is saakin in the middle of the word, so it bounces lightly (sughra) — a quick echo, not a full stop.',
  },
  {
    rule: 'qalqalah-kubra', label: 'Qalqalah kubra — strong bounce', surah: 95, ayahNum: 4,
    ayah: 'لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ',
    why: 'لَقَدْ carries both bounces: the mid-word ق is sughra (light), while the د ends its word with a written sukun — the canonical kubra position, echoed strongly when you pause.',
  },
  {
    rule: 'lam-shamsi', label: 'Lam shamsiyyah — assimilated', surah: 91, ayahNum: 1,
    ayah: 'وَالشَّمْسِ وَضُحَاهَا',
    why: 'The article lam before ش (a sun letter) is not pronounced — it dissolves into the shaddah on the ش. You say “wash-shamsi”, not “wal-shamsi”.',
  },
  {
    rule: 'lam-qamari', label: 'Lam qamariyyah — clear lam', surah: 91, ayahNum: 2,
    ayah: 'وَالْقَمَرِ إِذَا تَلَاهَا',
    why: 'The article lam before ق (a moon letter) is pronounced clearly — “wal-qamari”. The lam keeps its own sound.',
  },
  {
    rule: 'ra-tafkhim', label: 'Ra tafkhim — heavy ra', surah: 1, ayahNum: 1,
    ayah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    why: 'The ر of الرَّحْمَٰنِ carries a fatha, so it is pronounced heavy, with the back of the mouth raised (tafkhim).',
  },
  {
    rule: 'ra-tarqeeq', label: 'Ra tarqeeq — light ra', surah: 106, ayahNum: 2,
    ayah: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
    why: 'The ر of رِحْلَةَ carries a kasra directly, so it thins out and is pronounced light (tarqeeq). Contrast it with the ف of the same word, which stays heavy.',
  },
  {
    rule: 'madd', label: 'Madd tabee’i — 2 counts', surah: 1, ayahNum: 2,
    ayah: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    why: 'The alif of الْعَا and the ya of ـمِينَ each follow their matching vowel: a calm two-count stretch, the baseline of all elongation.',
  },
  {
    rule: 'madd-badal', label: 'Madd badal — after a hamza', surah: 2, ayahNum: 136,
    ayah: 'وَمَا أُوتِيَ النَّبِيُّونَ مِن رَّبِّهِمْ',
    why: 'The hamza of أُوتِيَ is immediately followed by the saakin و — a madd badal, stretched two counts. The hamza “replaced” an original madd letter.',
  },
  {
    rule: 'madd-wajib', label: 'Madd wajib muttasil — 4–5 counts', surah: 110, ayahNum: 1,
    ayah: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
    why: 'In جَاءَ the madd letter and the hamzah sit in the SAME word, so the stretch is obligatory — four or five counts, never two.',
  },
  {
    rule: 'madd-jaiz', label: 'Madd jaiz munfasil — 2–5 counts', surah: 2, ayahNum: 21,
    ayah: 'يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ',
    why: 'The alif ending يَا is followed by a new word (أَيُّهَا) beginning with hamza. The stretch crosses the word boundary — permitted from two up to five counts.',
  },
  {
    rule: 'madd-lazim', label: 'Madd lazim — 6 counts', surah: 6, ayahNum: 38,
    ayah: 'وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا أُمَمٌ أَمْثَالُكُمْ',
    why: 'In دَابَّةٍ the madd alif is followed by a shaddah-ed ب inside the same word — madd lazim muthaqqal, the longest and compulsory stretch: a full six counts. (The same rule marks الضَّالِّينَ in al-Fatiha.)',
  },
  {
    rule: 'waqf', label: 'Waqf — stopping signs', surah: 2, ayahNum: 2,
    ayah: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    why: 'The two ۛ (mu’anaqah, “the embracing pair”) mean: pause at one of them — stopping at both, or at neither, breaks the meaning of “no doubt in it”.',
  },
];

/** Short preset list for the Live Lab (rule + real text). */
export const LAB_PRESETS: readonly { label: string; rule: TajweedRuleId; ayah: string }[] = [
  { label: '2:25 — ikhfaa in مِن تَحْتِهَا', rule: 'ikhfaa', ayah: RULE_EXAMPLES[1].ayah },
  { label: '91:1 — lam shamsiyyah (sun)', rule: 'lam-shamsi', ayah: RULE_EXAMPLES[10].ayah },
  { label: '91:2 — lam qamariyyah (moon)', rule: 'lam-qamari', ayah: RULE_EXAMPLES[11].ayah },
  { label: '1:1 — heavy ra (tafkhim)', rule: 'ra-tafkhim', ayah: RULE_EXAMPLES[12].ayah },
  { label: '110:1 — wajib madd in جَاءَ', rule: 'madd-wajib', ayah: RULE_EXAMPLES[16].ayah },
  { label: '1:7 — six-count lazim madd', rule: 'madd-lazim', ayah: RULE_EXAMPLES[18].ayah },
  { label: '2:2 — idghaam + waqf pair', rule: 'idghaam-bila-ghunna', ayah: RULE_EXAMPLES[3].ayah },
  { label: '23:1 — qalqalah kubra on قَدْ', rule: 'qalqalah-kubra', ayah: RULE_EXAMPLES[9].ayah },
];
