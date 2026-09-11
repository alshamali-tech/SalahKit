import { useEffect, useMemo, useState } from 'react';
import { ARABIC_LETTERS } from '../../lib/core/arabic-data';
import type { ArabicLetter } from '../../lib/core/arabic-data';
import { useT } from '../../lib/use-locale';
import { emitToast } from '../../lib/messaging';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { HarakatSection, GrammarSection, VocabSection } from './arabic-sections';

type TabId = 'letters' | 'harakat' | 'grammar' | 'vocab';

/**
 * Speaks Arabic text using the browser's speech synthesis. Voices load
 * asynchronously in most browsers, so we query (and warm) them first.
 * @param text - Arabic text to pronounce.
 * @param onEnd - Optional callback when speech finishes.
 * @returns True when speech was started, false when unavailable.
 */
export function speakArabic(text: string, onEnd?: () => void): boolean {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.85;
    u.pitch = 1;
    // getVoices() can be empty until the 'voiceschanged' event fires;
    // calling it here triggers the load on browsers that defer it.
    const voices = synth.getVoices();
    const arVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
    if (arVoice) {
      u.voice = arVoice;
    } else {
      // No Arabic voice available — use default but warn the user
      const defaultVoice = voices.find((v) => v.default);
      if (defaultVoice) u.voice = defaultVoice;
    }
    if (onEnd) {
      u.onend = onEnd;
      u.onerror = onEnd;
    }
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

/**
 * Stops any currently playing speech.
 */
export function stopArabic(): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // Ignore errors
  }
}

/** Warms the voice list once so "Hear it" works on the first tap. */
function warmVoices(): void {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.getVoices();
  } catch {
    // Voices simply stay unloaded; speakArabic retries on demand.
  }
}

const ZONE_COLORS: Record<string, string> = {
  Jawf: '#1864ab', Throat: '#2b8a3e', Tongue: '#e8590c', Lips: '#c92a2a', Nasal: '#d6336c',
};

/** The first letter cluster of a word (letter + its diacritics). */
function firstCluster(word: string): string {
  let out = '';
  for (const ch of Array.from(word)) {
    const c = ch.codePointAt(0) ?? 0;
    const isMark =
      (c >= 0x0610 && c <= 0x061a) || (c >= 0x064b && c <= 0x065f) || c === 0x0670;
    if (!isMark && out !== '') break;
    out += ch;
  }
  return out === '' ? word : out;
}

/**
 * Letter detail card: shows all four contextual forms, the sound,
 * articulation zone and an example word you can hear.
 *
 * The four shapes use the stored Arabic Presentation Forms (the correct
 * pre-shaped Unicode codepoints) rendered in a UI font stack that
 * reliably carries them — ZWJ sequences leak artifacts in Quran fonts.
 * The example word is kept as ONE unbroken text run (Arabic letters
 * must join); the taught letter is shown as a separate callout chip so
 * no span boundary ever splits the cursive script.
 * @param props - letter to display.
 * @returns The rendered detail card.
 */
