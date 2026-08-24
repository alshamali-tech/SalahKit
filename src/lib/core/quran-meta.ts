/**
 * Metadata for all 114 surahs (names, meanings, ayah counts,
 * revelation place). Static dataset so the picker works fully offline;
 * verse text streams via lib/external/quran.ts and caches permanently.
 * Pure TypeScript - no framework imports.
 */
import type { Revelation } from '../../types';

/** Compact row: [num, arabicName, name, meaning, ayahCount, revelation]. */
type MetaRow = [number, string, string, string, number, Revelation];

/** Full ordered surah list. */
const ROWS: readonly MetaRow[] = [
  [1, 'الفاتحة', 'Al-Fatihah', 'The Opening', 7, 'Makkan'],
  [2, 'البقرة', 'Al-Baqarah', 'The Cow', 286, 'Madinan'],
  [3, 'آل عمران', 'Aal-E-Imran', 'The Family of Imran', 200, 'Madinan'],
  [4, 'النساء', 'An-Nisa', 'The Women', 176, 'Madinan'],
  [5, 'المائدة', "Al-Ma'idah", 'The Table Spread', 120, 'Madinan'],
  [6, 'الأنعام', "Al-An'am", 'The Cattle', 165, 'Makkan'],
  [7, 'الأعراف', "Al-A'raf", 'The Heights', 206, 'Makkan'],
  [8, 'الأنفال', 'Al-Anfal', 'The Spoils of War', 75, 'Madinan'],
  [9, 'التوبة', 'At-Tawbah', 'The Repentance', 129, 'Madinan'],
  [10, 'يونس', 'Yunus', 'Jonah', 109, 'Makkan'],
  [11, 'هود', 'Hud', 'Hud', 123, 'Makkan'],
  [12, 'يوسف', 'Yusuf', 'Joseph', 111, 'Makkan'],
  [13, 'الرعد', "Ar-Ra'd", 'The Thunder', 43, 'Madinan'],
  [14, 'إبراهيم', 'Ibrahim', 'Abraham', 52, 'Makkan'],
  [15, 'الحجر', 'Al-Hijr', 'The Rocky Tract', 99, 'Makkan'],
  [16, 'النحل', 'An-Nahl', 'The Bee', 128, 'Makkan'],
  [17, 'الإسراء', 'Al-Isra', 'The Night Journey', 111, 'Makkan'],
  [18, 'الكهف', 'Al-Kahf', 'The Cave', 110, 'Makkan'],
  [19, 'مريم', 'Maryam', 'Mary', 98, 'Makkan'],
  [20, 'طه', 'Ta-Ha', 'Ta-Ha', 135, 'Makkan'],
  [21, 'الأنبياء', 'Al-Anbiya', 'The Prophets', 112, 'Makkan'],
  [22, 'الحج', 'Al-Hajj', 'The Pilgrimage', 78, 'Madinan'],
  [23, 'المؤمنون', "Al-Mu'minun", 'The Believers', 118, 'Makkan'],
  [24, 'النور', 'An-Nur', 'The Light', 64, 'Madinan'],
  [25, 'الفرقان', 'Al-Furqan', 'The Criterion', 77, 'Makkan'],
  [26, 'الشعراء', "Ash-Shu'ara", 'The Poets', 227, 'Makkan'],
  [27, 'النمل', 'An-Naml', 'The Ant', 93, 'Makkan'],
  [28, 'القصص', 'Al-Qasas', 'The Stories', 88, 'Makkan'],
  [29, 'العنكبوت', 'Al-Ankabut', 'The Spider', 69, 'Makkan'],
  [30, 'الروم', 'Ar-Rum', 'The Romans', 60, 'Makkan'],
  [31, 'لقمان', 'Luqman', 'Luqman', 34, 'Makkan'],
  [32, 'السجدة', 'As-Sajdah', 'The Prostration', 30, 'Makkan'],
  [33, 'الأحزاب', 'Al-Ahzab', 'The Combined Forces', 73, 'Madinan'],
  [34, 'سبأ', 'Saba', 'Sheba', 54, 'Makkan'],
  [35, 'فاطر', 'Fatir', 'The Originator', 45, 'Makkan'],
  [36, 'يس', 'Ya-Sin', 'Ya-Sin', 83, 'Makkan'],
  [37, 'الصافات', 'As-Saffat', 'Those Ranged in Ranks', 182, 'Makkan'],
  [38, 'ص', 'Sad', 'The Letter Sad', 88, 'Makkan'],
  [39, 'الزمر', 'Az-Zumar', 'The Troops', 75, 'Makkan'],
  [40, 'غافر', 'Ghafir', 'The Forgiver', 85, 'Makkan'],
  [41, 'فصلت', 'Fussilat', 'Explained in Detail', 54, 'Makkan'],
  [42, 'الشورى', 'Ash-Shura', 'The Consultation', 53, 'Makkan'],
  [43, 'الزخرف', 'Az-Zukhruf', 'The Ornaments of Gold', 89, 'Makkan'],
  [44, 'الدخان', 'Ad-Dukhan', 'The Smoke', 59, 'Makkan'],
  [45, 'الجاثية', 'Al-Jathiyah', 'The Crouching', 37, 'Makkan'],
  [46, 'الأحقاف', 'Al-Ahqaf', 'The Wind-Curved Sandhills', 35, 'Makkan'],
  [47, 'محمد', 'Muhammad', 'Muhammad', 38, 'Madinan'],
  [48, 'الفتح', 'Al-Fath', 'The Victory', 29, 'Madinan'],
  [49, 'الحجرات', 'Al-Hujurat', 'The Rooms', 18, 'Madinan'],
  [50, 'ق', 'Qaf', 'The Letter Qaf', 45, 'Makkan'],
  [51, 'الذاريات', 'Adh-Dhariyat', 'The Winnowing Winds', 60, 'Makkan'],
  [52, 'الطور', 'At-Tur', 'The Mount', 49, 'Makkan'],
  [53, 'النجم', 'An-Najm', 'The Star', 62, 'Makkan'],
  [54, 'القمر', 'Al-Qamar', 'The Moon', 55, 'Makkan'],
  [55, 'الرحمن', 'Ar-Rahman', 'The Most Merciful', 78, 'Madinan'],
  [56, 'الواقعة', "Al-Waqi'ah", 'The Inevitable', 96, 'Makkan'],
  [57, 'الحديد', 'Al-Hadid', 'The Iron', 29, 'Madinan'],
  [58, 'المجادلة', 'Al-Mujadila', 'The Pleading Woman', 22, 'Madinan'],
  [59, 'الحشر', 'Al-Hashr', 'The Exile', 24, 'Madinan'],
  [60, 'الممتحنة', 'Al-Mumtahanah', 'She Who Is Examined', 13, 'Madinan'],
  [61, 'الصف', 'As-Saff', 'The Ranks', 14, 'Madinan'],
  [62, 'الجمعة', "Al-Jumu'ah", 'The Congregation', 11, 'Madinan'],
  [63, 'المنافقون', 'Al-Munafiqun', 'The Hypocrites', 11, 'Madinan'],
  [64, 'التغابن', 'At-Taghabun', 'The Mutual Disillusion', 18, 'Madinan'],
  [65, 'الطلاق', 'At-Talaq', 'The Divorce', 12, 'Madinan'],
  [66, 'التحريم', 'At-Tahrim', 'The Prohibition', 12, 'Madinan'],
  [67, 'الملك', 'Al-Mulk', 'The Sovereignty', 30, 'Makkan'],
  [68, 'القلم', 'Al-Qalam', 'The Pen', 52, 'Makkan'],
  [69, 'الحاقة', 'Al-Haqqah', 'The Reality', 52, 'Makkan'],
  [70, 'المعارج', "Al-Ma'arij", 'The Ascending Stairways', 44, 'Makkan'],
  [71, 'نوح', 'Nuh', 'Noah', 28, 'Makkan'],
  [72, 'الجن', 'Al-Jinn', 'The Jinn', 28, 'Makkan'],
  [73, 'المزمل', 'Al-Muzzammil', 'The Enshrouded One', 20, 'Makkan'],
  [74, 'المدثر', 'Al-Muddaththir', 'The Cloaked One', 56, 'Makkan'],
  [75, 'القيامة', 'Al-Qiyamah', 'The Resurrection', 40, 'Makkan'],
  [76, 'الإنسان', 'Al-Insan', 'The Man', 31, 'Madinan'],
  [77, 'المرسلات', 'Al-Mursalat', 'The Emissaries', 50, 'Makkan'],
  [78, 'النبأ', 'An-Naba', 'The Tidings', 40, 'Makkan'],
  [79, 'النازعات', "An-Nazi'at", 'Those Who Drag Forth', 46, 'Makkan'],
  [80, 'عبس', 'Abasa', 'He Frowned', 42, 'Makkan'],
  [81, 'التكوير', 'At-Takwir', 'The Overthrowing', 29, 'Makkan'],
  [82, 'الانفطار', 'Al-Infitar', 'The Cleaving', 19, 'Makkan'],
  [83, 'المطففين', 'Al-Mutaffifin', 'The Defrauding', 36, 'Makkan'],
  [84, 'الانشقاق', 'Al-Inshiqaq', 'The Sundering', 25, 'Makkan'],
  [85, 'البروج', 'Al-Buruj', 'The Mansions of Stars', 22, 'Makkan'],
  [86, 'الطارق', 'At-Tariq', 'The Nightcomer', 17, 'Makkan'],
  [87, 'الأعلى', "Al-A'la", 'The Most High', 19, 'Makkan'],
  [88, 'الغاشية', 'Al-Ghashiyah', 'The Overwhelming', 26, 'Makkan'],
  [89, 'الفجر', 'Al-Fajr', 'The Dawn', 30, 'Makkan'],
  [90, 'البلد', 'Al-Balad', 'The City', 20, 'Makkan'],
  [91, 'الشمس', 'Ash-Shams', 'The Sun', 15, 'Makkan'],
  [92, 'الليل', 'Al-Layl', 'The Night', 21, 'Makkan'],
  [93, 'الضحى', 'Ad-Duha', 'The Morning Hours', 11, 'Makkan'],
  [94, 'الشرح', 'Ash-Sharh', 'The Relief', 8, 'Makkan'],
  [95, 'التين', 'At-Tin', 'The Fig', 8, 'Makkan'],
  [96, 'العلق', 'Al-Alaq', 'The Clot', 19, 'Makkan'],
  [97, 'القدر', 'Al-Qadr', 'The Night of Decree', 5, 'Makkan'],
  [98, 'البينة', 'Al-Bayyinah', 'The Clear Proof', 8, 'Madinan'],
  [99, 'الزلزلة', 'Az-Zalzalah', 'The Earthquake', 8, 'Madinan'],
  [100, 'العاديات', 'Al-Adiyat', 'The Courser', 11, 'Makkan'],
  [101, 'القارعة', "Al-Qari'ah", 'The Calamity', 11, 'Makkan'],
  [102, 'التكاثر', 'At-Takathur', 'The Rivalry in Increase', 8, 'Makkan'],
  [103, 'العصر', 'Al-Asr', 'The Declining Day', 3, 'Makkan'],
  [104, 'الهمزة', 'Al-Humazah', 'The Slanderer', 9, 'Makkan'],
  [105, 'الفيل', 'Al-Fil', 'The Elephant', 5, 'Makkan'],
  [106, 'قريش', 'Quraysh', 'Quraysh', 4, 'Makkan'],
  [107, 'الماعون', "Al-Ma'un", 'The Small Kindnesses', 7, 'Makkan'],
  [108, 'الكوثر', 'Al-Kawthar', 'The Abundance', 3, 'Makkan'],
  [109, 'الكافرون', 'Al-Kafirun', 'The Disbelievers', 6, 'Makkan'],
  [110, 'النصر', 'An-Nasr', 'The Divine Support', 3, 'Madinan'],
  [111, 'المسد', 'Al-Masad', 'The Palm Fiber', 5, 'Makkan'],
  [112, 'الإخلاص', 'Al-Ikhlas', 'The Sincerity', 4, 'Makkan'],
  [113, 'الفلق', 'Al-Falaq', 'The Daybreak', 5, 'Makkan'],
  [114, 'الناس', 'An-Nas', 'Mankind', 6, 'Makkan'],
];

