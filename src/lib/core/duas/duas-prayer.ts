/**
 * Supplications of the prayer — from the opening takbir to the dhikr
 * after salam (Hisnul Muslim, Sifat as-Salah). Public-domain texts.
 */
import type { Dua } from '../types';

/** Duas recited within and after the salah, in prayer order. */
export const PRAYER_DUAS: readonly Dua[] = [
  {
    id: 'p-istiftah-1', category: 'salah', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ',
    transliteration: "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk",
    translation: 'Glory is to You, O Allah, and praise. Blessed is Your Name, exalted is Your Majesty, and there is no deity besides You. (Opening supplication)',
  },
  {
    id: 'p-istiftah-2', category: 'salah', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
    transliteration: "Allahumma ba'id bayni wa bayna khatayaya kama ba'adta baynal-mashriqi wal-maghrib, Allahumma naqqini minal-khataya kama yunaqqath-thawbul-abyadu minad-danas, Allahumma-ghsil khatayaya bil-ma'i wath-thalji wal-barad",
    translation: 'O Allah, distance me from my sins as You have distanced the East from the West. Cleanse me of sins as a white garment is cleansed of filth. Wash away my sins with water, snow and hail.',
  },
  {
    id: 'p-ruku', category: 'salah', repeat: 3, source: 'Muslim',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    transliteration: "Subhana Rabbiyal-'Azim",
    translation: 'Glory to my Lord, the Magnificent. (In bowing)',
  },
  {
    id: 'p-rise', category: 'salah', repeat: 1, source: 'Bukhari',
    arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    transliteration: "Rabbana wa lakal-hamdu, hamdan kathiran tayyiban mubarakan fih",
    translation: 'Our Lord, and to You belongs praise — abundant, good and blessed praise. (Rising from bowing)',
  },
  {
    id: 'p-sujud', category: 'salah', repeat: 3, source: 'Muslim',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    transliteration: "Subhana Rabbiyal-A'la",
    translation: 'Glory to my Lord, the Most High. (In prostration — the nearest a servant is to his Lord)',
  },
  {
    id: 'p-sujud-dua', category: 'salah', repeat: 1, source: 'Muslim',
    arabic: 'اللَّهُمَّ لَكَ سَجَدْتُ، وَبِكَ آمَنْتُ، وَلَكَ أَسْلَمْتُ، سَجَدَ وَجْهِيَ لِلَّذِي خَلَقَهُ وَصَوَّرَهُ، وَشَقَّ سَمْعَهُ وَبَصَرَهُ، تَبَارَكَ اللَّهُ أَحْسَنُ الْخَالِقِينَ',
    transliteration: "Allahumma laka sajadtu, wa bika amantu, wa laka aslamtu, sajada wajhiya lilladhi khalaqahu wa sawwarahu, wa shaqqa sam'ahu wa basarahu, tabarakallahu ahsanul-khaliqin",
    translation: 'O Allah, to You I have prostrated, in You I have believed, and to You I have submitted. My face has prostrated to the One Who created it and fashioned it, and brought forth its hearing and sight. Blessed is Allah, the Best of creators.',
  },
  {
    id: 'p-between-sujud', category: 'salah', repeat: 2, source: 'Abu Dawud, Ibn Majah',
    arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
    transliteration: 'Rabbighfir li, Rabbighfir li',
    translation: 'My Lord, forgive me. My Lord, forgive me. (Between the two prostrations)',
  },
  {
    id: 'p-tashahhud', category: 'salah', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibat, as-salamu 'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh, as-salamu 'alayna wa 'ala 'ibadillahis-salihin, ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh",
    translation: 'All compliments, prayers and pure words are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no deity except Allah, and that Muhammad is His servant and Messenger. (Tashahhud)',
  },
  {
    id: 'p-durood', category: 'salah', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammad, kama barakta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid",
    translation: 'O Allah, send prayers upon Muhammad and the family of Muhammad as You sent prayers upon Ibrahim and the family of Ibrahim. You are indeed Praiseworthy, Glorious. (Salat al-Ibrahimiyyah)',
  },
  {
    id: 'p-before-salam', category: 'salah', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    transliteration: "Allahumma inni a'udhu bika min 'adhabil-qabr, wa min 'adhabi jahannam, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-Masihid-Dajjal",
    translation: 'O Allah, I seek refuge in You from the punishment of the grave, the punishment of Hellfire, the trials of life and death, and the evil of the trial of the False Messiah. (Before the final salam)',
  },
  {
    id: 'p-after-salam-1', category: 'salah', repeat: 3, source: 'Muslim',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: "Astaghfirullah (×3). Allahumma Antas-Salam, wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram",
    translation: 'I seek the forgiveness of Allah (three times). O Allah, You are Peace and from You is peace. Blessed are You, O Possessor of Majesty and Generosity. (After concluding the prayer)',
  },
  {
    id: 'p-after-salam-2', category: 'salah', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir. Allahumma la mani'a lima a'tayta, wa la mu'tiya lima mana'ta, wa la yanfa'u dhal-jaddi minkal-jadd",
    translation: 'None has the right to be worshipped except Allah alone, without partner. O Allah, none can withhold what You grant, none can grant what You withhold, and no wealth can avail its owner against You.',
  },
  {
    id: 'p-tasbih-33', category: 'salah', repeat: 33, source: 'Muslim',
    arabic: 'سُبْحَانَ اللَّهِ (٣٣) وَالْحَمْدُ لِلَّهِ (٣٣) وَاللَّهُ أَكْبَرُ (٣٣)، وَتَمَامُ الْمِائَةِ: لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "SubhanAllah (33), wal-hamdu lillah (33), wallahu Akbar (33); and to complete the hundred: La ilaha illallahu wahdahu la sharika lah",
    translation: 'Glory to Allah, praise to Allah, Allah is Greatest — thirty-three each after every obligatory prayer; their sins are forgiven even if like the foam of the sea.',
  },
  {
    id: 'p-ayat-kursi', category: 'salah', repeat: 1, source: 'Nasa’i, Ibn Hibban',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ... (آيَةُ الْكُرْسِيِّ كَامِلَةً)',
    transliteration: 'Ayat al-Kursi (Quran 2:255) in full',
    translation: 'Whoever recites Ayat al-Kursi after every obligatory prayer, nothing stands between him and Paradise except death.',
  },
  {
    id: 'p-a’inni', category: 'salah', repeat: 1, source: 'Abu Dawud, Nasa’i',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    translation: 'O Allah, help me to remember You, thank You, and worship You in the best manner.',
  },
  {
    id: 'p-qunut-witr', category: 'salah', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ',
    transliteration: "Allahumma-hdini fiman hadayt, wa 'afini fiman 'afayt, wa tawallani fiman tawallayt, wa barik li fima a'tayt, wa qini sharra ma qadayt, fa-innaka taqdi wa la yuqda 'alayk, wa innahu la yadhillu man walayt, tabarakta Rabbana wa ta'alayt",
    translation: 'O Allah, guide me among those You have guided, grant me well-being among those You have granted it, take me into Your care, bless what You have given me, and protect me from the evil of what You have decreed. (Qunut of Witr)',
  },
];
