import { useEffect, useMemo, useState } from 'react';
import { getSurahInfo } from '../../../lib/core/quran-meta';
import { fetchFullSurah } from '../../../lib/external/quran';
import type { ResolvedAyah } from '../../../lib/external/quran';
import { gradeChunk, intervalLabel } from '../../../lib/core/hifz';
import { listHifzDue, upsertHifzChunk } from '../../../lib/db/db';
import { toISODate } from '../../../lib/core/validator';
import { emitToast } from '../../../lib/messaging';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import type { HifzChunkRow, HifzGrade } from '../../../types';

export interface HifzReviewProps {
  /** Called after each grade so the shell refreshes stats. */
  onGraded: () => void;
  /** Switches to the Learn tab. */
  onGoLearn: () => void;
}

const GRADES: readonly { id: HifzGrade; label: string; klass: string }[] = [
  { id: 'again', label: 'Again', klass: 'border-[var(--danger)] text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)]' },
  { id: 'hard', label: 'Hard', klass: 'border-[var(--warning)] text-[var(--warning)] hover:bg-[color-mix(in_srgb,var(--warning)_10%,transparent)]' },
  { id: 'good', label: 'Good', klass: 'border-[var(--primary)] text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]' },
  { id: 'easy', label: 'Easy', klass: 'border-[var(--success)] text-[var(--success)] hover:bg-[color-mix(in_srgb,var(--success)_10%,transparent)]' },
];

/**
 * Spaced-repetition review queue: due chunks appear as recall cards.
 * Recite first, reveal to check, then grade — each grade branches to a
 * computed next-review date (again tomorrow … easy up to 90 days).
 * @param props - onGraded/onGoLearn.
 * @returns The rendered queue.
 */
