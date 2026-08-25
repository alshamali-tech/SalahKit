/**
 * Duas of the home, ablution, masjid, clothing and daily comings and
 * goings (Hisnul Muslim). Public-domain texts with sources.
 */
import type { Dua } from '../types';

/** Duas for entering and leaving places and states of purity. */
export const HOME_DUAS: readonly Dua[] = [
  {
    id: 'h-toilet-in', category: 'home', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: "Bismillah. Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith",
    translation: 'In the Name of Allah. O Allah, I seek refuge in You from male and female evil spirits. (Before entering the toilet)',
  },
  {
    id: 'h-toilet-out', category: 'home', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'غُفْرَانَكَ',
    transliteration: 'Ghufranak',
    translation: 'I seek Your forgiveness. (After leaving the toilet)',
  },
  {
    id: 'h-wudu-before', category: 'home', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the Name of Allah. (Before ablution — there is no valid wudu for one who does not mention Allah’s Name)',
  },
  {
    id: 'h-wudu-after', category: 'home', repeat: 1, source: 'Muslim, Tirmidhi',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ، وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    transliteration: "Ash-hadu an la ilaha illallahu wahdahu la sharika lah, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh. Allahumma-j'alni minat-tawwabina, waj'alni minal-mutatahhirin",
    translation: 'I bear witness that there is no deity except Allah alone, without partner, and that Muhammad is His servant and Messenger. O Allah, make me of those who repent and those who purify themselves. (After ablution — the eight gates of Paradise are opened for him)',
  },
  {
    id: 'h-clothes', category: 'home', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَٰذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: "Alhamdulillahil-ladhi kasani hadhath-thawba wa razaqanihi min ghayri hawlin minni wa la quwwah",
    translation: 'Praise is to Allah Who has clothed me with this garment and provided it for me, with no power or might from myself. (When wearing clothes)',
  },
  {
    id: 'h-new-clothes', category: 'home', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ',
    transliteration: "Allahumma lakal-hamdu Anta kasawtanih, as'aluka min khayrihi wa khayri ma suni'a lah, wa a'udhu bika min sharrihi wa sharri ma suni'a lah",
    translation: 'O Allah, praise is to You — You have clothed me with it. I ask You for its good and the good for which it was made, and I seek refuge from its evil and the evil for which it was made. (New garment)',
  },
  {
    id: 'h-mirror', category: 'home', repeat: 1, source: 'Ahmad',
    arabic: 'اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
    transliteration: "Allahumma kama hassanta khalqi fa-hassin khuluqi",
    translation: 'O Allah, just as You have made my outward form beautiful, make my character beautiful. (Looking in the mirror)',
  },
  {
    id: 'h-leave-home', category: 'home', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah",
    translation: 'In the Name of Allah. I place my trust in Allah. There is no might nor power except with Allah. (Leaving home — it is said to him: you are guided, sufficed and protected)',
  },
  {
    id: 'h-enter-home', category: 'home', repeat: 1, source: 'Abu Dawud',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna",
    translation: 'In the Name of Allah we enter, in the Name of Allah we leave, and upon our Lord we rely. (Entering home, then greet with salam)',
  },
  {
    id: 'h-masjid-in', category: 'home', repeat: 1, source: 'Muslim',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad. Allahumma-ftah li abwaba rahmatik",
    translation: 'O Allah, send prayers upon Muhammad and his family. O Allah, open for me the doors of Your mercy. (Entering the masjid)',
  },
  {
    id: 'h-masjid-out', category: 'home', repeat: 1, source: 'Muslim',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad. Allahumma inni as'aluka min fadlik",
    translation: 'O Allah, send prayers upon Muhammad and his family. O Allah, I ask You from Your bounty. (Leaving the masjid)',
  },
  {
    id: 'h-market', category: 'home', repeat: 1, source: 'Tirmidhi, Ibn Majah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu, yuhyi wa yumitu wa Huwa Hayyun la yamut, biyadihil-khayru wa Huwa 'ala kulli shay'in Qadir",
    translation: 'There is no deity except Allah alone, without partner. His is the kingdom and His is the praise. He gives life and causes death, and He is the Ever-Living Who never dies. In His hand is the good, and He is over all things able. (Entering the market — a million good deeds are recorded for it)',
  },
  {
    id: 'h-sneeze', category: 'home', repeat: 1, source: 'Bukhari',
    arabic: 'الْحَمْدُ لِلَّهِ — يَرْحَمُكَ اللَّهُ — يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ',
    transliteration: 'Alhamdulillah — Yarhamukallah — Yahdikumullahu wa yuslihu balakum',
    translation: 'The sneezer says “Alhamdulillah”; the listener responds “Yarhamukallah”; and the sneezer replies “May Allah guide you and set your affairs right.”',
  },
];
