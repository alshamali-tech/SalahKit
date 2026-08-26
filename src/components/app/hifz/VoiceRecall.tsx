import { useEffect, useRef, useState } from 'react';
import type { ResolvedAyah } from '../../../lib/external/quran';
import { matchAyah, MATCH_THRESHOLD } from '../../../lib/core/speech-match';
import type { MatchVerdict } from '../../../lib/core/speech-match';
import { useSpeechRecognition } from '../../../lib/use-speech';
import { TajweedText } from '../../tajweed/TajweedText';

export interface VoiceRecallProps {
  /** The chunk's ayahs, in order. */
  ayahs: readonly ResolvedAyah[];
  /** Ayah numbers already revealed (drives the parent's Next gating). */
  revealed: ReadonlySet<number>;
  /** Called when an ayah is confirmed (by voice or manual tap). */
  onReveal: (ayahNum: number) => void;
  /** Whether the tajweed colour overlay is on. */
  tajweedOn: boolean;
}

const LABEL_COLOR: Record<MatchVerdict['label'], string> = {
  strong: 'var(--success)',
  partial: 'var(--warning)',
  weak: 'var(--danger)',
};

const LABEL_COPY: Record<MatchVerdict['label'], string> = {
  strong: 'Heard it — well recited',
  partial: 'Close — keep going',
  weak: 'Not yet — try again',
};

/**
 * Step 3 · Recall — recite each ayah aloud and it unhides the moment
 * the recognizer matches your voice (Graph of Thoughts: one mic node
 * routes the transcript to the active ayah, which decides reveal).
 * A tap-to-reveal fallback covers browsers without speech support.
 * @param props - ayahs/revealed/onReveal/tajweedOn.
 * @returns The rendered recall step.
 */
