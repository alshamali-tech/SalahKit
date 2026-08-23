/**
 * The 99 Names of Allah (Asma ul-Husna) with meanings (S3: names-data.ts).
 * Static, public-domain dataset. Pure TypeScript — no framework imports.
 */
import type { DivineName } from './types';

/** Complete list of the 99 Names, in traditional order. */
export const DIVINE_NAMES: readonly DivineName[] = [
  { n: 1, arabic: 'الرَّحْمَنُ', transliteration: 'Ar-Rahman', meaning: 'The Entirely Merciful' },
  { n: 2, arabic: 'الرَّحِيمُ', transliteration: 'Ar-Raheem', meaning: 'The Especially Merciful' },
  { n: 3, arabic: 'الْمَلِكُ', transliteration: 'Al-Malik', meaning: 'The King' },
  { n: 4, arabic: 'الْقُدُّوسُ', transliteration: 'Al-Quddus', meaning: 'The Most Holy' },
  { n: 5, arabic: 'السَّلَامُ', transliteration: 'As-Salam', meaning: 'The Source of Peace' },
  { n: 6, arabic: 'الْمُؤْمِنُ', transliteration: "Al-Mu'min", meaning: 'The Grantor of Security' },
  { n: 7, arabic: 'الْمُهَيْمِنُ', transliteration: 'Al-Muhaymin', meaning: 'The Protector' },
  { n: 8, arabic: 'الْعَزِيزُ', transliteration: 'Al-Aziz', meaning: 'The Almighty' },
  { n: 9, arabic: 'الْجَبَّارُ', transliteration: 'Al-Jabbar', meaning: 'The Compeller' },
  { n: 10, arabic: 'الْمُتَكَبِّرُ', transliteration: 'Al-Mutakabbir', meaning: 'The Supreme' },
  { n: 11, arabic: 'الْخَالِقُ', transliteration: 'Al-Khaliq', meaning: 'The Creator' },
  { n: 12, arabic: 'الْبَارِئُ', transliteration: "Al-Bari'", meaning: 'The Originator' },
  { n: 13, arabic: 'الْمُصَوِّرُ', transliteration: 'Al-Musawwir', meaning: 'The Fashioner' },
  { n: 14, arabic: 'الْغَفَّارُ', transliteration: 'Al-Ghaffar', meaning: 'The All-Forgiving' },
  { n: 15, arabic: 'الْقَهَّارُ', transliteration: 'Al-Qahhar', meaning: 'The Subduer' },
  { n: 16, arabic: 'الْوَهَّابُ', transliteration: 'Al-Wahhab', meaning: 'The Bestower' },
  { n: 17, arabic: 'الرَّزَّاقُ', transliteration: 'Ar-Razzaq', meaning: 'The Provider' },
  { n: 18, arabic: 'الْفَتَّاحُ', transliteration: 'Al-Fattah', meaning: 'The Opener' },
  { n: 19, arabic: 'الْعَلِيمُ', transliteration: 'Al-Alim', meaning: 'The All-Knowing' },
  { n: 20, arabic: 'الْقَابِضُ', transliteration: 'Al-Qabid', meaning: 'The Withholder' },
  { n: 21, arabic: 'الْبَاسِطُ', transliteration: 'Al-Basit', meaning: 'The Extender' },
  { n: 22, arabic: 'الْخَافِضُ', transliteration: 'Al-Khafid', meaning: 'The Abaser' },
  { n: 23, arabic: 'الرَّافِعُ', transliteration: "Ar-Rafi'", meaning: 'The Exalter' },
  { n: 24, arabic: 'الْمُعِزُّ', transliteration: "Al-Mu'izz", meaning: 'The Bestower of Honor' },
  { n: 25, arabic: 'الْمُذِلُّ', transliteration: 'Al-Mudhill', meaning: 'The Humiliator' },
  { n: 26, arabic: 'السَّمِيعُ', transliteration: "As-Sami'", meaning: 'The All-Hearing' },
  { n: 27, arabic: 'الْبَصِيرُ', transliteration: 'Al-Basir', meaning: 'The All-Seeing' },
  { n: 28, arabic: 'الْحَكَمُ', transliteration: 'Al-Hakam', meaning: 'The Judge' },
  { n: 29, arabic: 'الْعَدْلُ', transliteration: 'Al-Adl', meaning: 'The Utterly Just' },
  { n: 30, arabic: 'اللَّطِيفُ', transliteration: 'Al-Latif', meaning: 'The Subtle One' },
  { n: 31, arabic: 'الْخَبِيرُ', transliteration: 'Al-Khabir', meaning: 'The All-Aware' },
  { n: 32, arabic: 'الْحَلِيمُ', transliteration: 'Al-Halim', meaning: 'The Forbearing' },
  { n: 33, arabic: 'الْعَظِيمُ', transliteration: 'Al-Azim', meaning: 'The Magnificent' },
  { n: 34, arabic: 'الْغَفُورُ', transliteration: 'Al-Ghafur', meaning: 'The Forgiving' },
  { n: 35, arabic: 'الشَّكُورُ', transliteration: 'Ash-Shakur', meaning: 'The Appreciative' },
  { n: 36, arabic: 'الْعَلِيُّ', transliteration: 'Al-Aliyy', meaning: 'The Most High' },
  { n: 37, arabic: 'الْكَبِيرُ', transliteration: 'Al-Kabir', meaning: 'The Most Great' },
  { n: 38, arabic: 'الْحَفِيظُ', transliteration: 'Al-Hafiz', meaning: 'The Preserver' },
  { n: 39, arabic: 'الْمُقِيتُ', transliteration: 'Al-Muqit', meaning: 'The Sustainer' },
  { n: 40, arabic: 'الْحَسِيبُ', transliteration: 'Al-Hasib', meaning: 'The Reckoner' },
  { n: 41, arabic: 'الْجَلِيلُ', transliteration: 'Al-Jalil', meaning: 'The Majestic' },
  { n: 42, arabic: 'الْكَرِيمُ', transliteration: 'Al-Karim', meaning: 'The Most Generous' },
  { n: 43, arabic: 'الرَّقِيبُ', transliteration: 'Ar-Raqib', meaning: 'The Watchful' },
  { n: 44, arabic: 'الْمُجِيبُ', transliteration: 'Al-Mujib', meaning: 'The Responsive' },
  { n: 45, arabic: 'الْوَاسِعُ', transliteration: "Al-Wasi'", meaning: 'The All-Encompassing' },
  { n: 46, arabic: 'الْحَكِيمُ', transliteration: 'Al-Hakim', meaning: 'The All-Wise' },
  { n: 47, arabic: 'الْوَدُودُ', transliteration: 'Al-Wadud', meaning: 'The Most Loving' },
  { n: 48, arabic: 'الْمَجِيدُ', transliteration: 'Al-Majid', meaning: 'The Glorious' },
  { n: 49, arabic: 'الْبَاعِثُ', transliteration: "Al-Ba'ith", meaning: 'The Resurrector' },
  { n: 50, arabic: 'الشَّهِيدُ', transliteration: 'Ash-Shahid', meaning: 'The Witness' },
  { n: 51, arabic: 'الْحَقُّ', transliteration: 'Al-Haqq', meaning: 'The Truth' },
  { n: 52, arabic: 'الْوَكِيلُ', transliteration: 'Al-Wakil', meaning: 'The Trustee' },
  { n: 53, arabic: 'الْقَوِيُّ', transliteration: 'Al-Qawiyy', meaning: 'The Most Strong' },
  { n: 54, arabic: 'الْمَتِينُ', transliteration: 'Al-Matin', meaning: 'The Firm One' },
  { n: 55, arabic: 'الْوَلِيُّ', transliteration: 'Al-Waliyy', meaning: 'The Protecting Friend' },
  { n: 56, arabic: 'الْحَمِيدُ', transliteration: 'Al-Hamid', meaning: 'The Praiseworthy' },
  { n: 57, arabic: 'الْمُحْصِي', transliteration: 'Al-Muhsi', meaning: 'The All-Counting' },
  { n: 58, arabic: 'الْمُبْدِئُ', transliteration: "Al-Mubdi'", meaning: 'The Originator' },
  { n: 59, arabic: 'الْمُعِيدُ', transliteration: "Al-Mu'id", meaning: 'The Restorer' },
  { n: 60, arabic: 'الْمُحْيِي', transliteration: 'Al-Muhyi', meaning: 'The Giver of Life' },
  { n: 61, arabic: 'الْمُمِيتُ', transliteration: 'Al-Mumit', meaning: 'The Bringer of Death' },
  { n: 62, arabic: 'الْحَيُّ', transliteration: 'Al-Hayy', meaning: 'The Ever-Living' },
  { n: 63, arabic: 'الْقَيُّومُ', transliteration: 'Al-Qayyum', meaning: 'The Self-Sustaining' },
  { n: 64, arabic: 'الْوَاجِدُ', transliteration: 'Al-Wajid', meaning: 'The Perceiver' },
  { n: 65, arabic: 'الْمَاجِدُ', transliteration: 'Al-Majid', meaning: 'The Illustrious' },
  { n: 66, arabic: 'الْوَاحِدُ', transliteration: 'Al-Wahid', meaning: 'The One' },
  { n: 67, arabic: 'الْأَحَدُ', transliteration: 'Al-Ahad', meaning: 'The Unique' },
  { n: 68, arabic: 'الصَّمَدُ', transliteration: 'As-Samad', meaning: 'The Self-Sufficient' },
  { n: 69, arabic: 'الْقَادِرُ', transliteration: 'Al-Qadir', meaning: 'The Capable' },
  { n: 70, arabic: 'الْمُقْتَدِرُ', transliteration: 'Al-Muqtadir', meaning: 'The Powerful' },
  { n: 71, arabic: 'الْمُقَدِّمُ', transliteration: 'Al-Muqaddim', meaning: 'The Expediter' },
  { n: 72, arabic: 'الْمُؤَخِّرُ', transliteration: "Al-Mu'akhkhir", meaning: 'The Delayer' },
  { n: 73, arabic: 'الْأَوَّلُ', transliteration: 'Al-Awwal', meaning: 'The First' },
  { n: 74, arabic: 'الْآخِرُ', transliteration: 'Al-Akhir', meaning: 'The Last' },
  { n: 75, arabic: 'الظَّاهِرُ', transliteration: 'Az-Zahir', meaning: 'The Manifest' },
  { n: 76, arabic: 'الْبَاطِنُ', transliteration: 'Al-Batin', meaning: 'The Hidden' },
  { n: 77, arabic: 'الْوَالِي', transliteration: 'Al-Wali', meaning: 'The Governor' },
  { n: 78, arabic: 'الْمُتَعَالِي', transliteration: "Al-Muta'ali", meaning: 'The Most Exalted' },
  { n: 79, arabic: 'الْبَرُّ', transliteration: 'Al-Barr', meaning: 'The Source of Goodness' },
  { n: 80, arabic: 'التَّوَّابُ', transliteration: 'At-Tawwab', meaning: 'The Acceptor of Repentance' },
  { n: 81, arabic: 'الْمُنْتَقِمُ', transliteration: 'Al-Muntaqim', meaning: 'The Avenger' },
  { n: 82, arabic: 'الْعَفُوُّ', transliteration: 'Al-Afuww', meaning: 'The Pardoner' },
  { n: 83, arabic: 'الرَّءُوفُ', transliteration: "Ar-Ra'uf", meaning: 'The Most Kind' },
  { n: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Malik-ul-Mulk', meaning: 'Master of the Kingdom' },
  { n: 85, arabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', transliteration: 'Dhul-Jalali wal-Ikram', meaning: 'Lord of Majesty and Generosity' },
  { n: 86, arabic: 'الْمُقْسِطُ', transliteration: 'Al-Muqsit', meaning: 'The Equitable' },
  { n: 87, arabic: 'الْجَامِعُ', transliteration: "Al-Jami'", meaning: 'The Gatherer' },
  { n: 88, arabic: 'الْغَنِيُّ', transliteration: 'Al-Ghaniyy', meaning: 'The Self-Sufficient' },
  { n: 89, arabic: 'الْمُغْنِي', transliteration: 'Al-Mughni', meaning: 'The Enricher' },
  { n: 90, arabic: 'الْمَانِعُ', transliteration: "Al-Mani'", meaning: 'The Preventer' },
  { n: 91, arabic: 'الضَّارُّ', transliteration: 'Ad-Darr', meaning: 'The Distresser' },
  { n: 92, arabic: 'النَّافِعُ', transliteration: "An-Nafi'", meaning: 'The Propitious' },
  { n: 93, arabic: 'النُّورُ', transliteration: 'An-Nur', meaning: 'The Light' },
  { n: 94, arabic: 'الْهَادِي', transliteration: 'Al-Hadi', meaning: 'The Guide' },
  { n: 95, arabic: 'الْبَدِيعُ', transliteration: "Al-Badi'", meaning: 'The Incomparable' },
  { n: 96, arabic: 'الْبَاقِي', transliteration: 'Al-Baqi', meaning: 'The Ever-Enduring' },
  { n: 97, arabic: 'الْوَارِثُ', transliteration: 'Al-Warith', meaning: 'The Inheritor' },
  { n: 98, arabic: 'الرَّشِيدُ', transliteration: 'Ar-Rashid', meaning: 'The Guide to the Right Path' },
  { n: 99, arabic: 'الصَّبُورُ', transliteration: 'As-Sabur', meaning: 'The Most Patient' },
];

/**
 * Searches the names by transliteration or meaning (case-insensitive).
 * @param query - Search text.
 * @returns Matching names; all 99 when query is empty.
 */
export function searchDivineNames(query: string): readonly DivineName[] {
  const q = query.trim().toLowerCase();
  if (q === '') return DIVINE_NAMES;
  return DIVINE_NAMES.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(q) ||
      n.meaning.toLowerCase().includes(q) ||
      n.arabic.includes(q)
  );
}
