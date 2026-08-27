/**
 * Arabic Foundations dataset (pure TypeScript, zero side effects).
 * The 28 letters with their four contextual forms, the diacritics,
 * Quran-focused grammar topics and a starter vocabulary list.
 */

/** One Arabic letter with its contextual (presentation) forms. */
export interface ArabicLetter {
  /** Isolated form. */
  isolated: string;
  /** Final form (joined on the right). */
  final: string;
  /** Initial form (joins on the left). */
  initial: string;
  /** Medial form (joins both sides). */
  medial: string;
  /** Name in Arabic. */
  nameAr: string;
  /** Name transliterated. */
  nameEn: string;
  /** Approximate sound hint for beginners. */
  sound: string;
  /** Articulation zone (links to the Tajweed makharij). */
  zone: string;
  /** A common example word. */
  example: string;
  /** Example word meaning. */
  exampleEn: string;
  /** Joins to neighbouring letters (alif, dal, dhal, ra, zay, waw do not). */
  joins: boolean;
}

/** The 28 letters of the Arabic alphabet, in traditional order. */
export const ARABIC_LETTERS: readonly ArabicLetter[] = [
  { isolated: 'ا', final: 'ﺎ', initial: 'ا', medial: 'ﺎ', nameAr: 'أَلِف', nameEn: 'Alif', sound: 'long “aa” (no consonant sound of its own)', zone: 'Jawf', example: 'أَسَد', exampleEn: 'lion', joins: false },
  { isolated: 'ب', final: 'ﺐ', initial: 'ﺑ', medial: 'ﺒ', nameAr: 'بَاء', nameEn: 'Ba', sound: '“b” as in bed', zone: 'Lips', example: 'بَاب', exampleEn: 'door', joins: true },
  { isolated: 'ت', final: 'ﺖ', initial: 'ﺗ', medial: 'ﺘ', nameAr: 'تَاء', nameEn: 'Ta', sound: '“t” as in top', zone: 'Tongue', example: 'تَمْر', exampleEn: 'dates', joins: true },
  { isolated: 'ث', final: 'ﺚ', initial: 'ﺛ', medial: 'ﺜ', nameAr: 'ثَاء', nameEn: 'Tha', sound: '“th” as in think', zone: 'Tongue', example: 'ثَعْلَب', exampleEn: 'fox', joins: true },
  { isolated: 'ج', final: 'ﺞ', initial: 'ﺟ', medial: 'ﺠ', nameAr: 'جِيم', nameEn: 'Jim', sound: '“j” as in jump', zone: 'Tongue', example: 'جَمَل', exampleEn: 'camel', joins: true },
  { isolated: 'ح', final: 'ﺢ', initial: 'ﺣ', medial: 'ﺤ', nameAr: 'حَاء', nameEn: 'Ha', sound: 'sharp “h” from mid-throat', zone: 'Throat', example: 'حِصَان', exampleEn: 'horse', joins: true },
  { isolated: 'خ', final: 'ﺦ', initial: 'ﺧ', medial: 'ﺨ', nameAr: 'خَاء', nameEn: 'Kha', sound: '“kh” like Scottish loch', zone: 'Throat', example: 'خُبْز', exampleEn: 'bread', joins: true },
  { isolated: 'د', final: 'ﺪ', initial: 'د', medial: 'ﺪ', nameAr: 'دَال', nameEn: 'Dal', sound: '“d” as in dog', zone: 'Tongue', example: 'دُبّ', exampleEn: 'bear', joins: false },
  { isolated: 'ذ', final: 'ﺬ', initial: 'ذ', medial: 'ﺬ', nameAr: 'ذَال', nameEn: 'Dhal', sound: '“dh” as in this', zone: 'Tongue', example: 'ذَهَب', exampleEn: 'gold', joins: false },
  { isolated: 'ر', final: 'ﺮ', initial: 'ر', medial: 'ﺮ', nameAr: 'رَاء', nameEn: 'Ra', sound: 'rolled “r”', zone: 'Tongue', example: 'رَجُل', exampleEn: 'man', joins: false },
  { isolated: 'ز', final: 'ﺰ', initial: 'ز', medial: 'ﺰ', nameAr: 'زَاي', nameEn: 'Zay', sound: '“z” as in zebra', zone: 'Tongue', example: 'زَيْت', exampleEn: 'oil', joins: false },
  { isolated: 'س', final: 'ﺲ', initial: 'ﺳ', medial: 'ﺴ', nameAr: 'سِين', nameEn: 'Sin', sound: '“s” as in sun', zone: 'Tongue', example: 'سَمَك', exampleEn: 'fish', joins: true },
  { isolated: 'ش', final: 'ﺶ', initial: 'ﺷ', medial: 'ﺸ', nameAr: 'شِين', nameEn: 'Shin', sound: '“sh” as in ship', zone: 'Tongue', example: 'شَمْس', exampleEn: 'sun', joins: true },
  { isolated: 'ص', final: 'ﺺ', initial: 'ﺻ', medial: 'ﺼ', nameAr: 'صَاد', nameEn: 'Sad', sound: 'heavy, emphatic “s”', zone: 'Tongue', example: 'صَبْر', exampleEn: 'patience', joins: true },
  { isolated: 'ض', final: 'ﺾ', initial: 'ﺿ', medial: 'ﻀ', nameAr: 'ضَاد', nameEn: 'Dad', sound: 'heavy, emphatic “d”', zone: 'Tongue', example: 'ضَوْء', exampleEn: 'light', joins: true },
  { isolated: 'ط', final: 'ﻂ', initial: 'ﻃ', medial: 'ﻄ', nameAr: 'طَاء', nameEn: 'Ta', sound: 'heavy, emphatic “t”', zone: 'Tongue', example: 'طَائِر', exampleEn: 'bird', joins: true },
  { isolated: 'ظ', final: 'ﻆ', initial: 'ﻇ', medial: 'ﻈ', nameAr: 'ظَاء', nameEn: 'Za', sound: 'heavy, emphatic “dh”', zone: 'Tongue', example: 'ظِلّ', exampleEn: 'shade', joins: true },
  { isolated: 'ع', final: 'ﻊ', initial: 'ﻋ', medial: 'ﻌ', nameAr: 'عَيْن', nameEn: 'Ayn', sound: 'deep throat sound, no English match', zone: 'Throat', example: 'عَيْن', exampleEn: 'eye', joins: true },
  { isolated: 'غ', final: 'ﻎ', initial: 'ﻏ', medial: 'ﻐ', nameAr: 'غَيْن', nameEn: 'Ghayn', sound: '“gh”, a gargled “r”-like sound', zone: 'Throat', example: 'غَيْم', exampleEn: 'cloud', joins: true },
  { isolated: 'ف', final: 'ﻒ', initial: 'ﻓ', medial: 'ﻔ', nameAr: 'فَاء', nameEn: 'Fa', sound: '“f” as in fan', zone: 'Lips', example: 'فِيل', exampleEn: 'elephant', joins: true },
  { isolated: 'ق', final: 'ﻖ', initial: 'ﻗ', medial: 'ﻘ', nameAr: 'قَاف', nameEn: 'Qaf', sound: 'deep “q” from the back of the throat', zone: 'Tongue', example: 'قَمَر', exampleEn: 'moon', joins: true },
  { isolated: 'ك', final: 'ﻚ', initial: 'ﻛ', medial: 'ﻜ', nameAr: 'كَاف', nameEn: 'Kaf', sound: '“k” as in kite', zone: 'Tongue', example: 'كِتَاب', exampleEn: 'book', joins: true },
  { isolated: 'ل', final: 'ﻞ', initial: 'ﻟ', medial: 'ﻠ', nameAr: 'لَام', nameEn: 'Lam', sound: '“l” as in lamp', zone: 'Tongue', example: 'لَيْل', exampleEn: 'night', joins: true },
  { isolated: 'م', final: 'ﻢ', initial: 'ﻣ', medial: 'ﻤ', nameAr: 'مِيم', nameEn: 'Meem', sound: '“m” as in moon', zone: 'Lips', example: 'مَاء', exampleEn: 'water', joins: true },
  { isolated: 'ن', final: 'ﻦ', initial: 'ﻧ', medial: 'ﻨ', nameAr: 'نُون', nameEn: 'Noon', sound: '“n” as in nose', zone: 'Tongue', example: 'نَجْم', exampleEn: 'star', joins: true },
  { isolated: 'ه', final: 'ﻪ', initial: 'ﻫ', medial: 'ﻬ', nameAr: 'هَاء', nameEn: 'Ha', sound: 'soft “h” as in hat', zone: 'Throat', example: 'هَدِيَّة', exampleEn: 'gift', joins: true },
  { isolated: 'و', final: 'ﻮ', initial: 'و', medial: 'ﻮ', nameAr: 'وَاو', nameEn: 'Waw', sound: '“w” as in water', zone: 'Lips', example: 'وَرْد', exampleEn: 'rose', joins: false },
  { isolated: 'ي', final: 'ﻲ', initial: 'ﻳ', medial: 'ﻴ', nameAr: 'يَاء', nameEn: 'Ya', sound: '“y” as in yes', zone: 'Tongue', example: 'يَد', exampleEn: 'hand', joins: true },
];

