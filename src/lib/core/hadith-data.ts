/**
 * Hadith dataset (S3 companion): curated narrations from the two
 * Sahih collections — Sahih al-Bukhari and Sahih Muslim (the Sahihayn).
 * Public-domain texts with standard reference numbers.
 * Pure TypeScript — no framework imports.
 */
import type { Hadith, HadithBook, HadithCategory } from './types';

/** The complete hadith collection, in canonical order. */
export const HADITHS: readonly Hadith[] = [
  // ── Faith & Intention ──────────────────────────────────────────
  {
    id: 'h-intention', books: ['bukhari', 'muslim'], source: 'Bukhari 1 · Muslim 1907',
    narrator: 'Umar ibn al-Khattab', category: 'intention',
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ',
    translation: 'Actions are but by intentions, and every soul shall have only what it intended. So whoever’s migration was for Allah and His Messenger, his migration was for Allah and His Messenger; and whoever’s migration was for worldly gain or a woman to marry, his migration was for what he migrated for.',
  },
  {
    id: 'h-brother-love', books: ['bukhari', 'muslim'], source: 'Bukhari 13 · Muslim 45',
    narrator: 'Anas ibn Malik', category: 'intention',
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation: 'None of you truly believes until he loves for his brother what he loves for himself.',
  },
  {
    id: 'h-jibril', books: ['muslim'], source: 'Muslim 8',
    narrator: 'Umar ibn al-Khattab', category: 'intention',
    arabic: 'الْإِسْلَامُ أَنْ تَشْهَدَ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ... وَالْإِيمَانُ أَنْ تُؤْمِنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ... وَالْإِحْسَانُ أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ',
    translation: '“Islam is to testify that there is no god but Allah and that Muhammad is His Messenger… Iman is to believe in Allah, His angels, His books, His messengers, the Last Day… and Ihsan is to worship Allah as though you see Him, for though you see Him not, He sees you.” (The famous Hadith of Jibril.)',
  },
  {
    id: 'h-sincerity-word', books: ['bukhari', 'muslim'], source: 'Bukhari 6400 · Muslim 26',
    narrator: 'Abu Hurayrah', category: 'intention',
    arabic: 'مَنْ قَالَ لَا إِلَٰهَ إِلَّا اللَّهُ خَالِصًا مِنْ قَلْبِهِ دَخَلَ الْجَنَّةَ',
    translation: 'Whoever says “La ilaha illallah” sincerely from his heart shall enter Paradise.',
  },

  // ── Character ─────────────────────────────────────────────────
  {
    id: 'h-best-character', books: ['bukhari'], source: 'Bukhari 6029',
    narrator: 'Abdullah ibn Amr', category: 'character',
    arabic: 'خِيَارُكُمْ أَحَاسِنُكُمْ أَخْلَاقًا',
    translation: 'The best of you are those who are best in character.',
  },
  {
    id: 'h-speak-good', books: ['bukhari', 'muslim'], source: 'Bukhari 6018 · Muslim 47',
    narrator: 'Abu Hurayrah', category: 'character',
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    translation: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
  },
  {
    id: 'h-do-not-anger', books: ['bukhari'], source: 'Bukhari 6116',
    narrator: 'Abu Hurayrah', category: 'character',
    arabic: 'لَا تَغْضَبْ',
    translation: 'Do not become angry. (Repeated three times, in answer to a man who asked for advice.)',
  },
  {
    id: 'h-strong-not-wrestler', books: ['bukhari', 'muslim'], source: 'Bukhari 6114 · Muslim 2609',
    narrator: 'Abu Hurayrah', category: 'character',
    arabic: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
    translation: 'The strong man is not the one who overcomes others in wrestling; rather, the strong man is the one who controls himself when angry.',
  },
  {
    id: 'h-kindness', books: ['muslim'], source: 'Muslim 2593',
    narrator: 'Aisha', category: 'character',
    arabic: 'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ',
    translation: 'Indeed Allah is gentle and loves gentleness in every affair.',
  },
  {
    id: 'h-smile-charity', books: ['bukhari'], source: 'Bukhari 6023',
    narrator: 'Abu Dharr', category: 'character',
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    translation: 'Your smiling in the face of your brother is an act of charity.',
  },

  // ── Prayer & Worship ──────────────────────────────────────────
  {
    id: 'h-pray-as-you-see', books: ['bukhari'], source: 'Bukhari 631',
    narrator: 'Malik ibn al-Huwayrith', category: 'worship',
    arabic: 'صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي',
    translation: 'Pray as you have seen me pray.',
  },
  {
    id: 'h-river-door', books: ['bukhari', 'muslim'], source: 'Bukhari 528 · Muslim 668',
    narrator: 'Abu Hurayrah', category: 'worship',
    arabic: 'أَرَأَيْتُمْ لَوْ أَنَّ نَهْرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ، هَلْ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ؟ فَذَلِكَ مَثَلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهِنَّ الْخَطَايَا',
    translation: '“Tell me, if there were a river at the door of any of you and he bathed in it five times a day, would any dirt remain on him?” They said, “No dirt would remain.” He said, “That is the likeness of the five prayers, by which Allah wipes away sins.”',
  },
  {
    id: 'h-fajr-two-rakah', books: ['muslim'], source: 'Muslim 725',
    narrator: 'Aisha', category: 'worship',
    arabic: 'رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا',
    translation: 'The two rak’ahs of Fajr are better than this world and all that it contains.',
  },
  {
    id: 'h-wudu-light', books: ['muslim'], source: 'Muslim 251',
    narrator: 'Abu Hurayrah', category: 'worship',
    arabic: 'إِذَا تَوَضَّأَ الْعَبْدُ الْمُسْلِمُ فَغَسَلَ وَجْهَهُ خَرَجَ مِنْ وَجْهِهِ كُلُّ خَطِيئَةٍ نَظَرَ إِلَيْهَا بِعَيْنَيْهِ مَعَ الْمَاءِ',
    translation: 'When a Muslim performs wudu and washes his face, every sin he looked at with his eyes leaves with the water.',
  },

  // ── Charity & Generosity ──────────────────────────────────────
  {
    id: 'h-charity-not-decrease', books: ['muslim'], source: 'Muslim 2588',
    narrator: 'Abu Hurayrah', category: 'charity',
    arabic: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',
    translation: 'Charity does not decrease wealth.',
  },
  {
    id: 'h-half-date', books: ['bukhari', 'muslim'], source: 'Bukhari 1417 · Muslim 1016',
    narrator: 'Adi ibn Hatim', category: 'charity',
    arabic: 'اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ',
    translation: 'Protect yourselves from the Fire, even with half a date in charity.',
  },
  {
    id: 'h-upper-hand', books: ['bukhari', 'muslim'], source: 'Bukhari 1429 · Muslim 1033',
    narrator: 'Hakim ibn Hizam', category: 'charity',
    arabic: 'الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى',
    translation: 'The upper hand (that gives) is better than the lower hand (that takes).',
  },
  {
    id: 'h-good-deed-charity', books: ['muslim'], source: 'Muslim 1005',
    narrator: 'Jabir ibn Abdullah', category: 'charity',
    arabic: 'كُلُّ مَعْرُوفٍ صَدَقَةٌ',
    translation: 'Every act of goodness is charity.',
  },

  // ── Patience & Trials ─────────────────────────────────────────
  {
    id: 'h-wonderful-believer', books: ['muslim'], source: 'Muslim 2999',
    narrator: 'Suhayb ar-Rumi', category: 'patience',
    arabic: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ... إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ',
    translation: '“How wonderful is the affair of the believer! His affair is all good… If prosperity comes to him he is grateful, and that is good for him; and if adversity befalls him he is patient, and that is good for him.”',
  },
  {
    id: 'h-fatigue-expiates', books: ['bukhari', 'muslim'], source: 'Bukhari 5641 · Muslim 2573',
    narrator: 'Abu Sa’id al-Khudri & Abu Hurayrah', category: 'patience',
    arabic: 'مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حُزْنٍ وَلَا أَذًى وَلَا غَمٍّ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ',
    translation: 'No fatigue, illness, anxiety, sorrow, harm or distress befalls a Muslim — even the prick of a thorn — except that Allah expiates some of his sins by it.',
  },

  // ── Brotherhood & Community ───────────────────────────────────
  {
    id: 'h-muslim-brother', books: ['bukhari', 'muslim'], source: 'Bukhari 2442 · Muslim 2564',
    narrator: 'Abdullah ibn Umar', category: 'brotherhood',
    arabic: 'الْمُسْلِمُ أَخُو الْمُسْلِمِ، لَا يَظْلِمُهُ وَلَا يُسْلِمُهُ',
    translation: 'A Muslim is the brother of a Muslim: he neither wrongs him nor hands him over to his oppressor.',
  },
  {
    id: 'h-one-body', books: ['bukhari', 'muslim'], source: 'Bukhari 6011 · Muslim 2586',
    narrator: 'An-Nu’man ibn Bashir', category: 'brotherhood',
    arabic: 'مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ، إِذَا اشْتَكَى مِنْهُ عُضْوٌ تَدَاعَى لَهُ سَائِرُ الْجَسَدِ بِالسَّهَرِ وَالْحُمَّى',
    translation: 'The believers, in their mutual love, mercy and compassion, are like one body: when one limb aches, the whole body responds with sleeplessness and fever.',
  },
  {
    id: 'h-rights-muslim', books: ['muslim'], source: 'Muslim 2162',
    narrator: 'Abu Hurayrah', category: 'brotherhood',
    arabic: 'حَقُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ سِتٌّ: إِذَا لَقِيتَهُ فَسَلِّمْ عَلَيْهِ، وَإِذَا دَعَاكَ فَأَجِبْهُ، وَإِذَا اسْتَنْصَحَكَ فَانْصَحْ لَهُ، وَإِذَا عَطَسَ فَحَمِدَ اللَّهَ فَسَمِّتْهُ، وَإِذَا مَرِضَ فَعُدْهُ، وَإِذَا مَاتَ فَاتَّبِعْهُ',
    translation: 'The rights of a Muslim upon a Muslim are six: greet him when you meet him, accept his invitation, advise him when he seeks counsel, say “yarhamukallah” when he sneezes and praises Allah, visit him when he is sick, and follow his funeral when he dies.',
  },

  // ── Knowledge ─────────────────────────────────────────────────
  {
    id: 'h-path-knowledge', books: ['muslim'], source: 'Muslim 2699',
    narrator: 'Abu Hurayrah', category: 'knowledge',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: 'Whoever treads a path in search of knowledge, Allah makes easy for him a path to Paradise.',
  },
  {
    id: 'h-understanding-din', books: ['bukhari', 'muslim'], source: 'Bukhari 71 · Muslim 1037',
    narrator: 'Mu’awiyah ibn Abi Sufyan', category: 'knowledge',
    arabic: 'مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ',
    translation: 'Whomever Allah wishes good for, He grants him understanding of the religion.',
  },

  // ── Heart & Sincerity ─────────────────────────────────────────
  {
    id: 'h-hearts-deeds', books: ['muslim'], source: 'Muslim 2564',
    narrator: 'Abu Hurayrah', category: 'heart',
    arabic: 'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
    translation: 'Allah does not look at your forms or your wealth, but He looks at your hearts and your deeds.',
  },
  {
    id: 'h-halal-haram', books: ['bukhari', 'muslim'], source: 'Bukhari 52 · Muslim 1599',
    narrator: 'An-Nu’man ibn Bashir', category: 'heart',
    arabic: 'الْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ، وَبَيْنَهُمَا مُشَبَّهَاتٌ لَا يَعْلَمُهَا كَثِيرٌ مِنَ النَّاسِ... أَلَا وَإِنَّ فِي الْجَسَدِ مُضْغَةً، إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ، أَلَا وَهِيَ الْقَلْبُ',
    translation: '“The lawful is clear and the unlawful is clear, and between them are doubtful matters… Indeed in the body there is a piece of flesh: if it is sound, the whole body is sound, and if it is corrupt, the whole body is corrupt. Indeed, it is the heart.”',
  },

  // ── Remembrance ───────────────────────────────────────────────
  {
    id: 'h-two-phrases', books: ['bukhari', 'muslim'], source: 'Bukhari 6682 · Muslim 2694',
    narrator: 'Abu Hurayrah', category: 'dhikr',
    arabic: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    translation: 'Two phrases light on the tongue, heavy on the scale, beloved to the Most Merciful: “SubhanAllahi wa bihamdihi, SubhanAllahil-Azim.”',
  },
  {
    id: 'h-remember-me', books: ['bukhari', 'muslim'], source: 'Bukhari 7405 · Muslim 2675',
    narrator: 'Abu Hurayrah', category: 'dhikr',
    arabic: 'يَقُولُ اللَّهُ تَعَالَى: أَنَا عِنْدَ ظَنِّ عَبْدِي بِي، وَأَنَا مَعَهُ إِذَا ذَكَرَنِي',
    translation: 'Allah says: “I am as My servant thinks of Me, and I am with him when he remembers Me.”',
  },

  // ── The Hereafter ─────────────────────────────────────────────
  {
    id: 'h-stranger-traveler', books: ['bukhari'], source: 'Bukhari 6416',
    narrator: 'Abdullah ibn Umar', category: 'hereafter',
    arabic: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ',
    translation: 'Be in this world as though you were a stranger or a traveler.',
  },
  {
    id: 'h-love-meeting', books: ['bukhari', 'muslim'], source: 'Bukhari 6507 · Muslim 2683',
    narrator: 'Ubadah ibn as-Samit', category: 'hereafter',
    arabic: 'مَنْ أَحَبَّ لِقَاءَ اللَّهِ أَحَبَّ اللَّهُ لِقَاءَهُ، وَمَنْ كَرِهَ لِقَاءَ اللَّهِ كَرِهَ اللَّهُ لِقَاءَهُ',
    translation: 'Whoever loves to meet Allah, Allah loves to meet him; and whoever hates to meet Allah, Allah hates to meet him.',
  },

  // ── Mercy & Family ────────────────────────────────────────────
  {
    id: 'h-mercy-young', books: ['muslim'], source: 'Muslim 2319',
    narrator: 'Anas ibn Malik', category: 'mercy',
    arabic: 'مَا كَانَ الرِّفْقُ فِي شَيْءٍ إِلَّا زَانَهُ، وَلَا نُزِعَ مِنْ شَيْءٍ إِلَّا شَانَهُ',
    translation: 'Gentleness is not found in anything but that it adorns it, and it is not removed from anything but that it disfigures it.',
  },
  {
    id: 'h-best-to-family', books: ['muslim'], source: 'Muslim 2241',
    narrator: 'Abdullah ibn Amr', category: 'mercy',
    arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ',
    translation: 'The merciful are shown mercy by the Most Merciful. Show mercy to those on the earth, and He Who is above the heavens will show mercy to you.',
  },
];

