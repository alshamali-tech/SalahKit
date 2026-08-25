/**
 * Evening adhkar — the canonical set recited between Asr and Maghrib
 * (Al-Adhkar, Hisnul Muslim). Public-domain texts with sources.
 */
import type { Dua } from '../types';

/** Evening adhkar, in traditional recitation order. */
export const EVENING_ADHKAR: readonly Dua[] = [
  {
    id: 'e-ayat-kursi', category: 'evening', repeat: 1, source: 'Quran 2:255 · Abu Dawud',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm...",
    translation: 'Ayat al-Kursi. Whoever recites it in the evening is protected from the jinn until the morning.',
  },
  {
    id: 'e-three-quls', category: 'evening', repeat: 3, source: 'Abu Dawud, Tirmidhi',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Qul Huwallahu Ahad... Qul a’udhu bi-Rabbil-falaq... Qul a’udhu bi-Rabbin-nas...',
    translation: 'The three surahs of protection, recited in full three times each — sufficient against everything.',
  },
  {
    id: 'e-mulk', category: 'evening', repeat: 1, source: 'Muslim',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir",
    translation: 'We have reached the evening and the kingdom has reached Allah. Praise is for Allah. None has the right to be worshipped except Allah, alone without partner.',
  },
  {
    id: 'e-bika', category: 'evening', repeat: 1, source: 'Tirmidhi',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namut, wa ilayka al-masir",
    translation: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
  },
  {
    id: 'e-sayyidul-istighfar', category: 'evening', repeat: 1, source: 'Bukhari',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wa'dika mastata'tu...",
    translation: 'The master of forgiveness. Whoever says it with certainty in the evening and dies that night enters Paradise.',
  },
  {
    id: 'e-afini', category: 'evening', repeat: 3, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ',
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Anta",
    translation: 'O Allah, grant my body well-being; grant my hearing well-being; grant my sight well-being. There is no deity except You.',
  },
  {
    id: 'e-ushhiduka', category: 'evening', repeat: 4, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration: "Allahumma inni amsaytu ushhiduka wa ushhidu hamalata 'arshika, wa mala'ikataka wa jami'a khalqika, annaka Antallahu la ilaha illa Anta wahdaka la sharika laka, wa anna Muhammadan 'abduka wa rasuluk",
    translation: 'O Allah, I have reached the evening calling You, the bearers of Your Throne, Your angels and all Your creation to witness that You are Allah, alone without partner, and that Muhammad is Your servant and Messenger.',
  },
  {
    id: 'e-hasbiyallah', category: 'evening', repeat: 7, source: 'Abu Dawud',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu, wa Huwa Rabbul-'Arshil-'Azim",
    translation: 'Allah is sufficient for me. There is no deity except Him. Upon Him I rely, and He is Lord of the mighty Throne.',
  },
  {
    id: 'e-kalimat', category: 'evening', repeat: 3, source: 'Muslim',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bi-kalimatillahit-tammati min sharri ma khalaq",
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created. Whoever says it in the evening, nothing will harm him that night.',
  },
  {
    id: 'e-la-yadurru', category: 'evening', repeat: 3, source: 'Abu Dawud, Tirmidhi',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i, wa Huwas-Sami'ul-'Alim",
    translation: 'In the Name of Allah, with Whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
  },
  {
    id: 'e-raditu', category: 'evening', repeat: 3, source: 'Abu Dawud, Tirmidhi',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
    transliteration: "Radiytu billahi Rabba, wa bil-Islami dina, wa bi-Muhammadin Sallallahu 'alayhi wa Sallama nabiyya",
    translation: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.',
  },
  {
    id: 'e-nimah', category: 'evening', repeat: 1, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration: "Allahumma ma amsa bi min ni'matin aw bi-ahadin min khalqika faminka wahdaka la sharika laka, falakal-hamdu wa lakash-shukr",
    translation: 'O Allah, whatever blessing I or any of Your creation have reached this evening is from You alone, without partner. To You belongs all praise and gratitude.',
  },
  {
    id: 'e-subhan-100', category: 'evening', repeat: 100, source: 'Muslim',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdih',
    translation: 'Glory is to Allah and praise is to Him. A hundred times in the evening, as in the morning.',
  },
];
