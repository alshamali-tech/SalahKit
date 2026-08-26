/**
 * Tajweed rule table — rule-as-data (blueprint §3.2).
 * Every rule is a structured record the engine interprets: trigger
 * category, harakah duration, ghunnah flag, conflict priority, render
 * style and bilingual descriptions. Colours are theme-aware tokens
 * (--tw-*) so contrast holds in light AND dark mode.
 */

/** Top-level rule buckets for grouping in the UI. */
export type RuleCategory =
  | 'noon'
  | 'meem'
  | 'ghunna'
  | 'qalqalah'
  | 'lam'
  | 'ra'
  | 'madd'
  | 'waqf';

/** Every rule the engine can detect. */
export type TajweedRuleId =
  | 'izhaar'
  | 'ikhfaa'
  | 'idghaam-ghunna'
  | 'idghaam-bila-ghunna'
  | 'iqlaab'
  | 'meem-ikhfaa'
  | 'meem-idgham'
  | 'ghunna'
  | 'qalqalah'
  | 'qalqalah-kubra'
  | 'lam-shamsi'
  | 'lam-qamari'
  | 'ra-tafkhim'
  | 'ra-tarqeeq'
  | 'madd'
  | 'madd-badal'
  | 'madd-wajib'
  | 'madd-jaiz'
  | 'madd-lazim'
  | 'waqf';

/** Render treatment for a rule. */
export type RuleStyle = 'recolor' | 'underline-wavy' | 'underline-solid';

/** One structured rule definition. */
export interface TajweedRule {
  /** English name. */
  label: string;
  /** Arabic name. */
  arabic: string;
  /** Category bucket. */
  category: RuleCategory;
  /** Theme-aware colour token (resolves per data-theme). */
  color: string;
  /** Hold duration in harakahs, null when not a timed rule. */
  duration: number | null;
  /** Whether a 2-count nasal hum is part of the rule. */
  ghunnah: boolean;
  /** Conflict priority — higher wins the colour (§5.3). */
  priority: number;
  /** How the renderer marks it. */
  style: RuleStyle;
  /** One-line recitation instruction (English). */
  desc: string;
  /** Short Arabic explanation. */
  descAr: string;
}

