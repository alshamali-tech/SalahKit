/**
 * Tajweed curriculum data (pure TypeScript, zero side effects).
 * The guided Path (a chain of mastery), the Noon decision tree, the
 * letter knowledge-graph data and the makharij zones.
 */
import type { TajweedRuleId } from './tajweed';

/** One concept in the guided learning chain. */
export interface TajweedConcept {
  /** Stable id, also the chain order key. */
  id: string;
  /** Position in the chain (1-based). */
  order: number;
  /** English title. */
  title: string;
  /** Arabic term. */
  arabic: string;
  /** One-line hook. */
  tagline: string;
  /** Estimated minutes to learn. */
  minutes: number;
  /** Teaching points. */
  points: readonly string[];
  /** Optional letter table. */
  letters?: readonly { char: string; name: string }[];
  /** Practice text (rendered with the tajweed engine). */
  practice: string;
  /** What to listen for in the practice text. */
  practiceHint: string;
  /** A recited ayah that demonstrates the rule (for the Listen button). */
  audio?: { surah: number; ayah: number; to?: number };
}

/** The six-link mastery chain, in order. */
export const TAJWEED_CONCEPTS: readonly TajweedConcept[] = [
  {
    id: 'makharij', order: 1, title: 'Makharij', arabic: 'المخارج', minutes: 8,
    tagline: 'Every letter is born in one of five places.',
    points: [
      'The five exits: the empty space (jawf), the throat, the tongue, the two lips and the nasal passage.',
      'Throat letters come from three depths: deep (ء ه), middle (ع ح) and upper (غ خ).',
      'The tongue alone hosts ten positions — from ق at the base, through ك then ج ش ي in the middle, ض on the edge, ل ن ر at the tip, down to ط د ت then ص س ز and finally ظ ذ ث at the very front.',
      'The seven isti’la letters (خ ص ض غ ط ق ظ) always lift the tongue toward the palate — that fullness is tafkhim. Every other letter defaults to light (tarqiq).',
      'Ghunna has its own home — the nasal passage — which is why it sounds “in the nose”.',
      'A wrong makhraj changes the letter; tajweed starts by placing each letter home.',
    ],
    letters: [
      { char: 'ء', name: 'Hamzah · deep throat' }, { char: 'ه', name: 'Ha · deep throat' },
      { char: 'ع', name: 'Ayn · mid throat' }, { char: 'ح', name: 'Ha · mid throat' },
      { char: 'غ', name: 'Ghayn · upper throat' }, { char: 'خ', name: 'Kha · upper throat' },
      { char: 'ق', name: 'Qaf · tongue base' }, { char: 'ف', name: 'Fa · lips' },
    ],
    practice: 'خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ',
    practiceHint: 'Feel خ then ق deep in the throat, then the clear noon of مِنْ before ع.',
    audio: { surah: 96, ayah: 2 },
  },
  {
    id: 'noon', order: 2, title: 'The Noon Tree', arabic: 'النون الساكنة', minutes: 12,
    tagline: 'One silent noon, four possible fates.',
    points: [
      'When نْ or tanween meets the next letter, exactly one of four rules applies — never two.',
      'Throat letters (ء ه ع ح غ خ) keep the noon crystal clear: izhaar.',
      'ب flips it into a hidden meem: iqlaab. ي ن م و swallow it with a hum: idghaam.',
      'ل and ر swallow it with no hum; the remaining 15 letters hide it: ikhfaa.',
      'Idghaam only crosses a word boundary. Inside one word (الدُّنْيَا, صِنْوَانٌ) the noon stays clear — but same-word ikhfaa is real (عِنْدَ, مِنكُمْ).',
      'In Uthmani script a noon before idghaam is often written bare, with no sukun (مَن يَقُولُ) — the bare noon still follows all four rules.',
    ],
    practice: 'مِن نَّعِيمٍ ۝ مِنْ خَوْفٍ ۝ مِن رَّبِّهِمْ ۝ مِن قَبْلُ',
    practiceHint: 'Same noon, four colors: merge, clear, merge-clean, hide.',
    audio: { surah: 36, ayah: 58 },
  },
  {
    id: 'ghunna', order: 3, title: 'Ghunna', arabic: 'الغنة', minutes: 6,
    tagline: 'The two-count hum that lives in the nose.',
    points: [
      'Ghunna is a quality of noon and meem — a soft nasal resonance held about two beats.',
      'It is strongest with shaddah: إِنَّا and ثُمَّ both carry a full two-count hum.',
      'Ikhfaa, iqlaab and idghaam-with-ghunna all borrow this same hum.',
      'Practice it by pinching your nose mid-sound: the hum should keep going.',
    ],
    practice: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ ثُمَّ كَانَ مِنَ الَّذِينَ آمَنُوا',
    practiceHint: 'Hold the hum on إِنَّا and ثُمَّ — count one-two before moving on.',
    audio: { surah: 108, ayah: 1 },
  },
  {
    id: 'qalqalah', order: 4, title: 'Qalqalah', arabic: 'القلقلة', minutes: 7,
    tagline: 'The bounce of the five echoing letters — in three ranks.',
    points: [
      'Gather them in “Qutb Jad” — ق ط ب ج د — the bounce only happens when the letter is sukūn.',
      'Al-ʿulyā / kubrā (strongest): the letter is MUSHADDAH at the end of a word — the بّ of الْحَجِّ, وَتَبَّ.',
      'Al-wusṭā (middle): the letter is sākin in the MIDDLE of a word — the ط of يَقْطَعُونَ.',
      'Al-dunyā / ṣughrā (lightest): the letter is sākin at the END of a word, no shaddah — the ق of الْفَلَقِ, أَحَدْ.',
      'It is an echo released from the makhraj — not a new vowel, never an extra harakah. Too hard adds a fake vowel; too soft and the letter dies.',
    ],
    letters: [
      { char: 'ق', name: 'Qaf' }, { char: 'ط', name: 'Ta' }, { char: 'ب', name: 'Ba' },
      { char: 'ج', name: 'Jim' }, { char: 'د', name: 'Dal' },
    ],
    practice: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ وَلَا يَقْطَعُونَ ۝ وَتَبَّ',
    practiceHint: 'The final ق of الْفَلَقِ is sākin at a word’s end (dunyā); the ط of يَقْطَعُونَ is mid-word (wusṭā); the shaddah-ed ب of وَتَبَّ is the full kubrā (ʿulyā).',
    audio: { surah: 113, ayah: 1 },
  },
  {
    id: 'madd', order: 5, title: 'Madd', arabic: 'المد', minutes: 10,
    tagline: 'Stretching the light of the vowel.',
    points: [
      'Natural madd (ا و ي after their matching vowel) is two counts — the baseline of all stretching. The dagger-alif of ذَٰلِكَ and هَٰذَا also counts as two.',
      'Madd wajib muttasil stretches 4–5 counts when a hamzah follows in the same word: جَاءَ، السَّمَاء.',
      'Madd lazim stretches a full six counts when a shaddah or sukun follows: الضَّالِّينَ، دَابَّة.',
      'Stopping creates its own madds: arid (stretching before the last letter when your stop turns it saakin), leen (a soft و/ي at the end of a word), and the pronoun hum of silah on هُ.',
      'Consistency beats length: whatever measure you choose, never shorten it mid-ayah.',
    ],
    practice: 'جَاءَ نَصْرُ اللَّهِ ۝ وَلَا الضَّالِّينَ',
    practiceHint: 'جَاءَ carries a connected obligatory madd; الضَّالِّينَ ends with a lazy six-count madd.',
    audio: { surah: 110, ayah: 1 },
  },
  {
    id: 'waqf', order: 6, title: 'Waqf', arabic: 'الوقف', minutes: 7,
    tagline: 'Where the breath ends, meaning is kept.',
    points: [
      'م (lazim) — stop is necessary; continuing breaks the meaning.',
      'لا — do not stop; the phrase must flow on.',
      'ج (ja’iz) — stopping or continuing are both fine.',
      '∴∴ (mu’anaqah) — two linked marks: stop at one of them, never both, never neither.',
    ],
    practice: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    practiceHint: 'The paired ۛ marks are mu’anaqah — rest at the first or the second, not both.',
    audio: { surah: 2, ayah: 2 },
  },
];

