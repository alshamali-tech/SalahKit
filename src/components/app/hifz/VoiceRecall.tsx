/**
 * Step 3 — Recall. Two parallel paths unlock every ayah:
 *   • say it aloud → the matcher hears you → the ayah reveals itself
 *   • tap the text → the ayah reveals instantly (always available)
 * Voice is an enhancement, never a gate: every failure path (blocked
 * mic, unsupported browser, silence, offline engine) falls back to the
 * tap with a clear, human explanation.
 */
import { useEffect, useRef, useState } from 'react';
import type { ResolvedAyah } from '../../../lib/external/quran';
import { matchAyah } from '../../../lib/core/speech-match';
import type { MatchVerdict } from '../../../lib/core/speech-match';
import { useSpeechRecognition } from '../../../lib/use-speech';
import { TajweedText } from '../../tajweed/TajweedText';

export interface VoiceRecallProps {
  /** The chunk's ayahs in order. */
  ayahs: ResolvedAyah[];
  /** Ayah numbers already revealed. */
  revealed: Set<number>;
  /** Reveals one ayah (idempotent). */
  onReveal: (ayahNum: number) => void;
  /** Whether the tajweed colour overlay is on. */
  tajweedOn: boolean;
}

const EQUALIZER_BARS = 5;

/** Why voice is unavailable, phrased for the fallback banner. */
function blockReason(status: string): string {
  switch (status) {
    case 'unsupported':
      return 'This browser has no speech recognition (try Chrome, Edge or Safari)';
    case 'insecure':
      return 'Voice needs a secure https connection';
    case 'denied':
      return 'Microphone access is blocked for this site';
    default:
      return 'Voice is unavailable';
  }
}

/**
 * The recall step: listen-and-match per ayah with a tap fallback.
 * @param props - ayahs/revealed/onReveal/tajweedOn.
 * @returns The rendered recall cards and status strip.
 */
