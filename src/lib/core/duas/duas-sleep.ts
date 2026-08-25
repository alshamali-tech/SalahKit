/**
 * Duas of sleep and waking — the complete bedtime and night adab
 * (Bukhari, Muslim, Abu Dawud). Full surah texts carry numbered
 * verses in the traditional ﴿١﴾ style. Public-domain texts.
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
    id: 's-ikhlas', category: 'sleep', repeat: 3, source: 'Bukhari, Muslim',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾',
    transliteration: 'Qul Huwallahu Ahad ﴿1﴾ Allahus-Samad ﴿2﴾ Lam yalid wa lam yulad ﴿3﴾ Wa lam yakun lahu kufuwan Ahad ﴿4﴾',
    translation: 'Surah al-Ikhlas (112), verses 1–4: “Say: He is Allah, Who is One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.” Recite three times.',
  },
  {
    id: 's-falaq', category: 'sleep', repeat: 3, source: 'Bukhari, Muslim',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾',
    transliteration: 'Qul a’udhu bi-Rabbil-falaq ﴿1﴾ Min sharri ma khalaq ﴿2﴾ Wa min sharri ghasiqin idha waqab ﴿3﴾ Wa min sharri an-naffathati fil-’uqad ﴿4﴾ Wa min sharri hasidin idha hasad ﴿5﴾',
    translation: 'Surah al-Falaq (113), verses 1–5: “Say: I seek refuge in the Lord of daybreak, from the evil of what He created, from the evil of darkness when it settles, from the evil of the blowers in knots, and from the evil of an envier when he envies.” Recite three times.',
  },
  {
    id: 's-nas', category: 'sleep', repeat: 3, source: 'Bukhari, Muslim',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
    transliteration: 'Qul a’udhu bi-Rabbin-nas ﴿1﴾ Malikin-nas ﴿2﴾ Ilahin-nas ﴿3﴾ Min sharril-waswasil-khannas ﴿4﴾ Alladhi yuwaswisu fi sudurin-nas ﴿5﴾ Minal-jinnati wan-nas ﴿6﴾',
    translation: 'Surah an-Nas (114), verses 1–6: “Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer, who whispers into the breasts of mankind, among jinn and among men.” Recite three times.',
  },
  {
    id: 's-three-quls-adab', category: 'sleep', repeat: 3, source: 'Bukhari, Muslim',
    arabic: 'يَجْمَعُ كَفَّيْهِ ثُمَّ يَنْفُثُ فِيهِمَا فَيَقْرَأُ: الْإِخْلَاصَ وَالْفَلَقَ وَالنَّاسَ، ثُمَّ يَمْسَحُ بِهِمَا مَا اسْتَطَاعَ مِنْ جَسَدِهِ، يَبْدَأُ بِهِمَا عَلَى رَأْسِهِ وَوَجْهِهِ',
    transliteration: 'Cup the palms, blow lightly into them, recite al-Ikhlas, al-Falaq and an-Nas, then wipe over the body starting with the head and face',
    translation: 'The manner of the three quls: cup your hands, blow lightly into them, recite the three surahs (each three times), and wipe over as much of your body as you can, beginning with the head and face. They suffice against everything.',
  },
  {
    id: 's-ayat-kursi', category: 'sleep', repeat: 1, source: 'Bukhari',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ ﴿٢٥٥﴾',
    transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum, la ta’khudhuhu sinatun wa la nawm...',
    translation: 'Ayat al-Kursi (Quran 2:255) in full. Whoever recites it when lying down, a guardian from Allah remains with him and no devil comes near him until morning.',
  },
  {
    id: 's-baqara-end', category: 'sleep', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ﴿٢٨٥﴾ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ ﴿٢٨٦﴾',
    transliteration: 'Amanar-Rasulu bima unzila ilayhi min Rabbihi wal-mu’minun... [2:285] La yukallifullahu nafsan illa wus’aha... [2:286]',
    translation: 'The last two verses of Surah al-Baqarah (2:285–286) in full. Whoever recites them at night, they will suffice him.',
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
