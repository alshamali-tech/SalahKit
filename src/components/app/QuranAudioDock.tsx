import { currentAyahLabel, useQuranPlayer } from '../../lib/quran-player-store';
import { RECITERS } from '../../lib/core/quran-audio';
import { getSurahInfo } from '../../lib/core/quran-meta';

/** Nodes are drawn individually for queues up to this size. */
const MAX_NODE_GRAPH = 40;
const LOOP_OPTIONS: { label: string; value: number }[] = [
  { label: '1×', value: 1 },
  { label: '3×', value: 3 },
  { label: '5×', value: 5 },
  { label: '∞', value: Number.POSITIVE_INFINITY },
];
const RATE_OPTIONS = [0.75, 1, 1.25];

/**
 * Floating Quran audio dock. Renders the ayah queue as a graph —
 * completed nodes teal, the current node amber and pulsing, upcoming
 * nodes hollow — with a reciter selector and loop/speed branches.
 * @returns The dock, or null when nothing is queued.
 */
export function QuranAudioDock(): JSX.Element | null {
  const {
    queue,
    index,
    status,
    reciter,
    loop,
    rate,
    played,
    toggle,
    next,
    prev,
    seekIndex,
    setReciter,
    setLoop,
    setRate,
    stop,
  } = useQuranPlayer();

  if (queue.length === 0) return null;

  const current = queue[index];
  const surahName = current ? getSurahInfo(current.surah).name : '';
  const label = currentAyahLabel(queue, index);
  const isPlaying = status === 'playing';

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl pointer-events-none">
      <div className="pointer-events-auto rounded-xl border border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] bg-[color-mix(in_srgb,var(--card)_92%,transparent)] backdrop-blur-md shadow-2xl shadow-teal-950/25 animate-[slideUp_240ms_ease-out]">
        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Transport */}
          <div className="flex items-center gap-1">
            <IconBtn onClick={prev} label="Previous ayah" disabled={index === 0}>
              <path d="M6 5v10M15 5l-6 5 6 5z" strokeLinejoin="round" />
            </IconBtn>
            <button
              type="button"
              onClick={toggle}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-fg)] shadow-md shadow-teal-900/30 hover:brightness-110 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              {status === 'loading' ? (
                <span className="h-4 w-4 rounded-full border-2 border-[var(--primary-fg)] border-t-transparent animate-spin" aria-hidden="true" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  {isPlaying ? <path d="M6 4h3v12H6zM11 4h3v12h-3z" /> : <path d="M6 4l10 6-10 6z" />}
                </svg>
              )}
            </button>
            <IconBtn onClick={next} label="Next ayah" disabled={index >= queue.length - 1}>
              <path d="M14 5v10M5 5l6 5-6 5z" strokeLinejoin="round" />
            </IconBtn>
          </div>

          {/* Now playing + ayah graph */}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-sm font-extrabold text-[var(--fg)] tnum truncate">{label}</span>
              <span className="text-[11px] font-semibold text-[var(--primary)] truncate">{surahName}</span>
              {status === 'error' ? (
                <span className="text-[11px] font-bold text-[var(--danger)] truncate">audio unavailable</span>
              ) : null}
            </div>
            {queue.length <= MAX_NODE_GRAPH ? (
              <div className="mt-1.5 flex items-center gap-1 overflow-x-auto pb-0.5" role="list" aria-label="Ayah progress">
                {queue.map((ref, i) => {
                  const done = played.includes(i);
                  const active = i === index;
                  return (
                    <button
                      key={`${ref.surah}:${ref.ayah}`}
                      type="button"
                      role="listitem"
                      onClick={() => seekIndex(i)}
                      aria-label={`Play ayah ${ref.ayah}${done ? ' (played)' : ''}`}
                      className={[
                        'shrink-0 rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                        active
                          ? 'h-3.5 w-3.5 bg-[var(--accent)] ring-2 ring-[color-mix(in_srgb,var(--accent)_40%,transparent)] animate-[pulseDot_1.4s_ease-in-out_infinite]'
                          : done
                            ? 'h-2.5 w-2.5 bg-[var(--primary)]'
                            : 'h-2.5 w-2.5 border border-[var(--muted)] bg-transparent hover:border-[var(--primary)]',
                      ].join(' ')}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="mt-1.5">
                <input
                  type="range"
                  min={0}
                  max={queue.length - 1}
                  step={1}
                  value={index}
                  onChange={(e) => seekIndex(Number(e.target.value))}
                  aria-label="Seek ayah in surah"
                  aria-valuetext={label}
                  className="w-full h-2 cursor-pointer accent-[var(--primary)]"
                />
                <p className="mt-0.5 text-[10px] font-bold tnum text-[var(--muted)]">
                  Ayah {index + 1} of {queue.length}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="hidden sm:flex flex-col gap-1.5 shrink-0">
            <select
              aria-label="Reciter"
              value={reciter}
              onChange={(e) => setReciter(e.target.value)}
              className="h-8 max-w-[170px] rounded-md border border-[var(--border)] bg-[var(--field)] px-1.5 text-[11px] font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <Segmented
                label="Repeat each ayah"
                options={LOOP_OPTIONS.map((o) => o.label)}
                active={LOOP_OPTIONS.findIndex((o) => o.value === loop)}
                onSelect={(i) => setLoop(LOOP_OPTIONS[i].value)}
              />
              <Segmented
                label="Speed"
                options={RATE_OPTIONS.map((r) => `${r}×`)}
                active={RATE_OPTIONS.indexOf(rate)}
                onSelect={(i) => setRate(RATE_OPTIONS[i])}
              />
            </div>
          </div>

          <IconBtn onClick={stop} label="Close player">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </IconBtn>
        </div>

        {/* Mobile controls row */}
        <div className="sm:hidden flex items-center gap-2 px-3 pb-2.5">
          <select
            aria-label="Reciter"
            value={reciter}
            onChange={(e) => setReciter(e.target.value)}
            className="h-9 flex-1 min-w-0 rounded-md border border-[var(--border)] bg-[var(--field)] px-2 text-xs font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--primary)]"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <Segmented
            label="Repeat"
            options={LOOP_OPTIONS.map((o) => o.label)}
            active={LOOP_OPTIONS.findIndex((o) => o.value === loop)}
            onSelect={(i) => setLoop(LOOP_OPTIONS[i].value)}
          />
          <Segmented
            label="Speed"
            options={RATE_OPTIONS.map((r) => `${r}×`)}
            active={RATE_OPTIONS.indexOf(rate)}
            onSelect={(i) => setRate(RATE_OPTIONS[i])}
          />
        </div>
      </div>
    </div>
  );
}

/** Small square icon button used for transport controls. */
function IconBtn({
  children,
  onClick,
  label,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)] disabled:opacity-35 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
    >
      <svg width="17" height="17" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

/** Compact segmented control for loop and speed. */
function Segmented({
  options,
  active,
  onSelect,
  label,
}: {
  options: string[];
  active: number;
  onSelect: (i: number) => void;
  label: string;
}): JSX.Element {
  return (
    <div role="group" aria-label={label} className="flex rounded-md border border-[var(--border)] overflow-hidden">
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          aria-pressed={i === active}
          onClick={() => onSelect(i)}
          className={[
            'h-7 px-1.5 text-[11px] font-bold tnum transition-colors duration-150',
            i === active ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'bg-[var(--field)] text-[var(--muted)] hover:text-[var(--fg)]',
          ].join(' ')}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
