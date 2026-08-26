/**
 * Tajweed rule table — rule-as-data (blueprint §3.2).
 * Every rule is a structured record the engine interprets: trigger
 * category, harakah duration, ghunnah flag, conflict priority, render
 * style and bilingual descriptions. Colours are theme-aware tokens
 * (--tw-*) so contrast holds in light AND dark mode. Hafs 'an 'Asim.
 */

/** Top-level rule buckets for grouping in the UI. */
export type RuleCategory =
  | 'noon'
  | 'meem'
  | 'ghunna'
  | 'qalqalah'
  | 'idgham'
  | 'lam'
  | 'ra'
  | 'madd'
  | 'hamza'
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
  | 'izhaar-shafawi'
  | 'ghunna'
  | 'qalqalah'
  | 'qalqalah-kubra'
  | 'idgham-mutamathil'
  | 'idgham-mutajanis'
  | 'idgham-mutaqarib'
  | 'lam-shamsi'
  | 'lam-qamari'
  | 'lam-allah-tafkhim'
  | 'lam-allah-tarqeeq'
  | 'ra-tafkhim'
  | 'ra-tarqeeq'
  | 'madd'
  | 'madd-badal'
  | 'madd-wajib'
  | 'madd-jaiz'
  | 'madd-lazim'
  | 'madd-arrid'
  | 'madd-leen'
  | 'madd-silah-sughra'
  | 'madd-silah-kubra'
  | 'hamza-wasl'
  | 'waqf';

/** Render treatment: recolour the glyphs, or keep ink + underline. */
export type RuleStyle = 'recolor' | 'underline-wavy' | 'underline-solid';

/** One structured rule definition. */
export interface TajweedRule {
  label: string;
  arabic: string;
  category: RuleCategory;
  /** Theme-aware colour token (resolves per data-theme). */
  color: string;
  /** Hold duration in harakahs, null when not a timed rule. */
  duration: number | null;
  /** Whether a 2-count nasal hum is part of the rule. */
  ghunnah: boolean;
  /** Conflict priority — higher wins the colour (§5.3). */
  priority: number;
  style: RuleStyle;
  /** One-line recitation instruction (English). */
  desc: string;
  /** Short Arabic explanation. */
  descAr: string;
}

