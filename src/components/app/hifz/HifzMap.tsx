import { useEffect, useMemo, useState } from 'react';
import { ALL_SURAHS } from '../../../lib/core/quran-meta';
import { juzCoverage, surahCoverage, TOTAL_AYAHS } from '../../../lib/core/hifz';
import { listHifzChunks, listHifzChunksForSurah } from '../../../lib/db/db';
import { formatNumber } from '../../../lib/utils/format';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import type { HifzChunkRow } from '../../../types';

export interface HifzMapProps {
  /** Jumps to Learn, optionally preselecting a surah. */
  onStartLearn: (surah?: number) => void;
}

const R = 84;
const CIRC = 2 * Math.PI * R;
const SEG = CIRC / 30;

/**
 * Progress graph of the memorization journey: a 30-segment juz ring,
 * a 114-node surah map colored by coverage, and per-chunk detail.
 * @param props - onStartLearn callback.
 * @returns The rendered map view.
 */
export function HifzMap({ onStartLearn }: HifzMapProps): JSX.Element {
  const [chunks, setChunks] = useState<HifzChunkRow[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedChunks, setSelectedChunks] = useState<HifzChunkRow[]>([]);

  useEffect(() => {
    void listHifzChunks().then(setChunks);
  }, []);

  useEffect(() => {
    if (selected === null) return;
    void listHifzChunksForSurah(selected).then(setSelectedChunks);
  }, [selected, chunks]);

  const juz = useMemo(() => juzCoverage(chunks ?? []), [chunks]);
  const surahs = useMemo(() => surahCoverage(chunks ?? []), [chunks]);
  const memorized = useMemo(
    () => (chunks ?? []).reduce((s, c) => s + (c.ayahEnd - c.ayahStart + 1), 0),
    [chunks]
  );
  const learningCount = (chunks ?? []).filter((c) => c.status === 'learning').length;
  const juzDone = juz.filter((f) => f >= 1).length;
  const percent = TOTAL_AYAHS === 0 ? 0 : (memorized / TOTAL_AYAHS) * 100;
  const selectedInfo = selected !== null ? ALL_SURAHS.find((s) => s.num === selected) : undefined;

  if (chunks === null) {
    return (
      <Card className="flex justify-center py-14">
        <span className="h-8 w-8 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)] animate-spin" />
      </Card>
    );
  }

  if (chunks.length === 0) {
    return (
      <Card tone="outline" className="text-center py-14 max-w-xl mx-auto">
        <p className="arabic text-3xl text-[var(--primary)]">وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ</p>
        <h3 className="mt-2 text-lg font-extrabold text-[var(--fg)]">Your map is blank — for now</h3>
        <p className="mt-1.5 text-sm text-[var(--muted)]">
          “We have made the Quran easy to remember” (54:17). Every chunk you learn lights a tile here, and every juz you finish closes a segment of the ring.
        </p>
        <Button className="mt-5" onClick={() => onStartLearn()}>Memorize your first chunk</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { value: formatNumber(memorized), label: `ayahs of ${formatNumber(TOTAL_AYAHS)}`, tone: 'text-[var(--fg)]' },
          { value: `${percent.toFixed(1)}%`, label: 'of the Quran', tone: 'text-[var(--primary)]' },
          { value: String(learningCount), label: 'chunks in review', tone: 'text-[var(--accent-strong)]' },
          { value: `${juzDone}/30`, label: 'juz complete', tone: 'text-[var(--success)]' },
        ].map((s) => (
          <Card key={s.label} hover className="text-center py-3">
            <p className={`text-2xl font-extrabold tnum ${s.tone}`}>{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-start">
        <Card className="flex flex-col items-center">
          <h3 className="text-sm font-extrabold text-[var(--fg)] self-start">The 30 juz ring</h3>
          <svg viewBox="0 0 200 200" className="w-full max-w-[240px] -rotate-90" role="img" aria-label={`Juz progress ring: ${juzDone} of 30 complete`}>
            {juz.map((frac, j) => (
              <g key={j}>
                <circle
                  cx="100" cy="100" r={R} fill="none"
                  stroke="var(--hover)" strokeWidth="13"
                  strokeDasharray={`${SEG - 2.5} ${CIRC - SEG + 2.5}`}
                  strokeDashoffset={-j * SEG}
                />
                {frac > 0 ? (
                  <circle
                    cx="100" cy="100" r={R} fill="none"
                    stroke={frac >= 1 ? 'var(--success)' : 'var(--accent)'}
                    strokeWidth="13"
                    strokeDasharray={`${Math.max(0.5, (SEG - 2.5) * frac)} ${CIRC - Math.max(0.5, (SEG - 2.5) * frac)}`}
                    strokeDashoffset={-j * SEG}
                    style={{ transition: 'stroke-dasharray 400ms ease-out' }}
                  />
                ) : null}
              </g>
            ))}
            <g transform="rotate(90 100 100)">
              <text x="100" y="94" textAnchor="middle" fontSize="30" fontWeight="800" fill="var(--fg)" className="tnum">
                {juzDone}
              </text>
              <text x="100" y="116" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--muted)">
                of 30 juz
              </text>
            </g>
          </svg>
          <div className="flex gap-3 text-[11px] font-bold text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--accent)]" />partial</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--success)]" />complete</span>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-[var(--fg)]">Surah map — tap a tile</h3>
            <Badge tone="neutral">{surahs.size} surahs touched</Badge>
          </div>
          <div className="mt-3 grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-12 gap-1.5">
            {ALL_SURAHS.map((s) => {
              const frac = surahs.get(s.num) ?? 0;
              const isActive = selected === s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setSelected(isActive ? null : s.num)}
                  aria-pressed={isActive}
                  title={`${s.num}. ${s.name} — ${Math.round(frac * 100)}% memorized`}
                  className={[
                    'relative aspect-square rounded-md border text-[10px] font-bold tnum transition-all duration-150 active:scale-90 overflow-hidden',
                    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]',
                    isActive
                      ? 'border-[var(--primary)] ring-2 ring-[var(--primary)] z-10'
                      : frac >= 1
                        ? 'border-[var(--success)]'
                        : frac > 0
                          ? 'border-[color-mix(in_srgb,var(--accent)_55%,var(--border))]'
                          : 'border-[var(--border)] hover:border-[var(--primary)]',
                    frac > 0 ? 'text-white' : 'text-[var(--muted)]',
                  ].join(' ')}
                  style={{
                    background:
                      frac >= 1
                        ? 'var(--success)'
                        : frac > 0
                          ? `color-mix(in srgb, var(--accent) ${Math.round(25 + frac * 60)}%, var(--field))`
                          : 'var(--field)',
                  }}
                >
                  {s.num}
                  {frac > 0 && frac < 1 ? (
                    <span className="absolute bottom-0 left-0 h-[3px] bg-[var(--accent)]" style={{ width: `${frac * 100}%` }} />
                  ) : null}
                </button>
              );
            })}
          </div>

          {selectedInfo ? (
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--field)] p-3.5 animate-[fadeIn_180ms_ease-out]">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-extrabold text-[var(--fg)]">
                  {selectedInfo.num}. {selectedInfo.name} <span className="text-[var(--muted)] font-bold">— {selectedInfo.nameArabic}</span>
                </p>
                <Badge tone={(surahs.get(selectedInfo.num) ?? 0) >= 1 ? 'success' : 'primary'}>
                  {Math.round((surahs.get(selectedInfo.num) ?? 0) * 100)}% · {selectedInfo.ayahCount} ayahs
                </Badge>
                <Button size="sm" className="ml-auto" onClick={() => onStartLearn(selectedInfo.num)}>
                  {selectedChunks.length > 0 ? 'Continue' : 'Start'} learning
                </Button>
              </div>
              {selectedChunks.length > 0 ? (
                <ul className="mt-2.5 space-y-1">
                  {selectedChunks.map((c) => (
                    <li key={c.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-[var(--card)] border border-[var(--border)] px-2.5 py-1.5 text-xs">
                      <span className="font-bold tnum text-[var(--fg)]">Ayahs {c.ayahStart}–{c.ayahEnd}</span>
                      <Badge tone={c.status === 'memorized' ? 'success' : 'accent'}>{c.status}</Badge>
                      <span className="text-[var(--muted)] tnum ml-auto">review {c.dueISO} · reps {c.reps}{c.lapses > 0 ? ` · lapses ${c.lapses}` : ''}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-[var(--muted)]">No chunks yet — start at ayah 1 and let the chain build.</p>
              )}
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