function LetterDetail({ letter }: { letter: ArabicLetter }): JSX.Element {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const forms: { label: string; glyph: string; shown: boolean }[] = [
    { label: 'Isolated', glyph: letter.isolated, shown: true },
    { label: 'Initial', glyph: letter.initial, shown: letter.joins },
    { label: 'Medial', glyph: letter.medial, shown: letter.joins },
    { label: 'Final', glyph: letter.final, shown: true },
  ];
  return (
    <Card className="animate-[fadeIn_200ms_ease-out]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="arabic flex h-20 w-20 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-5xl text-[var(--primary)] leading-none">
          {letter.isolated}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-extrabold text-[var(--fg)]">
            {letter.nameEn} <span className="arabic text-lg text-[var(--muted)]">{letter.nameAr}</span>
          </p>
          <p className="mt-0.5 text-sm text-[var(--muted)]">{letter.sound}</p>
          {letter.note ? (
            <p className="mt-1 rounded-lg bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-1.5 text-xs leading-snug text-[var(--accent-strong)]">
              {letter.note}
            </p>
          ) : null}
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: ZONE_COLORS[letter.zone] }}>
              {letter.zone}
            </span>
            <Badge tone={letter.joins ? 'primary' : 'neutral'}>{letter.joins ? 'Joins letters' : 'Never joins left'}</Badge>
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  stopArabic();
                  setIsSpeaking(false);
                } else {
                  const started = speakArabic(letter.example, () => setIsSpeaking(false));
                  if (started) {
                    setIsSpeaking(true);
                  } else {
                    emitToast({
                      title: 'No Arabic voice available',
                      body: 'Your browser needs an Arabic voice installed. Check your system language settings.',
                      tone: 'warning',
                    });
                  }
                }
              }}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-all ${
                isSpeaking
                  ? 'bg-[var(--accent)] text-[#3b2305] hover:brightness-110 animate-pulse'
                  : 'bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent-strong)] hover:bg-[var(--accent)] hover:text-[#3b2305]'
              }`}
            >
              {isSpeaking ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <rect x="6" y="5" width="3" height="10" rx="1" />
                    <rect x="11" y="5" width="3" height="10" rx="1" />
                  </svg>
                  Stop
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6 4l10 6-10 6z" /></svg>
                  Hear it
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {forms.map((f) => (
          <div key={f.label} className="rounded-xl border border-[var(--border)] bg-[var(--field)] p-2 text-center">
            {f.shown ? (
              <p className="arabic-ui text-3xl text-[var(--fg)] leading-none" dir="rtl">{f.glyph}</p>
            ) : (
              <p className="text-3xl leading-none text-[var(--muted)]" aria-hidden="true">—</p>
            )}
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">{f.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--field)] p-3">
        <span
          dir="rtl"
          title={`The ${letter.nameEn} as it appears in the example`}
          className="arabic-ui flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-3xl leading-none text-[var(--primary)]"
        >
          {letter.chip ?? firstCluster(letter.example)}
        </span>
        <div className="min-w-0 flex-1 text-right">
          <p className="arabic-ui text-2xl text-[var(--fg)] leading-relaxed">{letter.example}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{letter.exampleEn}</p>
        </div>
      </div>
    </Card>
  );
}

/**
 * Arabic Foundations module: letters (with contextual forms), harakat,
 * Quran-focused grammar and starter vocabulary. Everything works
 * offline; "Hear it" uses the browser's Arabic voice when installed.
 * @returns The rendered module.
 */
export function ArabicModule(): JSX.Element {
  const { t } = useT();
  const [tab, setTab] = useState<TabId>('letters');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ArabicLetter>(ARABIC_LETTERS[0]);

  // Preload speech voices so "Hear it" responds on the first tap.
  useEffect(() => {
    warmVoices();
  }, []);

  const letters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ARABIC_LETTERS;
    return ARABIC_LETTERS.filter(
      (l) =>
        l.nameEn.toLowerCase().includes(q) ||
        l.nameAr.includes(query.trim()) ||
        l.isolated.includes(query.trim()) ||
        l.sound.toLowerCase().includes(q)
    );
  }, [query]);

  const tabs: { id: TabId; label: string; arabic: string }[] = [
    { id: 'letters', label: 'Letters', arabic: 'الحروف' },
    { id: 'harakat', label: 'Harakat', arabic: 'الحركات' },
    { id: 'grammar', label: 'Grammar', arabic: 'النحو' },
    { id: 'vocab', label: 'Vocabulary', arabic: 'المفردات' },
  ];

  return (
    <div className="space-y-5">
      <Card tone="raised" className="relative overflow-hidden">
        <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 px-1 py-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">
              Learn the language of the Quran · تعلّم لغة القرآن
            </p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
              Arabic Foundations <span className="arabic text-2xl text-[var(--accent-strong)]">العربية</span>
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
              The letters, the marks, and the grammar you meet on the very first page of the Quran —
              each one a stepping stone to reading and understanding it.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex gap-1 overflow-x-auto rounded-xl bg-[var(--hover)] p-1 w-fit max-w-full" role="tablist" aria-label="Arabic sections">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            type="button"
            aria-selected={tab === tb.id}
            onClick={() => setTab(tb.id)}
            className={[
              'shrink-0 rounded-lg px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
              tab === tb.id ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--fg)]',
            ].join(' ')}
          >
            {tb.label} <span className="arabic text-sm text-[var(--muted)]">{tb.arabic}</span>
          </button>
        ))}
      </div>

      <div key={tab} className="module-enter">
        {tab === 'letters' ? (
          <div className="space-y-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${t('common.search')} — b, meem, خ…`}
              aria-label={t('common.search')}
              className="w-full h-11 rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)]"
            />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 lg:items-start">
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 content-start">
                {letters.map((l) => {
                  const active = selected.isolated === l.isolated;
                  return (
                    <button
                      key={l.isolated}
                      type="button"
                      onClick={() => setSelected(l)}
                      aria-pressed={active}
                      title={l.nameEn}
                      className={[
                        'arabic aspect-square rounded-xl border text-3xl leading-none transition-all duration-150 active:scale-95',
                        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                        active
                          ? 'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)] shadow-sm scale-105'
                          : 'border-[var(--border)] bg-[var(--card)] text-[var(--fg)] hover:border-[color-mix(in_srgb,var(--primary)_45%,var(--border))]',
                      ].join(' ')}
                    >
                      {l.isolated}
                    </button>
                  );
                })}
              </div>
              <div className="lg:sticky lg:top-20">
                <LetterDetail letter={selected} />
              </div>
            </div>
          </div>
        ) : tab === 'harakat' ? (
          <HarakatSection speak={speakArabic} />
        ) : tab === 'grammar' ? (
          <GrammarSection tajweedOn={false} />
        ) : (
          <VocabSection speak={speakArabic} />
        )}
      </div>
    </div>
  );
}
