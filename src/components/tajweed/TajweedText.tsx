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
 * Renders Arabic with live tajweed colouring driven by the rule table.
 * Articulation rules recolor the glyphs themselves (never bold/box, so
 * Arabic letter-joining survives). Madd & waqf take underlines — wavy
 * for the natural 2-harakah stretch, solid for the longer caused madds.
 * Hovering any marked letter names the rule, its Arabic term and how
 * many harakahs to hold it.
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
        const hold = rule.duration ? ` · hold ${rule.duration} harakah${rule.duration > 1 ? 's' : ''}` : '';
        const isUnderline = rule.style !== 'color';
        return (
          <span
            key={i}
            title={`${rule.label} (${rule.arabic}) — ${rule.desc}${hold}`}
            className="transition-opacity duration-200 ease-out"
            style={{
              color: rule.color,
              textDecorationLine: isUnderline ? 'underline' : 'none',
              textDecorationStyle: rule.style === 'underline-wavy' ? 'wavy' : 'solid',
              textDecorationThickness: rule.duration && rule.duration >= 4 ? 3 : 2,
              textDecorationColor: rule.color,
              textUnderlineOffset: 5,
              opacity: dimmed ? 0.18 : 1,
            }}
          >
            {seg.text}
          </span>
        );
      })}
    </span>
  );
}