/** Display labels for every category plus the combined view. */
export const HADITH_CATEGORY_LABELS: Readonly<Record<HadithCategory | 'all', string>> = {
  all: 'All',
  intention: 'Faith & Intention',
  character: 'Character',
  worship: 'Prayer & Worship',
  charity: 'Charity',
  patience: 'Patience & Trials',
  brotherhood: 'Brotherhood',
  knowledge: 'Knowledge',
  heart: 'Heart & Sincerity',
  dhikr: 'Remembrance',
  hereafter: 'The Hereafter',
  mercy: 'Mercy & Family',
};

/** Display labels for the canonical collections. */
export const HADITH_BOOK_LABELS: Readonly<Record<HadithBook | 'all', string>> = {
  all: 'All Collections',
  bukhari: 'Sahih al-Bukhari',
  muslim: 'Sahih Muslim',
};

/** Category ids in display order. */
export const HADITH_CATEGORY_ORDER: readonly HadithCategory[] = [
  'intention',
  'character',
  'worship',
  'charity',
  'patience',
  'brotherhood',
  'knowledge',
  'heart',
  'dhikr',
  'hereafter',
  'mercy',
];

/**
 * Filters hadiths by book and category.
 * @param book - Collection filter, or 'all'.
 * @param category - Category filter, or 'all'.
 * @returns Matching hadiths in canonical order.
 */
