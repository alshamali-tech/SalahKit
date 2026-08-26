import { useMemo } from 'react';
import { analyzeTajweed, TAJWEED_RULES } from '../../lib/core/tajweed';
import type { TajweedRuleId } from '../../lib/core/tajweed';

export interface TajweedTextProps {
  /** Arabic text with diacritics. */
  text: string;
  /** Render plain text when false (overlay off). */
  enabled?: boolean;
  /** When set, dims all segments of other rules. */
  focus?: TajweedRuleId | null;
  /** Extra classes for the wrapper span. */
  className?: string;
}

/**
 * Renders Arabic text with live tajweed coloring, exactly like a
 * color-coded mushaf: articulation rules recolour the GLYPHS themselves
 * (never boxes or bold — those break Arabic letter-joining), while madd
 * and waqf get a soft underline. Hovering names the rule.
 * @param props - text/enabled/focus/className.
 * @returns The annotated inline element.
 */
export function TajweedText({
  text,
  enabled = true,
  focus = null,
  className = '',
}: TajweedTextProps): JSX.Element {
  const segments = useMemo(() => (enabled ? analyzeTajweed(text) : []), [text, enabled]);

  if (!enabled || segments.length === 0) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (!seg.rule) return <span key={i}>{seg.text}</span>;
        const rule = TAJWEED_RULES[seg.rule];
        const dimmed = focus !== null && focus !== seg.rule;
        // Madd and waqf are durations/stops, so they take underlines
        // (wavy = natural 2 counts, thick solid = caused 4–6); every
        // articulation rule simply recolors the glyphs so Arabic
        // letter-joining stays perfectly intact.
        const underlined = seg.rule === 'madd' || seg.rule === 'madd-caused' || seg.rule === 'waqf';
        const style = underlined
          ? {
              textDecorationLine: 'underline' as const,
              textDecorationStyle: (seg.rule === 'madd' ? 'wavy' : 'solid') as 'wavy' | 'solid',
              textDecorationColor: rule.color,
              textDecorationThickness: seg.rule === 'madd-caused' ? '0.16em' : '0.1em',
              textUnderlineOffset: '0.24em',
              color: rule.color,
              opacity: dimmed ? 0.25 : 1,
            }
          : {
              color: rule.color,
              opacity: dimmed ? 0.25 : 1,
            };
        return (
          <span
            key={i}
            title={`${rule.label} (${rule.arabic}) — ${rule.desc}`}
            className="transition-opacity duration-200 ease-out"
            style={style}
          >
            {seg.text}
          </span>
        );
      })}
    </span>
  );
}
