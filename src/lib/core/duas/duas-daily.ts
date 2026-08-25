/**
 * Duas of food, drink, fasting and daily occasions (Hisnul Muslim).
 * Public-domain texts with sources.
 */
import type { Dua } from '../types';

/** Duas for eating, drinking, fasting and social occasions. */
export const DAILY_DUAS: readonly Dua[] = [
  {
    id: 'd-before-food', category: 'daily', repeat: 1, source: 'Bukhari, Muslim',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the Name of Allah. (Before eating — eat with your right hand and from what is nearest to you)',
  },
  {
    id: 'd-forget-bismillah', category: 'daily', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
    transliteration: 'Bismillahi awwalahu wa akhirah',
    translation: 'In the Name of Allah, at its beginning and its end. (If you forget the Basmala at the start of the meal)',
  },
  {
    id: 'd-bless-food', category: 'daily', repeat: 1, source: 'Tirmidhi',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Allahumma barik lana fima razaqtana wa qina 'adhaban-nar",
    translation: 'O Allah, bless us in what You have provided for us and protect us from the punishment of the Fire.',
  },
  {
    id: 'd-after-food', category: 'daily', repeat: 1, source: 'Tirmidhi, Abu Dawud',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: 'Alhamdulillahil-ladhi at’amana wa saqana wa ja’alana muslimin',
    translation: 'Praise is to Allah Who has fed us and given us drink and made us Muslims. (After eating — his past sins are forgiven)',
  },
  {
    id: 'd-after-food-2', category: 'daily', repeat: 1, source: 'Bukhari',
    arabic: 'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا',
    transliteration: "Alhamdulillahi hamdan kathiran tayyiban mubarakan fih, ghayra makfiyyin wa la muwadda'in wa la mustaghnan 'anhu Rabbana",
    translation: 'Praise is to Allah — abundant, good and blessed praise — praise that is never enough, never abandoned, and never dispensed with, our Lord.',
  },
  {
    id: 'd-guest-host', category: 'daily', repeat: 1, source: 'Muslim',
    arabic: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ',
    transliteration: 'Allahumma barik lahum fima razaqtahum, waghfir lahum warhamhum',
    translation: 'O Allah, bless them in what You have provided for them, forgive them and have mercy on them. (A guest’s dua for his host)',
  },
  {
    id: 'd-iftar', category: 'daily', repeat: 1, source: 'Abu Dawud',
    arabic: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: "Dhahaba-z-zama'u, wabtallatil-'uruqu, wa thabatal-ajru insha'Allah",
    translation: 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills. (Upon breaking the fast)',
  },
  {
    id: 'd-iftar-host', category: 'daily', repeat: 1, source: 'Abu Dawud',
    arabic: 'أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ، وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ، وَصَلَّتْ عَلَيْكُمُ الْمَلَائِكَةُ',
    transliteration: "Aftara 'indakumus-sa'imun, wa akala ta'amakumul-abrar, wa sallat 'alaykumul-mala'ikah",
    translation: 'May those who fast break their fast with you, may the righteous eat your food, and may the angels send prayers upon you. (Breaking fast at someone’s home)',
  },
  {
    id: 'd-newlywed', category: 'daily', repeat: 1, source: 'Abu Dawud, Tirmidhi',
    arabic: 'بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    transliteration: "Barakallahu laka, wa baraka 'alayka, wa jama'a baynakuma fi khayr",
    translation: 'May Allah bless you, may He shower His blessings upon you, and may He join you together in goodness. (Congratulations to the newly married)',
  },
  {
    id: 'd-newborn', category: 'daily', repeat: 1, source: 'Nawawi, Al-Adhkar',
    arabic: 'بَارَكَ اللَّهُ لَكَ فِي الْمَوْهُوبِ لَكَ، وَشَكَرْتَ الْوَاهِبَ، وَبَلَغَ أَشُدَّهُ، وَرُزِقْتَ بِرَّهُ',
    transliteration: "Barakallahu laka fil-mawhubi laka, wa shakartal-wahib, wa balagha ashuddahu, wa ruziqta birrahu",
    translation: 'May Allah bless you in the gift given to you, may you give thanks to the Giver, may the child reach maturity, and may you be granted its righteousness. (For a newborn)',
  },
  {
    id: 'd-jazakallah', category: 'daily', repeat: 1, source: 'Tirmidhi',
    arabic: 'جَزَاكَ اللَّهُ خَيْرًا — وَأَنْتَ فَجَزَاكَ اللَّهُ خَيْرًا',
    transliteration: 'Jazakallahu khayran — wa anta fa-jazakallahu khayra',
    translation: '“May Allah reward you with good.” The reply: “And may Allah reward you with good as well.” (The best expression of gratitude)',
  },
];
