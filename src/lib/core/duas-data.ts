/**
 * Daily adhkar and duas dataset (S3: duas-data.ts).
 * Sources: Quran and Sahih hadith collections (public domain).
 * Pure TypeScript — no framework imports.
 */
import type { Dua, DuaCategory } from './types';

/** Curated set of authentic daily adhkar and duas. */
export const DUAS: readonly Dua[] = [
  {
    id: 'ayat-al-kursi', category: 'morning', repeat: 1, source: 'Quran 2:255',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu la ilaha illa Huwa al-Hayy al-Qayyum, la ta'khudhuhu sinatun wa la nawm...",
    translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all. Neither drowsiness overtakes Him nor sleep...',
  },
  {
    id: 'morning-kingdom', category: 'morning', repeat: 1, source: 'Abu Dawud',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation: 'We have reached the morning and the kingdom has reached Allah. Praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
  },
  {
    id: 'morning-by-you', category: 'morning', repeat: 1, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namut, wa ilayka an-nushur",
    translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
  },
  {
    id: 'morning-praise-100', category: 'morning', repeat: 100, source: 'Muslim',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdih',
    translation: 'Glory is to Allah and praise is to Him. Whoever says this a hundred times, his sins are erased even if like the foam of the sea.',
  },
  {
    id: 'morning-sufficiency', category: 'morning', repeat: 7, source: 'Abu Dawud',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "Hasbiyallahu la ilaha illa Huwa, alayhi tawakkaltu, wa Huwa Rabbul-arshil-azim",
    translation: 'Allah is sufficient for me. There is no deity except Him. Upon Him I rely, and He is Lord of the mighty Throne.',
  },
  {
    id: 'morning-protection', category: 'morning', repeat: 3, source: 'Abu Dawud, Tirmidhi',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i, wa Huwas-Sami'ul-Alim",
    translation: 'In the Name of Allah, with Whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
  },
  {
    id: 'evening-kingdom', category: 'evening', repeat: 1, source: 'Abu Dawud',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    translation: 'We have reached the evening and the kingdom has reached Allah. Praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
  },
  {
    id: 'evening-by-you', category: 'evening', repeat: 1, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namut, wa ilayka al-masir",
    translation: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
  },
  {
    id: 'sayyidul-istighfar', category: 'evening', repeat: 1, source: 'Bukhari',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wa'dika mastata'tu...",
    translation: 'O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can...',
  },
  {
    id: 'after-salam', category: 'salah', repeat: 3, source: 'Muslim',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek the forgiveness of Allah. (Said three times after concluding the prayer.)',
  },
  {
    id: 'you-are-peace', category: 'salah', repeat: 1, source: 'Muslim',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: "Allahumma Antas-Salam, wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram",
    translation: 'O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of Majesty and Generosity.',
  },
  {
    id: 'tasbih-33', category: 'salah', repeat: 33, source: 'Muslim',
    arabic: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ',
    transliteration: 'SubhanAllah, wal-hamdu lillah, wallahu Akbar',
    translation: 'Glory to Allah (33), praise to Allah (33), Allah is Greatest (33) - after each obligatory prayer.',
  },
  {
    id: 'before-eating', category: 'daily', repeat: 1, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ، بِسْمِ اللَّهِ',
    transliteration: "Allahumma barik lana fima razaqtana wa qina adhaban-nar, Bismillah",
    translation: 'O Allah, bless us in what You have provided for us and protect us from the punishment of the Fire. In the Name of Allah.',
  },
  {
    id: 'after-eating', category: 'daily', repeat: 1, source: 'Tirmidhi',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: 'Alhamdulillahil-ladhi at’amana wa saqana wa ja’alana muslimin',
    translation: 'Praise is to Allah Who has fed us and given us drink and made us Muslims.',
  },
  {
    id: 'leaving-home', category: 'daily', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "Bismillah, tawakkaltu alallah, wa la hawla wa la quwwata illa billah",
    translation: 'In the Name of Allah. I place my trust in Allah. There is no might nor power except with Allah.',
  },
  {
    id: 'entering-home', category: 'daily', repeat: 1, source: 'Abu Dawud',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa alallahi Rabbina tawakkalna",
    translation: 'In the Name of Allah we enter, in the Name of Allah we leave, and upon Allah our Lord we rely.',
  },
  {
    id: 'before-sleep', category: 'sleep', repeat: 1, source: 'Bukhari',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your Name, O Allah, I die and I live.',
  },
  {
    id: 'sleep-protection', category: 'sleep', repeat: 3, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allahumma qini adhabaka yawma tab'athu ibadak",
    translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
  },
  {
    id: 'waking-up', category: 'sleep', repeat: 1, source: 'Bukhari',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhi an-nushur",
    translation: 'Praise is to Allah Who has given us life after taking it from us, and to Him is the resurrection.',
  },
  {
    id: 'distress', category: 'daily', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "La ilaha illallahul-Azimul-Halim, la ilaha illallahu Rabbul-arshil-azim",
    translation: 'There is no deity except Allah, the Magnificent, the Forbearing. There is no deity except Allah, Lord of the mighty Throne.',
  },
];

/** Category labels for UI tabs. */
export const DUA_CATEGORY_LABELS: Readonly<Record<DuaCategory | 'all', string>> = {
  all: 'All',
  morning: 'Morning',
  evening: 'Evening',
  salah: 'After Salah',
  daily: 'Daily',
  sleep: 'Sleep',
};

/**
 * Filters duas by category.
 * @param category - Category to filter by, or 'all'.
 * @returns Matching duas in dataset order.
 */
export function getDuas(category: DuaCategory | 'all'): readonly Dua[] {
  if (category === 'all') return DUAS;
  return DUAS.filter((d) => d.category === category);
}
