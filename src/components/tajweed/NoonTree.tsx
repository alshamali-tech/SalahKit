import { useState } from 'react';
import { NOON_TREE_BRANCHES } from '../../lib/core/tajweed-data';
import { TAJWEED_RULES } from '../../lib/core/tajweed';
import type { TajweedRuleId } from '../../lib/core/tajweed';
import { TajweedText } from './TajweedText';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const ROOT = { x: 320, y: 42 };
const BRANCH_Y = 132;
const BRANCH_XS = [64, 192, 320, 448, 576];

/**
 * The Noon Tree (Tree of Thoughts): one silent noon enters at the
 * root and the next letter routes it down exactly one of five
 * branches. Tap any branch to inspect its letters and an example.
 * @returns The rendered interactive tree + detail panel.
 */
export function NoonTree(): JSX.Element {
  const [selected, setSelected] = useState<TajweedRuleId>('ikhfaa');
  const branch = NOON_TREE_BRANCHES.find((b) => b.rule === selected) ?? NOON_TREE_BRANCHES[0];
  const rule = TAJWEED_RULES[branch.rule];

  return (
    <div className="space-y-4">
      <Card className="overflow-x-auto">
        <svg viewBox="0 0 640 218" className="w-full min-w-[560px]" role="group" aria-label="Noon sakinah decision tree">
          {NOON_TREE_BRANCHES.map((b, i) => {
            const x = BRANCH_XS[i] ?? 0;
            const active = b.rule === selected;
            const color = TAJWEED_RULES[b.rule].color;
            return (
              <g key={b.rule}>
                <path
                  d={`M${ROOT.x},${ROOT.y + 16} C${ROOT.x},${BRANCH_Y - 46} ${x},${BRANCH_Y - 46} ${x},${BRANCH_Y - 24}`}
                  fill="none"
                  stroke={active ? color : 'var(--border)'}
                  strokeWidth={active ? 2.5 : 1.5}
                  style={{ transition: 'stroke 200ms ease-out' }}
                />
                {active ? (
                  <circle cx={x} cy={BRANCH_Y - 52} r="3" fill={color}>
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                ) : null}
              </g>
            );
          })}

          <g>
            <rect x={ROOT.x - 78} y={ROOT.y - 18} width="156" height="36" rx="18" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
            <text x={ROOT.x} y={ROOT.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--fg)">
              نْ / تنوين
            </text>
          </g>

          {NOON_TREE_BRANCHES.map((b, i) => {
            const x = BRANCH_XS[i] ?? 0;
            const active = b.rule === selected;
            const r = TAJWEED_RULES[b.rule];
            return (
              <g
                key={b.rule}
                onClick={() => setSelected(b.rule)}
                className="cursor-pointer focus-visible:outline-2"
                role="button"
                aria-label={`${r.label} branch`}
                aria-pressed={active}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(b.rule);
                  }
                }}
              >
                <rect
                  x={x - 58}
                  y={BRANCH_Y - 24}
                  width="116"
                  height="48"
                  rx="12"
                  fill={active ? r.color : 'var(--card)'}
                  stroke={r.color}
                  strokeWidth={active ? 0 : 1.8}
                  style={{ transition: 'fill 200ms ease-out, transform 200ms ease-out' }}
                />
                <text x={x} y={BRANCH_Y - 4} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={active ? '#fff' : 'var(--fg)'}>
                  {r.label}
                </text>
                <text x={x} y={BRANCH_Y + 12} textAnchor="middle" fontSize="10" fontWeight="700" fill={active ? 'rgba(255,255,255,0.85)' : 'var(--muted)'}>
                  {b.letters.length} {b.letters.length === 1 ? 'letter' : 'letters'}
                </text>
                <text x={x} y={BRANCH_Y + 34} textAnchor="middle" fontSize="11" fill="var(--muted)" letterSpacing="1">
                  {b.letters.length > 8 ? `${b.letters.slice(0, 7).join(' ')}…` : b.letters.join(' ')}
                </text>
              </g>
            );
          })}
        </svg>
      </Card>

      <Card key={branch.rule} className="animate-[fadeIn_220ms_ease-out] border-l-4" style={{ borderLeftColor: rule.color }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-extrabold text-[var(--fg)]">
            {rule.label} <span className="arabic text-lg text-[var(--muted)] mr-1">{rule.arabic}</span>
          </h3>
          <Badge tone="neutral">{branch.condition}</Badge>
        </div>
        <p className="mt-1.5 text-sm text-[var(--muted)]">{rule.desc}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {branch.letters.map((l) => (
            <span
              key={l}
              className="arabic inline-flex h-9 w-9 items-center justify-center rounded-lg border text-lg leading-none"
              style={{ borderColor: `color-mix(in srgb, ${rule.color} 45%, transparent)`, background: `color-mix(in srgb, ${rule.color} 10%, transparent)`, color: rule.color }}
            >
              {l}
            </span>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--field)] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Example — hover the colored text</p>
          <p className="arabic text-2xl text-[var(--fg)] text-right">
            <TajweedText text={branch.example} focus={branch.rule} />
          </p>
        </div>
      </Card>
    </div>
  );
}