export function filterHadiths(
  book: HadithBook | 'all',
  category: HadithCategory | 'all'
): readonly Hadith[] {
  return HADITHS.filter(
    (h) =>
      (book === 'all' || h.books.includes(book)) &&
      (category === 'all' || h.category === category)
  );
}

/**
 * Searches the collection across Arabic, translation, narrator,
 * source and category label (case-insensitive).
 * @param query - Search text.
 * @param book - Optional collection filter applied before searching.
 * @returns Matching hadiths; the filtered set when query is empty.
 */
export function searchHadiths(query: string, book: HadithBook | 'all'): readonly Hadith[] {
  const q = query.trim().toLowerCase();
  const pool = filterHadiths(book, 'all');
  if (q === '') return pool;
  return pool.filter(
    (h) =>
      h.arabic.includes(q) ||
      h.translation.toLowerCase().includes(q) ||
      h.narrator.toLowerCase().includes(q) ||
      h.source.toLowerCase().includes(q) ||
      HADITH_CATEGORY_LABELS[h.category].toLowerCase().includes(q)
  );
}

/**
 * Number of hadiths in a category within a book filter.
 * @param category - Category id or 'all'.
 * @param book - Collection filter, or 'all'.
 * @returns Count.
 */
export function countHadiths(category: HadithCategory | 'all', book: HadithBook | 'all'): number {
  return filterHadiths(book, category).length;
}

/**
 * Deterministic "hadith of the day" that rotates with the calendar.
 * @param date - Reference date (defaults to today).
 * @returns The featured hadith.
 */
export function hadithOfTheDay(date: Date = new Date()): Hadith {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  return HADITHS[dayOfYear % HADITHS.length] ?? (HADITHS[0] as Hadith);
}