/** The full rule table, interpreted by the evaluator. */
export const RULE_DEFS: Readonly<Record<TajweedRuleId, TajweedRule>> = {
  izhaar: {
    label: 'Izhaar', arabic: 'إظهار حلقي', category: 'noon', color: 'var(--tw-izhaar)',
    duration: null, ghunnah: false, priority: 40, style: 'recolor',
    desc: 'Pronounce the noon/tanween crystal clear before the six throat letters ء هـ ع ح غ خ.',
    descAr: 'إظهار النون الساكنة أو التنوين عند حروف الحلق الستة',
  },
  ikhfaa: {
    label: 'Ikhfaa', arabic: 'إخفاء حقيقي', category: 'noon', color: 'var(--tw-ikhfaa)',
    duration: 2, ghunnah: true, priority: 60, style: 'recolor',
    desc: 'Hide the noon/tanween with a 2-count ghunna before the 15 remaining letters.',
    descAr: 'إخفاء النون الساكنة أو التنوين عند الحروف الخمسة عشر مع الغنة',
  },
  'idghaam-ghunna': {
    label: 'Idghaam + ghunna', arabic: 'إدغام بغنة', category: 'noon', color: 'var(--tw-idghaam-ghunna)',
    duration: 2, ghunnah: true, priority: 65, style: 'recolor',
    desc: 'Merge the noon/tanween into ي ن م و across a word boundary, humming 2 counts.',
    descAr: 'إدغام النون الساكنة أو التنوين في يرملون مع الغنة',
  },
  'idghaam-bila-ghunna': {
    label: 'Idghaam, no ghunna', arabic: 'إدغام بلا غنة', category: 'noon', color: 'var(--tw-idghaam-bila-ghunna)',
    duration: 1, ghunnah: false, priority: 65, style: 'recolor',
    desc: 'Merge the noon/tanween into ل or ر cleanly — no hum.',
    descAr: 'إدغام النون الساكنة أو التنوين في اللام والراء بلا غنة',
  },
  iqlaab: {
    label: 'Iqlaab', arabic: 'إقلاب', category: 'noon', color: 'var(--tw-iqlaab)',
    duration: 2, ghunnah: true, priority: 70, style: 'recolor',
    desc: 'Flip the noon/tanween into a hidden meem before ب, with a 2-count ghunna.',
    descAr: 'قلب النون الساكنة أو التنوين ميماً مخفاة عند الباء',
  },
  'meem-ikhfaa': {
    label: 'Ikhfaa shafawi', arabic: 'إخفاء شفوي', category: 'meem', color: 'var(--tw-meem-ikhfaa)',
    duration: 2, ghunnah: true, priority: 60, style: 'recolor',
    desc: 'Hide the meem sakinah on the lips before ب, with a light 2-count hum.',
    descAr: 'إخفاء الميم الساكنة عند الباء مع غنة خفيفة',
  },
  'meem-idgham': {
    label: 'Idghaam shafawi', arabic: 'إدغام شفوي', category: 'meem', color: 'var(--tw-meem-idgham)',
    duration: 2, ghunnah: true, priority: 65, style: 'recolor',
    desc: 'Merge the meem sakinah into a following meem (مِّ), humming 2 counts.',
    descAr: 'إدغام الميم الساكنة في ميم مثلها مع الغنة',
  },
  ghunna: {
    label: 'Ghunna', arabic: 'غنة كاملة', category: 'ghunna', color: 'var(--tw-ghunna)',
    duration: 2, ghunnah: true, priority: 75, style: 'recolor',
    desc: 'A full 2-count nasal hum on a shaddah-ed noon (نّ) or meem (مّ).',
    descAr: 'غنة كاملة مقدار حركتين عند النون أو الميم المشددة',
  },
  qalqalah: {
    label: 'Qalqalah sughra', arabic: 'قلقلة صغرى', category: 'qalqalah', color: 'var(--tw-qalqalah)',
    duration: null, ghunnah: false, priority: 50, style: 'recolor',
    desc: 'Light bounce on a saakin ق ط ب ج د in the middle of a word.',
    descAr: 'قلقلة خفيفة عند سكون أحد حروف قطب جد وسط الكلمة',
  },
  'qalqalah-kubra': {
    label: 'Qalqalah kubra', arabic: 'قلقلة كبرى', category: 'qalqalah', color: 'var(--tw-qalqalah-kubra)',
    duration: null, ghunnah: false, priority: 55, style: 'recolor',
    desc: 'Strong bounce when a qalqalah letter is saakin at a stopping point.',
    descAr: 'قلقلة قوية عند الوقف على أحد حروف قطب جد',
  },
  'lam-shamsi': {
    label: 'Lam shamsiyyah', arabic: 'لام شمسية', category: 'lam', color: 'var(--tw-lam-shamsi)',
    duration: null, ghunnah: false, priority: 35, style: 'recolor',
    desc: 'The article lam dissolves into a sun letter (ت ث د ذ ر ز س ش ص ض ط ظ ل ن) — silent, shaddah shows.',
    descAr: 'إدغام لام التعريف في الحروف الشمسية',
  },
  'lam-qamari': {
    label: 'Lam qamariyyah', arabic: 'لام قمرية', category: 'lam', color: 'var(--tw-lam-qamari)',
    duration: null, ghunnah: false, priority: 35, style: 'recolor',
    desc: 'The article lam before a moon letter is pronounced clearly.',
    descAr: 'إظهار لام التعريف عند الحروف القمرية',
  },
  'ra-tafkhim': {
    label: 'Ra tafkhim', arabic: 'تفخيم الراء', category: 'ra', color: 'var(--tw-ra-tafkhim)',
    duration: null, ghunnah: false, priority: 45, style: 'recolor',
    desc: 'Heavy ra: carries fatha/damma, or is saakin after fatha/damma.',
    descAr: 'تفخيم الراء عند الفتح أو الضم',
  },
  'ra-tarqeeq': {
    label: 'Ra tarqeeq', arabic: 'ترقيق الراء', category: 'ra', color: 'var(--tw-ra-tarqeeq)',
    duration: null, ghunnah: false, priority: 45, style: 'recolor',
    desc: 'Light ra: carries kasra, or is saakin after kasra / ya sakinah.',
    descAr: 'ترقيق الراء عند الكسر',
  },
  madd: {
    label: 'Madd tabee’i', arabic: 'مد طبيعي', category: 'madd', color: 'var(--tw-madd)',
    duration: 2, ghunnah: false, priority: 30, style: 'underline-wavy',
    desc: 'Natural 2-count stretch: alif after fatha, ya after kasra, waw after damma.',
    descAr: 'المد الطبيعي بمقدار حركتين',
  },
  'madd-badal': {
    label: 'Madd badal', arabic: 'مد بدل', category: 'madd', color: 'var(--tw-madd-badal)',
    duration: 2, ghunnah: false, priority: 40, style: 'underline-wavy',
    desc: 'A madd letter that follows a hamza (آمنوا، أوتوا) — stretched 2 counts.',
    descAr: 'مد حرف الهمزة قبله بمقدار حركتين',
  },
  'madd-wajib': {
    label: 'Madd wajib', arabic: 'مد واجب متصل', category: 'madd', color: 'var(--tw-madd-wajib)',
    duration: 4, ghunnah: false, priority: 80, style: 'underline-solid',
    desc: 'Madd letter + hamza in the SAME word (جاء، السماء) — obligatory 4–5 counts.',
    descAr: 'المد الواجب المتصل: الهمز بعد حرف المد في كلمة واحدة',
  },
  'madd-jaiz': {
    label: 'Madd jaiz', arabic: 'مد جائز منفصل', category: 'madd', color: 'var(--tw-madd-jaiz)',
    duration: 4, ghunnah: false, priority: 78, style: 'underline-solid',
    desc: 'Madd letter ends a word, hamza starts the next (يا أيها) — 2 to 5 counts.',
    descAr: 'المد الجائز المنفصل: الهمز في كلمة بعد حرف المد',
  },
  'madd-lazim': {
    label: 'Madd lazim', arabic: 'مد لازم', category: 'madd', color: 'var(--tw-madd-lazim)',
    duration: 6, ghunnah: false, priority: 85, style: 'underline-solid',
    desc: 'Madd letter followed by shaddah/sukun in one word (الضالين) — a full 6 counts.',
    descAr: 'المد اللازم: سكون أو شدة بعد حرف المد في كلمة',
  },
  waqf: {
    label: 'Waqf', arabic: 'علامات الوقف', category: 'waqf', color: 'var(--tw-waqf)',
    duration: null, ghunnah: false, priority: 20, style: 'underline-solid',
    desc: 'Stopping signs: م obligatory, لا prohibited, ج permissible, ۛۛ stop at one only.',
    descAr: 'علامات الوقف والابتداء في المصحف',
  },
};

