/**
 * Tajweed rule table (rule-as-data, per the engine blueprint §3.2/§5).
 * Every rule is a structured record — trigger metadata, affected
 * letters, harakah duration, ghunnah flag, priority, colour key and
 * bilingual description. The evaluator in tajweed.ts interprets these
 * records instead of hard-coding branches, so adding a rule variant
 * means adding a row, not rewriting logic.
 */

/** All detectable rules, grouped by category (Hafs an-Asim). */
export type TajweedRuleId =
  // Noon sakinah & tanween
  | 'izhaar' | 'iqlaab' | 'idghaam-ghunna' | 'idghaam-bila-ghunna' | 'ikhfaa'
  // Meem sakinah
  | 'meem-ikhfaa' | 'meem-idgham'
  // Ghunnah & qalqalah
  | 'ghunna' | 'qalqalah' | 'qalqalah-kubra'
  // Lam & Ra
  | 'lam-shamsi' | 'lam-qamari' | 'ra-tafkhim' | 'ra-tarqeeq'
  // Madd family
  | 'madd' | 'madd-badal' | 'madd-wajib' | 'madd-jaiz' | 'madd-lazim'
  // Waqf
  | 'waqf';

/** Top-level buckets used for filtering and grouping. */
export type RuleCategory =
  | 'noon' | 'meem' | 'ghunna' | 'qalqalah' | 'lam' | 'ra' | 'madd' | 'waqf';

/** How a rule should be rendered. */
export type RuleStyle = 'color' | 'underline' | 'underline-wavy';

/** One structured rule definition (the "row" in the rule table). */
export interface RuleDefinition {
  id: TajweedRuleId;
  category: RuleCategory;
  /** English label. */
  label: string;
  /** Arabic label. */
  arabic: string;
  /** Render colour (readable on light & dark surfaces). */
  color: string;
  /** Hold length in harakahs (null = instantaneous). */
  duration: number | null;
  /** Whether a nasal ghunnah accompanies it. */
  ghunnah: boolean;
  /** Conflict priority — higher wins for colouring (§5.3). */
  priority: number;
  /** Rendering treatment. */
  style: RuleStyle;
  /** One-line recitation instruction (English). */
  desc: string;
  /** Short Arabic description. */
  descAr: string;
}

/**
 * The complete rule table. Priorities follow §5.3: lazim > wajib >
 * jaiz > badal > tabee'i; idghaam > izhaar; kubra > sughra.
 */