export function VoiceRecall({ ayahs, revealed, onReveal, tajweedOn }: VoiceRecallProps): JSX.Element {
  const [active, setActive] = useState<number | null>(null);
  const [verdicts, setVerdicts] = useState<Record<number, MatchVerdict>>({});
  const [cardErrors, setCardErrors] = useState<Record<number, string>>({});
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
    }
  }

  const speech = useSpeechRecognition(handleResult, 'ar');
  const { micStatus, listening, transcript, error } = speech;

  // Route an engine error onto the card that was listening, then let go.
  useEffect(() => {
    if (!error || activeRef.current === null) return;
    const num = activeRef.current;
    setCardErrors((m) => ({ ...m, [num]: error }));
    setActive(null);
    activeRef.current = null;
    spokenRef.current = '';
  }, [error]);

  // Permission revoked mid-session: unwind cleanly.
  useEffect(() => {
    if (micStatus === 'denied' && activeRef.current !== null) {
      speech.stop();
      setActive(null);
      activeRef.current = null;
      spokenRef.current = '';
    }
  }, [micStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const voiceBlocked = micStatus === 'denied' || micStatus === 'unsupported' || micStatus === 'insecure';

  /** Starts (or restarts) listening for one ayah. */
  function beginRecall(num: number): void {
    setCardErrors((m) => ({ ...m, [num]: '' }));
    setActive(num);
    activeRef.current = num;
    spokenRef.current = '';
    speech.start();
  }

  /** Stops listening without revealing. */
  function stopRecall(): void {
    speech.stop();
    setActive(null);
    activeRef.current = null;
    spokenRef.current = '';
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          Step 3 · Recall — {revealed.size}/{ayahs.length} unlocked
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={[
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 h-7 text-[11px] font-bold',
              voiceBlocked
                ? 'border-[color-mix(in_srgb,var(--warning)_45%,var(--border))] text-[var(--warning)] bg-[color-mix(in_srgb,var(--warning)_8%,transparent)]'
                : micStatus === 'granted'
                  ? 'border-[color-mix(in_srgb,var(--success)_45%,var(--border))] text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_8%,transparent)]'
                  : 'border-[var(--border)] text-[var(--muted)] bg-[var(--card)]',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className={[
                'h-1.5 w-1.5 rounded-full',
                voiceBlocked
                  ? 'bg-[var(--warning)]'
                  : micStatus === 'granted'
                    ? 'bg-[var(--success)] animate-[pulseDot_1.6s_ease-in-out_infinite]'
                    : micStatus === 'checking'
                      ? 'bg-[var(--warning)] animate-[pulseDot_1s_ease-in-out_infinite]'
                      : 'bg-[var(--muted)]',
              ].join(' ')}
            />
            {voiceBlocked
              ? 'voice off'
              : micStatus === 'granted'
                ? 'mic ready'
                : micStatus === 'checking'
                  ? 'checking mic…'
                  : 'tap mic to try voice'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 h-7 text-[11px] font-bold text-[var(--muted)]">
            <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M9 3.5v7l2.5 1.5 4 5.5-1.6 1.1-3.9-4.1L9 15.5V3.5z" strokeLinejoin="round" />
            </svg>
            tapping always works
          </span>
        </div>
      </div>

      {voiceBlocked ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-[color-mix(in_srgb,var(--warning)_40%,var(--border))] bg-[color-mix(in_srgb,var(--warning)_7%,transparent)] p-3.5 animate-[fadeIn_200ms_ease-out]"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="var(--warning)" strokeWidth="1.7" className="mt-0.5 shrink-0" aria-hidden="true">
            <path d="M10 3l8 14H2z" strokeLinejoin="round" />
            <path d="M10 9v4M10 15.5v.5" strokeLinecap="round" />
          </svg>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[var(--fg)]">Voice is unavailable right now</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
              {blockReason(micStatus)}. No problem — tap any ayah below to reveal it. Your memory is
              the real microphone.
            </p>
          </div>
        </div>
      ) : null}

      {ayahs.map((a) => {
        const isRevealed = revealed.has(a.ayahNum);
        const isActive = active === a.ayahNum;
        const verdict = verdicts[a.ayahNum];
        const cardError = cardErrors[a.ayahNum];
        return (
          <div
            key={a.ayahNum}
            className={[
              'rounded-xl border p-3 transition-all duration-200',
              isActive
                ? 'border-[var(--primary)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_15%,transparent)]'
                : isRevealed
                  ? 'border-[color-mix(in_srgb,var(--success)_45%,var(--border))] bg-[color-mix(in_srgb,var(--success)_5%,transparent)]'
                  : 'border-[var(--border)] bg-[var(--field)]',
            ].join(' ')}
          >
            <button
              type="button"
              onClick={() => {
                if (isActive) stopRecall();
                onReveal(a.ayahNum);
              }}
              aria-label={`Reveal ayah ${a.ayahNum}`}
              className="block w-full text-right rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              <p
                className={[
                  'arabic text-lg sm:text-xl text-[var(--fg)] transition-all duration-300 ease-out',
                  isRevealed ? '' : 'blur-[7px] select-none opacity-70',
                ].join(' ')}
              >
                <TajweedText text={a.arabic} enabled={tajweedOn} />
              </p>
            </button>

            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="min-w-0 flex-1 text-[11px] font-bold leading-snug">
                {isRevealed ? (
                  <span className="text-[var(--success)]">
                    Unlocked{verdict?.matched ? ` · ${verdict.score}% match` : ' · by tap'} ✓
                  </span>
                ) : cardError ? (
                  <span className="text-[var(--danger)]">{cardError}</span>
                ) : isActive && listening ? (
                  <span className="text-[var(--primary)]">
                    Listening — recite the ayah
                    <span className="inline-flex gap-0.5 ml-1" aria-hidden="true">
                      {Array.from({ length: 3 }, (_, d) => (
                        <span
                          key={d}
                          className="inline-block h-1 w-1 rounded-full bg-[var(--primary)] animate-[pulseDot_1s_ease-in-out_infinite]"
                          style={{ animationDelay: `${d * 150}ms` }}
                        />
                      ))}
                    </span>
                  </span>
                ) : verdict && !verdict.matched && spokenRef.current ? (
                  <span className="text-[var(--warning)]">
                    Close ({verdict.score}%) — “{spokenRef.current.slice(0, 40)}…” — try again or tap
                  </span>
                ) : (
                  <span className="text-[var(--muted)]">Tap the text to reveal · or recite it aloud</span>
                )}
              </p>

              {isRevealed ? (
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)]"
                  aria-label="Ayah revealed"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (voiceBlocked) return;
                    if (isActive && listening) stopRecall();
                    else beginRecall(a.ayahNum);
                  }}
                  disabled={voiceBlocked}
                  aria-label={
                    isActive && listening
                      ? `Stop listening for ayah ${a.ayahNum}`
                      : `Recite ayah ${a.ayahNum} aloud to reveal it`
                  }
                  className={[
                    'relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-90',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
                    voiceBlocked
                      ? 'bg-[var(--hover)] text-[var(--muted)] opacity-50 cursor-not-allowed'
                      : isActive && listening
                        ? 'bg-[var(--danger)] text-white shadow-lg shadow-red-900/20'
                        : cardError
                          ? 'bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] text-[var(--danger)] ring-1 ring-[color-mix(in_srgb,var(--danger)_40%,transparent)]'
                          : 'bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-fg)]',
                  ].join(' ')}
                >
                  {isActive && listening ? (
                    <>
                      <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-[var(--danger)] animate-[micPulse_1.4s_ease-out_infinite]" />
                      <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-[var(--danger)] animate-[micPulse_1.4s_ease-out_infinite_0.45s]" />
                      <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <rect x="5.5" y="5.5" width="9" height="9" rx="1.5" />
                      </svg>
                    </>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <rect x="7.5" y="2.5" width="5" height="9" rx="2.5" />
                      <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5M7 17.5h6" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {isActive && listening ? (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-[color-mix(in_srgb,var(--primary)_7%,transparent)] px-3 py-2 animate-[fadeIn_180ms_ease-out]">
                <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
                  {Array.from({ length: EQUALIZER_BARS }, (_, d) => (
                    <span
                      key={d}
                      className="w-1 rounded-full bg-[var(--primary)] animate-[eqBar_0.9s_ease-in-out_infinite]"
                      style={{ animationDelay: `${d * 120}ms`, height: '100%' }}
                    />
                  ))}
                </span>
                <p className="arabic min-w-0 flex-1 truncate text-sm text-[var(--fg)]" dir="rtl" aria-live="polite">
                  {transcript || '…'}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}

      <p className="text-[11px] leading-relaxed text-[var(--muted)]">
        {voiceBlocked
          ? 'Voice is a second way to practise — tapping an ayah is always one tap away and works everywhere.'
          : 'Say the ayah from memory: the moment your voice matches, it uncovers itself. Prefer to check with your eyes? Tap the text instead. Both paths count.'}
      </p>
    </div>
  );
}