export function VoiceRecall({ ayahs, revealed, onReveal, tajweedOn }: VoiceRecallProps): JSX.Element {
  const [active, setActive] = useState<number | null>(null);
  const [verdicts, setVerdicts] = useState<Record<number, MatchVerdict>>({});
  const activeRef = useRef<number | null>(null);
  const spokenRef = useRef('');
  const revealedRef = useRef(revealed);
  revealedRef.current = revealed;
  const ayahsRef = useRef(ayahs);
  ayahsRef.current = ayahs;
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  /** Handles each recognition chunk; reveals the ayah once matched. */
  function handleResult(text: string, isFinal: boolean): void {
    const num = activeRef.current;
    if (num === null) return;
    // With continuous=false each mic press is one utterance, so the
    // transcript (interim or final) is the full current guess: replace it.
    spokenRef.current = text;
    const target = ayahsRef.current.find((a) => a.ayahNum === num);
    if (!target) return;
    const verdict = matchAyah(spokenRef.current, target.arabic);
    setVerdicts((v) => ({ ...v, [num]: verdict }));
    if (verdict.matched && !revealedRef.current.has(num)) {
      onRevealRef.current(num);
      setActive(null);
      activeRef.current = null;
      spokenRef.current = '';
    } else if (isFinal) {
      setActive(null);
      activeRef.current = null;
      spokenRef.current = '';
    }
  }

  const { listening, transcript, supported, error, start, stop, clear } =
    useSpeechRecognition(handleResult);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /** Starts (or stops) listening for a specific ayah. */
  function toggleMic(num: number): void {
    if (active === num && listening) {
      stop();
      setActive(null);
      activeRef.current = null;
      spokenRef.current = '';
      return;
    }
    clear();
    setVerdicts((v) => ({ ...v, [num]: { ...v[num], matched: false } as MatchVerdict }));
    spokenRef.current = '';
    setActive(num);
    activeRef.current = num;
    start();
  }

  const done = ayahs.length > 0 && ayahs.every((a) => revealed.has(a.ayahNum));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          Step 3 · Recite aloud — the ayah unhides when your voice matches
        </p>
        <p className="text-[11px] font-bold tnum text-[var(--muted)]">
          {revealed.size}/{ayahs.length} recalled
        </p>
      </div>

      {!supported ? (
        <p className="rounded-lg border border-dashed border-[var(--border)] p-3 text-xs text-[var(--muted)]">
          Voice recognition isn’t available in this browser — tap any ayah to reveal it instead.
        </p>
      ) : error === 'not-allowed' ? (
        <p className="rounded-lg border border-dashed border-[var(--danger)] p-3 text-xs text-[var(--danger)]">
          Microphone access was blocked. Allow it in your browser settings, or tap an ayah to reveal it.
        </p>
      ) : null}

      {ayahs.map((a) => {
        const isRevealed = revealed.has(a.ayahNum);
        const isActive = active === a.ayahNum && listening;
        const verdict = verdicts[a.ayahNum];
        return (
          <div
            key={a.ayahNum}
            className={[
              'relative rounded-xl border p-3.5 transition-all duration-300',
              isRevealed
                ? 'border-[color-mix(in_srgb,var(--success)_45%,var(--border))] bg-[color-mix(in_srgb,var(--success)_7%,var(--field))]'
                : isActive
                  ? 'border-[var(--primary)] bg-[var(--field)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_18%,transparent)]'
                  : 'border-[var(--border)] bg-[var(--field)]',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p
                  key={isRevealed ? 'shown' : 'hidden'}
                  className={[
                    'arabic text-lg sm:text-xl text-right transition-all duration-500',
                    isRevealed ? 'text-[var(--fg)] animate-[fadeIn_350ms_ease-out]' : 'text-[var(--fg)] blur-[7px] select-none',
                  ].join(' ')}
                >
                  <TajweedText text={a.arabic} enabled={tajweedOn} />
                </p>
                <p className="mt-1.5 text-[11px] font-bold text-[var(--muted)]">
                  {isRevealed
                    ? '✓ Recalled'
                    : isActive
                      ? 'Listening… recite this ayah'
                      : 'Tap the mic and recite from memory'}
                </p>
              </div>

              <div className="relative flex shrink-0 items-center justify-center">
                {isActive ? (
                  <>
                    <span aria-hidden="true" className="absolute h-11 w-11 rounded-full bg-[var(--primary)] opacity-40 animate-[ringPulse_1.4s_ease-out_infinite]" />
                    <span aria-hidden="true" className="absolute h-11 w-11 rounded-full bg-[var(--primary)] opacity-30 animate-[ringPulse_1.4s_ease-out_0.35s_infinite]" />
                    <span aria-hidden="true" className="absolute h-11 w-11 rounded-full bg-[var(--primary)] opacity-20 animate-[ringPulse_1.4s_ease-out_0.7s_infinite]" />
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => toggleMic(a.ayahNum)}
                  disabled={!supported || isRevealed}
                  aria-label={isRevealed ? `Ayah ${a.ayahNum} recalled` : `Recite ayah ${a.ayahNum}`}
                  aria-pressed={isActive}
                  className={[
                    'relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 active:scale-90',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
                    isRevealed
                      ? 'bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)] cursor-default'
                      : isActive
                        ? 'bg-[var(--primary)] text-[var(--primary-fg)] shadow-lg'
                        : 'bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-fg)]',
                  ].join(' ')}
                >
                  {isRevealed ? (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                      <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <rect x="7.5" y="3" width="5" height="9" rx="2.5" />
                      <path d="M5 9.5a5 5 0 0 0 10 0M10 14.5V17M7.5 17h5" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isActive || verdict ? (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
                    {[0, 1, 2].map((b) => (
                      <span
                        key={b}
                        className={[
                          'w-[3px] origin-bottom rounded-full bg-[var(--primary)]',
                          isActive ? 'animate-[eqbar_0.9s_ease-in-out_infinite]' : '',
                        ].join(' ')}
                        style={{ height: '100%', animationDelay: `${b * 0.15}s`, opacity: isActive ? 1 : 0.3 }}
                      />
                    ))}
                  </span>
                  <p dir="rtl" className="arabic flex-1 truncate text-right text-sm text-[var(--muted)]">
                    {transcript || '…'}
                  </p>
                  {verdict ? (
                    <span
                      className="shrink-0 text-[11px] font-extrabold tnum"
                      style={{ color: LABEL_COLOR[verdict.label] }}
                    >
                      {Math.round(verdict.score * 100)}%
                    </span>
                  ) : null}
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round((verdict?.score ?? 0) * 100)}%`,
                      background: LABEL_COLOR[verdict?.label ?? 'weak'],
                    }}
                  />
                </div>
                {verdict && !isRevealed ? (
                  <p className="text-[11px] font-bold" style={{ color: LABEL_COLOR[verdict.label] }}>
                    {LABEL_COPY[verdict.label]} · threshold {Math.round(MATCH_THRESHOLD * 100)}%
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}

      <p className="text-xs text-[var(--muted)] leading-relaxed">
        {done
          ? 'Masha’Allah — every ayah in this chunk is recalled. On to the link.'
          : 'Recognition compares your recitation to the ayah’s consonantal skeleton, so a close recitation counts. You can always tap to reveal manually.'}
      </p>
    </div>
  );
}
