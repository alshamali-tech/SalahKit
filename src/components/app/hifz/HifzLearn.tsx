import { useEffect, useMemo, useState } from 'react';
import { getSurahInfo } from '../../../lib/core/quran-meta';
import { fetchFullSurah } from '../../../lib/external/quran';
import type { FullSurah, ResolvedAyah } from '../../../lib/external/quran';
import { chunkId, gradeChunk, intervalLabel, splitChunkRanges } from '../../../lib/core/hifz';
import type { ChunkRange, GradeOutcome } from '../../../lib/core/hifz';
import { listHifzChunksForSurah, upsertHifzChunk } from '../../../lib/db/db';
import { toISODate } from '../../../lib/core/validator';
import { emitToast } from '../../../lib/messaging';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { SurahPicker } from '../SurahPicker';
import type { HifzChunkRow, HifzGrade } from '../../../types';

const STEPS = ['Understand', 'Repeat ×3', 'Recall', 'Link', 'Test'] as const;
const READS_NEEDED = 3;

export interface HifzLearnProps {
  /** Surah preselected from the Map view. */
  initialSurah?: number;
  /** Called after a chunk is graded so the shell refreshes stats. */
  onGraded: () => void;
}

/**
 * Guided memorization session — a five-step chain of thought:
 * understand meaning, repeat-read, active recall, link to the
 * previous chunk, then self-test and schedule the first review.
 * @param props - initialSurah/onGraded.
 * @returns The rendered session or its setup screen.
 */
