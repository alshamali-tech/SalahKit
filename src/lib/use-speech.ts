/**
 * Web Speech API integration for voice recall (Graph of Thoughts).
 * The graph: [mic] → [SpeechRecognition] → [transcript stream] with an
 * error/backtrack edge into the tap-to-reveal fallback. Handles every
 * real-world failure path: unsupported browser, insecure context,
 * denied/revoked permission, dead hardware, silence, offline engines.
 * Arabic only (ar); interim results streamed for live feedback.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/** Lifecycle state of microphone access. */
export type MicStatus =
  | 'unknown' // not probed yet (or the platform hides permission state)
  | 'checking' // pre-flight getUserMedia probe in flight
  | 'granted' // permission confirmed working
  | 'denied' // blocked by the user or the OS
  | 'unsupported' // no SpeechRecognition / no mediaDevices
  | 'insecure'; // served over http — browsers refuse the mic

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

/**
 * Maps a getUserMedia failure to a human-readable, actionable message.
 * @param e - The rejected error object.
 * @returns Message that always ends with the tap fallback.
 */
function describeMediaError(e: unknown): string {
  const name = (e as { name?: string })?.name ?? '';
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'Microphone access is blocked — allow it in your browser settings, or tap any ayah instead.';
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return 'No working microphone was found on this device — tap any ayah to reveal it.';
  }
  if (name === 'NotReadableError') {
    return 'Another app is using your microphone right now — tap any ayah to reveal it.';
  }
  return 'Could not open the microphone — tap any ayah to reveal it.';
}

/**
 * Maps a SpeechRecognition engine error to a user-facing message.
 * @param code - Engine error code (e.g. 'no-speech').
 * @returns Message, or null for non-errors like a user cancel.
 */
function describeEngineError(code: string): string | null {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Voice access was blocked — tap any ayah to reveal it instead.';
    case 'audio-capture':
      return 'No microphone audio reached the browser. Check your mic, then try again.';
    case 'no-speech':
      return 'Nothing was heard — speak a little closer to the mic and try again.';
    case 'network':
      return 'Voice recognition needs a connection right now — tap any ayah to reveal it.';
    case 'aborted':
      return null; // user cancelled — not an error
    default:
      return 'Voice recognition hiccuped — try again, or tap the ayah.';
  }
}

/** State exposed by the hook. */
export interface SpeechState {
  /** Whether the engine currently has the mic open. */
  listening: boolean;
  /** Live transcript of the current utterance (replaced, not appended). */
  transcript: string;
  /** True only when the platform can do speech recognition at all. */
  supported: boolean;
  /** Microphone permission lifecycle state. */
  micStatus: MicStatus;
  /** Last actionable error message, if any. */
  error: string | null;
  /** Explicit pre-flight probe (prompts only if the browser must ask). */
  checkMic: () => Promise<MicStatus>;
  /** Begins a recognition session (requires a user gesture). */
  start: () => void;
  /** Ends the current session. */
  stop: () => void;
  /** Clears transcript and error buffers. */
  clear: () => void;
}

/**
 * Wraps the Web Speech API in React state for the recall step.
 * On mount it silently probes the Permissions API (no prompt); the real
 * permission prompt only fires on the user's first mic tap.
 * @param onResult - Called with (transcript, isFinal) on every update.
 * @param lang - BCP-47 language tag (default Arabic).
 * @returns Controls, live state and mic lifecycle.
 */