/** One diacritic (harakah) with an example on a carrier letter. */
export interface Harakah {
  /** Diacritic mark. */
  mark: string;
  /** The mark rendered on a carrier (ba). */
  shown: string;
  /** Name in Arabic. */
  nameAr: string;
  /** Name transliterated. */
  nameEn: string;
  /** What sound it produces. */
  sound: string;
  /** A Quranic example. */
  example: string;
}

/** The short vowels and key marks a beginner must recognise. */
export const HARAKAT: readonly Harakah[] = [
  { mark: '\u064E', shown: 'بَ', nameAr: 'فَتْحَة', nameEn: 'Fatha', sound: 'short “a” as in cat', example: 'كَتَبَ' },
  { mark: '\u0650', shown: 'بِ', nameAr: 'كَسْرَة', nameEn: 'Kasra', sound: 'short “i” as in sit', example: 'بِسْمِ' },
  { mark: '\u064F', shown: 'بُ', nameAr: 'ضَمَّة', nameEn: 'Damma', sound: 'short “u” as in put', example: 'كُتُب' },
  { mark: '\u0652', shown: 'بْ', nameAr: 'سُكُون', nameEn: 'Sukun', sound: 'no vowel — the letter is “still”', example: 'مِنْ' },
  { mark: '\u0651', shown: 'بّ', nameAr: 'شَدَّة', nameEn: 'Shadda', sound: 'doubles the letter (press it)', example: 'مُحَمَّد' },
  { mark: '\u064B', shown: 'بً', nameAr: 'فَتْحَتَان', nameEn: 'Fathatan', sound: '“an” — tanween fath', example: 'كِتَابًا' },
  { mark: '\u064D', shown: 'بٍ', nameAr: 'كَسْرَتَان', nameEn: 'Kasratan', sound: '“in” — tanween kasr', example: 'كِتَابٍ' },
  { mark: '\u064C', shown: 'بٌ', nameAr: 'ضَمَّتَان', nameEn: 'Dammatan', sound: '“un” — tanween damm', example: 'كِتَابٌ' },
];

