import { useState } from 'react';
import { NOON_TREE_BRANCHES, LETTER_NAMES, LETTER_ZONES, MAKHARIJ_ZONES } from '../../lib/core/tajweed-data';
import { TAJWEED_RULES } from '../../lib/core/tajweed';
import { Card } from '../ui/Card';

const CENTER = { x: 320, y: 170 };
const RULE_RADIUS = 112;
const LETTER_RADIUS = 70;
const RULE_ANGLES = [-90, 0, 90, 180];

const ZONE_COLORS: Record<string, string> = {
  Jawf: '#1864ab', Throat: '#2b8a3e', Tongue: '#e8590c', Lips: '#c92a2a', Nasal: '#d6336c',
};

/** Polar to cartesian helper. */
function polar(cx: number, cy: number, angleDeg: number, r: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

interface Selection {
  letter: string;
  rule: string;
}

/**
 * The Letter Map (Graph of Thoughts): the silent noon hub links to the
 * four rule nodes, and every letter hangs off the rule that governs
 * it. Below, the five articulation zones complete the graph.
 * @returns The rendered knowledge graph.
 */
export function LetterMap(): JSX.Element {
  const [sel, setSel] = useState<Selection>({ letter: 'ب', rule: 'iqlaab' });
  const selRule = TAJWEED_RULES[sel.rule as keyof typeof TAJWEED_RULES];

  return (
    <div className="space-y-4">
      <Card className="overflow-x-auto">
        <svg viewBox="0 0 640 340" className="w-full min-w-[560px]" role="group" aria-label="Tajweed letter knowledge graph">
          {NOON_TREE_BRANCHES.slice(0, 4).map((b, i) => {
            const angle = RULE_ANGLES[i] ?? 0;
            const rPos = polar(CENTER.x, CENTER.y, angle, RULE_RADIUS);
            const color = TAJWEED_RULES[b.rule].color;
            return (
              <g key={b.rule}>
                <line x1={CENTER.x} y1={CENTER.y} x2={rPos.x} y2={rPos.y} stroke={color} strokeWidth="1.6" opacity="0.45" />
                {b.letters.map((letter, j) => {
                  const spread = b.letters.length === 1 ? 0 : (j / (b.letters.length - 1) - 0.5) * 110;
                  const lPos = polar(rPos.x, rPos.y, angle + spread, LETTER_RADIUS);
                  const active = sel.letter === letter && sel.rule === b.rule;
                  return (
                    <g key={letter}>
                      <line x1={rPos.x} y1={rPos.y} x2={lPos.x} y2={lPos.y} stroke={color} strokeWidth="1" opacity={active ? 0.8 : 0.2} />
                      <g
                        onClick={() => setSel({ letter, rule: b.rule })}
                        className="cursor-pointer"
                        role="button"
                        aria-label={`Letter ${LETTER_NAMES[letter] ?? letter}: ${TAJWEED_RULES[b.rule].label}`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSel({ letter, rule: b.rule });
                          }
                        }}
                      >
                        <circle cx={lPos.x} cy={lPos.y} r={active ? 14 : 11} fill={active ? color : 'var(--card)'} stroke={color} strokeWidth="1.6" style={{ transition: 'all 200ms ease-out' }} />
                        <text x={lPos.x} y={lPos.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill={active ? '#fff' : 'var(--fg)'}>
                          {letter}
                        </text>
                      </g>
                    </g>
                  );
                })}
                <circle cx={rPos.x} cy={rPos.y} r="27" fill="var(--card)" stroke={color} strokeWidth="2.2" />
                <text x={rPos.x} y={rPos.y - 2} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={color}>
                  {TAJWEED_RULES[b.rule].label.split(' ')[0]}
                </text>
                <text x={rPos.x} y={rPos.y + 11} textAnchor="middle" fontSize="9" fill="var(--muted)">
                  {TAJWEED_RULES[b.rule].arabic}
                </text>
              </g>
            );
          })}
          <circle cx={CENTER.x} cy={CENTER.y} r="32" fill="var(--primary)" />
          <text x={CENTER.x} y={CENTER.y + 3} textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff">نْ</text>
          <text x={CENTER.x} y={CENTER.y + 17} textAnchor="middle" fontSize="8" fontWeight="700" fill="rgba(255,255,255,0.8)">
            silent noon
          </text>
        </svg>
      </Card>

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
            Zone: {LETTER_ZONES[sel.letter] ?? '—'} · {selRule.desc}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {MAKHARIJ_ZONES.map((z) => (
          <Card key={z.zone} hover className="p-3">
            <p className="text-xs font-extrabold" style={{ color: ZONE_COLORS[z.zone] }}>
              {z.zone} <span className="arabic text-sm text-[var(--muted)]">{z.arabic}</span>
            </p>
            <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">{z.note}</p>
            <p className="arabic mt-2 text-base leading-7 text-[var(--fg)]">
              {Object.entries(LETTER_ZONES)
                .filter(([, zone]) => zone === z.zone)
                .map(([letter]) => letter)
                .join(' ') || 'ن م'}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