export function useSpeechRecognition(
  onResult?: (transcript: string, isFinal: boolean) => void,
  lang = 'ar'
): SpeechState {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [micStatus, setMicStatus] = useState<MicStatus>(() =>
    speechSupported() ? 'unknown' : 'unsupported'
  );
  const engineRef = useRef<SpeechRecognitionLike | null>(null);
  const listeningRef = useRef(false);
  const pendingRestartRef = useRef(false);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  // Silent probe: never triggers a browser prompt, but surfaces an
  // already-denied mic immediately and tracks later revocations.
  useEffect(() => {
    if (!speechSupported()) {
      setMicStatus('unsupported');
      return;
    }
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      setMicStatus('insecure');
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const perm = await navigator.permissions?.query({
          name: 'microphone' as PermissionName,
        });
        if (cancelled || !perm) return;
        if (perm.state === 'granted') setMicStatus('granted');
        else if (perm.state === 'denied') setMicStatus('denied');
        perm.addEventListener('change', () => {
          if (cancelled) return;
          if (perm.state === 'granted') setMicStatus('granted');
          else if (perm.state === 'denied') {
            setMicStatus('denied');
            try {
              engineRef.current?.abort();
            } catch {
              // engine already idle
            }
            listeningRef.current = false;
            setListening(false);
          }
        });
      } catch {
        // Firefox hides 'microphone' from the Permissions API — stay
        // 'unknown' and let the first mic tap do the real check.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const checkMic = useCallback(async (): Promise<MicStatus> => {
    if (!speechSupported()) {
      setMicStatus('unsupported');
      return 'unsupported';
    }
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      setMicStatus('insecure');
      return 'insecure';
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicStatus('unsupported');
      return 'unsupported';
    }
    setMicStatus('checking');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const live = stream.getAudioTracks().some((t) => t.readyState === 'live');
      stream.getTracks().forEach((t) => t.stop());
      const next: MicStatus = live ? 'granted' : 'denied';
      setMicStatus(next);
      if (!live) setError('The microphone opened but produced no audio — tap any ayah to reveal it.');
      return next;
    } catch (e) {
      setMicStatus('denied');
      setError(describeMediaError(e));
      return 'denied';
    }
  }, []);

  const stop = useCallback(() => {
    try {
      engineRef.current?.stop();
    } catch {
      // engine already idle
    }
  }, []);

  const start = useCallback(() => {
    if (micStatus === 'insecure') {
      setError('Voice needs a secure (https) connection — tap any ayah to reveal it.');
      return;
    }
    if (micStatus === 'unsupported') {
      setError('This browser has no speech recognition — tap any ayah to reveal it.');
      return;
    }
    if (micStatus === 'denied') {
      setError('Microphone access is blocked — tap any ayah to reveal it.');
      return;
    }
    let engine = engineRef.current;
    if (!engine) {
      engine = createEngine();
      if (!engine) {
        setMicStatus('unsupported');
        setError('This browser has no speech recognition — tap any ayah to reveal it.');
        return;
      }
      engineRef.current = engine;
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
          setTranscript(text);
          onResultRef.current?.(text, isFinal);
        }
      };
      engine.onerror = (event) => {
        const code = event.error ?? '';
        if (code === 'not-allowed' || code === 'service-not-allowed') setMicStatus('denied');
        const msg = describeEngineError(code);
        if (msg) setError(msg);
      };
      engine.onend = () => {
        listeningRef.current = false;
        setListening(false);
        // Serialised restart: switching ayahs mid-utterance queues one
        // clean start after the previous session fully winds down.
        if (pendingRestartRef.current) {
          pendingRestartRef.current = false;
          try {
            engineRef.current?.start();
            listeningRef.current = true;
            setListening(true);
          } catch {
            // engine refused the restart — the user can tap again
          }
        }
      };
    }
    setError(null);
    setTranscript('');
    if (listeningRef.current) {
      // Already recording: ask for a clean restart once it ends.
      pendingRestartRef.current = true;
      try {
        engine.stop();
      } catch {
        pendingRestartRef.current = false;
      }
      return;
    }
    try {
      engine.start();
      listeningRef.current = true;
      setListening(true);
    } catch {
      // start() before full shutdown throws — treat as running
      listeningRef.current = true;
      setListening(true);
    }
  }, [micStatus, lang]);

  const clear = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    listening,
    transcript,
    supported: speechSupported(),
    micStatus,
    error,
    checkMic,
    start,
    stop,
    clear,
  };
}
