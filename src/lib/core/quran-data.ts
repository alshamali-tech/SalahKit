/**
 * Local Quran dataset (S3: quran-data.ts): Al-Fatiha plus the short
 * surahs of Juz Amma, with Arabic text and EN/UR/FR translations
 * (public-domain meanings, condensed). Fully readable offline.
 * Pure TypeScript — no framework imports.
 */
import type { Ayah, SurahMeta, TranslationLang } from './types';

/** Surah metadata for the local dataset. */
export const QURAN_SURAHS: readonly SurahMeta[] = [
  { num: 1, nameArabic: 'الفاتحة', name: 'Al-Fatihah', meaning: 'The Opening', ayahCount: 7, revelation: 'Makkan' },
  { num: 103, nameArabic: 'العصر', name: 'Al-Asr', meaning: 'The Declining Day', ayahCount: 3, revelation: 'Makkan' },
  { num: 108, nameArabic: 'الكوثر', name: 'Al-Kawthar', meaning: 'The Abundance', ayahCount: 3, revelation: 'Makkan' },
  { num: 110, nameArabic: 'النصر', name: 'An-Nasr', meaning: 'The Divine Support', ayahCount: 3, revelation: 'Madanan' },
  { num: 112, nameArabic: 'الإخلاص', name: 'Al-Ikhlas', meaning: 'The Sincerity', ayahCount: 4, revelation: 'Makkan' },
  { num: 113, nameArabic: 'الفلق', name: 'Al-Falaq', meaning: 'The Daybreak', ayahCount: 5, revelation: 'Makkan' },
  { num: 114, nameArabic: 'الناس', name: 'An-Nas', meaning: 'Mankind', ayahCount: 6, revelation: 'Makkan' },
];

/** Basmala, recited before every surah except At-Tawbah. */
export const BASMALA = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

