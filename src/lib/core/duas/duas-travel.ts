/**
 * Duas of travel — mounting, setting out, stops and return (Muslim,
 * Abu Dawud, Tirmidhi). Public-domain texts.
 */
import type { Dua } from '../types';

/** Supplications for the journey, in order of the trip. */
export const TRAVEL_DUAS: readonly Dua[] = [
  {
    id: 't-mounting', category: 'travel', repeat: 1, source: 'Quran 43:13-14',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ۝ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
    transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun",
    translation: 'Glory to Him Who has subjected this to us, and we could never have it by our own efforts. And to our Lord we will surely return. (Upon boarding any vehicle)',
  },
  {
    id: 't-setting-out', category: 'travel', repeat: 1, source: 'Muslim',
    arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ',
    transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-'amali ma tarda. Allahumma hawwin 'alayna safarana hadha watwi 'anna bu'dahu. Allahumma Antas-Sahibu fis-safar, wal-khalifatu fil-ahl",
    translation: 'O Allah, we ask You on this journey of ours for righteousness, piety, and deeds that please You. Make this journey easy for us and fold up its distance. O Allah, You are the Companion on the journey and the Guardian over the family.',
  },
  {
    id: 't-returning', category: 'travel', repeat: 1, source: 'Muslim',
    arabic: 'آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ',
    transliteration: "A'ibuna, ta'ibuna, 'abiduna, li-Rabbina hamidun",
    translation: 'We return, repentant, worshipping, and praising our Lord. (Added to the journey dua when coming home)',
  },
  {
    id: 't-ascending', category: 'travel', repeat: 0, source: 'Bukhari',
    arabic: 'اللَّهُ أَكْبَرُ ... سُبْحَانَ اللَّهِ',
    transliteration: 'Allahu Akbar (ascending) ... SubhanAllah (descending)',
    translation: 'The Companions would say Allahu Akbar when climbing and SubhanAllah when descending. (On rises and falls of the road)',
  },
  {
    id: 't-stop', category: 'travel', repeat: 1, source: 'Muslim',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bi-kalimatillahit-tammati min sharri ma khalaq",
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created. (Stopping anywhere — nothing will harm him until he leaves)',
  },
  {
    id: 't-town', category: 'travel', repeat: 1, source: 'Nasa’i, Hakim',
    arabic: 'اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَمَا أَظْلَلْنَ، وَرَبَّ الْأَرَضِينَ السَّبْعِ وَمَا أَقْلَلْنَ... إِنِّي أَسْأَلُكَ خَيْرَ هَٰذِهِ الْقَرْيَةِ وَخَيْرَ أَهْلِهَا، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ أَهْلِهَا',
    transliteration: "Allahumma Rabbas-samawatis-sab'i wa ma azlaln, wa Rabbal-aradinas-sab'i wa ma aqlaln... inni as'aluka khayra hadhihil-qaryati wa khayra ahliha, wa a'udhu bika min sharriha wa sharri ahliha",
    translation: 'O Allah, Lord of the seven heavens and all they overshadow, Lord of the seven earths and all they upbear — I ask You for the good of this town and its people, and I seek refuge from its evil and theirs. (Entering a town)',
  },
];
