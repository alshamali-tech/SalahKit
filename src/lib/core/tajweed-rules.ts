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
  | 'isti'
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
  | 'qalqalah-wusta'
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
  | 'ra-jawaz'
  | 'madd'
  | 'madd-badal'
  | 'madd-wajib'
  | 'madd-jaiz'
  | 'madd-lazim'
  | 'madd-arrid'
  | 'madd-leen'
  | 'madd-farq'
  | 'madd-silah-sughra'
  | 'madd-silah-kubra'
  | 'hamza-wasl'
  | 'istiala'
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
    desc: 'Clear noon/tanween before the six throat letters ء هـ ع ح غ خ. Also before an idghaam letter in the SAME word (الدُّنْيَا) — called izhār muṭlaq.',
    descAr: 'إظهار النون عند حروف الحلق، وعند حرف إدغام في كلمة واحدة (إظهار مطلق)',
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
    label: 'Qalqalah ṣughrā', arabic: 'قلقلة صغرى', category: 'qalqalah', color: 'var(--tw-qalqalah)',
    duration: null, ghunnah: false, priority: 50, style: 'recolor',
    desc: 'Lightest: a sākin ق ط ب ج د that is NOT a stopping place — mid-word (شَقَقْنَا) or word-end while continuing (قَدْ سَمِعَ). Letter strength: ṭā’ strongest, jīm/qāf middle, bā’/dāl lightest.',
    descAr: 'الصغرى: في الساكن غير الموقوف عليه — وسط الكلمة غالبًا (شَقَقْنَا، قَدْ سَمِعَ)',
  },
  'qalqalah-wusta': {
    label: 'Qalqalah wusṭā', arabic: 'قلقلة وسطى', category: 'qalqalah', color: 'var(--tw-qalqalah-wusta)',
    duration: null, ghunnah: false, priority: 54, style: 'recolor',
    desc: 'Middle: a sākin letter with NO shaddah that you STOP on at a word’s end — the ق of الْفَلَقِ, لَقَدْ.',
    descAr: 'الوسطى: في الساكن المُخَفَّف الموقوف عليه — آخر الكلمة غير مشدد (الْفَلَقِ، لَقَدْ)',
  },
  'qalqalah-kubra': {
    label: 'Qalqalah kubrā', arabic: 'قلقلة كبرى', category: 'qalqalah', color: 'var(--tw-qalqalah-kubra)',
    duration: null, ghunnah: false, priority: 56, style: 'recolor',
    desc: 'Strongest: a MUSHADDAH letter you STOP on at a word’s end — the بّ of وَتَبَّ, الْحَقُّ, الْحَجُّ. It is made of two merged letters, hence the clearest bounce.',
    descAr: 'الكبرى: في المشدَّد الموقوف عليه — آخر الكلمة مشددًا (وَتَبَّ، الْحَقُّ) — أبين لأنها من حرفين مدغمين',
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
  'ra-jawaz': {
    label: 'Ra — two faces', arabic: 'راء جواز الوجهين', category: 'ra', color: 'var(--tw-ra-jawaz)',
    duration: null, ghunnah: false, priority: 46, style: 'recolor',
    desc: 'Both heavy and light are permitted — e.g. فِرْقٍ (26:63) and مِصْرَ at waqf. Scholars prefer one face; either is valid.',
    descAr: 'جواز الوجهين في الراء نحو فِرْقٍ ومِصْرَ عند الوقف',
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
    label: 'Madd lāzim', arabic: 'مد لازم', category: 'madd', color: 'var(--tw-madd-lazim)',
    duration: 6, ghunnah: false, priority: 85, style: 'recolor',
    desc: 'Obligatory 6 counts. Kalimī: shaddah/sukūn after the madd in one word — الضَّالِّينَ (muthaqqal), دَابَّةٍ. Ḥarfī: fawātiḥ letters whose name is 3 letters with a madd in the middle — ص ن ق ع س ك ل م (الٓمٓ, مٓ, نٓ, صٓ). Letters spelled حا يا طا ها را take only 2 natural counts, and ا none; the engine reads the ٓ mark in the Uthmani text.',
    descAr: 'المد اللازم: ست حركات — كلمي (الضَّالِّينَ, دَابَّةٍ) أو حرفي في فواتح السور للحروف الثلاثية الوسط: ص ن ق ع س ك ل م',
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
  'madd-farq': {
    label: 'Madd farq', arabic: 'مد فرق', category: 'madd', color: 'var(--tw-madd-farq)',
    duration: 6, ghunnah: false, priority: 82, style: 'recolor',
    desc: 'A 6-count stretch that marks a QUESTION. Occurs in only 4 places: قُلْ آلذَّكَرَيْنِ (6:143-144), قُلْ آللَّهُ أَذِنَ لَكُمْ (10:59) and آلْآنَ (10:51, 10:91).',
    descAr: 'مد الفرق: ست حركات لتمييز الاستفهام — قُلْ آلذَّكَرَيْنِ، قُلْ آللَّهُ، آلْآنَ',
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
    desc: 'The small ٱ: pronounced only when starting, dropped in flow. Found in the article ال, certain nouns (اسم, ابن, امرأة), 5/6-letter past verbs and 3-letter imperatives. Its vowel when starting: kasra after a saakin, else from the word.',
    descAr: 'همزة الوصل: تنطق ابتداءً وتسقط وصلاً — في ال التعريف وأسماء والأفعال الخماسية والسداسية وأمر الثلاثي',
  },
  istiala: {
    label: 'Heavy letters (istiʿlāʾ)', arabic: 'حروف الاستعلاء', category: 'isti', color: 'var(--tw-istiala)',
    duration: null, ghunnah: false, priority: 35, style: 'recolor',
    desc: 'The seven letters خ ص ض غ ط ق ظ are ALWAYS pronounced heavy — lift the back of the tongue toward the palate. Strongest with fatha, then damma, then kasra (خُصَّ ضَغْطٍ قِظْ).',
    descAr: 'حروف الاستعلاء السبعة تُفخَّم دائمًا: خ ص ض غ ط ق ظ — ارفع أقصى اللسان نحو الحنك',
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
  'qalqalah', 'qalqalah-wusta', 'qalqalah-kubra',
  'idgham-mutamathil', 'idgham-mutajanis', 'idgham-mutaqarib',
  'lam-shamsi', 'lam-qamari', 'lam-allah-tafkhim', 'lam-allah-tarqeeq',
  'ra-tafkhim', 'ra-tarqeeq', 'ra-jawaz',
  'madd', 'madd-badal', 'madd-wajib', 'madd-jaiz', 'madd-lazim',
  'madd-arrid', 'madd-leen', 'madd-farq', 'madd-silah-sughra', 'madd-silah-kubra',
  'hamza-wasl', 'istiala', 'waqf',
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
  { id: 'isti', label: 'Heavy Letters' },
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

/** The seven isti'la letters — always heavy (خُصَّ ضَغْطٍ قِظْ). */
export const ISTIALA_LETTERS: ReadonlySet<string> = new Set([
  'خ', 'ص', 'ض', 'غ', 'ط', 'ق', 'ظ',
]);

/** The four agreed sakt positions in Hafs (brief pause, no breath). */
export const SAKT_POSITIONS: readonly string[] = [
  'عِوَجًا ۜ قَيِّمًا (Al-Kahf 18:1-2)',
  'مَرْقَدِنَا ۜ هَٰذَا (Ya-Sin 36:52)',
  'مَنْ ۜ رَاقٍ (Al-Qiyamah 75:27)',
  'كَلَّا ۜ بَلْ رَانَ (Al-Mutaffifin 83:14)',
];

/** A documented exception / special-case ayah. */
export interface TajweedException {
  /** Short reference, e.g. "10:91". */
  ref: string;
  /** The word or phrase involved. */
  word: string;
  /** Which rule is the exception to, or the special rule. */
  rule: TajweedRuleId;
  /** English explanation. */
  en: string;
  /** Arabic explanation. */
  ar: string;
}

/**
 * Special ayahs that deviate from the general rule and must be
 * memorised as exceptions (al-mustathnayāt). The engine detects what it
 * can programmatically; this table documents the rest for the learner.
 */
export const TAJWEED_EXCEPTIONS: readonly TajweedException[] = [
  {
    ref: '2:255 (Ayat al-Kursi)', word: 'الْحَيُّ الْقَيُّومُ', rule: 'madd-lazim',
    en: 'The doubled ي in الْحَيُّ and الْقَيُّومُ carries a shaddah after a madd letter — a 6-count madd lazim kalimi muthaqqal, not the usual 2 counts.',
    ar: 'الياء المشددة بعد حرف المد في الحيّ والقيوم مد لازم مثقل بست حركات',
  },
  {
    ref: '1:7', word: 'الضَّالِّينَ', rule: 'madd-lazim',
    en: 'A shaddah-ed lam follows the madd alif — 6 counts (muthaqqal). Classic example of madd lazim kalimi.',
    ar: 'اللام المشددة بعد الألف في الضالين مد لازم مثقل بست حركات',
  },
  {
    ref: '10:51, 10:91', word: 'آلْآنَ', rule: 'madd-farq',
    en: 'Madd farq (6 counts) distinguishes the question "Now?" from a statement. One of only 4 places in the Quran.',
    ar: 'مد الفرق في آلآن ست حركات لتمييز الاستفهام',
  },
  {
    ref: '6:143-144', word: 'قُلْ آلذَّكَرَيْنِ', rule: 'madd-farq',
    en: 'Madd farq (6 counts) marks the interrogative — without it the verse would read as a statement.',
    ar: 'مد الفرق في قل آلذكرين ست حركات لتمييز الاستفهام',
  },
  {
    ref: '10:59', word: 'قُلْ آللَّهُ أَذِنَ لَكُمْ', rule: 'madd-farq',
    en: 'Madd farq (6 counts) on the question "Has Allah permitted you?" — the fourth madd-farq position.',
    ar: 'مد الفرق في قل آلله أذن لكم ست حركات',
  },
  {
    ref: '2:125', word: 'وَإِذْ جَعَلْنَا', rule: 'ghunna',
    en: 'Words like إِذْ and إِذًا end in a saakin ذ, not a noon — no noon rules apply despite the similar shape.',
    ar: 'إذ تنتهي بذال ساكنة لا نون فلا تجري عليها أحكام النون',
  },
  {
    ref: '26:63', word: 'فِرْقٍ', rule: 'ra-jawaz',
    en: 'The ra is saakin after a kasra but followed by a heavy ق — both heavy and light are permitted (jawaz al-wajhayn).',
    ar: 'راء فِرْق ساكنة بعد كسر وبعدها قاف — يجوز فيها الوجهان',
  },
  {
    ref: '2:61', word: 'مِصْرَ', rule: 'ra-jawaz',
    en: 'At waqf, the ra of مِصْرَ follows a kasra but the word ends in a heavy context — both faces permitted, heavy preferred.',
    ar: 'راء مصر عند الوقف يجوز فيها الوجهان والتفخيم أولى',
  },
  {
    ref: '18:1, 36:52, 75:27, 83:14', word: 'ۜ (sakt sign)', rule: 'waqf',
    en: 'The small ص-like mark (ۜ) means a sakt: pause briefly WITHOUT breathing, then continue. Four agreed positions in Hafs.',
    ar: 'علامة السكت ۜ تعني وقفة يسيرة من غير تنفس في المواضع الأربعة',
  },
  {
    ref: '2:245, 57:11', word: 'يَبْسُطُ / بَصْطَةً', rule: 'istiala',
    en: 'The ص is written with a small ط-like shape in some mushafs but pronounced as a plain ص — do not add a qalqalah or extra heaviness.',
    ar: 'الصاد المهملة في يبصط وبصطة تلفظ صادًا عادية من غير قلقلة',
  },
];