/** Verse data for the local dataset. */
export const QURAN_AYAHS: readonly Ayah[] = [
  { surah: 1, ayah: 1, arabic: BASMALA, en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', ur: 'شروع الله کا نام لے کر جو بڑا مہربان نہایت رحم والا ہے', fr: 'Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux.' },
  { surah: 1, ayah: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', en: 'All praise is due to Allah, Lord of the worlds.', ur: 'سب تعریف اللہ ہی کے لیے ہے جو تمام جہانوں کا پالنہار ہے', fr: 'Louange à Allah, Seigneur de l’univers.' },
  { surah: 1, ayah: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', en: 'The Entirely Merciful, the Especially Merciful.', ur: 'بڑا مہربان، نہایت رحم والا', fr: 'Le Tout Miséricordieux, le Très Miséricordieux.' },
  { surah: 1, ayah: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', en: 'Sovereign of the Day of Recompense.', ur: 'روزِ جزا کا بادشاہ', fr: 'Maître du Jour de la rétribution.' },
  { surah: 1, ayah: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', en: 'It is You we worship and You we ask for help.', ur: 'ہم تیری ہی عبادت کرتے ہیں اور تجھی سے مدد مانگتے ہیں', fr: 'C’est Toi que nous adorons et Toi dont nous implorons secours.' },
  { surah: 1, ayah: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', en: 'Guide us to the straight path.', ur: 'ہمیں سیدھا راستہ دکھا', fr: 'Guide-nous dans le droit chemin.' },
  { surah: 1, ayah: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', en: 'The path of those upon whom You have bestowed favor, not of those who have earned Your anger or of those who are astray.', ur: 'ان لوگوں کا راستہ جن پر تو انعام فرماتا رہا، نہ ان کا جن پر غصہ ہوا اور نہ گمراہوں کا', fr: 'Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.' },
  { surah: 103, ayah: 1, arabic: 'وَالْعَصْرِ', en: 'By time,', ur: 'زمانے کی قسم', fr: 'Par le temps !' },
  { surah: 103, ayah: 2, arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', en: 'Indeed, mankind is in loss,', ur: 'بے شک انسان نقصان میں ہے', fr: 'L’homme est certes en perdition,' },
  { surah: 103, ayah: 3, arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', en: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.', ur: 'مگر وہ لوگ جو ایمان لائے اور نیک عمل کرتے رہے اور آپس میں حق کی تلقین اور صبر کی وصیت کرتے رہے', fr: 'Sauf ceux qui croient et accomplissent les bonnes œuvres, s’enjoignent mutuellement la vérité et s’enjoignent mutuellement l’endurance.' },
  { surah: 108, ayah: 1, arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', en: 'Indeed, We have granted you Al-Kawthar.', ur: 'بے شک ہم نے آپ کو کوثر عطا فرمائی', fr: 'Nous t’avons certes accordé l’Abondance.' },
  { surah: 108, ayah: 2, arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', en: 'So pray to your Lord and sacrifice.', ur: 'پس اپنے رب کے لیے نماز پڑھیے اور قربانی کیجیے', fr: 'Accomplis la prière pour ton Seigneur et sacrifie.' },
  { surah: 108, ayah: 3, arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', en: 'Indeed, your enemy is the one cut off.', ur: 'بے شک آپ کا دشمن ہی بےنام و نشان ہوگا', fr: 'Celui qui te hait sera certes sans postérité.' },
  { surah: 110, ayah: 1, arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', en: 'When the victory of Allah has come and the conquest,', ur: 'جب اللہ کی مدد اور فتح آ جائے', fr: 'Lorsque vient le secours d’Allah ainsi que la victoire,' },
  { surah: 110, ayah: 2, arabic: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا', en: 'And you see the people entering into the religion of Allah in multitudes,', ur: 'اور آپ لوگوں کو اللہ کے دین میں فوج در فوج داخل ہوتے دیکھ لیں', fr: 'Et que tu vois les gens entrer en foule dans la religion d’Allah,' },
  { surah: 110, ayah: 3, arabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا', en: 'Then exalt Him with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.', ur: 'تو اپنے رب کی حمد کے ساتھ تسبیح کیجیے اور اس سے مغفرت مانگیے، بے شک وہ بہت توبہ قبول کرنے والا ہے', fr: 'Alors, par la louange, célèbre la gloire de ton Seigneur et implore Son pardon. Car c’est Lui le grand Accueillant au repentir.' },
  { surah: 112, ayah: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', en: 'Say: He is Allah, who is One,', ur: 'کہیے: وہ اللہ ایک ہے', fr: 'Dis : « Il est Allah, Unique.' },
  { surah: 112, ayah: 2, arabic: 'اللَّهُ الصَّمَدُ', en: 'Allah, the Eternal Refuge.', ur: 'اللہ بےنیاز ہے', fr: 'Allah, Le Seul à être imploré pour ce que nous désirons.' },
  { surah: 112, ayah: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', en: 'He neither begets nor is born,', ur: 'نہ اس نے کسی کو جنا اور نہ وہ جنا گیا', fr: 'Il n’a jamais engendré, ni n’a été engendré.' },
  { surah: 112, ayah: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', en: 'Nor is there to Him any equivalent.', ur: 'اور اس کا کوئی ہمسر نہیں', fr: 'Et nul n’est égal à Lui. »' },
  { surah: 113, ayah: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', en: 'Say: I seek refuge in the Lord of daybreak,', ur: 'کہیے: میں صبح کے رب کی پناہ مانگتا ہوں', fr: 'Dis : « Je cherche protection auprès du Seigneur de l’aube naissante,' },
  { surah: 113, ayah: 2, arabic: 'مِن شَرِّ مَا خَلَقَ', en: 'From the evil of that which He created,', ur: 'ہر مخلوق کے شر سے', fr: 'Contre le mal des êtres qu’Il a créés,' },
  { surah: 113, ayah: 3, arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', en: 'And from the evil of darkness when it settles,', ur: 'اور اندھیری رات کے شر سے جب اس کا اندھیرا چھا جائے', fr: 'Contre le mal de l’obscurité quand elle s’approfondit,' },
  { surah: 113, ayah: 4, arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', en: 'And from the evil of the blowers in knots,', ur: 'اور گرہوں میں پھونکنے والیوں کے شر سے', fr: 'Contre le mal de celles qui soufflent sur les nœuds,' },
  { surah: 113, ayah: 5, arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', en: 'And from the evil of an envier when he envies.', ur: 'اور حسد کرنے والے کے شر سے جب وہ حسد کرے', fr: 'Et contre le mal de l’envieux quand il envie. »' },
  { surah: 114, ayah: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', en: 'Say: I seek refuge in the Lord of mankind,', ur: 'کہیے: میں لوگوں کے رب کی پناہ مانگتا ہوں', fr: 'Dis : « Je cherche protection auprès du Seigneur des hommes,' },
  { surah: 114, ayah: 2, arabic: 'مَلِكِ النَّاسِ', en: 'The Sovereign of mankind,', ur: 'لوگوں کے بادشاہ کی', fr: 'Le Souverain des hommes,' },
  { surah: 114, ayah: 3, arabic: 'إِلَٰهِ النَّاسِ', en: 'The God of mankind,', ur: 'لوگوں کے معبود کی', fr: 'Dieu des hommes,' },
  { surah: 114, ayah: 4, arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', en: 'From the evil of the retreating whisperer,', ur: 'وسوسہ ڈالنے والے کے شر سے جو پیچھے ہٹ جاتا ہے', fr: 'Contre le mal du mauvais conseiller, furtif,' },
  { surah: 114, ayah: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', en: 'Who whispers evil into the breasts of mankind,', ur: 'جو لوگوں کے دلوں میں وسوسے ڈالتا ہے', fr: 'Qui souffle le mal dans les poitrines des hommes,' },
  { surah: 114, ayah: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', en: 'Among jinn and among men.', ur: 'خواہ وہ جنوں میں سے ہو یا انسانوں میں سے', fr: 'Qu’il soit un djinn ou un être humain. »' },
];

/** Translation display names. */
export const TRANSLATION_LABELS: Readonly<Record<TranslationLang, string>> = {
  en: 'English',
  ur: 'اردو',
  fr: 'Français',
};

/**
 * Metadata for a surah in the local dataset.
 * @param num - Surah number.
 * @returns The surah metadata.
 * @throws Error when the surah is not in the local dataset.
 */
export function getSurahMeta(num: number): SurahMeta {
  const meta = QURAN_SURAHS.find((s) => s.num === num);
  if (!meta) throw new Error(`SalahKit: surah ${num} is not in the local dataset.`);
  return meta;
}

/**
 * All verses for a surah in the local dataset, ordered by ayah number.
 * @param num - Surah number.
 * @returns Array of ayahs.
 */
export function getAyahsForSurah(num: number): readonly Ayah[] {
  return QURAN_AYAHS.filter((a) => a.surah === num).sort((a, b) => a.ayah - b.ayah);
}