export const TAJWEED_RULES: Readonly<Record<TajweedRuleId, RuleDefinition>> = {
  izhaar: { id: 'izhaar', category: 'noon', label: 'Izhaar Halqi', arabic: 'إظهار حلقي', color: '#1c7ed6', duration: null, ghunnah: false, priority: 60, style: 'color', desc: 'Pronounce the noon clearly before the six throat letters — no ghunnah.', descAr: 'إظهار النون عند حروف الحلق الستة' },
  iqlaab: { id: 'iqlaab', category: 'noon', label: 'Iqlaab', arabic: 'إقلاب', color: '#7950f2', duration: 2, ghunnah: true, priority: 66, style: 'color', desc: 'Flip the noon into a hidden meem before ب, with a 2-harakah ghunnah.', descAr: 'قلب النون ميماً مخفاة عند الباء' },
  'idghaam-ghunna': { id: 'idghaam-ghunna', category: 'noon', label: 'Idghaam w/ Ghunnah', arabic: 'إدغام بغنة', color: '#f76707', duration: 2, ghunnah: true, priority: 68, style: 'color', desc: 'Merge the noon into ي ن م و with a humming ghunnah.', descAr: 'إدغام النون في يرملون بغنة' },
  'idghaam-bila-ghunna': { id: 'idghaam-bila-ghunna', category: 'noon', label: 'Idghaam w/o Ghunnah', arabic: 'إدغام بلا غنة', color: '#fab005', duration: 1, ghunnah: false, priority: 68, style: 'color', desc: 'Merge the noon into ل or ر cleanly, no hum.', descAr: 'إدغام النون في اللام والراء بلا غنة' },
  ikhfaa: { id: 'ikhfaa', category: 'noon', label: 'Ikhfaa Haqiqi', arabic: 'إخفاء حقيقي', color: '#2b8a3e', duration: 2, ghunnah: true, priority: 64, style: 'color', desc: 'Conceal the noon before the 15 remaining letters with a 2-harakah ghunnah.', descAr: 'إخفاء النون عند الحروف الخمسة عشر' },
  'meem-ikhfaa': { id: 'meem-ikhfaa', category: 'meem', label: 'Ikhfaa Shafawi', arabic: 'إخفاء شفوي', color: '#0ca678', duration: 2, ghunnah: true, priority: 62, style: 'color', desc: 'Meem sakinah before ب — hide it on the lips with ghunnah.', descAr: 'إخفاء الميم الساكنة عند الباء' },
  'meem-idgham': { id: 'meem-idgham', category: 'meem', label: 'Idghaam Shafawi', arabic: 'إدغام شفوي', color: '#e03131', duration: 2, ghunnah: true, priority: 64, style: 'color', desc: 'Meem sakinah into another meem — merge with ghunnah.', descAr: 'إدغام الميم في الميم' },
  ghunna: { id: 'ghunna', category: 'ghunna', label: 'Ghunnah', arabic: 'غنة', color: '#d6336c', duration: 2, ghunnah: true, priority: 70, style: 'color', desc: 'A full 2-harakah nasal hum on a shaddah-ed noon or meem.', descAr: 'غنة كاملة عند النون أو الميم المشددة' },
  qalqalah: { id: 'qalqalah', category: 'qalqalah', label: 'Qalqalah Sughra', arabic: 'قلقلة صغرى', color: '#4263eb', duration: null, ghunnah: false, priority: 58, style: 'color', desc: 'Light bounce on a saakin ق ط ب ج د in the middle of a word.', descAr: 'قلقلة خفيفة وسط الكلمة' },
  'qalqalah-kubra': { id: 'qalqalah-kubra', category: 'qalqalah', label: 'Qalqalah Kubra', arabic: 'قلقلة كبرى', color: '#1b2a6b', duration: null, ghunnah: false, priority: 60, style: 'color', desc: 'Strong bounce when a ق ط ب ج د is stopped upon at a word end.', descAr: 'قلقلة قوية عند الوقف' },
  'lam-shamsi': { id: 'lam-shamsi', category: 'lam', label: 'Lam Shamsiyyah', arabic: 'لام شمسية', color: '#e6a700', duration: null, ghunnah: false, priority: 50, style: 'color', desc: 'The article lam before a sun letter is assimilated — the shaddah shows on the sun letter.', descAr: 'لام التعريف تدغم في الحروف الشمسية' },
  'lam-qamari': { id: 'lam-qamari', category: 'lam', label: 'Lam Qamariyyah', arabic: 'لام قمرية', color: '#868e96', duration: null, ghunnah: false, priority: 48, style: 'color', desc: 'The article lam before a moon letter is pronounced clearly.', descAr: 'لام التعريف تظهر عند الحروف القمرية' },
  'ra-tafkhim': { id: 'ra-tafkhim', category: 'ra', label: 'Ra Tafkhim', arabic: 'راء مفخمة', color: '#c2255c', duration: null, ghunnah: false, priority: 46, style: 'color', desc: 'Heavy ra: with fatha/damma, or saakin after fatha/damma.', descAr: 'الراء المرققة بالفتح أو الضم' },
  'ra-tarqeeq': { id: 'ra-tarqeeq', category: 'ra', label: 'Ra Tarqeeq', arabic: 'راء مرققة', color: '#1098ad', duration: null, ghunnah: false, priority: 46, style: 'color', desc: 'Light ra: with kasra, or saakin after kasra or a saakin ya.', descAr: 'الراء المرققة بالكسر' },
  madd: { id: 'madd', category: 'madd', label: 'Madd Tabee\'i', arabic: 'مد طبيعي', color: '#66a80f', duration: 2, ghunnah: false, priority: 30, style: 'underline-wavy', desc: 'Natural 2-harakah stretch on ا و ي after their matching vowel (or dagger alif).', descAr: 'المد الطبيعي بمقدار حركتين' },
  'madd-badal': { id: 'madd-badal', category: 'madd', label: 'Madd Badal', arabic: 'مد بدل', color: '#15aabf', duration: 2, ghunnah: false, priority: 34, style: 'underline-wavy', desc: 'Hamza immediately followed by a madd letter in the same word — 2 harakahs.', descAr: 'مد البدل بعد الهمز' },
  'madd-wajib': { id: 'madd-wajib', category: 'madd', label: 'Madd Wajib Muttasil', arabic: 'مد واجب متصل', color: '#a61e4d', duration: 4, ghunnah: false, priority: 40, style: 'underline', desc: 'Madd letter + hamzah in the same word — obligatory 4-5 harakahs.', descAr: 'المد الواجب المتصل' },
  'madd-jaiz': { id: 'madd-jaiz', category: 'madd', label: 'Madd Jaiz Munfasil', arabic: 'مد جائز منفصل', color: '#fd7e14', duration: 4, ghunnah: false, priority: 36, style: 'underline', desc: 'Madd letter ends a word and the next begins with hamza — 2-5 harakahs.', descAr: 'المد الجائز المنفصل' },
  'madd-lazim': { id: 'madd-lazim', category: 'madd', label: 'Madd Lazim', arabic: 'مد لازم', color: '#5f3dc4', duration: 6, ghunnah: false, priority: 44, style: 'underline', desc: 'Madd letter + shaddah/sukun in the same word — full 6 harakahs.', descAr: 'المد اللازم ست حركات' },
  waqf: { id: 'waqf', category: 'waqf', label: 'Waqf', arabic: 'وقف', color: '#495057', duration: null, ghunnah: false, priority: 20, style: 'underline', desc: 'A stopping sign — pause here (each symbol carries its own ruling).', descAr: 'علامة وقف' },
};

