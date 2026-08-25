/**
 * Duas of sleep and waking — the complete bedtime and night adab
 * (Bukhari, Muslim, Abu Dawud). Public-domain texts.
 */
import type { Dua } from '../types';

/** Supplications for sleeping, the night, and waking. */
export const SLEEP_DUAS: readonly Dua[] = [
  {
    id: 's-bismika', category: 'sleep', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your Name, O Allah, I die and I live. (Before sleeping)',
  },
  {
    id: 's-three-quls', category: 'sleep', repeat: 3, source: 'Bukhari, Muslim',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Surah al-Ikhlas, al-Falaq and an-Nas',
    translation: 'Cup your hands, blow lightly into them, recite the three surahs, and wipe over your body starting with the head and face — three times.',
  },
  {
    id: 's-ayat-kursi', category: 'sleep', repeat: 1, source: 'Bukhari',
    arabic: 'آيَةُ الْكُرْسِيِّ (الْبَقَرَةُ ٢٥٥)',
    transliteration: 'Ayat al-Kursi (Quran 2:255)',
    translation: 'Whoever recites it when lying down, a guardian from Allah remains with him and no devil comes near him until morning.',
  },
  {
    id: 's-baqara-end', category: 'sleep', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ... (خَاتِمَةُ الْبَقَرَةِ: ٢٨٥–٢٨٦)',
    transliteration: 'The last two verses of Surah al-Baqarah (2:285-286)',
    translation: 'Whoever recites the last two verses of al-Baqarah at night, they will suffice him.',
  },
  {
    id: 's-aslamtu', category: 'sleep', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ',
    transliteration: "Allahumma aslamtu nafsi ilayka, wa fawwadtu amri ilayka, wa wajjahtu wajhi ilayka, wa alja'tu zahri ilayka, raghbatan wa rahbatan ilayka, la malja'a wa la manja minka illa ilayka, amantu bi-kitabikal-ladhi anzalta wa bi-nabiyyikal-ladhi arsalt",
    translation: 'O Allah, I submit myself to You, entrust my affair to You, turn my face to You, and lean my back upon You — in hope and in fear of You. There is no refuge or escape from You except to You. I believe in the Book You revealed and in the Prophet You sent. (If he dies that night, he dies upon the fitrah)',
  },
  {
    id: 's-qini', category: 'sleep', repeat: 3, source: 'Abu Dawud, Tirmidhi',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants. (Placing the hand under the cheek)',
  },
  {
    id: 's-waking', category: 'sleep', repeat: 1, source: 'Bukhari',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhi an-nushur",
    translation: 'Praise is to Allah Who has given us life after taking it from us, and to Him is the resurrection. (Upon waking)',
  },
  {
    id: 's-night-waking', category: 'sleep', repeat: 1, source: 'Bukhari',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، الْحَمْدُ لِلَّهِ، وَسُبْحَانَ اللَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، اللَّهُمَّ اغْفِرْ لِي',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir. Alhamdulillah, wa SubhanAllah, wa la ilaha illallah, wallahu Akbar, wa la hawla wa la quwwata illa billah. Allahumma-ghfir li",
    translation: 'Whoever wakes at night and says this, then supplicates, his supplication is answered; and if he performs wudu and prays, his prayer is accepted.',
  },
  {
    id: 's-fright', category: 'sleep', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ، وَشَرِّ عِبَادِهِ، وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ',
    transliteration: "A'udhu bi-kalimatillahit-tammati min ghadabihi wa 'iqabihi, wa sharri 'ibadihi, wa min hamazatish-shayatin wa an yahdurun",
    translation: 'I seek refuge in the perfect words of Allah from His anger and punishment, from the evil of His servants, and from the whispers of the devils and their presence. (Waking in fright)',
  },
];
