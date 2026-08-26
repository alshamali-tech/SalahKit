import { ayahRef, rangeRefs } from '../../lib/core/quran-audio';
import { useQuranPlayer } from '../../lib/quran-player-store';

export interface TajweedAudioProps {
  /** Surah number to recite. */
  surah: number;
  /** First ayah (1-based). Defaults to 1. */
  from?: number;
  /** Last ayah (inclusive). Defaults to `from`. */
  to?: number;
  /** Compact variant used inside cards. */
  compact?: boolean;
  /** Accessible label. */
  label?: string;
}

/**
 * Play button that recites a Quran range through the shared player, so
 * every tajweed example can be *heard* — the reciter voice follows the
 * exact rules being taught. Streams from the free Islamic Network CDN.
 * @param props - surah/from/to/compact/label.
 * @returns The play/pause button.
 */
export function TajweedAudio({ surah, from = 1, to, compact = false, label }: TajweedAudioProps): JSX.Element {
  const playQueue = useQuranPlayer((s) => s.playQueue);
  const queue = useQuranPlayer((s) => s.queue);
  const status = useQuranPlayer((s) => s.status);
  const index = useQuranPlayer((s) => s.index);

  const last = to ?? from;
  const refs = from === 1 && to === undefined ? [ayahRef(surah, 1)] : rangeRefs(surah, from, last);
  const isCurrent =
    queue.length > 0 &&
    queue[0]?.surah === surah &&
    queue[0]?.ayah === from &&
    queue.length === refs.length;
  const playing = isCurrent && (status === 'playing' || status === 'loading' || status === 'paused');

  const ariaLabel = label ?? `Listen to surah ${surah}, ayah ${from}${last !== from ? ` to ${last}` : ''}`;

  return (
    <button
      type="button"
      onClick={() => playQueue(refs, 0)}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={[
        'inline-flex items-center justify-center gap-1.5 rounded-full font-bold transition-all duration-150 active:scale-90 shrink-0',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
        compact ? 'h-10 w-10' : 'h-11 px-4 text-xs',
        playing
          ? 'bg-[var(--accent)] text-[#3b2305] shadow-md shadow-amber-900/25'
          : 'bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent-strong)] hover:bg-[var(--accent)] hover:text-[#3b2305]',
      ].join(' ')}
    >
      {playing && status === 'loading' ? (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
      ) : playing && status === 'playing' ? (
        <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6 4h3v12H6zM11 4h3v12h-3z" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6 4l10 6-10 6z" />
        </svg>
      )}
      {!compact ? (playing ? (status === 'playing' ? 'Reciting…' : 'Playing') : 'Listen') : null}
      {!compact && playing && status === 'playing' && refs.length > 1 ? (
        <span className="tnum opacity-70">{index + 1}/{refs.length}</span>
      ) : null}
    </button>
  );
}
