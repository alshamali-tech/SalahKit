/**
 * Duas of nature and weather — moon, rain, wind, thunder, eclipse
 * (Bukhari, Muslim, Muwatta). Public-domain texts.
 */
import type { Dua } from '../types';

/** Supplications tied to natural phenomena. */
export const NATURE_DUAS: readonly Dua[] = [
  {
    id: 'w-moon', category: 'nature', repeat: 1, source: 'Tirmidhi, Darimi',
    arabic: 'اللَّهُ أَكْبَرُ، اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، وَالتَّوْفِيقِ لِمَا تُحِبُّ وَتَرْضَى، رَبُّنَا وَرَبُّكَ اللَّهُ',
    transliteration: "Allahu Akbar. Allahumma ahillahu 'alayna bil-amni wal-iman, was-salamati wal-Islam, wat-tawfiqi lima tuhibbu wa tarda. Rabbuna wa Rabbukallah",
    translation: 'Allah is Greatest. O Allah, bring this new moon over us with security, faith, safety and Islam, and success in what You love and are pleased with. Our Lord and your Lord is Allah. (Sighting the crescent)',
  },
  {
    id: 'w-rain', category: 'nature', repeat: 1, source: 'Bukhari',
    arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
    transliteration: "Allahumma sayyiban nafi'an",
    translation: 'O Allah, make it a beneficial downpour. (When it rains)',
  },
  {
    id: 'w-after-rain', category: 'nature', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ',
    transliteration: "Mutirna bi-fadlillahi wa rahmatih",
    translation: 'We have been given rain by the grace of Allah and His mercy. (After rain)',
  },
  {
    id: 'w-heavy-rain', category: 'nature', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'اللَّهُمَّ حَوَالَيْنَا وَلَا عَلَيْنَا، اللَّهُمَّ عَلَى الْآكَامِ وَالظِّرَابِ وَبُطُونِ الْأَوْدِيَةِ وَمَنَابِتِ الشَّجَرِ',
    transliteration: "Allahumma hawalayna wa la 'alayna. Allahumma 'alal-akami wa-z-zirabi wa butunil-awdiyati wa manabitish-shajar",
    translation: 'O Allah, let it fall around us and not upon us — upon the hills, the hillocks, the valleys and the places where trees grow. (When the rain becomes harmful)',
  },
  {
    id: 'w-wind', category: 'nature', repeat: 1, source: 'Muslim',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا وَخَيْرَ مَا أُرْسِلَتْ بِهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا وَشَرِّ مَا أُرْسِلَتْ بِهِ',
    transliteration: "Allahumma inni as'aluka khayraha wa khayra ma fiha wa khayra ma ursilat bih, wa a'udhu bika min sharriha wa sharri ma fiha wa sharri ma ursilat bih",
    translation: 'O Allah, I ask You for its good, the good within it, and the good it was sent with; and I seek refuge from its evil, the evil within it, and the evil it was sent with. (When the wind blows strong)',
  },
  {
    id: 'w-thunder', category: 'nature', repeat: 1, source: 'Muwatta',
    arabic: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ',
    transliteration: "Subhanal-ladhi yusabbihur-ra'du bihamdihi wal-mala'ikatu min khifatih",
    translation: 'Glory to the One Whom the thunder glorifies with His praise, and the angels out of fear of Him. (Hearing thunder)',
  },
  {
    id: 'w-eclipse', category: 'nature', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'فَافْزَعُوا إِلَى الصَّلَاةِ وَالدُّعَاءِ وَالِاسْتِغْفَارِ',
    transliteration: 'Pray, supplicate, seek forgiveness and give charity',
    translation: 'The sun and moon are two of the signs of Allah. When you see an eclipse, hasten to prayer, remembrance, supplication and charity until it clears.',
  },
];