/** The full rule table, interpreted by the evaluator. */
export const TAJWEED_RULES: Readonly<Record<TajweedRuleId, TajweedRule>> = {
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
  'izhaar-shafawi': {
    label: 'Izhaar shafawi', arabic: 'إظهار شفوي', category: 'meem', color: 'var(--tw-izhaar-shafawi)',
    duration: null, ghunnah: false, priority: 55, style: 'recolor',
    desc: 'Meem sakinah before any letter but ب or م is clear — take extra care before ف and و.',
    descAr: 'إظهار الميم الساكنة عند غير الباء والميم',
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
    desc: 'Light bounce on a saakin ق ط ب ج د when you continue reciting (mid-word or mid-ayah).',
    descAr: 'قلقلة خفيفة عند سكون أحد حروف قطب جد مع الوصل',
  },
  'qalqalah-kubra': {
    label: 'Qalqalah kubra', arabic: 'قلقلة كبرى', category: 'qalqalah', color: 'var(--tw-qalqalah-kubra)',
    duration: null, ghunnah: false, priority: 56, style: 'recolor',
    desc: 'Strong bounce when you STOP on a qalqalah letter — end of ayah or at a waqf sign.',
    descAr: 'قلقلة قوية عند الوقف على أحد حروف قطب جد',
  },
  'idgham-mutamathil': {
    label: 'Idghaam mutamathilayn', arabic: 'إدغام متماثلين', category: 'idgham', color: 'var(--tw-idgham-mutamathil)',
    duration: 2, ghunnah: true, priority: 68, style: 'recolor',
    desc: 'Two identical letters meet: the first saakin merges into the second (اضْرِب بِّعَصَاكَ).',
    descAr: 'إدغام الحرفين المتماثلين: ساكن فمتحرك',
  },
  'idgham-mutajanis': {
    label: 'Idghaam mutajanisayn', arabic: 'إدغام متجانسين', category: 'idgham', color: 'var(--tw-idgham-mutajanis)',
    duration: 2, ghunnah: true, priority: 68, style: 'recolor',
    desc: 'Two letters of the same makhraj merge: د→ت, ذ→ظ, ت→ط (قَدْ تَّبَيَّنَ).',
    descAr: 'إدغام الحرفين المتجانسين من مخرج واحد',
  },
  'idgham-mutaqarib': {
    label: 'Idghaam mutaqaribayn', arabic: 'إدغام متقاربين', category: 'idgham', color: 'var(--tw-idgham-mutaqarib)',
    duration: 2, ghunnah: true, priority: 68, style: 'recolor',
    desc: 'Two letters of neighbouring makhraj merge: ل→ر, ق→ك, ب→م (قُل رَّبِّ).',
    descAr: 'إدغام الحرفين المتقاربين في المخرج',
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
  'lam-allah-tafkhim': {
    label: 'Lam of Allah — heavy', arabic: 'تفخيم لام الجلالة', category: 'lam', color: 'var(--tw-lam-allah-tafkhim)',
    duration: null, ghunnah: false, priority: 72, style: 'recolor',
    desc: 'The Name of Allah after a fatha or damma is pronounced heavy (شَهِدَ اللَّهُ).',
    descAr: 'تفخيم لام لفظ الجلالة بعد فتح أو ضم',
  },
  'lam-allah-tarqeeq': {
    label: 'Lam of Allah — light', arabic: 'ترقيق لام الجلالة', category: 'lam', color: 'var(--tw-lam-allah-tarqeeq)',
    duration: null, ghunnah: false, priority: 72, style: 'recolor',
    desc: 'The Name of Allah after a kasra is pronounced light (بِسْمِ اللَّهِ).',
    descAr: 'ترقيق لام لفظ الجلالة بعد كسر',
  },
  'ra-tafkhim': {
    label: 'Ra tafkhim', arabic: 'تفخيم الراء', category: 'ra', color: 'var(--tw-ra-tafkhim)',
    duration: null, ghunnah: false, priority: 45, style: 'recolor',
    desc: 'Heavy ra: carries fatha/damma, or is saakin after fatha/damma, or before an isti’la letter.',
    descAr: 'تفخيم الراء عند الفتح أو الضم',
  },
  'ra-tarqeeq': {
    label: 'Ra tarqeeq', arabic: 'ترقيق الراء', category: 'ra', color: 'var(--tw-ra-tarqeeq)',
    duration: null, ghunnah: false, priority: 45, style: 'recolor',
    desc: 'Light ra: carries kasra, or is saakin after kasra / ya sakinah (رِحْلَةَ).',
    descAr: 'ترقيق الراء عند الكسر',
  },
  madd: {
    label: 'Madd tabee’i', arabic: 'مد طبيعي', category: 'madd', color: 'var(--tw-madd)',
    duration: 2, ghunnah: false, priority: 30, style: 'recolor',
    desc: 'Natural 2-count stretch: alif after fatha, ya after kasra, waw after damma (قَالَ).',
    descAr: 'المد الطبيعي بمقدار حركتين',
  },
  'madd-badal': {
    label: 'Madd badal', arabic: 'مد بدل', category: 'madd', color: 'var(--tw-madd-badal)',
    duration: 2, ghunnah: false, priority: 40, style: 'recolor',
    desc: 'A madd letter that follows a hamza — it replaced a second hamza (آمَنُوا، أُوتُوا): 2 counts.',
    descAr: 'مد البدل: همزة قبل حرف المد بمقدار حركتين',
  },
  'madd-wajib': {
    label: 'Madd wajib', arabic: 'مد واجب متصل', category: 'madd', color: 'var(--tw-madd-wajib)',
    duration: 4, ghunnah: false, priority: 80, style: 'recolor',
    desc: 'Madd letter + hamza in the SAME word (جَاءَ، السَّمَاءَ) — obligatory 4–5 counts.',
    descAr: 'المد الواجب المتصل: الهمز بعد حرف المد في كلمة واحدة',
  },
  'madd-jaiz': {
    label: 'Madd jaiz', arabic: 'مد جائز منفصل', category: 'madd', color: 'var(--tw-madd-jaiz)',
    duration: 4, ghunnah: false, priority: 78, style: 'recolor',
    desc: 'Madd letter ends a word, hamza starts the next (يَا أَيُّهَا) — 2 to 5 counts.',
    descAr: 'المد الجائز المنفصل: الهمز في كلمة بعد حرف المد',
  },
  'madd-lazim': {
    label: 'Madd lazim', arabic: 'مد لازم', category: 'madd', color: 'var(--tw-madd-lazim)',
    duration: 6, ghunnah: false, priority: 85, style: 'recolor',
    desc: 'Madd letter followed by shaddah/sukun in one word (دَابَّةٍ، الضَّالِّينَ) — a full 6 counts.',
    descAr: 'المد اللازم: سكون أو شدة بعد حرف المد في كلمة',
  },
  'madd-arrid': {
    label: 'Madd arid', arabic: 'مد عارض للسكون', category: 'madd', color: 'var(--tw-madd-arrid)',
    duration: 4, ghunnah: false, priority: 77, style: 'recolor',
    desc: 'Stopping turns the final vowel into a temporary sukun — stretch the madd before it 2, 4 or 6 (نَسْتَعِينُ→نَسْتَعِينْ).',
    descAr: 'المد العارض للسكون عند الوقف',
  },
  'madd-leen': {
    label: 'Madd leen', arabic: 'مد لين', category: 'madd', color: 'var(--tw-madd-leen)',
    duration: 2, ghunnah: false, priority: 42, style: 'recolor',
    desc: 'Soft saakin و/ي after a fatha when you stop (خَوْفٍ، بَيْتٍ) — stretch gently 2, 4 or 6.',
    descAr: 'مد اللين: واو أو ياء ساكنتان بعد فتح عند الوقف',
  },
  'madd-silah-sughra': {
    label: 'Madd silah sughra', arabic: 'مد صلة صغرى', category: 'madd', color: 'var(--tw-madd-silah-sughra)',
    duration: 2, ghunnah: false, priority: 44, style: 'recolor',
    desc: 'The pronoun هُ/هِ between voweled letters, no hamza after — a small 2-count hum (لَهُ مَا).',
    descAr: 'مد الصلة الصغرى في هاء الضمير',
  },
  'madd-silah-kubra': {
    label: 'Madd silah kubra', arabic: 'مد صلة كبرى', category: 'madd', color: 'var(--tw-madd-silah-kubra)',
    duration: 4, ghunnah: false, priority: 79, style: 'recolor',
    desc: 'The pronoun هُ followed by a word starting with hamza — 4–5 counts (عِنْدَهُ إِلَّا).',
    descAr: 'مد الصلة الكبرى: هاء الضمير قبل همزة',
  },
  'hamza-wasl': {
    label: 'Hamzat al-wasl', arabic: 'همزة الوصل', category: 'hamza', color: 'var(--tw-hamza-wasl)',
    duration: null, ghunnah: false, priority: 15, style: 'recolor',
    desc: 'The small ٱ: pronounced when starting, dropped when the word flows from the previous one.',
    descAr: 'همزة الوصل: تنطق ابتداءً وتسقط وصلاً',
  },
  waqf: {
    label: 'Waqf', arabic: 'علامات الوقف', category: 'waqf', color: 'var(--tw-waqf)',
    duration: null, ghunnah: false, priority: 20, style: 'underline-solid',
    desc: 'Stopping signs: م obligatory, لا prohibited, ج permissible, ۛۛ stop at one only.',
    descAr: 'علامات الوقف والابتداء في المصحف',
  },
};

/** Rule ids in canonical display order. */
export const RULE_ORDER: readonly TajweedRuleId[] = [
  'izhaar', 'ikhfaa', 'idghaam-ghunna', 'idghaam-bila-ghunna', 'iqlaab',
  'meem-ikhfaa', 'meem-idgham', 'izhaar-shafawi', 'ghunna',
  'qalqalah', 'qalqalah-kubra',
  'idgham-mutamathil', 'idgham-mutajanis', 'idgham-mutaqarib',
  'lam-shamsi', 'lam-qamari', 'lam-allah-tafkhim', 'lam-allah-tarqeeq',
  'ra-tafkhim', 'ra-tarqeeq',
  'madd', 'madd-badal', 'madd-wajib', 'madd-jaiz', 'madd-lazim',
  'madd-arrid', 'madd-leen', 'madd-silah-sughra', 'madd-silah-kubra',
  'hamza-wasl', 'waqf',
];

/** Category display order + labels for the grouped legend. */
export const RULE_CATEGORIES: readonly { id: RuleCategory; label: string }[] = [
  { id: 'noon', label: 'Noon & Tanween' },
  { id: 'meem', label: 'Meem' },
  { id: 'ghunna', label: 'Ghunna' },
  { id: 'qalqalah', label: 'Qalqalah' },
  { id: 'idgham', label: 'Letter Idghaam' },
  { id: 'lam', label: 'Lam' },
  { id: 'ra', label: 'Ra' },
  { id: 'madd', label: 'Madd' },
  { id: 'hamza', label: 'Hamza' },
  { id: 'waqf', label: 'Waqf' },
];

/** Sun letters — the article lam assimilates before these. */
export const SUN_LETTERS: ReadonlySet<string> = new Set([
  'ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن',
]);

/** Moon letters — the article lam stays clear before these. */
export const MOON_LETTERS: ReadonlySet<string> = new Set([
  'أ', 'إ', 'آ', 'ٱ', 'ء', 'ب', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك', 'م', 'ه', 'و', 'ي', 'ى', 'ئ', 'ؤ',
]);

/** Mutajanisayn pairs (same makhraj): first saakin merges into second. */
export const MUTAJANIS_PAIRS: Readonly<Record<string, string>> = {
  د: 'ت', ذ: 'ظ', ت: 'ط',
};

/** Mutaqaribayn pairs (neighbouring makhraj). */
export const MUTAQARIB_PAIRS: Readonly<Record<string, string>> = {
  ل: 'ر', ق: 'ك', ب: 'م',
};
