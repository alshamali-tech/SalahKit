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
    rule: 'meem-ikhfaa', label: 'Ikhfaa shafawi', surah: 105, ayahNum: 4,
    ayah: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ',
    why: 'The saakin meem of تَرْمِيهِم hides on the lips before ب, lightly humming. (A plural-pronoun meem like عَلَيْهِمُ is voweled in flow — not a meem sakinah.)',
  },
  {
    rule: 'meem-idgham', label: 'Idghaam shafawi', surah: 2, ayahNum: 10,
    ayah: 'فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا',
    why: 'The saakin meem of قُلُوبِهِمْ melts into the meem of مَّرَضٌ on the lips, with a two-count ghunna — the two meems become one emphasized meem.',
  },
  {
    rule: 'izhaar-shafawi', label: 'Izhaar shafawi', surah: 36, ayahNum: 52,
    ayah: 'هُمْ نَائِمُونَ',
    why: 'The saakin meem of هُمْ is followed by ن — neither ب nor م — so it is pronounced clearly, lips closing briefly. Take extra care before ف and و, whose makhraj sits close to the meem.',
  },
  {
    rule: 'ghunna', label: 'Ghunna — shaddah hum', surah: 108, ayahNum: 1,
    ayah: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
    why: 'The shaddah on the noon of إِنَّا means two noons merged — hold the nasal hum for two full counts.',
  },
  {
    rule: 'qalqalah', label: 'Qalqalah ṣughrā — weakest bounce', surah: 23, ayahNum: 1,
    ayah: 'قَدْ أَفْلَحَ الْمُؤْمِنُونَ',
    why: 'The د of قَدْ carries an ORIGINAL sukūn in the middle of speech and you keep reciting — so it gets only the light ṣughrā bounce. Same for a mid-word sukūn as in يَقْطَعُونَ.',
  },
  {
    rule: 'qalqalah-wusta', label: 'Qalqalah wusṭā — medium bounce', surah: 113, ayahNum: 1,
    ayah: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    why: 'You STOP on the final ق of الْفَلَقِ — the stopping itself makes it sākin. It has no shaddah, so the bounce is the medium wusṭā (as with أَحَدْ at the end of al-Ikhlāṣ). Note قُلْ earlier in the same ayah is only ṣughrā.',
  },
  {
    rule: 'qalqalah-kubra', label: 'Qalqalah kubrā — strongest bounce', surah: 111, ayahNum: 1,
    ayah: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
    why: 'You stop on وَتَبَّ, whose ب carries a SHADDAH. Two causes combine — the qalqalah ṣifah plus the sukūn of stopping — giving the strongest kubrā bounce (also الْحَقِّ when stopped upon).',
  },
  {
    rule: 'idgham-mutamathil', label: 'Idghaam mutamathilayn', surah: 26, ayahNum: 63,
    ayah: 'أَنِ اضْرِب بِّعَصَاكَ الْبَحْرَ',
    why: 'The saakin ب of اضْرِب meets another ب — identical letters merging. The shaddah on the second shows the merge; you say “idrib-bi’asaaka”.',
  },
  {
    rule: 'idgham-mutajanis', label: 'Idghaam mutajanisayn', surah: 2, ayahNum: 256,
    ayah: 'قَدْ تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ',
    why: 'The saakin د and the ت share one makhraj (tip of the tongue), so the د melts into the ت — “qat-tabayyana”, not “qad tabayyana”.',
  },
  {
    rule: 'idgham-mutaqarib', label: 'Idghaam mutaqaribayn', surah: 20, ayahNum: 114,
    ayah: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    why: 'The saakin ل of قُل and the ر sit at neighbouring makharij, so the ل merges into the ر. Same family as ق+ك in نَخْلُقكُّمْ and ب+م in ارْكَب مَّعَنَا.',
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
    rule: 'lam-allah-tafkhim', label: 'Lam of Allah — heavy', surah: 3, ayahNum: 18,
    ayah: 'شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ',
    why: 'The lam of the Name of Allah comes right after the fatha on د — so the Name is pronounced heavy, back of the tongue raised. After a damma too: رَسُولُ اللَّهِ.',
  },
  {
    rule: 'lam-allah-tarqeeq', label: 'Lam of Allah — light', surah: 1, ayahNum: 1,
    ayah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    why: 'The kasra on the م of بِسْمِ thins the lam of Allah — the Name is pronounced light (tarqeeq). Same after a ya sakinah.',
  },
  {
    rule: 'ra-tafkhim', label: 'Ra tafkhim — heavy ra', surah: 1, ayahNum: 1,
    ayah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    why: 'The ر of الرَّحْمَٰنِ carries a fatha, so it is pronounced heavy, with the back of the mouth raised (tafkhim).',
  },
  {
    rule: 'ra-tarqeeq', label: 'Ra tarqeeq — light ra', surah: 106, ayahNum: 2,
    ayah: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
    why: 'The ر of رِحْلَةَ carries a kasra directly, so it thins out and is pronounced light (tarqeeq). A saakin ر after kasra is light too — unless an isti’la letter follows (مِرْصَادًا is heavy).',
  },
  {
    rule: 'madd', label: 'Madd tabee’i — 2 counts', surah: 1, ayahNum: 2,
    ayah: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    why: 'The alif of الْعَا and the ya of ـمِينَ each follow their matching vowel: a calm two-count stretch, the baseline of all elongation.',
  },
  {
    rule: 'madd-badal', label: 'Madd badal — after a hamza', surah: 2, ayahNum: 136,
    ayah: 'وَمَا أُوتِيَ النَّبِيُّونَ مِن رَّبِّهِمْ',
    why: 'The hamza of أُوتِيَ is immediately followed by the saakin و — a madd badal, stretched two counts. The madd letter “replaced” an original second hamza.',
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
    why: 'In دَابَّةٍ the madd alif is followed by a shaddah-ed ب inside the same word — madd lazim muthaqqal, the longest and compulsory stretch: a full six counts. The same rule marks الضَّالِّينَ in al-Fatiha.',
  },
  {
    rule: 'madd-arrid', label: 'Madd arid — the stopping stretch', surah: 1, ayahNum: 5,
    ayah: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    why: 'When you stop on نَسْتَعِينُ, the damma on the final ن becomes a temporary saakin — so the madd ya before it stretches 2, 4 or 6 counts (arid lis-sukun).',
  },
  {
    rule: 'madd-leen', label: 'Madd leen — soft ending', surah: 106, ayahNum: 4,
    ayah: 'وَآمَنَهُم مِّنْ خَوْفٍ',
    why: 'Stopping on خَوْفٍ leaves a saakin و sitting after a fatha — a soft leen stretch of 2, 4 or 6 counts. The same happens on the ي of بَيْتٍ.',
  },
  {
    rule: 'madd-silah-sughra', label: 'Madd silah sughra', surah: 2, ayahNum: 255,
    ayah: 'لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    why: 'The pronoun هُ sits between two voweled letters, and the next word does not begin with hamza — a small two-count hum on the ه.',
  },
  {
    rule: 'madd-silah-kubra', label: 'Madd silah kubra', surah: 34, ayahNum: 23,
    ayah: 'وَلَا تَنفَعُ الشَّفَاعَةُ عِندَهُ إِلَّا لِمَنْ أَذِنَ لَهُ',
    why: 'Here the pronoun هُ is followed by a word starting with hamza (إِلَّا) — the major silah, stretched four or five counts.',
  },
  {
    rule: 'hamza-wasl', label: 'Hamzat al-wasl', surah: 96, ayahNum: 1,
    ayah: 'ٱقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    why: 'The small ٱ is hamzat al-wasl: pronounced when you start reciting, but dropped when the word flows from the one before it — you say “wabismi”, not “wa-bismi”.',
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
  { label: '91:1 — lam shamsiyyah (sun)', rule: 'lam-shamsi', ayah: RULE_EXAMPLES[14].ayah },
  { label: '1:1 — lam of Allah light/heavy', rule: 'lam-allah-tarqeeq', ayah: RULE_EXAMPLES[17].ayah },
  { label: '1:5 — arid madd when stopping', rule: 'madd-arrid', ayah: RULE_EXAMPLES[25].ayah },
  { label: '110:1 — wajib madd in جَاءَ', rule: 'madd-wajib', ayah: RULE_EXAMPLES[22].ayah },
  { label: '6:38 — six-count lazim madd', rule: 'madd-lazim', ayah: RULE_EXAMPLES[24].ayah },
  { label: '20:114 — ل melts into ر', rule: 'idgham-mutaqarib', ayah: RULE_EXAMPLES[13].ayah },
  { label: '113:1 — qalqalah kubra on الْفَلَقِ', rule: 'qalqalah-kubra', ayah: RULE_EXAMPLES[10].ayah },
];
