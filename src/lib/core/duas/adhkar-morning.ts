/**
 * Morning adhkar — the canonical set from the Sunnah (Al-Adhkar,
 * Hisnul Muslim). Public-domain texts with sources.
 */
import type { Dua } from '../types';

/** Morning adhkar, in traditional recitation order. */
export const MORNING_ADHKAR: readonly Dua[] = [
  {
    id: 'm-ayat-kursi', category: 'morning', repeat: 1, source: 'Quran 2:255 · Abu Dawud',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm...",
    translation: 'Ayat al-Kursi. Whoever recites it in the morning is protected from the jinn until the evening.',
  },
  {
    id: 'm-three-quls', category: 'morning', repeat: 3, source: 'Abu Dawud, Tirmidhi',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration: 'Qul Huwallahu Ahad... Qul a’udhu bi-Rabbil-falaq... Qul a’udhu bi-Rabbin-nas...',
    translation: 'Surah al-Ikhlas and the two surahs of refuge, three times each — sufficient against everything.',
  },
  {
    id: 'm-mulk', category: 'morning', repeat: 1, source: 'Muslim',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir",
    translation: 'We have reached the morning and the kingdom has reached Allah. Praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
  },
  {
    id: 'm-bika', category: 'morning', repeat: 1, source: 'Tirmidhi',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namut, wa ilayka an-nushur",
    translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
  },
  {
    id: 'm-sayyidul-istighfar', category: 'morning', repeat: 1, source: 'Bukhari',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bi-ni'matika alayya, wa abu'u bi-dhanbi faghfir li fa-innahu la yaghfirudh-dhunuba illa Anta",
    translation: 'The master of forgiveness. Whoever says it with certainty in the morning and dies that day enters Paradise.',
  },
  {
    id: 'm-afini', category: 'morning', repeat: 3, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ',
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Anta",
    translation: 'O Allah, grant my body well-being; grant my hearing well-being; grant my sight well-being. There is no deity except You.',
  },
  {
    id: 'm-kufri-faqr', category: 'morning', repeat: 3, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَٰهَ إِلَّا أَنْتَ',
    transliteration: "Allahumma inni a'udhu bika minal-kufri wal-faqr, wa a'udhu bika min 'adhabil-qabr, la ilaha illa Anta",
    translation: 'O Allah, I seek refuge in You from disbelief and poverty, and from the punishment of the grave. There is no deity except You.',
  },
  {
    id: 'm-ushhiduka', category: 'morning', repeat: 4, source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration: "Allahumma inni asbahtu ushhiduka wa ushhidu hamalata 'arshika, wa mala'ikataka wa jami'a khalqika, annaka Antallahu la ilaha illa Anta wahdaka la sharika laka, wa anna Muhammadan 'abduka wa rasuluk",
    translation: 'O Allah, I have reached the morning calling You, the bearers of Your Throne, Your angels and all Your creation to witness that You are Allah, alone without partner, and that Muhammad is Your servant and Messenger.',
  },
  {
    id: 'm-hasbiyallah', category: 'morning', repeat: 7, source: 'Abu Dawud',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu, wa Huwa Rabbul-'Arshil-'Azim",
    translation: 'Allah is sufficient for me. There is no deity except Him. Upon Him I rely, and He is Lord of the mighty Throne.',
  },
  {
    id: 'm-la-yadurru', category: 'morning', repeat: 3, source: 'Abu Dawud, Tirmidhi',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i, wa Huwas-Sami'ul-'Alim",
    translation: 'In the Name of Allah, with Whose Name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
  },
  {
    id: 'm-raditu', category: 'morning', repeat: 3, source: 'Abu Dawud, Tirmidhi',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
    transliteration: "Radiytu billahi Rabba, wa bil-Islami dina, wa bi-Muhammadin Sallallahu 'alayhi wa Sallama nabiyya",
    translation: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.',
  },
  {
    id: 'm-ya-hayyu', category: 'morning', repeat: 1, source: 'Tirmidhi, Hakim',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration: "Ya Hayyu ya Qayyum, bi-rahmatika astaghith, aslih li sha'ni kullahu, wa la takilni ila nafsi tarfata 'ayn",
    translation: 'O Ever-Living, O Sustainer, by Your mercy I seek relief. Set right all of my affairs and do not leave me to myself for the blink of an eye.',
  },
  {
    id: 'm-khayral-yawm', category: 'morning', repeat: 1, source: 'Abu Dawud',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَٰذَا الْيَوْمِ: فَتْحَهُ، وَنَصْرَهُ، وَنُورَهُ، وَبَرَكَتَهُ، وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ',
    transliteration: "Asbahna wa asbahal-mulku lillahi Rabbil-'alamin. Allahumma inni as'aluka khayra hadhal-yawm: fathahu, wa nasrahu, wa nurahu, wa barakatahu, wa hudahu, wa a'udhu bika min sharri ma fihi wa sharri ma ba'dahu",
    translation: 'We have reached the morning and the kingdom has reached Allah, Lord of the worlds. O Allah, I ask You for the good of this day: its victory, help, light, blessing and guidance; and I seek refuge from its evil and the evil after it.',
  },
  {
    id: 'm-fitrah', category: 'morning', repeat: 1, source: 'Ahmad',
    arabic: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ',
    transliteration: "Asbahna 'ala fitratil-Islam, wa 'ala kalimatil-ikhlas, wa 'ala dini nabiyyina Muhammadin Sallallahu 'alayhi wa Sallama, wa 'ala millati abina Ibrahima hanifan musliman wa ma kana minal-mushrikin",
    translation: 'We have reached the morning upon the natural way of Islam, upon the word of sincerity, upon the religion of our Prophet Muhammad ﷺ, and upon the way of our father Ibrahim — upright, a Muslim, and never of the polytheists.',
  },
  {
    id: 'm-subhan-100', category: 'morning', repeat: 100, source: 'Muslim',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdih',
    translation: 'Glory is to Allah and praise is to Him. A hundred times: his sins are erased even if they were like the foam of the sea.',
  },
  {
    id: 'm-tahlil-10', category: 'morning', repeat: 10, source: 'Bukhari, Muslim',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in Qadir",
    translation: 'None has the right to be worshipped except Allah, alone without partner. His is the kingdom and His is the praise, and He is over all things fully able.',
  },
  {
    id: 'm-adada-khalqihi', category: 'morning', repeat: 3, source: 'Muslim',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
    transliteration: "SubhanAllahi wa bihamdihi, 'adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatihi",
    translation: 'Glory is to Allah and praise is to Him — in number like His creation, in weight like His Throne, and in ink like His words.',
  },
  {
    id: 'm-ilman-nafian', category: 'morning', repeat: 1, source: 'Ibn Majah',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbala",
    translation: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.',
  },
  {
    id: 'm-istighfar-100', category: 'morning', repeat: 100, source: 'Bukhari, Muslim',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha wa atubu ilayh',
    translation: 'I seek the forgiveness of Allah and repent to Him. The Prophet ﷺ said it a hundred times a day.',
  },
];
