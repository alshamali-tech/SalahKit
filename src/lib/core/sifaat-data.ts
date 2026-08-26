/**
 * Ṣifāt al-Ḥurūf (صفات الحروف) — the inherent characteristics of the
 * Arabic letters, as taught in Minhaj al-Dārisīn (Ch. 17). Pure data.
 * Opposing pairs are stored with their "marked" letter set; the
 * complement pole is derived from the full alphabet so the two always
 * partition it. Standalone traits are listed outright.
 */
import { LETTER_ZONES } from './tajweed-data';

/** The letters of the alphabet (hamza included as its own entry). */
export const SIFAAT_LETTERS: readonly string[] = [
  'ء', 'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
];

/** One ṣifah (characteristic). */
export interface Sifah {
  /** Stable id. */
  id: string;
  /** Transliterated name. */
  name: string;
  /** Arabic name. */
  arabic: string;
  /** Short English gloss of what it means. */
  meaning: string;
  /** Letters that exhibit this trait. */
  letters: readonly string[];
  /** Opposing-pair family id, or null for standalone traits. */
  pair: string | null;
  /** Theme-aware colour token used by the explorer. */
  color: string;
  /** True for the "rest of the alphabet" pole of an opposing pair. */
  complement?: boolean;
}

/** Raw opposing-pair configuration (marked set + optional middle). */
interface PairSpec {
  pair: string;
  a: { name: string; arabic: string; meaning: string; letters: string[] };
  b: { name: string; arabic: string; meaning: string };
  middle?: { name: string; arabic: string; meaning: string; letters: string[] };
}

const PAIR_SPECS: readonly PairSpec[] = [
  {
    pair: 'hams-jahr',
    a: { name: 'Hams', arabic: 'الهمس', meaning: 'Breath flows out — a whispered, airy sound', letters: ['ف', 'ح', 'ث', 'ه', 'ش', 'خ', 'س', 'ت', 'ك', 'ص'] },
    b: { name: 'Jahr', arabic: 'الجهر', meaning: 'Breath is held back — a clear, voiced sound' },
  },
  {
    pair: 'shiddah-rakhawah',
    a: { name: 'Shiddah', arabic: 'الشدة', meaning: 'Sound is fully stopped — a firm, abrupt press', letters: ['ء', 'ج', 'د', 'ق', 'ط', 'ب', 'ك', 'ت'] },
    b: { name: 'Rakhāwah', arabic: 'الرخاوة', meaning: 'Sound flows freely — a soft, yielding release' },
    middle: { name: 'Tawassuṭ', arabic: 'التوسط', meaning: 'Between stop and flow — a moderate release', letters: ['ل', 'ن', 'ع', 'م', 'ر'] },
  },
  {
    pair: "isti'la-istifal",
    a: { name: "Isti'la", arabic: 'الاستعلاء', meaning: 'Tongue rises to the palate — heavy, full-mouthed (tafkhīm)', letters: ['خ', 'ص', 'ض', 'غ', 'ط', 'ق', 'ظ'] },
    b: { name: 'Istifāl', arabic: 'الاستفال', meaning: 'Tongue stays low — light, thin (tarqīq)' },
  },
  {
    pair: 'itbaq-infitah',
    a: { name: 'Iṭbāq', arabic: 'الإطباق', meaning: 'Tongue seals against the palate — enclosed, resonant', letters: ['ص', 'ض', 'ط', 'ظ'] },
    b: { name: 'Infitāḥ', arabic: 'الانفتاح', meaning: 'An opening remains between tongue and palate' },
  },
  {
    pair: 'idhlaq-ismat',
    a: { name: 'Idhlāq', arabic: 'الإذلاق', meaning: 'Light and quick off the tongue — agile letters', letters: ['ف', 'ر', 'م', 'ن', 'ل', 'ب'] },
    b: { name: 'Iṣmāt', arabic: 'الإصمات', meaning: 'Heavier, more restrained articulation' },
  },
];

