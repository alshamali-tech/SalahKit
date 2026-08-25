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
 * Renders Arabic text with live tajweed coloring. Each detected rule
 * gets its color, a tinted background and a hover tooltip naming the
 * rule — the same overlay used by the Quran Reader and Hifz Trainer.
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

  if (!enabled) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (!seg.rule) return <span key={i}>{seg.text}</span>;
        const rule = TAJWEED_RULES[seg.rule];
        const dimmed = focus !== null && focus !== seg.rule;
        return (
          <span
            key={i}
            title={`${rule.label} (${rule.arabic}) — ${rule.desc}`}
            className="transition-opacity duration-200 ease-out"
            style={{
              color: rule.color,
              fontWeight: 700,
              background: `color-mix(in srgb, ${rule.color} 13%, transparent)`,
              borderRadius: 4,
              opacity: dimmed ? 0.22 : 1,
            }}
          >
            {seg.text}
          </span>
        );
      })}
    </span>
  );
}