/** Legend / learning order, grouped by category. */
export const RULE_ORDER: readonly TajweedRuleId[] = [
  'izhaar', 'ikhfaa', 'idghaam-ghunna', 'idghaam-bila-ghunna', 'iqlaab',
  'ghunna',
  'meem-ikhfaa', 'meem-idgham',
  'qalqalah', 'qalqalah-kubra',
  'lam-shamsi', 'lam-qamari',
  'ra-tafkhim', 'ra-tarqeeq',
  'madd', 'madd-badal', 'madd-wajib', 'madd-jaiz', 'madd-lazim',
  'waqf',
];

/** Human-readable category names for grouping. */
export const RULE_CATEGORIES: Readonly<Record<RuleCategory, string>> = {
  noon: 'Noon & Tanween',
  meem: 'Meem Sakinah',
  ghunna: 'Ghunnah',
  qalqalah: 'Qalqalah',
  lam: 'Lam',
  ra: 'Ra',
  madd: 'Madd',
  waqf: 'Waqf',
};

/**
 * Sun letters (the lam of the article assimilates before these).
 */
export const SUN_LETTERS: ReadonlySet<string> = new Set([
  'ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن',
]);

/**
 * Moon letters (the lam of the article is pronounced clearly).
 */
export const MOON_LETTERS: ReadonlySet<string> = new Set([
  'ا', 'أ', 'إ', 'آ', 'ب', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك', 'م', 'ه', 'و', 'ي', 'ى', 'ٱ',
]);