/** Alias kept for existing consumers. */
export const TAJWEED_RULES = RULE_DEFS;

/** Alias kept for existing consumers. */
export type RuleDefinition = TajweedRule;

/** Legend order (all 20 rules). */
export const RULE_ORDER: readonly TajweedRuleId[] = [
  'izhaar', 'ikhfaa', 'idghaam-ghunna', 'idghaam-bila-ghunna', 'iqlaab',
  'meem-ikhfaa', 'meem-idgham', 'ghunna', 'qalqalah', 'qalqalah-kubra',
  'lam-shamsi', 'lam-qamari', 'ra-tafkhim', 'ra-tarqeeq',
  'madd', 'madd-badal', 'madd-wajib', 'madd-jaiz', 'madd-lazim', 'waqf',
];

/** Sun letters — the article lam assimilates before these. */
export const SUN_LETTERS: ReadonlySet<string> = new Set([
  'ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن',
]);

/** Moon letters — the article lam stays clear before these. */
export const MOON_LETTERS: ReadonlySet<string> = new Set([
  'أ', 'إ', 'آ', 'ٱ', 'ء', 'ب', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك', 'م', 'ه', 'و', 'ي', 'ى', 'ئ', 'ؤ',
]);

/** Category display order + labels for the grouped legend. */
export const RULE_CATEGORIES: readonly { id: RuleCategory; label: string }[] = [
  { id: 'noon', label: 'Noon & Tanween' },
  { id: 'meem', label: 'Meem' },
  { id: 'ghunna', label: 'Ghunna' },
  { id: 'qalqalah', label: 'Qalqalah' },
  { id: 'lam', label: 'Lam' },
  { id: 'ra', label: 'Ra' },
  { id: 'madd', label: 'Madd' },
  { id: 'waqf', label: 'Waqf' },
];
