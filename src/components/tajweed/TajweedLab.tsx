import { useMemo, useState } from 'react';
import { analyzeTajweed, countByRule } from '../../lib/core/tajweed';
import { LAB_PRESETS } from '../../lib/core/tajweed-examples';
import type { TajweedRuleId } from '../../lib/core/tajweed';
import { TajweedText } from './TajweedText';
import { TajweedLegend } from './TajweedLegend';
import { TajweedAudio } from './TajweedAudio';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const DEFAULT_TEXT =
  'وَبَشِّرِ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أَنَّ لَهُمْ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ';

/** The default sample is 2:25 — this range is what "Listen" recites. */
const DEFAULT_AUDIO = { surah: 2, from: 25, to: 25 };

/**
 * The Tajweed Lab: paste any ayah and watch the engine annotate it
 * live — rule counts, focus filtering and a mushaf-style preview.
 * Everything runs on-device; nothing is sent anywhere.
 * @returns The rendered lab.
 */
export function TajweedLab(): JSX.Element {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [presetIdx, setPresetIdx] = useState(0);
  const [focus, setFocus] = useState<TajweedRuleId | null>(null);

  /** Loads a real-world preset ayah and focuses its featured rule. */
  function loadPreset(idx: number): void {
    const preset = LAB_PRESETS[idx];
    setPresetIdx(idx);
    if (preset) {
      setText(preset.ayah);
      setFocus(preset.rule);
    }
  }

  const segments = useMemo(() => analyzeTajweed(text), [text]);
  const counts = useMemo(() => countByRule(segments), [segments]);
  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label htmlFor="tajweed-lab-input" className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)]">
            Paste any Quranic text, or pick a real example
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Load a real-world example"
              value={presetIdx}
              onChange={(e) => loadPreset(Number(e.target.value))}
              className="h-9 rounded-lg border border-[var(--border)] bg-[var(--field)] px-2 text-xs font-bold text-[var(--fg)] focus:outline-none focus:border-[var(--primary)]"
            >
              {LAB_PRESETS.map((p, i) => (
                <option key={p.label} value={i}>{p.label}</option>
              ))}
            </select>
            <Button variant="ghost" size="sm" onClick={() => { setText(DEFAULT_TEXT); setFocus(null); setPresetIdx(0); }}>
              Reset
            </Button>
          </div>
        </div>
        <textarea
          id="tajweed-lab-input"
          dir="rtl"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className={[
            'w-full rounded-lg border border-[var(--border)] bg-[var(--field)] p-3',
            'arabic text-xl leading-loose text-[var(--fg)]',
            'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)]',
            'transition-colors duration-150 resize-y',
          ].join(' ')}
        />
        <p className="mt-1.5 text-[11px] text-[var(--muted)]">
          {text.length} characters · analyzed entirely in your browser — works offline.
        </p>
      </Card>

      <Card tone="raised" className="relative overflow-hidden">
        <div className="bg-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">Live annotation</p>
            <div className="flex items-center gap-2.5">
              <TajweedAudio
                surah={DEFAULT_AUDIO.surah}
                from={DEFAULT_AUDIO.from}
                to={DEFAULT_AUDIO.to}
                label="Listen to the sample recited"
              />
              <p className="text-xs font-bold tnum text-[var(--muted)]">{total} rules found</p>
            </div>
          </div>
          <p className="arabic mt-3 text-2xl sm:text-[1.7rem] leading-[2.3] text-[var(--fg)] text-right" key={`${text}-${focus ?? 'all'}`}>
            <TajweedText text={text} focus={focus} />
          </p>
          <div className="mt-4 border-t border-[var(--border)] pt-3">
            <TajweedLegend counts={counts} onlyCounted focus={focus} onFocus={setFocus} />
          </div>
          {focus ? (
            <p className="mt-2 text-[11px] text-[var(--muted)]">
              Focusing one rule — everything else is dimmed. Click the chip again to release it.
            </p>
          ) : null}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)] mb-2">How the engine reads</p>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          It splits the text into letter + diacritic clusters, then walks the chain a reciter
          follows: a silent noon or tanween asks “what comes next?” and lands on izhaar, iqlaab,
          idghaam or ikhfaa; a meem sakinah runs its own three-way split; shaddah hums, qalqalah
          letters bounce, and madd marks stretch. Hover any colored word for its rule.
        </p>
      </Card>
    </div>
  );
}