/** One Quran-focused grammar topic. */
export interface GrammarTopic {
  id: string;
  titleEn: string;
  titleAr: string;
  /** One or two sentence explanation. */
  explain: string;
  /** A worked example. */
  example: string;
  /** Gloss of the example. */
  gloss: string;
}

/** Core grammar every Quran student meets first. */
export const GRAMMAR_TOPICS: readonly GrammarTopic[] = [
  {
    id: 'word-types', titleEn: 'The three word types', titleAr: 'أقسام الكلمة',
    explain: 'Every Arabic word is a noun (ism), a verb (fi‘l), or a particle (harf). Recognising which one you have is the first step to reading any ayah.',
    example: 'اللهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', gloss: 'Allah (noun) · Light (noun) · the heavens and the earth (nouns) — “Allah is the Light of the heavens and the earth” (24:35)',
  },
  {
    id: 'nominal', titleEn: 'The nominal sentence', titleAr: 'الجملة الاسمية',
    explain: 'A sentence that starts with a noun: a subject (mubtada) followed by a predicate (khabar). There is no word for “is” — it is implied.',
    example: 'اللَّهُ الصَّمَدُ', gloss: 'Allah (subject) · the Eternal Refuge (predicate) — “Allah is the Eternal Refuge” (112:2)',
  },
  {
    id: 'verbal', titleEn: 'The verbal sentence', titleAr: 'الجملة الفعلية',
    explain: 'A sentence that starts with a verb, then its doer (fa‘il) and object (maf‘ul). Arabic verbs carry the tense; the doer often follows the verb.',
    example: 'خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ', gloss: 'He created (verb) · the human (object) · from a clinging clot — (96:2); the doer “He” is implied in the verb',
  },
  {
    id: 'irab', titleEn: 'Case endings (i‘rab)', titleAr: 'الإعراب',
    explain: 'The last vowel shows a word’s role: damma = subject, fatha = object, kasra = after a preposition. This is why the same word can end differently.',
    example: 'جَاءَ زَيْدٌ · رَأَيْتُ زَيْدًا · مَرَرْتُ بِزَيْدٍ', gloss: 'Zayd came (damma) · I saw Zayd (fatha) · I passed by Zayd (kasra)',
  },
  {
    id: 'definite', titleEn: 'The definite article ال', titleAr: 'أَل التعريف',
    explain: 'ال makes a noun definite (“the”). Before sun letters it melts into the next letter (الشَّمْس), before moon letters it is clear (القَمَر) — the same rule as tajweed’s lam.',
    example: 'الشَّمْسُ وَالقَمَرُ', gloss: 'the sun · and the moon — “the sun and the moon” (55:5)',
  },
  {
    id: 'pronouns', titleEn: 'Attached pronouns', titleAr: 'الضمائر المتصلة',
    explain: 'Small suffixes mean “my / his / her / our / their”. They attach to nouns and verbs and are everywhere in the Quran.',
    example: 'كِتَابُهُ · رَبُّنَا · خَلَقَكُمْ', gloss: 'his book · our Lord · He created you (plural)',
  },
  {
    id: 'idafa', titleEn: 'Possession (idafa)', titleAr: 'الإضافة',
    explain: 'Two nouns back-to-back mean “X of Y”. The first takes no ال and usually a kasra-like ending; the second defines it.',
    example: 'مَالِكِ يَوْمِ الدِّينِ', gloss: 'Master · of the Day · of the Recompense — “Master of the Day of Recompense” (1:4)',
  },
  {
    id: 'prepositions', titleEn: 'Common prepositions', titleAr: 'حروف الجر',
    explain: 'Short particles put the next noun into the kasra case: in, from, to, on, with, for.',
    example: 'فِي · مِنْ · إِلَى · عَلَى · بِ · لِ', gloss: 'in · from · to · on · with · for — as in فِي الْأَرْضِ “in the earth”',
  },
  {
    id: 'dual-plural', titleEn: 'Dual & sound plurals', titleAr: 'المثنى والجمع',
    explain: 'Arabic has a dual (two of something): -āni / -ayni. Masculine human plurals end -ūna / -īna. You will see both constantly.',
    example: 'مُسْلِمَانِ · مُسْلِمُونَ', gloss: 'two Muslims (dual) · Muslims (plural) — as in وَالْمُؤْمِنُونَ وَالْمُؤْمِنَاتُ “the believing men and women” (9:71)',
  },
  {
    id: 'negation', titleEn: 'Negation', titleAr: 'النفي',
    explain: 'Different particles negate different tenses: mā / lā for the present, lam + verb for the past, lan for the future.',
    example: 'لَا تَحْزَنْ · لَمْ يَلِدْ', gloss: 'do not grieve (9:40) · he did not beget (112:3)',
  },
];