/** Standalone (non-opposing) traits, with their letters. */
const STANDALONE: readonly Omit<Sifah, 'pair'>[] = [
  { id: 'safir', name: 'Ṣafīr', arabic: 'الصفير', meaning: 'A whistling, hissing accompaniment', letters: ['ص', 'س', 'ز'], color: 'var(--tw-qalqalah)' },
  { id: 'qalqalah-sifah', name: 'Qalqalah', arabic: 'القلقلة', meaning: 'A bouncing echo when the letter is sakin', letters: ['ق', 'ط', 'ب', 'ج', 'د'], color: 'var(--tw-qalqalah-kubra)' },
  { id: 'lin', name: 'Līn', arabic: 'اللين', meaning: 'Softness — sakin و or ي following a fatha', letters: ['و', 'ي'], color: 'var(--tw-madd-leen)' },
  { id: 'inhiraf', name: 'Inḥirāf', arabic: 'الانحراف', meaning: 'The tongue tilts away from its makhraj', letters: ['ل', 'ر'], color: 'var(--tw-madd-silah-sughra)' },
  { id: 'takrir', name: 'Takrīr', arabic: 'التكرير', meaning: 'The tongue-tip vibrates — a trill to be restrained', letters: ['ر'], color: 'var(--tw-ra-tafkhim)' },
  { id: 'tafashi', name: 'Tafashshī', arabic: 'التفشي', meaning: 'Breath spreads widely through the mouth', letters: ['ش'], color: 'var(--tw-idghaam-ghunna)' },
  { id: 'istitalah', name: 'Istiṭālah', arabic: 'الاستطالة', meaning: 'Sound stretches along the tongue’s edge', letters: ['ض'], color: 'var(--tw-ikhfaa)' },
];

/** Hue assignments for the opposing-pair poles. */
const PAIR_COLORS: Record<string, [string, string, string?]> = {
  'hams-jahr': ['var(--tw-madd)', 'var(--tw-izhaar)', undefined],
  'shiddah-rakhawah': ['var(--tw-iqlaab)', 'var(--tw-madd-badal)', 'var(--tw-idghaam-bila-ghunna)'],
  "isti'la-istifal": ['var(--tw-ra-tafkhim)', 'var(--tw-ra-tarqeeq)', undefined],
  'itbaq-infitah': ['var(--tw-madd-lazim)', 'var(--tw-meem-ikhfaa)', undefined],
  'idhlaq-ismat': ['var(--tw-idghaam-ghunna)', 'var(--tw-lam-qamari)', undefined],
};

/** Build the full ṣifāt list, deriving each complement pole. */
function buildSifaat(): Sifah[] {
  const out: Sifah[] = [];
  for (const spec of PAIR_SPECS) {
    const [colorA, colorB, colorM] = PAIR_COLORS[spec.pair] ?? ['var(--tw-madd)', 'var(--tw-izhaar)'];
    const marked = new Set(spec.a.letters);
    const middle = new Set(spec.middle?.letters ?? []);
    const rest = SIFAAT_LETTERS.filter((l) => !marked.has(l) && !middle.has(l));
    out.push({ id: spec.pair + '-a', name: spec.a.name, arabic: spec.a.arabic, meaning: spec.a.meaning, letters: spec.a.letters, pair: spec.pair, color: colorA });
    out.push({ id: spec.pair + '-b', name: spec.b.name, arabic: spec.b.arabic, meaning: spec.b.meaning, letters: rest, pair: spec.pair, color: colorB, complement: true });
    if (spec.middle) {
      out.push({ id: spec.pair + '-m', name: spec.middle.name, arabic: spec.middle.arabic, meaning: spec.middle.meaning, letters: spec.middle.letters, pair: spec.pair, color: colorM ?? colorB });
    }
  }
  for (const s of STANDALONE) out.push({ ...s, pair: null });
  return out;
}

/** All ṣifāt in display order. */
export const SIFAAT: readonly Sifah[] = buildSifaat();

/** Human label for a letter's articulation zone. */
export function sifahZone(letter: string): string {
  return LETTER_ZONES[letter] ?? '—';
}

/**
 * Reverse lookup: every ṣifah a given letter carries.
 * @param letter - An Arabic letter.
 * @returns The sifaat that include that letter.
 */
export function traitsOfLetter(letter: string): readonly Sifah[] {
  return SIFAAT.filter((s) => s.letters.includes(letter));
}
