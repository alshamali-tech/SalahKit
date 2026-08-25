/**
 * Duas of hardship, anxiety, sickness, calamity and loss (Bukhari,
 * Muslim, Tirmidhi). Public-domain texts — the fortress in storms.
 */
import type { Dua } from '../types';

/** Supplications for trials of the heart, body and circumstance. */
export const HARDSHIP_DUAS: readonly Dua[] = [
  {
    id: 'x-musibah', category: 'hardship', repeat: 1, source: 'Muslim',
    arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي، وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
    transliteration: "Inna lillahi wa inna ilayhi raji'un. Allahumma'jurni fi musibati, wa akhlif li khayran minha",
    translation: 'Indeed we belong to Allah and to Him we return. O Allah, reward me in my calamity and replace it with something better. (Whoever says it, Allah replaces his loss with good)',
  },
  {
    id: 'x-anxiety', category: 'hardship', repeat: 0, source: 'Bukhari',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni, wa ghalabatir-rijal",
    translation: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debt and being overpowered by men.',
  },
  {
    id: 'x-karb', category: 'hardship', repeat: 0, source: 'Bukhari, Muslim',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    transliteration: "La ilaha illallahul-'Azimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Azim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim",
    translation: 'There is no deity except Allah, the Magnificent, the Forbearing. There is no deity except Allah, Lord of the mighty Throne. There is no deity except Allah, Lord of the heavens, Lord of the earth, Lord of the noble Throne. (The dua of distress)',
  },
  {
    id: 'x-debt', category: 'hardship', repeat: 0, source: 'Tirmidhi',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliteration: "Allahumma-kfini bi-halalika 'an haramika, wa aghnini bi-fadlika 'amman siwak",
    translation: 'O Allah, suffice me with what is lawful so I never need what is unlawful, and enrich me by Your bounty so I never need anyone besides You. (When overwhelmed by debt)',
  },
  {
    id: 'x-fear', category: 'hardship', repeat: 0, source: 'Bukhari',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: "Hasbunallahu wa ni'mal-wakil",
    translation: 'Allah is sufficient for us, and He is the best Disposer of affairs. (In fear — the word of Ibrahim when thrown into the fire)',
  },
  {
    id: 'x-enemy', category: 'hardship', repeat: 0, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ، وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ',
    transliteration: "Allahumma inna naj'aluka fi nuhurihim, wa na'udhu bika min shururihim",
    translation: 'O Allah, we place You before them and we seek refuge in You from their evil. (Facing an opponent or enemy)',
  },
  {
    id: 'x-sick-visit', category: 'hardship', repeat: 7, source: 'Abu Dawud, Tirmidhi',
    arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ، رَبَّ الْعَرْشِ الْعَظِيمِ، أَنْ يَشْفِيَكَ',
    transliteration: "As'alullahal-'Azima Rabbal-'Arshil-'Azimi an yashfiyak",
    translation: 'I ask Allah the Magnificent, Lord of the mighty Throne, to heal you. (Visiting the sick, seven times — Allah heals him unless his term has come)',
  },
  {
    id: 'x-pain', category: 'hardship', repeat: 7, source: 'Muslim',
    arabic: 'بِسْمِ اللَّهِ (٣×) أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
    transliteration: "Bismillah (×3). A'udhu billahi wa qudratihi min sharri ma ajidu wa uhadhir (×7)",
    translation: 'In the Name of Allah (three times). I seek refuge in Allah and His power from the evil of what I find and what I fear. (Place your hand on the pain and say it seven times)',
  },
  {
    id: 'x-ruqyah', category: 'hardship', repeat: 0, source: 'Muslim',
    arabic: 'بِسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنٍ حَاسِدٍ، اللَّهُ يَشْفِيكَ، بِسْمِ اللَّهِ أَرْقِيكَ',
    transliteration: "Bismillahi arqika, min kulli shay'in yu'dhika, min sharri kulli nafsin aw 'aynin hasid, Allahu yashfika, bismillahi arqika",
    translation: 'In the Name of Allah I perform ruqyah for you, from everything that harms you, from the evil of every soul or envious eye. May Allah heal you. In the Name of Allah I perform ruqyah for you.',
  },
  {
    id: 'x-funeral', category: 'hardship', repeat: 0, source: 'Abu Dawud, Tirmidhi',
    arabic: 'اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا، اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الْإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الْإِيمَانِ',
    transliteration: "Allahumma-ghfir li-hayyina wa mayyitina, wa shahidina wa gha'ibina, wa saghirina wa kabirina, wa dhakarina wa unthana. Allahumma man ahyaytahu minna fa-ahyihi 'alal-Islam, wa man tawaffaytahu minna fatawaffahu 'alal-iman",
    translation: 'O Allah, forgive our living and our dead, our present and our absent, our young and our old, our males and our females. Whomsoever You keep alive, keep alive upon Islam; and whomsoever You take, take upon faith. (Janazah prayer)',
  },
  {
    id: 'x-taziya', category: 'hardship', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'إِنَّ لِلَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَى، وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمًّى، فَلْتَصْبِرْ وَلْتَحْتَسِبْ',
    transliteration: "Inna lillahi ma akhadha, wa lahu ma a'ta, wa kullu shay'in 'indahu bi-ajalin musamma, faltasbir waltahtasib",
    translation: 'Indeed to Allah belongs what He took and to Him belongs what He gave, and everything with Him has an appointed term. So be patient and seek reward. (Consoling the bereaved)',
  },
];