/** One branch of the noon decision tree. */
export interface NoonTreeBranch {
  /** The rule this branch resolves to. */
  rule: TajweedRuleId;
  /** The letters that trigger it. */
  letters: readonly string[];
  /** Short condition label. */
  condition: string;
  /** Example (the engine will color it). */
  example: string;
  /** Real ayah to hear the rule recited. */
  audio: { surah: number; ayah: number };
}

/** The five outcomes, ordered as drawn in the tree. */
export const NOON_TREE_BRANCHES: readonly NoonTreeBranch[] = [
  { rule: 'izhaar', letters: ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'], condition: 'a throat letter follows', example: 'مِنْ خَوْفٍ ۝ مِنْ هَادٍ', audio: { surah: 106, ayah: 4 } },
  { rule: 'iqlaab', letters: ['ب'], condition: 'ب follows — the noon flips', example: 'فَمَن بَدَّلَهُ ۝ سَمِيعٌ بَصِيرٌ', audio: { surah: 2, ayah: 181 } },
  { rule: 'idghaam-ghunna', letters: ['ي', 'ن', 'م', 'و'], condition: 'it merges with a hum', example: 'مَن يَقُولُ ۝ مِن نَّعِيمٍ', audio: { surah: 2, ayah: 8 } },
  { rule: 'idghaam-bila-ghunna', letters: ['ل', 'ر'], condition: 'it merges without a hum', example: 'مِن رَّبِّهِمْ ۝ هُدًى لِّلْمُتَّقِينَ', audio: { surah: 2, ayah: 2 } },
  { rule: 'ikhfaa', letters: ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'], condition: 'any of the 15 remaining letters', example: 'مِن تَحْتِهَا ۝ مِن قَبْلُ', audio: { surah: 2, ayah: 25 } },
];

/** Names of the 28 letters for the knowledge graph. */
export const LETTER_NAMES: Readonly<Record<string, string>> = {
  ا: 'Alif', ب: 'Ba', ت: 'Ta', ث: 'Tha', ج: 'Jim', ح: 'Ha', خ: 'Kha', د: 'Dal',
  ذ: 'Dhal', ر: 'Ra', ز: 'Zay', س: 'Sin', ش: 'Shin', ص: 'Sad', ض: 'Dad', ط: 'Ta',
  ظ: 'Za', ع: 'Ayn', غ: 'Ghayn', ف: 'Fa', ق: 'Qaf', ك: 'Kaf', ل: 'Lam', م: 'Meem',
  ن: 'Noon', ه: 'Ha', و: 'Waw', ي: 'Ya',
};

/** Articulation zone of each letter (primary makhraj). */
export const LETTER_ZONES: Readonly<Record<string, string>> = {
  ا: 'Jawf', و: 'Jawf', ي: 'Jawf',
  ء: 'Throat', ه: 'Throat', ع: 'Throat', ح: 'Throat', غ: 'Throat', خ: 'Throat',
  ق: 'Tongue', ك: 'Tongue', ج: 'Tongue', ش: 'Tongue', ل: 'Tongue', ن: 'Tongue',
  ر: 'Tongue', ط: 'Tongue', د: 'Tongue', ت: 'Tongue', ص: 'Tongue', ز: 'Tongue',
  س: 'Tongue', ض: 'Tongue', ظ: 'Tongue', ذ: 'Tongue', ث: 'Tongue',
  ف: 'Lips', ب: 'Lips', م: 'Lips',
};

/** The five articulation zones in teaching order. */
export const MAKHARIJ_ZONES: readonly { zone: string; arabic: string; note: string }[] = [
  { zone: 'Jawf', arabic: 'الجوف', note: 'The empty space — home of the madd letters' },
  { zone: 'Throat', arabic: 'الحلق', note: 'Three depths: deep, middle, upper' },
  { zone: 'Tongue', arabic: 'اللسان', note: 'From the base to the tip — most letters live here' },
  { zone: 'Lips', arabic: 'الشفتان', note: 'ف between the teeth, ب م و on the lips' },
  { zone: 'Nasal', arabic: 'الخيشوم', note: 'The ghunna’s home — noon and meem resonate here' },
];
