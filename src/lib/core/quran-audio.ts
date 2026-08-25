/**
 * Quran audio core (pure TypeScript, zero side effects).
 * Reciter metadata and per-ayah audio URLs from the free Islamic
 * Network CDN (the public audio mirror behind AlQuran Cloud). Each
 * ayah is addressed by its global mushaf number (1..6236), so any
 * surah/chunk range can be turned into a play queue.
 */
import { ALL_SURAHS } from './quran-meta';
import { globalAyahIndex } from './hifz';
import { getJSON, setJSON } from '../utils/storage';

/** CDN base for per-ayah MP3 audio. */
const AUDIO_CDN = 'https://cdn.islamic.network/quran/audio';

/** A playable ayah reference. */
export interface AyahRef {
  /** Surah number (1-114). */
  surah: number;
  /** Ayah number within the surah (1-based). */
  ayah: number;
  /** Global mushaf number (1-6236) used by the audio CDN. */
  global: number;
}

/** A reciter available on the CDN. */
export interface Reciter {
  /** AlQuran Cloud edition id. */
  id: string;
  /** Display name. */
  name: string;
  /** Recitation style note. */
  style: string;
  /** CDN bitrate. */
  bitrate: number;
}

/** Reciters offered in the player (all free, keyless CDN editions). */
export const RECITERS: readonly Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', style: 'Clear · most popular', bitrate: 128 },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', style: 'Tajwid · ideal for hifz', bitrate: 128 },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi', style: 'Murattal · measured', bitrate: 128 },
  { id: 'ar.muhammadayyoub', name: 'Muhammad Ayyoub', style: 'Gentle · easy pace', bitrate: 128 },
  { id: 'ar.mahermuaiqly', name: 'Maher Al-Muaiqly', style: 'Melodic · warm', bitrate: 128 },
];

const RECITER_STORAGE_KEY = 'salahkit:reciter';

/**
 * Builds the CDN URL for one ayah in one reciter's voice.
 * @param reciterId - AlQuran Cloud edition id.
 * @param globalAyah - Global mushaf number (1-6236).
 * @param bitrate - CDN bitrate (default 128).
 * @returns MP3 URL.
 */
export function buildAudioUrl(reciterId: string, globalAyah: number, bitrate = 128): string {
  return `${AUDIO_CDN}/${bitrate}/${reciterId}/${globalAyah}.mp3`;
}

/**
 * Resolves a reciter by id, defaulting to Alafasy.
 * @param id - Reciter edition id.
 * @returns The matching reciter.
 */
export function getReciter(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? (RECITERS[0] as Reciter);
}

/**
 * Makes an AyahRef from surah and ayah numbers.
 * @param surah - Surah number.
 * @param ayah - Ayah number within the surah.
 * @returns A playable reference with its global index.
 */
export function ayahRef(surah: number, ayah: number): AyahRef {
  return { surah, ayah, global: globalAyahIndex(surah, ayah) + 1 };
}

/**
 * Builds a play queue for a contiguous ayah range of one surah.
 * @param surah - Surah number.
 * @param fromAyah - First ayah (1-based).
 * @param toAyah - Last ayah (inclusive).
 * @returns Ordered AyahRef list.
 */
export function rangeRefs(surah: number, fromAyah: number, toAyah: number): AyahRef[] {
  const refs: AyahRef[] = [];
  for (let a = fromAyah; a <= toAyah; a += 1) refs.push(ayahRef(surah, a));
  return refs;
}

/**
 * Builds a play queue for an entire surah.
 * @param surah - Surah number.
 * @returns Ordered AyahRef list for the whole surah.
 */
export function surahRefs(surah: number): AyahRef[] {
  const count = ALL_SURAHS.find((s) => s.num === surah)?.ayahCount ?? 0;
  return rangeRefs(surah, 1, count);
}

/**
 * Reads the persisted reciter preference.
 * @returns Stored reciter id, or Alafasy when unset.
 */
export function getStoredReciter(): string {
  const stored = getJSON<string>(RECITER_STORAGE_KEY, (RECITERS[0] as Reciter).id);
  // Fall back when the stored id is no longer offered (e.g. a reciter was removed).
  return RECITERS.some((r) => r.id === stored) ? stored : (RECITERS[0] as Reciter).id;
}

/**
 * Persists the reciter preference.
 * @param id - Reciter edition id to store.
 */
export function setStoredReciter(id: string): void {
  setJSON(RECITER_STORAGE_KEY, id);
}