/** Surah metadata for the picker (all 114). */
export interface SurahInfo {
  num: number;
  nameArabic: string;
  name: string;
  meaning: string;
  ayahCount: number;
  revelation: Revelation;
}

export const ALL_SURAHS: readonly SurahInfo[] = ROWS.map(
  ([num, nameArabic, name, meaning, ayahCount, revelation]) => ({
    num,
    nameArabic,
    name,
    meaning,
    ayahCount,
    revelation,
  })
);

/**
 * Looks up surah metadata by number.
 * @param num - Surah number 1-114.
 * @returns The metadata row.
 * @throws Error for out-of-range numbers.
 */
export function getSurahInfo(num: number): SurahInfo {
  const info = ALL_SURAHS[num - 1];
  if (!info) throw new Error(`SalahKit: unknown surah number ${num}.`);
  return info;
}

/**
 * Searches surahs by number, name or meaning.
 * @param query - Search text.
 * @returns Matching surahs in canonical order.
 */
export function searchSurahs(query: string): readonly SurahInfo[] {
  const q = query.trim().toLowerCase();
  if (q === '') return ALL_SURAHS;
  const asNum = Number(q);
  return ALL_SURAHS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.meaning.toLowerCase().includes(q) ||
      s.nameArabic.includes(q) ||
      (Number.isInteger(asNum) && s.num === asNum)
  );
}

/**
 * Whether the Basmala is displayed above this surah's verses
 * (absent for Al-Fatihah, where it is ayah 1, and At-Tawbah).
 * @param num - Surah number.
 * @returns True when the Basmala header applies.
 */
export function showsBasmala(num: number): boolean {
  return num !== 1 && num !== 9;
}