export function HifzReview({ onGraded, onGoLearn }: HifzReviewProps): JSX.Element {
  const [queue, setQueue] = useState<HifzChunkRow[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ayahCache, setAyahCache] = useState<Record<number, ResolvedAyah[]>>({});
  const todayISO = toISODate(new Date());

  useEffect(() => {
    void listHifzDue(todayISO).then(setQueue);
  }, [todayISO]);

  const current = queue?.[index] ?? null;
  const surahNum = current?.surahNum;

  useEffect(() => {
    if (surahNum === undefined || ayahCache[surahNum]) return;
    let cancelled = false;
    void fetchFullSurah(surahNum).then((full) => {
      if (!cancelled && full) setAyahCache((c) => ({ ...c, [surahNum]: full.ayahs }));
    });
    return () => {
      cancelled = true;
    };
  }, [surahNum, ayahCache]);

  const ayahs = useMemo(() => {
    if (!current) return [];
    return (ayahCache[current.surahNum] ?? []).filter(
      (a) => a.ayahNum >= current.ayahStart && a.ayahNum <= current.ayahEnd
    );
  }, [current, ayahCache]);

  /** Grades the current card and advances the queue. */
  async function grade(g: HifzGrade): Promise<void> {
    if (!current) return;
    const now = new Date().toISOString();
    const result = gradeChunk(current, g, todayISO, now);
    await upsertHifzChunk({ ...current, ...result, lastGradedISO: now, updatedAt: Date.now() });
    onGraded();
    emitToast({
      title: g === 'again' ? 'Back tomorrow — no shame, that’s the method' : `Next review in ${intervalLabel(result.intervalDays)}`,
      body: `${getSurahInfo(current.surahNum).name} · ayahs ${current.ayahStart}–${current.ayahEnd}`,
      tone: g === 'again' ? 'warning' : 'success',
    });
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  if (queue === null) {
    return (
      <Card className="flex justify-center py-14">
        <span className="h-8 w-8 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)] animate-spin" />
      </Card>
    );
  }

  if (queue.length === 0) {
    return (
      <Card tone="outline" className="text-center py-14 max-w-xl mx-auto">
        <p className="arabic text-3xl text-[var(--success)]">بَارَكَ اللَّهُ فِيكَ</p>
        <h3 className="mt-2 text-lg font-extrabold text-[var(--fg)]">Nothing due — your memory is rested</h3>
        <p className="mt-1.5 text-sm text-[var(--muted)]">
          Reviews appear here exactly when the forgetting curve says you need them. Until then, add new material.
        </p>
        <Button className="mt-5" onClick={onGoLearn}>Learn a new chunk</Button>
      </Card>
    );
  }

  if (!current) {
    return (
      <Card tone="raised" className="text-center py-14 max-w-xl mx-auto animate-[slideUp_280ms_ease-out]">
        <p className="text-5xl font-extrabold tnum text-[var(--success)]">{queue.length}/{queue.length}</p>
        <h3 className="mt-2 text-lg font-extrabold text-[var(--fg)]">Queue cleared</h3>
        <p className="mt-1.5 text-sm text-[var(--muted)]">Every due chunk reviewed. Consistency like this is how the Quran stays in the heart.</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" onClick={onGoLearn}>Learn more</Button>
          <Button variant="ghost" onClick={() => { setIndex(0); void listHifzDue(todayISO).then(setQueue); }}>Re-check queue</Button>
        </div>
      </Card>
    );
  }

  const info = getSurahInfo(current.surahNum);
  const overdueDays = Math.max(0, Math.round((Date.parse(todayISO) - Date.parse(current.dueISO)) / 86400000));

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-[var(--fg)] tnum">Review {Math.min(index + 1, queue.length)} of {queue.length}</p>
        <div className="h-1.5 flex-1 max-w-[220px] rounded-full bg-[var(--hover)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-300 ease-out"
            style={{ width: `${(index / queue.length) * 100}%` }}
          />
        </div>
      </div>

      <Card tone="raised" key={current.id} className="module-enter">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-extrabold text-[var(--fg)]">
            {info.num}. {info.name} · ayahs {current.ayahStart}–{current.ayahEnd}
          </h3>
          <span className="ml-auto flex gap-1.5">
            {overdueDays > 0 ? <Badge tone="warning">{overdueDays}d overdue</Badge> : <Badge tone="primary">due today</Badge>}
            {current.lapses > 0 ? <Badge tone="neutral">{current.lapses} lapse{current.lapses > 1 ? 's' : ''}</Badge> : null}
            <Badge tone={current.status === 'memorized' ? 'success' : 'accent'}>
              {current.status === 'memorized' ? 'memorized' : `interval ${current.intervalDays}d`}
            </Badge>
          </span>
        </div>

        <div className={['mt-4 rounded-xl border border-[var(--border)] bg-[var(--field)] p-4 transition-all duration-300', revealed ? '' : 'blur-[9px] select-none'].join(' ')}>
          {ayahs.length > 0 ? (
            ayahs.map((a) => (
              <p key={a.ayahNum} className="arabic text-xl sm:text-2xl text-[var(--fg)] text-right leading-loose">
                {a.arabic} <span className="text-[var(--accent-strong)]">﴿{a.ayahNum}﴾</span>
              </p>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)] py-6 text-center">
              Text not on device — open this surah once in the Quran Reader while online.
            </p>
          )}
        </div>

        {!revealed ? (
          <Button full className="mt-4" onClick={() => setRevealed(true)}>
            Recite it from memory, then reveal
          </Button>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GRADES.map((g) => {
              const preview = gradeChunk(current, g.id, todayISO, new Date().toISOString());
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => void grade(g.id)}
                  className={[
                    'h-14 rounded-xl border-2 bg-[var(--card)] text-sm font-extrabold transition-all duration-150 active:scale-95',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
                    g.klass,
                  ].join(' ')}
                >
                  {g.label}
                  <span className="block text-[10px] font-bold opacity-70">→ {intervalLabel(preview.intervalDays)}</span>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <p className="text-center text-xs text-[var(--muted)]">
        Grade how well you recalled it <em className="not-italic font-semibold">before</em> revealing — honest grading keeps the schedule honest.
      </p>
    </div>
  );
}
