import { useEffect, useState } from 'react';
import { listHifzChunks, listHifzDue } from '../../lib/db/db';
import { computeStreak, TOTAL_AYAHS } from '../../lib/core/hifz';
import { toISODate } from '../../lib/core/validator';
import { formatNumber } from '../../lib/utils/format';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { HifzLearn } from './hifz/HifzLearn';
import { HifzReview } from './hifz/HifzReview';
import { HifzMap } from './hifz/HifzMap';

type HifzTab = 'learn' | 'review' | 'map';

const TABS: readonly { id: HifzTab; label: string }[] = [
  { id: 'learn', label: 'Learn' },
  { id: 'review', label: 'Review' },
  { id: 'map', label: 'My Map' },
];

/**
 * Hifz Trainer module: a guided memorization pipeline (chain of
 * thought), a spaced-repetition review tree, and a progress graph
 * over the 114 surahs and 30 juz.
 * @returns The rendered module.
 */
export function HifzTrainer(): JSX.Element {
  const [tab, setTab] = useState<HifzTab>('learn');
  const [learnSurah, setLearnSurah] = useState<number | undefined>(undefined);
  const [memorizedAyahs, setMemorizedAyahs] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const todayISO = toISODate(new Date());

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [chunks, due] = await Promise.all([listHifzChunks(), listHifzDue(todayISO)]);
      if (cancelled) return;
      setMemorizedAyahs(chunks.reduce((s, c) => s + (c.ayahEnd - c.ayahStart + 1), 0));
      setDueCount(due.length);
      setStreak(
        computeStreak(
          chunks.map((c) => (c.lastGradedISO ?? '').slice(0, 10)).filter((d) => d !== ''),
          todayISO
        )
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [todayISO, refreshKey]);

  /** Bumps stats after any grading activity in a child view. */
  function refresh(): void {
    setRefreshKey((k) => k + 1);
  }

  /** Jumps to the Learn tab, optionally preselecting a surah. */
  function goLearn(surah?: number): void {
    setLearnSurah(surah);
    setTab('learn');
  }

  return (
    <div className="space-y-5">
      <Card tone="raised" className="relative overflow-hidden">
        <div className="bg-pattern drift-slow absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--primary)]">
              Memorize the Quran, the way huffaz do
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--fg)]">
              Hifz Trainer
            </h2>
            <p className="mt-1.5 text-sm text-[var(--muted)] flex flex-wrap items-center gap-x-2 gap-y-1">
              {['Understand', 'Repeat ×3', 'Recall', 'Link', 'Test'].map((step, i) => (
                <span key={step} className="inline-flex items-center gap-2">
                  <span className="inline-flex h-6 items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] px-2.5 text-xs font-bold text-[var(--primary)]">
                    {i + 1}. {step}
                  </span>
                  {i < 4 ? <span className="text-[var(--muted)]" aria-hidden="true">→</span> : null}
                </span>
              ))}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-center">
              <p className="text-xl font-extrabold tnum text-[var(--fg)]">{formatNumber(memorizedAyahs)}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">of {formatNumber(TOTAL_AYAHS)} ayahs</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-center">
              <p className={['text-xl font-extrabold tnum', dueCount > 0 ? 'text-[var(--accent-strong)]' : 'text-[var(--fg)]'].join(' ')}>{dueCount}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">due today</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-center">
              <p className="text-xl font-extrabold tnum text-[var(--success)]">{streak}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">day streak</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Hifz views" className="flex gap-1 rounded-xl bg-[var(--hover)] p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={[
                'h-10 px-4 rounded-lg text-sm font-bold transition-all duration-150 inline-flex items-center gap-2',
                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                tab === t.id ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm' : 'text-[var(--muted)] hover:text-[var(--fg)]',
              ].join(' ')}
            >
              {t.label}
              {t.id === 'review' && dueCount > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] font-extrabold text-[#3b2305] tnum">
                  {dueCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {tab === 'review' && dueCount === 0 ? <Badge tone="success">All caught up</Badge> : null}
      </div>

      <div key={`${tab}-${refreshKey}`} className="module-enter">
        {tab === 'learn' ? <HifzLearn initialSurah={learnSurah} onGraded={refresh} /> : null}
        {tab === 'review' ? <HifzReview onGraded={refresh} onGoLearn={() => goLearn()} /> : null}
        {tab === 'map' ? <HifzMap onStartLearn={goLearn} /> : null}
      </div>
    </div>
  );
}