export function HifzLearn({ initialSurah, onGraded }: HifzLearnProps): JSX.Element {
  const [surahNum, setSurahNum] = useState(initialSurah ?? 1);
  const [chunkSize, setChunkSize] = useState(3);
  const [chunks, setChunks] = useState<HifzChunkRow[]>([]);
  const [range, setRange] = useState<ChunkRange | null>(null);
  const [full, setFull] = useState<FullSurah | null>(null);
  const [step, setStep] = useState(0);
  const [reads, setReads] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [outcome, setOutcome] = useState<GradeOutcome | null>(null);

  const info = getSurahInfo(surahNum);
  const ranges = useMemo(() => splitChunkRanges(info.ayahCount, chunkSize), [info.ayahCount, chunkSize]);

  useEffect(() => {
    void listHifzChunksForSurah(surahNum).then(setChunks);
  }, [surahNum]);

  useEffect(() => {
    if (!range) return;
    let cancelled = false;
    setFull(null);
    void fetchFullSurah(surahNum).then((f) => {
      if (!cancelled) setFull(f);
    });
    setReads(Array(range.end - range.start + 1).fill(0));
    setRevealed(new Set());
    setShowAll(false);
    setStep(0);
    setOutcome(null);
    return () => {
      cancelled = true;
    };
  }, [range, surahNum]);

  const ayahs: ResolvedAyah[] = useMemo(
    () => (full ? full.ayahs.filter((a) => a.ayahNum >= (range?.start ?? 0) && a.ayahNum <= (range?.end ?? 0)) : []),
    [full, range]
  );
  const prevAyah = useMemo(
    () => (full && range && range.start > 1 ? full.ayahs.find((a) => a.ayahNum === range.start - 1) : undefined),
    [full, range]
  );
  const readsDone = reads.length > 0 && reads.every((r) => r >= READS_NEEDED);

  /** Grades the chunk and schedules its first review. */
  async function grade(g: HifzGrade): Promise<void> {
    if (!range) return;
    const today = toISODate(new Date());
    const now = new Date().toISOString();
    const existing = chunks.find((c) => c.id === chunkId(surahNum, range)) ?? null;
    const result = gradeChunk(existing, g, today, now);
    await upsertHifzChunk({
      id: chunkId(surahNum, range),
      surahNum,
      ayahStart: range.start,
      ayahEnd: range.end,
      ...result,
      lastGradedISO: now,
      updatedAt: Date.now(),
    });
    setOutcome(result);
    onGraded();
    emitToast({
      title: g === 'again' ? 'Scheduled for tomorrow' : `Review in ${intervalLabel(result.intervalDays)}`,
      body: `${info.name} · ayahs ${range.start}–${range.end}`,
      tone: g === 'again' ? 'warning' : 'success',
    });
  }

  if (!range) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr] lg:items-start">
        <Card className="p-0 overflow-hidden">
          <div className="h-[420px] lg:h-[520px]">
            <SurahPicker active={surahNum} onSelect={setSurahNum} />
          </div>
        </Card>
        <div className="space-y-4 min-w-0">
          <Card hover>
            <h3 className="text-sm font-extrabold text-[var(--fg)]">
              {info.num}. {info.name} — {info.ayahCount} ayahs
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">Choose how many ayahs per memorization chunk.</p>
            <div className="mt-3 flex gap-2">
              {[1, 3, 5].map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={chunkSize === size}
                  onClick={() => setChunkSize(size)}
                  className={[
                    'h-11 flex-1 rounded-lg text-sm font-bold tnum transition-all duration-150',
                    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                    chunkSize === size
                      ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                      : 'bg-[var(--field)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]',
                  ].join(' ')}
                >
                  {size} {size === 1 ? 'ayah' : 'ayahs'}
                </button>
              ))}
            </div>
            <div className="mt-4 max-h-56 overflow-y-auto space-y-1.5">
              {ranges.map((r) => {
                const existing = chunks.find((c) => c.ayahStart === r.start && c.ayahEnd === r.end);
                return (
                  <button
                    key={`${r.start}-${r.end}`}
                    type="button"
                    onClick={() => setRange(r)}
                    className="w-full flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--field)] px-3 py-2.5 text-left hover:border-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_7%,transparent)] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
                  >
                    <span className="text-sm font-bold text-[var(--fg)] tnum">Ayahs {r.start}–{r.end}</span>
                    {existing ? (
                      <Badge tone={existing.status === 'memorized' ? 'success' : 'accent'}>
                        {existing.status === 'memorized' ? 'Memorized' : `Review ${existing.dueISO.slice(5)}`}
                      </Badge>
                    ) : (
                      <Badge tone="primary">New</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
          <p className="text-xs leading-relaxed text-[var(--muted)] px-1">
            Small chunks beat long sessions: three ayahs repeated properly outlive twenty read once.
            Work top-to-bottom; each test schedules spaced reviews automatically.
          </p>
        </div>
      </div>
    );
  }

  if (outcome) {
    return (
      <Card tone="raised" className="text-center py-10 max-w-xl mx-auto animate-[slideUp_280ms_ease-out]">
        <p className="arabic text-3xl text-[var(--success)]">مَا شَاءَ اللَّهُ</p>
        <h3 className="mt-2 text-xl font-extrabold text-[var(--fg)]">Chunk logged</h3>
        <p className="mt-1.5 text-sm text-[var(--muted)]">
          {info.name}, ayahs {range.start}–{range.end} · next review{' '}
          <strong className="text-[var(--fg)]">{intervalLabel(outcome.intervalDays)}</strong> ({outcome.dueISO})
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => setRange(null)}>Change chunk</Button>
          <Button
            onClick={() => {
              const idx = ranges.findIndex((r) => r.start === range.start && r.end === range.end);
              const next = ranges[idx + 1];
              if (next) setRange(next);
              else setRange(null);
            }}
          >
            Next chunk →
          </Button>
        </div>
      </Card>
    );
  }

  if (!full) {
    return (
      <Card className="text-center py-12 max-w-xl mx-auto">
        <span className="mx-auto block h-8 w-8 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)] animate-spin" />
        <p className="mt-3 text-sm text-[var(--muted)]">Loading {info.name}…</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Opens instantly if you have read this surah before; otherwise streams once and caches forever.</p>
      </Card>
    );
  }

  if (ayahs.length === 0) {
    return (
      <Card tone="outline" className="text-center py-10 max-w-xl mx-auto">
        <p className="text-sm font-bold text-[var(--fg)]">This surah isn’t on your device yet.</p>
        <p className="mt-1 text-xs text-[var(--muted)]">Open it once in the Quran Reader while online — it then works offline forever.</p>
        <Button variant="outline" className="mt-4" onClick={() => setRange(null)}>Back</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-extrabold text-[var(--fg)]">
          {info.num}. {info.name} · ayahs {range.start}–{range.end}
        </p>
        <Button variant="ghost" size="sm" onClick={() => setRange(null)}>← All chunks</Button>
      </div>

      <ol className="flex items-center gap-1 sm:gap-2" aria-label="Memorization steps">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              aria-current={i === step ? 'step' : undefined}
              className={[
                'flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1 text-[11px] font-bold transition-all duration-200 min-w-0',
                i === step
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)] shadow-sm'
                  : i < step
                    ? 'bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)]'
                    : 'bg-[var(--hover)] text-[var(--muted)]',
                i > step ? 'cursor-default' : 'hover:brightness-105',
              ].join(' ')}
            >
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10 tnum">{i + 1}</span>
              <span className="truncate hidden sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 ? <span className="h-px flex-1 bg-[var(--border)]" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>

      <Card className="min-h-[280px]">
        <div key={step} className="module-enter space-y-3">
          {step === 0 ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Step 1 · Understand before you memorize</p>
              {ayahs.map((a) => (
                <div key={a.ayahNum} className="rounded-lg border border-[var(--border)] bg-[var(--field)] p-3">
                  <p className="arabic text-xl text-[var(--fg)] text-right">{a.arabic}</p>
                  <p className="mt-1.5 text-sm text-[var(--muted)] leading-relaxed">{a.en}</p>
                </div>
              ))}
            </>
          ) : step === 1 ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                Step 2 · Read each ayah aloud {READS_NEEDED}× — tap after every read
              </p>
              {ayahs.map((a, i) => (
                <button
                  key={a.ayahNum}
                  type="button"
                  onClick={() => setReads((r) => r.map((v, j) => (j === i ? Math.min(READS_NEEDED, v + 1) : v)))}
                  className={[
                    'w-full text-right rounded-lg border p-3 transition-all duration-150 active:scale-[0.99]',
                    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                    reads[i] >= READS_NEEDED
                      ? 'border-[var(--success)] bg-[color-mix(in_srgb,var(--success)_8%,transparent)]'
                      : 'border-[var(--border)] bg-[var(--field)] hover:border-[var(--primary)]',
                  ].join(' ')}
                >
                  <p className="arabic text-xl text-[var(--fg)]">{a.arabic}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1" aria-label={`${reads[i]} of ${READS_NEEDED} reads`}>
                    {Array.from({ length: READS_NEEDED }, (_, d) => (
                      <span
                        key={d}
                        className={[
                          'h-2 w-2 rounded-full transition-colors duration-200',
                          d < reads[i] ? 'bg-[var(--success)]' : 'bg-[var(--border)]',
                        ].join(' ')}
                      />
                    ))}
                    <span className="ml-1.5 text-[11px] font-bold tnum text-[var(--muted)]">{reads[i]}/{READS_NEEDED}</span>
                  </span>
                </button>
              ))}
            </>
          ) : step === 2 ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                Step 3 · Recite from memory, then tap an ayah to check — {revealed.size}/{ayahs.length} checked
              </p>
              {ayahs.map((a) => (
                <button
                  key={a.ayahNum}
                  type="button"
                  onClick={() => setRevealed((s) => new Set(s).add(a.ayahNum))}
                  aria-pressed={revealed.has(a.ayahNum)}
                  className="w-full text-right rounded-lg border border-[var(--border)] bg-[var(--field)] p-3 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]"
                >
                  <p className={['arabic text-xl text-[var(--fg)] transition-all duration-250', revealed.has(a.ayahNum) ? '' : 'blur-[7px] select-none'].join(' ')}>
                    {a.arabic}
                  </p>
                  <p className="mt-1 text-[11px] font-bold text-[var(--muted)]">
                    {revealed.has(a.ayahNum) ? 'Checked ✓' : 'Recite it, then tap to check'}
                  </p>
                </button>
              ))}
            </>
          ) : step === 3 ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Step 4 · Link — the seam between chunks is where memory breaks</p>
              {prevAyah ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--field)] p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">End of previous chunk · ayah {prevAyah.ayahNum}</p>
                    <p className="arabic mt-1.5 text-lg text-[var(--fg)] text-right">{prevAyah.arabic}</p>
                  </div>
                  <div className="rounded-lg border-2 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-strong)]">Start of this chunk · ayah {ayahs[0].ayahNum}</p>
                    <p className="arabic mt-1.5 text-lg text-[var(--fg)] text-right">{ayahs[0].arabic}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)] rounded-lg border border-dashed border-[var(--border)] p-4">
                  This is the first chunk of {info.name} — linking starts with your second chunk, when the end of one flows into the beginning of the next.
                </p>
              )}
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Recite the last ayah of the previous chunk and flow straight into the first ayah of this one, three times.
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Step 5 · Test — recite the whole chunk, then grade honestly</p>
                <Button variant="outline" size="sm" onClick={() => setShowAll((v) => !v)}>
                  {showAll ? 'Hide text' : 'Reveal all'}
                </Button>
              </div>
              <div className={['rounded-lg border border-[var(--border)] bg-[var(--field)] p-4 transition-all duration-300', showAll ? '' : 'blur-[9px] select-none'].join(' ')}>
                {ayahs.map((a) => (
                  <p key={a.ayahNum} className="arabic text-xl text-[var(--fg)] text-right leading-loose">
                    {a.arabic} <span className="text-[var(--accent-strong)]">﴿{a.ayahNum}﴾</span>
                  </p>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {(['again', 'hard', 'good', 'easy'] as const).map((g) => {
                  const preview = gradeChunk(null, g, toISODate(new Date()), new Date().toISOString());
                  const styles: Record<HifzGrade, string> = {
                    again: 'border-[var(--danger)] text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)]',
                    hard: 'border-[var(--warning)] text-[var(--warning)] hover:bg-[color-mix(in_srgb,var(--warning)_10%,transparent)]',
                    good: 'border-[var(--primary)] text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]',
                    easy: 'border-[var(--success)] text-[var(--success)] hover:bg-[color-mix(in_srgb,var(--success)_10%,transparent)]',
                  };
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => void grade(g)}
                      className={[
                        'h-14 rounded-xl border-2 bg-[var(--card)] text-sm font-extrabold capitalize transition-all duration-150 active:scale-95',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
                        styles[g],
                      ].join(' ')}
                    >
                      {g}
                      <span className="block text-[10px] font-bold opacity-70 normal-case">→ {intervalLabel(preview.intervalDays)}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </Card>

      {step < 4 ? (
        <div className="flex justify-between gap-3">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            ← Back
          </Button>
          <Button onClick={() => setStep((s) => s + 1)} disabled={step === 1 && !readsDone}>
            {step === 1 && !readsDone ? `Finish ${READS_NEEDED}× reads to continue` : 'Next step →'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
