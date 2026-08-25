/**
 * Quran audio player store (Zustand) + playback engine.
 * Owns a single module-level <audio> element so the floating dock, the
 * Quran Reader and the Hifz Trainer all drive one shared player.
 * The engine is a small decision tree: when an ayah ends it branches on
 * loop count (replay), queue position (advance) or completion (stop).
 */
import { create } from 'zustand';
import {
  buildAudioUrl,
  getReciter,
  getStoredReciter,
  setStoredReciter,
  type AyahRef,
} from './core/quran-audio';

/** Playback lifecycle states. */
export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface QuranPlayerState {
  /** Ordered queue of ayahs to play. */
  queue: AyahRef[];
  /** Index of the current ayah in the queue. */
  index: number;
  /** Playback lifecycle state. */
  status: PlayerStatus;
  /** Active reciter edition id. */
  reciter: string;
  /** Times to play each ayah (Infinity = loop the ayah continuously). */
  loop: number;
  /** Playback speed multiplier. */
  rate: number;
  /** Queue indices completed at least once (for the ayah graph). */
  played: number[];
  playQueue: (refs: AyahRef[], startIndex?: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seekIndex: (i: number) => void;
  setReciter: (id: string) => void;
  setLoop: (n: number) => void;
  setRate: (r: number) => void;
  stop: () => void;
  handleAudioEvent: (type: AudioEventType) => void;
}

type AudioEventType = 'playing' | 'pause' | 'waiting' | 'ended' | 'error';

/** The shared audio element (created lazily, lives for the session). */
let audio: HTMLAudioElement | null = null;
/** Remaining plays for the current ayah before advancing. */
let loopLeft = 1;

/**
 * Returns the shared audio element, wiring DOM events into the store.
 * @returns The session audio element.
 */
function getAudio(): HTMLAudioElement {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = 'auto';
  const fire = (type: AudioEventType): void => useQuranPlayer.getState().handleAudioEvent(type);
  audio.addEventListener('playing', () => fire('playing'));
  audio.addEventListener('pause', () => fire('pause'));
  audio.addEventListener('waiting', () => fire('waiting'));
  audio.addEventListener('ended', () => fire('ended'));
  audio.addEventListener('error', () => fire('error'));
  return audio;
}

/** Marks a queue index as played without duplicates. */
function withPlayed(played: number[], index: number): number[] {
  return played.includes(index) ? played : [...played, index];
}

export const useQuranPlayer = create<QuranPlayerState>((set, get) => ({
  queue: [],
  index: 0,
  status: 'idle',
  reciter: getStoredReciter(),
  loop: 1,
  rate: 1,
  played: [],

  playQueue: (refs, startIndex = 0) => {
    if (refs.length === 0) return;
    set({ queue: refs, index: Math.min(startIndex, refs.length - 1), played: [] });
    loadAndPlay(get(), Math.min(startIndex, refs.length - 1));
  },

  toggle: () => {
    const a = getAudio();
    const { status, queue, index } = get();
    if (queue.length === 0) return;
    if (status === 'playing') a.pause();
    else if (status === 'paused') void a.play();
    else loadAndPlay(get(), index);
  },

  next: () => {
    const { queue, index } = get();
    if (index + 1 < queue.length) {
      set({ played: withPlayed(get().played, index) });
      loadAndPlay(get(), index + 1);
    }
  },

  prev: () => {
    const { index } = get();
    if (index > 0) loadAndPlay(get(), index - 1);
    else loadAndPlay(get(), 0);
  },

  seekIndex: (i) => {
    const { queue } = get();
    if (i >= 0 && i < queue.length) loadAndPlay(get(), i);
  },

  setReciter: (id) => {
    setStoredReciter(id);
    set({ reciter: id });
    const { queue, index, status } = get();
    if (queue.length > 0 && status !== 'idle') loadAndPlay(get(), index);
  },

  setLoop: (n) => set({ loop: n }),
  setRate: (r) => {
    set({ rate: r });
    if (audio) audio.playbackRate = r;
  },

  stop: () => {
    getAudio().pause();
    getAudio().removeAttribute('src');
    // Clear the queue so the dock (rendered while queue.length > 0) unmounts.
    set({ queue: [], status: 'idle', index: 0, played: [] });
  },

  handleAudioEvent: (type) => {
    const s = get();
    const a = getAudio();
    if (type === 'playing') set({ status: 'playing' });
    else if (type === 'waiting') set({ status: 'loading' });
    else if (type === 'pause') {
      if (s.status === 'playing') set({ status: 'paused' });
    } else if (type === 'error') {
      set({ status: 'error' });
    } else if (type === 'ended') {
      if (s.loop === Number.POSITIVE_INFINITY) {
        a.currentTime = 0;
        void a.play();
      } else if (loopLeft > 1) {
        loopLeft -= 1;
        a.currentTime = 0;
        void a.play();
      } else {
        set({ played: withPlayed(s.played, s.index) });
        if (s.index + 1 < s.queue.length) loadAndPlay(get(), s.index + 1);
        else set({ status: 'idle' });
      }
    }
  },
}));

/**
 * Loads and plays the ayah at a queue index, resetting the loop budget.
 * @param state - Current player state snapshot.
 * @param index - Queue index to play.
 */
function loadAndPlay(state: QuranPlayerState, index: number): void {
  const a = getAudio();
  const ref = state.queue[index];
  if (!ref) {
    useQuranPlayer.setState({ status: 'idle' });
    return;
  }
  loopLeft = Number.isFinite(state.loop) ? state.loop : 1;
  useQuranPlayer.setState({ index, status: 'loading' });
  a.playbackRate = state.rate;
  a.src = buildAudioUrl(state.reciter, ref.global, getReciter(state.reciter).bitrate);
  a.load();
  void a.play().catch(() => useQuranPlayer.setState({ status: 'error' }));
}

/** Convenience: human label for the current ayah, e.g. "2:255". */
export function currentAyahLabel(queue: AyahRef[], index: number): string {
  const ref = queue[index];
  return ref ? `${ref.surah}:${ref.ayah}` : '—';
}