/** One starter vocabulary word. */
export interface VocabWord {
  ar: string;
  en: string;
  /** Roughly how often it appears in the Quran. */
  freq: string;
}

/** High-frequency words a beginner meets in the first pages. */
export const VOCABULARY: readonly VocabWord[] = [
  { ar: 'الله', en: 'Allah (God)', freq: '2,699×' },
  { ar: 'رَبّ', en: 'Lord, Sustainer', freq: '970×' },
  { ar: 'كِتَاب', en: 'book, scripture', freq: '230×' },
  { ar: 'الَّذِي', en: 'the one who / which', freq: '1,400×' },
  { ar: 'آمَنَ', en: 'to believe', freq: '810×' },
  { ar: 'يَوْم', en: 'day', freq: '405×' },
  { ar: 'أَرْض', en: 'earth', freq: '461×' },
  { ar: 'سَمَاء', en: 'sky, heaven', freq: '310×' },
  { ar: 'قَلْب', en: 'heart', freq: '132×' },
  { ar: 'نُور', en: 'light', freq: '43×' },
  { ar: 'صِرَاط', en: 'path', freq: '45×' },
  { ar: 'دِين', en: 'religion, way', freq: '94×' },
  { ar: 'جَنَّة', en: 'garden, paradise', freq: '66×' },
  { ar: 'نَار', en: 'fire', freq: '145×' },
  { ar: 'رَحْمَة', en: 'mercy', freq: '114×' },
  { ar: 'عِلْم', en: 'knowledge', freq: '105×' },
  { ar: 'صَبْر', en: 'patience', freq: '103×' },
  { ar: 'شُكْر', en: 'gratitude', freq: '75×' },
  { ar: 'نَفْس', en: 'self, soul', freq: '298×' },
  { ar: 'حَقّ', en: 'truth, right', freq: '287×' },
];
