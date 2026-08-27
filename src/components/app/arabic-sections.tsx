import { HARAKAT, GRAMMAR_TOPICS, VOCABULARY } from '../../lib/core/arabic-data';
import type { GrammarTopic, Harakah } from '../../lib/core/arabic-data';
import { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { TajweedText } from '../tajweed/TajweedText';

/** Counts base letters (ignores diacritics) in a string. */
function letterCount(s: string): number {
  let n = 0;
  for (const ch of Array.from(s)) {
    const c = ch.codePointAt(0) ?? 0;
    if (!((c >= 0x0610 && c <= 0x061a) || (c >= 0x064b && c <= 0x065f) || c === 0x0670)) n += 1;
  }
  return n;
}

/**
 * Shows where the haraka sits in the example word WITHOUT splitting the
 * word into spans — a span boundary breaks Arabic cursive joining, so
 * the word stays one unbroken text run and the marked cluster appears
 * as a separate colored chip on the side where it occurs (right for
 * early letters, left for later ones, in RTL reading order).
 * @param props - the harakah entry.
 * @returns The word plus a callout chip for the marked cluster.
 */
function MarkedWord({ h }: { h: Harakah }): JSX.Element {
  const pos = h.example.indexOf(h.hl);
  const total = letterCount(h.example);
  const before = pos >= 0 ? letterCount(h.example.slice(0, pos)) : 0;
  const early = pos >= 0 && before + 1 <= total / 2;
  const chip = (
    <span
      dir="rtl"
      title="The letter carrying this mark"
      className="arabic-ui inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] px-2 text-2xl leading-none text-[var(--primary)]"
    >
      {h.hl}
    </span>
  );
  return (
    <span className="flex items-center justify-end gap-2.5" dir="rtl">
      {early ? chip : null}
      <span className="arabic-ui text-2xl leading-loose text-[var(--fg)]">{h.example}</span>
      {!early ? chip : null}
    </span>
  );
}

export interface HarakatProps {
  speak: (text: string) => void;
}

/**
 * The diacritics a beginner must recognise, each on a carrier letter
 * with a Quranic example you can hear.
 * @param props - speak function for TTS.
 * @returns The rendered harakat grid.
 */
export function HarakatSection({ speak }: HarakatProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {HARAKAT.map((h) => (
        <Card key={h.nameEn} hover className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="arabic-ui flex h-14 w-14 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-4xl text-[var(--primary)] leading-none">
              {h.shown}
            </span>
            <button
              type="button"
              onClick={() => speak(h.example)}
              aria-label={`Hear ${h.example}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent-strong)] hover:bg-[var(--accent)] hover:text-[#3b2305] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6 4l10 6-10 6z" /></svg>
            </button>
          </div>
          <p className="mt-2.5 text-sm font-extrabold text-[var(--fg)]">
            {h.nameEn} <span className="arabic text-base text-[var(--muted)]">{h.nameAr}</span>
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{h.sound}</p>
          <div className="mt-auto pt-2">
            <MarkedWord h={h} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export interface GrammarProps {
  tajweedOn: boolean;
}

/**
 * Quran-focused grammar topics as an accordion, each with a worked
 * ayah example rendered with the tajweed overlay.
 * @param props - tajweedOn flag.
 * @returns The rendered grammar accordion.
 */
export function GrammarSection({ tajweedOn }: GrammarProps): JSX.Element {
  const [open, setOpen] = useState<string | null>(GRAMMAR_TOPICS[0]?.id ?? null);

  return (
    <div className="space-y-2.5">
      {GRAMMAR_TOPICS.map((g: GrammarTopic, i) => {
        const isOpen = open === g.id;
        return (
          <div
            key={g.id}
            className={[
              'rounded-xl border bg-[var(--card)] transition-colors duration-200',
              isOpen ? 'border-[color-mix(in_srgb,var(--primary)_45%,var(--border))] shadow-md shadow-teal-950/5' : 'border-[var(--border)]',
            ].join(' ')}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`grammar-${g.id}`}
              onClick={() => setOpen(isOpen ? null : g.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-sm font-extrabold text-[var(--primary)] tnum">
                  {i + 1}
                </span>
                <span className={['text-sm font-extrabold truncate', isOpen ? 'text-[var(--primary)]' : 'text-[var(--fg)]'].join(' ')}>
                  {g.titleEn} <span className="arabic text-base font-normal text-[var(--muted)]">{g.titleAr}</span>
                </span>
              </span>
              <svg
                width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
                className={['shrink-0 text-[var(--muted)] transition-transform duration-200 ease-out', isOpen ? 'rotate-180 text-[var(--primary)]' : ''].join(' ')}
              >
                <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isOpen ? (
              <div id={`grammar-${g.id}`} className="px-4 pb-4 animate-[fadeIn_180ms_ease-out]">
                <p className="text-sm leading-relaxed text-[var(--muted)]">{g.explain}</p>
                <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--field)] p-3">
                  <p className="arabic text-xl text-[var(--fg)] text-right leading-loose">
                    <TajweedText text={g.example} enabled={tajweedOn} />
                  </p>
                  <p className="mt-2 border-t border-[var(--border)] pt-2 text-xs leading-relaxed text-[var(--muted)]">{g.gloss}</p>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export interface VocabProps {
  speak: (text: string) => void;
}

/**
 * High-frequency Quran vocabulary as a two-column reference list with
 * listen buttons and frequency hints.
 * @param props - speak function for TTS.
 * @returns The rendered vocabulary list.
 */
export function VocabSection({ speak }: VocabProps): JSX.Element {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
        <Badge tone="success">High frequency</Badge>
        Words you will meet within the first few pages of the Quran.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {VOCABULARY.map((w) => (
          <div key={w.ar} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <span className="arabic text-2xl text-[var(--fg)] leading-none shrink-0">{w.ar}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[var(--fg)] truncate">{w.en}</p>
                <p className="text-[11px] font-semibold tnum text-[var(--muted)]">≈ {w.freq} in the Quran</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speak(w.ar)}
              aria-label={`Hear ${w.en}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent-strong)] hover:bg-[var(--accent)] hover:text-[#3b2305] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6 4l10 6-10 6z" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
