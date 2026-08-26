import { useState } from 'react';
import { NOON_TREE_BRANCHES, LETTER_NAMES, LETTER_ZONES, MAKHARIJ_ZONES } from '../../lib/core/tajweed-data';
import { TAJWEED_RULES } from '../../lib/core/tajweed';
import type { TajweedRuleId } from '../../lib/core/tajweed';
import { Card } from '../ui/Card';

const ZONE_COLORS: Record<string, string> = {
  Jawf: '#1864ab', Throat: '#2b8a3e', Tongue: '#e8590c', Lips: '#c92a2a', Nasal: '#d6336c',
};

/** Node positions for the five rule branches (percent of viewBox). */
const NODES: { rule: TajweedRuleId; x: number; y: number }[] = [
  { rule: 'izhaar', x: 90, y: 40 },
  { rule: 'iqlaab', x: 250, y: 18 },
  { rule: 'idghaam-ghunna', x: 410, y: 40 },
  { rule: 'idghaam-bila-ghunna', x: 60, y: 130 },
  { rule: 'ikhfaa', x: 440, y: 130 },
];

interface Selection {
  letter: string;
  rule: TajweedRuleId;
}

/**
 * The Letter Map (Graph of Thoughts): the silent noon hub links out to
 * five rule nodes along colored arcs, and each rule's letters sit as
 * clickable chips beside it — no overlaps, every path traceable.
 * @returns The rendered knowledge graph.
 */
export function LetterMap(): JSX.Element {
  const [sel, setSel] = useState<Selection>({ letter: 'ب', rule: 'iqlaab' });
  const selRule = TAJWEED_RULES[sel.rule];
  const short = (id: TajweedRuleId): string => TAJWEED_RULES[id].label.split(' ')[0];

  return (
    <div className="space-y-4">
      <Card className="overflow-x-auto">
        <svg viewBox="0 0 500 170" className="w-full min-w-[520px]" role="img" aria-label="Graph linking the silent noon to its five rules">
          {NODES.map((n) => {
            const color = TAJWEED_RULES[n.rule].color;
            const active = sel.rule === n.rule;
            return (
              <g key={n.rule} style={{ opacity: active || !sel ? 1 : 0.55, transition: 'opacity 200ms ease-out' }}>
                <path
                  d={`M250 85 Q ${(250 + n.x) / 2} ${Math.min(n.y, 85) - 12} ${n.x} ${n.y + 16}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={active ? 3 : 1.6}
                  strokeDasharray={active ? 'none' : '4 4'}
                  opacity={active ? 0.9 : 0.45}
                  style={{ transition: 'all 200ms ease-out' }}
                />
                <rect x={n.x - 34} y={n.y - 14} width="68" height="30" rx="15" fill={active ? color : 'var(--card)'} stroke={color} strokeWidth="1.8" />
                <text x={n.x} y={n.y + 1} textAnchor="middle" fontSize="10" fontWeight="800" fill={active ? '#fff' : color}>
                  {short(n.rule)}
                </text>
                <text x={n.x} y={n.y + 11} textAnchor="middle" fontSize="8.5" fill={active ? 'rgba(255,255,255,0.85)' : 'var(--muted)'}>
                  {TAJWEED_RULES[n.rule].arabic}
                </text>
              </g>
            );
          })}
          <circle cx="250" cy="85" r="24" fill="var(--primary)" />
          <text x="250" y="89" textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff">نْ</text>
          <text x="250" y="124" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--muted)">
            the silent noon asks: what comes next?
          </text>
        </svg>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {NOON_TREE_BRANCHES.map((b) => {
          const rule = TAJWEED_RULES[b.rule];
          const activeRule = sel.rule === b.rule;
          return (
            <Card
              key={b.rule}
              className={['p-3 transition-all duration-200', activeRule ? 'shadow-md' : 'opacity-85'].join(' ')}
              hover
            >
              <p className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: rule.color }}>
                {rule.label} <span className="tnum opacity-60">({b.letters.length})</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {b.letters.map((letter) => {
                  const active = sel.letter === letter && sel.rule === b.rule;
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => setSel({ letter, rule: b.rule })}
                      aria-pressed={active}
                      aria-label={`${LETTER_NAMES[letter] ?? letter}: ${rule.label}`}
                      className={[
                        'arabic inline-flex h-9 w-9 items-center justify-center rounded-lg border text-lg leading-none transition-all duration-150',
                        'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)] active:scale-90',
                        active ? 'text-white shadow-sm scale-105' : 'bg-[var(--field)] text-[var(--fg)]',
                      ].join(' ')}
                      style={active ? { background: rule.color, borderColor: rule.color } : { borderColor: 'var(--border)' }}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <Card key={`${sel.letter}-${sel.rule}`} className="animate-[fadeIn_220ms_ease-out] flex flex-wrap items-center gap-4">
        <span
          className="arabic inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl leading-none"
          style={{ background: `color-mix(in srgb, ${selRule.color} 12%, transparent)`, color: selRule.color }}
        >
          {sel.letter}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-extrabold text-[var(--fg)]">
            {LETTER_NAMES[sel.letter] ?? sel.letter}
            <span className="ml-2 text-sm font-bold" style={{ color: selRule.color }}>{selRule.label}</span>
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Articulated from the {LETTER_ZONES[sel.letter] ?? '—'} · {selRule.desc}
          </p>
        </div>
      </Card>

      <div>
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-[var(--muted)]">
          The five articulation zones
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {MAKHARIJ_ZONES.map((z) => {
            const letters = Object.entries(LETTER_ZONES)
              .filter(([, zone]) => zone === z.zone)
              .map(([letter]) => letter);
            return (
              <Card key={z.zone} hover className="p-3">
                <p className="text-xs font-extrabold" style={{ color: ZONE_COLORS[z.zone] }}>
                  {z.zone} <span className="arabic text-sm text-[var(--muted)]">{z.arabic}</span>
                </p>
                <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">{z.note}</p>
                <p className="arabic mt-2 text-base leading-7 text-[var(--fg)]">{letters.join(' ') || 'ن م'}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
