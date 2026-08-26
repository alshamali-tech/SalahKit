/**
 * Web Speech API integration for voice recall (Graph of Thoughts).
 * The graph: [mic] → [SpeechRecognition] → [transcript stream] with an
 * error/backtrack edge. A single recognizer instance is shared by the
 * recall step; the active ayah node receives the routed transcript.
 * Arabic only (ar), interim results streamed for live feedback.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/** Minimal vendor-neutral shape of the SpeechRecognition engine. */
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
}

/** A single recognition result event. */
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
}

type Ctor = new () => SpeechRecognitionLike;

/**
 * Detects whether the browser exposes a usable speech recognizer.
 * @returns True on Chrome/Edge/Safari with SpeechRecognition support.
 */
export function speechSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  return Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition);
}

/** Instantiates the vendor recognizer, or null when unsupported. */
function createEngine(): SpeechRecognitionLike | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  const C = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!C) return null;
  try {
    return new C();
  } catch {
    return null;
  }
}

/** State exposed by the hook. */
export interface SpeechState {
  /** Whether the engine currently has the mic open. */
  listening: boolean;
  /** Live (interim + final) transcript of the current session. */
  transcript: string;
  /** True only when the platform can do speech recognition. */
  supported: boolean;
  /** Last engine error, if any (e.g. 'not-allowed'). */
  error: string | null;
  /** Begins a recognition session (requires a user gesture). */
  start: () => void;
  /** Ends the current session. */
  stop: () => void;
  /** Clears the transcript buffer. */
  clear: () => void;
}

/**
 * Wraps the Web Speech API in React state for the recall step.
 * Streams interim transcripts via onResult for live UI feedback.
 * @param onResult - Called with (transcript, isFinal) on every update.
 * @param lang - BCP-47 language tag (default Arabic).
 * @returns Controls and live state.
 */
export function useSpeechRecognition(
  onResult?: (transcript: string, isFinal: boolean) => void,
  lang = 'ar'
): SpeechState {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supported] = useState(() => speechSupported());
  const engineRef = useRef<SpeechRecognitionLike | null>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const stop = useCallback(() => {
    engineRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    if (!supported) return;
    if (!engineRef.current) {
      const engine = createEngine();
      if (!engine) {
        setError('unavailable');
        return;
      }
      engine.lang = lang;
      engine.continuous = false;
      engine.interimResults = true;
      engine.maxAlternatives = 1;
      engine.onresult = (event) => {
        let text = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const res = event.results[i];
          const alt = res?.[0];
          if (alt) {
            text += alt.transcript;
            if (res.isFinal) isFinal = true;
          }
        }
        if (text) {
          setTranscript((prev) => (isFinal ? `${prev} ${text}`.trim() : text));
          onResultRef.current?.(text, isFinal);
        }
      };
      engine.onend = () => setListening(false);
      engine.onerror = (e) => {
        setError(e.error ?? 'error');
        setListening(false);
      };
      engineRef.current = engine;
    }
    setError(null);
    try {
      engineRef.current.start();
      setListening(true);
    } catch {
      // start() throws if already running; treat as no-op.
      setListening(true);
    }
  }, [supported, lang]);

  const clear = useCallback(() => setTranscript(''), []);

  useEffect(() => {
    return () => {
      engineRef.current?.abort();
      engineRef.current = null;
    };
  }, []);

  return { listening, transcript, supported, error, start, stop, clear };
}
